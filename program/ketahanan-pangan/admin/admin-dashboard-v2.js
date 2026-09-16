'use strict';

// Dashboard Admin V2 — Navigation Sync & Stability + Admin Management Fix (V17.19.2)
// Presentation/navigation layer only. Core admin logic remains in script-a4-v45.js.
(() => {
  const STORAGE_KEY = 'kp_admin_v2_view';
  const BASE_PATH = '/program/ketahanan-pangan/admin/';

  const VIEW_META = {
    ringkasan: { label: 'Ringkasan', icon: '⌂', subtitle: 'Ikhtisar operasional program' },
    peserta: { label: 'Peserta', icon: '👥', subtitle: 'Registrasi & pemeriksaan data' },
    aktivasi: { label: 'Aktivasi Akun', icon: '🔑', subtitle: 'Audit status akun peserta' },
    verifikasi: { label: 'Verifikasi Anggota', icon: '▣', subtitle: 'Foto & VERIFIED MEMBER' },
    kartu: { label: 'Kartu & Sertifikat', icon: '▤', subtitle: 'Dokumen digital peserta' },
    event: { label: 'Aktivitas & Event', icon: '◇', subtitle: 'Agenda & kehadiran peserta' },
    manajemen: { label: 'Manajemen Admin', icon: '♟', subtitle: 'Akun pengelola & kontrol akses' },
    analytics: { label: 'Laporan / Analytics', icon: '▥', subtitle: 'Ringkasan & laporan program' },
    pengaturan: { label: 'Pengaturan', icon: '⚙', subtitle: 'Password, peran & dukungan IT' }
  };

  const ROLE_VIEWS = {
    super_admin: ['ringkasan','peserta','aktivasi','verifikasi','kartu','event','manajemen','analytics','pengaturan'],
    admin: ['ringkasan','peserta','aktivasi','verifikasi','kartu','event','analytics','pengaturan'],
    pemasaran: ['ringkasan','peserta','analytics','pengaturan']
  };

  let currentView = 'ringkasan';
  let initialized = false;
  let pendingUrlView = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function role() {
    return document.documentElement.dataset.adminRole || 'admin';
  }

  function allowedViews() {
    return ROLE_VIEWS[role()] || ROLE_VIEWS.admin;
  }

  function validView(value) {
    const key = String(value || '').trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(VIEW_META, key) ? key : null;
  }

  function viewFromUrl() {
    try {
      return validView(new URL(window.location.href).searchParams.get('view'));
    } catch (_) {
      return null;
    }
  }

  function viewHref(view) {
    const target = validView(view) || 'ringkasan';
    const url = new URL(window.location.href);
    url.pathname = BASE_PATH;
    url.hash = '';
    if (target === 'ringkasan') url.searchParams.delete('view');
    else url.searchParams.set('view', target);
    return `${url.pathname}${url.search}`;
  }

  function syncHistory(view, mode = 'none') {
    if (mode === 'none') return;
    const href = viewHref(view);
    const current = `${window.location.pathname}${window.location.search}`;
    if (href === current) return;
    const state = { adminV2View: view };
    if (mode === 'replace') window.history.replaceState(state, '', href);
    else window.history.pushState(state, '', href);
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
        <div><strong>Program Ketahanan Pangan</strong><span>DASHBOARD ADMIN V2 · V17.19.2</span></div>
      </div>
      <nav class="admin-v2-nav" id="adminV2Nav"></nav>
      <div class="admin-v2-sidebar-foot">
        <div class="admin-v2-user-card">
          <span id="adminV2Avatar" class="admin-v2-avatar">AD</span>
          <div><strong id="adminV2UserName">Administrator</strong><span id="adminV2UserRole">ADMIN</span></div>
        </div>
        <small class="admin-v2-sidebar-note">Navigasi V2 mengatur ruang kerja. Hak akses final tetap mengikuti session dan server.</small>
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
      <a href="${viewHref(key)}" data-admin-v2-view="${key}" aria-current="false">
        <span class="admin-v2-nav-icon" aria-hidden="true">${meta.icon}</span>
        <span>${meta.label}</span>
        <span class="admin-v2-nav-arrow" aria-hidden="true">›</span>
      </a>`).join('');
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
        <div class="admin-v2-placeholder-head"><div><span class="eyebrow">KARTU &amp; SERTIFIKAT</span><h2>Dokumen Digital Peserta</h2><p>Kartu, QR, dan sertifikat tetap memakai alur stabil yang sudah diuji. Pilih peserta melalui Daftar Peserta, buka Detail, lalu akses dokumen digital peserta terverifikasi.</p></div></div>
        <div class="admin-v2-action-grid">
          <article class="admin-v2-action-card"><strong>1 · Pilih Peserta</strong><span>Buka daftar registrasi dan pilih peserta yang sesuai.</span><a href="${viewHref('peserta')}" data-admin-v2-go="peserta">Buka Peserta →</a></article>
          <article class="admin-v2-action-card"><strong>2 · Buka Detail</strong><span>Detail peserta tetap menjadi titik aman untuk penerbitan kartu dan sertifikat.</span></article>
          <article class="admin-v2-action-card"><strong>3 · Kartu / QR / PDF</strong><span>Fungsi cetak dan verifikasi publik tidak diubah oleh Dashboard V2.</span></article>
        </div>`;
      main.appendChild(cardLanding);
    }

    if (!$('#adminV2AnalyticsPanel')) {
      const analytics = document.createElement('section');
      analytics.id = 'adminV2AnalyticsPanel';
      analytics.className = 'admin-v2-placeholder';
      analytics.innerHTML = `
        <div class="admin-v2-placeholder-head"><div><span class="eyebrow">LAPORAN &amp; ANALYTICS</span><h2>Ringkasan Laporan Program</h2><p>Fitur laporan yang sudah stabil tetap memakai sumber data lama. Dashboard V2 hanya memberi jalur yang lebih jelas menuju ekspor peserta dan audit aktivasi.</p></div></div>
        <div class="admin-v2-action-grid">
          <article class="admin-v2-action-card"><strong>Ekspor Data Peserta</strong><span>Filter daftar peserta lalu gunakan Ekspor Excel A4.</span><a href="${viewHref('peserta')}" data-admin-v2-go="peserta">Buka Peserta →</a></article>
          <article class="admin-v2-action-card"><strong>Audit Aktivasi</strong><span>Lihat peserta yang sudah atau belum membuat akun.</span><a href="${viewHref('aktivasi')}" data-admin-v2-go="aktivasi">Buka Audit →</a></article>
          <article class="admin-v2-action-card"><strong>Data Pemasaran</strong><span>Role Pemasaran tetap menggunakan endpoint tersanitasi dan tidak memperoleh data sensitif.</span></article>
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
    $$('[data-admin-v2-view]').forEach(link => {
      const view = link.dataset.adminV2View;
      link.hidden = !allowed.has(view);
      link.setAttribute('aria-hidden', allowed.has(view) ? 'false' : 'true');
    });

    if (pendingUrlView && allowed.has(pendingUrlView)) {
      const requested = pendingUrlView;
      pendingUrlView = null;
      if (requested !== currentView) setView(requested, { keepScroll:true, history:'replace' });
      return;
    }

    if (!allowed.has(currentView)) setView('ringkasan', { keepScroll:true, history:'replace' });
  }

  function prepareAccountWorkspace(view) {
    const panel = $('#accountSecurityPanel');
    if (!panel || (view !== 'manajemen' && view !== 'pengaturan')) return;

    const body = $('#accountSecurityBody');
    const collapse = $('#accountSecurityCollapse');
    if (body) body.hidden = false;
    panel.classList.remove('is-collapsed');
    if (collapse) {
      collapse.setAttribute('aria-expanded', 'true');
      collapse.setAttribute('aria-label', 'Panel Akun & Keamanan aktif');
    }

    if (view === 'manajemen') {
      const toggle = $('#userManagementToggle');
      const managementPanel = $('#userManagementPanel');
      if (toggle && !toggle.hidden && (managementPanel?.hidden || !toggle.classList.contains('is-active'))) {
        window.requestAnimationFrame(() => toggle.click());
      }
      return;
    }

    const roleToggle = $('#roleFunctionToggle');
    const rolePanel = $('#roleFunctionPanel');
    if (roleToggle && (rolePanel?.hidden || !roleToggle.classList.contains('is-active'))) {
      window.requestAnimationFrame(() => roleToggle.click());
    }
  }

  function setView(view, options = {}) {
    const allowed = new Set(allowedViews());
    const requested = validView(view) || 'ringkasan';
    if (!allowed.has(requested)) {
      pendingUrlView = requested;
      view = 'ringkasan';
    } else {
      view = requested;
      if (pendingUrlView === view) pendingUrlView = null;
    }

    currentView = view;
    const main = $('main.wrap');
    if (!main) return;
    assignViews();

    $$(':scope > section', main).forEach(section => {
      const views = String(section.dataset.adminV2Views || 'ringkasan').split(/\s+/).filter(Boolean);
      section.classList.toggle('admin-v2-view-hidden', !views.includes(view));
    });

    $$('[data-admin-v2-view]').forEach(link => {
      const active = link.dataset.adminV2View === view;
      link.classList.toggle('is-active', active);
      link.setAttribute('aria-current', active ? 'page' : 'false');
    });

    const meta = VIEW_META[view] || VIEW_META.ringkasan;
    const title = $('#adminV2PageTitle');
    const crumb = $('#adminV2Breadcrumb');
    if (title) title.textContent = meta.label;
    if (crumb) crumb.textContent = meta.subtitle;
    document.body.dataset.adminV2View = view;
    document.title = `${meta.label} | Dashboard Admin Program Ketahanan Pangan`;
    sessionStorage.setItem(STORAGE_KEY, view);
    syncHistory(view, options.history || 'none');

    prepareAccountWorkspace(view);
    closeDrawer();

    if (!options.keepScroll) {
      window.requestAnimationFrame(() => window.scrollTo({ top:0, left:0, behavior:'auto' }));
    }
  }

  function openDrawer() {
    document.body.classList.add('admin-v2-sidebar-open');
    $('#adminV2MenuToggle')?.setAttribute('aria-expanded','true');
  }

  function closeDrawer() {
    document.body.classList.remove('admin-v2-sidebar-open');
    $('#adminV2MenuToggle')?.setAttribute('aria-expanded','false');
  }

  function isPlainLeftClick(event) {
    return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  }

  function bindShellEvents() {
    if (document.body.dataset.adminV2Bound === '1') return;
    document.body.dataset.adminV2Bound = '1';

    document.addEventListener('click', event => {
      const nav = event.target.closest('[data-admin-v2-view]');
      if (nav && !nav.hidden && isPlainLeftClick(event)) {
        event.preventDefault();
        setView(nav.dataset.adminV2View, { history:'push' });
        return;
      }

      const go = event.target.closest('[data-admin-v2-go]');
      if (go && isPlainLeftClick(event)) {
        event.preventDefault();
        setView(go.dataset.adminV2Go, { history:'push' });
        return;
      }

      if (event.target.closest('#adminV2MenuToggle')) {
        event.preventDefault();
        document.body.classList.contains('admin-v2-sidebar-open') ? closeDrawer() : openDrawer();
        return;
      }

      if (event.target.closest('#adminV2Backdrop')) closeDrawer();
    });

    // Existing status quick cards keep their original filter logic, then switch to
    // the real Peserta workspace URL (no fragment/hash navigation).
    $('#statusQuickFilters')?.addEventListener('click', event => {
      if (event.target.closest('[data-status]')) {
        window.setTimeout(() => setView('peserta', { history:'push' }), 0);
      }
    });

    window.addEventListener('popstate', () => {
      const fromUrl = viewFromUrl() || 'ringkasan';
      pendingUrlView = fromUrl;
      setView(fromUrl, { history:'none' });
    });

    window.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeDrawer();
    });
  }

  function activate() {
    injectShell();
    document.body.classList.add('admin-v2-active');
    syncIdentity();
    syncRoleNav();

    const urlView = viewFromUrl();
    const stored = validView(sessionStorage.getItem(STORAGE_KEY));
    pendingUrlView = urlView;
    const initial = urlView || (stored && allowedViews().includes(stored) ? stored : 'ringkasan');
    setView(initial, { keepScroll:true, history:'replace' });
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
      const target = pendingUrlView && allowedViews().includes(pendingUrlView) ? pendingUrlView : currentView;
      setView(target, { keepScroll:true, history:'replace' });
    }).observe(document.documentElement, { attributes:true, attributeFilter:['data-admin-role'] });

    const identity = $('#adminIdentity');
    if (identity) new MutationObserver(syncIdentity).observe(identity, { childList:true, subtree:true,characterData:true,attributes:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
