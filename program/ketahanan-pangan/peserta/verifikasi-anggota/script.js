const API = 'https://peserta-api.srilexbuditra.work';
const video = document.getElementById('cameraVideo');
const preview = document.getElementById('photoPreview');
const canvas = document.getElementById('captureCanvas');
const cameraStage = document.getElementById('cameraStage');
const cameraPanel = document.querySelector('.camera-panel');
const cameraTools = document.getElementById('cameraTools');
const empty = document.getElementById('cameraEmpty');
const openBtn = document.getElementById('openCameraBtn');
const captureBtn = document.getElementById('captureBtn');
const retakeBtn = document.getElementById('retakeBtn');
const frontCameraBtn = document.getElementById('frontCameraBtn');
const backCameraBtn = document.getElementById('backCameraBtn');
const zoomRange = document.getElementById('zoomRange');
const zoomValue = document.getElementById('zoomValue');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomHint = document.getElementById('zoomHint');
const submitBtn = document.getElementById('submitBtn');
const consentCheck = document.getElementById('consentCheck');
const message = document.getElementById('message');
const successRedirect = document.getElementById('successRedirect');
const redirectCountdown = document.getElementById('redirectCountdown');

let stream = null;
let capturedBlob = null;
let previewObjectUrl = '';
let currentStatus = 'not_submitted';
let redirectTimer = null;
let facingMode = 'user';
let activeFacingMode = 'user';
let zoomLevel = 1;
let cameraCount = 0;
let cameraTrack = null;
let nativeZoomCaps = null;
let nativeZoomValue = 1;
let zoomSyncTimer = null;

const ZOOM_MIN = 0.2;
const ZOOM_MAX = 2.0;
const ZOOM_STEP = 0.1;
const GUIDE_SCALE_AT_MIN_DISTANCE = 0.78;


function setCameraLive(active) {
  const isLive = Boolean(active);
  cameraPanel?.classList.toggle('camera-live', isLive);
  document.body.classList.toggle('member-camera-live', isLive);
  // Saat kamera aktif tombol Buka Kamera tidak diperlukan dan hanya memakan ruang layar HP.
  if (openBtn) openBtn.hidden = isLive;
}

function setMessage(type, text) {
  message.className = 'message ' + (type || '');
  message.textContent = text || '';
}

function revokePreviewUrl() {
  if (!previewObjectUrl) return;
  try { URL.revokeObjectURL(previewObjectUrl); } catch (_) {}
  previewObjectUrl = '';
}

function beginSuccessRedirect(seconds = 7) {
  if (redirectTimer) window.clearInterval(redirectTimer);
  stopCamera();
  setCameraLive(false);
  openBtn.hidden = true;
  openBtn.disabled = true;
  captureBtn.disabled = true;
  retakeBtn.disabled = true;
  frontCameraBtn.disabled = true;
  backCameraBtn.disabled = true;
  zoomRange.disabled = true;
  zoomOutBtn.disabled = true;
  zoomInBtn.disabled = true;
  submitBtn.disabled = true;
  consentCheck.disabled = true;
  document.body.classList.add('member-upload-success');
  setMessage('success', 'Foto berhasil dikirim. Data terbaru sudah diterima dan sedang menunggu pemeriksaan admin.');
  if (successRedirect) successRedirect.hidden = false;
  try {
    sessionStorage.setItem('memberPhotoUploadSuccess', JSON.stringify({
      at: Date.now(),
      message: 'Foto terbaru berhasil dikirim dan sedang menunggu pemeriksaan admin.'
    }));
  } catch (_) {}

  let remaining = Math.max(1, Number(seconds) || 5);
  if (redirectCountdown) redirectCountdown.textContent = String(remaining);

  redirectTimer = window.setInterval(() => {
    remaining -= 1;
    if (redirectCountdown) redirectCountdown.textContent = String(Math.max(remaining, 0));
    if (remaining <= 0) {
      window.clearInterval(redirectTimer);
      redirectTimer = null;
      window.location.replace('../');
    }
  }, 1000);
}

