const API = 'https://peserta-api.srilexbuditra.work';
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const profileView = document.getElementById('profileView');
const toast = document.getElementById('toast');
const preferencesForm = document.getElementById('preferencesForm');
const passwordForm = document.getElementById('passwordForm');

let profileData = null;

async function api(path, options = {}) {
  const response = await fetch(API + path, {
    ...options,
    credentials: 'include',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });
  let data = {};
  try { data = await response.json(); } catch (_) {}
  if (!response.ok || data.ok === false) {
    throw Object.assign(new Error(data.message || 'Profil akun belum dapat diakses.'), { status: response.status });
  }
  return data;
}

function text(id, value, fallback = '-') {
  const el = document.getElementById(id);
  if (el) el.textContent = value == null || value === '' ? fallback : String(value);
}

function formatDate(value) {
  if (!value) return '-';
  const normalized = String(value).includes('T') ? String(value) : String(value).replace(' ', 'T') + 'Z';
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(date);
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 3500);
}

function setFormStatus(id, message, type = '') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message || '';
  el.classList.toggle('is-success', type === 'success');
  el.classList.toggle('is-error', type === 'error');
}

function showError(title, message) {
  loadingState.hidden = true;
  profileView.hidden = true;
  errorState.hidden = false;
  text('errorTitle', title);
  text('errorText', message);
}

function renderActivity(rows) {
  const list = document.getElementById('activityList');
  const empty = document.getElementById('activityEmpty');
  list.innerHTML = '';
  const items = Array.isArray(rows) ? rows : [];
  empty.hidden = items.length > 0;
  if (!items.length) return;

  const iconMap = { mission: '★', referral: '↗', event: '◈', base: '◎', activity: '•' };
  items.forEach(row => {
    const points = Number(row.points || 0);
    const item = document.createElement('div');
    item.className = 'activity-item';
    const icon = document.createElement('span');
    icon.className = 'activity-icon';
    icon.textContent = iconMap[String(row.type || '').toLowerCase()] || '•';
    const copy = document.createElement('div');
    copy.className = 'activity-copy';
    const strong = document.createElement('strong');
    strong.textContent = row.description || 'Aktivitas peserta';
    const small = document.createElement('small');
    small.textContent = formatDate(row.created_at);
    copy.append(strong, small);
    const pointEl = document.createElement('span');
    pointEl.className = `activity-points${points < 0 ? ' is-negative' : ''}`;
    pointEl.textContent = `${points > 0 ? '+' : ''}${points} poin`;
    item.append(icon, copy, pointEl);
    list.appendChild(item);
  });
}

