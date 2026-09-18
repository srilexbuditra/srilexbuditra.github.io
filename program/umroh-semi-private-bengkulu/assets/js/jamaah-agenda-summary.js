(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const source = window.UmrohAgenda;
  if (!source) return;

  const formatShortDate = (date) => new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', timeZone: source.timezone
  }).format(new Date(`${date}T12:00:00+07:00`));

  const eventInstant = (event) => {
    const match = String(event.time || '').match(/^(\d{2}):(\d{2})/);
    const time = match ? `${match[1]}:${match[2]}:00` : '12:00:00';
    return new Date(`${event.date}T${time}+07:00`);
  };

  const next = source.events.find(event => eventInstant(event).getTime() >= Date.now()) || source.events[source.events.length - 1];
  const summary = document.querySelector('[data-agenda-summary]');

  const renderSummary = (done = null) => {
    if (!summary || !next) return;
    const nextText = `${formatShortDate(next.date)} · ${next.title}`;
    summary.textContent = Number.isInteger(done)
      ? `${done}/${source.events.length} dibaca · ${nextText}`
      : nextText;
  };

  renderSummary();

  const syncReadSummary = async () => {
    try {
      const response = await fetch(`${API_BASE}/jamaah/progress/agenda`, {
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) return;
      renderSummary(Number(data.progress?.done || 0));
    } catch (_) {}
  };

  const departureDate = document.querySelector('[data-departure-date]');
  const departureCountdown = document.querySelector('[data-departure-countdown]');
  const departure = source.departure;
  if (departure && departureDate) {
    departureDate.textContent = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric', timeZone: source.timezone
    }).format(new Date(`${departure.date}T12:00:00+07:00`));
  }
  if (departure && departureCountdown) {
    const nowParts = new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:source.timezone}).format(new Date());
    const today = new Date(`${nowParts}T00:00:00+07:00`);
    const target = new Date(`${departure.date}T00:00:00+07:00`);
    const days = Math.ceil((target.getTime() - today.getTime()) / 86400000);
    departureCountdown.textContent = days > 1 ? `${days} hari lagi` : days === 1 ? 'Besok' : days === 0 ? 'Hari ini' : 'Tanggal telah lewat';
  }

  syncReadSummary();
  addEventListener('focus', syncReadSummary);
  addEventListener('pageshow', syncReadSummary);
  addEventListener('umroh:agenda-progress-synced', (event) => {
    renderSummary(Number(event.detail?.done || 0));
  });
})();
