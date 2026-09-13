const API = 'https://peserta-api.srilexbuditra.work';
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const activityView = document.getElementById('activityView');
const toast = document.getElementById('toast');

async function api(path, options = {}) {
  const response = await fetch(API + path, {
    ...options,
    credentials: 'include',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });
  let data = {};
  try { data = await response.json(); } catch (_) {}
  if (!response.ok || data.ok === false) throw Object.assign(new Error(data.message || 'Layanan aktivitas peserta belum dapat diakses.'), { status: response.status });
  return data;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[char]);
}

function formatDate(value, withTime = true) {
  if (!value) return 'Jadwal menyusul';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  if (withTime) Object.assign(options, { hour: '2-digit', minute: '2-digit' });
  return new Intl.DateTimeFormat('id-ID', options).format(d);
}

function statusLabel(status) {
  const key = String(status || '').toLowerCase();
  return ({
    registered: 'TERDAFTAR',
    attended: 'HADIR TERVERIFIKASI',
    cancelled: 'DIBATALKAN',
    no_show: 'TIDAK HADIR',
    not_registered: 'BELUM DAFTAR'
  })[key] || key.toUpperCase();
}

function deliveryLabel(mode) {
  return ({ online: 'Online', offline: 'Tatap Muka', hybrid: 'Hybrid' })[String(mode || '').toLowerCase()] || 'Event';
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 3200);
}

function showError(title, text) {
  loadingState.hidden = true;
  activityView.hidden = true;
  errorState.hidden = false;
  document.getElementById('errorTitle').textContent = title;
  document.getElementById('errorText').textContent = text;
}

