(() => {
  "use strict";

  const API_BASE = "/api";

  let currentUser = null;
  let authOverlay = null;
  let messageEl = null;
  let emailInput = null;
  let passwordInput = null;
  let submitButton = null;

  /* SB_AUTH_SESSION_EXPIRY_R1 */
  let sessionExpiryHandled = false;
  let sessionExpiryCheck = null;

  const nativeFetch =
    window.fetch.bind(window);


  function protectedApiRequest(input) {
    let rawUrl = "";

    if (typeof input === "string") {
      rawUrl = input;
    } else if (input instanceof URL) {
      rawUrl = input.href;
    } else if (
      input &&
      typeof input.url === "string"
    ) {
      rawUrl = input.url;
    }

    if (!rawUrl) {
      return false;
    }

    try {
      const url =
        new URL(
          rawUrl,
          window.location.href
        );

      if (
        url.origin !==
        window.location.origin
      ) {
        return false;
      }

      if (
        !url.pathname.startsWith(
          "/api/"
        )
      ) {
        return false;
      }

      if (
        [
          "/api/auth/login",
          "/api/auth/logout"
        ].includes(
          url.pathname
        )
      ) {
        return false;
      }

      return true;

    } catch {
      return false;
    }
  }


  function clearAuthenticatedUi() {
    currentUser = null;
    window.SB_AUTH_USER = null;

    document.documentElement.dataset.sbRole =
      "";

    document
      .getElementById("sb-auth-user")
      ?.remove();

    const profile =
      document.querySelector(
        ".profile"
      );

    profile?.setAttribute(
      "aria-expanded",
      "false"
    );

    const notificationPanel =
      document.getElementById(
        "sb-notification-panel"
      );

    if (notificationPanel) {
      notificationPanel.hidden = true;
    }

    const notificationButton =
      document.querySelector(
        '.icon-btn[aria-label="Notifikasi"]'
      );

    notificationButton?.setAttribute(
      "aria-expanded",
      "false"
    );

    notificationButton?.classList.remove(
      "sb-notification-has-new"
    );
  }


  /* SB_AUTH_SESSION_EXPIRY_VERIFY_R1 */
  function resetAuthOverlayForLogin() {
    if (authOverlay) {
      authOverlay.remove();
    }

    authOverlay = null;
    messageEl = null;
    emailInput = null;
    passwordInput = null;
    submitButton = null;
  }


  function showSessionLogin(message) {
    clearAuthenticatedUi();
    resetAuthOverlayForLogin();
    showLogin(message);
  }


  function handleSessionExpiry() {
    if (sessionExpiryHandled) {
      return;
    }

    sessionExpiryHandled = true;

    showSessionLogin(
      "Sesi Anda telah berakhir. Silakan masuk kembali."
    );
  }


  function handleAdminAccessLoss() {
    if (sessionExpiryHandled) {
      return;
    }

    sessionExpiryHandled = true;

    showSessionLogin(
      "Akun ini tidak memiliki akses administrator."
    );
  }


  async function verifySessionAfterUnauthorized() {
    if (sessionExpiryHandled) {
      return;
    }

    if (!sessionExpiryCheck) {
      sessionExpiryCheck =
        (
          async () => {
            try {
              const response =
                await nativeFetch(
                  `${API_BASE}/auth/me`,
                  {
                    credentials:
                      "same-origin",
                    headers: {
                      Accept:
                        "application/json"
                    },
                    cache:
                      "no-store"
                  }
                );

              const data =
                await readJson(response);

              if (
                response.ok &&
                data.user
              ) {
                if (
                  [
                    "system_admin",
                    "staff"
                  ].includes(
                    data.user.role
                  )
                ) {
                  /*
                   * Session masih valid.
                   * 401 berasal dari endpoint lain,
                   * bukan session expiry.
                   */
                  currentUser =
                    data.user;

                  window.SB_AUTH_USER =
                    currentUser;

                  return;
                }

                handleAdminAccessLoss();
                return;
              }

              if (
                response.status === 401
              ) {
                handleSessionExpiry();
              }

              /*
               * 5xx / network / response lain tidak
               * otomatis dianggap session expired.
               */
            }
            catch {
              /*
               * Kegagalan jaringan saat verifikasi
               * tidak boleh memaksa logout.
               */
            }
          }
        )()
          .finally(() => {
            sessionExpiryCheck = null;
          });
    }

    await sessionExpiryCheck;
  }


  window.fetch =
    async function sbAuthenticatedFetch(
      input,
      options
    ) {
      const hadAuthenticatedUser =
        Boolean(
          currentUser ||
          window.SB_AUTH_USER
        );

      const protectedRequest =
        protectedApiRequest(input);

      const response =
        await nativeFetch(
          input,
          options
        );

      if (
        response.status === 401 &&
        hadAuthenticatedUser &&
        protectedRequest
      ) {
        await verifySessionAfterUnauthorized();
      }

      return response;
    };


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
      /*
       * STAFF BUSINESS ACTION GUARD R1
       */
      html[data-sb-role="staff"] [data-client-new],
      html[data-sb-role="staff"] [data-lead-convert-area] {
        display: none !important;
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

      /* SB_TOPBAR_ACCOUNT_MENU_R1 */

      .top-actions {
        position: relative;
      }

      .profile {
        cursor: pointer;
      }

      .profile[aria-expanded="true"] {
        border-color: rgba(22,138,99,.35);
        box-shadow: 0 0 0 3px rgba(22,138,99,.08);
      }

      .sb-account-menu {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        z-index: 80;

        width: min(300px, calc(100vw - 28px));

        padding: 10px;

        border: 1px solid rgba(15,23,42,.10);
        border-radius: 14px;

        background: #fff;
        color: #0f172a;

        box-shadow:
          0 18px 45px rgba(15,23,42,.14);
      }

      .sb-account-menu[hidden] {
        display: none !important;
      }

      .sb-account-summary {
        padding: 9px 10px 12px;
        border-bottom: 1px solid rgba(15,23,42,.08);
      }

      .sb-account-name {
        display: block;

        font-size: 13px;
        font-weight: 800;

        color: #0f172a;
      }

      .sb-account-email {
        display: block;

        margin-top: 3px;

        font-size: 11px;
        line-height: 1.4;

        color: #64748b;

        overflow-wrap: anywhere;
      }

      .sb-account-role {
        display: inline-flex;

        margin-top: 8px;
        padding: 4px 8px;

        border-radius: 999px;

        background: rgba(22,138,99,.09);
        color: #137153;

        font-size: 10px;
        font-weight: 800;
      }

      .sb-account-actions {
        padding-top: 8px;
      }

      .sb-account-menu .sb-auth-logout {
        width: 100%;

        text-align: left;

        border: 0;
        border-radius: 9px;

        padding: 10px;

        background: transparent;

        font-weight: 750;
      }

      .sb-account-menu .sb-auth-logout:hover {
        background: #f8faf9;
      }

      @media(max-width:820px) {
        .sb-account-menu {
          right: -2px;
          width: min(280px, calc(100vw - 20px));
        }
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

    const topActions =
      document.querySelector(".top-actions");

    const profile =
      document.querySelector(".profile");

    if (
      !topActions ||
      !profile ||
      document.getElementById("sb-auth-user")
    ) {
      return;
    }

    profile.type = "button";

    profile.setAttribute(
      "aria-haspopup",
      "menu"
    );

    profile.setAttribute(
      "aria-expanded",
      "false"
    );

    profile.setAttribute(
      "aria-controls",
      "sb-auth-user"
    );


    const menu =
      document.createElement("div");

    menu.id = "sb-auth-user";
    menu.className = "sb-account-menu";
    menu.hidden = true;

    menu.setAttribute(
      "role",
      "menu"
    );

    menu.setAttribute(
      "aria-label",
      "Menu akun"
    );


    const summary =
      document.createElement("div");

    summary.className =
      "sb-account-summary";


    const name =
      document.createElement("strong");

    name.className =
      "sb-account-name";

    name.textContent =
      user.full_name ||
      user.email ||
      "Administrator";


    const email =
      document.createElement("span");

    email.className =
      "sb-account-email";

    email.textContent =
      user.email || "";


    const role =
      document.createElement("span");

    role.className =
      "sb-account-role";

    role.textContent =
      user.role === "staff"
        ? "Staff • Limited access"
        : "System Admin • Full access";


    summary.append(
      name,
      email,
      role
    );


    const actions =
      document.createElement("div");

    actions.className =
      "sb-account-actions";


    const logout =
      document.createElement("button");

    logout.className =
      "sb-auth-logout";

    logout.type =
      "button";

    logout.textContent =
      "Logout";

    logout.setAttribute(
      "role",
      "menuitem"
    );

    logout.addEventListener(
      "click",
      handleLogout
    );


    actions.appendChild(
      logout
    );

    menu.append(
      summary,
      actions
    );

    topActions.appendChild(
      menu
    );


    function closeMenu() {
      menu.hidden = true;

      profile.setAttribute(
        "aria-expanded",
        "false"
      );
    }


    profile.onclick =
      event => {
        event.preventDefault();
        event.stopPropagation();

        const opening =
          menu.hidden;

        menu.hidden =
          !opening;

        profile.setAttribute(
          "aria-expanded",
          opening
            ? "true"
            : "false"
        );
      };


    if (
      document.documentElement.dataset
        .sbAccountMenuEventsR1 !==
      "1"
    ) {
      document.documentElement.dataset
        .sbAccountMenuEventsR1 =
        "1";

      document.addEventListener(
        "click",
        event => {
          const currentMenu =
            document.getElementById(
              "sb-auth-user"
            );

          const currentProfile =
            document.querySelector(
              ".profile"
            );

          if (
            !currentMenu ||
            !currentProfile ||
            currentMenu.hidden
          ) {
            return;
          }

          if (
            currentMenu.contains(
              event.target
            ) ||
            currentProfile.contains(
              event.target
            )
          ) {
            return;
          }

          currentMenu.hidden = true;

          currentProfile.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      );


      document.addEventListener(
        "keydown",
        event => {
          if (
            event.key !==
            "Escape"
          ) {
            return;
          }

          const currentMenu =
            document.getElementById(
              "sb-auth-user"
            );

          const currentProfile =
            document.querySelector(
              ".profile"
            );

          if (
            !currentMenu ||
            currentMenu.hidden
          ) {
            return;
          }

          currentMenu.hidden = true;

          currentProfile?.setAttribute(
            "aria-expanded",
            "false"
          );

          currentProfile?.focus();
        }
      );
    }
  }

  /* SB_REQUIRED_PASSWORD_CHANGE_R1 */
  function showRequiredPasswordChange(user) {
    if (!authOverlay) {
      buildLogin();
    }

    authOverlay.hidden = false;

    const card =
      authOverlay.firstElementChild;

    if (!card) return;

    const heading =
      card.querySelector("h1, h2");

    if (heading) {
      heading.textContent =
        "Wajib Ganti Password";
    }

    const description =
      heading?.nextElementSibling;

    if (
      description &&
      description.tagName === "P"
    ) {
      description.textContent =
        "Password sementara atau hasil reset harus diganti sebelum Management Console dapat digunakan.";
    }

    const oldForm =
      card.querySelector("#sb-auth-form");

    if (!oldForm) return;

    const form =
      document.createElement("form");

    form.id =
      "sb-required-password-form";

    form.innerHTML = `
      <div class="sb-auth-field">
        <label for="sb-current-password">
          Password Saat Ini
        </label>
        <input
          id="sb-current-password"
          type="password"
          autocomplete="current-password"
          required
        >
      </div>

      <div class="sb-auth-field">
        <label for="sb-new-password">
          Password Baru
        </label>
        <input
          id="sb-new-password"
          type="password"
          autocomplete="new-password"
          minlength="12"
          required
        >
      </div>

      <div class="sb-auth-field">
        <label for="sb-confirm-password">
          Ulangi Password Baru
        </label>
        <input
          id="sb-confirm-password"
          type="password"
          autocomplete="new-password"
          minlength="12"
          required
        >
      </div>

      <button
        class="sb-auth-submit"
        type="submit"
      >
        Simpan Password Baru
      </button>

      <div
        class="sb-auth-message"
        role="alert"
        aria-live="polite"
      ></div>
    `;

    oldForm.replaceWith(form);

    const currentPassword =
      form.querySelector(
        "#sb-current-password"
      );

    const newPassword =
      form.querySelector(
        "#sb-new-password"
      );

    const confirmPassword =
      form.querySelector(
        "#sb-confirm-password"
      );

    const button =
      form.querySelector(
        ".sb-auth-submit"
      );

    const message =
      form.querySelector(
        ".sb-auth-message"
      );

    form.addEventListener(
      "submit",
      async event => {
        event.preventDefault();

        message.textContent = "";

        if (
          newPassword.value !==
          confirmPassword.value
        ) {
          message.textContent =
            "Konfirmasi password baru tidak sama.";
          return;
        }

        if (
          newPassword.value ===
          currentPassword.value
        ) {
          message.textContent =
            "Password baru harus berbeda dari password saat ini.";
          return;
        }

        button.disabled = true;
        button.textContent =
          "Menyimpan...";

        try {
          const response =
            await api(
              "/auth/change-password",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json"
                },
                body: JSON.stringify({
                  current_password:
                    currentPassword.value,
                  new_password:
                    newPassword.value
                })
              }
            );

          const data =
            await readJson(response);

          if (!response.ok) {
            throw new Error(
              data.error ||
              "Gagal mengubah password."
            );
          }

          message.textContent =
            "Password berhasil diubah. Memuat Management Console...";

          window.setTimeout(() => {
            window.location.reload();
          }, 700);

        } catch (error) {
          message.textContent =
            error instanceof Error
              ? error.message
              : "Gagal mengubah password.";

          button.disabled = false;
          button.textContent =
            "Simpan Password Baru";
        }
      }
    );

    window.setTimeout(() => {
      currentPassword?.focus();
    }, 0);
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

      const resumeAfterSessionExpiry =
        sessionExpiryHandled;

      sessionExpiryHandled = false;

      currentUser = data.user;
      window.SB_AUTH_USER = currentUser;

      if (currentUser.must_change_password) {
        showRequiredPasswordChange(
          currentUser
        );
        return;
      }

      /*
       * Setelah login ulang karena session expiry,
       * reload agar seluruh modul memulai ulang dari state bersih.
       */
      if (resumeAfterSessionExpiry) {
        window.location.reload();
        return;
      }

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

    document
      .querySelector(".profile")
      ?.setAttribute(
        "aria-expanded",
        "false"
      );

    showLogin("Anda telah keluar dari sesi administrator.");
  }

  /* SB_USERS_ROLES_VISIBILITY_R1 */
  function applyRoleVisibility(user) {
    const canManageUsers =
      user?.role === "system_admin";
    /*
     * STAFF BUSINESS ACTION GUARD R1
     * Role disimpan pada root document agar guard
     * berlaku juga untuk elemen yang dirender kemudian.
     */
    document.documentElement.dataset.sbRole =
      user?.role || "";

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
          link.style.removeProperty("display");
          link.removeAttribute("aria-hidden");
          link.removeAttribute("tabindex");
        } else {
          link.style.setProperty(
            "display",
            "none",
            "important"
          );
          link.setAttribute("aria-hidden", "true");
          link.setAttribute("tabindex", "-1");
        }
      });

    /*
     * STAFF ACCESS UI GUARD R1
     * Staff tidak boleh membuka Users & Roles
     * walaupun URL #users dimasukkan manual.
     */
    if (
      !canManageUsers &&
      location.hash.toLowerCase() === "#users"
    ) {
      history.replaceState(
        null,
        "",
        location.pathname + location.search
      );

      const dashboardLink =
        [...document.querySelectorAll(
          ".nav a, .mobile-nav a"
        )].find(
          link =>
            String(link.textContent || "")
              .trim()
              .toLowerCase() === "dashboard"
        );

      if (dashboardLink) {
        window.setTimeout(() => {
          dashboardLink.click();
        }, 0);
      }
    }
  }
  /* SB_AUTH_SESSION_LOADING_R1 */
  function finishAuthBoot() {
    document.documentElement.classList.remove(
      "sb-auth-pending"
    );

    document
      .getElementById("sb-auth-boot")
      ?.remove();

    document
      .getElementById("sb-auth-boot-style")
      ?.remove();
  }


  async function checkSession() {
    try {
      const response = await api("/auth/me");
      const data = await readJson(response);

      if (!response.ok || !data.user) {
        finishAuthBoot();
        showLogin();
        return;
      }

      if (!["system_admin", "staff"].includes(data.user.role)) {
        finishAuthBoot();

        showLogin(
          "Akun ini tidak memiliki akses administrator."
        );

        return;
      }

      sessionExpiryHandled = false;

      currentUser = data.user;
      window.SB_AUTH_USER = currentUser;

      if (currentUser.must_change_password) {
        finishAuthBoot();

        showRequiredPasswordChange(
          currentUser
        );

        return;
      }

      hideLogin();

      installUserControls(
        currentUser
      );

      applyRoleVisibility(
        currentUser
      );

      /*
       * Dashboard baru diperlihatkan setelah:
       * session valid + role UI selesai diterapkan.
       */
      finishAuthBoot();

    } catch {
      finishAuthBoot();

      showLogin(
        "Tidak dapat terhubung ke layanan autentikasi."
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkSession, { once: true });
  } else {
    checkSession();
  }
})();