function humanStatus(value) {
  return ({not_submitted:'Belum direkam',pending:'Menunggu review admin',approved:'VERIFIED MEMBER',rejected:'Perlu rekam ulang'})[String(value || '').toLowerCase()] || String(value || '-');
}

function humanRegistration(value) {
  return ({submitted:'Registrasi diterima',pending:'Dalam pemeriksaan',revision:'Perlu perbaikan',resubmitted:'Menunggu pemeriksaan ulang',verified:'Terverifikasi',rejected:'Ditolak'})[String(value || '').toLowerCase()] || String(value || '-');
}

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(d);
}

async function api(path, options = {}) {
  const separator = path.includes('?') ? '&' : '?';
  const freshPath = `${path}${separator}_=${Date.now()}`;
  const response = await fetch(API + freshPath, {credentials:'include',cache:'no-store',...options,headers:{Accept:'application/json',...(options.headers||{})}});
  let data = {};
  try { data = await response.json(); } catch (_) {}
  if (!response.ok) throw new Error(data.message || `Permintaan gagal (HTTP ${response.status}).`);
  return data;
}

function renderStatus(data) {
  const mv = data.member_verification || {};
  currentStatus = String(mv.status || 'not_submitted').toLowerCase();
  document.getElementById('registrationStatus').textContent = humanRegistration(data.registration_status);
  document.getElementById('memberStatus').textContent = humanStatus(currentStatus);
  document.getElementById('submittedAt').textContent = formatDate(mv.submitted_at);
  document.getElementById('reviewedAt').textContent = formatDate(mv.reviewed_at);
  const badge = document.getElementById('memberStatusBadge');
  badge.className = 'status-pill ' + (['pending','approved','rejected'].includes(currentStatus) ? currentStatus : '');
  badge.textContent = currentStatus === 'approved' ? 'VERIFIED MEMBER' : humanStatus(currentStatus).toUpperCase();
  const noteWrap = document.getElementById('reviewNoteWrap');
  if (mv.review_note) {
    noteWrap.hidden = false;
    document.getElementById('reviewNote').textContent = mv.review_note;
  } else noteWrap.hidden = true;
  const title = document.getElementById('statusTitle');
  const text = document.getElementById('statusText');
  const cardLink = document.getElementById('cardLink');
  if (!data.eligible) {
    title.textContent = 'Registrasi belum terverifikasi';
    text.textContent = 'Rekam foto anggota baru tersedia setelah status registrasi menjadi Terverifikasi.';
    openBtn.disabled = true;
    captureBtn.disabled = true;
    submitBtn.disabled = true;
  } else if (currentStatus === 'approved') {
    title.textContent = 'VERIFIED MEMBER aktif';
    text.textContent = 'Foto anggota telah disetujui admin dan akan ditampilkan pada Kartu Anggota Digital.';
    cardLink.hidden = false;
    openBtn.disabled = true;
    captureBtn.disabled = true;
    submitBtn.disabled = true;
  } else if (currentStatus === 'pending') {
    title.textContent = 'Menunggu review admin';
    text.textContent = 'Foto terbaru sudah diterima dan menunggu pemeriksaan admin.';
    openBtn.disabled = false;
  } else if (currentStatus === 'rejected') {
    title.textContent = 'Silakan rekam ulang foto';
    text.textContent = 'Admin meminta foto baru. Perhatikan catatan admin lalu rekam ulang menggunakan kepala hingga dada.';
    openBtn.disabled = false;
  } else {
    title.textContent = 'Foto anggota belum direkam';
    text.textContent = 'Buka kamera, posisikan kepala hingga dada, lalu kirim foto untuk review admin.';
    openBtn.disabled = false;
  }
}

async function loadStatus() {
  try {
    const me = await api('/me');
    if (!me.authenticated) { window.location.href = '../'; return; }
    const data = await api('/member-verification');
    renderStatus(data);
  } catch (error) {
    setMessage('error', error.message || 'Status verifikasi anggota belum dapat dimuat.');
  }
}

