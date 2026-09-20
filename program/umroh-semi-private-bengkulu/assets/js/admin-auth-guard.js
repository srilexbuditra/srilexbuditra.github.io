(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const LOGIN_PATH = '/program/umroh-semi-private-bengkulu/admin/login/';
  const ALLOWED_ROLES = new Set(['super_admin', 'admin', 'tour_leader', 'pendamping']);

  const root = document.documentElement;
  const logoutButton = document.querySelector('[data-admin-logout]');

  const roleLabel = (role) => {
    if (role === 'super_admin') return 'Senior Full Stack Developer · Platform Architect';
    if (role === 'admin') return 'Admin';
    if (role === 'tour_leader') return 'Tour Leader';
    if (role === 'pendamping') return 'Pendamping';
    return role || 'Akun';
  };

  const displayName = (account) => {
    if (account?.display_name) return account.display_name;
    if (account?.full_name) return account.full_name;
    if (account?.username === 'srilexbuditra') return 'Srilex Buditra';
    return account?.username || 'Administrator';
  };

  const displayTitle = (account) => {
    if (account?.job_title) return account.job_title;
    if (account?.username === 'srilexbuditra' && account?.role === 'super_admin') {
      return 'Senior Full Stack Developer · Platform Architect';
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

    document.documentElement.dataset.adminRole = account.role || '';

    document.querySelectorAll('[data-super-admin-only]').forEach((node) => {
      node.hidden = account.role !== 'super_admin';
    });

    document.querySelectorAll('[data-rbac]').forEach((node) => {
      const allowed = String(node.dataset.rbac || '')
        .split(/\s+/)
        .map((value) => value.trim())
        .filter(Boolean);
      node.hidden = allowed.length > 0 && !allowed.includes(account.role);
    });

    const requiredRole = document.documentElement.dataset.requiredRole || '';
    if (requiredRole && account.role !== requiredRole) {
      window.location.replace('/program/umroh-semi-private-bengkulu/admin/?reason=forbidden');
      return false;
    }

    const currentHash = window.location.hash.replace(/^#/, '');
    if (currentHash) {
      const currentNav = document.querySelector(`[data-nav-item][href="#${CSS.escape(currentHash)}"]`);
      if (currentNav?.hidden) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#ringkasan`);
      }
    }

    window.UMROH_ADMIN_ACCOUNT = Object.freeze({ ...account });
    return true;
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

      if (!renderAccount(account)) return;
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
