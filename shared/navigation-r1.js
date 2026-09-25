(() => {
  "use strict";

  const NAV_SELECTOR =
    ".nav a, .mobile-nav a";

  const content =
    document.querySelector("main.content");

  if (!content) return;

  const isPortal =
    location.pathname.includes("/portal/");

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function targetFromLink(link) {

    const label =
      normalize(link?.textContent);

    if (isPortal) {

      const portalMap = {
        "dashboard": "dashboard",
        "home": "dashboard",
        "projects": "projects",
        "documents": "documents",
        "estimates": "estimates",
        "invoices": "invoices",
        "support": "support",
        "analytics": "analytics"
      };

      return portalMap[label] || null;
    }

    const adminMap = {
      "leads": "leads",
      "clients": "clients",
      "projects": "projects",
      "documents": "documents",
      "estimates": "estimates",
      "invoices": "invoices",
      "support": "support",
        "analytics": "analytics",
      "activity logs": "activity"
    };

    return adminMap[label] || null;
  }

  function views() {
    return [
      ...content.querySelectorAll(
        ":scope > [data-sb-view]"
      )
    ];
  }

  function ensurePortalDashboard() {

    if (!isPortal) return;

    if (
      content.querySelector(
        ':scope > [data-sb-view="dashboard"]'
      )
    ) {
      return;
    }

    const baseNodes =
      [...content.children].filter(
        node => !node.dataset.sbView
      );

    if (!baseNodes.length) return;

    const wrapper =
      document.createElement("section");

    wrapper.dataset.sbView = "dashboard";
    wrapper.className = "sb-portal-dashboard";

    content.insertBefore(
      wrapper,
      baseNodes[0]
    );

    baseNodes.forEach(
      node => wrapper.appendChild(node)
    );
  }

  function setPortalActive(targetName) {

    if (!isPortal) return;

    document
      .querySelectorAll(NAV_SELECTOR)
      .forEach(link => {

        const linkTarget =
          targetFromLink(link);

        link.classList.toggle(
          "active",
          linkTarget === targetName
        );

      });
  }

  function showOnly(targetName) {

    const allViews = views();

    if (!targetName) {

      if (!isPortal) {

        allViews.forEach(view => {
          view.hidden = true;
          view.style.display = "none";
        });

      }

      return;
    }

    const target =
      allViews.find(
        view =>
          view.dataset.sbView === targetName
      );

    if (!target) return;

    allViews.forEach(view => {

      if (view === target) {

        view.style.removeProperty("display");
        view.hidden = false;

      }
      else {

        view.hidden = true;
        view.style.display = "none";

      }

    });

    setPortalActive(targetName);
  }

  /* SB_ADMIN_VIEW_ROUTING_R1 */
  function setAdminActive(targetName) {

    if (isPortal) return;

    document
      .querySelectorAll(NAV_SELECTOR)
      .forEach(link => {

        const label =
          normalize(link.textContent);

        const linkTarget =
          targetFromLink(link);

        const active =
          targetName
            ? linkTarget === targetName
            : label === "dashboard";

        link.classList.toggle(
          "active",
          active
        );

      });
  }

  function prepareAdmin(targetName) {

    if (isPortal) return;

    const baseNodes =
      [...content.children].filter(
        node => !node.dataset.sbView
      );

    baseNodes.forEach(node => {

      if (targetName) {
        node.hidden = true;
        node.style.display = "none";
      }
      else {
        node.style.removeProperty("display");
        node.hidden = false;
      }

    });

    views().forEach(view => {

      if (
        targetName &&
        view.dataset.sbView === targetName
      ) {
        view.style.removeProperty("display");
        view.hidden = false;
      }
      else {
        view.hidden = true;
        view.style.display = "none";
      }

    });

    setAdminActive(targetName);
  }

  ensurePortalDashboard();

  if (isPortal) {
    showOnly("dashboard");
  }

  /* SB_ADMIN_INITIAL_HASH_R1 */
  if (!isPortal) {

    const hashTargetMap = {
      "#analytics": "analytics",
      "#activity": "activity"
    };

    const initialTarget =
      hashTargetMap[
        location.hash.toLowerCase()
      ];

    if (initialTarget) {

      const initialLink =
        [...document.querySelectorAll(
          NAV_SELECTOR
        )].find(
          link =>
            targetFromLink(link) ===
            initialTarget
        );

      if (initialLink) {
        setTimeout(() => {
          initialLink.click();
        }, 0);
      }

    }
  }
  document.addEventListener(
    "click",
    event => {

      const link =
        event.target.closest(NAV_SELECTOR);

      if (!link) return;

      const targetName =
        targetFromLink(link);

      if (isPortal) {

        if (!targetName) return;

        event.preventDefault();

        showOnly(targetName);

        /*
         * Module lama seperti Documents masih mempunyai
         * leaveDocuments() yang dapat membuka sibling lagi.
         *
         * Enforcement setelah seluruh click handler selesai
         * memastikan hanya target yang tetap terlihat.
         */
        setTimeout(() => {
          showOnly(targetName);
        }, 0);

        return;
      }

      /*
       * ADMIN:
       * pertahankan perilaku V2 yang sudah terbukti stabil.
       */
      /* SB_ADMIN_HASH_ROUTING_R1 */
      if (
        targetName === "analytics" ||
        targetName === "activity"
      ) {

        const targetHash =
          "#" + targetName;

        if (location.hash !== targetHash) {
          history.replaceState(
            null,
            "",
            location.pathname +
              location.search +
              targetHash
          );
        }

      }
      else {

        const currentHash =
          location.hash.toLowerCase();

        if (
          currentHash === "#analytics" ||
          currentHash === "#activity"
        ) {
          history.replaceState(
            null,
            "",
            location.pathname +
              location.search
          );
        }

      }
      prepareAdmin(targetName);

      setTimeout(() => {

        if (!targetName) return;

        const target =
          views().find(
            view =>
              view.dataset.sbView === targetName
          );

        if (!target) return;

        views().forEach(view => {

          if (view === target) {
            view.style.removeProperty("display");
            view.hidden = false;
          }
          else {
            view.hidden = true;
            view.style.display = "none";
          }

        });

      }, 0);

    },
    true
  );

  window.addEventListener(
    "pageshow",
    event => {

      if (!event.persisted) return;

      if (isPortal) {
        showOnly("dashboard");
      }

    }
  );

})();