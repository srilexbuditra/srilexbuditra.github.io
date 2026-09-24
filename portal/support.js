(() => {
  "use strict";

  const API = "/api/client/support";
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
    .sb-support-view[hidden],
    .sb-support-modal[hidden] {
      display:none !important;
    }

    .sb-support-view {
      display:grid;
      gap:22px;
    }

    .sb-support-head {
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:16px;
      flex-wrap:wrap;
    }

    .sb-support-head h1 {
      margin:6px 0;
    }

    .sb-support-actions {
      display:flex;
      gap:10px;
      flex-wrap:wrap;
    }

    .sb-support-summary {
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:14px;
    }

    .sb-support-name {
      display:grid;
      gap:3px;
    }

    .sb-support-name span {
      color:#64748b;
      font-size:12px;
    }

    .sb-support-modal {
      position:fixed;
      inset:0;
      z-index:100100;
      display:grid;
      place-items:center;
      padding:20px;
      background:rgba(2,8,6,.72);
      backdrop-filter:blur(6px);
    }

    .sb-support-card {
      width:min(100%,760px);
      max-height:calc(100vh - 40px);
      overflow:auto;
      background:#fff;
      color:#0f172a;
      border-radius:20px;
      box-shadow:0 24px 80px rgba(0,0,0,.35);
    }

    .sb-support-modal-head {
      display:flex;
      justify-content:space-between;
      gap:16px;
      align-items:flex-start;
      padding:22px 24px 16px;
      border-bottom:1px solid #e2e8f0;
    }

    .sb-support-modal-head h2 {
      margin:0 0 5px;
    }

    .sb-support-modal-head p {
      margin:0;
      color:#64748b;
      font-size:13px;
    }

    .sb-support-close {
      width:38px;
      height:38px;
      border:0;
      border-radius:10px;
      background:#f1f5f9;
      cursor:pointer;
      font-size:20px;
    }

    .sb-support-form {
      padding:22px 24px 24px;
    }

    .sb-support-grid {
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:15px;
    }

    .sb-support-field {
      display:grid;
      gap:7px;
    }

    .sb-support-field.full {
      grid-column:1 / -1;
    }

    .sb-support-field label {
      font-size:13px;
      font-weight:800;
    }

    .sb-support-field input,
    .sb-support-field select,
    .sb-support-field textarea {
      width:100%;
      box-sizing:border-box;
      padding:12px 13px;
      border:1px solid #cbd5e1;
      border-radius:10px;
      background:#fff;
      font:inherit;
    }

    .sb-support-field textarea {
      min-height:120px;
      resize:vertical;
    }

    .sb-support-error {
      min-height:20px;
      margin:12px 0 0;
      color:#b91c1c;
      font-weight:700;
      font-size:13px;
    }

    .sb-support-form-actions {
      display:flex;
      justify-content:flex-end;
      gap:10px;
      margin-top:16px;
    }

    .sb-support-thread {
      display:grid;
      gap:12px;
      padding:20px 24px;
    }

    .sb-support-message {
      padding:13px 14px;
      border:1px solid #e2e8f0;
      border-radius:12px;
      background:#f8fafc;
    }

    .sb-support-message.admin {
      background:#ecfdf5;
      border-color:#bbf7d0;
    }

    .sb-support-message-head {
      display:flex;
      justify-content:space-between;
      gap:12px;
      margin-bottom:7px;
      color:#64748b;
      font-size:12px;
    }

    .sb-support-message-text {
      white-space:pre-wrap;
      line-height:1.55;
    }

    .sb-support-reply {
      padding:0 24px 24px;
    }

    .sb-support-reply textarea {
      width:100%;
      min-height:90px;
      box-sizing:border-box;
      padding:12px;
      border:1px solid #cbd5e1;
      border-radius:10px;
      resize:vertical;
      font:inherit;
    }

    .sb-support-empty {
      padding:30px 18px;
      text-align:center;
      color:#64748b;
    }

    @media(max-width:800px) {
      .sb-support-summary,
      .sb-support-grid {
        grid-template-columns:1fr;
      }

      .sb-support-field.full {
        grid-column:auto;
      }
    }
  `;

  document.head.appendChild(style);

  const view = document.createElement("section");
  view.className = "sb-support-view";
  view.hidden = true;

  view.innerHTML = `
    <div class="sb-support-head">
      <div>
        <div class="eyebrow">
          <span class="pulse"></span>Support Center &bull; R1
        </div>

        <h1>Support</h1>

        <p>
          Kirim pertanyaan atau kendala dan pantau tanggapan tim.
        </p>
      </div>

      <div class="sb-support-actions">
        <button class="secondary" data-support-dashboard>
          &larr; Dashboard
        </button>

        <button class="secondary" data-support-refresh>
          Refresh
        </button>

        <button class="primary" data-support-new>
          + Buat Tiket
        </button>
      </div>
    </div>

    <section class="sb-support-summary">
      <article class="stat">
        <div class="meta">Total tiket</div>
        <div class="value" data-support-total>0</div>
        <div class="sub">Semua tiket Anda</div>
      </article>

      <article class="stat">
        <div class="meta">Open</div>
        <div class="value" data-support-open>0</div>
        <div class="sub">Menunggu penanganan</div>
      </article>

      <article class="stat">
        <div class="meta">In Progress</div>
        <div class="value" data-support-progress>0</div>
        <div class="sub">Sedang ditangani</div>
      </article>

      <article class="stat">
        <div class="meta">Resolved</div>
        <div class="value" data-support-resolved>0</div>
        <div class="sub">Sudah diselesaikan</div>
      </article>
    </section>

    <article class="card">
      <div class="card-head">
        <div>
          <h2>Tiket Support</h2>
          <p>
            Hanya tiket milik akun Anda yang ditampilkan.
          </p>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tiket</th>
              <th>Kategori</th>
              <th>Prioritas</th>
              <th>Status</th>
              <th>Pesan</th>
              <th>Update</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody data-support-rows></tbody>
        </table>
      </div>

      <div class="sb-support-empty"
           data-support-empty
           hidden>
        Belum ada tiket support.
      </div>
    </article>
  `;

  content.appendChild(view);

  const createModal = document.createElement("div");
  createModal.className = "sb-support-modal";
  createModal.hidden = true;

  createModal.innerHTML = `
    <div class="sb-support-card">
      <div class="sb-support-modal-head">
        <div>
          <h2>Buat Tiket Support</h2>
          <p>
            Jelaskan kebutuhan atau kendala secara singkat dan jelas.
          </p>
        </div>

        <button class="sb-support-close"
                type="button"
                data-support-create-close>
          &times;
        </button>
      </div>

      <form class="sb-support-form"
            data-support-create-form>

        <div class="sb-support-grid">

          <div class="sb-support-field full">
            <label>Subjek *</label>
            <input name="subject"
                   maxlength="180"
                   required>
          </div>

          <div class="sb-support-field">
            <label>Kategori *</label>

            <select name="category" required>
              <option value="general">Umum</option>
              <option value="technical">Teknis</option>
              <option value="billing">Billing</option>
              <option value="project">Project</option>
              <option value="document">Dokumen</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div class="sb-support-field">
            <label>Prioritas *</label>

            <select name="priority" required>
              <option value="low">Low</option>
              <option value="normal" selected>Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div class="sb-support-field full">
            <label>Pesan *</label>

            <textarea name="message"
                      maxlength="5000"
                      required></textarea>
          </div>

        </div>

        <div class="sb-support-error"
             data-support-create-error></div>

        <div class="sb-support-form-actions">
          <button class="secondary"
                  type="button"
                  data-support-create-cancel>
            Batal
          </button>

          <button class="primary"
                  type="submit"
                  data-support-create-submit>
            Buat Tiket
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(createModal);

  const detailModal = document.createElement("div");
  detailModal.className = "sb-support-modal";
  detailModal.hidden = true;

  detailModal.innerHTML = `
    <div class="sb-support-card">

      <div class="sb-support-modal-head">
        <div>
          <h2 data-support-detail-title>Support</h2>
          <p data-support-detail-meta></p>
        </div>

        <button class="sb-support-close"
                type="button"
                data-support-detail-close>
          &times;
        </button>
      </div>

      <div class="sb-support-thread"
           data-support-thread></div>

      <form class="sb-support-reply"
            data-support-reply-form>

        <textarea name="message"
                  maxlength="5000"
                  placeholder="Tulis balasan..."
                  required></textarea>

        <div class="sb-support-error"
             data-support-reply-error></div>

        <div class="sb-support-form-actions">
          <button class="primary"
                  type="submit"
                  data-support-reply-submit>
            Kirim Balasan
          </button>
        </div>
      </form>

    </div>
  `;

  document.body.appendChild(detailModal);

  const rows = view.querySelector("[data-support-rows]");
  const empty = view.querySelector("[data-support-empty]");

  const total = view.querySelector("[data-support-total]");
  const openCount = view.querySelector("[data-support-open]");
  const progressCount = view.querySelector("[data-support-progress]");
  const resolvedCount = view.querySelector("[data-support-resolved]");

  const createForm =
    createModal.querySelector("[data-support-create-form]");

  const createError =
    createModal.querySelector("[data-support-create-error]");

  const createSubmit =
    createModal.querySelector("[data-support-create-submit]");

  const detailTitle =
    detailModal.querySelector("[data-support-detail-title]");

  const detailMeta =
    detailModal.querySelector("[data-support-detail-meta]");

  const thread =
    detailModal.querySelector("[data-support-thread]");

  const replyForm =
    detailModal.querySelector("[data-support-reply-form]");

  const replyError =
    detailModal.querySelector("[data-support-reply-error]");

  const replySubmit =
    detailModal.querySelector("[data-support-reply-submit]");

  let currentTicketId = null;

  function links(name) {
    return [
      ...document.querySelectorAll(".nav a, .mobile-nav a")
    ].filter(
      a => a.textContent.trim().toLowerCase() === name.toLowerCase()
    );
  }

  function showView() {
    [...content.children].forEach(node => {
      if (node !== view) node.style.display = "none";
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
      '<tr><td colspan="7">Memuat tiket...</td></tr>';

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
      empty.hidden = tickets.length !== 0;

      tickets.forEach(ticket => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>
            <div class="sb-support-name">
              <strong>${esc(ticket.subject)}</strong>
              <span>${esc(ticket.ticket_code)}</span>
            </div>
          </td>

          <td>${esc(categoryLabel(ticket.category))}</td>

          <td>${esc(priorityLabel(ticket.priority))}</td>

          <td>${esc(statusLabel(ticket.status))}</td>

          <td>${esc(ticket.message_count || 0)}</td>

          <td>${esc(dateTime(ticket.updated_at))}</td>

          <td>
            <button class="secondary"
                    data-support-open-ticket="${esc(ticket.id)}">
              Buka
            </button>
          </td>
        `;

        rows.appendChild(tr);
      });

    } catch (error) {
      rows.innerHTML = `
        <tr>
          <td colspan="7">
            Gagal memuat tiket:
            ${esc(error.message || "Unknown error")}
          </td>
        </tr>
      `;
    }
  }

  async function openTicket(id) {
    currentTicketId = id;
    replyError.textContent = "";
    thread.innerHTML = "Memuat percakapan...";
    detailModal.hidden = false;

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

      const ticket = data.ticket;
      const messages =
        Array.isArray(data.messages)
          ? data.messages
          : [];

      detailTitle.textContent =
        ticket.subject;

      detailMeta.textContent =
        `${ticket.ticket_code} • ` +
        `${categoryLabel(ticket.category)} • ` +
        `${priorityLabel(ticket.priority)} • ` +
        `${statusLabel(ticket.status)}`;

      thread.innerHTML = "";

      messages.forEach(message => {
        const item = document.createElement("div");

        const isAdmin =
          message.sender_role === "system_admin" ||
          message.sender_role === "staff";

        item.className =
          `sb-support-message${isAdmin ? " admin" : ""}`;

        item.innerHTML = `
          <div class="sb-support-message-head">
            <strong>
              ${isAdmin ? "Support Team" : "Anda"}
            </strong>

            <span>
              ${esc(dateTime(message.created_at))}
            </span>
          </div>

          <div class="sb-support-message-text">
            ${esc(message.message)}
          </div>
        `;

        thread.appendChild(item);
      });

      if (ticket.status === "closed") {
        replyForm.hidden = true;
      } else {
        replyForm.hidden = false;
      }

    } catch (error) {
      thread.innerHTML =
        `<div class="sb-support-error">
          ${esc(error.message || "Tiket tidak dapat dimuat.")}
        </div>`;
    }
  }

  createForm.addEventListener(
    "submit",
    async event => {
      event.preventDefault();

      const payload = {
        subject:
          createForm.elements.subject.value.trim(),

        category:
          createForm.elements.category.value,

        priority:
          createForm.elements.priority.value,

        message:
          createForm.elements.message.value.trim()
      };

      createError.textContent = "";
      createSubmit.disabled = true;
      createSubmit.textContent = "Menyimpan...";

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

        const data =
          await response.json().catch(() => ({}));

        if (!response.ok || !data.ticket) {
          throw new Error(
            data.error || `HTTP ${response.status}`
          );
        }

        createModal.hidden = true;
        createForm.reset();

        await loadTickets();

      } catch (error) {
        createError.textContent =
          error.message ||
          "Tiket belum dapat dibuat.";
      } finally {
        createSubmit.disabled = false;
        createSubmit.textContent = "Buat Tiket";
      }
    }
  );

  replyForm.addEventListener(
    "submit",
    async event => {
      event.preventDefault();

      if (!currentTicketId) return;

      const message =
        replyForm.elements.message.value.trim();

      if (!message) return;

      replyError.textContent = "";
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

            body: JSON.stringify({ message })
          }
        );

        const data =
          await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.error || `HTTP ${response.status}`
          );
        }

        replyForm.reset();

        await openTicket(currentTicketId);
        await loadTickets();

      } catch (error) {
        replyError.textContent =
          error.message ||
          "Balasan belum dapat dikirim.";
      } finally {
        replySubmit.disabled = false;
        replySubmit.textContent = "Kirim Balasan";
      }
    }
  );

  view.addEventListener("click", event => {
    const button =
      event.target.closest("[data-support-open-ticket]");

    if (button) {
      openTicket(
        button.dataset.supportOpenTicket
      );
    }
  });

  links("Support").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      showView();
    });
  });

  view.querySelector("[data-support-dashboard]")
    .addEventListener("click", () => {
      leaveView();
      links("Home")[0]?.click();
    });

  view.querySelector("[data-support-refresh]")
    .addEventListener("click", loadTickets);

  view.querySelector("[data-support-new]")
    .addEventListener("click", () => {
      createForm.reset();
      createError.textContent = "";
      createModal.hidden = false;
    });

  createModal
    .querySelector("[data-support-create-close]")
    .addEventListener(
      "click",
      () => createModal.hidden = true
    );

  createModal
    .querySelector("[data-support-create-cancel]")
    .addEventListener(
      "click",
      () => createModal.hidden = true
    );

  detailModal
    .querySelector("[data-support-detail-close]")
    .addEventListener(
      "click",
      () => detailModal.hidden = true
    );
})();