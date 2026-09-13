const API = 'https://peserta-api.srilexbuditra.work';
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const marketplaceView = document.getElementById('marketplaceView');
const toast = document.getElementById('toast');

let marketplaceData = null;
let activeCategory = 'all';

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
      new Error(data.message || 'Layanan Marketplace belum dapat diakses.'),
      { status: response.status }
    );
  }
  return data;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[char]);
}

function prettyCategory(value) {
  const key = String(value || 'produk').trim().toLowerCase();
  const map = {
    produk: 'Produk Pertanian',
    sarana_produksi: 'Sarana Produksi',
    layanan: 'Layanan',
    pendampingan: 'Pendampingan',
    mitra: 'Mitra Usaha',
    pelatihan: 'Pelatihan',
    informasi: 'Informasi'
  };
  return map[key] || key.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 3400);
}

function showError(title, text) {
  loadingState.hidden = true;
  marketplaceView.hidden = true;
  errorState.hidden = false;
  document.getElementById('errorTitle').textContent = title;
  document.getElementById('errorText').textContent = text;
}

function renderFilters(categories) {
  const filter = document.getElementById('categoryFilter');
  const normalized = [...new Set((categories || []).map(v => String(v || '').trim()).filter(Boolean))];
  filter.innerHTML = [
    '<button class="filter-chip is-active" type="button" data-category="all">Semua</button>',
    ...normalized.map(category =>
      `<button class="filter-chip" type="button" data-category="${escapeHtml(category)}">${escapeHtml(prettyCategory(category))}</button>`
    )
  ].join('');
}

function renderCatalog() {
  const list = document.getElementById('catalogList');
  const empty = document.getElementById('catalogEmpty');
  const items = Array.isArray(marketplaceData?.items) ? marketplaceData.items : [];
  const filtered = activeCategory === 'all'
    ? items
    : items.filter(item => String(item.category || '') === activeCategory);

  if (!filtered.length) {
    list.innerHTML = '';
    empty.hidden = false;
    const hasAny = items.length > 0;
    const strong = empty.querySelector('strong');
    const p = empty.querySelector('p');
    if (hasAny) {
      strong.textContent = 'Belum ada item pada kategori ini';
      p.textContent = 'Pilih kategori lain atau tampilkan semua katalog yang tersedia.';
    } else {
      strong.textContent = 'Belum ada katalog resmi yang dipublikasikan';
      p.textContent = 'Fondasi Marketplace sudah aktif. Produk, layanan, dan mitra akan muncul otomatis setelah pengelola menyetujui dan mempublikasikan katalog resmi.';
    }
    return;
  }

  empty.hidden = true;
  list.innerHTML = filtered.map(item => {
    const interested = Boolean(item.interested);
    const locked = !item.can_interest && !interested;
    const classes = [
      'catalog-card',
      interested ? 'is-interested' : '',
      locked ? 'is-locked' : ''
    ].filter(Boolean).join(' ');

    const requirement = interested
      ? 'Minat tersimpan'
      : (item.requirement_text || 'Akses katalog tersedia');

    const action = interested
      ? `<button class="btn muted interest-action" type="button" data-action="remove" data-item-id="${escapeHtml(item.item_id)}">Batalkan Minat</button>`
      : `<button class="btn primary interest-action" type="button" data-action="add" data-item-id="${escapeHtml(item.item_id)}" ${item.can_interest ? '' : 'disabled'}>${item.can_interest ? 'Simpan Minat' : 'Belum Memenuhi Syarat'}</button>`;

    return `
      <article class="${classes}">
        <div class="catalog-main">
          <div class="catalog-top">
            <span class="catalog-chip">${escapeHtml(prettyCategory(item.category))}</span>
            <span class="catalog-chip gold">LEVEL ${Number(item.min_level || 1)}</span>
            ${item.requires_verified_member ? '<span class="catalog-chip">VERIFIED MEMBER</span>' : ''}
            ${item.badge_label ? `<span class="catalog-chip accent">${escapeHtml(item.badge_label)}</span>` : ''}
          </div>
          <h4>${escapeHtml(item.title || 'Item Marketplace')}</h4>
          <p>${escapeHtml(item.summary || 'Informasi item akan diperbarui oleh pengelola.')}</p>
          <div class="catalog-meta">
            <span>◈ ${escapeHtml(item.provider_name || 'Program Ketahanan Pangan')}</span>
            <span>◎ ${escapeHtml(item.price_label || 'Informasi mengikuti katalog')}</span>
          </div>
          <div class="catalog-status">${escapeHtml(requirement)}</div>
        </div>
        <div class="catalog-actions">${action}</div>
      </article>`;
  }).join('');
}

