const UPSTREAM = "https://srilexbuditra-client-management-api-r1-staging.srilexbuditra.workers.dev";

export async function onRequest(context) {
  const request = context.request;
  const sourceUrl = new URL(request.url);
  const targetUrl = new URL(sourceUrl.pathname + sourceUrl.search, UPSTREAM);

  const headers = new Headers(request.headers);

  // Worker R1 staging saat ini mengizinkan origin Worker staging.
  headers.set("Origin", UPSTREAM);
  headers.delete("Host");

  const options = {
    method: request.method,
    headers,
    redirect: "manual"
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    options.body = request.body;
  }

  return fetch(targetUrl.toString(), options);
}
