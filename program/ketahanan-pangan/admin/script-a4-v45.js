'use strict';

const CERTIFICATE_TEMPLATE_DATA_URL = `data:image/png;

const API_URL =
  'https://admin-api.srilexbuditra.work/registrations';

const ADMIN_API_BASE =
  'https://admin-api.srilexbuditra.work';

/*
 * Compatibility flag for V45 functions.
 * It is NOT an API token and is never put in the URL/localStorage.
 * The Worker authenticates requests using the HttpOnly session cookie.
 */
let adminToken = '';
let currentAdminUser = null;
let adminLoginJustCompleted = false;
let duplicateAuditByRegistrationId = new Map();


function stripLegacyAdminTokenFromUrl() {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has('adminToken')) {
      url.searchParams.delete('adminToken');
      const clean = url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : '') + url.hash;
      window.history.replaceState({}, document.title, clean);
    }
  } catch (_) {
    // URL cleanup must never block login/session restoration.
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  stripLegacyAdminTokenFromUrl();
  const loginForm = document.getElementById('adminLoginForm');
  const usernameInput = document.getElementById('adminUsername');
  const passwordInput = document.getElementById('adminPassword');
  const loginMessage = document.getElementById('loginMessage');
  const passwordToggle = document.getElementById('adminPasswordToggle');
  const logoutButton = document.getElementById('adminLogoutButton');
  const closeRoleNotice = document.getElementById('closeRoleNotice');

  passwordToggle?.addEventListener('click', () => {
    const show = passwordInput.type === 'password';
    passwordInput.type = show ? 'text' : 'password';
    passwordToggle.textContent = show ? 'Sembunyi' : 'Lihat';
  });

  closeRoleNotice?.addEventListener('click', () => {
    const panel = document.getElementById('adminRoleNotice');
    if (panel) panel.hidden = true;
    sessionStorage.setItem('kp_admin_role_notice_closed', '1');
  });

  logoutButton?.addEventListener('click', logoutAdmin);

  loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!username || !password) {
      loginMessage.textContent = 'Username dan password wajib diisi.';
      return;
    }

    const loginButton = document.getElementById('adminLoginButton');
    const label = loginButton?.querySelector('.login-button-label');

    try {
      if (loginButton) loginButton.disabled = true;
      if (label) label.textContent = 'Memeriksa akun...';
      loginMessage.textContent = '';

      const response = await fetch(`${ADMIN_API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        cache: 'no-store'
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.ok || !data?.user) {
        throw new Error(data?.message || 'Username atau password tidak sesuai.');
      }

      passwordInput.value = '';
      adminLoginJustCompleted = true;
      setAuthenticatedAdmin(data.user);

      showAdminToast(
        'success',
        'Login Berhasil',
        `Selamat datang, ${data.user.display_name || data.user.username}. Anda masuk sebagai ${roleTitle(data.user.role)}. Menyiapkan Dashboard...`
      );

      await loadRegistrations();
    } catch (error) {
      loginMessage.textContent =
        error.message || 'Username atau password tidak sesuai.';
      showAdminToast('error', 'Login Gagal', 'Username atau password tidak sesuai.');
    } finally {
      if (loginButton) loginButton.disabled = false;
      if (label) label.textContent = 'Masuk Dashboard';
    }
  });

  await restoreAdminSession();
});

async function restoreAdminSession() {
  try {
    const response = await fetch(`${ADMIN_API_BASE}/auth/me`, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data?.authenticated || !data?.user) {
      showAdminLogin();
      return;
    }

    setAuthenticatedAdmin(data.user);
    await loadRegistrations();
  } catch (_) {
    showAdminLogin();
  }
}

function setAuthenticatedAdmin(user) {
  currentAdminUser = user;
  adminToken = 'session-authenticated';

  const login = document.getElementById('adminLogin');
  const main = document.querySelector('main.wrap');
  const identity = document.getElementById('adminIdentity');
  const logout = document.getElementById('adminLogoutButton');
  const displayName = document.getElementById('adminDisplayName');
  const roleBadge = document.getElementById('adminRoleBadge');
  const roleNotice = document.getElementById('adminRoleNotice');
  const roleNoticeTitle = document.getElementById('adminRoleTitle');
  const roleNoticeDescription = document.getElementById('adminRoleDescription');

  if (login) login.hidden = true;
  if (main) main.hidden = false;
  if (identity) identity.hidden = false;
  if (logout) logout.hidden = false;
  if (displayName) displayName.textContent = user.display_name || user.username || 'Administrator';
  if (roleBadge) roleBadge.textContent = roleBadgeText(user.role);

  if (roleNotice && !sessionStorage.getItem('kp_admin_role_notice_closed')) {
    roleNotice.hidden = false;
  }

  if (roleNoticeTitle) {
    roleNoticeTitle.textContent = roleTitle(user.role);
  }

  if (roleNoticeDescription) {
    roleNoticeDescription.textContent = roleDescription(user.role);
  }
}

function showAdminLogin() {
  currentAdminUser = null;
  adminToken = '';

  const login = document.getElementById('adminLogin');
  const main = document.querySelector('main.wrap');
  const identity = document.getElementById('adminIdentity');
  const logout = document.getElementById('adminLogoutButton');

  if (login) login.hidden = false;
  if (main) main.hidden = true;
  if (identity) identity.hidden = true;
  if (logout) logout.hidden = true;
}

async function logoutAdmin() {
  const button = document.getElementById('adminLogoutButton');
  const label = button?.querySelector('.logout-label');

  try {
    if (button) button.disabled = true;
    if (label) label.textContent = 'Keluar...';

    await fetch(`${ADMIN_API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });

    showAdminToast(
      'success',
      'Berhasil Keluar',
      'Session Anda telah diakhiri dengan aman. Mengarahkan ke halaman login...'
    );

    currentAdminUser = null;
    adminToken = '';
    sessionStorage.removeItem('kp_admin_role_notice_closed');

    setTimeout(() => {
      window.location.replace('./');
    }, 900);
  } catch (_) {
    showAdminToast('error', 'Logout Gagal', 'Tidak dapat mengakhiri session. Silakan coba kembali.');
    if (button) button.disabled = false;
    if (label) label.textContent = 'Logout';
  }
}

function roleBadgeText(role) {
  if (role === 'super_admin') return 'SUPER ADMIN';
  if (role === 'pemasaran') return 'PEMASARAN';
  return 'ADMIN';
}

function roleTitle(role) {
  if (role === 'super_admin') return 'Super Administrator — Penanggung Jawab Teknologi Sistem';
  if (role === 'pemasaran') return 'Pemasaran & Komunikasi Program';
  return 'Admin — Pengelola Operasional Program';
}

function roleDescription(role) {
  if (role === 'super_admin') {
    return 'Anda memiliki kewenangan teknis penuh atas platform digital. Kewenangan teknis tidak menggantikan kewenangan organisasi atau keputusan kebijakan Program Ketahanan Pangan.';
  }
  if (role === 'pemasaran') {
    return 'Akses difokuskan pada komunikasi, pemetaan, wilayah, komoditas, status program, dan laporan pemasaran. Data identitas sensitif dan tindakan verifikasi tidak termasuk.';
  }
  return 'Anda dapat menjalankan operasional peserta, pemeriksaan data, verifikasi, perbaikan, anti-duplikasi, sertifikat, dan Excel A4 V45 sesuai kewenangan.';
}

function showAdminToast(kind, title, message) {
  const region = document.getElementById('adminToastRegion');
  if (!region) return;

  const toast = document.createElement('div');
  toast.className = `admin-toast ${kind === 'error' ? 'is-error' : 'is-success'}`;
  toast.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    <span>${escapeHtml(message)}</span>
  `;

  region.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('is-visible'));

  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 250);
  }, 4300);
}

