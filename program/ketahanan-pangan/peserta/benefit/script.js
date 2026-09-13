const API = 'https://peserta-api.srilexbuditra.work';
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const benefitView = document.getElementById('benefitView');

async function api(path, options = {}) {
  const response = await fetch(API + path, { ...options, credentials: 'include', cache: 'no-store', headers: { Accept: 'application/json', ...(options.headers || {}) } });
  let data = {}; try { data = await response.json(); } catch (_) {}
  if (!response.ok || data.ok === false) throw Object.assign(new Error(data.message || 'Permintaan belum dapat diproses.'), { status: response.status, data });
  return data;
}

function showError(title, text) {
  loadingState.hidden = true; benefitView.hidden = true; errorState.hidden = false;
  document.getElementById('errorTitle').textContent = title;
  document.getElementById('errorText').textContent = text;
}

function renderBenefits(items = []) {
  const icons = ['i', '!', '♧', '◎', '↗', '★'];
  const list = document.getElementById('benefitList');
  list.innerHTML = items.map((item, index) => `
    <article class="benefit-item ${item.unlocked ? 'is-unlocked' : 'is-locked'}">
      <span class="benefit-icon" aria-hidden="true">${item.unlocked ? '✓' : icons[index] || '○'}</span>
      <div class="benefit-copy">
        <strong>${item.title}</strong>
        <p>${item.description}</p>
        <div class="benefit-meta">
          <span class="benefit-level">LEVEL ${item.min_level}+</span>
          <span class="benefit-status">${item.unlocked ? 'AKSES AKTIF' : item.requirement_text}</span>
        </div>
      </div>
    </article>`).join('');
}

function render(data) {
  const benefit = data.benefit || {};
  const participant = data.participant || {};
  const level = benefit.level || {};
  const total = Number(benefit.total_points || 0);
  const unlocked = Number(benefit.unlocked_count || 0);
  const totalBenefits = Number(benefit.total_benefits || 6);

  document.getElementById('participantName').textContent = participant.nama || 'Peserta';
  document.getElementById('summaryText').textContent = `${unlocked} dari ${totalBenefits} benefit sudah terbuka berdasarkan status server.`;
  document.getElementById('unlockedCount').textContent = unlocked.toLocaleString('id-ID');
  document.getElementById('totalBenefits').textContent = totalBenefits.toLocaleString('id-ID');
  document.getElementById('totalPoints').textContent = total.toLocaleString('id-ID') + ' Poin';
  document.getElementById('levelName').textContent = `Level ${level.level || '-'} ${level.name || ''}`.trim();
  document.getElementById('levelCaption').textContent = benefit.verified_member ? 'VERIFIED MEMBER' : (benefit.registration_verified ? 'Registrasi Terverifikasi' : 'Peserta Aktif');

  const memberBadge = document.getElementById('memberBadge');
  memberBadge.textContent = benefit.verified_member ? '✓ VERIFIED MEMBER' : 'PESERTA';
  memberBadge.classList.toggle('is-basic', !benefit.verified_member);

  if (level.next_level) {
    const currentMin = Number(level.min || 0);
    const nextMin = Number(level.next_min || currentMin + 1);
    const range = Math.max(1, nextMin - currentMin);
    const gained = Math.max(0, total - currentMin);
    const percent = Math.min(100, Math.max(0, Math.round((gained / range) * 100)));
    document.getElementById('nextTitle').textContent = `Menuju Level ${level.next_level} ${level.next_name}`;
    document.getElementById('nextValue').textContent = percent + '%';
    document.getElementById('progressBar').style.width = percent + '%';
    document.getElementById('nextText').textContent = `${Number(level.remaining_to_next || 0).toLocaleString('id-ID')} poin lagi menuju level berikutnya. Benefit level lebih tinggi tetap mengikuti syarat verifikasi.`;
  } else {
    document.getElementById('nextTitle').textContent = 'Level tertinggi tercapai';
    document.getElementById('nextValue').textContent = '100%';
    document.getElementById('progressBar').style.width = '100%';
    document.getElementById('nextText').textContent = 'Anda berada pada Level 6 Unggul pada struktur level saat ini.';
  }

  document.getElementById('benefitNote').textContent = benefit.note || 'Benefit adalah status akses/eligibility di platform dan tidak menjamin bantuan atau hadiah tertentu.';
  renderBenefits(benefit.benefits || []);
  loadingState.hidden = true; errorState.hidden = true; benefitView.hidden = false;
}

(async function init() {
  try {
    const data = await api('/benefits');
    render(data);
  } catch (error) {
    showError(error?.status === 401 ? 'Sesi login diperlukan' : 'Benefit belum dapat ditampilkan', error?.message || 'Periksa koneksi internet lalu coba kembali.');
  }
})();
