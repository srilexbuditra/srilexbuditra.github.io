(() => {
  const key = 'umroh-announcements-read-v1';
  const announcements = Array.isArray(window.UMROH_ANNOUNCEMENTS) ? window.UMROH_ANNOUNCEMENTS : [];
  const list = document.querySelector('[data-announcement-list]');
  const readCount = document.querySelector('[data-announcement-read-count]');
  const progressText = document.querySelector('[data-announcement-progress-text]');
  const progressBar = document.querySelector('[data-announcement-progress-bar]');
  const filterButtons = [...document.querySelectorAll('[data-announcement-filter]')];

  const readState = () => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (_) {
      return {};
    }
  };

  const writeState = (state) => localStorage.setItem(key, JSON.stringify(state));
  let activeFilter = 'semua';

  const iconClass = (icon) => ({
    book: 'icon-book', file: 'icon-file', users: 'icon-user', alert: 'icon-alert', calendar: 'icon-calendar'
  }[icon] || 'icon-info');

  const filtered = () => activeFilter === 'semua'
    ? announcements
    : announcements.filter(item => item.category.toLowerCase() === activeFilter);

  const render = () => {
    if (!list) return;
    const state = readState();
    const items = filtered();
    list.innerHTML = items.map(item => {
      const isRead = Boolean(state[item.id]);
      return `
        <article class="announcement-card ${isRead ? 'is-read' : ''}" data-announcement-id="${item.id}">
          <div class="announcement-card-icon"><span aria-hidden="true" class="ui-icon ${iconClass(item.icon)}"></span></div>
          <div class="announcement-card-main">
            <div class="announcement-card-meta"><span class="announcement-category">${item.category}</span><time datetime="${item.dateISO}">${item.dateLabel}</time></div>
            <h2>${item.title}</h2>
            <p>${item.summary}</p>
            <div class="announcement-detail" ${isRead ? '' : 'hidden'}>${item.detail}</div>
          </div>
          <div class="announcement-card-action">
            <button type="button" data-announcement-toggle="${item.id}">${isRead ? '✓ Sudah dibaca' : 'Tandai dibaca'}</button>
          </div>
        </article>`;
    }).join('');

    list.querySelectorAll('[data-announcement-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-announcement-toggle');
        const next = readState();
        if (next[id]) delete next[id]; else next[id] = true;
        writeState(next);
        render();
      });
    });

    const stateNow = readState();
    const read = announcements.filter(item => stateNow[item.id]).length;
    const pct = announcements.length ? Math.round((read / announcements.length) * 100) : 0;
    if (readCount) readCount.textContent = `${read} / ${announcements.length}`;
    if (progressText) progressText.textContent = `${pct}% pengumuman sudah dibaca`;
    if (progressBar) progressBar.style.width = `${pct}%`;
  };

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.getAttribute('data-announcement-filter') || 'semua';
      filterButtons.forEach(item => item.classList.toggle('is-active', item === button));
      render();
    });
  });

  window.addEventListener('storage', render);
  render();
})();
