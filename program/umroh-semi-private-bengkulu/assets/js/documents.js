(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const items = ['paspor-dokumen','tiket-itinerary','identitas-jemaah','dokumen-kesehatan'];
  const maxBytes = 5 * 1024 * 1024;
  let documents = new Map();

  const fmt = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta'
    }).format(date);
  };

  const reviewLabel = (status) => ({
    not_reviewed: 'Menunggu verifikasi',
    verified: 'Terverifikasi',
    needs_revision: 'Perlu perbaikan',
    rejected: 'Ditolak'
  }[status] || 'Belum diupload');

  const api = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    const type = response.headers.get('Content-Type') || '';
    const data = type.includes('application/json')
      ? await response.json().catch(() => ({}))
      : null;

    if (response.status === 401) {
      window.location.replace('/program/umroh-semi-private-bengkulu/jamaah/login/?reason=session');
      throw new Error('unauthorized');
    }
    if (!response.ok || (data && !data.ok)) {
      const error = new Error(data?.error || `http_${response.status}`);
      error.code = data?.error || '';
      throw error;
    }
    return { response, data };
  };

  const message = document.createElement('p');
  message.className = 'documents-upload-message';
  message.hidden = true;
  const list = document.querySelector('.documents-list');
  list?.parentNode?.insertBefore(message, list);

  const setMessage = (text = '', state = '') => {
    message.textContent = text;
    message.dataset.state = state;
    message.hidden = !text;
  };

  const updateSummary = () => {
    const uploaded = items.filter((key) => documents.get(key)?.file).length;
    const verified = items.filter((key) => documents.get(key)?.admin_status === 'verified').length;
    const percent = Math.round((uploaded / items.length) * 100);
    document.querySelectorAll('[data-docs-count]').forEach((el) => { el.textContent = `${uploaded} / ${items.length}`; });
    document.querySelectorAll('[data-docs-percent]').forEach((el) => { el.textContent = `${percent}% terunggah`; });
    document.querySelectorAll('[data-docs-bar]').forEach((el) => { el.style.width = `${percent}%`; });

    const title = document.querySelector('[data-docs-summary-title]');
    const copy = document.querySelector('[data-docs-summary-copy]');
    if (title && copy) {
      if (!uploaded) {
        title.textContent = 'Belum ada dokumen yang diupload';
        copy.textContent = 'Upload dokumen yang diminta. Berkas akan menunggu verifikasi Admin.';
      } else {
        title.textContent = `${uploaded} dari ${items.length} dokumen sudah diupload`;
        copy.textContent = `${verified} terverifikasi · ${uploaded - verified} masih dalam proses / memerlukan tindakan.`;
      }
    }
  };

  const render = () => {
    items.forEach((key) => {
      const row = document.querySelector(`[data-doc-item="${key}"]`);
      if (!row) return;
      const doc = documents.get(key) || {};
      const file = doc.file || null;
      const status = doc.admin_status || 'not_reviewed';
      const label = row.querySelector('[data-doc-state-label]');
      const note = row.querySelector('[data-doc-server-note]');
      const upload = row.querySelector('[data-doc-upload]');
      const download = row.querySelector('[data-doc-download]');

      row.classList.toggle('is-verified', status === 'verified');
      row.classList.toggle('is-needs-revision', status === 'needs_revision');
      row.classList.toggle('is-rejected', status === 'rejected');

      if (label) {
        label.innerHTML = file
          ? `<span class="document-review-badge ${status === 'not_reviewed' ? 'pending' : status}">${reviewLabel(status)}</span>`
          : 'Belum diupload';
      }
      if (note) {
        const parts = [];
        if (file) parts.push(`${file.original_name} · versi ${file.version} · ${(file.size_bytes / 1024 / 1024).toFixed(2)} MB`);
        if (file?.uploaded_at) parts.push(`Upload ${fmt(file.uploaded_at)}`);
        if (doc.admin_note) parts.push(`Catatan Admin: ${doc.admin_note}`);
        note.textContent = parts.join(' · ');
      }
      if (upload) {
        upload.textContent = file ? 'Ganti Dokumen' : 'Upload Dokumen';
        upload.classList.toggle('is-replace', Boolean(file));
      }
      if (download) {
        download.hidden = !file;
        download.dataset.fileUuid = file?.file_uuid || '';
      }
    });
    updateSummary();
  };

  const load = async () => {
    try {
      const { data } = await api('/jamaah/documents');
      documents = new Map((data.documents || []).map((doc) => [doc.document_key, doc]));
      render();
    } catch (error) {
      if (error.message !== 'unauthorized') setMessage('Status dokumen belum dapat dimuat.', 'error');
    }
  };

  document.addEventListener('click', async (event) => {
    const upload = event.target.closest('[data-doc-upload]');
    const download = event.target.closest('[data-doc-download]');

    if (upload) {
      const row = upload.closest('[data-doc-item]');
      row?.querySelector('[data-doc-file]')?.click();
      return;
    }

    if (download) {
      const fileUuid = download.dataset.fileUuid;
      if (!fileUuid) return;
      download.disabled = true;
      try {
        const { response } = await api(`/jamaah/documents/${encodeURIComponent(fileUuid)}/download`);
        const blob = await response.blob();
        const doc = [...documents.values()].find((item) => item.file?.file_uuid === fileUuid);
        const name = doc?.file?.original_name || 'dokumen';
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = name;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
      } catch (_) {
        setMessage('Dokumen belum dapat diunduh.', 'error');
      } finally {
        download.disabled = false;
      }
    }
  });

  document.addEventListener('change', async (event) => {
    const input = event.target.closest('[data-doc-file]');
    if (!input) return;
    const row = input.closest('[data-doc-item]');
    const key = row?.dataset.docItem;
    const file = input.files?.[0];
    if (!key || !file) return;

    if (!['application/pdf','image/jpeg','image/png'].includes(file.type)) {
      setMessage('Format yang diterima hanya PDF, JPG, atau PNG.', 'error');
      input.value = '';
      return;
    }
    if (file.size > maxBytes) {
      setMessage('Ukuran file maksimum 5 MB.', 'error');
      input.value = '';
      return;
    }

    const button = row.querySelector('[data-doc-upload]');
    button.disabled = true;
    button.textContent = 'Mengupload...';
    setMessage('');

    try {
      const form = new FormData();
      form.append('file', file);
      await api(`/jamaah/documents/${encodeURIComponent(key)}/upload`, {
        method: 'POST',
        body: form
      });
      setMessage('Dokumen berhasil diupload ke penyimpanan private dan menunggu verifikasi Admin.', 'success');
      await load();
    } catch (error) {
      const text = {
        file_too_large: 'Ukuran file maksimum 5 MB.',
        unsupported_file_type: 'Format yang diterima hanya PDF, JPG, atau PNG.',
        file_signature_mismatch: 'Isi file tidak sesuai dengan format yang dipilih.',
        missing_documents_bucket: 'Penyimpanan dokumen belum dikonfigurasi.'
      }[error.code] || 'Upload belum berhasil. Coba kembali.';
      setMessage(text, 'error');
    } finally {
      input.value = '';
      button.disabled = false;
      render();
    }
  });

  load();
})();
