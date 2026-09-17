const API_VERSION = "3.1.1";
const COOKIE_NAME = "umroh_session";
const DEFAULT_SESSION_AGE = 60 * 60 * 24 * 7;
const PASSWORD_ITERATIONS = 100000;
const MAX_JSON_BYTES = 16 * 1024;

export default {
  async fetch(request, env) {
    try {
      if (request.method === "OPTIONS") {
        return corsPreflight(request, env);
      }

      const url = new URL(request.url);
      const path = normalizePath(url.pathname);

      if (request.method === "GET" && path === "/health") {
        const db = await env.DB.prepare("SELECT 1 AS ok").first();
        return json(request, env, {
          ok: db?.ok === 1,
          service: "umroh-auth-api",
          version: API_VERSION,
        });
      }

      if (request.method === "POST" && path === "/bootstrap/super-admin") {
        return bootstrapSuperAdmin(request, env);
      }

      if (request.method === "POST" && path === "/auth/activate") {
        return activateAccount(request, env);
      }

      if (request.method === "POST" && path === "/auth/login") {
        return login(request, env);
      }

      if (request.method === "POST" && path === "/auth/logout") {
        return logout(request, env);
      }

      if (request.method === "GET" && path === "/auth/me") {
        return me(request, env);
      }

      return json(request, env, { ok: false, error: "not_found" }, 404);
    } catch (error) {
      console.error("Unhandled error", error);
      return json(request, env, { ok: false, error: "internal_error" }, 500);
    }
  },
};

async function bootstrapSuperAdmin(request, env) {
  requireSecrets(env);

  if (env.ENABLE_BOOTSTRAP !== "1") {
    return json(request, env, { ok: false, error: "bootstrap_disabled" }, 403);
  }

  const supplied = request.headers.get("X-Bootstrap-Token") || "";
  if (!supplied || !env.BOOTSTRAP_TOKEN || !constantTimeStringEqual(supplied, env.BOOTSTRAP_TOKEN)) {
    return json(request, env, { ok: false, error: "forbidden" }, 403);
  }

  const existing = await env.DB.prepare(
    "SELECT COUNT(*) AS total FROM umroh_accounts WHERE role = 'super_admin'"
  ).first();

  if (Number(existing?.total || 0) > 0) {
    return json(request, env, { ok: false, error: "super_admin_already_exists" }, 409);
  }

  const body = await readJson(request);
  const username = normalizeUsername(body.username);
  const email = normalizeEmail(body.email || "");
  const password = String(body.password || "");

  if (!isValidUsername(username)) {
    return json(request, env, { ok: false, error: "invalid_username" }, 400);
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    return json(request, env, { ok: false, error: passwordError }, 400);
  }

  const passwordHash = await hashPassword(password, env.AUTH_PEPPER);
  const accountUuid = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(`
    INSERT INTO umroh_accounts
      (account_uuid, role, username, email, password_hash, account_status,
       password_changed_at, created_at, updated_at)
    VALUES (?, 'super_admin', ?, ?, ?, 'active', ?, ?, ?)
  `).bind(
    accountUuid,
    username,
    email || null,
    passwordHash,
    now,
    now,
    now
  ).run();

  return json(request, env, {
    ok: true,
    account: {
      account_uuid: accountUuid,
      role: "super_admin",
      username,
      email: email || null,
    },
    next: "Set ENABLE_BOOTSTRAP=0 and remove BOOTSTRAP_TOKEN after verification.",
  }, 201);
}

