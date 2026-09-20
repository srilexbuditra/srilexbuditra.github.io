(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const ADMIN_ROOT = '/program/umroh-semi-private-bengkulu/admin/';

  const accountsBody = document.querySelector('[data-accounts-body]');
  const auditList = document.querySelector('[data-audit-list]');
  const refreshButton = document.querySelector('[data-refresh]');
  const createModal = document.querySelector('[data-create-modal]');
  const createForm = document.querySelector('[data-create-form]');
  const createSubmit = document.querySelector('[data-create-submit]');
  const formMessage = document.querySelector('[data-form-message]');
  const activationModal = document.querySelector('[data-activation-modal]');
  const activationCode = document.querySelector('[data-activation-code]');
  const activationExpiry = document.querySelector('[data-activation-expiry]');
  const copyActivation = document.querySelector('[data-copy-activation]');

  let accounts = [];

  const api = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {})
      },
      ...options
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
      window.location.replace('/program/umroh-semi-private-bengkulu/admin/login/?reason=session');
      throw new Error('unauthorized');
    }
    if (response.status === 403) {
      window.location.replace(`${ADMIN_ROOT}?reason=forbidden_management`);
      throw new Error('forbidden');
    }
    if (!response.ok || !data?.ok) {
      const err = new Error(data?.error || `http_${response.status}`);
      err.code = data?.error || '';
      throw err;
    }
    return data;
  };

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));

  const roleLabel = (role) => ({
    super_admin: 'Senior Full Stack Developer · Platform Architect',
    admin: 'Admin',
    tour_leader: 'Tour Leader',
    pendamping: 'Pendamping'
  }[role] || role || '—');

  const statusLabel = (status) => ({
    active: 'Aktif',
    pending_activation: 'Menunggu Aktivasi',
    suspended: 'Ditangguhkan',
    disabled: 'Dinonaktifkan'
  }[status] || status || '—');

  const fmt = (value) => {
    if (!value) return 'Belum pernah';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Jakarta'
    }).format(date);
  };

  const updateStats = () => {
    document.querySelector('[data-stat-total]').textContent = accounts.length;
    document.querySelector('[data-stat-active]').textContent =
      accounts.filter((a) => a.account_status === 'active').length;
    document.querySelector('[data-stat-pending]').textContent =
      accounts.filter((a) => a.account_status === 'pending_activation').length;
    document.querySelector('[data-stat-disabled]').textContent =
      accounts.filter((a) => ['suspended', 'disabled'].includes(a.account_status)).length;
  };

  const renderAccounts = () => {
    if (!accountsBody) return;
    if (!accounts.length) {
      accountsBody.innerHTML = '<tr><td colspan="6" class="table-state">Belum ada akun pengelola.</td></tr>';
      updateStats();
      return;
    }

    accountsBody.innerHTML = accounts.map((account) => {
      const isSuper = account.role === 'super_admin';
      const title = account.job_title
        ? `<span class="account-title">${esc(account.job_title)}</span>`
        : '';
      const roleControl = isSuper ? '' : `
        <select data-action="role" data-id="${esc(account.account_uuid)}" aria-label="Ubah role ${esc(account.username)}">
          <option value="admin"${account.role === 'admin' ? ' selected' : ''}>Admin</option>
          <option value="tour_leader"${account.role === 'tour_leader' ? ' selected' : ''}>Tour Leader</option>
          <option value="pendamping"${account.role === 'pendamping' ? ' selected' : ''}>Pendamping</option>
        </select>`;
      const statusAction = isSuper ? '' : (
        account.account_status === 'active'
          ? `<button class="danger" data-action="status" data-status="suspended" data-id="${esc(account.account_uuid)}">Tangguhkan</button>`
          : ['suspended', 'disabled'].includes(account.account_status)
            ? `<button data-action="status" data-status="active" data-id="${esc(account.account_uuid)}">Aktifkan</button>`
            : ''
      );
      const reset = isSuper ? '' : `<button data-action="reset" data-id="${esc(account.account_uuid)}">Reset Akses</button>`;

      return `<tr>
        <td><div class="account-name"><strong>${esc(account.display_name || account.username)}</strong><span>@${esc(account.username || '—')}</span>${title}</div></td>
        <td><span class="role-badge${isSuper ? ' super' : ''}">${esc(roleLabel(account.role))}</span></td>
        <td><span class="status-badge ${esc(account.account_status)}">${esc(statusLabel(account.account_status))}</span></td>
        <td>${esc(fmt(account.last_login_at))}</td>
        <td>${esc(fmt(account.created_at))}</td>
        <td><div class="account-actions">${roleControl}${statusAction}${reset}</div></td>
      </tr>`;
    }).join('');

    updateStats();
  };

  const loadAccounts = async () => {
    if (accountsBody) accountsBody.innerHTML = '<tr><td colspan="6" class="table-state">Memuat data akun...</td></tr>';
    try {
      const data = await api('/admin/accounts');
      accounts = data.accounts || [];
      renderAccounts();
    } catch (error) {
      if (['unauthorized', 'forbidden'].includes(error.message)) return;
      accountsBody.innerHTML = '<tr><td colspan="6" class="table-state">Data akun belum dapat dimuat. Coba muat ulang.</td></tr>';
    }
  };

  const loadAudit = async () => {
    if (!auditList) return;
    try {
      const data = await api('/admin/audit-log');
      const logs = data.logs || [];
      if (!logs.length) {
        auditList.innerHTML = '<div class="table-state">Belum ada aktivitas sensitif yang tercatat.</div>';
        return;
      }
      auditList.innerHTML = logs.map((log) => {
        let details = {};
        try { details = JSON.parse(log.details_json || '{}'); } catch (_) {}
        const actor = log.actor_name || log.actor_username || 'System';
        const target = log.target_name || log.target_username || 'akun';
        const isSelfAction = Boolean(
          (log.actor_account_uuid && log.target_account_uuid && log.actor_account_uuid === log.target_account_uuid) ||
          (log.actor_username && log.target_username && log.actor_username === log.target_username)
        );
        const description = {
          account_created: `membuat akun ${target}`,
          account_updated: `memperbarui akun ${target}`,
          password_reset_requested: `mereset akses ${target}`,
          account_activated: isSelfAction ? 'mengaktifkan akun' : `mengaktifkan akun ${target}`,
          jamaah_created: `menambahkan jemaah ${target}`,
          jamaah_updated: `memperbarui data jemaah ${target}`,
          jamaah_reset_access: `mereset akses jemaah ${target}`
        }[log.action] || `${log.action} · ${target}`;

        const meta = {
          account_created: details.role ? `role: ${details.role}` : '',
          account_updated: 'perubahan akun',
          password_reset_requested: 'reset akses',
          account_activated: details.role ? `role: ${details.role} · aktivasi mandiri` : 'aktivasi mandiri',
          jamaah_created: details.member_no ? `nomor: ${details.member_no}` : 'data jemaah',
          jamaah_updated: 'perubahan data jemaah',
          jamaah_reset_access: 'reset akses jemaah'
        }[log.action] || log.action;

        return `<div class="audit-row"><div><strong>${esc(actor)} ${esc(description)}</strong><span>${esc(meta)}</span></div><time>${esc(fmt(log.created_at))}</time></div>`;
      }).join('');
    } catch (_) {
      auditList.innerHTML = '<div class="table-state">Audit log belum dapat dimuat.</div>';
    }
  };

  const showActivation = (activation) => {
    activationCode.textContent = activation?.code || '—';
    activationExpiry.textContent = fmt(activation?.expires_at);
    activationModal.hidden = false;
  };

  const setFormMessage = (text = '', state = '') => {
    formMessage.textContent = text;
    formMessage.dataset.state = state;
    formMessage.hidden = !text;
  };

  const openCreate = () => {
    createForm?.reset();
    setFormMessage('');
    createModal.hidden = false;
  };
  const closeCreate = () => { createModal.hidden = true; };
  const closeActivationModal = () => { activationModal.hidden = true; };

  createForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(createForm);
    const payload = Object.fromEntries(form.entries());
    payload.username = String(payload.username || '').trim().toLowerCase();
    createSubmit.disabled = true;
    createSubmit.textContent = 'Membuat...';
    setFormMessage('');

    try {
      const data = await api('/admin/accounts', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      closeCreate();
      showActivation(data.activation);
      await Promise.all([loadAccounts(), loadAudit()]);
    } catch (error) {
      const message = {
        account_exists: 'Username atau email sudah digunakan.',
        invalid_username: 'Username harus 4–32 karakter dan hanya memakai huruf, angka, titik, garis bawah, atau tanda minus.',
        invalid_role: 'Role tidak valid.',
        display_name_required: 'Nama tampil wajib diisi.'
      }[error.code] || 'Akun belum dapat dibuat. Periksa data lalu coba lagi.';
      setFormMessage(message, 'error');
    } finally {
      createSubmit.disabled = false;
      createSubmit.textContent = 'Buat Akun';
    }
  });

  accountsBody?.addEventListener('change', async (event) => {
    const control = event.target.closest('[data-action="role"]');
    if (!control) return;
    const account = accounts.find((item) => item.account_uuid === control.dataset.id);
    if (!account || control.value === account.role) return;

    if (!window.confirm(`Ubah role @${account.username} menjadi ${roleLabel(control.value)}?`)) {
      control.value = account.role;
      return;
    }

    control.disabled = true;
    try {
      await api(`/admin/accounts/${encodeURIComponent(account.account_uuid)}`, {
        method: 'PATCH',
        body: JSON.stringify({ role: control.value })
      });
      await Promise.all([loadAccounts(), loadAudit()]);
    } catch (_) {
      control.value = account.role;
      window.alert('Role belum dapat diperbarui.');
    } finally {
      control.disabled = false;
    }
  });

  accountsBody?.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const account = accounts.find((item) => item.account_uuid === button.dataset.id);
    if (!account) return;

    if (button.dataset.action === 'status') {
      const next = button.dataset.status;
      const text = next === 'active' ? 'mengaktifkan' : 'menangguhkan';
      if (!window.confirm(`Anda yakin ingin ${text} akun @${account.username}?`)) return;
      button.disabled = true;
      try {
        await api(`/admin/accounts/${encodeURIComponent(account.account_uuid)}`, {
          method: 'PATCH',
          body: JSON.stringify({ account_status: next })
        });
        await Promise.all([loadAccounts(), loadAudit()]);
      } catch (_) {
        window.alert('Status akun belum dapat diperbarui.');
      } finally {
        button.disabled = false;
      }
    }

    if (button.dataset.action === 'reset') {
      if (!window.confirm(`Reset akses @${account.username}? Semua session aktif akan dicabut dan akun harus aktivasi ulang.`)) return;
      button.disabled = true;
      try {
        const data = await api(`/admin/accounts/${encodeURIComponent(account.account_uuid)}/reset-password`, {
          method: 'POST'
        });
        showActivation(data.activation);
        await Promise.all([loadAccounts(), loadAudit()]);
      } catch (_) {
        window.alert('Reset akses belum dapat diproses.');
      } finally {
        button.disabled = false;
      }
    }
  });

  document.querySelector('[data-open-create]')?.addEventListener('click', openCreate);
  document.querySelectorAll('[data-close-create]').forEach((node) => node.addEventListener('click', closeCreate));
  document.querySelectorAll('[data-close-activation]').forEach((node) => node.addEventListener('click', closeActivationModal));
  refreshButton?.addEventListener('click', () => Promise.all([loadAccounts(), loadAudit()]));

  copyActivation?.addEventListener('click', async () => {
    const value = activationCode.textContent.trim();
    if (!value || value === '—') return;
    try {
      await navigator.clipboard.writeText(value);
      copyActivation.textContent = 'Tersalin';
      setTimeout(() => { copyActivation.textContent = 'Salin Kode'; }, 1400);
    } catch (_) {
      window.prompt('Salin kode aktivasi:', value);
    }
  });

  Promise.all([loadAccounts(), loadAudit()]);
})();
