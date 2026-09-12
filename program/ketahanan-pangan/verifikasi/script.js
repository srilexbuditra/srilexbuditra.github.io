const API_ENDPOINT = 'https://ketahanan-pangan-registration-api.srilexbuditra.workers.dev';
const VERIFY_ENDPOINT = API_ENDPOINT + '/verify';
const CERTIFICATE_ENDPOINT = API_ENDPOINT + '/certificate';

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
const cameraImageInput = document.getElementById('cameraImageInput');
const cameraRecovery = document.getElementById('cameraRecovery');
const retryCameraBtn = document.getElementById('retryCameraBtn');
const manualFocusBtn = document.getElementById('manualFocusBtn');
const certificateAccess = document.getElementById('certificateAccess');
const certificateLink = document.getElementById('certificateLink');


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

function hideCertificateAccess() {
  if (certificateAccess) certificateAccess.hidden = true;
  if (certificateLink) certificateLink.removeAttribute('href');
}

async function prepareCertificateAccess(registration) {
  hideCertificateAccess();

  if (String(registration?.status || '').toLowerCase() !== 'verified') {
    return;
  }

  const id = normalizeRegistrationId(registration.registration_id);
  if (!id) return;

  try {
    const response = await fetch(
      CERTIFICATE_ENDPOINT + '?registration_id=' + encodeURIComponent(id),
      {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      }
    );

    let data = {};
    try { data = await response.json(); } catch (_) {}

    if (!response.ok || !data.ok || !data.eligible || !data.certificate) {
      return;
    }

    if (certificateLink) {
      certificateLink.href =
        './sertifikat/?registration_id=' + encodeURIComponent(id);
    }
    if (certificateAccess) certificateAccess.hidden = false;
  } catch (_) {
    // Status verifikasi tetap dapat ditampilkan meskipun layanan sertifikat
    // sedang tidak tersedia. Tombol sertifikat cukup disembunyikan.
  }
}

function showResult(registration) {
  resultRegistrationId.textContent = registration.registration_id || '-';
  resultName.textContent = registration.nama || '-';
  resultStatus.textContent = statusLabel(registration.status);
  resultDate.textContent = formatDate(registration.created_at);
  resultEmpty.hidden = true;
  resultContent.hidden = false;
  prepareCertificateAccess(registration);
}

function resetResult() {
  hideCertificateAccess();
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

    // GA4: cek status dinyatakan berhasil hanya setelah API verifikasi
    // menemukan registrasi dan hasil berhasil ditampilkan.
    const sendStatusCheckSuccess = (attempt = 0) => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'status_check_success', {
          event_category: 'ketahanan_pangan',
          event_label: 'Cek Status Berhasil',
          transport_type: 'beacon'
        });
        return;
      }
      if (attempt < 10) {
        window.setTimeout(() => sendStatusCheckSuccess(attempt + 1), 200);
      }
    };
    sendStatusCheckSuccess();

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

function setCameraRecovery(show) {
  if (cameraRecovery) cameraRecovery.hidden = !show;
}

function getCameraErrorMessage(error) {
  const name = String(error && error.name || '');
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return 'Izin kamera belum diberikan atau diblokir. Izinkan Kamera untuk situs ini lalu tekan “Coba kamera lagi”. Jika halaman dibuka dari browser dalam aplikasi, coba buka tautan di Chrome. Anda juga dapat memakai “Ambil foto kode”.';
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'Kamera tidak ditemukan pada perangkat ini. Gunakan “Ambil foto kode”, unggah gambar kode, atau masukkan nomor registrasi secara manual.';
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'Kamera sedang tidak dapat digunakan, kemungkinan sedang dipakai aplikasi lain. Tutup aplikasi kamera/video lain lalu tekan “Coba kamera lagi”.';
  }
  if (name === 'SecurityError') {
    return 'Browser memblokir akses kamera untuk halaman ini. Pastikan halaman dibuka melalui HTTPS dan, bila perlu, buka langsung di Chrome.';
  }
  if (name === 'OverconstrainedError' || name === 'ConstraintNotSatisfiedError') {
    return 'Pengaturan kamera perangkat tidak kompatibel. Sistem sudah mencoba mode kamera alternatif; gunakan “Ambil foto kode” atau input manual bila kamera tetap tidak terbuka.';
  }
  return 'Kamera belum dapat dibuka pada browser ini. Tekan “Coba kamera lagi”, gunakan “Ambil foto kode”, atau masukkan nomor registrasi secara manual.';
}

