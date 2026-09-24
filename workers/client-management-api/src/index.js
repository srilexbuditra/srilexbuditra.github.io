const COOKIE_NAME = "__Host-sb_session";
const PASSWORD_ITERATIONS = 100000;
const SESSION_HOURS_DEFAULT = 8;
const encoder = new TextEncoder();

export default {
  async fetch(request, env) {
    try {
      if (!env.DB) return apiResponse(request, env, { error: "Database binding DB is missing." }, 500);

      const url = new URL(request.url);
      const method = request.method.toUpperCase();

      if (method === "OPTIONS") {
        return preflightResponse(request, env);
      }

      if (url.pathname === "/api/health" && method === "GET") {
        return apiResponse(request, env, {
          ok: true,
          service: "srilexbuditra-client-management-api-r1",
          version: "R1"
        });
      }

      if (isStateChanging(method)) {
        const originCheck = ensureTrustedOrigin(request, env);
        if (originCheck) return originCheck;

        const isDocumentUpload =
          url.pathname === "/api/admin/documents" &&
          method === "POST";

        if (!isDocumentUpload) {
          const contentCheck = ensureJsonRequest(request, env);
          if (contentCheck) return contentCheck;
        }
      }

      if (url.pathname === "/api/internal/bootstrap-admin" && method === "POST") {
        return bootstrapAdmin(request, env);
      }

      if (url.pathname === "/api/auth/login" && method === "POST") {
        return login(request, env);
      }

      if (url.pathname === "/api/auth/logout" && method === "POST") {
        return logout(request, env);
      }

      if (url.pathname === "/api/auth/me" && method === "GET") {
        const auth = await requireAuth(request, env);
        if (auth.response) return auth.response;
        return apiResponse(request, env, {
          user: publicUser(auth.user)
        });
      }

      if (url.pathname === "/api/auth/change-password" && method === "POST") {
        const auth = await requireAuth(request, env);
        if (auth.response) return auth.response;
        return changePassword(request, env, auth);
      }

      if (url.pathname === "/api/admin/clients" && method === "GET") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;
        return listClients(request, env);
      }

      if (url.pathname === "/api/admin/clients" && method === "POST") {
        const auth = await requireRole(request, env, ["system_admin"]);
        if (auth.response) return auth.response;
        return createClient(request, env, auth);
      }

      if (url.pathname === "/api/admin/projects" && method === "GET") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;
        return listAdminProjects(request, env);
      }

      if (url.pathname === "/api/admin/projects" && method === "POST") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;
        return createProject(request, env, auth);
      }

      const adminProjectMatch = url.pathname.match(/^\/api\/admin\/projects\/([^/]+)$/);
      if (adminProjectMatch && method === "PATCH") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;
        return updateProject(request, env, auth, decodeURIComponent(adminProjectMatch[1]));
      }

      // ======================================================
      // SUPPORT R1 - ADMIN
      // ======================================================

      if (url.pathname === "/api/admin/support" && method === "GET") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;
        return listAdminSupportTickets(request, env);
      }

      const adminSupportMessageMatch =
        url.pathname.match(/^\/api\/admin\/support\/([^/]+)\/messages$/);

      if (adminSupportMessageMatch && method === "POST") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;

        return addAdminSupportMessage(
          request,
          env,
          auth,
          decodeURIComponent(adminSupportMessageMatch[1])
        );
      }

      const adminSupportMatch =
        url.pathname.match(/^\/api\/admin\/support\/([^/]+)$/);

      if (adminSupportMatch && method === "GET") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;

        return getAdminSupportTicket(
          request,
          env,
          decodeURIComponent(adminSupportMatch[1])
        );
      }

      if (adminSupportMatch && method === "PATCH") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;

        return updateAdminSupportTicket(
          request,
          env,
          auth,
          decodeURIComponent(adminSupportMatch[1])
        );
      }

      // ======================================================
      // SUPPORT R1 - CLIENT
      // ======================================================

      if (url.pathname === "/api/client/support" && method === "GET") {
        const auth = await requireRole(request, env, ["client"]);
        if (auth.response) return auth.response;
        return listClientSupportTickets(request, env, auth);
      }

      if (url.pathname === "/api/client/support" && method === "POST") {
        const auth = await requireRole(request, env, ["client"]);
        if (auth.response) return auth.response;
        return createClientSupportTicket(request, env, auth);
      }

      const clientSupportMessageMatch =
        url.pathname.match(/^\/api\/client\/support\/([^/]+)\/messages$/);

      if (clientSupportMessageMatch && method === "POST") {
        const auth = await requireRole(request, env, ["client"]);
        if (auth.response) return auth.response;

        return addClientSupportMessage(
          request,
          env,
          auth,
          decodeURIComponent(clientSupportMessageMatch[1])
        );
      }

      const clientSupportMatch =
        url.pathname.match(/^\/api\/client\/support\/([^/]+)$/);

      if (clientSupportMatch && method === "GET") {
        const auth = await requireRole(request, env, ["client"]);
        if (auth.response) return auth.response;

        return getClientSupportTicket(
          request,
          env,
          auth,
          decodeURIComponent(clientSupportMatch[1])
        );
      }
      if (url.pathname === "/api/admin/estimates" && method === "GET") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;
        return listAdminEstimates(request, env);
      }

      if (url.pathname === "/api/admin/estimates" && method === "POST") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;
        return createAdminEstimate(request, env, auth);
      }

      const adminEstimateMatch =
        url.pathname.match(/^\/api\/admin\/estimates\/([^/]+)$/);

      if (adminEstimateMatch && method === "GET") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;

        return getAdminEstimate(
          request,
          env,
          decodeURIComponent(adminEstimateMatch[1])
        );
      }

      if (adminEstimateMatch && method === "PATCH") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;

        return updateAdminEstimate(
          request,
          env,
          auth,
          decodeURIComponent(adminEstimateMatch[1])
        );
      }

      const adminEstimateConvertMatch =
        url.pathname.match(/^\/api\/admin\/estimates\/([^/]+)\/convert-to-invoice$/);

      if (adminEstimateConvertMatch && method === "POST") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;

        return convertEstimateToInvoice(
          request,
          env,
          auth,
          decodeURIComponent(adminEstimateConvertMatch[1])
        );
      }

      if (url.pathname === "/api/client/estimates" && method === "GET") {
        const auth = await requireRole(request, env, ["client"]);
        if (auth.response) return auth.response;
        return listClientEstimates(request, env, auth);
      }

      const clientEstimateMatch =
        url.pathname.match(/^\/api\/client\/estimates\/([^/]+)$/);

      if (clientEstimateMatch && method === "GET") {
        const auth = await requireRole(request, env, ["client"]);
        if (auth.response) return auth.response;

        return getClientEstimate(
          request,
          env,
          auth,
          decodeURIComponent(clientEstimateMatch[1])
        );
      }

      const clientEstimateDecisionMatch =
        url.pathname.match(/^\/api\/client\/estimates\/([^/]+)\/decision$/);

      if (clientEstimateDecisionMatch && method === "POST") {
        const auth = await requireRole(request, env, ["client"]);
        if (auth.response) return auth.response;

        return decideClientEstimate(
          request,
          env,
          auth,
          decodeURIComponent(clientEstimateDecisionMatch[1])
        );
      }
      if (url.pathname === "/api/admin/invoices" && method === "GET") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;
        return listAdminInvoices(request, env);
      }

      if (url.pathname === "/api/admin/invoices" && method === "POST") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;
        return createAdminInvoice(request, env, auth);
      }

      const adminInvoiceMatch =
        url.pathname.match(/^\/api\/admin\/invoices\/([^/]+)$/);

      if (adminInvoiceMatch && method === "GET") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;

        return getAdminInvoice(
          request,
          env,
          decodeURIComponent(adminInvoiceMatch[1])
        );
      }

      if (adminInvoiceMatch && method === "PATCH") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;

        return updateAdminInvoice(
          request,
          env,
          auth,
          decodeURIComponent(adminInvoiceMatch[1])
        );
      }

      if (url.pathname === "/api/client/invoices" && method === "GET") {
        const auth = await requireRole(request, env, ["client"]);
        if (auth.response) return auth.response;
        return listClientInvoices(request, env, auth);
      }

      const clientInvoiceMatch =
        url.pathname.match(/^\/api\/client\/invoices\/([^/]+)$/);

      if (clientInvoiceMatch && method === "GET") {
        const auth = await requireRole(request, env, ["client"]);
        if (auth.response) return auth.response;

        return getClientInvoice(
          request,
          env,
          auth,
          decodeURIComponent(clientInvoiceMatch[1])
        );
      }
      if (url.pathname === "/api/admin/documents" && method === "GET") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;
        return listAdminDocuments(request, env);
      }

      if (url.pathname === "/api/admin/documents" && method === "POST") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;
        return uploadAdminDocument(request, env, auth);
      }

      const adminDocumentDownloadMatch =
        url.pathname.match(/^\/api\/admin\/documents\/([^/]+)\/download$/);

      if (adminDocumentDownloadMatch && method === "GET") {
        const auth = await requireRole(request, env, ["system_admin", "staff"]);
        if (auth.response) return auth.response;

        return downloadAdminDocument(
          request,
          env,
          auth,
          decodeURIComponent(adminDocumentDownloadMatch[1])
        );
      }

      if (url.pathname === "/api/client/documents" && method === "GET") {
        const auth = await requireRole(request, env, ["client"]);
        if (auth.response) return auth.response;
        return listClientDocuments(request, env, auth);
      }

      const clientDocumentDownloadMatch =
        url.pathname.match(/^\/api\/client\/documents\/([^/]+)\/download$/);

      if (clientDocumentDownloadMatch && method === "GET") {
        const auth = await requireRole(request, env, ["client"]);
        if (auth.response) return auth.response;

        return downloadClientDocument(
          request,
          env,
          auth,
          decodeURIComponent(clientDocumentDownloadMatch[1])
        );
      }
      if (url.pathname === "/api/client/projects" && method === "GET") {
        const auth = await requireRole(request, env, ["client"]);
        if (auth.response) return auth.response;
        return listClientProjects(request, env, auth);
      }

      const clientProjectMatch = url.pathname.match(/^\/api\/client\/projects\/([^/]+)$/);
      if (clientProjectMatch && method === "GET") {
        const auth = await requireRole(request, env, ["client"]);
        if (auth.response) return auth.response;
        return getClientProject(request, env, auth, decodeURIComponent(clientProjectMatch[1]));
      }

      return apiResponse(request, env, { error: "Not found." }, 404);
    } catch (error) {
      console.error("Unhandled API error", error);
      return apiResponse(request, env, { error: "Internal server error." }, 500);
    }
  }
};

function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin");
  const allowed = allowedOrigins(env);
  const headers = new Headers({
    "Vary": "Origin",
    "Access-Control-Allow-Credentials": "true"
  });
  if (origin && allowed.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }
  return headers;
}

function securityHeaders() {
  return {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer"
  };
}

