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
            <tr class="verification-row">
              <th>Tindakan Verifikasi</th>
              <td>
                <div class="verification-actions">
                  <button type="button" class="status-button status-verified" data-status="verified">
                    Verifikasi
                  </button>
                  <button type="button" class="status-button status-revision" data-status="revision">
                    Minta Perbaikan
                  </button>
                  <button type="button" class="status-button status-rejected" data-status="rejected">
                    Tolak
                  </button>
                </div>
              </td>
            </tr>
            ${registration.status === 'verified' ? `
            <tr class="certificate-row">
              <th>Kartu / Sertifikat</th>
              <td>
                <button type="button" class="certificate-button" id="issueCertificateButton">
                  Terbitkan Kartu / Sertifikat
                </button>
              </td>
            </tr>
            ` : ''}
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

    detailContent
      .querySelectorAll('.status-button')
      .forEach((button) => {
        button.addEventListener('click', async () => {
          const newStatus = button.dataset.status;
          const labels = {
            verified: 'Verifikasi',
            revision: 'Minta Perbaikan',
            rejected: 'Tolak'
          };

          const confirmed = window.confirm(
            `${labels[newStatus] || 'Ubah status'} registrasi ${registration.registration_id}?`
          );

          if (!confirmed) return;

          await updateRegistrationStatus(
            registration.registration_id,
            newStatus
          );
        });
      });

    const issueCertificateButton =
      detailContent.querySelector('#issueCertificateButton');

    if (issueCertificateButton) {
      issueCertificateButton.addEventListener('click', async () => {
        await loadCertificate(registration.registration_id);
      });
    }

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

async function loadCertificate(registrationId) {
  if (!adminToken) {
    alert('Admin API Token tidak tersedia. Silakan login ulang.');
    return;
  }

  try {
    const baseUrl = API_URL.replace(/\/registrations\/?$/, '');
    const response = await fetch(
      `${baseUrl}/certificates/${encodeURIComponent(registrationId)}`,
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

    let data = null;
    try { data = await response.json(); } catch (_) {}

    if (!response.ok || !data?.ok || !data?.certificate) {
      throw new Error(data?.message || `Gagal menyiapkan sertifikat (HTTP ${response.status}).`);
    }

    renderCertificate(data.certificate);
  } catch (error) {
    console.error('Ketahanan Pangan Admin: gagal menyiapkan sertifikat.', error);
    alert(error.message || 'Gagal menyiapkan kartu / sertifikat.');
  }
}

function renderCertificate(certificate) {
  const panel = document.getElementById('certificatePanel');
  const content = document.getElementById('certificateContent');
  if (!panel || !content) return;

  const wilayah = [certificate.kabupaten, certificate.provinsi]
    .filter(Boolean).join(', ') || '-';

  content.innerHTML = `
    <article class="certificate-card" id="printableCertificate">
      <div class="certificate-brand">
        <span>PROGRAM KETAHANAN PANGAN</span>
        <strong>PT Super Tani Indonesia</strong>
        <small>Didukung AY Group Agro Indonesia</small>
      </div>
      <div class="certificate-title">
        <span>KARTU / SERTIFIKAT DIGITAL</span>
        <h3>Anggota Terverifikasi</h3>
      </div>
      <div class="certificate-name">${escapeHtml(certificate.nama || '-')}</div>
      <dl class="certificate-data">
        <div><dt>ID Sertifikat</dt><dd>${escapeHtml(certificate.certificate_id || '-')}</dd></div>
        <div><dt>Nomor Registrasi</dt><dd>${escapeHtml(certificate.registration_id || '-')}</dd></div>
        <div><dt>Wilayah</dt><dd>${escapeHtml(wilayah)}</dd></div>
        <div><dt>Status</dt><dd>Terverifikasi</dd></div>
      </dl>
      <div class="certificate-verification">
        <div class="certificate-qr-wrap">
          <canvas id="certificateQrCanvas" class="certificate-qr" width="240" height="240"
            aria-label="QR Code verifikasi sertifikat"></canvas>
          <span>SCAN UNTUK VERIFIKASI</span>
        </div>
        <div class="certificate-verification-copy">
          <strong>Verifikasi Keaslian</strong>
          <p>Pindai QR Code untuk membuka halaman verifikasi resmi. QR hanya memuat tautan verifikasi dan nomor registrasi, bukan NIK, KK, WhatsApp, atau dokumen identitas.</p>
          <a href="${escapeHtml(certificate.verification_url || '#')}" target="_blank" rel="noopener noreferrer">
            Buka halaman verifikasi
          </a>
        </div>
      </div>
      <div class="certificate-footer">
        <small>Dokumen digital administrasi Program Ketahanan Pangan.</small>
        <small>Technology & System Development · Srilex Buditra</small>
      </div>
    </article>`;

  const qrCanvas = document.getElementById('certificateQrCanvas');
  if (qrCanvas && certificate.verification_url) {
    renderCertificateQrCode(qrCanvas, certificate.verification_url);
  }

  panel.hidden = false;
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderCertificateQrCode(canvas, value) {
  if (!canvas || !value || typeof window.LocalQRCode !== 'function') {
    console.error('Ketahanan Pangan Admin: generator QR lokal tidak tersedia.');
    return;
  }

  try {
    const qr = new window.LocalQRCode(0, 2);
    qr.addData(value);
    qr.make();

    const moduleCount = qr.getModuleCount();
    const quietZone = 4;
    const targetSize = 240;
    const cellSize = Math.floor(targetSize / (moduleCount + quietZone * 2));
    const actualSize = cellSize * (moduleCount + quietZone * 2);

    canvas.width = actualSize;
    canvas.height = actualSize;

    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, actualSize, actualSize);
    context.fillStyle = '#000000';

    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        if (!qr.isDark(row, col)) continue;
        context.fillRect(
          (col + quietZone) * cellSize,
          (row + quietZone) * cellSize,
          cellSize,
          cellSize
        );
      }
    }
  } catch (error) {
    console.error('Ketahanan Pangan Admin: gagal membuat QR Code.', error);
  }
}

