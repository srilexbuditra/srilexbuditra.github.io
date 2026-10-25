"use strict";
/* DPN Gate 3C-14B R1. Standalone DEV candidate. No fetch, storage, cookies, auth, backend, payments, or real messaging. */
(() => {
  const q = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const copyLabels = Object.freeze({
    beranda: ["Beranda Pelanggan", "Rencanakan kebutuhan website dengan alur simulasi yang jelas.", "PF01"],
    mitra: ["Pilih Mitra", "Tentukan penghubung layanan atau referensi demo dari tautan masuk.", "PF02"],
    layanan: ["Layanan Website", "Lihat pilihan pembuatan website untuk kebutuhan ilustrasi.", "PF03"],
    domain: ["Domain & Kebutuhan", "Pilih kebutuhan domain baru, milik sendiri, atau tanpa domain.", "PF04"],
    pesanan: ["Formulir Pemesanan", "Isi kebutuhan proyek fiktif tanpa mengirim data.", "PF05"],
    ringkasan: ["Ringkasan & Status", "Tinjau draft pemesanan simulasi, tanpa transaksi aktif.", "PF06"],
    bantuan: ["Proyek & Bantuan", "Pahami alur proyek, revisi, dan konsultasi ilustrasi.", "PF07"]
  });
  const services = Object.freeze({
    profil: "Website Profil Usaha",
    katalog: "Katalog Produk",
    aplikasi: "Aplikasi Web Custom",
    landing: "Landing Page Promosi"
  });
  const partners = Object.freeze({
    "DEMO-MTR-001": "Mitra Contoh Bengkulu",
    "DEMO-MTR-002": "Mitra Contoh Nusantara"
  });
  const state = {
    active: "beranda", partner: "", referralSource: "", service: "", domainType: "",
    domainChecked: false, draft: null
  };
  const sidebar = q("#sidebar");
  const backdrop = q("#drawerBackdrop");
  const menuToggle = q("#menuToggle");
  const moreToggle = q("#moreToggle");
  const menuClose = q("#menuClose");
  const dialog = q("#demoDialog");
  let drawerInvoker = null;
  let toastTimeout = null;

  function isMobile() { return window.matchMedia("(max-width: 900px)").matches; }
  function isDrawerOpen() { return document.body.classList.contains("menu-open"); }
  function syncDrawerAccessibility() {
    sidebar.inert = isMobile() && !isDrawerOpen();
  }
  function setExpanded(expanded) {
    menuToggle.setAttribute("aria-expanded", String(expanded));
    moreToggle.setAttribute("aria-expanded", String(expanded));
  }
  function openDrawer(invoker) {
    if (!isMobile()) return;
    drawerInvoker = invoker;
    document.body.classList.add("menu-open");
    backdrop.hidden = false;
    syncDrawerAccessibility();
    setExpanded(true);
    menuClose.focus();
  }
  function closeDrawer(returnFocus = true) {
    if (!isDrawerOpen()) return;
    document.body.classList.remove("menu-open");
    backdrop.hidden = true;
    setExpanded(false);
    syncDrawerAccessibility();
    if (returnFocus && drawerInvoker && drawerInvoker.isConnected) drawerInvoker.focus();
  }
  function navigate(key) {
    if (!Object.hasOwn(copyLabels, key)) return;
    state.active = key;
    all(".view").forEach(section => { section.hidden = section.dataset.view !== key; });
    all("[data-view-target]").forEach(button => {
      const selected = button.dataset.viewTarget === key;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-current", selected ? "page" : "false");
    });
    const [title, description, code] = copyLabels[key];
    q("#pageTitle").textContent = title;
    q("#pageDescription").textContent = description;
    q("#pageEyebrow").textContent = `PELANGGAN / RUANG KERJA ${code}`;
    closeDrawer(false);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    q("#main").focus({ preventScroll: true });
    if (key === "pesanan" || key === "ringkasan") updateSummary();
  }
  function toast(message) {
    const el = q("#toast");
    el.textContent = message;
    el.hidden = false;
    if (toastTimeout) window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => { el.hidden = true; }, 3600);
  }
  function modal(title, message) {
    q("#dialogTitle").textContent = title;
    q("#dialogBody").textContent = message;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else toast(message);
  }
  function closeModal() { if (dialog.open) dialog.close(); }
  function feedback(id, message, isError = false) {
    const element = q(id);
    element.textContent = message;
    element.classList.toggle("is-error", isError);
    element.hidden = false;
  }
  async function copyText(value, title) {
    // Clipboard action is only initiated by a user click; no auto-copy or network request.
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard not available");
      await navigator.clipboard.writeText(value);
      toast(`${title} berhasil disalin. Hanya data ilustrasi.`);
    } catch {
      modal("Salin manual (simulasi)", `${title}:\n\n${value}\n\nBrowser tidak mengizinkan clipboard. Anda dapat menyalin teks ini secara manual.`);
    }
  }
  function updateSummary() {
    const partnerLabel = state.partner ? partners[state.partner] : "Belum dipilih";
    const serviceLabel = state.service ? services[state.service] : "Belum dipilih";
    const domainLabel = domainSummary() || "Belum dipilih";
    q("#selectedPartnerLabel").textContent = partnerLabel;
    q("#selectedPartnerCode").textContent = state.partner || "—";
    q("#selectedServiceLabel").textContent = serviceLabel;
    q("#orderPartner").textContent = partnerLabel;
    q("#orderService").textContent = serviceLabel;
    q("#orderDomain").textContent = domainLabel;
    const draft = state.draft;
    q("#summaryPartner").textContent = draft ? draft.partner : partnerLabel;
    q("#summaryService").textContent = draft ? draft.service : serviceLabel;
    q("#summaryDomain").textContent = draft ? draft.domain : domainLabel;
    q("#summaryAlias").textContent = draft ? draft.alias : "Belum ada";
    q("#summaryGoal").textContent = draft ? draft.goal : "Belum ada";
  }
  function markDraftStale() {
    if (state.draft) {
      state.draft = null;
      if (!q("#formFeedback").hidden) feedback("#formFeedback", "Pilihan berubah. Buat ulang draft simulasi jika diperlukan.");
    }
    updateSummary();
  }
  function choosePartner(code, source = "manual") {
    if (!Object.hasOwn(partners, code)) return;
    state.partner = code;
    state.referralSource = source;
    all("[data-partner]").forEach(el => {
      const checked = el.dataset.partner === code;
      el.setAttribute("aria-pressed", String(checked));
      q(".option-tick", el).textContent = checked ? "Terpilih" : "Pilih";
    });
    markDraftStale();
    toast("Mitra demo dipilih. Tidak ada atribusi referral aktual.");
  }
  function chooseService(service) {
    if (!Object.hasOwn(services, service)) return;
    state.service = service;
    all("[data-service]").forEach(el => el.setAttribute("aria-pressed", String(el.dataset.service === service)));
    markDraftStale();
    toast("Layanan contoh dipilih. Tidak ada harga atau penawaran nyata.");
  }
  function setDomainType(type) {
    if (!["baru", "milik", "tanpa"].includes(type)) return;
    state.domainType = type;
    state.domainChecked = false;
    q("#domainEmpty").hidden = true;
    q("#domainNew").hidden = type !== "baru";
    q("#domainOwned").hidden = type !== "milik";
    q("#domainNone").hidden = type !== "tanpa";
    q("#domainResult").hidden = true;
    markDraftStale();
  }
  function domainSummary() {
    if (state.domainType === "tanpa") return "Tidak membutuhkan domain";
    if (state.domainType === "milik") {
      const val = q("#ownedDomain").value;
      return ["usaha-contoh.example", "brand-ilustrasi.example"].includes(val) ? `${val} (belum diverifikasi)` : "";
    }
    if (state.domainType === "baru") {
      const val = q("#domainPrefix").value.trim();
      return state.domainChecked && /^[a-z0-9-]{3,24}$/.test(val) && !val.startsWith("-") && !val.endsWith("-")
        ? `${val}.example (cek simulasi, tidak terverifikasi)` : "";
    }
    return "";
  }
  function simulateDomain() {
    const val = q("#domainPrefix").value.trim();
    if (!/^[a-z0-9-]{3,24}$/.test(val) || val.startsWith("-") || val.endsWith("-")) {
      state.domainChecked = false;
      feedback("#domainResult", "Masukkan 3–24 karakter huruf kecil, angka, atau tanda hubung, tanpa tanda hubung di awal/akhir. Gunakan nama contoh saja.", true);
      updateSummary();
      return;
    }
    state.domainChecked = true;
    feedback("#domainResult", `SIMULASI: ${val}.example merupakan nama demonstrasi. Status ketersediaan tidak dapat ditentukan; tidak ada pemeriksaan DNS/registrar.`);
    markDraftStale();
  }
  function createDraft(event) {
    event.preventDefault();
    const errors = [];
    if (!state.partner) errors.push("Pilih Mitra ilustrasi di PF02.");
    if (!state.service) errors.push("Pilih layanan website di PF03.");
    const domain = domainSummary();
    if (!domain) errors.push("Lengkapi pilihan domain bersyarat di PF04.");
    const alias = q("#customerAlias").value;
    const contact = q("#contactDemo").value;
    const goal = q("#projectGoal").value;
    const notes = q("#projectNotes").value.trim();
    if (!["Pelanggan Contoh A", "Pelanggan Contoh B"].includes(alias)) errors.push("Pilih alias pelanggan demo.");
    if (!["KONTAK-DEMO-01", "KONTAK-DEMO-02"].includes(contact)) errors.push("Pilih kontak demo.");
    if (!["Memperkenalkan usaha ilustrasi", "Menampilkan katalog produk contoh", "Mendemonstrasikan alur aplikasi", "Menjalankan kampanye ilustrasi"].includes(goal)) errors.push("Pilih tujuan website.");
    if (notes.length < 20 || notes.length > 280) errors.push("Keterangan kebutuhan harus 20–280 karakter.");
    if (/@|https?:\/\/|\b\d{8,}\b|wa\.me/i.test(notes)) errors.push("Hapus alamat email, nomor panjang, atau URL dari keterangan; gunakan data contoh.");
    if (!q("#demoConsent").checked) errors.push("Setujui pemberitahuan data simulasi.");
    if (errors.length) {
      feedback("#formFeedback", `Belum lengkap: ${errors.join(" ")}`, true);
      return;
    }
    state.draft = Object.freeze({
      partner: partners[state.partner], code: state.partner, service: services[state.service], domain,
      alias, contact, goal, notes
    });
    feedback("#formFeedback", "Draft simulasi berhasil dibentuk di memori. Tidak ada permintaan ke server.");
    updateSummary();
    navigate("ringkasan");
    feedback("#summaryFeedback", "Draft lengkap secara simulasi. Tidak ada order, kontrak, invoice, atau pembayaran yang dikirim.");
  }
  function summaryText() {
    const d = state.draft;
    if (!d) return "Belum ada draft lengkap. Pilih Mitra, layanan, domain dan isi form PF05 terlebih dahulu.";
    return [
      "SRILEX BUDITRA · RINGKASAN DEMO · BUKAN PESANAN",
      "Referensi: ORD-DEMO-2026-001", `Mitra: ${d.partner} (${d.code})`, `Layanan: ${d.service}`,
      `Domain: ${d.domain}`, `Alias: ${d.alias}`, `Kontak fiktif: ${d.contact}`,
      `Tujuan: ${d.goal}`, `Kebutuhan ilustrasi: ${d.notes}`,
      "Status: DRAFT-DEMO / TIDAK TERKIRIM", "Tidak ada pembayaran, kontrak, atau pesan WhatsApp."
    ].join("\n");
  }
  function initReferral() {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (!ref) return;
    if (Object.hasOwn(partners, ref)) {
      choosePartner(ref, "tautan-demo");
      q("#incomingReferral").textContent = `Referensi contoh diterima: ${ref} · ${partners[ref]}. Bukan atribusi backend.`;
    } else {
      q("#incomingReferral").textContent = "Kode referensi tidak dikenali. Tidak dihubungkan ke Mitra mana pun.";
    }
  }

  all("[data-view-target]").forEach(button =>
    button.addEventListener("click", () => {
      const target = button.dataset.viewTarget;

      if (
        state.active === "domain" &&
        target === "pesanan" &&
        !domainSummary()
      ) {
        toast(
          state.domainType
            ? "Lengkapi detail domain simulasi sesuai pilihan sebelum melanjutkan."
            : "Pilih salah satu kebutuhan domain sebelum melanjutkan ke pemesanan."
        );
        return;
      }

      navigate(target);
    })
  );
  menuToggle.addEventListener("click", () => openDrawer(menuToggle));
  moreToggle.addEventListener("click", () => openDrawer(moreToggle));
  menuClose.addEventListener("click", () => closeDrawer());
  backdrop.addEventListener("click", () => closeDrawer());
  window.addEventListener("keydown", event => {
    if (event.key === "Escape" && isDrawerOpen()) closeDrawer();
    if (event.key === "Tab" && isDrawerOpen()) {
      const focusable = all("button:not([disabled])", sidebar);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener("resize", () => {
    if (!isMobile()) closeDrawer(false);
    syncDrawerAccessibility();
  });
  q("#dialogClose").addEventListener("click", closeModal);
  q("#dialogOk").addEventListener("click", closeModal);
  dialog.addEventListener("click", event => { if (event.target === dialog) closeModal(); });
  all("[data-partner]").forEach(button => button.addEventListener("click", () => choosePartner(button.dataset.partner)));
  all("[data-service]").forEach(button => button.addEventListener("click", () => chooseService(button.dataset.service)));
  all('input[name="domainType"]').forEach(input => input.addEventListener("change", () => setDomainType(input.value)));
  q("#domainPrefix").addEventListener("input", () => { state.domainChecked = false; q("#domainResult").hidden = true; markDraftStale(); });
  q("#ownedDomain").addEventListener("change", markDraftStale);
  q("#checkDemoDomain").addEventListener("click", simulateDomain);
  q("#orderForm").addEventListener("submit", createDraft);
  q("#reviewDraft").addEventListener("click", () => {
    feedback("#summaryFeedback", state.draft
      ? "Draft simulasi lengkap, tetapi belum pernah dikirim sebagai pesanan. Semua status tetap DRAFT-DEMO."
      : "Draft belum lengkap. Lengkapi Mitra, layanan, domain, dan formulir PF05 sebelum meninjau ringkasan.", !state.draft);
  });
  q("#copySummary").addEventListener("click", () => copyText(summaryText(), "Ringkasan DEMO"));
  q("#consultDemo").addEventListener("click", () => {
    modal("Konsultasi hanya simulasi", "Penghubung terpilih: " + (state.partner ? partners[state.partner] : "belum dipilih")
      + "\n\nBelum ada nomor WhatsApp, persetujuan kontak, atau pengiriman pesan. Saat produksi, CTA harus memakai kontak Mitra tervalidasi dan alur consent yang disetujui.");
  });
  q("#sharePublic").addEventListener("click", () => copyText(
    "Kenali pilihan layanan website bersama Srilex Buditra Digital Partner Network. Lihat simulasi informasi publik: https://contoh.invalid/network/pelanggan/ (TAUTAN DEMO, BUKAN PEMESANAN NYATA).",
    "Teks berbagi publik contoh"
  ));
  initReferral();
  syncDrawerAccessibility();
  updateSummary();
})();
