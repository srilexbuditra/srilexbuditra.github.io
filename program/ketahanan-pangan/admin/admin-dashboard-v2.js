'use strict';

// Dashboard Admin V2 — Tahap A (V17.19.0)
// Navigation/presentation layer only. Core admin logic stays in script-a4-v45.js.
(() => {
  const STORAGE_KEY = 'kp_admin_v2_view';
  const VIEW_META = {
    ringkasan: { label: 'Ringkasan', icon: '⌂', subtitle: 'Ikhtisar operasional program' },
    peserta: { label: 'Peserta', icon: '👥', subtitle: 'Registrasi & pemeriksaan data' },
    aktivasi: { label: 'Aktivasi Akun', icon: '🔑', subtitle: 'Audit status akun peserta' },
    verifikasi: { label: 'Verifikasi Anggota', icon: '▣', subtitle: 'Foto & VERIFIED MEMBER' },
    kartu: { label: 'Kartu & Sertifikat', icon: '▤', subtitle: 'Dokumen digital peserta' },
    event: { label: 'Aktivitas & Event', icon: '◇', subtitle: 'Agenda & kehadiran peserta' },
    manajemen: { label: 'Manajemen Admin', icon: '♟', subtitle: 'Akun & role pengelola' },
    analytics: { label: 'Laporan / Analytics', icon: '▥', subtitle: 'Ringkasan & laporan program' },
    pengaturan: { label: 'Pengaturan', icon: '⚙', subtitle: 'Akun, peran & dukungan IT' }
  };

  const ROLE_VIEWS = {
    super_admin: ['ringkasan','peserta','aktivasi','verifikasi','kartu','event','manajemen','analytics','pengaturan'],
    admin: ['ringkasan','peserta','aktivasi','verifikasi','kartu','event','analytics','pengaturan'],
    pemasaran: ['ringkasan','peserta','analytics','pengaturan']
  };

  let currentView = 'ringkasan';
  let initialized = false;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function role() {
    return document.documentElement.dataset.adminRole || 'admin';
  }

  function allowedViews() {
    return ROLE_VIEWS[role()] || ROLE_VIEWS.admin;
  }

  function initials(value) {
    const words = String(value || 'Admin').trim().split(/\s+/).filter(Boolean);
    return (words.slice(0,2).map(v => v[0]).join('') || 'AD').toUpperCase();
  }

  function injectShell() {
    if ($('#adminV2Sidebar')) return;

    const sidebar = document.createElement('aside');
    sidebar.id = 'adminV2Sidebar';
    sidebar.className = 'admin-v2-sidebar';
    sidebar.setAttribute('aria-label', 'Navigasi Dashboard Admin');
    sidebar.innerHTML = `
      <div class="admin-v2-brand">
        <img src="/program/ketahanan-pangan/assets/brand/favicon-192x192.png" alt="">
        <div><strong>Program Ketahanan Pangan</strong><span>DASHBOARD ADMIN V2 · TAHAP A</span></div>
      </div>
      <nav class="admin-v2-nav" id="adminV2Nav"></nav>
      <div class="admin-v2-sidebar-foot">
        <div class="admin-v2-user-card">
          <span id="adminV2Avatar" class="admin-v2-avatar">AD</span>
          <div><strong id="adminV2UserName">Administrator</strong><span id="adminV2UserRole">ADMIN</span></div>
        </div>
        <small class="admin-v2-sidebar-note">Navigasi V2 hanya mengatur tampilan panel. Hak akses final tetap mengikuti session dan server.</small>
      </div>`;

    const backdrop = document.createElement('button');
    backdrop.type = 'button';
    backdrop.id = 'adminV2Backdrop';
    backdrop.className = 'admin-v2-backdrop';
    backdrop.setAttribute('aria-label', 'Tutup menu');

    document.body.insertBefore(sidebar, document.body.firstChild);
    document.body.insertBefore(backdrop, document.body.firstChild.nextSibling);

    const headerNav = $('.top .wrap.nav');
    if (headerNav && !$('#adminV2TopContext')) {
      const ctx = document.createElement('div');
      ctx.id = 'adminV2TopContext';
      ctx.className = 'admin-v2-top-context';
      ctx.innerHTML = `
        <button id="adminV2MenuToggle" class="admin-v2-menu-toggle" type="button" aria-label="Buka menu" aria-expanded="false">☰</button>
        <div class="admin-v2-page-copy"><small id="adminV2Breadcrumb">Dashboard Admin</small><strong id="adminV2PageTitle">Ringkasan</strong></div>`;
      headerNav.insertBefore(ctx, headerNav.firstChild);
    }

    renderNav();
    injectHelperPanels();
    assignViews();
    bindShellEvents();
  }

  function renderNav() {
    const nav = $('#adminV2Nav');
    if (!nav) return;
    nav.innerHTML = Object.entries(VIEW_META).map(([key, meta]) => `
      <button type="button" data-admin-v2-view="${key}" aria-current="false">
        <span class="admin-v2-nav-icon" aria-hidden="true">${meta.icon}</span>
        <span>${meta.label}</span>
        <span class="admin-v2-nav-arrow" aria-hidden="true">›</span>
      </button>`).join('');
  }

  function injectHelperPanels() {
    const main = $('main.wrap');
    if (!main) return;

    if (!$('#adminV2Welcome')) {
      const welcome = document.createElement('section');
      welcome.id = 'adminV2Welcome';
      welcome.className = 'admin-v2-welcome';
      welcome.innerHTML = `
        <div>
          <span class="admin-v2-welcome-kicker">WORKSPACE ADMINISTRASI</span>
          <h2 id="adminV2WelcomeTitle">Selamat datang</h2>
          <p id="adminV2WelcomeText">Ringkasan tugas utama ditampilkan di satu ruang kerja agar pengelolaan peserta lebih cepat dan terarah.</p>
        </div>
        <div class="admin-v2-welcome-badge"><small>Session aktif</small><strong id="adminV2WelcomeRole">ADMIN</strong><small>Hak akses mengikuti server</small></div>`;
      main.insertBefore(welcome, main.firstElementChild);
    }

    if (!$('#adminV2CardLanding')) {
      const cardLanding = document.createElement('section');
      cardLanding.id = 'adminV2CardLanding';
      cardLanding.className = 'admin-v2-placeholder';
      cardLanding.innerHTML = `
        <div class="admin-v2-placeholder-head"><div><span class="eyebrow">KARTU &amp; SERTIFIKAT</span><h2>Dokumen Digital Peserta</h2><p>Penerbitan kartu, QR, dan sertifikat tetap menggunakan alur yang sudah stabil. Pilih peserta terverifikasi melalui menu Peserta, kemudian buka detail untuk mengakses dokumen digitalnya.</p></div></div>
        <div class="admin-v2-action-grid">
          <article class="admin-v2-action-card"><strong>Daftar Peserta</strong><span>Pilih peserta yang sudah terverifikasi sebelum membuka kartu atau sertifikat.</span><button type="button" data-admin-v2-go="peserta">Buka Peserta →</button></article>
          <article class="admin-v2-action-card"><strong>QR Verifikasi</strong><span>QR tetap mengarah ke verifikasi publik menggunakan alur yang sudah terkunci.</span></article>
          <article class="admin-v2-action-card"><strong>Cetak / PDF</strong><span>Fungsi cetak tetap tersedia saat kartu atau sertifikat peserta dibuka.</span></article>
        </div>`;
      main.appendChild(cardLanding);
    }

    if (!$('#adminV2AnalyticsPanel')) {
      const analytics = document.createElement('section');
      analytics.id = 'adminV2AnalyticsPanel';
      analytics.className = 'admin-v2-placeholder';
      analytics.innerHTML = `
        <div class="admin-v2-placeholder-head"><div><span class="eyebrow">LAPORAN &amp; ANALYTICS</span><h2>Ringkasan Laporan Program</h2><p>Pada Tahap A, ekspor operasional yang sudah stabil tetap berada di menu Peserta. Pemisahan analytics lanjutan dapat dilakukan bertahap tanpa mengubah sumber data atau endpoint.</p></div></div>
        <div class="admin-v2-action-grid">
          <article class="admin-v2-action-card"><strong>Ekspor Excel A4</strong><span>Gunakan filter pada daftar peserta lalu ekspor laporan seperti sebelumnya.</span><button type="button" data-admin-v2-go="peserta">Buka Peserta →</button></article>
          <article class="admin-v2-action-card"><strong>Audit Aktivasi</strong><span>Status aktivasi akun sudah dipisahkan dari status registrasi.</span><button type="button" data-admin-v2-go="aktivasi">Buka Audit →</button></article>
          <article class="admin-v2-action-card"><strong>Data Pemasaran</strong><span>Role Pemasaran tetap memakai endpoint tersanitasi dan tampilan non-sensitif.</span></article>
        </div>`;
      main.appendChild(analytics);
    }
  }

  function assignViews() {
    const main = $('main.wrap');
    if (!main) return;
    const assign = (el, views) => { if (el) el.dataset.adminV2Views = views.join(' '); };

    assign($('#adminV2Welcome'), ['ringkasan']);
    assign($('#adminRoleNotice'), ['ringkasan','pengaturan']);
    assign($('#accountSecurityPanel'), ['manajemen','pengaturan']);
    assign($('#marketingDashboard'), ['ringkasan','analytics']);
    assign($(':scope > .stats', main), ['ringkasan']);
    assign($('#accountActivationAudit'), ['aktivasi']);
    assign($('#photoStatusOverview'), ['verifikasi']);
    assign($('#statusOverview'), ['ringkasan']);
    assign($('#adminEventManagement'), ['event']);

    const registrationPanel = $$(':scope > section.panel', main).find(section => {
      const eyebrow = $('.panel-head .eyebrow', section);
      return eyebrow && /DATA PENDAFTAR/i.test(eyebrow.textContent || '');
    });
    if (registrationPanel) {
      registrationPanel.id = registrationPanel.id || 'adminV2RegistrationsPanel';
      assign(registrationPanel, ['peserta']);
    }

    assign($(':scope > section.flow', main), ['peserta']);
    assign($('#registrationDetailPanel'), ['peserta','aktivasi','verifikasi','kartu']);
    assign($('#certificatePanel'), ['peserta','kartu']);
    assign($(':scope > section.it-support-panel', main), ['pengaturan']);
    assign($('#adminV2CardLanding'), ['kartu']);
    assign($('#adminV2AnalyticsPanel'), ['analytics']);
  }

  function syncIdentity() {
    const display = ($('#adminDisplayName')?.textContent || 'Administrator').trim();
    const roleText = ($('#adminRoleBadge')?.textContent || role()).trim();
    const user = $('#adminV2UserName');
    const roleNode = $('#adminV2UserRole');
    const avatar = $('#adminV2Avatar');
    const welcomeTitle = $('#adminV2WelcomeTitle');
    const welcomeRole = $('#adminV2WelcomeRole');

    if (user) user.textContent = display;
    if (roleNode) roleNode.textContent = roleText;
    if (avatar) avatar.textContent = initials(display);
    if (welcomeTitle) welcomeTitle.textContent = `Selamat datang, ${display}`;
    if (welcomeRole) welcomeRole.textContent = roleText;
  }

  function syncRoleNav() {
    const allowed = new Set(allowedViews());
    $$('[data-admin-v2-view]').forEach(button => {
      const view = button.dataset.adminV2View;
      button.hidden = !allowed.has(view);
    });
    if (!allowed.has(currentView)) currentView = 'ringkasan';
  }

  function setView(view, options = {}) {
    const allowed = new Set(allowedViews());
    if (!allowed.has(view)) view = 'ringkasan';
    currentView = view;

    const main = $('main.wrap');
    if (!main) return;
    assignViews();

    $$(':scope > section', main).forEach(section => {
      const views = String(section.dataset.adminV2Views || 'ringkasan').split(/\s+/).filter(Boolean);
      section.classList.toggle('admin-v2-view-hidden', !views.includes(view));
    });

    $$('[data-admin-v2-view]').forEach(button => {
      const active = button.dataset.adminV2View === view;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
    });

    const meta = VIEW_META[view] || VIEW_META.ringkasan;
    const title = $('#adminV2PageTitle');
    const crumb = $('#adminV2Breadcrumb');
    if (title) title.textContent = meta.label;
    if (crumb) crumb.textContent = meta.subtitle;
    document.body.dataset.adminV2View = view;
    sessionStorage.setItem(STORAGE_KEY, view);

    if (view === 'manajemen') {
      const btn = $('#userManagementToggle');
      if (btn && !btn.hidden) setTimeout(() => btn.click(), 0);
    } else if (view === 'pengaturan') {
      const btn = $('#roleFunctionToggle');
      if (btn) setTimeout(() => btn.click(), 0);
    }

    closeDrawer();
    if (!options.keepScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openDrawer() {
    document.body.classList.add('admin-v2-sidebar-open');
    $('#adminV2MenuToggle')?.setAttribute('aria-expanded','true');
  }

  function closeDrawer() {
    document.body.classList.remove('admin-v2-sidebar-open');
    $('#adminV2MenuToggle')?.setAttribute('aria-expanded','false');
  }

  function bindShellEvents() {
    if (document.body.dataset.adminV2Bound === '1') return;
    document.body.dataset.adminV2Bound = '1';

    document.addEventListener('click', (event) => {
      const nav = event.target.closest('[data-admin-v2-view]');
      if (nav && !nav.hidden) {
        event.preventDefault();
        setView(nav.dataset.adminV2View);
        return;
      }

      const go = event.target.closest('[data-admin-v2-go]');
      if (go) {
        event.preventDefault();
        setView(go.dataset.adminV2Go);
        return;
      }

      if (event.target.closest('#adminV2MenuToggle')) {
        event.preventDefault();
        document.body.classList.contains('admin-v2-sidebar-open') ? closeDrawer() : openDrawer();
        return;
      }

      if (event.target.closest('#adminV2Backdrop')) {
        closeDrawer();
      }
    });

    // Existing status quick cards keep their original filter logic, then move the user
    // to the Peserta workspace so the filtered result is immediately visible.
    $('#statusQuickFilters')?.addEventListener('click', (event) => {
      if (event.target.closest('[data-status]')) setTimeout(() => setView('peserta'), 0);
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeDrawer();
    });
  }

  function activate() {
    injectShell();
    document.body.classList.add('admin-v2-active');
    syncIdentity();
    syncRoleNav();
    const stored = sessionStorage.getItem(STORAGE_KEY);
    setView(stored && allowedViews().includes(stored) ? stored : 'ringkasan', { keepScroll: true });
  }

  function deactivate() {
    document.body.classList.remove('admin-v2-active','admin-v2-sidebar-open');
    document.body.removeAttribute('data-admin-v2-view');
    $$('main.wrap > section.admin-v2-view-hidden').forEach(section => section.classList.remove('admin-v2-view-hidden'));
  }

  function syncAuthState() {
    const main = $('main.wrap');
    if (!main) return;
    if (main.hidden) deactivate();
    else activate();
  }

  function init() {
    if (initialized) return;
    initialized = true;
    injectShell();
    syncAuthState();

    const main = $('main.wrap');
    if (main) new MutationObserver(syncAuthState).observe(main, { attributes:true, attributeFilter:['hidden'] });

    new MutationObserver(() => {
      if (!document.body.classList.contains('admin-v2-active')) return;
      syncRoleNav();
      syncIdentity();
      setView(currentView, { keepScroll:true });
    }).observe(document.documentElement, { attributes:true, attributeFilter:['data-admin-role'] });

    const identity = $('#adminIdentity');
    if (identity) new MutationObserver(syncIdentity).observe(identity, { childList:true, subtree:true, characterData:true, attributes:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