async function loadRegistrations() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      credentials: 'include',
      headers: {
  Accept: 'application/json'
},
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.ok || !Array.isArray(data.registrations)) {
      throw new Error('Format respons API tidak sesuai.');
    }

    const registrations = data.registrations;

    console.info(
      'Ketahanan Pangan Admin: data registrasi berhasil dimuat.',
      registrations.length
    );

    /*
     * Tahap ini hanya menguji koneksi aman:
     * Dashboard -> Admin Worker -> D1.
     *
     * Data sensitif seperti NIK, KK, WhatsApp,
     * dan dokumen KTP/KK tidak diminta oleh halaman ini.
     */

    window.KETAHANAN_PANGAN_REGISTRATIONS = registrations;
    initAdminParticipantFilters(registrations);

const totalStored = registrations.length;
const activeRegistrations = registrations.filter(item => Number(item.is_duplicate || 0) !== 1);
const total = activeRegistrations.length;
const submitted = activeRegistrations.filter(
  item => item.status === 'submitted' || item.status === 'resubmitted'
).length;
const verified = activeRegistrations.filter(item => item.status === 'verified').length;
const actionRequired = activeRegistrations.filter(
  item => item.status === 'rejected' || item.status === 'revision' || item.status === 'needs_action'
).length;

const statCards = document.querySelectorAll('.stats article');
if (statCards[0]) {
  statCards[0].querySelector('strong').textContent = total;
  statCards[0].title = `Peserta aktif: ${total}. Total data tersimpan: ${totalStored}.`;
}
if (statCards[1]) statCards[1].querySelector('strong').textContent = submitted;
if (statCards[2]) statCards[2].querySelector('strong').textContent = verified;
if (statCards[3]) statCards[3].querySelector('strong').textContent = actionRequired;

document.getElementById('adminLogin').hidden = true;
const tableBody = document.querySelector('.table-wrap tbody');

