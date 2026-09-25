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
            Keamanan Akun
          </h2>
          <p>
            Ubah password Client Portal Anda.
            Password baru minimal 12 karakter.
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

      <form class="sb-qa-security-form" data-qa-security-form>
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
            minlength="12"
            maxlength="128"
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
            minlength="12"
            maxlength="128"
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
  `;

  document.body.appendChild(securityModal);

  const securityForm =
    securityModal.querySelector(
      "[data-qa-security-form]"
    );

  const securityMessage =
    securityModal.querySelector(
      "[data-qa-security-message]"
    );

  function openSecurity() {
    securityForm.reset();
    securityMessage.textContent = "";
    securityMessage.style.color = "";

    securityModal.hidden = false;

    window.setTimeout(() => {
      securityModal
        .querySelector("#sb-qa-current-password")
        ?.focus();
    }, 0);
  }

  function closeSecurity() {
    securityModal.hidden = true;
    securityForm.reset();
    securityMessage.textContent = "";
    securityMessage.style.color = "";
  }

  securityModal
    .querySelectorAll("[data-qa-security-close]")
    .forEach(button => {
      button.addEventListener(
        "click",
        closeSecurity
      );
    });

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

      if (newPassword.length < 12) {
        securityMessage.textContent =
          "Password baru minimal 12 karakter.";
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