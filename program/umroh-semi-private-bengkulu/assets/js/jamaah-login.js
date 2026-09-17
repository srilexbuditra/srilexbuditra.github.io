(() => {
  'use strict';
  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const DEFAULT_NEXT = '/program/umroh-semi-private-bengkulu/jamaah/dashboard/';
  const form = document.querySelector('[data-jamaah-login-form]');
  const message = document.querySelector('[data-jamaah-login-message]');
  const submit = document.querySelector('[data-jamaah-login-submit]');

  const params = new URLSearchParams(window.location.search);
  const requested = params.get('next') || '';
  const next = requested.startsWith('/program/umroh-semi-private-bengkulu/jamaah/') &&
               !requested.includes('/login/') &&
               !requested.includes('/aktivasi/')
    ? requested
    : DEFAULT_NEXT;

  const setMessage = (text = '', state = '') => {
    message.textContent = text;
    message.dataset.state = state;
    message.hidden = !text;
  };

  if (params.get('logged_out') === '1') setMessage('Anda telah keluar dengan aman.', 'success');
  if (params.get('reason') === 'session') setMessage('Silakan masuk untuk membuka Dashboard Jemaah.', 'error');

  document.querySelector('[data-toggle-password]')?.addEventListener('click', (event) => {
    const input = document.getElementById('jamaahPassword');
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    event.currentTarget.textContent = show ? 'Sembunyikan' : 'Tampilkan';
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage('');
    const data = new FormData(form);
    const identifier = String(data.get('identifier') || '').trim();
    const password = String(data.get('password') || '');
    if (!identifier || !password) {
      setMessage('Nomor Jemaah/email/WhatsApp dan password wajib diisi.', 'error');
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Memeriksa...';
    try {
      const response = await fetch(`${API_BASE}/auth/jamaah/login`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.ok) {
        setMessage('Data login tidak cocok atau akun belum aktif.', 'error');
        return;
      }
      setMessage('Login berhasil. Membuka Dashboard Jemaah...', 'success');
      window.setTimeout(() => window.location.replace(next), 700);
    } catch (_) {
      setMessage('Layanan login belum dapat dihubungi. Coba kembali.', 'error');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Masuk Dashboard';
    }
  });
})();
