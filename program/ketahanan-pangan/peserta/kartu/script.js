const API = 'https://peserta-api.srilexbuditra.work';
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const cardView = document.getElementById('cardView');
const errorTitle = document.getElementById('errorTitle');
const errorText = document.getElementById('errorText');
const errorAction = document.getElementById('errorAction');
let verificationUrl = '';

function normalizeId(value) {
  return String(value || '').trim().toUpperCase().replace(/\s+/g, '');
}

function initials(name) {
  const parts = String(name || 'Peserta').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'P';
  return parts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
}

function formatDate(value) {
  if (!value) return '-';
  const safe = String(value).includes('T') ? String(value) : String(value).replace(' ', 'T') + 'Z';
  const d = new Date(safe);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
}

async function requestMe() {
  const response = await fetch(API + '/me', {
    method: 'GET', credentials: 'include', headers: { Accept: 'application/json' }, cache: 'no-store'
  });
  let data = {};
  try { data = await response.json(); } catch (_) {}
  if (!response.ok) throw new Error(data.message || 'Layanan akun peserta belum dapat diakses.');
  return data;
}

function renderQr(canvas, value) {
  if (!canvas || !value || typeof window.LocalQRCode !== 'function') {
    throw new Error('Generator QR lokal tidak tersedia.');
  }
  const qr = new window.LocalQRCode(0, 2);
  qr.addData(value);
  qr.make();
  const count = qr.getModuleCount();
  const size = Math.max(220, canvas.width || 220);
  const quiet = 4;
  const cells = count + quiet * 2;
  const unit = size / cells;
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#06263a';
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!qr.isDark(row, col)) continue;
      const x = Math.round((col + quiet) * unit);
      const y = Math.round((row + quiet) * unit);
      const x2 = Math.round((col + quiet + 1) * unit);
      const y2 = Math.round((row + quiet + 1) * unit);
      ctx.fillRect(x, y, x2 - x, y2 - y);
    }
  }
}

function showError(title, text, actionHref = '../', actionLabel = 'Kembali ke Dashboard') {
  loadingState.hidden = true;
  cardView.hidden = true;
  errorState.hidden = false;
  errorTitle.textContent = title;
  errorText.textContent = text;
  errorAction.href = actionHref;
  errorAction.textContent = actionLabel;
}

async function showCard(participant) {
  const id = normalizeId(participant.registration_id);
  document.getElementById('memberName').textContent = participant.nama || 'Peserta';
  document.getElementById('memberInitials').textContent = initials(participant.nama);
  const memberPhoto = document.getElementById('memberPhoto');
  if (memberPhoto) {
    memberPhoto.hidden = true;
    try {
      const photoResponse = await fetch(
        API + '/member-photo?v=' + encodeURIComponent(participant.member_verification_reviewed_at || Date.now()),
        { method: 'GET', credentials: 'include', cache: 'no-store', headers: { Accept: 'image/*' } }
      );
      if (!photoResponse.ok) throw new Error('Foto anggota belum dapat dimuat.');
      const photoBlob = await photoResponse.blob();
      const photoObjectUrl = URL.createObjectURL(photoBlob);
      memberPhoto.src = photoObjectUrl;
      memberPhoto.hidden = false;
      memberPhoto.onload = () => {
        window.setTimeout(() => URL.revokeObjectURL(photoObjectUrl), 1000);
      };
      memberPhoto.onerror = () => {
        memberPhoto.hidden = true;
        URL.revokeObjectURL(photoObjectUrl);
      };
    } catch (_) {
      memberPhoto.hidden = true;
    }
  }
  document.getElementById('memberId').textContent = id || '-';
  document.getElementById('memberIdBack').textContent = id || '-';
  document.getElementById('memberSince').textContent = formatDate(participant.created_at);
  document.getElementById('memberRegion').textContent = [participant.kabupaten, participant.provinsi].filter(Boolean).join(', ') || 'Indonesia';

  const url = new URL('/program/ketahanan-pangan/verifikasi/', window.location.origin);
  url.searchParams.set('registration_id', id);
  url.searchParams.set('source', 'member_card_qr');
  verificationUrl = url.toString();
  document.getElementById('verifyLink').href = verificationUrl;
  renderQr(document.getElementById('memberQr'), verificationUrl);
  const backQr = document.getElementById('memberQrBack');
  if (backQr) renderQr(backQr, verificationUrl);

  loadingState.hidden = true;
  errorState.hidden = true;
  cardView.hidden = false;
}

async function copyVerificationLink() {
  if (!verificationUrl) return;
  const button = document.getElementById('copyVerifyBtn');
  const original = button.textContent;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(verificationUrl);
    } else {
      const area = document.createElement('textarea');
      area.value = verificationUrl;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    button.textContent = 'Link Tersalin ✓';
  } catch (_) {
    button.textContent = 'Gagal Menyalin';
  } finally {
    window.setTimeout(() => { button.textContent = original; }, 1800);
  }
}

document.getElementById('printBtn').addEventListener('click', () => window.print());
document.getElementById('copyVerifyBtn').addEventListener('click', copyVerificationLink);

(async function init() {
  try {
    const data = await requestMe();
    if (!data.authenticated || !data.participant) {
      showError('Sesi login diperlukan', 'Masuk ke akun peserta terlebih dahulu untuk membuka Kartu Anggota Digital.', '../', 'Login / Dashboard');
      return;
    }
    const status = String(data.participant.status || '').toLowerCase();
    const memberStatus = String(data.participant.member_verification_status || 'not_submitted').toLowerCase();
    if (status !== 'verified') {
      showError('Kartu belum tersedia', 'Kartu Anggota Digital hanya tersedia setelah status registrasi menjadi Terverifikasi.', '../', 'Lihat Dashboard');
      return;
    }
    if (memberStatus !== 'approved') {
      const message = memberStatus === 'pending'
        ? 'Foto anggota sudah dikirim dan sedang menunggu review admin.'
        : memberStatus === 'rejected'
          ? (data.participant.member_verification_review_note || 'Foto anggota perlu direkam ulang sesuai hasil review admin.')
          : 'Rekam foto setengah badan langsung dari kamera dan tunggu persetujuan admin untuk mengaktifkan VERIFIED MEMBER.';
      showError('VERIFIED MEMBER belum aktif', message, '../verifikasi-anggota/', memberStatus === 'pending' ? 'Lihat Status Verifikasi' : 'Rekam Foto Anggota');
      return;
    }
    await showCard(data.participant);
  } catch (error) {
    showError('Kartu belum dapat ditampilkan', error?.message || 'Periksa koneksi internet lalu coba kembali melalui dashboard peserta.');
  }
})();
