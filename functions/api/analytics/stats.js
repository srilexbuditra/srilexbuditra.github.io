const ANALYTICS_UPSTREAM =
  "https://srilexbuditra-visitors-api.srilexbuditra.workers.dev/stats";

async function requireAdmin(request) {
  const cookie =
    request.headers.get("Cookie") || "";

  if (!cookie) {
    return null;
  }

  try {
    const authUrl =
      new URL("/api/auth/me", request.url);

    const response =
      await fetch(authUrl.toString(), {
        method: "GET",

        headers: {
          "Cookie": cookie,
          "Accept": "application/json"
        },

        cache: "no-store",
        redirect: "manual"
      });

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json().catch(() => null);

    const user =
      data?.user || data;

    const role =
      user?.role || "";

    if (
      role !== "system_admin" &&
      role !== "staff"
    ) {
      return null;
    }

    return user;
  }
  catch {
    return null;
  }
}

function jsonResponse(data, status) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type":
          "application/json; charset=utf-8",

        "Cache-Control":
          "no-store",

        "X-Content-Type-Options":
          "nosniff"
      }
    }
  );
}

export async function onRequestGet(context) {
  const { request, env } = context;

  const user =
    await requireAdmin(request);

  if (!user) {
    return jsonResponse(
      {
        error: "Admin authentication required."
      },
      401
    );
  }

  const statsKey =
    String(env.STATS_API_KEY || "").trim();

  if (!statsKey) {
    return jsonResponse(
      {
        error: "Analytics secret is not configured."
      },
      503
    );
  }

  try {
    const incoming =
      new URL(request.url);

    const upstream =
      new URL(ANALYTICS_UPSTREAM);

    for (
      const key of ["t", "start", "end"]
    ) {
      const value =
        incoming.searchParams.get(key);

      if (value) {
        upstream.searchParams.set(
          key,
          value
        );
      }
    }

    const response =
      await fetch(upstream.toString(), {
        method: "GET",

        headers: {
          "Authorization":
            `Bearer ${statsKey}`,

          "Accept":
            "application/json"
        },

        redirect: "follow"
      });

    const headers =
      new Headers();

    headers.set(
      "Content-Type",
      response.headers.get(
        "Content-Type"
      ) ||
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

    return jsonResponse(
      {
        error:
          "Analytics upstream unavailable."
      },
      502
    );
  }
}

export function onRequest(context) {
  if (
    context.request.method
      .toUpperCase() !== "GET"
  ) {
    return jsonResponse(
      {
        error: "Method not allowed."
      },
      405
    );
  }

  return onRequestGet(context);
}