if (tableBody) {
  tableBody.innerHTML = '';

  registrations.forEach((item) => {
    const row = document.createElement('tr');

    const wilayah = [
      item.kabupaten,
      item.provinsi
    ]
      .filter(Boolean)
      .join(', ');

    const tanggal = item.created_at
      ? new Date(item.created_at.replace(' ', 'T')).toLocaleString('id-ID')
      : '-';

    let statusLabel = item.status || '-';

    if (item.status === 'submitted') {
      statusLabel = 'Menunggu Verifikasi';
    } else if (item.status === 'resubmitted') {
      statusLabel = 'Menunggu Pemeriksaan Ulang';
    } else if (item.status === 'verified') {
      statusLabel = 'Terverifikasi';
    } else if (item.status === 'rejected') {
      statusLabel = 'Ditolak';
    } else if (item.status === 'revision') {
      statusLabel = 'Perlu Perbaikan';
    } else if (item.status === 'needs_action') {
      statusLabel = 'Perlu Tindakan';
    }

    row.innerHTML = `
      <td>${escapeHtml(item.registration_id || '-')}</td>
      <td>${escapeHtml(item.nama || '-')}</td>
      <td>${escapeHtml(wilayah || '-')}</td>
      <td>${escapeHtml(tanggal)}</td>
      <td>${Number(item.is_duplicate || 0) === 1
          ? '<span class="status-duplicate-label">Duplikat / Tidak Aktif</span>'
          : escapeHtml(statusLabel)}</td>
      <td>
        <button
  type="button"
  class="detail-button"
  data-registration-id="${escapeHtml(item.registration_id || '')}"
>
  Detail
</button>
      </td>
    `;

    tableBody.appendChild(row);
    const detailButton = row.querySelector('.detail-button');

if (detailButton) {
  detailButton.addEventListener('click', () => {
    loadRegistrationDetail(item.registration_id);
  });
}
  });

  if (registrations.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty">
            <strong>Belum ada data registrasi</strong>
          </div>
        </td>
      </tr>
    `;
  }
}
document.querySelector('main.wrap').hidden = false;
document.getElementById('loginMessage').textContent = '';

// V8.9 Tahap 1: audit duplikasi hanya-baca setelah daftar utama tampil.
// Tidak mengubah status, D1, R2, atau endpoint registrasi produksi.
auditDuplicateRegistrations(registrations);
  } catch (error) {
    console.error(
      'Ketahanan Pangan Admin: gagal memuat data registrasi.',
      error
    );
  }
}

// -----------------------------------------------------------------------------
// V8.9 ANTI-DUPLIKASI — TAHAP 1 (READ ONLY)
// Mengambil detail melalui endpoint Admin yang sudah terlindungi untuk membandingkan
// NIK. NIK tidak ditulis ke DOM, tidak disimpan ke localStorage, dan tidak dikirim
// ke endpoint baru. Hasil hanya berupa penanda visual pada sesi admin saat ini.
// -----------------------------------------------------------------------------
function normalizeDuplicateNik(value) {
  return String(value || '').replace(/\D/g, '');
}

async function fetchDuplicateAuditDetail(registrationId) {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(registrationId)}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json'
      },
      cache: 'no-store'
    }
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (!data.ok || !data.registration) throw new Error('Format detail registrasi tidak sesuai.');
  return data.registration;
}

async function auditDuplicateRegistrations(registrations) {
  const panel = document.querySelector('.panel .table-wrap');
  if (!panel || !Array.isArray(registrations) || registrations.length < 2) return;

  let auditBox = document.getElementById('duplicateAuditNotice');
  if (!auditBox) {
    auditBox = document.createElement('div');
    auditBox.id = 'duplicateAuditNotice';
    auditBox.className = 'duplicate-audit-notice is-loading';
    panel.parentNode.insertBefore(auditBox, panel);
  }
  auditBox.innerHTML = '<strong>Memeriksa potensi data ganda…</strong><span>Pemeriksaan identitas dilakukan hanya di sesi Admin.</span>';

  const details = [];
  // Batasi paralelisme agar endpoint Admin tidak dibanjiri request sekaligus.
  const queue = registrations.slice();
  const workers = Array.from({ length: Math.min(3, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      if (!item || !item.registration_id) continue;
      try {
        details.push(await fetchDuplicateAuditDetail(item.registration_id));
      } catch (error) {
        console.warn('Audit duplikasi: detail tidak dapat diperiksa.', item.registration_id, error);
      }
    }
  });
  await Promise.all(workers);

  const nikGroups = new Map();
  for (const detail of details) {
    const nik = normalizeDuplicateNik(detail.nik);
    // NIK Indonesia normalnya 16 digit. Abaikan nilai kosong/tidak valid agar tidak
    // menghasilkan false-positive.
    if (nik.length !== 16) continue;
    if (!nikGroups.has(nik)) nikGroups.set(nik, []);
    nikGroups.get(nik).push(detail);
  }

  const duplicateGroups = [...nikGroups.values()].filter(group => group.length > 1);
  const unresolvedGroups = [];
  const unresolvedIds = new Set();
  const resolvedPrimaryIds = new Set();

  duplicateAuditByRegistrationId = new Map();

  duplicateGroups.forEach(group => {
    const sortedGroup = [...group].sort((a, b) =>
      String(b.created_at || '').localeCompare(String(a.created_at || ''))
    );
    const marked = sortedGroup.filter(item => Number(item.is_duplicate || 0) === 1);
    const active = sortedGroup.filter(item => Number(item.is_duplicate || 0) !== 1);

    sortedGroup.forEach(item => duplicateAuditByRegistrationId.set(item.registration_id, sortedGroup));

    const resolved = marked.length > 0 && active.length === 1 &&
      marked.every(item => item.primary_registration_id === active[0].registration_id);

    if (resolved) resolvedPrimaryIds.add(active[0].registration_id);
    else {
      unresolvedGroups.push(sortedGroup);
      sortedGroup.forEach(item => unresolvedIds.add(item.registration_id));
    }
  });

  document.querySelectorAll('.table-wrap tbody .detail-button').forEach(button => {
    const id = button.dataset.registrationId || '';
    const row = button.closest('tr');
    if (!row) return;
    const detail = details.find(item => item.registration_id === id);
    const marked = Number(detail?.is_duplicate || 0) === 1;
    const unresolved = unresolvedIds.has(id) && !marked;
    const resolvedPrimary = resolvedPrimaryIds.has(id);

    row.classList.toggle('potential-duplicate-row', unresolved);
    row.classList.toggle('marked-duplicate-row', marked);
    row.classList.toggle('resolved-primary-row', resolvedPrimary);

    const statusCell = row.children[4];
    if (!statusCell) return;
    let badge = statusCell.querySelector('.duplicate-badge');

    if (marked) {
      if (!badge) { badge=document.createElement('span'); statusCell.appendChild(badge); }
      badge.className='duplicate-badge is-marked';
      badge.textContent='Duplikat / Tidak Aktif';
    } else if (resolvedPrimary) {
      if (!badge) { badge=document.createElement('span'); statusCell.appendChild(badge); }
      badge.className='duplicate-badge is-resolved';
      badge.textContent='✓ Registrasi Utama';
    } else if (unresolved) {
      if (!badge) { badge=document.createElement('span'); statusCell.appendChild(badge); }
      badge.className='duplicate-badge';
      badge.textContent='⚠ Potensi Data Ganda';
    } else if (badge) badge.remove();
  });

  auditBox.classList.remove('is-loading');
  if (!unresolvedGroups.length) {
    auditBox.classList.add('is-clear');
    auditBox.classList.remove('has-duplicates');
    auditBox.innerHTML = duplicateGroups.length
      ? '<strong>✓ Kasus data ganda telah diselesaikan</strong><span>Registrasi utama tetap aktif dan registrasi duplikat tetap tersimpan sebagai riwayat.</span>'
      : '<strong>✓ Tidak ditemukan NIK ganda</strong><span>Audit hanya-baca selesai. Tidak ada data yang diubah.</span>';
    return;
  }

  const affected = new Set(unresolvedGroups.flat().map(item => item.registration_id)).size;
  auditBox.classList.add('has-duplicates');
  auditBox.innerHTML = `
    <strong>⚠ Ditemukan ${unresolvedGroups.length} identitas dengan potensi data ganda yang belum diselesaikan</strong>
    <span>${affected} nomor registrasi terkait. Buka Detail untuk pemeriksaan KTP/KK.</span>
  `;

}


function formatDuplicateAuditDate(value) {
  if (!value) return '-';
  return new Date(String(value).replace(' ', 'T')).toLocaleString('id-ID');
}

function renderDuplicateManagementCard(registration) {
  const group = duplicateAuditByRegistrationId.get(registration.registration_id) || [];
  const others = group.filter(item => item.registration_id !== registration.registration_id);
  const isMarkedDuplicate = Number(registration.is_duplicate || 0) === 1;

  if (isMarkedDuplicate) {
    return `
      <section class="duplicate-management-card is-marked">
        <span class="duplicate-management-kicker">ANTI-DUPLIKASI PESERTA</span>
        <h3>Duplikat / Tidak Aktif</h3>
        <p>Registrasi ini tetap disimpan sebagai riwayat dan tidak dianggap sebagai peserta aktif kedua.</p>
        <div class="duplicate-primary-summary">
          <span>Registrasi Utama</span>
          <strong>${escapeHtml(registration.primary_registration_id || '-')}</strong>
        </div>
        ${registration.duplicate_reason ? `<p class="duplicate-reason"><strong>Alasan:</strong> ${escapeHtml(registration.duplicate_reason)}</p>` : ''}
      </section>`;
  }

  if (!others.length) return '';

  const markedDuplicates = others.filter(item => Number(item.is_duplicate || 0) === 1);
  const resolvedForThisPrimary = markedDuplicates.length > 0 &&
    markedDuplicates.length === others.length &&
    markedDuplicates.every(item => item.primary_registration_id === registration.registration_id);

  if (resolvedForThisPrimary) {
    return `
      <section class="duplicate-management-card is-resolved">
        <span class="duplicate-management-kicker">✓ REGISTRASI UTAMA</span>
        <h3>Data ganda telah diselesaikan</h3>
        <p>Registrasi ini tetap aktif sebagai Registrasi Utama. Registrasi terkait telah ditandai Duplikat / Tidak Aktif dan tetap tersimpan sebagai riwayat.</p>
      </section>`;
  }

  const newest = [...group].sort((a, b) =>
    String(b.created_at || '').localeCompare(String(a.created_at || ''))
  )[0];

  const rows = others.map(other => `
    <div class="duplicate-related-item">
      <div>
        <span>Registrasi terkait</span>
        <strong>${escapeHtml(other.registration_id || '-')}</strong>
        <small>${escapeHtml(formatDuplicateAuditDate(other.created_at))}</small>
      </div>
      <button type="button" class="duplicate-primary-button"
        data-duplicate-id="${escapeHtml(other.registration_id || '')}"
        data-primary-id="${escapeHtml(registration.registration_id || '')}">
        Jadikan yang ini Registrasi Utama
      </button>
    </div>`).join('');

  const recommendation = newest?.registration_id === registration.registration_id
    ? 'Registrasi ini adalah pendaftaran terbaru dan disarankan sebagai Registrasi Utama setelah KTP/KK diperiksa.'
    : `Pendaftaran terbaru adalah ${escapeHtml(newest?.registration_id || '-')}. Periksa kedua dokumen sebelum menentukan Registrasi Utama.`;

  return `
    <section class="duplicate-management-card">
      <span class="duplicate-management-kicker">⚠ POTENSI DATA GANDA</span>
      <h3>NIK yang sama ditemukan pada registrasi lain</h3>
      <p>${recommendation}</p>
      <div class="duplicate-current-summary">
        <span>Registrasi yang sedang dibuka</span>
        <strong>${escapeHtml(registration.registration_id || '-')}</strong>
        <small>${escapeHtml(formatDuplicateAuditDate(registration.created_at))}</small>
      </div>
      <div class="duplicate-related-list">${rows}</div>
      <p class="duplicate-safety-note">Tidak menghapus data dan tidak mengubah status verifikasi. Registrasi lain hanya ditandai Duplikat / Tidak Aktif.</p>
    </section>`;
}

async function markRegistrationDuplicate(duplicateRegistrationId, primaryRegistrationId) {
  if (!adminToken) throw new Error('Session Admin tidak tersedia.');

  if (!window.confirm(
    `Tetapkan ${primaryRegistrationId} sebagai REGISTRASI UTAMA dan tandai ${duplicateRegistrationId} sebagai DUPLIKAT / TIDAK AKTIF?`
  )) return false;

  if (!window.confirm(
    'Konfirmasi terakhir: pastikan KTP/KK sudah diperiksa dan kedua registrasi benar-benar milik peserta dengan NIK yang sama. Lanjutkan?'
  )) return false;

  const response = await fetch(
    `${API_URL}/${encodeURIComponent(duplicateRegistrationId)}/duplicate`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
      body: JSON.stringify({
        primary_registration_id: primaryRegistrationId,
        duplicate_reason: 'Pendaftaran ganda dengan NIK yang sama. Registrasi utama ditetapkan oleh Admin setelah pemeriksaan identitas.'
      })
    }
  );

  let data = null;
  try { data = await response.json(); } catch (_) {}
  if (!response.ok || !data?.ok) throw new Error(data?.message || `HTTP ${response.status}`);

  alert('Berhasil. Registrasi lama telah ditandai Duplikat / Tidak Aktif dan data tetap tersimpan.');
  await loadRegistrations();
  await loadRegistrationDetail(primaryRegistrationId);
  return true;
}


function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
const REVISION_FIELD_LABELS = {
  status_pemohon: 'Status Pemohon',
  kelompok_tani: 'Kelompok Tani',
  luas_lahan: 'Luas Lahan',
  status_lahan: 'Status Lahan',
  komoditas: 'Komoditas',
  tahap: 'Tahap Budidaya',
  jenis_pupuk: 'Jenis Pupuk',
  kebutuhan_kg: 'Kebutuhan Pupuk',
  keterangan: 'Keterangan',
  ktp_file: 'Dokumen KTP',
  kk_file: 'Dokumen Kartu Keluarga (KK)'
};

function formatAdminStatus(status) {
  const labels = {
    submitted: 'Menunggu Verifikasi',
    resubmitted: 'Menunggu Pemeriksaan Ulang',
    verified: 'Terverifikasi',
    revision: 'Perlu Perbaikan',
    rejected: 'Ditolak',
    needs_action: 'Perlu Tindakan'
  };
  return labels[status] || status || '-';
}

function formatRevisionDate(value) {
  if (!value) return '-';
  const normalized = String(value).includes('T') ? String(value) : String(value).replace(' ', 'T');
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('id-ID');
}

async function fetchRegistrationRevisions(registrationId) {
  if (!adminToken) return [];
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(registrationId)}/revisions`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json'
      },
      cache: 'no-store'
    }
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (!data.ok || !Array.isArray(data.revisions)) {
    throw new Error('Format riwayat perbaikan tidak sesuai.');
  }
  return data.revisions;
}

