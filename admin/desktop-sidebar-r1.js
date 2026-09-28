(() => {
  "use strict";

  const DESKTOP_MIN = 821;

  const STORAGE_KEY =
    "sb-admin-desktop-sidebar-collapsed";

  const toggle =
    document.querySelector(
      "[data-desktop-sidebar-toggle]"
    );

  if (!toggle) return;

  function isDesktop() {
    return (
      window.innerWidth >=
      DESKTOP_MIN
    );
  }

  function readPreference() {
    try {
      return (
        window.sessionStorage
          .getItem(STORAGE_KEY) ===
        "1"
      );
    }
    catch {
      return false;
    }
  }

  function savePreference(collapsed) {
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        collapsed ? "1" : "0"
      );
    }
    catch {
      // sessionStorage tidak tersedia.
    }
  }

  function syncButton(collapsed) {
    toggle.setAttribute(
      "aria-expanded",
      collapsed
        ? "false"
        : "true"
    );

    const label =
      collapsed
        ? "Tampilkan sidebar"
        : "Sembunyikan sidebar";

    toggle.setAttribute(
      "aria-label",
      label
    );

    toggle.setAttribute(
      "title",
      label
    );
  }

  function applyState(
    collapsed,
    persist = true
  ) {
    document.body.classList.toggle(
      "sb-desktop-sidebar-collapsed",
      collapsed
    );

    syncButton(collapsed);

    if (persist) {
      savePreference(collapsed);
    }
  }

  function syncViewport() {
    if (!isDesktop()) {
      document.body.classList.remove(
        "sb-desktop-sidebar-collapsed"
      );

      syncButton(false);
      return;
    }

    applyState(
      readPreference(),
      false
    );
  }

  toggle.addEventListener(
    "click",
    event => {
      if (!isDesktop()) {
        return;
      }

      event.preventDefault();

      const collapsed =
        !document.body.classList.contains(
          "sb-desktop-sidebar-collapsed"
        );

      applyState(collapsed);
    }
  );

  window.addEventListener(
    "resize",
    syncViewport
  );

  syncViewport();

})();