(() => {
  "use strict";

  const API_BASE = "/api";

  const statusMap = {
    new: {
      label: "Registrasi diterima",
      step: 1,
      next: "Tim akan meninjau registrasi dan kebutuhan awal Anda."
    },
    contacted: {
      label: "Konsultasi berlangsung",
      step: 2,
      next: "Lanjutkan komunikasi untuk melengkapi kebutuhan project."
    },
    qualified: {
      label: "Kebutuhan terverifikasi",
      step: 3,
      next: "Kebutuhan utama telah terverifikasi. Tahap berikutnya adalah penyusunan penawaran resmi."
    },
    converted: {
      label: "Akun Client aktif",
      step: 5,
      next: "Proses Lead telah selesai dan akun Client telah aktif."
    },
    lost: {
      label: "Proses tidak dilanjutkan",
      step: 0,
      next: "Proses konsultasi saat ini tidak dilanjutkan."
    }
  };

  const loading = document.getElementById("leadLoading");
  const errorPanel = document.getElementById("leadError");
  const errorMessage = document.getElementById("leadErrorMessage");
  const dashboard = document.getElementById("leadDashboard");
  const retry = document.getElementById("leadRetry");
  const logout = document.getElementById("leadLogout");

  /* SB_LEAD_CONSULTATION_UI_R1 */
  const consultationForm =
    document.getElementById("consultationForm");
  const consultationState =
    document.getElementById("consultationState");
  const consultService =
    document.getElementById("consultService");
  const consultPackage =
    document.getElementById("consultPackage");
  const consultDomainMode =
    document.getElementById("consultDomainMode");
  const consultDomainName =
    document.getElementById("consultDomainName");
  const consultDomainNameField =
    document.getElementById("consultDomainNameField");
  const consultDomainCheck =
    document.getElementById("consultDomainCheck");
  const consultDomainResult =
    document.getElementById("consultDomainResult");
  const consultHosting =
    document.getElementById("consultHosting");
  const consultTimeline =
    document.getElementById("consultTimeline");
  const consultTargetDate =
    document.getElementById("consultTargetDate");
  const consultTargetDateField =
    document.getElementById("consultTargetDateField");
  const consultDescription =
    document.getElementById("consultDescription");
  const consultEstimate =
    document.getElementById("consultEstimate");
  const consultSubmit =
    document.getElementById("consultSubmit");
  const consultFeedback =
    document.getElementById("consultFeedback");

  let currentLead = null;

  function api(path, options = {}) {
    return fetch(`${API_BASE}${path}`, {
      credentials: "same-origin",
      cache: "no-store",
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

  function showError(text) {
    loading.hidden = true;
    dashboard.hidden = true;
    errorPanel.hidden = false;
    errorMessage.textContent = text || "Data konsultasi belum dapat dimuat.";
  }

  function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  }

  function renderProgress(status) {
    const state = statusMap[status] || statusMap.new;
    const steps = Array.from(
      document.querySelectorAll("#progressSteps [data-step]")
    );

    steps.forEach((element) => {
      const step = Number(element.dataset.step || 0);
      element.classList.toggle("is-done", state.step > 0 && step < state.step);
      element.classList.toggle("is-current", state.step > 0 && step === state.step);
    });

    const percent = state.step > 0
      ? Math.max(20, Math.min(100, state.step * 20))
      : 0;

    document.getElementById("progressBar").style.width = `${percent}%`;
    document.getElementById("progressLabel").textContent =
      state.step > 0
        ? `Tahap ${state.step} dari 5`
        : "Proses tidak aktif";

    document.getElementById("friendlyStatus").textContent = state.label;
    document.getElementById("nextAction").textContent = state.next;
  }

  /* SB_LEAD_SERVICE_INTEREST_FRONTEND_R1 */
  function renderServiceActions(lead) {
    const primaryService =
      String(lead.service_interest || "").trim();

    const additionalServices =
      new Set(
        (Array.isArray(lead.service_interests)
          ? lead.service_interests
          : []
        )
          .map((item) =>
            String(item?.service_name || "").trim()
          )
          .filter(Boolean)
      );

    const canSelect =
      ["new", "contacted", "qualified"]
        .includes(lead.status);

    document
      .querySelectorAll(".services-grid [data-service]")
      .forEach((card) => {
        const serviceName =
          String(card.dataset.service || "").trim();

        const button =
          card.querySelector("[data-service-action]");

        if (!button) return;

        card.classList.remove("is-selected");

        if (serviceName === primaryService) {
          card.classList.add("is-selected");
          button.disabled = true;
          button.textContent = "\u2713 Layanan dipilih";
          return;
        }

        if (additionalServices.has(serviceName)) {
          card.classList.add("is-selected");
          button.disabled = true;
          button.textContent = "\u2713 Sudah diminati";
          return;
        }

        button.disabled = !canSelect;
        button.textContent =
          canSelect
            ? "+ Tambah"
            : "Tidak tersedia";
      });

    const feedback =
      document.getElementById("serviceFeedback");

    if (feedback) {
      feedback.classList.remove(
        "is-success",
        "is-error"
      );

      feedback.textContent =
        canSelect
          ? "Pilih layanan tambahan yang sesuai dengan kebutuhan Anda."
          : "Pemilihan layanan tambahan tidak tersedia pada status konsultasi ini.";
    }
  }

  /* SB_LEAD_CONSULTATION_UI_R1 */
  const extraValueByLabel = {
    "Form / WhatsApp": "500000",
    "Dashboard Admin": "1000000",
    "Login & Role": "1500000",
    "Integrasi API": "2500000"
  };

  function formatRupiah(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return "Konsultasi";
    return `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;
  }

  function selectedExtraValuesFromLead(lead) {
    return String(lead.extra_feature || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((label) => extraValueByLabel[label])
      .filter(Boolean);
  }

  /* SB_LEAD_WORKFLOW_INLINE_SERVICES_DOMAIN_R1 */
  let consultDomainCheckSequence = 0;

  function normalizeConsultDomain(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split(/[/?#]/)[0]
      .replace(/\.$/, "");
  }

  function resetConsultDomainResult() {
    consultDomainCheckSequence += 1;

    if (consultDomainCheck) {
      const editable =
        currentLead &&
        ["new", "contacted"].includes(currentLead.status);

      consultDomainCheck.disabled = !editable;
      consultDomainCheck.textContent = "Cek Ketersediaan";
    }

    if (!consultDomainResult) return;

    consultDomainResult.hidden = true;
    consultDomainResult.className = "consult-domain-result";
    consultDomainResult.textContent = "";
  }

  function showConsultDomainResult(type, title, detail = "") {
    if (!consultDomainResult) return;

    consultDomainResult.hidden = false;
    consultDomainResult.className =
      `consult-domain-result is-${type}`;

    consultDomainResult.textContent = "";

    const strong = document.createElement("strong");
    strong.textContent = title;
    consultDomainResult.appendChild(strong);

    if (detail) {
      const small = document.createElement("small");
      small.textContent = detail;
      consultDomainResult.appendChild(small);
    }
  }

  function renderSavedConsultDomainState(lead) {
    resetConsultDomainResult();

    if (
      consultDomainMode.value !== "new" ||
      !lead.domain_name
    ) {
      return;
    }

    const domain =
      normalizeConsultDomain(lead.domain_name);

    if (!domain) return;

    if (lead.domain_status === "unregistered") {
      showConsultDomainResult(
        "success",
        `${domain} belum terdaftar`,
        "Kandidat tersedia pada pengecekan terakhir. Ketersediaan akan dikonfirmasi ulang saat kebutuhan disimpan."
      );
      return;
    }

    if (lead.domain_status === "registered") {
      showConsultDomainResult(
        "error",
        `${domain} sudah terdaftar`,
        "Silakan gunakan nama domain lain."
      );
      return;
    }

    if (lead.domain_status) {
      showConsultDomainResult(
        "warning",
        "Status domain belum dapat dikonfirmasi.",
        "Gunakan Cek Ketersediaan untuk memeriksa kembali."
      );
    }
  }

  async function checkConsultDomainAvailability() {
    if (
      consultDomainMode.value !== "new" ||
      !consultDomainCheck
    ) {
      return;
    }

    const domain =
      normalizeConsultDomain(consultDomainName.value);

    if (!domain) {
      showConsultDomainResult(
        "warning",
        "Masukkan nama domain terlebih dahulu.",
        "Contoh: namabisnis.com"
      );
      consultDomainName.focus();
      return;
    }

    const requestNumber =
      ++consultDomainCheckSequence;

    consultDomainCheck.disabled = true;
    consultDomainCheck.textContent = "Memeriksa...";

    showConsultDomainResult(
      "loading",
      `Memeriksa ${domain}...`,
      "Menghubungi registry domain."
    );

    try {
      const response =
        await api(
          `/public/domain-check?domain=${encodeURIComponent(domain)}`
        );

      const data =
        await readJson(response);

      if (
        requestNumber !== consultDomainCheckSequence
      ) {
        return;
      }

      if (!response.ok || !data?.ok) {
        showConsultDomainResult(
          "error",
          "Nama domain tidak dapat diperiksa.",
          data?.error || "Periksa kembali nama domain."
        );
        return;
      }

      const checkedDomain =
        data.domain || domain;

      if (data.status === "unregistered") {
        showConsultDomainResult(
          "success",
          `${checkedDomain} belum terdaftar`,
          "Kandidat tersedia. Ketersediaan akan dikonfirmasi ulang saat kebutuhan disimpan."
        );
      } else if (data.status === "registered") {
        showConsultDomainResult(
          "error",
          `${checkedDomain} sudah terdaftar`,
          "Silakan coba nama domain lain."
        );
      } else {
        showConsultDomainResult(
          "warning",
          "Status domain belum dapat dikonfirmasi.",
          "Silakan coba kembali atau gunakan nama domain lain."
        );
      }
    } catch (error) {
      if (
        requestNumber !== consultDomainCheckSequence
      ) {
        return;
      }

      showConsultDomainResult(
        "error",
        "Pengecekan domain gagal.",
        "Periksa koneksi dan coba kembali."
      );
    } finally {
      if (
        requestNumber === consultDomainCheckSequence
      ) {
        const editable =
          currentLead &&
          ["new", "contacted"].includes(currentLead.status);

        consultDomainCheck.disabled = !editable;
        consultDomainCheck.textContent = "Cek Ketersediaan";
      }
    }
  }
  function syncConsultationConditionalFields() {
    const domainMode = consultDomainMode.value;
    const needsDomainName =
      domainMode === "owned" || domainMode === "new";

    consultDomainNameField.hidden = !needsDomainName;
    consultDomainName.required = needsDomainName;

    consultDomainCheck.hidden = domainMode !== "new";

    const needsTargetDate =
      consultTimeline.value === "target_date";

    consultTargetDateField.hidden = !needsTargetDate;
    consultTargetDate.required = needsTargetDate;
  }

  function renderConsultationForm(lead) {
    currentLead = lead;

    consultService.value =
      lead.service_interest || "Belum ditentukan";

    consultPackage.value =
      ["Starter", "Professional", "Business", "Custom"]
        .includes(lead.package_name)
        ? lead.package_name
        : "Professional";

    const selectedExtras =
      new Set(selectedExtraValuesFromLead(lead));

    document
      .querySelectorAll('input[name="consultExtra"]')
      .forEach((input) => {
        input.checked = selectedExtras.has(input.value);
      });

    consultDomainMode.value =
      ["none", "owned", "new"].includes(lead.domain_mode)
        ? lead.domain_mode
        : "none";

    consultDomainName.value =
      lead.domain_name || "";

    consultHosting.value =
      ["none", "owned", "needed"].includes(lead.hosting_mode)
        ? lead.hosting_mode
        : "none";

    consultTimeline.value =
      [
        "flexible",
        "2_4_weeks",
        "1_2_months",
        "target_date"
      ].includes(lead.target_timeline)
        ? lead.target_timeline
        : "flexible";

    consultTargetDate.value =
      lead.target_date || "";

    consultDescription.value =
      lead.consultation_description || "";

    consultEstimate.textContent =
      lead.estimated_amount == null
        ? "Belum dihitung"
        : formatRupiah(lead.estimated_amount);

    const submitted =
      Boolean(lead.consultation_submitted_at);

    consultationState.textContent =
      submitted
        ? `Dikirim ${formatDate(lead.consultation_submitted_at)}`
        : "Belum dikirim";

    const editable =
      ["new", "contacted"].includes(lead.status);

    Array.from(consultationForm.elements)
      .forEach((element) => {
        if (element.matches("[data-service-action]")) return;

        if (
          element instanceof HTMLButtonElement ||
          element instanceof HTMLInputElement ||
          element instanceof HTMLSelectElement ||
          element instanceof HTMLTextAreaElement
        ) {
          if (element.id === "consultService") {
            element.disabled = false;
            element.readOnly = true;
          } else {
            element.disabled = !editable;
          }
        }
      });

    consultSubmit.textContent =
      submitted
        ? "Simpan Perubahan Kebutuhan"
        : "Simpan Kebutuhan Konsultasi";

    consultSubmit.hidden = !editable;

    consultFeedback.classList.remove(
      "is-success",
      "is-error"
    );

    consultFeedback.textContent =
      editable
        ? (
            submitted
              ? "Kebutuhan sudah tersimpan. Anda masih dapat memperbaruinya selama proses konsultasi."
              : "Lengkapi kebutuhan project lalu simpan untuk melanjutkan konsultasi."
          )
        : "Kebutuhan sudah dikunci pada tahap proses saat ini.";

    syncConsultationConditionalFields();
    renderSavedConsultDomainState(lead);

    const continueButton =
      document.getElementById("continueConsultation");

    if (continueButton) {
      continueButton.textContent =
        submitted
          ? "Lihat / Ubah Kebutuhan"
          : "Lanjutkan Konsultasi";
    }

    if (
      lead.status === "new" &&
      submitted
    ) {
      document.getElementById("nextAction").textContent =
        "Kebutuhan konsultasi telah dikirim. Tim akan meninjau data Anda sebelum proses berikutnya.";
    }
  }

  function focusConsultationPanel() {
    const section =
      document.getElementById("leadConsultation");

    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    setTimeout(() => {
      const firstEditable =
        section.querySelector(
          "select:not(:disabled), textarea:not(:disabled), input:not([readonly]):not(:disabled)"
        );

      if (firstEditable) {
        firstEditable.focus({
          preventScroll: true
        });
      }
    }, 350);
  }

  async function handleConsultationSubmit(event) {
    event.preventDefault();

    if (!currentLead) return;

    const editable =
      ["new", "contacted"].includes(currentLead.status);

    if (!editable) return;

    syncConsultationConditionalFields();

    if (!consultationForm.reportValidity()) {
      return;
    }

    const extraValues =
      Array.from(
        document.querySelectorAll(
          'input[name="consultExtra"]:checked'
        )
      ).map((input) => input.value);

    consultSubmit.disabled = true;
    consultSubmit.textContent = "Menyimpan...";

    consultFeedback.classList.remove(
      "is-success",
      "is-error"
    );

    consultFeedback.textContent =
      "Menyimpan kebutuhan konsultasi...";

    try {
      const response =
        await api("/lead/consultation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            package_name: consultPackage.value,
            extra_values:
              extraValues.length
                ? extraValues
                : ["0"],
            domain_mode: consultDomainMode.value,
            domain_name:
              consultDomainMode.value === "none"
                ? null
                : consultDomainName.value.trim(),
            hosting_mode: consultHosting.value,
            target_timeline: consultTimeline.value,
            target_date:
              consultTimeline.value === "target_date"
                ? consultTargetDate.value
                : null,
            consultation_description:
              consultDescription.value.trim()
          })
        });

      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Kebutuhan konsultasi belum dapat disimpan."
        );
      }

      const saved =
        data.consultation || {};

      currentLead = {
        ...currentLead,
        ...saved
      };

      renderConsultationForm(currentLead);

      consultFeedback.classList.add("is-success");
      consultFeedback.textContent =
        "Kebutuhan konsultasi berhasil disimpan.";

    } catch (error) {
      consultFeedback.classList.add("is-error");
      consultFeedback.textContent =
        error instanceof Error
          ? error.message
          : "Kebutuhan konsultasi belum dapat disimpan.";

    } finally {
      consultSubmit.disabled = false;

      if (currentLead) {
        consultSubmit.textContent =
          currentLead.consultation_submitted_at
            ? "Simpan Perubahan Kebutuhan"
            : "Simpan Kebutuhan Konsultasi";
      }
    }
  }


  async function handleServiceInterest(event) {
    const button =
      event.target.closest("[data-service-action]");

    if (!button || button.disabled) return;

    const card =
      button.closest("[data-service]");

    const serviceName =
      String(card?.dataset?.service || "").trim();

    if (!serviceName) return;

    const feedback =
      document.getElementById("serviceFeedback");

    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = "Menyimpan...";

    if (feedback) {
      feedback.classList.remove(
        "is-success",
        "is-error"
      );
      feedback.textContent =
        `Menyimpan minat untuk ${serviceName}...`;
    }

    try {
      const response =
        await api("/lead/service-interests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            service_name: serviceName
          })
        });

      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Minat layanan belum dapat disimpan."
        );
      }

      card.classList.add("is-selected");
      button.disabled = true;
      button.textContent =
        data.service_interest?.primary
          ? "\u2713 Layanan dipilih"
          : "\u2713 Sudah diminati";

      if (feedback) {
        feedback.classList.add("is-success");
        feedback.textContent =
          data.created
            ? `${serviceName} berhasil ditambahkan ke minat layanan Anda.`
            : `${serviceName} sudah tersimpan pada minat layanan Anda.`;
      }
    } catch (error) {
      button.disabled = false;
      button.textContent = originalText;

      if (feedback) {
        feedback.classList.add("is-error");
        feedback.textContent =
          error instanceof Error
            ? error.message
            : "Minat layanan belum dapat disimpan.";
      }
    }
  }
  function render(user, lead) {
    const displayName =
      lead.full_name ||
      user.full_name ||
      user.email ||
      "Pengguna";

    const firstName =
      String(displayName)
        .trim()
        .split(/\s+/)
        .filter(Boolean)[0] || "Anda";

    document.getElementById("welcomeHeading").textContent =
      `Selamat datang, ${firstName}`;

    document.getElementById("leadCode").textContent =
      lead.lead_code || "-";

    document.getElementById("serviceInterest").textContent =
      lead.service_interest || "Belum ditentukan";

    document.getElementById("companyName").textContent =
      lead.company_name || "Personal / belum diisi";

    document.getElementById("accountEmail").textContent =
      user.email || lead.email || "-";

    document.getElementById("registeredAt").textContent =
      formatDate(lead.created_at);

    document.getElementById("leadMessage").textContent =
      lead.message || "Belum ada catatan kebutuhan tambahan.";

    renderProgress(lead.status);
    renderServiceActions(lead);
    renderConsultationForm(lead);

    loading.hidden = true;
    errorPanel.hidden = true;
    dashboard.hidden = false;
  }

  async function loadPortal() {
    loading.hidden = false;
    errorPanel.hidden = true;
    dashboard.hidden = true;

    try {
      const meResponse = await api("/auth/me");
      const me = await readJson(meResponse);

      if (!meResponse.ok || !me.user) {
        window.location.replace("/portal/");
        return;
      }

      if (me.user.role === "client") {
        window.location.replace("/portal/");
        return;
      }

      if (me.user.role !== "lead") {
        throw new Error("Akun ini tidak memiliki akses Lead Portal.");
      }

      const leadResponse = await api("/lead/me");
      const data = await readJson(leadResponse);

      if (!leadResponse.ok || !data.lead) {
        throw new Error(
          data.error ||
          "Data konsultasi untuk akun ini belum ditemukan."
        );
      }

      render(me.user, data.lead);
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Tidak dapat terhubung ke layanan Portal."
      );
    }
  }

  async function handleLogout() {
    logout.disabled = true;
    logout.textContent = "Keluar...";

    try {
      await api("/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: "{}"
      });
    } finally {
      window.location.replace("/portal/");
    }
  }

  document
    .getElementById("continueConsultation")
    .addEventListener("click", focusConsultationPanel);

  consultationForm
    .addEventListener("submit", handleConsultationSubmit);

  consultDomainMode
    .addEventListener("change", () => {
      resetConsultDomainResult();
      syncConsultationConditionalFields();
    });

  consultDomainName
    .addEventListener("input", resetConsultDomainResult);

  consultDomainName
    .addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" &&
        consultDomainMode.value === "new"
      ) {
        event.preventDefault();
        checkConsultDomainAvailability();
      }
    });

  consultDomainCheck
    .addEventListener("click", checkConsultDomainAvailability);

  consultTimeline
    .addEventListener("change", syncConsultationConditionalFields);

  document
    .querySelector(".services-grid")
    .addEventListener("click", handleServiceInterest);

  retry.addEventListener("click", loadPortal);
  logout.addEventListener("click", handleLogout);
  loadPortal();
})();