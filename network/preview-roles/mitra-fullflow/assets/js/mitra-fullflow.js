"use strict";
/* DPN Gate 3C-13C R1: DEV MOCK ONLY. No fetch, auth, cookies, storage, secrets, real-money operations. */
(() => {
  const q = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const labels = Object.freeze({
    beranda: ["Beranda Mitra", "Pantau kegiatan kemitraan dalam satu ruang kerja ilustrasi.", "MF01"],
    website: ["Website Pribadi", "Atur contoh promosi website tanpa mempublikasikan data.", "MF02"],
    referral: ["Referral & Bagikan", "Lihat link referral contoh yang tidak aktif.", "MF03"],
    jaringan: ["Jaringan Mitra", "Telusuri jaringan ilustrasi berdasarkan level.", "MF04"],
    prospek: ["Prospek & Penjualan", "Pantau prospek dan pesanan website simulasi.", "MF05"],
    komisi: ["Komisi & Bonus", "Tinjau ilustrasi komisi berbasis penjualan jasa.", "MF06"],
    pengaturan: ["Pencairan & Pengaturan", "Pahami status verifikasi dan pembatasan pencairan.", "MF07"]
  });
  const sidebar = q("#sidebar");
  const backdrop = q("#drawerBackdrop");
  const menuToggle = q("#menuToggle");
  const moreToggle = q("#moreToggle");
  const closeButton = q("#menuClose");
  const dialog = q("#demoDialog");
  const dialogBody = q("#dialogBody");
  let active = "beranda";
  let invoker = null;
  let toastTimer = null;

  function drawerIsOpen() { return document.body.classList.contains("menu-open"); }
  function toggleState(expanded) {
    for (const button of [menuToggle, moreToggle]) {
      button.setAttribute("aria-expanded", String(expanded));
    }
  }
  function showDrawer(button) {
    if (window.matchMedia("(min-width: 901px)").matches) return;
    invoker = button;
    document.body.classList.add("menu-open");
    backdrop.hidden = false;
    sidebar.removeAttribute("inert");
    toggleState(true);
    closeButton.focus();
  }
  function hideDrawer(restoreFocus = true) {
    if (!drawerIsOpen()) return;
    document.body.classList.remove("menu-open");
    backdrop.hidden = true;
    toggleState(false);
    if (window.matchMedia("(max-width: 900px)").matches) sidebar.setAttribute("inert", "");
    if (restoreFocus && invoker && invoker.isConnected) invoker.focus();
    invoker = null;
  }
  function setView(key) {
    if (!Object.hasOwn(labels, key)) return;
    active = key;
    for (const view of all(".view")) view.hidden = view.dataset.view !== key;
    for (const button of all("[data-view-target]")) {
      const selected = button.dataset.viewTarget === key;
      button.classList.toggle("is-active", selected);
      if (button.classList.contains("side-link") || button.classList.contains("mobile-link")) {
        button.setAttribute("aria-current", selected ? "page" : "false");
      }
    }
    // Lainnya membuka sidebar lengkap untuk ruang kerja di luar empat tab cepat.
    moreToggle.classList.toggle("is-active", !["beranda", "website", "referral", "prospek"].includes(key));
    q("#pageTitle").textContent = labels[key][0];
    q("#pageDescription").textContent = labels[key][1];
    q("#pageEyebrow").textContent = "MITRA / RUANG KERJA " + labels[key][2];
    hideDrawer(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    q("#main").focus({ preventScroll: true });
  }
  function openDialog(title, lines) {
    q("#dialogTitle").textContent = title;
    dialogBody.replaceChildren();
    for (const line of lines) {
      const paragraph = document.createElement("p");
      paragraph.textContent = line;
      dialogBody.appendChild(paragraph);
    }
    dialog.showModal();
  }
  function closeDialog() { if (dialog.open) dialog.close(); }
  function notify(message) {
    const toast = q("#toast");
    toast.textContent = message;
    toast.hidden = false;
    if (toastTimer !== null) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toast.hidden = true; toastTimer = null; }, 4200);
  }
  async function copyDemo(value, label) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      notify("Clipboard tidak tersedia pada konteks ini. Salin manual dari kolom contoh.");
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      notify(label + " disalin. Ini hanya data DEMO, bukan tautan aktif.");
    } catch {
      notify("Browser menolak akses clipboard. Salin manual dari kolom contoh.");
    }
  }
  function filterLevel(level) {
    const rows = all("[data-member-level]");
    let visible = 0;
    for (const row of rows) {
      row.hidden = level !== "semua" && row.dataset.memberLevel !== level;
      if (!row.hidden) visible++;
    }
    for (const button of all("[data-level]")) {
      const selected = button.dataset.level === level;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    }
    q("#memberCount").textContent = visible + " anggota ilustrasi ditampilkan.";
  }
  function filterLeads() {
    const text = q("#leadSearch").value.trim().toLowerCase();
    const status = q("#leadStatus").value;
    let visible = 0;
    for (const row of all(".lead-row")) {
      row.hidden = (status !== "semua" && row.dataset.status !== status) || !row.textContent.toLowerCase().includes(text);
      if (!row.hidden) visible++;
    }
    q("#leadCount").textContent = visible + " prospek contoh ditampilkan.";
    q("#leadsEmpty").hidden = visible !== 0;
  }
  function filterLedger(type) {
    let visible = 0;
    for (const row of all("[data-ledger]")) {
      row.hidden = type !== "semua" && row.dataset.ledger !== type;
      if (!row.hidden) visible++;
    }
    for (const button of all("[data-ledger-filter]")) {
      const selected = button.dataset.ledgerFilter === type;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    }
    q("#ledgerCount").textContent = visible + " transaksi ilustrasi ditampilkan.";
  }

  for (const button of [menuToggle, moreToggle]) button.addEventListener("click", () => showDrawer(button));
  closeButton.addEventListener("click", () => hideDrawer(true));
  backdrop.addEventListener("click", () => hideDrawer(true));
  window.addEventListener("keydown", event => {
    if (event.key === "Escape" && drawerIsOpen()) { event.preventDefault(); hideDrawer(true); }
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", event => {
    if (event.matches) { hideDrawer(false); sidebar.removeAttribute("inert"); }
    else if (!drawerIsOpen()) sidebar.setAttribute("inert", "");
  });
  if (window.matchMedia("(max-width: 900px)").matches) sidebar.setAttribute("inert", "");

  for (const button of all("[data-view-target]")) {
    button.addEventListener("click", () => setView(button.dataset.viewTarget));
  }
  for (const selectId of ["headlineTemplate", "ctaTemplate"]) {
    q("#" + selectId).addEventListener("change", () => {
      q("#previewHeadline").textContent = q("#headlineTemplate").value;
      q("#previewCTA").textContent = q("#ctaTemplate").value;
    });
  }
  for (const button of all("[data-level]")) button.addEventListener("click", () => filterLevel(button.dataset.level));
  q("#leadSearch").addEventListener("input", filterLeads);
  q("#leadStatus").addEventListener("change", filterLeads);
  for (const button of all("[data-ledger-filter]")) button.addEventListener("click", () => filterLedger(button.dataset.ledgerFilter));

  for (const button of all("[data-action]")) {
    button.addEventListener("click", () => {
      switch (button.dataset.action) {
        case "preview-website":
          openDialog("Pratinjau website pribadi", [q("#previewHeadline").textContent, "Tombol contoh: " + q("#previewCTA").textContent, "Belum ada halaman publik, nomor WhatsApp aktif, atau penyimpanan pengaturan."]); break;
        case "copy-ref":
          void copyDemo(q("#refLink").value, "Link referral contoh"); break;
        case "copy-share":
          void copyDemo("DEMO SRILEX BUDITRA: Kenali contoh layanan website untuk usaha melalui tautan TIDAK AKTIF: " + q("#refLink").value + " — Hanya simulasi, tidak menerima pesanan.", "Teks promosi simulasi"); break;
        case "lead-detail":
          openDialog("Detail prospek " + button.dataset.leadId, ["Prospek dan usaha ini sepenuhnya fiktif.", "Pemeriksaan harga, penawaran, kontrak, pemesanan, dan perubahan status tidak tersedia tanpa backend berotorisasi."]); break;
        case "withdraw-demo":
          openDialog("Simulasi pencairan ditolak", ["Status identitas Mitra: PENDING DEMO.", "Status rekening payout: BELUM TERVERIFIKASI.", "Saldo nyata: Rp 0. Tidak ada permintaan pencairan dibuat, disimpan, atau dikirim."]); break;
        case "requirements":
          openDialog("Persyaratan sebelum aktivasi nyata", ["Verifikasi identitas dan rekening dilakukan privat oleh petugas berwenang.", "Saldo harus berasal dari ledger sah, dengan audit, batas pencairan, dan peninjau independen.", "Fitur hanya dapat diaktifkan setelah uji keamanan, kepatuhan, pajak, dan izin produksi tersendiri."]); break;
        default: break;
      }
    });
  }
  q("#dialogClose").addEventListener("click", closeDialog);
  q("#dialogDone").addEventListener("click", closeDialog);
  dialog.addEventListener("click", event => { if (event.target === dialog) closeDialog(); });
})();
