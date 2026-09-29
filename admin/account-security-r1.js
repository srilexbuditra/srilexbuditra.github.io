(() => {
  "use strict";
  /*
   * SB_ACCOUNT_SECURITY_SELF_R1
   * Self Account & Security:
   * System Admin + Staff.
   */
  const FLAG =
    "sbAccountSecuritySelfR1";
  if (
    document.documentElement.dataset[FLAG] ===
    "1"
  ) {
    return;
  }
  document.documentElement.dataset[FLAG] =
    "1";
  const STYLE_ID =
    "sb-account-security-self-r1-styles";
  function addStyles() {
    if (
      document.getElementById(STYLE_ID)
    ) {
      return;
    }
    const style =
      document.createElement("style");
    style.id =
      STYLE_ID;
    style.textContent = `
      .sb-account-security-trigger {
        width: 100%;
        border: 0;
        border-radius: 9px;
        padding: 10px;
        background: transparent;
        color: inherit;
        text-align: left;
        font: inherit;
        font-weight: 750;
        cursor: pointer;
      }
      .sb-account-security-trigger:hover {
        background: #f8faf9;
      }
      .sb-account-security-modal {
        position: fixed;
        inset: 0;
        z-index: 100001;
        display: grid;
        place-items: center;
        padding: 20px;
      }
      .sb-account-security-modal[hidden] {
        display: none !important;
      }
      .sb-account-security-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(6,25,18,.64);
        backdrop-filter: blur(4px);
      }
      .sb-account-security-card {
        position: relative;
        width: min(100%,560px);
        max-height: calc(100vh - 40px);
        overflow: auto;
        box-sizing: border-box;
        padding: 24px;
        border: 1px solid rgba(15,23,42,.10);
        border-radius: 20px;
        background: #fff;
        color: #10231b;
        box-shadow: 0 24px 70px rgba(0,0,0,.28);
      }
      .sb-account-security-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 20px;
      }
      .sb-account-security-head h2 {
        margin: 0 0 6px;
        font-size: 23px;
      }
      .sb-account-security-head p {
        margin: 0;
        color: #64748b;
        font-size: 13px;
        line-height: 1.55;
      }
      .sb-account-security-close {
        width: 38px;
        height: 38px;
        flex: 0 0 auto;
        border: 1px solid #dbe3df;
        border-radius: 10px;
        background: #fff;
        color: #10231b;
        font-size: 22px;
        cursor: pointer;
      }
      .sb-account-security-summary {
        margin-bottom: 20px;
        padding: 14px;
        border: 1px solid #e2e8e5;
        border-radius: 14px;
        background: #f8faf9;
      }
      .sb-account-security-summary strong,
      .sb-account-security-summary span {
        display: block;
      }
      .sb-account-security-summary strong {
        margin-bottom: 4px;
        font-size: 14px;
      }
      .sb-account-security-summary span {
        color: #64748b;
        font-size: 12px;
        line-height: 1.5;
        overflow-wrap: anywhere;
      }
      .sb-account-security-section h3 {
        margin: 0 0 5px;
        color: #16352c;
        font-size: 16px;
      }
      .sb-account-security-section > p {
        margin: 0 0 14px;
        color: #64748b;
        font-size: 12px;
        line-height: 1.55;
      }
      .sb-account-security-divider {
        height: 1px;
        margin: 22px 0;
        background: #e2e8e5;
      }
      .sb-account-security-form {
        display: grid;
        gap: 14px;
      }
      .sb-account-security-field {
        display: grid;
        gap: 7px;
      }
      .sb-account-security-field label {
        color: #334155;
        font-size: 12px;
        font-weight: 800;
      }
      .sb-account-security-field input {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #d8e1dc;
        border-radius: 12px;
        padding: 12px 13px;
        background: #fff;
        color: #10231b;
        font: inherit;
        outline: none;
      }
      .sb-account-security-field input:focus {
        border-color: #168a63;
        box-shadow: 0 0 0 3px rgba(22,138,99,.10);
      }
      .sb-account-security-message {
        min-height: 18px;
        color: #b42318;
        font-size: 12px;
        line-height: 1.5;
      }
      .sb-account-security-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
      .sb-account-security-actions button {
        border-radius: 11px;
        padding: 10px 15px;
        font: inherit;
        font-weight: 800;
        cursor: pointer;
      }
      .sb-account-security-secondary {
        border: 1px solid #d8e1dc;
        background: #fff;
        color: #334155;
      }
      .sb-account-security-primary {
        border: 1px solid #168a63;
        background: #168a63;
        color: #fff;
      }
      .sb-account-security-actions button:disabled {
        opacity: .6;
        cursor: wait;
      }
      @media (max-width:560px) {
        .sb-account-security-modal {
          padding: 12px;
        }
        .sb-account-security-card {
          padding: 20px 16px;
          border-radius: 16px;
        }
        .sb-account-security-actions {
          flex-direction: column-reverse;
        }
        .sb-account-security-actions button {
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
  }
  async function readJson(response) {
    try {
      return await response.json();
    }
    catch {
      return {};
    }
  }
  function roleLabel(user) {
    return user?.role === "staff"
      ? "Staff"
      : "System Admin";
  }
  function initials(name) {
    const parts =
      String(name || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    return (
      parts
        .slice(0,2)
        .map(part =>
          part.charAt(0).toUpperCase()
        )
        .join("") ||
      "SA"
    );
  }
  function closeAccountMenu() {
    const menu =
      document.getElementById(
        "sb-auth-user"
      );
    const profile =
      document.querySelector(
        ".profile"
      );
    if (menu) {
      menu.hidden = true;
    }
    profile?.setAttribute(
      "aria-expanded",
      "false"
    );
  }
  function updateVisibleName(name) {
    const menuName =
      document.querySelector(
        "#sb-auth-user .sb-account-name"
      );
    if (menuName) {
      menuName.textContent =
        name;
    }
    const profileName =
      document.querySelector(
        ".profile .profile-copy strong"
      );
    if (profileName) {
      profileName.textContent =
        name;
    }
    const avatar =
      document.querySelector(
        ".profile .avatar"
      );
    if (avatar) {
      avatar.textContent =
        initials(name);
    }
  }
  function openAccountSecurity() {
    const user =
      window.SB_AUTH_USER;
    if (
      !user ||
      ![
        "system_admin",
        "staff"
      ].includes(user.role)
    ) {
      return;
    }
    document
      .getElementById(
        "sb-account-security-self-r1"
      )
      ?.remove();
    const modal =
      document.createElement("div");
    modal.id =
      "sb-account-security-self-r1";
    modal.className =
      "sb-account-security-modal";
    modal.innerHTML = `
      <div
        class="sb-account-security-backdrop"
        data-account-security-close
      ></div>
      <section
        class="sb-account-security-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sbAccountSecurityTitle"
      >
        <div class="sb-account-security-head">
          <div>
            <h2 id="sbAccountSecurityTitle">
              Akun &amp; Keamanan
            </h2>
            <p>
              Kelola nama akun dan password Anda sendiri.
            </p>
          </div>
          <button
            class="sb-account-security-close"
            type="button"
            aria-label="Tutup"
            data-account-security-close
          >
            &times;
          </button>
        </div>
        <div class="sb-account-security-summary">
          <strong>
            ${roleLabel(user)}
          </strong>
          <span>
            ${String(user.email || "")}
          </span>
        </div>
        <section class="sb-account-security-section">
          <h3>Profil Akun</h3>
          <p>
            Perubahan nama hanya berlaku untuk akun Anda sendiri.
          </p>
          <form
            class="sb-account-security-form"
            data-account-profile-form
          >
            <div class="sb-account-security-field">
              <label for="sb-account-full-name">
                Nama lengkap
              </label>
              <input
                id="sb-account-full-name"
                name="full_name"
                type="text"
                minlength="2"
                maxlength="120"
                autocomplete="name"
                required
              >
            </div>
            <div
              class="sb-account-security-message"
              data-account-profile-message
              role="status"
              aria-live="polite"
            ></div>
            <div class="sb-account-security-actions">
              <button
                class="sb-account-security-primary"
                type="submit"
              >
                Simpan Nama
              </button>
            </div>
          </form>
        </section>
        <div class="sb-account-security-divider"></div>
        <section class="sb-account-security-section">
          <h3>Ubah Password</h3>
          <p>
            Password baru harus 6-30 karakter.
          </p>
          <form
            class="sb-account-security-form"
            data-account-password-form
          >
            <div class="sb-account-security-field">
              <label for="sb-account-current-password">
                Password saat ini
              </label>
              <input
                id="sb-account-current-password"
                name="current_password"
                type="password"
                autocomplete="current-password"
                required
              >
            </div>
            <div class="sb-account-security-field">
              <label for="sb-account-new-password">
                Password baru
              </label>
              <input
                id="sb-account-new-password"
                name="new_password"
                type="password"
                minlength="6"
                maxlength="30"
                autocomplete="new-password"
                required
              >
            </div>
            <div class="sb-account-security-field">
              <label for="sb-account-confirm-password">
                Ulangi password baru
              </label>
              <input
                id="sb-account-confirm-password"
                name="confirm_password"
                type="password"
                minlength="6"
                maxlength="30"
                autocomplete="new-password"
                required
              >
            </div>
            <div
              class="sb-account-security-message"
              data-account-password-message
              role="status"
              aria-live="polite"
            ></div>
            <div class="sb-account-security-actions">
              <button
                class="sb-account-security-secondary"
                type="button"
                data-account-security-close
              >
                Batal
              </button>
              <button
                class="sb-account-security-primary"
                type="submit"
              >
                Simpan Password
              </button>
            </div>
          </form>
        </section>
      </section>
    `;
    document.body.appendChild(
      modal
    );
    const profileForm =
      modal.querySelector(
        "[data-account-profile-form]"
      );
    const profileMessage =
      modal.querySelector(
        "[data-account-profile-message]"
      );
    const fullName =
      modal.querySelector(
        "#sb-account-full-name"
      );
    const passwordForm =
      modal.querySelector(
        "[data-account-password-form]"
      );
    const passwordMessage =
      modal.querySelector(
        "[data-account-password-message]"
      );
    fullName.value =
      String(
        user.full_name || ""
      );
    let closed =
      false;
    function closeModal() {
      if (closed) {
        return;
      }
      closed = true;
      document.removeEventListener(
        "keydown",
        handleKeydown
      );
      modal.remove();
    }
    function handleKeydown(event) {
      if (event.key === "Escape") {
        closeModal();
      }
    }
    modal
      .querySelectorAll(
        "[data-account-security-close]"
      )
      .forEach(button => {
        button.addEventListener(
          "click",
          closeModal
        );
      });
    document.addEventListener(
      "keydown",
      handleKeydown
    );
    profileForm.addEventListener(
      "submit",
      async event => {
        event.preventDefault();
        const name =
          String(
            fullName.value || ""
          ).trim();
        profileMessage.textContent =
          "";
        profileMessage.style.color =
          "";
        if (
          name.length < 2 ||
          name.length > 120
        ) {
          profileMessage.textContent =
            "Nama lengkap harus 2-120 karakter.";
          return;
        }
        const submit =
          profileForm.querySelector(
            'button[type="submit"]'
          );
        submit.disabled =
          true;
        submit.textContent =
          "Menyimpan...";
        try {
          const response =
            await fetch(
              "/api/auth/profile",
              {
                method: "POST",
                credentials:
                  "same-origin",
                headers: {
                  Accept:
                    "application/json",
                  "Content-Type":
                    "application/json"
                },
                body:
                  JSON.stringify({
                    full_name: name
                  })
              }
            );
          const result =
            await readJson(
              response
            );
          if (!response.ok) {
            throw new Error(
              result.error ||
              "Nama belum dapat diperbarui."
            );
          }
          const savedName =
            String(
              result?.user?.full_name ||
              result?.full_name ||
              name
            );
          window.SB_AUTH_USER = {
            ...(
              window.SB_AUTH_USER ||
              user
            ),
            ...(
              result?.user ||
              {}
            ),
            full_name:
              savedName
          };
          updateVisibleName(
            savedName
          );
          profileMessage.style.color =
            "#168a63";
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
          submit.disabled =
            false;
          submit.textContent =
            "Simpan Nama";
        }
      }
    );
    passwordForm.addEventListener(
      "submit",
      async event => {
        event.preventDefault();
        const data =
          new FormData(
            passwordForm
          );
        const currentPassword =
          String(
            data.get(
              "current_password"
            ) || ""
          );
        const newPassword =
          String(
            data.get(
              "new_password"
            ) || ""
          );
        const confirmPassword =
          String(
            data.get(
              "confirm_password"
            ) || ""
          );
        passwordMessage.textContent =
          "";
        passwordMessage.style.color =
          "";
        if (
          newPassword.length < 6 ||
          newPassword.length > 30
        ) {
          passwordMessage.textContent =
            "Password baru harus 6-30 karakter.";
          return;
        }
        if (
          newPassword !==
          confirmPassword
        ) {
          passwordMessage.textContent =
            "Konfirmasi password baru tidak sama.";
          return;
        }
        if (
          currentPassword ===
          newPassword
        ) {
          passwordMessage.textContent =
            "Password baru harus berbeda dari password saat ini.";
          return;
        }
        const submit =
          passwordForm.querySelector(
            'button[type="submit"]'
          );
        submit.disabled =
          true;
        submit.textContent =
          "Menyimpan...";
        try {
          const response =
            await fetch(
              "/api/auth/change-password",
              {
                method: "POST",
                credentials:
                  "same-origin",
                headers: {
                  Accept:
                    "application/json",
                  "Content-Type":
                    "application/json"
                },
                body:
                  JSON.stringify({
                    current_password:
                      currentPassword,
                    new_password:
                      newPassword
                  })
              }
            );
          const result =
            await readJson(
              response
            );
          if (!response.ok) {
            throw new Error(
              result.error ||
              "Password belum dapat diubah."
            );
          }
          passwordForm.reset();
          passwordMessage.style.color =
            "#168a63";
          passwordMessage.textContent =
            "Password berhasil diubah.";
        }
        catch (error) {
          passwordMessage.textContent =
            error instanceof Error
              ? error.message
              : "Password belum dapat diubah.";
        }
        finally {
          submit.disabled =
            false;
          submit.textContent =
            "Simpan Password";
        }
      }
    );
    window.setTimeout(
      () => {
        fullName?.focus();
      },
      0
    );
  }
  function enhanceMenu(menu) {
    if (
      !(menu instanceof HTMLElement) ||
      menu.dataset.sbAccountSecuritySelfR1 ===
        "1"
    ) {
      return;
    }
    const actions =
      menu.querySelector(
        ".sb-account-actions"
      );
    const logout =
      menu.querySelector(
        ".sb-auth-logout"
      );
    if (
      !actions ||
      !logout
    ) {
      return;
    }
    const button =
      document.createElement(
        "button"
      );
    button.type =
      "button";
    button.className =
      "sb-account-security-trigger";
    button.textContent =
      "Akun & Keamanan";
    button.setAttribute(
      "role",
      "menuitem"
    );
    button.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();
        closeAccountMenu();
        openAccountSecurity();
      }
    );
    actions.insertBefore(
      button,
      logout
    );
    menu.dataset.sbAccountSecuritySelfR1 =
      "1";
  }
  function scan(root) {
    if (
      root instanceof HTMLElement &&
      root.id === "sb-auth-user"
    ) {
      enhanceMenu(root);
    }
    if (
      !root ||
      typeof root.querySelector !==
        "function"
    ) {
      return;
    }
    const menu =
      root.querySelector(
        "#sb-auth-user"
      );
    if (menu) {
      enhanceMenu(menu);
    }
  }
  addStyles();
  scan(document);
  const observer =
    new MutationObserver(
      mutations => {
        for (
          const mutation of mutations
        ) {
          for (
            const node of
            mutation.addedNodes
          ) {
            if (
              node.nodeType ===
              Node.ELEMENT_NODE
            ) {
              scan(node);
            }
          }
        }
      }
    );
  observer.observe(
    document.documentElement,
    {
      childList: true,
      subtree: true
    }
  );
})();
