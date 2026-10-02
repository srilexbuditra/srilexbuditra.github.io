"use strict";

(() => {
  const KEY = "sb_demo_journey_r1";
  const LEAD_CODE = "LEAD-DEMO-2026-001";

  const $ = (id) => document.getElementById(id);

  const form = $("leadRegistrationForm");
  const success = $("registrationSuccess");
  const leadCode = $("registrationLeadCode");
  const message = $("registrationMessage");
  const feedback = $("leadCodeFeedback");

  function setValue(id, value) {
    const el = $(id);
    if (el) el.value = value;
  }

  function chooseOption(id, text) {
    const select = $(id);
    if (!select) return;

    const option = Array.from(select.options).find((item) =>
      String(item.textContent || "")
        .toLowerCase()
        .includes(text.toLowerCase())
    );

    if (option) select.value = option.value;
  }

  function setFeedback(text) {
    if (feedback) feedback.textContent = text || "";
  }

  function fillDemoData() {
    setValue("full_name", "Pengunjung Demo");
    setValue("company_name", "Perusahaan Demo");
    setValue("phone", "");
    setValue("email", "demo@srilexbuditra.work");
    setValue(
      "message",
      "Membutuhkan Website Company Profile profesional untuk profil bisnis, layanan, portfolio, dan kontak."
    );
    setValue("password", "Demo123!");
    setValue("confirm_password", "Demo123!");

    chooseOption(
      "service_interest",
      "Website Company Profile"
    );

    const consent = $("privacy_consent");
    if (consent) consent.checked = true;

    if (message) {
      message.textContent =
        "Data simulasi sudah diisi. Silakan tinjau lalu pilih Buat Akses Demo.";
      message.classList.add("is-success");
    }
  }

  function currentLeadCode() {
    return String(leadCode?.textContent || "").trim();
  }

  async function copyLeadCode() {
    const code = currentLeadCode();
    if (!code || code === "-") return;

    try {
      await navigator.clipboard.writeText(code);
      setFeedback("Kode Lead Demo berhasil disalin.");
    } catch {
      setFeedback("Salin kode secara manual: " + code);
    }
  }

  function saveLeadCode() {
    const code = currentLeadCode();
    if (!code || code === "-") return;

    const blob = new Blob(
      [
        "SRILEX BUDITRA - DEMO LEAD\n\n" +
        "Lead Code: " + code + "\n" +
        "Status: Data simulasi\n"
      ],
      { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "srilexbuditra-demo-lead-code.txt";
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFeedback("Kode Lead Demo berhasil disimpan.");
  }

  function syncWhatsapp() {
    const link = $("registrationWhatsappHelp");
    if (!link) return;

    const text =
      "Halo Srilex Buditra, saya sedang mencoba Demo Registrasi.\n\n" +
      "*Lead Code Demo:* " + LEAD_CODE + "\n\n" +
      "Saya memerlukan bantuan untuk memahami alur layanan.";

    link.href =
      "https://wa.me/6282136238350?text=" +
      encodeURIComponent(text);
  }

  function showSuccess(data) {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        version: 1,
        registered: true,
        lead_code: LEAD_CODE,
        full_name: data.full_name,
        company_name: data.company_name,
        email: data.email,
        service_interest: data.service_interest,
        message: data.message,
        registered_at: new Date().toISOString()
      })
    );

    /* Selalu mulai Demo Lead dari Tahap 1 */
    sessionStorage.removeItem("sb_lead_demo_r1");

    leadCode.textContent = LEAD_CODE;

    form.hidden = true;
    success.hidden = false;

    document
      .querySelector(".registration-card")
      ?.classList.add("is-success-focus");

    syncWhatsapp();

    success.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const password = String($("password")?.value || "");
    const confirm = String($("confirm_password")?.value || "");

    if (password !== confirm) {
      message.textContent =
        "Konfirmasi password Demo belum sama.";
      message.classList.remove("is-success");
      return;
    }

    const data = {
      full_name:
        String($("full_name")?.value || "").trim(),
      company_name:
        String($("company_name")?.value || "").trim(),
      email:
        String($("email")?.value || "").trim(),
      service_interest:
        String($("service_interest")?.value || "").trim(),
      message:
        String($("message")?.value || "").trim()
    };

    showSuccess(data);
  });

  $("fillDemoData")?.addEventListener(
    "click",
    fillDemoData
  );

  $("copyLeadCode")?.addEventListener(
    "click",
    copyLeadCode
  );

  $("saveLeadCode")?.addEventListener(
    "click",
    saveLeadCode
  );

  syncWhatsapp();
})();