(() => {
  "use strict";

  const buttons = [
    ...document.querySelectorAll(".quick-actions button")
  ];

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function buttonNamed(name) {
    const target = normalize(name);

    return buttons.find(button =>
      normalize(button.textContent) === target
    );
  }

  function navLink(name) {
    const target = normalize(name);

    return [
      ...document.querySelectorAll(
        ".nav a, .mobile-nav a"
      )
    ].find(link =>
      normalize(link.textContent) === target
    );
  }

  function openNavigation(name) {
    const link = navLink(name);

    if (!link) {
      console.warn(
        `[Portal Quick Actions] Navigasi ${name} tidak ditemukan.`
      );
      return false;
    }

    link.click();
    return true;
  }

  /*
   * ==========================================================
   * SECURITY MODAL
   * ==========================================================
   */

  const style = document.createElement("style");

  style.textContent = `
    .sb-qa-security[hidden] {
      display: none !important;
    }

    .sb-qa-security {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: grid;
      place-items: center;
      padding: 20px;
    }

    .sb-qa-security-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, .58);
      backdrop-filter: blur(4px);
    }

    .sb-qa-security-card {
      position: relative;
      width: min(100%, 460px);
      max-height: calc(100vh - 40px);
      overflow: auto;
      background: #fff;
      border: 1px solid rgba(15, 23, 42, .10);
      border-radius: 18px;
      box-shadow: 0 24px 70px rgba(15, 23, 42, .22);
      padding: 24px;
    }

    .sb-qa-security-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 18px;
      margin-bottom: 20px;
    }

    .sb-qa-security-head h2 {
      margin: 0 0 5px;
      font-size: 21px;
      color: #16352c;
    }

    .sb-qa-security-head p {
      margin: 0;
      color: #64748b;
      font-size: 12px;
      line-height: 1.6;
    }

    .sb-qa-security-section h3 {
      margin: 0 0 5px;
      color: #16352c;
      font-size: 15px;
    }
    .sb-qa-security-section > p {
      margin: 0 0 14px;
      color: #64748b;
      font-size: 11px;
      line-height: 1.55;
    }
    .sb-qa-security-divider {
      height: 1px;
      margin: 22px 0;
      background: #e2e8e5;
    }

    .sb-qa-security-close {
      border: 1px solid #dbe3df;
      background: #fff;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
    }

    .sb-qa-security-form {
      display: grid;
      gap: 14px;
    }

    .sb-qa-security-field {
      display: grid;
      gap: 7px;
    }

    .sb-qa-security-field label {
      font-size: 11px;
      font-weight: 800;
      color: #334155;
    }

    .sb-qa-security-field input {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #dbe3df;
      border-radius: 11px;
      padding: 12px 13px;
      font: inherit;
      outline: none;
    }

    .sb-qa-security-field input:focus {
      border-color: #2f7d5d;
      box-shadow: 0 0 0 3px rgba(47, 125, 93, .10);
    }

    .sb-qa-security-message {
      min-height: 18px;
      color: #b42318;
      font-size: 11px;
      line-height: 1.5;
    }

    .sb-qa-security-actions {
      display: flex;
      justify-content: flex-end;
      gap: 9px;
      margin-top: 3px;
    }

    .sb-qa-security-actions button {
      border-radius: 11px;
      padding: 11px 15px;
      font-weight: 800;
      cursor: pointer;
    }

    .sb-qa-security-cancel {
      border: 1px solid #dbe3df;
      background: #fff;
      color: #334155;
    }

    .sb-qa-security-submit {
      border: 1px solid #176b4b;
      background: #176b4b;
      color: #fff;
    }

    @media (max-width: 560px) {
      .sb-qa-security {
        padding: 12px;
      }

      .sb-qa-security-card {
        padding: 20px 16px;
        border-radius: 15px;
      }
    }
  `;

  document.head.appendChild(style);

  const securityModal =
    document.createElement("div");

  securityModal.className = "sb-qa-security";
  securityModal.hidden = true;

  securityModal.innerHTML = `
    <div
      class="sb-qa-security-backdrop"
      data-qa-security-close
    ></div>
    <section
      class="sb-qa-security-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sbQaSecurityTitle"
    >
      <div class="sb-qa-security-head">
        <div>
          <h2 id="sbQaSecurityTitle">
            Akun &amp; Keamanan
          </h2>
          <p>
            Kelola nama akun dan password
            Client Portal Anda.
          </p>
        </div>
        <button
          class="sb-qa-security-close"
          type="button"
          aria-label="Tutup"
          data-qa-security-close
        >
          &times;
        </button>
      </div>
      <section class="sb-qa-security-section">
        <h3>Profil Akun</h3>
        <p>
          Perbarui nama yang ditampilkan pada
          Client Portal Anda.
        </p>
        <form
          class="sb-qa-security-form"
          data-qa-profile-form
        >
          <div class="sb-qa-security-field">
            <label for="sb-qa-full-name">
              Nama lengkap
            </label>
            <input
              id="sb-qa-full-name"
              name="full_name"
              type="text"
              minlength="2"
              maxlength="120"
              autocomplete="name"
              required
            >
          </div>
          <div
            class="sb-qa-security-message"
            data-qa-profile-message
            role="status"
            aria-live="polite"
          ></div>
          <div class="sb-qa-security-actions">
            <button
              class="sb-qa-security-submit"
              type="submit"
            >
              Simpan Nama
            </button>
          </div>
        </form>
      </section>
      <div class="sb-qa-security-divider"></div>
      <section class="sb-qa-security-section">
        <h3>Ubah Password</h3>
        <p>
          Password baru harus 6-30 karakter.
        </p>
        <form
          class="sb-qa-security-form"
          data-qa-security-form
        >
          <div class="sb-qa-security-field">
            <label for="sb-qa-current-password">
              Password saat ini
            </label>
            <input
              id="sb-qa-current-password"
              name="current_password"
              type="password"
              autocomplete="current-password"
              required
            >
          </div>
          <div class="sb-qa-security-field">
            <label for="sb-qa-new-password">
              Password baru
            </label>
            <input
              id="sb-qa-new-password"
              name="new_password"
              type="password"
              minlength="6"
              maxlength="30"
              autocomplete="new-password"
              required
            >
          </div>
          <div class="sb-qa-security-field">
            <label for="sb-qa-confirm-password">
              Ulangi password baru
            </label>
            <input
              id="sb-qa-confirm-password"
              name="confirm_password"
              type="password"
              minlength="6"
              maxlength="30"
              autocomplete="new-password"
              required
            >
          </div>
          <div
            class="sb-qa-security-message"
            data-qa-security-message
            role="alert"
            aria-live="polite"
          ></div>
          <div class="sb-qa-security-actions">
            <button
              class="sb-qa-security-cancel"
              type="button"
              data-qa-security-close
            >
              Batal
            </button>
            <button
              class="sb-qa-security-submit"
              type="submit"
            >
              Simpan Password
            </button>
          </div>
        </form>
      </section>
    </section>
  `;

  document.body.appendChild(securityModal);

  const profileForm =
    securityModal.querySelector(
      "[data-qa-profile-form]"
    );
  const profileMessage =
    securityModal.querySelector(
      "[data-qa-profile-message]"
    );
  const profileName =
    securityModal.querySelector(
      "#sb-qa-full-name"
    );
  const securityForm =
    securityModal.querySelector(
      "[data-qa-security-form]"
    );
  const securityMessage =
    securityModal.querySelector(
      "[data-qa-security-message]"
    );
  function initials(name) {
    const parts =
      String(name || "Client")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    return (
      parts
        .slice(0, 2)
        .map(part =>
          part.charAt(0).toUpperCase()
        )
        .join("") ||
      "CL"
    );
  }
  function updatePortalIdentity(user) {
    const profile =
      document.querySelector(".profile");
    if (profile) {
      const avatar =
        profile.querySelector(".avatar");
      const strong =
        profile.querySelector(
          ".profile-copy strong"
        );
      if (avatar) {
        avatar.textContent =
          initials(user.full_name);
      }
      if (strong) {
        strong.textContent =
          user.full_name ||
          user.email ||
          "Client";
      }
    }
    const heading =
      document.querySelector(
        ".page-head h1"
      );
    if (
      heading &&
      user.full_name
    ) {
      const firstName =
        user.full_name
          .trim()
          .split(/\s+/)[0];
      heading.textContent =
        `Selamat datang, ${firstName}`;
    }
  }
  function openSecurity() {
    const user =
      window.SB_PORTAL_USER;
    if (
      !user ||
      user.role !== "client"
    ) {
      return;
    }
    profileForm.reset();
    securityForm.reset();
    profileMessage.textContent = "";
    profileMessage.style.color = "";
    securityMessage.textContent = "";
    securityMessage.style.color = "";
    profileName.value =
      String(
        user.full_name || ""
      );
    securityModal.hidden = false;
    window.setTimeout(() => {
      profileName?.focus();
    }, 0);
  }
  function closeSecurity() {
    securityModal.hidden = true;
    profileForm.reset();
    securityForm.reset();
    profileMessage.textContent = "";
    profileMessage.style.color = "";
    securityMessage.textContent = "";
    securityMessage.style.color = "";
  }
  securityModal
    .querySelectorAll(
      "[data-qa-security-close]"
    )
    .forEach(button => {
      button.addEventListener(
        "click",
        closeSecurity
      );
    });
  profileForm.addEventListener(
    "submit",
    async event => {
      event.preventDefault();
      const user =
        window.SB_PORTAL_USER;
      if (
        !user ||
        user.role !== "client"
      ) {
        profileMessage.textContent =
          "Sesi Client Portal tidak tersedia.";
        return;
      }
      const data =
        new FormData(profileForm);
      const fullName =
        String(
          data.get("full_name") || ""
        ).trim();
      profileMessage.textContent = "";
      profileMessage.style.color = "";
      if (
        fullName.length < 2 ||
        fullName.length > 120
      ) {
        profileMessage.textContent =
          "Nama lengkap harus 2-120 karakter.";
        return;
      }
      const submit =
        profileForm.querySelector(
          "button[type='submit']"
        );
      submit.disabled = true;
      submit.textContent = "Menyimpan...";
      try {
        const response =
          await fetch(
            "/api/auth/profile",
            {
              method: "POST",
              credentials: "same-origin",
              headers: {
                Accept: "application/json",
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify({
                full_name: fullName
              })
            }
          );
        const result =
          await response
            .json()
            .catch(() => ({}));
        if (!response.ok) {
          throw new Error(
            result.error ||
            "Nama belum dapat diperbarui."
          );
        }
        const savedUser =
          result &&
          typeof result.user === "object" &&
          result.user
            ? result.user
            : {};
        const savedName =
          String(
            savedUser.full_name ||
            fullName
          );
        window.SB_PORTAL_USER = {
          ...user,
          ...savedUser,
          full_name: savedName
        };
        profileName.value =
          savedName;
        updatePortalIdentity(
          window.SB_PORTAL_USER
        );
        profileMessage.style.color =
          "#176b4b";
        profileMessage.textContent =
          "Nama berhasil diperbarui.";
      }
      catch (error) {
        profileMessage.textContent =
          error instanceof Error
            ? error.message
            : "Nama belum dapat diperbarui.";
      }
      finally {
        submit.disabled = false;
        submit.textContent = "Simpan Nama";
      }
    }
  );

  securityForm.addEventListener(
    "submit",
    async event => {
      event.preventDefault();

      const data =
        new FormData(securityForm);

      const currentPassword =
        String(
          data.get("current_password") || ""
        );

      const newPassword =
        String(
          data.get("new_password") || ""
        );

      const confirmPassword =
        String(
          data.get("confirm_password") || ""
        );

      securityMessage.textContent = "";
      securityMessage.style.color = "";

      if (
        newPassword.length < 6 ||
        newPassword.length > 30
      ) {
        securityMessage.textContent =
          "Password baru harus 6-30 karakter.";
        return;
      }

      if (newPassword !== confirmPassword) {
        securityMessage.textContent =
          "Konfirmasi password baru tidak sama.";
        return;
      }

      if (currentPassword === newPassword) {
        securityMessage.textContent =
          "Password baru harus berbeda dari password saat ini.";
        return;
      }

      const submit =
        securityForm.querySelector(
          "button[type='submit']"
        );

      submit.disabled = true;
      submit.textContent = "Menyimpan...";

      try {
        const response =
          await fetch(
            "/api/auth/change-password",
            {
              method: "POST",
              credentials: "same-origin",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                current_password:
                  currentPassword,
                new_password:
                  newPassword
              })
            }
          );

        const result =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok || !result.ok) {
          throw new Error(
            result.error ||
            "Password belum dapat diubah."
          );
        }

        securityMessage.style.color =
          "#176b4b";

        securityMessage.textContent =
          "Password berhasil diubah.";

        securityForm.reset();

        window.setTimeout(
          closeSecurity,
          900
        );

      } catch (error) {
        securityMessage.textContent =
          error instanceof Error
            ? error.message
            : "Password belum dapat diubah.";
      } finally {
        submit.disabled = false;
        submit.textContent =
          "Simpan Password";
      }
    }
  );

  /*
   * ==========================================================
   * DASHBOARD QUICK ACTIONS
   * ==========================================================
   */

  buttonNamed("Lihat invoice")
    ?.addEventListener("click", () => {
      openNavigation("Invoices");
    });

  buttonNamed("Dokumen")
    ?.addEventListener("click", () => {
      openNavigation("Documents");
    });

  buttonNamed("Buat tiket")
    ?.addEventListener("click", () => {
      if (!openNavigation("Support")) {
        return;
      }

      window.setTimeout(() => {
        document
          .querySelector(
            "[data-support-new]"
          )
          ?.click();
      }, 0);
    });

  buttonNamed("Keamanan")
    ?.addEventListener(
      "click",
      openSecurity
    );


  /*
   * ==========================================================
   * PORTAL TOPBAR ACTIONS R1
   * ==========================================================
   */

  const topbarProfile =
    document.querySelector(".profile");

  if (
    topbarProfile &&
    topbarProfile.dataset.sbPortalAccountR1 !== "1"
  ) {
    topbarProfile.dataset.sbPortalAccountR1 = "1";
    topbarProfile.type = "button";

    topbarProfile.setAttribute(
      "aria-label",
      "Buka Akun & Keamanan"
    );

    topbarProfile.addEventListener(
      "click",
      event => {
        event.preventDefault();
        openSecurity();
      }
    );
  }


  const notificationButton =
    document.querySelector(
      '.icon-btn[aria-label="Notifikasi"]'
    );

  const topActions =
    document.querySelector(".top-actions");

  if (
    notificationButton &&
    topActions &&
    notificationButton.dataset
      .sbPortalNotificationR1 !== "1"
  ) {
    notificationButton.dataset
      .sbPortalNotificationR1 = "1";

    notificationButton.type = "button";

    notificationButton.setAttribute(
      "aria-haspopup",
      "dialog"
    );

    notificationButton.setAttribute(
      "aria-expanded",
      "false"
    );

    notificationButton.setAttribute(
      "aria-controls",
      "sb-portal-notification-panel"
    );


    if (
      !document.getElementById(
        "sb-portal-topbar-actions-r1-styles"
      )
    ) {
      const style =
        document.createElement("style");

      style.id =
        "sb-portal-topbar-actions-r1-styles";

      style.textContent = `
        .top-actions {
          position: relative;
        }

        .profile {
          cursor: pointer;
        }

        .icon-btn[aria-expanded="true"] {
          border-color: rgba(23,107,75,.35);
          box-shadow:
            0 0 0 3px rgba(23,107,75,.08);
        }

        .sb-portal-notification-panel[hidden] {
          display: none !important;
        }

        .sb-portal-notification-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          z-index: 90;

          width:
            min(
              360px,
              calc(100vw - 28px)
            );

          overflow: hidden;

          border:
            1px solid rgba(15,23,42,.10);

          border-radius: 14px;
          background: #fff;

          box-shadow:
            0 18px 45px
            rgba(15,23,42,.14);
        }

        .sb-portal-notification-head {
          padding: 14px 16px;

          border-bottom:
            1px solid rgba(15,23,42,.08);
        }

        .sb-portal-notification-head strong {
          display: block;
          color: #16352c;
          font-size: 14px;
        }

        .sb-portal-notification-head span {
          display: block;
          margin-top: 3px;
          color: #64748b;
          font-size: 11px;
        }

        .sb-portal-notification-state {
          padding: 22px 18px;
          color: #475569;
          font-size: 12px;
          line-height: 1.6;
          text-align: center;
        }

        .sb-portal-notification-state strong {
          display: block;
          margin-bottom: 5px;
          color: #16352c;
          font-size: 13px;
        }

        @media(max-width:820px) {
          .sb-portal-notification-panel {
            right: -2px;

            width:
              min(
                340px,
                calc(100vw - 20px)
              );
          }
        }
      `;

      document.head.appendChild(style);
    }


    const notificationPanel =
      document.createElement("div");

    notificationPanel.id =
      "sb-portal-notification-panel";

    notificationPanel.className =
      "sb-portal-notification-panel";

    notificationPanel.hidden = true;

    notificationPanel.setAttribute(
      "role",
      "dialog"
    );

    notificationPanel.setAttribute(
      "aria-label",
      "Notifikasi Client"
    );

    notificationPanel.innerHTML = `
      <div class="sb-portal-notification-head">
        <strong>Notifikasi Client</strong>
        <span>
          Informasi terbaru akun dan layanan Anda
        </span>
      </div>

      <div class="sb-portal-notification-state">
        <strong>Belum ada notifikasi baru</strong>

        Notifikasi real-time Client belum diaktifkan.
        Status project, invoice, dokumen, dan support
        tetap dapat dipantau melalui dashboard.
      </div>
    `;

    topActions.appendChild(
      notificationPanel
    );


    function closePortalNotifications() {
      notificationPanel.hidden = true;

      notificationButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }


    notificationButton.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        const opening =
          notificationPanel.hidden;

        notificationPanel.hidden =
          !opening;

        notificationButton.setAttribute(
          "aria-expanded",
          opening
            ? "true"
            : "false"
        );
      }
    );


    topbarProfile?.addEventListener(
      "click",
      closePortalNotifications
    );


    document.addEventListener(
      "click",
      event => {
        if (
          notificationPanel.hidden ||
          notificationPanel.contains(
            event.target
          ) ||
          notificationButton.contains(
            event.target
          )
        ) {
          return;
        }

        closePortalNotifications();
      }
    );


    document.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Escape" &&
          !notificationPanel.hidden
        ) {
          closePortalNotifications();
          notificationButton.focus();
        }
      }
    );
  }


  document.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Escape" &&
        !securityModal.hidden
      ) {
        closeSecurity();
      }
    }
  );
})();