function clampZoom(value) {
  const numeric = Number(value);
  const safe = Number.isFinite(numeric) ? numeric : 1;
  const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, safe));
  return Math.round(clamped / ZOOM_STEP) * ZOOM_STEP;
}

function updateZoomHint() {
  if (!zoomHint) return;
  if (zoomLevel < 1) {
    zoomHint.textContent = 'Kamera tetap memenuhi bingkai. Nilai di bawah 1× hanya membantu jarak pengambilan: mundurkan HP sampai bagian atas kepala, kedua bahu, dan dada masuk di dalam panduan.';
  } else if (zoomLevel > 1) {
    zoomHint.textContent = 'Zoom masuk aktif. Pastikan bagian atas kepala, kedua bahu, dan dada tidak terpotong dari panduan.';
  } else {
    zoomHint.textContent = 'Tampilan asli kamera. Posisikan bagian atas kepala, kedua bahu, dan dada di dalam panduan.';
  }
}

function updateGuideFraming() {
  // Di bawah 1x kita tidak mengecilkan video dan tidak memaksa native zoom < 1.
  // Slider menjadi bantuan jarak: panduan mengecil sedikit agar peserta
  // terdorong memundurkan HP sampai kepala, bahu, dan dada masuk utuh.
  let scale = 1;
  if (zoomLevel < 1) {
    const progress = (zoomLevel - ZOOM_MIN) / (1 - ZOOM_MIN);
    scale = GUIDE_SCALE_AT_MIN_DISTANCE + Math.max(0, Math.min(1, progress)) * (1 - GUIDE_SCALE_AT_MIN_DISTANCE);
  }
  cameraStage.style.setProperty('--guide-scale', scale.toFixed(3));
  cameraStage.dataset.distanceMode = zoomLevel < 1 ? 'far' : 'normal';
}

function applyPreviewZoom() {
  // Preview harus selalu memenuhi area kamera. Nilai < 1x TIDAK PERNAH
  // memakai transform scale(<1), sehingga tidak muncul latar hitam dan
  // hasil foto tidak menjadi thumbnail di tengah.
  const nativeForDigital = Math.max(1, nativeZoomValue || 1);
  const digitalZoom = zoomLevel > 1 ? Math.max(1, zoomLevel / nativeForDigital) : 1;
  cameraStage.style.setProperty('--camera-zoom', String(digitalZoom));
  updateGuideFraming();
}

async function syncNativeZoom() {
  if (!cameraTrack || !nativeZoomCaps || !Number.isFinite(nativeZoomCaps.min) || !Number.isFinite(nativeZoomCaps.max)) {
    nativeZoomValue = 1;
    applyPreviewZoom();
    updateZoomHint();
    return;
  }

  const min = Number(nativeZoomCaps.min);
  const max = Number(nativeZoomCaps.max);
  const step = Number(nativeZoomCaps.step) || 0.1;

  // Penting: jangan kirim zoom < 1 ke track kamera. Pada sebagian HP Android
  // nilai native di bawah 1 membuat stream menjadi letterbox/mengecil dan
  // menghasilkan area hitam. Untuk 0.2x-0.9x gunakan mode bantuan jarak saja.
  const requested = zoomLevel > 1 ? zoomLevel : 1;
  let target = Math.min(max, Math.max(min, requested));
  target = Math.round(target / step) * step;
  target = Math.min(max, Math.max(min, target));

  try {
    await cameraTrack.applyConstraints({advanced:[{zoom:target}]});
    const settings = cameraTrack.getSettings?.() || {};
    nativeZoomValue = Number(settings.zoom) || target || 1;
  } catch (_) {
    nativeZoomValue = 1;
  }

  applyPreviewZoom();
  updateZoomHint();
}

function scheduleNativeZoomSync() {
  if (zoomSyncTimer) window.clearTimeout(zoomSyncTimer);
  zoomSyncTimer = window.setTimeout(() => { syncNativeZoom().catch(() => {}); }, 90);
}

