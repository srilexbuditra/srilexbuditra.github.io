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
const nativeVideoWrap = document.getElementById('nativeVideoWrap');
const html5QrReader = document.getElementById('html5QrReader');
const imageQrReader = document.getElementById('imageQrReader');
const cameraPicker = document.getElementById('cameraPicker');
const cameraSelect = document.getElementById('cameraSelect');
const switchCameraBtn = document.getElementById('switchCameraBtn');
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
let html5Scanner = null;
let scanResultHandled = false;
let availableCameras = [];
let activeCameraId = '';
let certificateVerifyTracked = false;

function isCertificateQrSource() {
  const params = new URLSearchParams(window.location.search);
  return params.get('source') === 'certificate_qr';
}

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

    // GA4: verifikasi keaslian sertifikat hanya dihitung bila halaman
    // dibuka melalui QR pada Kartu / Sertifikat Digital.
    if (isCertificateQrSource() && !certificateVerifyTracked) {
      certificateVerifyTracked = true;
      const sendCertificateVerifySuccess = (attempt = 0) => {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'certificate_verify_success', {
            event_category: 'ketahanan_pangan',
            event_label: 'Verifikasi Sertifikat Berhasil',
            transport_type: 'beacon'
          });
          return;
        }
        if (attempt < 10) {
          window.setTimeout(() => sendCertificateVerifySuccess(attempt + 1), 200);
        }
      };
      sendCertificateVerifySuccess();
    }

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

function hasHtml5Qrcode() {
  return typeof window.Html5Qrcode === 'function';
}

async function stopScanner() {
  scanning = false;
  scanResultHandled = false;

  if (scanFrameId) cancelAnimationFrame(scanFrameId);
  scanFrameId = 0;

  if (html5Scanner) {
    const activeScanner = html5Scanner;
    html5Scanner = null;
    try { await activeScanner.stop(); } catch (_) {}
    try { activeScanner.clear(); } catch (_) {}
  }

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  if (scannerVideo) {
    try { scannerVideo.pause(); } catch (_) {}
    scannerVideo.srcObject = null;
  }

  if (nativeVideoWrap) nativeVideoWrap.hidden = false;
  if (html5QrReader) {
    html5QrReader.hidden = true;
    html5QrReader.innerHTML = '';
  }
  scannerPanel.hidden = true;
}

async function handleDecodedValue(rawValue) {
  if (scanResultHandled) return;
  const id = extractRegistrationId(rawValue);
  if (!id || !/^KTPG-[0-9]{8}-[A-Z0-9-]+$/.test(id)) {
    scannerStatus.textContent = 'Kode terbaca, tetapi Nomor Registrasi belum dikenali. Coba arahkan kamera lebih dekat.';
    return;
  }

  scanResultHandled = true;
  scannerStatus.textContent = 'Kode ditemukan. Memeriksa registrasi…';
  await stopScanner();
  input.value = id;
  verifyRegistration(id);
}

