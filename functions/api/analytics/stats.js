const ANALYTICS_UPSTREAM =
  "https://srilexbuditra-visitors-api.srilexbuditra.workers.dev/stats";

export async function onRequestGet(context) {
  const request = context.request;

  const authorization =
    request.headers.get("Authorization");

  if (!authorization) {
    return new Response(
      JSON.stringify({
        error: "Authorization required."
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff"
        }
      }
    );
  }

  try {
    const incoming =
      new URL(request.url);

    const upstream =
      new URL(ANALYTICS_UPSTREAM);

    /*
     * Hanya teruskan query yang memang dipakai Analytics.
     */
    for (const key of ["t", "start", "end"]) {
      const value =
        incoming.searchParams.get(key);

      if (value) {
        upstream.searchParams.set(key, value);
      }
    }

    const response =
      await fetch(upstream.toString(), {
        method: "GET",

        headers: {
          "Authorization": authorization,
          "Accept": "application/json"
        },

        redirect: "follow"
      });

    const headers =
      new Headers();

    headers.set(
      "Content-Type",
      response.headers.get("Content-Type") ||
      "application/json; charset=utf-8"
    );

    headers.set(
      "Cache-Control",
      "no-store"
    );

    headers.set(
      "X-Content-Type-Options",
      "nosniff"
    );

    return new Response(
      response.body,
      {
        status: response.status,
        headers
      }
    );
  }
  catch (error) {
    console.error(
      "Analytics proxy error:",
      error
    );

    return new Response(
      JSON.stringify({
        error: "Analytics upstream unavailable."
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff"
        }
      }
    );
  }
}

export function onRequest(context) {
  if (
    context.request.method.toUpperCase() !== "GET"
  ) {
    return new Response(
      JSON.stringify({
        error: "Method not allowed."
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "Allow": "GET"
        }
      }
    );
  }

  return onRequestGet(context);
}