async function activateAccount(request, env) {
  requireSecrets(env);
  const body = await readJson(request);
  const identifier = String(body.identifier || "").trim();
  const activationCode = String(body.activation_code || "").trim();
  const newPassword = String(body.new_password || "");

  if (!identifier || !activationCode) {
    return json(request, env, { ok: false, error: "invalid_request" }, 400);
  }
  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return json(request, env, { ok: false, error: passwordError }, 400);
  }

  const account = await findAccountByIdentifier(env.DB, identifier);
  if (!account || account.account_status !== "pending_activation") {
    return json(request, env, { ok: false, error: "activation_failed" }, 400);
  }

  const codeRow = await env.DB.prepare(`
    SELECT id, code_hash, expires_at, used_at, failed_attempts
    FROM umroh_activation_codes
    WHERE account_id = ? AND used_at IS NULL
    ORDER BY id DESC
    LIMIT 1
  `).bind(account.id).first();

  if (!codeRow || new Date(codeRow.expires_at).getTime() <= Date.now()) {
    return json(request, env, { ok: false, error: "activation_failed" }, 400);
  }

  if (Number(codeRow.failed_attempts || 0) >= 5) {
    return json(request, env, { ok: false, error: "activation_locked" }, 429);
  }

  const expected = await hashActivationCode(
    activationCode,
    account.account_uuid,
    env.AUTH_PEPPER
  );

  if (!constantTimeStringEqual(expected, codeRow.code_hash)) {
    await env.DB.prepare(`
      UPDATE umroh_activation_codes
      SET failed_attempts = failed_attempts + 1
      WHERE id = ?
    `).bind(codeRow.id).run();

    return json(request, env, { ok: false, error: "activation_failed" }, 400);
  }

  const now = new Date().toISOString();
  const passwordHash = await hashPassword(newPassword, env.AUTH_PEPPER);
  const session = await createSessionMaterial(env);
  const userAgent = truncate(request.headers.get("User-Agent") || "", 500);

  await env.DB.batch([
    env.DB.prepare(`
      UPDATE umroh_accounts
      SET password_hash = ?, account_status = 'active',
          password_changed_at = ?, updated_at = ?
      WHERE id = ?
    `).bind(passwordHash, now, now, account.id),
    env.DB.prepare(`
      UPDATE umroh_activation_codes
      SET used_at = ?
      WHERE id = ?
    `).bind(now, codeRow.id),
    env.DB.prepare(`
      INSERT INTO umroh_sessions
        (account_id, token_hash, expires_at, last_seen_at, user_agent, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      account.id,
      session.tokenHash,
      session.expiresAt,
      now,
      userAgent || null,
      now
    ),
  ]);

  return json(request, env, {
    ok: true,
    account: publicAccount(account),
  }, 200, {
    "Set-Cookie": sessionCookie(session.rawToken, env),
  });
}

async function login(request, env) {
  requireSecrets(env);
  const body = await readJson(request);
  const identifier = String(body.identifier || "").trim();
  const password = String(body.password || "");

  if (!identifier || !password) {
    return json(request, env, { ok: false, error: "invalid_credentials" }, 401);
  }

  const account = await findAccountByIdentifier(env.DB, identifier);

  if (
    !account ||
    account.account_status !== "active" ||
    !account.password_hash ||
    !(await verifyPassword(password, account.password_hash, env.AUTH_PEPPER))
  ) {
    return json(request, env, { ok: false, error: "invalid_credentials" }, 401);
  }

  const now = new Date().toISOString();
  const session = await createSessionMaterial(env);
  const userAgent = truncate(request.headers.get("User-Agent") || "", 500);

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO umroh_sessions
        (account_id, token_hash, expires_at, last_seen_at, user_agent, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      account.id,
      session.tokenHash,
      session.expiresAt,
      now,
      userAgent || null,
      now
    ),
    env.DB.prepare(`
      UPDATE umroh_accounts
      SET last_login_at = ?, updated_at = ?
      WHERE id = ?
    `).bind(now, now, account.id),
  ]);

  return json(request, env, {
    ok: true,
    account: publicAccount(account),
  }, 200, {
    "Set-Cookie": sessionCookie(session.rawToken, env),
  });
}

async function logout(request, env) {
  requireSecrets(env);
  const token = getCookie(request, COOKIE_NAME);

  if (token) {
    const tokenHash = await sha256Base64Url(token);
    const now = new Date().toISOString();
    await env.DB.prepare(`
      UPDATE umroh_sessions
      SET revoked_at = ?
      WHERE token_hash = ? AND revoked_at IS NULL
    `).bind(now, tokenHash).run();
  }

  return json(request, env, { ok: true }, 200, {
    "Set-Cookie": clearSessionCookie(),
  });
}

async function me(request, env) {
  requireSecrets(env);
  const auth = await authenticatedAccount(request, env);

  if (!auth) {
    return json(request, env, { ok: false, error: "unauthorized" }, 401);
  }

  return json(request, env, {
    ok: true,
    account: publicAccount(auth),
  });
}

async function authenticatedAccount(request, env) {
  const token = getCookie(request, COOKIE_NAME);
  if (!token) return null;

  const tokenHash = await sha256Base64Url(token);
  const now = new Date().toISOString();

  const row = await env.DB.prepare(`
    SELECT
      a.id, a.account_uuid, a.role, a.username, a.member_no, a.email, a.whatsapp,
      a.account_status, p.full_name, p.group_name, p.departure_batch,
      s.id AS session_id
    FROM umroh_sessions s
    JOIN umroh_accounts a ON a.id = s.account_id
    LEFT JOIN umroh_jamaah_profiles p ON p.account_id = a.id
    WHERE s.token_hash = ?
      AND s.revoked_at IS NULL
      AND s.expires_at > ?
      AND a.account_status = 'active'
    LIMIT 1
  `).bind(tokenHash, now).first();

  if (!row) return null;

  await env.DB.prepare(`
    UPDATE umroh_sessions SET last_seen_at = ? WHERE id = ?
  `).bind(now, row.session_id).run();

  return row;
}

async function findAccountByIdentifier(db, identifier) {
  const raw = identifier.trim();
  const username = normalizeUsername(raw);
  const email = normalizeEmail(raw);
  const phone = normalizePhone(raw);

  return db.prepare(`
    SELECT
      a.id, a.account_uuid, a.role, a.username, a.member_no, a.email, a.whatsapp,
      a.password_hash, a.account_status,
      p.full_name, p.group_name, p.departure_batch
    FROM umroh_accounts a
    LEFT JOIN umroh_jamaah_profiles p ON p.account_id = a.id
    WHERE a.username = ?
       OR a.member_no = ?
       OR lower(a.email) = ?
       OR a.whatsapp = ?
    LIMIT 1
  `).bind(username, raw, email, phone).first();
}

function publicAccount(account) {
  return {
    account_uuid: account.account_uuid,
    role: account.role,
    username: account.username || null,
    member_no: account.member_no || null,
    email: account.email || null,
    whatsapp: account.whatsapp || null,
    full_name: account.full_name || null,
    group_name: account.group_name || null,
    departure_batch: account.departure_batch || null,
  };
}

async function createSessionMaterial(env) {
  const rawToken = randomBase64Url(32);
  const tokenHash = await sha256Base64Url(rawToken);
  const age = sessionAge(env);
  const expiresAt = new Date(Date.now() + age * 1000).toISOString();
  return { rawToken, tokenHash, expiresAt };
}

function sessionCookie(token, env) {
  const age = sessionAge(env);
  return [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    `Max-Age=${age}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
  ].join("; ");
}

function clearSessionCookie() {
  return [
    `${COOKIE_NAME}=`,
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
  ].join("; ");
}

function sessionAge(env) {
  const value = Number(env.SESSION_MAX_AGE_SECONDS || DEFAULT_SESSION_AGE);
  if (!Number.isFinite(value) || value < 900 || value > 60 * 60 * 24 * 30) {
    return DEFAULT_SESSION_AGE;
  }
  return Math.floor(value);
}

async function hashPassword(password, pepper) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const material = await passwordMaterial(password, pepper);
  const key = await crypto.subtle.importKey("raw", material, "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PASSWORD_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    256
  );

  return [
    "pbkdf2-sha256",
    PASSWORD_ITERATIONS,
    bytesToBase64Url(salt),
    bytesToBase64Url(new Uint8Array(bits)),
  ].join("$");
}

