(() => {
  "use strict";

  const DOCUMENTS_API = "/api/admin/documents";
  const CLIENTS_API = "/api/admin/clients";
  const PROJECTS_API = "/api/admin/projects";

  const content = document.querySelector("main.content");
  if (!content) return;

  let clients = [];
  let projects = [];

  function esc(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function sizeLabel(bytes) {
    const n = Number(bytes || 0);
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(1)} MB`;
  }

  function dateLabel(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  }

  const style = document.createElement("style");
  style.textContent = `
    .sb-doc-view[hidden],
    .sb-doc-modal[hidden] { display:none !important; }

    .sb-doc-view { display:grid; gap:22px; }

    .sb-doc-head {
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:18px;
      flex-wrap:wrap;
    }

    .sb-doc-head h1 { margin:6px 0; }

    .sb-doc-actions {
      display:flex;
      gap:10px;
      flex-wrap:wrap;
    }

    .sb-doc-summary {
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:14px;
    }

    .sb-doc-empty {
      padding:32px 18px;
      text-align:center;
      color:#64748b;
    }

    .sb-doc-title {
      display:grid;
      gap:3px;
    }

    .sb-doc-title span {
      color:#64748b;
      font-size:12px;
    }

    .sb-doc-download {
      text-decoration:none;
      display:inline-flex;
      align-items:center;
      justify-content:center;
    }

    .sb-doc-notice {
      display:none;
      padding:12px 14px;
      border-radius:10px;
      background:#ecfdf5;
      color:#166534;
      font-weight:700;
      font-size:13px;
    }

    .sb-doc-notice.show { display:block; }

    .sb-doc-modal {
      position:fixed;
      inset:0;
      z-index:100010;
      display:grid;
      place-items:center;
      padding:22px;
      background:rgba(2,8,6,.72);
      backdrop-filter:blur(6px);
    }

    .sb-doc-modal-card {
      width:min(100%,680px);
      max-height:calc(100vh - 44px);
      overflow:auto;
      border-radius:20px;
      background:#fff;
      color:#0f172a;
      box-shadow:0 24px 80px rgba(0,0,0,.35);
    }

    .sb-doc-modal-head {
      display:flex;
      justify-content:space-between;
      gap:16px;
      padding:22px 24px 16px;
      border-bottom:1px solid #e2e8f0;
    }

    .sb-doc-modal-head h2 { margin:0 0 5px; }

    .sb-doc-modal-head p {
      margin:0;
      color:#64748b;
      font-size:13px;
    }

    .sb-doc-close {
      width:38px;
      height:38px;
      border:0;
      border-radius:10px;
      background:#f1f5f9;
      cursor:pointer;
      font-size:20px;
    }

    .sb-doc-form { padding:22px 24px 24px; }

    .sb-doc-grid {
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:16px;
    }

    .sb-doc-field {
      display:grid;
      gap:7px;
    }

    .sb-doc-field.full { grid-column:1 / -1; }

    .sb-doc-field label {
      font-size:13px;
      font-weight:800;
    }

    .sb-doc-field input,
    .sb-doc-field select,
    .sb-doc-field textarea {
      width:100%;
      box-sizing:border-box;
      padding:12px 13px;
      border:1px solid #cbd5e1;
      border-radius:10px;
      background:#fff;
      font:inherit;
    }

    .sb-doc-field textarea {
      min-height:85px;
      resize:vertical;
    }

    .sb-doc-note {
      margin:16px 0;
      padding:12px 14px;
      border-radius:10px;
      background:#f8fafc;
      color:#475569;
      font-size:12px;
      line-height:1.55;
    }

    .sb-doc-error {
      min-height:20px;
      margin:10px 0;
      color:#b91c1c;
      font-size:13px;
      font-weight:700;
    }

    .sb-doc-form-actions {
      display:flex;
      justify-content:flex-end;
      gap:10px;
    }

    @media(max-width:720px) {
      .sb-doc-summary,
      .sb-doc-grid {
        grid-template-columns:1fr;
      }

      .sb-doc-field.full { grid-column:auto; }

      .sb-doc-actions {
        width:100%;
      }

      .sb-doc-actions button {
        flex:1;
      }
    }
  `;
  document.head.appendChild(style);

  const view = document.createElement("section");
  view.className = "sb-doc-view";
  view.hidden = true;

  view.innerHTML = `
    <div class="sb-doc-head">
      <div>
        <div class="eyebrow">
          <span class="pulse"></span>Document Management &bull; R1
        </div>
        <h1>Documents</h1>
        <p>Dokumen private yang terhubung ke client dan project.</p>
      </div>

      <div class="sb-doc-actions">
        <button class="secondary" type="button" data-doc-dashboard>
          &larr; Dashboard
        </button>
        <button class="secondary" type="button" data-doc-refresh>
          Refresh
        </button>
        <button class="primary" type="button" data-doc-upload>
          + Upload Dokumen
        </button>
      </div>
    </div>

    <div class="sb-doc-notice" data-doc-notice></div>

    <section class="sb-doc-summary">
      <article class="stat">
        <div class="meta">Total documents</div>
        <div class="value" data-doc-total>0</div>
        <div class="sub">Database D1 + R2</div>
      </article>

      <article class="stat">
        <div class="meta">Published</div>
        <div class="value" data-doc-published>0</div>
        <div class="sub">Tersedia untuk client</div>
      </article>

      <article class="stat">
        <div class="meta">Storage</div>
        <div class="value" data-doc-storage>0 B</div>
        <div class="sub">Total ukuran file</div>
      </article>
    </section>

    <article class="card">
      <div class="card-head">
        <div>
          <h2>Daftar Dokumen</h2>
          <p>File disimpan private di R2 dan metadata di D1.</p>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Dokumen</th>
              <th>Client</th>
              <th>Project</th>
              <th>Ukuran</th>
              <th>Tanggal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody data-doc-rows></tbody>
        </table>
      </div>

      <div class="sb-doc-empty" data-doc-empty hidden>
        Belum ada dokumen.
      </div>
    </article>
  `;

  content.appendChild(view);

  const modal = document.createElement("div");
  modal.className = "sb-doc-modal";
  modal.hidden = true;

  modal.innerHTML = `
    <div class="sb-doc-modal-card">
      <div class="sb-doc-modal-head">
        <div>
          <h2>Upload Dokumen</h2>
          <p>File akan disimpan private di R2.</p>
        </div>
        <button class="sb-doc-close" type="button" data-doc-close>&times;</button>
      </div>

      <form class="sb-doc-form" data-doc-form>
        <div class="sb-doc-grid">

          <div class="sb-doc-field full">
            <label>Client *</label>
            <select name="client_id" required data-doc-client>
              <option value="">Memuat client...</option>
            </select>
          </div>

          <div class="sb-doc-field full">
            <label>Project</label>
            <select name="project_id" data-doc-project>
              <option value="">Tanpa project khusus</option>
            </select>
          </div>

          <div class="sb-doc-field full">
            <label>Judul dokumen *</label>
            <input name="title" maxlength="180" required>
          </div>

          <div class="sb-doc-field full">
            <label>Deskripsi</label>
            <textarea name="description" maxlength="2000"></textarea>
          </div>

          <div class="sb-doc-field full">
            <label>File *</label>
            <input
              name="file"
              type="file"
              required
              accept=".pdf,.jpg,.jpeg,.png,.webp,.txt,.docx,.xlsx,.pptx"
            >
          </div>

        </div>

        <div class="sb-doc-note">
          Maksimal 15 MB. Format R1: PDF, JPG, PNG, WEBP, TXT,
          DOCX, XLSX, dan PPTX. File tidak dipublikasikan langsung.
        </div>

        <div class="sb-doc-error" data-doc-error></div>

        <div class="sb-doc-form-actions">
          <button class="secondary" type="button" data-doc-cancel>
            Batal
          </button>
          <button class="primary" type="submit" data-doc-submit>
            Upload Dokumen
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const rows = view.querySelector("[data-doc-rows]");
  const empty = view.querySelector("[data-doc-empty]");
  const total = view.querySelector("[data-doc-total]");
  const published = view.querySelector("[data-doc-published]");
  const storage = view.querySelector("[data-doc-storage]");
  const notice = view.querySelector("[data-doc-notice]");

  const form = modal.querySelector("[data-doc-form]");
  const clientSelect = modal.querySelector("[data-doc-client]");
  const projectSelect = modal.querySelector("[data-doc-project]");
  const errorEl = modal.querySelector("[data-doc-error]");
  const submit = modal.querySelector("[data-doc-submit]");

  function links(name) {
    return [...document.querySelectorAll(".nav a, .mobile-nav a")]
      .filter(a => a.textContent.trim().toLowerCase() === name.toLowerCase());
  }

  function showOnlyDocuments() {
    [...content.children].forEach(node => {
      if (node !== view) node.style.display = "none";
    });

    view.hidden = false;

    document.querySelectorAll(".nav a, .mobile-nav a")
      .forEach(a => a.classList.remove("active"));

    links("Documents").forEach(a => a.classList.add("active"));
  }

  function leaveDocuments() {
    view.hidden = true;

    [...content.children].forEach(node => {
      if (node !== view) node.style.removeProperty("display");
    });
  }

  async function loadReferenceData() {
    const [clientsResponse, projectsResponse] = await Promise.all([
      fetch(CLIENTS_API, {
        credentials:"same-origin",
        headers:{ Accept:"application/json" },
        cache:"no-store"
      }),
      fetch(PROJECTS_API, {
        credentials:"same-origin",
        headers:{ Accept:"application/json" },
        cache:"no-store"
      })
    ]);

    const clientData = await clientsResponse.json().catch(() => ({}));
    const projectData = await projectsResponse.json().catch(() => ({}));

    clients = Array.isArray(clientData.clients) ? clientData.clients : [];
    projects = Array.isArray(projectData.projects) ? projectData.projects : [];

    clientSelect.innerHTML = '<option value="">Pilih client</option>';

    clients
      .filter(c => c.status === "active" && c.account_status === "active")
      .forEach(client => {
        const option = document.createElement("option");
        option.value = client.id;
        option.textContent =
          `${client.full_name || client.email} — ${client.client_code}`;
        clientSelect.appendChild(option);
      });

    updateProjects();
  }

  function updateProjects() {
    const clientId = clientSelect.value;

    projectSelect.innerHTML =
      '<option value="">Tanpa project khusus</option>';

    projects
      .filter(project => project.client_id === clientId)
      .forEach(project => {
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent =
          `${project.project_name} — ${project.project_code}`;
        projectSelect.appendChild(option);
      });
  }

  async function openModal() {
    form.reset();
    errorEl.textContent = "";
    modal.hidden = false;

    try {
      await loadReferenceData();
    } catch {
      errorEl.textContent =
        "Data client/project belum dapat dimuat.";
    }
  }

  function closeModal() {
    modal.hidden = true;
    errorEl.textContent = "";
  }

  function flash(message) {
    notice.textContent = message;
    notice.classList.add("show");

    setTimeout(() => {
      notice.classList.remove("show");
    }, 4500);
  }

  function render(documents) {
    rows.innerHTML = "";

    total.textContent = documents.length;
    published.textContent =
      documents.filter(d => d.status === "published").length;

    storage.textContent =
      sizeLabel(
        documents.reduce(
          (sum, document) => sum + Number(document.size_bytes || 0),
          0
        )
      );

    empty.hidden = documents.length !== 0;

    documents.forEach(document => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>
          <div class="sb-doc-title">
            <strong>${esc(document.title)}</strong>
            <span>
              ${esc(document.document_code)}
              &bull;
              ${esc(document.file_name)}
            </span>
          </div>
        </td>

        <td>
          ${esc(
            document.company_name ||
            document.full_name ||
            document.client_code ||
            "-"
          )}
        </td>

        <td>
          ${esc(document.project_name || "-")}
        </td>

        <td>${esc(sizeLabel(document.size_bytes))}</td>

        <td>${esc(dateLabel(document.created_at))}</td>

        <td>
          <a
            class="secondary sb-doc-download"
            href="/api/admin/documents/${encodeURIComponent(document.id)}/download"
          >
            Download
          </a>
        </td>
      `;

      rows.appendChild(tr);
    });
  }

  async function loadDocuments() {
    rows.innerHTML =
      '<tr><td colspan="6">Memuat dokumen...</td></tr>';

    empty.hidden = true;

    try {
      const response = await fetch(DOCUMENTS_API, {
        credentials:"same-origin",
        headers:{ Accept:"application/json" },
        cache:"no-store"
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      render(Array.isArray(data.documents) ? data.documents : []);
    } catch (error) {
      rows.innerHTML = `
        <tr>
          <td colspan="6">
            Gagal memuat dokumen: ${esc(error.message || "Unknown error")}
          </td>
        </tr>
      `;
    }
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    errorEl.textContent = "";
    submit.disabled = true;
    submit.textContent = "Mengupload...";

    try {
      const fd = new FormData(form);

      const response = await fetch(DOCUMENTS_API, {
        method:"POST",
        credentials:"same-origin",
        headers:{
          Accept:"application/json"
        },
        body:fd
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.document) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      closeModal();
      await loadDocuments();

      flash(
        `Dokumen ${data.document.document_code} berhasil diupload.`
      );
    } catch (error) {
      errorEl.textContent =
        error instanceof Error
          ? error.message
          : "Upload dokumen gagal.";
    } finally {
      submit.disabled = false;
      submit.textContent = "Upload Dokumen";
    }
  });

  clientSelect.addEventListener("change", updateProjects);

  links("Documents").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      showOnlyDocuments();
      loadDocuments();
    });
  });

  [...links("Dashboard"), ...links("Home"), ...links("Clients"), ...links("Projects")]
    .forEach(link => {
      link.addEventListener("click", leaveDocuments);
    });

  view.querySelector("[data-doc-dashboard]")
    ?.addEventListener("click", () => {
      leaveDocuments();
      links("Dashboard")[0]?.click();
    });

  view.querySelector("[data-doc-refresh]")
    ?.addEventListener("click", loadDocuments);

  view.querySelector("[data-doc-upload]")
    ?.addEventListener("click", openModal);

  modal.querySelector("[data-doc-close]")
    ?.addEventListener("click", closeModal);

  modal.querySelector("[data-doc-cancel]")
    ?.addEventListener("click", closeModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  loadDocuments();
})();