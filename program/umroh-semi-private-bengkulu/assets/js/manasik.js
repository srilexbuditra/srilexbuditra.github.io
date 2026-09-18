(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const key = 'umroh-manasik-progress-v1';
  const queueKey = 'umroh-manasik-sync-queue-v1';
  const lessons = [
    'persiapan','ihram-miqat','talbiyah','tata-cara-umroh','thawaf','sai',
    'tahallul','larangan-ihram','adab-tanah-suci','ziarah-madinah','tips-perjalanan'
  ];
  const known = new Set(lessons);

  let backendActive = false;
  let syncPromise = null;

  const readObject = (storageKey) => {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (_) {
      return {};
    }
  };

  const writeObject = (storageKey, value) => {
    try { localStorage.setItem(storageKey, JSON.stringify(value)); } catch (_) {}
  };

  const getState = () => readObject(key);
  const saveState = (state) => writeObject(key, state);
  const getQueue = () => readObject(queueKey);
  const saveQueue = (queue) => writeObject(queueKey, queue);

  const setSyncCopy = (mode, text = '') => {
    document.querySelectorAll('[data-progress-source]').forEach((node) => {
      node.textContent = mode === 'account' ? 'Progress akun Anda · D1' : 'Progress di perangkat ini';
    });
    document.querySelectorAll('[data-progress-storage-copy]').forEach((node) => {
      node.textContent = mode === 'account'
        ? 'Progress materi tersimpan pada akun jemaah dan dapat digunakan lintas perangkat.'
        : 'Progress sementara tersimpan di browser ini. Login sebagai jemaah untuk sinkronisasi akun.';
    });
    document.querySelectorAll('[data-manasik-sync-note]').forEach((node) => {
      node.textContent = text || (mode === 'account'
        ? 'Progress Manasik tersinkron ke akun jemaah.'
        : 'Mode lokal aktif. Progress belum tersinkron ke akun.');
      node.dataset.state = mode;
    });
  };

  const updateIndex = () => {
    const cards = [...document.querySelectorAll('[data-module-slug]')];
    if (!cards.length) return;
    const state = getState();
    let done = 0;
    cards.forEach((card) => {
      const complete = !!state[card.dataset.moduleSlug];
      card.classList.toggle('is-complete', complete);
      const label = card.querySelector('[data-module-status]');
      if (label) label.textContent = complete ? 'Selesai' : 'Belum selesai';
      if (complete) done++;
    });
    const pct = Math.round((done / cards.length) * 100);
    document.querySelectorAll('[data-progress-count]').forEach((el) => { el.textContent = `${done} / ${cards.length}`; });
    document.querySelectorAll('[data-progress-percent]').forEach((el) => { el.textContent = `${pct}%`; });
    document.querySelectorAll('[data-progress-bar]').forEach((el) => { el.style.width = `${pct}%`; });
  };

  const renderLesson = () => {
    const page = document.querySelector('[data-lesson-slug]');
    const button = document.querySelector('[data-complete-button]');
    if (!page || !button) return;
    const complete = !!getState()[page.dataset.lessonSlug];
    button.classList.toggle('is-complete', complete);
    button.textContent = complete ? '✓ Materi selesai' : 'Tandai materi selesai';
    button.setAttribute('aria-pressed', String(complete));
  };

  const render = () => {
    updateIndex();
    renderLesson();
  };

  const api = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
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
    const state = getState();
    lessons.forEach((slug) => { state[slug] = false; });
    (progress?.items || []).forEach((item) => {
      if (known.has(item.item_key)) state[item.item_key] = item.status === 'complete';
    });

    // Local queued changes are newer than the last server snapshot.
    const queue = getQueue();
    Object.entries(queue).forEach(([slug, complete]) => {
      if (known.has(slug)) state[slug] = Boolean(complete);
    });

    saveState(state);
    render();
  };

  const flushQueue = async () => {
    const queue = getQueue();
    const entries = Object.entries(queue).filter(([slug]) => known.has(slug));
    if (!entries.length) return;

    for (const [slug, complete] of entries) {
      try {
        const data = await api(`/jamaah/progress/manasik/${encodeURIComponent(slug)}`, {
          method: 'PATCH',
          body: JSON.stringify({ complete: Boolean(complete) })
        });
        const latest = getQueue();
        delete latest[slug];
        saveQueue(latest);
        serverToLocal(data.progress);
      } catch (error) {
        if ([401, 403].includes(error.status)) {
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
        let data = await api('/jamaah/progress/manasik');
        backendActive = true;

        const local = getState();
        const completedLocal = lessons.filter((slug) => local[slug] === true);

        // One-time migration only when the account has never stored Manasik progress.
        if (!data.progress?.initialized && completedLocal.length) {
          data = await api('/jamaah/progress/manasik/import', {
            method: 'POST',
            body: JSON.stringify({ completed: completedLocal })
          });
          setSyncCopy('account', `Progress lokal lama berhasil dipindahkan ke akun (${data.progress?.done || 0}/${lessons.length}).`);
        } else {
          setSyncCopy('account');
        }

        serverToLocal(data.progress);
        await flushQueue();

        // Refresh once more so the browser cache is exactly equal to D1 after queue flush.
        const fresh = await api('/jamaah/progress/manasik');
        serverToLocal(fresh.progress);
        window.dispatchEvent(new CustomEvent('umroh:manasik-progress-synced', {
          detail: fresh.progress
        }));
      } catch (error) {
        if (![401, 403].includes(error.status)) {
          console.warn('Manasik sync:', error);
        }
        backendActive = false;
        setSyncCopy('local');
        render();
      } finally {
        syncPromise = null;
      }
    })();

    return syncPromise;
  };

  const initLesson = () => {
    const page = document.querySelector('[data-lesson-slug]');
    const button = document.querySelector('[data-complete-button]');
    if (!page || !button) return;
    const slug = page.dataset.lessonSlug;

    button.addEventListener('click', async () => {
      const state = getState();
      const next = !state[slug];
      state[slug] = next;
      saveState(state);

      const queue = getQueue();
      queue[slug] = next;
      saveQueue(queue);
      render();

      button.disabled = true;
      try {
        if (!backendActive) await initialSync();
        else {
          await flushQueue();
          const fresh = await api('/jamaah/progress/manasik');
          serverToLocal(fresh.progress);
          window.dispatchEvent(new CustomEvent('umroh:manasik-progress-synced', {
            detail: fresh.progress
          }));
        }
      } catch (_) {
        // Local cache + queue keep the tap safe until the next successful sync.
      } finally {
        button.disabled = false;
      }
    });

    renderLesson();
  };

  render();
  initLesson();
  setSyncCopy('local');
  initialSync();

  addEventListener('pageshow', () => { render(); initialSync(); });
  addEventListener('focus', () => { initialSync(); });
  addEventListener('online', () => { initialSync(); });
  addEventListener('storage', (event) => {
    if ([key, queueKey].includes(event.key)) render();
  });
})();