function apiResponse(request, env, body, status = 200, extraHeaders = {}) {
  const headers = corsHeaders(request, env);
  headers.set("Content-Type", "application/json; charset=utf-8");
  for (const [key, value] of Object.entries(securityHeaders())) headers.set(key, value);
  for (const [key, value] of Object.entries(extraHeaders)) headers.append(key, value);
  return new Response(JSON.stringify(body), { status, headers });
}

function preflightResponse(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin || !allowedOrigins(env).includes(origin)) {
    return new Response(null, { status: 403 });
  }
  const headers = corsHeaders(request, env);
  headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, X-Bootstrap-Secret");
  headers.set("Access-Control-Max-Age", "600");
  return new Response(null, { status: 204, headers });
}

function ensureTrustedOrigin(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin || !allowedOrigins(env).includes(origin)) {
    return apiResponse(request, env, { error: "Origin not allowed." }, 403);
  }
  return null;
}

function ensureJsonRequest(request, env) {
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return apiResponse(request, env, { error: "Content-Type must be application/json." }, 415);
  }
  return null;
}

function isStateChanging(method) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method);
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  if (typeof password !== "string") return "Password is required.";
  if (password.length < 12) return "Password must contain at least 12 characters.";
  if (password.length > 128) return "Password is too long.";
  return null;
}

function nowIso() {
  return new Date().toISOString();
}

function addHoursIso(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function sessionHours(env) {
  const parsed = Number(env.SESSION_HOURS || SESSION_HOURS_DEFAULT);
  return Number.isFinite(parsed) && parsed >= 1 && parsed <= 24 ? parsed : SESSION_HOURS_DEFAULT;
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    must_change_password: Boolean(user.must_change_password),
    client_id: user.client_id || null,
    client_code: user.client_code || null,
    full_name: user.full_name || null,
    company_name: user.company_name || null
  };
}

function base64UrlEncode(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hashPassword(password, saltBytes = null, iterations = PASSWORD_ITERATIONS) {
  const salt = saltBytes || crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    keyMaterial,
    256
  );
  return `pbkdf2_sha256$${iterations}$${base64UrlEncode(salt)}$${base64UrlEncode(new Uint8Array(bits))}`;
}

async function verifyPassword(password, encoded) {
  const parts = String(encoded || "").split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2_sha256") return false;
  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 100000 || iterations > PASSWORD_ITERATIONS) return false;
  let salt;
  let expected;
  try {
    salt = base64UrlDecode(parts[2]);
    expected = base64UrlDecode(parts[3]);
  } catch {
    return false;
  }
  const candidateEncoded = await hashPassword(password, salt, iterations);
  const candidate = base64UrlDecode(candidateEncoded.split("$")[3]);
  if (candidate.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i += 1) diff |= candidate[i] ^ expected[i];
  return diff === 0;
}

async function sha256Base64Url(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return base64UrlEncode(new Uint8Array(digest));
}

function randomToken() {
  return base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));
}

function parseCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  for (const part of cookie.split(";")) {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (rawKey === name) return rawValue.join("=");
  }
  return null;
}

function sessionCookie(token) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

async function writeActivity(env, userId, action, entityType = null, entityId = null, description = null) {
  await env.DB.prepare(
    `INSERT INTO activity_logs (id, user_id, action, entity_type, entity_id, description, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    crypto.randomUUID(),
    userId || null,
    action,
    entityType,
    entityId,
    description,
    nowIso()
  ).run();
}

async function bootstrapAdmin(request, env) {
  if (String(env.BOOTSTRAP_ENABLED || "false").toLowerCase() !== "true") {
    return apiResponse(request, env, { error: "Bootstrap is disabled." }, 404);
  }
  const supplied = request.headers.get("X-Bootstrap-Secret") || "";
  const expected = String(env.BOOTSTRAP_SECRET || "");
  if (!expected || supplied !== expected) {
    return apiResponse(request, env, { error: "Bootstrap authorization failed." }, 403);
  }

  const existing = await env.DB.prepare(
    `SELECT COUNT(*) AS total FROM users WHERE role = 'system_admin'`
  ).first();
  if (Number(existing?.total || 0) > 0) {
    return apiResponse(request, env, { error: "A system administrator already exists." }, 409);
  }

  const body = await readJson(request);
  const email = normalizeEmail(body?.email);
  const fullName = String(body?.full_name || "").trim();
  const password = body?.password;

  if (!validEmail(email) || !fullName) {
    return apiResponse(request, env, { error: "Valid email and full_name are required." }, 400);
  }
  const passwordError = validatePassword(password);
  if (passwordError) return apiResponse(request, env, { error: passwordError }, 400);

  const id = crypto.randomUUID();
  const timestamp = nowIso();
  const passwordHash = await hashPassword(password);

  await env.DB.prepare(
    `INSERT INTO users (id, email, password_hash, full_name, role, status, must_change_password, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'system_admin', 'active', 0, ?, ?)`
  ).bind(id, email, passwordHash, fullName, timestamp, timestamp).run();

  await writeActivity(env, id, "BOOTSTRAP_ADMIN_CREATED", "user", id, "Initial system administrator created.");
  return apiResponse(request, env, { ok: true, user: { id, email, full_name: fullName, role: "system_admin" } }, 201);
}

async function login(request, env) {
  const body = await readJson(request);
  const email = normalizeEmail(body?.email);
  const password = body?.password;

  if (!validEmail(email) || typeof password !== "string") {
    return apiResponse(request, env, { error: "Invalid email or password." }, 401);
  }

  const user = await env.DB.prepare(
    `SELECT
       u.id, u.email, u.password_hash, u.role, u.status, u.must_change_password,
       COALESCE(u.full_name, c.full_name) AS full_name,
       c.id AS client_id, c.client_code, c.company_name
     FROM users u
     LEFT JOIN clients c ON c.user_id = u.id
     WHERE u.email = ? LIMIT 1`
  ).bind(email).first();

  if (!user || user.status !== "active") {
    return apiResponse(request, env, { error: "Invalid email or password." }, 401);
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    await writeActivity(env, user.id, "LOGIN_FAILED", "user", user.id, "Invalid password.");
    return apiResponse(request, env, { error: "Invalid email or password." }, 401);
  }

  const token = randomToken();
  const tokenHash = await sha256Base64Url(token);
  const timestamp = nowIso();
  const expiresAt = addHoursIso(sessionHours(env));

  await env.DB.prepare(
    `INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at, last_seen_at, revoked_at)
     VALUES (?, ?, ?, ?, ?, ?, NULL)`
  ).bind(crypto.randomUUID(), user.id, tokenHash, timestamp, expiresAt, timestamp).run();

  await writeActivity(env, user.id, "LOGIN_SUCCESS", "user", user.id, "Session created.");

  return apiResponse(
    request,
    env,
    { ok: true, user: publicUser(user) },
    200,
    { "Set-Cookie": sessionCookie(token) }
  );
}

async function logout(request, env) {
  const token = parseCookie(request, COOKIE_NAME);
  if (token) {
    const tokenHash = await sha256Base64Url(token);
    const session = await env.DB.prepare(
      `SELECT id, user_id FROM sessions WHERE token_hash = ? AND revoked_at IS NULL LIMIT 1`
    ).bind(tokenHash).first();

    if (session) {
      await env.DB.prepare(
        `UPDATE sessions SET revoked_at = ? WHERE id = ?`
      ).bind(nowIso(), session.id).run();
      await writeActivity(env, session.user_id, "LOGOUT", "session", session.id, "Session revoked.");
    }
  }

  return apiResponse(
    request,
    env,
    { ok: true },
    200,
    { "Set-Cookie": clearSessionCookie() }
  );
}

async function requireAuth(request, env) {
  const token = parseCookie(request, COOKIE_NAME);
  if (!token) {
    return { response: apiResponse(request, env, { error: "Authentication required." }, 401) };
  }

  const tokenHash = await sha256Base64Url(token);
  const timestamp = nowIso();
  const user = await env.DB.prepare(
    `SELECT
       u.id, u.email, u.role, u.status, u.must_change_password,
       COALESCE(u.full_name, c.full_name) AS full_name,
       c.id AS client_id, c.client_code, c.company_name,
       s.id AS session_id, s.expires_at
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     LEFT JOIN clients c ON c.user_id = u.id
     WHERE s.token_hash = ?
       AND s.revoked_at IS NULL
       AND s.expires_at > ?
     LIMIT 1`
  ).bind(tokenHash, timestamp).first();

  if (!user || user.status !== "active") {
    return {
      response: apiResponse(
        request,
        env,
        { error: "Session is invalid or expired." },
        401,
        { "Set-Cookie": clearSessionCookie() }
      )
    };
  }

  await env.DB.prepare(
    `UPDATE sessions SET last_seen_at = ? WHERE id = ?`
  ).bind(timestamp, user.session_id).run();

  return { user, sessionId: user.session_id, tokenHash };
}

async function requireRole(request, env, allowedRoles) {
  const auth = await requireAuth(request, env);
  if (auth.response) return auth;
  if (!allowedRoles.includes(auth.user.role)) {
    return { response: apiResponse(request, env, { error: "Forbidden." }, 403) };
  }
  return auth;
}

async function changePassword(request, env, auth) {
  const body = await readJson(request);
  const currentPassword = body?.current_password;
  const newPassword = body?.new_password;
  const passwordError = validatePassword(newPassword);
  if (passwordError) return apiResponse(request, env, { error: passwordError }, 400);

  const row = await env.DB.prepare(
    `SELECT password_hash FROM users WHERE id = ? LIMIT 1`
  ).bind(auth.user.id).first();

  if (!row || !(await verifyPassword(currentPassword, row.password_hash))) {
    return apiResponse(request, env, { error: "Current password is incorrect." }, 400);
  }

  const newHash = await hashPassword(newPassword);
  const timestamp = nowIso();

  await env.DB.batch([
    env.DB.prepare(
      `UPDATE users SET password_hash = ?, must_change_password = 0, updated_at = ? WHERE id = ?`
    ).bind(newHash, timestamp, auth.user.id),
    env.DB.prepare(
      `UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND id <> ? AND revoked_at IS NULL`
    ).bind(timestamp, auth.user.id, auth.sessionId)
  ]);

  await writeActivity(env, auth.user.id, "PASSWORD_CHANGED", "user", auth.user.id, "Password changed and other sessions revoked.");
  return apiResponse(request, env, { ok: true });
}

async function listClients(request, env) {
  const rows = await env.DB.prepare(
    `SELECT
       c.id, c.client_code, c.full_name, c.company_name, c.phone, c.status,
       u.email, u.status AS account_status, u.must_change_password,
       c.created_at, c.updated_at
     FROM clients c
     JOIN users u ON u.id = c.user_id
     ORDER BY c.created_at DESC`
  ).all();

  return apiResponse(request, env, { clients: rows.results || [] });
}

async function createClient(request, env, auth) {
  const body = await readJson(request);
  const email = normalizeEmail(body?.email);
  const fullName = String(body?.full_name || "").trim();
  const companyName = String(body?.company_name || "").trim() || null;
  const phone = String(body?.phone || "").trim() || null;
  const temporaryPassword = body?.temporary_password;

  if (!validEmail(email) || !fullName) {
    return apiResponse(request, env, { error: "Valid email and full_name are required." }, 400);
  }
  const passwordError = validatePassword(temporaryPassword);
  if (passwordError) return apiResponse(request, env, { error: passwordError }, 400);

  const existing = await env.DB.prepare(
    `SELECT id FROM users WHERE email = ? LIMIT 1`
  ).bind(email).first();
  if (existing) return apiResponse(request, env, { error: "Email is already registered." }, 409);

  const userId = crypto.randomUUID();
  const clientId = crypto.randomUUID();
  const clientCode = `CL-${new Date().getUTCFullYear()}-${clientId.slice(0, 8).toUpperCase()}`;
  const passwordHash = await hashPassword(temporaryPassword);
  const timestamp = nowIso();

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO users (id, email, password_hash, role, status, must_change_password, created_at, updated_at)
       VALUES (?, ?, ?, 'client', 'active', 1, ?, ?)`
    ).bind(userId, email, passwordHash, timestamp, timestamp),
    env.DB.prepare(
      `INSERT INTO clients (id, user_id, client_code, full_name, company_name, phone, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)`
    ).bind(clientId, userId, clientCode, fullName, companyName, phone, timestamp, timestamp)
  ]);

  await writeActivity(env, auth.user.id, "CLIENT_CREATED", "client", clientId, `Client ${clientCode} created.`);
  return apiResponse(request, env, {
    ok: true,
    client: { id: clientId, client_code: clientCode, email, full_name: fullName, company_name: companyName }
  }, 201);
}

