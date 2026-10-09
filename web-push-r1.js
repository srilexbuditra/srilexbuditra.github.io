(() => {
  "use strict";

  const API = "/api/push";
  const SW_URL = "/sw.js";
  const SW_SCOPE = "/";
  const PREVIEW_PARAM = "push-preview";

  const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
  const previewValue = localHosts.has(location.hostname)
    ? new URLSearchParams(location.search).get(PREVIEW_PARAM)
    : null;

  const previewMode = new Set([
    "eligible",
    "active",
    "ios",
    "blocked",
    "unsupported"
  ]).has(previewValue);

  let launcher;
  let panel;
  let button;
  let badge;
  let statusText;
  let manageButton = null;
  let permissionRefreshTimer = null;
  let subscription = null;
  let busy = false;
  let publicKeyReady = null;

  // R3.5: gentle, local-only activation invitation. It is NOT a push send,
  // and permission is never requested until the visitor presses the button.
  const inviteSeenKey = "sb-rev22-r35-optin-last-shown";
  const inviteDelayMs = 4500;
  const inviteCooldownMs = 7 * 24 * 60 * 60 * 1000;
  let inviteTimer = null;
  let inviteShownInPage = false;
  // R3.6: announce only prompt priority; no subscription or permission change.
  const invitePriorityEvent = "sb:rev22:push-invite-priority";
  const privacyReady = () => window.SBVisitorPromptGate?.isReady() === true;
  const announceInvite = state => {
    window.dispatchEvent(new CustomEvent(invitePriorityEvent, {
      detail: { state }
    }));
  };

  const ios = () => {
    const ua = navigator.userAgent || "";
    return /iPad|iPhone|iPod/i.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  };

  const standalone = () =>
    (window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches) ||
    navigator.standalone === true;

  const supported = () =>
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  const base64UrlToBytes = (value) => {
    const padding = "=".repeat((4 - value.length % 4) % 4);
    const base64 = (value + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const raw = atob(base64);
    return Uint8Array.from(raw, char => char.charCodeAt(0));
  };

  const api = async (path, options = {}) => {
    const headers = new Headers(options.headers || {});

    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API}${path}`, {
      ...options,
      headers,
      credentials: "same-origin",
      cache: "no-store"
    });

    let payload = null;

    try {
      payload = await response.json();
    }
    catch {
      payload = null;
    }

    if (!response.ok) {
      throw new Error(
        payload && typeof payload.error === "string"
          ? payload.error
          : `Push API error (${response.status}).`
      );
    }

    return payload || {};
  };

  // Fetch backend readiness without prompting. A permission request must be
  // called directly in the user's button event, not after awaited network IO.
  const loadPublicKey = async () => {
    const payload = await api("/public-key", { method: "GET" });
    const value = payload && typeof payload.public_key === "string"
      ? payload.public_key.trim()
      : "";
    if (!/^[A-Za-z0-9_-]{87}$/.test(value)) {
      throw new Error("VAPID public key belum tersedia atau tidak valid.");
    }
    publicKeyReady = value;
    return value;
  };

  // Persistent capability is scoped to this origin and to one endpoint.
  // Never put it in a URL or an API response; site data deletion may lose it.
  const storagePrefix = "sb-rev22-push-owner-v1:";
  const endpointStorageKey = async endpoint => {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(endpoint));
    return storagePrefix + Array.from(new Uint8Array(digest))
      .map(byte => byte.toString(16).padStart(2, "0")).join("");
  };
  const storedOwner = async endpoint => {
    try {
      const value = localStorage.getItem(await endpointStorageKey(endpoint));
      return /^[a-f0-9]{64}$/.test(value || "") ? value : null;
    } catch { return null; }
  };
  const saveOwner = async (endpoint, token) => {
    try {
      localStorage.setItem(await endpointStorageKey(endpoint), token);
      return localStorage.getItem(await endpointStorageKey(endpoint)) === token;
    } catch { return false; }
  };
  const clearOwner = async endpoint => {
    try { localStorage.removeItem(await endpointStorageKey(endpoint)); } catch { }
  };
  // A pending marker is written BEFORE local browser removal. Keep the existing
  // endpoint-scoped ownership credential until the server confirms deletion.
  const pendingPrefix = "sb-rev22-push-pending-v1:";
  const pendingKey = async endpoint => pendingPrefix +
    (await endpointStorageKey(endpoint)).slice(storagePrefix.length);
  const savePending = async endpoint => {
    try {
      const key = await pendingKey(endpoint);
      localStorage.setItem(key, endpoint);
      return localStorage.getItem(key) === endpoint;
    } catch { return false; }
  };
  const clearPending = async endpoint => {
    try { localStorage.removeItem(await pendingKey(endpoint)); } catch { }
  };
  const retryPendingCleanup = async () => {
    // If SW state cannot be read, avoid potentially deleting an active device.
    let current;
    try { current = await existingSubscription(); } catch { return; }
    let endpoints = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(pendingPrefix)) {
          const endpoint = localStorage.getItem(key);
          if (typeof endpoint === "string" && endpoint) endpoints.push(endpoint);
        }
      }
    } catch { return; }
    for (const endpoint of endpoints) {
      if (current?.endpoint === endpoint) continue;
      const owner = await storedOwner(endpoint);
      if (!owner) continue; // Lost credential cannot be reconstructed safely.
      try {
        const checked = await api("/status", {
          method: "POST",
          body: JSON.stringify({ endpoint, ownership_token: owner })
        });
        if (checked.status !== "missing") {
          await api("/unsubscribe", {
            method: "POST",
            body: JSON.stringify({ endpoint, ownership_token: owner })
          });
        }
        await clearPending(endpoint);
        await clearOwner(endpoint);
      } catch {
        // Leave both marker and credential intact for a future retry.
      }
    }
  };

  const newOwner = () => Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(byte => byte.toString(16).padStart(2, "0")).join("");

  const markInviteSeen = () => {
    inviteShownInPage = true;
    try { localStorage.setItem(inviteSeenKey, String(Date.now())); } catch { }
  };

  const stopInviteTimer = () => {
    if (inviteTimer !== null) clearTimeout(inviteTimer);
    inviteTimer = null;
  };

  const scheduleInvite = () => {
    stopInviteTimer();
    if (!privacyReady()) {
      announceInvite("privacy-pending");
      return;
    }
    if (
      previewMode || inviteShownInPage || busy ||
      !supported() || (ios() && !standalone()) ||
      Notification.permission === "denied" ||
      document.visibilityState !== "visible" ||
      !panel.hidden || launcher.dataset.state !== "inactive"
    ) {
      announceInvite("released");
      return;
    }

    try {
      const previous = Number(localStorage.getItem(inviteSeenKey));
      if (previous > 0 && Date.now() - previous < inviteCooldownMs) {
        announceInvite("released");
        return;
      }
    } catch {
      // If storage is disabled, the invitation is still limited to this load.
    }

    stopInviteTimer();
    inviteTimer = setTimeout(() => {
      inviteTimer = null;
      if (
        busy || inviteShownInPage || !privacyReady() ||
        document.visibilityState !== "visible" ||
        launcher.dataset.state !== "inactive" || !panel.hidden ||
        !supported() || Notification.permission === "denied"
      ) {
        announceInvite("released");
        return;
      }
      markInviteSeen();
      setOpen(true);
    }, inviteDelayMs);
    announceInvite("scheduled");
  };

  const setOpen = (open, reason = "closed") => {
    if (open && !privacyReady()) return;
    const wasOpen = !panel.hidden;
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));

    if (open) {
      announceInvite("shown");
      requestAnimationFrame(() => panel.classList.add("is-visible"));
    } else {
      panel.classList.remove("is-visible");
      if (wasOpen) announceInvite(reason === "privacy" ? "privacy-pending" : "closed");
    }
  };

  const setState = (state, message) => {
    launcher.dataset.state = state;
    panel.dataset.state = state;
    badge.dataset.state = state;

    const labels = {
      inactive: "Belum aktif",
      active: "Aktif",
      blocked: "Diblokir",
      unsupported: "Tidak tersedia",
      install: "Perlu dipasang",
      busy: "Memproses",
      sync: "Perlu Sinkronisasi"
    };

    badge.textContent = labels[state] || "Status";
    statusText.textContent = message;

    // R3.4: an active subscriber does not need a permanent floating bell.
    // A discreet footer control preserves opt-out without adding clutter.
    const isActive = state === "active" &&
      (previewMode || (supported() && Notification.permission === "granted"));
    const managing = state === "busy" && manageButton && !manageButton.hidden;
    launcher.hidden = isActive || Boolean(managing);
    if (manageButton) manageButton.hidden = !(isActive || managing);
    if (isActive) setOpen(false);

    if (state === "active") {
      button.textContent = "Nonaktifkan Notifikasi";
      button.disabled = false;
    }
    else if (state === "sync") {
      button.textContent = "Sinkronkan Ulang";
      button.disabled = false;
    }
    else if (state === "blocked") {
      button.textContent = "Izin Diblokir Browser";
      button.disabled = true;
    }
    else if (state === "unsupported") {
      button.textContent = "Browser Belum Mendukung";
      button.disabled = true;
    }
    else if (state === "install") {
      button.textContent = "Pasang Aplikasi Dulu";
      button.disabled = true;
    }
    else if (state === "busy") {
      button.textContent = "Memproses…";
      button.disabled = true;
    }
    else {
      button.textContent = "Aktifkan Notifikasi";
      button.disabled = false;
    }
  };

  const existingSubscription = async () => {
    const registration =
      await navigator.serviceWorker.getRegistration(SW_SCOPE);

    return registration
      ? registration.pushManager.getSubscription()
      : null;
  };

  const refresh = async () => {
    if (previewMode) {
      if (previewValue === "active") {
        subscription = { preview: true };
        setState("active", "Mode preview: perangkat ditampilkan sebagai sudah berlangganan.");
        return;
      }

      if (previewValue === "ios") {
        setState("install", "Di iPhone/iPad, pasang srilexbuditra.work ke Layar Utama terlebih dahulu.");
        return;
      }

      if (previewValue === "blocked") {
        setState("blocked", "Mode preview: izin notifikasi ditampilkan sebagai diblokir.");
        return;
      }

      if (previewValue === "unsupported") {
        setState("unsupported", "Mode preview: browser ditampilkan sebagai belum mendukung Web Push.");
        return;
      }

      setState("inactive", "Mode preview lokal. Tidak ada permission, Service Worker, atau subscription yang dibuat.");
      return;
    }

    if (!supported()) {
      setState("unsupported", "Browser ini belum mendukung Service Worker, Notification API, dan Push API.");
      return;
    }

    if (ios() && !standalone()) {
      setState("install", "Di iPhone/iPad, pasang srilexbuditra.work ke Layar Utama terlebih dahulu, lalu buka aplikasinya.");
      return;
    }

    if (Notification.permission === "denied") {
      subscription = null;
      setState("blocked", "Izin notifikasi sedang diblokir. Ubah izin situs melalui pengaturan browser.");
      return;
    }

    // Browser permission may have been changed from its address-bar control.
    // An existing browser push endpoint alone must not be shown as active.
    if (Notification.permission !== "granted") {
      subscription = null;
      setState("inactive", "Izin notifikasi browser belum aktif. Klik Aktifkan Notifikasi untuk berlangganan kembali.");
      return;
    }

    try {
      subscription = await existingSubscription();
    }
    catch {
      subscription = null;
    }

    if (subscription) {
      const token = await storedOwner(subscription.endpoint);
      if (!token) {
        setState("active", "Subscription browser ditemukan, tetapi bukti pengelolaan server tidak tersedia. Nonaktifkan perangkat ini melalui tombol jika ingin mengatur ulang.");
        return;
      }
      try {
        const checked = await api("/status", {
          method: "POST",
          body: JSON.stringify({ endpoint: subscription.endpoint, ownership_token: token })
        });
        if (checked.status === "active") {
          setState("active", "Perangkat ini sudah terdaftar untuk menerima update dari srilexbuditra.work.");
        } else {
          setState("sync", "Subscription browser tersedia, tetapi server belum sinkron. Tekan Sinkronkan Ulang.");
        }
      } catch {
        setState("sync", "Subscription browser tersedia, tetapi koneksi ke server belum dapat diverifikasi. Tekan Sinkronkan Ulang untuk mencoba kembali.");
      }
      return;
    }

    setState(
      "inactive",
      Notification.permission === "granted"
        ? "Izin browser sudah tersedia. Aktifkan subscription perangkat untuk menerima update."
        : "Notifikasi hanya akan diminta setelah Anda menekan tombol Aktifkan Notifikasi."
    );
  };

  const activate = async () => {
    if (busy) return;

    if (previewMode) {
      subscription = { preview: true };
      setState("active", "Mode preview: notifikasi ditampilkan sebagai aktif tanpa meminta izin browser.");
      return;
    }

    if (!supported() || (ios() && !standalone())) {
      await refresh();
      return;
    }

    if (Notification.permission === "denied") {
      setState("blocked", "Izin notifikasi diblokir. Ubah izin situs melalui pengaturan browser.");
      return;
    }

    // If first-load preflight is pending, finish it without asking permission.
    // A second deliberate click will then request permission with user activation.
    if (!publicKeyReady) {
      busy = true;
      setState("busy", "Memeriksa kesiapan layanan notifikasi…");
      try {
        await loadPublicKey();
        setState("inactive", "Layanan siap. Tekan Aktifkan Notifikasi sekali lagi untuk memberi izin browser.");
      }
      catch (error) {
        setState("inactive", error?.message || "Layanan notifikasi belum siap. Silakan coba kembali.");
      }
      finally { busy = false; }
      return;
    }

    // No awaited operation may precede this prompt: Safari/iOS requires the
    // notification-permission request to be initiated by the user's gesture.
    let permissionPromise;
    try {
      permissionPromise = Notification.permission === "granted"
        ? Promise.resolve("granted")
        : Notification.requestPermission();
    }
    catch {
      setState("inactive", "Browser belum dapat meminta izin notifikasi.");
      return;
    }

    busy = true;
    setState("busy", "Mengaktifkan notifikasi perangkat…");

    let createdSubscription = null;

    try {
      const permission = await permissionPromise;
      if (permission !== "granted") {
        subscription = null;
        setState(permission === "denied" ? "blocked" : "inactive",
          permission === "denied"
            ? "Izin notifikasi ditolak atau diblokir oleh browser."
            : "Notifikasi belum diaktifkan karena izin belum diberikan.");
        return;
      }

      const registration = await navigator.serviceWorker.register(
        SW_URL,
        { scope: SW_SCOPE, updateViaCache: "none" }
      );

      const readyRegistration =
        (await navigator.serviceWorker.ready) || registration;

      let current =
        await readyRegistration.pushManager.getSubscription();

      if (!current) {
        current = await readyRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            base64UrlToBytes(publicKeyReady)
        });

        createdSubscription = current;
      }

      let owner = await storedOwner(current.endpoint);
      if (!owner) {
        owner = newOwner();
        if (!(await saveOwner(current.endpoint, owner))) {
          throw new Error("Penyimpanan credential perangkat tidak tersedia. Periksa pengaturan browser.");
        }
      }
      await api("/subscribe", {
        method: "POST",
        body: JSON.stringify({
          subscription: current.toJSON(),
          ownership_token: owner
        })
      });

      subscription = current;

      setState(
        "active",
        "Notifikasi aktif. Perangkat ini siap menerima update dari srilexbuditra.work."
      );
    }
    catch (error) {
      // Keep a newly created browser subscription when a server response is
      // uncertain. The persisted credential permits a safe retry by clicking
      // Aktifkan again; do not silently orphan a possibly accepted DB record.
      const errorMessage = error && typeof error.message === "string"
        ? error.message
        : "Notifikasi belum dapat diaktifkan.";

      const existing = await existingSubscription().catch(() => null);
      const existingOwner = existing
        ? await storedOwner(existing.endpoint)
        : null;

      if (existing && existingOwner) {
        subscription = existing;
        setState("sync", "Sinkronisasi gagal: " + errorMessage);
      } else {
        subscription = null;
        setState("inactive", errorMessage);
      }
    }
    finally {
      busy = false;
    }
  };

  const deactivate = async () => {
    if (busy) return;

    if (previewMode) {
      subscription = null;
      setState("inactive", "Mode preview: subscription ditampilkan sebagai nonaktif.");
      return;
    }

    busy = true;
    setState("busy", "Menonaktifkan notifikasi perangkat…");

    try {
      const current =
        subscription || await existingSubscription();

      if (!current) {
        subscription = null;
        setState("inactive", "Tidak ada subscription aktif pada perangkat ini.");
        return;
      }

      const endpoint = current.endpoint;
      const owner = await storedOwner(endpoint);
      let serverRemoved = false;
      if (owner) {
        try {
          await api("/unsubscribe", {
            method: "POST",
            body: JSON.stringify({ endpoint, ownership_token: owner })
          });
          serverRemoved = true;
        } catch {
          // Do not claim the server has been cleaned up.
        }
      }
      // If server deletion is uncertain, persist the retry marker first.
      // Without durable storage, keep browser subscription and credential.
      if (!serverRemoved && owner && !(await savePending(endpoint))) {
        subscription = current;
        setState("active", "Server belum dapat dihubungi dan penyimpanan pemulihan tidak tersedia. Coba nonaktifkan lagi nanti.");
        return;
      }
      const browserRemoved = await current.unsubscribe();
      subscription = browserRemoved ? null : await existingSubscription().catch(() => current);
      if (browserRemoved) {
        if (serverRemoved) {
          await clearPending(endpoint);
          await clearOwner(endpoint);
        } else if (!owner) {
          // No credential was available: never falsely report server cleanup.
          setState("inactive", "Subscription browser dinonaktifkan; data server tidak dapat diverifikasi karena credential hilang.");
          return;
        }
        setState("inactive", serverRemoved
          ? "Notifikasi telah dinonaktifkan pada perangkat ini."
          : "Subscription browser dinonaktifkan; penghapusan server akan dicoba kembali saat halaman dibuka.");
      } else {
        if (!serverRemoved) await clearPending(endpoint);
        setState("active", "Browser belum berhasil menonaktifkan subscription. Silakan coba lagi.");
      }
    }
    catch (error) {
      subscription = await existingSubscription().catch(() => null);
      setState(subscription ? "active" : "inactive",
        error?.message || "Penonaktifan belum dapat dikonfirmasi.");
    }
    finally {
      busy = false;
    }
  };

  const build = () => {
    launcher = document.createElement("button");
    launcher.id = "sbPushLauncher";
    launcher.type = "button";
    launcher.className = "sb-push-launcher";
    launcher.dataset.state = "inactive";
    launcher.hidden = true; // avoid a brief bell flash for returning subscribers
    launcher.setAttribute("aria-controls", "sbPushPanel");
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", "Buka pengaturan notifikasi");

    const icon = document.createElement("span");
    icon.className = "sb-push-launcher-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "🔔";

    const text = document.createElement("span");
    text.className = "sb-push-launcher-text";
    text.textContent = "Notifikasi";

    const dot = document.createElement("span");
    dot.className = "sb-push-launcher-dot";
    dot.setAttribute("aria-hidden", "true");

    launcher.append(icon, text, dot);

    panel = document.createElement("section");
    panel.id = "sbPushPanel";
    panel.className = "sb-push-panel";
    panel.hidden = true;
    panel.dataset.state = "inactive";
    panel.setAttribute("aria-labelledby", "sbPushTitle");
    panel.setAttribute("aria-describedby", "sbPushStatusText");

    const card = document.createElement("div");
    card.className = "sb-push-card";

    const close = document.createElement("button");
    close.type = "button";
    close.className = "sb-push-close";
    close.textContent = "×";
    close.setAttribute("aria-label", "Tutup pengaturan notifikasi");

    const kicker = document.createElement("span");
    kicker.className = "sb-push-kicker";
    kicker.textContent = "WEB PUSH";

    const title = document.createElement("h2");
    title.id = "sbPushTitle";
    title.className = "sb-push-title";
    title.textContent = "Update langsung dari srilexbuditra.work";

    const copy = document.createElement("p");
    copy.className = "sb-push-copy";
    copy.textContent =
      "Aktifkan notifikasi untuk menerima pembaruan penting. Izin browser hanya diminta setelah Anda memilih untuk mengaktifkannya.";

    const statusRow = document.createElement("div");
    statusRow.className = "sb-push-status-row";

    badge = document.createElement("span");
    badge.className = "sb-push-status-badge";
    badge.dataset.state = "inactive";
    badge.textContent = "Belum aktif";

    statusRow.append(badge);

    statusText = document.createElement("p");
    statusText.id = "sbPushStatusText";
    statusText.className = "sb-push-status-text";
    statusText.setAttribute("aria-live", "polite");
    statusText.textContent = "Memeriksa dukungan browser…";

    button = document.createElement("button");
    button.type = "button";
    button.className = "sb-push-primary";
    button.textContent = "Aktifkan Notifikasi";

    const privacy = document.createElement("p");
    privacy.className = "sb-push-privacy";
    privacy.textContent =
      "Tidak ada izin notifikasi saat halaman pertama dibuka. Subscription dapat dinonaktifkan kembali dari perangkat ini.";

    card.append(
      close,
      kicker,
      title,
      copy,
      statusRow,
      statusText,
      button,
      privacy
    );

    panel.append(card);
    document.body.append(panel, launcher);

    // Keep the old "Nonaktifkan Notifikasi" capability available after the
    // floating control is hidden. This non-floating link lives in the footer.
    const footerLegal = document.querySelector(".sb-footer-legal");
    if (footerLegal) {
      manageButton = document.createElement("button");
      manageButton.type = "button";
      manageButton.className = "sb-push-manage-link";
      manageButton.textContent = "Kelola Notifikasi";
      manageButton.setAttribute("aria-controls", "sbPushPanel");
      manageButton.hidden = true;
      footerLegal.append(manageButton);
      manageButton.addEventListener("click", () => setOpen(true));
    }

    launcher.addEventListener("click", () => {
      stopInviteTimer();
      markInviteSeen(); // respect visitors who prefer to open the panel themselves
      setOpen(launcher.getAttribute("aria-expanded") !== "true");
    });

    close.addEventListener("click", () => {
      stopInviteTimer();
      if (inviteShownInPage) markInviteSeen();
      setOpen(false);
    });

    button.addEventListener("click", async () => {
      if (launcher.dataset.state === "sync") {
        await activate();
      }
      else if (launcher.dataset.state === "active") {
        await deactivate();
      }
      else {
        await activate();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });

    document.addEventListener("pointerdown", event => {
      if (
        panel.hidden ||
        panel.contains(event.target) ||
        launcher.contains(event.target) ||
        event.target.closest?.("#sb-privacy-consent, #sb-privacy-launcher")
      ) return;
      setOpen(false);
    });

    window.addEventListener("sb:visitor:privacy-state", event => {
      if (!event.detail?.ready) {
        stopInviteTimer();
        if (!panel.hidden) setOpen(false, "privacy");
        announceInvite("privacy-pending");
      } else {
        scheduleInvite();
      }
    });

    // An explicit PWA choice may interrupt the automatic push invitation.
    window.addEventListener("sb:visitor:pwa-manual-open", () => {
      stopInviteTimer();
      announceInvite("released");
    });
  };

  // R3.3: optional foreground banner; native system Web Push is unchanged.
  // Render with textContent only. Never treat notification data as HTML.
  let floatingBanner = null;
  let floatingTimer = null;

  const sameOriginPath = value => {
    try {
      const url = new URL(
        typeof value === "string" && value.trim() ? value : "/",
        location.origin
      );
      return url.origin === location.origin
        ? `${url.pathname}${url.search}${url.hash}`
        : "/";
    }
    catch { return "/"; }
  };

  const showForegroundBanner = detail => {
    if (
      previewMode ||
      !detail ||
      detail.type !== "SB_REV22_FOREGROUND_PUSH_V1" ||
      document.visibilityState !== "visible" ||
      !document.body ||
      !supported() ||
      Notification.permission !== "granted"
    ) return;

    if (!floatingBanner) {
      const wrap = document.createElement("aside");
      wrap.className = "sb-push-foreground";
      wrap.hidden = true;
      wrap.setAttribute("role", "status");
      wrap.setAttribute("aria-live", "polite");
      wrap.setAttribute("aria-atomic", "true");

      const mark = document.createElement("span");
      mark.className = "sb-push-foreground-mark";
      mark.textContent = "🔔";
      mark.setAttribute("aria-hidden", "true");

      const copy = document.createElement("div");
      copy.className = "sb-push-foreground-copy";
      const headline = document.createElement("strong");
      headline.className = "sb-push-foreground-title";
      const message = document.createElement("p");
      message.className = "sb-push-foreground-body";
      copy.append(headline, message);

      const dismiss = document.createElement("button");
      dismiss.type = "button";
      dismiss.className = "sb-push-foreground-close";
      dismiss.setAttribute("aria-label", "Tutup pesan notifikasi");
      dismiss.textContent = "×";

      const open = document.createElement("a");
      open.className = "sb-push-foreground-link";
      open.textContent = "Buka";

      wrap.append(mark, copy, dismiss, open);
      document.body.append(wrap);
      dismiss.addEventListener("click", () => {
        if (floatingTimer !== null) clearTimeout(floatingTimer);
        floatingTimer = null;
        wrap.hidden = true;
      });
      floatingBanner = { wrap, headline, message, open };
    }

    const title = typeof detail.title === "string" && detail.title.trim()
      ? detail.title.trim().slice(0, 120) : "Srilex Buditra";
    const body = typeof detail.body === "string" && detail.body.trim()
      ? detail.body.trim().slice(0, 320) : "Ada pembaruan dari srilexbuditra.work.";

    floatingBanner.headline.textContent = title;
    floatingBanner.message.textContent = body;
    floatingBanner.open.href = sameOriginPath(detail.url);
    floatingBanner.wrap.hidden = false;

    if (floatingTimer !== null) clearTimeout(floatingTimer);
    floatingTimer = setTimeout(() => {
      floatingBanner.wrap.hidden = true;
      floatingTimer = null;
    }, 10000);
  };

  // Read-only sync after browser permission changes (address-bar site controls).
  // No automatic permission prompts, push requests, or D1 mutations.
  const watchPermission = () => {
    const schedule = () => {
      if (previewMode || busy) return;
      if (permissionRefreshTimer !== null) clearTimeout(permissionRefreshTimer);
      permissionRefreshTimer = setTimeout(async () => {
        permissionRefreshTimer = null;
        if (busy || document.visibilityState !== "visible") return;
        const wasActive = launcher.dataset.state === "active";
        await refresh();
        const noLongerActive = launcher.dataset.state !== "active";
        if (wasActive && noLongerActive && document.visibilityState === "visible") {
          setOpen(true); // show the original panel again after browser opt-out
        }
      }, 200);
    };

    window.addEventListener("focus", schedule);
    window.addEventListener("pageshow", schedule);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") schedule();
    });
    if (navigator.permissions?.query) {
      void navigator.permissions.query({ name: "notifications" })
        .then(permission => {
          if (permission.addEventListener) permission.addEventListener("change", schedule);
          else permission.onchange = schedule;
        })
        .catch(() => {});
    }
  };

  const init = async () => {
    build();
    if (!previewMode && supported()) watchPermission();
    if (!previewMode && supported()) {
      navigator.serviceWorker.addEventListener("message", event => {
        showForegroundBanner(event.data);
      });
      // Existing subscribers receive the updated SW on their next page visit;
      // no permission prompt or subscription change is needed.
      void navigator.serviceWorker.getRegistration(SW_SCOPE)
        .then(registration => registration && registration.update())
        .catch(() => {});
    }
    if (!previewMode) {
      // Background GET only: never ask for browser permission on page load.
      void loadPublicKey().catch(() => {});
      await retryPendingCleanup();
    }
    await refresh();
    // Opens only the existing activation panel for eligible, inactive visitors.
    // Returning active subscribers keep the R3.4 launcher hidden.
    scheduleInvite();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  }
  else {
    void init();
  }
})();