function renderRevisionHistory(revisions) {
  if (!Array.isArray(revisions) || revisions.length === 0) {
    return `
      <section class="revision-history-card revision-history-empty" aria-label="Riwayat Perbaikan Peserta">
        <div class="revision-history-head">
          <div>
            <span class="revision-history-kicker">RIWAYAT PERBAIKAN PESERTA</span>
            <h3>Belum ada perbaikan yang dikirim</h3>
          </div>
        </div>
        <p>Riwayat akan muncul setelah peserta mengirim perbaikan melalui Dashboard Peserta.</p>
      </section>
    `;
  }

  const items = revisions.map((revision, index) => {
    const fields = Array.isArray(revision.submitted_fields) ? revision.submitted_fields : [];
    const documentFields = fields.filter(field => field === 'ktp_file' || field === 'kk_file');
    const textFields = fields.filter(field => field !== 'ktp_file' && field !== 'kk_file');

    return `
      <article class="revision-history-item ${index === 0 ? 'is-latest' : ''}">
        <div class="revision-history-item-head">
          <strong>Perbaikan #${escapeHtml(revision.id || revisions.length - index)}</strong>
          ${index === 0 ? '<span class="revision-latest-badge">Terbaru</span>' : ''}
        </div>
        <dl class="revision-history-meta">
          <div><dt>Status sebelumnya</dt><dd>${escapeHtml(formatAdminStatus(revision.previous_status))}</dd></div>
          <div><dt>Dikirim peserta</dt><dd>${escapeHtml(formatRevisionDate(revision.submitted_at || revision.created_at))}</dd></div>
          <div><dt>Ditinjau admin</dt><dd>${escapeHtml(revision.reviewed_at ? formatRevisionDate(revision.reviewed_at) : 'Belum ditandai selesai')}</dd></div>
        </dl>
        <div class="revision-history-section">
          <span class="revision-history-label">Bidang yang dikirim dalam perbaikan</span>
          ${textFields.length
            ? `<div class="revision-field-list">${textFields.map(field => `<span>${escapeHtml(REVISION_FIELD_LABELS[field] || field)}</span>`).join('')}</div>`
            : '<p class="revision-history-muted">Tidak ada bidang data teks yang dicatat.</p>'}
        </div>
        ${documentFields.length ? `
          <div class="revision-history-section">
            <span class="revision-history-label">Dokumen pengganti</span>
            <div class="revision-document-list">${documentFields.map(field => `<span>${escapeHtml(REVISION_FIELD_LABELS[field] || field)}</span>`).join('')}</div>
            <p class="revision-history-muted">Tombol Download KTP/KK pada detail registrasi membuka dokumen terbaru yang tersimpan.</p>
          </div>
        ` : ''}
        <div class="revision-history-section">
          <span class="revision-history-label">Catatan pemeriksaan saat revisi diminta</span>
          <p class="revision-admin-note">${escapeHtml(revision.admin_note || 'Tidak ada catatan admin.')}</p>
        </div>
      </article>
    `;
  }).join('');

  return `
    <section class="revision-history-card" aria-label="Riwayat Perbaikan Peserta">
      <div class="revision-history-head">
        <div>
          <span class="revision-history-kicker">RIWAYAT PERBAIKAN PESERTA</span>
          <h3>Pemeriksaan ulang perubahan peserta</h3>
        </div>
        <span class="revision-history-count">${revisions.length} riwayat</span>
      </div>
      <p class="revision-history-intro">Gunakan bagian ini untuk melihat data yang dikirim ulang peserta dan catatan pemeriksaan sebelumnya sebelum mengambil keputusan.</p>
      <div class="revision-history-list">${items}</div>
    </section>
  `;
}

async function fetchRegistrationDetailForView(registrationId) {
  const url = `${API_URL}/${encodeURIComponent(registrationId)}`;
  const retryDelays = [0, 350, 700, 1400];
  let lastResponse = null;

  for (let attempt = 0; attempt < retryDelays.length; attempt += 1) {
    if (retryDelays[attempt] > 0) {
      await new Promise(resolve => setTimeout(resolve, retryDelays[attempt]));
    }

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });

    lastResponse = response;

    // Audit anti-duplikasi berjalan paralel sesaat setelah tabel tampil. Jika Worker
    // sedang sibuk / membatasi request sementara, beri kesempatan request Detail
    // mengulang tanpa mengubah endpoint, session auth, atau proses audit V8.9.
    if (response.ok || ![429, 502, 503, 504].includes(response.status)) {
      return response;
    }
  }

  return lastResponse;
}