function renderEvents(events) {
  const list = document.getElementById('eventList');
  const empty = document.getElementById('eventEmpty');
  if (!Array.isArray(events) || !events.length) {
    list.innerHTML = '';
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  list.innerHTML = events.map(event => {
    const status = String(event.participant_status || 'not_registered').toLowerCase();
    const registered = status === 'registered';
    const attended = status === 'attended';
    const cardClass = attended ? 'is-attended' : registered ? 'is-registered' : (!event.can_register ? 'is-locked' : '');
    const capacityText = Number(event.capacity || 0) > 0
      ? `${Number(event.registered_count || 0).toLocaleString('id-ID')} / ${Number(event.capacity).toLocaleString('id-ID')} peserta`
      : 'Kuota fleksibel';
    const pointsText = Number(event.attendance_points || 0) > 0
      ? `+${Number(event.attendance_points).toLocaleString('id-ID')} poin setelah hadir`
      : 'Tidak ada poin khusus';
    let action = '';
    if (attended) {
      action = '<button class="btn muted" type="button" disabled>Hadir ✓</button>';
    } else if (registered) {
      action = `<button class="btn muted event-cancel" type="button" data-event-id="${escapeHtml(event.event_id)}" ${event.can_cancel ? '' : 'disabled'}>Batalkan</button>`;
    } else {
      action = `<button class="btn primary event-register" type="button" data-event-id="${escapeHtml(event.event_id)}" ${event.can_register ? '' : 'disabled'}>${event.can_register ? 'Daftar Event' : 'Belum Tersedia'}</button>`;
    }
    return `
      <article class="event-card ${cardClass}">
        <div>
          <div class="event-top">
            <span class="event-chip">${escapeHtml(deliveryLabel(event.delivery_mode))}</span>
            <span class="event-chip gold">LEVEL ${Number(event.min_level || 1)}</span>
            ${event.requires_verified_member ? '<span class="event-chip">VERIFIED MEMBER</span>' : ''}
          </div>
          <h4>${escapeHtml(event.title || 'Event')}</h4>
          <p>${escapeHtml(event.summary || 'Informasi kegiatan akan diperbarui oleh pengelola.')}</p>
          <div class="event-meta">
            <span>◷ ${escapeHtml(formatDate(event.start_at))}</span>
            <span>⌖ ${escapeHtml(event.location_text || deliveryLabel(event.delivery_mode))}</span>
            <span>◉ ${escapeHtml(capacityText)}</span>
            <span>◎ ${escapeHtml(pointsText)}</span>
          </div>
          <div class="event-status">${escapeHtml(statusLabel(status))} · ${escapeHtml(event.requirement_text || '')}</div>
        </div>
        <div class="event-actions">${action}</div>
      </article>`;
  }).join('');
}

function renderEventHistory(rows) {
  const list = document.getElementById('eventHistory');
  const empty = document.getElementById('eventHistoryEmpty');
  if (!Array.isArray(rows) || !rows.length) {
    list.innerHTML = ''; empty.hidden = false; return;
  }
  empty.hidden = true;
  list.innerHTML = rows.map(row => {
    const status = String(row.status || '').toLowerCase();
    const when = row.attended_at || row.cancelled_at || row.registered_at;
    return `
      <div class="history-item">
        <span class="history-icon" aria-hidden="true">${status === 'attended' ? '✓' : status === 'cancelled' ? '×' : '◷'}</span>
        <div class="history-copy"><strong>${escapeHtml(row.title || row.event_id || 'Event')}</strong><small>${escapeHtml(formatDate(when))} · ${escapeHtml(deliveryLabel(row.delivery_mode))}</small></div>
        <span class="history-value">${escapeHtml(statusLabel(status))}</span>
      </div>`;
  }).join('');
}

function renderPointHistory(rows) {
  const list = document.getElementById('pointHistory');
  const empty = document.getElementById('pointHistoryEmpty');
  if (!Array.isArray(rows) || !rows.length) {
    list.innerHTML = ''; empty.hidden = false; return;
  }
  empty.hidden = true;
  const typeLabel = { mission: 'Misi', referral: 'Referral', event: 'Aktivitas/Event' };
  list.innerHTML = rows.map(row => `
    <div class="history-item">
      <span class="history-icon" aria-hidden="true">+</span>
      <div class="history-copy"><strong>${escapeHtml(row.description || typeLabel[row.entry_type] || 'Aktivitas')}</strong><small>${escapeHtml(typeLabel[row.entry_type] || row.entry_type || 'Poin')} · ${escapeHtml(formatDate(row.created_at))}</small></div>
      <span class="history-value">+${Number(row.points || 0).toLocaleString('id-ID')} POIN</span>
    </div>`).join('');
}

function render(data) {
  const activity = data.activity || {};
  const participant = data.participant || {};
  const level = activity.level || {};

  document.getElementById('participantName').textContent = participant.nama || 'Peserta';
  document.getElementById('publishedEvents').textContent = Number(activity.published_events || 0).toLocaleString('id-ID');
  document.getElementById('registeredEvents').textContent = Number(activity.registered_events || 0).toLocaleString('id-ID');
  document.getElementById('attendedEvents').textContent = Number(activity.attended_events || 0).toLocaleString('id-ID');
  document.getElementById('activityPoints').textContent = Number(activity.activity_points || 0).toLocaleString('id-ID');
  document.getElementById('totalPoints').textContent = Number(activity.total_points || 0).toLocaleString('id-ID') + ' Poin';
  document.getElementById('levelName').textContent = `Level ${level.level || 1} ${level.name || 'Tunas'}`;
  document.getElementById('memberStatus').textContent = activity.verified_member ? 'VERIFIED MEMBER' : 'Peserta Aktif';
  document.getElementById('summaryText').textContent = `${Number(activity.registered_events || 0)} event terdaftar · ${Number(activity.attended_events || 0)} kehadiran terverifikasi · ${Number(activity.activity_points || 0)} Poin Aktivitas.`;

  const badge = document.getElementById('memberBadge');
  badge.textContent = activity.verified_member ? '✓ VERIFIED MEMBER' : 'PESERTA';
  badge.classList.toggle('is-basic', !activity.verified_member);

  document.getElementById('activityNote').textContent = activity.note || 'Poin Aktivitas/Event hanya diberikan setelah kehadiran terverifikasi.';
  renderEvents(activity.events || []);
  renderEventHistory(activity.event_history || []);
  renderPointHistory(activity.point_history || []);

  loadingState.hidden = true;
  errorState.hidden = true;
  activityView.hidden = false;
}

async function reload() {
  const data = await api('/activity-events');
  render(data);
}

document.addEventListener('click', async event => {
  const registerButton = event.target.closest('.event-register');
  const cancelButton = event.target.closest('.event-cancel');
  const button = registerButton || cancelButton;
  if (!button || button.disabled) return;
  const eventId = String(button.dataset.eventId || '');
  if (!eventId) return;
  button.disabled = true;
  const original = button.textContent;
  button.textContent = registerButton ? 'Mendaftarkan…' : 'Membatalkan…';
  try {
    const path = registerButton ? '/activity-events/register' : '/activity-events/cancel';
    const data = await api(path, { method: 'POST', body: JSON.stringify({ event_id: eventId }) });
    showToast(data.message || (registerButton ? 'Pendaftaran event berhasil.' : 'Pendaftaran dibatalkan.'));
    render({ activity: data.activity, participant: {
      nama: document.getElementById('participantName').textContent
    }});
  } catch (error) {
    showToast(error?.message || 'Permintaan belum dapat diproses.');
    button.disabled = false;
    button.textContent = original;
  }
});

(async function init() {
  try {
    await reload();
  } catch (error) {
    showError(error?.status === 401 ? 'Sesi login diperlukan' : 'Aktivitas & Event belum dapat ditampilkan', error?.message || 'Periksa koneksi internet lalu coba kembali.');
  }
})();