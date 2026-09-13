const API = 'https://peserta-api.srilexbuditra.work';
const authView = document.getElementById('authView'),
  dashboardView = document.getElementById('dashboardView'),
  message = document.getElementById('authMessage');
const normalizeId = v => String(v || '').trim().toUpperCase().replace(/\s+/g, '');
const normalizeWa = v => String(v || '').replace(/\D/g, '').replace(/^0/, '62');
let currentRegistrationId = '';
let lastParticipantRefreshAt = null;
let lastKnownParticipantStatus = '';
let lastKnownAdminNote = '';
let lastKnownStatusNote = '';
let participantSyncInFlight = false;
let lastParticipantSyncRequestAt = 0;
const AUTO_SYNC_MIN_INTERVAL_MS = 90 * 1000;

// V5.3 — Status koneksi & pemulihan sinkronisasi peserta.
function setConnectionState(state = 'online', label = '') {
  const wrap = document.getElementById('connectionState');
  const text = document.getElementById('connectionStateText');
  if (!wrap || !text) return;

  const safeState = ['online', 'offline', 'syncing', 'error'].includes(state) ? state : 'online';
  const labels = {
    online: 'Online',
    offline: 'Offline',
    syncing: 'Menyinkronkan…',
    error: 'Sinkronisasi gagal'
  };
  const titles = {
    online: 'Dashboard terhubung. Data dapat disinkronkan dengan server.',
    offline: 'Tidak ada koneksi internet. Data terakhir tetap ditampilkan.',
    syncing: 'Dashboard sedang mengambil data terbaru dari server.',
    error: 'Sinkronisasi belum berhasil. Data terakhir tetap ditampilkan.'
  };

  wrap.dataset.state = safeState;
  wrap.title = titles[safeState];
  text.textContent = label || labels[safeState];
}

function setConnectionStateFromNavigator() {
  setConnectionState(navigator.onLine === false ? 'offline' : 'online');
}

function msg(type, text) {
  message.className = 'message show ' + type;
  message.textContent = text;
}

function clearMsg() {
  message.className = 'message';
  message.textContent = '';
}


const MEMBER_PHOTO_SUCCESS_KEY = 'memberPhotoUploadSuccess';

function showPhotoUploadSuccessNotice() {
  const notice = document.getElementById('photoUploadSuccessNotice');
  const text = document.getElementById('photoUploadSuccessText');
  if (!notice) return;

  let payload = null;
  try {
    const raw = sessionStorage.getItem(MEMBER_PHOTO_SUCCESS_KEY);
    sessionStorage.removeItem(MEMBER_PHOTO_SUCCESS_KEY);
    if (raw) payload = JSON.parse(raw);
  } catch (_) {}

  if (!payload || !payload.at || (Date.now() - Number(payload.at) > 120000)) return;
  if (text && payload.message) text.textContent = payload.message;
  notice.hidden = false;
  window.setTimeout(() => {
    notice.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 120);
}

function hidePhotoUploadSuccessNotice() {
  const notice = document.getElementById('photoUploadSuccessNotice');
  if (notice) notice.hidden = true;
}

document.querySelectorAll('.tab').forEach(b => b.onclick = () => {
  document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === b));
  document.querySelectorAll('.form').forEach(x => x.classList.toggle('active', x.dataset.panel === b.dataset.tab));
  clearMsg();
});

document.querySelectorAll('.showpass').forEach(b => b.onclick = () => {
  const i = b.parentElement.querySelector('input');
  i.type = i.type === 'password' ? 'text' : 'password';
  b.textContent = i.type === 'password' ? 'Lihat' : 'Sembunyikan';
});

async function request(path, options = {}) {
  const r = await fetch(API + path, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    },
    cache: 'no-store'
  });
  let d = {};
  try { d = await r.json(); } catch {}
  if (!r.ok) throw Object.assign(new Error(d.message || 'Permintaan belum dapat diproses.'), { status: r.status });
  return d;
}

function statusLabel(s) {
  return ({
    submitted: 'Registrasi diterima',
    pending: 'Dalam proses',
    verified: 'Terverifikasi',
    revision: 'Perlu perbaikan',
    resubmitted: 'Menunggu pemeriksaan ulang',
    rejected: 'Tidak disetujui',
    approved: 'Disetujui'
  })[String(s || '').toLowerCase()] || String(s || '-');
}

function getStatusPresentation(status) {
  const s = String(status || '').toLowerCase();
  const map = {
    submitted: {
      icon: '◷',
      hero: 'Registrasi Anda sudah diterima dan masuk ke antrean pemeriksaan.',
      title: 'Tunggu pemeriksaan admin',
      text: 'Data sudah tercatat. Anda belum perlu melakukan tindakan lain saat ini.'
    },
    pending: {
      icon: '⌕',
      hero: 'Data Anda sedang diperiksa oleh admin.',
      title: 'Pemeriksaan sedang berlangsung',
      text: 'Pantau dashboard secara berkala. Admin akan memperbarui status setelah pemeriksaan selesai.'
    },
    verified: {
      icon: '✓',
      hero: 'Data Anda telah diverifikasi. Kartu atau sertifikat digital sudah dapat diakses.',
      title: 'Simpan kartu / sertifikat digital Anda',
      text: 'Tahapan utama sudah selesai. Gunakan menu Aksi Peserta untuk membuka dokumen digital.'
    },
    approved: {
      icon: '✓',
      hero: 'Data Anda telah disetujui.',
      title: 'Pendaftaran telah disetujui',
      text: 'Pantau dashboard untuk layanan atau informasi lanjutan yang tersedia.'
    },
    revision: {
      icon: '!',
      hero: 'Admin meminta perbaikan pada data pendaftaran Anda.',
      title: 'Perbaiki data yang diminta admin',
      text: 'Baca Catatan dari Admin, lalu lengkapi formulir Perbaikan Data di bawah ini agar pemeriksaan dapat dilanjutkan.'
    },
    resubmitted: {
      icon: '↻',
      hero: 'Perbaikan Anda sudah terkirim dan menunggu pemeriksaan ulang.',
      title: 'Perbaikan sudah diterima',
      text: 'Tidak perlu mengirim ulang. Tunggu admin menyelesaikan pemeriksaan berikutnya.'
    },
    rejected: {
      icon: '×',
      hero: 'Pendaftaran belum dapat disetujui.',
      title: 'Periksa informasi dari admin',
      text: 'Baca catatan pemeriksaan. Hubungi pengelola program bila Anda memerlukan penjelasan lebih lanjut.'
    }
  };
  return map[s] || map.pending;
}

