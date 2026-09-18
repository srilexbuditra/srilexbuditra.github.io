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
  };

  let activeDays = Number($('[data-context-tab].is-active')?.dataset.windowDays || 7);

  const pct = (count, total) => total ? Math.round((Number(count || 0) / Number(total)) * 100) : 0;

  const setText = (node, value) => {
    if (node) node.textContent = String(value);
  };

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

  const renderActivities = (activities = []) => {
    if (!nodes.activityList) return;
    if (!activities.length) {
      nodes.activityList.innerHTML = '<div class="table-state">Belum ada aktivitas backend pada rentang waktu ini.</div>';
      return;
    }

    nodes.activityList.innerHTML = activities.slice(0, 8).map((item) => `
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

  const render = (data) => {
    const summary = data.summary || {};
    const attention = summary.attention || {};
    const windowDays = Number(data.window_days || activeDays || 7);

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
    renderActivities(data.activities || []);
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

  load(activeDays);
  addEventListener('focus', () => load(activeDays));
})();