async function loadRegistrationDetail(registrationId) {
  try {
    const response = await fetchRegistrationDetailForView(registrationId);

    if (!response || !response.ok) {
      throw new Error(`HTTP ${response?.status || 'NETWORK'}`);
    }

    const data = await response.json();

    if (!data.ok || !data.registration) {
      throw new Error('Format detail registrasi tidak sesuai.');
    }

    const registration = data.registration;

    let revisions = [];
    let revisionHistoryError = '';
    try {
      revisions = await fetchRegistrationRevisions(registration.registration_id);
    } catch (error) {
      console.warn('Ketahanan Pangan Admin: riwayat perbaikan belum dapat dimuat.', error);
      revisionHistoryError = 'Riwayat perbaikan belum dapat dimuat. Detail registrasi tetap dapat diperiksa.';
    }

    const detailPanel =
      document.getElementById('registrationDetailPanel');

    const detailContent =
      document.getElementById('registrationDetailContent');

    const tanggalRegistrasi = registration.created_at
      ? new Date(
          registration.created_at.replace(' ', 'T')
        ).toLocaleString('id-ID')
      : '-';

    let statusLabel = registration.status || '-';

    if (registration.status === 'submitted') {
      statusLabel = 'Menunggu Verifikasi';
    } else if (registration.status === 'resubmitted') {
      statusLabel = 'Menunggu Pemeriksaan Ulang';
    } else if (registration.status === 'verified') {
      statusLabel = 'Terverifikasi';
    } else if (registration.status === 'rejected') {
      statusLabel = 'Ditolak';
    } else if (registration.status === 'revision') {
      statusLabel = 'Perlu Perbaikan';
    } else if (registration.status === 'needs_action') {
      statusLabel = 'Perlu Tindakan';
    }

    detailContent.innerHTML = `
      <div class="detail-table-wrapper">
        <table class="detail-table">
          <tbody>
            <tr>
              <th>Nomor Registrasi</th>
              <td>${escapeHtml(registration.registration_id || '-')}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>${escapeHtml(statusLabel)}</td>
            </tr>
            <tr>
              <th>Nama Lengkap</th>
              <td>${escapeHtml(registration.nama || '-')}</td>
            </tr>
            <tr>
              <th>NIK</th>
              <td>${escapeHtml(registration.nik || '-')}</td>
            </tr>
            <tr>
              <th>Nomor KK</th>
              <td>${escapeHtml(registration.nomor_kk || '-')}</td>
            </tr>
            <tr>
              <th>WhatsApp</th>
              <td>${escapeHtml(registration.whatsapp || '-')}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>${escapeHtml(registration.email || '-')}</td>
            </tr>
            <tr>
              <th>Provinsi</th>
              <td>${escapeHtml(registration.provinsi || '-')}</td>
            </tr>
            <tr>
              <th>Kabupaten / Kota</th>
              <td>${escapeHtml(registration.kabupaten || '-')}</td>
            </tr>
            <tr>
              <th>Kecamatan</th>
              <td>${escapeHtml(registration.kecamatan || '-')}</td>
            </tr>
            <tr>
              <th>Desa / Kelurahan</th>
              <td>${escapeHtml(registration.desa || '-')}</td>
            </tr>
            <tr>
              <th>Alamat</th>
              <td>${escapeHtml(registration.alamat || '-')}</td>
            </tr>
            <tr>
              <th>Status Pemohon</th>
              <td>${escapeHtml(registration.status_pemohon || '-')}</td>
            </tr>
            <tr>
              <th>Kelompok Tani</th>
              <td>${escapeHtml(registration.kelompok_tani || '-')}</td>
            </tr>
            <tr>
              <th>Luas Lahan</th>
              <td>${escapeHtml(registration.luas_lahan || '-')}</td>
            </tr>
            <tr>
              <th>Status Lahan</th>
              <td>${escapeHtml(registration.status_lahan || '-')}</td>
            </tr>
            <tr>
              <th>Komoditas</th>
              <td>${escapeHtml(registration.komoditas || '-')}</td>
            </tr>
            <tr>
              <th>Tahap</th>
              <td>${escapeHtml(registration.tahap || '-')}</td>
            </tr>
            <tr>
              <th>Jenis Pupuk</th>
              <td>${escapeHtml(registration.jenis_pupuk || '-')}</td>
            </tr>
            <tr>
              <th>Kebutuhan Pupuk</th>
              <td>${escapeHtml(registration.kebutuhan_kg || '-')} kg</td>
            </tr>
            <tr>
              <th>Keterangan</th>
              <td>${escapeHtml(registration.keterangan || '-')}</td>
            </tr>
            <tr>
              <th>Tanggal Registrasi</th>
              <td>${escapeHtml(tanggalRegistrasi)}</td>
            </tr>
            <tr class="document-row">
              <th>Dokumen Identitas</th>
              <td>
                <div class="document-actions">
                  <button
                    type="button"
                    class="document-button"
                    data-document="ktp"
                  >
                    Download KTP (NIK)
                  </button>
                  <button
                    type="button"
                    class="document-button"
                    data-document="kk"
                  >
                    Download Kartu Keluarga (KK)
                  </button>
                </div>
              </td>
            </tr>
            <tr class="admin-note-row">
              <th>Catatan Admin</th>
              <td>
                <textarea id="adminNoteInput" class="admin-note-input" maxlength="1000" placeholder="Tuliskan hasil pemeriksaan atau informasi untuk peserta...">${escapeHtml(registration.admin_note || '')}</textarea>
                <div class="admin-note-help">Catatan ini hanya ditampilkan kepada admin dan peserta yang login. Maksimal 1000 karakter.</div>
              </td>
            </tr>
            <tr class="verification-row">
              <th>Tindakan Verifikasi</th>
              <td>
                <div class="verification-actions">
                  <button type="button" class="status-button status-verified" data-status="verified">
                    Verifikasi
                  </button>
                  <button type="button" class="status-button status-revision" data-status="revision">
                    Minta Perbaikan
                  </button>
                  <button type="button" class="status-button status-rejected" data-status="rejected">
                    Tolak
                  </button>
                </div>
              </td>
            </tr>
            ${registration.status === 'verified' ? `
            <tr class="certificate-row">
              <th>Kartu / Sertifikat</th>
              <td>
                <button type="button" class="certificate-button" id="issueCertificateButton">
                  Terbitkan Kartu / Sertifikat
                </button>
              </td>
            </tr>
            ` : ''}
          </tbody>
        </table>
      </div>
      ${renderDuplicateManagementCard(registration)}
      ${revisionHistoryError
        ? `<section class="revision-history-card revision-history-error"><strong>Riwayat Perbaikan Peserta</strong><p>${escapeHtml(revisionHistoryError)}</p></section>`
        : renderRevisionHistory(revisions)}
    `;

    detailContent
      .querySelectorAll('.document-button')
      .forEach((button) => {
        button.addEventListener('click', async () => {
          const originalText = button.textContent;

          button.disabled = true;
          button.textContent = 'Mengunduh...';

          try {
            await downloadRegistrationDocument(
              registration.registration_id,
              button.dataset.document
            );
          } finally {
            button.disabled = false;
            button.textContent = originalText;
          }
        });
      });

    detailContent
      .querySelectorAll('.status-button')
      .forEach((button) => {
        button.addEventListener('click', async () => {
          const newStatus = button.dataset.status;
          const labels = {
            verified: 'Verifikasi',
            revision: 'Minta Perbaikan',
            rejected: 'Tolak'
          };

          const confirmed = window.confirm(
            `${labels[newStatus] || 'Ubah status'} registrasi ${registration.registration_id}?`
          );

          if (!confirmed) return;

          const adminNote = detailContent.querySelector('#adminNoteInput')?.value || '';
          await updateRegistrationStatus(
            registration.registration_id,
            newStatus,
            adminNote
          );
        });
      });

    if (Number(registration.is_duplicate || 0) === 1) {
      detailContent.querySelectorAll('.status-button').forEach((button) => {
        button.disabled = true;
        button.title = 'Registrasi duplikat tidak dapat diproses melalui tindakan verifikasi.';
      });
      const noteInput = detailContent.querySelector('#adminNoteInput');
      if (noteInput) {
        noteInput.disabled = true;
        noteInput.placeholder = 'Registrasi duplikat / tidak aktif.';
      }
    }

    detailContent.querySelectorAll('.duplicate-primary-button').forEach((button) => {
      button.addEventListener('click', async () => {
        const duplicateId = button.dataset.duplicateId || '';
        const primaryId = button.dataset.primaryId || '';
        if (!duplicateId || !primaryId) return;
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Memproses...';
        try {
          await markRegistrationDuplicate(duplicateId, primaryId);
        } catch (error) {
          console.error('Ketahanan Pangan Admin: gagal menandai duplikat.', error);
          alert(error.message || 'Gagal menandai registrasi sebagai duplikat.');
        } finally {
          button.disabled = false;
          button.textContent = originalText;
        }
      });
    });

    const issueCertificateButton =
      detailContent.querySelector('#issueCertificateButton');

    if (issueCertificateButton) {
      issueCertificateButton.addEventListener('click', async () => {
        await loadCertificate(registration.registration_id);
      });
    }

    detailPanel.hidden = false;

    detailPanel.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  } catch (error) {
    console.error(
      'Ketahanan Pangan Admin: gagal memuat detail registrasi.',
      error
    );

    alert('Detail registrasi gagal dimuat.');
  }
}

