(() => {
  'use strict';
  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const total = document.querySelector('[data-live-agenda-total]');
  const preview = document.querySelector('[data-admin-agenda-preview]');

  const fmtDay = (iso) => iso ? new Intl.DateTimeFormat('id-ID',{day:'2-digit',timeZone:'Asia/Jakarta'}).format(new Date(iso)) : '—';
  const fmtMonth = (iso) => iso ? new Intl.DateTimeFormat('id-ID',{month:'short',timeZone:'Asia/Jakarta'}).format(new Date(iso)).toUpperCase() : '';
  const fmtTime = (iso) => iso ? new Intl.DateTimeFormat('id-ID',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Jakarta'}).format(new Date(iso)).replace('.',':') : 'Waktu belum ditetapkan';
  const esc = (v) => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

  const load = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/agenda`, {credentials:'include',cache:'no-store',headers:{Accept:'application/json'}});
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) return;

      if (total) total.textContent = Number(data.summary?.upcoming || 0);
      if (!preview) return;

      const rows = (data.events || [])
        .filter((event) => event.is_published && event.event_status !== 'cancelled')
        .filter((event) => !event.starts_at || Date.parse(event.starts_at) >= Date.now())
        .slice(0, 3);

      preview.innerHTML = rows.length ? rows.map((event) => `
        <div class="agenda-row">
          <div class="date-box"><strong>${fmtDay(event.starts_at)}</strong><span>${fmtMonth(event.starts_at)}</span></div>
          <div><strong>${esc(event.title)}</strong><span>${esc(fmtTime(event.starts_at))} · ${esc(event.location_text || 'Lokasi belum ditetapkan')}</span></div>
          <span class="badge ${event.event_status === 'confirmed' ? 'success' : 'info'}">${esc(event.status_label)}</span>
        </div>
      `).join('') : '<div class="table-state">Belum ada agenda resmi mendatang yang dipublikasikan.</div>';
    } catch (_) {}
  };

  load();
  addEventListener('focus', load);
})();
