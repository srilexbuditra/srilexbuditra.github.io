(() => {
  const agenda = {
    version: 'v1',
    simulation: true,
    timezone: 'Asia/Jakarta',
    departure: {
      date: '2026-09-30',
      label: 'Rencana Keberangkatan',
      time: 'Belum dikonfirmasi',
      location: 'Titik kumpul belum dikonfirmasi',
      status: 'Rencana'
    },
    events: [
      {
        id: 'manasik-tata-cara',
        date: '2026-09-20',
        time: '09:00–12:00 WIB',
        title: 'Manasik — Tata Cara Umroh',
        category: 'Manasik',
        location: 'Bengkulu · lokasi simulasi',
        note: 'Ikuti arahan Pembimbing Manasik. Jadwal dan lokasi resmi akan menggantikan data simulasi ini setelah dikonfirmasi.',
        status: 'Terjadwal',
        icon: 'book'
      },
      {
        id: 'pemeriksaan-dokumen',
        date: '2026-09-24',
        time: '09:30–11:30 WIB',
        title: 'Pemeriksaan Dokumen Perjalanan',
        category: 'Dokumen',
        location: 'Sekretariat · lokasi simulasi',
        note: 'Siapkan paspor, identitas, dan dokumen perjalanan sesuai arahan resmi pengelola.',
        status: 'Persiapan',
        icon: 'file'
      },
      {
        id: 'briefing-keberangkatan',
        date: '2026-09-29',
        time: '19:30 WIB',
        title: 'Briefing Keberangkatan',
        category: 'Perjalanan',
        location: 'Lokasi menyusul',
        note: 'Konfirmasi akhir rombongan, titik kumpul, bagasi, dan arahan perjalanan dilakukan pada briefing.',
        status: 'Rencana',
        icon: 'megaphone'
      },
      {
        id: 'keberangkatan',
        date: '2026-09-30',
        time: 'Waktu belum dikonfirmasi',
        title: 'Rencana Keberangkatan',
        category: 'Perjalanan',
        location: 'Titik kumpul belum dikonfirmasi',
        note: 'Datang ke titik kumpul tepat waktu dan ikuti arahan Tour Leader. Data ini masih simulasi sampai jadwal resmi dipublikasikan.',
        status: 'Rencana',
        icon: 'plane'
      }
    ]
  };

  window.UmrohAgenda = agenda;
})();