async function listAdminProjects(request, env) {
  const rows = await env.DB.prepare(
    `SELECT
       p.id, p.project_code, p.project_name, p.description, p.status, p.progress,
       p.start_date, p.target_date, p.created_at, p.updated_at,
       c.id AS client_id, c.client_code, c.full_name, c.company_name
     FROM projects p
     JOIN clients c ON c.id = p.client_id
     ORDER BY p.updated_at DESC`
  ).all();

  return apiResponse(request, env, { projects: rows.results || [] });
}

async function createProject(request, env, auth) {
  const body = await readJson(request);
  const clientId = String(body?.client_id || "").trim();
  const projectName = String(body?.project_name || "").trim();
  const description = String(body?.description || "").trim() || null;
  const status = String(body?.status || "planning").trim();
  let progress = Number(body?.progress ?? 0);
  const startDate = body?.start_date || null;
  const targetDate = body?.target_date || null;

  const allowedStatuses = new Set(["planning","design","development","testing","deployment","maintenance","completed","on_hold","cancelled"]);
  if (!clientId || !projectName || !allowedStatuses.has(status) || !Number.isInteger(progress) || progress < 0 || progress > 100) {
    return apiResponse(request, env, { error: "Invalid project data." }, 400);
  }

  if (status === "completed") {
    progress = 100;
  } else if (progress === 100) {
    return apiResponse(request, env, { error: "Progress 100% requires Completed status." }, 400);
  }

  const client = await env.DB.prepare(
    `SELECT id FROM clients WHERE id = ? AND status = 'active' LIMIT 1`
  ).bind(clientId).first();
  if (!client) return apiResponse(request, env, { error: "Client not found." }, 404);

  const projectId = crypto.randomUUID();
  const projectCode = `PRJ-${new Date().getUTCFullYear()}-${projectId.slice(0, 8).toUpperCase()}`;
  const timestamp = nowIso();

  await env.DB.prepare(
    `INSERT INTO projects
      (id, client_id, project_code, project_name, description, status, progress, start_date, target_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    projectId, clientId, projectCode, projectName, description, status, progress,
    startDate, targetDate, timestamp, timestamp
  ).run();

  await writeActivity(env, auth.user.id, "PROJECT_CREATED", "project", projectId, `Project ${projectCode} created.`);
  return apiResponse(request, env, {
    ok: true,
    project: { id: projectId, project_code: projectCode, project_name: projectName, status, progress }
  }, 201);
}

async function updateProject(request, env, auth, projectId) {
  const body = await readJson(request);
  const current = await env.DB.prepare(
    `SELECT id, project_code, status, progress, target_date FROM projects WHERE id = ? LIMIT 1`
  ).bind(projectId).first();
  if (!current) return apiResponse(request, env, { error: "Project not found." }, 404);

  const allowedStatuses = new Set(["planning","design","development","testing","deployment","maintenance","completed","on_hold","cancelled"]);
  const nextStatus = body?.status === undefined ? current.status : String(body.status);
  let nextProgress = body?.progress === undefined ? Number(current.progress) : Number(body.progress);
  const nextTarget = body?.target_date === undefined ? current.target_date : body.target_date;

  if (!allowedStatuses.has(nextStatus) || !Number.isInteger(nextProgress) || nextProgress < 0 || nextProgress > 100) {
    return apiResponse(request, env, { error: "Invalid project update." }, 400);
  }

  if (nextStatus === "completed") {
    nextProgress = 100;
  } else if (nextProgress === 100) {
    return apiResponse(request, env, { error: "Progress 100% requires Completed status." }, 400);
  }

  const timestamp = nowIso();
  await env.DB.prepare(
    `UPDATE projects
     SET status = ?, progress = ?, target_date = ?, updated_at = ?
     WHERE id = ?`
  ).bind(nextStatus, nextProgress, nextTarget || null, timestamp, projectId).run();

  await writeActivity(
    env,
    auth.user.id,
    "PROJECT_UPDATED",
    "project",
    projectId,
    `Project ${current.project_code} updated: ${nextStatus}, ${nextProgress}%.`
  );

  return apiResponse(request, env, {
    ok: true,
    project: {
      id: projectId,
      project_code: current.project_code,
      status: nextStatus,
      progress: nextProgress,
      target_date: nextTarget || null,
      updated_at: timestamp
    }
  });
}

const SUPPORT_CATEGORIES = new Set([
  "general",
  "technical",
  "billing",
  "project",
  "document",
  "other"
]);

const SUPPORT_PRIORITIES = new Set([
  "low",
  "normal",
  "high",
  "urgent"
]);

const SUPPORT_STATUSES = new Set([
  "open",
  "in_progress",
  "resolved",
  "closed"
]);

async function listAdminSupportTickets(request, env) {
  const rows = await env.DB.prepare(
    `SELECT
       t.id,
       t.ticket_code,
       t.subject,
       t.category,
       t.priority,
       t.status,
       t.assigned_to_user_id,
       t.resolved_at,
       t.closed_at,
       t.created_at,
       t.updated_at,
       c.id AS client_id,
       c.client_code,
       c.full_name,
       c.company_name,
       (
         SELECT COUNT(*)
         FROM support_messages sm
         WHERE sm.ticket_id = t.id
       ) AS message_count
     FROM support_tickets t
     JOIN clients c ON c.id = t.client_id
     ORDER BY
       CASE t.priority
         WHEN 'urgent' THEN 1
         WHEN 'high' THEN 2
         WHEN 'normal' THEN 3
         ELSE 4
       END,
       t.updated_at DESC`
  ).all();

  return apiResponse(request, env, {
    tickets: rows.results || []
  });
}

async function getAdminSupportTicket(
  request,
  env,
  ticketId
) {
  const ticket = await env.DB.prepare(
    `SELECT
       t.*,
       c.client_code,
       c.full_name,
       c.company_name
     FROM support_tickets t
     JOIN clients c ON c.id = t.client_id
     WHERE t.id = ?
     LIMIT 1`
  ).bind(ticketId).first();

  if (!ticket) {
    return apiResponse(
      request,
      env,
      { error: "Support ticket not found." },
      404
    );
  }

  const messages = await env.DB.prepare(
    `SELECT
       sm.id,
       sm.ticket_id,
       sm.sender_user_id,
       sm.message,
       sm.visibility,
       sm.created_at,
       u.email AS sender_email,
       u.role AS sender_role
     FROM support_messages sm
     JOIN users u ON u.id = sm.sender_user_id
     WHERE sm.ticket_id = ?
     ORDER BY sm.created_at ASC`
  ).bind(ticketId).all();

  return apiResponse(request, env, {
    ticket,
    messages: messages.results || []
  });
}

async function updateAdminSupportTicket(
  request,
  env,
  auth,
  ticketId
) {
  const body = await readJson(request);

  const current = await env.DB.prepare(
    `SELECT *
     FROM support_tickets
     WHERE id = ?
     LIMIT 1`
  ).bind(ticketId).first();

  if (!current) {
    return apiResponse(
      request,
      env,
      { error: "Support ticket not found." },
      404
    );
  }

  const status =
    body?.status === undefined
      ? current.status
      : String(body.status).trim();

  const priority =
    body?.priority === undefined
      ? current.priority
      : String(body.priority).trim();

  if (!SUPPORT_STATUSES.has(status)) {
    return apiResponse(
      request,
      env,
      { error: "Invalid support status." },
      400
    );
  }

  if (!SUPPORT_PRIORITIES.has(priority)) {
    return apiResponse(
      request,
      env,
      { error: "Invalid support priority." },
      400
    );
  }

  const timestamp = nowIso();

  let resolvedAt = current.resolved_at;
  let closedAt = current.closed_at;

  if (status === "resolved" && current.status !== "resolved") {
    resolvedAt = timestamp;
  }

  if (status !== "resolved" && status !== "closed") {
    resolvedAt = null;
  }

  if (status === "closed" && current.status !== "closed") {
    closedAt = timestamp;
  }

  if (status !== "closed") {
    closedAt = null;
  }

  await env.DB.prepare(
    `UPDATE support_tickets
     SET
       status = ?,
       priority = ?,
       resolved_at = ?,
       closed_at = ?,
       updated_at = ?
     WHERE id = ?`
  ).bind(
    status,
    priority,
    resolvedAt,
    closedAt,
    timestamp,
    ticketId
  ).run();

  if (status !== current.status) {
    await writeActivity(
      env,
      auth.user.id,
      "SUPPORT_STATUS_UPDATED",
      "support_ticket",
      ticketId,
      `Support ticket ${current.ticket_code} status changed from ${current.status} to ${status}.`
    );
  }

  if (priority !== current.priority) {
    await writeActivity(
      env,
      auth.user.id,
      "SUPPORT_PRIORITY_UPDATED",
      "support_ticket",
      ticketId,
      `Support ticket ${current.ticket_code} priority changed from ${current.priority} to ${priority}.`
    );
  }

  return apiResponse(request, env, {
    ok: true,
    ticket: {
      id: ticketId,
      ticket_code: current.ticket_code,
      status,
      priority,
      resolved_at: resolvedAt,
      closed_at: closedAt,
      updated_at: timestamp
    }
  });
}

async function addAdminSupportMessage(
  request,
  env,
  auth,
  ticketId
) {
  const body = await readJson(request);

  const message =
    String(body?.message || "").trim();

  const visibility =
    String(body?.visibility || "public").trim();

  if (!message || message.length > 5000) {
    return apiResponse(
      request,
      env,
      { error: "Message is required and must be 5000 characters or less." },
      400
    );
  }

  if (!["public", "internal"].includes(visibility)) {
    return apiResponse(
      request,
      env,
      { error: "Invalid message visibility." },
      400
    );
  }

  const ticket = await env.DB.prepare(
    `SELECT *
     FROM support_tickets
     WHERE id = ?
     LIMIT 1`
  ).bind(ticketId).first();

  if (!ticket) {
    return apiResponse(
      request,
      env,
      { error: "Support ticket not found." },
      404
    );
  }

  if (ticket.status === "closed") {
    return apiResponse(
      request,
      env,
      { error: "Closed support ticket cannot receive new messages." },
      409
    );
  }

  const messageId = crypto.randomUUID();
  const timestamp = nowIso();

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO support_messages
        (
          id,
          ticket_id,
          sender_user_id,
          message,
          visibility,
          created_at
        )
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
      messageId,
      ticketId,
      auth.user.id,
      message,
      visibility,
      timestamp
    ),

    env.DB.prepare(
      `UPDATE support_tickets
       SET
         status =
           CASE
             WHEN status = 'open' THEN 'in_progress'
             ELSE status
           END,
         updated_at = ?
       WHERE id = ?`
    ).bind(
      timestamp,
      ticketId
    )
  ]);

  await writeActivity(
    env,
    auth.user.id,
    "SUPPORT_MESSAGE_SENT",
    "support_ticket",
    ticketId,
    `Admin replied to support ticket ${ticket.ticket_code}.`
  );

  return apiResponse(
    request,
    env,
    {
      ok: true,
      message: {
        id: messageId,
        ticket_id: ticketId,
        message,
        visibility,
        created_at: timestamp
      }
    },
    201
  );
}

async function listClientSupportTickets(
  request,
  env,
  auth
) {
  if (!auth.user.client_id) {
    return apiResponse(
      request,
      env,
      { error: "Client profile is not linked to this account." },
      403
    );
  }

  const rows = await env.DB.prepare(
    `SELECT
       t.id,
       t.ticket_code,
       t.subject,
       t.category,
       t.priority,
       t.status,
       t.resolved_at,
       t.closed_at,
       t.created_at,
       t.updated_at,
       (
         SELECT COUNT(*)
         FROM support_messages sm
         WHERE sm.ticket_id = t.id
           AND sm.visibility = 'public'
       ) AS message_count
     FROM support_tickets t
     WHERE t.client_id = ?
     ORDER BY t.updated_at DESC`
  ).bind(auth.user.client_id).all();

  return apiResponse(request, env, {
    tickets: rows.results || []
  });
}

async function createClientSupportTicket(
  request,
  env,
  auth
) {
  if (!auth.user.client_id) {
    return apiResponse(
      request,
      env,
      { error: "Client profile is not linked to this account." },
      403
    );
  }

  const body = await readJson(request);

  const subject =
    String(body?.subject || "").trim();

  const category =
    String(body?.category || "general").trim();

  const priority =
    String(body?.priority || "normal").trim();

  const message =
    String(body?.message || "").trim();

  if (!subject || subject.length > 180) {
    return apiResponse(
      request,
      env,
      { error: "Subject is required and must be 180 characters or less." },
      400
    );
  }

  if (!SUPPORT_CATEGORIES.has(category)) {
    return apiResponse(
      request,
      env,
      { error: "Invalid support category." },
      400
    );
  }

  if (!SUPPORT_PRIORITIES.has(priority)) {
    return apiResponse(
      request,
      env,
      { error: "Invalid support priority." },
      400
    );
  }

  if (!message || message.length > 5000) {
    return apiResponse(
      request,
      env,
      { error: "Message is required and must be 5000 characters or less." },
      400
    );
  }

  const ticketId = crypto.randomUUID();
  const messageId = crypto.randomUUID();
  const year = new Date().getUTCFullYear();

  const ticketCode =
    `TKT-${year}-${ticketId.slice(0, 8).toUpperCase()}`;

  const timestamp = nowIso();

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO support_tickets
        (
          id,
          client_id,
          ticket_code,
          subject,
          category,
          priority,
          status,
          created_by_user_id,
          created_at,
          updated_at
        )
       VALUES (?, ?, ?, ?, ?, ?, 'open', ?, ?, ?)`
    ).bind(
      ticketId,
      auth.user.client_id,
      ticketCode,
      subject,
      category,
      priority,
      auth.user.id,
      timestamp,
      timestamp
    ),

    env.DB.prepare(
      `INSERT INTO support_messages
        (
          id,
          ticket_id,
          sender_user_id,
          message,
          visibility,
          created_at
        )
       VALUES (?, ?, ?, ?, 'public', ?)`
    ).bind(
      messageId,
      ticketId,
      auth.user.id,
      message,
      timestamp
    )
  ]);

  await writeActivity(
    env,
    auth.user.id,
    "SUPPORT_TICKET_CREATED",
    "support_ticket",
    ticketId,
    `Support ticket ${ticketCode} created by client.`
  );

  return apiResponse(
    request,
    env,
    {
      ok: true,
      ticket: {
        id: ticketId,
        ticket_code: ticketCode,
        subject,
        category,
        priority,
        status: "open",
        created_at: timestamp
      }
    },
    201
  );
}

