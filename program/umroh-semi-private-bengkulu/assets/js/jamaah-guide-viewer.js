(() => {
  'use strict';
  const viewer = document.querySelector('[data-help-guide-viewer]');
  if (!viewer) return;

  const pages = [...viewer.querySelectorAll('[data-guide-page]')];
  const prev = viewer.querySelector('[data-guide-prev]');
  const next = viewer.querySelector('[data-guide-next]');
  const status = viewer.querySelector('[data-guide-status]');
  const picker = viewer.querySelector('[data-guide-picker]');
  const stage = viewer.querySelector('[data-help-guide-pages]');
  if (!pages.length) return;

  let current = 0;
  viewer.classList.add('is-enhanced');

  const imagePrev = document.createElement('button');
  imagePrev.type = 'button';
  imagePrev.className = 'help-guide-image-nav help-guide-image-nav-prev';
  imagePrev.setAttribute('aria-label', 'Halaman panduan sebelumnya');
  imagePrev.innerHTML = '<span aria-hidden="true">‹</span>';

  const imageNext = document.createElement('button');
  imageNext.type = 'button';
  imageNext.className = 'help-guide-image-nav help-guide-image-nav-next';
  imageNext.setAttribute('aria-label', 'Halaman panduan berikutnya');
  imageNext.innerHTML = '<span aria-hidden="true">›</span>';

  stage?.append(imagePrev, imageNext);

  const buttons = pages.map((_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'help-guide-page-button';
    button.textContent = String(index + 1);
    button.setAttribute('aria-label', `Buka halaman ${index + 1}`);
    button.addEventListener('click', () => show(index));
    picker?.append(button);
    return button;
  });

  function show(index) {
    current = Math.max(0, Math.min(index, pages.length - 1));
    pages.forEach((page, i) => {
      const active = i === current;
      page.classList.toggle('is-active', active);
      page.hidden = !active;
    });
    buttons.forEach((button, i) => {
      const active = i === current;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
    });
    if (status) status.textContent = `Halaman ${current + 1} dari ${pages.length}`;
    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current === pages.length - 1;
    imagePrev.disabled = current === 0;
    imageNext.disabled = current === pages.length - 1;
  }

  prev?.addEventListener('click', () => show(current - 1));
  next?.addEventListener('click', () => show(current + 1));
  imagePrev.addEventListener('click', () => show(current - 1));
  imageNext.addEventListener('click', () => show(current + 1));
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
  });

  show(0);
})();
