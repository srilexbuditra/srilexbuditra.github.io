/* =========================================================
   Global Visitor Analytics — Cloudflare Worker + D1 + GA4
   V6.11.0.2 Centralized Site-Wide + Responsive Consent UI
   ========================================================= */
(() => {
  if (window.__SB_GLOBAL_VISITOR_ANALYTICS__) return;
  window.__SB_GLOBAL_VISITOR_ANALYTICS__ = true;

  const path = window.location.pathname || '/';
  const PRIVATE_PATH =
    path === '/admin' ||
    path.startsWith('/admin/') ||
    path === '/stats.html' ||
    path === '/verify/publisher.html' ||
    path.startsWith('/program/ketahanan-pangan/admin/');

  // Halaman privat/sensitif sengaja tidak dikirim ke GA4 maupun Visitor Analytics.
  if (PRIVATE_PATH) return;

  /* =========================================================
     Privacy Consent — Google Consent Mode (Basic)
     - Google tag and Visitor Analytics are completely blocked
       until the visitor grants analytics consent.
     - Advertising consent remains denied even when analytics
       consent is granted.
     ========================================================= */
  const CONSENT_STORAGE_KEY = 'sb_privacy_consent_v1';
  const CONSENT_VERSION = 1;
  const CONSENT_CSS_HREF = '/assets/css/privacy-consent.css?v=13.6.14.2';

  const readConsent = () => {
    try {
      const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (
        !parsed ||
        parsed.version !== CONSENT_VERSION ||
        !['granted', 'denied'].includes(parsed.analytics)
      ) return null;
      return parsed.analytics;
    } catch (_) {
      return null;
    }
  };

  const writeConsent = (analyticsState) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
        version: CONSENT_VERSION,
        analytics: analyticsState,
        updated_at: new Date().toISOString()
      }));
    } catch (_) {}
  };

  const loadConsentStyles = () => {
    if (document.querySelector('link[data-sb-consent-style]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CONSENT_CSS_HREF;
    link.dataset.sbConsentStyle = '1';
    document.head.appendChild(link);
  };

  const removeAnalyticsCookies = () => {
    const names = document.cookie
      .split(';')
      .map(part => part.split('=')[0].trim())
      .filter(name =>
        name === '_ga' ||
        name.startsWith('_ga_') ||
        name === '_gid' ||
        name.startsWith('_gat')
      );

    const domains = new Set(['']);
    if (window.location.hostname) {
      domains.add(window.location.hostname);
      domains.add(`.${window.location.hostname}`);
      if (window.location.hostname.endsWith('srilexbuditra.work')) {
        domains.add('srilexbuditra.work');
        domains.add('.srilexbuditra.work');
      }
    }

    for (const name of names) {
      for (const domain of domains) {
        const domainPart = domain ? `; domain=${domain}` : '';
        document.cookie = `${name}=; Max-Age=0; path=/${domainPart}; SameSite=Lax`;
      }
    }
  };

  const clearVisitorAnalyticsIdentity = () => {
    try { localStorage.removeItem('sb_visitor_id'); } catch (_) {}
  };

  const onDomReady = (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  };

  const removeConsentPanel = () => {
    document.getElementById('sb-privacy-consent')?.remove();
    document.body?.classList.remove('sb-consent-open');
  };

  const renderPrivacyLauncher = () => {
    if (document.getElementById('sb-privacy-launcher')) return;

    const button = document.createElement('button');
    button.id = 'sb-privacy-launcher';
    button.type = 'button';
    button.className = 'sb-privacy-launcher';
    button.textContent = 'Privasi';
    button.setAttribute('aria-label', 'Buka pengaturan privasi dan analitik');
    button.addEventListener('click', () => renderConsentPanel(true));
    document.body.appendChild(button);
  };

  const denyAnalytics = () => {
    const wasGranted = readConsent() === 'granted';
    writeConsent('denied');

    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'granted',
        personalization_storage: 'denied',
        security_storage: 'granted'
      });
    }

    removeAnalyticsCookies();
    clearVisitorAnalyticsIdentity();
    removeConsentPanel();
    renderPrivacyLauncher();

    // Jika tag sudah pernah aktif pada halaman ini, reload agar Basic Mode
    // kembali ke keadaan benar-benar tanpa Google tag.
    if (wasGranted || window.__SB_GA4_LOADED__) {
      window.setTimeout(() => window.location.reload(), 120);
    }
  };

  const grantAnalytics = () => {
    if (readConsent() === 'granted') {
      removeConsentPanel();
      renderPrivacyLauncher();
      return;
    }

    writeConsent('granted');
    // Basic Mode: muat ulang agar seluruh analytics mulai dari keadaan bersih
    // setelah interaksi pengguna.
    window.location.reload();
  };

  function renderConsentPanel(settingsMode = false) {
    loadConsentStyles();
    removeConsentPanel();
    document.body?.classList.add('sb-consent-open');

    const current = readConsent();
    const panel = document.createElement('section');
    panel.id = 'sb-privacy-consent';
    panel.className = 'sb-privacy-consent';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Privasi dan analitik');

    const header = document.createElement('div');
    header.className = 'sb-privacy-consent__header';

    const heading = document.createElement('h2');
    heading.className = 'sb-privacy-consent__title';
    heading.textContent = settingsMode ? 'Pengaturan Privasi' : 'Privasi & Analitik';

    header.appendChild(heading);

    if (settingsMode && current) {
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'sb-privacy-consent__close';
      close.setAttribute('aria-label', 'Tutup pengaturan privasi');
      close.textContent = '×';
      close.addEventListener('click', () => removeConsentPanel());
      header.appendChild(close);
    }

    const description = document.createElement('p');
    description.className = 'sb-privacy-consent__text';

    const isKetahananPangan =
      window.location.pathname === '/program/ketahanan-pangan' ||
      window.location.pathname.startsWith('/program/ketahanan-pangan/');

    description.textContent = isKetahananPangan
      ? 'Kami menggunakan analitik untuk memahami penggunaan layanan Program Ketahanan Pangan dan meningkatkan pengalaman peserta serta pengunjung. Analitik hanya aktif dengan izin Anda.'
      : 'Kami menggunakan analitik untuk memahami penggunaan srilexbuditra.work dan meningkatkan pengalaman pengunjung. Analitik hanya aktif dengan izin Anda.';

    const status = document.createElement('p');
    status.className = 'sb-privacy-consent__status';
    if (current === 'granted') {
      status.textContent = 'Status saat ini: Analitik diizinkan.';
    } else if (current === 'denied') {
      status.textContent = 'Status saat ini: Analitik ditolak.';
    } else {
      status.textContent = 'Pilih preferensi analitik Anda.';
    }

    const privacyLink = document.createElement('a');
    privacyLink.className = 'sb-privacy-consent__link';
    privacyLink.href = '/privacy.html';
    privacyLink.textContent = 'Baca Kebijakan Privasi';

    const actions = document.createElement('div');
    actions.className = 'sb-privacy-consent__actions';

    const reject = document.createElement('button');
    reject.type = 'button';
    reject.className = 'sb-privacy-consent__button sb-privacy-consent__button--secondary';
    reject.textContent = 'Tolak Analitik';
    reject.addEventListener('click', denyAnalytics);

    const accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'sb-privacy-consent__button sb-privacy-consent__button--primary';
    accept.textContent = current === 'granted' ? 'Tetap Izinkan' : 'Terima Analitik';
    accept.addEventListener('click', grantAnalytics);

    actions.append(reject, accept);
    panel.append(header, description, status, privacyLink, actions);
    document.body.appendChild(panel);
  }

  loadConsentStyles();

  const ANALYTICS_CONSENT = readConsent();

  onDomReady(() => {
    if (ANALYTICS_CONSENT === null) {
      renderConsentPanel(false);
      return;
    }
    renderPrivacyLauncher();
  });

  // Basic Consent Mode:
  // - belum memilih: tidak muat Google tag / Visitor Analytics
  // - ditolak: tidak muat Google tag / Visitor Analytics
  if (ANALYTICS_CONSENT !== 'granted') return;

  const GA_MEASUREMENT_ID = 'G-W0S2WQ2P3T';
  const API_BASE = 'https://srilexbuditra-visitors-api.srilexbuditra.workers.dev';
  const VISITOR_API = `${API_BASE}/visitor`;
  const HEARTBEAT_API = `${API_BASE}/heartbeat`;
  const LEAVE_API = `${API_BASE}/leave`;
  const STORAGE_KEY = 'sb_visitor_id';
  const HEARTBEAT_MS = 60 * 1000;
  const HEARTBEAT_RETRY_MS = 5 * 1000;

  const safeUrl = (value, base = window.location.href) => {
    try {
      const url = new URL(value, base);
      return {
        origin: url.origin,
        hostname: url.hostname,
        pathname: url.pathname || '/',
        href: `${url.origin}${url.pathname || '/'}`,
        protocol: url.protocol
      };
    } catch (_) {
      return null;
    }
  };

  const currentSafe = safeUrl(window.location.href) || {
    origin: window.location.origin,
    hostname: window.location.hostname,
    pathname: window.location.pathname || '/',
    href: `${window.location.origin}${window.location.pathname || '/'}`,
    protocol: window.location.protocol
  };

  const referrerSafe = document.referrer ? safeUrl(document.referrer) : null;

  /* =========================================================
     Public Registration Source privacy layer
     - KP-PUB values are intentionally NOT sent to GA4 or Visitor Analytics.
     - Public-source detail URLs are grouped under /:public-ref/.
     ========================================================= */
  const PUBLIC_SOURCE_BASE = '/program/ketahanan-pangan/sumber';
  const PUBLIC_REF_PATH_RE =
    /^\/program\/ketahanan-pangan\/sumber\/KP-PUB-[A-F0-9]{12}\/?$/i;

  const sanitizeAnalyticsPath = (pathname) => {
    const value = String(pathname || '/');
    if (PUBLIC_REF_PATH_RE.test(value)) {
      return `${PUBLIC_SOURCE_BASE}/:public-ref/`;
    }
    return value;
  };

  const currentAnalyticsPath = sanitizeAnalyticsPath(currentSafe.pathname);
  const currentAnalyticsHref = `${currentSafe.origin}${currentAnalyticsPath}`;
  const currentAnalyticsTitle = PUBLIC_REF_PATH_RE.test(currentSafe.pathname)
    ? 'Sumber Resmi Registrasi | Program Ketahanan Pangan'
    : document.title;

  const referrerAnalyticsHref = referrerSafe
    ? `${referrerSafe.origin}${sanitizeAnalyticsPath(referrerSafe.pathname)}`
    : '';

  /* =========================================================
     GA4 loader
     - Query string/hash are deliberately excluded from page_location/page_path.
     - No form values, NIK, KK, phone, email, password, token, or registration ID
       are added as event parameters here.
     ========================================================= */
  if (!window.__SB_GA4_LOADED__) {
    window.__SB_GA4_LOADED__ = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

    // Consent Mode Basic: setelah user memberi izin, Google tag memproses
    // default state terlebih dahulu lalu update state sebelum konfigurasi GA4.
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      personalization_storage: 'denied',
      security_storage: 'granted'
    });

    window.gtag('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted',
      functionality_storage: 'granted',
      personalization_storage: 'denied',
      security_storage: 'granted'
    });

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: currentAnalyticsPath,
      page_location: currentAnalyticsHref,
      page_referrer: referrerAnalyticsHref,
      page_title: currentAnalyticsTitle
    });

    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' +
      encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(gaScript);
  }

  const sendGaEvent = (eventName, params = {}) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, {
      source_path: currentAnalyticsPath,
      ...params,
      transport_type: 'beacon'
    });
  };

  /* =========================================================
     GA4 — privacy-safe link events for every public page
     ========================================================= */
  const DOWNLOAD_EXTENSIONS = new Set([
    'pdf', 'zip', 'rar', '7z', 'doc', 'docx', 'xls', 'xlsx', 'csv',
    'ppt', 'pptx', 'txt', 'md', 'json', 'xml', 'jpg', 'jpeg', 'png',
    'webp', 'avif', 'svg', 'mp3', 'wav', 'mp4', 'webm'
  ]);

  const extensionFromPath = (pathname) => {
    const match = String(pathname || '').toLowerCase().match(/\.([a-z0-9]{1,8})$/);
    return match ? match[1] : '';
  };

  const classifyLink = (link, target) => {
    const rawHref = link.getAttribute('href') || '';
    if (rawHref.startsWith('#')) return 'anchor';
    if (target?.protocol === 'mailto:') return 'email';
    if (target?.protocol === 'tel:') return 'phone';
    if (
      target?.hostname === 'wa.me' ||
      target?.hostname === 'api.whatsapp.com' ||
      target?.hostname === 'web.whatsapp.com'
    ) return 'whatsapp';

    const ext = extensionFromPath(target?.pathname || '');
    if (link.hasAttribute('download') || DOWNLOAD_EXTENSIONS.has(ext)) return 'download';
    if (target && target.origin === currentSafe.origin) return 'internal';
    return 'external';
  };

  const trackKnownProgramCtas = (link, target) => {
    const href = link.getAttribute('href') || '';
    const clickedText = (link.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();

    const loginControl =
      clickedText === 'login / aktivasi akun' ||
      clickedText === 'login/aktivasi akun' ||
      clickedText === 'login & aktivasi akun' ||
      clickedText === 'login dan aktivasi akun';

    if (loginControl) {
      sendGaEvent('login_start', {
        event_category: 'ketahanan_pangan',
        event_label: 'Login / Aktivasi Akun'
      });
      return;
    }

    const targetPath = target?.pathname?.replace(/\/+$/, '') || '/';
    const targetHost = target?.hostname || '';

    if (
      (targetHost === 's.id' && targetPath === '/daftar_tani') ||
      href === 'https://s.id/daftar_tani' ||
      href.startsWith('https://s.id/daftar_tani?') ||
      href.startsWith('https://s.id/daftar_tani#')
    ) {
      sendGaEvent('registration_start', {
        event_category: 'ketahanan_pangan',
        event_label: 'Daftar Peserta'
      });
      return;
    }

    if (
      (targetHost === 's.id' && targetPath === '/validasi_tani') ||
      (target?.origin === currentSafe.origin &&
        targetPath === '/program/ketahanan-pangan/verifikasi')
    ) {
      sendGaEvent('status_check_start', {
        event_category: 'ketahanan_pangan',
        event_label: 'Cek Status Pendaftaran'
      });
      return;
    }

    if (
      (targetHost === 's.id' && targetPath === '/akun_tani') ||
      (target?.origin === currentSafe.origin && [
        '/program/ketahanan-pangan/peserta',
        '/program/ketahanan-pangan/login',
        '/program/ketahanan-pangan/akun'
      ].includes(targetPath))
    ) {
      sendGaEvent('login_start', {
        event_category: 'ketahanan_pangan',
        event_label: 'Login / Aktivasi Akun'
      });
    }
  };

  /* =========================================================
     GA4 — Public Registration Source events
     Privacy rule: KTPG and KP-PUB values are never event parameters.
     ========================================================= */
  const normalizedCurrentPath = currentSafe.pathname.replace(/\/+$/, '') || '/';
  const normalizedPublicSourceBase = PUBLIC_SOURCE_BASE.replace(/\/+$/, '');
  const isPublicSourceLanding = normalizedCurrentPath === normalizedPublicSourceBase;
  const isPublicSourceDetail = PUBLIC_REF_PATH_RE.test(currentSafe.pathname);

  const sendPublicSourceEvent = (eventName, extra = {}) => {
    sendGaEvent(eventName, {
      event_category: 'ketahanan_pangan',
      event_label: 'Sumber Resmi Registrasi',
      source_feature: 'public_registration_source',
      ...extra
    });
  };

  if (isPublicSourceLanding) {
    let publicSourceViewSent = false;

    const emitPublicSourceView = (navigationType = 'load') => {
      if (navigationType === 'load' && publicSourceViewSent) return;
      publicSourceViewSent = true;

      sendPublicSourceEvent('public_source_view', {
        navigation_type: navigationType
      });
    };

    window.addEventListener('pageshow', (event) => {
      emitPublicSourceView(event.persisted ? 'back_forward' : 'load');
    }, { passive: true });

    if (document.readyState === 'complete') {
      setTimeout(() => emitPublicSourceView('load'), 0);
    }
  }

  if (isPublicSourceDetail) {
    sendPublicSourceEvent('public_source_open');

    // #issued hanya ditambahkan Worker setelah POST /terbitkan benar-benar sukses.
    // Fragment tidak dikirim ke server dan tidak berisi KTPG/KP-PUB.
    if (window.location.hash === '#issued') {
      sendPublicSourceEvent('public_source_issue_success', {
        issue_origin: 'public_source_form'
      });

      try {
        window.history.replaceState(
          window.history.state,
          document.title,
          window.location.pathname + window.location.search
        );
      } catch (_) {}
    }
  }

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    let action = null;
    try {
      action = new URL(form.getAttribute('action') || window.location.href, window.location.href);
    } catch (_) {
      return;
    }

    const method = String(form.getAttribute('method') || 'get').toLowerCase();
    const actionPath = action.pathname.replace(/\/+$/, '') || '/';

    if (
      (
        method === 'post' &&
        actionPath === `${normalizedPublicSourceBase}/buka` &&
        form.querySelector('[name="public_ref"]')
      ) ||
      (
        // Kompatibilitas dengan halaman lama yang mungkin masih berada di cache.
        method === 'get' &&
        actionPath === normalizedPublicSourceBase &&
        form.querySelector('[name="ref"]')
      )
    ) {
      sendPublicSourceEvent('public_source_lookup');
      return;
    }

    if (
      method === 'post' &&
      actionPath === `${normalizedPublicSourceBase}/terbitkan` &&
      form.querySelector('[name="registration_id"]')
    ) {
      sendPublicSourceEvent('public_source_issue_start', {
        issue_origin: 'public_source_form'
      });
    }
  });

  window.addEventListener('sb:public-source:issue-start', () => {
    sendPublicSourceEvent('public_source_issue_start', {
      issue_origin: 'registration_success_auto'
    });
  });

  window.addEventListener('sb:public-source:issue-success', () => {
    sendPublicSourceEvent('public_source_issue_success', {
      issue_origin: 'registration_success_auto'
    });
  });

  const copyTextLocally = async (value) => {
    const text = String(value || '').trim();
    if (!text) throw new Error('empty');

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw new Error('copy_failed');
  };

  document.addEventListener('click', async (event) => {
    const button = event.target.closest?.('[data-public-source-copy]');
    if (!button) return;

    // Prioritaskan identifier yang terlihat di halaman.
    // <meta itemprop="identifier"> di <head> tidak memiliki textContent,
    // sehingga selector lama dapat membuat proses copy berhenti dan
    // clipboard tetap berisi nilai lama.
    const identifier =
      document.querySelector('.public-ref-heading [itemprop="identifier"]') ||
      document.querySelector('article [itemprop="identifier"]') ||
      document.querySelector('meta[itemprop="identifier"]');

    const publicRef = String(
      identifier?.textContent ||
      identifier?.getAttribute?.('content') ||
      ''
    ).trim();

    if (!/^KP-PUB-[A-F0-9]{12}$/i.test(publicRef)) {
      const status = document.getElementById('public-source-copy-status');
      if (status) status.textContent = 'Kode publik tidak ditemukan. Muat ulang halaman lalu coba lagi.';
      return;
    }

    const status = document.getElementById('public-source-copy-status');
    const originalText = button.textContent;

    try {
      await copyTextLocally(publicRef);

      if (status) status.textContent = 'Kode referensi publik berhasil disalin.';
      button.textContent = 'Tersalin ✓';

      sendPublicSourceEvent('public_source_copy', {
        copy_target: 'public_ref',
        copy_location: button.dataset.copyLocation || 'unknown'
      });

      window.setTimeout(() => {
        button.textContent = originalText;
      }, 2500);
    } catch (_) {
      if (status) status.textContent = 'Kode belum dapat disalin. Silakan salin secara manual.';
    }
  });

  window.addEventListener('sb:public-source:copy', () => {
    sendPublicSourceEvent('public_source_copy', {
      copy_target: 'public_ref'
    });
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;

    const rawHref = link.getAttribute('href') || '';
    if (!rawHref || rawHref.startsWith('javascript:')) return;

    let target = null;
    if (rawHref.startsWith('#')) {
      target = { ...currentSafe, pathname: currentSafe.pathname, protocol: currentSafe.protocol };
    } else if (rawHref.startsWith('mailto:')) {
      target = { origin: '', hostname: '', pathname: '', href: '', protocol: 'mailto:' };
    } else if (rawHref.startsWith('tel:')) {
      target = { origin: '', hostname: '', pathname: '', href: '', protocol: 'tel:' };
    } else {
      target = safeUrl(link.href || rawHref);
    }

    const linkType = classifyLink(link, target);
    const targetPath = sanitizeAnalyticsPath(target?.pathname || '');
    const targetDomain = target?.hostname || '';

    sendGaEvent('site_link_click', {
      link_type: linkType,
      target_domain: targetDomain,
      target_path: targetPath
    });

    if (linkType === 'internal') {
      sendGaEvent('internal_navigation', {
        target_path: targetPath
      });
    } else if (linkType === 'external') {
      sendGaEvent('outbound_click', {
        target_domain: targetDomain,
        target_path: targetPath
      });
    } else if (linkType === 'download') {
      sendGaEvent('file_download', {
        file_extension: extensionFromPath(targetPath),
        target_domain: targetDomain,
        target_path: targetPath
      });
    } else if (linkType === 'whatsapp') {
      sendGaEvent('whatsapp_click', {
        target_domain: targetDomain
      });
    } else if (linkType === 'email') {
      sendGaEvent('email_click');
    } else if (linkType === 'phone') {
      sendGaEvent('phone_click');
    } else if (linkType === 'anchor') {
      sendGaEvent('anchor_click', {
        target_path: currentAnalyticsPath
      });
    }

    trackKnownProgramCtas(link, target);
  }, { passive: true });

  /* =========================================================
     Cloudflare Worker + D1 visitor presence
     Page/referrer are sanitized to origin + pathname only.
     ========================================================= */
  const sendHeartbeat = async () => {
    if (document.visibilityState !== 'visible') return;
    const visitorId = localStorage.getItem(STORAGE_KEY);
    if (!visitorId || !visitorId.startsWith('v_')) return;

    try {
      const response = await fetch(HEARTBEAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id: visitorId,
          page: currentAnalyticsHref
        }),
        keepalive: true
      });
      if (!response.ok) throw new Error(`Heartbeat API HTTP ${response.status}`);
    } catch (error) {
      console.debug('Realtime heartbeat unavailable.', error);
    }
  };

  const sendLeave = () => {
    const visitorId = localStorage.getItem(STORAGE_KEY);
    if (!visitorId || !visitorId.startsWith('v_')) return;
    const payload = JSON.stringify({ visitor_id: visitorId });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'text/plain;charset=UTF-8' });
        navigator.sendBeacon(LEAVE_API, blob);
        return;
      }
      fetch(LEAVE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: payload,
        keepalive: true
      }).catch(() => {});
    } catch (error) {
      console.debug('Realtime leave unavailable.', error);
    }
  };

  const registerVisitor = async () => {
    try {
      const savedVisitorId = localStorage.getItem(STORAGE_KEY);
      const response = await fetch(VISITOR_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id: savedVisitorId || null,
          page: currentAnalyticsHref,
          referrer: referrerAnalyticsHref || 'direct'
        }),
        keepalive: true
      });
      if (!response.ok) throw new Error(`Visitor API HTTP ${response.status}`);

      const data = await response.json();
      if (
        data &&
        data.ok === true &&
        typeof data.visitor_id === 'string' &&
        data.visitor_id.startsWith('v_')
      ) {
        localStorage.setItem(STORAGE_KEY, data.visitor_id);
        await sendHeartbeat();
      }
    } catch (error) {
      console.debug('Visitor analytics unavailable.', error);
    }
  };

  registerVisitor();
  setTimeout(sendHeartbeat, HEARTBEAT_RETRY_MS);
  setInterval(sendHeartbeat, HEARTBEAT_MS);
  window.addEventListener('pageshow', sendHeartbeat);
  window.addEventListener('focus', sendHeartbeat);
  window.addEventListener('pagehide', sendLeave);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') sendHeartbeat();
    else sendLeave();
  });
})();
