(() => {
  'use strict';
  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const body = document.querySelector('[data-admin-doc-body]');
  const filter = document.querySelector('[data-admin-doc-filter]');
  const refresh = document.querySelector('[data-admin-doc-refresh]');
  const modal = document.querySelector('[data-review-modal]');
  const form = document.querySelector('[data-review-form]');
  const message = document.querySelector('[data-review-message]');
  const submit = document.querySelector('[data-review-submit]');
  let rows = [];

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  const fmt = (value) => value ? new Intl.DateTimeFormat('id-ID',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Jakarta'}).format(new Date(value)) : '—';
  const statusLabel = (status) => ({not_reviewed:'Menunggu Verifikasi',verified:'Terverifikasi',needs_revision:'Perlu Perbaikan',rejected:'Ditolak'}[status] || status);

  const api = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials:'include', cache:'no-store',
      headers:{Accept:'application/json', ...(options.body ? {'Content-Type':'application/json'} : {}), ...(options.headers || {})},
      ...options
    });
    const type = response.headers.get('Content-Type') || '';
    const data = type.includes('application/json') ? await response.json().catch(()=>({})) : null;
    if (response.status === 401) {
      window.location.replace('/program/umroh-semi-private-bengkulu/admin/login/?reason=session');
      throw new Error('unauthorized');
    }
    if (response.status === 403) {
      window.location.replace('/program/umroh-semi-private-bengkulu/admin/?reason=forbidden');
      throw new Error('forbidden');
    }
    if (!response.ok || (data && !data.ok)) {
      const error = new Error(data?.error || `http_${response.status}`);
      error.code = data?.error || '';
      throw error;
    }
    return {response,data};
  };

  const render = () => {
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="6" class="table-state">Belum ada dokumen untuk filter ini.</td></tr>';
      return;
    }
    body.innerHTML = rows.map((row) => `<tr>
      <td><div class="admin-doc-name"><strong>${esc(row.full_name || 'Jemaah')}</strong><span>${esc(row.member_no || '—')}</span></div></td>
      <td>${esc(row.document_key)}</td>
      <td><div class="admin-doc-name"><strong>${esc(row.original_name)}</strong><span>v${esc(row.version)} · ${(Number(row.size_bytes||0)/1024/1024).toFixed(2)} MB</span></div></td>
      <td><span class="admin-doc-status ${esc(row.admin_status)}">${esc(statusLabel(row.admin_status))}</span>${row.admin_note ? `<div class="admin-doc-name"><span>${esc(row.admin_note)}</span></div>` : ''}</td>
      <td>${esc(fmt(row.uploaded_at))}</td>
      <td><div class="admin-doc-actions"><button data-action="download" data-id="${esc(row.file_uuid)}">Unduh</button><button data-action="review" data-id="${esc(row.file_uuid)}">Verifikasi</button></div></td>
    </tr>`).join('');
  };

  const load = async () => {
    body.innerHTML = '<tr><td colspan="6" class="table-state">Memuat dokumen...</td></tr>';
    try {
      const q = filter.value ? `?review=${encodeURIComponent(filter.value)}` : '';
      const {data} = await api(`/admin/documents${q}`);
      rows = data.documents || [];
      render();
    } catch (error) {
      if (!['unauthorized','forbidden'].includes(error.message)) body.innerHTML = '<tr><td colspan="6" class="table-state">Dokumen belum dapat dimuat.</td></tr>';
    }
  };

  body.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const row = rows.find((item) => item.file_uuid === button.dataset.id);
    if (!row) return;

    if (button.dataset.action === 'review') {
      form.elements.file_uuid.value = row.file_uuid;
      form.elements.status.value = row.admin_status || 'not_reviewed';
      form.elements.note.value = row.admin_note || '';
      message.hidden = true;
      modal.hidden = false;
      return;
    }

    if (button.dataset.action === 'download') {
      button.disabled = true;
      try {
        const {response} = await api(`/admin/documents/${encodeURIComponent(row.file_uuid)}/download`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = row.original_name || 'dokumen'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      } catch (_) {
        window.alert('Dokumen belum dapat diunduh.');
      } finally { button.disabled = false; }
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileUuid = form.elements.file_uuid.value;
    const payload = {status: form.elements.status.value, note: form.elements.note.value.trim()};
    submit.disabled = true; submit.textContent = 'Menyimpan...'; message.hidden = true;
    try {
      await api(`/admin/documents/${encodeURIComponent(fileUuid)}/review`, {method:'PATCH', body:JSON.stringify(payload)});
      modal.hidden = true;
      await load();
    } catch (error) {
      message.textContent = error.code === 'review_note_required'
        ? 'Catatan wajib untuk status Perlu Perbaikan atau Ditolak.'
        : 'Verifikasi belum dapat disimpan.';
      message.dataset.state = 'error'; message.hidden = false;
    } finally { submit.disabled = false; submit.textContent = 'Simpan Verifikasi'; }
  });

  document.querySelectorAll('[data-close-review]').forEach((node) => node.addEventListener('click', () => { modal.hidden = true; }));
  filter.addEventListener('change', load);
  refresh.addEventListener('click', load);
  load();
})();
