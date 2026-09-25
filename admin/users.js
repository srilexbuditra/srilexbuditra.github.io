(() => {
  "use strict";

  const API = "/api/admin/users";

  let loadedOnce = false;
  let loading = false;
  let users = [];

  const content = document.querySelector("main.content");
  if (!content) return;

  const style = document.createElement("style");
  style.textContent = `
    .sb-users-view{
      display:grid;
      gap:20px;
    }
    .sb-users-head{
      display:flex;
      justify-content:space-between;
      gap:16px;
      align-items:flex-start;
      flex-wrap:wrap;
    }
    .sb-users-head h1{
      margin:6px 0 8px;
      font-size:clamp(28px,4vw,42px);
      line-height:1.05;
    }
    .sb-users-kicker{
      font-size:12px;
      font-weight:800;
      letter-spacing:.16em;
      text-transform:uppercase;
      color:#087a4d;
    }
    .sb-users-muted{
      color:#64748b;
      margin:0;
    }
    .sb-users-actions{
      display:flex;
      gap:10px;
      flex-wrap:wrap;
    }
    .sb-users-btn{
      border:1px solid #d8e1dc;
      background:#fff;
      color:#10231b;
      border-radius:14px;
      padding:11px 16px;
      font:inherit;
      font-weight:800;
      cursor:pointer;
    }
    .sb-users-btn.primary{
      background:#0b9560;
      color:#fff;
      border-color:#0b9560;
    }
    .sb-users-btn.danger{
      color:#b42318;
      border-color:#f0c7c3;
    }
    .sb-users-btn:disabled{
      opacity:.45;
      cursor:not-allowed;
    }
    .sb-users-stats{
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:14px;
    }
    .sb-users-stat,
    .sb-users-card{
      background:#fff;
      border:1px solid #e2e8e5;
      border-radius:18px;
    }
    .sb-users-stat{
      padding:20px;
    }
    .sb-users-stat span{
      display:block;
      color:#64748b;
      font-size:13px;
      font-weight:700;
      margin-bottom:8px;
    }
    .sb-users-stat strong{
      font-size:30px;
    }
    .sb-users-card{
      overflow:hidden;
    }
    .sb-users-toolbar{
      display:grid;
      grid-template-columns:1fr 210px;
      gap:12px;
      padding:18px;
      border-bottom:1px solid #e2e8e5;
    }
    .sb-users-toolbar input,
    .sb-users-toolbar select,
    .sb-users-form input{
      width:100%;
      box-sizing:border-box;
      border:1px solid #d8e1dc;
      border-radius:13px;
      padding:12px 14px;
      font:inherit;
      background:#fff;
    }
    .sb-users-table-wrap{
      overflow:auto;
    }
    .sb-users-table{
      width:100%;
      border-collapse:collapse;
      min-width:940px;
    }
    .sb-users-table th,
    .sb-users-table td{
      padding:14px 16px;
      border-bottom:1px solid #edf1ef;
      text-align:left;
      vertical-align:top;
    }
    .sb-users-table th{
      font-size:12px;
      color:#64748b;
      text-transform:uppercase;
      letter-spacing:.06em;
    }
    .sb-users-user strong,
    .sb-users-user span{
      display:block;
    }
    .sb-users-user span{
      color:#64748b;
      font-size:13px;
      margin-top:3px;
    }
    .sb-users-badge{
      display:inline-flex;
      align-items:center;
      border-radius:999px;
      padding:6px 10px;
      font-size:12px;
      font-weight:800;
      white-space:nowrap;
      background:#eef4f1;
      color:#315247;
    }
    .sb-users-badge.active{
      background:#e9f8f1;
      color:#087a4d;
    }
    .sb-users-badge.suspended,
    .sb-users-badge.disabled{
      background:#fff1f0;
      color:#b42318;
    }
    .sb-users-badge.password{
      background:#fff8e6;
      color:#8a5a00;
    }
    .sb-users-row-actions{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
    }
    .sb-users-empty{
      padding:32px 18px;
      text-align:center;
      color:#64748b;
    }
    .sb-users-dialog{
      position:fixed;
      inset:0;
      z-index:10000;
      display:grid;
      place-items:center;
      padding:20px;
      background:rgba(6,25,18,.62);
    }
    .sb-users-dialog[hidden]{
      display:none;
    }
    .sb-users-dialog-card{
      width:min(520px,100%);
      max-height:90vh;
      overflow:auto;
      background:#fff;
      border-radius:20px;
      padding:22px;
      box-shadow:0 24px 70px rgba(0,0,0,.24);
    }
    .sb-users-dialog-card h2{
      margin:0 0 8px;
    }
    .sb-users-form{
      display:grid;
      gap:14px;
      margin-top:18px;
    }
    .sb-users-form label{
      display:grid;
      gap:6px;
      font-weight:700;
    }
    .sb-users-form-actions{
      display:flex;
      justify-content:flex-end;
      gap:10px;
      margin-top:6px;
    }
    .sb-users-message{
      min-height:20px;
      font-size:13px;
      color:#b42318;
    }
    @media (max-width:900px){
      .sb-users-stats{
        grid-template-columns:repeat(2,minmax(0,1fr));
      }
      .sb-users-toolbar{
        grid-template-columns:1fr;
      }
    }
    @media (max-width:560px){
      .sb-users-stats{
        grid-template-columns:1fr 1fr;
      }
      .sb-users-head{
        display:grid;
      }
      .sb-users-actions{
        display:grid;
        grid-template-columns:1fr 1fr;
      }
      .sb-users-btn{
        width:100%;
      }
    }
  `;
  document.head.appendChild(style);

  const view = document.createElement("section");
  view.className = "sb-users-view";
  view.dataset.sbView = "users";
  view.hidden = true;

  view.innerHTML = `
    <div class="sb-users-head">
      <div>
        <div class="sb-users-kicker">Access Control • R1</div>
        <h1>Users & Roles</h1>
        <p class="sb-users-muted">
          Kelola akun Staff dan lihat akses pengguna. Client tetap dikelola melalui modul Clients.
        </p>
      </div>
      <div class="sb-users-actions">
        <button class="sb-users-btn" data-users-refresh>Refresh</button>
        <button class="sb-users-btn primary" data-users-add>+ Tambah Staff</button>
      </div>
    </div>

    <div class="sb-users-stats">
      <article class="sb-users-stat">
        <span>Total users</span>
        <strong data-users-total>0</strong>
      </article>
      <article class="sb-users-stat">
        <span>Staff</span>
        <strong data-users-staff>0</strong>
      </article>
      <article class="sb-users-stat">
        <span>Clients</span>
        <strong data-users-clients>0</strong>
      </article>
      <article class="sb-users-stat">
        <span>Wajib ganti password</span>
        <strong data-users-password>0</strong>
      </article>
    </div>

    <article class="sb-users-card">
      <div class="sb-users-toolbar">
        <input
          type="search"
          placeholder="Cari nama atau email..."
          data-users-search
        >
        <select data-users-role>
          <option value="">Semua role</option>
          <option value="system_admin">System Admin</option>
          <option value="staff">Staff</option>
          <option value="client">Client</option>
        </select>
      </div>

      <div class="sb-users-table-wrap">
        <table class="sb-users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Password</th>
              <th>Client</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody data-users-body></tbody>
        </table>
      </div>

      <div class="sb-users-empty" data-users-empty hidden>
        Tidak ada user yang cocok.
      </div>
    </article>
  `;

  content.appendChild(view);

  const dialog = document.createElement("div");
  dialog.className = "sb-users-dialog";
  dialog.hidden = true;
  document.body.appendChild(dialog);

  const body = view.querySelector("[data-users-body]");
  const empty = view.querySelector("[data-users-empty]");
  const search = view.querySelector("[data-users-search]");
  const roleFilter = view.querySelector("[data-users-role]");

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function roleLabel(role) {
    if (role === "system_admin") return "System Admin";
    if (role === "staff") return "Staff";
    return "Client";
  }

  function renderStats() {
    view.querySelector("[data-users-total]").textContent =
      users.length;

    view.querySelector("[data-users-staff]").textContent =
      users.filter(u => u.role === "staff").length;

    view.querySelector("[data-users-clients]").textContent =
      users.filter(u => u.role === "client").length;

    view.querySelector("[data-users-password]").textContent =
      users.filter(u => u.must_change_password).length;
  }

  function render() {
    const term =
      search.value.trim().toLowerCase();

    const role =
      roleFilter.value;

    const filtered =
      users.filter(user => {
        const haystack =
          `${user.full_name || ""} ${user.email || ""}`
            .toLowerCase();

        return (
          (!term || haystack.includes(term)) &&
          (!role || user.role === role)
        );
      });

    body.innerHTML = "";

    for (const user of filtered) {
      const tr = document.createElement("tr");

      const currentId =
        window.SB_AUTH_USER?.id;

      const isSelf =
        user.id === currentId;

      let actionHtml = "";

      if (user.role === "staff") {
        const active =
          user.status === "active";

        actionHtml = `
          <div class="sb-users-row-actions">
            <button
              class="sb-users-btn"
              data-user-status="${esc(user.id)}"
              data-next-status="${active ? "suspended" : "active"}"
            >
              ${active ? "Suspend" : "Activate"}
            </button>

            <button
              class="sb-users-btn"
              data-user-reset="${esc(user.id)}"
              data-user-email="${esc(user.email)}"
            >
              Reset Password
            </button>
          </div>
        `;
      } else if (user.role === "client") {
        actionHtml =
          `<span class="sb-users-muted">Kelola melalui Clients</span>`;
      } else {
        actionHtml =
          `<span class="sb-users-muted">${isSelf ? "Akun Anda" : "System account"}</span>`;
      }

      tr.innerHTML = `
        <td>
          <div class="sb-users-user">
            <strong>${esc(user.full_name || "Tanpa nama")}</strong>
            <span>${esc(user.email)}</span>
          </div>
        </td>
        <td>
          <span class="sb-users-badge">
            ${esc(roleLabel(user.role))}
          </span>
        </td>
        <td>
          <span class="sb-users-badge ${esc(user.status)}">
            ${esc(user.status)}
          </span>
        </td>
        <td>
          ${
            user.must_change_password
              ? `<span class="sb-users-badge password">Wajib ganti</span>`
              : `<span class="sb-users-badge">Normal</span>`
          }
        </td>
        <td>
          ${
            user.client_code
              ? `<strong>${esc(user.client_code)}</strong><br><span class="sb-users-muted">${esc(user.company_name || "")}</span>`
              : `<span class="sb-users-muted">—</span>`
          }
        </td>
        <td>${actionHtml}</td>
      `;

      body.appendChild(tr);
    }

    empty.hidden =
      filtered.length !== 0;

    view.querySelector(".sb-users-table-wrap").hidden =
      filtered.length === 0;
  }

  async function api(path, options = {}) {
    const response = await fetch(path, {
      credentials: "same-origin",
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.headers || {})
      }
    });

    const data =
      await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.error || `HTTP ${response.status}`
      );
    }

    return data;
  }

  async function loadUsers(force = false) {
    if (loading) return;
    if (loadedOnce && !force) return;

    if (
      window.SB_AUTH_USER &&
      window.SB_AUTH_USER.role !== "system_admin"
    ) {
      return;
    }

    loading = true;

    try {
      const data = await api(API);
      users = Array.isArray(data.users)
        ? data.users
        : [];

      loadedOnce = true;

      renderStats();
      render();
    } catch (error) {
      body.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="sb-users-empty">
              ${esc(error.message || "Gagal memuat users.")}
            </div>
          </td>
        </tr>
      `;
    } finally {
      loading = false;
    }
  }

  function closeDialog() {
    dialog.hidden = true;
    dialog.innerHTML = "";
  }

  function showAddStaff() {
    dialog.innerHTML = `
      <div class="sb-users-dialog-card">
        <h2>Tambah Staff</h2>
        <p class="sb-users-muted">
          Staff baru wajib mengganti password sementara saat login pertama.
        </p>

        <form class="sb-users-form" data-staff-form>
          <label>
            Nama lengkap
            <input name="full_name" required>
          </label>

          <label>
            Email
            <input name="email" type="email" required>
          </label>

          <label>
            Password sementara
            <input
              name="temporary_password"
              type="password"
              minlength="12"
              required
            >
          </label>

          <div class="sb-users-message" data-form-message></div>

          <div class="sb-users-form-actions">
            <button type="button" class="sb-users-btn" data-dialog-close>
              Batal
            </button>
            <button type="submit" class="sb-users-btn primary">
              Buat Staff
            </button>
          </div>
        </form>
      </div>
    `;

    dialog.hidden = false;

    const form =
      dialog.querySelector("[data-staff-form]");

    const message =
      dialog.querySelector("[data-form-message]");

    dialog
      .querySelector("[data-dialog-close]")
      .addEventListener("click", closeDialog);

    form.addEventListener("submit", async event => {
      event.preventDefault();

      const submit =
        form.querySelector('button[type="submit"]');

      submit.disabled = true;
      message.textContent = "";

      const formData = new FormData(form);

      try {
        await api("/api/admin/users/staff", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            full_name: formData.get("full_name"),
            email: formData.get("email"),
            temporary_password:
              formData.get("temporary_password")
          })
        });

        closeDialog();
        loadedOnce = false;
        await loadUsers(true);
      } catch (error) {
        message.textContent =
          error.message || "Gagal membuat Staff.";
        submit.disabled = false;
      }
    });
  }

  function showResetPassword(userId, email) {
    dialog.innerHTML = `
      <div class="sb-users-dialog-card">
        <h2>Reset Password</h2>
        <p class="sb-users-muted">
          ${esc(email)}
        </p>

        <form class="sb-users-form" data-reset-form>
          <label>
            Password sementara baru
            <input
              name="temporary_password"
              type="password"
              minlength="12"
              required
            >
          </label>

          <div class="sb-users-message" data-form-message></div>

          <div class="sb-users-form-actions">
            <button type="button" class="sb-users-btn" data-dialog-close>
              Batal
            </button>
            <button type="submit" class="sb-users-btn primary">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    `;

    dialog.hidden = false;

    const form =
      dialog.querySelector("[data-reset-form]");

    const message =
      dialog.querySelector("[data-form-message]");

    dialog
      .querySelector("[data-dialog-close]")
      .addEventListener("click", closeDialog);

    form.addEventListener("submit", async event => {
      event.preventDefault();

      const submit =
        form.querySelector('button[type="submit"]');

      submit.disabled = true;
      message.textContent = "";

      const formData = new FormData(form);

      try {
        await api(
          `/api/admin/users/${encodeURIComponent(userId)}/reset-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              temporary_password:
                formData.get("temporary_password")
            })
          }
        );

        closeDialog();
        loadedOnce = false;
        await loadUsers(true);
      } catch (error) {
        message.textContent =
          error.message || "Gagal reset password.";
        submit.disabled = false;
      }
    });
  }

  view
    .querySelector("[data-users-refresh]")
    .addEventListener("click", () => {
      loadUsers(true);
    });

  view
    .querySelector("[data-users-add]")
    .addEventListener("click", showAddStaff);

  search.addEventListener("input", render);
  roleFilter.addEventListener("change", render);

  body.addEventListener("click", async event => {
    const statusButton =
      event.target.closest("[data-user-status]");

    if (statusButton) {
      const userId =
        statusButton.dataset.userStatus;

      const nextStatus =
        statusButton.dataset.nextStatus;

      if (
        !confirm(
          `${nextStatus === "active" ? "Aktifkan" : "Suspend"} akun Staff ini?`
        )
      ) {
        return;
      }

      statusButton.disabled = true;

      try {
        await api(
          `/api/admin/users/${encodeURIComponent(userId)}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              status: nextStatus
            })
          }
        );

        loadedOnce = false;
        await loadUsers(true);
      } catch (error) {
        alert(error.message || "Gagal mengubah status.");
        statusButton.disabled = false;
      }

      return;
    }

    const resetButton =
      event.target.closest("[data-user-reset]");

    if (resetButton) {
      showResetPassword(
        resetButton.dataset.userReset,
        resetButton.dataset.userEmail
      );
    }
  });

  dialog.addEventListener("click", event => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  const observer =
    new MutationObserver(() => {
      if (!view.hidden) {
        loadUsers();
      }
    });

  observer.observe(view, {
    attributes: true,
    attributeFilter: ["hidden"]
  });
})();