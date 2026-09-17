(() => {
  const key = 'umroh-announcements-read-v1';
  const announcements = Array.isArray(window.UMROH_ANNOUNCEMENTS) ? window.UMROH_ANNOUNCEMENTS : [];
  const list = document.querySelector('[data-dashboard-announcements]');
  const dot = document.querySelector('[data-announcement-unread-count]');

  const readState = () => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (_) { return {}; }
  };

  const iconClass = (icon) => ({
    book: 'icon-book', file: 'icon-file', users: 'icon-user', alert: 'icon-alert'
  }[icon] || 'icon-info');

  const render = () => {
    const state = readState();
    const unread = announcements.filter(item => !state[item.id]);
    if (dot) {
      dot.textContent = String(unread.length);
      dot.hidden = unread.length === 0;
    }
    if (!list) return;
    const featured = [...unread, ...announcements.filter(item => state[item.id])].slice(0, 3);
    list.innerHTML = featured.map(item => `
      <div class="announcement ${state[item.id] ? 'is-read' : ''}">
        <div class="announcement-icon"><span aria-hidden="true" class="ui-icon ${iconClass(item.icon)}"></span></div>
        <div><strong>${item.title}</strong><span>${item.summary}</span></div>
        <time>${item.dateLabel}</time>
      </div>`).join('');
  };

  window.addEventListener('storage', render);
  render();
})();
