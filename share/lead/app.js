(() => {
  "use strict";

  const byId =
    id =>
      document.getElementById(id);

  const state =
    byId("documentState");

  const stateTitle =
    byId("stateTitle");

  const stateMessage =
    byId("stateMessage");

  const documentNode =
    byId("leadDocument");

  const token =
    String(
      window.location.hash
        .slice(1) || ""
    ).trim();

  function valueOrDash(value) {
    const text =
      String(
        value ?? ""
      ).trim();

    return text || "-";
  }

  function setText(
    id,
    value
  ) {
    const node =
      byId(id);

    if (!node) return;

    node.textContent =
      valueOrDash(value);
  }

  function formatMoney(value) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Konsultasi";
    }

    const number =
      Number(value);

    if (
      !Number.isFinite(number)
    ) {
      return "Konsultasi";
    }

    return (
      "Rp " +
      new Intl.NumberFormat(
        "id-ID"
      ).format(number)
    );
  }

  function formatDate(value) {
    if (!value) {
      return "-";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return valueOrDash(value);
    }

    return new Intl.DateTimeFormat(
      "id-ID",
      {
        dateStyle: "long",
        timeStyle: "short"
      }
    ).format(date);
  }

  function formatTargetDate(value) {
    if (!value) {
      return "-";
    }

    const date =
      new Date(
        `${value}T00:00:00`
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return valueOrDash(value);
    }

    return new Intl.DateTimeFormat(
      "id-ID",
      {
        dateStyle: "long"
      }
    ).format(date);
  }

  function projectLabel(value) {
    return ({
      "Website Company Profile":
        "Website Company Profile",

      "Web Application":
        "Web Application",

      "REST API / Backend":
        "REST API / Backend",

      "Sistem Informasi Custom":
        "Sistem Informasi Bisnis",

      "Database Development":
        "Database Development",

      "Deployment & Cloud":
        "Deployment / Cloud Setup"
    })[value] ||
      valueOrDash(value);
  }

  function domainModeLabel(value) {
    return ({
      none:
        "Belum menentukan",

      owned:
        "Sudah memiliki domain",

      new:
        "Membutuhkan domain baru"
    })[value] ||
      valueOrDash(value);
  }

  function domainStatusLabel(value) {
    return ({
      none:
        "Belum ditentukan",

      owned:
        "Domain milik client",

      unregistered:
        "Belum terdaftar / kandidat tersedia",

      registered:
        "Sudah terdaftar",

      unknown:
        "Status belum dapat dipastikan"
    })[value] ||
      valueOrDash(value);
  }

  function hostingLabel(value) {
    return ({
      none:
        "Belum menentukan",

      owned:
        "Sudah memiliki hosting / server",

      needed:
        "Membutuhkan hosting / server"
    })[value] ||
      valueOrDash(value);
  }

  function timelineLabel(
    value,
    targetDate
  ) {
    if (
      value ===
      "target_date"
    ) {
      return targetDate
        ? `Target tanggal ${formatTargetDate(targetDate)}`
        : "Target tanggal";
    }

    return ({
      flexible:
        "Fleksibel",

      "2_4_weeks":
        "2–4 minggu",

      "1_2_months":
        "1–2 bulan"
    })[value] ||
      valueOrDash(value);
  }

  function renderFeatures(value) {
    const list =
      byId("featureList");

    if (!list) return;

    list.textContent = "";

    const raw =
      String(
        value || ""
      ).trim();

    const items =
      (
        raw &&
        raw.toLowerCase() !==
          "tidak ada"
      )
        ? raw
            .split(",")
            .map(item =>
              item.trim()
            )
            .filter(Boolean)
        : [
            "Tidak ada fitur tambahan"
          ];

    items.forEach(item => {
      const li =
        document.createElement(
          "li"
        );

      li.textContent =
        item;

      list.appendChild(li);
    });
  }

  function showError(
    title,
    message
  ) {
    documentNode.hidden = true;

    state.hidden = false;
    state.classList.add(
      "is-error"
    );

    stateTitle.textContent =
      title;

    stateMessage.textContent =
      message;
  }

  function renderDocument(doc) {
    setText(
      "headerLeadRef",
      doc.lead_code
    );

    setText(
      "leadRef",
      doc.lead_code
    );

    setText(
      "requestRef",
      doc.request_ref
    );

    setText(
      "documentDate",
      formatDate(
        doc.created_at
      )
    );

    setText(
      "fullName",
      doc.full_name
    );

    setText(
      "companyName",
      doc.company_name
    );

    setText(
      "email",
      doc.email
    );

    setText(
      "phone",
      doc.phone
    );

    setText(
      "packageName",
      doc.package_name
    );

    setText(
      "projectName",
      projectLabel(
        doc.project
      )
    );

    setText(
      "estimatedAmount",
      formatMoney(
        doc.estimated_amount
      )
    );

    renderFeatures(
      doc.extra_feature
    );

    const domain =
      doc.domain || {};

    setText(
      "domainMode",
      domainModeLabel(
        domain.mode
      )
    );

    setText(
      "domainName",
      domain.name
    );

    setText(
      "domainStatus",
      domainStatusLabel(
        domain.status
      )
    );

    setText(
      "hostingMode",
      hostingLabel(
        doc.hosting_mode
      )
    );

    setText(
      "targetTimeline",
      timelineLabel(
        doc.target_timeline,
        doc.target_date
      )
    );

    setText(
      "targetDate",
      formatTargetDate(
        doc.target_date
      )
    );

    setText(
      "requirement",
      doc.requirement ||
        "Tidak ada catatan tambahan."
    );

    document.title =
      `${
        valueOrDash(
          doc.lead_code
        )
      } | Dokumen Estimasi | Srilex Buditra`;

    state.hidden = true;
    documentNode.hidden = false;
  }

  async function loadDocument() {
    if (
      !token ||
      !/^[A-Za-z0-9_-]{20,100}\.[A-Za-z0-9_-]{20,100}$/.test(
        token
      )
    ) {
      showError(
        "Tautan dokumen tidak valid",
        "Tautan ini tidak memiliki token dokumen yang dapat diverifikasi."
      );

      return;
    }

    try {
      const response =
        await fetch(
          "/api/public/lead-share",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              "Accept":
                "application/json"
            },

            credentials:
              "same-origin",

            cache:
              "no-store",

            body:
              JSON.stringify({
                token
              })
          }
        );

      const data =
        await response
          .json()
          .catch(
            () => ({})
          );

      if (
        !response.ok ||
        data?.ok !== true ||
        !data?.document
      ) {
        throw new Error(
          "Document unavailable"
        );
      }

      renderDocument(
        data.document
      );
    }
    catch {
      showError(
        "Dokumen tidak tersedia",
        "Tautan mungkin tidak valid, sudah dicabut, telah kedaluwarsa, atau dokumen tidak lagi tersedia."
      );
    }
  }

  const printButton =
    byId("printButton");

  if (printButton) {
    printButton.addEventListener(
      "click",
      () => {
        window.print();
      }
    );
  }

  loadDocument();
})();