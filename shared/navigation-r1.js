(() => {
  "use strict";

  const NAV_SELECTOR = ".nav a, .mobile-nav a";

  function normalizeName(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function getTargetName(link) {
    const label = normalizeName(link?.textContent);

    const map = {
      "clients": "clients",
      "projects": "projects",
      "documents": "documents",
      "estimates": "estimates",
      "invoices": "invoices",
      "support": "support"
    };

    return map[label] || null;
  }

  function registeredViews() {
    return [
      ...document.querySelectorAll(
        "main.content > [data-sb-view]"
      )
    ];
  }

  function prepare(targetName) {
    registeredViews().forEach(view => {

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
  }

  function enforce(targetName) {
    const views = registeredViews();

    if (!targetName) {
      /*
       * Dashboard, Leads, Activity Logs, Users & Roles,
       * atau view dasar lain dikelola oleh app utama.
       * Semua custom module harus tetap ditutup.
       */
      views.forEach(view => {
        view.hidden = true;
        view.style.display = "none";
      });

      return;
    }

    const target =
      views.find(
        view => view.dataset.sbView === targetName
      );

    /*
     * Jika halaman seperti Projects di Portal bukan custom view,
     * biarkan app utama menanganinya.
     */
    if (!target) {
      views.forEach(view => {
        view.hidden = true;
        view.style.display = "none";
      });

      return;
    }

    views.forEach(view => {

      if (view === target) {
        view.style.removeProperty("display");
        view.hidden = false;
      }
      else {
        view.hidden = true;
        view.style.display = "none";
      }

    });
  }

  document.addEventListener(
    "click",
    event => {

      const link =
        event.target.closest(NAV_SELECTOR);

      if (!link) return;

      const targetName =
        getTargetName(link);

      /*
       * Sebelum handler module berjalan:
       * buka hanya target dan tutup custom view lain.
       */
      prepare(targetName);

      /*
       * Setelah handler module selesai:
       * pastikan tidak ada module lain ikut tampil.
       */
      setTimeout(() => {
        enforce(targetName);
      }, 0);

    },
    true
  );

  window.addEventListener(
    "pageshow",
    event => {

      if (!event.persisted) return;

      registeredViews().forEach(view => {
        view.hidden = true;
        view.style.display = "none";
      });

    }
  );
})();