async function scanLoop() {
  if (!scanning || !detector) return;

  if (scannerVideo.readyState >= 2) {
    try {
      const codes = await detector.detect(scannerVideo);
      if (codes && codes.length) {
        await handleDecodedValue(codes[0].rawValue);
        if (scanResultHandled) return;
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
    return 'Izin kamera belum diberikan atau diblokir. Izinkan Kamera untuk situs ini lalu tekan “Coba kamera lagi”. Jika halaman dibuka dari browser dalam aplikasi, coba buka tautan di Chrome atau Edge.';
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'Kamera tidak ditemukan pada perangkat ini. Gunakan “Ambil foto kode”, “Unggah gambar kode”, atau masukkan Nomor Registrasi secara manual.';
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'Kamera sedang tidak dapat digunakan, kemungkinan sedang dipakai aplikasi lain. Tutup aplikasi kamera/video lain lalu tekan “Coba kamera lagi”.';
  }
  if (name === 'SecurityError') {
    return 'Browser memblokir akses kamera. Pastikan halaman dibuka melalui HTTPS dan izin Kamera untuk situs ini diaktifkan.';
  }
  return 'Kamera belum dapat dibuka. Coba lagi, gunakan “Ambil foto kode”, “Unggah gambar kode”, atau input manual.';
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


function cameraLabel(camera, index) {
  const original = String(camera && camera.label || '').trim();
  if (!original) return `Kamera ${index + 1}`;

  const label = original.toLowerCase();

  // Nama generik dari browser ponsel.
  if (
    /facing\s*back|back\s*camera|rear|environment|belakang/.test(label)
  ) {
    return 'Kamera Belakang';
  }

  if (
    /facing\s*front|front\s*camera|user\s*camera|depan/.test(label)
  ) {
    return 'Kamera Depan';
  }

  // Nama umum pada Windows/laptop.
  if (/integrated\s*(webcam|camera)/.test(label)) {
    return 'Webcam Terintegrasi';
  }

  // Kamera virtual tetap diberi nama produk agar mudah dibedakan.
  if (/youcam|virtual|obs|manycam|snap/.test(label)) {
    return `Kamera Virtual — ${original}`;
  }

  // Terjemahkan kata-kata umum tanpa menghilangkan nama perangkat.
  return original
    .replace(/\bcamera\b/gi, 'Kamera')
    .replace(/\bwebcam\b/gi, 'Webcam')
    .replace(/\bfacing back\b/gi, 'Belakang')
    .replace(/\bfacing front\b/gi, 'Depan');
}

function choosePreferredCamera(cameras) {
  if (!Array.isArray(cameras) || !cameras.length) return null;

  const saved = localStorage.getItem('sb_verification_camera_id');
  if (saved) {
    const savedCamera = cameras.find((camera) => camera.id === saved);
    if (savedCamera) return savedCamera;
  }

  // Utamakan kamera fisik normal. Hindari kamera IR/virtual bila ada pilihan lain.
  const normalPhysical = cameras.find((camera) => {
    const label = String(camera.label || '');
    return /(integrated|webcam|usb|camera)/i.test(label) &&
      !/(ir|infrared|virtual|youcam|obs|snap|manycam)/i.test(label);
  });
  if (normalPhysical) return normalPhysical;

  const environmentCamera = cameras.find((camera) =>
    /(back|rear|environment|belakang)/i.test(String(camera.label || ''))
  );
  if (environmentCamera) return environmentCamera;

  const nonVirtual = cameras.find((camera) =>
    !/(ir|infrared|virtual|youcam|obs|snap|manycam)/i.test(String(camera.label || ''))
  );
  return nonVirtual || cameras[0];
}

function renderCameraPicker(cameras, selectedId) {
  if (!cameraPicker || !cameraSelect) return;

  cameraSelect.innerHTML = '';
  cameras.forEach((camera, index) => {
    const option = document.createElement('option');
    option.value = camera.id;
    option.textContent = cameraLabel(camera, index);
    if (camera.id === selectedId) option.selected = true;
    cameraSelect.appendChild(option);
  });

  cameraPicker.hidden = cameras.length < 2;
}

async function startHtml5Scanner(cameraId = '') {
  await stopScanner();

  scannerPanel.hidden = false;
  if (nativeVideoWrap) nativeVideoWrap.hidden = true;
  if (html5QrReader) html5QrReader.hidden = false;
  scannerStatus.textContent = 'Meminta izin kamera…';

  html5Scanner = new window.Html5Qrcode('html5QrReader');

  let cameraConfig = { facingMode: 'environment' };
  let activeLabel = 'kamera perangkat';

  try {
    availableCameras = await window.Html5Qrcode.getCameras();

    if (Array.isArray(availableCameras) && availableCameras.length) {
      let selected =
        (cameraId && availableCameras.find((camera) => camera.id === cameraId)) ||
        choosePreferredCamera(availableCameras);

      if (selected) {
        cameraConfig = selected.id;
        activeCameraId = selected.id;
        activeLabel = cameraLabel(
          selected,
          Math.max(0, availableCameras.findIndex((camera) => camera.id === selected.id))
        );
        localStorage.setItem('sb_verification_camera_id', selected.id);
        renderCameraPicker(availableCameras, selected.id);
      }
    }
  } catch (_) {
    availableCameras = [];
    activeCameraId = '';
    if (cameraPicker) cameraPicker.hidden = true;
    // start() masih dapat mencoba facingMode environment.
  }

  const qrbox = (viewfinderWidth, viewfinderHeight) => {
    const size = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.72);
    return { width: Math.max(180, size), height: Math.max(180, size) };
  };

  scanning = true;
  scanResultHandled = false;

  await html5Scanner.start(
    cameraConfig,
    {
      fps: 10,
      qrbox,
      disableFlip: false,
      rememberLastUsedCamera: true
    },
    async (decodedText) => {
      await handleDecodedValue(decodedText);
    },
    () => {
      // Kesalahan frame normal diabaikan selama kamera mencari kode.
    }
  );

  scannerStatus.textContent =
    `Kamera aktif: ${activeLabel}. Arahkan ke Kode QR / kode batang. Jika tampilan gelap, pilih kamera lain di atas.`;
}

async function startNativeScanner(availableDetector) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Camera API unavailable');
  }

  await stopScanner();
  detector = availableDetector;
  scannerPanel.hidden = false;
  if (nativeVideoWrap) nativeVideoWrap.hidden = false;
  if (html5QrReader) html5QrReader.hidden = true;
  scannerStatus.textContent = 'Meminta izin kamera…';

  stream = await requestCameraStream();
  scannerVideo.srcObject = stream;
  await scannerVideo.play();

  scanning = true;
  scanResultHandled = false;
  scannerStatus.textContent = 'Kamera aktif. Arahkan ke Kode QR / kode batang.';
  scanLoop();
}

