(() => {
  "use strict";

  const API = "/api/client/projects";
  const content = document.querySelector("main.content");

  if (!content) return;

  function esc(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function statusLabel(status) {
    return {
      planning: "Planning",
      design: "Design",
      development: "Development",
      testing: "Testing",
      production: "Production",
      completed: "Completed",
      on_hold: "On Hold",
      cancelled: "Cancelled"
    }[status] || status || "-";
  }

  function clampProgress(value) {
    const number = Number(value || 0);

    if (!Number.isFinite(number)) return 0;

    return Math.max(
      0,
      Math.min(100, Math.round(number))
    );
  }

  const style = document.createElement("style");

  style.textContent = `
    .sb-client-projects[hidden] {
      display:none !important;
    }

    .sb-client-projects {
      display:grid;
      gap:22px;
    }

    .sb-client-projects-head {
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:16px;
      flex-wrap:wrap;
    }

    .sb-client-projects-head h1 {
      margin:6px 0;
    }

    .sb-client-projects-summary {
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:14px;
    }

    .sb-project-name {
      display:grid;
      gap:3px;
    }

    .sb-project-name span {
      color:#64748b;
      font-size:12px;
    }

    .sb-project-progress {
      min-width:150px;
    }

    .sb-project-progress-track {
      height:7px;
      border-radius:999px;
      background:#e2e8f0;
      overflow:hidden;
      margin-bottom:5px;
    }

    .sb-project-progress-bar {
      height:100%;
      background:#169665;
      border-radius:999px;
    }

    @media(max-width:800px) {
      .sb-client-projects-summary {
        grid-template-columns:1fr;
      }
    }
  `;

  document.head.appendChild(style);

  const view = document.createElement("section");

  view.className = "sb-client-projects";
  view.dataset.sbView = "projects";
  view.hidden = true;

  view.innerHTML = `
    <div class="sb-client-projects-head">

      <div>
        <div class="eyebrow">
          <span class="pulse"></span>Client Projects &bull; R1
        </div>

        <h1>Projects</h1>

        <p>
          Pantau seluruh project yang terhubung dengan akun Anda.
        </p>
      </div>

      <div>
        <button class="secondary"
                data-portal-project-dashboard>
          &larr; Dashboard
        </button>

        <button class="secondary"
                data-portal-project-refresh>
          Refresh
        </button>
      </div>

    </div>

    <section class="sb-client-projects-summary">

      <article class="stat">
        <div class="meta">Total project</div>
        <div class="value" data-project-total>0</div>
        <div class="sub">Project akun Anda</div>
      </article>

      <article class="stat">
        <div class="meta">Aktif</div>
        <div class="value" data-project-active>0</div>
        <div class="sub">Sedang berjalan</div>
      </article>

      <article class="stat">
        <div class="meta">Completed</div>
        <div class="value" data-project-completed>0</div>
        <div class="sub">Project selesai</div>
      </article>

    </section>

    <article class="card">

      <div class="card-head">
        <div>
          <h2>Daftar Project</h2>
          <p>
            Data project langsung dari database D1.
          </p>
        </div>
      </div>

      <div class="table-wrap">
        <table>

          <thead>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th>Progress</th>
            </tr>
          </thead>

          <tbody data-project-rows></tbody>

        </table>
      </div>

    </article>
  `;

  content.appendChild(view);

  const rows =
    view.querySelector("[data-project-rows]");

  const total =
    view.querySelector("[data-project-total]");

  const active =
    view.querySelector("[data-project-active]");

  const completed =
    view.querySelector("[data-project-completed]");

  const ACTIVE = new Set([
    "planning",
    "design",
    "development",
    "testing",
    "production"
  ]);

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

  async function loadProjects() {

    rows.innerHTML =
      '<tr><td colspan="3">Memuat project...</td></tr>';

    try {

      const response = await fetch(API, {
        credentials:"same-origin",
        headers:{Accept:"application/json"},
        cache:"no-store"
      });

      const data =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}`
        );
      }

      const projects =
        Array.isArray(data.projects)
          ? data.projects
          : [];

      total.textContent =
        String(projects.length);

      active.textContent =
        String(
          projects.filter(project =>
            ACTIVE.has(project.status)
          ).length
        );

      completed.textContent =
        String(
          projects.filter(project =>
            project.status === "completed"
          ).length
        );

      rows.innerHTML = "";

      if (!projects.length) {

        rows.innerHTML = `
          <tr>
            <td colspan="3">
              Belum ada project untuk akun Anda.
            </td>
          </tr>
        `;

        return;
      }

      projects.forEach(project => {

        const tr =
          document.createElement("tr");

        const progress =
          clampProgress(project.progress);

        tr.innerHTML = `
          <td>
            <div class="sb-project-name">
              <strong>
                ${esc(project.project_name || "-")}
              </strong>

              <span>
                ${esc(project.project_code || "")}
              </span>
            </div>
          </td>

          <td>
            ${esc(statusLabel(project.status))}
          </td>

          <td>
            <div class="sb-project-progress">

              <div class="sb-project-progress-track">
                <div
                  class="sb-project-progress-bar"
                  style="width:${progress}%">
                </div>
              </div>

              <span>${progress}%</span>

            </div>
          </td>
        `;

        rows.appendChild(tr);
      });

    }
    catch (error) {

      rows.innerHTML = `
        <tr>
          <td colspan="3">
            Gagal memuat project:
            ${esc(error.message || "Unknown error")}
          </td>
        </tr>
      `;

    }
  }

  links("Projects").forEach(link => {

    link.addEventListener(
      "click",
      () => loadProjects()
    );

  });

  view
    .querySelector("[data-portal-project-refresh]")
    ?.addEventListener(
      "click",
      loadProjects
    );

  view
    .querySelector("[data-portal-project-dashboard]")
    ?.addEventListener(
      "click",
      () => links("Dashboard")[0]?.click()
    );

  window.addEventListener(
    "sb:portal-authenticated",
    loadProjects
  );

  if (window.SB_PORTAL_USER) {
    loadProjects();
  }

})();