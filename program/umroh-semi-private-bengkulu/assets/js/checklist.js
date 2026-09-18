(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const key = 'umroh-checklist-progress-v1';
  const queueKey = 'umroh-checklist-sync-queue-v1';
  const items = [
    ['paspor-dokumen','dokumen'],['tiket-itinerary','dokumen'],['identitas-jemaah','dokumen'],['dokumen-kesehatan','dokumen'],
    ['kain-ihram','perlengkapan'],['mukena-pakaian-muslim','perlengkapan'],['alas-kaki','perlengkapan'],['obat-kebutuhan-pribadi','perlengkapan'],
    ['pelajari-tata-cara','ibadah'],['hafalkan-niat-talbiyah','ibadah'],['jaga-fisik-istirahat','ibadah'],['ikuti-arahan','ibadah']
  ];
  const known = new Set(items.map(([id]) => id));
  const validStates = new Set(['ready','na']);

  let backendActive = false;
  let syncPromise = null;

  const readObject = (storageKey) => {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (_) { return {}; }
  };

  const writeObject = (storageKey, value) => {
    try { localStorage.setItem(storageKey, JSON.stringify(value)); } catch (_) {}
  };

  const read = () => readObject(key);
  const write = (state) => writeObject(key, state);
  const getQueue = () => readObject(queueKey);
  const saveQueue = (queue) => writeObject(queueKey, queue);

  const setSyncCopy = (mode, text = '') => {
    document.querySelectorAll('[data-checklist-source]').forEach((node) => {
      node.textContent = mode === 'account' ? 'Progress akun Anda · D1' : 'Progress di perangkat ini';
    });
    document.querySelectorAll('[data-checklist-storage-copy]').forEach((node) => {
      node.textContent = mode === 'account'
        ? 'Progress checklist tersimpan pada akun jemaah dan dapat digunakan lintas perangkat.'
        : 'Progress sementara tersimpan di browser ini. Login sebagai jemaah untuk sinkronisasi akun.';
    });
    document.querySelectorAll('[data-checklist-sync-note]').forEach((node) => {
      node.textContent = text || (mode === 'account'
        ? 'Checklist tersinkron ke akun jemaah.'
        : 'Mode lokal aktif. Checklist belum tersinkron ke akun.');
      node.dataset.state = mode;
    });
  };

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
      if (ready) {
        ready.classList.toggle('is-active', value === 'ready');
        ready.textContent = value === 'ready' ? '✓ Siap' : 'Siap';
      }
      if (na) {
        na.classList.toggle('is-active', value === 'na');
        na.textContent = value === 'na' ? '✓ Tidak berlaku' : 'Tidak berlaku';
      }
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
        copy.textContent = backendActive
          ? 'Seluruh item sudah tersimpan pada akun Anda sebagai Siap atau Tidak berlaku.'
          : 'Seluruh item sudah ditandai Siap atau Tidak berlaku pada perangkat ini.';
      }
    }
  };

  const api = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type':'application/json' } : {}),
        ...(options.headers || {})
      },
      ...options
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data?.ok) {
      const error = new Error(data?.error || `http_${response.status}`);
      error.status = response.status;
      error.code = data?.error || '';
      throw error;
    }
    return data;
  };

  const serverToLocal = (progress) => {
    const state = read();

    items.forEach(([id]) => { delete state[id]; });
    (progress?.items || []).forEach((item) => {
      if (!known.has(item.item_key)) return;
      if (item.status === 'complete') state[item.item_key] = 'ready';
      else if (item.status === 'not_applicable') state[item.item_key] = 'na';
    });

    // Pending local queue is newer than the server snapshot.
    const queue = getQueue();
    Object.entries(queue).forEach(([id, value]) => {
      if (!known.has(id)) return;
      if (value === 'ready' || value === 'na') state[id] = value;
      else delete state[id];
    });

    write(state);
    render();
  };

  const flushQueue = async () => {
    const queue = getQueue();
    const entries = Object.entries(queue).filter(([id]) => known.has(id));
    if (!entries.length) return;

    for (const [id, value] of entries) {
      const status = value === 'ready' ? 'ready' : value === 'na' ? 'na' : 'pending';
      try {
        const data = await api(`/jamaah/progress/checklist/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          body: JSON.stringify({ status })
        });
        const latest = getQueue();
        delete latest[id];
        saveQueue(latest);
        serverToLocal(data.progress);
      } catch (error) {
        if ([401,403].includes(error.status)) {
          backendActive = false;
          setSyncCopy('local');
        }
        throw error;
      }
    }
  };

  const initialSync = async () => {
    if (syncPromise) return syncPromise;

    syncPromise = (async () => {
      try {
        let data = await api('/jamaah/progress/checklist');
        backendActive = true;

        const local = read();
        const localImport = {};
        items.forEach(([id]) => {
          if (validStates.has(local[id])) localImport[id] = local[id];
        });

        // One-time migration only when the account has never stored Checklist progress.
        if (!data.progress?.initialized && Object.keys(localImport).length) {
          data = await api('/jamaah/progress/checklist/import', {
            method: 'POST',
            body: JSON.stringify({ items: localImport })
          });
          setSyncCopy(
            'account',
            `Checklist lokal lama berhasil dipindahkan ke akun (${data.progress?.reviewed || 0}/${items.length}).`
          );
        } else {
          setSyncCopy('account');
        }

        serverToLocal(data.progress);
        await flushQueue();

        const fresh = await api('/jamaah/progress/checklist');
        serverToLocal(fresh.progress);
        window.dispatchEvent(new CustomEvent('umroh:checklist-progress-synced', {
          detail: fresh.progress
        }));
      } catch (error) {
        if (![401,403].includes(error.status)) console.warn('Checklist sync:', error);
        backendActive = false;
        setSyncCopy('local');
        render();
      } finally {
        syncPromise = null;
      }
    })();

    return syncPromise;
  };

  document.addEventListener('click', async (event) => {
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

    const queue = getQueue();
    queue[id] = state[id] || 'pending';
    saveQueue(queue);
    render();

    ready && (ready.disabled = true);
    na && (na.disabled = true);
    try {
      if (!backendActive) await initialSync();
      else {
        await flushQueue();
        const fresh = await api('/jamaah/progress/checklist');
        serverToLocal(fresh.progress);
        window.dispatchEvent(new CustomEvent('umroh:checklist-progress-synced', {
          detail: fresh.progress
        }));
      }
    } catch (_) {
      // Local state + queue preserve the action until the next successful sync.
    } finally {
      if (ready) ready.disabled = false;
      if (na) na.disabled = false;
    }
  });

  render();
  setSyncCopy('local');
  initialSync();

  addEventListener('pageshow', () => { render(); initialSync(); });
  addEventListener('focus', () => { initialSync(); });
  addEventListener('online', () => { initialSync(); });
  addEventListener('storage', (event) => {
    if ([key, queueKey].includes(event.key)) render();
  });
})();
