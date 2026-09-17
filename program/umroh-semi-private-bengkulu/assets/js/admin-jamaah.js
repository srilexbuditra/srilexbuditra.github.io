(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const body = document.querySelector('[data-jamaah-body]');
  const searchInput = document.querySelector('[data-jamaah-search]');
  const statusSelect = document.querySelector('[data-jamaah-status]');
  const refreshButton = document.querySelector('[data-jamaah-refresh]');
  const countNode = document.querySelector('[data-jamaah-count]');
  let searchTimer = null;

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));

  const fmt = (value, empty = 'Belum pernah') => {
    if (!value) return empty;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Jakarta'
    }).format(date);
  };

  const statusLabel = (status) => ({
    active: 'Aktif',
    pending_activation: 'Menunggu Aktivasi',
    suspended: 'Ditangguhkan',
    disabled: 'Dinonaktifkan'
  }[status] || status || '—');

  const api = async (path) => {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      cache: 'no-store',
      headers: { Accept: 'application/json' }
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
    if (!response.ok || !data?.ok) throw new Error(data?.error || `http_${response.status}`);
    return data;
  };

  const updateStats = async () => {
    try {
      const data = await api('/admin/jamaah/stats');
      const s = data.summary || {};
      document.querySelector('[data-jamaah-total]').textContent = Number(s.total || 0);
      document.querySelector('[data-jamaah-active]').textContent = Number(s.active || 0);
      document.querySelector('[data-jamaah-pending]').textContent = Number(s.pending_activation || 0);
      document.querySelector('[data-jamaah-attention]').textContent =
        Number(s.suspended || 0) + Number(s.disabled || 0);
    } catch (error) {
      if (!['unauthorized', 'forbidden'].includes(error.message)) {
        document.querySelectorAll('[data-jamaah-total],[data-jamaah-active],[data-jamaah-pending],[data-jamaah-attention]')
          .forEach((node) => { node.textContent = '—'; });
      }
    }
  };

  const renderRows = (rows) => {
    if (!body) return;
    countNode.textContent = rows.length;
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="7" class="table-state">Belum ada data jemaah nyata di D1 untuk filter ini.</td></tr>';
      return;
    }

    body.innerHTML = rows.map((row) => {
      const contact = [
        row.email ? `<span>${esc(row.email)}</span>` : '',
        row.whatsapp ? `<span>${esc(row.whatsapp)}</span>` : ''
      ].filter(Boolean).join('') || '<span>Belum diisi</span>';

      const group = [
        row.group_name ? esc(row.group_name) : '',
        row.departure_batch ? esc(row.departure_batch) : ''
      ].filter(Boolean).join(' · ') || '—';

      return `<tr>
        <td><div class="jamaah-name"><strong>${esc(row.full_name || 'Nama belum diisi')}</strong><span>${esc(row.account_uuid)}</span></div></td>
        <td>${esc(row.member_no || '—')}</td>
        <td><div class="jamaah-contact">${contact}</div></td>
        <td>${group}</td>
        <td><span class="jamaah-status ${esc(row.account_status)}">${esc(statusLabel(row.account_status))}</span></td>
        <td>${esc(fmt(row.last_login_at))}</td>
        <td>${esc(fmt(row.created_at, '—'))}</td>
      </tr>`;
    }).join('');
  };

  const loadRows = async () => {
    if (body) body.innerHTML = '<tr><td colspan="7" class="table-state">Memuat data jemaah...</td></tr>';
    const params = new URLSearchParams();
    const search = searchInput?.value.trim();
    const status = statusSelect?.value || '';
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    params.set('limit', '200');

    try {
      const data = await api(`/admin/jamaah?${params.toString()}`);
      renderRows(data.jamaah || []);
    } catch (error) {
      if (['unauthorized', 'forbidden'].includes(error.message)) return;
      if (body) body.innerHTML = '<tr><td colspan="7" class="table-state">Data jemaah belum dapat dimuat. Coba lagi.</td></tr>';
      if (countNode) countNode.textContent = '0';
    }
  };

  const reload = () => Promise.all([updateStats(), loadRows()]);

  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadRows, 280);
  });
  statusSelect?.addEventListener('change', loadRows);
  refreshButton?.addEventListener('click', reload);

  reload();
})();
