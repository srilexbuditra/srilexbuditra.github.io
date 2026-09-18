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

    const manasikDone = manasikIds.filter(id => !!manasik[id]).length;
    const checklistDone = Object.values(checklist).filter(value => checklistValid.has(value)).length;
    const documentsReady = documentIds.filter(id => documents[id] === 'ready').length;
    const agendaRead = agendaIds.filter(id => agenda[id] === true).length;

    const manasikFraction = fraction(manasikDone, manasikIds.length);
    const checklistFraction = fraction(checklistDone, 12);

    // Hanya dokumen berstatus "Sudah disiapkan" yang menambah kesiapan.
    // Status "Menunggu" tetap tercatat di modul Dokumen, tetapi belum dianggap siap.
    const documentsFraction = fraction(documentsReady, documentIds.length);
    const agendaFraction = fraction(agendaRead, agendaIds.length);

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
      },
      counts: {
        manasik: { done: manasikDone, total: manasikIds.length },
        checklist: { done: checklistDone, total: 12 },
        documents: { ready: documentsReady, total: documentIds.length },
        agenda: { done: agendaRead, total: agendaIds.length }
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
    document.querySelectorAll('[data-overall-manasik-count]').forEach(el => el.textContent = `${result.counts.manasik.done} dari ${result.counts.manasik.total} selesai`);
    document.querySelectorAll('[data-overall-checklist-count]').forEach(el => el.textContent = `${result.counts.checklist.done} dari ${result.counts.checklist.total} diperiksa`);
    document.querySelectorAll('[data-overall-documents-count]').forEach(el => el.textContent = `${result.counts.documents.ready} dari ${result.counts.documents.total} siap`);
    document.querySelectorAll('[data-overall-agenda-count]').forEach(el => el.textContent = `${result.counts.agenda.done} dari ${result.counts.agenda.total} dibaca`);

    const copy = document.querySelector('[data-overall-progress-copy]');
    if (copy) {
      copy.textContent = 'Manasik sudah tersinkron ke akun. Perhitungan total masih masa transisi karena Checklist dan Agenda belum dipindahkan ke D1.';
    }
  };

  render();
  addEventListener('pageshow', render);
  addEventListener('focus', render);
  addEventListener('umroh:manasik-progress-synced', render);
  addEventListener('storage', event => {
    if (Object.values(keys).includes(event.key)) render();
  });
})();
