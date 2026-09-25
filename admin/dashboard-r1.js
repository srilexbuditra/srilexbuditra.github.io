(() => {
  "use strict";

  /*
   * ==========================================================
   * ADMIN DASHBOARD LIVE DATA & ACTIONS R1
   * ==========================================================
   *
   * Controller khusus Dashboard.
   * Tidak mengubah logic module Projects / Clients / Leads /
   * Estimates / Invoices / Support / Activity Logs.
   */

  const content =
    document.querySelector("main.content");

  if (!content) return;

  const API = {
    projects: "/api/admin/projects",
    clients: "/api/admin/clients",
    leads: "/api/admin/leads",
    support: "/api/admin/support",
    invoices: "/api/admin/invoices",
    activity: "/api/admin/activity?limit=4"
  };

  /*
   * Status project yang dianggap masih aktif.
   * Completed, on_hold dan cancelled tidak dihitung aktif.
   */
  const ACTIVE_PROJECT_STATUS =
    new Set([
      "planning",
      "design",
      "development",
      "testing",
      "deployment",
      "maintenance"
    ]);

  let loading = false;
  let started = false;
  let authAttempts = 0;

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

  function statusLabel(status) {
    const labels = {
      planning: "Planning",
      design: "Design",
      development: "Development",
      testing: "Testing",
      deployment: "Deployment",
      maintenance: "Maintenance",
      completed: "Completed",
      on_hold: "On Hold",
      cancelled: "Cancelled"
    };

    return labels[status] || status || "-";
  }

  function formatDate(value, withTime = false) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    const options = withTime
      ? {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }
      : {
          day: "2-digit",
          month: "short",
          year: "numeric"
        };

    return new Intl.DateTimeFormat(
      "id-ID",
      options
    ).format(date);
  }

  function navLinks() {
    return [
      ...document.querySelectorAll(
        ".nav a, .mobile-nav a"
      )
    ];
  }

  function navLink(name) {
    const target = normalize(name);

    return navLinks().find(link =>
      normalize(link.textContent) === target
    );
  }

  function openModule(name) {
    const link = navLink(name);

    if (!link) {
      console.warn(
        `[Dashboard R1] Menu ${name} tidak ditemukan.`
      );
      return false;
    }

    link.click();
    return true;
  }

  function dashboardButtons() {
    return [
      ...content.querySelectorAll(
        ":scope > .page-head button"
      ),
      ...content.querySelectorAll(
        ":scope > section.grid.layout button"
      )
    ];
  }

  function buttonNamed(name) {
    const target = normalize(name);

    return dashboardButtons().find(button =>
      normalize(button.textContent) === target
    );
  }

  function findCard(title) {
    const target = normalize(title);

    return [
      ...content.querySelectorAll(
        ":scope > section.grid.layout article.card"
      )
    ].find(card =>
      normalize(
        card.querySelector("h2")?.textContent
      ) === target
    );
  }

  function topStats() {
    return content.querySelector(
      ":scope > section.stats.grid"
    );
  }

  function findTopStat(label) {
    const stats = topStats();

    if (!stats) return null;

    const target = normalize(label);

    return [...stats.querySelectorAll(".stat")]
      .find(stat =>
        normalize(
          stat.querySelector(".meta")?.textContent
        ) === target
      );
  }

  function setTopStat(label, value, sub) {
    const stat = findTopStat(label);

    if (!stat) return;

    const valueEl =
      stat.querySelector(".value");

    const subEl =
      stat.querySelector(".sub");

    if (valueEl) {
      valueEl.textContent =
        String(value);
    }

    if (subEl && sub !== undefined) {
      subEl.textContent =
        String(sub);
    }
  }

  async function fetchJson(url) {
    const response =
      await fetch(url, {
        method: "GET",
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

  /*
   * ==========================================================
   * PROJECTS
   * ==========================================================
   */

  function renderProjects(projects) {
    const active =
      projects.filter(project =>
        ACTIVE_PROJECT_STATUS.has(
          String(project.status || "")
        )
      );

    setTopStat(
      "Active projects",
      active.length,
      `${projects.length} total project`
    );

    const card =
      findCard("Active projects");

    const body =
      card?.querySelector("tbody");

    if (!body) return;

    if (!active.length) {
      body.innerHTML = `
        <tr>
          <td
            colspan="5"
            style="
              text-align:center;
              color:#64748b;
              padding:28px 16px;
            "
          >
            Belum ada project aktif.
          </td>
        </tr>
      `;

      return;
    }

    body.innerHTML =
      active
        .slice(0, 5)
        .map(project => {
          const client =
            project.company_name ||
            project.full_name ||
            project.client_code ||
            "-";

          const progress =
            Number.isFinite(
              Number(project.progress)
            )
              ? Number(project.progress)
              : 0;

          return `
            <tr>
              <td>
                <strong>
                  ${esc(project.project_name)}
                </strong>
                <div style="
                  margin-top:3px;
                  color:#64748b;
                  font-size:11px;
                ">
                  ${esc(project.project_code)}
                </div>
              </td>

              <td>
                ${esc(client)}
              </td>

              <td>
                ${esc(
                  statusLabel(project.status)
                )}
              </td>

              <td>
                ${esc(progress)}%
              </td>

              <td>
                ${esc(
                  formatDate(
                    project.target_date
                  )
                )}
              </td>
            </tr>
          `;
        })
        .join("");
  }

  /*
   * ==========================================================
   * CLIENTS
   * ==========================================================
   */

  function renderClients(clients) {
    const active =
      clients.filter(client =>
        client.status === "active"
      );

    setTopStat(
      "Active clients",
      active.length,
      `${clients.length} total client`
    );
  }

  /*
   * ==========================================================
   * LEADS
   * ==========================================================
   */

  function renderLeads(leads) {
    const newLeads =
      leads.filter(lead =>
        lead.status === "new"
      );

    setTopStat(
      "New leads",
      newLeads.length,
      newLeads.length
        ? "Perlu tindak lanjut"
        : "Tidak ada lead baru"
    );

    const card =
      findCard("New leads");

    const body =
      card?.querySelector(
        ".card-body.list"
      );

    if (!body) return;

    if (!newLeads.length) {
      body.innerHTML = `
        <div class="row">
          <div class="row-main">
            <strong>
              Tidak ada lead baru
            </strong>
            <span>
              Semua lead sudah ditindaklanjuti.
            </span>
          </div>
        </div>
      `;

      return;
    }

    body.innerHTML =
      newLeads
        .slice(0, 4)
        .map(lead => {
          const detail =
            lead.service_interest ||
            lead.company_name ||
            lead.email ||
            lead.phone ||
            lead.lead_code ||
            "-";

          return `
            <div class="row">
              <div class="row-main">
                <strong>
                  ${esc(lead.full_name)}
                </strong>

                <span>
                  ${esc(detail)}
                </span>
              </div>
            </div>
          `;
        })
        .join("");
  }

  /*
   * ==========================================================
   * SUPPORT
   * ==========================================================
   */

  function renderSupport(tickets) {
    const open =
      tickets.filter(ticket =>
        ticket.status === "open"
      );

    const progress =
      tickets.filter(ticket =>
        ticket.status === "in_progress"
      );

    setTopStat(
      "Open support",
      open.length,
      progress.length
        ? `${progress.length} sedang ditangani`
        : "Tidak ada tiket in progress"
    );
  }

  /*
   * ==========================================================
   * FINANCE SNAPSHOT
   * ==========================================================
   */

  function financeRow(label) {
    const card =
      findCard("Finance snapshot");

    if (!card) return null;

    const target =
      normalize(label);

    return [
      ...card.querySelectorAll(".row")
    ].find(row =>
      normalize(
        row.querySelector(
          ".row-main strong"
        )?.textContent
      ) === target
    );
  }

  function setFinance(
    label,
    value,
    description
  ) {
    const row =
      financeRow(label);

    if (!row) return;

    const valueEl =
      row.querySelector(":scope > strong");

    const descriptionEl =
      row.querySelector(
        ".row-main span"
      );

    if (valueEl) {
      valueEl.textContent =
        String(value);
    }

    if (
      descriptionEl &&
      description !== undefined
    ) {
      descriptionEl.textContent =
        description;
    }
  }

  function renderInvoices(invoices) {
    const pending =
      invoices.filter(invoice =>
        invoice.status === "sent" ||
        invoice.status === "overdue"
      );

    const overdue =
      invoices.filter(invoice =>
        invoice.status === "overdue"
      );

    const now =
      new Date();

    const monthKey =
      `${now.getFullYear()}-` +
      `${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

    const paidThisMonth =
      invoices.filter(invoice =>
        invoice.status === "paid" &&
        String(
          invoice.paid_at || ""
        ).startsWith(monthKey)
      );

    setFinance(
      "Pending invoices",
      pending.length,
      "Sent + overdue"
    );

    setFinance(
      "Paid this month",
      paidThisMonth.length,
      "Invoice lunas bulan ini"
    );

    setFinance(
      "Overdue",
      overdue.length,
      "Lewat jatuh tempo"
    );
  }

  /*
   * ==========================================================
   * RECENT ACTIVITY
   * ==========================================================
   */

  function renderActivity(activity) {
    const card =
      findCard("Recent activity");

    const body =
      card?.querySelector(
        ".card-body.activity"
      );

    if (!body) return;

    const latest =
      activity.slice(0, 4);

    if (!latest.length) {
      body.innerHTML = `
        <div class="activity-item">
          <span class="activity-icon">-</span>

          <div>
            <strong>
              Belum ada aktivitas
            </strong>

            <span>
              Activity Log masih kosong.
            </span>
          </div>
        </div>
      `;

      return;
    }

    body.innerHTML =
      latest
        .map(item => {
          const actor =
            item.user_full_name ||
            item.user_email ||
            "System";

          const title =
            item.description ||
            String(item.action || "")
              .replaceAll("_", " ");

          return `
            <div class="activity-item">
              <span class="activity-icon">
                &#10003;
              </span>

              <div>
                <strong>
                  ${esc(title)}
                </strong>

                <span>
                  ${esc(actor)}
                  &bull;
                  ${esc(
                    formatDate(
                      item.created_at,
                      true
                    )
                  )}
                </span>
              </div>
            </div>
          `;
        })
        .join("");
  }

  /*
   * ==========================================================
   * ERROR STATES
   * ==========================================================
   */

  function projectError() {
    setTopStat(
      "Active projects",
      "—",
      "Gagal memuat data"
    );

    const body =
      findCard("Active projects")
        ?.querySelector("tbody");

    if (body) {
      body.innerHTML = `
        <tr>
          <td
            colspan="5"
            style="
              text-align:center;
              color:#b42318;
              padding:28px 16px;
            "
          >
            Data project belum dapat dimuat.
          </td>
        </tr>
      `;
    }
  }

  function leadError() {
    setTopStat(
      "New leads",
      "—",
      "Gagal memuat data"
    );

    const body =
      findCard("New leads")
        ?.querySelector(
          ".card-body.list"
        );

    if (body) {
      body.innerHTML = `
        <div class="row">
          <div class="row-main">
            <strong>
              Data lead belum dapat dimuat
            </strong>
          </div>
        </div>
      `;
    }
  }

  function activityError() {
    const body =
      findCard("Recent activity")
        ?.querySelector(
          ".card-body.activity"
        );

    if (body) {
      body.innerHTML = `
        <div class="activity-item">
          <span class="activity-icon">!</span>

          <div>
            <strong>
              Activity belum dapat dimuat
            </strong>

            <span>
              Coba refresh Dashboard.
            </span>
          </div>
        </div>
      `;
    }
  }

  /*
   * ==========================================================
   * LOAD DASHBOARD
   * ==========================================================
   */

  async function loadDashboard() {
    if (loading) return;

    if (
      !window.SB_AUTH_USER ||
      ![
        "system_admin",
        "staff"
      ].includes(
        window.SB_AUTH_USER.role
      )
    ) {
      return;
    }

    loading = true;

    setTopStat(
      "Active projects",
      "...",
      "Memuat data D1"
    );

    setTopStat(
      "Active clients",
      "...",
      "Memuat data D1"
    );

    setTopStat(
      "New leads",
      "...",
      "Memuat data D1"
    );

    setTopStat(
      "Open support",
      "...",
      "Memuat data D1"
    );

    try {
      const results =
        await Promise.allSettled([
          fetchJson(API.projects),
          fetchJson(API.clients),
          fetchJson(API.leads),
          fetchJson(API.support),
          fetchJson(API.invoices),
          fetchJson(API.activity)
        ]);

      const [
        projectsResult,
        clientsResult,
        leadsResult,
        supportResult,
        invoicesResult,
        activityResult
      ] = results;

      if (
        projectsResult.status ===
        "fulfilled"
      ) {
        renderProjects(
          Array.isArray(
            projectsResult.value.projects
          )
            ? projectsResult.value.projects
            : []
        );
      } else {
        projectError();
      }

      if (
        clientsResult.status ===
        "fulfilled"
      ) {
        renderClients(
          Array.isArray(
            clientsResult.value.clients
          )
            ? clientsResult.value.clients
            : []
        );
      } else {
        setTopStat(
          "Active clients",
          "—",
          "Gagal memuat data"
        );
      }

      if (
        leadsResult.status ===
        "fulfilled"
      ) {
        renderLeads(
          Array.isArray(
            leadsResult.value.leads
          )
            ? leadsResult.value.leads
            : []
        );
      } else {
        leadError();
      }

      if (
        supportResult.status ===
        "fulfilled"
      ) {
        renderSupport(
          Array.isArray(
            supportResult.value.tickets
          )
            ? supportResult.value.tickets
            : []
        );
      } else {
        setTopStat(
          "Open support",
          "—",
          "Gagal memuat data"
        );
      }

      if (
        invoicesResult.status ===
        "fulfilled"
      ) {
        renderInvoices(
          Array.isArray(
            invoicesResult.value.invoices
          )
            ? invoicesResult.value.invoices
            : []
        );
      } else {
        setFinance(
          "Pending invoices",
          "—",
          "Gagal memuat data"
        );

        setFinance(
          "Paid this month",
          "—",
          "Gagal memuat data"
        );

        setFinance(
          "Overdue",
          "—",
          "Gagal memuat data"
        );
      }

      if (
        activityResult.status ===
        "fulfilled"
      ) {
        renderActivity(
          Array.isArray(
            activityResult.value.activity
          )
            ? activityResult.value.activity
            : []
        );
      } else {
        activityError();
      }

    } finally {
      loading = false;
    }
  }

  /*
   * ==========================================================
   * DASHBOARD ACTIONS
   * ==========================================================
   */

  function wireButton(
    label,
    handler
  ) {
    const button =
      buttonNamed(label);

    if (
      !button ||
      button.dataset.sbDashboardR1 === "1"
    ) {
      return;
    }

    button.dataset.sbDashboardR1 =
      "1";

    button.addEventListener(
      "click",
      handler
    );
  }

  function wireActions() {
    wireButton(
      "View all",
      () => openModule("Projects")
    );

    wireButton(
      "Open CRM",
      () => openModule("Leads")
    );

    wireButton(
      "New estimate",
      () => {
        if (
          !openModule("Estimates")
        ) {
          return;
        }

        window.setTimeout(() => {
          document
            .querySelector(
              '[data-sb-view="estimates"] [data-est-new]'
            )
            ?.click();
        }, 60);
      }
    );

    wireButton(
      "Open support",
      () => openModule("Support")
    );

    /*
     * STAFF BUSINESS ACTION GUARD:
     * New Client adalah system_admin only.
     */
    const newClient =
      buttonNamed("New client");

    if (newClient) {
      if (
        window.SB_AUTH_USER?.role ===
        "staff"
      ) {
        newClient.style.setProperty(
          "display",
          "none",
          "important"
        );

        newClient.setAttribute(
          "aria-hidden",
          "true"
        );
      } else {
        newClient.style.removeProperty(
          "display"
        );

        newClient.removeAttribute(
          "aria-hidden"
        );
      }
    }
  }

  function wireDashboardRefresh() {
    navLinks()
      .filter(link =>
        normalize(link.textContent) ===
        "dashboard"
      )
      .forEach(link => {
        if (
          link.dataset
            .sbDashboardRefreshR1 ===
          "1"
        ) {
          return;
        }

        link.dataset
          .sbDashboardRefreshR1 =
          "1";

        link.addEventListener(
          "click",
          () => {
            window.setTimeout(
              loadDashboard,
              80
            );
          }
        );
      });
  }

  /*
   * Tunggu admin/auth.js menyelesaikan /auth/me atau login.
   * Ini mencegah fetch Dashboard berjalan terlalu awal
   * lalu mendapat 401 sebelum sesi dipasang ke UI.
   */
  function startWhenAuthenticated() {
    if (started) return;

    const user =
      window.SB_AUTH_USER;

    if (
      !user ||
      ![
        "system_admin",
        "staff"
      ].includes(user.role)
    ) {
      authAttempts += 1;

      if (authAttempts <= 120) {
        window.setTimeout(
          startWhenAuthenticated,
          250
        );
      }

      return;
    }

    started = true;

    wireActions();
    wireDashboardRefresh();
    loadDashboard();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      startWhenAuthenticated,
      { once: true }
    );
  } else {
    startWhenAuthenticated();
  }
})();