(() => {
  const key = 'umroh-manasik-progress-v1';
  const getState = () => {
    try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch (_) { return {}; }
  };
  const saveState = (state) => { try { localStorage.setItem(key, JSON.stringify(state)); } catch (_) {} };
  const updateIndex = () => {
    const cards = [...document.querySelectorAll('[data-module-slug]')];
    if (!cards.length) return;
    const state = getState();
    let done = 0;
    cards.forEach(card => {
      const complete = !!state[card.dataset.moduleSlug];
      card.classList.toggle('is-complete', complete);
      const label = card.querySelector('[data-module-status]');
      if (label) label.textContent = complete ? 'Selesai' : 'Belum selesai';
      if (complete) done++;
    });
    const pct = Math.round((done / cards.length) * 100);
    document.querySelectorAll('[data-progress-count]').forEach(el => el.textContent = `${done} / ${cards.length}`);
    document.querySelectorAll('[data-progress-percent]').forEach(el => el.textContent = `${pct}%`);
    document.querySelectorAll('[data-progress-bar]').forEach(el => el.style.width = `${pct}%`);
  };
  const initLesson = () => {
    const page = document.querySelector('[data-lesson-slug]');
    const button = document.querySelector('[data-complete-button]');
    if (!page || !button) return;
    const slug = page.dataset.lessonSlug;
    const render = () => {
      const complete = !!getState()[slug];
      button.classList.toggle('is-complete', complete);
      button.textContent = complete ? '✓ Materi selesai' : 'Tandai materi selesai';
      button.setAttribute('aria-pressed', String(complete));
    };
    button.addEventListener('click', () => {
      const state = getState();
      state[slug] = !state[slug];
      saveState(state);
      render();
    });
    render();
  };
  updateIndex();
  initLesson();
})();
