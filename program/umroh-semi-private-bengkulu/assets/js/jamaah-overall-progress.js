(() => {
  const keys = {
    manasik: 'umroh-manasik-progress-v1',
    checklist: 'umroh-checklist-progress-v1',
    documents: 'umroh-documents-status-v1',
    agenda: 'umroh-agenda-read-v1'
  };

  const weights = {
    manasik: 35,
    checklist: 35,
    documents: 20,
    agenda: 10
  };

  const manasikIds = [
    'persiapan','ihram-miqat','talbiyah','tata-cara-umroh','thawaf','sai',
    'tahallul','larangan-ihram','adab-tanah-suci','ziarah-madinah','tips-perjalanan'
  ];
  const checklistValid = new Set(['ready','na']);
  const documentIds = ['paspor-dokumen','tiket-itinerary','identitas-jemaah','dokumen-kesehatan'];
  const agendaIds = ['manasik-tata-cara','pemeriksaan-dokumen','briefing-keberangkatan','keberangkatan'];

  const readObject = key => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (_) {
      return {};
    }
  };

  const fraction = (done, total) => total > 0 ? Math.max(0, Math.min(1, done / total)) : 0;
  const pct = value => Math.round(value * 100);

  const calculate = () => {
    const manasik = readObject(keys.manasik);
    const checklist = readObject(keys.checklist);
    const documents = readObject(keys.documents);
    const agenda = readObject(keys.agenda);

    const manasikFraction = fraction(manasikIds.filter(id => !!manasik[id]).length, manasikIds.length);
    const checklistFraction = fraction(Object.values(checklist).filter(value => checklistValid.has(value)).length, 12);

    // Hanya dokumen berstatus "Sudah disiapkan" yang menambah kesiapan.
    // Status "Menunggu" tetap tercatat di modul Dokumen, tetapi belum dianggap siap.
    const documentsFraction = fraction(documentIds.filter(id => documents[id] === 'ready').length, documentIds.length);
    const agendaFraction = fraction(agendaIds.filter(id => agenda[id] === true).length, agendaIds.length);

    const weighted =
      manasikFraction * weights.manasik +
      checklistFraction * weights.checklist +
      documentsFraction * weights.documents +
      agendaFraction * weights.agenda;

    return {
      total: Math.round(weighted),
      parts: {
        manasik: pct(manasikFraction),
        checklist: pct(checklistFraction),
        documents: pct(documentsFraction),
        agenda: pct(agendaFraction)
      }
    };
  };

  const render = () => {
    const result = calculate();
    document.querySelectorAll('[data-overall-progress-percent]').forEach(el => {
      el.textContent = `${result.total}%`;
    });
    document.querySelectorAll('[data-overall-progress-bar]').forEach(el => {
      el.style.width = `${result.total}%`;
    });
    document.querySelectorAll('[data-overall-manasik]').forEach(el => el.textContent = `${result.parts.manasik}%`);
    document.querySelectorAll('[data-overall-checklist]').forEach(el => el.textContent = `${result.parts.checklist}%`);
    document.querySelectorAll('[data-overall-documents]').forEach(el => el.textContent = `${result.parts.documents}%`);
    document.querySelectorAll('[data-overall-agenda]').forEach(el => el.textContent = `${result.parts.agenda}%`);

    const copy = document.querySelector('[data-overall-progress-copy]');
    if (copy) {
      copy.textContent = 'Bobot: Manasik 35% · Checklist 35% · Dokumen siap 20% · Agenda dibaca 10%. Progress tersimpan lokal di browser dan belum terhubung ke akun jemaah.';
    }
  };

  render();
  addEventListener('pageshow', render);
  addEventListener('focus', render);
  addEventListener('storage', event => {
    if (Object.values(keys).includes(event.key)) render();
  });
})();