async function loadCertificate(registrationId) {
  if (!adminToken) {
    alert('Session Admin tidak tersedia. Silakan login ulang.');
    return;
  }

  try {
    const baseUrl = API_URL.replace(/\/registrations\/?$/, '');
    const response = await fetch(
      `${baseUrl}/certificates/${encodeURIComponent(registrationId)}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json'
        },
        cache: 'no-store'
      }
    );

    let data = null;
    try { data = await response.json(); } catch (_) {}

    if (!response.ok || !data?.ok || !data?.certificate) {
      throw new Error(data?.message || `Gagal menyiapkan sertifikat (HTTP ${response.status}).`);
    }

    renderCertificate(data.certificate);
  } catch (error) {
    console.error('Ketahanan Pangan Admin: gagal menyiapkan sertifikat.', error);
    alert(error.message || 'Gagal menyiapkan kartu / sertifikat.');
  }
}

function renderCertificate(certificate) {
  const panel = document.getElementById('certificatePanel');
  const content = document.getElementById('certificateContent');
  if (!panel || !content) return;

  const wilayah = [certificate.kabupaten, certificate.provinsi]
    .filter(Boolean).join(', ') || '-';
  const issuedDate = formatCertificateDate(
    certificate.issued_at || certificate.created_at || new Date().toISOString()
  );

  content.innerHTML = `
    <article class="cert-master" id="printableCertificate">
      <img class="cert-master-bg" src="${CERTIFICATE_TEMPLATE_DATA_URL}" alt="" aria-hidden="true">

      <div class="cert-master-name" data-fit-name>${escapeHtml(certificate.nama || '-')}</div>
      <div class="cert-master-value cert-master-id" data-fit-code>${escapeHtml(certificate.certificate_id || '-')}</div>
      <div class="cert-master-value cert-master-reg" data-fit-code>${escapeHtml(certificate.registration_id || '-')}</div>
      <div class="cert-master-value cert-master-region">${escapeHtml(wilayah)}</div>
      <div class="cert-master-status">✓ Terverifikasi</div>

      <div class="cert-master-qr">
        <canvas id="certificateQrCanvas" width="600" height="600" aria-label="QR Code verifikasi"></canvas>
      </div>

      <div class="cert-master-date">${escapeHtml(issuedDate)}</div>
    </article>`;

  const qr = document.getElementById('certificateQrCanvas');
  if (qr && certificate.verification_url) {
    renderCertificateQrCode(qr, certificate.verification_url);
  }

  requestAnimationFrame(() => {
    fitCertificateName(content.querySelector('[data-fit-name]'));
    content.querySelectorAll('[data-fit-code]').forEach(fitCertificateCode);
  });

  panel.hidden = false;
  panel.scrollIntoView({behavior:'smooth', block:'start'});
}

function fitCertificateName(el) {
  if (!el) return;
  let size = 38;
  el.style.fontSize = size + 'px';
  while (el.scrollWidth > el.clientWidth && size > 19) {
    el.style.fontSize = (--size) + 'px';
  }
}


function fitCertificateCode(el) {
  if (!el) return;
  const base = parseFloat(getComputedStyle(el).fontSize) || 16;
  let size = base;
  const safeWidth = Math.max(0, el.clientWidth - 14);
  el.style.fontSize = size + 'px';

  while (el.scrollWidth > safeWidth && size > 9) {
    size -= 0.5;
    el.style.fontSize = size + 'px';
  }
}

function formatCertificateDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day:'2-digit', month:'long', year:'numeric'
  }).format(d);
}

function renderCertificateQrCode(canvas, value) {
  if (!canvas || !value || typeof window.LocalQRCode !== 'function') {
    console.error('Ketahanan Pangan Admin: generator QR lokal tidak tersedia.');
    return;
  }

  try {
    const qr = new window.LocalQRCode(0, 2);
    qr.addData(value);
    qr.make();

    const moduleCount = qr.getModuleCount();
    const quietZone = 4;
    const targetSize = 240;
    const cellSize = Math.floor(targetSize / (moduleCount + quietZone * 2));
    const actualSize = cellSize * (moduleCount + quietZone * 2);

    canvas.width = actualSize;
    canvas.height = actualSize;

    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, actualSize, actualSize);
    context.fillStyle = '#000000';

    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        if (!qr.isDark(row, col)) continue;
        context.fillRect(
          (col + quietZone) * cellSize,
          (row + quietZone) * cellSize,
          cellSize,
          cellSize
        );
      }
    }
  } catch (error) {
    console.error('Ketahanan Pangan Admin: gagal membuat QR Code.', error);
  }
}

async function printCertificate() {
  const printable =
    document.getElementById('printableCertificate');

  if (!printable) {
    alert('Sertifikat belum tersedia.');
    return;
  }

  const printRoot = document.createElement('div');
  printRoot.id = 'certificatePrintRoot';
  printRoot.className = 'certificate-print-root';

  const clonedCertificate =
    printable.cloneNode(true);

  const sourceQr = printable.querySelector('#certificateQrCanvas');
  const clonedQr = clonedCertificate.querySelector('#certificateQrCanvas');
  if (sourceQr && clonedQr) {
    clonedQr.width = sourceQr.width;
    clonedQr.height = sourceQr.height;
    const clonedContext = clonedQr.getContext('2d');
    clonedContext.drawImage(sourceQr, 0, 0);
  }

  clonedCertificate.removeAttribute('id');
  clonedCertificate.classList.add(
    'certificate-card-print'
  );

  printRoot.appendChild(clonedCertificate);
  document.body.appendChild(printRoot);
  document.body.classList.add('certificate-print-mode');

  const printImages =
    Array.from(clonedCertificate.querySelectorAll('img'));

  await Promise.all(
    printImages.map(async (image) => {
      try {
        if (image.decode) {
          await image.decode();
        }
      } catch (_) {}
    })
  );

  const cleanup = () => {
    document.body.classList.remove(
      'certificate-print-mode'
    );

    printRoot.remove();
    window.removeEventListener(
      'afterprint',
      cleanup
    );
  };

  window.addEventListener(
    'afterprint',
    cleanup
  );

  window.print();

  window.setTimeout(() => {
    if (document.body.contains(printRoot)) {
      cleanup();
    }
  }, 1500);
}

async function updateRegistrationStatus(
  registrationId,
  newStatus,
  adminNote = ''
) {
  if (!adminToken) {
    alert('Session Admin tidak tersedia. Silakan login ulang.');
    return;
  }

  if (!['verified', 'revision', 'rejected'].includes(newStatus)) {
    alert('Status yang dipilih tidak valid.');
    return;
  }

  try {
    const baseUrl =
      API_URL.replace(/\/registrations\/?$/, '');

    const response = await fetch(
      `${baseUrl}/registrations/${encodeURIComponent(registrationId)}/status`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          admin_note: String(adminNote || '').trim().slice(0, 1000)
        }),
        cache: 'no-store'
      }
    );

    let data = null;

    try {
      data = await response.json();
    } catch (_) {}

    if (!response.ok || !data?.ok) {
      throw new Error(
        data?.message ||
        `Gagal memperbarui status (HTTP ${response.status}).`
      );
    }

    const statusLabels = {
      verified: 'Terverifikasi',
      revision: 'Perlu Perbaikan',
      rejected: 'Ditolak'
    };

    alert(
      `Status registrasi berhasil diubah menjadi: ${statusLabels[newStatus] || newStatus}.`
    );

    await loadRegistrations();
    await loadRegistrationDetail(registrationId);
  } catch (error) {
    console.error(
      'Ketahanan Pangan Admin: gagal memperbarui status.',
      error
    );

    alert(
      error.message ||
      'Gagal memperbarui status registrasi.'
    );
  }
}

async function downloadRegistrationDocument(
  registrationId,
  documentType
) {
  if (!adminToken) {
    alert('Session Admin tidak tersedia. Silakan login ulang.');
    return;
  }

  if (!['ktp', 'kk'].includes(documentType)) {
    alert('Jenis dokumen tidak valid.');
    return;
  }

  try {
    const baseUrl =
      API_URL.replace(/\/registrations\/?$/, '');

    const response = await fetch(
      `${baseUrl}/documents/${encodeURIComponent(registrationId)}/${encodeURIComponent(documentType)}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: '*/*'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      let message = `Gagal mengunduh dokumen (HTTP ${response.status}).`;

      try {
        const data = await response.json();

        if (data && data.message) {
          message = data.message;
        }
      } catch (_) {}

      throw new Error(message);
    }

    const blob = await response.blob();

    if (!blob || blob.size === 0) {
      throw new Error('File dokumen kosong.');
    }

    const contentType =
      (response.headers.get('Content-Type') || '').toLowerCase();

    let extension = '';

    if (contentType.includes('image/jpeg')) {
      extension = '.jpg';
    } else if (contentType.includes('image/png')) {
      extension = '.png';
    } else if (contentType.includes('image/webp')) {
      extension = '.webp';
    } else if (contentType.includes('application/pdf')) {
      extension = '.pdf';
    }

    const documentLabel =
      documentType === 'ktp' ? 'KTP' : 'KK';

    const safeRegistrationId =
      String(registrationId).replace(/[^a-zA-Z0-9_-]/g, '_');

    const fileName =
      `${documentLabel}-${safeRegistrationId}${extension}`;

    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);
  } catch (error) {
    console.error(
      'Ketahanan Pangan Admin: gagal mengunduh dokumen.',
      error
    );

    alert(
      error.message ||
      'Gagal mengunduh dokumen.'
    );
  }
}

