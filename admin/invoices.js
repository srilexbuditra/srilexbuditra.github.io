(() => {
  "use strict";

  const API = "/api/admin/invoices";
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

  function statusLabel(status) {
    return {
      draft: "Draft",
      sent: "Sent",
      paid: "Paid",
      overdue: "Overdue",
      cancelled: "Cancelled"
    }[status] || status;
  }

  function badge(status) {
    if (status === "paid") return "green";
    if (status === "sent") return "blue";
    return "warn";
  }

  const style = window.document.createElement("style");
  style.textContent = `
    .sb-invoice-view[hidden],
    .sb-invoice-modal[hidden] {
      display:none !important;
    }

    .sb-invoice-view {
      display:grid;
      gap:22px;
    }

    .sb-invoice-head {
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:18px;
      flex-wrap:wrap;
    }

    .sb-invoice-head h1 { margin:6px 0; }

    .sb-invoice-actions {
      display:flex;
      gap:10px;
      flex-wrap:wrap;
    }

    .sb-invoice-summary {
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:14px;
    }

    .sb-invoice-name {
      display:grid;
      gap:3px;
    }

    .sb-invoice-name span {
      color:#64748b;
      font-size:12px;
    }

    .sb-invoice-empty {
      padding:32px 18px;
      text-align:center;
      color:#64748b;
    }

    .sb-invoice-row-actions {
      display:flex;
      gap:7px;
      flex-wrap:wrap;
    }

    .sb-invoice-notice {
      display:none;
      padding:12px 14px;
      border-radius:10px;
      background:#ecfdf5;
      color:#166534;
      font-size:13px;
      font-weight:700;
    }

    .sb-invoice-notice.show { display:block; }

    .sb-invoice-modal {
      position:fixed;
      inset:0;
      z-index:100020;
      display:grid;
      place-items:center;
      padding:22px;
      background:rgba(2,8,6,.72);
      backdrop-filter:blur(6px);
    }

    .sb-invoice-modal-card {
      width:min(100%,760px);
      max-height:calc(100vh - 44px);
      overflow:auto;
      background:#fff;
      color:#0f172a;
      border-radius:20px;
      box-shadow:0 24px 80px rgba(0,0,0,.35);
    }

    .sb-invoice-modal-head {
      display:flex;
      justify-content:space-between;
      gap:16px;
      padding:22px 24px 16px;
      border-bottom:1px solid #e2e8f0;
    }

    .sb-invoice-modal-head h2 { margin:0 0 5px; }

    .sb-invoice-modal-head p {
      margin:0;
      color:#64748b;
      font-size:13px;
    }

    .sb-invoice-close {
      width:38px;
      height:38px;
      border:0;
      border-radius:10px;
      background:#f1f5f9;
      cursor:pointer;
      font-size:20px;
    }

    .sb-invoice-form { padding:22px 24px 24px; }

    .sb-invoice-form-grid {
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:16px;
    }

    .sb-invoice-field {
      display:grid;
      gap:7px;
    }

    .sb-invoice-field.full { grid-column:1 / -1; }

    .sb-invoice-field label {
      font-size:13px;
      font-weight:800;
    }

    .sb-invoice-field input,
    .sb-invoice-field select,
    .sb-invoice-field textarea {
      width:100%;
      box-sizing:border-box;
      padding:12px 13px;
      border:1px solid #cbd5e1;
      border-radius:10px;
      background:#fff;
      font:inherit;
    }

    .sb-invoice-field textarea {
      min-height:75px;
      resize:vertical;
    }

    .sb-invoice-items {
      display:grid;
      gap:10px;
      margin-top:18px;
    }

    .sb-invoice-item {
      display:grid;
      grid-template-columns:minmax(0,1fr) 110px 180px 42px;
      gap:10px;
      align-items:end;
      padding:12px;
      border:1px solid #e2e8f0;
      border-radius:12px;
      background:#f8fafc;
    }

    .sb-invoice-item label {
      display:grid;
      gap:6px;
      font-size:12px;
      font-weight:700;
    }

    .sb-invoice-item input {
      width:100%;
      box-sizing:border-box;
      padding:10px;
      border:1px solid #cbd5e1;
      border-radius:9px;
    }

    .sb-invoice-remove {
      width:42px;
      height:42px;
      border:1px solid #fecaca;
      border-radius:9px;
      background:#fff;
      color:#b91c1c;
      cursor:pointer;
    }

    .sb-invoice-error {
      min-height:20px;
      margin:12px 0;
      color:#b91c1c;
      font-size:13px;
      font-weight:700;
    }

    .sb-invoice-form-actions {
      display:flex;
      justify-content:space-between;
      gap:10px;
      flex-wrap:wrap;
      margin-top:16px;
    }

    .sb-invoice-form-actions > div {
      display:flex;
      gap:10px;
    }

    @media(max-width:800px) {
      .sb-invoice-summary,
      .sb-invoice-form-grid {
        grid-template-columns:1fr;
      }

      .sb-invoice-field.full {
        grid-column:auto;
      }

      .sb-invoice-item {
        grid-template-columns:1fr;
      }
    }
  `;
  window.document.head.appendChild(style);

  const view = window.document.createElement("section");
  view.className = "sb-invoice-view";
  view.hidden = true;
  view.dataset.sbView = "invoices";

  view.innerHTML = `
    <div class="sb-invoice-head">
      <div>
        <div class="eyebrow">
          <span class="pulse"></span>Invoice Management &bull; R1
        </div>
        <h1>Invoices</h1>
        <p>Kelola invoice client dan project langsung dari database D1.</p>
      </div>

      <div class="sb-invoice-actions">
        <button class="secondary" type="button" data-invoice-dashboard>
          &larr; Dashboard
        </button>
        <button class="secondary" type="button" data-invoice-refresh>
          Refresh
        </button>
        <button class="primary" type="button" data-invoice-new>
          + Buat Invoice
        </button>
      </div>
    </div>

    <div class="sb-invoice-notice" data-invoice-notice></div>

    <section class="sb-invoice-summary">
      <article class="stat">
        <div class="meta">Total invoices</div>
        <div class="value" data-invoice-total>0</div>
        <div class="sub">Database D1</div>
      </article>

      <article class="stat">
        <div class="meta">Draft</div>
        <div class="value" data-invoice-draft>0</div>
        <div class="sub">Belum dikirim</div>
      </article>

      <article class="stat">
        <div class="meta">Outstanding</div>
        <div class="value" data-invoice-outstanding>0</div>
        <div class="sub">Sent / overdue</div>
      </article>

      <article class="stat">
        <div class="meta">Paid</div>
        <div class="value" data-invoice-paid>0</div>
        <div class="sub">Invoice lunas</div>
      </article>
    </section>

    <article class="card">
      <div class="card-head">
        <div>
          <h2>Daftar Invoice</h2>
          <p>Draft tidak terlihat oleh client sampai status diubah menjadi Sent.</p>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Client</th>
              <th>Project</th>
              <th>Total</th>
              <th>Status</th>
              <th>Jatuh tempo</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody data-invoice-rows></tbody>
        </table>
      </div>

      <div class="sb-invoice-empty" data-invoice-empty hidden>
        Belum ada invoice.
      </div>
    </article>
  `;

  content.appendChild(view);

  const modal = window.document.createElement("div");
  modal.className = "sb-invoice-modal";
  modal.hidden = true;

  modal.innerHTML = `
    <div class="sb-invoice-modal-card">
      <div class="sb-invoice-modal-head">
        <div>
          <h2>Buat Invoice</h2>
          <p>Invoice baru dibuat sebagai Draft.</p>
        </div>
        <button class="sb-invoice-close" type="button" data-invoice-close>
          &times;
        </button>
      </div>

      <form class="sb-invoice-form" data-invoice-form>
        <div class="sb-invoice-form-grid">

          <div class="sb-invoice-field full">
            <label>Client *</label>
            <select name="client_id" required data-invoice-client>
              <option value="">Memuat client...</option>
            </select>
          </div>

          <div class="sb-invoice-field full">
            <label>Project</label>
            <select name="project_id" data-invoice-project>
              <option value="">Tanpa project khusus</option>
            </select>
          </div>

          <div class="sb-invoice-field full">
            <label>Judul invoice *</label>
            <input name="title" maxlength="180" required>
          </div>

          <div class="sb-invoice-field">
            <label>Tanggal invoice *</label>
            <input name="issue_date" type="date" required>
          </div>

          <div class="sb-invoice-field">
            <label>Jatuh tempo</label>
            <input name="due_date" type="date">
          </div>

          <div class="sb-invoice-field">
            <label>Pajak / tambahan (Rp)</label>
            <input name="tax_amount" type="number" min="0" step="1" value="0">
          </div>

          <div class="sb-invoice-field full">
            <label>Catatan</label>
            <textarea name="notes" maxlength="2000"></textarea>
          </div>

        </div>

        <div class="sb-invoice-items" data-invoice-items></div>

        <button class="secondary" type="button" data-invoice-add-item>
          + Tambah Item
        </button>

        <div class="sb-invoice-error" data-invoice-error></div>

        <div class="sb-invoice-form-actions">
          <span>Nilai disimpan dalam IDR.</span>

          <div>
            <button class="secondary" type="button" data-invoice-cancel>
              Batal
            </button>
            <button class="primary" type="submit" data-invoice-submit>
              Simpan Draft
            </button>
          </div>
        </div>
      </form>
    </div>
  `;

  window.document.body.appendChild(modal);

  const rows = view.querySelector("[data-invoice-rows]");
  const empty = view.querySelector("[data-invoice-empty]");
  const totalEl = view.querySelector("[data-invoice-total]");
  const draftEl = view.querySelector("[data-invoice-draft]");
  const outstandingEl = view.querySelector("[data-invoice-outstanding]");
  const paidEl = view.querySelector("[data-invoice-paid]");
  const notice = view.querySelector("[data-invoice-notice]");

  const form = modal.querySelector("[data-invoice-form]");
  const clientSelect = modal.querySelector("[data-invoice-client]");
  const projectSelect = modal.querySelector("[data-invoice-project]");
  const itemsEl = modal.querySelector("[data-invoice-items]");
  const errorEl = modal.querySelector("[data-invoice-error]");
  const submit = modal.querySelector("[data-invoice-submit]");

  function links(name) {
    return [...window.document.querySelectorAll(".nav a, .mobile-nav a")]
      .filter(a => a.textContent.trim().toLowerCase() === name.toLowerCase());
  }

  function showInvoices() {
    [...content.children].forEach(node => {
      if (node !== view) node.style.display = "none";
    });

    view.style.removeProperty("display");
    view.hidden = false;

    window.document.querySelectorAll(".nav a, .mobile-nav a")
      .forEach(a => a.classList.remove("active"));

    links("Invoices").forEach(a => a.classList.add("active"));

    loadInvoices();
  }

  function leaveInvoices() {
    view.hidden = true;

    [...content.children].forEach(node => {
      if (node !== view) node.style.removeProperty("display");
    });
  }

  function flash(message) {
    notice.textContent = message;
    notice.classList.add("show");

    setTimeout(() => {
      notice.classList.remove("show");
    }, 4500);
  }

  function addItem(description = "", quantity = 1, unitPrice = 0) {
    const item = window.document.createElement("div");
    item.className = "sb-invoice-item";
    item.dataset.invoiceItem = "1";

    item.innerHTML = `
      <label>
        Deskripsi *
        <input data-item-description required value="${esc(description)}">
      </label>

      <label>
        Qty *
        <input
          data-item-quantity
          type="number"
          min="0.01"
          step="0.01"
          required
          value="${esc(quantity)}"
        >
      </label>

      <label>
        Harga satuan (Rp) *
        <input
          data-item-price
          type="number"
          min="0"
          step="1"
          required
          value="${esc(unitPrice)}"
        >
      </label>

      <button
        class="sb-invoice-remove"
        type="button"
        title="Hapus item"
        data-item-remove
      >
        ×
      </button>
    `;

    item.querySelector("[data-item-remove]")
      .addEventListener("click", () => {
        if (itemsEl.children.length > 1) {
          item.remove();
        }
      });

    itemsEl.appendChild(item);
  }

  async function loadReferences() {
    const [clientResponse, projectResponse] = await Promise.all([
      fetch(CLIENTS_API, {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
        cache: "no-store"
      }),
      fetch(PROJECTS_API, {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
        cache: "no-store"
      })
    ]);

    const clientData = await clientResponse.json().catch(() => ({}));
    const projectData = await projectResponse.json().catch(() => ({}));

    clients = Array.isArray(clientData.clients) ? clientData.clients : [];
    projects = Array.isArray(projectData.projects) ? projectData.projects : [];

    clientSelect.innerHTML = '<option value="">Pilih client</option>';

    clients
      .filter(client =>
        client.status === "active" &&
        client.account_status === "active"
      )
      .forEach(client => {
        const option = window.document.createElement("option");
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
        const option = window.document.createElement("option");
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
      errorEl.textContent =
        "Data client/project belum dapat dimuat.";
    }
  }

  function closeModal() {
    modal.hidden = true;
    errorEl.textContent = "";
  }

  function render(invoices) {
    rows.innerHTML = "";

    totalEl.textContent = String(invoices.length);

    draftEl.textContent = String(
      invoices.filter(i => i.status === "draft").length
    );

    outstandingEl.textContent = String(
      invoices.filter(i =>
        i.status === "sent" || i.status === "overdue"
      ).length
    );

    paidEl.textContent = String(
      invoices.filter(i => i.status === "paid").length
    );

    empty.hidden = invoices.length !== 0;

    invoices.forEach(invoice => {
      const tr = window.document.createElement("tr");

      let actions = "";

      if (invoice.status === "draft") {
        actions += `
          <button
            class="secondary"
            type="button"
            data-invoice-status="sent"
            data-invoice-id="${esc(invoice.id)}"
          >
            Kirim
          </button>
        `;
      }

      if (
        invoice.status === "sent" ||
        invoice.status === "overdue"
      ) {
        actions += `
          <button
            class="secondary"
            type="button"
            data-invoice-status="paid"
            data-invoice-id="${esc(invoice.id)}"
          >
            Tandai Lunas
          </button>
        `;
      }

      if (
        invoice.status === "draft" ||
        invoice.status === "sent" ||
        invoice.status === "overdue"
      ) {
        actions += `
          <button
            class="secondary"
            type="button"
            data-invoice-status="cancelled"
            data-invoice-id="${esc(invoice.id)}"
          >
            Batalkan
          </button>
        `;
      }

      tr.innerHTML = `
        <td>
          <div class="sb-invoice-name">
            <strong>${esc(invoice.title)}</strong>
            <span>${esc(invoice.invoice_code)}</span>
          </div>
        </td>

        <td>
          ${esc(
            invoice.company_name ||
            invoice.full_name ||
            invoice.client_code ||
            "-"
          )}
        </td>

        <td>${esc(invoice.project_name || "-")}</td>

        <td><strong>${esc(rupiah(invoice.total_amount))}</strong></td>

        <td>
          <span class="badge ${badge(invoice.status)}">
            ${esc(statusLabel(invoice.status))}
          </span>
        </td>

        <td>${esc(dateLabel(invoice.due_date))}</td>

        <td>
          <div class="sb-invoice-row-actions">
            ${actions || "-"}
          </div>
        </td>
      `;

      rows.appendChild(tr);
    });
  }

  async function loadInvoices() {
    rows.innerHTML =
      '<tr><td colspan="7">Memuat invoice...</td></tr>';

    empty.hidden = true;

    try {
      const response = await fetch(API, {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
        cache: "no-store"
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      render(Array.isArray(data.invoices) ? data.invoices : []);
    } catch (error) {
      rows.innerHTML = `
        <tr>
          <td colspan="7">
            Gagal memuat invoice: ${esc(error.message || "Unknown error")}
          </td>
        </tr>
      `;
    }
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const items = [...itemsEl.querySelectorAll("[data-invoice-item]")]
      .map(item => ({
        description:
          item.querySelector("[data-item-description]").value.trim(),
        quantity:
          Number(item.querySelector("[data-item-quantity]").value),
        unit_price:
          Number(item.querySelector("[data-item-price]").value)
      }));

    const payload = {
      client_id: clientSelect.value,
      project_id: projectSelect.value || null,
      title: form.elements.title.value.trim(),
      issue_date: form.elements.issue_date.value,
      due_date: form.elements.due_date.value || null,
      tax_amount: Number(form.elements.tax_amount.value || 0),
      notes: form.elements.notes.value.trim() || null,
      items
    };

    errorEl.textContent = "";
    submit.disabled = true;
    submit.textContent = "Menyimpan...";

    try {
      const response = await fetch(API, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.invoice) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      closeModal();
      await loadInvoices();

      flash(
        `Invoice ${data.invoice.invoice_code} berhasil dibuat sebagai Draft.`
      );
    } catch (error) {
      errorEl.textContent =
        error instanceof Error
          ? error.message
          : "Invoice belum dapat dibuat.";
    } finally {
      submit.disabled = false;
      submit.textContent = "Simpan Draft";
    }
  });

  view.addEventListener("click", async event => {
    const button =
      event.target.closest("[data-invoice-status]");

    if (!button) return;

    const status = button.dataset.invoiceStatus;
    const invoiceId = button.dataset.invoiceId;

    const message = {
      sent: "Kirim invoice ini ke Client Portal?",
      paid: "Tandai invoice ini sebagai lunas?",
      cancelled: "Batalkan invoice ini?"
    }[status];

    if (message && !window.confirm(message)) return;

    button.disabled = true;

    try {
      const response = await fetch(
        `${API}/${encodeURIComponent(invoiceId)}`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status })
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      await loadInvoices();
      flash(`Status invoice menjadi ${statusLabel(data.invoice.status)}.`);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Status invoice gagal diperbarui."
      );
    } finally {
      button.disabled = false;
    }
  });

  clientSelect.addEventListener("change", updateProjects);

  modal.querySelector("[data-invoice-add-item]")
    .addEventListener("click", () => addItem());

  links("Invoices").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      showInvoices();
    });
  });

  [
    ...links("Dashboard"),
    ...links("Home"),
    ...links("Clients"),
    ...links("Projects"),
    ...links("Documents")
  ].forEach(link => {
    link.addEventListener("click", leaveInvoices);
  });

  view.querySelector("[data-invoice-dashboard]")
    ?.addEventListener("click", () => {
      leaveInvoices();
      links("Dashboard")[0]?.click();
    });

  view.querySelector("[data-invoice-refresh]")
    ?.addEventListener("click", loadInvoices);

  view.querySelector("[data-invoice-new]")
    ?.addEventListener("click", openModal);

  modal.querySelector("[data-invoice-close]")
    ?.addEventListener("click", closeModal);

  modal.querySelector("[data-invoice-cancel]")
    ?.addEventListener("click", closeModal);

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  window.document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
})();