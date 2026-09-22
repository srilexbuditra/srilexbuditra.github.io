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
        const contentCheck = ensureJsonRequest(request, env);
        if (contentCheck) return contentCheck;
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
    `INSERT INTO users (id, email, password_hash, role, status, must_change_password, created_at, updated_at)
     VALUES (?, ?, ?, 'system_admin', 'active', 0, ?, ?)`
  ).bind(id, email, passwordHash, timestamp, timestamp).run();

  await writeActivity(env, id, "BOOTSTRAP_ADMIN_CREATED", "user", id, "Initial system administrator created.");
  return apiResponse(request, env, { ok: true, user: { id, email, role: "system_admin" } }, 201);
}

async function login(request, env) {
  const body = await readJson(request);
  const email = normalizeEmail(body?.email);
  const password = body?.password;

  if (!validEmail(email) || typeof password !== "string") {
    return apiResponse(request, env, { error: "Invalid email or password." }, 401);
  }

  const user = await env.DB.prepare(
    `SELECT u.*, c.id AS client_id, c.client_code, c.full_name, c.company_name
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
       c.id AS client_id, c.client_code, c.full_name, c.company_name,
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
  const progress = Number(body?.progress ?? 0);
  const startDate = body?.start_date || null;
  const targetDate = body?.target_date || null;

  const allowedStatuses = new Set(["planning","design","development","testing","deployment","maintenance","completed","on_hold","cancelled"]);
  if (!clientId || !projectName || !allowedStatuses.has(status) || !Number.isInteger(progress) || progress < 0 || progress > 100) {
    return apiResponse(request, env, { error: "Invalid project data." }, 400);
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
  const nextProgress = body?.progress === undefined ? Number(current.progress) : Number(body.progress);
  const nextTarget = body?.target_date === undefined ? current.target_date : body.target_date;

  if (!allowedStatuses.has(nextStatus) || !Number.isInteger(nextProgress) || nextProgress < 0 || nextProgress > 100) {
    return apiResponse(request, env, { error: "Invalid project update." }, 400);
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
