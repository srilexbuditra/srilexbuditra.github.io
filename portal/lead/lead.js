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
            ? "Saya Tertarik"
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

  function focusServiceOptions() {
    const section =
      document.getElementById("leadServices");

    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
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
    .addEventListener("click", focusServiceOptions);

  document
    .querySelector(".services-grid")
    .addEventListener("click", handleServiceInterest);

  retry.addEventListener("click", loadPortal);
  logout.addEventListener("click", handleLogout);
  loadPortal();
})();