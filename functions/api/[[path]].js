const UPSTREAM = "https://srilexbuditra-client-management-api-r1-staging.srilexbuditra.workers.dev";

export async function onRequest(context) {
  const request = context.request;
  const sourceUrl = new URL(request.url);
  const targetUrl = new URL(sourceUrl.pathname + sourceUrl.search, UPSTREAM);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Origin", UPSTREAM);
  requestHeaders.delete("Host");

  const options = {
    method: request.method,
    headers: requestHeaders,
    redirect: "manual"
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    options.body = request.body;
  }

  const upstreamResponse = await fetch(targetUrl.toString(), options);

  const responseHeaders = new Headers(upstreamResponse.headers);

  const setCookie = upstreamResponse.headers.get("Set-Cookie");
  if (setCookie) {
    responseHeaders.set("Set-Cookie", setCookie);
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders
  });
}
