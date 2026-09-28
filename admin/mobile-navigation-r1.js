(() => {
  "use strict";

  const MOBILE_MAX = 820;

  const sidebar =
    document.querySelector(
      ".sb-admin-sidebar"
    );

  const menuButton =
    document.querySelector(
      "[data-menu]"
    );

  const moreButton =
    document.querySelector(
      "[data-mobile-more]"
    );

  if (
    !sidebar ||
    !moreButton
  ) {
    return;
  }

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function syncMenuState() {
    if (!menuButton) return;

    menuButton.setAttribute(
      "aria-expanded",
      document.body.classList.contains(
        "nav-open"
      )
        ? "true"
        : "false"
    );
  }

  function closeSidebar() {
    document.body.classList.remove(
      "nav-open"
    );

    syncMenuState();
  }


  // =======================================================
  // MOBILE SIDEBAR CLOSE BUTTON
  // =======================================================

  const closeButton =
    document.createElement("button");

  closeButton.type = "button";

  closeButton.className =
    "sb-mobile-sidebar-close";

  closeButton.dataset.mobileSidebarClose =
    "";

  closeButton.setAttribute(
    "aria-label",
    "Tutup navigasi"
  );

  closeButton.innerHTML =
    "&times;";

  sidebar.appendChild(
    closeButton
  );

  closeButton.addEventListener(
    "click",
    event => {
      event.preventDefault();
      event.stopPropagation();
      closeSidebar();
    }
  );


  // =======================================================
  // AUTO CLOSE AFTER SIDEBAR NAVIGATION
  // =======================================================

  sidebar.addEventListener(
    "click",
    event => {

      if (
        window.innerWidth >
        MOBILE_MAX
      ) {
        return;
      }

      const link =
        event.target.closest(
          ".nav a"
        );

      if (!link) return;

      window.setTimeout(
        closeSidebar,
        0
      );
    }
  );


  // =======================================================
  // MORE BOTTOM SHEET
  // =======================================================

  const backdrop =
    document.createElement("div");

  backdrop.className =
    "sb-mobile-more-backdrop";

  backdrop.hidden = true;

  backdrop.innerHTML = `
    <section
      class="sb-mobile-more-sheet"
      role="dialog"
      aria-modal="true"
      aria-label="Menu lainnya"
    >
      <div class="sb-mobile-more-head">
        <div>
          <strong>Menu lainnya</strong>
          <span>Akses fitur Management Console</span>
        </div>

        <button
          type="button"
          class="sb-mobile-more-close"
          data-mobile-more-close
          aria-label="Tutup menu lainnya"
        >
          &times;
        </button>
      </div>

      <div
        class="sb-mobile-more-grid"
        data-mobile-more-grid
      ></div>
    </section>
  `;

  document.body.appendChild(
    backdrop
  );

  const moreGrid =
    backdrop.querySelector(
      "[data-mobile-more-grid]"
    );

  const moreClose =
    backdrop.querySelector(
      "[data-mobile-more-close]"
    );


  function availableSidebarLinks() {

    const excluded =
      new Set([
        "dashboard",
        "clients",
        "projects"
      ]);

    return [
      ...sidebar.querySelectorAll(
        ".nav a"
      )
    ].filter(link => {

      const label =
        normalize(
          link.textContent
        );

      if (
        !label ||
        excluded.has(label)
      ) {
        return false;
      }

      if (link.hidden) {
        return false;
      }

      const style =
        window.getComputedStyle(
          link
        );

      if (
        style.display === "none" ||
        style.visibility === "hidden"
      ) {
        return false;
      }

      return true;
    });
  }


  function renderMoreMenu() {

    moreGrid.innerHTML = "";

    const links =
      availableSidebarLinks();

    links.forEach(link => {

      const item =
        document.createElement(
          "button"
        );

      item.type = "button";

      item.className =
        "sb-mobile-more-item";

      item.textContent =
        link.textContent.trim();

      item.addEventListener(
        "click",
        () => {

          closeMore();

          window.setTimeout(
            () => link.click(),
            0
          );
        }
      );

      moreGrid.appendChild(
        item
      );
    });
  }


  function openMore() {

    if (
      window.innerWidth >
      MOBILE_MAX
    ) {
      return;
    }

    closeSidebar();

    renderMoreMenu();

    backdrop.hidden = false;

    document.body.classList.add(
      "sb-mobile-more-open"
    );

    moreButton.setAttribute(
      "aria-expanded",
      "true"
    );
  }


  function closeMore() {

    backdrop.hidden = true;

    document.body.classList.remove(
      "sb-mobile-more-open"
    );

    moreButton.setAttribute(
      "aria-expanded",
      "false"
    );
  }


  moreButton.addEventListener(
    "click",
    event => {

      event.preventDefault();
      event.stopPropagation();

      if (backdrop.hidden) {
        openMore();
      }
      else {
        closeMore();
      }
    }
  );


  moreClose.addEventListener(
    "click",
    closeMore
  );


  backdrop.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        backdrop
      ) {
        closeMore();
      }
    }
  );


  // =======================================================
  // ACCESSIBILITY / STATE SYNC
  // =======================================================

  if (menuButton) {

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    const observer =
      new MutationObserver(
        syncMenuState
      );

    observer.observe(
      document.body,
      {
        attributes: true,
        attributeFilter: [
          "class"
        ]
      }
    );
  }


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key !==
        "Escape"
      ) {
        return;
      }

      closeSidebar();
      closeMore();
    }
  );


  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth >
        MOBILE_MAX
      ) {
        closeSidebar();
        closeMore();
      }
    }
  );

})();