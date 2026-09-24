(() => {
  "use strict";

  const API = "/api/client/estimates";
  const content = document.querySelector("main.content");
  if (!content) return;

  function esc(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function rupiah(value) {
    return new Intl.NumberFormat("id-ID", {
      style:"currency",
      currency:"IDR",
      maximumFractionDigits:0
    }).format(Number(value || 0));
  }

  function label(status) {
    return {
      sent:"Menunggu Persetujuan",
      approved:"Disetujui",
      rejected:"Ditolak",
      expired:"Kedaluwarsa"
    }[status] || status;
  }

  const navWork =
    [...document.querySelectorAll(".nav-section")]
      .find(section =>
        section.querySelector(".nav-label")?.textContent.trim() === "Work"
      )
      ?.querySelector(".nav");

  if (
    navWork &&
    ![...navWork.querySelectorAll("a")]
      .some(a => a.textContent.trim() === "Estimates")
  ) {
    const a = document.createElement("a");
    a.href = "#";
    a.innerHTML = '<span class="dot"></span>Estimates';

    const invoices =
      [...navWork.querySelectorAll("a")]
        .find(x => x.textContent.trim() === "Invoices");

    if (invoices) {
      navWork.insertBefore(a, invoices);
    } else {
      navWork.appendChild(a);
    }
  }

  const view = document.createElement("section");
  view.hidden = true;

  view.innerHTML = `
    <div class="page-head">
      <div>
        <div class="eyebrow">
          <span class="pulse"></span>Client Estimates &bull; R1
        </div>
        <h1>Estimates</h1>
        <p>Penawaran biaya yang dikirim untuk akun Anda.</p>
      </div>

      <button class="secondary" data-ce-dashboard>
        &larr; Dashboard
      </button>
    </div>

    <article class="card">
      <div class="card-head">
        <div>
          <h2>Daftar Estimate</h2>
          <p>Anda dapat menyetujui atau menolak estimate yang masih aktif.</p>
        </div>
        <button class="secondary" data-ce-refresh>Refresh</button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Estimate</th>
              <th>Project</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody data-ce-rows></tbody>
        </table>
      </div>
    </article>
  `;

  content.appendChild(view);

  const rows = view.querySelector("[data-ce-rows]");

  function links(name) {
    return [...document.querySelectorAll(".nav a, .mobile-nav a")]
      .filter(a =>
        a.textContent.trim().toLowerCase() === name.toLowerCase()
      );
  }

  function show() {
    [...content.children].forEach(node => {
      if (node !== view) node.style.display = "none";
    });

    view.style.removeProperty("display");
    view.hidden = false;

    document.querySelectorAll(".nav a, .mobile-nav a")
      .forEach(a => a.classList.remove("active"));

    links("Estimates").forEach(a => a.classList.add("active"));

    load();
  }

  function leave() {
    view.hidden = true;

    [...content.children].forEach(node => {
      if (node !== view) node.style.removeProperty("display");
    });
  }

  async function load() {
    rows.innerHTML =
      '<tr><td colspan="5">Memuat estimate...</td></tr>';

    try {
      const response = await fetch(API, {
        credentials:"same-origin",
        headers:{Accept:"application/json"},
        cache:"no-store"
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      rows.innerHTML = "";

      const estimates =
        Array.isArray(data.estimates) ? data.estimates : [];

      if (!estimates.length) {
        rows.innerHTML =
          '<tr><td colspan="5">Belum ada estimate untuk akun Anda.</td></tr>';
        return;
      }

      estimates.forEach(estimate => {
        const tr = document.createElement("tr");

        let actions = "-";

        if (estimate.status === "sent") {
          actions = `
            <button class="secondary"
                    data-ce-decision="approved"
                    data-ce-id="${esc(estimate.id)}">
              Setujui
            </button>

            <button class="secondary"
                    data-ce-decision="rejected"
                    data-ce-id="${esc(estimate.id)}">
              Tolak
            </button>
          `;
        }

        tr.innerHTML = `
          <td>
            <strong>${esc(estimate.title)}</strong><br>
            <span class="kicker">${esc(estimate.estimate_code)}</span>
          </td>

          <td>${esc(estimate.project_name || "-")}</td>

          <td><strong>${esc(rupiah(estimate.total_amount))}</strong></td>

          <td>${esc(label(estimate.status))}</td>

          <td>${actions}</td>
        `;

        rows.appendChild(tr);
      });
    } catch (error) {
      rows.innerHTML = `
        <tr>
          <td colspan="5">
            Estimate belum dapat dimuat: ${esc(error.message || "Unknown error")}
          </td>
        </tr>
      `;
    }
  }

  view.addEventListener("click", async event => {
    const button =
      event.target.closest("[data-ce-decision]");

    if (!button) return;

    const decision = button.dataset.ceDecision;

    if (!confirm(
      decision === "approved"
        ? "Setujui estimate ini?"
        : "Tolak estimate ini?"
    )) return;

    const response = await fetch(
      `${API}/${encodeURIComponent(button.dataset.ceId)}/decision`,
      {
        method:"POST",
        credentials:"same-origin",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        body:JSON.stringify({decision})
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      alert(data.error || `HTTP ${response.status}`);
      return;
    }

    await load();
  });

  links("Estimates").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      show();
    });
  });

  view.querySelector("[data-ce-dashboard]")
    .addEventListener("click", () => {
      leave();
      links("Dashboard")[0]?.click();
    });

  view.querySelector("[data-ce-refresh]")
    .addEventListener("click", load);
})();