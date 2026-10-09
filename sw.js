"use strict";

const DEFAULT_TITLE = "Srilex Buditra";
const DEFAULT_BODY = "Ada pembaruan baru di srilexbuditra.work.";
const DEFAULT_PATH = "/";
const DEFAULT_ICON = "/images/android-chrome-192x192.png";

const safePath = value => {
  try {
    const url = new URL(
      typeof value === "string" && value.trim()
        ? value
        : DEFAULT_PATH,
      self.location.origin
    );

    if (url.origin !== self.location.origin) {
      return DEFAULT_PATH;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  }
  catch {
    return DEFAULT_PATH;
  }
};

const payloadFrom = event => {
  if (!event.data) return {};

  try {
    return event.data.json();
  }
  catch {
    try {
      return { body: event.data.text() };
    }
    catch {
      return {};
    }
  }
};

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", event => {
  const payload = payloadFrom(event);

  const title =
    typeof payload.title === "string" && payload.title.trim()
      ? payload.title.trim().slice(0, 120)
      : DEFAULT_TITLE;

  const body =
    typeof payload.body === "string" && payload.body.trim()
      ? payload.body.trim().slice(0, 320)
      : DEFAULT_BODY;

  const target = safePath(payload.url);

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: DEFAULT_ICON,
      tag:
        typeof payload.tag === "string" && payload.tag.trim()
          ? payload.tag.trim().slice(0, 80)
          : "srilexbuditra-update",
      renotify: false,
      data: {
        url: target
      }
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const targetPath = safePath(
    event.notification &&
    event.notification.data
      ? event.notification.data.url
      : DEFAULT_PATH
  );

  const targetUrl =
    new URL(targetPath, self.location.origin).href;

  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    for (const client of clients) {
      try {
        const clientUrl = new URL(client.url);

        if (clientUrl.origin !== self.location.origin) {
          continue;
        }

        if (clientUrl.href === targetUrl) {
          return client.focus();
        }
      }
      catch {
      }
    }

    return self.clients.openWindow(targetUrl);
  })());
});