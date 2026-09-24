(() => {
  "use strict";

  const API = "/api/admin/leads";

  const content =
    document.querySelector("main.content");

  if (!content) return;

  if (
    document.querySelector(
      '[data-sb-view="leads"]'
    )
  ) {
    return;
  }

  const STATUS_LABELS = {
    new: "New",
    contacted: "Contacted",
    qualified: "Qualified",
    lost: "Lost",
    converted: "Converted"
  };

  let leads = [];
  let currentLeadId = null;

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

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat(
      "id-ID",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    ).format(date);
  }

  function toDatetimeLocal(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const pad =
      number =>
        String(number).padStart(2, "0");

    return [
      date.getFullYear(),
      "-",
      pad(date.getMonth() + 1),
      "-",
      pad(date.getDate()),
      "T",
      pad(date.getHours()),
      ":",
      pad(date.getMinutes())
    ].join("");
  }

  function statusLabel(status) {
    return STATUS_LABELS[status] || status;
  }

  function addStyles() {
    if (
      document.getElementById(
        "sb-leads-r1-styles"
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id = "sb-leads-r1-styles";

    style.textContent = `
      .sb-leads-view[hidden],
      .sb-leads-modal[hidden],
      .sb-leads-convert-modal[hidden] {
        display: none !important;
      }

      .sb-leads-view {
        display: grid;
        gap: 20px;
        width: 100%;
      }

      .sb-leads-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        flex-wrap: wrap;
      }

      .sb-leads-head h1 {
        margin: 5px 0 6px;
      }

      .sb-leads-head p {
        margin: 0;
        color: #64748b;
      }

      .sb-leads-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .sb-leads-summary {
        display: grid;
        grid-template-columns:
          repeat(5, minmax(0, 1fr));
        gap: 12px;
      }

      .sb-leads-stat {
        padding: 16px;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        background: #fff;
        box-shadow:
          0 4px 18px rgba(15,23,42,.04);
      }

      .sb-leads-stat span {
        display: block;
        margin-bottom: 8px;
        color: #64748b;
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: .04em;
      }

      .sb-leads-stat strong {
        font-size: 28px;
        line-height: 1;
      }

      .sb-leads-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }

      .sb-leads-toolbar-group {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        flex: 1;
      }

      .sb-leads-toolbar input,
      .sb-leads-toolbar select {
        min-height: 42px;
        border: 1px solid #d8e0dc;
        border-radius: 10px;
        background: #fff;
        padding: 9px 12px;
        font: inherit;
      }

      .sb-leads-toolbar input {
        width: min(100%, 360px);
        flex: 1;
      }

      .sb-leads-notice {
        display: none;
        padding: 12px 14px;
        border: 1px solid #bfe5d1;
        border-radius: 10px;
        background: #effaf4;
        color: #176b4d;
        font-size: 13px;
        font-weight: 700;
      }

      .sb-leads-notice.show {
        display: block;
      }

      .sb-leads-table-card {
        overflow: hidden;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        background: #fff;
        box-shadow:
          0 6px 22px rgba(15,23,42,.05);
      }

      .sb-leads-table-wrap {
        overflow-x: auto;
      }

      .sb-leads-table {
        width: 100%;
        min-width: 960px;
        border-collapse: collapse;
      }

      .sb-leads-table th,
      .sb-leads-table td {
        padding: 14px 15px;
        border-bottom: 1px solid #edf2ef;
        text-align: left;
        vertical-align: middle;
      }

      .sb-leads-table th {
        background: #f8faf9;
        color: #66756f;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: .05em;
      }

      .sb-leads-table tr:last-child td {
        border-bottom: 0;
      }

      .sb-leads-table tbody tr {
        cursor: pointer;
      }

      .sb-leads-table tbody tr:hover {
        background: #f8fbf9;
      }

      .sb-lead-name {
        display: grid;
        gap: 3px;
      }

      .sb-lead-name strong {
        color: #10231c;
      }

      .sb-lead-name span {
        color: #718078;
        font-size: 12px;
      }

      .sb-lead-code {
        font-family:
          ui-monospace,
          SFMono-Regular,
          Menlo,
          monospace;
        font-size: 11px;
        color: #718078;
      }

      .sb-lead-status {
        display: inline-flex;
        align-items: center;
        padding: 6px 9px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 800;
        white-space: nowrap;
      }

      .sb-lead-status.new {
        background: #eff6ff;
        color: #1d4ed8;
      }

      .sb-lead-status.contacted {
        background: #fff7ed;
        color: #c2410c;
      }

      .sb-lead-status.qualified {
        background: #ecfdf5;
        color: #047857;
      }

      .sb-lead-status.lost {
        background: #fef2f2;
        color: #b91c1c;
      }

      .sb-lead-status.converted {
        background: #eef2ff;
        color: #4338ca;
      }

      .sb-leads-empty {
        padding: 38px 20px;
        text-align: center;
        color: #64748b;
      }

      .sb-leads-modal,
      .sb-leads-convert-modal {
        position: fixed;
        inset: 0;
        z-index: 100000;
        display: grid;
        place-items: center;
        padding: 22px;
        background: rgba(2,8,6,.72);
        backdrop-filter: blur(6px);
      }

      .sb-leads-modal-card {
        width: min(100%, 860px);
        max-height: calc(100vh - 44px);
        overflow: auto;
        border-radius: 20px;
        background: #fff;
        color: #0f172a;
        box-shadow:
          0 24px 80px rgba(0,0,0,.34);
      }

      .sb-leads-convert-card {
        width: min(100%, 520px);
      }

      .sb-leads-modal-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        padding: 22px 24px 17px;
        border-bottom: 1px solid #e2e8f0;
      }

      .sb-leads-modal-head h2 {
        margin: 0 0 5px;
      }

      .sb-leads-modal-head p {
        margin: 0;
        color: #64748b;
        font-size: 13px;
      }

      .sb-leads-close {
        width: 38px;
        height: 38px;
        border: 0;
        border-radius: 10px;
        background: #f1f5f9;
        cursor: pointer;
        font-size: 20px;
      }

      .sb-leads-form {
        padding: 22px 24px;
      }

      .sb-leads-grid {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
        gap: 15px;
      }

      .sb-leads-field {
        display: grid;
        gap: 7px;
      }

      .sb-leads-field.full {
        grid-column: 1 / -1;
      }

      .sb-leads-field label {
        font-size: 12px;
        font-weight: 800;
        color: #33443d;
      }

      .sb-leads-field input,
      .sb-leads-field select,
      .sb-leads-field textarea {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        padding: 11px 12px;
        font: inherit;
        outline: none;
      }

      .sb-leads-field textarea {
        min-height: 92px;
        resize: vertical;
      }

      .sb-leads-field input:focus,
      .sb-leads-field select:focus,
      .sb-leads-field textarea:focus {
        border-color: #16875f;
        box-shadow:
          0 0 0 3px rgba(22,135,95,.11);
      }

      .sb-leads-form-error {
        min-height: 20px;
        margin-top: 12px;
        color: #b91c1c;
        font-size: 13px;
        font-weight: 700;
      }

      .sb-leads-form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 8px;
        flex-wrap: wrap;
      }

      .sb-leads-converted {
        display: none;
        margin-bottom: 16px;
        padding: 12px 14px;
        border: 1px solid #c7d2fe;
        border-radius: 10px;
        background: #eef2ff;
        color: #3730a3;
        font-size: 13px;
        font-weight: 700;
      }

      .sb-leads-converted.show {
        display: block;
      }

      .sb-leads-notes {
        margin-top: 22px;
        padding-top: 20px;
        border-top: 1px solid #e2e8f0;
      }

      .sb-leads-notes h3 {
        margin: 0 0 5px;
      }

      .sb-leads-notes > p {
        margin: 0 0 14px;
        color: #64748b;
        font-size: 12px;
      }

      .sb-leads-note-compose {
        display: grid;
        gap: 9px;
        margin-bottom: 16px;
      }

      .sb-leads-note-compose textarea {
        width: 100%;
        min-height: 76px;
        box-sizing: border-box;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        padding: 11px 12px;
        font: inherit;
        resize: vertical;
      }

      .sb-leads-note-compose button {
        justify-self: end;
      }

      .sb-leads-note-list {
        display: grid;
        gap: 10px;
      }

      .sb-leads-note {
        padding: 12px 14px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        background: #f8faf9;
      }

      .sb-leads-note p {
        margin: 0 0 8px;
        white-space: pre-wrap;
        line-height: 1.55;
      }

      .sb-leads-note small {
        color: #718078;
      }

      .sb-leads-note-empty {
        color: #64748b;
        font-size: 13px;
      }

      .sb-leads-convert-area {
        display: none;
        margin-top: 18px;
        padding: 15px;
        border: 1px solid #bfe5d1;
        border-radius: 12px;
        background: #effaf4;
      }

      .sb-leads-convert-area.show {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        flex-wrap: wrap;
      }

      .sb-leads-convert-area strong {
        display: block;
        margin-bottom: 4px;
      }

      .sb-leads-convert-area span {
        color: #52665e;
        font-size: 12px;
      }

      @media (max-width: 1050px) {
        .sb-leads-summary {
          grid-template-columns:
            repeat(3, minmax(0,1fr));
        }
      }

      @media (max-width: 720px) {
        .sb-leads-summary,
        .sb-leads-grid {
          grid-template-columns: 1fr;
        }

        .sb-leads-field.full {
          grid-column: auto;
        }

        .sb-leads-head,
        .sb-leads-actions,
        .sb-leads-toolbar,
        .sb-leads-toolbar-group {
          width: 100%;
        }

        .sb-leads-actions button {
          flex: 1;
        }

        .sb-leads-toolbar input,
        .sb-leads-toolbar select {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(style);
  }

  addStyles();

  const view =
    document.createElement("section");

  view.className = "sb-leads-view";
  view.dataset.sbView = "leads";
  view.hidden = true;

  view.innerHTML = `
    <div class="sb-leads-head">
      <div>
        <div class="eyebrow">
          <span class="pulse"></span>
          Lead Management - R1
        </div>

        <h1>Leads</h1>

        <p>
          Kelola calon client dari kontak awal
          sampai konversi menjadi client aktif.
        </p>
      </div>

      <div class="sb-leads-actions">
        <button
          class="secondary"
          type="button"
          data-leads-refresh
        >
          Refresh
        </button>

        <button
          type="button"
          data-leads-new
        >
          New Lead
        </button>
      </div>
    </div>

    <div class="sb-leads-summary">
      <div class="sb-leads-stat">
        <span>New</span>
        <strong data-leads-count="new">0</strong>
      </div>

      <div class="sb-leads-stat">
        <span>Contacted</span>
        <strong data-leads-count="contacted">0</strong>
      </div>

      <div class="sb-leads-stat">
        <span>Qualified</span>
        <strong data-leads-count="qualified">0</strong>
      </div>

      <div class="sb-leads-stat">
        <span>Lost</span>
        <strong data-leads-count="lost">0</strong>
      </div>

      <div class="sb-leads-stat">
        <span>Converted</span>
        <strong data-leads-count="converted">0</strong>
      </div>
    </div>

    <div
      class="sb-leads-notice"
      data-leads-notice
    ></div>

    <div class="sb-leads-toolbar">
      <div class="sb-leads-toolbar-group">
        <input
          type="search"
          placeholder="Cari nama, company, email, kode..."
          data-leads-search
        >

        <select data-leads-filter>
          <option value="">Semua status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
          <option value="converted">Converted</option>
        </select>
      </div>
    </div>

    <div class="sb-leads-table-card">
      <div class="sb-leads-table-wrap">
        <table class="sb-leads-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Interest</th>
              <th>Status</th>
              <th>Follow-up</th>
              <th>Notes</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>

          <tbody data-leads-body>
            <tr>
              <td colspan="7">
                <div class="sb-leads-empty">
                  Memuat leads...
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  content.appendChild(view);

  const modal =
    document.createElement("div");

  modal.className = "sb-leads-modal";
  modal.hidden = true;

  modal.innerHTML = `
    <div class="sb-leads-modal-card">
      <div class="sb-leads-modal-head">
        <div>
          <h2 data-lead-modal-title>
            New Lead
          </h2>

          <p data-lead-modal-subtitle>
            Tambahkan calon client baru.
          </p>
        </div>

        <button
          class="sb-leads-close"
          type="button"
          data-lead-close
          aria-label="Tutup"
        >
          &times;
        </button>
      </div>

      <form
        class="sb-leads-form"
        data-lead-form
      >
        <div
          class="sb-leads-converted"
          data-lead-converted
        ></div>

        <div class="sb-leads-grid">
          <div class="sb-leads-field">
            <label>Nama Lengkap *</label>
            <input
              name="full_name"
              required
              maxlength="200"
            >
          </div>

          <div class="sb-leads-field">
            <label>Company</label>
            <input
              name="company_name"
              maxlength="200"
            >
          </div>

          <div class="sb-leads-field">
            <label>Email</label>
            <input
              name="email"
              type="email"
            >
          </div>

          <div class="sb-leads-field">
            <label>Phone</label>
            <input
              name="phone"
              maxlength="100"
            >
          </div>

          <div class="sb-leads-field">
            <label>Source</label>
            <input
              name="source"
              maxlength="160"
              placeholder="WhatsApp, Referral, Website..."
            >
          </div>

          <div class="sb-leads-field">
            <label>Service Interest</label>
            <input
              name="service_interest"
              maxlength="300"
            >
          </div>

          <div class="sb-leads-field">
            <label>Status</label>

            <select name="status">
              <option value="new">New</option>
              <option value="contacted">
                Contacted
              </option>
              <option value="qualified">
                Qualified
              </option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div class="sb-leads-field">
            <label>Next Follow-up</label>

            <input
              name="next_follow_up_at"
              type="datetime-local"
            >
          </div>

          <div class="sb-leads-field full">
            <label>Message / Requirement</label>

            <textarea
              name="message"
              maxlength="5000"
            ></textarea>
          </div>
        </div>

        <div
          class="sb-leads-form-error"
          data-lead-error
        ></div>

        <div class="sb-leads-form-actions">
          <button
            class="secondary"
            type="button"
            data-lead-cancel
          >
            Batal
          </button>

          <button
            type="submit"
            data-lead-save
          >
            Simpan Lead
          </button>
        </div>

        <section
          class="sb-leads-notes"
          data-lead-notes-section
          hidden
        >
          <h3>Notes & Follow-up</h3>

          <p>
            Riwayat catatan internal untuk lead ini.
          </p>

          <div
            class="sb-leads-note-compose"
            data-lead-note-compose
          >
            <textarea
              maxlength="5000"
              placeholder="Tambahkan catatan follow-up..."
              data-lead-note-text
            ></textarea>

            <button
              class="secondary"
              type="button"
              data-lead-note-add
            >
              Add Note
            </button>
          </div>

          <div
            class="sb-leads-note-list"
            data-lead-note-list
          ></div>
        </section>

        <div
          class="sb-leads-convert-area"
          data-lead-convert-area
        >
          <div>
            <strong>
              Lead sudah Qualified
            </strong>

            <span>
              Buat akun Client dari lead ini.
            </span>
          </div>

          <button
            type="button"
            data-lead-convert
          >
            Convert to Client
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const convertModal =
    document.createElement("div");

  convertModal.className =
    "sb-leads-convert-modal";

  convertModal.hidden = true;

  convertModal.innerHTML = `
    <div
      class="sb-leads-modal-card
             sb-leads-convert-card"
    >
      <div class="sb-leads-modal-head">
        <div>
          <h2>Convert to Client</h2>

          <p data-convert-lead-label>
            Qualified lead
          </p>
        </div>

        <button
          class="sb-leads-close"
          type="button"
          data-convert-close
        >
          &times;
        </button>
      </div>

      <form
        class="sb-leads-form"
        data-convert-form
      >
        <div class="sb-leads-field">
          <label>
            Temporary Password *
          </label>

          <input
            name="temporary_password"
            type="password"
            autocomplete="new-password"
            required
          >
        </div>

        <p
          style="
            color:#64748b;
            font-size:12px;
            line-height:1.55;
            margin:12px 0 0;
          "
        >
          Client akan diwajibkan mengganti
          password saat login pertama.
        </p>

        <div
          class="sb-leads-form-error"
          data-convert-error
        ></div>

        <div class="sb-leads-form-actions">
          <button
            class="secondary"
            type="button"
            data-convert-cancel
          >
            Batal
          </button>

          <button type="submit">
            Convert Client
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(convertModal);

  const body =
    view.querySelector("[data-leads-body]");

  const search =
    view.querySelector("[data-leads-search]");

  const filter =
    view.querySelector("[data-leads-filter]");

  const notice =
    view.querySelector("[data-leads-notice]");

  const form =
    modal.querySelector("[data-lead-form]");

  const formError =
    modal.querySelector("[data-lead-error]");

  const title =
    modal.querySelector(
      "[data-lead-modal-title]"
    );

  const subtitle =
    modal.querySelector(
      "[data-lead-modal-subtitle]"
    );

  const convertedBox =
    modal.querySelector(
      "[data-lead-converted]"
    );

  const notesSection =
    modal.querySelector(
      "[data-lead-notes-section]"
    );

  const noteCompose =
    modal.querySelector(
      "[data-lead-note-compose]"
    );

  const noteText =
    modal.querySelector(
      "[data-lead-note-text]"
    );

  const noteList =
    modal.querySelector(
      "[data-lead-note-list]"
    );

  const convertArea =
    modal.querySelector(
      "[data-lead-convert-area]"
    );

  const saveButton =
    modal.querySelector("[data-lead-save]");

  function showNotice(message) {
    notice.textContent = message;
    notice.classList.add("show");

    setTimeout(() => {
      notice.classList.remove("show");
    }, 3500);
  }

  async function api(
    url,
    options = {}
  ) {
    const response = await fetch(
      url,
      {
        ...options,
        headers: {
          Accept: "application/json",
          ...(options.headers || {})
        }
      }
    );

    let result = {};

    try {
      result = await response.json();
    } catch {
      result = {};
    }

    if (!response.ok) {
      const error =
        new Error(
          result.error ||
          `Request failed (${response.status}).`
        );

      error.status = response.status;
      error.body = result;

      throw error;
    }

    return result;
  }

  function updateSummary() {
    Object.keys(STATUS_LABELS)
      .forEach(status => {
        const target =
          view.querySelector(
            `[data-leads-count="${status}"]`
          );

        if (!target) return;

        target.textContent =
          leads.filter(
            lead => lead.status === status
          ).length;
      });
  }

  function updateDashboardLeadCount() {
    const newCount =
      leads.filter(
        lead => lead.status === "new"
      ).length;

    const followUpCount =
      leads.filter(
        lead =>
          ["new","contacted","qualified"]
            .includes(lead.status) &&
          Boolean(lead.next_follow_up_at)
      ).length;

    const candidates =
      [
        ...document.querySelectorAll(
          "main.content article, main.content .stat"
        )
      ];

    const card =
      candidates.find(
        element =>
          /new leads/i.test(
            element.textContent || ""
          )
      );

    if (!card) return;

    const number =
      card.querySelector(
        "strong, .value, .number"
      );

    if (number) {
      number.textContent = newCount;
    }

    const detail =
      [
        ...card.querySelectorAll(
          "p, small, span"
        )
      ].find(
        element =>
          /follow-up/i.test(
            element.textContent || ""
          )
      );

    if (detail) {
      detail.textContent =
        `${followUpCount} follow-up scheduled`;
    }
  }

  function render() {
    updateSummary();
    updateDashboardLeadCount();

    const query =
      String(search.value || "")
        .trim()
        .toLowerCase();

    const status =
      String(filter.value || "");

    const filtered =
      leads.filter(lead => {
        if (
          status &&
          lead.status !== status
        ) {
          return false;
        }

        if (!query) return true;

        const haystack =
          [
            lead.lead_code,
            lead.full_name,
            lead.company_name,
            lead.email,
            lead.phone,
            lead.service_interest,
            lead.source
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return haystack.includes(query);
      });

    if (!filtered.length) {
      body.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="sb-leads-empty">
              Tidak ada lead yang sesuai.
            </div>
          </td>
        </tr>
      `;

      return;
    }

    body.innerHTML =
      filtered.map(lead => `
        <tr data-lead-row="${escapeHtml(lead.id)}">
          <td>
            <div class="sb-lead-name">
              <strong>
                ${escapeHtml(lead.full_name)}
              </strong>

              <span>
                ${escapeHtml(
                  lead.company_name ||
                  lead.email ||
                  lead.phone ||
                  "-"
                )}
              </span>

              <span class="sb-lead-code">
                ${escapeHtml(lead.lead_code)}
              </span>
            </div>
          </td>

          <td>
            ${escapeHtml(
              lead.service_interest || "-"
            )}
          </td>

          <td>
            <span
              class="sb-lead-status
                     ${escapeHtml(lead.status)}"
            >
              ${escapeHtml(
                statusLabel(lead.status)
              )}
            </span>
          </td>

          <td>
            ${escapeHtml(
              formatDate(
                lead.next_follow_up_at
              )
            )}
          </td>

          <td>
            ${Number(lead.note_count || 0)}
          </td>

          <td>
            ${escapeHtml(
              formatDate(lead.updated_at)
            )}
          </td>

          <td>
            <button
              class="secondary"
              type="button"
              data-lead-open="${escapeHtml(lead.id)}"
            >
              Detail
            </button>
          </td>
        </tr>
      `).join("");
  }

  async function loadLeads(
    silent = false
  ) {
    try {
      const result =
        await api(API);

      leads =
        Array.isArray(result.leads)
          ? result.leads
          : [];

      render();
    } catch (error) {
      if (
        silent &&
        error.status === 401
      ) {
        return;
      }

      body.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="sb-leads-empty">
              Gagal memuat Leads:
              ${escapeHtml(error.message)}
            </div>
          </td>
        </tr>
      `;
    }
  }

  function setFormDisabled(
    disabled
  ) {
    [
      ...form.querySelectorAll(
        "input, select, textarea"
      )
    ].forEach(element => {
      if (
        element.matches(
          "[data-lead-note-text]"
        )
      ) {
        return;
      }

      element.disabled = disabled;
    });

    saveButton.hidden = disabled;
  }

  function openCreate() {
    currentLeadId = null;

    form.reset();

    form.elements.status.value = "new";

    title.textContent = "New Lead";

    subtitle.textContent =
      "Tambahkan calon client baru.";

    formError.textContent = "";

    convertedBox.classList.remove("show");
    convertedBox.textContent = "";

    notesSection.hidden = true;

    convertArea.classList.remove("show");

    setFormDisabled(false);

    modal.hidden = false;
  }

  async function loadNotes(leadId) {
    noteList.innerHTML =
      '<div class="sb-leads-note-empty">Memuat catatan...</div>';

    try {
      const result =
        await api(
          `${API}/${encodeURIComponent(leadId)}/notes`
        );

      const notes =
        Array.isArray(result.notes)
          ? result.notes
          : [];

      if (!notes.length) {
        noteList.innerHTML =
          '<div class="sb-leads-note-empty">Belum ada catatan.</div>';

        return;
      }

      noteList.innerHTML =
        notes.map(note => `
          <div class="sb-leads-note">
            <p>
              ${escapeHtml(note.note)}
            </p>

            <small>
              ${escapeHtml(
                note.user_name ||
                note.user_email ||
                "Admin"
              )}
              -
              ${escapeHtml(
                formatDate(note.created_at)
              )}
            </small>
          </div>
        `).join("");
    } catch (error) {
      noteList.innerHTML = `
        <div class="sb-leads-note-empty">
          Gagal memuat catatan:
          ${escapeHtml(error.message)}
        </div>
      `;
    }
  }

  async function openEdit(id) {
    const lead =
      leads.find(item => item.id === id);

    if (!lead) return;

    currentLeadId = lead.id;

    form.reset();

    title.textContent =
      lead.full_name;

    subtitle.textContent =
      `${lead.lead_code} - ${statusLabel(lead.status)}`;

    form.elements.full_name.value =
      lead.full_name || "";

    form.elements.company_name.value =
      lead.company_name || "";

    form.elements.email.value =
      lead.email || "";

    form.elements.phone.value =
      lead.phone || "";

    form.elements.source.value =
      lead.source || "";

    form.elements.service_interest.value =
      lead.service_interest || "";

    form.elements.message.value =
      lead.message || "";

    form.elements.next_follow_up_at.value =
      toDatetimeLocal(
        lead.next_follow_up_at
      );

    formError.textContent = "";

    notesSection.hidden = false;

    const converted =
      lead.status === "converted";

    if (converted) {
      form.elements.status.value =
        "qualified";

      convertedBox.textContent =
        lead.converted_client_code
          ? `Converted to ${lead.converted_client_code}`
          : "Lead sudah dikonversi menjadi Client.";

      convertedBox.classList.add("show");

      convertArea.classList.remove("show");

      setFormDisabled(true);

      noteText.disabled = true;

      noteCompose.style.display =
        "none";
    } else {
      form.elements.status.value =
        lead.status;

      convertedBox.classList.remove("show");

      convertedBox.textContent = "";

      setFormDisabled(false);

      noteText.disabled = false;

      noteCompose.style.display = "";

      if (
        lead.status === "qualified"
      ) {
        convertArea.classList.add("show");
      } else {
        convertArea.classList.remove("show");
      }
    }

    modal.hidden = false;

    await loadNotes(lead.id);
  }

  function closeModal() {
    modal.hidden = true;
    currentLeadId = null;
    formError.textContent = "";
  }

  form.addEventListener(
    "submit",
    async event => {
      event.preventDefault();

      formError.textContent = "";

      const data =
        new FormData(form);

      const payload = {
        full_name:
          String(
            data.get("full_name") || ""
          ).trim(),

        company_name:
          String(
            data.get("company_name") || ""
          ).trim() || null,

        email:
          String(
            data.get("email") || ""
          ).trim() || null,

        phone:
          String(
            data.get("phone") || ""
          ).trim() || null,

        source:
          String(
            data.get("source") || ""
          ).trim() || null,

        service_interest:
          String(
            data.get("service_interest") || ""
          ).trim() || null,

        message:
          String(
            data.get("message") || ""
          ).trim() || null,

        status:
          String(
            data.get("status") || "new"
          ),

        next_follow_up_at:
          String(
            data.get(
              "next_follow_up_at"
            ) || ""
          ).trim() || null
      };

      if (
        !payload.email &&
        !payload.phone
      ) {
        formError.textContent =
          "Isi minimal Email atau Phone.";

        return;
      }

      try {
        saveButton.disabled = true;

        if (currentLeadId) {
          await api(
            `${API}/${encodeURIComponent(currentLeadId)}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body:
                JSON.stringify(payload)
            }
          );

          showNotice(
            "Lead berhasil diperbarui."
          );
        } else {
          await api(
            API,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body:
                JSON.stringify(payload)
            }
          );

          showNotice(
            "Lead baru berhasil dibuat."
          );
        }

        closeModal();

        await loadLeads();
      } catch (error) {
        formError.textContent =
          error.message;
      } finally {
        saveButton.disabled = false;
      }
    }
  );

  async function addNote() {
    if (!currentLeadId) return;

    const note =
      String(noteText.value || "")
        .trim();

    if (!note) return;

    try {
      await api(
        `${API}/${encodeURIComponent(currentLeadId)}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            note
          })
        }
      );

      noteText.value = "";

      await Promise.all([
        loadNotes(currentLeadId),
        loadLeads()
      ]);

      showNotice(
        "Catatan lead berhasil ditambahkan."
      );
    } catch (error) {
      formError.textContent =
        error.message;
    }
  }

  const convertForm =
    convertModal.querySelector(
      "[data-convert-form]"
    );

  const convertError =
    convertModal.querySelector(
      "[data-convert-error]"
    );

  const convertLabel =
    convertModal.querySelector(
      "[data-convert-lead-label]"
    );

  function openConvert() {
    const lead =
      leads.find(
        item =>
          item.id === currentLeadId
      );

    if (
      !lead ||
      lead.status !== "qualified"
    ) {
      return;
    }

    convertForm.reset();

    convertError.textContent = "";

    convertLabel.textContent =
      `${lead.lead_code} - ${lead.full_name}`;

    convertModal.hidden = false;
  }

  function closeConvert() {
    convertModal.hidden = true;
    convertError.textContent = "";
  }

  convertForm.addEventListener(
    "submit",
    async event => {
      event.preventDefault();

      if (!currentLeadId) return;

      const password =
        String(
          new FormData(
            convertForm
          ).get(
            "temporary_password"
          ) || ""
        );

      convertError.textContent = "";

      try {
        const result =
          await api(
            `${API}/${encodeURIComponent(currentLeadId)}/convert`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body:
                JSON.stringify({
                  temporary_password:
                    password
                })
            }
          );

        closeConvert();
        closeModal();

        await loadLeads();

        showNotice(
          result.client?.client_code
            ? `Lead dikonversi menjadi ${result.client.client_code}.`
            : "Lead berhasil dikonversi menjadi Client."
        );
      } catch (error) {
        convertError.textContent =
          error.message;
      }
    }
  );

  view.addEventListener(
    "click",
    event => {
      const open =
        event.target.closest(
          "[data-lead-open]"
        );

      if (open) {
        event.stopPropagation();

        openEdit(
          open.dataset.leadOpen
        );

        return;
      }

      const row =
        event.target.closest(
          "[data-lead-row]"
        );

      if (row) {
        openEdit(
          row.dataset.leadRow
        );
      }
    }
  );

  view.querySelector(
    "[data-leads-new]"
  ).addEventListener(
    "click",
    openCreate
  );

  view.querySelector(
    "[data-leads-refresh]"
  ).addEventListener(
    "click",
    () => loadLeads()
  );

  search.addEventListener(
    "input",
    render
  );

  filter.addEventListener(
    "change",
    render
  );

  modal.querySelector(
    "[data-lead-close]"
  ).addEventListener(
    "click",
    closeModal
  );

  modal.querySelector(
    "[data-lead-cancel]"
  ).addEventListener(
    "click",
    closeModal
  );

  modal.querySelector(
    "[data-lead-note-add]"
  ).addEventListener(
    "click",
    addNote
  );

  modal.querySelector(
    "[data-lead-convert]"
  ).addEventListener(
    "click",
    openConvert
  );

  convertModal.querySelector(
    "[data-convert-close]"
  ).addEventListener(
    "click",
    closeConvert
  );

  convertModal.querySelector(
    "[data-convert-cancel]"
  ).addEventListener(
    "click",
    closeConvert
  );

  modal.addEventListener(
    "click",
    event => {
      if (event.target === modal) {
        closeModal();
      }
    }
  );

  convertModal.addEventListener(
    "click",
    event => {
      if (
        event.target === convertModal
      ) {
        closeConvert();
      }
    }
  );

  /* SB_LEADS_NAV_ACTIVE */
  function setLeadsNavigationActive() {
    const links = [
      ...document.querySelectorAll(
        ".nav a, .mobile-nav a"
      )
    ];

    links.forEach(link => {
      link.classList.remove("active");
    });

    links
      .filter(
        link =>
          String(link.textContent || "")
            .trim()
            .toLowerCase() === "leads"
      )
      .forEach(link => {
        link.classList.add("active");
      });
  }

  const observer =
    new MutationObserver(() => {
      if (!view.hidden) {
        setLeadsNavigationActive();
        loadLeads();
      }
    });

  observer.observe(
    view,
    {
      attributes: true,
      attributeFilter: ["hidden"]
    }
  );

  /*
   * Sinkronkan kartu Dashboard tanpa
   * membuat error saat session belum siap.
   */
  setTimeout(
    async () => {
      try {
        const me =
          await fetch(
            "/api/auth/me",
            {
              headers: {
                Accept:
                  "application/json"
              }
            }
          );

        if (me.ok) {
          await loadLeads(true);
        }
      } catch {
        // silent warm-up
      }
    },
    900
  );
})();