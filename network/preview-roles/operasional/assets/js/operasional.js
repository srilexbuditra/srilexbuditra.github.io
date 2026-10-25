/* DPN Gate 3C-10B CANDIDATE ONLY: DOM mock, no storage/network/backend. */
'use strict';
(() => {
  const ids = ['beranda','mitra','pesanan','proyek','penugasan','bantuan','aktivitas'];
  const labels = {beranda:'Beranda Operasional',mitra:'Mitra & Prospek',pesanan:'Pesanan',proyek:'Proyek',penugasan:'Penugasan & SLA',bantuan:'Revisi & Bantuan',aktivitas:'Aktivitas'};
  const $ = (id) => document.getElementById(id);
  const sidebar = $('sidebar');
  const scrim = $('mobileScrim');
  const bottomMore = $('bottomMore');
  const openSidebar = $('openSidebar');
  const dialog = $('demoDialog');
  const toast = $('toast');
  let onConfirm = null;
  let restoreFocus = null;
  let toastTimer = null;

  function closeNav(restore = false) {
    sidebar.classList.remove('is-open');
    scrim.hidden = true;
    openSidebar.setAttribute('aria-expanded','false');
    bottomMore.setAttribute('aria-expanded','false');
    if (restore && window.matchMedia('(max-width:900px)').matches) openSidebar.focus();
  }
  function showNav() {
    sidebar.classList.add('is-open');
    scrim.hidden = false;
    openSidebar.setAttribute('aria-expanded','true');
    bottomMore.setAttribute('aria-expanded','true');
    const firstLink = sidebar.querySelector('.op-nav a');
    if (firstLink) firstLink.focus();
  }
  function showScreen(name, updateHash = true) {
    if (!ids.includes(name)) name = 'beranda';
    ids.forEach(id => {
      const active = id === name;
      const el = $(id);
      el.hidden = !active;
      el.classList.toggle('is-active', active);
    });
    document.querySelectorAll('[data-screen]').forEach(el => {
      if (el.dataset.screen === name) el.setAttribute('aria-current','page');
      else el.removeAttribute('aria-current');
    });
    $('currentCrumb').textContent = labels[name];
    closeNav(false);
    if (updateHash && window.location.hash !== '#' + name) history.replaceState(null,'','#' + name);
    window.scrollTo({top:0,behavior:'instant'});
  }
  function alertToast(message) {
    if (toastTimer) window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3500);
  }
  function record(message) {
    const row = document.createElement('div');
    row.className = 'op-activity-row';
    const symbol = document.createElement('span');
    symbol.textContent = '↗';
    const body = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = message;
    const small = document.createElement('small');
    small.textContent = 'Tindakan lokal pada DOM · tidak dikirim dan tidak disimpan';
    body.append(title,small);
    const stamp = document.createElement('em');
    stamp.textContent = 'DEMO';
    row.append(symbol,body,stamp);
    $('activityList').prepend(row);
  }
  function promptDemo(title, message, callback) {
    restoreFocus = document.activeElement;
    $('dialogTitle').textContent = title;
    $('dialogText').textContent = message;
    onConfirm = callback || null;
    if (dialog.showModal) dialog.showModal();
  }
  function closeDialog() {
    if (dialog.open) dialog.close();
    onConfirm = null;
    if (restoreFocus && restoreFocus.isConnected && restoreFocus.focus) restoreFocus.focus();
    restoreFocus = null;
  }
  function handleAction(name) {
    switch (name) {
      case 'help': promptDemo('Panduan pratinjau','Gunakan menu untuk menguji tujuh ruang kerja. Semua interaksi adalah contoh dan tidak tersambung ke sistem nyata.'); break;
      case 'loading': $('mockState').textContent = 'Memuat data simulasi… Tidak ada permintaan server.'; alertToast('Status loading demo ditampilkan.'); break;
      case 'empty': $('mockState').textContent = 'Tidak ada data contoh yang ditugaskan pada filter ini.'; alertToast('Empty state demo ditampilkan.'); break;
      case 'error': $('mockState').textContent = 'Terjadi kesalahan simulasi. Tidak ada kegagalan API sungguhan.'; alertToast('Error state demo ditampilkan.'); break;
      case 'denied': $('mockState').textContent = 'Akses ditolak (contoh): Admin Operasional tidak boleh melihat rekening, KYC mentah, ledger, dan pencairan.'; alertToast('No permission demo ditampilkan.'); break;
      case 'suspended': $('mockState').textContent = 'Akun ditangguhkan (contoh). Tidak ada akun nyata yang diubah.'; alertToast('Suspended state demo ditampilkan.'); break;
      case 'overdue': $('mockState').textContent = 'Tugas melewati SLA (contoh). Tidak ada tenggat sistem nyata.'; alertToast('Overdue state demo ditampilkan.'); break;
      case 'milestone': promptDemo('Ubah milestone contoh','Konfirmasi untuk mencatat progres simulasi ke aktivitas selama halaman terbuka.', () => record('Milestone simulasi ditandai untuk ditinjau')); break;
      case 'assign': promptDemo('Penugasan fiktif','Konfirmasi tugas demo; tidak ada staf yang mendapatkan penugasan nyata.', () => record('Penugasan tugas fiktif dikonfirmasi')); break;
      case 'reply': promptDemo('Tanggapan revisi demo','Konfirmasi tanggapan contoh. Tidak ada WhatsApp, email, atau pesan pelanggan yang dikirim.', () => record('Tanggapan tiket fiktif dikonfirmasi')); break;
      default: alertToast('Aksi ini hanya tersedia sebagai simulasi.');
    }
  }
  document.addEventListener('click', event => {
    const jump = event.target.closest('[data-jump]');
    if (jump) { event.preventDefault(); showScreen(jump.dataset.jump); return; }
    const link = event.target.closest('[data-screen]');
    if (link) { event.preventDefault(); showScreen(link.dataset.screen); return; }
    const action = event.target.closest('[data-action]');
    if (action) { handleAction(action.dataset.action); return; }
    const detail = event.target.closest('[data-detail]');
    if (detail) {
      const row = detail.closest('.op-list-row');
      const name = row ? row.querySelector('strong').textContent : 'Data simulasi';
      promptDemo('Detail ' + detail.dataset.detail + ' · DEMO', name + '. Data ini hanya contoh penugasan; tidak memuat identitas atau nomor rekening asli.');
    }
  });
  openSidebar.addEventListener('click',showNav);
  bottomMore.addEventListener('click',showNav);
  $('closeSidebar').addEventListener('click',() => closeNav(true));
  scrim.addEventListener('click',() => closeNav(true));
  window.addEventListener('resize',() => { if (!window.matchMedia('(max-width:900px)').matches) closeNav(false); });
  document.addEventListener('keydown',event => { if (event.key === 'Escape' && sidebar.classList.contains('is-open')) closeNav(true); });
  $('dialogClose').addEventListener('click',closeDialog);
  $('dialogCancel').addEventListener('click',closeDialog);
  dialog.addEventListener('close',() => { onConfirm = null; if (restoreFocus && restoreFocus.isConnected && restoreFocus.focus) restoreFocus.focus(); restoreFocus = null; });
  $('dialogConfirm').addEventListener('click',() => { const fn = onConfirm; closeDialog(); if (typeof fn === 'function') { fn(); alertToast('Konfirmasi DEMO berhasil. Tidak ada data nyata berubah.'); } });
  $('mitraSearch').addEventListener('input',event => {
    const q = event.target.value.toLocaleLowerCase('id-ID').trim();
    let count = 0;
    document.querySelectorAll('#mitraList [data-search]').forEach(row => {
      row.hidden = !row.dataset.search.includes(q);
      if (!row.hidden) count++;
    });
    $('mitraEmpty').hidden = count !== 0;
  });
  $('orderFilter').addEventListener('change',event => {
    const value = event.target.value;
    let count = 0;
    document.querySelectorAll('#orderList [data-status]').forEach(row => {
      row.hidden = value === 'none' || (value !== 'all' && row.dataset.status !== value);
      if (!row.hidden) count++;
    });
    $('orderEmpty').hidden = count !== 0;
  });
  window.addEventListener('hashchange', () => showScreen(window.location.hash.slice(1),false));
  showScreen(window.location.hash.slice(1) || 'beranda',false);
})();