function applyZoom(value, announce = false) {
  zoomLevel = clampZoom(value);
  zoomRange.value = zoomLevel.toFixed(1);
  zoomRange.setAttribute('aria-valuenow', zoomLevel.toFixed(1));
  zoomValue.textContent = `${zoomLevel.toFixed(1)}×`;
  applyPreviewZoom();
  updateZoomHint();
  if (stream) scheduleNativeZoomSync();
  if (announce && stream) {
    const text = zoomLevel < 1
      ? `Mode jarak ${zoomLevel.toFixed(1)}×. Kamera tetap penuh; mundurkan HP sampai kepala, kedua bahu, dan dada masuk di panduan.`
      : `Skala kamera ${zoomLevel.toFixed(1)}×. Posisikan atas kepala, kedua bahu, dan dada di dalam panduan.`;
    setMessage('success', text);
  }
}

function zoomFromPointer(clientX) {
  const rect = zoomRange.getBoundingClientRect();
  if (!rect.width) return;
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  const raw = ZOOM_MIN + ratio * (ZOOM_MAX - ZOOM_MIN);
  applyZoom(raw);
}

function bindZoomDrag() {
  let pointerDragging = false;

  // Android/Chrome tertentu membiarkan gesture horizontal range diambil alih
  // oleh scroll halaman. Pointer handling ini membuat seluruh track dapat
  // digeser sampai nilai minimum 0.2x, bukan berhenti di 1.0x.
  if (window.PointerEvent) {
    zoomRange.addEventListener('pointerdown', (event) => {
      pointerDragging = true;
      try { zoomRange.setPointerCapture(event.pointerId); } catch (_) {}
      zoomFromPointer(event.clientX);
      event.preventDefault();
    });
    zoomRange.addEventListener('pointermove', (event) => {
      if (!pointerDragging) return;
      zoomFromPointer(event.clientX);
      event.preventDefault();
    });
    const finish = (event) => {
      if (!pointerDragging) return;
      pointerDragging = false;
      try { zoomRange.releasePointerCapture(event.pointerId); } catch (_) {}
      zoomFromPointer(event.clientX);
      event.preventDefault();
    };
    zoomRange.addEventListener('pointerup', finish);
    zoomRange.addEventListener('pointercancel', () => { pointerDragging = false; });
  } else {
    // Fallback untuk browser HP lama yang belum mendukung PointerEvent.
    zoomRange.addEventListener('touchstart', (event) => {
      if (!event.touches[0]) return;
      zoomFromPointer(event.touches[0].clientX);
      event.preventDefault();
    }, {passive:false});
    zoomRange.addEventListener('touchmove', (event) => {
      if (!event.touches[0]) return;
      zoomFromPointer(event.touches[0].clientX);
      event.preventDefault();
    }, {passive:false});
  }
}

function updateFacingButtons() {
  const isFront = facingMode === 'user';
  frontCameraBtn.classList.toggle('active', isFront);
  backCameraBtn.classList.toggle('active', !isFront);
  frontCameraBtn.setAttribute('aria-pressed', isFront ? 'true' : 'false');
  backCameraBtn.setAttribute('aria-pressed', !isFront ? 'true' : 'false');
  const oneCamera = cameraCount === 1;
  frontCameraBtn.disabled = oneCamera && !isFront;
  backCameraBtn.disabled = oneCamera && isFront;
}

async function countCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    cameraCount = devices.filter(device => device.kind === 'videoinput').length;
  } catch (_) {
    cameraCount = 0;
  }
  updateFacingButtons();
}

