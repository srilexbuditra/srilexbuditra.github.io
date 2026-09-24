(() => {
  "use strict";

  const API = "/api/admin/support";
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
      open: "Open",
      in_progress: "In Progress",
      resolved: "Resolved",
      closed: "Closed"
    }[status] || status;
  }

  function priorityLabel(priority) {
    return {
      low: "Low",
      normal: "Normal",
      high: "High",
      urgent: "Urgent"
    }[priority] || priority;
  }

  function categoryLabel(category) {
    return {
      general: "Umum",
      technical: "Teknis",
      billing: "Billing",
      project: "Project",
      document: "Dokumen",
      other: "Lainnya"
    }[category] || category;
  }

  function dateTime(value) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;

    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(d);
  }

  const style = document.createElement("style");

  style.textContent = `
    .sb-admin-support[hidden],
    .sb-admin-support-modal[hidden] {
      display:none !important;
    }

    .sb-admin-support {
      display:grid;
      gap:22px;
    }

    .sb-admin-support-head {
      display:flex;
      justify-content:space-between;
      gap:16px;
      align-items:flex-start;
      flex-wrap:wrap;
    }

    .sb-admin-support-head h1 {
      margin:6px 0;
    }

    .sb-admin-support-summary {
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:14px;
    }

    .sb-ticket-name {
      display:grid;
      gap:3px;
    }

    .sb-ticket-name span {
      color:#64748b;
      font-size:12px;
    }

    .sb-admin-support-modal {
      position:fixed;
      inset:0;
      z-index:100200;
      display:grid;
      place-items:center;
      padding:20px;
      background:rgba(2,8,6,.72);
      backdrop-filter:blur(6px);
    }

    .sb-admin-support-card {
      width:min(100%,850px);
      max-height:calc(100vh - 40px);
      overflow:auto;
      background:#fff;
      color:#0f172a;
      border-radius:20px;
      box-shadow:0 24px 80px rgba(0,0,0,.35);
    }

    .sb-admin-support-modal-head {
      display:flex;
      justify-content:space-between;
      gap:16px;
      padding:22px 24px 16px;
      border-bottom:1px solid #e2e8f0;
    }

    .sb-admin-support-modal-head h2 {
      margin:0 0 5px;
    }

    .sb-admin-support-modal-head p {
      margin:0;
      color:#64748b;
      font-size:13px;
    }

    .sb-admin-support-close {
      width:38px;
      height:38px;
      border:0;
      border-radius:10px;
      background:#f1f5f9;
      cursor:pointer;
      font-size:20px;
    }

    .sb-admin-support-controls {
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:14px;
      padding:18px 24px;
      border-bottom:1px solid #e2e8f0;
      background:#f8fafc;
    }

    .sb-admin-support-field {
      display:grid;
      gap:7px;
    }

    .sb-admin-support-field label {
      font-size:12px;
      font-weight:800;
    }

    .sb-admin-support-field select {
      width:100%;
      padding:11px 12px;
      border:1px solid #cbd5e1;
      border-radius:10px;
      background:#fff;
      font:inherit;
    }

    .sb-admin-support-thread {
      display:grid;
      gap:12px;
      padding:20px 24px;
    }

    .sb-admin-support-message {
      padding:13px 14px;
      border:1px solid #e2e8f0;
      border-radius:12px;
      background:#f8fafc;
    }

    .sb-admin-support-message.admin {
      background:#ecfdf5;
      border-color:#bbf7d0;
    }

    .sb-admin-support-message.internal {
      background:#fff7ed;
      border-color:#fed7aa;
    }

    .sb-admin-support-message-head {
      display:flex;
      justify-content:space-between;
      gap:12px;
      margin-bottom:7px;
      color:#64748b;
      font-size:12px;
    }

    .sb-admin-support-message-text {
      white-space:pre-wrap;
      line-height:1.55;
    }

    .sb-admin-support-reply {
      padding:0 24px 24px;
    }

    .sb-admin-support-reply textarea {
      width:100%;
      min-height:100px;
      box-sizing:border-box;
      padding:12px;
      border:1px solid #cbd5e1;
      border-radius:10px;
      resize:vertical;
      font:inherit;
    }

    .sb-admin-support-reply-options {
      display:flex;
      justify-content:space-between;
      gap:12px;
      flex-wrap:wrap;
      align-items:center;
      margin-top:10px;
    }

    .sb-admin-support-reply-options select {
      padding:10px 12px;
      border:1px solid #cbd5e1;
      border-radius:9px;
      background:#fff;
    }

    .sb-admin-support-error {
      min-height:20px;
      margin-top:10px;
      color:#b91c1c;
      font-size:13px;
      font-weight:700;
    }

    @media(max-width:800px) {
      .sb-admin-support-summary,
      .sb-admin-support-controls {
        grid-template-columns:1fr;
      }
    }
  `;

  document.head.appendChild(style);

  const view = document.createElement("section");
  view.className = "sb-admin-support";
  view.hidden = true;
  view.dataset.sbView = "support";

  view.innerHTML = `
    <div class="sb-admin-support-head">
      <div>
        <div class="eyebrow">
          <span class="pulse"></span>Support Management &bull; R1
        </div>

        <h1>Support</h1>

        <p>
          Kelola tiket bantuan dan percakapan client langsung dari D1.
        </p>
      </div>

      <div>
        <button class="secondary" data-as-dashboard>
          &larr; Dashboard
        </button>

        <button class="secondary" data-as-refresh>
          Refresh
        </button>
      </div>
    </div>

    <section class="sb-admin-support-summary">
      <article class="stat">
        <div class="meta">Total tiket</div>
        <div class="value" data-as-total>0</div>
        <div class="sub">Database D1</div>
      </article>

      <article class="stat">
        <div class="meta">Open</div>
        <div class="value" data-as-open>0</div>
        <div class="sub">Belum ditangani</div>
      </article>

      <article class="stat">
        <div class="meta">In Progress</div>
        <div class="value" data-as-progress>0</div>
        <div class="sub">Sedang ditangani</div>
      </article>

      <article class="stat">
        <div class="meta">Resolved</div>
        <div class="value" data-as-resolved>0</div>
        <div class="sub">Sudah diselesaikan</div>
      </article>
    </section>

    <article class="card">
      <div class="card-head">
        <div>
          <h2>Daftar Tiket</h2>
          <p>Tiket terbaru dan prioritas tinggi tampil lebih dahulu.</p>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tiket</th>
              <th>Client</th>
              <th>Kategori</th>
              <th>Prioritas</th>
              <th>Status</th>
              <th>Pesan</th>
              <th>Update</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody data-as-rows></tbody>
        </table>
      </div>
    </article>
  `;

  content.appendChild(view);

  const modal = document.createElement("div");
  modal.className = "sb-admin-support-modal";
  modal.hidden = true;

  modal.innerHTML = `
    <div class="sb-admin-support-card">

      <div class="sb-admin-support-modal-head">
        <div>
          <h2 data-as-title>Support Ticket</h2>
          <p data-as-meta></p>
        </div>

        <button class="sb-admin-support-close"
                type="button"
                data-as-close>
          &times;
        </button>
      </div>

      <div class="sb-admin-support-controls">

        <div class="sb-admin-support-field">
          <label>Status</label>

          <select data-as-status>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div class="sb-admin-support-field">
          <label>Prioritas</label>

          <select data-as-priority>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

      </div>

      <div class="sb-admin-support-thread"
           data-as-thread></div>

      <form class="sb-admin-support-reply"
            data-as-reply-form>

        <textarea name="message"
                  maxlength="5000"
                  placeholder="Tulis balasan untuk client..."
                  required></textarea>

        <div class="sb-admin-support-reply-options">

          <select name="visibility">
            <option value="public">
              Balasan ke Client
            </option>

            <option value="internal">
              Catatan Internal
            </option>
          </select>

          <button class="primary"
                  type="submit"
                  data-as-reply-submit>
            Kirim
          </button>

        </div>

        <div class="sb-admin-support-error"
             data-as-error></div>

      </form>

    </div>
  `;

  document.body.appendChild(modal);

  const rows = view.querySelector("[data-as-rows]");

  const total = view.querySelector("[data-as-total]");
  const openCount = view.querySelector("[data-as-open]");
  const progressCount = view.querySelector("[data-as-progress]");
  const resolvedCount = view.querySelector("[data-as-resolved]");

  const title = modal.querySelector("[data-as-title]");
  const meta = modal.querySelector("[data-as-meta]");
  const thread = modal.querySelector("[data-as-thread]");
  const statusSelect = modal.querySelector("[data-as-status]");
  const prioritySelect = modal.querySelector("[data-as-priority]");

  const replyForm = modal.querySelector("[data-as-reply-form]");
  const replySubmit = modal.querySelector("[data-as-reply-submit]");
  const errorEl = modal.querySelector("[data-as-error]");

  let currentTicketId = null;
  let currentTicket = null;

  function links(name) {
    return [
      ...document.querySelectorAll(".nav a, .mobile-nav a")
    ].filter(
      a => a.textContent.trim().toLowerCase() === name.toLowerCase()
    );
  }

  function showView() {
    [...content.children].forEach(node => {
      if (node !== view) {
        node.style.display = "none";
      }
    });

    view.style.removeProperty("display");
    view.hidden = false;

    document
      .querySelectorAll(".nav a, .mobile-nav a")
      .forEach(a => a.classList.remove("active"));

    links("Support")
      .forEach(a => a.classList.add("active"));

    loadTickets();
  }

  function leaveView() {
    view.hidden = true;

    [...content.children].forEach(node => {
      if (node !== view) {
        node.style.removeProperty("display");
      }
    });
  }

  async function loadTickets() {
    rows.innerHTML =
      '<tr><td colspan="8">Memuat tiket...</td></tr>';

    try {
      const response = await fetch(API, {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
        cache: "no-store"
      });

      const data =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}`
        );
      }

      const tickets =
        Array.isArray(data.tickets)
          ? data.tickets
          : [];

      total.textContent = tickets.length;

      openCount.textContent =
        tickets.filter(x => x.status === "open").length;

      progressCount.textContent =
        tickets.filter(x => x.status === "in_progress").length;

      resolvedCount.textContent =
        tickets.filter(x => x.status === "resolved").length;

      rows.innerHTML = "";

      if (!tickets.length) {
        rows.innerHTML =
          '<tr><td colspan="8">Belum ada tiket support.</td></tr>';
        return;
      }

      tickets.forEach(ticket => {
        const tr = document.createElement("tr");

        const clientName =
          ticket.company_name ||
          ticket.full_name ||
          ticket.client_code ||
          "-";

        tr.innerHTML = `
          <td>
            <div class="sb-ticket-name">
              <strong>${esc(ticket.subject)}</strong>
              <span>${esc(ticket.ticket_code)}</span>
            </div>
          </td>

          <td>${esc(clientName)}</td>

          <td>${esc(categoryLabel(ticket.category))}</td>

          <td>${esc(priorityLabel(ticket.priority))}</td>

          <td>${esc(statusLabel(ticket.status))}</td>

          <td>${esc(ticket.message_count || 0)}</td>

          <td>${esc(dateTime(ticket.updated_at))}</td>

          <td>
            <button class="secondary"
                    data-as-open="${esc(ticket.id)}">
              Buka
            </button>
          </td>
        `;

        rows.appendChild(tr);
      });

    } catch (error) {
      rows.innerHTML = `
        <tr>
          <td colspan="8">
            Gagal memuat tiket:
            ${esc(error.message || "Unknown error")}
          </td>
        </tr>
      `;
    }
  }

  async function openTicket(id) {
    currentTicketId = id;
    currentTicket = null;

    errorEl.textContent = "";
    thread.innerHTML = "Memuat percakapan...";
    modal.hidden = false;

    try {
      const response = await fetch(
        `${API}/${encodeURIComponent(id)}`,
        {
          credentials: "same-origin",
          headers: { Accept: "application/json" },
          cache: "no-store"
        }
      );

      const data =
        await response.json().catch(() => ({}));

      if (!response.ok || !data.ticket) {
        throw new Error(
          data.error || `HTTP ${response.status}`
        );
      }

      currentTicket = data.ticket;

      title.textContent =
        currentTicket.subject;

      meta.textContent =
        `${currentTicket.ticket_code} • ` +
        `${currentTicket.company_name || currentTicket.full_name || currentTicket.client_code} • ` +
        `${categoryLabel(currentTicket.category)}`;

      statusSelect.value =
        currentTicket.status;

      prioritySelect.value =
        currentTicket.priority;

      const messages =
        Array.isArray(data.messages)
          ? data.messages
          : [];

      thread.innerHTML = "";

      messages.forEach(message => {
        const item = document.createElement("div");

        const isAdmin =
          message.sender_role === "system_admin" ||
          message.sender_role === "staff";

        const isInternal =
          message.visibility === "internal";

        item.className =
          "sb-admin-support-message" +
          (isAdmin ? " admin" : "") +
          (isInternal ? " internal" : "");

        item.innerHTML = `
          <div class="sb-admin-support-message-head">

            <strong>
              ${
                isInternal
                  ? "Catatan Internal"
                  : isAdmin
                    ? "Support Team"
                    : "Client"
              }
            </strong>

            <span>
              ${esc(dateTime(message.created_at))}
            </span>

          </div>

          <div class="sb-admin-support-message-text">
            ${esc(message.message)}
          </div>
        `;

        thread.appendChild(item);
      });

      replyForm.hidden =
        currentTicket.status === "closed";

    } catch (error) {
      thread.innerHTML = `
        <div class="sb-admin-support-error">
          ${esc(error.message || "Tiket tidak dapat dimuat.")}
        </div>
      `;
    }
  }

  async function updateTicket() {
    if (!currentTicketId || !currentTicket) return;

    errorEl.textContent = "";

    try {
      const response = await fetch(
        `${API}/${encodeURIComponent(currentTicketId)}`,
        {
          method: "PATCH",
          credentials: "same-origin",

          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            status: statusSelect.value,
            priority: prioritySelect.value
          })
        }
      );

      const data =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}`
        );
      }

      await openTicket(currentTicketId);
      await loadTickets();

    } catch (error) {
      errorEl.textContent =
        error.message ||
        "Status tiket belum dapat diperbarui.";
    }
  }

  statusSelect.addEventListener("change", updateTicket);
  prioritySelect.addEventListener("change", updateTicket);

  replyForm.addEventListener(
    "submit",
    async event => {
      event.preventDefault();

      if (!currentTicketId) return;

      const message =
        replyForm.elements.message.value.trim();

      const visibility =
        replyForm.elements.visibility.value;

      if (!message) return;

      errorEl.textContent = "";
      replySubmit.disabled = true;
      replySubmit.textContent = "Mengirim...";

      try {
        const response = await fetch(
          `${API}/${encodeURIComponent(currentTicketId)}/messages`,
          {
            method: "POST",
            credentials: "same-origin",

            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              message,
              visibility
            })
          }
        );

        const data =
          await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.error || `HTTP ${response.status}`
          );
        }

        replyForm.elements.message.value = "";

        await openTicket(currentTicketId);
        await loadTickets();

      } catch (error) {
        errorEl.textContent =
          error.message ||
          "Balasan belum dapat dikirim.";
      } finally {
        replySubmit.disabled = false;
        replySubmit.textContent = "Kirim";
      }
    }
  );

  view.addEventListener("click", event => {
    const button =
      event.target.closest("[data-as-open]");

    if (button) {
      openTicket(button.dataset.asOpen);
    }
  });

  links("Support").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      showView();
    });
  });

  view.querySelector("[data-as-dashboard]")
    .addEventListener("click", () => {
      leaveView();
      links("Dashboard")[0]?.click();
    });

  view.querySelector("[data-as-refresh]")
    .addEventListener("click", loadTickets);

  modal.querySelector("[data-as-close]")
    .addEventListener(
      "click",
      () => modal.hidden = true
    );
})();