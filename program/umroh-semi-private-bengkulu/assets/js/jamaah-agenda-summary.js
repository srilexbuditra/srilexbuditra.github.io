(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const fallback = window.UmrohAgenda;
  if (!fallback) return;

  const summary = document.querySelector('[data-agenda-summary]');
  const departureDate = document.querySelector('[data-departure-date]');
  const departureCountdown = document.querySelector('[data-departure-countdown]');

  const fmtShort = (iso) => new Intl.DateTimeFormat('id-ID',{
    day:'2-digit',month:'short',timeZone:'Asia/Jakarta'
  }).format(new Date(iso));

  const load = async () => {
    let events = [];
    try {
      const response = await fetch(`${API_BASE}/jamaah/agenda`, {
        credentials:'include',cache:'no-store',headers:{Accept:'application/json'}
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data?.ok) events = data.events || [];
    } catch (_) {}

    const now = Date.now();
    const officialNext = events.find((event) =>
      event.starts_at && Date.parse(event.starts_at) >= now && event.event_status !== 'cancelled'
    ) || events.find((event) => event.event_status !== 'cancelled');

    let readDone = null;
    let readTotal = null;
    try {
      const response = await fetch(`${API_BASE}/jamaah/progress/agenda`, {
        credentials:'include',cache:'no-store',headers:{Accept:'application/json'}
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data?.ok) {
        readDone = Number(data.progress?.done || 0);
        readTotal = Number(data.progress?.total || 0);
      }
    } catch (_) {}

    if (summary) {
      if (officialNext) {
        summary.textContent = `${Number.isInteger(readDone) ? `${readDone}/${readTotal} dibaca · ` : ''}${fmtShort(officialNext.starts_at)} · ${officialNext.title}`;
      } else {
        const nextFallback = fallback.events?.[0];
        summary.textContent = nextFallback
          ? `${Number.isInteger(readDone) ? `${readDone}/${readTotal} dibaca · ` : ''}${nextFallback.date.slice(8,10)} Sep · ${nextFallback.title}`
          : 'Belum ada agenda';
      }
    }

    const departure = events.find((event) =>
      String(event.category || '').toLowerCase().includes('keberangkatan') ||
      String(event.title || '').toLowerCase().includes('keberangkatan')
    );

    if (departure?.starts_at) {
      if (departureDate) {
        departureDate.textContent = new Intl.DateTimeFormat('id-ID',{
          day:'2-digit',month:'long',year:'numeric',timeZone:'Asia/Jakarta'
        }).format(new Date(departure.starts_at));
      }
      if (departureCountdown) {
        const target = new Date(departure.starts_at);
        const todayParts = new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Asia/Jakarta'}).format(new Date());
        const today = new Date(`${todayParts}T00:00:00+07:00`);
        const targetParts = new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Asia/Jakarta'}).format(target);
        const targetDay = new Date(`${targetParts}T00:00:00+07:00`);
        const days = Math.ceil((targetDay.getTime()-today.getTime())/86400000);
        departureCountdown.textContent = days > 1 ? `${days} hari lagi` : days === 1 ? 'Besok' : days === 0 ? 'Hari ini' : 'Tanggal telah lewat';
      }
    }
  };

  load();
  addEventListener('pageshow', load);
  addEventListener('focus', load);
})();