async function startScanner() {
  clearMessage();
  setCameraRecovery(false);

  if (!window.isSecureContext) {
    setMessage('error', 'Kamera browser hanya dapat digunakan pada koneksi aman (HTTPS).');
    setCameraRecovery(true);
    return;
  }

  scanBtn.disabled = true;
  scanBtn.textContent = 'Membuka kamera…';

  try {
    // Prioritas: html5-qrcode untuk kompatibilitas Chrome/Edge/Firefox/Safari
    // dan dukungan QR/barcode lintas perangkat.
    if (hasHtml5Qrcode()) {
      await startHtml5Scanner();
      return;
    }

    // Fallback terakhir ke BarcodeDetector native bila tersedia.
    const availableDetector = await getDetector();
    if (availableDetector) {
      await startNativeScanner(availableDetector);
      return;
    }

    throw new Error('Scanner engine unavailable');
  } catch (error) {
    await stopScanner();

    if (!hasHtml5Qrcode() && !('BarcodeDetector' in window)) {
      setMessage(
        'error',
        'Komponen pemindai belum tersedia pada browser ini. Pastikan koneksi internet aktif, muat ulang halaman, lalu coba lagi. Input manual tetap dapat digunakan.'
      );
    } else {
      setMessage('error', getCameraErrorMessage(error));
    }
    setCameraRecovery(true);
  } finally {
    scanBtn.disabled = false;
    scanBtn.textContent = '▣ Scan QR / Barcode';
  }
}

async function scanImageWithHtml5Qrcode(file) {
  if (!hasHtml5Qrcode()) return '';

  const reader = new window.Html5Qrcode('imageQrReader');
  try {
    return await reader.scanFile(file, true);
  } finally {
    try { reader.clear(); } catch (_) {}
    if (imageQrReader) imageQrReader.innerHTML = '';
  }
}