function renderProfile(profile) {
  profileData = profile;
  const p = profile.participant || {};
  const ag = profile.agriculture || {};
  const membership = profile.membership || {};
  const account = profile.account || {};
  const engagement = profile.engagement || {};
  const level = engagement.level || { level: 1, name: 'Tunas' };
  const prefs = profile.preferences || {};

  text('participantName', p.nama || 'Peserta');
  text('registrationText', `${p.registration_id || '-'} · ${membership.verified_member ? 'VERIFIED MEMBER' : 'Peserta Aktif'}`);
  text('totalPoints', `${Number(engagement.total_points || 0)} Poin`);
  text('levelName', `Level ${level.level || 1} ${level.name || 'Tunas'}`);
  text('activeSessions', Number(account.active_sessions || 0));
  text('accountStatus', account.is_active ? 'Aktif' : 'Tidak Aktif');
  text('lastSeenText', `Terakhir aktif ${formatDate(account.last_seen_at)}`);
  text('registrationId', p.registration_id);
  text('registrationStatus', p.status ? String(p.status).replace(/_/g, ' ') : '-');
  text('regionText', [p.desa, p.kecamatan, p.kabupaten, p.provinsi].filter(Boolean).join(', '));
  text('applicantStatus', p.status_pemohon);
  text('whatsappMasked', p.whatsapp_masked);
  text('emailMasked', p.email_masked);
  text('commodityText', ag.komoditas);
  text('landAreaText', ag.luas_lahan ? `${ag.luas_lahan} ha` : '-');
  text('landStatusText', ag.status_lahan);
  text('farmerGroupText', ag.kelompok_tani);
  text('fertilizerText', ag.jenis_pupuk);
  text('fertilizerNeedText', ag.kebutuhan_kg ? `${ag.kebutuhan_kg} kg` : '-');
  text('profilePolicy', profile.policy?.note || 'Data registrasi inti hanya ditampilkan.');

  const badge = document.getElementById('memberBadge');
  badge.textContent = membership.verified_member ? '✓ VERIFIED MEMBER' : 'PESERTA';
  badge.classList.toggle('is-basic', !membership.verified_member);

  const prefMap = {
    notifyProgram: prefs.notify_program,
    notifyPoints: prefs.notify_points,
    notifyReferral: prefs.notify_referral,
    notifyBenefit: prefs.notify_benefit,
    notifyActivity: prefs.notify_activity,
    notifyMarketplace: prefs.notify_marketplace
  };
  Object.entries(prefMap).forEach(([id, value]) => {
    const input = document.getElementById(id);
    if (input) input.checked = value !== false;
  });
  renderActivity(profile.recent_activity);
}

async function reloadProfile() {
  const data = await api('/profile');
  renderProfile(data.profile || {});
  loadingState.hidden = true;
  errorState.hidden = true;
  profileView.hidden = false;
}

preferencesForm.addEventListener('submit', async event => {
  event.preventDefault();
  const button = document.getElementById('savePreferencesBtn');
  button.disabled = true;
  setFormStatus('preferencesStatus', 'Menyimpan…');
  try {
    const payload = {
      notify_program: document.getElementById('notifyProgram').checked,
      notify_points: document.getElementById('notifyPoints').checked,
      notify_referral: document.getElementById('notifyReferral').checked,
      notify_benefit: document.getElementById('notifyBenefit').checked,
      notify_activity: document.getElementById('notifyActivity').checked,
      notify_marketplace: document.getElementById('notifyMarketplace').checked
    };
    await api('/profile/preferences', { method: 'POST', body: JSON.stringify(payload) });
    setFormStatus('preferencesStatus', 'Preferensi tersimpan di server.', 'success');
    showToast('Preferensi notifikasi berhasil disimpan.');
  } catch (error) {
    setFormStatus('preferencesStatus', error.message || 'Preferensi belum dapat disimpan.', 'error');
  } finally {
    button.disabled = false;
  }
});

passwordForm.addEventListener('submit', async event => {
  event.preventDefault();
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  if (newPassword !== confirmPassword) {
    setFormStatus('passwordStatus', 'Konfirmasi password baru tidak sama.', 'error');
    return;
  }
  if (newPassword.length < 10 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
    setFormStatus('passwordStatus', 'Password baru minimal 10 karakter dan memuat huruf besar, huruf kecil, serta angka.', 'error');
    return;
  }
  const button = document.getElementById('changePasswordBtn');
  button.disabled = true;
  setFormStatus('passwordStatus', 'Memperbarui password…');
  try {
    const data = await api('/profile/password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
    });
    passwordForm.reset();
    setFormStatus('passwordStatus', data.message || 'Password berhasil diperbarui.', 'success');
    showToast('Password berhasil diperbarui.');
    await reloadProfile();
  } catch (error) {
    setFormStatus('passwordStatus', error.message || 'Password belum dapat diperbarui.', 'error');
  } finally {
    button.disabled = false;
  }
});

(async function init() {
  try {
    await reloadProfile();
  } catch (error) {
    showError(
      error?.status === 401 ? 'Sesi login diperlukan' : 'Profil belum dapat ditampilkan',
      error?.message || 'Periksa koneksi internet lalu coba kembali.'
    );
  }
})();
