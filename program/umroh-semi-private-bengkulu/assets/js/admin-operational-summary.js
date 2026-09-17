(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const total = document.querySelector('[data-live-jamaah-total]');
  const source = document.querySelector('[data-live-jamaah-source]');
  if (!total) return;

  const load = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/jamaah/stats`, {
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) throw new Error(data?.error || 'request_failed');
      total.textContent = Number(data.summary?.total || 0);
      if (source) source.textContent = '· D1';
    } catch (error) {
      total.textContent = '—';
      if (source) source.textContent = '· tidak tersedia';
      console.warn('Operational summary:', error);
    }
  };

  load();
})();
