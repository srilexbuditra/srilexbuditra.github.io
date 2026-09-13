/* =========================================================
   Global Visitor Analytics — Cloudflare Worker + D1 + GA4
   V6.9.1 Centralized Site-Wide + Privacy-Safe GA4 Link Events
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
     GA4 loader
     - Query string/hash are deliberately excluded from page_location/page_path.
     - No form values, NIK, KK, phone, email, password, token, or registration ID
       are added as event parameters here.
     ========================================================= */
  if (!window.__SB_GA4_LOADED__) {
    window.__SB_GA4_LOADED__ = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: currentSafe.pathname,
      page_location: currentSafe.href,
      page_referrer: referrerSafe ? referrerSafe.href : '',
      page_title: document.title
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
      source_path: currentSafe.pathname,
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
    const targetPath = target?.pathname || '';
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
        target_path: currentSafe.pathname
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
          page: currentSafe.href
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
          page: currentSafe.href,
          referrer: referrerSafe ? referrerSafe.href : 'direct'
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
