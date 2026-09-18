(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const body = document.querySelector('[data-agenda-body]');
  const refresh = document.querySelector('[data-agenda-refresh]');
  const filter = document.querySelector('[data-agenda-filter]');
  const add = document.querySelector('[data-agenda-add]');
  const modal = document.querySelector('[data-agenda-modal]');
  const form = document.querySelector('[data-agenda-form]');
  const message = document.querySelector('[data-agenda-message]');
  const submit = document.querySelector('[data-agenda-submit]');
  const dialogTitle = document.querySelector('[data-agenda-dialog-title]');

  let events = [];

  const esc = (value) => String(value ?? '')
    .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
    .replaceAll('"','&quot;').replaceAll("'",'&#039;');

  const api = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type':'application/json' } : {}),
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

  const roleCanEdit = () => {
    const role = document.documentElement.dataset.adminRole || window.UMROH_ADMIN_ACCOUNT?.role || '';
    return ['super_admin','admin','tour_leader'].includes(role);
  };

  const statusLabel = (status) => ({
    draft:'Draft', scheduled:'Terjadwal', confirmed:'Dikonfirmasi', cancelled:'Dibatalkan'
  }[status] || status);

  const fmt = (iso) => {
    if (!iso) return 'Belum ditetapkan';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return new Intl.DateTimeFormat('id-ID', {
      day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit',
      timeZone:'Asia/Jakarta'
    }).format(date).replace('.', ':');
  };

  const splitJakartaIso = (iso) => {
    const text = String(iso || '').trim();
    const exact = text.match(
      /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::\d{2})?\+07:00$/
    );
    if (exact) {
      return { date: exact[1], time: `${exact[2]}:${exact[3]}` };
    }

    if (!text) return { date:'', time:'' };

    const parsed = new Date(text);
    if (Number.isNaN(parsed.getTime())) return { date:'', time:'' };

    const date = new Intl.DateTimeFormat('en-CA', {
      year:'numeric', month:'2-digit', day:'2-digit', timeZone:'Asia/Jakarta'
    }).format(parsed);

    const time = new Intl.DateTimeFormat('en-GB', {
      hour:'2-digit', minute:'2-digit', hour12:false, timeZone:'Asia/Jakarta'
    }).format(parsed);

    return { date, time };
  };

  const dateValue = (iso) => splitJakartaIso(iso).date;
  const timeValue = (iso) => splitJakartaIso(iso).time;

  const normalizeTimeInput = (value) => {
    const text = String(value || '').trim();
    const match = text.match(/^(\d{2}):(\d{2})$/);
    if (!match) return '';
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour > 23 || minute > 59) return '';
    return `${match[1]}:${match[2]}`;
  };

  const toIsoJakarta = (date, time) => {
    const cleanDate = String(date || '').trim();
    const cleanTime = normalizeTimeInput(time);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDate) || !cleanTime) return null;
    return `${cleanDate}T${cleanTime}:00+07:00`;
  };

  const sameDateTimeInputs = (date, time, iso) => {
    const original = splitJakartaIso(iso);
    return String(date || '') === original.date &&
      normalizeTimeInput(time) === original.time;
  };

  const showMessage = (text, state='error') => {
    if (!message) return;
    message.hidden = false;
    message.dataset.state = state;
    message.textContent = text;
  };

  const hideMessage = () => {
    if (!message) return;
    message.hidden = true;
    message.textContent = '';
  };

  const renderStats = (summary={}) => {
    document.querySelector('[data-agenda-stat-total]').textContent = Number(summary.total || 0);
    document.querySelector('[data-agenda-stat-published]').textContent = Number(summary.published || 0);
    document.querySelector('[data-agenda-stat-draft]').textContent = Number(summary.draft || 0);
    document.querySelector('[data-agenda-stat-upcoming]').textContent = Number(summary.upcoming || 0);
  };

  const matchesFilter = (event) => {
    const value = filter?.value || '';
    if (!value) return true;
    if (value === 'published') return event.is_published;
    return event.event_status === value;
  };

  const renderRows = () => {
    if (!body) return;
    const rows = events.filter(matchesFilter);
    if (!rows.length) {
      body.innerHTML = '<tr><td class="table-state" colspan="6">Belum ada agenda untuk filter ini.</td></tr>';
      return;
    }

    const canEdit = roleCanEdit();
    body.innerHTML = rows.map((event) => `
      <tr>
        <td class="admin-agenda-name"><strong>${esc(event.title)}</strong><span>${esc(event.category || 'Perjalanan')} · ${esc(event.event_key)}</span></td>
        <td><strong>${esc(fmt(event.starts_at))}</strong>${event.ends_at ? `<br><span>Selesai ${esc(fmt(event.ends_at))}</span>` : ''}</td>
        <td>${esc(event.location_text || 'Belum ditetapkan')}</td>
        <td><span class="agenda-pill ${esc(event.event_status)}">${esc(statusLabel(event.event_status))}</span></td>
        <td><span class="agenda-pill ${event.is_published ? 'published' : 'unpublished'}">${event.is_published ? 'Dipublikasikan' : 'Belum dipublikasikan'}</span></td>
        <td><div class="admin-agenda-actions">${canEdit ? `<button data-edit-agenda="${event.id}" type="button">Edit</button>` : '<span>Read-only</span>'}</div></td>
      </tr>
    `).join('');

    body.querySelectorAll('[data-edit-agenda]').forEach((button) => {
      button.addEventListener('click', () => openEdit(Number(button.dataset.editAgenda)));
    });
  };

  const load = async () => {
    if (!body) return;
    body.innerHTML = '<tr><td class="table-state" colspan="6">Memuat agenda...</td></tr>';
    try {
      const data = await api('/admin/agenda');
      events = data.events || [];
      renderStats(data.summary || {});
      renderRows();
    } catch (error) {
      body.innerHTML = `<tr><td class="table-state" colspan="6">Gagal memuat agenda: ${esc(error.code || error.message)}</td></tr>`;
    }
  };

  const openCreate = () => {
    form.reset();
    form.elements.id.value = '';
    form.elements.category.value = 'Perjalanan';
    form.elements.event_status.value = 'draft';
    form.dataset.originalStartsAt = '';
    form.dataset.originalEndsAt = '';
    dialogTitle.textContent = 'Tambah Agenda';
    hideMessage();
    modal.hidden = false;
  };

  const openEdit = (id) => {
    const event = events.find((item) => Number(item.id) === Number(id));
    if (!event) return;
    form.reset();
    form.elements.id.value = event.id;
    form.elements.title.value = event.title || '';
    form.elements.category.value = event.category || 'Perjalanan';
    form.elements.event_status.value = event.event_status || 'draft';
    form.elements.date.value = dateValue(event.starts_at);
    form.elements.start_time.value = timeValue(event.starts_at);
    form.elements.end_time.value = timeValue(event.ends_at);
    form.elements.location_text.value = event.location_text || '';
    form.elements.description.value = event.description || '';
    form.elements.is_published.checked = Boolean(event.is_published);
    form.dataset.originalStartsAt = event.starts_at || '';
    form.dataset.originalEndsAt = event.ends_at || '';
    dialogTitle.textContent = 'Edit Agenda';
    hideMessage();
    modal.hidden = false;
  };

  const close = () => { modal.hidden = true; };

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideMessage();

    const id = String(form.elements.id.value || '').trim();
    const date = String(form.elements.date.value || '').trim();
    const startTime = normalizeTimeInput(form.elements.start_time.value);
    const endTime = normalizeTimeInput(form.elements.end_time.value);
    const originalStartsAt = form.dataset.originalStartsAt || '';
    const originalEndsAt = form.dataset.originalEndsAt || '';

    if (!date || !startTime) {
      showMessage('Tanggal dan waktu mulai wajib diisi.');
      return;
    }

    const payload = {
      title: form.elements.title.value.trim(),
      category: form.elements.category.value.trim(),
      event_status: form.elements.event_status.value,
      location_text: form.elements.location_text.value.trim(),
      description: form.elements.description.value.trim(),
      is_published: form.elements.is_published.checked,
    };

    if (!id || !sameDateTimeInputs(date, startTime, originalStartsAt)) {
      payload.starts_at = toIsoJakarta(date, startTime);
    }

    if (!id) {
      payload.ends_at = endTime ? toIsoJakarta(date, endTime) : null;
    } else {
      const originalEnd = splitJakartaIso(originalEndsAt);
      const endUnchanged =
        endTime === originalEnd.time &&
        (!endTime || date === originalEnd.date);

      if (!endUnchanged) {
        payload.ends_at = endTime ? toIsoJakarta(date, endTime) : null;
      }
    }

    // Safety rule:
    // Editing title/location/status/notes MUST NOT rewrite starts_at/ends_at
    // when the date/time controls are unchanged.


    if (payload.is_published && payload.event_status === 'draft') {
      showMessage('Agenda Draft belum dapat dipublikasikan. Ubah status menjadi Terjadwal, Dikonfirmasi, atau Dibatalkan.');
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Menyimpan...';
    try {
      await api(id ? `/admin/agenda/${id}` : '/admin/agenda', {
        method: id ? 'PATCH' : 'POST',
        body: JSON.stringify(payload)
      });
      showMessage(id ? 'Agenda berhasil diperbarui.' : 'Agenda berhasil dibuat.', 'success');
      await load();
      setTimeout(close, 650);
    } catch (error) {
      const labels = {
        agenda_title_required:'Judul agenda wajib diisi.',
        agenda_category_required:'Kategori agenda wajib diisi.',
        invalid_agenda_status:'Status agenda tidak valid.',
        invalid_agenda_start:'Tanggal/waktu mulai tidak valid.',
        invalid_agenda_end:'Waktu selesai tidak valid.',
        agenda_end_before_start:'Waktu selesai tidak boleh lebih awal dari waktu mulai.',
        draft_cannot_be_published:'Agenda Draft tidak dapat dipublikasikan.',
        published_agenda_requires_start:'Agenda yang dipublikasikan wajib memiliki tanggal dan waktu mulai.',
        forbidden:'Role akun ini tidak diizinkan mengubah agenda.'
      };
      showMessage(labels[error.code] || `Gagal menyimpan agenda: ${error.code || error.message}`);
    } finally {
      submit.disabled = false;
      submit.textContent = 'Simpan Agenda';
    }
  });

  document.querySelectorAll('[data-agenda-close]').forEach((node) => node.addEventListener('click', close));
  add?.addEventListener('click', openCreate);
  refresh?.addEventListener('click', load);
  filter?.addEventListener('change', renderRows);

  const waitForAuth = () => {
    if (document.documentElement.classList.contains('auth-ready')) {
      if (add && !roleCanEdit()) add.hidden = true;
      load();
    } else {
      setTimeout(waitForAuth, 60);
    }
  };
  waitForAuth();
})();
