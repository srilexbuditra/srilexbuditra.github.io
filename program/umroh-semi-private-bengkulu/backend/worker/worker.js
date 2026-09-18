const API_VERSION = "3.4.3";
const COOKIE_NAME = "umroh_session";
const DEFAULT_SESSION_AGE = 60 * 60 * 24 * 7;
const PASSWORD_ITERATIONS = 100000;
const MAX_JSON_BYTES = 16 * 1024;
const STAFF_ACTIVATION_AGE = 60 * 60 * 24;
const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;
const DOCUMENT_KEYS = new Set(["paspor-dokumen", "tiket-itinerary", "identitas-jemaah", "dokumen-kesehatan"]);
const DOCUMENT_MIME = new Set(["application/pdf", "image/jpeg", "image/png"]);
const MANASIK_KEYS = new Set(["persiapan", "ihram-miqat", "talbiyah", "tata-cara-umroh", "thawaf", "sai", "tahallul", "larangan-ihram", "adab-tanah-suci", "ziarah-madinah", "tips-perjalanan"]);

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

      if (request.method === "POST" && path === "/auth/jamaah/activate") {
        return activateAccount(request, env, "jamaah");
      }

      if (request.method === "POST" && path === "/auth/activate") {
        return activateAccount(request, env);
      }

      if (request.method === "POST" && path === "/auth/jamaah/login") {
        return loginJamaah(request, env);
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




      if (request.method === "GET" && path === "/jamaah/progress/manasik") {
        return getOwnManasikProgress(request, env);
      }

      if (request.method === "POST" && path === "/jamaah/progress/manasik/import") {
        return importOwnManasikProgress(request, env);
      }

      const manasikProgressMatch = path.match(/^\/jamaah\/progress\/manasik\/([a-z0-9-]+)$/i);
      if (manasikProgressMatch && request.method === "PATCH") {
        return updateOwnManasikProgress(request, env, manasikProgressMatch[1]);
      }

      if (request.method === "GET" && path === "/jamaah/documents") {
        return listOwnDocuments(request, env);
      }

      const ownUploadMatch = path.match(/^\/jamaah\/documents\/([a-z0-9-]+)\/upload$/i);
      if (ownUploadMatch && request.method === "POST") {
        return uploadOwnDocument(request, env, ownUploadMatch[1]);
      }

      const ownDownloadMatch = path.match(/^\/jamaah\/documents\/([0-9a-f-]{36})\/download$/i);
      if (ownDownloadMatch && request.method === "GET") {
        return downloadOwnDocument(request, env, ownDownloadMatch[1]);
      }

      if (request.method === "GET" && path === "/admin/documents") {
        return listAdminDocuments(request, env);
      }

      const adminDocumentDownloadMatch = path.match(/^\/admin\/documents\/([0-9a-f-]{36})\/download$/i);
      if (adminDocumentDownloadMatch && request.method === "GET") {
        return downloadAdminDocument(request, env, adminDocumentDownloadMatch[1]);
      }

      const adminDocumentReviewMatch = path.match(/^\/admin\/documents\/([0-9a-f-]{36})\/review$/i);
      if (adminDocumentReviewMatch && request.method === "PATCH") {
        return reviewAdminDocument(request, env, adminDocumentReviewMatch[1]);
      }

      if (request.method === "GET" && path === "/admin/jamaah/stats") {
        return getAdminJamaahStats(request, env);
      }

      if (request.method === "GET" && path === "/admin/jamaah") {
        return listAdminJamaah(request, env);
      }

      if (request.method === "POST" && path === "/admin/jamaah") {
        return createAdminJamaah(request, env);
      }

      const jamaahMatch = path.match(/^\/admin\/jamaah\/([0-9a-f-]{36})$/i);
      if (jamaahMatch && request.method === "PATCH") {
        return updateAdminJamaah(request, env, jamaahMatch[1]);
      }

      const jamaahResetMatch = path.match(/^\/admin\/jamaah\/([0-9a-f-]{36})\/reset-access$/i);
      if (jamaahResetMatch && request.method === "POST") {
        return resetJamaahAccess(request, env, jamaahResetMatch[1]);
      }

      if (request.method === "GET" && path === "/admin/accounts") {
        return listAdminAccounts(request, env);
      }

      if (request.method === "POST" && path === "/admin/accounts") {
        return createAdminAccount(request, env);
      }

      const accountMatch = path.match(/^\/admin\/accounts\/([0-9a-f-]{36})$/i);
      if (accountMatch && request.method === "PATCH") {
        return updateAdminAccount(request, env, accountMatch[1]);
      }

      const resetMatch = path.match(/^\/admin\/accounts\/([0-9a-f-]{36})\/reset-password$/i);
      if (resetMatch && request.method === "POST") {
        return resetAdminPassword(request, env, resetMatch[1]);
      }

      if (request.method === "GET" && path === "/admin/audit-log") {
        return listAdminAuditLog(request, env);
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

async function activateAccount(request, env, expectedRole = null) {
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
  if (
    !account ||
    account.account_status !== "pending_activation" ||
    (expectedRole && account.role !== expectedRole)
  ) {
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

  const statements = [
    env.DB.prepare(`
      UPDATE umroh_accounts
      SET password_hash = ?, account_status = 'active',
          password_changed_at = ?, last_login_at = ?, updated_at = ?
      WHERE id = ?
    `).bind(passwordHash, now, now, now, account.id),
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
  ];

  if (["jamaah", "admin", "tour_leader", "pendamping"].includes(account.role)) {
    statements.push(
      env.DB.prepare(`
        INSERT INTO umroh_admin_audit_log
          (actor_account_id, action, target_account_id, details_json, created_at)
        VALUES (?, 'account_activated', ?, ?, ?)
      `).bind(
        account.id,
        account.id,
        JSON.stringify({ role: account.role, method: "activation_code" }),
        now
      )
    );
  }

  await env.DB.batch(statements);

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


async function loginJamaah(request, env) {
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
    account.role !== "jamaah" ||
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
      a.account_status, a.display_name, a.job_title, p.full_name, p.group_name, p.departure_batch,
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
      a.password_hash, a.account_status, a.display_name, a.job_title,
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
    display_name: account.display_name || null,
    job_title: account.job_title || null,
    full_name: account.full_name || null,
    group_name: account.group_name || null,
    departure_batch: account.departure_batch || null,
  };
}





async function manasikProgressPayload(env, accountId) {
  const result = await env.DB.prepare(`
    SELECT item_key, status, updated_at
    FROM umroh_progress_items
    WHERE account_id = ? AND module = 'manasik'
    ORDER BY item_key
  `).bind(accountId).all();

  const rows = (result.results || []).filter((row) => MANASIK_KEYS.has(row.item_key));
  const done = rows.filter((row) => row.status === "complete").length;

  return {
    initialized: rows.length > 0,
    done,
    total: MANASIK_KEYS.size,
    items: rows.map((row) => ({
      item_key: row.item_key,
      status: row.status,
      updated_at: row.updated_at,
    })),
  };
}

async function getOwnManasikProgress(request, env) {
  const gate = await requireJamaah(request, env);
  if (gate.response) return gate.response;

  const progress = await manasikProgressPayload(env, gate.account.id);
  return json(request, env, { ok: true, progress });
}

async function updateOwnManasikProgress(request, env, itemKey) {
  const gate = await requireJamaah(request, env);
  if (gate.response) return gate.response;

  if (!MANASIK_KEYS.has(itemKey)) {
    return json(request, env, { ok: false, error: "invalid_progress_item" }, 400);
  }

  const body = await readJson(request);
  if (typeof body.complete !== "boolean") {
    return json(request, env, { ok: false, error: "invalid_progress_status" }, 400);
  }

  const status = body.complete ? "complete" : "pending";
  const now = new Date().toISOString();

  await env.DB.prepare(`
    INSERT INTO umroh_progress_items
      (account_id, module, item_key, status, updated_at, created_at)
    VALUES (?, 'manasik', ?, ?, ?, ?)
    ON CONFLICT(account_id, module, item_key)
    DO UPDATE SET
      status = excluded.status,
      updated_at = excluded.updated_at
  `).bind(gate.account.id, itemKey, status, now, now).run();

  const progress = await manasikProgressPayload(env, gate.account.id);
  return json(request, env, { ok: true, progress });
}

async function importOwnManasikProgress(request, env) {
  const gate = await requireJamaah(request, env);
  if (gate.response) return gate.response;

  const current = await manasikProgressPayload(env, gate.account.id);
  if (current.initialized) {
    return json(request, env, {
      ok: true,
      imported: false,
      reason: "already_initialized",
      progress: current,
    });
  }

  const body = await readJson(request);
  const completed = Array.isArray(body.completed)
    ? [...new Set(body.completed.map((value) => String(value || "").trim()))]
        .filter((value) => MANASIK_KEYS.has(value))
    : [];

  if (!completed.length) {
    return json(request, env, {
      ok: true,
      imported: false,
      reason: "nothing_to_import",
      progress: current,
    });
  }

  const now = new Date().toISOString();
  await env.DB.batch(
    completed.map((itemKey) =>
      env.DB.prepare(`
        INSERT INTO umroh_progress_items
          (account_id, module, item_key, status, updated_at, created_at)
        VALUES (?, 'manasik', ?, 'complete', ?, ?)
        ON CONFLICT(account_id, module, item_key)
        DO UPDATE SET
          status = 'complete',
          updated_at = excluded.updated_at
      `).bind(gate.account.id, itemKey, now, now)
    )
  );

  const progress = await manasikProgressPayload(env, gate.account.id);
  return json(request, env, {
    ok: true,
    imported: true,
    imported_count: completed.length,
    progress,
  });
}

async function requireJamaah(request, env) {
  const account = await authenticatedAccount(request, env);
  if (!account) {
    return { response: json(request, env, { ok: false, error: "unauthorized" }, 401) };
  }
  if (account.role !== "jamaah") {
    return { response: json(request, env, { ok: false, error: "forbidden" }, 403) };
  }
  return { account };
}

function requireDocumentsBucket(env) {
  if (!env.DOCUMENTS_BUCKET) {
    throw new Error("missing_documents_bucket");
  }
}

function documentLabel(key) {
  return {
    "paspor-dokumen": "Paspor & dokumen perjalanan",
    "tiket-itinerary": "Tiket / itinerary",
    "identitas-jemaah": "Identitas jemaah",
    "dokumen-kesehatan": "Dokumen kesehatan",
  }[key] || key;
}

async function listOwnDocuments(request, env) {
  const gate = await requireJamaah(request, env);
  if (gate.response) return gate.response;

  const rows = await env.DB.prepare(`
    SELECT
      s.document_key,
      s.jamaah_status,
      s.admin_status,
      s.admin_note,
      s.reviewed_at,
      f.file_uuid,
      f.original_name,
      f.mime_type,
      f.size_bytes,
      f.sha256_hex,
      f.version,
      f.uploaded_at
    FROM umroh_document_status s
    LEFT JOIN umroh_document_files f
      ON f.account_id = s.account_id
     AND f.document_key = s.document_key
     AND f.is_current = 1
    WHERE s.account_id = ?
    ORDER BY s.document_key
  `).bind(gate.account.id).all();

  const byKey = new Map((rows.results || []).map((row) => [row.document_key, row]));
  const documents = [...DOCUMENT_KEYS].map((key) => {
    const row = byKey.get(key) || {};
    return {
      document_key: key,
      label: documentLabel(key),
      jamaah_status: row.jamaah_status || "unreviewed",
      admin_status: row.admin_status || "not_reviewed",
      admin_note: row.admin_note || null,
      reviewed_at: row.reviewed_at || null,
      file: row.file_uuid ? {
        file_uuid: row.file_uuid,
        original_name: row.original_name,
        mime_type: row.mime_type,
        size_bytes: Number(row.size_bytes || 0),
        sha256_hex: row.sha256_hex,
        version: Number(row.version || 1),
        uploaded_at: row.uploaded_at,
      } : null,
    };
  });

  return json(request, env, { ok: true, documents });
}

async function uploadOwnDocument(request, env, documentKey) {
  requireDocumentsBucket(env);
  const gate = await requireJamaah(request, env);
  if (gate.response) return gate.response;

  if (!DOCUMENT_KEYS.has(documentKey)) {
    return json(request, env, { ok: false, error: "invalid_document_key" }, 400);
  }

  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (contentLength > MAX_DOCUMENT_BYTES + 1024 * 256) {
    return json(request, env, { ok: false, error: "file_too_large" }, 413);
  }

  let form;
  try {
    form = await request.formData();
  } catch (_) {
    return json(request, env, { ok: false, error: "invalid_multipart" }, 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return json(request, env, { ok: false, error: "file_required" }, 400);
  }
  if (!file.size || file.size > MAX_DOCUMENT_BYTES) {
    return json(request, env, { ok: false, error: "file_too_large" }, 413);
  }
  if (!DOCUMENT_MIME.has(file.type)) {
    return json(request, env, { ok: false, error: "unsupported_file_type" }, 415);
  }

  const bytes = await file.arrayBuffer();
  if (!matchesDocumentMagic(new Uint8Array(bytes), file.type)) {
    return json(request, env, { ok: false, error: "file_signature_mismatch" }, 415);
  }

  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const sha256Hex = [...new Uint8Array(digest)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");

  const fileUuid = crypto.randomUUID();
  const objectKey = `private/jamaah/${gate.account.account_uuid}/${documentKey}/${fileUuid}`;
  const originalName = safeFilename(file.name || `${documentKey}.bin`);
  const now = new Date().toISOString();

  const versionRow = await env.DB.prepare(`
    SELECT COALESCE(MAX(version), 0) AS max_version
    FROM umroh_document_files
    WHERE account_id = ? AND document_key = ?
  `).bind(gate.account.id, documentKey).first();
  const version = Number(versionRow?.max_version || 0) + 1;

  await env.DOCUMENTS_BUCKET.put(objectKey, bytes, {
    httpMetadata: {
      contentType: file.type,
      cacheControl: "private, no-store",
    },
    customMetadata: {
      file_uuid: fileUuid,
      account_uuid: gate.account.account_uuid,
      document_key: documentKey,
      version: String(version),
    },
  });

  try {
    await env.DB.batch([
      env.DB.prepare(`
        UPDATE umroh_document_files
        SET is_current = 0
        WHERE account_id = ? AND document_key = ? AND is_current = 1
      `).bind(gate.account.id, documentKey),
      env.DB.prepare(`
        INSERT INTO umroh_document_files
          (file_uuid, account_id, document_key, version, object_key,
           original_name, mime_type, size_bytes, sha256_hex, is_current,
           uploaded_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `).bind(
        fileUuid,
        gate.account.id,
        documentKey,
        version,
        objectKey,
        originalName,
        file.type,
        file.size,
        sha256Hex,
        now,
        now
      ),
      env.DB.prepare(`
        INSERT INTO umroh_document_status
          (account_id, document_key, jamaah_status, admin_status,
           admin_note, reviewed_by_account_id, reviewed_at, updated_at, created_at)
        VALUES (?, ?, 'prepared', 'not_reviewed', NULL, NULL, NULL, ?, ?)
        ON CONFLICT(account_id, document_key)
        DO UPDATE SET
          jamaah_status = 'prepared',
          admin_status = 'not_reviewed',
          admin_note = NULL,
          reviewed_by_account_id = NULL,
          reviewed_at = NULL,
          updated_at = excluded.updated_at
      `).bind(gate.account.id, documentKey, now, now),
      env.DB.prepare(`
        INSERT INTO umroh_admin_audit_log
          (actor_account_id, action, target_account_id, details_json, created_at)
        VALUES (?, 'document_uploaded', ?, ?, ?)
      `).bind(
        gate.account.id,
        gate.account.id,
        JSON.stringify({
          document_key: documentKey,
          file_uuid: fileUuid,
          version,
          mime_type: file.type,
          size_bytes: file.size,
          sha256_hex: sha256Hex,
        }),
        now
      ),
    ]);
  } catch (error) {
    await env.DOCUMENTS_BUCKET.delete(objectKey).catch(() => {});
    throw error;
  }

  return json(request, env, {
    ok: true,
    document: {
      document_key: documentKey,
      jamaah_status: "prepared",
      admin_status: "not_reviewed",
      file: {
        file_uuid: fileUuid,
        original_name: originalName,
        mime_type: file.type,
        size_bytes: file.size,
        sha256_hex: sha256Hex,
        version,
        uploaded_at: now,
      },
    },
  }, 201);
}

async function downloadOwnDocument(request, env, fileUuid) {
  requireDocumentsBucket(env);
  const gate = await requireJamaah(request, env);
  if (gate.response) return gate.response;

  const row = await env.DB.prepare(`
    SELECT object_key, original_name, mime_type, size_bytes
    FROM umroh_document_files
    WHERE file_uuid = ? AND account_id = ? AND is_current = 1
    LIMIT 1
  `).bind(fileUuid, gate.account.id).first();

  if (!row) return json(request, env, { ok: false, error: "document_not_found" }, 404);
  return privateObjectResponse(request, env, row);
}

async function listAdminDocuments(request, env) {
  const gate = await requireStaffRole(request, env, ["super_admin", "admin"]);
  if (gate.response) return gate.response;

  const url = new URL(request.url);
  const review = String(url.searchParams.get("review") || "").trim();
  const allowedReview = new Set(["not_reviewed", "verified", "needs_revision", "rejected"]);

  const where = ["a.role = 'jamaah'", "f.is_current = 1"];
  const binds = [];
  if (allowedReview.has(review)) {
    where.push("s.admin_status = ?");
    binds.push(review);
  }

  const result = await env.DB.prepare(`
    SELECT
      f.file_uuid,
      f.document_key,
      f.original_name,
      f.mime_type,
      f.size_bytes,
      f.sha256_hex,
      f.version,
      f.uploaded_at,
      a.account_uuid,
      a.member_no,
      p.full_name,
      s.jamaah_status,
      s.admin_status,
      s.admin_note,
      s.reviewed_at
    FROM umroh_document_files f
    JOIN umroh_accounts a ON a.id = f.account_id
    JOIN umroh_jamaah_profiles p ON p.account_id = a.id
    JOIN umroh_document_status s
      ON s.account_id = f.account_id
     AND s.document_key = f.document_key
    WHERE ${where.join(" AND ")}
    ORDER BY
      CASE s.admin_status
        WHEN 'not_reviewed' THEN 1
        WHEN 'needs_revision' THEN 2
        WHEN 'rejected' THEN 3
        WHEN 'verified' THEN 4
        ELSE 9
      END,
      f.uploaded_at DESC
    LIMIT 250
  `).bind(...binds).all();

  return json(request, env, {
    ok: true,
    documents: result.results || [],
  });
}

async function downloadAdminDocument(request, env, fileUuid) {
  requireDocumentsBucket(env);
  const gate = await requireStaffRole(request, env, ["super_admin", "admin"]);
  if (gate.response) return gate.response;

  const row = await env.DB.prepare(`
    SELECT f.object_key, f.original_name, f.mime_type, f.size_bytes, f.account_id, f.document_key
    FROM umroh_document_files f
    JOIN umroh_accounts a ON a.id = f.account_id
    WHERE f.file_uuid = ? AND f.is_current = 1 AND a.role = 'jamaah'
    LIMIT 1
  `).bind(fileUuid).first();

  if (!row) return json(request, env, { ok: false, error: "document_not_found" }, 404);

  const now = new Date().toISOString();
  await env.DB.prepare(`
    INSERT INTO umroh_admin_audit_log
      (actor_account_id, action, target_account_id, details_json, created_at)
    VALUES (?, 'document_downloaded', ?, ?, ?)
  `).bind(
    gate.account.id,
    row.account_id,
    JSON.stringify({ file_uuid: fileUuid, document_key: row.document_key }),
    now
  ).run();

  return privateObjectResponse(request, env, row);
}

async function reviewAdminDocument(request, env, fileUuid) {
  const gate = await requireStaffRole(request, env, ["super_admin", "admin"]);
  if (gate.response) return gate.response;

  const body = await readJson(request);
  const status = String(body.status || "").trim();
  const note = truncate(String(body.note || "").trim(), 1000);
  const allowed = new Set(["verified", "needs_revision", "rejected", "not_reviewed"]);
  if (!allowed.has(status)) {
    return json(request, env, { ok: false, error: "invalid_review_status" }, 400);
  }
  if (["needs_revision", "rejected"].includes(status) && !note) {
    return json(request, env, { ok: false, error: "review_note_required" }, 400);
  }

  const target = await env.DB.prepare(`
    SELECT f.account_id, f.document_key, f.file_uuid
    FROM umroh_document_files f
    JOIN umroh_accounts a ON a.id = f.account_id
    WHERE f.file_uuid = ? AND f.is_current = 1 AND a.role = 'jamaah'
    LIMIT 1
  `).bind(fileUuid).first();

  if (!target) return json(request, env, { ok: false, error: "document_not_found" }, 404);

  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(`
      UPDATE umroh_document_status
      SET admin_status = ?,
          admin_note = ?,
          reviewed_by_account_id = ?,
          reviewed_at = ?,
          updated_at = ?
      WHERE account_id = ? AND document_key = ?
    `).bind(
      status,
      note || null,
      gate.account.id,
      now,
      now,
      target.account_id,
      target.document_key
    ),
    env.DB.prepare(`
      INSERT INTO umroh_admin_audit_log
        (actor_account_id, action, target_account_id, details_json, created_at)
      VALUES (?, 'document_reviewed', ?, ?, ?)
    `).bind(
      gate.account.id,
      target.account_id,
      JSON.stringify({
        file_uuid: target.file_uuid,
        document_key: target.document_key,
        status,
        note: note || null,
      }),
      now
    ),
  ]);

  return json(request, env, { ok: true });
}

async function privateObjectResponse(request, env, row) {
  const object = await env.DOCUMENTS_BUCKET.get(row.object_key);
  if (!object) {
    return json(request, env, { ok: false, error: "object_missing" }, 404);
  }

  const headers = new Headers();
  headers.set("Content-Type", row.mime_type || "application/octet-stream");
  headers.set("Content-Length", String(row.size_bytes || object.size || ""));
  headers.set("Content-Disposition", `attachment; filename="${contentDispositionFilename(row.original_name)}"`);
  headers.set("Cache-Control", "private, no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Content-Security-Policy", "default-src 'none'; sandbox");

  const origin = allowedOrigin(request, env);
  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Vary", "Origin");
  }

  return new Response(object.body, { status: 200, headers });
}

function safeFilename(value) {
  const cleaned = String(value || "document")
    .replace(/[^\p{L}\p{N}._() -]+/gu, "_")
    .replace(/\s+/g, " ")
    .trim();
  return truncate(cleaned || "document", 180);
}

function contentDispositionFilename(value) {
  return safeFilename(value).replace(/["\\]/g, "_");
}

function matchesDocumentMagic(bytes, mimeType) {
  if (mimeType === "application/pdf") {
    return bytes.length >= 5 &&
      bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 &&
      bytes[3] === 0x46 && bytes[4] === 0x2D;
  }
  if (mimeType === "image/jpeg") {
    return bytes.length >= 3 &&
      bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
  }
  if (mimeType === "image/png") {
    const sig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    return bytes.length >= sig.length && sig.every((value, index) => bytes[index] === value);
  }
  return false;
}

async function requireStaffRole(request, env, allowedRoles = ["super_admin", "admin", "tour_leader", "pendamping"]) {
  const account = await authenticatedAccount(request, env);
  if (!account) {
    return { response: json(request, env, { ok: false, error: "unauthorized" }, 401) };
  }
  if (!allowedRoles.includes(account.role)) {
    return { response: json(request, env, { ok: false, error: "forbidden" }, 403) };
  }
  return { account };
}

async function getAdminJamaahStats(request, env) {
  const gate = await requireStaffRole(request, env);
  if (gate.response) return gate.response;

  const row = await env.DB.prepare(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN account_status = 'active' THEN 1 ELSE 0 END) AS active,
      SUM(CASE WHEN account_status = 'pending_activation' THEN 1 ELSE 0 END) AS pending_activation,
      SUM(CASE WHEN account_status = 'suspended' THEN 1 ELSE 0 END) AS suspended,
      SUM(CASE WHEN account_status = 'disabled' THEN 1 ELSE 0 END) AS disabled
    FROM umroh_accounts
    WHERE role = 'jamaah'
  `).first();

  return json(request, env, {
    ok: true,
    summary: {
      total: Number(row?.total || 0),
      active: Number(row?.active || 0),
      pending_activation: Number(row?.pending_activation || 0),
      suspended: Number(row?.suspended || 0),
      disabled: Number(row?.disabled || 0),
    },
  });
}

async function listAdminJamaah(request, env) {
  const gate = await requireStaffRole(request, env);
  if (gate.response) return gate.response;

  const url = new URL(request.url);
  const search = String(url.searchParams.get("search") || "").trim().toLowerCase();
  const status = String(url.searchParams.get("status") || "").trim();
  const allowedStatus = new Set(["active", "pending_activation", "suspended", "disabled"]);
  const limitRaw = Number(url.searchParams.get("limit") || 100);
  const limit = Math.min(Math.max(Number.isFinite(limitRaw) ? Math.floor(limitRaw) : 100, 1), 200);

  const where = ["a.role = 'jamaah'"];
  const binds = [];

  if (search) {
    where.push(`(
      lower(COALESCE(p.full_name, '')) LIKE ?
      OR lower(COALESCE(a.member_no, '')) LIKE ?
      OR lower(COALESCE(a.email, '')) LIKE ?
      OR lower(COALESCE(a.whatsapp, '')) LIKE ?
      OR lower(COALESCE(p.group_name, '')) LIKE ?
      OR lower(COALESCE(p.departure_batch, '')) LIKE ?
    )`);
    const pattern = `%${search}%`;
    binds.push(pattern, pattern, pattern, pattern, pattern, pattern);
  }

  if (allowedStatus.has(status)) {
    where.push("a.account_status = ?");
    binds.push(status);
  }

  binds.push(limit);

  const result = await env.DB.prepare(`
    SELECT
      a.account_uuid,
      a.member_no,
      a.email,
      a.whatsapp,
      a.account_status,
      CASE WHEN a.password_hash IS NOT NULL THEN 1 ELSE 0 END AS has_password,
      a.last_login_at,
      a.created_at,
      a.updated_at,
      p.full_name,
      p.group_name,
      p.departure_batch,
      p.notes
    FROM umroh_accounts a
    LEFT JOIN umroh_jamaah_profiles p ON p.account_id = a.id
    WHERE ${where.join(" AND ")}
    ORDER BY
      CASE a.account_status
        WHEN 'pending_activation' THEN 1
        WHEN 'active' THEN 2
        WHEN 'suspended' THEN 3
        WHEN 'disabled' THEN 4
        ELSE 9
      END,
      COALESCE(p.full_name, a.member_no) COLLATE NOCASE
    LIMIT ?
  `).bind(...binds).all();

  return json(request, env, {
    ok: true,
    jamaah: result.results || [],
    count: (result.results || []).length,
    filtered: Boolean(search || allowedStatus.has(status)),
  });
}


async function createAdminJamaah(request, env) {
  requireSecrets(env);
  const gate = await requireStaffRole(request, env, ["super_admin", "admin"]);
  if (gate.response) return gate.response;

  const body = await readJson(request);
  const memberNo = normalizeMemberNo(body.member_no);
  const fullName = truncate(String(body.full_name || "").trim(), 160);
  const email = normalizeEmail(body.email || "");
  const whatsapp = normalizePhone(body.whatsapp || "");
  const groupName = truncate(String(body.group_name || "").trim(), 120);
  const departureBatch = truncate(String(body.departure_batch || "").trim(), 120);
  const notes = truncate(String(body.notes || "").trim(), 1000);

  if (!isValidMemberNo(memberNo)) {
    return json(request, env, { ok: false, error: "invalid_member_no" }, 400);
  }
  if (!fullName) {
    return json(request, env, { ok: false, error: "full_name_required" }, 400);
  }
  if (email && !isValidEmail(email)) {
    return json(request, env, { ok: false, error: "invalid_email" }, 400);
  }
  if (whatsapp && !isValidPhone(whatsapp)) {
    return json(request, env, { ok: false, error: "invalid_whatsapp" }, 400);
  }

  const duplicate = await env.DB.prepare(`
    SELECT member_no, email, whatsapp
    FROM umroh_accounts
    WHERE member_no = ?
       OR (? <> '' AND lower(email) = ?)
       OR (? <> '' AND whatsapp = ?)
    LIMIT 1
  `).bind(memberNo, email, email, whatsapp, whatsapp).first();

  if (duplicate) {
    return json(request, env, { ok: false, error: "jamaah_exists" }, 409);
  }

  const accountUuid = crypto.randomUUID();
  const activationCode = generateActivationCode(10);
  const codeHash = await hashActivationCode(activationCode, accountUuid, env.AUTH_PEPPER);
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + STAFF_ACTIVATION_AGE * 1000).toISOString();

  const insert = await env.DB.prepare(`
    INSERT INTO umroh_accounts
      (account_uuid, role, member_no, email, whatsapp, password_hash, account_status,
       created_at, updated_at)
    VALUES (?, 'jamaah', ?, ?, ?, NULL, 'pending_activation', ?, ?)
  `).bind(
    accountUuid,
    memberNo,
    email || null,
    whatsapp || null,
    now,
    now
  ).run();

  const targetId = Number(insert.meta?.last_row_id || 0);

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO umroh_jamaah_profiles
        (account_id, full_name, group_name, departure_batch, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      targetId,
      fullName,
      groupName || null,
      departureBatch || null,
      notes || null,
      now,
      now
    ),
    env.DB.prepare(`
      INSERT INTO umroh_activation_codes
        (account_id, code_hash, expires_at, failed_attempts, created_at)
      VALUES (?, ?, ?, 0, ?)
    `).bind(targetId, codeHash, expiresAt, now),
    env.DB.prepare(`
      INSERT INTO umroh_admin_audit_log
        (actor_account_id, action, target_account_id, details_json, created_at)
      VALUES (?, 'jamaah_created', ?, ?, ?)
    `).bind(
      gate.account.id,
      targetId,
      JSON.stringify({
        member_no: memberNo,
        full_name: fullName,
        group_name: groupName || null,
        departure_batch: departureBatch || null,
      }),
      now
    ),
  ]);

  return json(request, env, {
    ok: true,
    jamaah: {
      account_uuid: accountUuid,
      member_no: memberNo,
      full_name: fullName,
      email: email || null,
      whatsapp: whatsapp || null,
      group_name: groupName || null,
      departure_batch: departureBatch || null,
      notes: notes || null,
      account_status: "pending_activation",
    },
    activation: {
      code: activationCode,
      expires_at: expiresAt,
      one_time_display: true,
    },
  }, 201);
}

async function updateAdminJamaah(request, env, accountUuid) {
  const gate = await requireStaffRole(request, env, ["super_admin", "admin"]);
  if (gate.response) return gate.response;

  const target = await env.DB.prepare(`
    SELECT
      a.id, a.account_uuid, a.member_no, a.email, a.whatsapp,
      a.account_status, a.password_hash,
      p.full_name, p.group_name, p.departure_batch, p.notes
    FROM umroh_accounts a
    JOIN umroh_jamaah_profiles p ON p.account_id = a.id
    WHERE a.account_uuid = ? AND a.role = 'jamaah'
    LIMIT 1
  `).bind(accountUuid).first();

  if (!target) {
    return json(request, env, { ok: false, error: "jamaah_not_found" }, 404);
  }

  const body = await readJson(request);
  const accountUpdates = [];
  const accountBinds = [];
  const profileUpdates = [];
  const profileBinds = [];
  const changes = {};

  if (Object.prototype.hasOwnProperty.call(body, "member_no")) {
    const value = normalizeMemberNo(body.member_no);
    if (!isValidMemberNo(value)) {
      return json(request, env, { ok: false, error: "invalid_member_no" }, 400);
    }
    const duplicate = await env.DB.prepare(`
      SELECT id FROM umroh_accounts WHERE member_no = ? AND id <> ? LIMIT 1
    `).bind(value, target.id).first();
    if (duplicate) return json(request, env, { ok: false, error: "member_no_exists" }, 409);
    accountUpdates.push("member_no = ?");
    accountBinds.push(value);
    changes.member_no = { from: target.member_no, to: value };
  }

  if (Object.prototype.hasOwnProperty.call(body, "email")) {
    const value = normalizeEmail(body.email || "");
    if (value && !isValidEmail(value)) {
      return json(request, env, { ok: false, error: "invalid_email" }, 400);
    }
    if (value) {
      const duplicate = await env.DB.prepare(`
        SELECT id FROM umroh_accounts WHERE lower(email) = ? AND id <> ? LIMIT 1
      `).bind(value, target.id).first();
      if (duplicate) return json(request, env, { ok: false, error: "email_exists" }, 409);
    }
    accountUpdates.push("email = ?");
    accountBinds.push(value || null);
    changes.email = { from: target.email || null, to: value || null };
  }

  if (Object.prototype.hasOwnProperty.call(body, "whatsapp")) {
    const value = normalizePhone(body.whatsapp || "");
    if (value && !isValidPhone(value)) {
      return json(request, env, { ok: false, error: "invalid_whatsapp" }, 400);
    }
    if (value) {
      const duplicate = await env.DB.prepare(`
        SELECT id FROM umroh_accounts WHERE whatsapp = ? AND id <> ? LIMIT 1
      `).bind(value, target.id).first();
      if (duplicate) return json(request, env, { ok: false, error: "whatsapp_exists" }, 409);
    }
    accountUpdates.push("whatsapp = ?");
    accountBinds.push(value || null);
    changes.whatsapp = { from: target.whatsapp || null, to: value || null };
  }

  if (Object.prototype.hasOwnProperty.call(body, "account_status")) {
    const value = String(body.account_status || "").trim();
    if (!new Set(["active", "suspended", "disabled"]).has(value)) {
      return json(request, env, { ok: false, error: "invalid_status" }, 400);
    }
    if (value === "active" && !target.password_hash) {
      return json(request, env, { ok: false, error: "activation_required" }, 409);
    }
    accountUpdates.push("account_status = ?");
    accountBinds.push(value);
    changes.account_status = { from: target.account_status, to: value };
  }

  if (Object.prototype.hasOwnProperty.call(body, "full_name")) {
    const value = truncate(String(body.full_name || "").trim(), 160);
    if (!value) return json(request, env, { ok: false, error: "full_name_required" }, 400);
    profileUpdates.push("full_name = ?");
    profileBinds.push(value);
    changes.full_name = { from: target.full_name, to: value };
  }

  if (Object.prototype.hasOwnProperty.call(body, "group_name")) {
    const value = truncate(String(body.group_name || "").trim(), 120);
    profileUpdates.push("group_name = ?");
    profileBinds.push(value || null);
    changes.group_name = { from: target.group_name || null, to: value || null };
  }

  if (Object.prototype.hasOwnProperty.call(body, "departure_batch")) {
    const value = truncate(String(body.departure_batch || "").trim(), 120);
    profileUpdates.push("departure_batch = ?");
    profileBinds.push(value || null);
    changes.departure_batch = { from: target.departure_batch || null, to: value || null };
  }

  if (Object.prototype.hasOwnProperty.call(body, "notes")) {
    const value = truncate(String(body.notes || "").trim(), 1000);
    profileUpdates.push("notes = ?");
    profileBinds.push(value || null);
    changes.notes = { from: target.notes || null, to: value || null };
  }

  if (!accountUpdates.length && !profileUpdates.length) {
    return json(request, env, { ok: false, error: "no_changes" }, 400);
  }

  const now = new Date().toISOString();
  const statements = [];

  if (accountUpdates.length) {
    accountUpdates.push("updated_at = ?");
    accountBinds.push(now, target.id);
    statements.push(
      env.DB.prepare(`
        UPDATE umroh_accounts
        SET ${accountUpdates.join(", ")}
        WHERE id = ?
      `).bind(...accountBinds)
    );
  }

  if (profileUpdates.length) {
    profileUpdates.push("updated_at = ?");
    profileBinds.push(now, target.id);
    statements.push(
      env.DB.prepare(`
        UPDATE umroh_jamaah_profiles
        SET ${profileUpdates.join(", ")}
        WHERE account_id = ?
      `).bind(...profileBinds)
    );
  }

  if (changes.account_status && changes.account_status.to !== "active") {
    statements.push(
      env.DB.prepare(`
        UPDATE umroh_sessions
        SET revoked_at = ?
        WHERE account_id = ? AND revoked_at IS NULL
      `).bind(now, target.id)
    );
  }

  statements.push(
    env.DB.prepare(`
      INSERT INTO umroh_admin_audit_log
        (actor_account_id, action, target_account_id, details_json, created_at)
      VALUES (?, 'jamaah_updated', ?, ?, ?)
    `).bind(gate.account.id, target.id, JSON.stringify(changes), now)
  );

  await env.DB.batch(statements);
  return json(request, env, { ok: true });
}

async function resetJamaahAccess(request, env, accountUuid) {
  requireSecrets(env);
  const gate = await requireStaffRole(request, env, ["super_admin", "admin"]);
  if (gate.response) return gate.response;

  const target = await env.DB.prepare(`
    SELECT a.id, a.account_uuid, a.member_no, p.full_name
    FROM umroh_accounts a
    JOIN umroh_jamaah_profiles p ON p.account_id = a.id
    WHERE a.account_uuid = ? AND a.role = 'jamaah'
    LIMIT 1
  `).bind(accountUuid).first();

  if (!target) {
    return json(request, env, { ok: false, error: "jamaah_not_found" }, 404);
  }

  const activationCode = generateActivationCode(10);
  const codeHash = await hashActivationCode(
    activationCode,
    target.account_uuid,
    env.AUTH_PEPPER
  );
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + STAFF_ACTIVATION_AGE * 1000).toISOString();

  await env.DB.batch([
    env.DB.prepare(`
      UPDATE umroh_activation_codes
      SET used_at = COALESCE(used_at, ?)
      WHERE account_id = ? AND used_at IS NULL
    `).bind(now, target.id),
    env.DB.prepare(`
      INSERT INTO umroh_activation_codes
        (account_id, code_hash, expires_at, failed_attempts, created_at)
      VALUES (?, ?, ?, 0, ?)
    `).bind(target.id, codeHash, expiresAt, now),
    env.DB.prepare(`
      UPDATE umroh_accounts
      SET password_hash = NULL,
          account_status = 'pending_activation',
          password_changed_at = NULL,
          updated_at = ?
      WHERE id = ?
    `).bind(now, target.id),
    env.DB.prepare(`
      UPDATE umroh_sessions
      SET revoked_at = ?
      WHERE account_id = ? AND revoked_at IS NULL
    `).bind(now, target.id),
    env.DB.prepare(`
      INSERT INTO umroh_admin_audit_log
        (actor_account_id, action, target_account_id, details_json, created_at)
      VALUES (?, 'jamaah_reset_access', ?, ?, ?)
    `).bind(
      gate.account.id,
      target.id,
      JSON.stringify({ member_no: target.member_no, full_name: target.full_name }),
      now
    ),
  ]);

  return json(request, env, {
    ok: true,
    activation: {
      code: activationCode,
      expires_at: expiresAt,
      one_time_display: true,
    },
  });
}

async function requireSuperAdmin(request, env) {
  const account = await authenticatedAccount(request, env);
  if (!account) {
    return { response: json(request, env, { ok: false, error: "unauthorized" }, 401) };
  }
  if (account.role !== "super_admin") {
    return { response: json(request, env, { ok: false, error: "forbidden" }, 403) };
  }
  return { account };
}

async function listAdminAccounts(request, env) {
  const gate = await requireSuperAdmin(request, env);
  if (gate.response) return gate.response;

  const result = await env.DB.prepare(`
    SELECT
      account_uuid, role, username, email, whatsapp, account_status,
      display_name, job_title, last_login_at, created_at, updated_at
    FROM umroh_accounts
    WHERE role IN ('super_admin', 'admin', 'tour_leader', 'pendamping')
    ORDER BY
      CASE role
        WHEN 'super_admin' THEN 1
        WHEN 'admin' THEN 2
        WHEN 'tour_leader' THEN 3
        WHEN 'pendamping' THEN 4
        ELSE 9
      END,
      COALESCE(display_name, username) COLLATE NOCASE
  `).all();

  return json(request, env, {
    ok: true,
    accounts: result.results || [],
  });
}

async function createAdminAccount(request, env) {
  const gate = await requireSuperAdmin(request, env);
  if (gate.response) return gate.response;

  const body = await readJson(request);
  const username = normalizeUsername(body.username);
  const email = normalizeEmail(body.email || "");
  const displayName = truncate(String(body.display_name || "").trim(), 120);
  const jobTitle = truncate(String(body.job_title || "").trim(), 120);
  const role = String(body.role || "").trim();

  const allowedRoles = new Set(["admin", "tour_leader", "pendamping"]);
  if (!allowedRoles.has(role)) {
    return json(request, env, { ok: false, error: "invalid_role" }, 400);
  }
  if (!isValidUsername(username)) {
    return json(request, env, { ok: false, error: "invalid_username" }, 400);
  }
  if (!displayName) {
    return json(request, env, { ok: false, error: "display_name_required" }, 400);
  }

  const duplicate = await env.DB.prepare(`
    SELECT account_uuid
    FROM umroh_accounts
    WHERE username = ?
       OR (? <> '' AND lower(email) = ?)
    LIMIT 1
  `).bind(username, email, email).first();

  if (duplicate) {
    return json(request, env, { ok: false, error: "account_exists" }, 409);
  }

  const accountUuid = crypto.randomUUID();
  const activationCode = generateActivationCode(10);
  const codeHash = await hashActivationCode(activationCode, accountUuid, env.AUTH_PEPPER);
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + STAFF_ACTIVATION_AGE * 1000).toISOString();

  const insert = await env.DB.prepare(`
    INSERT INTO umroh_accounts
      (account_uuid, role, username, email, password_hash, account_status,
       display_name, job_title, created_at, updated_at)
    VALUES (?, ?, ?, ?, NULL, 'pending_activation', ?, ?, ?, ?)
  `).bind(
    accountUuid,
    role,
    username,
    email || null,
    displayName,
    jobTitle || null,
    now,
    now
  ).run();

  const targetId = Number(insert.meta?.last_row_id || 0);

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO umroh_activation_codes
        (account_id, code_hash, expires_at, failed_attempts, created_at)
      VALUES (?, ?, ?, 0, ?)
    `).bind(targetId, codeHash, expiresAt, now),
    env.DB.prepare(`
      INSERT INTO umroh_admin_audit_log
        (actor_account_id, action, target_account_id, details_json, created_at)
      VALUES (?, 'account_created', ?, ?, ?)
    `).bind(
      gate.account.id,
      targetId,
      JSON.stringify({ role, username, display_name: displayName, job_title: jobTitle || null }),
      now
    ),
  ]);

  return json(request, env, {
    ok: true,
    account: {
      account_uuid: accountUuid,
      role,
      username,
      email: email || null,
      display_name: displayName,
      job_title: jobTitle || null,
      account_status: "pending_activation",
    },
    activation: {
      code: activationCode,
      expires_at: expiresAt,
      one_time_display: true,
    },
  }, 201);
}

async function updateAdminAccount(request, env, accountUuid) {
  const gate = await requireSuperAdmin(request, env);
  if (gate.response) return gate.response;

  const target = await env.DB.prepare(`
    SELECT id, account_uuid, role, username, account_status, display_name, job_title
    FROM umroh_accounts
    WHERE account_uuid = ?
      AND role IN ('super_admin', 'admin', 'tour_leader', 'pendamping')
    LIMIT 1
  `).bind(accountUuid).first();

  if (!target) {
    return json(request, env, { ok: false, error: "account_not_found" }, 404);
  }
  if (target.role === "super_admin") {
    return json(request, env, { ok: false, error: "super_admin_protected" }, 403);
  }

  const body = await readJson(request);
  const updates = [];
  const binds = [];
  const changes = {};

  if (Object.prototype.hasOwnProperty.call(body, "role")) {
    const role = String(body.role || "").trim();
    if (!new Set(["admin", "tour_leader", "pendamping"]).has(role)) {
      return json(request, env, { ok: false, error: "invalid_role" }, 400);
    }
    updates.push("role = ?");
    binds.push(role);
    changes.role = { from: target.role, to: role };
  }

  if (Object.prototype.hasOwnProperty.call(body, "account_status")) {
    const status = String(body.account_status || "").trim();
    if (!new Set(["active", "suspended", "disabled"]).has(status)) {
      return json(request, env, { ok: false, error: "invalid_status" }, 400);
    }
    updates.push("account_status = ?");
    binds.push(status);
    changes.account_status = { from: target.account_status, to: status };
  }

  if (Object.prototype.hasOwnProperty.call(body, "display_name")) {
    const value = truncate(String(body.display_name || "").trim(), 120);
    if (!value) return json(request, env, { ok: false, error: "display_name_required" }, 400);
    updates.push("display_name = ?");
    binds.push(value);
    changes.display_name = { from: target.display_name || null, to: value };
  }

  if (Object.prototype.hasOwnProperty.call(body, "job_title")) {
    const value = truncate(String(body.job_title || "").trim(), 120);
    updates.push("job_title = ?");
    binds.push(value || null);
    changes.job_title = { from: target.job_title || null, to: value || null };
  }

  if (!updates.length) {
    return json(request, env, { ok: false, error: "no_changes" }, 400);
  }

  const now = new Date().toISOString();
  updates.push("updated_at = ?");
  binds.push(now);
  binds.push(target.id);

  const statements = [
    env.DB.prepare(`
      UPDATE umroh_accounts
      SET ${updates.join(", ")}
      WHERE id = ?
    `).bind(...binds),
    env.DB.prepare(`
      INSERT INTO umroh_admin_audit_log
        (actor_account_id, action, target_account_id, details_json, created_at)
      VALUES (?, 'account_updated', ?, ?, ?)
    `).bind(gate.account.id, target.id, JSON.stringify(changes), now),
  ];

  if (changes.account_status && changes.account_status.to !== "active") {
    statements.push(
      env.DB.prepare(`
        UPDATE umroh_sessions
        SET revoked_at = ?
        WHERE account_id = ? AND revoked_at IS NULL
      `).bind(now, target.id)
    );
  }

  await env.DB.batch(statements);

  return json(request, env, { ok: true });
}

async function resetAdminPassword(request, env, accountUuid) {
  const gate = await requireSuperAdmin(request, env);
  if (gate.response) return gate.response;

  const target = await env.DB.prepare(`
    SELECT id, account_uuid, role, username, account_status
    FROM umroh_accounts
    WHERE account_uuid = ?
      AND role IN ('admin', 'tour_leader', 'pendamping')
    LIMIT 1
  `).bind(accountUuid).first();

  if (!target) {
    return json(request, env, { ok: false, error: "account_not_found" }, 404);
  }

  const activationCode = generateActivationCode(10);
  const codeHash = await hashActivationCode(
    activationCode,
    target.account_uuid,
    env.AUTH_PEPPER
  );
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + STAFF_ACTIVATION_AGE * 1000).toISOString();

  await env.DB.batch([
    env.DB.prepare(`
      UPDATE umroh_activation_codes
      SET used_at = COALESCE(used_at, ?)
      WHERE account_id = ? AND used_at IS NULL
    `).bind(now, target.id),
    env.DB.prepare(`
      INSERT INTO umroh_activation_codes
        (account_id, code_hash, expires_at, failed_attempts, created_at)
      VALUES (?, ?, ?, 0, ?)
    `).bind(target.id, codeHash, expiresAt, now),
    env.DB.prepare(`
      UPDATE umroh_accounts
      SET password_hash = NULL,
          account_status = 'pending_activation',
          password_changed_at = NULL,
          updated_at = ?
      WHERE id = ?
    `).bind(now, target.id),
    env.DB.prepare(`
      UPDATE umroh_sessions
      SET revoked_at = ?
      WHERE account_id = ? AND revoked_at IS NULL
    `).bind(now, target.id),
    env.DB.prepare(`
      INSERT INTO umroh_admin_audit_log
        (actor_account_id, action, target_account_id, details_json, created_at)
      VALUES (?, 'password_reset_requested', ?, ?, ?)
    `).bind(
      gate.account.id,
      target.id,
      JSON.stringify({ username: target.username }),
      now
    ),
  ]);

  return json(request, env, {
    ok: true,
    activation: {
      code: activationCode,
      expires_at: expiresAt,
      one_time_display: true,
    },
  });
}