async function getClientSupportTicket(
  request,
  env,
  auth,
  ticketId
) {
  if (!auth.user.client_id) {
    return apiResponse(
      request,
      env,
      { error: "Client profile is not linked to this account." },
      403
    );
  }

  const ticket = await env.DB.prepare(
    `SELECT *
     FROM support_tickets
     WHERE id = ?
       AND client_id = ?
     LIMIT 1`
  ).bind(
    ticketId,
    auth.user.client_id
  ).first();

  if (!ticket) {
    return apiResponse(
      request,
      env,
      { error: "Support ticket not found." },
      404
    );
  }

  const messages = await env.DB.prepare(
    `SELECT
       sm.id,
       sm.ticket_id,
       sm.sender_user_id,
       sm.message,
       sm.created_at,
       u.email AS sender_email,
       u.role AS sender_role
     FROM support_messages sm
     JOIN users u ON u.id = sm.sender_user_id
     WHERE sm.ticket_id = ?
       AND sm.visibility = 'public'
     ORDER BY sm.created_at ASC`
  ).bind(ticketId).all();

  return apiResponse(request, env, {
    ticket,
    messages: messages.results || []
  });
}

async function addClientSupportMessage(
  request,
  env,
  auth,
  ticketId
) {
  if (!auth.user.client_id) {
    return apiResponse(
      request,
      env,
      { error: "Client profile is not linked to this account." },
      403
    );
  }

  const body = await readJson(request);
  const message = String(body?.message || "").trim();

  if (!message || message.length > 5000) {
    return apiResponse(
      request,
      env,
      { error: "Message is required and must be 5000 characters or less." },
      400
    );
  }

  const ticket = await env.DB.prepare(
    `SELECT *
     FROM support_tickets
     WHERE id = ?
       AND client_id = ?
     LIMIT 1`
  ).bind(
    ticketId,
    auth.user.client_id
  ).first();

  if (!ticket) {
    return apiResponse(
      request,
      env,
      { error: "Support ticket not found." },
      404
    );
  }

  if (ticket.status === "closed") {
    return apiResponse(
      request,
      env,
      { error: "Closed support ticket cannot receive new messages." },
      409
    );
  }

  const messageId = crypto.randomUUID();
  const timestamp = nowIso();

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO support_messages
        (
          id,
          ticket_id,
          sender_user_id,
          message,
          visibility,
          created_at
        )
       VALUES (?, ?, ?, ?, 'public', ?)`
    ).bind(
      messageId,
      ticketId,
      auth.user.id,
      message,
      timestamp
    ),

    env.DB.prepare(
      `UPDATE support_tickets
       SET
         status =
           CASE
             WHEN status = 'resolved' THEN 'open'
             ELSE status
           END,
         resolved_at =
           CASE
             WHEN status = 'resolved' THEN NULL
             ELSE resolved_at
           END,
         updated_at = ?
       WHERE id = ?`
    ).bind(
      timestamp,
      ticketId
    )
  ]);

  await writeActivity(
    env,
    auth.user.id,
    "SUPPORT_MESSAGE_SENT",
    "support_ticket",
    ticketId,
    `Client replied to support ticket ${ticket.ticket_code}.`
  );

  return apiResponse(
    request,
    env,
    {
      ok: true,
      message: {
        id: messageId,
        ticket_id: ticketId,
        message,
        created_at: timestamp
      }
    },
    201
  );
}
function estimateToday() {
  return new Date().toISOString().slice(0, 10);
}

function validEstimateDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function effectiveEstimateStatus(status, validUntil) {
  if (
    status === "sent" &&
    validUntil &&
    validUntil < estimateToday()
  ) {
    return "expired";
  }

  return status;
}

function mapEstimateRow(row) {
  return {
    ...row,
    status: effectiveEstimateStatus(
      row.status,
      row.valid_until
    )
  };
}

async function listAdminEstimates(request, env) {
  const rows = await env.DB.prepare(
    `SELECT
       e.id,
       e.estimate_code,
       e.title,
       e.description,
       e.currency,
       e.issue_date,
       e.valid_until,
       e.status,
       e.subtotal,
       e.tax_amount,
       e.total_amount,
       e.notes,
       e.sent_at,
       e.approved_at,
       e.rejected_at,
       e.converted_invoice_id,
       e.created_at,
       e.updated_at,
       c.id AS client_id,
       c.client_code,
       c.full_name,
       c.company_name,
       p.id AS project_id,
       p.project_code,
       p.project_name,
       i.invoice_code AS converted_invoice_code
     FROM estimates e
     JOIN clients c ON c.id = e.client_id
     LEFT JOIN projects p ON p.id = e.project_id
     LEFT JOIN invoices i ON i.id = e.converted_invoice_id
     ORDER BY e.created_at DESC`
  ).all();

  return apiResponse(request, env, {
    estimates: (rows.results || []).map(mapEstimateRow)
  });
}

async function getAdminEstimate(request, env, estimateId) {
  const estimate = await env.DB.prepare(
    `SELECT
       e.*,
       c.client_code,
       c.full_name,
       c.company_name,
       p.project_code,
       p.project_name,
       i.invoice_code AS converted_invoice_code
     FROM estimates e
     JOIN clients c ON c.id = e.client_id
     LEFT JOIN projects p ON p.id = e.project_id
     LEFT JOIN invoices i ON i.id = e.converted_invoice_id
     WHERE e.id = ?
     LIMIT 1`
  ).bind(estimateId).first();

  if (!estimate) {
    return apiResponse(
      request,
      env,
      { error: "Estimate not found." },
      404
    );
  }

  const items = await env.DB.prepare(
    `SELECT
       id,
       description,
       quantity,
       unit_price,
       line_total,
       position
     FROM estimate_items
     WHERE estimate_id = ?
     ORDER BY position ASC`
  ).bind(estimateId).all();

  return apiResponse(request, env, {
    estimate: mapEstimateRow(estimate),
    items: items.results || []
  });
}

async function createAdminEstimate(request, env, auth) {
  const body = await readJson(request);

  const clientId = String(body?.client_id || "").trim();
  const projectId =
    String(body?.project_id || "").trim() || null;

  const title = String(body?.title || "").trim();
  const description =
    String(body?.description || "").trim() || null;

  const issueDate =
    String(body?.issue_date || estimateToday()).trim();

  const validUntil =
    String(body?.valid_until || "").trim() || null;

  const notes =
    String(body?.notes || "").trim() || null;

  const taxAmount = Number(body?.tax_amount ?? 0);

  const rawItems =
    Array.isArray(body?.items)
      ? body.items
      : [];

  if (
    !clientId ||
    !title ||
    title.length > 180 ||
    !validEstimateDate(issueDate)
  ) {
    return apiResponse(
      request,
      env,
      { error: "Invalid estimate data." },
      400
    );
  }

  if (
    validUntil &&
    (
      !validEstimateDate(validUntil) ||
      validUntil < issueDate
    )
  ) {
    return apiResponse(
      request,
      env,
      { error: "Invalid estimate validity date." },
      400
    );
  }

  if (
    !Number.isSafeInteger(taxAmount) ||
    taxAmount < 0
  ) {
    return apiResponse(
      request,
      env,
      { error: "Invalid tax amount." },
      400
    );
  }

  if (
    rawItems.length < 1 ||
    rawItems.length > 50
  ) {
    return apiResponse(
      request,
      env,
      { error: "Estimate requires 1 to 50 items." },
      400
    );
  }

  const client = await env.DB.prepare(
    `SELECT id
     FROM clients
     WHERE id = ?
       AND status = 'active'
     LIMIT 1`
  ).bind(clientId).first();

  if (!client) {
    return apiResponse(
      request,
      env,
      { error: "Client not found." },
      404
    );
  }

  if (projectId) {
    const project = await env.DB.prepare(
      `SELECT id
       FROM projects
       WHERE id = ?
         AND client_id = ?
       LIMIT 1`
    ).bind(projectId, clientId).first();

    if (!project) {
      return apiResponse(
        request,
        env,
        { error: "Project does not belong to selected client." },
        400
      );
    }
  }

  const items = [];
  let subtotal = 0;

  for (
    let index = 0;
    index < rawItems.length;
    index++
  ) {
    const source = rawItems[index];

    const itemDescription =
      String(source?.description || "").trim();

    const quantity =
      Number(source?.quantity ?? 1);

    const unitPrice =
      Number(source?.unit_price ?? 0);

    if (
      !itemDescription ||
      itemDescription.length > 500 ||
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !Number.isSafeInteger(unitPrice) ||
      unitPrice < 0
    ) {
      return apiResponse(
        request,
        env,
        {
          error:
            `Invalid estimate item at position ${index + 1}.`
        },
        400
      );
    }

    const lineTotal =
      Math.round(quantity * unitPrice);

    if (
      !Number.isSafeInteger(lineTotal) ||
      lineTotal < 0
    ) {
      return apiResponse(
        request,
        env,
        { error: "Estimate amount is too large." },
        400
      );
    }

    subtotal += lineTotal;

    if (!Number.isSafeInteger(subtotal)) {
      return apiResponse(
        request,
        env,
        { error: "Estimate subtotal is too large." },
        400
      );
    }

    items.push({
      id: crypto.randomUUID(),
      description: itemDescription,
      quantity,
      unit_price: unitPrice,
      line_total: lineTotal,
      position: index + 1
    });
  }

  const totalAmount =
    subtotal + taxAmount;

  if (!Number.isSafeInteger(totalAmount)) {
    return apiResponse(
      request,
      env,
      { error: "Estimate total is too large." },
      400
    );
  }

  const estimateId = crypto.randomUUID();
  const year = new Date().getUTCFullYear();

  const estimateCode =
    `EST-${year}-${estimateId.slice(0, 8).toUpperCase()}`;

  const timestamp = nowIso();

  const statements = [
    env.DB.prepare(
      `INSERT INTO estimates
        (
          id,
          client_id,
          project_id,
          estimate_code,
          title,
          description,
          currency,
          issue_date,
          valid_until,
          status,
          subtotal,
          tax_amount,
          total_amount,
          notes,
          created_by_user_id,
          created_at,
          updated_at
        )
       VALUES (?, ?, ?, ?, ?, ?, 'IDR', ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      estimateId,
      clientId,
      projectId,
      estimateCode,
      title,
      description,
      issueDate,
      validUntil,
      subtotal,
      taxAmount,
      totalAmount,
      notes,
      auth.user.id,
      timestamp,
      timestamp
    )
  ];

  for (const item of items) {
    statements.push(
      env.DB.prepare(
        `INSERT INTO estimate_items
          (
            id,
            estimate_id,
            description,
            quantity,
            unit_price,
            line_total,
            position,
            created_at
          )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        item.id,
        estimateId,
        item.description,
        item.quantity,
        item.unit_price,
        item.line_total,
        item.position,
        timestamp
      )
    );
  }

  await env.DB.batch(statements);

  await writeActivity(
    env,
    auth.user.id,
    "ESTIMATE_CREATED",
    "estimate",
    estimateId,
    `Estimate ${estimateCode} created as draft.`
  );

  return apiResponse(
    request,
    env,
    {
      ok: true,
      estimate: {
        id: estimateId,
        estimate_code: estimateCode,
        title,
        status: "draft",
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        issue_date: issueDate,
        valid_until: validUntil
      }
    },
    201
  );
}

async function updateAdminEstimate(
  request,
  env,
  auth,
  estimateId
) {
  const body = await readJson(request);

  const current = await env.DB.prepare(
    `SELECT *
     FROM estimates
     WHERE id = ?
     LIMIT 1`
  ).bind(estimateId).first();

  if (!current) {
    return apiResponse(
      request,
      env,
      { error: "Estimate not found." },
      404
    );
  }

  const nextStatus =
    body?.status === undefined
      ? current.status
      : String(body.status).trim();

  const transitions = {
    draft: new Set(["draft", "sent", "cancelled"]),
    sent: new Set(["sent", "cancelled"]),
    approved: new Set(["approved"]),
    rejected: new Set(["rejected"]),
    cancelled: new Set(["cancelled"])
  };

  const allowed =
    transitions[current.status] ||
    new Set([current.status]);

  if (!allowed.has(nextStatus)) {
    return apiResponse(
      request,
      env,
      {
        error:
          `Invalid estimate status transition: ${current.status} -> ${nextStatus}.`
      },
      400
    );
  }

  const timestamp = nowIso();
  let sentAt = current.sent_at;

  if (nextStatus === "sent" && !sentAt) {
    sentAt = timestamp;
  }

  await env.DB.prepare(
    `UPDATE estimates
     SET
       status = ?,
       sent_at = ?,
       updated_at = ?
     WHERE id = ?`
  ).bind(
    nextStatus,
    sentAt,
    timestamp,
    estimateId
  ).run();

  await writeActivity(
    env,
    auth.user.id,
    "ESTIMATE_STATUS_UPDATED",
    "estimate",
    estimateId,
    `Estimate ${current.estimate_code} status changed from ${current.status} to ${nextStatus}.`
  );

  return apiResponse(request, env, {
    ok: true,
    estimate: {
      id: estimateId,
      estimate_code: current.estimate_code,
      status: effectiveEstimateStatus(
        nextStatus,
        current.valid_until
      ),
      sent_at: sentAt,
      updated_at: timestamp
    }
  });
}

async function listClientEstimates(
  request,
  env,
  auth
) {
  if (!auth.user.client_id) {
    return apiResponse(
      request,
      env,
      { error: "Client profile is not linked to this account." },
      403
    );
  }

  const rows = await env.DB.prepare(
    `SELECT
       e.id,
       e.estimate_code,
       e.title,
       e.description,
       e.currency,
       e.issue_date,
       e.valid_until,
       e.status,
       e.subtotal,
       e.tax_amount,
       e.total_amount,
       e.notes,
       e.sent_at,
       e.approved_at,
       e.rejected_at,
       e.converted_invoice_id,
       p.id AS project_id,
       p.project_code,
       p.project_name
     FROM estimates e
     LEFT JOIN projects p ON p.id = e.project_id
     WHERE e.client_id = ?
       AND e.status IN ('sent','approved','rejected')
     ORDER BY e.issue_date DESC, e.created_at DESC`
  ).bind(auth.user.client_id).all();

  return apiResponse(request, env, {
    estimates:
      (rows.results || []).map(mapEstimateRow)
  });
}

async function getClientEstimate(
  request,
  env,
  auth,
  estimateId
) {
  if (!auth.user.client_id) {
    return apiResponse(
      request,
      env,
      { error: "Client profile is not linked to this account." },
      403
    );
  }

  const estimate = await env.DB.prepare(
    `SELECT
       e.*,
       p.project_code,
       p.project_name
     FROM estimates e
     LEFT JOIN projects p ON p.id = e.project_id
     WHERE e.id = ?
       AND e.client_id = ?
       AND e.status IN ('sent','approved','rejected')
     LIMIT 1`
  ).bind(
    estimateId,
    auth.user.client_id
  ).first();

  if (!estimate) {
    return apiResponse(
      request,
      env,
      { error: "Estimate not found." },
      404
    );
  }

  const items = await env.DB.prepare(
    `SELECT
       id,
       description,
       quantity,
       unit_price,
       line_total,
       position
     FROM estimate_items
     WHERE estimate_id = ?
     ORDER BY position ASC`
  ).bind(estimateId).all();

  await writeActivity(
    env,
    auth.user.id,
    "ESTIMATE_VIEWED",
    "estimate",
    estimateId,
    `Estimate ${estimate.estimate_code} viewed by client.`
  );

  return apiResponse(request, env, {
    estimate: mapEstimateRow(estimate),
    items: items.results || []
  });
}

async function decideClientEstimate(
  request,
  env,
  auth,
  estimateId
) {
  const body = await readJson(request);
  const decision = String(body?.decision || "").trim();

  if (!["approved", "rejected"].includes(decision)) {
    return apiResponse(
      request,
      env,
      { error: "Decision must be approved or rejected." },
      400
    );
  }

  const estimate = await env.DB.prepare(
    `SELECT
       id,
       estimate_code,
       status,
       valid_until
     FROM estimates
     WHERE id = ?
       AND client_id = ?
     LIMIT 1`
  ).bind(
    estimateId,
    auth.user.client_id
  ).first();

  if (!estimate) {
    return apiResponse(
      request,
      env,
      { error: "Estimate not found." },
      404
    );
  }

  const effectiveStatus =
    effectiveEstimateStatus(
      estimate.status,
      estimate.valid_until
    );

  if (effectiveStatus !== "sent") {
    return apiResponse(
      request,
      env,
      {
        error:
          effectiveStatus === "expired"
            ? "Estimate has expired."
            : "Estimate can no longer be changed."
      },
      409
    );
  }

  const timestamp = nowIso();

  await env.DB.prepare(
    `UPDATE estimates
     SET
       status = ?,
       approved_at = ?,
       rejected_at = ?,
       updated_at = ?
     WHERE id = ?
       AND client_id = ?
       AND status = 'sent'`
  ).bind(
    decision,
    decision === "approved" ? timestamp : null,
    decision === "rejected" ? timestamp : null,
    timestamp,
    estimateId,
    auth.user.client_id
  ).run();

  await writeActivity(
    env,
    auth.user.id,
    decision === "approved"
      ? "ESTIMATE_APPROVED"
      : "ESTIMATE_REJECTED",
    "estimate",
    estimateId,
    `Estimate ${estimate.estimate_code} ${decision} by client.`
  );

  return apiResponse(request, env, {
    ok: true,
    estimate: {
      id: estimateId,
      estimate_code: estimate.estimate_code,
      status: decision,
      updated_at: timestamp
    }
  });
}

async function convertEstimateToInvoice(
  request,
  env,
  auth,
  estimateId
) {
  const estimate = await env.DB.prepare(
    `SELECT *
     FROM estimates
     WHERE id = ?
     LIMIT 1`
  ).bind(estimateId).first();

  if (!estimate) {
    return apiResponse(
      request,
      env,
      { error: "Estimate not found." },
      404
    );
  }

  if (estimate.status !== "approved") {
    return apiResponse(
      request,
      env,
      { error: "Only approved estimates can be converted." },
      409
    );
  }

  if (estimate.converted_invoice_id) {
    return apiResponse(
      request,
      env,
      {
        error: "Estimate has already been converted.",
        invoice_id: estimate.converted_invoice_id
      },
      409
    );
  }

  const estimateItems = await env.DB.prepare(
    `SELECT
       description,
       quantity,
       unit_price,
       line_total,
       position
     FROM estimate_items
     WHERE estimate_id = ?
     ORDER BY position ASC`
  ).bind(estimateId).all();

  const invoiceId = crypto.randomUUID();
  const year = new Date().getUTCFullYear();

  const invoiceCode =
    `INV-${year}-${invoiceId.slice(0, 8).toUpperCase()}`;

  const timestamp = nowIso();
  const issueDate = invoiceToday();

  const statements = [
    env.DB.prepare(
      `INSERT INTO invoices
        (
          id,
          client_id,
          project_id,
          invoice_code,
          title,
          description,
          currency,
          issue_date,
          due_date,
          status,
          subtotal,
          tax_amount,
          total_amount,
          notes,
          created_by_user_id,
          created_at,
          updated_at
        )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, 'draft', ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      invoiceId,
      estimate.client_id,
      estimate.project_id,
      invoiceCode,
      estimate.title,
      estimate.description,
      estimate.currency || "IDR",
      issueDate,
      estimate.subtotal,
      estimate.tax_amount,
      estimate.total_amount,
      estimate.notes,
      auth.user.id,
      timestamp,
      timestamp
    ),

    env.DB.prepare(
      `UPDATE estimates
       SET
         converted_invoice_id = ?,
         updated_at = ?
       WHERE id = ?
         AND converted_invoice_id IS NULL`
    ).bind(
      invoiceId,
      timestamp,
      estimateId
    )
  ];

  for (const item of estimateItems.results || []) {
    statements.push(
      env.DB.prepare(
        `INSERT INTO invoice_items
          (
            id,
            invoice_id,
            description,
            quantity,
            unit_price,
            line_total,
            position,
            created_at
          )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        crypto.randomUUID(),
        invoiceId,
        item.description,
        item.quantity,
        item.unit_price,
        item.line_total,
        item.position,
        timestamp
      )
    );
  }

  await env.DB.batch(statements);

  await writeActivity(
    env,
    auth.user.id,
    "ESTIMATE_CONVERTED_TO_INVOICE",
    "estimate",
    estimateId,
    `Estimate ${estimate.estimate_code} converted to invoice ${invoiceCode}.`
  );

  await writeActivity(
    env,
    auth.user.id,
    "INVOICE_CREATED",
    "invoice",
    invoiceId,
    `Invoice ${invoiceCode} created from estimate ${estimate.estimate_code}.`
  );

  return apiResponse(
    request,
    env,
    {
      ok: true,
      invoice: {
        id: invoiceId,
        invoice_code: invoiceCode,
        status: "draft",
        total_amount: estimate.total_amount
      }
    },
    201
  );
}
function invoiceToday() {
  return new Date().toISOString().slice(0, 10);
}

function validInvoiceDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function effectiveInvoiceStatus(status, dueDate) {
  if (
    status === "sent" &&
    dueDate &&
    dueDate < invoiceToday()
  ) {
    return "overdue";
  }

  return status;
}

function mapInvoiceRow(row) {
  return {
    ...row,
    status: effectiveInvoiceStatus(row.status, row.due_date)
  };
}

async function listAdminInvoices(request, env) {
  const rows = await env.DB.prepare(
    `SELECT
       i.id,
       i.invoice_code,
       i.title,
       i.description,
       i.currency,
       i.issue_date,
       i.due_date,
       i.status,
       i.subtotal,
       i.tax_amount,
       i.total_amount,
       i.notes,
       i.sent_at,
       i.paid_at,
       i.created_at,
       i.updated_at,
       c.id AS client_id,
       c.client_code,
       c.full_name,
       c.company_name,
       p.id AS project_id,
       p.project_code,
       p.project_name,
       (
         SELECT COUNT(*)
         FROM invoice_items ii
         WHERE ii.invoice_id = i.id
       ) AS item_count
     FROM invoices i
     JOIN clients c ON c.id = i.client_id
     LEFT JOIN projects p ON p.id = i.project_id
     ORDER BY i.created_at DESC`
  ).all();

  return apiResponse(request, env, {
    invoices: (rows.results || []).map(mapInvoiceRow)
  });
}

async function getAdminInvoice(request, env, invoiceId) {
  const invoice = await env.DB.prepare(
    `SELECT
       i.*,
       c.client_code,
       c.full_name,
       c.company_name,
       p.project_code,
       p.project_name
     FROM invoices i
     JOIN clients c ON c.id = i.client_id
     LEFT JOIN projects p ON p.id = i.project_id
     WHERE i.id = ?
     LIMIT 1`
  ).bind(invoiceId).first();

  if (!invoice) {
    return apiResponse(
      request,
      env,
      { error: "Invoice not found." },
      404
    );
  }

  const items = await env.DB.prepare(
    `SELECT
       id,
       description,
       quantity,
       unit_price,
       line_total,
       position
     FROM invoice_items
     WHERE invoice_id = ?
     ORDER BY position ASC`
  ).bind(invoiceId).all();

  return apiResponse(request, env, {
    invoice: mapInvoiceRow(invoice),
    items: items.results || []
  });
}

async function createAdminInvoice(request, env, auth) {
  const body = await readJson(request);

  const clientId = String(body?.client_id || "").trim();
  const projectId =
    String(body?.project_id || "").trim() || null;

  const title = String(body?.title || "").trim();
  const description =
    String(body?.description || "").trim() || null;

  const issueDate =
    String(body?.issue_date || invoiceToday()).trim();

  const dueDate =
    String(body?.due_date || "").trim() || null;

  const notes =
    String(body?.notes || "").trim() || null;

  const taxAmount = Number(body?.tax_amount ?? 0);
  const rawItems = Array.isArray(body?.items)
    ? body.items
    : [];

  if (
    !clientId ||
    !title ||
    title.length > 180 ||
    !validInvoiceDate(issueDate)
  ) {
    return apiResponse(
      request,
      env,
      { error: "Invalid invoice data." },
      400
    );
  }

  if (dueDate && !validInvoiceDate(dueDate)) {
    return apiResponse(
      request,
      env,
      { error: "Invalid due date." },
      400
    );
  }

  if (dueDate && dueDate < issueDate) {
    return apiResponse(
      request,
      env,
      { error: "Due date cannot be before issue date." },
      400
    );
  }

  if (
    !Number.isSafeInteger(taxAmount) ||
    taxAmount < 0
  ) {
    return apiResponse(
      request,
      env,
      { error: "Invalid tax amount." },
      400
    );
  }

  if (
    rawItems.length < 1 ||
    rawItems.length > 50
  ) {
    return apiResponse(
      request,
      env,
      { error: "Invoice requires 1 to 50 items." },
      400
    );
  }

  const client = await env.DB.prepare(
    `SELECT id
     FROM clients
     WHERE id = ?
       AND status = 'active'
     LIMIT 1`
  ).bind(clientId).first();

  if (!client) {
    return apiResponse(
      request,
      env,
      { error: "Client not found." },
      404
    );
  }

  if (projectId) {
    const project = await env.DB.prepare(
      `SELECT id
       FROM projects
       WHERE id = ?
         AND client_id = ?
       LIMIT 1`
    ).bind(projectId, clientId).first();

    if (!project) {
      return apiResponse(
        request,
        env,
        { error: "Project does not belong to selected client." },
        400
      );
    }
  }

  const items = [];
  let subtotal = 0;

  for (let index = 0; index < rawItems.length; index++) {
    const source = rawItems[index];

    const itemDescription =
      String(source?.description || "").trim();

    const quantity = Number(source?.quantity ?? 1);
    const unitPrice = Number(source?.unit_price ?? 0);

    if (
      !itemDescription ||
      itemDescription.length > 500 ||
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !Number.isSafeInteger(unitPrice) ||
      unitPrice < 0
    ) {
      return apiResponse(
        request,
        env,
        { error: `Invalid invoice item at position ${index + 1}.` },
        400
      );
    }

    const lineTotal =
      Math.round(quantity * unitPrice);

    if (!Number.isSafeInteger(lineTotal) || lineTotal < 0) {
      return apiResponse(
        request,
        env,
        { error: "Invoice amount is too large." },
        400
      );
    }

    subtotal += lineTotal;

    if (!Number.isSafeInteger(subtotal)) {
      return apiResponse(
        request,
        env,
        { error: "Invoice subtotal is too large." },
        400
      );
    }

    items.push({
      id: crypto.randomUUID(),
      description: itemDescription,
      quantity,
      unit_price: unitPrice,
      line_total: lineTotal,
      position: index + 1
    });
  }

  const totalAmount = subtotal + taxAmount;

  if (!Number.isSafeInteger(totalAmount)) {
    return apiResponse(
      request,
      env,
      { error: "Invoice total is too large." },
      400
    );
  }

  const invoiceId = crypto.randomUUID();
  const year = new Date().getUTCFullYear();

  const invoiceCode =
    `INV-${year}-${invoiceId.slice(0, 8).toUpperCase()}`;

  const timestamp = nowIso();

  const statements = [
    env.DB.prepare(
      `INSERT INTO invoices
        (
          id,
          client_id,
          project_id,
          invoice_code,
          title,
          description,
          currency,
          issue_date,
          due_date,
          status,
          subtotal,
          tax_amount,
          total_amount,
          notes,
          created_by_user_id,
          created_at,
          updated_at
        )
       VALUES (?, ?, ?, ?, ?, ?, 'IDR', ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      invoiceId,
      clientId,
      projectId,
      invoiceCode,
      title,
      description,
      issueDate,
      dueDate,
      subtotal,
      taxAmount,
      totalAmount,
      notes,
      auth.user.id,
      timestamp,
      timestamp
    )
  ];

  for (const item of items) {
    statements.push(
      env.DB.prepare(
        `INSERT INTO invoice_items
          (
            id,
            invoice_id,
            description,
            quantity,
            unit_price,
            line_total,
            position,
            created_at
          )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        item.id,
        invoiceId,
        item.description,
        item.quantity,
        item.unit_price,
        item.line_total,
        item.position,
        timestamp
      )
    );
  }

  await env.DB.batch(statements);

  await writeActivity(
    env,
    auth.user.id,
    "INVOICE_CREATED",
    "invoice",
    invoiceId,
    `Invoice ${invoiceCode} created as draft.`
  );

  return apiResponse(
    request,
    env,
    {
      ok: true,
      invoice: {
        id: invoiceId,
        invoice_code: invoiceCode,
        title,
        status: "draft",
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        issue_date: issueDate,
        due_date: dueDate
      }
    },
    201
  );
}

async function updateAdminInvoice(
  request,
  env,
  auth,
  invoiceId
) {
  const body = await readJson(request);

  const current = await env.DB.prepare(
    `SELECT
       id,
       invoice_code,
       client_id,
       project_id,
       title,
       status,
       issue_date,
       due_date,
       subtotal,
       tax_amount,
       notes,
       sent_at,
       paid_at
     FROM invoices
     WHERE id = ?
     LIMIT 1`
  ).bind(invoiceId).first();

  if (!current) {
    return apiResponse(
      request,
      env,
      { error: "Invoice not found." },
      404
    );
  }

  const editFields = [
    "title",
    "project_id",
    "due_date",
    "tax_amount",
    "notes",
    "items"
  ];

  const editRequested = editFields.some(
    key => Object.prototype.hasOwnProperty.call(body || {}, key)
  );

  if (editRequested) {
    if (current.status !== "draft") {
      return apiResponse(
        request,
        env,
        { error: "Only Draft invoices can be edited." },
        409
      );
    }

    if (
      body?.status !== undefined &&
      String(body.status).trim() !== "draft"
    ) {
      return apiResponse(
        request,
        env,
        { error: "Edit the Draft before changing its status." },
        400
      );
    }

    const title =
      body?.title === undefined
        ? current.title
        : String(body.title || "").trim();

    const projectId =
      body?.project_id === undefined
        ? current.project_id
        : (String(body.project_id || "").trim() || null);

    const dueDate =
      body?.due_date === undefined
        ? current.due_date
        : (String(body.due_date || "").trim() || null);

    const taxAmount =
      body?.tax_amount === undefined
        ? Number(current.tax_amount || 0)
        : Number(body.tax_amount);

    const notes =
      body?.notes === undefined
        ? current.notes
        : (String(body.notes || "").trim() || null);

    if (!title || title.length > 180) {
      return apiResponse(
        request,
        env,
        { error: "Invalid invoice title." },
        400
      );
    }

    if (
      dueDate &&
      (
        !validInvoiceDate(dueDate) ||
        dueDate < current.issue_date
      )
    ) {
      return apiResponse(
        request,
        env,
        { error: "Invalid invoice due date." },
        400
      );
    }

    if (
      !Number.isSafeInteger(taxAmount) ||
      taxAmount < 0
    ) {
      return apiResponse(
        request,
        env,
        { error: "Invalid tax amount." },
        400
      );
    }

    if (notes && notes.length > 2000) {
      return apiResponse(
        request,
        env,
        { error: "Invoice notes are too long." },
        400
      );
    }

    if (projectId) {
      const project = await env.DB.prepare(
        `SELECT id
         FROM projects
         WHERE id = ?
           AND client_id = ?
         LIMIT 1`
      ).bind(
        projectId,
        current.client_id
      ).first();

      if (!project) {
        return apiResponse(
          request,
          env,
          { error: "Project does not belong to this client." },
          400
        );
      }
    }

    let subtotal = Number(current.subtotal || 0);
    let items = null;

    if (body?.items !== undefined) {
      const rawItems = Array.isArray(body.items)
        ? body.items
        : [];

      if (
        rawItems.length < 1 ||
        rawItems.length > 50
      ) {
        return apiResponse(
          request,
          env,
          { error: "Invoice requires 1 to 50 items." },
          400
        );
      }

      items = [];
      subtotal = 0;

      for (
        let index = 0;
        index < rawItems.length;
        index++
      ) {
        const source = rawItems[index];

        const itemDescription =
          String(source?.description || "").trim();

        const quantity =
          Number(source?.quantity ?? 1);

        const unitPrice =
          Number(source?.unit_price ?? 0);

        if (
          !itemDescription ||
          itemDescription.length > 500 ||
          !Number.isFinite(quantity) ||
          quantity <= 0 ||
          !Number.isSafeInteger(unitPrice) ||
          unitPrice < 0
        ) {
          return apiResponse(
            request,
            env,
            {
              error:
                `Invalid invoice item at position ${index + 1}.`
            },
            400
          );
        }

        const lineTotal =
          Math.round(quantity * unitPrice);

        if (
          !Number.isSafeInteger(lineTotal) ||
          lineTotal < 0
        ) {
          return apiResponse(
            request,
            env,
            { error: "Invoice amount is too large." },
            400
          );
        }

        subtotal += lineTotal;

        if (!Number.isSafeInteger(subtotal)) {
          return apiResponse(
            request,
            env,
            { error: "Invoice subtotal is too large." },
            400
          );
        }

        items.push({
          id: crypto.randomUUID(),
          description: itemDescription,
          quantity,
          unit_price: unitPrice,
          line_total: lineTotal,
          position: index + 1
        });
      }
    }

    const totalAmount =
      subtotal + taxAmount;

    if (!Number.isSafeInteger(totalAmount)) {
      return apiResponse(
        request,
        env,
        { error: "Invoice total is too large." },
        400
      );
    }

    const timestamp = nowIso();

    const statements = [
      env.DB.prepare(
        `UPDATE invoices
         SET
           project_id = ?,
           title = ?,
           due_date = ?,
           subtotal = ?,
           tax_amount = ?,
           total_amount = ?,
           notes = ?,
           updated_at = ?
         WHERE id = ?
           AND status = 'draft'`
      ).bind(
        projectId,
        title,
        dueDate,
        subtotal,
        taxAmount,
        totalAmount,
        notes,
        timestamp,
        invoiceId
      )
    ];

    if (items) {
      statements.push(
        env.DB.prepare(
          `DELETE FROM invoice_items
           WHERE invoice_id = ?`
        ).bind(invoiceId)
      );

      for (const item of items) {
        statements.push(
          env.DB.prepare(
            `INSERT INTO invoice_items
              (
                id,
                invoice_id,
                description,
                quantity,
                unit_price,
                line_total,
                position,
                created_at
              )
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            item.id,
            invoiceId,
            item.description,
            item.quantity,
            item.unit_price,
            item.line_total,
            item.position,
            timestamp
          )
        );
      }
    }

    await env.DB.batch(statements);

    await writeActivity(
      env,
      auth.user.id,
      "INVOICE_DRAFT_UPDATED",
      "invoice",
      invoiceId,
      `Invoice ${current.invoice_code} draft updated.`
    );

    return apiResponse(request, env, {
      ok: true,
      invoice: {
        id: invoiceId,
        invoice_code: current.invoice_code,
        title,
        project_id: projectId,
        status: "draft",
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        due_date: dueDate,
        notes,
        updated_at: timestamp
      }
    });
  }

  const nextStatus =
    body?.status === undefined
      ? current.status
      : String(body.status).trim();

  const nextDueDate =
    body?.due_date === undefined
      ? current.due_date
      : (String(body.due_date || "").trim() || null);

  const nextNotes =
    body?.notes === undefined
      ? current.notes
      : (String(body.notes || "").trim() || null);

  const transitions = {
    draft: new Set(["draft", "sent", "cancelled"]),
    sent: new Set(["sent", "paid", "cancelled"]),
    overdue: new Set(["overdue", "paid", "cancelled"]),
    paid: new Set(["paid"]),
    cancelled: new Set(["cancelled"])
  };

  const allowed =
    transitions[current.status] ||
    new Set([current.status]);

  if (!allowed.has(nextStatus)) {
    return apiResponse(
      request,
      env,
      {
        error:
          `Invalid invoice status transition: ${current.status} -> ${nextStatus}.`
      },
      400
    );
  }

  if (
    nextDueDate &&
    (
      !validInvoiceDate(nextDueDate) ||
      nextDueDate < current.issue_date
    )
  ) {
    return apiResponse(
      request,
      env,
      { error: "Invalid invoice due date." },
      400
    );
  }

  const timestamp = nowIso();

  let sentAt = current.sent_at;
  let paidAt = current.paid_at;

  if (
    (nextStatus === "sent" || nextStatus === "paid") &&
    !sentAt
  ) {
    sentAt = timestamp;
  }

  if (nextStatus === "paid" && !paidAt) {
    paidAt = timestamp;
  }

  await env.DB.prepare(
    `UPDATE invoices
     SET
       status = ?,
       due_date = ?,
       notes = ?,
       sent_at = ?,
       paid_at = ?,
       updated_at = ?
     WHERE id = ?`
  ).bind(
    nextStatus,
    nextDueDate,
    nextNotes,
    sentAt,
    paidAt,
    timestamp,
    invoiceId
  ).run();

  await writeActivity(
    env,
    auth.user.id,
    "INVOICE_STATUS_UPDATED",
    "invoice",
    invoiceId,
    `Invoice ${current.invoice_code} status changed from ${current.status} to ${nextStatus}.`
  );

  return apiResponse(request, env, {
    ok: true,
    invoice: {
      id: invoiceId,
      invoice_code: current.invoice_code,
      status: effectiveInvoiceStatus(
        nextStatus,
        nextDueDate
      ),
      due_date: nextDueDate,
      sent_at: sentAt,
      paid_at: paidAt,
      updated_at: timestamp
    }
  });
}

