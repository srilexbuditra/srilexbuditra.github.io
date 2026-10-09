const routes = new Map([
  ["/api/push/health", new Set(["GET"])],
  ["/api/push/public-key", new Set(["GET"])],
  ["/api/push/subscribe", new Set(["POST"])],
  ["/api/push/unsubscribe", new Set(["POST"])],
  ["/api/push/status", new Set(["POST"])],
  ["/api/push/send-test", new Set(["POST"])]
]);

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const allowed = routes.get(url.pathname);

  if (!allowed) {
    return json({ error: "Not found." }, 404);
  }

  if (!allowed.has(request.method)) {
    return json({ error: "Method not allowed." }, 405);
  }

  if (
    !env.PUSH_SERVICE ||
    typeof env.PUSH_SERVICE.fetch !== "function"
  ) {
    return json(
      { error: "Push service binding is unavailable." },
      503
    );
  }

  try {
    return await env.PUSH_SERVICE.fetch(request);
  }
  catch {
    return json(
      { error: "Push service is temporarily unavailable." },
      502
    );
  }
}