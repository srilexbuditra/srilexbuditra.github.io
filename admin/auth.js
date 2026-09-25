(() => {
  "use strict";

  const API_BASE = "/api";

  let currentUser = null;
  let authOverlay = null;
  let messageEl = null;
  let emailInput = null;
  let passwordInput = null;
  let submitButton = null;

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
    if (document.getElementById("sb-auth-styles")) return;

    const style = document.createElement("style");
    style.id = "sb-auth-styles";
    style.textContent = `
      .sb-auth-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background:
          radial-gradient(circle at top left, rgba(22,163,74,.16), transparent 38%),
          #07110c;
        color: #f8fafc;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .sb-auth-overlay[hidden] {
        display: none !important;
      }

      .sb-auth-card {
        width: min(100%, 420px);
        background: rgba(15, 23, 20, .96);
        border: 1px solid rgba(255,255,255,.10);
        border-radius: 22px;
        padding: 30px;
        box-shadow: 0 24px 70px rgba(0,0,0,.35);
      }

      .sb-auth-brand {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 24px;
      }

      .sb-auth-brand img {
        width: 52px;
        height: 52px;
        object-fit: contain;
        border-radius: 12px;
      }

      .sb-auth-brand strong {
        display: block;
        font-size: 18px;
        letter-spacing: .04em;
      }

      .sb-auth-brand span {
        display: block;
        margin-top: 3px;
        color: #94a3b8;
        font-size: 13px;
      }

      .sb-auth-card h1 {
        margin: 0 0 8px;
        font-size: 25px;
      }

      .sb-auth-card > p {
        margin: 0 0 24px;
        color: #94a3b8;
        line-height: 1.6;
        font-size: 14px;
      }

      .sb-auth-field {
        margin-bottom: 16px;
      }

      .sb-auth-field label {
        display: block;
        margin-bottom: 7px;
        font-size: 13px;
        font-weight: 700;
      }

      .sb-auth-field input {
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

      .sb-auth-field input:focus {
        border-color: #22c55e;
        box-shadow: 0 0 0 3px rgba(34,197,94,.12);
      }

      .sb-auth-submit {
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

      .sb-auth-submit:disabled {
        opacity: .65;
        cursor: wait;
      }

      .sb-auth-message {
        min-height: 20px;
        margin-top: 14px;
        color: #fca5a5;
        font-size: 13px;
        line-height: 1.45;
      }

      .sb-auth-security {
        margin-top: 18px;
        padding-top: 16px;
        border-top: 1px solid rgba(255,255,255,.08);
        color: #64748b;
        font-size: 12px;
        line-height: 1.5;
      }

      .sb-auth-user {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        margin-left: auto;
      }

      .sb-auth-user-name {
        font-size: 13px;
        font-weight: 700;
      }

      .sb-auth-logout {
        border: 1px solid rgba(15,23,42,.15);
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

  function buildLogin() {
    addStyles();

    authOverlay = document.createElement("div");
    authOverlay.className = "sb-auth-overlay";

    const card = document.createElement("div");
    card.className = "sb-auth-card";

    card.innerHTML = `
      <div class="sb-auth-brand">
        <img src="/images/logo.avif" alt="Logo Srilex Buditra">
        <div>
          <strong>SRILEX BUDITRA</strong>
          <span>Management Console &bull; R1</span>
        </div>
      </div>

      <h1>Login Administrator</h1>
      <p>Masuk menggunakan akun administrator untuk mengakses Management Console.</p>

      <form id="sb-auth-form">
        <div class="sb-auth-field">
          <label for="sb-auth-email">Email</label>
          <input
            id="sb-auth-email"
            type="email"
            autocomplete="username"
            required
          >
        </div>

        <div class="sb-auth-field">
          <label for="sb-auth-password">Password</label>
          <input
            id="sb-auth-password"
            type="password"
            autocomplete="current-password"
            required
          >
        </div>

        <button class="sb-auth-submit" type="submit">
          Masuk ke Management Console
        </button>

        <div class="sb-auth-message" role="alert" aria-live="polite"></div>
      </form>

      <div class="sb-auth-security">
        Sesi menggunakan cookie aman HttpOnly. Password tidak disimpan di browser.
      </div>
    `;

    authOverlay.appendChild(card);
    document.body.appendChild(authOverlay);

    const form = card.querySelector("#sb-auth-form");
    emailInput = card.querySelector("#sb-auth-email");
    passwordInput = card.querySelector("#sb-auth-password");
    submitButton = card.querySelector(".sb-auth-submit");
    messageEl = card.querySelector(".sb-auth-message");

    form.addEventListener("submit", handleLogin);
  }

  function showLogin(message = "") {
    if (!authOverlay) buildLogin();

    authOverlay.hidden = false;

    if (messageEl) {
      messageEl.textContent = message;
    }

    if (passwordInput) {
      passwordInput.value = "";
    }

    window.setTimeout(() => {
      if (emailInput && !emailInput.value) {
        emailInput.focus();
      } else if (passwordInput) {
        passwordInput.focus();
      }
    }, 0);
  }

  function hideLogin() {
    if (authOverlay) {
      authOverlay.hidden = true;
    }
  }

  /* SB_ADMIN_ROLE_BADGE_R1 */
  function applyRoleBadge(user) {
    const profile =
      document.querySelector(".profile");

    if (!profile) return;

    const avatar =
      profile.querySelector(".avatar");

    const title =
      profile.querySelector(
        ".profile-copy strong"
      );

    const subtitle =
      profile.querySelector(
        ".profile-copy span"
      );

    const isStaff =
      user?.role === "staff";

    if (avatar) {
      avatar.textContent =
        isStaff ? "ST" : "SA";
    }

    if (title) {
      title.textContent =
        isStaff
          ? "Staff"
          : "System Admin";
    }

    if (subtitle) {
      subtitle.textContent =
        isStaff
          ? "Limited access"
          : "Full access";
    }
  }
  function installUserControls(user) {
    applyRoleBadge(user);
    const topbar = document.querySelector(".topbar");
    if (!topbar || document.getElementById("sb-auth-user")) return;

    const box = document.createElement("div");
    box.id = "sb-auth-user";
    box.className = "sb-auth-user";

    const name = document.createElement("span");
    name.className = "sb-auth-user-name";
    name.textContent = user.full_name || user.email || "Administrator";

    const logout = document.createElement("button");
    logout.className = "sb-auth-logout";
    logout.type = "button";
    logout.textContent = "Logout";

    logout.addEventListener("click", handleLogout);

    box.append(name, logout);
    topbar.appendChild(box);
  }

  async function handleLogin(event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    messageEl.textContent = "";
    submitButton.disabled = true;
    submitButton.textContent = "Memeriksa akun...";

    try {
      const response = await api("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await readJson(response);

      if (!response.ok || !data.user) {
        throw new Error(data.error || "Login gagal.");
      }

      if (!["system_admin", "staff"].includes(data.user.role)) {
        await api("/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: "{}"
        });

        throw new Error("Akun ini tidak memiliki akses administrator.");
      }

      currentUser = data.user;
      window.SB_AUTH_USER = currentUser;

      hideLogin();
      installUserControls(currentUser);
      applyRoleVisibility(currentUser);
    } catch (error) {
      showLogin(
        error instanceof Error
          ? error.message
          : "Tidak dapat masuk. Silakan coba kembali."
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Masuk ke Management Console";
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
      // Tetap kembali ke layar login jika jaringan bermasalah.
    }

    currentUser = null;
    window.SB_AUTH_USER = null;

    const box = document.getElementById("sb-auth-user");
    if (box) box.remove();

    showLogin("Anda telah keluar dari sesi administrator.");
  }

  /* SB_USERS_ROLES_VISIBILITY_R1 */
  function applyRoleVisibility(user) {
    const canManageUsers =
      user?.role === "system_admin";

    document
      .querySelectorAll(".nav a, .mobile-nav a")
      .forEach(link => {
        const label =
          String(link.textContent || "")
            .trim()
            .toLowerCase();

        if (label !== "users & roles") {
          return;
        }

        link.hidden = !canManageUsers;

        if (canManageUsers) {
          link.removeAttribute("aria-hidden");
          link.removeAttribute("tabindex");
        } else {
          link.setAttribute("aria-hidden", "true");
          link.setAttribute("tabindex", "-1");
        }
      });
  }
  async function checkSession() {
    showLogin();

    if (messageEl) {
      messageEl.textContent = "Memeriksa sesi...";
    }

    try {
      const response = await api("/auth/me");
      const data = await readJson(response);

      if (!response.ok || !data.user) {
        showLogin();
        return;
      }

      if (!["system_admin", "staff"].includes(data.user.role)) {
        showLogin("Akun ini tidak memiliki akses administrator.");
        return;
      }

      currentUser = data.user;
      window.SB_AUTH_USER = currentUser;

      hideLogin();
      installUserControls(currentUser);
      applyRoleVisibility(currentUser);
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

