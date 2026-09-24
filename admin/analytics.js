(() => {
  "use strict";

  const content =
    document.querySelector("main.content");

  if (!content) return;

  let initialized = false;
  let initializing = false;

  const view =
    document.createElement("section");

  view.className = "sb-admin-analytics";
  view.dataset.sbView = "analytics";
  view.hidden = true;

  view.innerHTML = `
    <article class="card">
      <div class="card-body">
        Memuat Visitor Statistics...
      </div>
    </article>
  `;

  content.appendChild(view);

  const baseStyle =
    document.createElement("style");

  baseStyle.textContent = `
    .sb-admin-analytics[hidden] {
      display:none !important;
    }

    .sb-admin-analytics {
      display:block;
      width:100%;
    }

    .sb-admin-analytics > .container {
      width:100%;
      max-width:none;
      box-sizing:border-box;
      margin:0;
      padding:0;
    }
  `;

  document.head.appendChild(baseStyle);

  const themeLink =
    document.createElement("link");

  themeLink.rel = "stylesheet";
  themeLink.href = "./analytics-theme.css?v=2.1";
  themeLink.dataset.sbAnalyticsTheme = "v2";

  document.head.appendChild(themeLink);

  function links(name) {
    return [
      ...document.querySelectorAll(
        ".nav a, .mobile-nav a"
      )
    ].filter(
      link =>
        link.textContent.trim().toLowerCase() ===
        name.toLowerCase()
    );
  }

  function setActive() {
    document
      .querySelectorAll(
        ".nav a, .mobile-nav a"
      )
      .forEach(
        link =>
          link.classList.remove("active")
      );

    links("Analytics").forEach(
      link => link.classList.add("active")
    );
  }

  function showAnalytics() {

    [...content.children].forEach(node => {

      if (node !== view) {
        node.style.display = "none";
      }

    });

    view.style.removeProperty("display");
    view.hidden = false;

    setActive();
    ensureInitialized();
  }

  async function ensureInitialized() {

    if (initialized || initializing) return;

    initializing = true;

    try {

      const [htmlResponse, cssResponse] =
        await Promise.all([
          fetch("./analytics-template.html?v=2", {
            cache:"no-store"
          }),
          fetch("./stats.css", {
            cache:"no-store"
          })
        ]);

      if (!htmlResponse.ok) {
        throw new Error(
          `stats.html HTTP ${htmlResponse.status}`
        );
      }

      if (!cssResponse.ok) {
        throw new Error(
          `stats.css HTTP ${cssResponse.status}`
        );
      }

      const htmlText =
        await htmlResponse.text();

      const cssText =
        await cssResponse.text();

      const parsed =
        new DOMParser()
          .parseFromString(
            htmlText,
            "text/html"
          );

      const sourceMain =
        parsed.querySelector("main.container");

      if (!sourceMain) {
        throw new Error(
          "Struktur main.container pada analytics-template.html tidak ditemukan."
        );
      }

      /*
       * CSS stats lama dibatasi ke dalam panel Analytics,
       * sehingga .card, .page-head, dll tidak mengubah
       * Dashboard Admin.
       */
      const scopedStyle =
        document.createElement("style");

      scopedStyle.textContent = `
        @scope ([data-sb-view="analytics"]) {
          ${cssText}
        }
      `;

      document.head.appendChild(
        scopedStyle
      );

      const container =
        document.createElement("div");

      container.className = "container";

      container.innerHTML =
        sourceMain.innerHTML;

      /*
       * Canonical/header/script stats.html tidak disalin.
       * Hanya isi Analytics yang dimasukkan.
       */
      view.replaceChildren(container);

      /* SB_ANALYTICS_VISUAL_V2 */
      const pageHead =
        container.querySelector(".page-head");

      const oldTitle =
        pageHead?.querySelector("h1");

      if (oldTitle) {
        oldTitle.textContent = "Analytics";
      }

      const subtitle =
        pageHead?.querySelector(".subtitle");

      if (subtitle) {
        subtitle.textContent =
          "Pantau trafik dan aktivitas pengunjung srilexbuditra.work.";
      }

      if (
        pageHead &&
        !pageHead.querySelector(
          "[data-analytics-eyebrow]"
        )
      ) {
        const eyebrow =
          document.createElement("div");

        eyebrow.className = "eyebrow";
        eyebrow.dataset.analyticsEyebrow = "1";

        eyebrow.innerHTML =
          '<span class="pulse"></span>Visitor Analytics &bull; R1';

        const titleWrap =
          oldTitle?.parentElement;

        if (titleWrap) {
          titleWrap.insertBefore(
            eyebrow,
            titleWrap.firstChild
          );
        }
      }

      /* SB_ANALYTICS_SECRET_UI */
      const loginBox =
        container.querySelector("#loginBox");

      const keyRow =
        loginBox?.querySelector(".key-row");

      if (keyRow) {
        keyRow.style.display = "none";
      }

      const loginHeading =
        loginBox?.querySelector(
          "h1, h2, h3"
        );

      if (loginHeading) {
        loginHeading.textContent =
          "Analytics Connection";
      }

      const status =
        container.querySelector("#status");

      if (status) {
        status.textContent =
          "Menghubungkan Visitor Analytics...";
      }

      const script =
        document.createElement("script");

      script.src =
        "./analytics-core.js?v=1";

      script.dataset.sbAnalyticsCore =
        "1";

      script.onload = () => {
        initialized = true;
        initializing = false;
      };

      script.onerror = () => {
        initializing = false;

        view.innerHTML = `
          <article class="card">
            <div class="card-body">
              Analytics core belum dapat dimuat.
            </div>
          </article>
        `;
      };

      document.body.appendChild(script);

    }
    catch (error) {

      initializing = false;

      view.innerHTML = `
        <article class="card">
          <div class="card-body">
            Gagal memuat Analytics:
            ${String(
              error?.message ||
              "Unknown error"
            )}
          </div>
        </article>
      `;

    }
  }

  links("Analytics").forEach(link => {

    link.addEventListener(
      "click",
      event => {
        event.preventDefault();
        showAnalytics();
      }
    );

  });

})();