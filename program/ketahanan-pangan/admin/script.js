'use strict';

const API_URL =
  'https://admin-api.srilexbuditra.work/registrations';

let adminToken = '';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('adminLoginForm');
  const tokenInput = document.getElementById('adminToken');
  const loginMessage = document.getElementById('loginMessage');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    adminToken = tokenInput.value.trim();

    if (!adminToken) {
      loginMessage.textContent = 'Masukkan Admin API Token.';
      return;
    }

    loginMessage.textContent = 'Memeriksa akses...';

    await loadRegistrations();
  });
});

async function loadRegistrations() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      credentials: 'include',
      headers: {
  Accept: 'application/json',
  Authorization: `Bearer ${adminToken}`
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

const total = registrations.length;
const submitted = registrations.filter(
  item => item.status === 'submitted'
).length;

const verified = registrations.filter(
  item => item.status === 'verified'
).length;

const actionRequired = registrations.filter(
  item =>
    item.status === 'rejected' ||
    item.status === 'revision' ||
    item.status === 'needs_action'
).length;

const statCards = document.querySelectorAll('.stats article');

if (statCards[0]) {
  statCards[0].querySelector('strong').textContent = total;
}

if (statCards[1]) {
  statCards[1].querySelector('strong').textContent = submitted;
}

if (statCards[2]) {
  statCards[2].querySelector('strong').textContent = verified;
}

if (statCards[3]) {
  statCards[3].querySelector('strong').textContent = actionRequired;
}

document.getElementById('adminLogin').hidden = true;
document.querySelector('main.wrap').hidden = false;
document.getElementById('loginMessage').textContent = '';
  } catch (error) {
    console.error(
      'Ketahanan Pangan Admin: gagal memuat data registrasi.',
      error
    );
  }
}
