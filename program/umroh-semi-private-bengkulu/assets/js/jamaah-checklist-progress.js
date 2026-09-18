(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';

  const render = async () => {
    try {
      const response = await fetch(`${API_BASE}/jamaah/progress/checklist`, {
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) return;

      const done = Number(data.progress?.reviewed || 0);
      const total = Number(data.progress?.total || 12);
      document.querySelectorAll('[data-checklist-summary]').forEach((el) => {
        el.textContent = `${done} dari ${total} diperiksa · D1`;
      });
    } catch (_) {}
  };

  render();
  addEventListener('pageshow', render);
  addEventListener('focus', render);
})();
