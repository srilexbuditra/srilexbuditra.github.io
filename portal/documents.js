(() => {
  "use strict";

  const API = "/api/client/documents";
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
      day:"2-digit",
      month:"short",
      year:"numeric"
    }).format(date);
  }

  const style = document.createElement("style");

  style.textContent = `
    .sb-client-documents[hidden] {
      display:none !important;
    }

    .sb-client-documents {
      display:grid;
      gap:22px;
    }

    .sb-client-doc-head {
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:18px;
      flex-wrap:wrap;
    }

    .sb-client-doc-head h1 {
      margin:6px 0;
    }

    .sb-client-doc-empty {
      padding:34px 18px;
      text-align:center;
      color:#64748b;
    }

    .sb-client-doc-title {
      display:grid;
      gap:3px;
    }

    .sb-client-doc-title span {
      font-size:12px;
      color:#64748b;
    }

    .sb-client-doc-download {
      display:inline-flex;
      text-decoration:none;
      align-items:center;
      justify-content:center;
    }
  `;

  document.head.appendChild(style);

  const view = document.createElement("section");
  view.className = "sb-client-documents";
  view.hidden = true;

  view.innerHTML = `
    <div class="sb-client-doc-head">
      <div>
        <div class="eyebrow">
          <span class="pulse"></span>Client Documents &bull; R1
        </div>
        <h1>Dokumen</h1>
        <p>Dokumen yang disediakan administrator untuk akun Anda.</p>
      </div>

      <button class="secondary" type="button" data-client-doc-dashboard>
        &larr; Dashboard
      </button>
    </div>

    <section class="stats grid">
      <article class="stat">
        <div class="meta">Dokumen tersedia</div>
        <div class="value" data-client-doc-count>0</div>
        <div class="sub">File private untuk akun Anda</div>
      </article>
    </section>

    <article class="card">
      <div class="card-head">
        <div>
          <h2>Daftar Dokumen</h2>
          <p>Dokumen hanya dapat diakses setelah login.</p>
        </div>

        <button class="secondary" type="button" data-client-doc-refresh>
          Refresh
        </button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Dokumen</th>
              <th>Project</th>
              <th>Ukuran</th>
              <th>Tanggal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody data-client-doc-rows></tbody>
        </table>
      </div>

      <div class="sb-client-doc-empty" data-client-doc-empty hidden>
        Belum ada dokumen untuk akun Anda.
      </div>
    </article>
  `;

  content.appendChild(view);

  const rows = view.querySelector("[data-client-doc-rows]");
  const empty = view.querySelector("[data-client-doc-empty]");
  const count = view.querySelector("[data-client-doc-count]");

  function links(name) {
    return [...document.querySelectorAll(".nav a, .mobile-nav a")]
      .filter(a => a.textContent.trim().toLowerCase() === name.toLowerCase());
  }

  function showDocuments() {
    [...content.children].forEach(node => {
      if (node !== view) node.style.display = "none";
    });

    view.hidden = false;

    document.querySelectorAll(".nav a, .mobile-nav a")
      .forEach(a => a.classList.remove("active"));

    links("Documents").forEach(a => a.classList.add("active"));

    loadDocuments();
  }

  function leaveDocuments() {
    view.hidden = true;

    [...content.children].forEach(node => {
      if (node !== view) node.style.removeProperty("display");
    });
  }

  function updateDashboardCount(value) {
    document.querySelectorAll(".stat").forEach(stat => {
      const meta = stat.querySelector(".meta");
      const number = stat.querySelector(".value");
      const sub = stat.querySelector(".sub");

      if (
        meta &&
        meta.textContent.trim().toLowerCase() === "dokumen"
      ) {
        if (number) number.textContent = String(value);
        if (sub) {
          sub.textContent =
            value === 1
              ? "1 dokumen tersedia"
              : `${value} dokumen tersedia`;
        }
      }
    });
  }

  function render(documents) {
    rows.innerHTML = "";
    count.textContent = String(documents.length);
    empty.hidden = documents.length !== 0;

    updateDashboardCount(documents.length);

    documents.forEach(document => {
      const tr = window.document.createElement("tr");

      tr.innerHTML = `
        <td>
          <div class="sb-client-doc-title">
            <strong>${esc(document.title)}</strong>
            <span>
              ${esc(document.document_code)}
              &bull;
              ${esc(document.file_name)}
            </span>
          </div>
        </td>

        <td>${esc(document.project_name || "-")}</td>

        <td>${esc(sizeLabel(document.size_bytes))}</td>

        <td>${esc(dateLabel(document.created_at))}</td>

        <td>
          <a
            class="secondary sb-client-doc-download"
            href="/api/client/documents/${encodeURIComponent(document.id)}/download"
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
      '<tr><td colspan="5">Memuat dokumen...</td></tr>';

    empty.hidden = true;

    try {
      const response = await fetch(API, {
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
          <td colspan="5">
            Dokumen belum dapat dimuat: ${esc(error.message || "Unknown error")}
          </td>
        </tr>
      `;
    }
  }

  links("Documents").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      showDocuments();
    });
  });

  [...links("Dashboard"), ...links("Home"), ...links("Projects")]
    .forEach(link => {
      link.addEventListener("click", leaveDocuments);
    });

  view.querySelector("[data-client-doc-dashboard]")
    ?.addEventListener("click", () => {
      leaveDocuments();
      links("Dashboard")[0]?.click();
    });

  view.querySelector("[data-client-doc-refresh]")
    ?.addEventListener("click", loadDocuments);

  window.addEventListener(
    "sb:portal-authenticated",
    loadDocuments
  );

  if (window.SB_PORTAL_USER) {
    loadDocuments();
  }
})();