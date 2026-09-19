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
  const pageMetaActions = document.querySelector('[data-page-meta-actions]');
  const brandingTab = document.querySelector('[data-branding-tab]');
  const brandingPanel = document.querySelector('[data-branding-panel]');
  const brandingFileInput = document.querySelector('[data-branding-file]');
  const brandingUploadButton = document.querySelector('[data-branding-upload]');
  const brandingSaveButton = document.querySelector('[data-branding-save]');
  const brandingStatus = document.querySelector('[data-branding-status]');
  const brandingPreview = document.querySelector('[data-branding-preview]');
  let mediaPreviewObjectUrl = '';
  let brandingPreviewObjectUrl = '';
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
    if (pageMetaActions) pageMetaActions.hidden = name === 'branding';
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

  const brandingField = (name) => form?.elements?.[name] || null;
  const setBrandingStatus = (text, state = '') => {
    if (!brandingStatus) return;
    brandingStatus.textContent = text;
    brandingStatus.dataset.state = state;
  };
  const clearBrandingLocalPreview = () => {
    if (brandingPreviewObjectUrl) URL.revokeObjectURL(brandingPreviewObjectUrl);
    brandingPreviewObjectUrl = '';
  };
  const setBrandingPreview = (url, alt = '') => {
    if (!brandingPreview) return;
    if (!url) { brandingPreview.removeAttribute('src'); return; }
    brandingPreview.src = url;
    brandingPreview.alt = alt || 'Logo Umroh Semi Private Bengkulu';
  };
  const setBranding = (branding = {}) => {
    const map = {
      branding_brand_name: 'brand_name',
      branding_short_name: 'short_name',
      branding_logo_alt: 'logo_alt',
      branding_theme_color: 'theme_color',
      branding_background_color: 'background_color',
      branding_logo_url: 'logo_url',
      branding_favicon_ico_url: 'favicon_ico_url',
      branding_favicon_32_url: 'favicon_32_url',
      branding_favicon_16_url: 'favicon_16_url',
      branding_apple_touch_icon_url: 'apple_touch_icon_url',
      branding_android_192_url: 'android_192_url',
      branding_android_512_url: 'android_512_url',
      branding_manifest_url: 'manifest_url'
    };
    Object.entries(map).forEach(([fieldName, sourceName]) => {
      const field = brandingField(fieldName);
      if (field) field.value = branding[sourceName] ?? '';
    });
    setBrandingPreview(branding.logo_url ? `${branding.logo_url}?v=${Date.now()}` : '', branding.logo_alt);
  };

  const saveBranding = async ({ quiet = false } = {}) => {
    const payload = {
      brand_name: brandingField('branding_brand_name')?.value.trim() || '',
      short_name: brandingField('branding_short_name')?.value.trim() || '',
      logo_alt: brandingField('branding_logo_alt')?.value.trim() || '',
      theme_color: brandingField('branding_theme_color')?.value.trim() || '#0b2830',
      background_color: brandingField('branding_background_color')?.value.trim() || '#ffffff'
    };
    if (!payload.brand_name || !payload.short_name || !payload.logo_alt) {
      setBrandingStatus('Nama Brand, Short Name, dan Alt Logo wajib diisi.', 'error');
      throw new Error('branding_fields_required');
    }
    const data = await api('/admin/branding', { method: 'PATCH', body: JSON.stringify({ branding: payload }) });
    setBranding(data.branding || {});
    if (!quiet) setBrandingStatus('Branding berhasil disimpan ke D1.', 'success');
    return data.branding || {};
  };

  const squarePngBlob = async (bitmap, size) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('canvas_unavailable');
    ctx.clearRect(0, 0, size, size);
    const padding = Math.max(1, Math.round(size * 0.04));
    const maxWidth = size - padding * 2;
    const maxHeight = size - padding * 2;
    const ratio = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height);
    const width = Math.max(1, Math.round(bitmap.width * ratio));
    const height = Math.max(1, Math.round(bitmap.height * ratio));
    ctx.drawImage(bitmap, Math.round((size - width) / 2), Math.round((size - height) / 2), width, height);
    return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('png_encode_failed')), 'image/png'));
  };

  const pngBlobToIco = async (pngBlob, size = 32) => {
    const png = new Uint8Array(await pngBlob.arrayBuffer());
    const headerSize = 6;
    const entrySize = 16;
    const buffer = new ArrayBuffer(headerSize + entrySize + png.length);
    const view = new DataView(buffer);
    view.setUint16(0, 0, true);
    view.setUint16(2, 1, true);
    view.setUint16(4, 1, true);
    view.setUint8(6, size >= 256 ? 0 : size);
    view.setUint8(7, size >= 256 ? 0 : size);
    view.setUint8(8, 0);
    view.setUint8(9, 0);
    view.setUint16(10, 1, true);
    view.setUint16(12, 32, true);
    view.setUint32(14, png.length, true);
    view.setUint32(18, headerSize + entrySize, true);
    new Uint8Array(buffer, headerSize + entrySize).set(png);
    return new Blob([buffer], { type: 'image/x-icon' });
  };

  const uploadBrandAsset = async (purpose, blob, fileName, type) => {
    const body = new FormData();
    body.append('purpose', purpose);
    body.append('file', new File([blob], fileName, { type }));
    return api('/admin/branding/media', { method: 'POST', body });
  };

  const inspectBrandingFile = async () => {
    const file = brandingFileInput?.files?.[0];
    if (!file) { clearBrandingLocalPreview(); setBrandingPreview(brandingField('branding_logo_url')?.value || '', brandingField('branding_logo_alt')?.value || ''); return; }
    if (file.type !== 'image/avif') { setBrandingStatus('Gunakan file AVIF untuk logo utama.', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { setBrandingStatus('Ukuran logo maksimum 5 MB.', 'error'); return; }
    clearBrandingLocalPreview();
    brandingPreviewObjectUrl = URL.createObjectURL(file);
    setBrandingPreview(brandingPreviewObjectUrl, brandingField('branding_logo_alt')?.value || file.name);
    setBrandingStatus(`${file.name} · ${(file.size / 1024).toFixed(1)} KB · siap diterapkan.`, 'ready');
  };

  const uploadBrandingBundle = async () => {
    const file = brandingFileInput?.files?.[0];
    if (!file) { setBrandingStatus('Pilih logo AVIF terlebih dahulu.', 'error'); return; }
    if (file.type !== 'image/avif') { setBrandingStatus('Logo utama harus berformat AVIF.', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { setBrandingStatus('Ukuran logo maksimum 5 MB.', 'error'); return; }
    const alt = brandingField('branding_logo_alt')?.value.trim();
    if (!alt) { setBrandingStatus('Alt Logo wajib diisi.', 'error'); brandingField('branding_logo_alt')?.focus(); return; }

    brandingUploadButton.disabled = true;
    brandingSaveButton && (brandingSaveButton.disabled = true);
    const oldText = brandingUploadButton.textContent;
    brandingUploadButton.textContent = 'Memproses...';
    try {
      setBrandingStatus('Membuat favicon transparan dari logo utama...', 'loading');
      const bitmap = await createImageBitmap(file);
      const [png16, png32, png180, png192, png512] = await Promise.all([
        squarePngBlob(bitmap, 16), squarePngBlob(bitmap, 32), squarePngBlob(bitmap, 180), squarePngBlob(bitmap, 192), squarePngBlob(bitmap, 512)
      ]);
      bitmap.close?.();
      const ico = await pngBlobToIco(png32, 32);
      const queue = [
        ['logo', file, 'logo-umroh-semi-private-bengkulu.avif', 'image/avif'],
        ['favicon_ico', ico, 'favicon.ico', 'image/x-icon'],
        ['favicon_32', png32, 'favicon-32x32.png', 'image/png'],
        ['favicon_16', png16, 'favicon-16x16.png', 'image/png'],
        ['apple_touch_icon', png180, 'apple-touch-icon.png', 'image/png'],
        ['android_192', png192, 'android-chrome-192x192.png', 'image/png'],
        ['android_512', png512, 'android-chrome-512x512.png', 'image/png']
      ];
      for (let index = 0; index < queue.length; index += 1) {
        const [purpose, blob, name, type] = queue[index];
        setBrandingStatus(`Mengunggah branding ${index + 1}/${queue.length} · ${name}...`, 'loading');
        await uploadBrandAsset(purpose, blob, name, type);
      }
      const branding = await saveBranding({ quiet: true });
      clearBrandingLocalPreview();
      setBrandingPreview(`${branding.logo_url}?v=${Date.now()}`, branding.logo_alt);
      setBrandingStatus('Logo, favicon, Apple Touch Icon, dan ikon Android berhasil diperbarui ke R2 dengan URL permanen.', 'success');
    } catch (error) {
      const labels = {
        missing_public_media_binding: 'Binding PUBLIC_MEDIA belum tersedia.',
        invalid_branding_purpose: 'Jenis aset branding tidak valid.',
        invalid_branding_media_type: 'Format aset branding tidak sesuai.',
        invalid_image_signature: 'Isi file branding tidak cocok dengan formatnya.',
        media_file_required: 'File branding belum dipilih.',
        media_file_too_large: 'Ukuran file maksimum 5 MB.',
        forbidden: 'Hanya Super Admin yang dapat mengubah Branding Global.'
      };
      setBrandingStatus(labels[error.code] || `Gagal menerapkan branding: ${error.code || error.message}`, 'error');
    } finally {
      brandingUploadButton.disabled = false;
      if (brandingSaveButton) brandingSaveButton.disabled = false;
      brandingUploadButton.textContent = oldText;
    }
  };

  const loadBranding = async () => {
    try {
      const data = await api('/admin/branding');
      setBranding(data.branding || {});
      setBrandingStatus('Branding Global dimuat dari D1. URL aset bersifat permanen.', 'success');
    } catch (error) {
      const labels = { forbidden: 'Branding Global hanya dapat diubah oleh Super Admin.' };
      setBrandingStatus(labels[error.code] || `Gagal memuat branding: ${error.code || error.message}`, 'error');
    }
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
    event.preventDefault();
    if (brandingPanel?.classList.contains('is-active')) {
      brandingSaveButton?.click();
      return;
    }
    hideMessage();
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
  brandingFileInput?.addEventListener('change', inspectBrandingFile);
  brandingUploadButton?.addEventListener('click', uploadBrandingBundle);
  brandingSaveButton?.addEventListener('click', async () => {
    brandingSaveButton.disabled = true;
    try { await saveBranding(); }
    catch (error) { if (error.message !== 'branding_fields_required') setBrandingStatus(`Gagal menyimpan branding: ${error.code || error.message}`, 'error'); }
    finally { brandingSaveButton.disabled = false; }
  });
  window.addEventListener('beforeunload', () => { clearLocalPreview(); clearBrandingLocalPreview(); });

  const wait = () => {
    if (!document.documentElement.classList.contains('auth-ready')) { setTimeout(wait, 60); return; }
    const role = window.UMROH_ADMIN_ACCOUNT?.role || '';
    if (!['super_admin','admin'].includes(role)) { window.location.replace('../?reason=forbidden'); return; }
    if (role === 'super_admin') {
      setTab('branding');
      loadBranding();
    } else {
      brandingTab?.setAttribute('hidden', '');
      if (brandingPanel) brandingPanel.hidden = true;
      setTab('media');
    }
    load();
  };
  wait();
})();
