/* DPN M3-H: existing mock unchanged outside exact Access-protected /network/dev/admin/; DEV status read-only; no maintenance writes. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const screens = [...document.querySelectorAll('[data-view]')];
  const links = [...document.querySelectorAll('.sa-nav [data-screen], .sa-bottom-nav [data-screen]')];
  const moreButton = $('bottomMore');
  const titles = {beranda:'Beranda Super Admin',pengguna:'Pengguna & peran',akses:'Akses dokumen',audit:'Audit & aktivitas',maintenance:'Maintenance Mode',pengaturan:'Pengaturan',pemulihan:'Pemulihan'};
  let maintOn = false;
  // M3-H integration is strictly dormant on the existing local/public MOCK URL.
  // The /network/dev/admin/ HTML route is NOT created by this source-only change.
  const m3hProtected = window.location.origin === 'https://srilexbuditra.work' &&
    window.location.pathname === '/network/dev/admin/';
  const m3hApi = '/network/dev/api/dpn/admin/maintenance';
  const m3hVersionOverride = 'srilexbuditra-network-api-dev="86e87c1e-0fd9-4170-869b-7eb1a2c3407c"';
  let m3hState = null;
  let m3hStatus = 'pending';
  let pendingAction = null;
  let accessKind = 'identitas';
  let toastCounter = 0;
  const genericDialog = $('genericDialog');
  const mfaDialog = $('mfaDialog');

  function closeNav() {
    document.body.classList.remove('sa-nav-open');
    $('mobileScrim').hidden = true;
    $('openSidebar').setAttribute('aria-expanded', 'false');
    moreButton.setAttribute('aria-expanded', 'false');
  }
  function openNav() {
    document.body.classList.add('sa-nav-open');
    $('mobileScrim').hidden = false;
    $('openSidebar').setAttribute('aria-expanded', 'true');
    moreButton.setAttribute('aria-expanded', 'true');
    $('closeSidebar').focus();
  }
  function showScreen(name) {
    if (!Object.prototype.hasOwnProperty.call(titles,name)) return;
    for (const section of screens) {
      const active = section.dataset.view === name;
      section.hidden = !active;
      section.classList.toggle('is-active',active);
    }
    for (const link of links) {
      if (link.dataset.screen === name) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    }
    if (['akses','pengaturan','pemulihan'].includes(name)) moreButton.setAttribute('aria-current','page');
    else moreButton.removeAttribute('aria-current');
    $('currentCrumb').textContent = titles[name];
    closeNav();
    window.scrollTo({top:0,behavior:'instant'});
    $('mainContent').focus({preventScroll:true});
    if (m3hProtected && name === 'maintenance') void refreshM3HReadOnly();
  }
  function toast(message) {
    const number = ++toastCounter;
    const node = $('toast');
    node.textContent = message;
    node.hidden = false;
    // Notification remains available until the next direct user action, without timers.
    node.dataset.messageNumber = String(number);
  }
  function clearToast() { $('toast').hidden = true; }
  function addAudit(title,description) {
    const row = document.createElement('div');
    row.className = 'sa-audit-row';
    const dot = document.createElement('span'); dot.className='sa-audit-dot';
    const info = document.createElement('div');
    const strong = document.createElement('strong'); strong.textContent=title;
    const small = document.createElement('small'); small.textContent=description;
    const label = document.createElement('span'); label.textContent='DEMO';
    info.append(strong,small); row.append(dot,info,label);
    $('demoAuditList').prepend(row);
  }
  function ask(title,message,onConfirm) {
    $('dialogTitle').textContent=title;
    $('dialogMessage').textContent=message;
    pendingAction=onConfirm;
    $('dialogConfirm').hidden = !onConfirm;
    genericDialog.showModal();
  }
  function updateMaintenance() {
    if (m3hProtected) {
      // Fail closed: unknown/denied is NEVER represented as "Maintenance OFF".
      const on = m3hStatus === 'verified' && m3hState?.enabled === true;
      $('maintenanceBadge').textContent = on ? 'ON · DEV SERVER' : 'STATUS DEV BELUM TERVERIFIKASI';
      $('maintenanceBadge').className = on ? 'sa-pill sa-pill-alert' : 'sa-pill sa-pill-gold';
      $('overviewMaintenance').textContent = on ? 'ON' : '—';
      $('maintenanceToggle').textContent = 'Kontrol Maintenance terkunci';
      $('maintenanceToggle').disabled = true;
      $('maintenanceToggle').setAttribute('aria-disabled', 'true');
      $('maintenanceReset').disabled = true;
      $('maintenanceReset').setAttribute('aria-disabled', 'true');
      $('maintenanceReason').disabled = true;
      $('maintenancePreview').classList.toggle('is-on', on);
      $('maintenancePreview').querySelector('.sa-preview-mark').textContent = on ? '⚙' : '!';
      $('maintenancePreviewTitle').textContent = on ? 'Maintenance DEV aktif' : 'Status maintenance DEV belum dapat diverifikasi';
      $('maintenancePreviewText').textContent = on
        ? 'Status ON terverifikasi dari API DEV melalui Cloudflare Access. Maintenance OFF terkunci sampai gate rilis terpisah.'
        : 'Tidak ada status tepercaya dari API DEV. Perubahan Maintenance tetap terkunci; bukan indikasi Maintenance OFF.';
      return;
    }
    $('maintenanceBadge').textContent = maintOn ? 'ON · DEMO' : 'OFF · NORMAL';
    $('maintenanceBadge').className = maintOn ? 'sa-pill sa-pill-alert' : 'sa-pill sa-pill-teal';
    $('overviewMaintenance').textContent = maintOn ? 'ON' : 'OFF';
    $('maintenanceToggle').textContent = maintOn ? 'Nonaktifkan mode demo' : 'Aktifkan mode demo';
    $('maintenancePreview').classList.toggle('is-on',maintOn);
    $('maintenancePreview').querySelector('.sa-preview-mark').textContent = maintOn ? '⚙' : '✓';
    $('maintenancePreviewTitle').textContent = maintOn ? 'Mode pemeliharaan contoh' : 'Layanan contoh berjalan normal';
    $('maintenancePreviewText').textContent = maintOn ? $('maintenanceReason').value + '. Ini hanya layar contoh, bukan status server.' : 'Saat ini Maintenance OFF dalam simulasi. Tampilan layanan nyata tidak terpengaruh.';
  }
  function toggleMaintenance(target) {
    if (m3hProtected) { toast('Kontrol Maintenance DEV terkunci. Tidak ada perintah perubahan dikirim.'); return; }
    const verb=target?'mengaktifkan':'mematikan';
    ask('Konfirmasi Maintenance · DEMO','Anda akan '+verb+' status contoh di halaman ini saja. Tidak ada permintaan ke server, perubahan Node, atau gangguan produksi.',() => {
      maintOn=target;
      updateMaintenance();
      addAudit('Maintenance demo '+(maintOn?'ON':'OFF'),'Alasan: '+$('maintenanceReason').value+'. Tidak ada perubahan layanan nyata.');
      toast('Status tampilan Maintenance '+(maintOn?'ON':'OFF')+' (DEMO saja).');
    });
  }
  async function refreshM3HReadOnly() {
    if (!m3hProtected) return;
    // Never read a normal 100% baseline that has its candidate runtime disabled.
    // Override is restricted to the exact Access-protected staged Admin page.
    m3hState = null;
    m3hStatus = 'pending';
    updateMaintenance();
    try {
      const response = await fetch(m3hApi, {
        method: 'GET', credentials: 'same-origin', cache: 'no-store', redirect: 'error',
        headers: {
          'Accept': 'application/json',
          'Cloudflare-Workers-Version-Overrides': m3hVersionOverride
        }
      });
      if (!response.ok || response.status !== 200 || response.redirected ||
          !/application\/json/i.test(response.headers.get('content-type') || '')) throw new Error('API_NOT_VERIFIED');
      const state = await response.json();
      if (state?.ready !== true || state?.enabled !== true ||
          state?.mode !== 'DEV_CANDIDATE' ||
          !Number.isSafeInteger(state?.version) || state.version < 1)
        throw new Error('STATE_NOT_VERIFIED');
      m3hState = { enabled: true, version: state.version };
      m3hStatus = 'verified';
    } catch {
      // Do not log response bodies, JWTs, Access identities or account details.
      m3hState = null;
      m3hStatus = 'unverified';
    }
    updateMaintenance();
  }
  function clearSensitive() { $('sensitiveResult').hidden = true; $('mfaCode').value=''; $('mfaPurpose').value=''; }
  function resetPreview() {
    maintOn=false; updateMaintenance(); clearSensitive();
    document.body.classList.remove('sa-density-compact'); $('densityToggle').setAttribute('aria-pressed','false'); $('densityToggle').textContent='Aktifkan ringkas';
    $('maintenanceReason').selectedIndex=0; $('userSearch').value=''; filterUsers();
    const audit=$('demoAuditList'); while (audit.children.length>2) audit.firstElementChild.remove();
    toast('Semua status pratinjau kembali ke awal. Tidak ada layanan nyata yang diubah.');
  }
  function filterUsers() {
    const query = $('userSearch').value.toLocaleLowerCase('id').trim();
    let visible = 0;
    for(const row of document.querySelectorAll('.sa-user-row')) {
      const yes = row.dataset.search.includes(query);
      row.hidden=!yes;
      if (yes) visible++;
    }
    $('userSearchEmpty').hidden = visible>0;
  }

  document.addEventListener('click',e=>{
    const more = e.target.closest('[data-more-nav]');
    if (more) { e.preventDefault(); clearToast(); openNav(); return; }
    const tab = e.target.closest('[data-screen]');
    if (tab) { e.preventDefault();clearToast();showScreen(tab.dataset.screen);return; }
    const jump = e.target.closest('[data-jump]');
    if (jump) { clearToast();showScreen(jump.dataset.jump);return; }
    const sens = e.target.closest('[data-open-sensitive]');
    if (sens) {accessKind=sens.dataset.openSensitive; $('mfaError').hidden=true; $('mfaTitle').textContent='MFA demo · '+(accessKind==='identitas'?'Dokumen identitas':'Rekening contoh'); mfaDialog.showModal();return;}
    const dialogButton=e.target.closest('[data-dialog]');
    if (dialogButton) {
      if(dialogButton.dataset.dialog==='help') ask('Bantuan pratinjau','Gunakan menu samping untuk membuka setiap modul. Tidak ada data sungguhan atau hak akses yang diberikan. Semua perubahan hilang setelah halaman dimuat ulang.',null);
      else ask('Detail akun fiktif','Ini contoh pengelolaan enam peran. Pada sistem nyata, perubahan role memerlukan MFA, audit dan persetujuan keamanan. Tidak ada akun yang akan diubah.',()=>{addAudit('Tinjauan role contoh','Hanya simulasi; tidak ada perubahan hak akses.');toast('Tinjauan peran selesai (DEMO, tidak tersimpan).');});
    }
  });
  $('openSidebar').addEventListener('click',openNav);
  $('closeSidebar').addEventListener('click',closeNav);
  $('mobileScrim').addEventListener('click',closeNav);
  $('dialogConfirm').addEventListener('click',()=>{
    if(typeof pendingAction==='function') pendingAction();
    pendingAction=null;genericDialog.close();
  });
  genericDialog.addEventListener('close',()=>{pendingAction=null;});
  $('mfaConfirm').addEventListener('click',()=>{
    if (!$('mfaPurpose').value || $('mfaCode').value.trim()!=='DEMO') { $('mfaError').hidden=false; return; }
    $('mfaError').hidden=true;
    $('sensitiveResultTitle').textContent=accessKind==='identitas'?'Dokumen identitas fiktif':'Rekening fiktif';
    $('sensitiveResultText').textContent=accessKind==='identitas'?'PRATINJAU IDENTITAS DUMMY — NAMA: CONTOH FIKTIF · NOMOR: TIDAK TERSEDIA.':'PRATINJAU REKENING DUMMY — NAMA: REKENING CONTOH · NOMOR: TIDAK TERSEDIA.';
    $('sensitiveResult').hidden=false;
    addAudit('Akses '+(accessKind==='identitas'?'identitas':'rekening')+' fiktif','Tujuan: '+$('mfaPurpose').value+'. Kode DEMO; tidak ada data nyata.');
    mfaDialog.close(); $('mfaCode').value='';
    toast('Alur MFA contoh berhasil; hanya data fiktif ditampilkan.');
    $('sensitiveResult').scrollIntoView({block:'nearest',behavior:'smooth'});
  });
  $('hideSensitive').addEventListener('click',()=>{clearSensitive();toast('Ilustrasi data sensitif disembunyikan.');});
  $('maintenanceToggle').addEventListener('click',()=>toggleMaintenance(!maintOn));
  $('maintenanceReset').addEventListener('click',()=>{
    if (m3hProtected) { toast('Maintenance OFF tetap terkunci pada DEV.'); return; }
    if(maintOn)toggleMaintenance(false);else toast('Maintenance sudah OFF pada simulasi.');
  });
  $('resetDemo').addEventListener('click',()=>ask('Reset pratinjau lokal','Pulihkan semua indikator dan hapus jejak interaksi contoh dari DOM? Tidak ada server atau database yang diubah.',resetPreview));
  $('densityToggle').addEventListener('click',()=>{
    const compact=document.body.classList.toggle('sa-density-compact');
    $('densityToggle').setAttribute('aria-pressed',String(compact));
    $('densityToggle').textContent=compact?'Kembali ke normal':'Aktifkan ringkas';
    toast('Kepadatan panel diubah sementara (DEMO).');
  });
  $('userSearch').addEventListener('input',filterUsers);
  $('maintenanceReason').addEventListener('change',()=>{if(maintOn)updateMaintenance();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav();});
  updateMaintenance(); showScreen('beranda');
  if (m3hProtected) void refreshM3HReadOnly();
})();
