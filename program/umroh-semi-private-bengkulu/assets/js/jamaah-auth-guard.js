(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const LOGIN_PATH = '/program/umroh-semi-private-bengkulu/jamaah/login/';
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  const redirectLogin = (reason = 'session') => {
    const next = encodeURIComponent(currentPath);
    window.location.replace(`${LOGIN_PATH}?reason=${encodeURIComponent(reason)}&next=${next}`);
  };

  const initials = (name) => String(name || 'J')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'J';

  const render = (account) => {
    const name = account.full_name || account.member_no || 'Jemaah';
    document.querySelectorAll('[data-jamaah-auth-name]').forEach((node) => { node.textContent = name; });
    document.querySelectorAll('[data-jamaah-auth-member]').forEach((node) => {
      node.textContent = account.member_no ? `Jemaah · ${account.member_no}` : 'Jemaah';
    });
    document.querySelectorAll('[data-jamaah-auth-avatar]').forEach((node) => { node.textContent = initials(name); });
    window.UMROH_JAMAAH_ACCOUNT = Object.freeze({ ...account });
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });
    } finally {
      window.location.replace(`${LOGIN_PATH}?logged_out=1`);
    }
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-jamaah-logout]');
    if (!button) return;
    event.preventDefault();
    button.disabled = true;
    logout();
  });

  (async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok || data.account?.role !== 'jamaah') {
        if (response.ok && data?.account?.role && data.account.role !== 'jamaah') {
          await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include', cache: 'no-store' }).catch(() => {});
        }
        redirectLogin('session');
        return;
      }
      render(data.account);
    } catch (error) {
      console.error('Jamaah auth guard:', error);
      redirectLogin('api');
    }
  })();
})();
