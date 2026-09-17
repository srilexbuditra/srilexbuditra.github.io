(() => {
  const key = 'umroh-checklist-progress-v1';
  const total = 12;
  const valid = new Set(['ready','na']);
  const read = () => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (_) { return {}; }
  };
  const render = () => {
    const state = read();
    const done = Object.values(state).filter(value => valid.has(value)).length;
    document.querySelectorAll('[data-checklist-summary]').forEach(el => {
      el.textContent = `${Math.min(done,total)} dari ${total} diperiksa`;
    });
  };
  render();
  addEventListener('pageshow', render);
  addEventListener('focus', render);
  addEventListener('storage', event => { if (event.key === key) render(); });
})();
