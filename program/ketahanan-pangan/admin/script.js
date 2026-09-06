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

    const registration = data.registration;

    const detailPanel =
      document.getElementById('registrationDetailPanel');

    const detailContent =
      document.getElementById('registrationDetailContent');

    const tanggalRegistrasi = registration.created_at
      ? new Date(
          registration.created_at.replace(' ', 'T')
        ).toLocaleString('id-ID')
      : '-';

    let statusLabel = registration.status || '-';

    if (registration.status === 'submitted') {
      statusLabel = 'Menunggu Verifikasi';
    } else if (registration.status === 'verified') {
      statusLabel = 'Terverifikasi';
    } else if (registration.status === 'rejected') {
      statusLabel = 'Ditolak';
    } else if (registration.status === 'revision') {
      statusLabel = 'Perlu Perbaikan';
    } else if (registration.status === 'needs_action') {
      statusLabel = 'Perlu Tindakan';
    }

    detailContent.innerHTML = `
      <div class="detail-table-wrapper">
        <table class="detail-table">
          <tbody>
            <tr>
              <th>Nomor Registrasi</th>
              <td>${escapeHtml(registration.registration_id || '-')}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>${escapeHtml(statusLabel)}</td>
            </tr>
            <tr>
              <th>Nama Lengkap</th>
              <td>${escapeHtml(registration.nama || '-')}</td>
            </tr>
            <tr>
              <th>NIK</th>
              <td>${escapeHtml(registration.nik || '-')}</td>
            </tr>
            <tr>
              <th>Nomor KK</th>
              <td>${escapeHtml(registration.nomor_kk || '-')}</td>
            </tr>
            <tr>
              <th>WhatsApp</th>
              <td>${escapeHtml(registration.whatsapp || '-')}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>${escapeHtml(registration.email || '-')}</td>
            </tr>
            <tr>
              <th>Provinsi</th>
              <td>${escapeHtml(registration.provinsi || '-')}</td>
            </tr>
            <tr>
              <th>Kabupaten / Kota</th>
              <td>${escapeHtml(registration.kabupaten || '-')}</td>
            </tr>
            <tr>
              <th>Kecamatan</th>
              <td>${escapeHtml(registration.kecamatan || '-')}</td>
            </tr>
            <tr>
              <th>Desa / Kelurahan</th>
              <td>${escapeHtml(registration.desa || '-')}</td>
            </tr>
            <tr>
              <th>Alamat</th>
              <td>${escapeHtml(registration.alamat || '-')}</td>
            </tr>
            <tr>
              <th>Status Pemohon</th>
              <td>${escapeHtml(registration.status_pemohon || '-')}</td>
            </tr>
            <tr>
              <th>Kelompok Tani</th>
              <td>${escapeHtml(registration.kelompok_tani || '-')}</td>
            </tr>
            <tr>
              <th>Luas Lahan</th>
              <td>${escapeHtml(registration.luas_lahan || '-')}</td>
            </tr>
            <tr>
              <th>Status Lahan</th>
              <td>${escapeHtml(registration.status_lahan || '-')}</td>
            </tr>
            <tr>
              <th>Komoditas</th>
              <td>${escapeHtml(registration.komoditas || '-')}</td>
            </tr>
            <tr>
              <th>Tahap</th>
              <td>${escapeHtml(registration.tahap || '-')}</td>
            </tr>
            <tr>
              <th>Jenis Pupuk</th>
              <td>${escapeHtml(registration.jenis_pupuk || '-')}</td>
            </tr>
            <tr>
              <th>Kebutuhan Pupuk</th>
              <td>${escapeHtml(registration.kebutuhan_kg || '-')} kg</td>
            </tr>
            <tr>
              <th>Keterangan</th>
              <td>${escapeHtml(registration.keterangan || '-')}</td>
            </tr>
            <tr>
              <th>Tanggal Registrasi</th>
              <td>${escapeHtml(tanggalRegistrasi)}</td>
            </tr>
            <tr class="document-row">
              <th>Dokumen Identitas</th>
              <td>
                <div class="document-actions">
                  <button
                    type="button"
                    class="document-button"
                    data-document="ktp"
                  >
                    Download KTP (NIK)
                  </button>
                  <button
                    type="button"
                    class="document-button"
                    data-document="kk"
                  >
                    Download Kartu Keluarga (KK)
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    detailContent
      .querySelectorAll('.document-button')
      .forEach((button) => {
        button.addEventListener('click', async () => {
          const originalText = button.textContent;

          button.disabled = true;
          button.textContent = 'Mengunduh...';

          try {
            await downloadRegistrationDocument(
              registration.registration_id,
              button.dataset.document
            );
          } finally {
            button.disabled = false;
            button.textContent = originalText;
          }
        });
      });

    detailPanel.hidden = false;

    detailPanel.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  } catch (error) {
    console.error(
      'Ketahanan Pangan Admin: gagal memuat detail registrasi.',
      error
    );

    alert('Detail registrasi gagal dimuat.');
  }
}

async function downloadRegistrationDocument(
  registrationId,
  documentType
) {
  if (!adminToken) {
    alert('Admin API Token tidak tersedia. Silakan login ulang.');
    return;
  }

  if (!['ktp', 'kk'].includes(documentType)) {
    alert('Jenis dokumen tidak valid.');
    return;
  }

  try {
    const baseUrl =
      API_URL.replace(/\/registrations\/?$/, '');

    const response = await fetch(
      `${baseUrl}/documents/${encodeURIComponent(registrationId)}/${encodeURIComponent(documentType)}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${adminToken}`
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      let message = `Gagal mengunduh dokumen (HTTP ${response.status}).`;

      try {
        const data = await response.json();

        if (data && data.message) {
          message = data.message;
        }
      } catch (_) {}

      throw new Error(message);
    }

    const blob = await response.blob();

    if (!blob || blob.size === 0) {
      throw new Error('File dokumen kosong.');
    }

    const contentType =
      (response.headers.get('Content-Type') || '').toLowerCase();

    let extension = '';

    if (contentType.includes('image/jpeg')) {
      extension = '.jpg';
    } else if (contentType.includes('image/png')) {
      extension = '.png';
    } else if (contentType.includes('image/webp')) {
      extension = '.webp';
    } else if (contentType.includes('application/pdf')) {
      extension = '.pdf';
    }

    const documentLabel =
      documentType === 'ktp' ? 'KTP' : 'KK';

    const safeRegistrationId =
      String(registrationId).replace(/[^a-zA-Z0-9_-]/g, '_');

    const fileName =
      `${documentLabel}-${safeRegistrationId}${extension}`;

    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);
  } catch (error) {
    console.error(
      'Ketahanan Pangan Admin: gagal mengunduh dokumen.',
      error
    );

    alert(
      error.message ||
      'Gagal mengunduh dokumen.'
    );
  }
}

const closeDetailButton =
  document.getElementById('closeDetailButton');

if (closeDetailButton) {
  closeDetailButton.addEventListener('click', () => {
    const detailPanel =
      document.getElementById('registrationDetailPanel');

    const detailContent =
      document.getElementById('registrationDetailContent');

    detailPanel.hidden = true;

    detailContent.innerHTML =
      '<p>Memuat detail registrasi...</p>';
  });
}
