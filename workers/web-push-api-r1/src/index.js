import webpush from "web-push";

const SERVICE = "srilexbuditra-web-push-api-r1";
const SITE_ORIGIN = "https://srilexbuditra.work";
const MAX_JSON_BYTES = 12 * 1024;

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer"
    }
  });

const sha256Hex = async value => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  );

  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
};

// Compare fixed-length digests without an early exit. Timing is also bounded by
// the upstream gateway; this comparison is not an account authentication system.
const secureEqual = async (left, right) => {
  if (!left || !right) return false;
  const [a, b] = await Promise.all([sha256Hex(left), sha256Hex(right)]);
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
};

const allowedBrowserOrigin = request =>
  request.headers.get("Origin") === SITE_ORIGIN;

const readJson = async request => {
  const contentType = request.headers.get("Content-Type") || "";
  if (!/^application\/json(?:\s*;|\s*$)/i.test(contentType)) throw { status: 415 };
  const declared = request.headers.get("Content-Length");
  if (declared && Number(declared) > MAX_JSON_BYTES) throw { status: 413 };
  if (!request.body) return {};
  const reader = request.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_JSON_BYTES) throw { status: 413 };
      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const part of chunks) { bytes.set(part, offset); offset += part.byteLength; }
  try { return JSON.parse(new TextDecoder().decode(bytes) || "{}"); }
  catch { throw { status: 400 }; }
};

const payloadError = error => {
  if (error?.status === 413) return json({ error: "Payload too large." }, 413);
  if (error?.status === 415) return json({ error: "Content-Type must be application/json." }, 415);
  return json({ error: "Invalid JSON payload." }, 400);
};

// Conservative providers. Extend only after a documented, reviewed provider test.
const pushHostAllowed = host =>
  host === "fcm.googleapis.com" ||
  host === "updates.push.services.mozilla.com" ||
  host === "push.services.mozilla.com" ||
  host === "web.push.apple.com" ||
  (host.endsWith(".push.apple.com") && host !== ".push.apple.com");

const validEndpoint = endpoint => {
  if (typeof endpoint !== "string" || !endpoint || endpoint.length > 4096) return false;
  try {
    const url = new URL(endpoint);
    return url.protocol === "https:" && !url.username && !url.password &&
      !url.port && !url.hash && pushHostAllowed(url.hostname) &&
      url.hostname === url.hostname.toLowerCase() &&
      !url.hostname.endsWith(".");
  } catch { return false; }
};

const decodedKey = (value, length) => {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]+$/.test(value)) return false;
  if (value.length > 200) return false;
  const bytes = Math.floor(value.length * 3 / 4);
  return bytes === length && (length === 65 ? value.length === 87 : value.length === 22);
};

const normalizeSubscription = value => {
  const endpoint = value?.endpoint;
  const p256dh = value?.keys?.p256dh;
  const auth = value?.keys?.auth;
  if (!validEndpoint(endpoint) || !decodedKey(p256dh, 65) || !decodedKey(auth, 16)) return null;
  let expirationTime = null;
  if (value?.expirationTime != null) {
    if (typeof value.expirationTime !== "number" || !Number.isSafeInteger(value.expirationTime) || value.expirationTime < 0) return null;
    expirationTime = value.expirationTime;
  }
  return { endpoint, p256dh, auth, expirationTime };
};

const ownershipHash = async body => {
  const token = body?.ownership_token;
  return typeof token === "string" && /^[a-f0-9]{64}$/.test(token)
    ? sha256Hex(token) : null;
};

