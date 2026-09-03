/* V30 Cloudflare Worker + KV verification API.
 * Create a KV namespace and bind it as VERIFY_DB.
 * Set an environment secret named PUBLISHER_TOKEN.
 *
 * Public endpoints:
 *   GET /health
 *   GET /documents/:id
 *
 * Publisher endpoint:
 *   POST /documents
 */

const PUBLISHER_ORIGINS = new Set([
  'https://srilexbuditra.work',
  'https://www.srilexbuditra.work',
  'https://srilexbuditra.github.io',
]);

const BASE_CORS = {
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Max-Age': '86400',
};

function corsHeaders(req, publisherOnly = false) {
  const origin = req.headers.get('Origin');

  if (!publisherOnly) {
    return { ...BASE_CORS, 'Access-Control-Allow-Origin': '*' };
  }

  if (origin && PUBLISHER_ORIGINS.has(origin)) {
    return { ...BASE_CORS, 'Access-Control-Allow-Origin': origin, Vary: 'Origin' };
  }

  return { ...BASE_CORS, Vary: 'Origin' };
}

function json(req, data, status = 200, publisherOnly = false) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...corsHeaders(req, publisherOnly),
    },
  });
}

function isAllowedPublisherOrigin(req) {
  const origin = req.headers.get('Origin');
  // Requests without Origin (for example curl/server-to-server) still require
  // the Publisher Token and are allowed.
  return !origin || PUBLISHER_ORIGINS.has(origin);
}

function authorized(req, env) {
  const token = typeof env.PUBLISHER_TOKEN === 'string' ? env.PUBLISHER_TOKEN.trim() : '';
  if (!token) return false;
  return (req.headers.get('Authorization') || '') === `Bearer ${token}`;
}

function normalizeId(value) {
  const id = String(value || '').trim().toUpperCase();
  if (!id || id.length > 100 || !/^[A-Z0-9._:-]+$/.test(id)) return '';
  return id;
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const isPublisherRoute = url.pathname === '/documents';

    if (req.method === 'OPTIONS') {
      if (isPublisherRoute && !isAllowedPublisherOrigin(req)) {
        return json(req, { error: 'origin_not_allowed' }, 403, true);
      }
      return new Response(null, {
        status: 204,
        headers: corsHeaders(req, isPublisherRoute),
      });
    }

    if (url.pathname === '/health') {
      if (req.method !== 'GET') return json(req, { error: 'method_not_allowed' }, 405);
      return json(req, { ok: true, service: 'Srilex Buditra verification API' });
    }

    if (url.pathname.startsWith('/documents/')) {
      if (req.method !== 'GET') return json(req, { error: 'method_not_allowed' }, 405);

      let decodedId;
      try {
        decodedId = decodeURIComponent(url.pathname.slice('/documents/'.length));
      } catch {
        return json(req, { error: 'invalid_id' }, 400);
      }

      const id = normalizeId(decodedId);
      if (!id) return json(req, { error: 'invalid_id' }, 400);

      const raw = await env.VERIFY_DB.get(`doc:${id}`);
      if (!raw) return json(req, { error: 'not_found' }, 404);

      try {
        return json(req, JSON.parse(raw));
      } catch {
        return json(req, { error: 'invalid_record' }, 500);
      }
    }

    if (url.pathname === '/documents') {
      if (req.method !== 'POST') return json(req, { error: 'method_not_allowed' }, 405, true);
      if (!isAllowedPublisherOrigin(req)) return json(req, { error: 'origin_not_allowed' }, 403, true);
      if (!authorized(req, env)) return json(req, { error: 'unauthorized' }, 401, true);

      const contentType = req.headers.get('Content-Type') || '';
      if (!contentType.toLowerCase().includes('application/json')) {
        return json(req, { error: 'unsupported_media_type' }, 415, true);
      }

      let data;
      try {
        data = await req.json();
      } catch {
        return json(req, { error: 'invalid_json' }, 400, true);
      }

      const id = normalizeId(data.id);
      if (!id) return json(req, { error: 'invalid_id' }, 400, true);

      const record = {
        id,
        status: 'Verified',
        issued_at: String(data.issued_at || new Date().toISOString().slice(0, 10)).slice(0, 32),
        client_name: String(data.client_name || '-').slice(0, 200),
        project: String(data.project || '-').slice(0, 200),
        fingerprint: String(data.fingerprint || '-').slice(0, 500),
      };

      await env.VERIFY_DB.put(`doc:${id}`, JSON.stringify(record));
      return json(req, record, 201, true);
    }

    return json(req, { error: 'not_found' }, 404);
  },
};
