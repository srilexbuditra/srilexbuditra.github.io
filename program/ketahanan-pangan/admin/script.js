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
const tableBody = document.querySelector('.table-wrap tbody');

if (tableBody) {
  tableBody.innerHTML = '';

  registrations.forEach((item) => {
    const row = document.createElement('tr');

    const wilayah = [
      item.kabupaten,
      item.provinsi
    ]
      .filter(Boolean)
      .join(', ');

    const tanggal = item.created_at
      ? new Date(item.created_at.replace(' ', 'T')).toLocaleString('id-ID')
      : '-';

    let statusLabel = item.status || '-';

    if (item.status === 'submitted') {
      statusLabel = 'Menunggu Verifikasi';
    } else if (item.status === 'verified') {
      statusLabel = 'Terverifikasi';
    } else if (item.status === 'rejected') {
      statusLabel = 'Ditolak';
    } else if (item.status === 'revision') {
      statusLabel = 'Perlu Perbaikan';
    } else if (item.status === 'needs_action') {
      statusLabel = 'Perlu Tindakan';
    }

    row.innerHTML = `
      <td>${escapeHtml(item.registration_id || '-')}</td>
      <td>${escapeHtml(item.nama || '-')}</td>
      <td>${escapeHtml(wilayah || '-')}</td>
      <td>${escapeHtml(tanggal)}</td>
      <td>${escapeHtml(statusLabel)}</td>
      <td>
        <button
  type="button"
  class="detail-button"
  data-registration-id="${escapeHtml(item.registration_id || '')}"
>
  Detail
</button>
      </td>
    `;

    tableBody.appendChild(row);
    const detailButton = row.querySelector('.detail-button');

if (detailButton) {
  detailButton.addEventListener('click', () => {
    loadRegistrationDetail(item.registration_id);
  });
}
  });

  if (registrations.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty">
            <strong>Belum ada data registrasi</strong>
          </div>
        </td>
      </tr>
    `;
  }
}
document.querySelector('main.wrap').hidden = false;
document.getElementById('loginMessage').textContent = '';
  } catch (error) {
    console.error(
      'Ketahanan Pangan Admin: gagal memuat data registrasi.',
      error
    );
  }
}
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
async function loadRegistrationDetail(registrationId) {
  try {
    const response = await fetch(
      `${API_URL}/${encodeURIComponent(registrationId)}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.ok || !data.registration) {
      throw new Error('Format detail registrasi tidak sesuai.');
    }

    alert(
      `Detail registrasi ${data.registration.registration_id} berhasil dimuat.`
    );
  } catch (error) {
    console.error(
      'Ketahanan Pangan Admin: gagal memuat detail registrasi.',
      error
    );

    alert('Detail registrasi gagal dimuat.');
  }
}
