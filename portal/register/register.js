(() => {
  "use strict";

  const allowedServices = new Set([
    "Website Company Profile",
    "Web Application",
    "REST API / Backend",
    "Sistem Informasi Custom",
    "Database Development",
    "Deployment & Cloud"
  ]);

  const form = document.getElementById("leadRegistrationForm");
  const message = document.getElementById("registrationMessage");
  const submit = document.getElementById("submitRegistration");
  const success = document.getElementById("registrationSuccess");
  const leadCode = document.getElementById("registrationLeadCode");
  const copyLeadCode = document.getElementById("copyLeadCode");
  const saveLeadCode = document.getElementById("saveLeadCode");
  const registrationWhatsappHelp = document.getElementById("registrationWhatsappHelp");
  const leadCodeFeedback = document.getElementById("leadCodeFeedback");
  const serviceSelect = document.getElementById("service_interest");
  const copyrightYear = document.getElementById("copyrightYear");

  if (copyrightYear) {
    copyrightYear.textContent =
      String(new Date().getFullYear());
  }

  function setMessage(text, successState = false) {
    message.textContent = text || "";
    message.classList.toggle("is-success", Boolean(successState));
  }

  function applyServiceFromQuery() {
    const service = new URLSearchParams(window.location.search).get("service");

    if (service && allowedServices.has(service)) {
      serviceSelect.value = service;
    }
  }

  async function readJson(response) {
    try {
      return await response.json();
    } catch {
      return {};
    }
  }

  function syncRegistrationHelp() {
    const code = currentLeadCode();
    if (!registrationWhatsappHelp || !code) return;

    const text =
      "Halo Srilex Buditra, saya memerlukan bantuan terkait proses Lead saya.\n\n" +
      "*Lead Code:* " + code + "\n\n" +
      "Registrasi Lead saya sudah diterima.\n" +
      "Mohon bantuannya terkait langkah berikutnya. Terima kasih.";

    registrationWhatsappHelp.href =
      "https://wa.me/6282136238350?text=" +
      encodeURIComponent(text);
  }

  function currentLeadCode() {
    const value = String(leadCode?.textContent || "").trim();
    return value && value !== "-" ? value : "";
  }

  function setLeadCodeFeedback(text) {
    if (leadCodeFeedback) {
      leadCodeFeedback.textContent = text || "";
    }
  }

  async function copyCurrentLeadCode() {
    const code = currentLeadCode();

    if (!code) {
      setLeadCodeFeedback("Kode Lead belum tersedia.");
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setLeadCodeFeedback("Kode Lead berhasil disalin.");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();

      const copied = document.execCommand("copy");
      textarea.remove();

      setLeadCodeFeedback(
        copied
          ? "Kode Lead berhasil disalin."
          : "Kode Lead belum dapat disalin otomatis."
      );
    }
  }

  function saveCurrentLeadCode() {
    const code = currentLeadCode();

    if (!code) {
      setLeadCodeFeedback("Kode Lead belum tersedia.");
      return;
    }

    const content = [
      "SRILEX BUDITRA - LEAD PORTAL",
      `Kode Lead: ${code}`,
      `Portal: ${window.location.origin}/portal/`
    ].join("\r\n");

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `srilexbuditra-${code.toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    setLeadCodeFeedback("Kode Lead berhasil disimpan.");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!form.reportValidity()) {
      return;
    }

    const data = new FormData(form);
    const password = String(data.get("password") || "");
    const confirmPassword = String(data.get("confirm_password") || "");

    if (password !== confirmPassword) {
      setMessage("Konfirmasi password belum sama.");
      document.getElementById("confirm_password")?.focus();
      return;
    }

    const payload = {
      full_name: String(data.get("full_name") || "").trim(),
      company_name: String(data.get("company_name") || "").trim() || null,
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim() || null,
      service_interest: String(data.get("service_interest") || ""),
      message: String(data.get("message") || "").trim() || null,
      password,
      privacy_consent: data.get("privacy_consent") === "on"
    };

    submit.disabled = true;
    submit.textContent = "Membuat akses Portal...";

    try {
      const response = await fetch("/api/public/lead/register", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await readJson(response);

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Registrasi belum dapat diproses.");
      }

      form.reset();
      form.hidden = true;
      success.hidden = false;

      /* REGISTRATION SUCCESS FOCUS R1 */
      form.hidden = true;
      document
        .querySelector(".registration-card")
        ?.classList.add("is-success-focus");
      leadCode.textContent = result?.lead?.lead_code || "-";
      syncRegistrationHelp();
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Registrasi belum dapat diproses. Silakan coba kembali."
      );
    } finally {
      submit.disabled = false;
      submit.textContent = "Buat Akses & Mulai Konsultasi";
    }
  }

  applyServiceFromQuery();
  form.addEventListener("submit", handleSubmit);
  copyLeadCode?.addEventListener("click", copyCurrentLeadCode);
  saveLeadCode?.addEventListener("click", saveCurrentLeadCode);
})();