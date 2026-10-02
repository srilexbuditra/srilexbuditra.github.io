"use strict";

(() => {
  const KEY = "sb_demo_journey_r1";
  const LEAD_KEY = "sb_lead_demo_r1";
  const DEMO_EMAIL = "demo@srilexbuditra.work";
  const DEMO_PASSWORD = "Demo123!";

  const form =
    document.getElementById("demoLoginForm");

  const email =
    document.getElementById("demoLoginEmail");

  const password =
    document.getElementById("demoLoginPassword");

  const message =
    document.getElementById("demoLoginMessage");

  const fillButton =
    document.getElementById("fillDemoAccess");

  function readJourney() {
    try {
      return JSON.parse(
        sessionStorage.getItem(KEY) || "null"
      );
    } catch {
      return null;
    }
  }

  function createDefaultJourney() {
    return {
      version: 1,
      registered: true,
      lead_code: "LEAD-DEMO-2026-001",
      full_name: "Pengunjung Demo",
      company_name: "Perusahaan Demo",
      email: DEMO_EMAIL,
      service_interest: "Website Company Profile",
      message:
        "Membutuhkan Website Company Profile profesional untuk profil bisnis, layanan, portfolio, dan kontak.",
      registered_at: new Date().toISOString()
    };
  }

  function saveJourney(data) {
    sessionStorage.setItem(
      KEY,
      JSON.stringify(data)
    );
  }

  function showMessage(text, success = false) {
    if (!message) return;

    message.textContent = text || "";
    message.style.color =
      success ? "#86efac" : "#fca5a5";
  }

  function fillAccess() {
    let journey = readJourney();

    if (!journey) {
      journey = createDefaultJourney();
      saveJourney(journey);
    }

    email.value =
      journey.email || DEMO_EMAIL;

    password.value =
      DEMO_PASSWORD;

    showMessage(
      "Akses Demo sudah diisi. Pilih Masuk Demo untuk melanjutkan.",
      true
    );
  }

  function syncExistingJourney() {
    const journey = readJourney();

    if (!journey) return;

    email.value =
      journey.email || DEMO_EMAIL;

    showMessage(
      "Data Demo Registrasi ditemukan. Lengkapi akses Demo untuk melanjutkan.",
      true
    );
  }

  form?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      let journey = readJourney();

      if (!journey) {
        journey = createDefaultJourney();
      }

      const expectedEmail =
        String(
          journey.email || DEMO_EMAIL
        ).trim().toLowerCase();

      const enteredEmail =
        String(email.value || "")
          .trim()
          .toLowerCase();

      const enteredPassword =
        String(password.value || "");

      if (
        enteredEmail !== expectedEmail ||
        enteredPassword !== DEMO_PASSWORD
      ) {
        showMessage(
          "Akses Demo belum sesuai. Gunakan tombol Isi Akses Demo."
        );
        return;
      }

      journey.demo_login = true;
      journey.demo_login_at =
        new Date().toISOString();

      saveJourney(journey);

      /* Demo Lead selalu mulai dari Tahap 1 */
      sessionStorage.removeItem(LEAD_KEY);

      showMessage(
        "Login Demo berhasil. Membuka Demo Lead Portal...",
        true
      );

      window.setTimeout(() => {
        window.location.href =
          "/portal/demo/lead/";
      }, 450);
    }
  );

  fillButton?.addEventListener(
    "click",
    fillAccess
  );

  syncExistingJourney();
})();