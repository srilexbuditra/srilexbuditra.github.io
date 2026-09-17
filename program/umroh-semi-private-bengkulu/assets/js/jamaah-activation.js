(() => {
  'use strict';
  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const DASHBOARD = '/program/umroh-semi-private-bengkulu/jamaah/dashboard/';
  const form = document.querySelector('[data-jamaah-activation-form]');
  const message = document.querySelector('[data-jamaah-activation-message]');
  const submit = document.querySelector('[data-jamaah-activation-submit]');

  const setMessage = (text = '', state = '') => {
    message.textContent = text;
    message.dataset.state = state;
    message.hidden = !text;
  };

  document.querySelectorAll('[data-toggle-password]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.togglePassword);
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.textContent = show ? 'Sembunyikan' : 'Tampilkan';
    });
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage('');
    const data = new FormData(form);
    const identifier = String(data.get('identifier') || '').trim();
    const code = String(data.get('activation_code') || '').trim().toUpperCase();
    const password = String(data.get('new_password') || '');
    const confirm = String(data.get('confirm_password') || '');

    if (!identifier || !code) {
      setMessage('Nomor Jemaah/email/WhatsApp dan kode aktivasi wajib diisi.', 'error');
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
      const response = await fetch(`${API_BASE}/auth/jamaah/activate`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          activation_code: code,
          new_password: password
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.ok) {
        const text = {
          activation_failed: 'Aktivasi gagal. Periksa data dan masa berlaku kode.',
          activation_locked: 'Kode dikunci karena terlalu banyak percobaan. Hubungi Admin untuk Reset Akses.',
          password_too_short: 'Password minimal 10 karakter.',
          password_too_long: 'Password terlalu panjang.'
        }[result?.error] || 'Aktivasi belum berhasil.';
        setMessage(text, 'error');
        return;
      }
      setMessage('Aktivasi berhasil. Membuka Dashboard Jemaah...', 'success');
      form.querySelectorAll('input,button').forEach((node) => { node.disabled = true; });
      window.setTimeout(() => window.location.replace(DASHBOARD), 900);
    } catch (_) {
      setMessage('Layanan aktivasi belum dapat dihubungi. Coba kembali.', 'error');
    } finally {
      if (!form.querySelector('input:disabled')) {
        submit.disabled = false;
        submit.textContent = 'Aktifkan & Masuk';
      }
    }
  });
})();
