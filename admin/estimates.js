(() => {
  "use strict";

  const API = "/api/admin/estimates";
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

  function rupiah(value) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function dateLabel(value) {
    if (!value) return "-";

    const d = new Date(`${String(value).slice(0,10)}T00:00:00`);
    if (Number.isNaN(d.getTime())) return value;

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(d);
  }

  function label(status) {
    return {
      draft: "Draft",
      sent: "Sent",
      approved: "Approved",
      rejected: "Rejected",
      expired: "Expired",
      cancelled: "Cancelled"
    }[status] || status;
  }

  function badge(status) {
    if (status === "approved") return "green";
    if (status === "sent") return "blue";
    return "warn";
  }

  const style = document.createElement("style");
  style.textContent = `
    .sb-est-view[hidden],
    .sb-est-modal[hidden] { display:none !important; }

    .sb-est-view { display:grid; gap:22px; }

    .sb-est-head {
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:18px;
      flex-wrap:wrap;
    }

    .sb-est-head h1 { margin:6px 0; }

    .sb-est-actions {
      display:flex;
      gap:10px;
      flex-wrap:wrap;
    }

    .sb-est-summary {
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:14px;
    }

    .sb-est-name {
      display:grid;
      gap:3px;
    }

    .sb-est-name span {
      color:#64748b;
      font-size:12px;
    }

    .sb-est-row-actions {
      display:flex;
      gap:7px;
      flex-wrap:wrap;
    }

    .sb-est-empty {
      padding:32px 18px;
      text-align:center;
      color:#64748b;
    }

    .sb-est-notice {
      display:none;
      padding:12px 14px;
      border-radius:10px;
      background:#ecfdf5;
      color:#166534;
      font-weight:700;
    }

    .sb-est-notice.show { display:block; }

    .sb-est-modal {
      position:fixed;
      inset:0;
      z-index:100050;
      display:grid;
      place-items:center;
      padding:22px;
      background:rgba(2,8,6,.72);
      backdrop-filter:blur(6px);
    }

    .sb-est-card {
      width:min(100%,760px);
      max-height:calc(100vh - 44px);
      overflow:auto;
      background:#fff;
      color:#0f172a;
      border-radius:20px;
      box-shadow:0 24px 80px rgba(0,0,0,.35);
    }

    .sb-est-modal-head {
      display:flex;
      justify-content:space-between;
      gap:16px;
      padding:22px 24px 16px;
      border-bottom:1px solid #e2e8f0;
    }

    .sb-est-modal-head h2 { margin:0 0 5px; }

    .sb-est-modal-head p {
      margin:0;
      color:#64748b;
      font-size:13px;
    }

    .sb-est-close {
      width:38px;
      height:38px;
      border:0;
      border-radius:10px;
      background:#f1f5f9;
      cursor:pointer;
      font-size:20px;
    }

    .sb-est-form { padding:22px 24px 24px; }

    .sb-est-grid {
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:16px;
    }

    .sb-est-field {
      display:grid;
      gap:7px;
    }

    .sb-est-field.full { grid-column:1 / -1; }

    .sb-est-field label {
      font-size:13px;
      font-weight:800;
    }

    .sb-est-field input,
    .sb-est-field select,
    .sb-est-field textarea {
      width:100%;
      box-sizing:border-box;
      padding:12px 13px;
      border:1px solid #cbd5e1;
      border-radius:10px;
      background:#fff;
      font:inherit;
    }

    .sb-est-field textarea {
      min-height:75px;
      resize:vertical;
    }

    .sb-est-items {
      display:grid;
      gap:10px;
      margin-top:18px;
    }

    .sb-est-item {
      display:grid;
      grid-template-columns:minmax(0,1fr) 110px 180px 42px;
      gap:10px;
      align-items:end;
      padding:12px;
      border:1px solid #e2e8f0;
      border-radius:12px;
      background:#f8fafc;
    }

    .sb-est-item label {
      display:grid;
      gap:6px;
      font-size:12px;
      font-weight:700;
    }

    .sb-est-item input {
      width:100%;
      box-sizing:border-box;
      padding:10px;
      border:1px solid #cbd5e1;
      border-radius:9px;
    }

    .sb-est-remove {
      width:42px;
      height:42px;
      border:1px solid #fecaca;
      border-radius:9px;
      background:#fff;
      color:#b91c1c;
      cursor:pointer;
    }

    .sb-est-error {
      min-height:20px;
      margin:12px 0;
      color:#b91c1c;
      font-weight:700;
      font-size:13px;
    }

    .sb-est-form-actions {
      display:flex;
      justify-content:flex-end;
      gap:10px;
      margin-top:16px;
    }

    @media(max-width:800px) {
      .sb-est-summary,
      .sb-est-grid,
      .sb-est-item {
        grid-template-columns:1fr;
      }

      .sb-est-field.full { grid-column:auto; }
    }
  `;

  document.head.appendChild(style);

  const view = document.createElement("section");
  view.className = "sb-est-view";
  view.hidden = true;

  view.innerHTML = `
    <div class="sb-est-head">
      <div>
        <div class="eyebrow">
          <span class="pulse"></span>Estimate Management &bull; R1
        </div>
        <h1>Estimates</h1>
        <p>Kelola penawaran biaya sebelum diteruskan menjadi invoice.</p>
      </div>

      <div class="sb-est-actions">
        <button class="secondary" data-est-dashboard>&larr; Dashboard</button>
        <button class="secondary" data-est-refresh>Refresh</button>
        <button class="primary" data-est-new>+ Buat Estimate</button>
      </div>
    </div>

    <div class="sb-est-notice" data-est-notice></div>

    <section class="sb-est-summary">
      <article class="stat">
        <div class="meta">Total estimates</div>
        <div class="value" data-est-total>0</div>
        <div class="sub">Database D1</div>
      </article>

      <article class="stat">
        <div class="meta">Draft</div>
        <div class="value" data-est-draft>0</div>
        <div class="sub">Belum dikirim</div>
      </article>

      <article class="stat">
        <div class="meta">Menunggu</div>
        <div class="value" data-est-sent>0</div>
        <div class="sub">Menunggu keputusan client</div>
      </article>

      <article class="stat">
        <div class="meta">Approved</div>
        <div class="value" data-est-approved>0</div>
        <div class="sub">Siap menjadi invoice</div>
      </article>
    </section>

    <article class="card">
      <div class="card-head">
        <div>
          <h2>Daftar Estimate</h2>
          <p>Draft tidak terlihat oleh client sebelum dikirim.</p>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Estimate</th>
              <th>Client</th>
              <th>Project</th>
              <th>Total</th>
              <th>Status</th>
              <th>Berlaku sampai</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody data-est-rows></tbody>
        </table>
      </div>

      <div class="sb-est-empty" data-est-empty hidden>
        Belum ada estimate.
      </div>
    </article>
  `;

  content.appendChild(view);

  const modal = document.createElement("div");
  modal.className = "sb-est-modal";
  modal.hidden = true;

  modal.innerHTML = `
    <div class="sb-est-card">
      <div class="sb-est-modal-head">
        <div>
          <h2>Buat Estimate</h2>
          <p>Estimate baru akan disimpan sebagai Draft.</p>
        </div>
        <button class="sb-est-close" type="button" data-est-close>&times;</button>
      </div>

      <form class="sb-est-form" data-est-form>
        <div class="sb-est-grid">

          <div class="sb-est-field full">
            <label>Client *</label>
            <select name="client_id" required data-est-client>
              <option value="">Pilih client</option>
            </select>
          </div>

          <div class="sb-est-field full">
            <label>Project</label>
            <select name="project_id" data-est-project>
              <option value="">Tanpa project khusus</option>
            </select>
          </div>

          <div class="sb-est-field full">
            <label>Judul *</label>
            <input name="title" maxlength="180" required>
          </div>

          <div class="sb-est-field">
            <label>Tanggal *</label>
            <input name="issue_date" type="date" required>
          </div>

          <div class="sb-est-field">
            <label>Berlaku sampai</label>
            <input name="valid_until" type="date">
          </div>

          <div class="sb-est-field">
            <label>Pajak / tambahan (Rp)</label>
            <input name="tax_amount" type="number" min="0" step="1" value="0">
          </div>

          <div class="sb-est-field full">
            <label>Catatan</label>
            <textarea name="notes" maxlength="2000"></textarea>
          </div>

        </div>

        <div class="sb-est-items" data-est-items></div>

        <button class="secondary" type="button" data-est-add>
          + Tambah Item
        </button>

        <div class="sb-est-error" data-est-error></div>

        <div class="sb-est-form-actions">
          <button class="secondary" type="button" data-est-cancel>Batal</button>
          <button class="primary" type="submit" data-est-submit>Simpan Draft</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const rows = view.querySelector("[data-est-rows]");
  const empty = view.querySelector("[data-est-empty]");
  const total = view.querySelector("[data-est-total]");
  const draft = view.querySelector("[data-est-draft]");
  const sent = view.querySelector("[data-est-sent]");
  const approved = view.querySelector("[data-est-approved]");
  const notice = view.querySelector("[data-est-notice]");

  const form = modal.querySelector("[data-est-form]");
  const clientSelect = modal.querySelector("[data-est-client]");
  const projectSelect = modal.querySelector("[data-est-project]");
  const itemsEl = modal.querySelector("[data-est-items]");
  const errorEl = modal.querySelector("[data-est-error]");
  const submit = modal.querySelector("[data-est-submit]");

  function links(name) {
    return [...document.querySelectorAll(".nav a, .mobile-nav a")]
      .filter(a => a.textContent.trim().toLowerCase() === name.toLowerCase());
  }

  function showView() {
    [...content.children].forEach(node => {
      if (node !== view) node.style.display = "none";
    });

    view.hidden = false;

    document.querySelectorAll(".nav a, .mobile-nav a")
      .forEach(a => a.classList.remove("active"));

    links("Estimates").forEach(a => a.classList.add("active"));

    load();
  }

  function leaveView() {
    view.hidden = true;
    [...content.children].forEach(node => {
      if (node !== view) node.style.removeProperty("display");
    });
  }

  function flash(message) {
    notice.textContent = message;
    notice.classList.add("show");
    setTimeout(() => notice.classList.remove("show"), 4500);
  }

  function addItem(description = "", quantity = 1, unitPrice = 0) {
    const item = document.createElement("div");
    item.className = "sb-est-item";
    item.dataset.estItem = "1";

    item.innerHTML = `
      <label>
        Deskripsi *
        <input data-est-description required value="${esc(description)}">
      </label>

      <label>
        Qty *
        <input data-est-quantity type="number" min="0.01" step="0.01"
               required value="${esc(quantity)}">
      </label>

      <label>
        Harga satuan (Rp) *
        <input data-est-price type="number" min="0" step="1"
               required value="${esc(unitPrice)}">
      </label>

      <button class="sb-est-remove" type="button" data-est-remove>×</button>
    `;

    item.querySelector("[data-est-remove]").addEventListener("click", () => {
      if (itemsEl.children.length > 1) item.remove();
    });

    itemsEl.appendChild(item);
  }

  async function loadReferences() {
    const [cr, pr] = await Promise.all([
      fetch(CLIENTS_API, {
        credentials:"same-origin",
        headers:{Accept:"application/json"},
        cache:"no-store"
      }),
      fetch(PROJECTS_API, {
        credentials:"same-origin",
        headers:{Accept:"application/json"},
        cache:"no-store"
      })
    ]);

    const cd = await cr.json().catch(() => ({}));
    const pd = await pr.json().catch(() => ({}));

    clients = Array.isArray(cd.clients) ? cd.clients : [];
    projects = Array.isArray(pd.projects) ? pd.projects : [];

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
    projectSelect.innerHTML =
      '<option value="">Tanpa project khusus</option>';

    projects
      .filter(p => p.client_id === clientSelect.value)
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
    itemsEl.innerHTML = "";
    addItem();

    form.elements.issue_date.value =
      new Date().toISOString().slice(0,10);

    form.elements.tax_amount.value = "0";
    errorEl.textContent = "";
    modal.hidden = false;

    try {
      await loadReferences();
    } catch {
      errorEl.textContent = "Data client/project belum dapat dimuat.";
    }
  }

  function closeModal() {
    modal.hidden = true;
    errorEl.textContent = "";
  }

  function render(estimates) {
    rows.innerHTML = "";

    total.textContent = estimates.length;
    draft.textContent =
      estimates.filter(e => e.status === "draft").length;
    sent.textContent =
      estimates.filter(e => e.status === "sent").length;
    approved.textContent =
      estimates.filter(e => e.status === "approved").length;

    empty.hidden = estimates.length !== 0;

    estimates.forEach(estimate => {
      const tr = document.createElement("tr");

      let actions = "";

      if (estimate.status === "draft") {
        actions += `
          <button class="secondary"
                  data-est-status="sent"
                  data-est-id="${esc(estimate.id)}">
            Kirim
          </button>
        `;

        actions += `
          <button class="secondary"
                  data-est-status="cancelled"
                  data-est-id="${esc(estimate.id)}">
            Batalkan
          </button>
        `;
      }

      if (
        estimate.status === "approved" &&
        !estimate.converted_invoice_id
      ) {
        actions += `
          <button class="primary"
                  data-est-convert="${esc(estimate.id)}">
            Buat Invoice
          </button>
        `;
      }

      if (estimate.converted_invoice_code) {
        actions += `
          <span>${esc(estimate.converted_invoice_code)}</span>
        `;
      }

      tr.innerHTML = `
        <td>
          <div class="sb-est-name">
            <strong>${esc(estimate.title)}</strong>
            <span>${esc(estimate.estimate_code)}</span>
          </div>
        </td>

        <td>
          ${esc(
            estimate.company_name ||
            estimate.full_name ||
            estimate.client_code ||
            "-"
          )}
        </td>

        <td>${esc(estimate.project_name || "-")}</td>

        <td><strong>${esc(rupiah(estimate.total_amount))}</strong></td>

        <td>
          <span class="badge ${badge(estimate.status)}">
            ${esc(label(estimate.status))}
          </span>
        </td>

        <td>${esc(dateLabel(estimate.valid_until))}</td>

        <td>
          <div class="sb-est-row-actions">
            ${actions || "-"}
          </div>
        </td>
      `;

      rows.appendChild(tr);
    });
  }

  async function load() {
    rows.innerHTML =
      '<tr><td colspan="7">Memuat estimate...</td></tr>';

    try {
      const response = await fetch(API, {
        credentials:"same-origin",
        headers:{Accept:"application/json"},
        cache:"no-store"
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      render(Array.isArray(data.estimates) ? data.estimates : []);
    } catch (error) {
      rows.innerHTML = `
        <tr>
          <td colspan="7">
            Gagal memuat estimate: ${esc(error.message || "Unknown error")}
          </td>
        </tr>
      `;
    }
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const items = [...itemsEl.querySelectorAll("[data-est-item]")]
      .map(item => ({
        description:
          item.querySelector("[data-est-description]").value.trim(),
        quantity:
          Number(item.querySelector("[data-est-quantity]").value),
        unit_price:
          Number(item.querySelector("[data-est-price]").value)
      }));

    const payload = {
      client_id: clientSelect.value,
      project_id: projectSelect.value || null,
      title: form.elements.title.value.trim(),
      issue_date: form.elements.issue_date.value,
      valid_until: form.elements.valid_until.value || null,
      tax_amount: Number(form.elements.tax_amount.value || 0),
      notes: form.elements.notes.value.trim() || null,
      items
    };

    submit.disabled = true;
    submit.textContent = "Menyimpan...";
    errorEl.textContent = "";

    try {
      const response = await fetch(API, {
        method:"POST",
        credentials:"same-origin",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        body:JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.estimate) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      closeModal();
      await load();

      flash(
        `Estimate ${data.estimate.estimate_code} berhasil dibuat sebagai Draft.`
      );
    } catch (error) {
      errorEl.textContent =
        error instanceof Error
          ? error.message
          : "Estimate belum dapat dibuat.";
    } finally {
      submit.disabled = false;
      submit.textContent = "Simpan Draft";
    }
  });

  view.addEventListener("click", async event => {
    const statusButton =
      event.target.closest("[data-est-status]");

    if (statusButton) {
      const id = statusButton.dataset.estId;
      const status = statusButton.dataset.estStatus;

      if (!confirm(
        status === "sent"
          ? "Kirim estimate ini ke Client Portal?"
          : "Batalkan estimate ini?"
      )) return;

      const response = await fetch(
        `${API}/${encodeURIComponent(id)}`,
        {
          method:"PATCH",
          credentials:"same-origin",
          headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
          },
          body:JSON.stringify({status})
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.error || `HTTP ${response.status}`);
        return;
      }

      await load();
      return;
    }

    const convertButton =
      event.target.closest("[data-est-convert]");

    if (convertButton) {
      if (!confirm(
        "Buat invoice Draft dari estimate yang sudah disetujui?"
      )) return;

      const id = convertButton.dataset.estConvert;

      const response = await fetch(
        `${API}/${encodeURIComponent(id)}/convert-to-invoice`,
        {
          method:"POST",
          credentials:"same-origin",
          headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
          },
          body:"{}"
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.invoice) {
        alert(data.error || `HTTP ${response.status}`);
        return;
      }

      await load();

      flash(
        `Invoice ${data.invoice.invoice_code} berhasil dibuat sebagai Draft.`
      );
    }
  });

  clientSelect.addEventListener("change", updateProjects);

  modal.querySelector("[data-est-add]")
    .addEventListener("click", () => addItem());

  links("Estimates").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      showView();
    });
  });

  view.querySelector("[data-est-dashboard]")
    .addEventListener("click", () => {
      leaveView();
      links("Dashboard")[0]?.click();
    });

  view.querySelector("[data-est-refresh]")
    .addEventListener("click", load);

  view.querySelector("[data-est-new]")
    .addEventListener("click", openModal);

  modal.querySelector("[data-est-close]")
    .addEventListener("click", closeModal);

  modal.querySelector("[data-est-cancel]")
    .addEventListener("click", closeModal);
})();