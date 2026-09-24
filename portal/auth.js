(() => {
  "use strict";

  const API_BASE = "/api";

  let currentUser = null;
  let overlay = null;
  let loginPanel = null;
  let passwordPanel = null;
  let loginMessage = null;
  let passwordMessage = null;

  function api(path, options = {}) {
    return fetch(`${API_BASE}${path}`, {
      credentials: "same-origin",
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.headers || {})
      }
    });
  }

  async function readJson(response) {
    try {
      return await response.json();
    } catch {
      return {};
    }
  }

  function addStyles() {
    if (document.getElementById("sb-portal-auth-styles")) return;

    const style = document.createElement("style");
    style.id = "sb-portal-auth-styles";

    style.textContent = `
      .sb-portal-auth-overlay {
        position: fixed;
        inset: 0;
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background:
          radial-gradient(circle at top left, rgba(22,163,74,.18), transparent 38%),
          #07110c;
        color: #f8fafc;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .sb-portal-auth-overlay[hidden],
      .sb-portal-auth-panel[hidden] {
        display: none !important;
      }

      .sb-portal-auth-card {
        width: min(100%, 430px);
        background: rgba(15,23,20,.97);
        border: 1px solid rgba(255,255,255,.10);
        border-radius: 22px;
        padding: 30px;
        box-shadow: 0 24px 70px rgba(0,0,0,.38);
      }

      .sb-portal-auth-brand {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 24px;
      }

      .sb-portal-auth-brand img {
        width: 52px;
        height: 52px;
        object-fit: contain;
        border-radius: 12px;
      }

      .sb-portal-auth-brand strong {
        display: block;
        font-size: 18px;
        letter-spacing: .04em;
      }

      .sb-portal-auth-brand span {
        display: block;
        margin-top: 3px;
        color: #94a3b8;
        font-size: 13px;
      }

      .sb-portal-auth-card h1 {
        margin: 0 0 8px;
        font-size: 25px;
      }

      .sb-portal-auth-card p {
        margin: 0 0 22px;
        color: #94a3b8;
        font-size: 14px;
        line-height: 1.6;
      }

      .sb-portal-auth-field {
        margin-bottom: 16px;
      }

      .sb-portal-auth-field label {
        display: block;
        margin-bottom: 7px;
        font-size: 13px;
        font-weight: 700;
      }

      .sb-portal-auth-field input {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid rgba(255,255,255,.14);
        border-radius: 12px;
        padding: 13px 14px;
        background: #0b1510;
        color: #fff;
        outline: none;
        font: inherit;
      }

      .sb-portal-auth-field input:focus {
        border-color: #22c55e;
        box-shadow: 0 0 0 3px rgba(34,197,94,.12);
      }

      .sb-portal-auth-submit {
        width: 100%;
        border: 0;
        border-radius: 12px;
        padding: 13px 16px;
        background: #16a34a;
        color: white;
        font: inherit;
        font-weight: 800;
        cursor: pointer;
      }

      .sb-portal-auth-submit:disabled {
        opacity: .65;
        cursor: wait;
      }

      .sb-portal-auth-message {
        min-height: 20px;
        margin-top: 14px;
        color: #fca5a5;
        font-size: 13px;
        line-height: 1.5;
      }

      .sb-portal-auth-note {
        margin-top: 18px;
        padding-top: 16px;
        border-top: 1px solid rgba(255,255,255,.08);
        color: #64748b;
        font-size: 12px;
        line-height: 1.55;
      }

      .sb-portal-logout {
        border: 1px solid rgba(15,23,42,.14);
        border-radius: 9px;
        padding: 8px 12px;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
      }
    `;

    document.head.appendChild(style);
  }

  function buildOverlay() {
    addStyles();

    overlay = document.createElement("div");
    overlay.className = "sb-portal-auth-overlay";

    const card = document.createElement("div");
    card.className = "sb-portal-auth-card";

    card.innerHTML = `
      <div class="sb-portal-auth-brand">
        <img src="https://srilexbuditra.work/images/logo.avif" alt="Logo Srilex Buditra">
        <div>
          <strong>SRILEX BUDITRA</strong>
          <span>Client Portal &bull; R1</span>
        </div>
      </div>

      <section class="sb-portal-auth-panel" data-login-panel>
        <h1>Login Client</h1>
        <p>Masuk menggunakan akun client yang diberikan oleh administrator.</p>

        <form data-login-form>
          <div class="sb-portal-auth-field">
            <label for="sb-client-login-email">Email</label>
            <input
              id="sb-client-login-email"
              name="email"
              type="email"
              autocomplete="username"
              required
            >
          </div>

          <div class="sb-portal-auth-field">
            <label for="sb-client-login-password">Password</label>
            <input
              id="sb-client-login-password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
            >
          </div>

          <button class="sb-portal-auth-submit" type="submit">
            Masuk ke Client Portal
          </button>

          <div class="sb-portal-auth-message" data-login-message role="alert"></div>
        </form>

        <div class="sb-portal-auth-note">
          Sesi menggunakan cookie aman HttpOnly. Password tidak disimpan di browser.
        </div>
      </section>

      <section class="sb-portal-auth-panel" data-password-panel hidden>
        <h1>Ganti Password Awal</h1>
        <p>
          Untuk keamanan akun, buat password baru sebelum menggunakan Client Portal.
        </p>

        <form data-password-form>
          <div class="sb-portal-auth-field">
            <label for="sb-current-password">Password sementara</label>
            <input
              id="sb-current-password"
              name="current_password"
              type="password"
              autocomplete="current-password"
              required
            >
          </div>

          <div class="sb-portal-auth-field">
            <label for="sb-new-password">Password baru</label>
            <input
              id="sb-new-password"
              name="new_password"
              type="password"
              minlength="12"
              maxlength="128"
              autocomplete="new-password"
              required
            >
          </div>

          <div class="sb-portal-auth-field">
            <label for="sb-confirm-password">Ulangi password baru</label>
            <input
              id="sb-confirm-password"
              name="confirm_password"
              type="password"
              minlength="12"
              maxlength="128"
              autocomplete="new-password"
              required
            >
          </div>

          <button class="sb-portal-auth-submit" type="submit">
            Simpan Password Baru
          </button>

          <div class="sb-portal-auth-message" data-password-message role="alert"></div>
        </form>

        <div class="sb-portal-auth-note">
          Password baru minimal 12 karakter. Setelah berhasil, Anda akan langsung masuk ke dashboard.
        </div>
      </section>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    loginPanel = card.querySelector("[data-login-panel]");
    passwordPanel = card.querySelector("[data-password-panel]");
    loginMessage = card.querySelector("[data-login-message]");
    passwordMessage = card.querySelector("[data-password-message]");

    card
      .querySelector("[data-login-form]")
      .addEventListener("submit", handleLogin);

    card
      .querySelector("[data-password-form]")
      .addEventListener("submit", handlePasswordChange);
  }

  function showLogin(message = "") {
    if (!overlay) buildOverlay();

    overlay.hidden = false;
    loginPanel.hidden = false;
    passwordPanel.hidden = true;

    if (loginMessage) loginMessage.textContent = message;

    const password = overlay.querySelector("#sb-client-login-password");
    if (password) password.value = "";
  }

  function showPasswordChange(user) {
    if (!overlay) buildOverlay();

    overlay.hidden = false;
    loginPanel.hidden = true;
    passwordPanel.hidden = false;

    if (passwordMessage) {
      passwordMessage.textContent = "";
    }

    currentUser = user;
  }

  function hideOverlay() {
    if (overlay) overlay.hidden = true;
  }

  function initials(name) {
    const parts = String(name || "Client")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "CL";
  }

  function installUser(user) {
    const profile = document.querySelector(".profile");

    if (profile) {
      const avatar = profile.querySelector(".avatar");
      const strong = profile.querySelector(".profile-copy strong");
      const role = profile.querySelector(".profile-copy span");

      if (avatar) avatar.textContent = initials(user.full_name);
      if (strong) strong.textContent = user.full_name || user.email || "Client";
      if (role) role.textContent = user.client_code || "Client";
    }

    const heading = document.querySelector(".page-head h1");
    if (heading && user.full_name) {
      const firstName = user.full_name.trim().split(/\s+/)[0];
      heading.textContent = `Selamat datang, ${firstName}`;
    }

    const topActions = document.querySelector(".top-actions");

    if (topActions && !document.getElementById("sb-portal-logout")) {
      const logout = document.createElement("button");
      logout.id = "sb-portal-logout";
      logout.className = "sb-portal-logout";
      logout.type = "button";
      logout.textContent = "Logout";
      logout.addEventListener("click", handleLogout);
      topActions.appendChild(logout);
    }
  }

  function enterPortal(user) {
    currentUser = user;
    window.SB_PORTAL_USER = user;

    installUser(user);
    hideOverlay();

    window.dispatchEvent(
      new CustomEvent("sb:portal-authenticated", {
        detail: { user }
      })
    );
  }

  async function handleLogin(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const submit = form.querySelector("button[type='submit']");
    const data = new FormData(form);

    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");

    loginMessage.textContent = "";
    submit.disabled = true;
    submit.textContent = "Memeriksa akun...";

    try {
      const response = await api("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const result = await readJson(response);

      if (!response.ok || !result.user) {
        throw new Error(result.error || "Login gagal.");
      }

      if (result.user.role !== "client") {
        await api("/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: "{}"
        });

        throw new Error("Akun ini bukan akun Client Portal.");
      }

      currentUser = result.user;

      if (result.user.must_change_password) {
        showPasswordChange(result.user);
        return;
      }

      enterPortal(result.user);
    } catch (error) {
      showLogin(
        error instanceof Error
          ? error.message
          : "Tidak dapat masuk. Silakan coba kembali."
      );
    } finally {
      submit.disabled = false;
      submit.textContent = "Masuk ke Client Portal";
    }
  }

  async function handlePasswordChange(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const submit = form.querySelector("button[type='submit']");
    const data = new FormData(form);

    const currentPassword = String(data.get("current_password") || "");
    const newPassword = String(data.get("new_password") || "");
    const confirmPassword = String(data.get("confirm_password") || "");

    passwordMessage.textContent = "";

    if (newPassword.length < 12) {
      passwordMessage.textContent = "Password baru minimal 12 karakter.";
      return;
    }

    if (newPassword !== confirmPassword) {
      passwordMessage.textContent = "Konfirmasi password baru tidak sama.";
      return;
    }

    if (currentPassword === newPassword) {
      passwordMessage.textContent =
        "Password baru harus berbeda dari password sementara.";
      return;
    }

    submit.disabled = true;
    submit.textContent = "Menyimpan...";

    try {
      const response = await api("/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      const result = await readJson(response);

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Password belum dapat diubah.");
      }

      const meResponse = await api("/auth/me", {
        cache: "no-store"
      });

      const me = await readJson(meResponse);

      if (
        !meResponse.ok ||
        !me.user ||
        me.user.role !== "client" ||
        me.user.must_change_password
      ) {
        throw new Error("Status akun belum dapat diverifikasi.");
      }

      form.reset();
      enterPortal(me.user);
    } catch (error) {
      passwordMessage.textContent =
        error instanceof Error
          ? error.message
          : "Password belum dapat diubah.";
    } finally {
      submit.disabled = false;
      submit.textContent = "Simpan Password Baru";
    }
  }

  async function handleLogout() {
    try {
      await api("/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: "{}"
      });
    } catch {
      // Layar login tetap ditampilkan bila jaringan bermasalah.
    }

    currentUser = null;
    window.SB_PORTAL_USER = null;

    document.getElementById("sb-portal-logout")?.remove();

    showLogin("Anda telah keluar dari Client Portal.");
  }

  async function checkSession() {
    showLogin();

    if (loginMessage) {
      loginMessage.textContent = "Memeriksa sesi...";
    }

    try {
      const response = await api("/auth/me", {
        cache: "no-store"
      });

      const data = await readJson(response);

      if (!response.ok || !data.user) {
        showLogin();
        return;
      }

      if (data.user.role !== "client") {
        showLogin(
          "Browser ini sedang memiliki sesi non-client. Gunakan akun client atau buka Client Portal melalui Incognito/Private."
        );
        return;
      }

      currentUser = data.user;

      if (data.user.must_change_password) {
        showPasswordChange(data.user);
        return;
      }

      enterPortal(data.user);
    } catch {
      showLogin("Tidak dapat terhubung ke layanan autentikasi.");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkSession, { once: true });
  } else {
    checkSession();
  }
})();