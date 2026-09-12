/* =========================================================
   Global Visitor Analytics — Cloudflare Worker + D1 + GA4
   V6.8.7 Global Folder Coverage + GA4 Registration, Status & Login Events
   ========================================================= */
(() => {
  if (window.__SB_GLOBAL_VISITOR_ANALYTICS__) return;
  window.__SB_GLOBAL_VISITOR_ANALYTICS__ = true;

  const path = window.location.pathname || '/';
  if (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    path === '/stats.html' ||
    path === '/verify/publisher.html' ||
    path.startsWith('/program/ketahanan-pangan/admin/')
  ) return;

  const GA_MEASUREMENT_ID = 'G-W0S2WQ2P3T';
  if (!window.__SB_GA4_LOADED__) {
    window.__SB_GA4_LOADED__ = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname + window.location.search,
      page_title: document.title
    });
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(gaScript);
  }

  const API_BASE = 'https://srilexbuditra-visitors-api.srilexbuditra.workers.dev';
  const VISITOR_API = `${API_BASE}/visitor`;
  const HEARTBEAT_API = `${API_BASE}/heartbeat`;
  const LEAVE_API = `${API_BASE}/leave`;
  const STORAGE_KEY = 'sb_visitor_id';
  const HEARTBEAT_MS = 60 * 1000;
  const HEARTBEAT_RETRY_MS = 5 * 1000;

  const sendHeartbeat = async () => {
    if (document.visibilityState !== 'visible') return;
    const visitorId = localStorage.getItem(STORAGE_KEY);
    if (!visitorId || !visitorId.startsWith('v_')) return;
    try {
      const response = await fetch(HEARTBEAT_API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitor_id: visitorId, page: window.location.href }), keepalive: true
      });
      if (!response.ok) throw new Error(`Heartbeat API HTTP ${response.status}`);
    } catch (error) { console.debug('Realtime heartbeat unavailable.', error); }
  };

  const sendLeave = () => {
    const visitorId = localStorage.getItem(STORAGE_KEY);
    if (!visitorId || !visitorId.startsWith('v_')) return;
    const payload = JSON.stringify({ visitor_id: visitorId });
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'text/plain;charset=UTF-8' });
        navigator.sendBeacon(LEAVE_API, blob); return;
      }
      fetch(LEAVE_API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: payload, keepalive: true }).catch(() => {});
    } catch (error) { console.debug('Realtime leave unavailable.', error); }
  };

  const registerVisitor = async () => {
    try {
      const savedVisitorId = localStorage.getItem(STORAGE_KEY);
      const response = await fetch(VISITOR_API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitor_id: savedVisitorId || null, page: window.location.href, referrer: document.referrer || 'direct' }), keepalive: true
      });
      if (!response.ok) throw new Error(`Visitor API HTTP ${response.status}`);
      const data = await response.json();
      if (data && data.ok === true && typeof data.visitor_id === 'string' && data.visitor_id.startsWith('v_')) {
        localStorage.setItem(STORAGE_KEY, data.visitor_id); await sendHeartbeat();
      }
    } catch (error) { console.debug('Visitor analytics unavailable.', error); }
  };


  /* =========================================================
     GA4 — Program Ketahanan Pangan: Registration CTA
     Tracks intent without changing navigation or visual behavior.
     ========================================================= */
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;

    const href = link.getAttribute('href') || '';

    if (
      href === 'https://s.id/daftar_tani' ||
      href.startsWith('https://s.id/daftar_tani?') ||
      href.startsWith('https://s.id/daftar_tani#')
    ) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'registration_start', {
          event_category: 'ketahanan_pangan',
          event_label: 'Daftar Peserta',
          transport_type: 'beacon'
        });
      }
      return;
    }

    let statusCheckTarget = false;

    try {
      const targetUrl = new URL(link.href, window.location.href);
      const targetPath = targetUrl.pathname.replace(/\/+$/, '') || '/';

      statusCheckTarget =
        targetUrl.hostname === 's.id' &&
        targetPath === '/validasi_tani';

      if (
        targetUrl.origin === window.location.origin &&
        targetPath === '/program/ketahanan-pangan/verifikasi'
      ) {
        statusCheckTarget = true;
      }
    } catch (_) {
      statusCheckTarget =
        href === 'https://s.id/validasi_tani' ||
        href.startsWith('https://s.id/validasi_tani?') ||
        href.startsWith('https://s.id/validasi_tani#') ||
        href === '/program/ketahanan-pangan/verifikasi/' ||
        href.startsWith('/program/ketahanan-pangan/verifikasi/?') ||
        href.startsWith('/program/ketahanan-pangan/verifikasi/#');
    }

    if (statusCheckTarget) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'status_check_start', {
          event_category: 'ketahanan_pangan',
          event_label: 'Cek Status Pendaftaran',
          transport_type: 'beacon'
        });
      }
      return;
    }

    let loginTarget = false;

    try {
      const targetUrl = new URL(link.href, window.location.href);
      const targetPath = targetUrl.pathname.replace(/\/+$/, '') || '/';

      loginTarget =
        targetUrl.hostname === 's.id' &&
        targetPath === '/akun_tani';

      if (
        targetUrl.origin === window.location.origin &&
        (
          targetPath === '/program/ketahanan-pangan/peserta' ||
          targetPath === '/program/ketahanan-pangan/login' ||
          targetPath === '/program/ketahanan-pangan/akun'
        )
      ) {
        loginTarget = true;
      }
    } catch (_) {
      loginTarget =
        href === 'https://s.id/akun_tani' ||
        href.startsWith('https://s.id/akun_tani?') ||
        href.startsWith('https://s.id/akun_tani#') ||
        href === '/program/ketahanan-pangan/peserta/' ||
        href.startsWith('/program/ketahanan-pangan/peserta/?') ||
        href.startsWith('/program/ketahanan-pangan/peserta/#') ||
        href === '/program/ketahanan-pangan/login/' ||
        href.startsWith('/program/ketahanan-pangan/login/?') ||
        href.startsWith('/program/ketahanan-pangan/login/#') ||
        href === '/program/ketahanan-pangan/akun/' ||
        href.startsWith('/program/ketahanan-pangan/akun/?') ||
        href.startsWith('/program/ketahanan-pangan/akun/#');
    }

    if (loginTarget) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'login_start', {
          event_category: 'ketahanan_pangan',
          event_label: 'Login / Aktivasi Akun',
          transport_type: 'beacon'
        });
      }
    }
  });

  registerVisitor();
  setTimeout(sendHeartbeat, HEARTBEAT_RETRY_MS);
  setInterval(sendHeartbeat, HEARTBEAT_MS);
  window.addEventListener('pageshow', sendHeartbeat);
  window.addEventListener('focus', sendHeartbeat);
  window.addEventListener('pagehide', sendLeave);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') sendHeartbeat(); else sendLeave();
  });
})();