async function verifyPassword(password, stored, pepper) {
  const parts = String(stored || "").split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2-sha256") return false;

  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 100000 || iterations > 2000000) {
    return false;
  }

  const salt = base64UrlToBytes(parts[2]);
  const expected = base64UrlToBytes(parts[3]);
  const material = await passwordMaterial(password, pepper);
  const key = await crypto.subtle.importKey("raw", material, "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    key,
    expected.byteLength * 8
  );

  return constantTimeBytesEqual(new Uint8Array(bits), expected);
}

async function passwordMaterial(password, pepper) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pepper),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`password-v1\0${password}`)
  );
}

async function hashActivationCode(code, accountUuid, pepper) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pepper),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`activation-v1\0${accountUuid}\0${code}`)
  );
  return bytesToBase64Url(new Uint8Array(sig));
}

async function sha256Base64Url(value) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  );
  return bytesToBase64Url(new Uint8Array(digest));
}

function randomBase64Url(byteLength) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return bytesToBase64Url(bytes);
}

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/")
    + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function constantTimeBytesEqual(a, b) {
  if (a.byteLength !== b.byteLength) return false;
  let diff = 0;
  for (let i = 0; i < a.byteLength; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function constantTimeStringEqual(a, b) {
  const aa = new TextEncoder().encode(String(a));
  const bb = new TextEncoder().encode(String(b));
  return constantTimeBytesEqual(aa, bb);
}

function validatePassword(password) {
  if (password.length < 10) return "password_too_short";
  if (password.length > 128) return "password_too_long";
  return null;
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizePhone(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const plus = raw.startsWith("+") ? "+" : "";
  return plus + raw.replace(/\D/g, "");
}

function isValidUsername(value) {
  return /^[a-z0-9._-]{4,32}$/.test(value);
}

function getCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  for (const part of cookie.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    if (key === name) return part.slice(index + 1).trim();
  }
  return "";
}

async function readJson(request) {
  const length = Number(request.headers.get("Content-Length") || 0);
  if (length > MAX_JSON_BYTES) throw new Error("request_too_large");

  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error("json_required");
  }
  return request.json();
}

function requireSecrets(env) {
  if (!env.DB) throw new Error("missing_db_binding");
  if (!env.AUTH_PEPPER || String(env.AUTH_PEPPER).length < 32) {
    throw new Error("missing_auth_pepper");
  }
}

function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function truncate(value, max) {
  return value.length > max ? value.slice(0, max) : value;
}

function allowedOrigin(request, env) {
  const configured = String(env.ALLOWED_ORIGIN || "https://srilexbuditra.work");
  const origin = request.headers.get("Origin");
  return origin && origin === configured ? origin : "";
}

function corsPreflight(request, env) {
  const origin = allowedOrigin(request, env);
  if (!origin) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type, X-Bootstrap-Token",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Max-Age": "600",
      "Vary": "Origin",
    },
  });
}

function json(request, env, payload, status = 200, extraHeaders = {}) {
  const headers = new Headers(extraHeaders);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");

  const origin = allowedOrigin(request, env);
  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Vary", "Origin");
  }

  return new Response(JSON.stringify(payload), { status, headers });
}