const closeDetailButton =
  document.getElementById('closeDetailButton');

if (closeDetailButton) {
  closeDetailButton.addEventListener('click', () => {
    const detailPanel =
      document.getElementById('registrationDetailPanel');

    const detailContent =
      document.getElementById('registrationDetailContent');

    detailPanel.hidden = true;

    detailContent.innerHTML =
      '<p>Memuat detail registrasi...</p>';
  });
}


const closeCertificateButton = document.getElementById('closeCertificateButton');
if (closeCertificateButton) {
  closeCertificateButton.addEventListener('click', () => {
    const panel = document.getElementById('certificatePanel');
    if (panel) panel.hidden = true;
  });
}

const printCertificateButton = document.getElementById('printCertificateButton');
if (printCertificateButton) {
  printCertificateButton.addEventListener('click', printCertificate);
}


// =========================================================
// ADMIN FILTER PESERTA V1
// Client-side only: tidak mengubah API, token, dokumen, status, atau sertifikat.
// =========================================================
function normalizeAdminFilterText(value) {
  return String(value || '').toLocaleLowerCase('id-ID').trim();
}

function adminRegistrationRegion(item) {
  return [item.kabupaten, item.provinsi].filter(Boolean).join(', ').trim();
}

function refreshAdminRegionOptions(registrations) {
  const select = document.getElementById('participantRegionFilter');
  if (!select) return;

  const current = select.value;
  const regions = [...new Set(
    registrations.map(adminRegistrationRegion).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'id-ID'));

  select.innerHTML =
    '<option value="">Semua wilayah</option>' +
    regions.map(region =>
      `<option value="${region.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}">${region.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</option>`
    ).join('');

  if (regions.includes(current)) select.value = current;
}

function applyAdminParticipantFilters() {
  const registrations =
    Array.isArray(window.KETAHANAN_PANGAN_REGISTRATIONS)
      ? window.KETAHANAN_PANGAN_REGISTRATIONS
      : [];

  const search = normalizeAdminFilterText(
    document.getElementById('participantSearch')?.value
  );
  const status = normalizeAdminFilterText(
    document.getElementById('participantStatusFilter')?.value
  );
  const region = normalizeAdminFilterText(
    document.getElementById('participantRegionFilter')?.value
  );

  const rows = document.querySelectorAll('.table-wrap tbody tr');
  let visible = 0;

  rows.forEach((row, index) => {
    const item = registrations[index];
    if (!item) return;

    const haystack = normalizeAdminFilterText(
      `${item.registration_id || ''} ${item.nama || ''}`
    );
    const itemStatus = normalizeAdminFilterText(item.status);
    const itemRegion = normalizeAdminFilterText(adminRegistrationRegion(item));

    const match =
      (!search || haystack.includes(search)) &&
      (!status || itemStatus === status) &&
      (!region || itemRegion === region);

    row.hidden = !match;
    if (match) visible += 1;
  });

  const count = document.getElementById('participantResultCount');
  if (count) {
    count.textContent =
      registrations.length
        ? `${visible} dari ${registrations.length} peserta`
        : '0 peserta';
  }
}

function initAdminParticipantFilters(registrations) {
  refreshAdminRegionOptions(registrations);

  const search = document.getElementById('participantSearch');
  const status = document.getElementById('participantStatusFilter');
  const region = document.getElementById('participantRegionFilter');
  const reset = document.getElementById('participantResetFilter');

  if (search && !search.dataset.filterReady) {
    search.dataset.filterReady = '1';
    search.addEventListener('input', applyAdminParticipantFilters);
  }
  if (status && !status.dataset.filterReady) {
    status.dataset.filterReady = '1';
    status.addEventListener('change', applyAdminParticipantFilters);
  }
  if (region && !region.dataset.filterReady) {
    region.dataset.filterReady = '1';
    region.addEventListener('change', applyAdminParticipantFilters);
  }
  if (reset && !reset.dataset.filterReady) {
    reset.dataset.filterReady = '1';
    reset.addEventListener('click', () => {
      if (search) search.value = '';
      if (status) status.value = '';
      if (region) region.value = '';
      applyAdminParticipantFilters();
    });
  }

  // loadRegistrations merender baris secara sinkron setelah assignment ini.
  setTimeout(applyAdminParticipantFilters, 0);
}


// =========================================================
// ADMIN EKSPOR EXCEL V1 — XLSX lokal tanpa library eksternal.
// Mengekspor hanya data non-dokumen yang sudah dimuat oleh endpoint list.
// Mengikuti pencarian/filter yang sedang aktif.
// =========================================================
function getFilteredAdminRegistrations() {
  const registrations =
    Array.isArray(window.KETAHANAN_PANGAN_REGISTRATIONS)
      ? window.KETAHANAN_PANGAN_REGISTRATIONS
      : [];

  const search = normalizeAdminFilterText(
    document.getElementById('participantSearch')?.value
  );
  const status = normalizeAdminFilterText(
    document.getElementById('participantStatusFilter')?.value
  );
  const region = normalizeAdminFilterText(
    document.getElementById('participantRegionFilter')?.value
  );

  return registrations.filter((item) => {
    const haystack = normalizeAdminFilterText(
      `${item.registration_id || ''} ${item.nama || ''}`
    );
    const itemStatus = normalizeAdminFilterText(item.status);
    const itemRegion = normalizeAdminFilterText(adminRegistrationRegion(item));

    return (
      (!search || haystack.includes(search)) &&
      (!status || itemStatus === status) &&
      (!region || itemRegion === region)
    );
  });
}


function excelStatusLabel(status) {
  const labels = { submitted:'Menunggu Verifikasi', resubmitted:'Menunggu Pemeriksaan Ulang', verified:'Terverifikasi', revision:'Perlu Perbaikan', rejected:'Ditolak', needs_action:'Perlu Tindakan' };
  return labels[status] || status || '-';
}

function excelSafeText(value) {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}

