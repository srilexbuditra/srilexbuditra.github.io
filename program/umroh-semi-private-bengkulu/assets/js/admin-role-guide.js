(() => {
  'use strict';
  const root = document.querySelector('[data-admin-role-guide]');
  if (!root) return;

  const guides = {
    super_admin: { label: 'Senior Full Stack Developer · Platform Architect', file: 'panduan-super-admin-v3.9.0.pdf', preview: 'panduan-super-admin-v3.9.0', pages: 3, description: 'Panduan untuk akun dengan akses sistem tingkat tertinggi: Ringkasan, Jemaah, Manasik, Agenda, Dokumen, Pengumuman, Manajemen Admin, dan Pengaturan.' },
    admin: { label: 'Admin', file: 'panduan-admin-v3.9.0.pdf', preview: 'panduan-admin-v3.9.0', pages: 3, description: 'Panduan operasional pengelolaan Jemaah, verifikasi dokumen, Manasik, Agenda, Pengumuman, dan Pengaturan yang diizinkan.' },
    tour_leader: { label: 'Tour Leader', file: 'panduan-tour-leader-v3.9.0.pdf', preview: 'panduan-tour-leader-v3.9.0', pages: 3, description: 'Panduan koordinasi perjalanan, Agenda, Pengumuman, Manasik, dan pemantauan Jemaah sesuai kewenangan role.' },
    pendamping: { label: 'Pendamping', file: 'panduan-pendamping-v3.9.0.pdf', preview: 'panduan-pendamping-v3.9.0', pages: 3, description: 'Panduan pemantauan dan pendampingan Jemaah, Agenda, Pengumuman, serta jalur eskalasi sesuai kewenangan role.' }
  };

  const renderPreview = (container, cfg) => {
    if (!container) return;
    container.replaceChildren();

    const viewer = document.createElement('div');
    viewer.className = 'admin-role-guide-viewer';
    viewer.tabIndex = 0;

    const stage = document.createElement('div');
    stage.className = 'admin-role-guide-stage';
    const pages = [];

    const imagePrev = document.createElement('button');
    imagePrev.type = 'button';
    imagePrev.className = 'admin-role-guide-image-nav admin-role-guide-image-nav-prev';
    imagePrev.setAttribute('aria-label', 'Halaman panduan sebelumnya');
    imagePrev.innerHTML = '<span aria-hidden="true">‹</span>';

    const imageNext = document.createElement('button');
    imageNext.type = 'button';
    imageNext.className = 'admin-role-guide-image-nav admin-role-guide-image-nav-next';
    imageNext.setAttribute('aria-label', 'Halaman panduan berikutnya');
    imageNext.innerHTML = '<span aria-hidden="true">›</span>';

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
      stage.append(figure);
      pages.push(figure);
    }

    const nav = document.createElement('nav');
    nav.className = 'admin-role-guide-nav';
    nav.setAttribute('aria-label', 'Navigasi halaman panduan');
    const prev = document.createElement('button');
    prev.type = 'button'; prev.textContent = '← Sebelumnya'; prev.className = 'admin-role-guide-nav-button';
    const picker = document.createElement('div');
    picker.className = 'admin-role-guide-page-picker';
    const status = document.createElement('span');
    status.className = 'admin-role-guide-page-status';
    status.setAttribute('aria-live', 'polite');
    const next = document.createElement('button');
    next.type = 'button'; next.textContent = 'Berikutnya →'; next.className = 'admin-role-guide-nav-button';
    nav.append(prev, picker, status, next);

    let current = 0;
    const buttons = pages.map((_, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'admin-role-guide-page-button';
      button.textContent = String(index + 1);
      button.setAttribute('aria-label', `Buka halaman ${index + 1}`);
      picker.append(button);
      button.addEventListener('click', () => show(index));
      return button;
    });

    function show(index) {
      current = Math.max(0, Math.min(index, pages.length - 1));
      pages.forEach((page, i) => { page.hidden = i !== current; page.classList.toggle('is-active', i === current); });
      buttons.forEach((button, i) => { const active = i === current; button.classList.toggle('is-active', active); button.setAttribute('aria-current', active ? 'page' : 'false'); });
      status.textContent = `Halaman ${current + 1} dari ${pages.length}`;
      prev.disabled = current === 0;
      next.disabled = current === pages.length - 1;
      imagePrev.disabled = current === 0;
      imageNext.disabled = current === pages.length - 1;
    }

    prev.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => show(current + 1));
    imagePrev.addEventListener('click', () => show(current - 1));
    imageNext.addEventListener('click', () => show(current + 1));
    viewer.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
    });

    stage.append(imagePrev, imageNext);
    viewer.append(stage, nav);
    container.append(viewer);
    show(0);
  };

  const apply = () => {
    const account = window.UMROH_ADMIN_ACCOUNT;
    if (!account?.role) return false;
    const cfg = guides[account.role];
    if (!cfg) { root.hidden = true; return true; }

    const href = `../dokumentasi/${cfg.file}`;
    const label = root.querySelector('[data-role-guide-label]');
    const desc = root.querySelector('[data-role-guide-description]');
    const open = root.querySelector('[data-role-guide-open]');
    const download = root.querySelector('[data-role-guide-download]');
    const preview = root.querySelector('[data-role-guide-preview]');
    if (label) label.textContent = cfg.label;
    if (desc) desc.textContent = cfg.description;
    if (open) open.href = href;
    if (download) { download.href = href; download.setAttribute('download', cfg.file); }
    renderPreview(preview, cfg);
    return true;
  };

  if (apply()) return;
  let tries = 0;
  const timer = setInterval(() => { tries += 1; if (apply() || tries > 100) clearInterval(timer); }, 80);
})();
