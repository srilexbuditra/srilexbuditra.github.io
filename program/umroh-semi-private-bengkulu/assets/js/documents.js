(() => {
  const key = 'umroh-documents-status-v1';
  const items = ['paspor-dokumen','tiket-itinerary','identitas-jemaah','dokumen-kesehatan'];
  const valid = new Set(['ready','waiting']);

  const read = () => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (_) { return {}; }
  };
  const write = state => localStorage.setItem(key, JSON.stringify(state));

  const render = () => {
    const state = read();
    let reviewed = 0;
    let readyCount = 0;
    let waitingCount = 0;

    items.forEach(id => {
      const value = valid.has(state[id]) ? state[id] : '';
      if (value) reviewed += 1;
      if (value === 'ready') readyCount += 1;
      if (value === 'waiting') waitingCount += 1;
      const row = document.querySelector(`[data-doc-item="${id}"]`);
      if (!row) return;
      row.classList.toggle('is-ready', value === 'ready');
      row.classList.toggle('is-waiting', value === 'waiting');
      const ready = row.querySelector('[data-doc-ready]');
      const waiting = row.querySelector('[data-doc-waiting]');
      const label = row.querySelector('[data-doc-state-label]');
      if (ready) {
        ready.classList.toggle('is-ready', value === 'ready');
        ready.textContent = value === 'ready' ? '✓ Sudah disiapkan' : 'Sudah disiapkan';
      }
      if (waiting) {
        waiting.classList.toggle('is-waiting', value === 'waiting');
        waiting.textContent = value === 'waiting' ? '✓ Menunggu' : 'Menunggu';
      }
      if (label) label.textContent = value === 'ready' ? 'Sudah disiapkan · belum diverifikasi' : value === 'waiting' ? 'Menunggu diterbitkan / dikonfirmasi' : 'Belum diperiksa';
    });

    const total = items.length;
    const percent = Math.round((reviewed / total) * 100);
    document.querySelectorAll('[data-docs-count]').forEach(el => el.textContent = `${reviewed} / ${total}`);
    document.querySelectorAll('[data-docs-percent]').forEach(el => el.textContent = `${percent}%`);
    document.querySelectorAll('[data-docs-bar]').forEach(el => el.style.width = `${percent}%`);

    const title = document.querySelector('[data-docs-summary-title]');
    const copy = document.querySelector('[data-docs-summary-copy]');
    if (title && copy) {
      if (reviewed === 0) {
        title.textContent = 'Belum ada dokumen yang diperiksa';
        copy.textContent = 'Tandai status setiap dokumen sesuai kondisi sebenarnya. Status “Menunggu” berarti dokumen belum tersedia atau belum dikonfirmasi.';
      } else if (reviewed < total) {
        title.textContent = `${reviewed} dari ${total} dokumen sudah diperiksa`;
        copy.textContent = `${readyCount} sudah disiapkan · ${waitingCount} menunggu · ${total - reviewed} belum diperiksa.`;
      } else {
        title.textContent = 'Semua status dokumen sudah diperiksa';
        copy.textContent = `${readyCount} sudah disiapkan · ${waitingCount} masih menunggu. Status ini belum merupakan verifikasi resmi.`;
      }
    }
  };

  document.addEventListener('click', event => {
    const ready = event.target.closest('[data-doc-ready]');
    const waiting = event.target.closest('[data-doc-waiting]');
    if (!ready && !waiting) return;
    const row = event.target.closest('[data-doc-item]');
    if (!row) return;
    const id = row.dataset.docItem;
    const state = read();
    const next = ready ? 'ready' : 'waiting';
    state[id] = state[id] === next ? '' : next;
    if (!state[id]) delete state[id];
    write(state);
    render();
  });

  render();
  addEventListener('pageshow', render);
})();
