(() => {
  "use strict";

  /*
   * ==========================================================
   * ADMIN CONSOLE SEARCH & REFRESH UX R1
   * ==========================================================
   * - Global search: Clients / Projects / Leads
   * - Refresh feedback: Leads / Users & Roles
   * - Tidak mengubah backend.
   * - Tidak mengganti handler module yang sudah ada.
   */

  const searchWrap =
    document.querySelector(".topbar .search");

  const searchInput =
    searchWrap?.querySelector(
      'input[type="search"]'
    );

  if (!searchWrap || !searchInput) {
    return;
  }

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  /*
   * ==========================================================
   * STYLE
   * ==========================================================
   */

  const style =
    document.createElement("style");

  style.textContent = `
    .topbar .search {
      position: relative;
    }

    .sb-console-search-panel[hidden] {
      display: none !important;
    }

    .sb-console-search-panel {
      position: absolute;
      top: calc(100% + 9px);
      left: 0;
      width: min(620px, calc(100vw - 32px));
      max-height: min(520px, 70vh);
      overflow: auto;
      z-index: 12000;

      background: #ffffff;
      border: 1px solid rgba(15, 23, 42, .11);
      border-radius: 14px;
      box-shadow:
        0 20px 55px rgba(15, 23, 42, .18);

      padding: 8px;
    }

    .sb-console-search-state {
      padding: 18px 16px;
      color: #64748b;
      font-size: 12px;
      line-height: 1.5;
    }

    .sb-console-search-result {
      width: 100%;
      display: grid;
      grid-template-columns:
        minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;

      text-align: left;
      border: 0;
      background: transparent;
      border-radius: 10px;
      padding: 11px 12px;
      cursor: pointer;
      font: inherit;
    }

    .sb-console-search-result:hover,
    .sb-console-search-result:focus-visible {
      background: #f2f7f5;
      outline: none;
    }

    .sb-console-search-copy {
      min-width: 0;
      display: grid;
      gap: 3px;
    }

    .sb-console-search-copy strong {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #172b26;
      font-size: 13px;
    }

    .sb-console-search-copy span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #64748b;
      font-size: 11px;
    }

    .sb-console-search-type {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 64px;
      border-radius: 999px;
      padding: 5px 8px;
      background: #edf7f2;
      color: #176b4b;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .04em;
    }

    @media (max-width: 720px) {
      .sb-console-search-panel {
        left: 0;
        right: auto;
        width: min(
          92vw,
          calc(100vw - 24px)
        );
      }
    }
  `;

  document.head.appendChild(style);

  /*
   * ==========================================================
   * SEARCH PANEL
   * ==========================================================
   */

  const panel =
    document.createElement("div");

  panel.className =
    "sb-console-search-panel";

  panel.hidden = true;

  panel.setAttribute(
    "role",
    "listbox"
  );

  panel.setAttribute(
    "aria-label",
    "Hasil pencarian management"
  );

  searchWrap.appendChild(panel);

  searchInput.setAttribute(
    "autocomplete",
    "off"
  );

  searchInput.setAttribute(
    "aria-expanded",
    "false"
  );

  let cache = null;
  let cacheAt = 0;
  let pending = null;
  let debounceTimer = null;
  let searchSequence = 0;

  const CACHE_TTL = 30000;

  async function api(url) {
    const response =
      await fetch(url, {
        credentials: "same-origin",
        headers: {
          Accept: "application/json"
        },
        cache: "no-store"
      });

    const data =
      await response
        .json()
        .catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.error ||
        `HTTP ${response.status}`
      );
    }

    return data;
  }

  function clientResults(clients) {
    return clients.map(client => ({
      type: "Client",
      module: "Clients",
      view: "clients",

      title:
        client.full_name ||
        client.company_name ||
        client.client_code ||
        "Client",

      meta: [
        client.client_code,
        client.company_name,
        client.email
      ]
        .filter(Boolean)
        .join(" • "),

      search: [
        client.full_name,
        client.company_name,
        client.email,
        client.client_code,
        client.phone
      ]
        .filter(Boolean)
        .join(" ")
    }));
  }

  function projectResults(projects) {
    return projects.map(project => ({
      type: "Project",
      module: "Projects",
      view: "projects",

      title:
        project.project_name ||
        project.project_code ||
        "Project",

      meta: [
        project.project_code,
        project.company_name ||
          project.full_name,
        project.status
      ]
        .filter(Boolean)
        .join(" • "),

      search: [
        project.project_name,
        project.project_code,
        project.company_name,
        project.full_name,
        project.client_code,
        project.status
      ]
        .filter(Boolean)
        .join(" ")
    }));
  }

  function leadResults(leads) {
    return leads.map(lead => ({
      type: "Lead",
      module: "Leads",
      view: "leads",

      title:
        lead.full_name ||
        lead.lead_code ||
        "Lead",

      meta: [
        lead.lead_code,
        lead.company_name,
        lead.email,
        lead.status
      ]
        .filter(Boolean)
        .join(" • "),

      search: [
        lead.full_name,
        lead.company_name,
        lead.email,
        lead.phone,
        lead.lead_code,
        lead.service_interest,
        lead.status
      ]
        .filter(Boolean)
        .join(" ")
    }));
  }

  async function loadSearchData() {
    const now = Date.now();

    if (
      cache &&
      now - cacheAt < CACHE_TTL
    ) {
      return cache;
    }

    if (pending) {
      return pending;
    }

    pending =
      Promise.allSettled([
        api("/api/admin/clients"),
        api("/api/admin/projects"),
        api("/api/admin/leads")
      ])
        .then(results => {
          const [
            clientsResult,
            projectsResult,
            leadsResult
          ] = results;

          const items = [];

          if (
            clientsResult.status ===
            "fulfilled"
          ) {
            items.push(
              ...clientResults(
                Array.isArray(
                  clientsResult.value.clients
                )
                  ? clientsResult.value.clients
                  : []
              )
            );
          }

          if (
            projectsResult.status ===
            "fulfilled"
          ) {
            items.push(
              ...projectResults(
                Array.isArray(
                  projectsResult.value.projects
                )
                  ? projectsResult.value.projects
                  : []
              )
            );
          }

          if (
            leadsResult.status ===
            "fulfilled"
          ) {
            items.push(
              ...leadResults(
                Array.isArray(
                  leadsResult.value.leads
                )
                  ? leadsResult.value.leads
                  : []
              )
            );
          }

          cache = items;
          cacheAt = Date.now();

          return cache;
        })
        .finally(() => {
          pending = null;
        });

    return pending;
  }

  function showPanel() {
    panel.hidden = false;

    searchInput.setAttribute(
      "aria-expanded",
      "true"
    );
  }

  function hidePanel() {
    panel.hidden = true;

    searchInput.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  function renderState(message) {
    panel.innerHTML = `
      <div class="sb-console-search-state">
        ${esc(message)}
      </div>
    `;

    showPanel();
  }

  function renderResults(items) {
    if (!items.length) {
      renderState(
        "Tidak ada client, project, atau lead yang cocok."
      );
      return;
    }

    panel.innerHTML =
      items
        .slice(0, 12)
        .map((item, index) => `
          <button
            type="button"
            class="sb-console-search-result"
            role="option"
            data-search-result="${index}"
          >
            <span class="sb-console-search-copy">
              <strong>
                ${esc(item.title)}
              </strong>

              <span>
                ${esc(item.meta || "-")}
              </span>
            </span>

            <span class="sb-console-search-type">
              ${esc(item.type)}
            </span>
          </button>
        `)
        .join("");

    panel._results =
      items.slice(0, 12);

    showPanel();
  }

  function navLink(name) {
    const target =
      normalize(name);

    return [
      ...document.querySelectorAll(
        ".nav a, .mobile-nav a"
      )
    ].find(link =>
      normalize(link.textContent) ===
      target
    );
  }

  function openResult(item) {
    if (!item) return;

    hidePanel();

    const link =
      navLink(item.module);

    if (!link) return;

    link.click();

    /*
     * Jika module memiliki search lokal,
     * teruskan keyword hasil yang dipilih.
     */
    window.setTimeout(() => {
      const view =
        document.querySelector(
          `[data-sb-view="${item.view}"]`
        );

      const localSearch =
        view?.querySelector(
          'input[type="search"]'
        );

      if (!localSearch) {
        return;
      }

      localSearch.value =
        item.title;

      localSearch.dispatchEvent(
        new Event(
          "input",
          { bubbles: true }
        )
      );

      localSearch.focus();
    }, 120);
  }

  async function runSearch() {
    const sequence =
      ++searchSequence;

    const query =
      normalize(searchInput.value);

    if (query.length < 2) {
      hidePanel();
      return;
    }

    renderState("Mencari data...");

    try {
      const data =
        await loadSearchData();

      if (
        sequence !==
        searchSequence
      ) {
        return;
      }

      const matches =
        data.filter(item =>
          normalize(
            `${item.title} ${item.meta} ${item.search}`
          ).includes(query)
        );

      renderResults(matches);

    } catch (error) {
      if (
        sequence !==
        searchSequence
      ) {
        return;
      }

      renderState(
        error?.message ||
        "Pencarian belum dapat dimuat."
      );
    }
  }

  searchInput.addEventListener(
    "input",
    () => {
      window.clearTimeout(
        debounceTimer
      );

      debounceTimer =
        window.setTimeout(
          runSearch,
          180
        );
    }
  );

  searchInput.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape"
      ) {
        hidePanel();
        return;
      }

      if (
        event.key === "Enter" &&
        !panel.hidden
      ) {
        event.preventDefault();

        const first =
          panel._results?.[0];

        if (first) {
          openResult(first);
        }
      }
    }
  );

  panel.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-search-result]"
        );

      if (!button) return;

      const index =
        Number(
          button.dataset.searchResult
        );

      openResult(
        panel._results?.[index]
      );
    }
  );

  document.addEventListener(
    "click",
    event => {
      if (
        !searchWrap.contains(
          event.target
        )
      ) {
        hidePanel();
      }
    }
  );

  /*
   * ==========================================================
   * REFRESH FEEDBACK
   * ==========================================================
   *
   * Handler fetch asli tetap milik leads.js/users.js.
   * Controller ini hanya memberi feedback visual sampai
   * tabel selesai dirender ulang.
   */

  function wireRefresh(
    buttonSelector,
    bodySelector
  ) {
    const button =
      document.querySelector(
        buttonSelector
      );

    const body =
      document.querySelector(
        bodySelector
      );

    if (
      !button ||
      button.dataset.sbRefreshUx ===
        "1"
    ) {
      return;
    }

    button.dataset.sbRefreshUx =
      "1";

    button.addEventListener(
      "click",
      () => {
        if (
          button.dataset
            .sbRefreshBusy ===
          "1"
        ) {
          return;
        }

        const original =
          button.textContent;

        button.dataset
          .sbRefreshBusy =
          "1";

        button.disabled = true;

        button.setAttribute(
          "aria-busy",
          "true"
        );

        button.textContent =
          "Memuat...";

        let finished = false;
        let observer = null;

        const finish = () => {
          if (finished) return;

          finished = true;

          observer?.disconnect();

          button.textContent =
            original;

          button.disabled = false;

          button.removeAttribute(
            "aria-busy"
          );

          delete button.dataset
            .sbRefreshBusy;
        };

        if (body) {
          observer =
            new MutationObserver(
              () => {
                window.setTimeout(
                  finish,
                  120
                );
              }
            );

          observer.observe(
            body,
            {
              childList: true,
              subtree: true,
              characterData: true
            }
          );
        }

        /*
         * Fallback supaya tombol tidak pernah
         * terkunci bila request gagal sebelum render.
         */
        window.setTimeout(
          finish,
          3500
        );
      }
    );
  }

  wireRefresh(
    "[data-leads-refresh]",
    "[data-leads-body]"
  );

  wireRefresh(
    "[data-users-refresh]",
    "[data-users-body]"
  );
})();