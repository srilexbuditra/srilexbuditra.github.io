const api = document.getElementById('api');
const token = document.getElementById('token');
const msg = document.getElementById('msg');

api.value = localStorage.getItem('SB_VERIFY_API') || '';
token.value = localStorage.getItem('SB_VERIFY_PUBLISHER_TOKEN') || '';

document.getElementById('save').addEventListener('click', () => {
  const apiValue = api.value.trim().replace(/\/$/, '');
  const tokenValue = token.value.trim();

  if (!apiValue || !tokenValue) {
    msg.textContent = 'API endpoint dan Publisher Token wajib diisi.';
    msg.hidden = false;
    return;
  }

  localStorage.setItem('SB_VERIFY_API', apiValue);
  localStorage.setItem('SB_VERIFY_PUBLISHER_TOKEN', tokenValue);

  msg.textContent = 'Konfigurasi berhasil disimpan.';
  msg.hidden = false;
});

document.getElementById('clear').addEventListener('click', () => {
  localStorage.removeItem('SB_VERIFY_API');
  localStorage.removeItem('SB_VERIFY_PUBLISHER_TOKEN');

  api.value = '';
  token.value = '';

  msg.textContent = 'Konfigurasi lokal dihapus.';
  msg.hidden = false;
});