async function listAdminAuditLog(request, env) {
  const gate = await requireSuperAdmin(request, env);
  if (gate.response) return gate.response;

  const result = await env.DB.prepare(`
    SELECT
      l.id,
      l.action,
      l.details_json,
      l.created_at,
      actor.account_uuid AS actor_account_uuid,
      actor.username AS actor_username,
      COALESCE(actor.display_name, actor_profile.full_name, actor.username, actor.member_no) AS actor_name,
      target.account_uuid AS target_account_uuid,
      target.username AS target_username,
      COALESCE(target.display_name, target_profile.full_name, target.username, target.member_no) AS target_name
    FROM umroh_admin_audit_log l
    LEFT JOIN umroh_accounts actor ON actor.id = l.actor_account_id
    LEFT JOIN umroh_jamaah_profiles actor_profile ON actor_profile.account_id = actor.id
    LEFT JOIN umroh_accounts target ON target.id = l.target_account_id
    LEFT JOIN umroh_jamaah_profiles target_profile ON target_profile.account_id = target.id
    ORDER BY l.id DESC
    LIMIT 50
  `).all();

  return json(request, env, {
    ok: true,
    logs: result.results || [],
  });
}

function generateActivationCode(length = 10) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let value = "";
  for (const byte of bytes) {
    value += alphabet[byte % alphabet.length];
  }
  return value;
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


function normalizeMemberNo(value) {
  return String(value || "").trim().toUpperCase();
}

function isValidMemberNo(value) {
  return /^[A-Z0-9][A-Z0-9._/-]{2,39}$/.test(value);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 16;
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
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
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
