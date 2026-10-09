(() => {
  "use strict";

  const DISMISS_KEY = "sb:pwa-install:dismissed-until:v1";
  const CANCEL_KEY = "sb:pwa-install:cancel-until:v1";

  const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000;
  const CANCEL_DURATION = 24 * 60 * 60 * 1000;

  const NORMAL_DELAY = 5500;
  const INTERACTION_DELAY = 1500;
  const PREVIEW_DELAY = 600;

  // R3.6: keep REV21 PWA installation available, but do not show its
  // automatic card on top of the REV22 notification invitation.
  // The bounded startup wait also preserves PWA if the push script fails.
  const PUSH_GATE_EVENT = "sb:rev22:push-invite-priority";
  const PUSH_STARTUP_GRACE = 12000;

  const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);

  const query = new URLSearchParams(window.location.search);

  const previewValue = localHosts.has(window.location.hostname)
    ? query.get("pwa-preview")
    : null;

  const previewChromium = previewValue === "chromium";
  const previewIOS = previewValue === "ios";
  const previewMode = previewChromium || previewIOS;

  const displayModeQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(display-mode: standalone)")
      : null;

  let deferredPrompt = null;
  let installShell = null;
  let installButton = null;
  let statusNote = null;
  let iosGuide = null;
  let revealTimer = null;
  let interactionSeen = false;
  let pushPriority = "pending";
  let pushPromptShownThisVisit = false;
  let pushStartupDeadline = Date.now() + PUSH_STARTUP_GRACE;
  let manualInstallLink = null;
  const privacyReady = () => window.SBVisitorPromptGate?.isReady() === true;
  const FOLLOW_UP_DELAY = 8500;

  let readyAt =
    Date.now() + (previewMode ? PREVIEW_DELAY : NORMAL_DELAY);

  const isStandalone = () =>
    Boolean(
      (displayModeQuery && displayModeQuery.matches) ||
        window.navigator.standalone === true
    );

  const detectIOS = () => {
    const ua = window.navigator.userAgent || "";
    const platform = window.navigator.platform || "";

    return (
      /iPad|iPhone|iPod/i.test(ua) ||
      (platform === "MacIntel" && window.navigator.maxTouchPoints > 1)
    );
  };

  const iosMode = previewIOS || detectIOS();

  const readTimestamp = (key) => {
    if (previewMode) return 0;

    try {
      const value = Number(window.localStorage.getItem(key) || "0");
      return Number.isFinite(value) ? value : 0;
    } catch {
      return 0;
    }
  };

  const setTimestamp = (key, duration) => {
    if (previewMode) return;

    try {
      window.localStorage.setItem(
        key,
        String(Date.now() + duration)
      );
    } catch {
      // Storage can be unavailable in private/restricted contexts.
    }
  };

  const clearTimestamp = (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Storage can be unavailable in private/restricted contexts.
    }
  };

  const isCoolingDown = () => {
    if (previewMode) return false;

    return (
      Math.max(
        readTimestamp(DISMISS_KEY),
        readTimestamp(CANCEL_KEY)
      ) > Date.now()
    );
  };

  const createElement = (tag, className, text) => {
    const node = document.createElement(tag);

    if (className) {
      node.className = className;
    }

    if (typeof text === "string") {
      node.textContent = text;
    }

    return node;
  };

  const setStatus = (message) => {
    if (statusNote) {
      statusNote.textContent = message;
    }
  };

  const hideInstallCard = (delay = 220) => {
    if (!installShell) return;

    installShell.classList.remove("is-visible");

    window.setTimeout(() => {
      if (installShell) {
        installShell.hidden = true;
      }
    }, delay);
  };

  const dismissInstallCard = () => {
    setTimestamp(DISMISS_KEY, DISMISS_DURATION);
    hideInstallCard();
  };

  const buildInstallCard = () => {
    if (installShell) return installShell;

    installShell = createElement(
      "section",
      "sb-pwa-install"
    );

    installShell.id = "sbPwaInstall";
    installShell.hidden = true;
    installShell.setAttribute(
      "aria-labelledby",
      "sbPwaInstallTitle"
    );
    installShell.setAttribute(
      "aria-describedby",
      "sbPwaInstallCopy"
    );
    installShell.setAttribute("aria-live", "polite");

    const card = createElement(
      "div",
      "sb-pwa-install-card"
    );

    const closeButton = createElement(
      "button",
      "sb-pwa-install-close",
      "×"
    );

    closeButton.type = "button";
    closeButton.setAttribute(
      "aria-label",
      "Tutup tawaran instalasi"
    );
    closeButton.title = "Tutup";

    closeButton.addEventListener(
      "click",
      dismissInstallCard
    );

    const brand = createElement(
      "div",
      "sb-pwa-install-brand"
    );

    const icon = createElement(
      "img",
      "sb-pwa-install-icon"
    );

    icon.src = "/images/android-chrome-192x192.png";
    icon.alt = "";
    icon.width = 62;
    icon.height = 62;
    icon.decoding = "async";

    const brandText = createElement("div");

    const kicker = createElement(
      "span",
      "sb-pwa-install-kicker",
      "INSTALL APP"
    );

    const brandName = createElement(
      "strong",
      "",
      "Srilex Buditra"
    );

    const role = createElement(
      "small",
      "",
      "Senior Full Stack Developer Bengkulu"
    );

    brandText.append(kicker, brandName, role);
    brand.append(icon, brandText);

    const title = createElement(
      "h2",
      "sb-pwa-install-title",
      "Pasang srilexbuditra.work di perangkat Anda"
    );

    title.id = "sbPwaInstallTitle";

    const copy = createElement(
      "p",
      "sb-pwa-install-copy",
      "Akses Portal, portfolio, konsultasi, dan update project lebih cepat langsung dari layar utama."
    );

    copy.id = "sbPwaInstallCopy";

    const actions = createElement(
      "div",
      "sb-pwa-install-actions"
    );

    installButton = createElement(
      "button",
      "sb-pwa-install-button",
      "Install Aplikasi"
    );

    installButton.type = "button";

    installButton.setAttribute(
      "aria-controls",
      "sbPwaInstallIosGuide"
    );

    installButton.setAttribute(
      "aria-expanded",
      "false"
    );

    statusNote = createElement(
      "span",
      "sb-pwa-install-note",
      iosMode
        ? "Panduan instalasi tersedia untuk iPhone/iPad."
        : "Siap dipasang dari browser ini."
    );

    actions.append(installButton, statusNote);

    iosGuide = createElement(
      "div",
      "sb-pwa-install-ios"
    );

    iosGuide.id = "sbPwaInstallIosGuide";
    iosGuide.hidden = true;

    const iosTitle = createElement(
      "strong",
      "",
      "Tambahkan ke Layar Utama"
    );

    const iosSteps = createElement("ol");

    [
      "Ketuk tombol Bagikan pada browser.",
      "Pilih Tambahkan ke Layar Utama.",
      "Konfirmasi Tambah untuk memasang srilexbuditra.work."
    ].forEach((step) => {
      iosSteps.append(
        createElement("li", "", step)
      );
    });

    iosGuide.append(iosTitle, iosSteps);

    installButton.addEventListener(
      "click",
      async () => {
        if (iosMode) {
          iosGuide.hidden = false;

          installButton.setAttribute(
            "aria-expanded",
            "true"
          );

          installButton.textContent =
            "Panduan Instalasi Terbuka";

          setStatus(
            "Ikuti tiga langkah di bawah untuk menambahkan aplikasi ke layar utama."
          );

          return;
        }

        if (previewMode && !deferredPrompt) {
          setStatus(
            "Mode preview lokal aktif. Native install prompt tidak dijalankan."
          );

          return;
        }

        if (!deferredPrompt) {
          setStatus(
            "Prompt instalasi belum tersedia. Coba lagi dari menu browser."
          );

          return;
        }

        const promptEvent = deferredPrompt;

        deferredPrompt = null;
        installButton.disabled = true;

        setStatus(
          "Membuka konfirmasi instalasi browser…"
        );

        try {
          await promptEvent.prompt();

          const choice = await promptEvent.userChoice;

          if (choice && choice.outcome === "accepted") {
            setStatus(
              "Permintaan instalasi diterima."
            );

            hideInstallCard(500);
          } else {
            setTimestamp(
              CANCEL_KEY,
              CANCEL_DURATION
            );

            hideInstallCard();
          }
        } catch {
          installButton.disabled = false;

          setStatus(
            "Browser belum dapat membuka instalasi. Gunakan menu instalasi browser."
          );
        }
      }
    );

    card.append(
      closeButton,
      brand,
      title,
      copy,
      actions,
      iosGuide
    );

    installShell.append(card);
    document.body.append(installShell);

    return installShell;
  };

  const eligibleForCard = () =>
    previewMode ||
    iosMode ||
    Boolean(deferredPrompt);

  const waitingForPush = () =>
    pushPriority === "scheduled" ||
    (pushPriority === "pending" && Date.now() < pushStartupDeadline);

  const revealInstallCard = (manual = false) => {
    if (!privacyReady()) return;
    if (
      isStandalone() ||
      (!manual && isCoolingDown()) ||
      (!manual && !eligibleForCard()) ||
      (!manual && pushPromptShownThisVisit) ||
      document.visibilityState === "hidden"
    ) return;

    if (!manual && waitingForPush()) {
      if (pushPriority === "pending") scheduleReveal();
      return;
    }

    const shell = buildInstallCard();

    shell.hidden = false;

    window.requestAnimationFrame(() => {
      shell.classList.add("is-visible");
    });
  };

  const scheduleReveal = () => {
    if (revealTimer) {
      window.clearTimeout(revealTimer);
      revealTimer = null;
    }

    if (
      !privacyReady() ||
      isStandalone() ||
      isCoolingDown() ||
      !eligibleForCard() ||
      pushPromptShownThisVisit ||
      pushPriority === "scheduled" ||
      pushPriority === "shown" ||
      document.visibilityState === "hidden"
    ) return;

    const wait = Math.max(
      0,
      readyAt - Date.now(),
      pushPriority === "pending" ? pushStartupDeadline - Date.now() : 0
    );

    revealTimer = window.setTimeout(
      revealInstallCard,
      wait
    );
  };


  // Web Push and privacy decisions are independent. Do not permanently
  // suppress PWA after push is dismissed; queue a considerate follow-up.
  window.addEventListener(PUSH_GATE_EVENT, event => {
    const state = event?.detail?.state;
    if (!["privacy-pending", "scheduled", "shown", "released", "closed"].includes(state)) return;
    if (state === "shown") pushPromptShownThisVisit = true;
    pushPriority = state;
    if (["privacy-pending", "scheduled", "shown"].includes(state)) {
      if (revealTimer) window.clearTimeout(revealTimer);
      revealTimer = null;
      hideInstallCard(0);
      return;
    }
    if (state === "closed") {
      pushPromptShownThisVisit = false;
      readyAt = Math.max(readyAt, Date.now() + FOLLOW_UP_DELAY);
    }
    if (!pushPromptShownThisVisit) scheduleReveal();
  });

  window.addEventListener("sb:visitor:privacy-state", event => {
    if (!event.detail?.ready) {
      if (revealTimer) window.clearTimeout(revealTimer);
      revealTimer = null;
      hideInstallCard(0);
      return;
    }
    if (pushPromptShownThisVisit) {
      // A privacy settings dialog interrupted the push card; resume the
      // non-intrusive PWA queue only after the privacy choice is finished.
      pushPromptShownThisVisit = false;
      readyAt = Math.max(readyAt, Date.now() + FOLLOW_UP_DELAY);
    } else {
      readyAt = Math.max(readyAt, Date.now() + NORMAL_DELAY);
    }
    pushStartupDeadline = Date.now() + PUSH_STARTUP_GRACE;
    scheduleReveal();
  });

  // The install option remains accessible even if an automatic offer is delayed.
  const updateManualLink = () => {
    if (manualInstallLink) manualInstallLink.hidden = isStandalone();
  };
  const installFooterLink = () => {
    const footer = document.querySelector(".sb-footer-legal");
    if (!footer || manualInstallLink) return;
    manualInstallLink = createElement("button", "sb-push-manage-link", "Pasang Aplikasi");
    manualInstallLink.type = "button";
    manualInstallLink.hidden = true;
    footer.append(manualInstallLink);
    manualInstallLink.addEventListener("click", () => {
      if (!privacyReady() || isStandalone()) return;
      window.dispatchEvent(new CustomEvent("sb:visitor:pwa-manual-open"));
      revealInstallCard(true);
      if (!eligibleForCard()) setStatus("Jika tombol instalasi browser belum tersedia, gunakan menu browser untuk memasang aplikasi.");
    });
    updateManualLink();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installFooterLink, { once: true });
  } else installFooterLink();

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") scheduleReveal();
  });

  const onFirstInteraction = () => {
    if (interactionSeen) return;

    interactionSeen = true;

    const acceleratedTime =
      Date.now() + INTERACTION_DELAY;

    if (acceleratedTime < readyAt) {
      readyAt = acceleratedTime;
    }

    scheduleReveal();
  };

  window.addEventListener(
    "beforeinstallprompt",
    (event) => {
      event.preventDefault();

      deferredPrompt = event;
      updateManualLink();
      scheduleReveal();
    }
  );

  window.addEventListener(
    "appinstalled",
    () => {
      deferredPrompt = null;
      updateManualLink();

      clearTimestamp(DISMISS_KEY);
      clearTimestamp(CANCEL_KEY);

      hideInstallCard(0);
    }
  );

  window.addEventListener(
    "scroll",
    onFirstInteraction,
    {
      once: true,
      passive: true
    }
  );

  window.addEventListener(
    "pointerdown",
    onFirstInteraction,
    {
      once: true,
      passive: true
    }
  );

  window.addEventListener(
    "keydown",
    onFirstInteraction,
    {
      once: true
    }
  );

  if (displayModeQuery) {
    const onDisplayModeChange = (event) => {
      if (event.matches) {
        hideInstallCard(0);
      }
    };

    if (
      typeof displayModeQuery.addEventListener ===
      "function"
    ) {
      displayModeQuery.addEventListener(
        "change",
        onDisplayModeChange
      );
    } else if (
      typeof displayModeQuery.addListener ===
      "function"
    ) {
      displayModeQuery.addListener(
        onDisplayModeChange
      );
    }
  }

  if (previewMode || iosMode) {
    scheduleReveal();
  }
})();