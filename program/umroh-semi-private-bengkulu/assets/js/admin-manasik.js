(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const body = document.querySelector('[data-manasik-body]');
  const refresh = document.querySelector('[data-manasik-refresh]');
  const filter = document.querySelector('[data-manasik-filter]');
  const modal = document.querySelector('[data-manasik-modal]');
  const form = document.querySelector('[data-manasik-form]');
  const blocksHost = document.querySelector('[data-blocks]');
  const addBlockButton = document.querySelector('[data-block-add]');
  const message = document.querySelector('[data-manasik-message]');
  const submit = document.querySelector('[data-manasik-submit]');
  const dialogTitle = document.querySelector('[data-manasik-dialog-title]');

  let materials = [];

  const esc = (value) => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

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
    if (!response.ok || !data?.ok) {
      const error = new Error(data?.error || `http_${response.status}`);
      error.code = data?.error || '';
      throw error;
    }
    return data;
  };

  const canEdit = () => ['super_admin', 'admin', 'tour_leader'].includes(window.UMROH_ADMIN_ACCOUNT?.role || '');
  const fmt = (iso) => {
    if (!iso) return '—';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
    }).format(date).replace('.', ':');
  };

  const show = (text, state = 'error') => {
    message.hidden = false;
    message.dataset.state = state;
    message.textContent = text;
  };
  const hideMessage = () => {
    message.hidden = true;
    message.textContent = '';
  };

  const renderStats = (summary = {}) => {
    document.querySelector('[data-manasik-stat-total]').textContent = Number(summary.total || 0);
    document.querySelector('[data-manasik-stat-published]').textContent = Number(summary.published || 0);
    document.querySelector('[data-manasik-stat-draft]').textContent = Number(summary.draft || 0);
    document.querySelector('[data-manasik-stat-jamaah]').textContent = Number(summary.active_jamaah || 0);
  };

  const matches = (material) => {
    const value = filter?.value || '';
    if (!value) return true;
    if (value === 'published') return material.is_published;
    if (value === 'draft') return !material.is_published;
    return true;
  };

  const render = () => {
    const rows = materials.filter(matches);
    if (!rows.length) {
      body.innerHTML = '<tr><td class="table-state" colspan="6">Belum ada materi untuk filter ini.</td></tr>';
      return;
    }

    body.innerHTML = rows.map((material) => `
      <tr>
        <td><span class="order-pill">${String(material.sort_order).padStart(2, '0')}</span></td>
        <td class="admin-manasik-name">
          <strong>${esc(material.title)}</strong>
          <span>${esc(material.material_key)}</span>
        </td>
        <td><span class="manasik-pill ${material.is_published ? 'published' : 'draft'}">${material.is_published ? 'Dipublikasikan' : 'Draft'}</span></td>
        <td>${Number(material.complete_count || 0)}</td>
        <td>${esc(fmt(material.updated_at))}</td>
        <td><div class="admin-manasik-actions">${canEdit() ? `<button data-edit-manasik="${material.id}" type="button">Edit</button>` : '<span>Read-only</span>'}</div></td>
      </tr>
    `).join('');

    body.querySelectorAll('[data-edit-manasik]').forEach((button) => {
      button.addEventListener('click', () => openEdit(Number(button.dataset.editManasik)));
    });
  };

  const blockTypes = [
    ['section', 'Bagian'],
    ['arabic', 'Arab / Doa'],
    ['note', 'Catatan'],
    ['steps', 'Langkah Bernomor'],
    ['tips', 'Tips Bernomor']
  ];

  const blockItemLines = (block) => (block.items || [])
    .map((item) => `${item.title || ''}${item.detail ? ` | ${item.detail}` : ''}`)
    .join('\n');

  const createBlockEditor = (block = { type: 'section', heading: '', body: '' }) => {
    const wrap = document.createElement('section');
    wrap.className = 'admin-block';

    wrap.innerHTML = `
      <div class="admin-block-toolbar">
        <label>Tipe
          <select data-block-type>
            ${blockTypes.map(([value, label]) => `<option value="${value}" ${block.type === value ? 'selected' : ''}>${label}</option>`).join('')}
          </select>
        </label>
        <div class="admin-block-order">
          <button type="button" data-block-up title="Naik">↑</button>
          <button type="button" data-block-down title="Turun">↓</button>
          <button type="button" data-block-remove title="Hapus">Hapus</button>
        </div>
      </div>
      <label data-field-heading>Judul Bagian<input maxlength="120" data-block-heading value="${esc(block.heading || '')}"/></label>
      <label data-field-arabic>Teks Arab<textarea rows="4" maxlength="3000" data-block-arabic>${esc(block.arabic || '')}</textarea></label>
      <label data-field-body>Isi<textarea rows="5" maxlength="5000" data-block-body>${esc(block.body || '')}</textarea></label>
      <label data-field-items>Item <small>Satu baris per item. Format: Judul | Keterangan</small><textarea rows="6" data-block-items>${esc(blockItemLines(block))}</textarea></label>
    `;

    const updateFields = () => {
      const type = wrap.querySelector('[data-block-type]').value;
      wrap.querySelector('[data-field-heading]').hidden = !['section', 'arabic'].includes(type);
      wrap.querySelector('[data-field-arabic]').hidden = type !== 'arabic';
      wrap.querySelector('[data-field-body]').hidden = ['steps', 'tips'].includes(type);
      wrap.querySelector('[data-field-items]').hidden = !['steps', 'tips'].includes(type);

      const bodyLabel = wrap.querySelector('[data-field-body]');
      if (bodyLabel) {
        const smallHelp = type === 'section'
          ? 'Gunakan "- " di awal setiap baris untuk daftar.'
          : '';
        bodyLabel.firstChild.textContent = type === 'note' ? 'Catatan ' : type === 'arabic' ? 'Latin / Keterangan ' : 'Isi ';
        let small = bodyLabel.querySelector('small');
        if (smallHelp) {
          if (!small) {
            small = document.createElement('small');
            bodyLabel.insertBefore(small, bodyLabel.querySelector('textarea'));
          }
          small.textContent = smallHelp;
        } else if (small) {
          small.remove();
        }
      }
    };

    wrap.querySelector('[data-block-type]').addEventListener('change', updateFields);
    wrap.querySelector('[data-block-remove]').addEventListener('click', () => {
      if (blocksHost.children.length <= 1) {
        show('Materi harus memiliki minimal satu blok isi.');
        return;
      }
      wrap.remove();
    });
    wrap.querySelector('[data-block-up]').addEventListener('click', () => {
      const previous = wrap.previousElementSibling;
      if (previous) blocksHost.insertBefore(wrap, previous);
    });
    wrap.querySelector('[data-block-down]').addEventListener('click', () => {
      const next = wrap.nextElementSibling;
      if (next) blocksHost.insertBefore(next, wrap);
    });

    updateFields();
    return wrap;
  };

  const setBlocks = (blocks) => {
    blocksHost.replaceChildren();
    (Array.isArray(blocks) && blocks.length ? blocks : [{ type: 'section', heading: '', body: '' }])
      .forEach((block) => blocksHost.appendChild(createBlockEditor(block)));
  };

  const collectBlocks = () => [...blocksHost.querySelectorAll('.admin-block')].map((wrap) => {
    const type = wrap.querySelector('[data-block-type]').value;
    if (type === 'section') {
      return {
        type,
        heading: wrap.querySelector('[data-block-heading]').value.trim(),
        body: wrap.querySelector('[data-block-body]').value.trim()
      };
    }
    if (type === 'arabic') {
      return {
        type,
        heading: wrap.querySelector('[data-block-heading]').value.trim(),
        arabic: wrap.querySelector('[data-block-arabic]').value.trim(),
        body: wrap.querySelector('[data-block-body]').value.trim()
      };
    }
    if (type === 'note') {
      return { type, body: wrap.querySelector('[data-block-body]').value.trim() };
    }

    const items = wrap.querySelector('[data-block-items]').value.split(/\r?\n/)
      .map((line) => line.trim()).filter(Boolean)
      .map((line, index) => {
        const [title, ...rest] = line.split('|');
        return {
          number: String(index + 1).padStart(2, '0'),
          title: (title || '').trim(),
          detail: rest.join('|').trim()
        };
      });

    return { type, items };
  });

  const load = async () => {
    body.innerHTML = '<tr><td class="table-state" colspan="6">Memuat materi Manasik...</td></tr>';
    try {
      const data = await api('/admin/manasik');
      materials = data.materials || [];
      renderStats(data.summary || {});
      render();
    } catch (error) {
      body.innerHTML = `<tr><td class="table-state" colspan="6">Gagal memuat materi: ${esc(error.code || error.message)}</td></tr>`;
    }
  };

  const openEdit = (id) => {
    const material = materials.find((item) => Number(item.id) === Number(id));
    if (!material) return;

    form.reset();
    form.elements.id.value = material.id;
    form.elements.sort_order.value = material.sort_order || 1;
    form.elements.title.value = material.title || '';
    form.elements.summary.value = material.summary || '';
    form.elements.is_published.checked = Boolean(material.is_published);
    setBlocks(material.content || []);
    dialogTitle.textContent = `Edit Materi · ${material.title}`;
    hideMessage();
    modal.hidden = false;
  };

  const close = () => { modal.hidden = true; };

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideMessage();

    const id = Number(form.elements.id.value || 0);
    const payload = {
      sort_order: Number(form.elements.sort_order.value),
      title: form.elements.title.value.trim(),
      summary: form.elements.summary.value.trim(),
      is_published: form.elements.is_published.checked,
      content: collectBlocks()
    };

    submit.disabled = true;
    submit.textContent = 'Menyimpan...';
    try {
      await api(`/admin/manasik/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      show('Materi Manasik berhasil diperbarui.', 'success');
      await load();
      setTimeout(close, 650);
    } catch (error) {
      const labels = {
        manasik_title_required: 'Judul materi wajib diisi.',
        manasik_summary_required: 'Ringkasan materi wajib diisi.',
        invalid_manasik_order: 'Urutan materi tidak valid.',
        invalid_manasik_content: 'Isi materi tidak valid.',
        invalid_manasik_section: 'Bagian materi harus memiliki judul dan isi.',
        invalid_manasik_arabic: 'Blok Arab harus memiliki judul dan teks Arab.',
        invalid_manasik_note: 'Catatan tidak boleh kosong.',
        invalid_manasik_items: 'Blok langkah/tips harus memiliki item.',
        invalid_manasik_item: 'Judul item tidak boleh kosong.',
        forbidden: 'Role akun ini tidak diizinkan mengubah materi Manasik.'
      };
      show(labels[error.code] || `Gagal menyimpan: ${error.code || error.message}`);
    } finally {
      submit.disabled = false;
      submit.textContent = 'Simpan Materi';
    }
  });

  document.querySelectorAll('[data-manasik-close]').forEach((node) => node.addEventListener('click', close));
  addBlockButton?.addEventListener('click', () => blocksHost.appendChild(createBlockEditor()));
  refresh?.addEventListener('click', load);
  filter?.addEventListener('change', render);

  const wait = () => {
    if (document.documentElement.classList.contains('auth-ready')) {
      load();
    } else {
      setTimeout(wait, 60);
    }
  };
  wait();
})();
