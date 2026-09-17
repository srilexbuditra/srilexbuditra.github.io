(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const LOGIN_PATH = '/program/umroh-semi-private-bengkulu/admin/login/';
  const ALLOWED_ROLES = new Set(['super_admin', 'admin']);

  const root = document.documentElement;
  const logoutButton = document.querySelector('[data-admin-logout]');

  const roleLabel = (role) => {
    if (role === 'super_admin') return 'Super Admin';
    if (role === 'admin') return 'Admin';
    return role || 'Akun';
  };

  const displayName = (account) => {
    if (account?.full_name) return account.full_name;
    if (account?.username === 'srilexbuditra') return 'Srilex Buditra';
    return account?.username || 'Administrator';
  };

  const displayTitle = (account) => {
    if (account?.username === 'srilexbuditra' && account?.role === 'super_admin') {
      return 'Full Stack Developer · Super Admin';
    }
    return roleLabel(account?.role);
  };

  const initials = (value) => {
    const parts = String(value || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() || '').join('') || 'AD';
  };

  const loginUrl = (reason = '') => {
    const url = new URL(LOGIN_PATH, window.location.origin);
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (current.startsWith('/program/umroh-semi-private-bengkulu/admin/') && !current.startsWith(LOGIN_PATH)) {
      url.searchParams.set('next', current);
    }
    if (reason) url.searchParams.set('reason', reason);
    return url.toString();
  };

  const redirectToLogin = (reason) => {
    window.location.replace(loginUrl(reason));
  };

  const renderAccount = (account) => {
    const name = displayName(account);
    const title = displayTitle(account);

    document.querySelectorAll('[data-auth-name]').forEach((node) => {
      node.textContent = name;
    });
    document.querySelectorAll('[data-auth-role]').forEach((node) => {
      node.textContent = title;
    });
    document.querySelectorAll('[data-auth-avatar]').forEach((node) => {
      node.textContent = initials(name);
    });

    window.UMROH_ADMIN_ACCOUNT = Object.freeze({ ...account });
  };

  const checkSession = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });

      if (response.status === 401) {
        redirectToLogin('session');
        return;
      }

      const data = await response.json().catch(() => ({}));
      const account = data?.account;

      if (!response.ok || !data?.ok || !account) {
        throw new Error('invalid_auth_response');
      }

      if (!ALLOWED_ROLES.has(account.role)) {
        redirectToLogin('forbidden');
        return;
      }

      renderAccount(account);
      root.classList.remove('auth-pending');
      root.classList.add('auth-ready');
    } catch (error) {
      console.error('Umroh Admin Auth Guard:', error);
      redirectToLogin('unavailable');
    }
  };

  const logout = async () => {
    if (!logoutButton) return;

    logoutButton.disabled = true;
    logoutButton.setAttribute('aria-busy', 'true');
    const original = logoutButton.textContent;
    logoutButton.textContent = 'Keluar...';

    try {
      const response = await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });

      if (!response.ok) throw new Error(`logout_http_${response.status}`);
      window.location.replace(`${LOGIN_PATH}?logged_out=1`);
    } catch (error) {
      console.error('Umroh Admin Logout:', error);
      window.alert('Logout belum berhasil. Periksa koneksi lalu coba lagi.');
      logoutButton.disabled = false;
      logoutButton.removeAttribute('aria-busy');
      logoutButton.textContent = original;
    }
  };

  logoutButton?.addEventListener('click', logout);
  checkSession();
})();
