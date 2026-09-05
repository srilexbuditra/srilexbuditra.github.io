const API_ENDPOINT = 'https://ketahanan-pangan-registration-api.srilexbuditra.workers.dev';
const VERIFY_ENDPOINT = API_ENDPOINT + '/verify';

const form = document.getElementById('verifyForm');
const input = document.getElementById('registrationId');
const verifyBtn = document.getElementById('verifyBtn');
const message = document.getElementById('message');
const resultEmpty = document.getElementById('resultEmpty');
const resultContent = document.getElementById('resultContent');
const resultStatus = document.getElementById('resultStatus');
const resultRegistrationId = document.getElementById('resultRegistrationId');
const resultName = document.getElementById('resultName');
const resultDate = document.getElementById('resultDate');
const scanBtn = document.getElementById('scanBtn');
const scannerPanel = document.getElementById('scannerPanel');
const closeScannerBtn = document.getElementById('closeScanner');
const scannerVideo = document.getElementById('scannerVideo');
const scannerStatus = document.getElementById('scannerStatus');
const scanSupport = document.getElementById('scanSupport');
const imageScanInput = document.getElementById('imageScanInput');

let stream = null;
let detector = null;
let scanFrameId = 0;
let scanning = false;

function normalizeRegistrationId(value) {
  return String(value || '').trim().toUpperCase().replace(/\s+/g, '');
}

function extractRegistrationId(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    const fromQuery = url.searchParams.get('registration_id');
    if (fromQuery) return normalizeRegistrationId(fromQuery);
  } catch (_) {}
  const match = raw.toUpperCase().match(/KTPG-[0-9]{8}-[A-Z0-9-]+/);
  return normalizeRegistrationId(match ? match[0] : raw);
}

function setMessage(type, text) {
  message.className = 'message show ' + type;
  message.textContent = text;
}

function clearMessage() {
  message.className = 'message';
  message.textContent = '';
}

function formatDate(value) {
  if (!value) return '-';
  const safe = String(value).includes('T') ? String(value) : String(value).replace(' ', 'T') + 'Z';
  const date = new Date(safe);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(date);
}

function statusLabel(status) {
  const map = {
    submitted: 'Registrasi diterima',
    verified: 'Terverifikasi',
    approved: 'Disetujui',
    rejected: 'Tidak disetujui',
    pending: 'Dalam proses'
  };
  return map[String(status || '').toLowerCase()] || String(status || 'Terdaftar');
}

function showResult(registration) {
  resultRegistrationId.textContent = registration.registration_id || '-';
  resultName.textContent = registration.nama || '-';
  resultStatus.textContent = statusLabel(registration.status);
  resultDate.textContent = formatDate(registration.created_at);
  resultEmpty.hidden = true;
  resultContent.hidden = false;
}

function resetResult() {
  resultContent.hidden = true;
  resultEmpty.hidden = false;
}

async function verifyRegistration(registrationId, options = {}) {
  const id = normalizeRegistrationId(registrationId);
  if (!id) {
    resetResult();
    setMessage('error', 'Nomor registrasi wajib diisi.');
    input.focus();
    return;
  }

  input.value = id;
  clearMessage();
  verifyBtn.disabled = true;
  verifyBtn.textContent = 'Memeriksa…';

  try {
    const response = await fetch(VERIFY_ENDPOINT + '?registration_id=' + encodeURIComponent(id), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });

    let data = {};
    try { data = await response.json(); } catch (_) {}

    if (!response.ok || !data.ok || !data.found || !data.registration) {
      resetResult();
      if (response.status === 404 || data.found === false) {
        setMessage('error', 'Nomor registrasi tidak ditemukan. Periksa kembali nomor yang Anda masukkan.');
      } else {
        setMessage('error', data.message || 'Verifikasi belum dapat diproses. Silakan coba kembali.');
      }
      return;
    }

    showResult(data.registration);
    setMessage('info', 'Nomor registrasi ditemukan dan berhasil diverifikasi.');

    if (!options.skipUrlUpdate) {
      const url = new URL(location.href);
      url.searchParams.set('registration_id', id);
      history.replaceState(null, '', url);
    }
  } catch (_) {
    resetResult();
    setMessage('error', 'Tidak dapat terhubung ke layanan verifikasi. Periksa koneksi internet lalu coba kembali.');
  } finally {
    verifyBtn.disabled = false;
    verifyBtn.textContent = 'Verifikasi';
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  verifyRegistration(input.value);
});

