(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const esc = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const nodes = {
    jamaahTotal: $('[data-live-jamaah-total]'),
    jamaahSource: $('[data-live-jamaah-source]'),
    agendaTotal: $('[data-live-agenda-total]'),
    manasikTotal: $('[data-live-manasik-total]'),
    attentionTotal: $('[data-live-attention-total]'),
    attentionDot: $('[data-live-attention-dot]'),
    attentionDocuments: $('[data-attention-documents]'),
    attentionJamaah: $('[data-attention-jamaah]'),
    attentionAgenda: $('[data-attention-agenda]'),
    attentionAgendaLabel: $('[data-attention-agenda-label]'),
    attentionAnnouncements: $('[data-attention-announcements]'),
    readinessDonut: $('[data-readiness-donut]'),
    readinessTotal: $('[data-readiness-total]'),
    readinessReady: $('[data-readiness-ready]'),
    readinessProgress: $('[data-readiness-progress]'),
    readinessAssistance: $('[data-readiness-assistance]'),
    readinessInactive: $('[data-readiness-inactive]'),
    activityList: $('[data-live-activity-list]'),
    activityWindow: $('[data-activity-window]'),
    pageDate: $('[data-live-page-date]'),
    pageTitle: $('.page-head h1'),
    pageDescription: $('.page-head p'),
    prototypeNote: $('.prototype-note'),
    searchInput: $('.search-box input'),
  };

  const ui = {
    manasikCard: nodes.manasikTotal?.closest('.stat-card') || null,
    manasikIcon: nodes.manasikTotal?.closest('.stat-card')?.querySelector('.ui-icon') || null,
    manasikLabel: nodes.manasikTotal?.parentElement?.querySelector('span') || null,
    attentionDocumentsRow: nodes.attentionDocuments?.closest('.attention-row') || null,
    attentionJamaahRow: nodes.attentionJamaah?.closest('.attention-row') || null,
    attentionAgendaRow: nodes.attentionAgenda?.closest('.attention-row') || null,
    attentionAnnouncementsRow: nodes.attentionAnnouncements?.closest('.attention-row') || null,
    attentionTitle: nodes.attentionDocuments?.closest('article')?.querySelector('.section-title h2') || null,
    agendaAction: $('[data-admin-agenda-preview]')?.closest('article')?.querySelector('.section-title a') || null,
    activityTitle: nodes.activityList?.closest('article')?.querySelector('.section-title h2') || null,
  };

  let activeDays = Number($('[data-context-tab].is-active')?.dataset.windowDays || 7);
  let lastData = null;

  const pct = (count, total) => total ? Math.round((Number(count || 0) / Number(total)) * 100) : 0;

  const setText = (node, value) => {
    if (node) node.textContent = String(value);
  };

  const currentRole = () =>
    document.documentElement.dataset.adminRole ||
    window.UMROH_ADMIN_ACCOUNT?.role ||
    '';

  const normalizeDate = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return null;
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(raw)) {
      return new Date(raw.replace(' ', 'T') + 'Z');
    }
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const relativeTime = (value) => {
    const date = normalizeDate(value);
    if (!date) return 'waktu tidak tersedia';
    const delta = Math.max(0, Date.now() - date.getTime());
    const minutes = Math.floor(delta / 60000);
    if (minutes < 1) return 'baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    if (days <= 7) return `${days} hari lalu`;
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Jakarta'
    }).format(date);
  };

  const initials = (name) => {
    const parts = String(name || 'Sistem').trim().split(/\s+/).filter(Boolean);
    return (parts.slice(0, 2).map((part) => part[0]).join('') || 'SY').toUpperCase();
  };

  const renderReadiness = (readiness = {}) => {
    const total = Number(readiness.total || 0);
    const ready = Number(readiness.ready || 0);
    const progress = Number(readiness.in_progress || 0);
    const assistance = Number(readiness.needs_assistance || 0);
    const inactive = Number(readiness.inactive || 0);

    const readyPct = pct(ready, total);
    const progressPct = pct(progress, total);
    const assistancePct = pct(assistance, total);
    const inactivePct = pct(inactive, total);

    setText(nodes.readinessTotal, total);
    setText(nodes.readinessReady, `${ready} · ${readyPct}%`);
    setText(nodes.readinessProgress, `${progress} · ${progressPct}%`);
    setText(nodes.readinessAssistance, `${assistance} · ${assistancePct}%`);
    setText(nodes.readinessInactive, `${inactive} · ${inactivePct}%`);

    if (nodes.readinessDonut) {
      nodes.readinessDonut.style.setProperty('--p1', readyPct);
      nodes.readinessDonut.style.setProperty('--p2', progressPct);
      nodes.readinessDonut.style.setProperty('--p3', assistancePct);
      nodes.readinessDonut.setAttribute(
        'aria-label',
        `Status persiapan: ${ready} siap, ${progress} dalam persiapan, ${assistance} perlu pendampingan, ${inactive} belum aktif`
      );
    }
  };

  const roleActivities = (activities = [], role = '') => {
    if (role === 'pendamping') {
      const allowedBadges = new Set(['Jemaah', 'Agenda', 'Pengumuman', 'Checklist']);
      return activities.filter((item) => allowedBadges.has(String(item.badge || '')));
    }
    if (role === 'tour_leader') {
      const allowedBadges = new Set(['Jemaah', 'Agenda', 'Pengumuman', 'Manasik', 'Checklist']);
      return activities.filter((item) => allowedBadges.has(String(item.badge || '')));
    }
    if (role === 'admin') {
      const allowedBadges = new Set(['Jemaah', 'Agenda', 'Pengumuman', 'Manasik', 'Checklist', 'Dokumen']);
      return activities.filter((item) => allowedBadges.has(String(item.badge || '')));
    }
    return activities;
  };

  const renderActivities = (activities = [], role = '') => {
    if (!nodes.activityList) return;
    const visible = roleActivities(activities, role);
    if (!visible.length) {
      nodes.activityList.innerHTML = role === 'pendamping'
        ? '<div class="table-state">Belum ada aktivitas pendampingan pada rentang waktu ini.</div>'
        : role === 'tour_leader'
          ? '<div class="table-state">Belum ada aktivitas Tour Leader pada rentang waktu ini.</div>'
          : role === 'admin'
            ? '<div class="table-state">Belum ada aktivitas operasional Admin pada rentang waktu ini.</div>'
            : '<div class="table-state">Belum ada aktivitas backend pada rentang waktu ini.</div>';
      return;
    }

    nodes.activityList.innerHTML = visible.slice(0, 8).map((item) => `
      <div class="activity-row">
        <div class="avatar-mini">${esc(initials(item.name))}</div>
        <div>
          <strong>${esc(item.name || 'Sistem')}</strong>
          <span>${esc(item.detail || 'Aktivitas backend')} · ${esc(relativeTime(item.occurred_at))}</span>
        </div>
        <span class="badge ${esc(item.badge_type || 'info')}">${esc(item.badge || 'Aktivitas')}</span>
      </div>
    `).join('');
  };

  const resetRolePresentation = () => {
    if (ui.manasikCard) ui.manasikCard.hidden = false;
    if (ui.attentionDocumentsRow) ui.attentionDocumentsRow.hidden = false;
    if (ui.attentionAnnouncementsRow) ui.attentionAnnouncementsRow.hidden = false;
    if (ui.manasikLabel) ui.manasikLabel.textContent = 'Materi Manasik';
    if (ui.manasikIcon) ui.manasikIcon.className = 'ui-icon icon-book';
    if (ui.attentionTitle) ui.attentionTitle.textContent = 'Perlu Perhatian Operasional';
    if (ui.activityTitle) ui.activityTitle.textContent = 'Aktivitas Terbaru';
    if (ui.agendaAction) ui.agendaAction.textContent = 'Kelola →';
    if (nodes.pageTitle) nodes.pageTitle.textContent = 'Ringkasan';
    if (nodes.pageDescription) nodes.pageDescription.textContent = 'Prioritaskan pekerjaan yang membutuhkan tindakan tanpa memenuhi dashboard dengan informasi yang tidak penting.';
    if (nodes.prototypeNote) {
      nodes.prototypeNote.innerHTML = '<strong>Platform V3.9.0 aktif.</strong> Ringkasan operasional, status persiapan, dokumen, agenda, pengumuman, dan aktivitas terbaru kini dihitung dari backend resmi. Data simulasi pada Ringkasan Admin telah dihentikan.';
    }
    if (nodes.searchInput) nodes.searchInput.placeholder = 'Cari jemaah, agenda, dokumen...';

    const jamaahCopy = ui.attentionJamaahRow?.querySelector('div:nth-child(2)');
    if (jamaahCopy) {
      const strong = jamaahCopy.querySelector('strong');
      const span = jamaahCopy.querySelector('span');
      if (strong) strong.textContent = 'Jemaah belum menyelesaikan persiapan';
      if (span) span.textContent = 'Jemaah aktif yang belum memenuhi seluruh komponen persiapan.';
    }
  };

  const applyPendampingPresentation = (summary = {}, attention = {}) => {
    const readiness = summary.readiness || {};
    const assistance = Number(readiness.needs_assistance || 0);
    const jamaahAttention = Number(attention.jamaah_incomplete || 0);
    const agendaAttention = Number(attention.agenda_in_window || 0);
    const roleAttentionTotal = jamaahAttention + agendaAttention;

    if (nodes.pageTitle) nodes.pageTitle.textContent = 'Ringkasan Pendamping';
    if (nodes.pageDescription) {
      nodes.pageDescription.textContent = 'Fokus pada kondisi Jemaah, kebutuhan pendampingan, agenda perjalanan, dan informasi yang perlu disampaikan.';
    }
    if (nodes.prototypeNote) {
      nodes.prototypeNote.innerHTML = '<strong>Platform V3.9.0 aktif.</strong> Ringkasan ini disesuaikan dengan tugas Pendamping. Informasi dokumen privat, draft pengumuman, dan fungsi administratif tidak ditampilkan.';
    }

    if (ui.manasikCard) ui.manasikCard.hidden = false;
    setText(nodes.manasikTotal, assistance);
    if (ui.manasikLabel) ui.manasikLabel.textContent = 'Perlu Pendampingan';
    if (ui.manasikIcon) ui.manasikIcon.className = 'ui-icon icon-users';

    setText(nodes.attentionTotal, roleAttentionTotal);
    if (nodes.attentionDot) {
      nodes.attentionDot.textContent = roleAttentionTotal > 99 ? '99+' : String(roleAttentionTotal);
      nodes.attentionDot.hidden = roleAttentionTotal === 0;
    }

    if (ui.attentionDocumentsRow) ui.attentionDocumentsRow.hidden = true;
    if (ui.attentionAnnouncementsRow) ui.attentionAnnouncementsRow.hidden = true;
    if (ui.attentionTitle) ui.attentionTitle.textContent = 'Prioritas Pendampingan';

    const jamaahCopy = ui.attentionJamaahRow?.querySelector('div:nth-child(2)');
    if (jamaahCopy) {
      const strong = jamaahCopy.querySelector('strong');
      const span = jamaahCopy.querySelector('span');
      if (strong) strong.textContent = 'Jemaah membutuhkan pendampingan';
      if (span) span.textContent = 'Jemaah aktif yang masih membutuhkan bantuan atau penyelesaian persiapan.';
    }

    if (ui.agendaAction) ui.agendaAction.textContent = 'Lihat →';
    if (ui.activityTitle) ui.activityTitle.textContent = 'Aktivitas Pendampingan';
    if (nodes.searchInput) nodes.searchInput.placeholder = 'Cari jemaah, agenda, pengumuman...';
  };

  const applyAdminPresentation = () => {
    if (nodes.pageTitle) nodes.pageTitle.textContent = 'Ringkasan Admin Operasional';
    if (nodes.pageDescription) {
      nodes.pageDescription.textContent = 'Fokus pada pengelolaan Jemaah, verifikasi dokumen, Manasik, Agenda, dan Pengumuman sesuai kewenangan operasional.';
    }
    if (nodes.prototypeNote) {
      nodes.prototypeNote.innerHTML = '<strong>Platform V3.9.0 aktif.</strong> Ringkasan ini disesuaikan dengan tugas Admin Operasional. Pengelolaan akun staf tingkat tertinggi tetap dibatasi untuk Senior Full Stack Developer · Platform Architect.';
    }

    if (ui.attentionTitle) ui.attentionTitle.textContent = 'Prioritas Admin Operasional';
    if (ui.activityTitle) ui.activityTitle.textContent = 'Aktivitas Admin Operasional';
    if (ui.agendaAction) ui.agendaAction.textContent = 'Kelola →';
    if (nodes.searchInput) nodes.searchInput.placeholder = 'Cari jemaah, agenda, dokumen...';

    const jamaahCopy = ui.attentionJamaahRow?.querySelector('div:nth-child(2)');
    if (jamaahCopy) {
      const strong = jamaahCopy.querySelector('strong');
      const span = jamaahCopy.querySelector('span');
      if (strong) strong.textContent = 'Jemaah perlu tindak lanjut operasional';
      if (span) span.textContent = 'Pantau Jemaah yang belum menyelesaikan persiapan dan tindak lanjuti kebutuhan akun atau data yang diperlukan.';
    }
  };

  const applyTourLeaderPresentation = (summary = {}, attention = {}) => {
    const jamaahAttention = Number(attention.jamaah_incomplete || 0);
    const agendaAttention = Number(attention.agenda_in_window || 0);
    const announcementAttention = Number(attention.announcement_drafts || 0);
    const roleAttentionTotal = jamaahAttention + agendaAttention + announcementAttention;

    if (nodes.pageTitle) nodes.pageTitle.textContent = 'Ringkasan Tour Leader';
    if (nodes.pageDescription) {
      nodes.pageDescription.textContent = 'Fokus pada kesiapan Jemaah, Manasik, agenda perjalanan, dan pengumuman resmi yang perlu ditindaklanjuti.';
    }
    if (nodes.prototypeNote) {
      nodes.prototypeNote.innerHTML = '<strong>Platform V3.9.0 aktif.</strong> Ringkasan ini disesuaikan dengan tugas Tour Leader. Informasi dokumen privat dan fungsi administrasi akun tidak ditampilkan.';
    }

    setText(nodes.attentionTotal, roleAttentionTotal);
    if (nodes.attentionDot) {
      nodes.attentionDot.textContent = roleAttentionTotal > 99 ? '99+' : String(roleAttentionTotal);
      nodes.attentionDot.hidden = roleAttentionTotal === 0;
    }

    if (ui.attentionDocumentsRow) ui.attentionDocumentsRow.hidden = true;
    if (ui.attentionAnnouncementsRow) ui.attentionAnnouncementsRow.hidden = false;
    if (ui.attentionTitle) ui.attentionTitle.textContent = 'Prioritas Tour Leader';

    const jamaahCopy = ui.attentionJamaahRow?.querySelector('div:nth-child(2)');
    if (jamaahCopy) {
      const strong = jamaahCopy.querySelector('strong');
      const span = jamaahCopy.querySelector('span');
      if (strong) strong.textContent = 'Jemaah belum menyelesaikan persiapan';
      if (span) span.textContent = 'Pantau Jemaah yang masih dalam persiapan dan koordinasikan tindak lanjut perjalanan.';
    }

    if (ui.agendaAction) ui.agendaAction.textContent = 'Kelola →';
    if (ui.activityTitle) ui.activityTitle.textContent = 'Aktivitas Tour Leader';
    if (nodes.searchInput) nodes.searchInput.placeholder = 'Cari jemaah, agenda, manasik...';
  };

  const globalSearchTarget = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return null;

    const query = raw.toLowerCase();
    const role = currentRole();
    const base = '/program/umroh-semi-private-bengkulu/admin/';

    const moduleRoutes = [
      { keys: ['agenda', 'perjalanan', 'jadwal'], path: 'agenda/', roles: ['super_admin', 'admin', 'tour_leader', 'pendamping'] },
      { keys: ['manasik', 'materi'], path: 'manasik/', roles: ['super_admin', 'admin', 'tour_leader'] },
      { keys: ['dokumen', 'paspor', 'passport', 'file'], path: 'dokumen/', roles: ['super_admin', 'admin'] },
      { keys: ['pengumuman', 'informasi', 'announcement'], path: 'pengumuman/', roles: ['super_admin', 'admin', 'tour_leader', 'pendamping'] },
      { keys: ['laporan', 'report', 'rekap', 'export'], path: 'laporan/', roles: ['super_admin', 'admin'] },
      { keys: ['pengaturan', 'seo', 'media', 'branding', 'schema', 'analytics'], path: 'pengaturan/', roles: ['super_admin', 'admin'] },
      { keys: ['manajemen admin', 'akun staf', 'akun admin', 'pengelola'], path: 'manajemen-admin/', roles: ['super_admin'] },
    ];

    const matchedModule = moduleRoutes.find((item) =>
      item.roles.includes(role) && item.keys.some((key) => query.includes(key))
    );

    // Nama/nomor jemaah adalah pencarian default karena endpoint Jemaah
    // mendukung pencarian backend berdasarkan nama, nomor, email, WhatsApp, dan grup.
    if (!matchedModule || query.includes('jemaah')) {
      return `${base}jemaah/?q=${encodeURIComponent(raw)}`;
    }

    return `${base}${matchedModule.path}`;
  };

  const runGlobalSearch = () => {
    if (!nodes.searchInput) return;
    const target = globalSearchTarget(nodes.searchInput.value);
    if (!target) {
      nodes.searchInput.focus();
      return;
    }
    window.location.assign(target);
  };

  const bindGlobalSearch = () => {
    if (!nodes.searchInput) return;

    nodes.searchInput.setAttribute('aria-label', 'Cari di dashboard');
    nodes.searchInput.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      runGlobalSearch();
    });

    const searchTrigger = nodes.searchInput.closest('.search-box')?.querySelector('span[aria-hidden="true"]');
    if (searchTrigger) {
      searchTrigger.removeAttribute('aria-hidden');
      searchTrigger.setAttribute('role', 'button');
      searchTrigger.setAttribute('tabindex', '0');
      searchTrigger.setAttribute('aria-label', 'Jalankan pencarian');
      searchTrigger.setAttribute('title', 'Cari');
      searchTrigger.addEventListener('click', runGlobalSearch);
      searchTrigger.addEventListener('keydown', (event) => {
        if (!['Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        runGlobalSearch();
      });
    }
  };

  const render = (data) => {
    lastData = data;
    const summary = data.summary || {};
    const attention = summary.attention || {};
    const windowDays = Number(data.window_days || activeDays || 7);
    const role = currentRole();

    resetRolePresentation();

    setText(nodes.jamaahTotal, Number(summary.jamaah_total || 0));
    if (nodes.jamaahSource) nodes.jamaahSource.textContent = '· D1';
    setText(nodes.agendaTotal, Number(summary.agenda_upcoming_total || 0));
    setText(nodes.manasikTotal, Number(summary.manasik_materials || 0));
    setText(nodes.attentionTotal, Number(summary.attention_total || 0));

    if (nodes.attentionDot) {
      const total = Number(summary.attention_total || 0);
      nodes.attentionDot.textContent = total > 99 ? '99+' : String(total);
      nodes.attentionDot.hidden = total === 0;
    }

    setText(nodes.attentionDocuments, Number(attention.documents_pending_review || 0));
    setText(nodes.attentionJamaah, Number(attention.jamaah_incomplete || 0));
    setText(nodes.attentionAgenda, Number(attention.agenda_in_window || 0));
    setText(nodes.attentionAnnouncements, Number(attention.announcement_drafts || 0));
    setText(
      nodes.attentionAgendaLabel,
      windowDays === 1 ? 'Agenda hari ini' : `Agenda dalam ${windowDays} hari`
    );

    if (nodes.activityWindow) {
      nodes.activityWindow.textContent = windowDays === 1 ? 'hari ini' : `${windowDays} hari terakhir`;
    }

    renderReadiness(summary.readiness || {});

    if (role === 'pendamping') {
      applyPendampingPresentation(summary, attention);
    } else if (role === 'tour_leader') {
      applyTourLeaderPresentation(summary, attention);
    } else if (role === 'admin') {
      applyAdminPresentation();
    }

    renderActivities(data.activities || [], role);
  };

  const load = async (days = activeDays) => {
    activeDays = [1, 7, 30].includes(Number(days)) ? Number(days) : 7;
    try {
      const response = await fetch(`${API_BASE}/admin/dashboard/summary?days=${activeDays}`, {
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) throw new Error(data?.error || `http_${response.status}`);
      render(data);
    } catch (error) {
      if (nodes.jamaahTotal) nodes.jamaahTotal.textContent = '—';
      if (nodes.jamaahSource) nodes.jamaahSource.textContent = '· tidak tersedia';
      if (nodes.activityList) {
        nodes.activityList.innerHTML = '<div class="table-state">Ringkasan backend belum dapat dimuat. Silakan muat ulang.</div>';
      }
      console.warn('Admin dashboard summary:', error);
    }
  };

  if (nodes.pageDate) {
    nodes.pageDate.textContent = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta'
    }).format(new Date());
  }

  $$('[data-context-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      $$('[data-context-tab]').forEach((item) => item.classList.toggle('is-active', item === button));
      load(Number(button.dataset.windowDays || 7));
    });
  });

  const roleObserver = new MutationObserver(() => {
    if (lastData) render(lastData);
  });
  roleObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-admin-role'] });

  bindGlobalSearch();
  load(activeDays);
  addEventListener('focus', () => load(activeDays));
})();
