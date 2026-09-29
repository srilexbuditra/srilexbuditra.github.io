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


  /*
   * ==========================================================
   * PORTAL DESKTOP SIDEBAR TOGGLE R1
   * ==========================================================
   */

  const portalMenu =
    document.querySelector("[data-menu]");

  const portalSidebar =
    document.querySelector(".sidebar");


  /*
   * ==========================================================
   * PORTAL MOBILE SIDEBAR CLOSE R1
   * ==========================================================
   */

  let portalMobileSidebarClose =
    portalSidebar?.querySelector(
      ".sb-portal-mobile-sidebar-close"
    );

  if (
    portalSidebar &&
    !portalMobileSidebarClose
  ) {
    portalMobileSidebarClose =
      document.createElement("button");

    portalMobileSidebarClose.type =
      "button";

    portalMobileSidebarClose.className =
      "sb-mobile-sidebar-close " +
      "sb-portal-mobile-sidebar-close";

    portalMobileSidebarClose.setAttribute(
      "aria-label",
      "Tutup navigasi"
    );

    portalMobileSidebarClose.setAttribute(
      "title",
      "Tutup navigasi"
    );

    portalMobileSidebarClose.textContent =
      "\u00D7";

    portalSidebar.appendChild(
      portalMobileSidebarClose
    );
  }


  portalMobileSidebarClose
    ?.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        document.body.classList.remove(
          "nav-open"
        );

        portalMenu?.focus();
      }
    );


  portalSidebar
    ?.addEventListener(
      "click",
      event => {
        if (window.innerWidth > 820) {
          return;
        }

        const link =
          event.target.closest("a");

        if (!link) {
          return;
        }

        document.body.classList.remove(
          "nav-open"
        );
      }
    );


  if (
    portalMenu &&
    portalMenu.dataset.sbPortalDesktopToggleR1 !== "1"
  ) {
    portalMenu.dataset.sbPortalDesktopToggleR1 = "1";

    if (
      !document.getElementById(
        "sb-portal-desktop-toggle-r1-styles"
      )
    ) {
      const sidebarStyle =
        document.createElement("style");

      sidebarStyle.id =
        "sb-portal-desktop-toggle-r1-styles";

      sidebarStyle.textContent = `
        .icon-btn {
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .icon-btn svg {
          display: block;
          width: 20px;
          height: 20px;
        }

        /*
         * PORTAL BELL COLOR R1
         */

        .top-actions
        .icon-btn[aria-label="Notifikasi"] {
          position: relative;

          color: #168a63;
          background: rgba(22,138,99,.08);
          border-color: rgba(22,138,99,.22);

          transition:
            color .18s ease,
            background .18s ease,
            border-color .18s ease,
            box-shadow .18s ease;
        }

        .top-actions
        .icon-btn[aria-label="Notifikasi"]:hover {
          color: #0f6f50;
          background: rgba(22,138,99,.14);
          border-color: rgba(22,138,99,.32);
        }

        .top-actions
        .icon-btn[aria-label="Notifikasi"][aria-expanded="true"] {
          color: #fff;
          background: #168a63;
          border-color: #168a63;

          box-shadow:
            0 0 0 3px
            rgba(22,138,99,.12);
        }

        .icon-btn.sb-portal-notification-has-new::after {
          content: "";

          position: absolute;
          top: 6px;
          right: 6px;

          width: 8px;
          height: 8px;

          border: 2px solid #fff;
          border-radius: 50%;

          background: #16a34a;

          box-sizing: content-box;

          box-shadow:
            0 0 0 1px
            rgba(22,163,74,.10);
        }

        @media(max-width:820px) {
          .sidebar .brand {
            padding-right: 48px;
          }
        }

        @media(min-width:821px) {
          .menu-btn {
            display: inline-grid;
            place-items: center;
            cursor: pointer;
          }

          .sidebar {
            transition:
              transform .22s ease;
          }

          .shell {
            transition:
              margin-left .22s ease;
          }

          body.sb-portal-sidebar-collapsed
          .sidebar {
            transform:
              translateX(-100%);
          }

          body.sb-portal-sidebar-collapsed
          .shell {
            margin-left: 0;
          }
        }
      `;

      document.head.appendChild(
        sidebarStyle
      );
    }


    function syncPortalDesktopMenu() {
      if (window.innerWidth <= 820) {
        document.body.classList.remove(
          "sb-portal-sidebar-collapsed"
        );

        portalMenu.setAttribute(
          "aria-label",
          "Buka navigasi"
        );

        return;
      }

      const collapsed =
        document.body.classList.contains(
          "sb-portal-sidebar-collapsed"
        );

      portalMenu.setAttribute(
        "aria-label",
        collapsed
          ? "Buka navigasi"
          : "Tutup navigasi"
      );
    }


    portalMenu.addEventListener(
      "click",
      event => {
        if (window.innerWidth <= 820) {
          return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        document.body.classList.toggle(
          "sb-portal-sidebar-collapsed"
        );

        syncPortalDesktopMenu();
      },
      true
    );


    window.addEventListener(
      "resize",
      syncPortalDesktopMenu
    );

    syncPortalDesktopMenu();
  }


  /*
   * ==========================================================
   * PORTAL NOTIFICATION INDICATOR R1
   * ==========================================================
   */

  if (notificationButton) {
    function setPortalNotificationCount(value) {
      const parsed =
        Number(value);

      const count =
        Number.isFinite(parsed)
          ? Math.max(
              0,
              Math.floor(parsed)
            )
          : 0;

      notificationButton.dataset
        .notificationCount =
          String(count);

      notificationButton.classList.toggle(
        "sb-portal-notification-has-new",
        count > 0
      );

      notificationButton.title =
        count > 0
          ? `${count} notifikasi baru`
          : "Notifikasi";
    }


    window.SB_PORTAL_SET_NOTIFICATION_COUNT =
      setPortalNotificationCount;


    window.addEventListener(
      "sb:portal-notification-count",
      event => {
        setPortalNotificationCount(
          event?.detail?.count ?? 0
        );
      }
    );


    setPortalNotificationCount(
      window.SB_PORTAL_NOTIFICATION_UNREAD ?? 0
    );
  }


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

        .sb-portal-notification-body {
          max-height: min(420px, 70vh);
          overflow-y: auto;
        }

        .sb-portal-notification-item {
          position: relative;
          display: block;
          width: 100%;
          padding: 13px 16px;
          border: 0;
          border-bottom: 1px solid rgba(15,23,42,.07);
          background: #fff;
          color: #334155;
          text-align: left;
          cursor: pointer;
        }

        .sb-portal-notification-item:hover,
        .sb-portal-notification-item:focus-visible {
          background: #f8fafc;
          outline: none;
        }

        .sb-portal-notification-item.unread {
          background: #f0fdf4;
        }

        .sb-portal-notification-item.unread::before {
          content: "";
          position: absolute;
          top: 17px;
          left: 7px;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #16a34a;
        }

        .sb-portal-notification-item-title {
          display: block;
          padding-right: 8px;
          color: #16352c;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.45;
        }

        .sb-portal-notification-item-copy {
          display: block;
          margin-top: 4px;
          color: #64748b;
          font-size: 11px;
          line-height: 1.5;
        }

        .sb-portal-notification-item-action {
          display: block;
          margin-top: 7px;
          color: #178557;
          font-size: 10px;
          font-weight: 700;
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
          Pembaruan terbaru akun dan layanan Anda
        </span>
      </div>

      <div
        class="sb-portal-notification-body"
        data-portal-notification-body
      >
        <div class="sb-portal-notification-state">
          <strong>Memuat notifikasi...</strong>
          Mohon tunggu sebentar.
        </div>
      </div>
    `;

    topActions.appendChild(
      notificationPanel
    );


    const notificationBody =
      notificationPanel.querySelector(
        "[data-portal-notification-body]"
      );

    let notificationLoadInFlight = false;


    function escapePortalNotificationHtml(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }


    function renderClientNotifications(items) {
      const notifications =
        Array.isArray(items)
          ? items
          : [];

      if (!notifications.length) {
        notificationBody.innerHTML = `
          <div class="sb-portal-notification-state">
            <strong>Belum ada notifikasi baru</strong>
            Pembaruan dari Support dan layanan Client
            akan tampil di sini.
          </div>
        `;

        return;
      }

      notificationBody.innerHTML =
        notifications.map(notification => {
          const unread =
            !notification.read_at;

          const isSupport =
            notification.entity_type ===
              "support_ticket" &&
            Boolean(notification.entity_id);

          const actionText =
            isSupport
              ? "Buka tiket"
              : unread
                ? "Tandai telah dibaca"
                : "Sudah dibaca";

          return `
            <button
              type="button"
              class="sb-portal-notification-item${unread ? " unread" : ""}"
              data-client-notification-id="${escapePortalNotificationHtml(notification.id)}"
              data-client-notification-unread="${unread ? "1" : "0"}"
              data-client-notification-entity="${escapePortalNotificationHtml(notification.entity_type || "")}"
              data-client-notification-entity-id="${escapePortalNotificationHtml(notification.entity_id || "")}"
            >
              <span class="sb-portal-notification-item-title">
                ${escapePortalNotificationHtml(
                  notification.title || "Notifikasi"
                )}
              </span>

              ${
                notification.description
                  ? `
                    <span class="sb-portal-notification-item-copy">
                      ${escapePortalNotificationHtml(
                        notification.description
                      )}
                    </span>
                  `
                  : ""
              }

              <span class="sb-portal-notification-item-action">
                ${actionText}
              </span>
            </button>
          `;
        }).join("");
    }


    async function loadClientNotifications() {
      if (
        !window.SB_PORTAL_USER ||
        notificationLoadInFlight
      ) {
        return;
      }

      notificationLoadInFlight = true;

      try {
        const response =
          await fetch(
            "/api/client/notifications?limit=20",
            {
              credentials: "same-origin",
              headers: {
                Accept: "application/json"
              },
              cache: "no-store"
            }
          );

        const data =
          await response.json().catch(() => ({}));

        if (response.status === 401) {
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.error ||
            `HTTP ${response.status}`
          );
        }

        const notifications =
          Array.isArray(data.notifications)
            ? data.notifications
            : [];

        const unread =
          Number(data.unread_count || 0);

        window.SB_PORTAL_NOTIFICATION_UNREAD =
          Number.isFinite(unread)
            ? Math.max(0, unread)
            : 0;

        window
          .SB_PORTAL_SET_NOTIFICATION_COUNT?.(
            window.SB_PORTAL_NOTIFICATION_UNREAD
          );

        renderClientNotifications(
          notifications
        );
      }
      catch (error) {
        console.warn(
          "CLIENT_NOTIFICATION_LOAD_FAILED",
          error
        );

        notificationBody.innerHTML = `
          <div class="sb-portal-notification-state">
            <strong>Notifikasi belum dapat dimuat</strong>
            Silakan coba buka kembali panel notifikasi.
          </div>
        `;
      }
      finally {
        notificationLoadInFlight = false;
      }
    }


    async function markClientNotificationRead(id) {
      const response =
        await fetch(
          `/api/client/notifications/${encodeURIComponent(id)}/read`,
          {
            method: "PATCH",
            credentials: "same-origin",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({}),
            cache: "no-store"
          }
        );

      const data =
        await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
          `HTTP ${response.status}`
        );
      }

      return data;
    }


    async function openClientNotification(
      id,
      entityType,
      entityId,
      unread
    ) {
      if (unread) {
        try {
          await markClientNotificationRead(id);
        }
        catch (error) {
          console.warn(
            "CLIENT_NOTIFICATION_READ_FAILED",
            error
          );
        }

        await loadClientNotifications();
      }

      closePortalNotifications();

      if (
        entityType === "support_ticket" &&
        entityId &&
        typeof window
          .SB_PORTAL_OPEN_SUPPORT_TICKET ===
            "function"
      ) {
        await window
          .SB_PORTAL_OPEN_SUPPORT_TICKET(
            entityId
          );
      }
    }


    notificationPanel.addEventListener(
      "click",
      event => {
        const item =
          event.target.closest(
            "[data-client-notification-id]"
          );

        if (!item) return;

        event.preventDefault();
        event.stopPropagation();

        void openClientNotification(
          item.dataset.clientNotificationId,
          item.dataset.clientNotificationEntity,
          item.dataset.clientNotificationEntityId,
          item.dataset.clientNotificationUnread === "1"
        );
      }
    );


    notificationButton.addEventListener(
      "click",
      () => {
        if (window.SB_PORTAL_USER) {
          void loadClientNotifications();
        }
      }
    );


    window.addEventListener(
      "sb:portal-authenticated",
      () => {
        void loadClientNotifications();
      }
    );


    document.addEventListener(
      "visibilitychange",
      () => {
        if (
          document.visibilityState === "visible" &&
          window.SB_PORTAL_USER
        ) {
          void loadClientNotifications();
        }
      }
    );


    window.setInterval(
      () => {
        if (window.SB_PORTAL_USER) {
          void loadClientNotifications();
        }
      },
      45000
    );


    if (window.SB_PORTAL_USER) {
      void loadClientNotifications();
    }


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