async function requestCameraStream() {
  const candidates = [
    { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
    { video: { facingMode: 'environment' }, audio: false },
    { video: true, audio: false }
  ];

  let lastError = null;
  for (const constraints of candidates) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      lastError = error;
      const name = String(error && error.name || '');
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError') {
        throw error;
      }
    }
  }
  throw lastError || new Error('Camera unavailable');
}

async function startScanner() {
  clearMessage();
  setCameraRecovery(false);

  if (!window.isSecureContext) {
    setMessage('error', 'Kamera browser hanya dapat digunakan pada koneksi aman (HTTPS). Buka halaman verifikasi melalui HTTPS atau gunakan “Ambil foto kode”.');
    setCameraRecovery(true);
    return;
  }

  const availableDetector = await getDetector();
  if (!availableDetector) {
    setMessage('error', 'Scanner otomatis belum didukung browser ini. Gunakan input manual atau coba buka halaman di Chrome versi terbaru.');
    setCameraRecovery(true);
    return;
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setMessage('error', 'Akses kamera live tidak tersedia pada browser ini. Gunakan “Ambil foto kode” atau input manual.');
    setCameraRecovery(true);
    return;
  }

  scanBtn.disabled = true;
  scanBtn.textContent = 'Membuka kamera…';
  try {
    await stopScanner();
    scannerPanel.hidden = false;
    scannerStatus.textContent = 'Meminta izin kamera…';
    stream = await requestCameraStream();
    scannerVideo.srcObject = stream;
    await scannerVideo.play();
    scanning = true;
    scannerStatus.textContent = 'Kamera aktif. Arahkan ke QR Code / barcode.';
    setCameraRecovery(false);
    scanLoop();
  } catch (error) {
    await stopScanner();
    setMessage('error', getCameraErrorMessage(error));
    setCameraRecovery(true);
  } finally {
    scanBtn.disabled = false;
    scanBtn.textContent = '▣ Scan QR / Barcode';
  }
}

async function scanImageFile(file, inputElement) {
  if (!file) return;
  clearMessage();
  setCameraRecovery(false);
  const availableDetector = await getDetector();
  if (!availableDetector) {
    setMessage('error', 'Browser ini belum mendukung pembacaan QR/barcode dari gambar. Gunakan input manual atau coba Chrome versi terbaru.');
    if (inputElement) inputElement.value = '';
    return;
  }

  let source = null;
  let objectUrl = '';
  try {
    if (typeof createImageBitmap === 'function') {
      source = await createImageBitmap(file);
    } else {
      objectUrl = URL.createObjectURL(file);
      source = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = objectUrl;
      });
    }

    const codes = await availableDetector.detect(source);
    if (!codes || !codes.length) {
      setMessage('error', 'QR Code / barcode tidak terdeteksi. Pastikan kode terlihat utuh, terang, dan tidak buram.');
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
    setMessage('error', 'Gambar tidak dapat dipindai. Coba ambil gambar lebih dekat dan jelas, atau masukkan nomor registrasi secara manual.');
  } finally {
    if (source && typeof source.close === 'function') source.close();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    if (inputElement) inputElement.value = '';
  }
}

scanBtn.addEventListener('click', startScanner);
closeScannerBtn.addEventListener('click', stopScanner);
if (retryCameraBtn) retryCameraBtn.addEventListener('click', startScanner);
if (manualFocusBtn) {
  manualFocusBtn.addEventListener('click', () => {
    setCameraRecovery(false);
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => input.focus(), 250);
  });
}

imageScanInput.addEventListener('change', () => {
  const file = imageScanInput.files && imageScanInput.files[0];
  scanImageFile(file, imageScanInput);
});

if (cameraImageInput) {
  cameraImageInput.addEventListener('change', () => {
    const file = cameraImageInput.files && cameraImageInput.files[0];
    scanImageFile(file, cameraImageInput);
  });
}

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
