(() => {
  const key = 'umroh-checklist-progress-v1';
  const items = [
    ['paspor-dokumen','dokumen'],['tiket-itinerary','dokumen'],['identitas-jemaah','dokumen'],['dokumen-kesehatan','dokumen'],
    ['kain-ihram','perlengkapan'],['mukena-pakaian-muslim','perlengkapan'],['alas-kaki','perlengkapan'],['obat-kebutuhan-pribadi','perlengkapan'],
    ['pelajari-tata-cara','ibadah'],['hafalkan-niat-talbiyah','ibadah'],['jaga-fisik-istirahat','ibadah'],['ikuti-arahan','ibadah']
  ];
  const validStates = new Set(['ready','na']);

  const read = () => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (_) { return {}; }
  };
  const write = state => localStorage.setItem(key, JSON.stringify(state));

  const render = () => {
    const state = read();
    let done = 0;
    const categoryDone = { dokumen:0, perlengkapan:0, ibadah:0 };

    items.forEach(([id,category]) => {
      const value = validStates.has(state[id]) ? state[id] : '';
      if (value) { done += 1; categoryDone[category] += 1; }
      const row = document.querySelector(`[data-check-item="${id}"]`);
      if (!row) return;
      row.classList.toggle('is-ready', value === 'ready');
      row.classList.toggle('is-na', value === 'na');
      const ready = row.querySelector('[data-check-ready]');
      const na = row.querySelector('[data-check-na]');
      if (ready) { ready.classList.toggle('is-active', value === 'ready'); ready.textContent = value === 'ready' ? '✓ Siap' : 'Siap'; }
      if (na) { na.classList.toggle('is-active', value === 'na'); na.textContent = value === 'na' ? '✓ Tidak berlaku' : 'Tidak berlaku'; }
    });

    const total = items.length;
    const percent = Math.round((done / total) * 100);
    document.querySelectorAll('[data-checklist-count]').forEach(el => el.textContent = `${done} / ${total}`);
    document.querySelectorAll('[data-checklist-percent]').forEach(el => el.textContent = `${percent}%`);
    document.querySelectorAll('[data-checklist-bar]').forEach(el => el.style.width = `${percent}%`);
    Object.entries(categoryDone).forEach(([category,count]) => {
      document.querySelectorAll(`[data-category-count="${category}"]`).forEach(el => el.textContent = `${count} / 4`);
    });

    const title = document.querySelector('[data-checklist-summary-title]');
    const copy = document.querySelector('[data-checklist-summary-copy]');
    if (title && copy) {
      if (done === 0) {
        title.textContent = 'Belum ada item yang selesai diperiksa';
        copy.textContent = 'Mulai dari dokumen, lalu lanjutkan ke perlengkapan dan kesiapan ibadah.';
      } else if (done < total) {
        title.textContent = `${done} dari ${total} item selesai diperiksa`;
        copy.textContent = `Masih ada ${total - done} item yang perlu Anda periksa.`;
      } else {
        title.textContent = 'Checklist persiapan selesai diperiksa';
        copy.textContent = 'Seluruh item sudah ditandai Siap atau Tidak berlaku pada perangkat ini.';
      }
    }
  };

  document.addEventListener('click', event => {
    const ready = event.target.closest('[data-check-ready]');
    const na = event.target.closest('[data-check-na]');
    if (!ready && !na) return;
    const row = event.target.closest('[data-check-item]');
    if (!row) return;
    const id = row.dataset.checkItem;
    const state = read();
    const next = ready ? 'ready' : 'na';
    state[id] = state[id] === next ? '' : next;
    if (!state[id]) delete state[id];
    write(state);
    render();
  });

  render();
  addEventListener('pageshow', render);
})();
