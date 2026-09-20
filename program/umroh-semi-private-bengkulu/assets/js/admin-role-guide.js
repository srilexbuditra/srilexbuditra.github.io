(() => {
  'use strict';
  const root = document.querySelector('[data-admin-role-guide]');
  if (!root) return;

  const guides = {
    super_admin: {
      label: 'Super Admin',
      file: 'panduan-super-admin-v3.9.0.pdf',
      preview: 'panduan-super-admin-v3.9.0',
      pages: 3,
      description: 'Panduan lengkap Ringkasan, Jemaah, Manasik, Agenda, Dokumen, Pengumuman, Manajemen Admin, dan Pengaturan.'
    },
    admin: {
      label: 'Admin',
      file: 'panduan-admin-v3.9.0.pdf',
      preview: 'panduan-admin-v3.9.0',
      pages: 3,
      description: 'Panduan operasional pengelolaan Jemaah, verifikasi dokumen, Manasik, Agenda, Pengumuman, dan Pengaturan yang diizinkan.'
    },
    tour_leader: {
      label: 'Tour Leader',
      file: 'panduan-tour-leader-v3.9.0.pdf',
      preview: 'panduan-tour-leader-v3.9.0',
      pages: 3,
      description: 'Panduan koordinasi perjalanan, Agenda, Pengumuman, Manasik, dan pemantauan Jemaah sesuai kewenangan role.'
    },
    pendamping: {
      label: 'Pendamping',
      file: 'panduan-pendamping-v3.9.0.pdf',
      preview: 'panduan-pendamping-v3.9.0',
      pages: 3,
      description: 'Panduan pemantauan dan pendampingan Jemaah, Agenda, Pengumuman, serta jalur eskalasi sesuai kewenangan role.'
    }
  };

  const renderPreview = (container, cfg) => {
    if (!container) return;
    container.replaceChildren();
    const fragment = document.createDocumentFragment();

    for (let page = 1; page <= cfg.pages; page += 1) {
      const figure = document.createElement('figure');
      figure.className = 'admin-role-guide-page';

      const image = document.createElement('img');
      image.src = `../dokumentasi/preview/${cfg.preview}/page-${page}.png`;
      image.alt = `Panduan Dashboard ${cfg.label} halaman ${page} dari ${cfg.pages}`;
      image.decoding = 'async';
      if (page > 1) image.loading = 'lazy';

      const caption = document.createElement('figcaption');
      caption.textContent = `Halaman ${page} dari ${cfg.pages}`;

      figure.append(image, caption);
      fragment.append(figure);
    }

    container.append(fragment);
  };

  const apply = () => {
    const account = window.UMROH_ADMIN_ACCOUNT;
    if (!account?.role) return false;
    const cfg = guides[account.role];
    if (!cfg) {
      root.hidden = true;
      return true;
    }

    const href = `../dokumentasi/${cfg.file}`;
    const label = root.querySelector('[data-role-guide-label]');
    const desc = root.querySelector('[data-role-guide-description]');
    const open = root.querySelector('[data-role-guide-open]');
    const download = root.querySelector('[data-role-guide-download]');
    const preview = root.querySelector('[data-role-guide-preview]');

    if (label) label.textContent = cfg.label;
    if (desc) desc.textContent = cfg.description;
    if (open) open.href = href;
    if (download) {
      download.href = href;
      download.setAttribute('download', cfg.file);
    }
    renderPreview(preview, cfg);
    return true;
  };

  if (apply()) return;
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (apply() || tries > 100) clearInterval(timer);
  }, 80);
})();
