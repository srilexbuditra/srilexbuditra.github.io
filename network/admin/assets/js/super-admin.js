/* DPN: private production-path admin preview; server mutations remain locked until protected production API is released. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const screens = [...document.querySelectorAll('[data-view]')];
  const links = [...document.querySelectorAll('.sa-nav [data-screen], .sa-bottom-nav [data-screen]')];
  const moreButton = $('bottomMore');
  const titles = {beranda:'Beranda Super Admin',pengguna:'Pengguna & peran',akses:'Akses dokumen',audit:'Audit & aktivitas',maintenance:'Maintenance Mode',pengaturan:'Pengaturan',pemulihan:'Pemulihan'};
  let maintOn = false;
  // Admin URL must be protected by Cloudflare Access before public deployment.
  // No production maintenance API is active with this static preview.
  const m3hProtected = window.location.origin === 'https://srilexbuditra.work' &&
    ['/network/admin/','/network/admin/index.html'].includes(window.location.pathname);
  const m3hApi = '/network/api/dpn/admin/maintenance';
  let m3hState = null;
  let m3hStatus = 'pending';
  let m3hBusy = false;
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
      const verified = m3hStatus === 'verified' && typeof m3hState?.enabled === 'boolean';
      const on = verified && m3hState.enabled;
      const mutable = false; // Future production writer requires a separate explicit release gate.
      $('maintenanceBadge').textContent = verified ? (on ? 'ON · SERVER' : 'OFF · SERVER') : 'STATUS SERVER BELUM TERVERIFIKASI';
      $('maintenanceBadge').className = verified ? (on ? 'sa-pill sa-pill-alert' : 'sa-pill sa-pill-teal') : 'sa-pill sa-pill-gold';
      $('overviewMaintenance').textContent = verified ? (on ? 'ON' : 'OFF') : '—';
      $('maintenanceToggle').textContent = !mutable ? 'Kontrol Maintenance terkunci' : (on ? 'Nonaktifkan Maintenance' : 'Aktifkan Maintenance');
      $('maintenanceToggle').disabled = !mutable;
      $('maintenanceToggle').setAttribute('aria-disabled', String(!mutable));
      $('maintenanceReset').disabled = !mutable || !on;
      $('maintenanceReset').setAttribute('aria-disabled', String(!mutable || !on));
      $('maintenanceReason').disabled = !mutable;
      for (const option of $('maintenanceReason').options) {
        option.disabled = verified ? (on ? !option.value.endsWith('_OFF') && option.value !== 'DEV_MAINTENANCE_OFF_TEST' : !option.value.endsWith('_ON')) : true;
      }
      if (verified && $('maintenanceReason').selectedOptions[0]?.disabled) {
        const available = [...$('maintenanceReason').options].find(option => !option.disabled);
        if (available) $('maintenanceReason').value = available.value;
      }
      $('maintenancePreview').classList.toggle('is-on', on);
      $('maintenancePreview').querySelector('.sa-preview-mark').textContent = verified ? (on ? '⚙' : '✓') : '!';
      $('maintenancePreviewTitle').textContent = verified ? (on ? 'Maintenance DEV aktif' : 'Maintenance DEV nonaktif') : 'Status maintenance DEV belum dapat diverifikasi';
      $('maintenancePreviewText').textContent = !verified
        ? 'Tidak ada status tepercaya dari API DEV. Perubahan Maintenance tetap terkunci.'
        : 'Status ini disimpan di D1 DEV dan tidak mengubah halaman publik /network/.';
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
    if (m3hProtected) { confirmM3IMutation(target); return; }
    const verb=target?'mengaktifkan':'mematikan';
    ask('Konfirmasi Maintenance · DEMO','Anda akan '+verb+' status contoh di halaman ini saja. Tidak ada permintaan ke server, perubahan Node, atau gangguan produksi.',() => {
      maintOn=target;
      updateMaintenance();
      addAudit('Maintenance demo '+(maintOn?'ON':'OFF'),'Alasan: '+$('maintenanceReason').value+'. Tidak ada perubahan layanan nyata.');
      toast('Status tampilan Maintenance '+(maintOn?'ON':'OFF')+' (DEMO saja).');
    });
  }
  function confirmM3IMutation(target) {
    if (!m3hProtected || m3hBusy || m3hStatus !== 'verified' || m3hState?.mutable !== true ||
        typeof m3hState?.enabled !== 'boolean' || m3hState.enabled === target) return;
    const reasonCode = $('maintenanceReason').value;
    const valid = target ? ['ADMIN_MAINTENANCE_ON','SECURITY_SAFETY_ON'] :
      ['ADMIN_MAINTENANCE_OFF','DEV_MAINTENANCE_OFF_TEST'];
    if (!valid.includes(reasonCode)) { toast('Pilih alasan perubahan Maintenance DEV yang sesuai.'); return; }
    const expectedVersion = m3hState.version;
    ask('Konfirmasi Maintenance D1 DEV',
      'Ubah status Maintenance D1 DEV dari '+(target?'OFF ke ON':'ON ke OFF')+
      '? Perubahan ini tercatat dalam audit D1 DEV dan tidak membuka halaman publik /network/.',
      () => { void performM3IMutation(target,expectedVersion,reasonCode); });
  }
  async function performM3IMutation(target,expectedVersion,reasonCode) {
    if (m3hBusy) return;
    m3hBusy = true; updateMaintenance();
    try {
      const csrfResponse = await fetch(m3hApi + '/csrf', {
        method: 'POST', credentials: 'same-origin', cache: 'no-store', redirect: 'error',
        headers: {'Accept':'application/json'}
      });
      if (csrfResponse.status !== 200 || csrfResponse.redirected ||
          !/application\/json/i.test(csrfResponse.headers.get('content-type')||'')) throw new Error('CSRF_NOT_ISSUED');
      const challenge = await csrfResponse.json();
      if (!/^[A-Za-z0-9_-]{43}$/.test(challenge?.csrfToken||'')) throw new Error('CSRF_INVALID');
      const mutation = await fetch(m3hApi, {
        method: 'PUT', credentials: 'same-origin', cache:'no-store',redirect:'error',
        headers: {'Accept':'application/json','Content-Type':'application/json',
          'X-DPN-CSRF-Token':challenge.csrfToken},
        body:JSON.stringify({enabled:target,expectedVersion,reasonCode})
      });
      const contentType = mutation.headers.get('content-type')||'';
      if (mutation.status!==200 || mutation.redirected || !/application\/json/i.test(contentType))
        throw new Error('MUTATION_NOT_CONFIRMED');
      const result=await mutation.json();
      if (result?.state?.enabled!==target || result?.state?.version!==expectedVersion+1)
        throw new Error('MUTATION_RESPONSE_INVALID');
      await refreshM3HReadOnly();
      if (m3hStatus!=='verified' || m3hState?.enabled!==target ||
          m3hState?.version!==expectedVersion+1) throw new Error('POSTWRITE_STATE_NOT_CONFIRMED');
      toast('Maintenance D1 DEV '+(target?'ON':'OFF')+' terverifikasi dan tercatat dalam audit.');
    }catch{
      m3hStatus='unverified';m3hState=null;updateMaintenance();
      toast('Perubahan belum terkonfirmasi. Buka ulang Maintenance dan periksa status sebelum mencoba lagi.');
    }finally{m3hBusy=false;updateMaintenance();}
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
          'Accept': 'application/json'
        }
      });
      if (!response.ok || response.status !== 200 || response.redirected ||
          !/application\/json/i.test(response.headers.get('content-type') || '')) throw new Error('API_NOT_VERIFIED');
      const state = await response.json();
      if (state?.ready !== true || typeof state?.enabled !== 'boolean' ||
          state?.mode !== 'PRODUCTION' || typeof state?.mutable !== 'boolean' ||
          !Number.isSafeInteger(state?.version) || state.version < 1)
        throw new Error('STATE_NOT_VERIFIED');
      m3hState = { enabled: state.enabled, version: state.version, mutable: state.mutable };
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
  $('maintenanceToggle').addEventListener('click',()=>toggleMaintenance(m3hProtected ? !m3hState?.enabled : !maintOn));
  $('maintenanceReset').addEventListener('click',()=>{
    if (m3hProtected) { confirmM3IMutation(false); return; }
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