async function openCamera(requestedFacing = facingMode) {
  setMessage('', '');
  if (!navigator.mediaDevices?.getUserMedia) {
    setMessage('error','Browser ini belum mendukung akses kamera. Gunakan browser terbaru pada HP.');
    return;
  }
  try {
    facingMode = requestedFacing === 'environment' ? 'environment' : 'user';
    stopCamera();
    revokePreviewUrl();
    applyZoom(1);
    const supported = navigator.mediaDevices.getSupportedConstraints?.() || {};
    const videoConstraints = {
      facingMode:{ideal:facingMode},
      width:{ideal:1440},
      height:{ideal:1920},
      aspectRatio:{ideal:0.75}
    };
    if (supported.resizeMode) videoConstraints.resizeMode = 'none';

    stream = await navigator.mediaDevices.getUserMedia({
      audio:false,
      video:videoConstraints
    });
    const track = stream.getVideoTracks()[0];
    cameraTrack = track || null;
    const caps = track?.getCapabilities?.() || {};
    nativeZoomCaps = caps && caps.zoom && Number.isFinite(caps.zoom.min) && Number.isFinite(caps.zoom.max) ? caps.zoom : null;
    const settings = track?.getSettings?.() || {};
    nativeZoomValue = Number(settings.zoom) || 1;
    activeFacingMode = ['user','environment'].includes(settings.facingMode) ? settings.facingMode : facingMode;
    facingMode = activeFacingMode;
    cameraStage.dataset.facing = activeFacingMode;
    video.srcObject = stream;
    await video.play();
    await syncNativeZoom();
    await countCameras();
    updateFacingButtons();
    empty.hidden = true;
    preview.hidden = true;
    video.hidden = false;
    cameraTools.hidden = false;
    setCameraLive(true);
    captureBtn.disabled = false;
    retakeBtn.hidden = true;
    capturedBlob = null;
    submitBtn.disabled = true;
    updateZoomHint();
    setMessage('success', `Kamera ${activeFacingMode === 'user' ? 'depan' : 'belakang'} aktif. Posisikan bagian atas kepala, kedua bahu, dan dada di dalam panduan.`);
  } catch (error) {
    console.error('Kamera gagal dibuka:', error);
    setCameraLive(false);
    openBtn.hidden = false;
    setMessage('error','Kamera tidak dapat dibuka. Pastikan izin kamera diberikan pada browser. Jika satu kamera gagal, coba pilih kamera lainnya.');
  }
}

function stopCamera() {
  if (zoomSyncTimer) { window.clearTimeout(zoomSyncTimer); zoomSyncTimer = null; }
  if (stream) stream.getTracks().forEach(track => track.stop());
  stream = null;
  cameraTrack = null;
  nativeZoomCaps = null;
  nativeZoomValue = 1;
  video.srcObject = null;
}

async function chooseCamera(mode) {
  if (mode === facingMode && stream) return;
  facingMode = mode;
  updateFacingButtons();
  await openCamera(mode);
}

function capturePhoto() {
  if (!video.videoWidth || !video.videoHeight) return;
  const targetW = 900, targetH = 1200;
  const sourceRatio = video.videoWidth / video.videoHeight;
  const targetRatio = targetW / targetH;
  let sx=0, sy=0, sw=video.videoWidth, sh=video.videoHeight;
  if (sourceRatio > targetRatio) {
    sw = video.videoHeight * targetRatio;
    sx = (video.videoWidth - sw) / 2;
  } else {
    sh = video.videoWidth / targetRatio;
    sy = (video.videoHeight - sh) / 2;
  }

  // Kamera dan hasil foto tidak boleh mengecil pada nilai di bawah 1x.
  // 0.2x-0.9x adalah bantuan jarak/framing; sumber gambar tetap 1x penuh.
  // Crop digital hanya dipakai untuk zoom-in di atas 1x.
  const currentSettings = cameraTrack?.getSettings?.() || {};
  const actualNativeZoom = Number(currentSettings.zoom) || nativeZoomValue || 1;
  const digitalCropZoom = zoomLevel > 1 ? Math.max(1, zoomLevel / Math.max(1, actualNativeZoom)) : 1;
  const baseSw = sw, baseSh = sh;
  sw = baseSw / digitalCropZoom;
  sh = baseSh / digitalCropZoom;
  sx += (baseSw - sw) / 2;
  sy += (baseSh - sh) / 2;

  const ctx = canvas.getContext('2d');
  canvas.width = targetW;
  canvas.height = targetH;
  ctx.save();
  if (activeFacingMode === 'user') {
    ctx.translate(targetW,0);
    ctx.scale(-1,1);
  }
  ctx.drawImage(video,sx,sy,sw,sh,0,0,targetW,targetH);
  ctx.restore();
  canvas.toBlob(blob => {
    if (!blob) { setMessage('error','Foto gagal diproses. Silakan coba lagi.'); return; }
    capturedBlob = blob;
    revokePreviewUrl();
    previewObjectUrl = URL.createObjectURL(blob);
    preview.src = previewObjectUrl;
    preview.hidden = false;
    video.hidden = true;
    stopCamera();
    setCameraLive(false);
    openBtn.hidden = true;
    cameraTools.hidden = true;
    captureBtn.disabled = true;
    retakeBtn.hidden = false;
    submitBtn.disabled = !consentCheck.checked;
    setMessage('success','Foto berhasil diambil. Pastikan kepala hingga dada terlihat jelas sebelum dikirim.');
  },'image/jpeg',0.88);
}

