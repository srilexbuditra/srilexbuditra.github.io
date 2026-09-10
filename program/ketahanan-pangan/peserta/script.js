const API = 'https://peserta-api.srilexbuditra.work';
const authView = document.getElementById('authView'),
  dashboardView = document.getElementById('dashboardView'),
  message = document.getElementById('authMessage');
const normalizeId = v => String(v || '').trim().toUpperCase().replace(/\s+/g, '');
const normalizeWa = v => String(v || '').replace(/\D/g, '').replace(/^0/, '62');
let currentRegistrationId = '';
let lastParticipantRefreshAt = null;
let lastKnownParticipantStatus = '';

function msg(type, text) {
  message.className = 'message show ' + type;
  message.textContent = text;
}

function clearMsg() {
  message.className = 'message';
  message.textContent = '';
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

function showDashboard(p) {
  authView.hidden = true;
  dashboardView.hidden = false;
  document.body.classList.add('is-authenticated');
  setLastUpdated(new Date());

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

  const statusHero = document.getElementById('statusHero');
  const nextActionCard = document.getElementById('nextActionCard');
  const statusSummaryCard = document.getElementById('statusSummaryCard');
  const dashStatusIcon = document.getElementById('dashStatusIcon');
  if (statusHero) statusHero.dataset.status = s || 'pending';
  if (nextActionCard) nextActionCard.dataset.status = s || 'pending';
  if (statusSummaryCard) statusSummaryCard.dataset.status = s || 'pending';
  if (dashStatusIcon) dashStatusIcon.textContent = presentation.icon || '⌕';

  renderParticipantTimeline(p.status);

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
}

function showAuth() {
  dashboardView.hidden = true;
  authView.hidden = false;
  document.body.classList.remove('is-authenticated');
  currentRegistrationId = '';
  lastKnownParticipantStatus = '';
  hideStatusChangeNotice();
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


const statusChangeActionBtn = document.getElementById('statusChangeActionBtn');
if (statusChangeActionBtn) statusChangeActionBtn.addEventListener('click', () => {
  const targetId = statusChangeActionBtn.dataset.target || 'nextActionCard';
  let target = document.getElementById(targetId);
  if (target?.hidden) target = document.getElementById('nextActionCard');
  target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

const statusChangeDismiss = document.getElementById('statusChangeDismiss');
if (statusChangeDismiss) statusChangeDismiss.addEventListener('click', hideStatusChangeNotice);

const refreshParticipantBtn = document.getElementById('refreshParticipantBtn');
const defaultRefreshLabel = '↻ Perbarui status';
if (refreshParticipantBtn) refreshParticipantBtn.addEventListener('click', async () => {
  refreshParticipantBtn.disabled = true;
  refreshParticipantBtn.textContent = '↻ Memeriksa…';
  try {
    const previousStatus = lastKnownParticipantStatus;
    const d = await request('/me');
    if (!d.authenticated || !d.participant) {
      showAuth();
      msg('error', 'Sesi Anda telah berakhir. Silakan masuk kembali untuk melihat status terbaru.');
      return;
    }
    showDashboard(d.participant);
    const changed = showStatusChangeNotice(previousStatus, d.participant.status);
    setLastUpdated(new Date(), 'is-ok');
    refreshParticipantBtn.textContent = changed ? '✓ Status berubah' : '✓ Status terbaru';
    window.setTimeout(() => {
      if (!refreshParticipantBtn.disabled) refreshParticipantBtn.textContent = defaultRefreshLabel;
    }, 1600);
  } catch (error) {
    if (error?.status === 401 || error?.status === 403) {
      showAuth();
      msg('error', 'Sesi Anda telah berakhir. Silakan masuk kembali untuk melihat status terbaru.');
      return;
    }
    const text = document.getElementById('lastUpdatedText');
    const wrap = document.querySelector('.status-sync');
    if (text) text.textContent = 'Pembaruan gagal. Periksa koneksi lalu coba lagi.';
    if (wrap) { wrap.classList.remove('is-ok'); wrap.classList.add('is-error'); }
    refreshParticipantBtn.textContent = '↻ Coba lagi';
  } finally {
    refreshParticipantBtn.disabled = false;
  }
});

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
    hideStatusChangeNotice();
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
    showDashboard(d.participant);
    showStatusChangeNotice(previousStatus, d.participant?.status);
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
    } else showAuth();
  } catch {
    showAuth();
  }
})();