input.addEventListener('input', () => {
  const start = input.selectionStart;
  input.value = input.value.toUpperCase();
  try { input.setSelectionRange(start, start); } catch (_) {}
});

async function getDetector() {
  if (!('BarcodeDetector' in window)) return null;
  if (detector) return detector;
  let formats = ['qr_code', 'code_128', 'code_39', 'ean_13', 'ean_8'];
  try {
    if (typeof BarcodeDetector.getSupportedFormats === 'function') {
      const supported = await BarcodeDetector.getSupportedFormats();
      formats = formats.filter((format) => supported.includes(format));
    }
    detector = new BarcodeDetector(formats.length ? { formats } : undefined);
    return detector;
  } catch (_) {
    return null;
  }
}

async function stopScanner() {
  scanning = false;
  if (scanFrameId) cancelAnimationFrame(scanFrameId);
  scanFrameId = 0;
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  scannerVideo.srcObject = null;
  scannerPanel.hidden = true;
}

async function scanLoop() {
  if (!scanning || !detector) return;
  if (scannerVideo.readyState >= 2) {
    try {
      const codes = await detector.detect(scannerVideo);
      if (codes && codes.length) {
        const id = extractRegistrationId(codes[0].rawValue);
        if (id) {
          scannerStatus.textContent = 'Kode ditemukan. Memeriksa registrasi…';
          await stopScanner();
          input.value = id;
          verifyRegistration(id);
          return;
        }
      }
    } catch (_) {}
  }
  scanFrameId = requestAnimationFrame(scanLoop);
}

async function startScanner() {
  clearMessage();
  const availableDetector = await getDetector();
  if (!availableDetector) {
    setMessage('error', 'Pemindaian otomatis tidak didukung browser ini. Gunakan input manual atau unggah gambar kode pada browser yang mendukung BarcodeDetector.');
    return;
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setMessage('error', 'Akses kamera tidak tersedia pada browser ini.');
    return;
  }

  try {
    scannerPanel.hidden = false;
    scannerStatus.textContent = 'Meminta izin kamera…';
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
    scannerVideo.srcObject = stream;
    await scannerVideo.play();
    scanning = true;
    scannerStatus.textContent = 'Kamera aktif. Arahkan ke QR Code / barcode.';
    scanLoop();
  } catch (_) {
    await stopScanner();
    setMessage('error', 'Kamera tidak dapat dibuka. Pastikan izin kamera diberikan, atau gunakan input manual.');
  }
}

scanBtn.addEventListener('click', startScanner);
closeScannerBtn.addEventListener('click', stopScanner);

imageScanInput.addEventListener('change', async () => {
  const file = imageScanInput.files && imageScanInput.files[0];
  if (!file) return;
  const availableDetector = await getDetector();
  if (!availableDetector) {
    setMessage('error', 'Browser ini belum mendukung pembacaan QR/barcode dari gambar. Gunakan input manual.');
    imageScanInput.value = '';
    return;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const codes = await availableDetector.detect(bitmap);
    if (typeof bitmap.close === 'function') bitmap.close();
    if (!codes.length) {
      setMessage('error', 'QR Code / barcode tidak terdeteksi pada gambar tersebut.');
      return;
    }
    const id = extractRegistrationId(codes[0].rawValue);
    if (!id) {
      setMessage('error', 'Kode terbaca, tetapi nomor registrasi tidak dikenali.');
      return;
    }
    input.value = id;
    verifyRegistration(id);
  } catch (_) {
    setMessage('error', 'Gambar tidak dapat dipindai. Coba gambar yang lebih jelas atau masukkan nomor secara manual.');
  } finally {
    imageScanInput.value = '';
  }
});

window.addEventListener('pagehide', stopScanner);

(async function init() {
  const canScan = Boolean(await getDetector());
  if (!canScan) {
    scanSupport.textContent = 'Browser ini belum mendukung scanner otomatis. Verifikasi manual tetap dapat digunakan.';
  }
  const params = new URLSearchParams(location.search);
  const id = extractRegistrationId(params.get('registration_id'));
  if (id) {
    input.value = id;
    verifyRegistration(id, { skipUrlUpdate: true });
  }
})();
