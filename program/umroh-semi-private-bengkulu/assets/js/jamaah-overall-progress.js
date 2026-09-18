(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';

  const setText = (selector, text) => {
    document.querySelectorAll(selector).forEach((el) => { el.textContent = text; });
  };

  const setWidth = (selector, value) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.width = `${Math.max(0, Math.min(100, Number(value || 0)))}%`;
    });
  };

  const render = (progress) => {
    const modules = progress?.modules || {};
    const manasik = modules.manasik || {};
    const checklist = modules.checklist || {};
    const documents = modules.documents || {};
    const agenda = modules.agenda || {};

    setText('[data-overall-progress-percent]', `${Number(progress?.total || 0)}%`);
    setWidth('[data-overall-progress-bar]', progress?.total || 0);

    setText('[data-overall-manasik]', `${Number(manasik.percent || 0)}%`);
    setText('[data-overall-checklist]', `${Number(checklist.percent || 0)}%`);
    setText('[data-overall-documents]', `${Number(documents.percent || 0)}%`);
    setText('[data-overall-agenda]', `${Number(agenda.percent || 0)}%`);

    setText(
      '[data-overall-manasik-count]',
      `${Number(manasik.done || 0)} dari ${Number(manasik.total || 11)} selesai`
    );
    setText(
      '[data-overall-checklist-count]',
      `${Number(checklist.done || 0)} dari ${Number(checklist.total || 12)} diperiksa`
    );
    setText(
      '[data-overall-documents-count]',
      `${Number(documents.verified || 0)} dari ${Number(documents.total || 4)} terverifikasi`
    );
    setText(
      '[data-overall-agenda-count]',
      `${Number(agenda.done || 0)} dari ${Number(agenda.total || 4)} dibaca`
    );

    const copy = document.querySelector('[data-overall-progress-copy]');
    if (copy) {
      copy.textContent =
        'Progress dihitung langsung dari akun backend: Manasik, Checklist, Dokumen terverifikasi, dan Agenda.';
      copy.dataset.state = 'backend';
    }
  };

  const setError = () => {
    const copy = document.querySelector('[data-overall-progress-copy]');
    if (copy) {
      copy.textContent = 'Progress akun belum dapat dimuat. Coba muat ulang halaman.';
      copy.dataset.state = 'error';
    }
  };

  const load = async () => {
    try {
      const response = await fetch(`${API_BASE}/jamaah/progress/summary`, {
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || `http_${response.status}`);
      }
      render(data.progress);
      window.dispatchEvent(new CustomEvent('umroh:dashboard-progress-loaded', {
        detail: data.progress
      }));
    } catch (_) {
      setError();
    }
  };

  load();
  addEventListener('pageshow', load);
  addEventListener('focus', load);
  addEventListener('online', load);
})();