function render(data) {
  const marketplace = data.marketplace || {};
  const participant = data.participant || {};
  const level = marketplace.level || {};

  marketplaceData = marketplace;

  document.getElementById('participantName').textContent = participant.nama || 'Peserta';
  document.getElementById('publishedItems').textContent = Number(marketplace.published_items || 0).toLocaleString('id-ID');
  document.getElementById('interestedItems').textContent = Number(marketplace.interested_items || 0).toLocaleString('id-ID');
  document.getElementById('totalPoints').textContent = Number(marketplace.total_points || 0).toLocaleString('id-ID') + ' Poin';
  document.getElementById('levelName').textContent = `Level ${level.level || 1} ${level.name || 'Tunas'}`;
  document.getElementById('memberStatus').textContent = marketplace.verified_member ? 'VERIFIED MEMBER' : 'Peserta Aktif';
  document.getElementById('summaryText').textContent =
    `${Number(marketplace.published_items || 0)} katalog tersedia · ${Number(marketplace.interested_items || 0)} minat tersimpan · Level ${level.level || 1} ${level.name || 'Tunas'}.`;

  const badge = document.getElementById('memberBadge');
  badge.textContent = marketplace.verified_member ? '✓ VERIFIED MEMBER' : 'PESERTA';
  badge.classList.toggle('is-basic', !marketplace.verified_member);

  document.getElementById('marketplaceNote').textContent =
    marketplace.note || 'Marketplace tahap ini hanya katalog dan pencatatan minat.';

  renderFilters(marketplace.categories || []);
  activeCategory = 'all';
  renderCatalog();

  loadingState.hidden = true;
  errorState.hidden = true;
  marketplaceView.hidden = false;
}

async function reload() {
  const data = await api('/marketplace');
  render(data);
}

document.addEventListener('click', async event => {
  const filterButton = event.target.closest('.filter-chip');
  if (filterButton) {
    activeCategory = String(filterButton.dataset.category || 'all');
    document.querySelectorAll('.filter-chip').forEach(button => {
      button.classList.toggle('is-active', button === filterButton);
    });
    renderCatalog();
    return;
  }

  const actionButton = event.target.closest('.interest-action');
  if (!actionButton || actionButton.disabled) return;

  const itemId = String(actionButton.dataset.itemId || '');
  const action = String(actionButton.dataset.action || 'add');
  if (!itemId) return;

  actionButton.disabled = true;
  const original = actionButton.textContent;
  actionButton.textContent = action === 'add' ? 'Menyimpan…' : 'Membatalkan…';

  try {
    const data = await api('/marketplace/interest', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId, action })
    });

    if (data.marketplace) {
      marketplaceData = data.marketplace;
      document.getElementById('publishedItems').textContent = Number(marketplaceData.published_items || 0).toLocaleString('id-ID');
      document.getElementById('interestedItems').textContent = Number(marketplaceData.interested_items || 0).toLocaleString('id-ID');
      document.getElementById('summaryText').textContent =
        `${Number(marketplaceData.published_items || 0)} katalog tersedia · ${Number(marketplaceData.interested_items || 0)} minat tersimpan · Level ${marketplaceData.level?.level || 1} ${marketplaceData.level?.name || 'Tunas'}.`;
      renderCatalog();
    }

    showToast(data.message || (action === 'add' ? 'Minat berhasil disimpan.' : 'Minat berhasil dibatalkan.'));
  } catch (error) {
    showToast(error?.message || 'Permintaan belum dapat diproses.');
    actionButton.disabled = false;
    actionButton.textContent = original;
  }
});

(async function init() {
  try {
    await reload();
  } catch (error) {
    showError(
      error?.status === 401 ? 'Sesi login diperlukan' : 'Marketplace belum dapat ditampilkan',
      error?.message || 'Periksa koneksi internet lalu coba kembali.'
    );
  }
})();
