(() => {
  'use strict';

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const PAGE_KEY = 'portal:umroh';
  const form = document.querySelector('[data-page-meta-form]');
  const message = document.querySelector('[data-page-meta-message]');
  const submit = document.querySelector('[data-page-meta-submit]');
  const tabs = [...document.querySelectorAll('[data-editor-tab]')];
  const panels = [...document.querySelectorAll('[data-editor-panel]')];
  const mediaFileInput = document.querySelector('[data-media-file]');
  const mediaUploadButton = document.querySelector('[data-media-upload]');
  const mediaUploadRole = document.querySelector('[data-media-upload-role]');
  const mediaUploadStatus = document.querySelector('[data-media-upload-status]');
  const mediaPreviewWrap = document.querySelector('[data-media-preview-wrap]');
  const mediaPreview = document.querySelector('[data-media-preview]');
  let mediaPreviewObjectUrl = '';
  let mediaAltAuto = true;
  let mediaCaptionAuto = true;

  const api = async (path, options = {}) => {
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
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

  const setTab = (name = 'media') => {
    tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.editorTab === name));
    panels.forEach((panel) => {
      const active = panel.dataset.editorPanel === name;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
  };

  const show = (text, state = 'error') => {
    message.hidden = false;
    message.dataset.state = state;
    message.textContent = text;
  };
  const hideMessage = () => { message.hidden = true; message.textContent = ''; };
  const setValue = (name, value) => {
    const field = form.elements[name];
    if (!field) return;
    if (field.type === 'checkbox') field.checked = Boolean(value);
    else field.value = value ?? '';
  };

  const fields = [
    'page_key','page_path','seo_title','meta_description','canonical_url','robots','theme_color','og_type',
    'og_title','og_description','og_image_url','twitter_title','twitter_description','twitter_image_url',
    'banner_url','banner_object_key','thumbnail_url','thumbnail_object_key','image_alt','image_caption',
    'schema_type','schema_json','author_name','publisher_name','locale',
    'analytics_enabled','analytics_scroll_enabled','analytics_cta_enabled'
  ];

  const automaticMediaText = (meta = {}) => {
    const pageKey = meta.page_key || form?.elements.page_key?.value.trim() || PAGE_KEY;
    if (pageKey === 'portal:umroh') {
      return {
        alt: 'Digital Platform Umroh Semi Private Bengkulu',
        caption: 'Digital Platform Jemaah & Manasik — Umroh Semi Private Bengkulu'
      };
    }
    const seoTitle = meta.seo_title || form?.elements.seo_title?.value.trim() || 'Halaman Publik Umroh';
    const shortTitle = seoTitle.split('|')[0].trim() || 'Halaman Publik Umroh';
    return {
      alt: `${shortTitle} — Umroh Semi Private Bengkulu`,
      caption: `${shortTitle} — Umroh Semi Private Bengkulu`
    };
  };

  const looksManagedAlt = (value = '') => {
    const text = String(value || '').trim();
    return !text
      || text === 'Digital Platform Umroh Semi Private Bengkulu'
      || /Umroh Semi Private Bengkulu$/i.test(text);
  };

  const looksManagedCaption = (value = '') => {
    const text = String(value || '').trim();
    return !text
      || text === 'Digital Platform Jemaah & Manasik — Umroh Semi Private Bengkulu'
      || /— Umroh Semi Private Bengkulu$/i.test(text);
  };

  const applyAutomaticMediaText = (meta = {}, force = false) => {
    const generated = automaticMediaText(meta);
    const altField = form?.elements.image_alt;
    const captionField = form?.elements.image_caption;
    if (altField && (force || mediaAltAuto || !altField.value.trim())) altField.value = generated.alt;
    if (captionField && (force || mediaCaptionAuto || !captionField.value.trim())) captionField.value = generated.caption;
    updatePreview();
    return generated;
  };

  const clearLocalPreview = () => {
    if (mediaPreviewObjectUrl) URL.revokeObjectURL(mediaPreviewObjectUrl);
    mediaPreviewObjectUrl = '';
  };

  const updatePreview = () => {
    if (!mediaPreviewWrap || !mediaPreview) return;
    const selectedFile = mediaFileInput?.files?.[0];
    const remote = form.elements.banner_url?.value.trim() || form.elements.og_image_url?.value.trim() || '';
    const url = selectedFile && mediaPreviewObjectUrl ? mediaPreviewObjectUrl : remote;
    if (!url) {
      mediaPreviewWrap.hidden = true;
      mediaPreview.removeAttribute('src');
      return;
    }
    if (mediaPreview.src !== url) mediaPreview.src = url;
    mediaPreview.alt = form.elements.image_alt?.value.trim() || 'Preview media Portal Umroh';
    mediaPreviewWrap.hidden = false;
  };

  const setMeta = (meta = {}) => {
    fields.forEach((name) => setValue(name, meta[name]));
    mediaAltAuto = looksManagedAlt(form.elements.image_alt?.value);
    mediaCaptionAuto = looksManagedCaption(form.elements.image_caption?.value);
    applyAutomaticMediaText(meta);
  };

  const collectMeta = () => ({
    seo_title: form.elements.seo_title.value.trim(),
    meta_description: form.elements.meta_description.value.trim(),
    canonical_url: form.elements.canonical_url.value.trim(),
    robots: form.elements.robots.value,
    theme_color: form.elements.theme_color.value.trim(),
    og_type: form.elements.og_type.value,
    og_title: form.elements.og_title.value.trim(),
    og_description: form.elements.og_description.value.trim(),
    og_image_url: form.elements.og_image_url.value.trim(),
    twitter_title: form.elements.twitter_title.value.trim(),
    twitter_description: form.elements.twitter_description.value.trim(),
    twitter_image_url: form.elements.twitter_image_url.value.trim(),
    banner_url: form.elements.banner_url.value.trim(),
    banner_object_key: form.elements.banner_object_key.value.trim(),
    thumbnail_url: form.elements.thumbnail_url.value.trim(),
    thumbnail_object_key: form.elements.thumbnail_object_key.value.trim(),
    image_alt: form.elements.image_alt.value.trim(),
    image_caption: form.elements.image_caption.value.trim(),
    schema_type: form.elements.schema_type.value,
    schema_json: form.elements.schema_json.value.trim(),
    author_name: form.elements.author_name.value.trim(),
    publisher_name: form.elements.publisher_name.value.trim(),
    locale: form.elements.locale.value.trim(),
    analytics_enabled: form.elements.analytics_enabled.checked,
    analytics_scroll_enabled: form.elements.analytics_scroll_enabled.checked,
    analytics_cta_enabled: form.elements.analytics_cta_enabled.checked
  });

  const formatBytes = (bytes) => {
    const value = Number(bytes || 0);
    if (value < 1024) return `${value} B`;
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${(value / (1024 * 1024)).toFixed(2)} MB`;
  };
  const setMediaStatus = (text, state = '') => {
    mediaUploadStatus.textContent = text;
    mediaUploadStatus.dataset.state = state;
  };

  const inspectMedia = async () => {
    const file = mediaFileInput?.files?.[0];
    if (!file) { clearLocalPreview(); updatePreview(); setMediaStatus('Belum ada file dipilih.'); return; }
    applyAutomaticMediaText();
    const allowed = new Set(['image/avif','image/webp','image/jpeg','image/png']);
    if (!allowed.has(file.type)) { clearLocalPreview(); updatePreview(); setMediaStatus('Format tidak didukung. Gunakan AVIF, WebP, JPEG, atau PNG.', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { clearLocalPreview(); updatePreview(); setMediaStatus('Ukuran file melebihi 5 MB.', 'error'); return; }
    clearLocalPreview();
    mediaPreviewObjectUrl = URL.createObjectURL(file);
    mediaPreview.src = mediaPreviewObjectUrl;
    mediaPreview.alt = form.elements.image_alt?.value.trim() || file.name || 'Preview media Portal Umroh';
    mediaPreviewWrap.hidden = false;
    let dimensions = '';
    try {
      const probeUrl = URL.createObjectURL(file);
      const img = new Image();
      dimensions = await new Promise((resolve) => { img.onload = () => resolve(`${img.naturalWidth} × ${img.naturalHeight}px`); img.onerror = () => resolve(''); img.src = probeUrl; });
      URL.revokeObjectURL(probeUrl);
    } catch (_) {}
    setMediaStatus(`${file.name} · ${formatBytes(file.size)}${dimensions ? ` · ${dimensions}` : ''}`, 'ready');
  };

  const uploadMedia = async () => {
    const file = mediaFileInput?.files?.[0];
    const purpose = mediaUploadRole?.value || 'banner';
    const altText = form.elements.image_alt?.value.trim();
    if (!file) { setMediaStatus('Pilih gambar terlebih dahulu.', 'error'); return; }
    if (!altText) { setMediaStatus('Isi Alt Text sebelum upload gambar.', 'error'); form.elements.image_alt?.focus(); return; }
    if (file.size > 5 * 1024 * 1024) { setMediaStatus('Ukuran file maksimum 5 MB.', 'error'); return; }
    const body = new FormData();
    body.append('file', file); body.append('purpose', purpose); body.append('alt_text', altText);
    mediaUploadButton.disabled = true;
    const old = mediaUploadButton.textContent;
    mediaUploadButton.textContent = 'Mengunggah...';
    setMediaStatus('Mengunggah gambar ke R2 publik Umroh...', 'loading');
    try {
      const data = await api(`/admin/page-meta/media?page_key=${encodeURIComponent(PAGE_KEY)}`, { method: 'POST', body });
      const media = data.media || {};
      if (purpose === 'thumbnail') {
        form.elements.thumbnail_url.value = media.url || '';
        form.elements.thumbnail_object_key.value = media.object_key || '';
      } else {
        form.elements.banner_url.value = media.url || '';
        form.elements.banner_object_key.value = media.object_key || '';
        form.elements.og_image_url.value = media.url || '';
        form.elements.twitter_image_url.value = media.url || '';
      }
      updatePreview();
      setMediaStatus(`Upload berhasil: ${media.url || ''}. Klik Simpan Pengaturan agar URL tersimpan di D1.`, 'success');
    } catch (error) {
      const labels = { missing_public_media_binding:'Binding PUBLIC_MEDIA belum tersedia.', media_file_required:'File gambar wajib dipilih.', media_file_empty:'File gambar kosong.', media_file_too_large:'Ukuran file maksimum 5 MB.', unsupported_media_type:'Format gambar tidak didukung.', invalid_image_signature:'Isi file tidak cocok dengan format gambar.', invalid_media_purpose:'Tujuan gambar tidak valid.', image_alt_required:'Alt Text wajib diisi.', forbidden:'Role akun ini tidak diizinkan mengunggah media.', page_meta_not_found:'Konfigurasi halaman publik tidak ditemukan.' };
      setMediaStatus(labels[error.code] || `Upload gagal: ${error.code || error.message}`, 'error');
    } finally { mediaUploadButton.disabled = false; mediaUploadButton.textContent = old; }
  };

  const load = async () => {
    hideMessage();
    try {
      const data = await api(`/admin/page-meta?page_key=${encodeURIComponent(PAGE_KEY)}`);
      setMeta(data.page_meta || {});
      if (mediaFileInput) mediaFileInput.value = '';
      clearLocalPreview(); updatePreview();
      setMediaStatus('Metadata Portal dimuat dari D1.', 'success');
    } catch (error) {
      show(`Gagal memuat pengaturan: ${error.code || error.message}`);
    }
  };

  form?.addEventListener('submit', async (event) => {
    event.preventDefault(); hideMessage();
    submit.disabled = true; const old = submit.textContent; submit.textContent = 'Menyimpan...';
    try {
      const data = await api(`/admin/page-meta?page_key=${encodeURIComponent(PAGE_KEY)}`, { method: 'PATCH', body: JSON.stringify({ page_meta: collectMeta() }) });
      setMeta(data.page_meta || {});
      show('Pengaturan Portal berhasil disimpan ke D1. Tag crawler statis berubah setelah HTML Portal dideploy.', 'success');
    } catch (error) {
      const labels = { seo_title_required:'SEO Title wajib diisi.', meta_description_required:'Meta Description wajib diisi.', invalid_canonical_url:'Canonical harus URL HTTPS di srilexbuditra.work.', invalid_media_url:'URL media tidak valid.', invalid_media_object_key:'Object key media tidak valid.', invalid_robots:'Nilai robots tidak valid.', invalid_theme_color:'Theme color harus format #RRGGBB.', invalid_og_type:'OG Type tidak valid.', invalid_schema_type:'Schema Type tidak valid.', invalid_schema_json:'Schema JSON-LD tidak valid.', schema_json_too_large:'Schema JSON-LD terlalu panjang.', invalid_locale:'Locale harus seperti id_ID.', invalid_analytics_setting:'Pengaturan Analytics tidak valid.', forbidden:'Role akun ini tidak diizinkan mengubah pengaturan.', page_meta_not_found:'Konfigurasi halaman publik tidak ditemukan.' };
      show(labels[error.code] || `Gagal menyimpan: ${error.code || error.message}`);
    } finally { submit.disabled = false; submit.textContent = old; }
  });

  tabs.forEach((tab) => tab.addEventListener('click', () => setTab(tab.dataset.editorTab)));
  ['banner_url','og_image_url'].forEach((name) => form.elements[name]?.addEventListener('input', updatePreview));
  form.elements.image_alt?.addEventListener('input', () => {
    mediaAltAuto = form.elements.image_alt.value.trim() === automaticMediaText().alt;
    updatePreview();
  });
  form.elements.image_caption?.addEventListener('input', () => {
    mediaCaptionAuto = form.elements.image_caption.value.trim() === automaticMediaText().caption;
  });
  form.elements.seo_title?.addEventListener('input', () => {
    if (mediaAltAuto || mediaCaptionAuto) applyAutomaticMediaText();
  });
  mediaFileInput?.addEventListener('change', inspectMedia);
  mediaUploadButton?.addEventListener('click', uploadMedia);
  window.addEventListener('beforeunload', clearLocalPreview);

  const wait = () => {
    if (!document.documentElement.classList.contains('auth-ready')) { setTimeout(wait, 60); return; }
    const role = window.UMROH_ADMIN_ACCOUNT?.role || '';
    if (!['super_admin','admin'].includes(role)) { window.location.replace('../?reason=forbidden'); return; }
    load();
  };
  wait();
})();
