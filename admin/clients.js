(() => {
  "use strict";

  const API = "/api/admin/clients";

  const content = document.querySelector("main.content");
  if (!content) return;

  const dashboardNodes = [...content.children];

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function addStyles() {
    if (document.getElementById("sb-client-management-styles")) return;

    const style = document.createElement("style");
    style.id = "sb-client-management-styles";
    style.textContent = `
      .sb-client-view[hidden],
      .sb-client-modal[hidden] {
        display: none !important;
      }

      [data-sb-dashboard-hidden="1"] {
        display: none !important;
      }

      .sb-client-view {
        display: grid;
        gap: 22px;
      }

      .sb-client-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        flex-wrap: wrap;
      }

      .sb-client-head h1 {
        margin: 6px 0 6px;
      }

      .sb-client-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .sb-client-summary {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
      }

      .sb-client-summary .stat {
        min-height: 108px;
      }

      .sb-client-table .empty {
        padding: 30px 18px;
        text-align: center;
        color: #64748b;
      }

      .sb-client-table td,
      .sb-client-table th {
        vertical-align: middle;
      }

      .sb-client-name {
        display: grid;
        gap: 3px;
      }

      .sb-client-name span {
        color: #64748b;
        font-size: 12px;
      }

      .sb-client-notice {
        display: none;
        padding: 12px 14px;
        border-radius: 10px;
        background: #ecfdf5;
        color: #166534;
        font-size: 13px;
        font-weight: 700;
      }

      .sb-client-notice.show {
        display: block;
      }

      .sb-client-modal {
        position: fixed;
        inset: 0;
        z-index: 100000;
        display: grid;
        place-items: center;
        padding: 22px;
        background: rgba(2, 8, 6, .72);
        backdrop-filter: blur(6px);
      }

      .sb-client-modal-card {
        width: min(100%, 620px);
        max-height: calc(100vh - 44px);
        overflow: auto;
        background: #fff;
        color: #0f172a;
        border-radius: 20px;
        box-shadow: 0 24px 80px rgba(0,0,0,.35);
      }

      .sb-client-modal-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 22px 24px 16px;
        border-bottom: 1px solid #e2e8f0;
      }

      .sb-client-modal-head h2 {
        margin: 0 0 5px;
      }

      .sb-client-modal-head p {
        margin: 0;
        color: #64748b;
        font-size: 13px;
      }

      .sb-client-close {
        border: 0;
        background: #f1f5f9;
        width: 38px;
        height: 38px;
        border-radius: 10px;
        cursor: pointer;
        font-size: 20px;
      }

      .sb-client-form {
        padding: 22px 24px 24px;
      }

      .sb-client-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .sb-client-field {
        display: grid;
        gap: 7px;
      }

      .sb-client-field.full {
        grid-column: 1 / -1;
      }

      .sb-client-field label {
        font-size: 13px;
        font-weight: 800;
      }

      .sb-client-field input {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        padding: 12px 13px;
        font: inherit;
        outline: none;
      }

      .sb-client-field input:focus {
        border-color: #16a34a;
        box-shadow: 0 0 0 3px rgba(22,163,74,.12);
      }

      .sb-client-form-note {
        margin: 16px 0;
        padding: 12px 14px;
        border-radius: 10px;
        background: #f8fafc;
        color: #475569;
        font-size: 12px;
        line-height: 1.55;
      }

      .sb-client-form-error {
        min-height: 20px;
        margin: 10px 0;
        color: #b91c1c;
        font-size: 13px;
        font-weight: 700;
      }

      .sb-client-form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }

      @media (max-width: 720px) {
        .sb-client-summary,
        .sb-client-form-grid {
          grid-template-columns: 1fr;
        }

        .sb-client-field.full {
          grid-column: auto;
        }

        .sb-client-head,
        .sb-client-actions {
          width: 100%;
        }

        .sb-client-actions button {
          flex: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  addStyles();

  const view = document.createElement("section");
  view.className = "sb-client-view";
  view.hidden = true;

  view.innerHTML = `
    <div class="sb-client-head">
      <div>
        <div class="eyebrow"><span class="pulse"></span>Client Management • R1</div>
        <h1>Clients</h1>
        <p>Kelola akun client yang terhubung langsung ke database D1.</p>
      </div>

      <div class="sb-client-actions">
        <button class="secondary" type="button" data-client-dashboard>
          ← Dashboard
        </button>
        <button class="secondary" type="button" data-client-refresh>
          Refresh
        </button>
        <button class="primary" type="button" data-client-new>
          + Tambah Client
        </button>
      </div>
    </div>

    <div class="sb-client-notice" data-client-notice></div>

    <section class="sb-client-summary">
      <article class="stat">
        <div class="meta">Total clients</div>
        <div class="value" data-client-total>0</div>
        <div class="sub">Database D1</div>
      </article>

      <article class="stat">
        <div class="meta">Active clients</div>
        <div class="value" data-client-active>0</div>
        <div class="sub">Account aktif</div>
      </article>

      <article class="stat">
        <div class="meta">Password change</div>
        <div class="value" data-client-password>0</div>
        <div class="sub">Wajib ganti password</div>
      </article>
    </section>

    <article class="card sb-client-table">
      <div class="card-head">
        <div>
          <h2>Daftar Client</h2>
          <p>Data client aktif pada Client & Management Platform R1</p>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Perusahaan</th>
              <th>Email</th>
              <th>Telepon</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody data-client-rows></tbody>
        </table>
      </div>

      <div class="empty" data-client-empty hidden>
        Belum ada client. Klik “Tambah Client” untuk membuat client pertama.
      </div>
    </article>
  `;

  content.appendChild(view);

  const modal = document.createElement("div");
  modal.className = "sb-client-modal";
  modal.hidden = true;

  modal.innerHTML = `
    <div class="sb-client-modal-card" role="dialog" aria-modal="true" aria-labelledby="sb-client-modal-title">
      <div class="sb-client-modal-head">
        <div>
          <h2 id="sb-client-modal-title">Tambah Client</h2>
          <p>Akun client akan langsung dibuat pada database staging.</p>
        </div>
        <button class="sb-client-close" type="button" data-client-close aria-label="Tutup">×</button>
      </div>

      <form class="sb-client-form" data-client-form>
        <div class="sb-client-form-grid">
          <div class="sb-client-field full">
            <label for="sb-client-name">Nama lengkap *</label>
            <input id="sb-client-name" name="full_name" required autocomplete="name">
          </div>

          <div class="sb-client-field">
            <label for="sb-client-email">Email *</label>
            <input id="sb-client-email" name="email" type="email" required autocomplete="email">
          </div>

          <div class="sb-client-field">
            <label for="sb-client-phone">Telepon / WhatsApp</label>
            <input id="sb-client-phone" name="phone" autocomplete="tel">
          </div>

          <div class="sb-client-field full">
            <label for="sb-client-company">Perusahaan / Organisasi</label>
            <input id="sb-client-company" name="company_name" autocomplete="organization">
          </div>

          <div class="sb-client-field full">
            <label for="sb-client-password">Password sementara *</label>
            <input
              id="sb-client-password"
              name="temporary_password"
              type="password"
              minlength="12"
              maxlength="128"
              required
              autocomplete="new-password"
            >
          </div>
        </div>

        <div class="sb-client-form-note">
          Password sementara minimal 12 karakter. Client akan diwajibkan mengganti password setelah masuk.
          Pastikan password sementara disampaikan kepada client melalui kanal yang aman.
        </div>

        <div class="sb-client-form-error" data-client-error></div>

        <div class="sb-client-form-actions">
          <button class="secondary" type="button" data-client-cancel>Batal</button>
          <button class="primary" type="submit" data-client-submit>Simpan Client</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const rowsEl = view.querySelector("[data-client-rows]");
  const emptyEl = view.querySelector("[data-client-empty]");
  const totalEl = view.querySelector("[data-client-total]");
  const activeEl = view.querySelector("[data-client-active]");
  const passwordEl = view.querySelector("[data-client-password]");
  const noticeEl = view.querySelector("[data-client-notice]");

  const form = modal.querySelector("[data-client-form]");
  const formError = modal.querySelector("[data-client-error]");
  const submitButton = modal.querySelector("[data-client-submit]");

  function allNavLinks() {
    return [...document.querySelectorAll(".nav a, .mobile-nav a")];
  }

  function clientLinks() {
    return allNavLinks().filter(
      (a) => a.textContent.trim().toLowerCase() === "clients"
    );
  }

  function dashboardLinks() {
    return allNavLinks().filter((a) => {
      const value = a.textContent.trim().toLowerCase();
      return value === "dashboard" || value === "home";
    });
  }

  function setNavigation(active) {
    allNavLinks().forEach((a) => a.classList.remove("active"));

    const targets = active === "clients" ? clientLinks() : dashboardLinks();
    targets.forEach((a) => a.classList.add("active"));
  }

  function updateDashboardClientCount(clients) {
    const active = clients.filter((client) => client.status === "active").length;

    document.querySelectorAll(".stat").forEach((stat) => {
      const meta = stat.querySelector(".meta");
      const value = stat.querySelector(".value");

      if (
        meta &&
        value &&
        meta.textContent.trim().toLowerCase() === "active clients"
      ) {
        value.textContent = String(active);
      }
    });
  }

  function showDashboard() {
    dashboardNodes.forEach((node) => {
      node.removeAttribute("data-sb-dashboard-hidden");
    });

    view.hidden = true;
    setNavigation("dashboard");
  }

  async function showClients() {
    dashboardNodes.forEach((node) => {
      node.setAttribute("data-sb-dashboard-hidden", "1");
    });

    view.hidden = false;
    setNavigation("clients");
    await loadClients();
  }

  function openModal() {
    form.reset();
    formError.textContent = "";
    modal.hidden = false;

    window.setTimeout(() => {
      modal.querySelector("[name='full_name']")?.focus();
    }, 0);
  }

  function closeModal() {
    modal.hidden = true;
    formError.textContent = "";
  }

  function showNotice(message) {
    noticeEl.textContent = message;
    noticeEl.classList.add("show");

    window.setTimeout(() => {
      noticeEl.classList.remove("show");
    }, 4500);
  }

  function renderClients(clients) {
    rowsEl.innerHTML = "";

    const active = clients.filter((client) => client.status === "active").length;
    const passwordChange = clients.filter(
      (client) => Number(client.must_change_password) === 1
    ).length;

    totalEl.textContent = String(clients.length);
    activeEl.textContent = String(active);
    passwordEl.textContent = String(passwordChange);

    emptyEl.hidden = clients.length !== 0;

    clients.forEach((client) => {
      const tr = document.createElement("tr");

      const statusClass =
        client.status === "active" && client.account_status === "active"
          ? "green"
          : "warn";

      const statusLabel =
        client.status === "active" && client.account_status === "active"
          ? "Active"
          : "Inactive";

      tr.innerHTML = `
        <td>
          <div class="sb-client-name">
            <strong>${escapeHtml(client.full_name || "-")}</strong>
            <span>${escapeHtml(client.client_code || "-")}</span>
          </div>
        </td>
        <td>${escapeHtml(client.company_name || "-")}</td>
        <td>${escapeHtml(client.email || "-")}</td>
        <td>${escapeHtml(client.phone || "-")}</td>
        <td><span class="badge ${statusClass}">${statusLabel}</span></td>
      `;

      rowsEl.appendChild(tr);
    });

    updateDashboardClientCount(clients);
  }

  async function loadClients() {
    rowsEl.innerHTML = `
      <tr>
        <td colspan="5">Memuat data client...</td>
      </tr>
    `;
    emptyEl.hidden = true;

    try {
      const response = await fetch(API, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          Accept: "application/json"
        },
        cache: "no-store"
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      renderClients(Array.isArray(data.clients) ? data.clients : []);
    } catch (error) {
      rowsEl.innerHTML = `
        <tr>
          <td colspan="5">
            Gagal memuat client: ${escapeHtml(error.message || "Unknown error")}
          </td>
        </tr>
      `;
    }
  }

  async function createClient(event) {
    event.preventDefault();

    formError.textContent = "";
    submitButton.disabled = true;
    submitButton.textContent = "Menyimpan...";

    const fd = new FormData(form);

    const payload = {
      full_name: String(fd.get("full_name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      company_name: String(fd.get("company_name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      temporary_password: String(fd.get("temporary_password") || "")
    };

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

      if (!response.ok || !data.client) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      closeModal();
      await loadClients();

      showNotice(
        `Client ${data.client.client_code || ""} berhasil dibuat.`
      );
    } catch (error) {
      formError.textContent =
        error instanceof Error
          ? error.message
          : "Client belum dapat dibuat.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Simpan Client";
    }
  }

  clientLinks().forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showClients();
    });
  });

  dashboardLinks().forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showDashboard();
    });
  });

  document
    .querySelectorAll("button")
    .forEach((button) => {
      if (button.textContent.trim().toLowerCase() === "new client") {
        button.addEventListener("click", openModal);
      }
    });

  view.querySelector("[data-client-dashboard]")
    ?.addEventListener("click", showDashboard);

  view.querySelector("[data-client-refresh]")
    ?.addEventListener("click", loadClients);

  view.querySelector("[data-client-new]")
    ?.addEventListener("click", openModal);

  modal.querySelector("[data-client-close]")
    ?.addEventListener("click", closeModal);

  modal.querySelector("[data-client-cancel]")
    ?.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  form.addEventListener("submit", createClient);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  loadClients();
})();