function printCertificate() {
  if (!document.getElementById('printableCertificate')) {
    alert('Sertifikat belum tersedia.');
    return;
  }
  document.body.classList.add('certificate-print-mode');
  window.print();
  window.setTimeout(() => document.body.classList.remove('certificate-print-mode'), 300);
}

async function updateRegistrationStatus(
  registrationId,
  newStatus
) {
  if (!adminToken) {
    alert('Admin API Token tidak tersedia. Silakan login ulang.');
    return;
  }

  if (!['verified', 'revision', 'rejected'].includes(newStatus)) {
    alert('Status yang dipilih tidak valid.');
    return;
  }

  try {
    const baseUrl =
      API_URL.replace(/\/registrations\/?$/, '');

    const response = await fetch(
      `${baseUrl}/registrations/${encodeURIComponent(registrationId)}/status`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: newStatus
        }),
        cache: 'no-store'
      }
    );

    let data = null;

    try {
      data = await response.json();
    } catch (_) {}

    if (!response.ok || !data?.ok) {
      throw new Error(
        data?.message ||
        `Gagal memperbarui status (HTTP ${response.status}).`
      );
    }

    const statusLabels = {
      verified: 'Terverifikasi',
      revision: 'Perlu Perbaikan',
      rejected: 'Ditolak'
    };

    alert(
      `Status registrasi berhasil diubah menjadi: ${statusLabels[newStatus] || newStatus}.`
    );

    await loadRegistrations();
    await loadRegistrationDetail(registrationId);
  } catch (error) {
    console.error(
      'Ketahanan Pangan Admin: gagal memperbarui status.',
      error
    );

    alert(
      error.message ||
      'Gagal memperbarui status registrasi.'
    );
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


const closeCertificateButton = document.getElementById('closeCertificateButton');
if (closeCertificateButton) {
  closeCertificateButton.addEventListener('click', () => {
    const panel = document.getElementById('certificatePanel');
    if (panel) panel.hidden = true;
  });
}

const printCertificateButton = document.getElementById('printCertificateButton');
if (printCertificateButton) {
  printCertificateButton.addEventListener('click', printCertificate);
}
