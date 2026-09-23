(() => {
  "use strict";

  const API = "/api/client/projects";

  const STATUS_LABEL = {
    planning: "Planning",
    design: "Design",
    development: "Development",
    testing: "Testing",
    deployment: "Deployment",
    maintenance: "Maintenance",
    completed: "Completed",
    on_hold: "On Hold",
    cancelled: "Cancelled"
  };

  const ACTIVE_STATUS = new Set([
    "planning",
    "design",
    "development",
    "testing",
    "deployment",
    "maintenance",
    "on_hold"
  ]);

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function findStat(label) {
    return [...document.querySelectorAll(".stat")].find((stat) => {
      const meta = stat.querySelector(".meta");
      return meta &&
        meta.textContent.trim().toLowerCase() === label.toLowerCase();
    });
  }

  function setStat(label, value, sub) {
    const stat = findStat(label);
    if (!stat) return;

    const valueEl = stat.querySelector(".value");
    const subEl = stat.querySelector(".sub");

    if (valueEl) valueEl.textContent = String(value);
    if (subEl) subEl.textContent = sub;
  }

  function findCard(title) {
    return [...document.querySelectorAll(".card")].find((card) => {
      const h2 = card.querySelector(".card-head h2");
      return h2 && h2.textContent.trim() === title;
    });
  }

  function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  }

  function statusLabel(status) {
    return STATUS_LABEL[status] || status || "-";
  }

  function badgeClass(status) {
    if (
      status === "development" ||
      status === "deployment" ||
      status === "completed"
    ) return "green";

    if (
      status === "design" ||
      status === "testing"
    ) return "blue";

    return "warn";
  }

  function prepareDashboard() {
    setStat("Project aktif", "...", "Mengambil data D1");
    setStat("Dokumen", "-", "Modul belum terhubung");
    setStat("Invoice", "-", "Modul belum terhubung");
    setStat("Support", "-", "Modul belum terhubung");

    const projectCard = findCard("Project utama");
    if (projectCard) {
      const title = projectCard.querySelector(".card-head h2");
      if (title) title.textContent = "Project terbaru";

      const body = projectCard.querySelector(".project-main");
      if (body) {
        body.innerHTML = `
          <div style="padding:28px 0;color:#64748b">
            Memuat project dari D1...
          </div>
        `;
      }
    }

    const activityCard = findCard("Aktivitas terbaru");
    if (activityCard) {
      const list = activityCard.querySelector(".list");
      if (list) {
        list.innerHTML = `
          <div style="padding:18px;color:#64748b">
            Aktivitas project belum tersedia pada API R1.
          </div>
        `;
      }
    }

    const timelineCard = findCard("Project timeline");
    if (timelineCard) {
      const timeline = timelineCard.querySelector(".timeline");
      if (timeline) {
        timeline.innerHTML = `
          <div style="padding:18px;color:#64748b">
            Menunggu data project...
          </div>
        `;
      }
    }
  }

  function renderEmpty() {
    setStat("Project aktif", "0", "Belum ada project");
    setStat("Dokumen", "-", "Modul belum terhubung");
    setStat("Invoice", "-", "Modul belum terhubung");
    setStat("Support", "-", "Modul belum terhubung");

    const projectCard =
      findCard("Project terbaru") || findCard("Project utama");

    if (projectCard) {
      const body = projectCard.querySelector(".project-main");

      if (body) {
        body.innerHTML = `
          <div style="padding:32px 4px;text-align:center;color:#64748b">
            <strong style="display:block;color:#0f172a;margin-bottom:8px">
              Belum ada project
            </strong>
            Administrator belum menambahkan project untuk akun client ini.
          </div>
        `;
      }

      const badge = projectCard.querySelector(".badge");
      if (badge) badge.hidden = true;
    }

    const timelineCard = findCard("Project timeline");
    if (timelineCard) {
      const timeline = timelineCard.querySelector(".timeline");

      if (timeline) {
        timeline.innerHTML = `
          <div style="padding:22px;color:#64748b">
            Timeline akan tersedia setelah project dibuat.
          </div>
        `;
      }
    }

    const mainButton = document.querySelector(".page-head .primary");
    if (mainButton) {
      mainButton.textContent = "Belum ada project";
      mainButton.disabled = true;
    }
  }

  function renderProject(project) {
    const projectCard =
      findCard("Project terbaru") || findCard("Project utama");

    if (!projectCard) return;

    const badge = projectCard.querySelector(".badge");

    if (badge) {
      badge.hidden = false;
      badge.className = `badge ${badgeClass(project.status)}`;
      badge.textContent = statusLabel(project.status);
    }

    const progress = Math.max(
      0,
      Math.min(100, Number(project.progress || 0))
    );

    const body = projectCard.querySelector(".project-main");

    if (body) {
      body.innerHTML = `
        <div class="project-title">
          <div>
            <h3>${escapeHtml(project.project_name || "Project")}</h3>
            <p>
              ${escapeHtml(project.project_code || "-")}
              ${project.description
                ? ` &bull; ${escapeHtml(project.description)}`
                : ""}
            </p>
          </div>
        </div>

        <div class="progress-row">
          <span>Progress</span>
          <strong>${progress}%</strong>
        </div>

        <div class="progress" aria-label="Progress project ${progress} persen">
          <span style="width:${progress}%"></span>
        </div>

        <div class="project-meta">
          <div class="meta-box">
            <span>Mulai</span>
            <strong>${formatDate(project.start_date)}</strong>
          </div>

          <div class="meta-box">
            <span>Target</span>
            <strong>${formatDate(project.target_date)}</strong>
          </div>

          <div class="meta-box">
            <span>Status</span>
            <strong>${escapeHtml(statusLabel(project.status))}</strong>
          </div>
        </div>
      `;
    }

    const timelineCard = findCard("Project timeline");

    if (timelineCard) {
      const title = timelineCard.querySelector(".card-head h2");
      const subtitle = timelineCard.querySelector(".card-head p");
      const timeline = timelineCard.querySelector(".timeline");

      if (title) title.textContent = "Status project";
      if (subtitle) {
        subtitle.textContent =
          "Status dan jadwal berdasarkan data project di D1";
      }

      if (timeline) {
        timeline.innerHTML = `
          <div class="timeline-item active">
            <div class="timeline-mark">
              <span class="timeline-dot"></span>
            </div>
            <div class="timeline-copy">
              <strong>${escapeHtml(statusLabel(project.status))}</strong>
              <span>Status saat ini</span>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-mark">
              <span class="timeline-dot"></span>
            </div>
            <div class="timeline-copy">
              <strong>${formatDate(project.start_date)}</strong>
              <span>Tanggal mulai</span>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-mark">
              <span class="timeline-dot"></span>
            </div>
            <div class="timeline-copy">
              <strong>${formatDate(project.target_date)}</strong>
              <span>Target selesai</span>
            </div>
          </div>
        `;
      }
    }
  }

  function renderProjects(projects) {
    const activeCount = projects.filter((project) =>
      ACTIVE_STATUS.has(project.status)
    ).length;

    setStat(
      "Project aktif",
      activeCount,
      projects.length
        ? `${projects.length} total project`
        : "Belum ada project"
    );

    setStat("Dokumen", "-", "Modul belum terhubung");
    setStat("Invoice", "-", "Modul belum terhubung");
    setStat("Support", "-", "Modul belum terhubung");

    if (!projects.length) {
      renderEmpty();
      return;
    }

    renderProject(projects[0]);

    const mainButton = document.querySelector(".page-head .primary");
    if (mainButton) {
      mainButton.disabled = false;
      mainButton.textContent =
        projects.length === 1
          ? "1 Project"
          : `${projects.length} Projects`;
    }
  }

  async function loadProjects() {
    try {
      const response = await fetch(API, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          Accept: "application/json"
        },
        cache: "no-store"
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        window.location.reload();
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      renderProjects(
        Array.isArray(data.projects) ? data.projects : []
      );
    } catch (error) {
      setStat("Project aktif", "!", "Gagal mengambil data");

      const projectCard =
        findCard("Project terbaru") || findCard("Project utama");

      const body = projectCard?.querySelector(".project-main");

      if (body) {
        body.innerHTML = `
          <div style="padding:28px 4px;color:#b91c1c">
            Data project belum dapat dimuat.
          </div>
        `;
      }

      console.error("Client project load failed.", error);
    }
  }

  prepareDashboard();

  window.addEventListener(
    "sb:portal-authenticated",
    () => loadProjects()
  );

  if (window.SB_PORTAL_USER) {
    loadProjects();
  }
})();