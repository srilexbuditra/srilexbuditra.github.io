const API = 'https://peserta-api.srilexbuditra.work';
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const missionView = document.getElementById('missionView');
const missionList = document.getElementById('missionList');
const toast = document.getElementById('toast');
let participant = null;
let pointsData = null;

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
    throw Object.assign(new Error(data.message || 'Permintaan belum dapat diproses.'), { status: response.status });
  }
  return data;
}

function showError(title, text) {
  loadingState.hidden = true;
  missionView.hidden = true;
  errorState.hidden = false;
  document.getElementById('errorTitle').textContent = title;
  document.getElementById('errorText').textContent = text;
}

function showToast(message, error = false) {
  toast.textContent = message;
  toast.classList.toggle('is-error', error);
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 2600);
}

function missionAction(mission) {
  if (mission.completed) return '<span class="mission-action" aria-disabled="true">Selesai ✓</span>';
  if (mission.status === 'claimable') {
    return `<button class="mission-action" type="button" data-claim="${mission.key}">Klaim +${mission.points}</button>`;
  }
  if (mission.status === 'available') {
    if (mission.key === 'points_intro') return '<a class="mission-action" href="../poin/">Buka Level & Poin</a>';
    if (mission.key === 'member_card_open') return '<a class="mission-action" href="../kartu/">Buka Kartu</a>';
    if (mission.key === 'certificate_open') {
      const id = encodeURIComponent(participant?.registration_id || '');
      return `<a class="mission-action" href="../../verifikasi/sertifikat/?registration_id=${id}">Buka Sertifikat</a>`;
    }
  }
  return '<span class="mission-action" aria-disabled="true">Belum memenuhi syarat</span>';
}

function statusLabel(mission) {
  if (mission.completed) return 'SELESAI';
  if (mission.status === 'claimable') return 'SIAP DIKLAIM';
  if (mission.status === 'available') return 'SIAP DIKERJAKAN';
  return 'TERKUNCI';
}

function render() {
  const data = pointsData;
  const completed = Number(data.completed_missions || 0);
  const total = Number(data.total_missions || 0) || 1;
  const percent = Math.round((completed / total) * 100);
  document.getElementById('participantName').textContent = participant?.nama || 'Peserta';
  document.getElementById('basePoints').textContent = Number(data.base_points || 0).toLocaleString('id-ID');
  document.getElementById('missionPoints').textContent = Number(data.mission_points || 0).toLocaleString('id-ID');
  document.getElementById('totalPoints').textContent = Number(data.total_points || 0).toLocaleString('id-ID');
  document.getElementById('missionProgressBadge').textContent = `${completed} / ${total} MISI`;
  document.getElementById('missionProgressText').textContent = percent + '%';
  document.getElementById('missionProgressBar').style.width = percent + '%';

  missionList.innerHTML = (data.missions || []).map((mission, index) => `
    <article class="mission-item is-${mission.status}">
      <span class="mission-icon" aria-hidden="true">${mission.completed ? '✓' : String(index + 1)}</span>
      <div class="mission-copy">
        <strong>${mission.title}</strong>
        <p>${mission.description}</p>
        <div class="mission-meta">
          <span class="mission-points">+${mission.points} POIN</span>
          <span class="mission-status">${statusLabel(mission)}</span>
        </div>
      </div>
      ${missionAction(mission)}
    </article>`).join('');

  missionList.querySelectorAll('[data-claim]').forEach(button => {
    button.addEventListener('click', () => claimMission(button.dataset.claim, button));
  });

  loadingState.hidden = true;
  errorState.hidden = true;
  missionView.hidden = false;
}

async function refresh() {
  const response = await api('/points');
  participant = response.participant || participant;
  pointsData = response.points;
  render();
}

async function claimMission(key, button) {
  const original = button.textContent;
  button.disabled = true;
  button.textContent = 'Memeriksa…';
  try {
    const response = await api('/missions/claim', {
      method: 'POST',
      body: JSON.stringify({ mission_key: key })
    });
    pointsData = response.points;
    render();
    showToast(response.message || 'Poin misi berhasil diklaim.');
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'participant_mission_claim', {
        event_category: 'ketahanan_pangan_peserta',
        mission_key: key,
        transport_type: 'beacon'
      });
    }
  } catch (error) {
    button.disabled = false;
    button.textContent = original;
    showToast(error.message || 'Poin belum dapat diklaim.', true);
  }
}

(async function init() {
  try {
    const me = await api('/me');
    if (!me.authenticated || !me.participant) {
      showError('Sesi login diperlukan', 'Masuk ke akun peserta terlebih dahulu untuk membuka Misi & Poin Aktivitas.');
      return;
    }
    participant = me.participant;
    await refresh();
  } catch (error) {
    showError('Misi belum dapat ditampilkan', error?.message || 'Periksa koneksi internet lalu coba kembali.');
  }
})();
