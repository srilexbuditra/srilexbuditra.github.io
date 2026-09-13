const API = 'https://peserta-api.srilexbuditra.work';
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const notificationView = document.getElementById('notificationView');
const notificationList = document.getElementById('notificationList');
const notificationEmpty = document.getElementById('notificationEmpty');
const markAllReadBtn = document.getElementById('markAllReadBtn');
const toast = document.getElementById('toast');

let centerData = null;
let participantData = null;
let pointsData = null;
let activeFilter = 'all';

const LEVELS = [
  { level: 1, name: 'Tunas', min: 0 },
  { level: 2, name: 'Tumbuh', min: 50 },
  { level: 3, name: 'Berkembang', min: 100 },
  { level: 4, name: 'Produktif', min: 250 },
  { level: 5, name: 'Maju', min: 500 },
  { level: 6, name: 'Unggul', min: 1000 }
];

function getLevel(points) {
  const total = Number(points || 0);
  let current = LEVELS[0];
  for (const item of LEVELS) {
    if (total >= item.min) current = item;
  }
  return current;
}

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

  if (!response.ok || data.ok === false) {
    throw Object.assign(
      new Error(data.message || 'Pusat Notifikasi belum dapat diakses.'),
      { status: response.status }
    );
  }
  return data;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[char]);
}

function safeActionUrl(value) {
  const url = String(value || '').trim();
  return /^\/program\/ketahanan-pangan\//.test(url) ? url : '';
}

function categoryMeta(value) {
  const key = String(value || 'system').toLowerCase();
  const map = {
    system: { label: 'Sistem', icon: '✦' },
    program: { label: 'Program', icon: '✓' },
    poin: { label: 'Poin', icon: '◎' },
    referral: { label: 'Referral', icon: '↗' },
    benefit: { label: 'Benefit', icon: '◆' },
    event: { label: 'Event', icon: '◈' },
    aktivitas: { label: 'Aktivitas', icon: '◈' },
    marketplace: { label: 'Marketplace', icon: '▦' }
  };
  return map[key] || { label: key.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), icon: '•' };
}

function formatTime(value) {
  if (!value) return '-';
  const normalized = String(value).includes('T') ? String(value) : String(value).replace(' ', 'T') + 'Z';
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta'
  }).format(date);
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 3200);
}

function showError(title, text) {
  loadingState.hidden = true;
  notificationView.hidden = true;
  errorState.hidden = false;
  document.getElementById('errorTitle').textContent = title;
  document.getElementById('errorText').textContent = text;
}

function filteredNotifications() {
  const rows = Array.isArray(centerData?.notifications) ? centerData.notifications : [];
  if (activeFilter === 'all') return rows;
  if (activeFilter === 'unread') return rows.filter(item => !item.is_read);
  if (activeFilter === 'event') return rows.filter(item => ['event', 'aktivitas'].includes(String(item.category || '').toLowerCase()));
  return rows.filter(item => String(item.category || '').toLowerCase() === activeFilter);
}

function renderNotifications() {
  const rows = filteredNotifications();
  notificationEmpty.hidden = rows.length > 0;
  notificationList.innerHTML = rows.map(item => {
    const meta = categoryMeta(item.category);
    const actionUrl = safeActionUrl(item.action_url);
    return `
      <article class="notification-card ${item.is_read ? 'is-read' : 'is-unread'} ${item.priority === 'high' ? 'is-high' : ''}" data-id="${Number(item.id || 0)}">
        <div class="notification-icon" aria-hidden="true">${escapeHtml(meta.icon)}</div>
        <div class="notification-copy">
          <div class="notification-topline">
            <span class="category-chip">${escapeHtml(meta.label)}</span>
            ${item.is_read ? '<span class="read-chip">DIBACA</span>' : '<span class="new-chip">BARU</span>'}
          </div>
          <h4>${escapeHtml(item.title || 'Notifikasi')}</h4>
          <p>${escapeHtml(item.message || '')}</p>
          <div class="notification-meta">${escapeHtml(formatTime(item.created_at))}</div>
        </div>
        <div class="notification-actions">
          ${!item.is_read ? `<button type="button" class="btn muted mark-read-btn" data-id="${Number(item.id || 0)}">Tandai Dibaca</button>` : ''}
          ${actionUrl ? `<a class="btn outline notification-action-link" data-id="${Number(item.id || 0)}" href="${escapeHtml(actionUrl)}">Buka</a>` : ''}
        </div>
      </article>`;
  }).join('');
}