function renderNextActionControl(status, participant = {}) {
  const s = String(status || '').toLowerCase();
  const button = document.getElementById('nextActionPrimaryBtn');
  const hint = document.getElementById('nextActionHint');
  if (!button || !hint) return;

  const adminNote = String(participant.admin_note || '').trim();
  const config = {
    submitted: { label: '↻ Cek Status Terbaru', action: 'refresh', hint: 'Registrasi sudah masuk. Tidak perlu mengirim data ulang.' },
    pending: { label: '↻ Cek Status Terbaru', action: 'refresh', hint: 'Tidak ada tindakan wajib selama pemeriksaan berlangsung.' },
    verified: { label: '▣ Buka Kartu / Sertifikat', action: 'certificate', hint: 'Dokumen digital peserta sudah tersedia.' },
    approved: { label: '↻ Cek Status Terbaru', action: 'refresh', hint: 'Pendaftaran sudah disetujui. Pantau informasi lanjutan di dashboard.' },
    revision: { label: '✎ Perbaiki Data Sekarang', action: 'revision', hint: 'Tindakan diperlukan agar pemeriksaan dapat dilanjutkan.' },
    resubmitted: { label: '↻ Cek Status Terbaru', action: 'refresh', hint: 'Perbaikan sudah terkirim. Jangan mengirim ulang kecuali diminta admin.' },
    rejected: adminNote
      ? { label: 'i Lihat Catatan Admin', action: 'admin-note', hint: 'Baca alasan atau petunjuk dari admin sebelum mengambil langkah berikutnya.' }
      : { label: '⌕ Lihat Keterangan Status', action: 'status-note', hint: 'Baca keterangan status yang tersedia pada dashboard.' }
  }[s] || { label: '↻ Cek Status Terbaru', action: 'refresh', hint: 'Gunakan tombol ini untuk mengambil status terbaru dari server.' };

  button.dataset.action = config.action;
  button.textContent = config.label;
  button.hidden = false;
  hint.textContent = config.hint;
}

function date(v) {
  if (!v) return '-';
  const d = new Date(String(v).includes('T') ? v : String(v).replace(' ', 'T') + 'Z');
  return Number.isNaN(d.getTime()) ? v : new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  }).format(d);
}

function participantInitials(name) {
  const parts = String(name || 'Peserta').trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || 'P') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

function formatRefreshTime(value = new Date()) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(d);
}

function setLastUpdated(value = new Date(), state = '') {
  lastParticipantRefreshAt = value instanceof Date ? value : new Date(value);
  const text = document.getElementById('lastUpdatedText');
  const wrap = document.querySelector('.status-sync');
  if (text) text.textContent = 'Terakhir diperbarui: ' + formatRefreshTime(lastParticipantRefreshAt);
  if (wrap) {
    wrap.classList.remove('is-ok', 'is-error');
    if (state) wrap.classList.add(state);
  }
}

function updateTimelineStates(items) {
  items.forEach(item => {
    const state = item.querySelector('.timeline-state');
    if (!state) return;
    if (item.classList.contains('stopped')) state.textContent = 'Perlu tindakan';
    else if (item.classList.contains('done')) state.textContent = 'Selesai';
    else if (item.classList.contains('active')) state.textContent = 'Sedang berjalan';
    else state.textContent = 'Menunggu';
  });
}

function renderParticipantTimeline(status) {
  const s = String(status || '').toLowerCase();
  const timeline = document.getElementById('participantTimeline');
  const summary = document.getElementById('progressSummary');
  const alert = document.getElementById('progressAlert');
  if (!timeline || !summary || !alert) return;
  timeline.dataset.status = s || 'pending';

  const items = [...timeline.querySelectorAll('li')];
  items.forEach(item => item.classList.remove('done', 'active', 'stopped'));
  alert.hidden = true;
  alert.className = 'progress-alert';
  alert.textContent = '';

  let activeIndex = 1;
  if (s === 'submitted') activeIndex = 0;
  if (s === 'pending' || !s) activeIndex = 1;
  if (s === 'verified' || s === 'approved') activeIndex = 3;
  if (s === 'revision' || s === 'rejected') activeIndex = 1;
  if (s === 'resubmitted') activeIndex = 1;

  items.forEach((item, index) => {
    if (index < activeIndex) item.classList.add('done');
    else if (index === activeIndex) item.classList.add('active');
  });

  if (s === 'verified' || s === 'approved') {
    items.forEach(item => { item.classList.remove('active'); item.classList.add('done'); });
    summary.textContent = 'Seluruh tahapan utama telah selesai.';
  } else if (s === 'revision') {
    items[1]?.classList.add('stopped');
    summary.textContent = 'Pemeriksaan membutuhkan perbaikan data.';
    alert.hidden = false;
    alert.classList.add('revision');
    alert.textContent = 'Perlu perbaikan: ikuti petunjuk pengelola program sebelum proses dilanjutkan.';
  } else if (s === 'resubmitted') {
    summary.textContent = 'Perbaikan telah dikirim dan menunggu pemeriksaan ulang admin.';
    alert.hidden = false;
    alert.textContent = 'Perbaikan terkirim. Admin akan memeriksa kembali data dan dokumen Anda.';
  } else if (s === 'rejected') {
    items[1]?.classList.add('stopped');
    summary.textContent = 'Proses berhenti pada tahap pemeriksaan.';
    alert.hidden = false;
    alert.classList.add('rejected');
    alert.textContent = 'Pendaftaran belum dapat disetujui. Hubungi pengelola program bila memerlukan informasi lebih lanjut.';
  } else if (s === 'submitted') {
    summary.textContent = 'Registrasi telah diterima dan menunggu pemeriksaan.';
  } else {
    summary.textContent = 'Data peserta sedang dalam tahap pemeriksaan.';
  }

  updateTimelineStates(items);
}

