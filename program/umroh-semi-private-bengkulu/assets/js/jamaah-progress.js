(() => {
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

  const render = () => {
    const state = readState();
    const done = lessons.filter(item => !!state[item.slug]).length;
    const total = lessons.length;
    const next = lessons.find(item => !state[item.slug]);

    document.querySelectorAll('[data-manasik-summary]').forEach(el => {
      el.textContent = `${done} dari ${total} selesai`;
    });

    const title = document.querySelector('[data-manasik-next-title]');
    const copy = document.querySelector('[data-manasik-next-copy]');
    const link = document.querySelector('[data-manasik-next-link]');

    if (!title || !copy || !link) return;

    if (next) {
      title.textContent = `Manasik — ${next.title}`;
      copy.textContent = done === 0
        ? 'Mulai dari materi pertama agar progress Manasik mulai tercatat.'
        : `Anda telah menyelesaikan ${done} dari ${total} materi. Lanjutkan materi berikutnya.`;
      link.href = next.url;
      link.textContent = 'Lanjutkan →';
    } else {
      title.textContent = 'Manasik selesai';
      copy.textContent = `Seluruh ${total} materi sudah ditandai selesai di browser ini. Anda tetap dapat membuka ulang materi kapan saja.`;
      link.href = base;
      link.textContent = 'Lihat ringkasan →';
    }
  };

  render();
  addEventListener('pageshow', render);
  addEventListener('focus', render);
  addEventListener('storage', event => {
    if (event.key === progressKey) render();
  });
})();
