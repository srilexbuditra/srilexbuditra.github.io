(() => {
  "use strict";

  const PROJECTS_API = "/api/admin/projects";
  const CLIENTS_API = "/api/admin/clients";

  const content = document.querySelector("main.content");
  if (!content) return;

  const dashboardNodes = [...content.children];

  const STATUS_LABEL = {
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

  const ACTIVE_STATUS = new Set([
    "planning",
    "design",
    "development",
    "testing",
    "deployment",
    "maintenance",
    "on_hold"
  ]);

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  }

  function badgeClass(status) {
    if (
      status === "development" ||
      status === "deployment" ||
      status === "completed"
    ) return "green";

    if (
      status === "design" ||
      status === "testing"
    ) return "blue";

    return "warn";
  }

  function addStyles() {
    if (document.getElementById("sb-project-management-styles")) return;

    const style = document.createElement("style");
    style.id = "sb-project-management-styles";

    style.textContent = `
      .sb-project-view[hidden],
      .sb-project-modal[hidden] {
        display: none !important;
      }

      .sb-project-view {
        display: grid;
        gap: 22px;
      }

      .sb-project-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 18px;
        flex-wrap: wrap;
      }

      .sb-project-head h1 {
        margin: 6px 0;
      }

      .sb-project-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .sb-project-summary {
        display: grid;
        grid-template-columns: repeat(3,minmax(0,1fr));
        gap: 14px;
      }

      .sb-project-table .empty {
        padding: 30px 18px;
        text-align: center;
        color: #64748b;
      }

      .sb-project-name {
        display: grid;
        gap: 3px;
      }

      .sb-project-name span {
        color: #64748b;
        font-size: 12px;
      }

      .sb-project-progress {
        min-width: 130px;
      }

      .sb-project-notice {
        display: none;
        padding: 12px 14px;
        border-radius: 10px;
        background: #ecfdf5;
        color: #166534;
        font-size: 13px;
        font-weight: 700;
      }

      .sb-project-notice.show {
        display: block;
      }

      .sb-project-modal {
        position: fixed;
        inset: 0;
        z-index: 100000;
        display: grid;
        place-items: center;
        padding: 22px;
        background: rgba(2,8,6,.72);
        backdrop-filter: blur(6px);
      }

      .sb-project-modal-card {
        width: min(100%,680px);
        max-height: calc(100vh - 44px);
        overflow: auto;
        background: #fff;
        color: #0f172a;
        border-radius: 20px;
        box-shadow: 0 24px 80px rgba(0,0,0,.35);
      }

      .sb-project-modal-head {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 22px 24px 16px;
        border-bottom: 1px solid #e2e8f0;
      }

      .sb-project-modal-head h2 {
        margin: 0 0 5px;
      }

      .sb-project-modal-head p {
        margin: 0;
        color: #64748b;
        font-size: 13px;
      }

      .sb-project-close {
        border: 0;
        background: #f1f5f9;
        width: 38px;
        height: 38px;
        border-radius: 10px;
        cursor: pointer;
        font-size: 20px;
      }

      .sb-project-form {
        padding: 22px 24px 24px;
      }

      .sb-project-form-grid {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 16px;
      }

      .sb-project-field {
        display: grid;
        gap: 7px;
      }

      .sb-project-field.full {
        grid-column: 1 / -1;
      }

      .sb-project-field label {
        font-size: 13px;
        font-weight: 800;
      }

      .sb-project-field input,
      .sb-project-field select,
      .sb-project-field textarea {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        padding: 12px 13px;
        font: inherit;
        outline: none;
        background: #fff;
      }

      .sb-project-field textarea {
        min-height: 90px;
        resize: vertical;
      }

      .sb-project-field input:focus,
      .sb-project-field select:focus,
      .sb-project-field textarea:focus {
        border-color: #16a34a;
        box-shadow: 0 0 0 3px rgba(22,163,74,.12);
      }

      .sb-project-error {
        min-height: 20px;
        margin: 12px 0;
        color: #b91c1c;
        font-size: 13px;
        font-weight: 700;
      }

      .sb-project-form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }

      @media (max-width:720px) {
        .sb-project-summary,
        .sb-project-form-grid {
          grid-template-columns: 1fr;
        }

        .sb-project-field.full {
          grid-column: auto;
        }

        .sb-project-actions {
          width: 100%;
        }

        .sb-project-actions button {
          flex: 1;
        }
      }
    `;

    document.head.appendChild(style);
  }

  addStyles();

  const view = document.createElement("section");
  view.className = "sb-project-view";
  view.hidden = true;

  view.innerHTML = `
    <div class="sb-project-head">
      <div>
        <div class="eyebrow">
          <span class="pulse"></span>Project Management &bull; R1
        </div>
        <h1>Projects</h1>
        <p>Kelola project yang terhubung langsung ke client dan database D1.</p>
      </div>

      <div class="sb-project-actions">
        <button class="secondary" type="button" data-project-dashboard>
          &larr; Dashboard
        </button>
        <button class="secondary" type="button" data-project-refresh>
          Refresh
        </button>
        <button class="primary" type="button" data-project-new>
          + Tambah Project
        </button>
      </div>
    </div>

    <div class="sb-project-notice" data-project-notice></div>

    <section class="sb-project-summary">
      <article class="stat">
        <div class="meta">Total projects</div>
        <div class="value" data-project-total>0</div>
        <div class="sub">Database D1</div>
      </article>

      <article class="stat">
        <div class="meta">Active projects</div>
        <div class="value" data-project-active>0</div>
        <div class="sub">Sedang berjalan</div>
      </article>

      <article class="stat">
        <div class="meta">Completed</div>
        <div class="value" data-project-completed>0</div>
        <div class="sub">Project selesai</div>
      </article>
    </section>

    <article class="card sb-project-table">
      <div class="card-head">
        <div>
          <h2>Daftar Project</h2>
          <p>Project aktif dan histori project Client &amp; Management Platform R1</p>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Target</th>
            </tr>
          </thead>
          <tbody data-project-rows></tbody>
        </table>
      </div>

      <div class="empty" data-project-empty hidden>
        Belum ada project. Klik “Tambah Project” untuk membuat project pertama.
      </div>
    </article>
  `;

  content.appendChild(view);

  const modal = document.createElement("div");
  modal.className = "sb-project-modal";
  modal.hidden = true;

  modal.innerHTML = `
    <div class="sb-project-modal-card" role="dialog" aria-modal="true">
      <div class="sb-project-modal-head">
        <div>
          <h2>Tambah Project</h2>
          <p>Project akan langsung terhubung ke akun client yang dipilih.</p>
        </div>
        <button class="sb-project-close" type="button" data-project-close>×</button>
      </div>

      <form class="sb-project-form" data-project-form>
        <div class="sb-project-form-grid">

          <div class="sb-project-field full">
            <label>Client *</label>
            <select name="client_id" required data-project-client>
              <option value="">Memuat client...</option>
            </select>
          </div>

          <div class="sb-project-field full">
            <label>Nama project *</label>
            <input name="project_name" required>
          </div>

          <div class="sb-project-field full">
            <label>Deskripsi</label>
            <textarea name="description"></textarea>
          </div>

          <div class="sb-project-field">
            <label>Status</label>
            <select name="status">
              <option value="planning">Planning</option>
              <option value="design">Design</option>
              <option value="development">Development</option>
              <option value="testing">Testing</option>
              <option value="deployment">Deployment</option>
              <option value="maintenance">Maintenance</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div class="sb-project-field">
            <label>Progress (%)</label>
            <input name="progress" type="number" min="0" max="100" step="1" value="0" required>
          </div>

          <div class="sb-project-field">
            <label>Tanggal mulai</label>
            <input name="start_date" type="date">
          </div>

          <div class="sb-project-field">
            <label>Target selesai</label>
            <input name="target_date" type="date">
          </div>

        </div>

        <div class="sb-project-error" data-project-error></div>

        <div class="sb-project-form-actions">
          <button class="secondary" type="button" data-project-cancel>
            Batal
          </button>
          <button class="primary" type="submit" data-project-submit>
            Simpan Project
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const rowsEl = view.querySelector("[data-project-rows]");
  const emptyEl = view.querySelector("[data-project-empty]");
  const totalEl = view.querySelector("[data-project-total]");
  const activeEl = view.querySelector("[data-project-active]");
  const completedEl = view.querySelector("[data-project-completed]");
  const noticeEl = view.querySelector("[data-project-notice]");

  const form = modal.querySelector("[data-project-form]");
  const clientSelect = modal.querySelector("[data-project-client]");
  const formError = modal.querySelector("[data-project-error]");
  const submitButton = modal.querySelector("[data-project-submit]");

  function navLinks() {
    return [...document.querySelectorAll(".nav a, .mobile-nav a")];
  }

  function linksNamed(name) {
    return navLinks().filter(
      a => a.textContent.trim().toLowerCase() === name.toLowerCase()
    );
  }

  function setActive(name) {
    navLinks().forEach(a => a.classList.remove("active"));
    linksNamed(name).forEach(a => a.classList.add("active"));
  }

  function showDashboard() {
    dashboardNodes.forEach(node => {
      node.removeAttribute("data-sb-project-hidden");
    });

    view.hidden = true;
    setActive("Dashboard");

    linksNamed("Home").forEach(a => a.classList.add("active"));
  }

  async function showProjects() {
    dashboardNodes.forEach(node => {
      node.setAttribute("data-sb-project-hidden", "1");
    });

    dashboardNodes.forEach(node => {
      if (node.hasAttribute("data-sb-project-hidden")) {
        node.style.display = "none";
      }
    });

    view.hidden = false;
    setActive("Projects");

    await loadProjects();
  }

  function restoreDashboardDisplay() {
    dashboardNodes.forEach(node => {
      node.style.removeProperty("display");
      node.removeAttribute("data-sb-project-hidden");
    });
  }

  async function loadClientsForForm() {
    clientSelect.innerHTML =
      '<option value="">Memuat client...</option>';

    try {
      const response = await fetch(CLIENTS_API, {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
        cache: "no-store"
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      const clients = (data.clients || []).filter(
        client =>
          client.status === "active" &&
          client.account_status === "active"
      );

      clientSelect.innerHTML =
        '<option value="">Pilih client</option>';

      clients.forEach(client => {
        const option = document.createElement("option");
        option.value = client.id;
        option.textContent =
          `${client.full_name || client.email} — ${client.client_code}`;
        clientSelect.appendChild(option);
      });

      if (!clients.length) {
        clientSelect.innerHTML =
          '<option value="">Belum ada client aktif</option>';
      }
    } catch (error) {
      clientSelect.innerHTML =
        '<option value="">Gagal memuat client</option>';
    }
  }

  async function openModal() {
    form.reset();
    form.querySelector("[name='progress']").value = "0";
    form.querySelector("[name='status']").value = "planning";

    formError.textContent = "";
    modal.hidden = false;

    await loadClientsForForm();
  }

  function closeModal() {
    modal.hidden = true;
    formError.textContent = "";
  }

  function showNotice(message) {
    noticeEl.textContent = message;
    noticeEl.classList.add("show");

    setTimeout(() => {
      noticeEl.classList.remove("show");
    }, 4500);
  }

  function updateDashboardCount(projects) {
    const count = projects.filter(project =>
      ACTIVE_STATUS.has(project.status)
    ).length;

    document.querySelectorAll(".stat").forEach(stat => {
      const meta = stat.querySelector(".meta");
      const value = stat.querySelector(".value");

      if (
        meta &&
        value &&
        meta.textContent.trim().toLowerCase() === "active projects"
      ) {
        value.textContent = String(count);
      }
    });
  }

  function renderProjects(projects) {
    rowsEl.innerHTML = "";

    const active = projects.filter(project =>
      ACTIVE_STATUS.has(project.status)
    ).length;

    const completed = projects.filter(
      project => project.status === "completed"
    ).length;

    totalEl.textContent = String(projects.length);
    activeEl.textContent = String(active);
    completedEl.textContent = String(completed);

    emptyEl.hidden = projects.length !== 0;

    projects.forEach(project => {
      const progress = Math.max(
        0,
        Math.min(100, Number(project.progress || 0))
      );

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>
          <div class="sb-project-name">
            <strong>${escapeHtml(project.project_name || "-")}</strong>
            <span>${escapeHtml(project.project_code || "-")}</span>
          </div>
        </td>

        <td>
          ${escapeHtml(
            project.company_name ||
            project.full_name ||
            project.client_code ||
            "-"
          )}
        </td>

        <td>
          <span class="badge ${badgeClass(project.status)}">
            ${escapeHtml(STATUS_LABEL[project.status] || project.status)}
          </span>
        </td>

        <td class="sb-project-progress">
          <div class="progress">
            <span style="width:${progress}%"></span>
          </div>
          <span class="kicker">${progress}%</span>
        </td>

        <td>${escapeHtml(formatDate(project.target_date))}</td>
      `;

      rowsEl.appendChild(tr);
    });

    updateDashboardCount(projects);
  }

  async function loadProjects() {
    rowsEl.innerHTML =
      '<tr><td colspan="5">Memuat data project...</td></tr>';

    emptyEl.hidden = true;

    try {
      const response = await fetch(PROJECTS_API, {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
        cache: "no-store"
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      renderProjects(
        Array.isArray(data.projects) ? data.projects : []
      );
    } catch (error) {
      rowsEl.innerHTML = `
        <tr>
          <td colspan="5">
            Gagal memuat project: ${escapeHtml(error.message || "Unknown error")}
          </td>
        </tr>
      `;
    }
  }

  async function createProject(event) {
    event.preventDefault();

    const fd = new FormData(form);

    const payload = {
      client_id: String(fd.get("client_id") || ""),
      project_name: String(fd.get("project_name") || "").trim(),
      description: String(fd.get("description") || "").trim(),
      status: String(fd.get("status") || "planning"),
      progress: Number(fd.get("progress") || 0),
      start_date: String(fd.get("start_date") || "") || null,
      target_date: String(fd.get("target_date") || "") || null
    };

    formError.textContent = "";
    submitButton.disabled = true;
    submitButton.textContent = "Menyimpan...";

    try {
      const response = await fetch(PROJECTS_API, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.project) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      closeModal();
      await loadProjects();

      showNotice(
        `Project ${data.project.project_code || ""} berhasil dibuat.`
      );
    } catch (error) {
      formError.textContent =
        error instanceof Error
          ? error.message
          : "Project belum dapat dibuat.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Simpan Project";
    }
  }

  linksNamed("Projects").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      showProjects();
    });
  });

  linksNamed("Clients").forEach(link => {
    link.addEventListener("click", () => {
      view.hidden = true;
      restoreDashboardDisplay();
    });
  });

  [...linksNamed("Dashboard"), ...linksNamed("Home")].forEach(link => {
    link.addEventListener("click", () => {
      view.hidden = true;
      restoreDashboardDisplay();
    });
  });

  document.querySelectorAll("button").forEach(button => {
    const label = button.textContent.trim().toLowerCase();

    if (
      label === "new project" ||
      label === "+ new project"
    ) {
      button.addEventListener("click", openModal);
    }
  });

  view.querySelector("[data-project-dashboard]")
    ?.addEventListener("click", () => {
      restoreDashboardDisplay();
      showDashboard();
    });

  view.querySelector("[data-project-refresh]")
    ?.addEventListener("click", loadProjects);

  view.querySelector("[data-project-new]")
    ?.addEventListener("click", openModal);

  modal.querySelector("[data-project-close]")
    ?.addEventListener("click", closeModal);

  modal.querySelector("[data-project-cancel]")
    ?.addEventListener("click", closeModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  form.addEventListener("submit", createProject);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  loadProjects();
})();