function formatExcelReportDate(value) {
  if (!value) return '-';
  const raw = String(value).trim();
  const d = new Date(raw.includes('T') ? raw : raw.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleString('id-ID');
}

async function fetchAdminRegistrationDetailForExport(registrationId) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(registrationId)}`, {
    method:'GET', credentials:'include',
    headers:{Accept:'application/json'},
    cache:'no-store'
  });
  let data = null;
  try { data = await response.json(); } catch (_) {}
  if (!response.ok || !data?.ok || !data?.registration) {
    throw new Error(data?.message || `Detail ${registrationId} gagal dimuat (HTTP ${response.status}).`);
  }
  return data.registration;
}

async function ensureExcelEngineLoaded() {
  if (window.XLSX && window.XLSX.utils) return window.XLSX;

  if (window.KP_EXCEL_ENGINE_READY && typeof window.KP_EXCEL_ENGINE_READY.then === 'function') {
    try { await window.KP_EXCEL_ENGINE_READY; } catch (_) {}
  }

  if (window.XLSX && window.XLSX.utils) return window.XLSX;

  throw new Error('Mesin Excel gagal dimuat. Periksa koneksi internet lalu muat ulang halaman.');
}

function buildParticipantWorkbook(registrations) {
  const wb = XLSX.utils.book_new();
  const brand = `PT Super Tani Indonesia · Didukung AY Group Agro Indonesia · ${registrations.length} peserta`;
  const printed = `Dicetak: ${new Date().toLocaleString('id-ID')} · srilexbuditra.work`;

  function makeSheet(title, headers, rows, widths, mergeEnd) {
    const aoa = [[title],[brand],[printed],[],headers,...rows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!merges'] = [
      XLSX.utils.decode_range(`A1:${mergeEnd}1`),
      XLSX.utils.decode_range(`A2:${mergeEnd}2`),
      XLSX.utils.decode_range(`A3:${mergeEnd}3`)
    ];
    ws['!rows']=aoa.map((_,i)=>({hpt:i===0?26:i===1?20:i===2?18:i===3?8:i===4?30:24}));
    ws['!cols']=widths.map(w=>({wch:w}));
    ws['!freeze']={xSplit:0,ySplit:5,topLeftCell:'A6',activePane:'bottomLeft',state:'frozen'};
    ws['!autofilter']={ref:`A5:${mergeEnd}${Math.max(5,aoa.length)}`};
    ws['!margins']={left:0.22,right:0.22,top:0.32,bottom:0.32,header:0.12,footer:0.12};
    ws['!pageSetup']={orientation:'landscape',paperSize:9,fitToWidth:1,fitToHeight:0};
    return ws;
  }

  // SHEET 1: dipertahankan — data lengkap seperti V39/V40.
  const h1=['No.','Nomor Registrasi','Status','Nama Lengkap','NIK','Nomor KK','WhatsApp','Email',
    'Provinsi','Kabupaten / Kota','Kecamatan','Desa / Kelurahan','Alamat','Status Pemohon',
    'Kelompok Tani','Luas Lahan','Status Lahan','Komoditas','Tahap','Jenis Pupuk',
    'Kebutuhan Pupuk (kg)','Keterangan','Tanggal Registrasi'];
  const r1=registrations.map((r,i)=>[i+1,excelSafeText(r.registration_id),excelStatusLabel(r.status),
    excelSafeText(r.nama),excelSafeText(r.nik),excelSafeText(r.nomor_kk),excelSafeText(r.whatsapp),
    excelSafeText(r.email),excelSafeText(r.provinsi),excelSafeText(r.kabupaten),excelSafeText(r.kecamatan),
    excelSafeText(r.desa),excelSafeText(r.alamat),excelSafeText(r.status_pemohon),excelSafeText(r.kelompok_tani),
    excelSafeText(r.luas_lahan),excelSafeText(r.status_lahan),excelSafeText(r.komoditas),excelSafeText(r.tahap),
    excelSafeText(r.jenis_pupuk),excelSafeText(r.kebutuhan_kg),excelSafeText(r.keterangan),formatExcelReportDate(r.created_at)]);
  XLSX.utils.book_append_sheet(wb,makeSheet('LAPORAN DATA PESERTA PROGRAM KETAHANAN PANGAN',h1,r1,
    [5,25,17,24,19,19,17,28,19,22,20,20,34,19,22,13,17,18,12,19,18,30,21],'W'),'Data Peserta');

  // SHEET 2: identitas/kontak/wilayah — lebih lega dan cantik.
  const h2=['No.','Nomor Registrasi','Nama Peserta','NIK','Nomor KK','WhatsApp','Email',
    'Alamat','Desa / Kelurahan','Kecamatan','Kabupaten / Kota','Provinsi'];
  const r2=registrations.map((r,i)=>[i+1,excelSafeText(r.registration_id),excelSafeText(r.nama),
    excelSafeText(r.nik),excelSafeText(r.nomor_kk),excelSafeText(r.whatsapp),excelSafeText(r.email),
    excelSafeText(r.alamat),excelSafeText(r.desa),excelSafeText(r.kecamatan),excelSafeText(r.kabupaten),
    excelSafeText(r.provinsi)]);
  XLSX.utils.book_append_sheet(wb,makeSheet('IDENTITAS, KONTAK & WILAYAH PESERTA',h2,r2,
    [5,24,24,19,19,17,28,36,20,20,23,20],'L'),'Identitas & Wilayah');

  // SHEET 3: pertanian/pengajuan/status — pembagian 12 kolom.
  const h3=['No.','Nomor Registrasi','Nama Peserta','Status Pemohon','Kelompok Tani','Luas Lahan',
    'Status Lahan','Komoditas','Tahap','Jenis Pupuk','Kebutuhan (kg)','Status Registrasi'];
  const r3=registrations.map((r,i)=>[i+1,excelSafeText(r.registration_id),excelSafeText(r.nama),
    excelSafeText(r.status_pemohon),excelSafeText(r.kelompok_tani),excelSafeText(r.luas_lahan),
    excelSafeText(r.status_lahan),excelSafeText(r.komoditas),excelSafeText(r.tahap),
    excelSafeText(r.jenis_pupuk),excelSafeText(r.kebutuhan_kg),excelStatusLabel(r.status)]);
  XLSX.utils.book_append_sheet(wb,makeSheet('PROFIL PERTANIAN & STATUS PENGAJUAN',h3,r3,
    [5,24,24,19,23,13,18,19,12,20,16,19],'L'),'Pertanian & Status');

  wb.Props={Title:'Laporan Data Peserta Ketahanan Pangan',Author:'Program Ketahanan Pangan',
    Company:'PT Super Tani Indonesia'};
  return wb;
}

async function exportFilteredParticipantsToExcel() {
  const registrations = getFilteredAdminRegistrations();
  if (!registrations.length) { alert('Tidak ada peserta pada hasil filter yang dapat diekspor.'); return; }
  if (!adminToken) { alert('Session Admin tidak tersedia. Silakan login ulang.'); return; }

  const button = document.getElementById('participantExportExcel');
  const originalLabel = button?.textContent || 'Ekspor Excel A4';
  try {
    if (button) { button.disabled = true; button.textContent = `Mengambil detail 0/${registrations.length}...`; }
    const details = [];
    for (let i=0; i<registrations.length; i++) {
      details.push(await fetchAdminRegistrationDetailForExport(registrations[i].registration_id));
      if (button) button.textContent = `Mengambil detail ${i+1}/${registrations.length}...`;
    }
    if (button) button.textContent = 'Menyiapkan mesin Excel...';
    await ensureExcelEngineLoaded();
    if (button) button.textContent = 'Membuat Excel...';
    const wb = buildParticipantWorkbook(details);
    const now = new Date();
    const stamp = now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+'-'+String(now.getHours()).padStart(2,'0')+String(now.getMinutes()).padStart(2,'0');
    XLSX.writeFile(wb, `laporan-data-peserta-ketahanan-pangan-A4-${stamp}.xlsx`, { bookType:'xlsx', compression:true });
  } catch(error) {
    console.error('Ketahanan Pangan Admin: ekspor detail gagal.', error);
    alert(error.message || 'Ekspor Excel detail registrasi gagal.');
  } finally {
    if (button) { button.disabled=false; button.textContent=originalLabel; }
  }
}

function initAdminExcelExport() {
  const button = document.getElementById('participantExportExcel');
  if (!button || button.dataset.exportReady) return;
  button.dataset.exportReady = '1';
  button.addEventListener('click', exportFilteredParticipantsToExcel);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAdminExcelExport, {once:true});
else initAdminExcelExport();