function hideStatusChangeNotice() {
  const notice = document.getElementById('statusChangeNotice');
  if (notice) notice.hidden = true;
}

function hideAdminUpdateNotice() {
  const notice = document.getElementById('adminUpdateNotice');
  if (notice) notice.hidden = true;
}

function normalizeNoticeText(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function showAdminUpdateNotice(previousAdminNote, nextAdminNote, previousStatusNote, nextStatusNote, statusChanged = false) {
  const notice = document.getElementById('adminUpdateNotice');
  const title = document.getElementById('adminUpdateTitle');
  const text = document.getElementById('adminUpdateText');
  const action = document.getElementById('adminUpdateActionBtn');
  if (!notice || !title || !text || !action) return false;

  if (statusChanged) {
    hideAdminUpdateNotice();
    return false;
  }

  const prevAdmin = normalizeNoticeText(previousAdminNote);
  const nextAdmin = normalizeNoticeText(nextAdminNote);
  const prevStatus = normalizeNoticeText(previousStatusNote);
  const nextStatus = normalizeNoticeText(nextStatusNote);
  const adminChanged = Boolean(nextAdmin && nextAdmin !== prevAdmin);
  const statusNoteChanged = Boolean(nextStatus && nextStatus !== prevStatus);

  if (!adminChanged && !statusNoteChanged) {
    hideAdminUpdateNotice();
    return false;
  }

  if (adminChanged) {
    title.textContent = 'Ada catatan baru dari admin';
    text.textContent = 'Admin memperbarui Catatan Pemeriksaan. Buka catatan untuk melihat petunjuk terbaru.';
    action.dataset.target = 'adminNoteCard';
    action.textContent = 'Lihat catatan admin ↓';
  } else {
    title.textContent = 'Keterangan status diperbarui';
    text.textContent = 'Ada informasi terbaru terkait status pendaftaran Anda.';
    action.dataset.target = 'statusNote';
    action.textContent = 'Lihat keterangan ↓';
  }

  notice.hidden = false;
  return true;
}

function showStatusChangeNotice(previousStatus, nextStatus) {
  const prev = String(previousStatus || '').toLowerCase();
  const next = String(nextStatus || '').toLowerCase();
  if (!prev || !next || prev === next) {
    hideStatusChangeNotice();
    return false;
  }

  const notice = document.getElementById('statusChangeNotice');
  const icon = document.getElementById('statusChangeIcon');
  const title = document.getElementById('statusChangeTitle');
  const text = document.getElementById('statusChangeText');
  const action = document.getElementById('statusChangeActionBtn');
  if (!notice || !icon || !title || !text || !action) return false;

  const presentation = getStatusPresentation(next);
  notice.dataset.status = next || 'pending';
  icon.textContent = presentation.icon || '↻';
  title.textContent = 'Status berubah menjadi ' + statusLabel(next);
  text.textContent = 'Sebelumnya: ' + statusLabel(prev) + ' → Sekarang: ' + statusLabel(next) + '. ' + presentation.text;

  let targetId = 'nextActionCard';
  let actionLabel = 'Lihat langkah berikutnya ↓';
  if (next === 'revision') {
    targetId = 'revisionCard';
    actionLabel = 'Buka perbaikan data ↓';
  } else if (next === 'verified') {
    targetId = 'certificateBtn';
    actionLabel = 'Buka sertifikat ↓';
  } else if (next === 'rejected') {
    targetId = 'adminNoteCard';
    actionLabel = 'Lihat catatan admin ↓';
  }
  action.dataset.target = targetId;
  action.textContent = actionLabel;
  notice.hidden = false;
  return true;
}

// V12.1 — Dashboard Peserta V2: ringkasan keanggotaan dan kesiapan layanan.
function getMemberExperience(status) {
  const s = String(status || '').toLowerCase();
  const map = {
    submitted: { label: 'Peserta terdaftar', text: 'Registrasi sudah diterima dan menunggu pemeriksaan.', progress: 25, progressText: 'Registrasi selesai. Tahap berikutnya adalah pemeriksaan data.', access: 'Dashboard & verifikasi aktif', accessText: 'Sertifikat akan terbuka setelah status terverifikasi.' },
    pending: { label: 'Dalam pemeriksaan', text: 'Data peserta sedang diperiksa oleh admin.', progress: 50, progressText: 'Pemeriksaan data sedang berlangsung.', access: 'Dashboard & verifikasi aktif', accessText: 'Pantau status dan catatan admin dari dashboard.' },
    revision: { label: 'Perlu perbaikan data', text: 'Ada bagian data yang perlu diperbaiki sebelum pemeriksaan dilanjutkan.', progress: 45, progressText: 'Perbaiki data yang diminta agar proses dapat dilanjutkan.', access: 'Dashboard & perbaikan aktif', accessText: 'Sertifikat belum tersedia selama perbaikan berlangsung.' },
    resubmitted: { label: 'Menunggu pemeriksaan ulang', text: 'Perbaikan telah terkirim dan menunggu pemeriksaan ulang.', progress: 60, progressText: 'Perbaikan diterima. Menunggu pemeriksaan ulang admin.', access: 'Dashboard & verifikasi aktif', accessText: 'Status akan diperbarui setelah pemeriksaan ulang selesai.' },
    verified: { label: 'Registrasi terverifikasi', text: 'Data registrasi telah diverifikasi. Sertifikat tersedia; VERIFIED MEMBER memerlukan rekam foto dan review admin.', progress: 85, progressText: 'Lanjutkan Verifikasi Anggota + Foto untuk mengaktifkan kartu anggota.', access: 'Sertifikat aktif · Kartu menunggu verifikasi anggota', accessText: 'Rekam foto langsung dari kamera lalu tunggu review admin untuk mengaktifkan VERIFIED MEMBER.' },
    approved: { label: 'Pendaftaran disetujui', text: 'Pendaftaran telah disetujui dan menunggu layanan lanjutan sesuai program.', progress: 90, progressText: 'Pendaftaran disetujui. Pantau informasi lanjutan di dashboard.', access: 'Dashboard & verifikasi aktif', accessText: 'Layanan lanjutan mengikuti status program.' },
    rejected: { label: 'Perlu tindak lanjut', text: 'Pendaftaran belum dapat disetujui. Baca catatan admin untuk informasi berikutnya.', progress: 40, progressText: 'Proses berhenti pada tahap pemeriksaan.', access: 'Dashboard informasi aktif', accessText: 'Baca catatan admin atau keterangan status yang tersedia.' }
  };
  return map[s] || map.pending;
}

function renderMemberExperience(participant = {}) {
  const s = String(participant.status || '').toLowerCase();
  const experience = getMemberExperience(s);
  const wrap = document.getElementById('memberOverview');
  const label = document.getElementById('memberStatusLabel');
  const text = document.getElementById('memberStatusText');
  const progressValue = document.getElementById('memberProgressValue');
  const progressBar = document.getElementById('memberProgressBar');
  const progressText = document.getElementById('memberProgressText');
  const accessLabel = document.getElementById('memberAccessLabel');
  const accessText = document.getElementById('memberAccessText');
  const certificateService = document.getElementById('memberCertificateService');
  const certificateState = document.getElementById('memberCertificateState');
  const certificateBadge = document.getElementById('memberCertificateBadge');
  const memberIdentityService = document.getElementById('memberIdentityService');
  const memberIdentityState = document.getElementById('memberIdentityState');
  const memberIdentityBadge = document.getElementById('memberIdentityBadge');
  const memberIdentityReviewNote = document.getElementById('memberIdentityReviewNote');
  const memberIdentityReviewNoteText = document.getElementById('memberIdentityReviewNoteText');
  const memberIdentityActionHint = document.getElementById('memberIdentityActionHint');
  const memberCardService = document.getElementById('memberCardService');
  const memberCardState = document.getElementById('memberCardState');
  const memberCardBadge = document.getElementById('memberCardBadge');

  if (wrap) wrap.dataset.status = s || 'pending';
  if (label) label.textContent = experience.label;
  if (text) text.textContent = experience.text;
  if (progressValue) progressValue.textContent = experience.progress + '%';
  if (progressBar) progressBar.style.width = experience.progress + '%';
  if (progressText) progressText.textContent = experience.progressText;
  if (accessLabel) accessLabel.textContent = experience.access;
  if (accessText) accessText.textContent = experience.accessText;

  if (certificateService && certificateState && certificateBadge) {
    const isVerified = s === 'verified';
    certificateService.classList.toggle('is-active', isVerified);
    certificateService.classList.toggle('is-locked', !isVerified);
    certificateService.setAttribute('aria-disabled', isVerified ? 'false' : 'true');
    if (isVerified && participant.registration_id) {
      certificateService.href = '../verifikasi/sertifikat/?registration_id=' + encodeURIComponent(participant.registration_id);
      certificateState.textContent = 'Sertifikat digital tersedia untuk peserta terverifikasi.';
      certificateBadge.textContent = 'AKTIF';
    } else {
      certificateService.href = '#';
      certificateState.textContent = 'Tersedia setelah peserta terverifikasi.';
      certificateBadge.textContent = 'TERKUNCI';
    }
  }

  const memberStatus = String(participant.member_verification_status || 'not_submitted').toLowerCase();
  const registrationVerified = s === 'verified';
  const memberApproved = registrationVerified && memberStatus === 'approved';

  if (memberIdentityService && memberIdentityState && memberIdentityBadge) {
    const identityEnabled = registrationVerified && memberStatus !== 'approved';
    const reviewNote = String(participant.member_verification_review_note || '').trim();

    memberIdentityService.classList.toggle('is-active', identityEnabled || memberApproved);
    memberIdentityService.classList.toggle('is-locked', !registrationVerified);
    memberIdentityService.classList.remove('is-member-ready', 'is-member-pending', 'is-member-rejected', 'is-member-approved');
    memberIdentityService.setAttribute('aria-disabled', registrationVerified ? 'false' : 'true');

    if (memberIdentityReviewNote) memberIdentityReviewNote.hidden = true;
    if (memberIdentityReviewNoteText) memberIdentityReviewNoteText.textContent = '';
    if (memberIdentityActionHint) memberIdentityActionHint.hidden = true;

    if (!registrationVerified) {
      memberIdentityService.href = '#';
      memberIdentityState.textContent = 'Tersedia setelah status registrasi Terverifikasi.';
      memberIdentityBadge.textContent = 'TERKUNCI';
      memberIdentityService.setAttribute('aria-label', 'Verifikasi Anggota + Foto terkunci. Tersedia setelah registrasi terverifikasi.');
    } else if (memberStatus === 'approved') {
      memberIdentityService.href = './verifikasi-anggota/';
      memberIdentityService.classList.add('is-member-approved');
      memberIdentityState.textContent = 'Foto anggota telah disetujui admin. Verifikasi anggota selesai.';
      memberIdentityBadge.textContent = 'TERVERIFIKASI';
      memberIdentityService.setAttribute('aria-label', 'Verifikasi Anggota + Foto terverifikasi. Buka detail verifikasi anggota.');
      if (memberIdentityActionHint) {
        memberIdentityActionHint.textContent = 'Lihat Verifikasi Foto →';
        memberIdentityActionHint.hidden = false;
      }
    } else if (memberStatus === 'pending') {
      memberIdentityService.href = './verifikasi-anggota/';
      memberIdentityService.classList.add('is-member-pending');
      memberIdentityState.textContent = 'Foto sudah dikirim. Saat ini sedang diperiksa oleh admin.';
      memberIdentityBadge.textContent = 'MENUNGGU VERIFIKASI';
      memberIdentityService.setAttribute('aria-label', 'Verifikasi Anggota + Foto sedang menunggu pemeriksaan admin.');
      if (memberIdentityActionHint) {
        memberIdentityActionHint.textContent = 'Lihat Status Foto →';
        memberIdentityActionHint.hidden = false;
      }
    } else if (memberStatus === 'rejected') {
      memberIdentityService.href = './verifikasi-anggota/';
      memberIdentityService.classList.add('is-member-rejected');
      memberIdentityState.textContent = 'Foto belum dapat disetujui. Perbaiki sesuai catatan admin.';
      memberIdentityBadge.textContent = 'PERLU DIPERBAIKI';
      memberIdentityService.setAttribute('aria-label', 'Foto anggota perlu diperbaiki. Buka untuk membaca catatan admin dan mengirim ulang foto.');
      if (memberIdentityReviewNote && memberIdentityReviewNoteText) {
        memberIdentityReviewNoteText.textContent = reviewNote || 'Admin meminta Anda mengambil dan mengirim ulang foto anggota.';
        memberIdentityReviewNote.hidden = false;
      }
      if (memberIdentityActionHint) {
        memberIdentityActionHint.textContent = 'Kirim Ulang Foto →';
        memberIdentityActionHint.hidden = false;
      }
    } else {
      memberIdentityService.href = './verifikasi-anggota/';
      memberIdentityService.classList.add('is-member-ready');
      memberIdentityState.textContent = 'Ambil foto setengah badan langsung dari kamera untuk verifikasi anggota.';
      memberIdentityBadge.textContent = 'SIAP DIREKAM';
      memberIdentityService.setAttribute('aria-label', 'Verifikasi Anggota + Foto siap dilakukan. Buka kamera untuk merekam foto.');
      if (memberIdentityActionHint) {
        memberIdentityActionHint.textContent = 'Mulai Verifikasi Foto →';
        memberIdentityActionHint.hidden = false;
      }
    }
  }

  if (memberCardService && memberCardState && memberCardBadge) {
    memberCardService.classList.toggle('is-active', memberApproved);
    memberCardService.classList.toggle('is-locked', !memberApproved);
    memberCardService.setAttribute('aria-disabled', memberApproved ? 'false' : 'true');
    if (memberApproved) {
      memberCardService.href = './kartu/';
      memberCardState.textContent = 'VERIFIED MEMBER aktif. Kartu menampilkan foto anggota yang disetujui.';
      memberCardBadge.textContent = 'AKTIF';
      if (label) label.textContent = 'VERIFIED MEMBER';
      if (text) text.textContent = 'Registrasi dan foto anggota telah disetujui. Identitas digital anggota aktif.';
      if (progressValue) progressValue.textContent = '100%';
      if (progressBar) progressBar.style.width = '100%';
      if (progressText) progressText.textContent = 'Verifikasi anggota selesai. Kartu Anggota + QR aktif.';
      if (accessLabel) accessLabel.textContent = 'VERIFIED MEMBER aktif';
      if (accessText) accessText.textContent = 'Kartu Anggota + QR, sertifikat digital, dan verifikasi publik tersedia.';
    } else {
      memberCardService.href = '#';
      memberCardState.textContent = registrationVerified
        ? (memberStatus === 'rejected'
          ? 'Belum aktif karena foto anggota perlu diperbaiki dan dikirim ulang.'
          : memberStatus === 'pending'
            ? 'Belum aktif. Menunggu foto anggota disetujui admin.'
            : 'Aktif otomatis setelah foto anggota disetujui admin.')
        : 'Tersedia setelah registrasi dan verifikasi anggota selesai.';
      memberCardBadge.textContent = 'TERKUNCI';
    }
  }
}

function showDashboard(p) {
  authView.hidden = true;
  dashboardView.hidden = false;
  document.body.classList.add('is-authenticated');
  setLastUpdated(new Date());
  setConnectionStateFromNavigator();

  const s = String(p.status || '').toLowerCase();
  const presentation = getStatusPresentation(s);
  currentRegistrationId = p.registration_id || '';

  document.getElementById('dashName').textContent = p.nama || 'Peserta';
  document.getElementById('dashId').textContent = p.registration_id || '-';
  document.getElementById('dashStatus').textContent = statusLabel(p.status);
  document.getElementById('dashDate').textContent = date(p.created_at);
  document.getElementById('dashRegion').textContent = [p.kabupaten, p.provinsi].filter(Boolean).join(', ') || '-';
  document.getElementById('infoId').textContent = p.registration_id || '-';
  document.getElementById('infoName').textContent = p.nama || '-';
  document.getElementById('infoApplicant').textContent = p.status_pemohon || '-';
  document.getElementById('infoCommodity').textContent = p.komoditas || '-';
  document.getElementById('infoFertilizer').textContent = p.jenis_pupuk || '-';
  document.getElementById('participantAvatar').textContent = participantInitials(p.nama);
  document.getElementById('heroStatus').textContent = statusLabel(p.status);
  document.getElementById('heroStatusText').textContent = presentation.hero;
  document.getElementById('nextActionIcon').textContent = presentation.icon;
  document.getElementById('nextActionTitle').textContent = presentation.title;
  document.getElementById('nextActionText').textContent = presentation.text;
  renderNextActionControl(s, p);

  const statusHero = document.getElementById('statusHero');
  const nextActionCard = document.getElementById('nextActionCard');
  const statusSummaryCard = document.getElementById('statusSummaryCard');
  const dashStatusIcon = document.getElementById('dashStatusIcon');
  if (statusHero) statusHero.dataset.status = s || 'pending';
  if (nextActionCard) nextActionCard.dataset.status = s || 'pending';
  if (statusSummaryCard) statusSummaryCard.dataset.status = s || 'pending';
  if (dashStatusIcon) dashStatusIcon.textContent = presentation.icon || '⌕';

  renderParticipantTimeline(p.status);
  renderMemberExperience(p);

  const note = document.getElementById('statusNote'),
    adminCard = document.getElementById('adminNoteCard'),
    adminText = document.getElementById('adminNoteText'),
    cert = document.getElementById('certificateBtn');

  if (adminCard && adminText) {
    const adminNote = String(p.admin_note || '').trim();
    adminText.textContent = adminNote;
    adminCard.hidden = !adminNote;
    adminCard.dataset.status = s;
  }

  const revisionCard = document.getElementById('revisionCard');
  if (revisionCard) {
    revisionCard.hidden = s !== 'revision';
    if (s === 'revision') {
      const rf = document.getElementById('revisionForm');
      const vals = ['status_pemohon','kelompok_tani','luas_lahan','status_lahan','komoditas','tahap','jenis_pupuk','kebutuhan_kg','keterangan'];
      vals.forEach(name => {
        const el = rf?.elements?.namedItem(name);
        if (el) el.value = p[name] ?? '';
      });
    }
  }

  cert.hidden = true;
  if (s === 'verified') {
    note.textContent = 'Pendaftaran Anda telah terverifikasi. Sertifikat digital tersedia.';
    cert.href = '../verifikasi/sertifikat/?registration_id=' + encodeURIComponent(p.registration_id);
    cert.hidden = false;
  } else if (s === 'revision') {
    note.textContent = p.status_note || 'Pendaftaran memerlukan perbaikan. Silakan mengikuti petunjuk dari pengelola program.';
  } else if (s === 'resubmitted') {
    note.textContent = 'Perbaikan Anda telah dikirim dan sedang menunggu pemeriksaan ulang admin.';
  } else if (s === 'rejected') {
    note.textContent = p.status_note || 'Pendaftaran belum dapat disetujui. Hubungi pengelola program bila memerlukan informasi lebih lanjut.';
  } else {
    note.textContent = 'Pendaftaran Anda sedang diproses. Status akan diperbarui setelah pemeriksaan admin.';
  }

  lastKnownParticipantStatus = s;
  lastKnownAdminNote = normalizeNoticeText(p.admin_note);
  lastKnownStatusNote = normalizeNoticeText(p.status_note);
}

function showAuth() {
  dashboardView.hidden = true;
  authView.hidden = false;
  document.body.classList.remove('is-authenticated');
  currentRegistrationId = '';
  lastKnownParticipantStatus = '';
  lastKnownAdminNote = '';
  lastKnownStatusNote = '';
  hideStatusChangeNotice();
  hideAdminUpdateNotice();
}

async function copyText(value) {
  const text = String(value || '').trim();
  if (!text) throw new Error('Nomor registrasi belum tersedia.');
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand('copy');
  area.remove();
  if (!ok) throw new Error('Browser tidak mengizinkan penyalinan otomatis.');
}

function bindCopyButton(button, mode = 'compact') {
  if (!button) return;
  button.addEventListener('click', async () => {
    const strong = mode === 'action' ? button.querySelector('strong') : null;
    const original = strong ? strong.textContent : button.textContent;
    try {
      await copyText(currentRegistrationId);
      if (strong) strong.textContent = 'Nomor Registrasi Tersalin';
      else button.textContent = '✓ Tersalin';
    } catch {
      if (strong) strong.textContent = 'Gagal menyalin';
      else button.textContent = 'Gagal';
    }
    window.setTimeout(() => {
      if (strong) strong.textContent = original;
      else button.textContent = original;
    }, 1800);
  });
}

bindCopyButton(document.getElementById('copyRegistrationBtn'));
bindCopyButton(document.getElementById('copyRegistrationAction'), 'action');


const memberCertificateService = document.getElementById('memberCertificateService');
if (memberCertificateService) memberCertificateService.addEventListener('click', event => {
  if (memberCertificateService.getAttribute('aria-disabled') === 'true') event.preventDefault();
});

const memberIdentityService = document.getElementById('memberIdentityService');
if (memberIdentityService) memberIdentityService.addEventListener('click', event => {
  if (memberIdentityService.getAttribute('aria-disabled') === 'true') event.preventDefault();
});

const memberCardService = document.getElementById('memberCardService');
if (memberCardService) memberCardService.addEventListener('click', event => {
  if (memberCardService.getAttribute('aria-disabled') === 'true') event.preventDefault();
});

const nextActionPrimaryBtn = document.getElementById('nextActionPrimaryBtn');
if (nextActionPrimaryBtn) nextActionPrimaryBtn.addEventListener('click', () => {
  const action = nextActionPrimaryBtn.dataset.action || 'refresh';
  if (action === 'refresh') {
    document.getElementById('refreshParticipantBtn')?.click();
    document.getElementById('statusHero')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  if (action === 'certificate') {
    const certificate = document.getElementById('certificateBtn');
    if (certificate && !certificate.hidden) { certificate.click(); return; }
  }
  if (action === 'revision') {
    const target = document.getElementById('revisionCard');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => target?.querySelector('input, textarea, button')?.focus({ preventScroll: true }), 450);
    return;
  }
  if (action === 'admin-note') {
    const target = document.getElementById('adminNoteCard');
    if (target && !target.hidden) { target.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
  }
  const statusNote = document.getElementById('statusNote');
  statusNote?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});


const statusChangeActionBtn = document.getElementById('statusChangeActionBtn');
if (statusChangeActionBtn) statusChangeActionBtn.addEventListener('click', () => {
  const targetId = statusChangeActionBtn.dataset.target || 'nextActionCard';
  let target = document.getElementById(targetId);
  if (target?.hidden) target = document.getElementById('nextActionCard');
  target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

const photoUploadSuccessActionBtn = document.getElementById('photoUploadSuccessActionBtn');
if (photoUploadSuccessActionBtn) photoUploadSuccessActionBtn.addEventListener('click', () => {
  const target = document.getElementById('memberIdentityService');
  target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

const photoUploadSuccessDismiss = document.getElementById('photoUploadSuccessDismiss');
if (photoUploadSuccessDismiss) photoUploadSuccessDismiss.addEventListener('click', hidePhotoUploadSuccessNotice);

const statusChangeDismiss = document.getElementById('statusChangeDismiss');
if (statusChangeDismiss) statusChangeDismiss.addEventListener('click', hideStatusChangeNotice);

const adminUpdateActionBtn = document.getElementById('adminUpdateActionBtn');
if (adminUpdateActionBtn) adminUpdateActionBtn.addEventListener('click', () => {
  const targetId = adminUpdateActionBtn.dataset.target || 'adminNoteCard';
  let target = document.getElementById(targetId);
  if (target?.hidden) target = document.getElementById('statusNote');
  target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => target?.focus?.({ preventScroll: true }), 350);
});

const adminUpdateDismiss = document.getElementById('adminUpdateDismiss');
if (adminUpdateDismiss) adminUpdateDismiss.addEventListener('click', hideAdminUpdateNotice);

const refreshParticipantBtn = document.getElementById('refreshParticipantBtn');
const defaultRefreshLabel = '↻ Perbarui status';

// V5.1 — Sinkron otomatis saat peserta kembali ke tab/dashboard.
function participantDashboardReady() {
  return Boolean(currentRegistrationId && dashboardView && !dashboardView.hidden);
}

function participantStatusIsStale() {
  const lastVisibleUpdate = lastParticipantRefreshAt instanceof Date ? lastParticipantRefreshAt.getTime() : 0;
  const reference = Math.max(lastVisibleUpdate, lastParticipantSyncRequestAt || 0);
  return !reference || (Date.now() - reference >= AUTO_SYNC_MIN_INTERVAL_MS);
}

async function syncParticipantStatus({ manual = false } = {}) {
  if (participantSyncInFlight || !participantDashboardReady()) return false;

  if (navigator.onLine === false) {
    setConnectionState('offline');
    if (manual) {
      const text = document.getElementById('lastUpdatedText');
      const wrap = document.querySelector('.status-sync');
      if (text) text.textContent = 'Tidak ada koneksi. Data terakhir tetap ditampilkan.';
      if (wrap) { wrap.classList.remove('is-ok'); wrap.classList.add('is-error'); }
      if (refreshParticipantBtn) refreshParticipantBtn.textContent = '↻ Coba lagi';
    }
    return false;
  }

  participantSyncInFlight = true;
  lastParticipantSyncRequestAt = Date.now();
  setConnectionState('syncing');
  if (refreshParticipantBtn) refreshParticipantBtn.setAttribute('aria-busy', 'true');
  if (manual && refreshParticipantBtn) {
    refreshParticipantBtn.disabled = true;
    refreshParticipantBtn.textContent = '↻ Memeriksa…';
  }

  try {
    const previousStatus = lastKnownParticipantStatus;
    const previousAdminNote = lastKnownAdminNote;
    const previousStatusNote = lastKnownStatusNote;
    const d = await request('/me');
    if (!d.authenticated || !d.participant) {
      showAuth();
      msg('error', 'Sesi Anda telah berakhir. Silakan masuk kembali untuk melihat status terbaru.');
      return false;
    }

    showDashboard(d.participant);
    const changed = showStatusChangeNotice(previousStatus, d.participant.status);
    const adminUpdateChanged = showAdminUpdateNotice(
      previousAdminNote,
      d.participant.admin_note,
      previousStatusNote,
      d.participant.status_note,
      changed
    );
    setConnectionState('online');
    setLastUpdated(new Date(), 'is-ok');
    if (!manual && refreshParticipantBtn) refreshParticipantBtn.textContent = defaultRefreshLabel;

    if (manual && refreshParticipantBtn) {
      refreshParticipantBtn.textContent = changed ? '✓ Status berubah' : adminUpdateChanged ? '✓ Ada pesan baru' : '✓ Status terbaru';
      window.setTimeout(() => {
        if (!participantSyncInFlight && !refreshParticipantBtn.disabled) refreshParticipantBtn.textContent = defaultRefreshLabel;
      }, 1600);
    }
    return true;
  } catch (error) {
    setConnectionState(navigator.onLine === false ? 'offline' : 'error');
    if (error?.status === 401 || error?.status === 403) {
      showAuth();
      msg('error', 'Sesi Anda telah berakhir. Silakan masuk kembali untuk melihat status terbaru.');
      return false;
    }

    // Sinkron otomatis dibuat tenang agar tidak mengganggu peserta saat koneksi sesaat bermasalah.
    if (manual) {
      const text = document.getElementById('lastUpdatedText');
      const wrap = document.querySelector('.status-sync');
      if (text) text.textContent = 'Pembaruan gagal. Periksa koneksi lalu coba lagi.';
      if (wrap) { wrap.classList.remove('is-ok'); wrap.classList.add('is-error'); }
      if (refreshParticipantBtn) refreshParticipantBtn.textContent = '↻ Coba lagi';
    }
    return false;
  } finally {
    participantSyncInFlight = false;
    if (refreshParticipantBtn) refreshParticipantBtn.setAttribute('aria-busy', 'false');
    if (manual && refreshParticipantBtn) refreshParticipantBtn.disabled = false;
  }
}

if (refreshParticipantBtn) {
  refreshParticipantBtn.addEventListener('click', () => syncParticipantStatus({ manual: true }));
}

function maybeAutoSyncParticipant() {
  if (document.visibilityState !== 'visible') return;
  if (!participantDashboardReady() || !participantStatusIsStale()) return;
  syncParticipantStatus({ manual: false });
}

document.addEventListener('visibilitychange', maybeAutoSyncParticipant);
window.addEventListener('pageshow', event => {
  if (event.persisted) window.setTimeout(maybeAutoSyncParticipant, 150);
});
window.addEventListener('online', () => {
  setConnectionState('online');
  if (participantDashboardReady()) syncParticipantStatus({ manual: false });
});
window.addEventListener('offline', () => setConnectionState('offline'));

document.getElementById('activateForm').onsubmit = async e => {
  e.preventDefault();
  const form = e.currentTarget;
  clearMsg();
  const f = new FormData(form), pw = f.get('password');
  if (pw !== f.get('password_confirm')) return msg('error', 'Konfirmasi password tidak sama.');
  const btn = e.submitter;
  btn.disabled = true;
  btn.textContent = 'Mengaktifkan…';
  try {
    await request('/activate', {
      method: 'POST',
      body: JSON.stringify({
        registration_id: normalizeId(f.get('registration_id')),
        nik: String(f.get('nik') || '').trim(),
        whatsapp: normalizeWa(f.get('whatsapp')),
        password: pw
      })
    });
    const registrationId = normalizeId(f.get('registration_id'));
    form.reset();
    document.querySelector('[data-tab="login"]').click();
    document.querySelector('#loginForm [name="registration_id"]').value = registrationId;
    msg('ok', 'Akun berhasil diaktifkan. Silakan masuk menggunakan Nomor Registrasi dan password Anda.');

    // GA4: aktivasi dinyatakan berhasil hanya setelah API /activate sukses
    // dan pesan keberhasilan sudah ditampilkan kepada peserta.
    const sendActivationSuccess = (attempt = 0) => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'activation_success', {
          event_category: 'ketahanan_pangan',
          event_label: 'Aktivasi Akun Berhasil',
          transport_type: 'beacon'
        });
        return;
      }
      if (attempt < 10) {
        window.setTimeout(() => sendActivationSuccess(attempt + 1), 200);
      }
    };
    sendActivationSuccess();
  } catch (x) {
    msg('error', x.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Aktifkan Akun';
  }
};

document.getElementById('loginForm').onsubmit = async e => {
  e.preventDefault();
  const form = e.currentTarget;
  clearMsg();
  const f = new FormData(form), btn = e.submitter;
  btn.disabled = true;
  btn.textContent = 'Memeriksa…';
  try {
    const d = await request('/login', {
      method: 'POST',
      body: JSON.stringify({
        registration_id: normalizeId(f.get('registration_id')),
        password: f.get('password')
      })
    });
    showDashboard(d.participant);

    // GA4: login dinyatakan berhasil hanya setelah API /login sukses
    // dan Dashboard Peserta berhasil ditampilkan.
    const sendLoginSuccess = (attempt = 0) => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'login_success', {
          event_category: 'ketahanan_pangan',
          event_label: 'Login Peserta Berhasil',
          transport_type: 'beacon'
        });
        return;
      }
      if (attempt < 10) {
        window.setTimeout(() => sendLoginSuccess(attempt + 1), 200);
      }
    };
    sendLoginSuccess();
    hideStatusChangeNotice();
    hideAdminUpdateNotice();
  } catch (x) {
    msg('error', x.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Masuk ke Dashboard';
  }
};

const revisionForm = document.getElementById('revisionForm');
if (revisionForm) revisionForm.onsubmit = async e => {
  e.preventDefault();
  const form = e.currentTarget;
  const out = document.getElementById('revisionMessage');
  const btn = e.submitter;
  const fd = new FormData(form);
  for (const [k,v] of [...fd.entries()]) {
    if (typeof v === 'string' && !v.trim()) fd.delete(k);
    if (v instanceof File && !v.size) fd.delete(k);
  }
  if (![...fd.keys()].length) {
    out.className = 'message show error';
    out.textContent = 'Belum ada data atau dokumen yang diperbaiki.';
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Mengirim…';
  try {
    const r = await fetch(API + '/revision', {
      method:'POST', body:fd, credentials:'include', headers:{Accept:'application/json'}, cache:'no-store'
    });
    let d={};
    try { d=await r.json(); } catch {}
    if (!r.ok || !d.ok) throw new Error(d.message || 'Perbaikan belum dapat dikirim.');
    out.className = 'message show ok';
    out.textContent = d.message || 'Perbaikan berhasil dikirim.';
    const previousStatus = lastKnownParticipantStatus;
    const previousAdminNote = lastKnownAdminNote;
    const previousStatusNote = lastKnownStatusNote;
    showDashboard(d.participant);
    const changed = showStatusChangeNotice(previousStatus, d.participant?.status);
    showAdminUpdateNotice(previousAdminNote, d.participant?.admin_note, previousStatusNote, d.participant?.status_note, changed);
  } catch (x) {
    out.className = 'message show error';
    out.textContent = x.message;
  } finally {
    btn.disabled=false;
    btn.textContent='Kirim Perbaikan';
  }
};

document.getElementById('logoutBtn').onclick = async () => {
  const btn = document.getElementById('logoutBtn');
  if (btn) btn.disabled = true;
  try {
    await request('/logout', { method: 'POST' });
  } catch (error) {
    console.warn('Logout API gagal, pengguna tetap diarahkan kembali ke halaman registrasi.', error);
  } finally {
    window.location.replace('../registrasi/');
  }
};

(async () => {
  try {
    const d = await request('/me');
    if (d.authenticated && d.participant) {
      showDashboard(d.participant);
      hideStatusChangeNotice();
      hideAdminUpdateNotice();
      showPhotoUploadSuccessNotice();
    } else showAuth();
  } catch {
    showAuth();
  }
})();
