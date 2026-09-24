(() => {
  "use strict";

  const API = "/api/client/invoices";
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
      sent: "Menunggu Pembayaran",
      overdue: "Jatuh Tempo",
      paid: "Lunas"
    }[status] || status;
  }

  function badge(status) {
    if (status === "paid") return "green";
    if (status === "sent") return "blue";
    return "warn";
  }

  const style = window.document.createElement("style");

  style.textContent = `
    .sb-client-invoices[hidden],
    .sb-client-invoice-modal[hidden] {
      display:none !important;
    }

    .sb-client-invoices {
      display:grid;
      gap:22px;
    }

    .sb-client-invoice-head {
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:18px;
      flex-wrap:wrap;
    }

    .sb-client-invoice-head h1 { margin:6px 0; }

    .sb-client-invoice-summary {
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:14px;
    }

    .sb-client-invoice-empty {
      padding:32px 18px;
      text-align:center;
      color:#64748b;
    }

    .sb-client-invoice-name {
      display:grid;
      gap:3px;
    }

    .sb-client-invoice-name span {
      color:#64748b;
      font-size:12px;
    }

    .sb-client-invoice-modal {
      position:fixed;
      inset:0;
      z-index:100030;
      display:grid;
      place-items:center;
      padding:22px;
      background:rgba(2,8,6,.72);
      backdrop-filter:blur(6px);
    }

    .sb-client-invoice-card {
      width:min(100%,720px);
      max-height:calc(100vh - 44px);
      overflow:auto;
      background:#fff;
      color:#0f172a;
      border-radius:20px;
      box-shadow:0 24px 80px rgba(0,0,0,.35);
    }

    .sb-client-invoice-modal-head {
      display:flex;
      justify-content:space-between;
      gap:16px;
      padding:22px 24px 16px;
      border-bottom:1px solid #e2e8f0;
    }

    .sb-client-invoice-close {
      width:38px;
      height:38px;
      border:0;
      border-radius:10px;
      background:#f1f5f9;
      cursor:pointer;
      font-size:20px;
    }

    .sb-client-invoice-body {
      padding:22px 24px 24px;
    }

    .sb-client-invoice-meta {
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:12px;
      margin-bottom:18px;
    }

    .sb-client-invoice-meta > div {
      padding:12px;
      border:1px solid #e2e8f0;
      border-radius:10px;
    }

    .sb-client-invoice-meta span {
      display:block;
      color:#64748b;
      font-size:11px;
      margin-bottom:4px;
    }

    .sb-client-invoice-total {
      display:grid;
      gap:8px;
      margin-top:18px;
      margin-left:auto;
      width:min(100%,320px);
    }

    .sb-client-invoice-total div {
      display:flex;
      justify-content:space-between;
      gap:20px;
    }

    .sb-client-invoice-total .grand {
      padding-top:10px;
      border-top:1px solid #cbd5e1;
      font-size:17px;
      font-weight:800;
    }

    @media(max-width:720px) {
      .sb-client-invoice-summary,
      .sb-client-invoice-meta {
        grid-template-columns:1fr;
      }
    }
  `;

  window.document.head.appendChild(style);

  const view = window.document.createElement("section");
  view.className = "sb-client-invoices";
  view.hidden = true;
  view.dataset.sbView = "invoices";

  view.innerHTML = `
    <div class="sb-client-invoice-head">
      <div>
        <div class="eyebrow">
          <span class="pulse"></span>Client Invoices &bull; R1
        </div>
        <h1>Invoice</h1>
        <p>Invoice resmi yang telah dikirim untuk akun Anda.</p>
      </div>

      <button class="secondary" type="button" data-client-invoice-dashboard>
        &larr; Dashboard
      </button>
    </div>

    <section class="sb-client-invoice-summary">
      <article class="stat">
        <div class="meta">Total invoice</div>
        <div class="value" data-ci-total>0</div>
        <div class="sub">Invoice tersedia</div>
      </article>

      <article class="stat">
        <div class="meta">Menunggu</div>
        <div class="value" data-ci-pending>0</div>
        <div class="sub">Belum lunas</div>
      </article>

      <article class="stat">
        <div class="meta">Lunas</div>
        <div class="value" data-ci-paid>0</div>
        <div class="sub">Pembayaran selesai</div>
      </article>
    </section>

    <article class="card">
      <div class="card-head">
        <div>
          <h2>Daftar Invoice</h2>
          <p>Detail invoice hanya dapat diakses setelah login.</p>
        </div>

        <button class="secondary" type="button" data-ci-refresh>
          Refresh
        </button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Project</th>
              <th>Total</th>
              <th>Status</th>
              <th>Jatuh tempo</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody data-ci-rows></tbody>
        </table>
      </div>

      <div class="sb-client-invoice-empty" data-ci-empty hidden>
        Belum ada invoice untuk akun Anda.
      </div>
    </article>
  `;

  content.appendChild(view);

  const modal = window.document.createElement("div");
  modal.className = "sb-client-invoice-modal";
  modal.hidden = true;

  modal.innerHTML = `
    <div class="sb-client-invoice-card">
      <div class="sb-client-invoice-modal-head">
        <div>
          <h2 data-ci-detail-title>Detail Invoice</h2>
          <p data-ci-detail-code></p>
        </div>

        <button class="sb-client-invoice-close" type="button" data-ci-close>
          &times;
        </button>
      </div>

      <div class="sb-client-invoice-body" data-ci-detail-body>
        Memuat invoice...
      </div>
    </div>
  `;

  window.document.body.appendChild(modal);

  const rows = view.querySelector("[data-ci-rows]");
  const empty = view.querySelector("[data-ci-empty]");
  const total = view.querySelector("[data-ci-total]");
  const pending = view.querySelector("[data-ci-pending]");
  const paid = view.querySelector("[data-ci-paid]");

  function links(name) {
    return [...window.document.querySelectorAll(".nav a, .mobile-nav a")]
      .filter(a => a.textContent.trim().toLowerCase() === name.toLowerCase());
  }

  function updateDashboard(invoices) {
    const pendingCount =
      invoices.filter(i =>
        i.status === "sent" || i.status === "overdue"
      ).length;

    window.document.querySelectorAll(".stat").forEach(stat => {
      const meta = stat.querySelector(".meta");
      const value = stat.querySelector(".value");
      const sub = stat.querySelector(".sub");

      if (
        meta &&
        meta.textContent.trim().toLowerCase() === "invoice"
      ) {
        if (value) value.textContent = String(pendingCount);

        if (sub) {
          sub.textContent =
            pendingCount === 0
              ? "Tidak ada invoice tertunda"
              : `${pendingCount} menunggu penyelesaian`;
        }
      }
    });
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

  function render(invoices) {
    rows.innerHTML = "";

    total.textContent = String(invoices.length);

    pending.textContent = String(
      invoices.filter(i =>
        i.status === "sent" || i.status === "overdue"
      ).length
    );

    paid.textContent = String(
      invoices.filter(i => i.status === "paid").length
    );

    empty.hidden = invoices.length !== 0;

    updateDashboard(invoices);

    invoices.forEach(invoice => {
      const tr = window.document.createElement("tr");

      tr.innerHTML = `
        <td>
          <div class="sb-client-invoice-name">
            <strong>${esc(invoice.title)}</strong>
            <span>${esc(invoice.invoice_code)}</span>
          </div>
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
          <button
            class="secondary"
            type="button"
            data-ci-detail="${esc(invoice.id)}"
          >
            Detail
          </button>
        </td>
      `;

      rows.appendChild(tr);
    });
  }

  async function loadInvoices() {
    rows.innerHTML =
      '<tr><td colspan="6">Memuat invoice...</td></tr>';

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
          <td colspan="6">
            Invoice belum dapat dimuat: ${esc(error.message || "Unknown error")}
          </td>
        </tr>
      `;
    }
  }

  async function openDetail(invoiceId) {
    modal.hidden = false;

    const title = modal.querySelector("[data-ci-detail-title]");
    const code = modal.querySelector("[data-ci-detail-code]");
    const body = modal.querySelector("[data-ci-detail-body]");

    title.textContent = "Detail Invoice";
    code.textContent = "";
    body.textContent = "Memuat invoice...";

    try {
      const response = await fetch(
        `${API}/${encodeURIComponent(invoiceId)}`,
        {
          credentials: "same-origin",
          headers: { Accept: "application/json" },
          cache: "no-store"
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.invoice) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      const invoice = data.invoice;
      const items = Array.isArray(data.items) ? data.items : [];

      title.textContent = invoice.title || "Invoice";
      code.textContent = invoice.invoice_code || "";

      body.innerHTML = `
        <div class="sb-client-invoice-meta">
          <div>
            <span>Status</span>
            <strong>${esc(statusLabel(invoice.status))}</strong>
          </div>

          <div>
            <span>Tanggal invoice</span>
            <strong>${esc(dateLabel(invoice.issue_date))}</strong>
          </div>

          <div>
            <span>Jatuh tempo</span>
            <strong>${esc(dateLabel(invoice.due_date))}</strong>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Harga</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${esc(item.description)}</td>
                  <td>${esc(item.quantity)}</td>
                  <td>${esc(rupiah(item.unit_price))}</td>
                  <td>${esc(rupiah(item.line_total))}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="sb-client-invoice-total">
          <div>
            <span>Subtotal</span>
            <strong>${esc(rupiah(invoice.subtotal))}</strong>
          </div>

          <div>
            <span>Pajak / tambahan</span>
            <strong>${esc(rupiah(invoice.tax_amount))}</strong>
          </div>

          <div class="grand">
            <span>Total</span>
            <strong>${esc(rupiah(invoice.total_amount))}</strong>
          </div>
        </div>

        ${invoice.notes ? `
          <p><strong>Catatan:</strong><br>${esc(invoice.notes)}</p>
        ` : ""}
      `;
    } catch (error) {
      body.textContent =
        error instanceof Error
          ? error.message
          : "Invoice belum dapat dibuka.";
    }
  }

  view.addEventListener("click", event => {
    const detail = event.target.closest("[data-ci-detail]");

    if (detail) {
      openDetail(detail.dataset.ciDetail);
    }
  });

  links("Invoices").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      showInvoices();
    });
  });

  [
    ...links("Dashboard"),
    ...links("Home"),
    ...links("Projects"),
    ...links("Documents")
  ].forEach(link => {
    link.addEventListener("click", leaveInvoices);
  });

  window.document.querySelectorAll("button").forEach(button => {
    if (
      button.textContent.trim().toLowerCase() === "lihat invoice"
    ) {
      button.addEventListener("click", showInvoices);
    }
  });

  view.querySelector("[data-client-invoice-dashboard]")
    ?.addEventListener("click", () => {
      leaveInvoices();
      links("Dashboard")[0]?.click();
    });

  view.querySelector("[data-ci-refresh]")
    ?.addEventListener("click", loadInvoices);

  modal.querySelector("[data-ci-close]")
    ?.addEventListener("click", () => {
      modal.hidden = true;
    });

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      modal.hidden = true;
    }
  });

  window.addEventListener(
    "sb:portal-authenticated",
    loadInvoices
  );

  if (window.SB_PORTAL_USER) {
    loadInvoices();
  }
})();