const safeNotificationPath = value => {
  try {
    const url = new URL(
      typeof value === "string" && value.trim()
        ? value
        : "/",
      SITE_ORIGIN
    );

    if (url.origin !== SITE_ORIGIN) {
      return "/";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  }
  catch {
    return "/";
  }
};

const health = async env => {
  if (!env.DB) {
    return json({
      ok: false,
      service: SERVICE,
      database: false
    }, 503);
  }

  try {
    await env.DB.prepare("SELECT 1 AS ok").first();

    return json({
      ok: true,
      service: SERVICE,
      database: true,
      vapid_public_key_configured:
        Boolean(String(env.VAPID_PUBLIC_KEY || "").trim()),
      vapid_private_key_configured:
        Boolean(String(env.VAPID_PRIVATE_KEY || "").trim())
    });
  }
  catch {
    return json({
      ok: false,
      service: SERVICE,
      database: false
    }, 503);
  }
};

const publicKey = env => {
  const value =
    String(env.VAPID_PUBLIC_KEY || "").trim();

  return value
    ? json({ public_key: value })
    : json(
        { error: "VAPID public key is not configured." },
        503
      );
};

const subscribe = async (request, env) => {
  if (!allowedBrowserOrigin(request)) return json({ error: "Origin not allowed." }, 403);
  if (!env.DB) return json({ error: "Push database is unavailable." }, 503);
  let body;
  try { body = await readJson(request); } catch (error) { return payloadError(error); }
  const item = normalizeSubscription(body?.subscription);
  const tokenHash = await ownershipHash(body);
  if (!item || !tokenHash) return json({ error: "Invalid subscription or ownership token." }, 400);
  const endpointHash = await sha256Hex(item.endpoint);
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  // INSERT OR IGNORE is safe against simultaneous first registrations. The
  // losing request may only UPDATE when it knows the accepted credential.
  const inserted = await env.DB.prepare(
    `INSERT OR IGNORE INTO push_subscriptions
     (id,endpoint_hash,endpoint,p256dh,auth,expiration_time,ownership_token_hash,
      status,failure_count,created_at,updated_at,last_seen_at)
     VALUES (?,?,?,?,?,?,?,'active',0,?,?,?)`
  ).bind(id, endpointHash, item.endpoint, item.p256dh, item.auth,
    item.expirationTime, tokenHash, now, now, now).run();
  if (inserted.meta?.changes === 1) return json({ ok: true, subscription_id: id, status: "active" });
  const updated = await env.DB.prepare(
    `UPDATE push_subscriptions SET endpoint=?,p256dh=?,auth=?,expiration_time=?,
      status='active',failure_count=0,revision=revision+1,updated_at=?,last_seen_at=?
      WHERE endpoint_hash=? AND ownership_token_hash=?`
  ).bind(item.endpoint,item.p256dh,item.auth,item.expirationTime,
    now,now,endpointHash,tokenHash).run();
  if (updated.meta?.changes !== 1) return json({ error: "Subscription ownership could not be verified." }, 403);
  const row = await env.DB.prepare(
    `SELECT id FROM push_subscriptions WHERE endpoint_hash=? AND ownership_token_hash=?`
  ).bind(endpointHash,tokenHash).first();
  return json({ ok: true, subscription_id: row.id, status: "active" });
};

const unsubscribe = async (request, env) => {
  if (!allowedBrowserOrigin(request)) return json({ error: "Origin not allowed." }, 403);
  if (!env.DB) return json({ error: "Push database is unavailable." }, 503);
  let body;
  try { body = await readJson(request); } catch (error) { return payloadError(error); }
  const endpoint = body?.endpoint;
  const tokenHash = await ownershipHash(body);
  if (!validEndpoint(endpoint) || !tokenHash) return json({ error: "Invalid subscription or ownership token." }, 400);
  const endpointHash = await sha256Hex(endpoint);
  const result = await env.DB.prepare(
    `DELETE FROM push_subscriptions WHERE endpoint_hash=? AND ownership_token_hash=?`
  ).bind(endpointHash,tokenHash).run();
  return result.meta?.changes === 1
    ? json({ ok: true })
    : json({ error: "Subscription ownership could not be verified." }, 403);
};

const status = async (request, env) => {
  if (!allowedBrowserOrigin(request)) return json({ error: "Origin not allowed." }, 403);
  if (!env.DB) return json({ error: "Push database is unavailable." }, 503);
  let body;
  try { body = await readJson(request); } catch (error) { return payloadError(error); }
  const endpoint = body?.endpoint;
  const tokenHash = await ownershipHash(body);
  if (!validEndpoint(endpoint) || !tokenHash) return json({ error: "Invalid subscription or ownership token." }, 400);
  const endpointHash = await sha256Hex(endpoint);
  const row = await env.DB.prepare(
    `SELECT status,ownership_token_hash FROM push_subscriptions WHERE endpoint_hash=?`
  ).bind(endpointHash).first();
  if (!row) return json({ ok: true, status: "missing" });
  if (!(await secureEqual(row.ownership_token_hash,tokenHash)))
    return json({ error: "Subscription ownership could not be verified." }, 403);
  return json({ ok: true, status: row.status });
};

const sendTest = async (request, env) => {
  const configuredToken =
    String(env.PUSH_ADMIN_TOKEN || "").trim();

  const authorization =
    request.headers.get("Authorization") || "";

  const suppliedToken =
    authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : "";

  if (
    !configuredToken ||
    !(await secureEqual(configuredToken, suppliedToken))
  ) {
    return json({ error: "Unauthorized." }, 401);
  }

  if (
    !env.DB ||
    !String(env.VAPID_PUBLIC_KEY || "").trim() ||
    !String(env.VAPID_PRIVATE_KEY || "").trim() ||
    !String(env.VAPID_SUBJECT || "").trim()
  ) {
    return json(
      { error: "Push service configuration is incomplete." },
      503
    );
  }

  let body;

  try {
    body = await readJson(request);
  }
  catch (error) {
    return payloadError(error);
  }

  const id =
    String(body?.subscription_id || "").trim();

  if (!id || id.length > 128) {
    return json(
      { error: "Valid subscription_id is required." },
      400
    );
  }

  const row =
    await env.DB.prepare(
      `SELECT id, endpoint, p256dh, auth, status, revision
         FROM push_subscriptions
        WHERE id = ?`
    )
      .bind(id)
      .first();

  if (!row || row.status !== "active") {
    return json(
      { error: "Active subscription not found." },
      404
    );
  }

  if (!validEndpoint(row.endpoint) ||
      !decodedKey(row.p256dh, 65) || !decodedKey(row.auth, 16)) {
    return json({ error: "Stored push endpoint or keys are not allowed." }, 422);
  }

  const reservedAt = new Date().toISOString();
  const cutoff = new Date(Date.now() - 60000).toISOString();
  const reserved = await env.DB.prepare(
      `UPDATE push_subscriptions SET last_test_at=?
       WHERE id=? AND status='active'
         AND revision=?
         AND endpoint=? AND p256dh=? AND auth=?
         AND (last_test_at IS NULL OR last_test_at <= ?)`
    ).bind(reservedAt,id,row.revision,row.endpoint,row.p256dh,row.auth,cutoff).run();
  if (reserved.meta?.changes !== 1) return json({ error: "Send-test rate limit reached." }, 429);

  const title =
    String(body?.title || "Srilex Buditra")
      .trim()
      .slice(0, 120) || "Srilex Buditra";

  const message =
    String(
      body?.body ||
      "Notifikasi uji dari srilexbuditra.work."
    )
      .trim()
      .slice(0, 320) ||
      "Notifikasi uji dari srilexbuditra.work.";

  const payload =
    JSON.stringify({
      title,
      body: message,
      url: safeNotificationPath(body?.url),
      tag: "srilexbuditra-test"
    });

  webpush.setVapidDetails(
    String(env.VAPID_SUBJECT).trim(),
    String(env.VAPID_PUBLIC_KEY).trim(),
    String(env.VAPID_PRIVATE_KEY).trim()
  );

  const now =
    new Date().toISOString();

  try {
    const result =
      await webpush.sendNotification(
        {
          endpoint: row.endpoint,
          keys: {
            p256dh: row.p256dh,
            auth: row.auth
          }
        },
        payload,
        {
          TTL: 60,
          timeout: 10000
        }
      );

    await env.DB.prepare(
      `UPDATE push_subscriptions
           SET failure_count = 0,
               last_success_at = ?,
               updated_at = ?
         WHERE id = ? AND status='active'
           AND endpoint=? AND p256dh=? AND auth=?
           AND last_test_at=?
           AND revision=?`
    )
      .bind(now, now, id, row.endpoint, row.p256dh, row.auth, reservedAt, row.revision)
      .run();

    return json({
      ok: true,
      subscription_id: id,
      push_status: Number.isInteger(result?.statusCode) ? result.statusCode : null
    });
  }
  catch (error) {
    const statusCode =
      Number(error?.statusCode || 0);

    let expiredRemoved = false;
    if (statusCode === 404 || statusCode === 410) {
      const deletion = await env.DB.prepare(
        `DELETE FROM push_subscriptions
         WHERE id = ? AND status='active'
           AND endpoint=? AND p256dh=? AND auth=?
           AND last_test_at=?
           AND revision=?`
      )
        .bind(id, row.endpoint, row.p256dh, row.auth, reservedAt, row.revision)
        .run();
      expiredRemoved = deletion.meta?.changes === 1;
    }
    else {
      await env.DB.prepare(
        `UPDATE push_subscriptions
             SET failure_count = failure_count + 1,
                 last_failure_at = ?,
                 updated_at = ?
           WHERE id = ? AND status='active'
             AND endpoint=? AND p256dh=? AND auth=?
             AND last_test_at=?
           AND revision=?`
      )
        .bind(now, now, id, row.endpoint, row.p256dh, row.auth, reservedAt, row.revision)
        .run();
    }

    console.error("REV22 push send failed", { statusCode });

    return json(
      {
        error:
          (statusCode === 404 || statusCode === 410)
              ? (expiredRemoved
                  ? "Subscription expired and was removed."
                  : "Push delivery failed; subscription was not removed.")
              : "Push delivery failed.",
        push_status: statusCode || null
      },
      502
    );
  }
};

export default {
  async fetch(request, env) {
    const path =
      new URL(request.url).pathname;

    if (path === "/api/push/health") {
      return request.method === "GET"
        ? health(env)
        : json({ error: "Method not allowed." }, 405);
    }

    if (path === "/api/push/public-key") {
      return request.method === "GET"
        ? publicKey(env)
        : json({ error: "Method not allowed." }, 405);
    }

    if (path === "/api/push/subscribe") {
      return request.method === "POST"
        ? subscribe(request, env)
        : json({ error: "Method not allowed." }, 405);
    }

    if (path === "/api/push/unsubscribe") {
      return request.method === "POST"
        ? unsubscribe(request, env)
        : json({ error: "Method not allowed." }, 405);
    }

    if (path === "/api/push/status") {
      return request.method === "POST"
        ? status(request, env)
        : json({ error: "Method not allowed." }, 405);
    }

    if (path === "/api/push/send-test") {
      return request.method === "POST"
        ? sendTest(request, env)
        : json({ error: "Method not allowed." }, 405);
    }

    return json({ error: "Not found." }, 404);
  }
};