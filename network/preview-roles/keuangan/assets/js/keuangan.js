/* DPN Gate 3C-11B-A candidate | MOCK DOM-only: no backend, persistence, payment, or export */
(() => {
  'use strict';
  const views = ['beranda','tagihan','rekonsiliasi','komisi','pencairan','sengketa','audit'];
  const sections = [...document.querySelectorAll('.fk-screen[data-view]')];
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('mobileScrim');
  const menuButton = document.getElementById('openSidebar');
  const moreButton = document.getElementById('bottomMore');
  const dialog = document.getElementById('demoDialog');
  const dialogTitle = document.getElementById('dialogTitle');
  const dialogBody = document.getElementById('dialogBody');
  const confirm = document.getElementById('confirmDialog');
  const toast = document.getElementById('toast');
  const activity = document.getElementById('activityList');
  let pending = null;
  let toastHandle;
  const messages = {
    'detail-invoice': ['Detail invoice DEMO', 'Detail ini hanya menampilkan informasi invoice fiktif. Tidak ada penagihan, pembayaran, perubahan status, ataupun kiriman pesan.'],
    'match': ['Tinjauan rekonsiliasi DEMO', 'Pencocokan ledger ini hanya latihan antarmuka. Tidak ada akses rekening bank, mutasi, atau jurnal akuntansi nyata.'],
    'commission': ['Penjelasan komisi DEMO', 'Komisi dihitung pada contoh penjualan jasa website yang memenuhi syarat, bukan atas rekrutmen. Tarif, pajak, dan ketentuan belum diotorisasi.'],
    'payout-review': ['Kontrol pencairan DEMO', 'Maker harus berbeda dari checker. Persetujuan nyata memerlukan autentikasi, RBAC, MFA, saldo valid, ledger, serta audit persisten.'],
    'payout-approve': ['Simulasi persetujuan pencairan', 'Ini hanya simulasi checker berbeda. Tidak ada transfer, pengurangan saldo, perubahan rekening, atau penyimpanan riwayat ke server.'],
    'dispute': ['Tinjauan sengketa DEMO', 'Peninjauan ini tidak memproses refund, mengubah tagihan, atau memindahkan dana. Semua data kasus fiktif.'],
    'export': ['Pratinjau ekspor DEMO', 'Ekspor belum diimplementasikan. Tidak akan ada file dibuat atau informasi dikirim. Laporan resmi memerlukan gate backend terpisah.']
  };
  const isMobile = () => window.matchMedia('(max-width:900px)').matches;
  function closeSidebar(restoreFocus = false) {
    sidebar.classList.remove('is-open');
    scrim.hidden = true;
    menuButton.setAttribute('aria-expanded','false');
    moreButton.setAttribute('aria-expanded','false');
    if (restoreFocus && isMobile()) moreButton.focus();
  }
  function openSidebar() {
    if (!isMobile()) return;
    sidebar.classList.add('is-open');
    scrim.hidden = false;
    menuButton.setAttribute('aria-expanded','true');
    moreButton.setAttribute('aria-expanded','true');
    sidebar.querySelector('.fk-nav-link').focus();
  }
  function renderRoute() {
    const wanted = decodeURIComponent(window.location.hash.slice(1));
    const current = views.includes(wanted) ? wanted : 'beranda';
    sections.forEach(section => { section.hidden = section.dataset.view !== current; });
    document.querySelectorAll('[data-nav]').forEach(link => {
      const active = link.dataset.nav === current;
      link.classList.toggle('is-active',active);
      if (active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
    });
    document.querySelectorAll('[data-bottom]').forEach(link => {
      const active = link.dataset.bottom === current;
      link.classList.toggle('is-active',active);
      if (active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
    });
    closeSidebar();
    window.scrollTo(0,0);
  }
  function notify(message) {
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastHandle);
    toastHandle = window.setTimeout(() => { toast.hidden = true; }, 5400);
  }
  function addActivity(text) {
    const li = document.createElement('li');
    const dot = document.createElement('span');
    dot.className = 'fk-activity-dot';
    const detail = document.createElement('div');
    const strong = document.createElement('strong');
    const small = document.createElement('small');
    strong.textContent = text;
    small.textContent = 'Tindakan fiktif pada DOM · tidak dikirim / tidak disimpan';
    detail.append(strong,small);
    li.append(dot,detail);
    activity.prepend(li);
  }
  function invokeDemo(button) {
    const type = button.dataset.demo;
    const record = button.dataset.entity || 'DEMO';
    if (!Object.prototype.hasOwnProperty.call(messages,type)) return;
    if (type === 'payout-approve' && document.getElementById('checkerChoice').value === 'maker') {
      notify('DITOLAK (DEMO): maker tidak boleh menyetujui pencairannya sendiri.');
      addActivity('Percobaan self-approval ditolak (simulasi) · ' + record);
      return;
    }
    const [heading,description] = messages[type];
    pending = {type,record,heading};
    dialogTitle.textContent = heading;
    dialogBody.textContent = record + '\n\n' + description;
    if (!dialog.open) dialog.showModal();
    confirm.focus();
  }
  function confirmDemo() {
    if (!pending) return;
    const entry = pending;
    pending = null;
    dialog.close();
    notify('Konfirmasi DEMO dicatat pada halaman. Tidak ada transaksi atau data nyata berubah.');
    addActivity(entry.heading + ' · ' + entry.record);
  }
  function filterInvoices() {
    const search = document.getElementById('invoiceSearch').value.trim().toLocaleLowerCase('id-ID');
    const status = document.getElementById('invoiceFilter').value;
    let shown = 0;
    document.querySelectorAll('[data-invoice]').forEach(item => {
      const matches = item.dataset.invoice.includes(search) && (status === 'semua' || item.dataset.status === status);
      item.hidden = !matches;
      if (matches) shown += 1;
    });
    document.getElementById('invoiceEmpty').hidden = shown !== 0;
    document.getElementById('invoiceCount').textContent = 'Menampilkan ' + shown + ' invoice fiktif.';
  }
  document.getElementById('closeSidebar').addEventListener('click', () => { closeSidebar(false); menuButton.focus(); }); menuButton.addEventListener('click', () => sidebar.classList.contains('is-open') ? closeSidebar(true) : openSidebar());
  moreButton.addEventListener('click', () => sidebar.classList.contains('is-open') ? closeSidebar(true) : openSidebar());
  scrim.addEventListener('click', () => closeSidebar(true));
  window.addEventListener('resize', () => { if (!isMobile()) closeSidebar(); });
  window.addEventListener('hashchange',renderRoute);
  window.addEventListener('keydown',event => { if (event.key === 'Escape' && sidebar.classList.contains('is-open') && !dialog.open) closeSidebar(true); });
  document.querySelectorAll('[data-nav]').forEach(link => link.addEventListener('click', () => closeSidebar()));
  document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => invokeDemo(button)));
  document.getElementById('closeDialog').addEventListener('click',() => { pending = null; dialog.close(); });
  document.getElementById('cancelDialog').addEventListener('click',() => { pending = null; dialog.close(); });
  dialog.addEventListener('close',() => { pending = null; });
  confirm.addEventListener('click',confirmDemo);
  document.getElementById('invoiceSearch').addEventListener('input',filterInvoices);
  document.getElementById('invoiceFilter').addEventListener('change',filterInvoices);
  renderRoute();
})();
