(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const DASHBOARD_PATH = '/program/umroh-semi-private-bengkulu/admin/';
  const LOGIN_PATH = '/program/umroh-semi-private-bengkulu/admin/login/';
  const ALLOWED_ROLES = new Set(['super_admin', 'admin', 'tour_leader', 'pendamping']);

  const form = document.querySelector('[data-admin-login-form]');
  const usernameInput = document.querySelector('[data-admin-username]');
  const passwordInput = document.querySelector('[data-admin-password]');
  const submitButton = document.querySelector('[data-admin-login-submit]');
  const message = document.querySelector('[data-admin-login-message]');
  const passwordToggle = document.querySelector('[data-password-toggle]');

  const setMessage = (text = '', type = '') => {
    if (!message) return;
    message.textContent = text;
    message.dataset.state = type;
    message.hidden = !text;
  };

  const setBusy = (busy) => {
    if (!submitButton) return;
    submitButton.disabled = busy;
    submitButton.setAttribute('aria-busy', busy ? 'true' : 'false');
    submitButton.textContent = busy ? 'Memeriksa akun...' : 'Masuk Dashboard';
  };

  const safeNextPath = () => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next') || '';
    if (
      next.startsWith('/program/umroh-semi-private-bengkulu/admin/') &&
      !next.startsWith(LOGIN_PATH)
    ) {
      return next;
    }
    return DASHBOARD_PATH;
  };

  const showQueryState = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('logged_out') === '1') {
      setMessage('Anda telah keluar dengan aman.', 'success');
      return;
    }

    const reason = params.get('reason');
    if (reason === 'session') {
      setMessage('Sesi Anda sudah berakhir. Silakan masuk kembali.', 'info');
    } else if (reason === 'forbidden') {
      setMessage('Akun ini tidak memiliki akses ke Dashboard Pengelola.', 'error');
    } else if (reason === 'unavailable') {
      setMessage('Layanan autentikasi belum dapat dihubungi. Coba beberapa saat lagi.', 'error');
    }
  };

  const verifyAdminSession = async () => {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });

    const data = await response.json().catch(() => ({}));
    const account = data?.account;

    if (!response.ok || !data?.ok || !account) return null;
    if (!ALLOWED_ROLES.has(account.role)) return { forbidden: true, account };
    return account;
  };

  const logoutNonAdminSession = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });
    } catch (_) {
      // Login form tetap dapat digunakan walau cleanup session gagal.
    }
  };

  const restoreSession = async () => {
    try {
      const account = await verifyAdminSession();
      if (account && !account.forbidden) {
        window.location.replace(safeNextPath());
        return;
      }
      if (account?.forbidden) {
        await logoutNonAdminSession();
        setMessage('Sesi sebelumnya bukan akun pengelola yang diizinkan. Silakan masuk dengan akun pengelola.', 'info');
      }
    } catch (_) {
      // Halaman login tetap ditampilkan bila API belum tersedia.
    }
  };

  const login = async (event) => {
    event.preventDefault();

    const identifier = usernameInput?.value.trim().toLowerCase() || '';
    const password = passwordInput?.value || '';

    if (!identifier || !password) {
      setMessage('Username dan password wajib diisi.', 'error');
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identifier, password }),
        cache: 'no-store'
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.ok) {
        if (response.status === 401) {
          throw new Error('Username atau password tidak sesuai.');
        }
        throw new Error('Login belum dapat diproses. Silakan coba lagi.');
      }

      const account = await verifyAdminSession();
      if (!account) {
        throw new Error('Session browser belum terbentuk. Silakan coba lagi.');
      }

      if (account.forbidden) {
        await logoutNonAdminSession();
        throw new Error('Akun ini tidak memiliki akses ke Dashboard Pengelola.');
      }

      if (passwordInput) passwordInput.value = '';
      setMessage('Login berhasil. Membuka Dashboard Pengelola...', 'success');
      window.location.replace(safeNextPath());
    } catch (error) {
      setMessage(error?.message || 'Layanan autentikasi belum dapat dihubungi.', 'error');
    } finally {
      setBusy(false);
    }
  };

  passwordToggle?.addEventListener('click', () => {
    if (!passwordInput) return;
    const reveal = passwordInput.type === 'password';
    passwordInput.type = reveal ? 'text' : 'password';
    passwordToggle.textContent = reveal ? 'Sembunyikan' : 'Tampilkan';
    passwordToggle.setAttribute('aria-pressed', reveal ? 'true' : 'false');
  });

  form?.addEventListener('submit', login);
  showQueryState();
  restoreSession();
})();
