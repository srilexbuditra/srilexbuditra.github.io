(() => {
  const key = 'umroh-documents-status-v1';
  const ids = ['paspor-dokumen','tiket-itinerary','identitas-jemaah','dokumen-kesehatan'];
  const valid = new Set(['ready','waiting']);

  const read = () => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (_) { return {}; }
  };

  const render = () => {
    const state = read();
    const reviewed = ids.filter(id => valid.has(state[id])).length;
    const ready = ids.filter(id => state[id] === 'ready').length;
    const waiting = ids.filter(id => state[id] === 'waiting').length;
    document.querySelectorAll('[data-documents-summary]').forEach(el => {
      if (reviewed === 0) {
        el.textContent = 'Belum diperiksa';
      } else {
        el.textContent = `${ready} dari ${ids.length} siap · ${reviewed} diperiksa`;
      }
      el.title = `${ready} disiapkan · ${waiting} menunggu · ${ids.length - reviewed} belum diperiksa`;
    });
  };

  render();
  addEventListener('pageshow', render);
})();
