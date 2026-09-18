(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const source = window.UmrohAgenda;
  if (!source) return;

  const readKey = 'umroh-agenda-read-v1';
  const queueKey = 'umroh-agenda-sync-queue-v1';

  const list = document.querySelector('[data-agenda-list]');
  const progressCount = document.querySelector('[data-agenda-read-count]');
  const progressPercent = document.querySelector('[data-agenda-read-percent]');
  const progressBar = document.querySelector('[data-agenda-read-bar]');
  const nextTitle = document.querySelector('[data-next-agenda-title]');
  const nextMeta = document.querySelector('[data-next-agenda-meta]');
  const nextStatus = document.querySelector('[data-next-agenda-status]');
  const departureDate = document.querySelector('[data-departure-date]');
  const departureCountdown = document.querySelector('[data-departure-countdown]');
  const departureTime = document.querySelector('[data-departure-time]');
  const departureLocation = document.querySelector('[data-departure-location]');
  const sourceNote = document.querySelector('[data-agenda-source-note]');
  const sourceCopy = document.querySelector('[data-agenda-list-source-copy]');

  let backendActive = false;
  let syncPromise = null;

  const readObject = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (_) { return {}; }
  };
  const writeObject = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  };
  const readState = () => readObject(readKey);
  const writeState = (state) => writeObject(readKey, state);
  const getQueue = () => readObject(queueKey);
  const saveQueue = (queue) => writeObject(queueKey, queue);
  const known = () => new Set(source.events.map((event) => event.id));

  const api = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials:'include',
      cache:'no-store',
      headers:{
        Accept:'application/json',
        ...(options.body ? {'Content-Type':'application/json'} : {}),
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

  const dateParts = (iso) => {
    const date = new Date(iso);
    const ymd = new Intl.DateTimeFormat('en-CA',{
      year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Asia/Jakarta'
    }).format(date);
    const hm = new Intl.DateTimeFormat('en-GB',{
      hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Jakarta'
    }).format(date);
    return { ymd, hm };
  };

  const mapStatus = (value) => ({
    scheduled:'Terjadwal',
    confirmed:'Dikonfirmasi',
    cancelled:'Dibatalkan',
    draft:'Draft'
  }[value] || value || 'Terjadwal');

  const iconFor = (category='') => {
    const value = category.toLowerCase();
    if (value.includes('manasik')) return 'book';
    if (value.includes('dokumen')) return 'file';
    if (value.includes('berangkat') || value.includes('perjalanan')) return 'plane';
    if (value.includes('brief')) return 'megaphone';
    return 'calendar';
  };

  const loadOfficialAgenda = async () => {
    try {
      const data = await api('/jamaah/agenda');
      const rows = data.events || [];
      if (!rows.length) return false;

      source.events = rows.map((event) => {
        const start = event.starts_at ? dateParts(event.starts_at) : {ymd:'',hm:''};
        const end = event.ends_at ? dateParts(event.ends_at) : null;
        const time = start.hm
          ? `${start.hm}${end?.hm ? `–${end.hm}` : ''} WIB`
          : 'Waktu belum ditetapkan';

        return {
          id: event.event_key,
          date: start.ymd,
          time,
          title: event.title,
          category: event.category || 'Perjalanan',
          location: event.location_text || 'Lokasi belum ditetapkan',
          note: event.description || 'Ikuti arahan pengelola dan Tour Leader.',
          status: mapStatus(event.event_status),
          icon: iconFor(event.category)
        };
      });

      source.simulation = false;

      const departureEvent = source.events.find((event) =>
        String(event.category || '').toLowerCase().includes('keberangkatan') ||
        String(event.title || '').toLowerCase().includes('keberangkatan')
      );

      source.departure = departureEvent ? {
        date: departureEvent.date,
        label: 'Keberangkatan',
        time: departureEvent.time,
        location: departureEvent.location,
        status: departureEvent.status
      } : null;

      if (sourceNote) {
        sourceNote.classList.add('is-official');
        sourceNote.innerHTML = '<span aria-hidden="true" class="ui-icon icon-check"></span><div><strong>Agenda resmi telah dipublikasikan.</strong> Tanggal, waktu, lokasi, status, dan arahan pada halaman ini berasal dari pengelola melalui backend D1.</div>';
      }
      if (sourceCopy) {
        sourceCopy.textContent = 'Jadwal di bawah berasal dari agenda resmi yang dipublikasikan pengelola.';
      }
      return true;
    } catch (_) {
      return false;
    }
  };

  const setSyncCopy = (mode, text='') => {
    document.querySelectorAll('[data-agenda-sync-note]').forEach((node) => {
      node.textContent = text || (mode === 'account'
        ? 'Status baca Agenda tersinkron ke akun jemaah.'
        : 'Mode lokal aktif. Status baca Agenda belum tersinkron ke akun.');
      node.dataset.state = mode;
    });
    document.querySelectorAll('[data-agenda-storage-copy]').forEach((node) => {
      node.textContent = mode === 'account'
        ? 'Tandai agenda sebagai sudah dibaca. Status ini tersimpan pada akun dan dapat digunakan lintas perangkat.'
        : 'Tandai agenda sebagai sudah dibaca. Status sementara tersimpan pada browser ini.';
    });
  };

  const serverToLocal = (progress) => {
    const state = readState();
    const currentKnown = known();
    source.events.forEach((event) => { state[event.id] = false; });

    (progress?.items || []).forEach((item) => {
      if (currentKnown.has(item.item_key)) state[item.item_key] = Boolean(item.read);
    });

    const queue = getQueue();
    Object.entries(queue).forEach(([id, value]) => {
      if (currentKnown.has(id)) state[id] = Boolean(value);
    });

    writeState(state);
    renderList();
    updateProgress();
  };

  const flushQueue = async () => {
    const currentKnown = known();
    const entries = Object.entries(getQueue()).filter(([id]) => currentKnown.has(id));
    for (const [id, read] of entries) {
      const data = await api(`/jamaah/progress/agenda/${encodeURIComponent(id)}`, {
        method:'PATCH',
        body:JSON.stringify({read:Boolean(read)})
      });
      const latest = getQueue();
      delete latest[id];
      saveQueue(latest);
      serverToLocal(data.progress);
    }
  };

  const initialSync = async () => {
    if (syncPromise) return syncPromise;
    syncPromise = (async () => {
      try {
        let data = await api('/jamaah/progress/agenda');
        backendActive = true;

        const local = readState();
        const completedLocal = source.events
          .filter((event) => local[event.id] === true)
          .map((event) => event.id);

        if (!data.progress?.initialized && completedLocal.length) {
          data = await api('/jamaah/progress/agenda/import', {
            method:'POST',
            body:JSON.stringify({completed:completedLocal})
          });
          setSyncCopy('account', `Status baca Agenda lokal lama berhasil dipindahkan ke akun (${data.progress?.done || 0}/${data.progress?.total || source.events.length}).`);
        } else {
          setSyncCopy('account');
        }

        serverToLocal(data.progress);
        await flushQueue();
        const fresh = await api('/jamaah/progress/agenda');
        serverToLocal(fresh.progress);
      } catch (error) {
        backendActive = false;
        setSyncCopy('local');
        renderList();
        updateProgress();
      } finally {
        syncPromise = null;
      }
    })();
    return syncPromise;
  };

  const dateAtJakarta = (date, time='00:00:00') => new Date(`${date}T${time}+07:00`);
  const eventInstant = (event) => {
    const match = String(event.time || '').match(/^(\d{2}):(\d{2})/);
    return dateAtJakarta(event.date, match ? `${match[1]}:${match[2]}:00` : '12:00:00');
  };
  const formatDate = (date) => new Intl.DateTimeFormat('id-ID',{
    day:'2-digit',month:'short',year:'numeric',timeZone:source.timezone
  }).format(dateAtJakarta(date,'12:00:00'));
  const iconClass = (name) => `icon-${name || 'calendar'}`;
  const statusClass = (status) => {
    if (status === 'Dikonfirmasi') return 'is-scheduled';
    if (status === 'Terjadwal') return 'is-scheduled';
    if (status === 'Dibatalkan') return 'is-preparation';
    if (status === 'Persiapan') return 'is-preparation';
    return 'is-plan';
  };
  const getNextEvent = () => {
    const now = Date.now();
    return source.events.find((event) => event.date && eventInstant(event).getTime() >= now) || source.events[source.events.length - 1];
  };

  const renderList = () => {
    if (!list) return;
    const state = readState();
    if (!source.events.length) {
      list.innerHTML = '<article class="agenda-item"><div class="agenda-copy"><strong>Belum ada agenda yang dipublikasikan.</strong><p>Silakan periksa kembali setelah pengelola menerbitkan jadwal.</p></div></article>';
      return;
    }

    list.innerHTML = source.events.map((event) => {
      const isRead = state[event.id] === true;
      return `
        <article class="agenda-item ${isRead ? 'is-read' : ''}" data-agenda-item="${event.id}">
          <div class="agenda-date"><strong>${event.date ? new Intl.DateTimeFormat('id-ID',{day:'2-digit',timeZone:source.timezone}).format(dateAtJakarta(event.date,'12:00:00')) : '—'}</strong><span>${event.date ? new Intl.DateTimeFormat('id-ID',{month:'short',timeZone:source.timezone}).format(dateAtJakarta(event.date,'12:00:00')).toUpperCase() : ''}</span></div>
          <div class="agenda-icon"><span aria-hidden="true" class="ui-icon ${iconClass(event.icon)}"></span></div>
          <div class="agenda-copy">
            <div class="agenda-title-line"><strong>${event.title}</strong><span class="agenda-status ${statusClass(event.status)}">${event.status}</span></div>
            <div class="agenda-meta"><span><span aria-hidden="true" class="ui-icon icon-clock"></span>${event.time}</span><span><span aria-hidden="true" class="ui-icon icon-map-pin"></span>${event.location}</span></div>
            <p>${event.note}</p>
          </div>
          <button class="agenda-read-action ${isRead ? 'is-active' : ''}" data-agenda-read type="button">${isRead ? '✓ Sudah dibaca' : 'Tandai dibaca'}</button>
        </article>`;
    }).join('');

    list.querySelectorAll('[data-agenda-read]').forEach((button) => {
      button.addEventListener('click', async () => {
        const item = button.closest('[data-agenda-item]');
        if (!item) return;
        const state = readState();
        const id = item.dataset.agendaItem;
        state[id] = state[id] !== true;
        writeState(state);

        const queue = getQueue();
        queue[id] = state[id] === true;
        saveQueue(queue);
        renderList();
        updateProgress();

        try {
          if (!backendActive) await initialSync();
          else {
            await flushQueue();
            const fresh = await api('/jamaah/progress/agenda');
            serverToLocal(fresh.progress);
          }
        } catch (_) {}
      });
    });
  };

  const updateProgress = () => {
    const state = readState();
    const count = source.events.filter((event) => state[event.id] === true).length;
    const total = source.events.length;
    const percent = total ? Math.round((count / total) * 100) : 0;
    if (progressCount) progressCount.textContent = `${count} / ${total}`;
    if (progressPercent) progressPercent.textContent = `${percent}% agenda telah dibaca`;
    if (progressBar) progressBar.style.width = `${percent}%`;
  };

  const updateNext = () => {
    const next = getNextEvent();
    if (!next) {
      if (nextTitle) nextTitle.textContent = 'Belum ada agenda';
      if (nextMeta) nextMeta.textContent = 'Menunggu publikasi pengelola';
      return;
    }
    if (nextTitle) nextTitle.textContent = next.title;
    if (nextMeta) nextMeta.textContent = `${formatDate(next.date)} · ${next.time}`;
    if (nextStatus) {
      nextStatus.textContent = next.status;
      nextStatus.className = `agenda-status ${statusClass(next.status)}`;
    }
  };

  const updateDeparture = () => {
    const departure = source.departure;
    if (!departure) {
      if (departureDate) departureDate.textContent = 'Belum dipublikasikan';
      if (departureCountdown) departureCountdown.textContent = '—';
      if (departureTime) departureTime.textContent = 'Belum dikonfirmasi';
      if (departureLocation) departureLocation.textContent = 'Belum dikonfirmasi';
      return;
    }
    const date = dateAtJakarta(departure.date,'00:00:00');
    if (departureDate) departureDate.textContent = formatDate(departure.date);
    if (departureTime) departureTime.textContent = departure.time;
    if (departureLocation) departureLocation.textContent = departure.location;
    if (departureCountdown) {
      const today = new Date();
      const todayJakarta = new Date(new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:source.timezone}).format(today) + 'T00:00:00+07:00');
      const days = Math.ceil((date.getTime() - todayJakarta.getTime()) / 86400000);
      departureCountdown.textContent = days > 1 ? `${days} hari lagi` : days === 1 ? 'Besok' : days === 0 ? 'Hari ini' : 'Tanggal telah lewat';
    }
  };

  const start = async () => {
    await loadOfficialAgenda();
    renderList();
    updateProgress();
    updateNext();
    updateDeparture();
    setSyncCopy('local');
    await initialSync();
  };

  start();
  addEventListener('pageshow', start);
  addEventListener('focus', async () => {
    await loadOfficialAgenda();
    updateNext();
    updateDeparture();
    initialSync();
  });
  addEventListener('online', initialSync);
  addEventListener('storage', (event) => {
    if ([readKey, queueKey].includes(event.key)) {
      renderList();
      updateProgress();
    }
  });
})();