async function scanImageWithNativeDetector(file, availableDetector) {
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
    return codes && codes.length ? codes[0].rawValue : '';
  } finally {
    if (source && typeof source.close === 'function') source.close();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

async function scanImageFile(file, inputElement) {
  if (!file) return;

  clearMessage();
  setCameraRecovery(false);

  if (!String(file.type || '').startsWith('image/')) {
    setMessage('error', 'File harus berupa gambar QR Code / barcode.');
    if (inputElement) inputElement.value = '';
    return;
  }

  try {
    // Pastikan kamera live berhenti sebelum pembacaan file.
    if (scanning || html5Scanner || stream) {
      await stopScanner();
    }

    let rawValue = '';

    // html5-qrcode menjadi decoder utama untuk file/foto agar tetap berfungsi
    // pada browser yang tidak memiliki BarcodeDetector.
    if (hasHtml5Qrcode()) {
      rawValue = await scanImageWithHtml5Qrcode(file);
    } else {
      const availableDetector = await getDetector();
      if (availableDetector) {
        rawValue = await scanImageWithNativeDetector(file, availableDetector);
      }
    }

    if (!rawValue) {
      setMessage(
        'error',
        'QR Code / barcode tidak terdeteksi. Pastikan kode terlihat utuh, terang, tidak terpotong, lalu coba lagi.'
      );
      return;
    }

    const id = extractRegistrationId(rawValue);
    if (!id || !/^KTPG-[0-9]{8}-[A-Z0-9-]+$/.test(id)) {
      setMessage('error', 'Kode terbaca, tetapi Nomor Registrasi tidak dikenali.');
      return;
    }

    input.value = id;
    setMessage('info', 'Kode berhasil dibaca. Memeriksa registrasi…');
    await verifyRegistration(id);
  } catch (error) {
    const messageText = String(error && error.message || error || '');
    if (/not found|no barcode|qr code parse error|scan failed/i.test(messageText)) {
      setMessage('error', 'QR Code / barcode tidak terdeteksi pada gambar. Coba foto lebih dekat dan fokus.');
    } else if (!hasHtml5Qrcode() && !('BarcodeDetector' in window)) {
      setMessage(
        'error',
        'Komponen pembaca gambar belum tersedia. Muat ulang halaman dengan koneksi internet aktif atau gunakan input manual.'
      );
    } else {
      setMessage('error', 'Gambar belum dapat dibaca. Coba gambar yang lebih jelas atau gunakan input manual.');
    }
  } finally {
    if (inputElement) inputElement.value = '';
  }
}

if (switchCameraBtn && cameraSelect) {
  switchCameraBtn.addEventListener('click', async () => {
    const nextCameraId = cameraSelect.value;
    if (!nextCameraId || nextCameraId === activeCameraId) return;

    switchCameraBtn.disabled = true;
    switchCameraBtn.textContent = 'Mengganti…';
    clearMessage();

    try {
      await startHtml5Scanner(nextCameraId);
    } catch (error) {
      setMessage('error', getCameraErrorMessage(error));
      setCameraRecovery(true);
    } finally {
      switchCameraBtn.disabled = false;
      switchCameraBtn.textContent = 'Gunakan kamera';
    }
  });
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
  const nativeDetectorAvailable = Boolean(await getDetector());
  if (hasHtml5Qrcode()) {
    scanSupport.textContent = 'Pemindai QR/barcode siap. Gunakan kamera live, ambil foto, atau unggah gambar kode.';
  } else if (nativeDetectorAvailable) {
    scanSupport.textContent = 'Pemindai native browser siap digunakan. Kamera live dan gambar kode dapat dicoba.';
  } else {
    scanSupport.textContent = 'Komponen pemindai cadangan belum termuat. Verifikasi manual tetap dapat digunakan.';
  }
  const params = new URLSearchParams(location.search);
  const id = extractRegistrationId(params.get('registration_id'));
  if (id) {
    input.value = id;
    verifyRegistration(id, { skipUrlUpdate: true });
  }
})();
