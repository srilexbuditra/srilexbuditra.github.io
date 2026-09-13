const API = 'https://peserta-api.srilexbuditra.work';
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const referralView = document.getElementById('referralView');
const toast = document.getElementById('toast');

async function api(path, options = {}) {
  const response = await fetch(API + path, { ...options, credentials: 'include', cache: 'no-store', headers: { Accept: 'application/json', ...(options.headers || {}) } });
  let data = {}; try { data = await response.json(); } catch (_) {}
  if (!response.ok || data.ok === false) throw Object.assign(new Error(data.message || 'Permintaan belum dapat diproses.'), { status: response.status, data });
  return data;
}
function showError(title, text) { loadingState.hidden = true; referralView.hidden = true; errorState.hidden = false; document.getElementById('errorTitle').textContent = title; document.getElementById('errorText').textContent = text; }
function showToast(message, error = false) { toast.textContent = message; toast.classList.toggle('is-error', error); toast.hidden = false; clearTimeout(showToast.timer); showToast.timer = setTimeout(() => { toast.hidden = true; }, 2600); }
function render(data, participant) {
  const r = data.referral || {};
  document.getElementById('participantName').textContent = participant?.nama || 'Peserta';
  document.getElementById('referralCode').textContent = r.referral_code || '-';
  document.getElementById('referralLink').value = r.referral_url || '';
  document.getElementById('openButton').href = r.referral_url || '#';
  document.getElementById('registrationCount').textContent = Number(r.registration_count || 0).toLocaleString('id-ID');
  document.getElementById('verifiedCount').textContent = Number(r.verified_count || 0).toLocaleString('id-ID');
  document.getElementById('pendingCount').textContent = Number(r.pending_count || 0).toLocaleString('id-ID');
  document.getElementById('referralPoints').textContent = Number(r.referral_points || 0).toLocaleString('id-ID');
  loadingState.hidden = true; errorState.hidden = true; referralView.hidden = false;
}
async function copyLink() { const value = document.getElementById('referralLink').value; if (!value) return; try { await navigator.clipboard.writeText(value); showToast('Tautan referral berhasil disalin.'); } catch (_) { const input = document.getElementById('referralLink'); input.select(); document.execCommand('copy'); showToast('Tautan referral berhasil disalin.'); } }
async function shareLink() {
  const url = document.getElementById('referralLink').value; if (!url) return;
  const text = 'Saya mengundang Anda untuk mengenal dan mendaftar Program Ketahanan Pangan melalui tautan resmi berikut:';
  if (navigator.share) { try { await navigator.share({ title: 'Program Ketahanan Pangan', text, url }); return; } catch (error) { if (error?.name === 'AbortError') return; } }
  await copyLink();
}
document.getElementById('copyButton').addEventListener('click', copyLink);
document.getElementById('shareButton').addEventListener('click', shareLink);

(async function init() {
  try {
    const me = await api('/me');
    if (!me.authenticated || !me.participant) { showError('Sesi login diperlukan', 'Masuk ke akun peserta terlebih dahulu untuk membuka Referral.'); return; }
    const data = await api('/referral');
    if (!data.eligible) { showError('Referral belum aktif', data.message || 'Referral aktif setelah status VERIFIED MEMBER disetujui.'); return; }
    render(data, me.participant);
  } catch (error) { showError(error?.status === 403 ? 'Referral belum aktif' : 'Referral belum dapat ditampilkan', error?.message || 'Periksa koneksi internet lalu coba kembali.'); }
})();
