const API = 'https://peserta-api.srilexbuditra.work';
const video = document.getElementById('cameraVideo');
const preview = document.getElementById('photoPreview');
const canvas = document.getElementById('captureCanvas');
const empty = document.getElementById('cameraEmpty');
const openBtn = document.getElementById('openCameraBtn');
const captureBtn = document.getElementById('captureBtn');
const retakeBtn = document.getElementById('retakeBtn');
const submitBtn = document.getElementById('submitBtn');
const consentCheck = document.getElementById('consentCheck');
const message = document.getElementById('message');
let stream = null;
let capturedBlob = null;
let currentStatus = 'not_submitted';

function setMessage(type, text) {
  message.className = 'message ' + (type || '');
  message.textContent = text || '';
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
  const response = await fetch(API + path, {credentials:'include',cache:'no-store',...options,headers:{Accept:'application/json',...(options.headers||{})}});
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
    text.textContent = 'Foto sudah diterima. Anda dapat menunggu hasil review; rekam ulang hanya bila benar-benar diperlukan sebelum disetujui.';
    openBtn.disabled = false;
  } else if (currentStatus === 'rejected') {
    title.textContent = 'Silakan rekam ulang foto';
    text.textContent = 'Admin meminta foto baru. Perhatikan catatan admin lalu ulangi proses kamera.';
    openBtn.disabled = false;
  } else {
    title.textContent = 'Foto anggota belum direkam';
    text.textContent = 'Buka kamera, ambil foto setengah badan, lalu kirim untuk review admin.';
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

async function openCamera() {
  setMessage('', '');
  try {
    stopCamera();
    stream = await navigator.mediaDevices.getUserMedia({
      audio:false,
      video:{facingMode:'user',width:{ideal:1280},height:{ideal:1600}}
    });
    video.srcObject = stream;
    await video.play();
    empty.hidden = true;
    preview.hidden = true;
    video.hidden = false;
    captureBtn.disabled = false;
    retakeBtn.hidden = true;
    capturedBlob = null;
    submitBtn.disabled = true;
    setMessage('success','Kamera aktif. Posisikan kepala hingga pinggang di dalam panduan.');
  } catch (error) {
    setMessage('error','Kamera tidak dapat dibuka. Pastikan izin kamera diberikan pada browser dan perangkat memiliki kamera aktif.');
  }
}

function stopCamera() {
  if (stream) stream.getTracks().forEach(track => track.stop());
  stream = null;
  video.srcObject = null;
}

function capturePhoto() {
  if (!video.videoWidth || !video.videoHeight) return;
  const targetW = 900, targetH = 1200;
  const sourceRatio = video.videoWidth / video.videoHeight;
  const targetRatio = targetW / targetH;
  let sx=0, sy=0, sw=video.videoWidth, sh=video.videoHeight;
  if (sourceRatio > targetRatio) { sw = video.videoHeight * targetRatio; sx = (video.videoWidth - sw) / 2; }
  else { sh = video.videoWidth / targetRatio; sy = (video.videoHeight - sh) / 2; }
  const ctx = canvas.getContext('2d');
  canvas.width = targetW; canvas.height = targetH;
  ctx.save();
  ctx.translate(targetW,0); ctx.scale(-1,1);
  ctx.drawImage(video,sx,sy,sw,sh,0,0,targetW,targetH);
  ctx.restore();
  canvas.toBlob(blob => {
    if (!blob) { setMessage('error','Foto gagal diproses. Silakan coba lagi.'); return; }
    capturedBlob = blob;
    preview.src = URL.createObjectURL(blob);
    preview.hidden = false;
    video.hidden = true;
    stopCamera();
    captureBtn.disabled = true;
    retakeBtn.hidden = false;
    submitBtn.disabled = !consentCheck.checked;
    setMessage('success','Foto berhasil diambil. Periksa hasil foto sebelum dikirim.');
  },'image/jpeg',0.88);
}

async function submitPhoto() {
  if (!capturedBlob) { setMessage('error','Ambil foto terlebih dahulu.'); return; }
  if (!consentCheck.checked) { setMessage('error','Centang persetujuan penggunaan foto terlebih dahulu.'); return; }
  submitBtn.disabled = true;
  submitBtn.textContent = 'Mengirim Foto…';
  try {
    const form = new FormData();
    form.append('photo', capturedBlob, 'member-camera.jpg');
    form.append('consent','yes');
    form.append('capture_method','camera');
    const response = await fetch(API + '/member-photo',{method:'POST',credentials:'include',body:form,cache:'no-store',headers:{Accept:'application/json'}});
    let data={}; try { data=await response.json(); } catch (_) {}
    if (!response.ok) throw new Error(data.message || `Gagal mengirim foto (HTTP ${response.status}).`);
    setMessage('success',data.message || 'Foto berhasil dikirim untuk review admin.');
    await loadStatus();
  } catch (error) {
    setMessage('error',error.message || 'Foto belum dapat dikirim.');
  } finally {
    submitBtn.textContent = 'Kirim untuk Verifikasi Anggota';
    submitBtn.disabled = !capturedBlob || !consentCheck.checked || currentStatus === 'approved';
  }
}

openBtn.addEventListener('click',openCamera);
captureBtn.addEventListener('click',capturePhoto);
retakeBtn.addEventListener('click',openCamera);
consentCheck.addEventListener('change',()=>{ submitBtn.disabled = !capturedBlob || !consentCheck.checked || currentStatus === 'approved'; });
submitBtn.addEventListener('click',submitPhoto);
window.addEventListener('pagehide',stopCamera);
window.addEventListener('beforeunload',stopCamera);
loadStatus();
