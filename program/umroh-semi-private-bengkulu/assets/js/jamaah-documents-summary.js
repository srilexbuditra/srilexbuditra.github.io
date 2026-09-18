(() => {
  'use strict';
  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const render = async () => {
    try {
      const response = await fetch(`${API_BASE}/jamaah/documents`, {
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) return;
      const docs = data.documents || [];
      const uploaded = docs.filter((doc) => doc.file).length;
      const verified = docs.filter((doc) => doc.admin_status === 'verified').length;
      document.querySelectorAll('[data-documents-summary]').forEach((el) => {
        el.textContent = uploaded
          ? `${uploaded} dari ${docs.length} terunggah · ${verified} terverifikasi`
          : 'Belum diupload';
        el.title = `${uploaded} terunggah · ${verified} terverifikasi`;
      });
    } catch (_) {}
  };
  render();
  addEventListener('pageshow', render);
  addEventListener('focus', render);
})();
