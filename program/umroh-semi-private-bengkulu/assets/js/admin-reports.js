(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));

  const state = {
    days: 7,
    dashboard: {},
    jamaahStats: {},
    jamaah: [],
    documents: [],
    agenda: [],
    agendaSummary: {},
    announcements: [],
    announcementSummary: {},
    manasik: [],
    manasikSummary: {},
  };

  const nodes = {
    message: $('[data-report-message]'),
    generated: $('[data-report-generated]'),
    jamaahTotal: $('[data-report-jamaah-total]'),
    jamaahActive: $('[data-report-jamaah-active]'),
    ready: $('[data-report-ready]'),
    progress: $('[data-report-progress]'),
    docPending: $('[data-report-doc-pending]'),
    agendaUpcoming: $('[data-report-agenda-upcoming]'),
    agendaWindow: $('[data-report-agenda-window]'),
    windowLabel: $('[data-report-window-label]'),
    readinessTotal: $('[data-report-readiness-total]'),
    donut: $('[data-report-donut]'),
    readyLegend: $('[data-report-ready-legend]'),
    progressLegend: $('[data-report-progress-legend]'),
    assistanceLegend: $('[data-report-assistance-legend]'),
    inactiveLegend: $('[data-report-inactive-legend]'),
    attentionTotal: $('[data-report-attention-total]'),
    attDocs: $('[data-report-att-docs]'),
    attJamaah: $('[data-report-att-jamaah]'),
    attAgenda: $('[data-report-att-agenda]'),
    attAnn: $('[data-report-att-ann]'),
    moduleBody: $('[data-report-module-body]'),
    jamaahBody: $('[data-report-jamaah-body]'),
    jamaahCount: $('[data-report-jamaah-count]'),
    activityList: $('[data-report-activity-list]'),
    activityWindow: $('[data-report-activity-window]'),
    refresh: $('[data-report-refresh]'),
    csv: $('[data-report-csv]'),
    print: $('[data-report-print]'),
  };

  const fmtDateTime = (value, empty = '—') => {
    if (!value) return empty;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta'
    }).format(date);
  };

  const fmtGenerated = (value) => value
    ? `Diperbarui ${fmtDateTime(value)}`
    : 'Waktu pembaruan belum tersedia';

  const percent = (value, total) => total > 0 ? Math.round((Number(value || 0) / total) * 100) : 0;
  const number = (value) => Number(value || 0);

  const showMessage = (text = '', stateName = 'error') => {
    if (!nodes.message) return;
    nodes.message.textContent = text;
    nodes.message.dataset.state = stateName;
    nodes.message.hidden = !text;
  };

  const api = async (path) => {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'GET', credentials: 'include', cache: 'no-store', headers: { Accept: 'application/json' }
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
      window.location.replace('/program/umroh-semi-private-bengkulu/admin/login/?reason=session');
      throw new Error('unauthorized');
    }
    if (response.status === 403) {
      window.location.replace('/program/umroh-semi-private-bengkulu/admin/?reason=forbidden');
      throw new Error('forbidden');
    }
    if (!response.ok || !data?.ok) {
      const error = new Error(data?.error || `http_${response.status}`);
      error.code = data?.error || '';
      throw error;
    }
    return data;
  };

  const statusLabel = (status) => ({
    active: 'Aktif', pending_activation: 'Menunggu Aktivasi', suspended: 'Ditangguhkan', disabled: 'Dinonaktifkan'
  }[status] || status || '—');

  const documentStatusLabel = (status) => ({
    not_reviewed: 'Menunggu Verifikasi', verified: 'Terverifikasi', needs_revision: 'Perlu Perbaikan', rejected: 'Ditolak'
  }[status] || status || '—');

  const setText = (node, value) => { if (node) node.textContent = value; };

  const renderReadiness = () => {
    const readiness = state.dashboard?.summary?.readiness || {};
    const total = number(readiness.total);
    const ready = number(readiness.ready);
    const inProgress = number(readiness.in_progress);
    const assistance = number(readiness.needs_assistance);
    const inactive = number(readiness.inactive);
    const pReady = percent(ready, total);
    const pProgress = percent(inProgress, total);
    const pAssistance = percent(assistance, total);

    setText(nodes.readinessTotal, total);
    setText(nodes.ready, ready);
    setText(nodes.progress, `${inProgress} dalam persiapan`);
    setText(nodes.readyLegend, `${ready} · ${pReady}%`);
    setText(nodes.progressLegend, `${inProgress} · ${pProgress}%`);
    setText(nodes.assistanceLegend, `${assistance} · ${percent(assistance, total)}%`);
    setText(nodes.inactiveLegend, `${inactive} · ${percent(inactive, total)}%`);
    if (nodes.donut) {
      nodes.donut.style.setProperty('--p1', pReady);
      nodes.donut.style.setProperty('--p2', pProgress);
      nodes.donut.style.setProperty('--p3', pAssistance);
    }
  };

  const documentCounts = () => state.documents.reduce((acc, row) => {
    const key = row.admin_status || 'not_reviewed';
    acc[key] = (acc[key] || 0) + 1;
    acc.total += 1;
    return acc;
  }, { total: 0, verified: 0, not_reviewed: 0, needs_revision: 0, rejected: 0 });

  const renderStats = () => {
    const summary = state.dashboard?.summary || {};
    const attention = summary.attention || {};
    const j = state.jamaahStats || {};
    setText(nodes.jamaahTotal, number(j.total || summary.jamaah_total));
    setText(nodes.jamaahActive, `${number(j.active)} aktif`);
    setText(nodes.docPending, number(attention.documents_pending_review));
    setText(nodes.agendaUpcoming, number(summary.agenda_upcoming_total));
    setText(nodes.agendaWindow, `${number(attention.agenda_in_window)} dalam periode`);
    setText(nodes.attentionTotal, `${number(summary.attention_total)} item`);
    setText(nodes.attDocs, number(attention.documents_pending_review));
    setText(nodes.attJamaah, number(attention.jamaah_incomplete));
    setText(nodes.attAgenda, number(attention.agenda_in_window));
    setText(nodes.attAnn, number(attention.announcement_drafts));
    setText(nodes.windowLabel, state.days === 1 ? 'Hari ini' : `${state.days} hari`);
    setText(nodes.activityWindow, state.days === 1 ? 'Hari ini' : `${state.days} hari terakhir`);
    setText(nodes.generated, fmtGenerated(state.dashboard.generated_at));
    renderReadiness();
  };

  const renderModuleTable = () => {
    const docs = documentCounts();
    const j = state.jamaahStats || {};
    const m = state.manasikSummary || {};
    const a = state.agendaSummary || {};
    const n = state.announcementSummary || {};
    const rows = [
      ['Jemaah', number(j.total), number(j.active), number(j.pending_activation) + number(j.suspended) + number(j.disabled), `${number(j.pending_activation)} menunggu aktivasi`],
      ['Manasik', number(m.total), number(m.published), number(m.draft), `${number(m.active_jamaah)} Jemaah aktif`],
      ['Agenda', number(a.total), number(a.published), number(a.draft), `${number(a.upcoming)} agenda mendatang`],
      ['Dokumen', docs.total, docs.verified, docs.not_reviewed + docs.needs_revision + docs.rejected, `${docs.not_reviewed} menunggu · ${docs.needs_revision} perbaikan · ${docs.rejected} ditolak`],
      ['Pengumuman', number(n.total), number(n.published), number(n.draft), `${number(n.high_priority)} prioritas tinggi`],
    ];
    if (!nodes.moduleBody) return;
    nodes.moduleBody.innerHTML = rows.map((row) => `<tr>
      <td><strong>${esc(row[0])}</strong></td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${esc(row[4])}</td>
    </tr>`).join('');
  };

  const renderJamaah = () => {
    if (!nodes.jamaahBody) return;
    setText(nodes.jamaahCount, state.jamaah.length);
    if (!state.jamaah.length) {
      nodes.jamaahBody.innerHTML = '<tr><td colspan="5" class="table-state">Belum ada data Jemaah.</td></tr>';
      return;
    }
    nodes.jamaahBody.innerHTML = state.jamaah.map((row) => {
      const group = [row.group_name, row.departure_batch].filter(Boolean).join(' · ') || '—';
      const status = row.account_status || '';
      return `<tr>
        <td><strong>${esc(row.full_name || 'Nama belum diisi')}</strong><span>${esc(row.account_uuid || '')}</span></td>
        <td>${esc(row.member_no || '—')}</td>
        <td>${esc(group)}</td>
        <td><span class="report-status ${esc(status)}">${esc(statusLabel(status))}</span></td>
        <td>${esc(fmtDateTime(row.last_login_at, 'Belum pernah'))}</td>
      </tr>`;
    }).join('');
  };

  const renderActivities = () => {
    if (!nodes.activityList) return;
    const activities = Array.isArray(state.dashboard.activities) ? state.dashboard.activities : [];
    const role = window.UMROH_ADMIN_ACCOUNT?.role || document.documentElement.dataset.adminRole || '';
    const allowedAdminBadges = new Set(['Jemaah', 'Agenda', 'Pengumuman', 'Manasik', 'Checklist', 'Dokumen']);
    const visible = role === 'admin'
      ? activities.filter((item) => allowedAdminBadges.has(String(item.badge || '')))
      : activities;
    if (!visible.length) {
      nodes.activityList.innerHTML = `<div class="table-state">${role === 'admin' ? 'Belum ada aktivitas operasional Admin pada rentang waktu ini.' : 'Belum ada aktivitas backend pada rentang waktu ini.'}</div>`;
      return;
    }
    nodes.activityList.innerHTML = visible.map((item) => `<div class="report-activity-row">
      <div><strong>${esc(item.name || 'Sistem')}</strong><span>${esc(item.detail || 'Aktivitas backend')} · ${esc(fmtDateTime(item.occurred_at))}</span></div>
      <span class="report-activity-badge">${esc(item.badge || 'Aktivitas')}</span>
    </div>`).join('');
  };

  const render = () => {
    renderStats();
    renderModuleTable();
    renderJamaah();
    renderActivities();
  };

  const setBusy = (busy) => {
    [nodes.refresh, nodes.csv, nodes.print].forEach((button) => { if (button) button.disabled = busy; });
    $$('.report-period-tabs button').forEach((button) => { button.disabled = busy; });
  };

  const load = async () => {
    setBusy(true);
    showMessage('');
    if (nodes.moduleBody) nodes.moduleBody.innerHTML = '<tr><td colspan="5" class="table-state">Memuat rekap modul...</td></tr>';
    if (nodes.jamaahBody) nodes.jamaahBody.innerHTML = '<tr><td colspan="5" class="table-state">Memuat data Jemaah...</td></tr>';
    if (nodes.activityList) nodes.activityList.innerHTML = '<div class="table-state">Memuat aktivitas...</div>';

    try {
      const [dashboard, jamaahStats, jamaah, documents, agenda, announcements, manasik] = await Promise.all([
        api(`/admin/dashboard/summary?days=${state.days}`),
        api('/admin/jamaah/stats'),
        api('/admin/jamaah?limit=200'),
        api('/admin/documents'),
        api('/admin/agenda'),
        api('/admin/announcements'),
        api('/admin/manasik'),
      ]);
      state.dashboard = dashboard;
      state.jamaahStats = jamaahStats.summary || {};
      state.jamaah = jamaah.jamaah || [];
      state.documents = documents.documents || [];
      state.agenda = agenda.events || [];
      state.agendaSummary = agenda.summary || {};
      state.announcements = announcements.announcements || [];
      state.announcementSummary = announcements.summary || {};
      state.manasik = manasik.materials || [];
      state.manasikSummary = manasik.summary || {};
      render();
    } catch (error) {
      if (!['unauthorized', 'forbidden'].includes(error.message)) {
        showMessage(`Laporan belum dapat dimuat: ${error.code || error.message}. Coba Muat ulang.`);
      }
    } finally {
      setBusy(false);
    }
  };

  const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const csvLine = (values) => values.map(csvCell).join(',');
  const exportCsv = () => {
    if (!state.dashboard?.summary) return;
    const summary = state.dashboard.summary;
    const readiness = summary.readiness || {};
    const docs = documentCounts();
    const lines = [
      csvLine(['LAPORAN OPERASIONAL UMROH SEMI PRIVATE BENGKULU']),
      csvLine(['Dibuat', fmtDateTime(state.dashboard.generated_at)]),
      csvLine(['Rentang Aktivitas', state.days === 1 ? 'Hari Ini' : `${state.days} Hari`]),
      '',
      csvLine(['RINGKASAN', 'Nilai']),
      csvLine(['Total Jemaah', state.jamaahStats.total || 0]),
      csvLine(['Jemaah Aktif', state.jamaahStats.active || 0]),
      csvLine(['Siap Berangkat', readiness.ready || 0]),
      csvLine(['Dalam Persiapan', readiness.in_progress || 0]),
      csvLine(['Perlu Pendampingan', readiness.needs_assistance || 0]),
      csvLine(['Belum Aktif', readiness.inactive || 0]),
      csvLine(['Dokumen Menunggu Verifikasi', summary.attention?.documents_pending_review || 0]),
      csvLine(['Agenda Mendatang', summary.agenda_upcoming_total || 0]),
      '',
      csvLine(['REKAP MODUL', 'Total', 'Selesai/Dipublikasikan', 'Perlu Tindakan']),
      csvLine(['Jemaah', state.jamaahStats.total || 0, state.jamaahStats.active || 0, number(state.jamaahStats.pending_activation) + number(state.jamaahStats.suspended) + number(state.jamaahStats.disabled)]),
      csvLine(['Manasik', state.manasikSummary.total || 0, state.manasikSummary.published || 0, state.manasikSummary.draft || 0]),
      csvLine(['Agenda', state.agendaSummary.total || 0, state.agendaSummary.published || 0, state.agendaSummary.draft || 0]),
      csvLine(['Dokumen', docs.total, docs.verified, docs.not_reviewed + docs.needs_revision + docs.rejected]),
      csvLine(['Pengumuman', state.announcementSummary.total || 0, state.announcementSummary.published || 0, state.announcementSummary.draft || 0]),
      '',
      csvLine(['DAFTAR JEMAAH', 'Nomor', 'Grup/Batch', 'Status', 'Login Terakhir', 'Dibuat']),
      ...state.jamaah.map((row) => csvLine([
        row.full_name || '', row.member_no || '', [row.group_name, row.departure_batch].filter(Boolean).join(' · '),
        statusLabel(row.account_status), fmtDateTime(row.last_login_at, 'Belum pernah'), fmtDateTime(row.created_at)
      ])),
    ];
    const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
    a.href = url;
    a.download = `laporan-operasional-umroh-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showMessage('Export CSV berhasil dibuat.', 'success');
  };

  $$('.report-period-tabs button').forEach((button) => button.addEventListener('click', () => {
    const days = Number(button.dataset.reportDays || 7);
    if (![1, 7, 30].includes(days) || days === state.days) return;
    state.days = days;
    $$('.report-period-tabs button').forEach((item) => item.classList.toggle('is-active', item === button));
    load();
  }));

  nodes.refresh?.addEventListener('click', load);
  nodes.csv?.addEventListener('click', exportCsv);
  nodes.print?.addEventListener('click', () => window.print());

  const waitForAuth = () => {
    if (document.documentElement.classList.contains('auth-ready')) load();
    else setTimeout(waitForAuth, 60);
  };
  waitForAuth();
})();
