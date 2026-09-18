(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const progressKey = 'umroh-manasik-progress-v1';
  const base = '/program/umroh-semi-private-bengkulu/manasik/';
  const lessons = [
    { slug: 'persiapan', title: 'Persiapan Sebelum Berangkat', url: `${base}persiapan/` },
    { slug: 'ihram-miqat', title: 'Ihram & Miqat', url: `${base}ihram-miqat/` },
    { slug: 'talbiyah', title: 'Talbiyah', url: `${base}talbiyah/` },
    { slug: 'tata-cara-umroh', title: 'Tata Cara Umroh', url: `${base}tata-cara-umroh/` },
    { slug: 'thawaf', title: 'Thawaf', url: `${base}thawaf/` },
    { slug: 'sai', title: "Sa'i", url: `${base}sai/` },
    { slug: 'tahallul', title: 'Tahallul', url: `${base}tahallul/` },
    { slug: 'larangan-ihram', title: 'Larangan Ihram', url: `${base}larangan-ihram/` },
    { slug: 'adab-tanah-suci', title: 'Adab di Tanah Suci', url: `${base}adab-tanah-suci/` },
    { slug: 'ziarah-madinah', title: 'Ziarah Madinah', url: `${base}ziarah-madinah/` },
    { slug: 'tips-perjalanan', title: 'Tips Selama Perjalanan', url: `${base}tips-perjalanan/` }
  ];

  const readState = () => {
    try {
      const value = JSON.parse(localStorage.getItem(progressKey) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (_) {
      return {};
    }
  };

  const saveServerState = (progress) => {
    const state = readState();
    lessons.forEach((item) => { state[item.slug] = false; });
    (progress?.items || []).forEach((item) => {
      if (lessons.some((lesson) => lesson.slug === item.item_key)) {
        state[item.item_key] = item.status === 'complete';
      }
    });
    try { localStorage.setItem(progressKey, JSON.stringify(state)); } catch (_) {}
    return state;
  };

  const render = (state = readState(), synced = false) => {
    const done = lessons.filter((item) => !!state[item.slug]).length;
    const total = lessons.length;
    const next = lessons.find((item) => !state[item.slug]);

    document.querySelectorAll('[data-manasik-summary]').forEach((el) => {
      el.textContent = `${done} dari ${total} selesai${synced ? ' · D1' : ''}`;
    });

    const title = document.querySelector('[data-manasik-next-title]');
    const copy = document.querySelector('[data-manasik-next-copy]');
    const link = document.querySelector('[data-manasik-next-link]');
    if (!title || !copy || !link) return;

    if (next) {
      title.textContent = `Manasik — ${next.title}`;
      copy.textContent = done === 0
        ? 'Mulai dari materi pertama agar progress Manasik mulai tercatat.'
        : `Anda telah menyelesaikan ${done} dari ${total} materi${synced ? ' pada akun Anda' : ''}. Lanjutkan materi berikutnya.`;
      link.href = next.url;
      link.textContent = 'Lanjutkan →';
    } else {
      title.textContent = 'Manasik selesai';
      copy.textContent = synced
        ? `Seluruh ${total} materi sudah tersinkron pada akun Anda.`
        : `Seluruh ${total} materi sudah ditandai selesai di browser ini.`;
      link.href = base;
      link.textContent = 'Lihat ringkasan →';
    }
  };

  const sync = async () => {
    try {
      const response = await fetch(`${API_BASE}/jamaah/progress/manasik`, {
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) return;
      const state = saveServerState(data.progress);
      render(state, true);
      window.dispatchEvent(new CustomEvent('umroh:manasik-progress-synced', {
        detail: data.progress
      }));
    } catch (_) {}
  };

  render();
  sync();
  addEventListener('pageshow', () => { render(); sync(); });
  addEventListener('focus', sync);
  addEventListener('storage', (event) => {
    if (event.key === progressKey) render();
  });
})();
