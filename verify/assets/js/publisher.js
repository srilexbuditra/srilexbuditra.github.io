const api = document.getElementById('api');
const token = document.getElementById('token');
const msg = document.getElementById('msg');

// V31: endpoint may persist, but the sensitive Publisher Token is session-only.
api.value = localStorage.getItem('SB_VERIFY_API') || 'https://srilexbuditra-verification-api.srilexbuditra.workers.dev';
token.value = '';

// Remove the legacy persistent token automatically after upgrading from V30.
localStorage.removeItem('SB_VERIFY_PUBLISHER_TOKEN');

function showMessage(text) {
  msg.textContent = text;
  msg.hidden = false;
}

document.getElementById('save').addEventListener('click', () => {
  const apiValue = api.value.trim().replace(/\/$/, '');
  const tokenValue = token.value.trim();

  if (!apiValue || !tokenValue) {
    showMessage('API endpoint dan Publisher Token wajib diisi.');
    return;
  }

  localStorage.setItem('SB_VERIFY_API', apiValue);
  sessionStorage.setItem('SB_VERIFY_PUBLISHER_TOKEN', tokenValue);
  token.value = '';

  showMessage('Konfigurasi aktif untuk sesi browser ini. Token tidak disimpan permanen.');
});

document.getElementById('clear').addEventListener('click', () => {
  localStorage.removeItem('SB_VERIFY_API');
  localStorage.removeItem('SB_VERIFY_PUBLISHER_TOKEN');
  sessionStorage.removeItem('SB_VERIFY_PUBLISHER_TOKEN');

  api.value = '';
  token.value = '';
  showMessage('Konfigurasi lokal dan token sesi dihapus.');
});

const openMain = document.getElementById('open-main');
openMain?.addEventListener('click', () => {
  if (!sessionStorage.getItem('SB_VERIFY_PUBLISHER_TOKEN')) {
    showMessage('Simpan konfigurasi terlebih dahulu agar token aktif pada sesi ini.');
    return;
  }
  // Same-tab navigation preserves sessionStorage for the publisher workflow.
  window.location.assign('/');
});