async function submitPhoto() {
  if (!capturedBlob) { setMessage('error','Ambil foto terlebih dahulu.'); return; }
  if (!consentCheck.checked) { setMessage('error','Centang persetujuan penggunaan foto terlebih dahulu.'); return; }
  submitBtn.disabled = true;
  submitBtn.textContent = 'Mengirim Foto…';
  try {
    const form = new FormData();
    form.append('photo', capturedBlob, `member-camera-${Date.now()}.jpg`);
    form.append('consent','yes');
    form.append('capture_method','camera');
    form.append('camera_facing', activeFacingMode);
    form.append('camera_zoom', zoomLevel.toFixed(2));
    const response = await fetch(`${API}/member-photo?_=${Date.now()}`,{method:'POST',credentials:'include',body:form,cache:'no-store',headers:{Accept:'application/json'}});
    let data={}; try { data=await response.json(); } catch (_) {}
    if (!response.ok) throw new Error(data.message || `Gagal mengirim foto (HTTP ${response.status}).`);
    setMessage('success',data.message || 'Foto terbaru berhasil dikirim untuk review admin.');
    await loadStatus();
    beginSuccessRedirect(7);
  } catch (error) {
    setMessage('error',error.message || 'Foto belum dapat dikirim.');
  } finally {
    submitBtn.textContent = 'Kirim untuk Verifikasi Anggota';
    if (!redirectTimer) submitBtn.disabled = !capturedBlob || !consentCheck.checked || currentStatus === 'approved';
  }
}

openBtn.addEventListener('click',()=>openCamera(facingMode));
captureBtn.addEventListener('click',capturePhoto);
retakeBtn.addEventListener('click',()=>openCamera(facingMode));
frontCameraBtn.addEventListener('click',()=>chooseCamera('user'));
backCameraBtn.addEventListener('click',()=>chooseCamera('environment'));
zoomRange.addEventListener('input',()=>applyZoom(zoomRange.value));
bindZoomDrag();
zoomOutBtn.addEventListener('click',()=>applyZoom(zoomLevel - ZOOM_STEP, true));
zoomInBtn.addEventListener('click',()=>applyZoom(zoomLevel + ZOOM_STEP, true));
consentCheck.addEventListener('change',()=>{ submitBtn.disabled = !capturedBlob || !consentCheck.checked || currentStatus === 'approved'; });
submitBtn.addEventListener('click',submitPhoto);
window.addEventListener('pagehide',()=>{ stopCamera(); revokePreviewUrl(); });
window.addEventListener('beforeunload',()=>{ stopCamera(); revokePreviewUrl(); });
setCameraLive(false);
openBtn.hidden = false;
applyZoom(1);
updateFacingButtons();
loadStatus();