async function listClientInvoices(request, env, auth) {
  if (!auth.user.client_id) {
    return apiResponse(
      request,
      env,
      { error: "Client profile is not linked to this account." },
      403
    );
  }

  const rows = await env.DB.prepare(
    `SELECT
       i.id,
       i.invoice_code,
       i.title,
       i.description,
       i.currency,
       i.issue_date,
       i.due_date,
       i.status,
       i.subtotal,
       i.tax_amount,
       i.total_amount,
       i.notes,
       i.sent_at,
       i.paid_at,
       i.created_at,
       i.updated_at,
       p.id AS project_id,
       p.project_code,
       p.project_name
     FROM invoices i
     LEFT JOIN projects p ON p.id = i.project_id
     WHERE i.client_id = ?
       AND i.status IN ('sent','paid','overdue')
     ORDER BY i.issue_date DESC, i.created_at DESC`
  ).bind(auth.user.client_id).all();

  return apiResponse(request, env, {
    invoices: (rows.results || []).map(mapInvoiceRow)
  });
}

async function getClientInvoice(
  request,
  env,
  auth,
  invoiceId
) {
  if (!auth.user.client_id) {
    return apiResponse(
      request,
      env,
      { error: "Client profile is not linked to this account." },
      403
    );
  }

  const invoice = await env.DB.prepare(
    `SELECT
       i.*,
       p.project_code,
       p.project_name
     FROM invoices i
     LEFT JOIN projects p ON p.id = i.project_id
     WHERE i.id = ?
       AND i.client_id = ?
       AND i.status IN ('sent','paid','overdue')
     LIMIT 1`
  ).bind(
    invoiceId,
    auth.user.client_id
  ).first();

  if (!invoice) {
    return apiResponse(
      request,
      env,
      { error: "Invoice not found." },
      404
    );
  }

  const items = await env.DB.prepare(
    `SELECT
       id,
       description,
       quantity,
       unit_price,
       line_total,
       position
     FROM invoice_items
     WHERE invoice_id = ?
     ORDER BY position ASC`
  ).bind(invoiceId).all();

  await writeActivity(
    env,
    auth.user.id,
    "INVOICE_VIEWED",
    "invoice",
    invoiceId,
    `Invoice ${invoice.invoice_code} viewed by client.`
  );

  return apiResponse(request, env, {
    invoice: mapInvoiceRow(invoice),
    items: items.results || []
  });
}
const DOCUMENT_MAX_BYTES = 15 * 1024 * 1024;

