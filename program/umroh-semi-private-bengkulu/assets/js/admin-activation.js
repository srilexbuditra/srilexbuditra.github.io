(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const DASHBOARD_PATH = '/program/umroh-semi-private-bengkulu/admin/';

  const form = document.querySelector('[data-staff-activation-form]');
  const message = document.querySelector('[data-activation-message]');
  const submit = document.querySelector('[data-activation-submit]');

  const setMessage = (text = '', state = '') => {
    if (!message) return;
    message.textContent = text;
    message.dataset.state = state;
    message.hidden = !text;
  };

  document.querySelectorAll('[data-toggle-password]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.togglePassword);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.textContent = show ? 'Sembunyikan' : 'Tampilkan';
      button.setAttribute('aria-pressed', String(show));
    });
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage('');

    const data = new FormData(form);
    const username = String(data.get('username') || '').trim().toLowerCase();
    const activationCode = String(data.get('activation_code') || '').trim().toUpperCase();
    const password = String(data.get('new_password') || '');
    const confirm = String(data.get('confirm_password') || '');

    if (!username || !activationCode) {
      setMessage('Username dan kode aktivasi wajib diisi.', 'error');
      return;
    }
    if (password.length < 10) {
      setMessage('Password minimal 10 karakter.', 'error');
      return;
    }
    if (password !== confirm) {
      setMessage('Konfirmasi password belum sama.', 'error');
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Mengaktifkan...';

    try {
      const response = await fetch(`${API_BASE}/auth/activate`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: username,
          activation_code: activationCode,
          new_password: password
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.ok) {
        const text = {
          activation_failed: 'Aktivasi gagal. Periksa username, kode aktivasi, atau masa berlaku kode.',
          activation_locked: 'Kode aktivasi dikunci karena terlalu banyak percobaan. Hubungi Super Admin untuk Reset Akses.',
          password_too_short: 'Password minimal 10 karakter.',
          password_too_long: 'Password terlalu panjang.'
        }[result?.error] || 'Aktivasi belum berhasil. Coba kembali.';
        setMessage(text, 'error');
        return;
      }

      setMessage('Aktivasi berhasil. Akun sudah aktif dan Anda akan diarahkan ke Dashboard.', 'success');
      form.querySelectorAll('input,button').forEach((node) => {
        node.disabled = true;
      });
      setTimeout(() => {
        window.location.replace(DASHBOARD_PATH);
      }, 1200);
    } catch (error) {
      console.error('Staff activation:', error);
      setMessage('API autentikasi belum dapat dihubungi. Periksa koneksi lalu coba lagi.', 'error');
    } finally {
      if (!form.querySelector('input:disabled')) {
        submit.disabled = false;
        submit.textContent = 'Aktifkan & Masuk';
      }
    }
  });
})();
