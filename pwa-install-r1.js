(() => {
  "use strict";

  const DISMISS_KEY = "sb:pwa-install:dismissed-until:v1";
  const CANCEL_KEY = "sb:pwa-install:cancel-until:v1";

  const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000;
  const CANCEL_DURATION = 24 * 60 * 60 * 1000;

  const NORMAL_DELAY = 5500;
  const INTERACTION_DELAY = 1500;
  const PREVIEW_DELAY = 600;

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

  const revealInstallCard = () => {
    if (
      isStandalone() ||
      isCoolingDown() ||
      !eligibleForCard()
    ) {
      return;
    }

    const shell = buildInstallCard();

    shell.hidden = false;

    window.requestAnimationFrame(() => {
      shell.classList.add("is-visible");
    });
  };

  const scheduleReveal = () => {
    if (
      isStandalone() ||
      isCoolingDown() ||
      !eligibleForCard()
    ) {
      return;
    }

    if (revealTimer) {
      window.clearTimeout(revealTimer);
    }

    const wait = Math.max(
      0,
      readyAt - Date.now()
    );

    revealTimer = window.setTimeout(
      revealInstallCard,
      wait
    );
  };

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

      scheduleReveal();
    }
  );

  window.addEventListener(
    "appinstalled",
    () => {
      deferredPrompt = null;

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