(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const body = document.querySelector('[data-jamaah-body]');
  const searchInput = document.querySelector('[data-jamaah-search]');
  const statusSelect = document.querySelector('[data-jamaah-status]');
  const refreshButton = document.querySelector('[data-jamaah-refresh]');
  const countNode = document.querySelector('[data-jamaah-count]');
  const openButton = document.querySelector('[data-open-jamaah-form]');
  const modal = document.querySelector('[data-jamaah-modal]');
  const form = document.querySelector('[data-jamaah-form]');
  const formTitle = document.querySelector('[data-jamaah-form-title]');
  const formMessage = document.querySelector('[data-jamaah-form-message]');
  const submitButton = document.querySelector('[data-jamaah-submit]');
  const createNote = document.querySelector('[data-jamaah-create-note]');
  const activationModal = document.querySelector('[data-jamaah-activation-modal]');
  const activationCode = document.querySelector('[data-jamaah-activation-code]');
  const activationExpiry = document.querySelector('[data-jamaah-activation-expiry]');
  const copyCode = document.querySelector('[data-copy-jamaah-code]');

  let searchTimer = null;
  let canWrite = false;
  let rows = [];

  const initialParams = new URLSearchParams(window.location.search);
  const initialSearch = String(initialParams.get('q') || initialParams.get('search') || '').trim();
  if (searchInput && initialSearch) searchInput.value = initialSearch;

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));

  const fmt = (value, empty = 'Belum pernah') => {
    if (!value) return empty;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Jakarta'
    }).format(date);
  };

  const statusLabel = (status) => ({
    active: 'Aktif',
    pending_activation: 'Menunggu Aktivasi',
    suspended: 'Ditangguhkan',
    disabled: 'Dinonaktifkan'
  }[status] || status || '—');

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
      const error = new Error('forbidden');
      error.code = 'forbidden';
      throw error;
    }
    if (!response.ok || !data?.ok) {
      const error = new Error(data?.error || `http_${response.status}`);
      error.code = data?.error || '';
      throw error;
    }
    return data;
  };

  const setFormMessage = (text = '', state = '') => {
    if (!formMessage) return;
    formMessage.textContent = text;
    formMessage.dataset.state = state;
    formMessage.hidden = !text;
  };

  const showActivation = (activation) => {
    activationCode.textContent = activation?.code || '—';
    activationExpiry.textContent = fmt(activation?.expires_at, '—');
    activationModal.hidden = false;
  };

  const openCreate = () => {
    form.reset();
    form.elements.account_uuid.value = '';
    formTitle.textContent = 'Tambah Jemaah';
    submitButton.textContent = 'Buat Jemaah';
    createNote.hidden = false;
    setFormMessage('');
    modal.hidden = false;
  };

  const openEdit = (row) => {
    form.reset();
    form.elements.account_uuid.value = row.account_uuid || '';
    form.elements.member_no.value = row.member_no || '';
    form.elements.full_name.value = row.full_name || '';
    form.elements.email.value = row.email || '';
    form.elements.whatsapp.value = row.whatsapp || '';
    form.elements.group_name.value = row.group_name || '';
    form.elements.departure_batch.value = row.departure_batch || '';
    form.elements.notes.value = row.notes || '';
    formTitle.textContent = 'Edit Jemaah';
    submitButton.textContent = 'Simpan Perubahan';
    createNote.hidden = true;
    setFormMessage('');
    modal.hidden = false;
  };

  const closeForm = () => { modal.hidden = true; };
  const closeActivation = () => { activationModal.hidden = true; };

  const loadCapabilities = async () => {
    try {
      const data = await api('/auth/me');
      canWrite = ['super_admin', 'admin'].includes(data.account?.role);
      if (openButton) openButton.hidden = !canWrite;
    } catch (_) {
      canWrite = false;
      if (openButton) openButton.hidden = true;
    }
  };

  const updateStats = async () => {
    try {
      const data = await api('/admin/jamaah/stats');
      const s = data.summary || {};
      document.querySelector('[data-jamaah-total]').textContent = Number(s.total || 0);
      document.querySelector('[data-jamaah-active]').textContent = Number(s.active || 0);
      document.querySelector('[data-jamaah-pending]').textContent = Number(s.pending_activation || 0);
      document.querySelector('[data-jamaah-attention]').textContent =
        Number(s.suspended || 0) + Number(s.disabled || 0);
    } catch (error) {
      if (error.code !== 'forbidden') {
        document.querySelectorAll('[data-jamaah-total],[data-jamaah-active],[data-jamaah-pending],[data-jamaah-attention]')
          .forEach((node) => { node.textContent = '—'; });
      }
    }
  };

  const actionButtons = (row) => {
    if (!canWrite) return '<span>—</span>';
    const edit = `<button data-action="edit" data-id="${esc(row.account_uuid)}">Edit</button>`;
    const reset = `<button data-action="reset" data-id="${esc(row.account_uuid)}">Reset Akses</button>`;
    let status = '';
    if (row.account_status === 'active') {
      status = `<button class="danger" data-action="status" data-status="suspended" data-id="${esc(row.account_uuid)}">Tangguhkan</button>`;
    } else if (['suspended', 'disabled'].includes(row.account_status) && Number(row.has_password || 0) === 1) {
      status = `<button data-action="status" data-status="active" data-id="${esc(row.account_uuid)}">Aktifkan</button>`;
    }
    return `${edit}${status}${reset}`;
  };

  const renderRows = () => {
    if (!body) return;
    countNode.textContent = rows.length;
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="8" class="table-state">Belum ada data jemaah nyata di D1 untuk filter ini.</td></tr>';
      return;
    }

    body.innerHTML = rows.map((row) => {
      const contact = [
        row.email ? `<span>${esc(row.email)}</span>` : '',
        row.whatsapp ? `<span>${esc(row.whatsapp)}</span>` : ''
      ].filter(Boolean).join('') || '<span>Belum diisi</span>';

      const group = [
        row.group_name ? esc(row.group_name) : '',
        row.departure_batch ? esc(row.departure_batch) : ''
      ].filter(Boolean).join(' · ') || '—';

      return `<tr>
        <td><div class="jamaah-name"><strong>${esc(row.full_name || 'Nama belum diisi')}</strong><span>${esc(row.account_uuid)}</span></div></td>
        <td>${esc(row.member_no || '—')}</td>
        <td><div class="jamaah-contact">${contact}</div></td>
        <td>${group}</td>
        <td><span class="jamaah-status ${esc(row.account_status)}">${esc(statusLabel(row.account_status))}</span></td>
        <td>${esc(fmt(row.last_login_at))}</td>
        <td>${esc(fmt(row.created_at, '—'))}</td>
        <td><div class="jamaah-actions">${actionButtons(row)}</div></td>
      </tr>`;
    }).join('');
  };

  const loadRows = async () => {
    if (body) body.innerHTML = '<tr><td colspan="8" class="table-state">Memuat data jemaah...</td></tr>';
    const params = new URLSearchParams();
    const search = searchInput?.value.trim();
    const status = statusSelect?.value || '';
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    params.set('limit', '200');

    try {
      const data = await api(`/admin/jamaah?${params.toString()}`);
      rows = data.jamaah || [];
      renderRows();
    } catch (error) {
      if (error.message === 'unauthorized') return;
      if (body) body.innerHTML = '<tr><td colspan="8" class="table-state">Data jemaah belum dapat dimuat. Coba lagi.</td></tr>';
      if (countNode) countNode.textContent = '0';
    }
  };

  const reload = () => Promise.all([updateStats(), loadRows()]);

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!canWrite) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const uuid = String(data.account_uuid || '');
    delete data.account_uuid;
    data.member_no = String(data.member_no || '').trim().toUpperCase();
    data.full_name = String(data.full_name || '').trim();

    submitButton.disabled = true;
    submitButton.textContent = uuid ? 'Menyimpan...' : 'Membuat...';
    setFormMessage('');

    try {
      if (uuid) {
        await api(`/admin/jamaah/${encodeURIComponent(uuid)}`, {
          method: 'PATCH',
          body: JSON.stringify(data)
        });
        closeForm();
      } else {
        const result = await api('/admin/jamaah', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        closeForm();
        showActivation(result.activation);
      }
      await reload();
    } catch (error) {
      const message = {
        invalid_member_no: 'Nomor Jemaah minimal 3 karakter dan hanya boleh memakai huruf, angka, titik, garis bawah, garis miring, atau tanda minus.',
        member_no_exists: 'Nomor Jemaah sudah digunakan.',
        jamaah_exists: 'Nomor Jemaah, email, atau WhatsApp sudah digunakan akun lain.',
        email_exists: 'Email sudah digunakan akun lain.',
        whatsapp_exists: 'Nomor WhatsApp sudah digunakan akun lain.',
        invalid_email: 'Format email tidak valid.',
        invalid_whatsapp: 'Nomor WhatsApp tidak valid.',
        full_name_required: 'Nama lengkap wajib diisi.'
      }[error.code] || 'Data jemaah belum dapat disimpan. Periksa data lalu coba lagi.';
      setFormMessage(message, 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = uuid ? 'Simpan Perubahan' : 'Buat Jemaah';
    }
  });

  body?.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button || !canWrite) return;
    const row = rows.find((item) => item.account_uuid === button.dataset.id);
    if (!row) return;

    if (button.dataset.action === 'edit') {
      openEdit(row);
      return;
    }

    if (button.dataset.action === 'status') {
      const next = button.dataset.status;
      const verb = next === 'active' ? 'mengaktifkan kembali' : 'menangguhkan';
      if (!window.confirm(`Anda yakin ingin ${verb} ${row.full_name || row.member_no}?`)) return;
      button.disabled = true;
      try {
        await api(`/admin/jamaah/${encodeURIComponent(row.account_uuid)}`, {
          method: 'PATCH',
          body: JSON.stringify({ account_status: next })
        });
        await reload();
      } catch (error) {
        window.alert(error.code === 'activation_required'
          ? 'Akun ini harus melalui aktivasi terlebih dahulu.'
          : 'Status jemaah belum dapat diperbarui.');
      } finally {
        button.disabled = false;
      }
      return;
    }

    if (button.dataset.action === 'reset') {
      if (!window.confirm(`Reset akses ${row.full_name || row.member_no}? Session aktif akan dicabut dan jemaah harus membuat password baru melalui aktivasi.`)) return;
      button.disabled = true;
      try {
        const result = await api(`/admin/jamaah/${encodeURIComponent(row.account_uuid)}/reset-access`, {
          method: 'POST'
        });
        showActivation(result.activation);
        await reload();
      } catch (_) {
        window.alert('Reset akses jemaah belum dapat diproses.');
      } finally {
        button.disabled = false;
      }
    }
  });

  openButton?.addEventListener('click', openCreate);
  document.querySelectorAll('[data-close-jamaah-form]').forEach((node) => node.addEventListener('click', closeForm));
  document.querySelectorAll('[data-close-jamaah-activation]').forEach((node) => node.addEventListener('click', closeActivation));
  refreshButton?.addEventListener('click', reload);
  statusSelect?.addEventListener('change', loadRows);
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadRows, 280);
  });

  copyCode?.addEventListener('click', async () => {
    const value = activationCode.textContent.trim();
    if (!value || value === '—') return;
    try {
      await navigator.clipboard.writeText(value);
      copyCode.textContent = 'Tersalin';
      setTimeout(() => { copyCode.textContent = 'Salin Kode'; }, 1400);
    } catch (_) {
      window.prompt('Salin kode aktivasi:', value);
    }
  });

  (async () => {
    await loadCapabilities();
    await reload();
  })();
})();
