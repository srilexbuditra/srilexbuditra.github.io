const API_ENDPOINT =
  'https://ketahanan-pangan-registration-api.srilexbuditra.workers.dev';
const CERTIFICATE_ENDPOINT = API_ENDPOINT + '/certificate';

const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const certificateArea = document.getElementById('certificateArea');
const printButton = document.getElementById('printCertificateButton');
const backLink = document.getElementById('backLink');

function normalizeRegistrationId(value) {
  return String(value || '').trim().toUpperCase().replace(/\s+/g, '');
}

function escapeText(value) {
  return String(value ?? '');
}

function formatCertificateDate(value) {
  if (!value) return '-';
  const raw = String(value);
  const safe = raw.includes('T') ? raw : raw.replace(' ', 'T') + 'Z';
  const date = new Date(safe);
  if (Number.isNaN(date.getTime())) return raw;

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function showError(message) {
  loadingState.hidden = true;
  certificateArea.hidden = true;
  errorMessage.textContent = message ||
    'Sertifikat belum tersedia untuk nomor registrasi ini.';
  errorState.hidden = false;
}

function renderQrCode(canvas, value) {
  if (!canvas || !value || typeof window.LocalQRCode !== 'function') {
    throw new Error('Generator QR lokal tidak tersedia.');
  }

  const qr = new window.LocalQRCode(0, 2);
  qr.addData(value);
  qr.make();

  const moduleCount = qr.getModuleCount();
  const quietZone = 4;
  const targetSize = 240;
  const cellSize = Math.floor(
    targetSize / (moduleCount + quietZone * 2)
  );
  const actualSize =
    cellSize * (moduleCount + quietZone * 2);

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
}

function fitText(el, minSize, startSize) {
  if (!el) return;
  let size = startSize;
  el.style.fontSize = size + 'px';
  while (el.scrollWidth > el.clientWidth && size > minSize) {
    size -= 0.5;
    el.style.fontSize = size + 'px';
  }
}

function renderCertificate(certificate) {
  const wilayah = [certificate.kabupaten, certificate.provinsi]
    .filter(Boolean)
    .join(', ') || '-';

  const name = document.querySelector('.cert-master-name');
  const certId = document.querySelector('.cert-master-id');
  const regId = document.querySelector('.cert-master-reg');
  const region = document.querySelector('.cert-master-region');
  const date = document.querySelector('.cert-master-date');
  const qrCanvas = document.getElementById('certificateQrCanvas');

  name.textContent = escapeText(certificate.nama || '-');
  certId.textContent = escapeText(certificate.certificate_id || '-');
  regId.textContent = escapeText(certificate.registration_id || '-');
  region.textContent = escapeText(wilayah);
  date.textContent = formatCertificateDate(
    certificate.issued_at || certificate.created_at
  );

  renderQrCode(qrCanvas, certificate.verification_url);

  requestAnimationFrame(() => {
    fitText(name, 19, 38);
    fitText(certId, 9, parseFloat(getComputedStyle(certId).fontSize) || 16);
    fitText(regId, 9, parseFloat(getComputedStyle(regId).fontSize) || 16);
  });

  loadingState.hidden = true;
  errorState.hidden = true;
  certificateArea.hidden = false;
}

async function loadCertificate() {
  const params = new URLSearchParams(location.search);
  const registrationId =
    normalizeRegistrationId(params.get('registration_id'));

  if (!registrationId) {
    showError('Nomor registrasi belum diberikan.');
    return;
  }

  backLink.href =
    '../?registration_id=' + encodeURIComponent(registrationId);

  try {
    const response = await fetch(
      CERTIFICATE_ENDPOINT +
        '?registration_id=' +
        encodeURIComponent(registrationId),
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      }
    );

    let data = {};
    try { data = await response.json(); } catch (_) {}

    if (response.status === 403) {
      showError(
        data.message ||
        'Sertifikat belum tersedia karena peserta belum terverifikasi.'
      );
      return;
    }

    if (!response.ok || !data.ok || !data.eligible || !data.certificate) {
      showError(
        data.message ||
        'Sertifikat tidak ditemukan atau belum dapat diterbitkan.'
      );
      return;
    }

    renderCertificate(data.certificate);

    // GA4: certificate_view hanya dikirim setelah API sertifikat berhasil,
    // peserta eligible, dan sertifikat benar-benar berhasil dirender.
    const sendCertificateView = (attempt = 0) => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'certificate_view', {
          event_category: 'ketahanan_pangan',
          event_label: 'Kartu / Sertifikat Dibuka',
          transport_type: 'beacon'
        });
        return;
      }
      if (attempt < 10) {
        window.setTimeout(() => sendCertificateView(attempt + 1), 200);
      }
    };
    sendCertificateView();
  } catch (_) {
    showError(
      'Tidak dapat terhubung ke layanan sertifikat. Periksa koneksi internet lalu coba kembali.'
    );
  }
}

async function printCertificate() {
  const printable = document.getElementById('printableCertificate');
  if (!printable) return;

  // GA4: tombol Cetak / Simpan PDF sudah ditekan dan area sertifikat tersedia.
  const sendCertificatePrintStart = (attempt = 0) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'certificate_print_start', {
        event_category: 'ketahanan_pangan',
        event_label: 'Cetak / Simpan PDF Dimulai',
        transport_type: 'beacon'
      });
      return;
    }
    if (attempt < 10) {
      window.setTimeout(() => sendCertificatePrintStart(attempt + 1), 200);
    }
  };
  sendCertificatePrintStart();

  const printRoot = document.createElement('div');
  printRoot.id = 'certificatePrintRoot';
  printRoot.className = 'certificate-print-root';

  const clonedCertificate = printable.cloneNode(true);

  const sourceQr =
    printable.querySelector('#certificateQrCanvas');
  const clonedQr =
    clonedCertificate.querySelector('#certificateQrCanvas');

  if (sourceQr && clonedQr) {
    clonedQr.width = sourceQr.width;
    clonedQr.height = sourceQr.height;
    const clonedContext = clonedQr.getContext('2d');
    clonedContext.drawImage(sourceQr, 0, 0);
  }

  clonedCertificate.removeAttribute('id');
  clonedCertificate.classList.add('certificate-card-print');

  printRoot.appendChild(clonedCertificate);
  document.body.appendChild(printRoot);
  document.body.classList.add('certificate-print-mode');

  const images =
    Array.from(clonedCertificate.querySelectorAll('img'));

  await Promise.all(
    images.map(async (image) => {
      try {
        if (image.decode) await image.decode();
      } catch (_) {}
    })
  );

  const cleanup = () => {
    document.body.classList.remove('certificate-print-mode');
    printRoot.remove();
    window.removeEventListener('afterprint', cleanup);
  };

  window.addEventListener('afterprint', cleanup);
  window.print();

  window.setTimeout(() => {
    if (document.body.contains(printRoot)) cleanup();
  }, 1500);
}

printButton.addEventListener('click', printCertificate);
loadCertificate();
