"use strict";

(() => {
  const KEY = "sb_lead_demo_r1";
  const JOURNEY_KEY = "sb_demo_journey_r1";

  const freshState = () => ({
    stage: "registered"
  });

  let state;

  try {
    state = JSON.parse(sessionStorage.getItem(KEY) || "null") || freshState();
  } catch {
    state = freshState();
  }

  const $ = (id) => document.getElementById(id);

  function readJourney() {
    try {
      return JSON.parse(
        sessionStorage.getItem(JOURNEY_KEY) || "null"
      ) || {};
    } catch {
      return {};
    }
  }

  function demoRegisteredAt(value) {
    if (!value) {
      return "2 Oktober 2026 \u2022 Data simulasi";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "2 Oktober 2026 \u2022 Data simulasi";
    }

    return new Intl.DateTimeFormat(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    ).format(date) + " \u2022 Data simulasi";
  }

  const dashboard = $("leadDashboard");
  const actionButton = $("continueConsultation");
  const estimatePanel = $("leadEstimatePanel");
  const estimateCard = $("leadEstimateCard");

  const stages = {
    registered: {
      step: 1,
      status: "Registrasi diterima",
      next: "Mulai simulasi konsultasi untuk melihat bagaimana kebutuhan project diproses.",
      action: "Mulai Konsultasi Demo",
      message: "Saya membutuhkan Website Company Profile profesional untuk memperkuat profil bisnis."
    },

    consultation: {
      step: 2,
      status: "Konsultasi berlangsung",
      next: "Kebutuhan simulasi sudah disiapkan. Simpan untuk melanjutkan ke proses verifikasi.",
      action: "Simpan Kebutuhan Demo",
      message: "Website Company Profile, profil perusahaan, layanan, portfolio, kontak, dan optimasi tampilan mobile."
    },

    qualified: {
      step: 3,
      status: "Kebutuhan terverifikasi",
      next: "Kebutuhan project telah diverifikasi. Lanjutkan untuk melihat contoh Penawaran Resmi.",
      action: "Lihat Penawaran Demo",
      message: "Kebutuhan simulasi telah diverifikasi dan siap dilanjutkan ke Penawaran Resmi."
    },

    sent: {
      step: 4,
      status: "Penawaran resmi",
      next: "",
      action: "",
      message: ""
    },

    approved: {
      step: 4,
      status: "Menunggu Aktivasi Client",
      next: "",
      action: "",
      message: ""
    }
  };

  function save() {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  }

  function money(value) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(value);
  }

  function renderProgress(step) {
    document.querySelectorAll("#progressSteps [data-step]").forEach((el) => {
      const current = Number(el.dataset.step || 0);

      el.classList.toggle("is-done", current < step);
      el.classList.toggle("is-current", current === step);
    });

    $("progressBar").style.width =
      Math.max(20, Math.min(100, step * 20)) + "%";

    $("progressLabel").textContent =
      "Tahap " + step + " dari 5";
  }

  function estimateMarkup(approved) {
    const waiting = approved
      ? `
        <div class="lead-approved-next">
          <span>LANGKAH BERIKUTNYA</span>
          <h3>Menunggu Aktivasi Client</h3>
          <p>
            Penawaran Demo telah disetujui. Selanjutnya Anda dapat
            mencoba pengalaman Client Portal menggunakan data simulasi.
          </p>

          <div class="lead-approved-actions">
            <a class="lead-demo-button" href="/portal/demo/">
              Coba Demo Dashboard Client
            </a>

            <a class="lead-whatsapp-button"
               href="https://wa.me/6282136238350"
               target="_blank"
               rel="noopener">
              Butuh bantuan? WhatsApp
            </a>
          </div>
        </div>
      `
      : `
        <div class="lead-demo-estimate-actions">
          <button class="primary-button"
                  id="approveDemoEstimate"
                  type="button">
            Setujui Penawaran Demo
          </button>

          <small>
            Ini hanya simulasi. Tidak ada transaksi atau perubahan data nyata.
          </small>
        </div>
      `;

    return `
      <div class="lead-estimate-card">
        ${approved ? waiting : ""}

        <div class="lead-estimate-summary">
          <div>
            <span>Kode Penawaran</span>
            <strong>EST-DEMO-2026-001</strong>
          </div>

          <div>
            <span>Judul</span>
            <strong>Penawaran Resmi - Website Company Profile</strong>
          </div>

          <div>
            <span>Nilai Penawaran</span>
            <strong>${money(5300000)}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>${approved ? "Disetujui" : "Menunggu keputusan"}</strong>
          </div>
        </div>

        <div class="lead-demo-estimate-item">
          <span>ITEM PENAWARAN</span>
          <strong>Website Company Profile &mdash; Paket Professional</strong>
          <small>
            Website profesional, responsif, struktur layanan,
            portfolio, kontak, dan implementasi dasar SEO.
          </small>
          <b>${money(5300000)}</b>
        </div>

        ${approved ? "" : waiting}
      </div>
    `;
  }

  function renderEstimate() {
    const isSent = state.stage === "sent";
    const isApproved = state.stage === "approved";
    const active = isSent || isApproved;

    estimatePanel.hidden = !active;

    dashboard.classList.toggle(
      "is-decision-focus",
      active
    );

    estimatePanel.classList.toggle(
      "is-approved-waiting",
      isApproved
    );

    if (!active) {
      estimateCard.innerHTML = "";
      return;
    }

    $("leadEstimateEyebrow").textContent =
      isApproved
        ? "TAHAP 4 DARI 5 \u2022 PENAWARAN DISETUJUI"
        : "TAHAP 4 DARI 5 \u2022 PENAWARAN RESMI";

    $("leadEstimateTitle").textContent =
      isApproved
        ? "Penawaran Disetujui"
        : "Penawaran untuk Anda";

    $("leadEstimateState").textContent =
      isApproved
        ? "Menunggu Aktivasi Client"
        : "Menunggu keputusan";

    $("leadEstimateIntro").textContent =
      isApproved
        ? "Terima kasih. Keputusan Demo telah tersimpan. Tahap berikutnya adalah Aktivasi Client."
        : "Silakan periksa rincian Penawaran Demo. Jika sudah sesuai, pilih Setujui Penawaran Demo.";

    estimateCard.innerHTML =
      estimateMarkup(isApproved);

    if (isSent) {
      $("approveDemoEstimate")?.addEventListener("click", () => {
        const confirmed = window.confirm(
          "Setujui Penawaran Demo ini? Proses simulasi akan dilanjutkan ke Menunggu Aktivasi Client."
        );

        if (!confirmed) return;

        state.stage = "approved";
        save();
        render();

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    }
  }

  function render() {
    const current =
      stages[state.stage] ||
      stages.registered;

    const journey = readJourney();

    $("welcomeHeading").textContent =
      "Selamat datang, " +
      (journey.full_name || "Pengunjung Demo");

    $("friendlyStatus").textContent =
      current.status;

    $("leadCode").textContent =
      journey.lead_code ||
      "LEAD-DEMO-2026-001";

    $("serviceInterest").textContent =
      journey.service_interest ||
      "Website Company Profile";

    $("companyName").textContent =
      journey.company_name ||
      "Perusahaan Demo";

    $("accountEmail").textContent =
      journey.email ||
      "demo@srilexbuditra.work";

    $("registeredAt").textContent =
      demoRegisteredAt(
        journey.registered_at
      );

    $("leadMessage").textContent =
      state.stage === "registered"
        ? (journey.message || current.message)
        : current.message;

    $("nextAction").textContent =
      current.next;

    renderProgress(current.step);

    $("leadConsultation").hidden = true;
    $("consultationModal").hidden = true;

    if (
      state.stage === "registered" ||
      state.stage === "consultation" ||
      state.stage === "qualified"
    ) {
      actionButton.hidden = false;
      actionButton.textContent = current.action;
    } else {
      actionButton.hidden = true;
    }

    renderEstimate();
  }

  function advance() {
    if (state.stage === "registered") {
      state.stage = "consultation";
    } else if (state.stage === "consultation") {
      state.stage = "qualified";
    } else if (state.stage === "qualified") {
      state.stage = "sent";
    } else {
      return;
    }

    save();
    render();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  actionButton?.addEventListener(
    "click",
    advance
  );

  $("leadLogout")?.addEventListener(
    "click",
    () => {
      window.location.href =
        "/portal/register/";
    }
  );

  const modeBar =
    document.createElement("div");

  modeBar.className =
    "lead-demo-mode";

  modeBar.innerHTML = `
    <div>
      <strong>MODE DEMO</strong>
      <span>Data simulasi \u2022 Tidak mengubah data nyata</span>
    </div>

    <button id="resetLeadDemo"
            type="button">
      Reset Demo
    </button>
  `;

  document
    .querySelector(".lead-topbar")
    ?.insertAdjacentElement(
      "afterend",
      modeBar
    );

  $("resetLeadDemo")?.addEventListener(
    "click",
    () => {
      sessionStorage.removeItem(KEY);
      state = freshState();
      render();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  );

  const style =
    document.createElement("style");

  style.textContent = `
    .lead-demo-mode{
      width:min(100% - 32px,1180px);
      margin:16px auto 0;
      padding:12px 14px;
      border:1px solid var(--line);
      border-radius:14px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:14px;
      background:var(--surface);
    }

    .lead-demo-mode div{
      display:flex;
      align-items:center;
      flex-wrap:wrap;
      gap:8px 12px;
    }

    .lead-demo-mode strong{
      font-size:12px;
      letter-spacing:.08em;
    }

    .lead-demo-mode span{
      color:var(--muted);
      font-size:12px;
    }

    .lead-demo-mode button{
      border:1px solid var(--line);
      border-radius:10px;
      padding:8px 12px;
      background:transparent;
      color:inherit;
      cursor:pointer;
      font-weight:700;
    }

    .lead-demo-estimate-actions{
      display:flex;
      flex-direction:column;
      gap:10px;
      margin-top:18px;
    }

    .lead-demo-estimate-actions small{
      color:var(--muted);
      line-height:1.5;
    }

    .lead-demo-estimate-item{
      display:grid;
      gap:7px;
      margin-top:16px;
      padding:16px;
      border:1px solid var(--line);
      border-radius:14px;
    }

    .lead-demo-estimate-item span,
    .lead-demo-estimate-item small{
      color:var(--muted);
    }

    .lead-demo-estimate-item span{
      font-size:11px;
      letter-spacing:.08em;
    }

    .lead-demo-estimate-item b{
      margin-top:5px;
    }

    @media(max-width:640px){
      .lead-demo-mode{
        width:min(100% - 20px,1180px);
        align-items:stretch;
        flex-direction:column;
      }

      .lead-demo-mode button{
        width:100%;
      }
    }
  `;

  document.head.appendChild(style);

  render();
})();