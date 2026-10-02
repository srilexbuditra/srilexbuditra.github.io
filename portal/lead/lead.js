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
  const consultDomainTld =
    document.getElementById("consultDomainTld");
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
  let currentEstimates = [];
  let currentEstimateDetail = null;

  const leadEstimatePanel =
    document.getElementById("leadEstimatePanel");

  const leadEstimateState =
    document.getElementById("leadEstimateState");

  const leadEstimateIntro =
    document.getElementById("leadEstimateIntro");

  const leadEstimateCard =
    document.getElementById("leadEstimateCard");

  const leadEstimateFeedback =
    document.getElementById("leadEstimateFeedback");

  const leadEstimateTitle = document.getElementById("leadEstimateTitle");

  const leadEstimateEyebrow =
    document.getElementById("leadEstimateEyebrow");

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

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function estimateStatusLabel(status) {
    const labels = {
      sent: "Menunggu keputusan Anda",
      approved: "Disetujui",
      rejected: "Ditolak",
      expired: "Kedaluwarsa"
    };

    return labels[status] || status || "-";
  }

  function progressState(status) {
    const base =
      statusMap[status] || statusMap.new;

    if (
      status !== "qualified" ||
      !currentEstimates.length
    ) {
      return base;
    }

    const estimate =
      currentEstimates[0];

    const estimateStatus =
      String(estimate && estimate.status || "");

    if (
      [
        "sent",
        "approved",
        "rejected",
        "expired"
      ].indexOf(estimateStatus) === -1
    ) {
      return base;
    }

    let next =
      "Penawaran resmi telah tersedia. Silakan tinjau penawaran Anda.";

    if (estimateStatus === "approved") {
      next =
        "Penawaran telah Anda setujui. Tim akan melanjutkan proses Aktivasi Client.";
    }

    if (estimateStatus === "rejected") {
      next =
        "Penawaran tidak disetujui. Tim akan meninjau kebutuhan dan menyiapkan tindak lanjut.";
    }

    if (estimateStatus === "expired") {
      next =
        "Masa berlaku penawaran telah berakhir. Tim akan menyiapkan pembaruan bila diperlukan.";
    }

    return {
      label: "Penawaran resmi",
      step: 4,
      next: next
    };
  }

  function isDecisionFocusMode(status) {
    if (status !== "qualified") {
      return false;
    }

    const estimate =
      currentEstimateDetail &&
      currentEstimateDetail.estimate
        ? currentEstimateDetail.estimate
        : currentEstimates[0] || null;

    if (!estimate) {
      return false;
    }

    const estimateStatus =
      String(estimate.status || "");

    return [
      "sent",
      "approved",
      "rejected",
      "expired"
    ].indexOf(estimateStatus) !== -1;
  }

  function syncDecisionFocusMode(status) {
    const active =
      isDecisionFocusMode(status);

    dashboard.classList.toggle(
      "is-decision-focus",
      active
    );

    if (leadEstimateEyebrow) {
      leadEstimateEyebrow.textContent =
        active
          ? ((currentEstimateDetail?.estimate?.status || currentEstimates[0]?.status) === "approved" ? "TAHAP 4 DARI 5 • PENAWARAN DISETUJUI" : "TAHAP 4 DARI 5 • PENAWARAN RESMI")
          : "PENAWARAN RESMI";
    }
  }

  function renderProgress(status) {
    const state = progressState(status);
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

    syncDecisionFocusMode(status);
  }

  /* SB_LEAD_SERVICE_INTEREST_FRONTEND_R1 */
  async function loadOfficialEstimates() {
    const response =
      await api("/lead/estimates");

    const data =
      await readJson(response);

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Penawaran resmi belum dapat dimuat."
      );
    }

    currentEstimates =
      Array.isArray(data.estimates)
        ? data.estimates
        : [];

    currentEstimateDetail = null;

    const latest =
      currentEstimates[0];

    if (latest && latest.id) {
      const detailResponse =
        await api(
          `/lead/estimates/${encodeURIComponent(latest.id)}`
        );

      const detailData =
        await readJson(detailResponse);

      if (
        detailResponse.ok &&
        detailData.estimate
      ) {
        currentEstimateDetail =
          detailData;
      }
    }
  }

  function renderOfficialEstimate() {
    const estimate =
      currentEstimateDetail &&
      currentEstimateDetail.estimate
        ? currentEstimateDetail.estimate
        : currentEstimates[0] || null;

    if (!estimate) {
      leadEstimatePanel.hidden = true;
      leadEstimateCard.innerHTML = "";
      leadEstimateFeedback.textContent = "";
      return;
    }

    leadEstimatePanel.hidden = false;

    /* APPROVED WAITING FULL VIEW R1 */
    leadEstimatePanel.classList.toggle(
      "is-approved-waiting",
      String(estimate.status || "") === "approved"
    );

    const status =
      String(estimate.status || "");

    leadEstimateState.textContent =
      status === "approved"
        ? "Menunggu Aktivasi Client"
        : estimateStatusLabel(status);

    if (leadEstimateTitle) {
      leadEstimateTitle.textContent =
        status === "approved"
          ? "Penawaran Disetujui"
          : "Penawaran untuk Anda";
    }

    if (status === "sent") {
      leadEstimateIntro.textContent =
        "Silakan periksa rincian penawaran. Jika sudah sesuai, pilih Setujui Penawaran untuk melanjutkan ke Aktivasi Client.";
    } else if (status === "approved") {
      leadEstimateIntro.textContent =
        "Terima kasih. Keputusan Anda telah tersimpan. Tim Srilex Buditra akan memproses Aktivasi Client. Anda tidak perlu melakukan tindakan lain saat ini.";
    } else if (status === "rejected") {
      leadEstimateIntro.textContent =
        "Penawaran ini tidak disetujui. Tim akan meninjau tindak lanjut berikutnya.";
    } else {
      leadEstimateIntro.textContent =
        "Penawaran resmi Anda tersedia pada proses saat ini.";
    }

    const items =
      currentEstimateDetail &&
      Array.isArray(currentEstimateDetail.items)
        ? currentEstimateDetail.items
        : [];

    const itemsHtml =
      items.length
        ? items.map(function (item) {
            return `
              <div class="lead-estimate-item">
                <div>
                  <strong>${escapeHtml(item.description || "-")}</strong>
                  <small>
                    Qty ${escapeHtml(item.quantity == null ? "-" : item.quantity)}
                    × ${escapeHtml(formatRupiah(item.unit_price))}
                  </small>
                </div>
                <strong>${escapeHtml(formatRupiah(item.line_total))}</strong>
              </div>
            `;
          }).join("")
        : `
            <div class="lead-estimate-empty">
              Rincian item belum dapat ditampilkan.
            </div>
          `;

    const leadCode =
      currentLead && currentLead.lead_code
        ? currentLead.lead_code
        : "-";

    const processStatus =
      status === "approved"
        ? "Penawaran sudah saya setujui dan saat ini menunggu Aktivasi Client."
        : status === "sent"
          ? "Saya sedang meninjau Penawaran Resmi yang telah dikirim."
          : currentLead?.status === "qualified"
            ? "Kebutuhan saya sudah terverifikasi dan saya menunggu proses berikutnya."
            : currentLead?.status === "contacted"
              ? "Saya sedang berada pada tahap konsultasi."
              : "Registrasi Lead saya sudah diterima.";

    const whatsappMessage =
      "Halo Srilex Buditra, saya memerlukan bantuan terkait proses Lead saya.\n\n" +
      "*Lead Code:* " + leadCode + "\n\n" +
      processStatus + "\n" +
      "Mohon bantuannya terkait langkah berikutnya. Terima kasih.";

    const whatsappUrl =
      "https://wa.me/6282136238350?text=" +
      encodeURIComponent(whatsappMessage);

    const decisionHtml =
      status === "sent"
        ? `
            <div class="lead-estimate-actions">
              <button
                class="primary-button"
                type="button"
                data-lead-estimate-decision="approved"
                data-estimate-id="${escapeHtml(estimate.id)}"
              >
                Setujui Penawaran
              </button>

              <button
                class="secondary-button"
                type="button"
                data-lead-estimate-decision="rejected"
                data-estimate-id="${escapeHtml(estimate.id)}"
              >
                Tolak Penawaran
              </button>
            </div>

            <a class="lead-estimate-help"
               href="${escapeHtml(whatsappUrl)}"
               target="_blank"
               rel="noopener">
              Butuh bantuan? WhatsApp
            </a>
          `
        : status === "approved"
          ? `
              <div class="lead-approved-next">
                <span>LANGKAH BERIKUTNYA</span>
                <h3>Menunggu Aktivasi Client</h3>
                <p>
                  Sambil menunggu aktivasi akun, Anda dapat
                  mencoba pengalaman Client Portal menggunakan data simulasi.
                </p>

                <div class="lead-approved-actions">
                  <a class="lead-demo-button" href="/portal/demo/">
                    Coba Demo Dashboard Client
                  </a>

                  <a class="lead-whatsapp-button"
                     href="${escapeHtml(whatsappUrl)}"
                     target="_blank"
                     rel="noopener">
                    Butuh bantuan? WhatsApp
                  </a>
                </div>
              </div>
            `
          : "";

    leadEstimateCard.innerHTML = `
      <div class="lead-estimate-card">
        <div class="lead-estimate-summary">
          <div>
            <span>Kode Penawaran</span>
            <strong>${escapeHtml(estimate.estimate_code || "-")}</strong>
          </div>

          <div>
            <span>Judul</span>
            <strong>${escapeHtml(estimate.title || "-")}</strong>
          </div>

          <div>
            <span>Nilai</span>
            <strong>${escapeHtml(formatRupiah(estimate.total_amount))}</strong>
          </div>

          <div>
            <span>Berlaku sampai</span>
            <strong>${escapeHtml(formatDate(estimate.valid_until))}</strong>
          </div>
        </div>

        <div class="lead-estimate-items">
          ${itemsHtml}
        </div>

        ${
          estimate.notes
            ? `
                <div class="lead-estimate-notes">
                  <span>Catatan</span>
                  <p>${escapeHtml(estimate.notes)}</p>
                </div>
              `
            : ""
        }

        ${decisionHtml}
      </div>
    `;
  }

  async function handleEstimateDecision(event) {
    const button =
      event.target.closest(
        "[data-lead-estimate-decision]"
      );

    if (!button) {
      return;
    }

    const decision =
      button.dataset.leadEstimateDecision;

    const estimateId =
      button.dataset.estimateId;

    if (
      !estimateId ||
      ["approved", "rejected"].indexOf(decision) === -1
    ) {
      return;
    }

    const approved =
      decision === "approved";

    const confirmed =
      window.confirm(
        approved
          ? "Setujui Penawaran Resmi ini? Setelah disetujui, proses akan dilanjutkan ke Aktivasi Client."
          : "Tolak Penawaran Resmi ini? Tim akan meninjau kembali kebutuhan dan penawaran."
      );

    if (!confirmed) {
      return;
    }

    button.disabled = true;

    leadEstimateFeedback.textContent =
      approved
        ? "Menyimpan persetujuan..."
        : "Menyimpan keputusan...";

    try {
      const response =
        await api(
          `/lead/estimates/${encodeURIComponent(estimateId)}/decision`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              decision: decision
            })
          }
        );

      const data =
        await readJson(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Keputusan penawaran belum dapat disimpan."
        );
      }

      await loadOfficialEstimates();

      renderOfficialEstimate();

      if (currentLead) {
        renderProgress(
          currentLead.status
        );
      }

      leadEstimateFeedback.textContent =
        approved
          ? ""
          : "Keputusan berhasil disimpan.";
    } catch (error) {
      leadEstimateFeedback.textContent =
        error instanceof Error
          ? error.message
          : "Keputusan penawaran belum dapat disimpan.";
    } finally {
      button.disabled = false;
    }
  }

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
  /* SB_LEAD_CONSULTATION_WIZARD_R1 */
  const consultationModal =
    document.getElementById("consultationModal");
  const consultationWizardContent =
    document.getElementById("consultationWizardContent");
  const consultationSuccessState =
    document.getElementById("consultationSuccessState");
  const openConsultationWizardButton =
    document.getElementById("openConsultationWizard");
  const consultBack =
    document.getElementById("consultBack");
  const consultNext =
    document.getElementById("consultNext");
  const consultSuccessReview =
    document.getElementById("consultSuccessReview");
  const consultSuccessClose =
    document.getElementById("consultSuccessClose");
  const consultWizardCounter =
    document.getElementById("consultWizardCounter");
  const consultWizardSteps =
    Array.from(
      document.querySelectorAll("[data-wizard-step]")
    );
  const consultWizardIndicators =
    Array.from(
      document.querySelectorAll("[data-wizard-indicator]")
    );

  const consultSnapshotService =
    document.getElementById("consultSnapshotService");
  const consultSnapshotPackage =
    document.getElementById("consultSnapshotPackage");
  const consultSnapshotEstimate =
    document.getElementById("consultSnapshotEstimate");
  const consultSnapshotMeta =
    document.getElementById("consultSnapshotMeta");

  let consultationWizardStep = 1;
  let consultationModalReturnFocus = null;

  function selectedOptionText(select) {
    return (
      select?.selectedOptions?.[0]?.textContent?.trim() ||
      "-"
    );
  }

  function selectedConsultFeatureLabels() {
    return Array.from(
      document.querySelectorAll(
        'input[name="consultExtra"]:checked'
      )
    )
      .map((input) =>
        input
          .closest("label")
          ?.querySelector("span")
          ?.textContent
          ?.trim()
      )
      .filter(Boolean);
  }

  function selectedAdditionalServiceLabels() {
    const primary =
      String(consultService.value || "").trim();

    return Array.from(
      document.querySelectorAll(
        "#leadServices [data-service]"
      )
    )
      .filter((article) => {
        const button =
          article.querySelector("[data-service-action]");

        const selected =
          article.classList.contains("is-selected") ||
          /sudah diminati|layanan dipilih/i.test(
            button?.textContent || ""
          );

        return (
          selected &&
          String(article.dataset.service || "").trim() !== primary
        );
      })
      .map((article) =>
        String(article.dataset.service || "").trim()
      )
      .filter(Boolean);
  }

  function setConsultSummaryValue(name, value) {
    const text =
      String(value || "").trim() || "-";

    document
      .querySelectorAll(
        `[data-consult-summary="${name}"]`
      )
      .forEach((element) => {
        element.textContent = text;
      });
  }

  function consultationDomainSummary() {
    const mode =
      consultDomainMode.value;

    if (mode === "none") {
      return "Belum menentukan";
    }

    if (mode === "owned") {
      return (
        normalizeConsultDomain(
          consultDomainName.value
        ) ||
        "Domain yang sudah dimiliki"
      );
    }

    return (
      composeConsultDomain() ||
      "Belum menentukan nama domain"
    );
  }

  function updateConsultationLiveSummary() {
    const features =
      selectedConsultFeatureLabels();

    const extraServices =
      selectedAdditionalServiceLabels();

    const domainStatus =
      consultDomainResult &&
      !consultDomainResult.hidden
        ? consultDomainResult.innerText.trim()
        : "Belum diperiksa";

    const description =
      consultDescription.value.trim();

    setConsultSummaryValue(
      "service",
      consultService.value || "Belum ditentukan"
    );

    setConsultSummaryValue(
      "package",
      selectedOptionText(consultPackage)
    );

    setConsultSummaryValue(
      "features",
      features.length
        ? features.join(", ")
        : "Belum ada fitur tambahan"
    );

    setConsultSummaryValue(
      "services",
      extraServices.length
        ? extraServices.join(", ")
        : "Belum ada layanan tambahan"
    );

    setConsultSummaryValue(
      "domain",
      consultationDomainSummary()
    );

    setConsultSummaryValue(
      "domainStatus",
      domainStatus
    );

    setConsultSummaryValue(
      "hosting",
      selectedOptionText(consultHosting)
    );

    setConsultSummaryValue(
      "timeline",
      consultTimeline.value === "target_date" &&
      consultTargetDate.value
        ? `${selectedOptionText(consultTimeline)}: ${consultTargetDate.value}`
        : selectedOptionText(consultTimeline)
    );

    setConsultSummaryValue(
      "description",
      description || "Belum ada catatan tambahan"
    );

    setConsultSummaryValue(
      "estimate",
      consultEstimate.textContent || "Belum dihitung"
    );
  }

  function renderConsultationSnapshot(lead) {
    if (!lead) return;

    consultSnapshotService.textContent =
      lead.service_interest || "Belum ditentukan";

    consultSnapshotPackage.textContent =
      lead.package_name || "Belum ditentukan";

    consultSnapshotEstimate.textContent =
      lead.estimated_amount == null
        ? "Belum dihitung"
        : formatRupiah(lead.estimated_amount);

    consultSnapshotMeta.textContent =
      lead.consultation_submitted_at
        ? `Dikirim ${formatDate(
            lead.consultation_submitted_at
          )}`
        : "Belum ada kebutuhan konsultasi yang disimpan.";
  }

  function updateConsultationWizardControls() {
    const editable =
      Boolean(
        currentLead &&
        ["new", "contacted"].includes(currentLead.status)
      );

    consultBack.hidden =
      consultationWizardStep === 1;

    consultNext.hidden =
      consultationWizardStep === 4;

    consultSubmit.hidden =
      consultationWizardStep !== 4 ||
      !editable;

    consultWizardCounter.textContent =
      `Tahap ${consultationWizardStep} dari 4`;

    consultWizardIndicators.forEach((item) => {
      const itemStep =
        Number(item.dataset.wizardIndicator);

      item.classList.toggle(
        "is-active",
        itemStep === consultationWizardStep
      );

      item.classList.toggle(
        "is-complete",
        itemStep < consultationWizardStep
      );

      if (itemStep === consultationWizardStep) {
        item.setAttribute("aria-current", "step");
      } else {
        item.removeAttribute("aria-current");
      }
    });
  }

  function setConsultationStep(
    step,
    { focus = true } = {}
  ) {
    const normalizedStep =
      Math.max(1, Math.min(4, Number(step) || 1));

    consultationWizardStep =
      normalizedStep;

    consultWizardSteps.forEach((section) => {
      section.hidden =
        Number(section.dataset.wizardStep) !==
        normalizedStep;
    });

    syncConsultationConditionalFields();
    updateConsultationLiveSummary();
    updateConsultationWizardControls();

    if (!focus) return;

    const activeStep =
      consultWizardSteps.find(
        (section) =>
          Number(section.dataset.wizardStep) ===
          normalizedStep
      );

    const firstControl =
      activeStep?.querySelector(
        'input:not([type="hidden"]):not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled)'
      );

    setTimeout(() => {
      firstControl?.focus({
        preventScroll: true
      });
    }, 40);
  }

  function validateConsultationStep(step) {
    const section =
      consultWizardSteps.find(
        (item) =>
          Number(item.dataset.wizardStep) === step
      );

    if (!section) return true;

    if (step === 3 || step === 4) {
      syncConsultationConditionalFields();
    }

    const controls =
      Array.from(
        section.querySelectorAll(
          "input, select, textarea"
        )
      ).filter((control) => !control.disabled);

    for (const control of controls) {
      if (!control.checkValidity()) {
        control.reportValidity();
        control.focus();
        return false;
      }
    }

    return true;
  }

  function openConsultationWizard() {
    if (!currentLead || !consultationModal) return;

    /* SB_LEAD_CONSULTATION_WIZARD_GUARD_R1 */
    renderConsultationForm(currentLead);

    consultationModalReturnFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    consultationSuccessState.hidden = true;
    consultationWizardContent.hidden = false;

    consultationModal.hidden = false;
    consultationModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "consultation-modal-open"
    );

    setConsultationStep(1);
  }

  function closeConsultationWizard() {
    if (!consultationModal) return;

    consultationModal.hidden = true;
    consultationModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "consultation-modal-open"
    );

    consultationSuccessState.hidden = true;
    consultationWizardContent.hidden = false;

    consultationModalReturnFocus?.focus?.();
  }

  function showConsultationSuccess() {
    consultationWizardContent.hidden = true;
    consultationSuccessState.hidden = false;

    setTimeout(() => {
      consultSuccessReview?.focus();
    }, 40);
  }

  function showConsultationSavedReview() {
    consultationSuccessState.hidden = true;
    consultationWizardContent.hidden = false;
    setConsultationStep(4);
  }

  function normalizeConsultDomain(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split(/[/?#]/)[0]
      .replace(/\.$/, "");
  }

  function composeConsultDomain() {
    const input =
      normalizeConsultDomain(consultDomainName.value);

    if (!input) return "";

    if (input.includes(".")) {
      return input;
    }

    return `${input}${consultDomainTld?.value || ".com"}`;
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
      composeConsultDomain();

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

    consultDomainTld.hidden = domainMode !== "new";
    consultDomainCheck.hidden = domainMode !== "new";

    consultDomainHint.textContent =
      domainMode === "new"
        ? "Masukkan nama tanpa www. Jika belum menulis ekstensi, pilih ekstensi di samping."
        : "Masukkan nama domain tanpa https://";

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

    const storedDomain =
      normalizeConsultDomain(lead.domain_name || "");

    const knownDomainTlds = [
      ".co.id",
      ".web.id",
      ".my.id",
      ".com",
      ".id",
      ".net",
      ".org"
    ];

    const matchedDomainTld =
      consultDomainMode.value === "new"
        ? knownDomainTlds.find((tld) =>
            storedDomain.endsWith(tld) &&
            storedDomain.length > tld.length
          )
        : null;

    if (matchedDomainTld) {
      consultDomainName.value =
        storedDomain.slice(0, -matchedDomainTld.length);
      consultDomainTld.value =
        matchedDomainTld;
    } else {
      consultDomainName.value =
        storedDomain;
    }

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
        if (element.matches("[data-service-action], [data-wizard-nav]")) return;

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

    consultSubmit.hidden = !editable || consultationWizardStep !== 4;

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
    renderConsultationSnapshot(lead);
    updateConsultationLiveSummary();
    updateConsultationWizardControls();

    const continueButton =
      document.getElementById("continueConsultation");

    const consultationActionLabel =
      editable
        ? (
            submitted
              ? "Lihat / Ubah Kebutuhan"
              : "Lanjutkan Konsultasi"
          )
        : "Lihat Kebutuhan";

    if (continueButton) {
      continueButton.textContent =
        consultationActionLabel;
    }

    if (openConsultationWizardButton) {
      openConsultationWizardButton.textContent =
        consultationActionLabel;
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
    openConsultationWizard();
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
                : (
                    consultDomainMode.value === "new"
                      ? composeConsultDomain()
                      : normalizeConsultDomain(consultDomainName.value)
                  ),
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

      renderProgress(currentLead.status);
      renderConsultationForm(currentLead);

      consultFeedback.classList.add("is-success");
      consultFeedback.textContent =
        "Kebutuhan konsultasi berhasil disimpan.";

      showConsultationSuccess();

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

      const responses =
        await Promise.all([
          api("/lead/me"),
          api("/lead/estimates")
        ]);

      const leadResponse =
        responses[0];

      const estimatesResponse =
        responses[1];

      const data =
        await readJson(leadResponse);

      const estimatesData =
        await readJson(estimatesResponse);

      if (!leadResponse.ok || !data.lead) {
        throw new Error(
          data.error ||
          "Data konsultasi untuk akun ini belum ditemukan."
        );
      }

      if (!estimatesResponse.ok) {
        throw new Error(
          estimatesData.error ||
          "Penawaran resmi belum dapat dimuat."
        );
      }

      currentEstimates =
        Array.isArray(estimatesData.estimates)
          ? estimatesData.estimates
          : [];

      currentEstimateDetail = null;

      const latestEstimate =
        currentEstimates[0];

      if (
        latestEstimate &&
        latestEstimate.id
      ) {
        const detailResponse =
          await api(
            `/lead/estimates/${encodeURIComponent(latestEstimate.id)}`
          );

        const detailData =
          await readJson(detailResponse);

        if (
          detailResponse.ok &&
          detailData.estimate
        ) {
          currentEstimateDetail =
            detailData;
        }
      }

      currentLead =
        data.lead;

      render(me.user, data.lead);
      renderOfficialEstimate();
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

  consultDomainTld
    .addEventListener("change", resetConsultDomainResult);

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

  openConsultationWizardButton
    .addEventListener("click", openConsultationWizard);

  consultationForm
    .addEventListener("input", updateConsultationLiveSummary);

  consultationForm
    .addEventListener("change", updateConsultationLiveSummary);

  consultBack
    .addEventListener("click", () => {
      setConsultationStep(
        consultationWizardStep - 1
      );
    });

  consultNext
    .addEventListener("click", () => {
      if (
        !validateConsultationStep(
          consultationWizardStep
        )
      ) {
        return;
      }

      setConsultationStep(
        consultationWizardStep + 1
      );
    });

  document
    .querySelectorAll("[data-consult-close]")
    .forEach((element) => {
      element.addEventListener(
        "click",
        closeConsultationWizard
      );
    });

  consultSuccessReview
    .addEventListener(
      "click",
      showConsultationSavedReview
    );

  consultSuccessClose
    .addEventListener(
      "click",
      closeConsultationWizard
    );

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        !consultationModal.hidden
      ) {
        closeConsultationWizard();
      }
    }
  );

  const consultationServicesObserver =
    new MutationObserver(
      updateConsultationLiveSummary
    );

  consultationServicesObserver.observe(
    document.getElementById("leadServices"),
    {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true
    }
  );

  const consultationDomainResultObserver =
    new MutationObserver(
      updateConsultationLiveSummary
    );

  consultationDomainResultObserver.observe(
    consultDomainResult,
    {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true
    }
  );
  leadEstimatePanel
    .addEventListener(
      "click",
      handleEstimateDecision
    );

  retry.addEventListener("click", loadPortal);
  logout.addEventListener("click", handleLogout);
  loadPortal();
})();