function renderSummary() {
  const unread = Number(centerData?.unread_count || 0);
  const total = Number(centerData?.total_count || 0);
  const totalPoints = Number(pointsData?.total_points || 0);
  const level = getLevel(totalPoints);
  const memberApproved = String(participantData?.member_verification_status || '').toLowerCase() === 'approved';

  document.getElementById('participantName').textContent = participantData?.nama || 'Peserta';
  document.getElementById('summaryText').textContent = unread > 0
    ? `${unread} notifikasi belum dibaca dari ${total} notifikasi tersimpan.`
    : `${total} notifikasi tersimpan · semua sudah dibaca.`;
  document.getElementById('unreadCount').textContent = unread.toLocaleString('id-ID');
  document.getElementById('totalCount').textContent = total.toLocaleString('id-ID');
  document.getElementById('totalPoints').textContent = `${totalPoints.toLocaleString('id-ID')} Poin`;
  document.getElementById('levelName').textContent = `Level ${level.level || 1} ${level.name || 'Tunas'}`;
  document.getElementById('memberStatus').textContent = memberApproved ? 'VERIFIED MEMBER' : 'Peserta Aktif';
  const badge = document.getElementById('memberBadge');
  badge.textContent = memberApproved ? '✓ VERIFIED MEMBER' : 'PESERTA';
  badge.classList.toggle('is-basic', !memberApproved);
  document.getElementById('notificationNote').textContent = centerData?.note || 'Pusat Notifikasi hanya memuat informasi akun dan program.';
  markAllReadBtn.disabled = unread === 0;
}

function renderAll() {
  renderSummary();
  renderNotifications();
}

async function reload() {
  const [notificationsResponse, pointsResponse] = await Promise.all([
    api('/notifications'),
    api('/points')
  ]);
  centerData = notificationsResponse.notifications || { notifications: [], unread_count: 0, total_count: 0 };
  participantData = notificationsResponse.participant || {};
  pointsData = pointsResponse.points || {};
  loadingState.hidden = true;
  errorState.hidden = true;
  notificationView.hidden = false;
  renderAll();
}

async function markRead(notificationId, all = false) {
  const response = await api('/notifications/read', {
    method: 'POST',
    body: JSON.stringify(all ? { all: true } : { notification_id: Number(notificationId) })
  });
  centerData = response.notifications || centerData;
  renderAll();
  showToast(response.message || 'Status notifikasi diperbarui.');
}

markAllReadBtn.addEventListener('click', async () => {
  markAllReadBtn.disabled = true;
  try { await markRead(null, true); }
  catch (error) { showToast(error?.message || 'Notifikasi belum dapat diperbarui.'); renderSummary(); }
});

document.getElementById('filterRow').addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  activeFilter = String(button.dataset.filter || 'all');
  document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('is-active', item === button));
  renderNotifications();
});

notificationList.addEventListener('click', async event => {
  const markButton = event.target.closest('.mark-read-btn');
  if (markButton) {
    markButton.disabled = true;
    try { await markRead(markButton.dataset.id, false); }
    catch (error) { showToast(error?.message || 'Notifikasi belum dapat diperbarui.'); markButton.disabled = false; }
    return;
  }

  const actionLink = event.target.closest('.notification-action-link');
  if (actionLink) {
    const id = Number(actionLink.dataset.id || 0);
    const row = (centerData?.notifications || []).find(item => Number(item.id) === id);
    if (row && !row.is_read) {
      try {
        await api('/notifications/read', {
          method: 'POST',
          body: JSON.stringify({ notification_id: id })
        });
      } catch (_) {}
    }
  }
});

(async function init() {
  try {
    await reload();
  } catch (error) {
    showError(
      error?.status === 401 ? 'Sesi login diperlukan' : 'Notifikasi belum dapat ditampilkan',
      error?.message || 'Periksa koneksi internet lalu coba kembali.'
    );
  }
})();
