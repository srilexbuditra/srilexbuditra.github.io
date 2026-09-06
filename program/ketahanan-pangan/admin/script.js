'use strict';

const API_URL =
  'https://ketahanan-pangan-admin-api.srilexbuditra.workers.dev/registrations';

document.addEventListener('DOMContentLoaded', () => {
  loadRegistrations();
});

async function loadRegistrations() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.ok || !Array.isArray(data.registrations)) {
      throw new Error('Format respons API tidak sesuai.');
    }

    const registrations = data.registrations;

    console.info(
      'Ketahanan Pangan Admin: data registrasi berhasil dimuat.',
      registrations.length
    );

    /*
     * Tahap ini hanya menguji koneksi aman:
     * Dashboard -> Admin Worker -> D1.
     *
     * Data sensitif seperti NIK, KK, WhatsApp,
     * dan dokumen KTP/KK tidak diminta oleh halaman ini.
     */

    window.KETAHANAN_PANGAN_REGISTRATIONS = registrations;

  } catch (error) {
    console.error(
      'Ketahanan Pangan Admin: gagal memuat data registrasi.',
      error
    );
  }
}
