/* REV22 R3.7 — Consent-aware scheduling only.
 * No analytics calls, push permission requests, or browser-translation control.
 * Observes the existing privacy UI without changing its consent semantics.
 */
(() => {
  "use strict";
  const EVENT = "sb:visitor:privacy-state";
  const KEY = "sb_privacy_consent_v1";
  const readChoice = () => {
    try {
      const record = JSON.parse(localStorage.getItem(KEY) || "null");
      return record?.version === 1 &&
        (record.analytics === "granted" || record.analytics === "denied");
    } catch { return false; }
  };
  const isReady = () =>
    readChoice() && !document.getElementById("sb-privacy-consent");

  window.SBVisitorPromptGate = Object.freeze({ isReady });
  let previous = null;
  const notify = () => {
    const ready = isReady();
    if (ready === previous) return;
    previous = ready;
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { ready } }));
  };

  // Privacy panel is inserted/removed by the existing, unchanged analytics script.
  // Same-document localStorage writes do not produce the "storage" event.
  const start = () => {
    new MutationObserver(notify).observe(document.body, { childList: true });
    notify();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
  window.addEventListener("pageshow", notify);
})();
