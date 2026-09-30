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
  const serviceSelect = document.getElementById("service_interest");

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
      leadCode.textContent = result?.lead?.lead_code || "-";
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
})();