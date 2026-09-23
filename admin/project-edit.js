(() => {
  "use strict";

  const API = "/api/admin/projects";
  let projects = [];
  let currentProject = null;
  let syncing = false;

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  const style = document.createElement("style");
  style.textContent = `
    .sb-project-edit-modal[hidden] {
      display:none !important;
    }

    .sb-project-edit-modal {
      position:fixed;
      inset:0;
      z-index:100001;
      display:grid;
      place-items:center;
      padding:22px;
      background:rgba(2,8,6,.72);
      backdrop-filter:blur(6px);
    }

    .sb-project-edit-card {
      width:min(100%,560px);
      background:#fff;
      color:#0f172a;
      border-radius:20px;
      box-shadow:0 24px 80px rgba(0,0,0,.35);
      overflow:hidden;
    }

    .sb-project-edit-head {
      display:flex;
      justify-content:space-between;
      gap:16px;
      padding:22px 24px 16px;
      border-bottom:1px solid #e2e8f0;
    }

    .sb-project-edit-head h2 {
      margin:0 0 5px;
    }

    .sb-project-edit-head p {
      margin:0;
      color:#64748b;
      font-size:13px;
    }

    .sb-project-edit-close {
      border:0;
      background:#f1f5f9;
      width:38px;
      height:38px;
      border-radius:10px;
      cursor:pointer;
      font-size:20px;
    }

    .sb-project-edit-form {
      padding:22px 24px 24px;
    }

    .sb-project-edit-info {
      margin-bottom:18px;
      padding:13px 14px;
      background:#f8fafc;
      border-radius:10px;
      font-size:13px;
      line-height:1.5;
    }

    .sb-project-edit-grid {
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:16px;
    }

    .sb-project-edit-field {
      display:grid;
      gap:7px;
    }

    .sb-project-edit-field.full {
      grid-column:1 / -1;
    }

    .sb-project-edit-field label {
      font-size:13px;
      font-weight:800;
    }

    .sb-project-edit-field input,
    .sb-project-edit-field select {
      width:100%;
      box-sizing:border-box;
      padding:12px 13px;
      border:1px solid #cbd5e1;
      border-radius:10px;
      background:#fff;
      font:inherit;
    }

    .sb-project-edit-error {
      min-height:20px;
      margin:12px 0;
      color:#b91c1c;
      font-size:13px;
      font-weight:700;
    }

    .sb-project-edit-actions {
      display:flex;
      justify-content:flex-end;
      gap:10px;
    }

    .sb-project-edit-button {
      white-space:nowrap;
    }

    @media(max-width:640px) {
      .sb-project-edit-grid {
        grid-template-columns:1fr;
      }

      .sb-project-edit-field.full {
        grid-column:auto;
      }
    }
  `;
  document.head.appendChild(style);

  const modal = document.createElement("div");
  modal.className = "sb-project-edit-modal";
  modal.hidden = true;

  modal.innerHTML = `
    <div class="sb-project-edit-card">
      <div class="sb-project-edit-head">
        <div>
          <h2>Update Project</h2>
          <p>Perubahan akan langsung tersimpan ke D1.</p>
        </div>
        <button type="button" class="sb-project-edit-close">&times;</button>
      </div>

      <form class="sb-project-edit-form">
        <div class="sb-project-edit-info" data-edit-info></div>

        <div class="sb-project-edit-grid">
          <div class="sb-project-edit-field">
            <label>Status</label>
            <select name="status" required>
              <option value="planning">Planning</option>
              <option value="design">Design</option>
              <option value="development">Development</option>
              <option value="testing">Testing</option>
              <option value="deployment">Deployment</option>
              <option value="maintenance">Maintenance</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div class="sb-project-edit-field">
            <label>Progress (%)</label>
            <input
              name="progress"
              type="number"
              min="0"
              max="100"
              step="1"
              required
            >
          </div>

          <div class="sb-project-edit-field full">
            <label>Target selesai</label>
            <input name="target_date" type="date">
          </div>
        </div>

        <div class="sb-project-edit-error" data-edit-error></div>

        <div class="sb-project-edit-actions">
          <button class="secondary" type="button" data-edit-cancel>
            Batal
          </button>
          <button class="primary" type="submit" data-edit-submit>
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const form = modal.querySelector("form");
  const info = modal.querySelector("[data-edit-info]");
  const errorEl = modal.querySelector("[data-edit-error]");
  const submit = modal.querySelector("[data-edit-submit]");

  function closeModal() {
    modal.hidden = true;
    currentProject = null;
    errorEl.textContent = "";
  }

  function openModal(project) {
    currentProject = project;

    info.innerHTML = `
      <strong>${escapeHtml(project.project_name || "Project")}</strong><br>
      ${escapeHtml(project.project_code || "-")}
    `;

    form.elements.status.value = project.status || "planning";
    form.elements.progress.value = Number(project.progress || 0);
    form.elements.target_date.value = project.target_date
      ? String(project.target_date).slice(0,10)
      : "";

    errorEl.textContent = "";
    modal.hidden = false;
  }

  async function fetchProjects() {
    const response = await fetch(API, {
      credentials:"same-origin",
      headers:{ Accept:"application/json" },
      cache:"no-store"
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    projects = Array.isArray(data.projects) ? data.projects : [];
  }

  function decorateRows() {
    const tbody = document.querySelector("[data-project-rows]");
    if (!tbody) return;

    const table = tbody.closest("table");
    const headRow = table?.querySelector("thead tr");

    if (
      headRow &&
      !headRow.querySelector("[data-project-action-head]")
    ) {
      const th = document.createElement("th");
      th.textContent = "Action";
      th.setAttribute("data-project-action-head", "1");
      headRow.appendChild(th);
    }

    [...tbody.querySelectorAll("tr")].forEach(row => {
      if (row.querySelector("[data-project-edit]")) return;

      const code =
        row.querySelector(".sb-project-name span")
          ?.textContent.trim();

      if (!code) return;

      const project = projects.find(
        item => item.project_code === code
      );

      if (!project) return;

      const td = document.createElement("td");
      const button = document.createElement("button");

      button.type = "button";
      button.className = "secondary sb-project-edit-button";
      button.textContent = "Edit";
      button.dataset.projectEdit = project.id;

      td.appendChild(button);
      row.appendChild(td);
    });
  }

  async function syncRows() {
    if (syncing) return;
    syncing = true;

    try {
      await fetchProjects();
      decorateRows();
    } catch (error) {
      console.error("Project edit sync failed.", error);
    } finally {
      syncing = false;
    }
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-project-edit]");
    if (!button) return;

    const project = projects.find(
      item => item.id === button.dataset.projectEdit
    );

    if (project) openModal(project);
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (!currentProject) return;

    const payload = {
      status: form.elements.status.value,
      progress: Number(form.elements.progress.value),
      target_date: form.elements.target_date.value || null
    };

    errorEl.textContent = "";
    submit.disabled = true;
    submit.textContent = "Menyimpan...";

    try {
      const response = await fetch(
        `${API}/${encodeURIComponent(currentProject.id)}`,
        {
          method:"PATCH",
          credentials:"same-origin",
          headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
          },
          body:JSON.stringify(payload)
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.project) {
        throw new Error(
          data.error || `HTTP ${response.status}`
        );
      }

      closeModal();

      const refresh =
        document.querySelector("[data-project-refresh]");

      if (refresh) {
        refresh.click();
      }

      setTimeout(syncRows, 500);

      const notice =
        document.querySelector("[data-project-notice]");

      if (notice) {
        notice.textContent =
          `Project ${data.project.project_code} berhasil diperbarui.`;

        notice.classList.add("show");

        setTimeout(() => {
          notice.classList.remove("show");
        }, 4500);
      }
    } catch (error) {
      errorEl.textContent =
        error instanceof Error
          ? error.message
          : "Project belum dapat diperbarui.";
    } finally {
      submit.disabled = false;
      submit.textContent = "Simpan Perubahan";
    }
  });

  modal
    .querySelector(".sb-project-edit-close")
    .addEventListener("click", closeModal);

  modal
    .querySelector("[data-edit-cancel]")
    .addEventListener("click", closeModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  const tbody = document.querySelector("[data-project-rows]");

  if (tbody) {
    new MutationObserver(() => {
      setTimeout(syncRows, 50);
    }).observe(tbody, {
      childList:true
    });
  }

  setTimeout(syncRows, 300);
})();