const DOCUMENT_ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation"
]);

function safeDocumentFilename(value) {
  const cleaned = String(value || "document")
    .replace(/[\r\n"]/g, "_")
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .trim();

  return (cleaned || "document").slice(0, 180);
}

async function listAdminDocuments(request, env) {
  const rows = await env.DB.prepare(
    `SELECT
       d.id,
       d.document_code,
       d.title,
       d.description,
       d.file_name,
       d.content_type,
       d.size_bytes,
       d.status,
       d.created_at,
       d.updated_at,
       c.id AS client_id,
       c.client_code,
       c.full_name,
       c.company_name,
       p.id AS project_id,
       p.project_code,
       p.project_name
     FROM documents d
     JOIN clients c ON c.id = d.client_id
     LEFT JOIN projects p ON p.id = d.project_id
     ORDER BY d.created_at DESC`
  ).all();

  return apiResponse(request, env, {
    documents: rows.results || []
  });
}

async function uploadAdminDocument(request, env, auth) {
  if (!env.DOCUMENTS_BUCKET) {
    return apiResponse(
      request,
      env,
      { error: "DOCUMENTS_BUCKET binding is missing." },
      500
    );
  }

  const contentTypeHeader =
    request.headers.get("Content-Type") || "";

  if (!contentTypeHeader.toLowerCase().startsWith("multipart/form-data")) {
    return apiResponse(
      request,
      env,
      { error: "Content-Type must be multipart/form-data." },
      415
    );
  }

  let form;

  try {
    form = await request.formData();
  } catch {
    return apiResponse(
      request,
      env,
      { error: "Invalid multipart form data." },
      400
    );
  }

  const file = form.get("file");
  const clientId = String(form.get("client_id") || "").trim();
  const projectId = String(form.get("project_id") || "").trim() || null;
  const title = String(form.get("title") || "").trim();
  const description =
    String(form.get("description") || "").trim() || null;

  if (!clientId || !title || title.length > 180) {
    return apiResponse(
      request,
      env,
      { error: "Valid client_id and title are required." },
      400
    );
  }

  if (description && description.length > 2000) {
    return apiResponse(
      request,
      env,
      { error: "Description is too long." },
      400
    );
  }

  if (!(file instanceof File) || file.size < 1) {
    return apiResponse(
      request,
      env,
      { error: "A document file is required." },
      400
    );
  }

  if (file.size > DOCUMENT_MAX_BYTES) {
    return apiResponse(
      request,
      env,
      { error: "Document exceeds the 15 MB limit." },
      413
    );
  }

  const fileType =
    String(file.type || "").toLowerCase();

  if (!DOCUMENT_ALLOWED_TYPES.has(fileType)) {
    return apiResponse(
      request,
      env,
      { error: "Unsupported document type." },
      400
    );
  }

  const client = await env.DB.prepare(
    `SELECT id, client_code
     FROM clients
     WHERE id = ?
       AND status = 'active'
     LIMIT 1`
  ).bind(clientId).first();

  if (!client) {
    return apiResponse(
      request,
      env,
      { error: "Client not found." },
      404
    );
  }

  if (projectId) {
    const project = await env.DB.prepare(
      `SELECT id
       FROM projects
       WHERE id = ?
         AND client_id = ?
       LIMIT 1`
    ).bind(projectId, clientId).first();

    if (!project) {
      return apiResponse(
        request,
        env,
        { error: "Project does not belong to the selected client." },
        400
      );
    }
  }

  const documentId = crypto.randomUUID();
  const year = new Date().getUTCFullYear();
  const documentCode =
    `DOC-${year}-${documentId.slice(0, 8).toUpperCase()}`;

  const fileName = safeDocumentFilename(file.name);
  const objectKey =
    `clients/${clientId}/${year}/${documentId}/${fileName}`;

  const timestamp = nowIso();

  try {
    await env.DOCUMENTS_BUCKET.put(
      objectKey,
      file.stream(),
      {
        httpMetadata: {
          contentType: fileType
        },
        customMetadata: {
          document_id: documentId,
          document_code: documentCode,
          client_id: clientId
        }
      }
    );

    try {
      await env.DB.prepare(
        `INSERT INTO documents
          (
            id,
            client_id,
            project_id,
            document_code,
            title,
            description,
            file_name,
            object_key,
            content_type,
            size_bytes,
            status,
            uploaded_by_user_id,
            created_at,
            updated_at
          )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?)`
      ).bind(
        documentId,
        clientId,
        projectId,
        documentCode,
        title,
        description,
        fileName,
        objectKey,
        fileType,
        file.size,
        auth.user.id,
        timestamp,
        timestamp
      ).run();
    } catch (error) {
      await env.DOCUMENTS_BUCKET.delete(objectKey);
      throw error;
    }

    await writeActivity(
      env,
      auth.user.id,
      "DOCUMENT_UPLOADED",
      "document",
      documentId,
      `Document ${documentCode} uploaded.`
    );

    return apiResponse(
      request,
      env,
      {
        ok: true,
        document: {
          id: documentId,
          document_code: documentCode,
          title,
          file_name: fileName,
          content_type: fileType,
          size_bytes: file.size,
          status: "published"
        }
      },
      201
    );
  } catch (error) {
    console.error("Document upload failed", error);

    return apiResponse(
      request,
      env,
      { error: "Document upload failed." },
      500
    );
  }
}

async function listClientDocuments(request, env, auth) {
  if (!auth.user.client_id) {
    return apiResponse(
      request,
      env,
      { error: "Client profile is not linked to this account." },
      403
    );
  }

  const rows = await env.DB.prepare(
    `SELECT
       d.id,
       d.document_code,
       d.title,
       d.description,
       d.file_name,
       d.content_type,
       d.size_bytes,
       d.created_at,
       d.updated_at,
       p.id AS project_id,
       p.project_code,
       p.project_name
     FROM documents d
     LEFT JOIN projects p ON p.id = d.project_id
     WHERE d.client_id = ?
       AND d.status = 'published'
     ORDER BY d.created_at DESC`
  ).bind(auth.user.client_id).all();

  return apiResponse(request, env, {
    documents: rows.results || []
  });
}

function documentDownloadResponse(
  request,
  env,
  object,
  row
) {
  const headers = corsHeaders(request, env);

  for (const [key, value] of Object.entries(securityHeaders())) {
    headers.set(key, value);
  }

  headers.set(
    "Content-Type",
    row.content_type || "application/octet-stream"
  );

  headers.set(
    "Content-Disposition",
    `attachment; filename="${safeDocumentFilename(row.file_name)}"`
  );

  headers.set(
    "Content-Length",
    String(row.size_bytes || object.size || 0)
  );

  headers.set("Cache-Control", "private, no-store");

  return new Response(object.body, {
    status: 200,
    headers
  });
}

async function downloadAdminDocument(
  request,
  env,
  auth,
  documentId
) {
  if (!env.DOCUMENTS_BUCKET) {
    return apiResponse(
      request,
      env,
      { error: "DOCUMENTS_BUCKET binding is missing." },
      500
    );
  }

  const row = await env.DB.prepare(
    `SELECT
       id,
       document_code,
       file_name,
       object_key,
       content_type,
       size_bytes
     FROM documents
     WHERE id = ?
     LIMIT 1`
  ).bind(documentId).first();

  if (!row) {
    return apiResponse(
      request,
      env,
      { error: "Document not found." },
      404
    );
  }

  const object =
    await env.DOCUMENTS_BUCKET.get(row.object_key);

  if (!object) {
    return apiResponse(
      request,
      env,
      { error: "Document object is missing." },
      404
    );
  }

  await writeActivity(
    env,
    auth.user.id,
    "DOCUMENT_DOWNLOADED",
    "document",
    row.id,
    `Document ${row.document_code} downloaded by admin.`
  );

  return documentDownloadResponse(
    request,
    env,
    object,
    row
  );
}

async function downloadClientDocument(
  request,
  env,
  auth,
  documentId
) {
  if (!auth.user.client_id) {
    return apiResponse(
      request,
      env,
      { error: "Client profile is not linked to this account." },
      403
    );
  }

  if (!env.DOCUMENTS_BUCKET) {
    return apiResponse(
      request,
      env,
      { error: "DOCUMENTS_BUCKET binding is missing." },
      500
    );
  }

  const row = await env.DB.prepare(
    `SELECT
       id,
       document_code,
       file_name,
       object_key,
       content_type,
       size_bytes
     FROM documents
     WHERE id = ?
       AND client_id = ?
       AND status = 'published'
     LIMIT 1`
  ).bind(
    documentId,
    auth.user.client_id
  ).first();

  if (!row) {
    return apiResponse(
      request,
      env,
      { error: "Document not found." },
      404
    );
  }

  const object =
    await env.DOCUMENTS_BUCKET.get(row.object_key);

  if (!object) {
    return apiResponse(
      request,
      env,
      { error: "Document object is missing." },
      404
    );
  }

  await writeActivity(
    env,
    auth.user.id,
    "DOCUMENT_DOWNLOADED",
    "document",
    row.id,
    `Document ${row.document_code} downloaded by client.`
  );

  return documentDownloadResponse(
    request,
    env,
    object,
    row
  );
}
async function listClientProjects(request, env, auth) {
  if (!auth.user.client_id) {
    return apiResponse(request, env, { error: "Client profile is not linked to this account." }, 403);
  }

  const rows = await env.DB.prepare(
    `SELECT id, project_code, project_name, description, status, progress, start_date, target_date, created_at, updated_at
     FROM projects
     WHERE client_id = ?
     ORDER BY updated_at DESC`
  ).bind(auth.user.client_id).all();

  return apiResponse(request, env, { projects: rows.results || [] });
}

async function getClientProject(request, env, auth, projectId) {
  if (!auth.user.client_id) {
    return apiResponse(request, env, { error: "Client profile is not linked to this account." }, 403);
  }

  const project = await env.DB.prepare(
    `SELECT id, project_code, project_name, description, status, progress, start_date, target_date, created_at, updated_at
     FROM projects
     WHERE id = ? AND client_id = ?
     LIMIT 1`
  ).bind(projectId, auth.user.client_id).first();

  if (!project) return apiResponse(request, env, { error: "Project not found." }, 404);
  return apiResponse(request, env, { project });
}
