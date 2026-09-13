const API = 'https://peserta-api.srilexbuditra.work';
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const pointsView = document.getElementById('pointsView');

const LEVELS = [
  { level: 1, name: 'Tunas', min: 0 },
  { level: 2, name: 'Tumbuh', min: 50 },
  { level: 3, name: 'Berkembang', min: 100 },
  { level: 4, name: 'Produktif', min: 250 },
  { level: 5, name: 'Maju', min: 500 },
  { level: 6, name: 'Unggul', min: 1000 }
];

async function requestMe() {
  const response = await fetch(API + '/me', {
    method: 'GET', credentials: 'include', headers: { Accept: 'application/json' }, cache: 'no-store'
  });
  let data = {};
  try { data = await response.json(); } catch (_) {}
  if (!response.ok) throw new Error(data.message || 'Layanan akun peserta belum dapat diakses.');
  return data;
}

function getMilestones(participant) {
  const status = String(participant?.status || '').toLowerCase();
  const memberStatus = String(participant?.member_verification_status || 'not_submitted').toLowerCase();
  const registrationVerified = status === 'verified';
  const memberApproved = registrationVerified && memberStatus === 'approved';
  return [
    { key: 'account', label: 'Akun Peserta Aktif', description: 'Akun sudah diaktivasi dan sesi peserta dapat digunakan.', points: 10, done: true },
    { key: 'registration', label: 'Registrasi Terverifikasi', description: 'Data registrasi telah disetujui admin.', points: 30, done: registrationVerified },
    { key: 'member_photo', label: 'Foto Anggota Terverifikasi', description: 'Foto anggota telah disetujui admin/tim.', points: 30, done: memberApproved },
    { key: 'member_card', label: 'Kartu Anggota + QR Aktif', description: 'Identitas digital anggota sudah aktif.', points: 20, done: memberApproved },
    { key: 'certificate', label: 'Sertifikat Digital Tersedia', description: 'Sertifikat peserta terverifikasi sudah tersedia.', points: 10, done: registrationVerified }
  ];
}

function getLevel(points) {
  let current = LEVELS[0];
  for (const item of LEVELS) if (points >= item.min) current = item;
  const index = LEVELS.findIndex(item => item.level === current.level);
  return { current, next: LEVELS[index + 1] || null };
}

function showError(title, text) {
  loadingState.hidden = true;
  pointsView.hidden = true;
  errorState.hidden = false;
  document.getElementById('errorTitle').textContent = title;
  document.getElementById('errorText').textContent = text;
}

function renderMilestones(items) {
  const list = document.getElementById('milestoneList');
  list.innerHTML = items.map(item => `
    <div class="milestone-item ${item.done ? 'is-done' : ''}">
      <span class="milestone-check" aria-hidden="true">${item.done ? '✓' : '○'}</span>
      <div class="milestone-copy"><strong>${item.label}</strong><small>${item.description}</small></div>
      <span class="milestone-points">+${item.points}</span>
    </div>`).join('');
}

function renderLevels(points) {
  const current = getLevel(points).current;
  const list = document.getElementById('levelList');
  list.innerHTML = LEVELS.map(item => `
    <div class="level-item ${item.level === current.level ? 'is-current' : ''} ${points >= item.min ? 'is-reached' : ''}">
      <span class="level-number">${item.level}</span>
      <div><strong>${item.name}</strong><small>Mulai ${item.min.toLocaleString('id-ID')} poin</small></div>
      <span class="level-state">${item.level === current.level ? 'LEVEL ANDA' : (points >= item.min ? 'TERCAPAI' : 'TERKUNCI')}</span>
    </div>`).join('');
}

function render(participant) {
  const milestones = getMilestones(participant);
  const points = milestones.filter(item => item.done).reduce((sum, item) => sum + item.points, 0);
  const { current, next } = getLevel(points);
  const registrationVerified = String(participant.status || '').toLowerCase() === 'verified';
  const memberApproved = registrationVerified && String(participant.member_verification_status || '').toLowerCase() === 'approved';

  document.getElementById('participantName').textContent = participant.nama || 'Peserta';
  document.getElementById('participantStatus').textContent = memberApproved
    ? 'VERIFIED MEMBER aktif · seluruh Poin Dasar keanggotaan telah tercapai.'
    : registrationVerified
      ? 'Registrasi terverifikasi · selesaikan verifikasi foto untuk melengkapi Poin Dasar.'
      : 'Poin akan bertambah otomatis saat progres keanggotaan Anda terverifikasi.';
  document.getElementById('pointsValue').textContent = points.toLocaleString('id-ID');
  document.getElementById('levelBadge').textContent = `LEVEL ${current.level} · ${current.name.toUpperCase()}`;
  document.getElementById('levelCaption').textContent = `Level ${current.level} ${current.name}`;

  if (next) {
    const range = Math.max(1, next.min - current.min);
    const gained = Math.max(0, points - current.min);
    const percent = Math.max(0, Math.min(100, Math.round((gained / range) * 100)));
    const remaining = Math.max(0, next.min - points);
    document.getElementById('progressTitle').textContent = `Menuju Level ${next.level} ${next.name}`;
    document.getElementById('progressValue').textContent = percent + '%';
    document.getElementById('progressBar').style.width = percent + '%';
    document.getElementById('progressText').textContent = remaining.toLocaleString('id-ID') + ' poin lagi menuju level berikutnya. Poin tambahan akan tersedia melalui fitur Misi pada tahap selanjutnya.';
  } else {
    document.getElementById('progressTitle').textContent = 'Level tertinggi';
    document.getElementById('progressValue').textContent = '100%';
    document.getElementById('progressBar').style.width = '100%';
    document.getElementById('progressText').textContent = 'Anda telah mencapai level tertinggi pada struktur level saat ini.';
  }

  renderMilestones(milestones);
  renderLevels(points);
  document.getElementById('cardLink').hidden = !memberApproved;

  loadingState.hidden = true;
  errorState.hidden = true;
  pointsView.hidden = false;
}

(async function init() {
  try {
    const data = await requestMe();
    if (!data.authenticated || !data.participant) {
      showError('Sesi login diperlukan', 'Masuk ke akun peserta terlebih dahulu untuk melihat Level & Poin.');
      return;
    }
    render(data.participant);
  } catch (error) {
    showError('Level & Poin belum dapat ditampilkan', error?.message || 'Periksa koneksi internet lalu coba kembali.');
  }
})();
