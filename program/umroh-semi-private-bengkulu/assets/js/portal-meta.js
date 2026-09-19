(() => {
  'use strict';
  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const PAGE_KEY = 'portal:umroh';
  const mediaWrap = document.querySelector('[data-portal-media]');
  const mediaImage = document.querySelector('[data-portal-media-image]');
  const mediaCaption = document.querySelector('[data-portal-media-caption]');
  let meta = null;

  const sendGa = (name, params = {}) => {
    if (!meta?.analytics_enabled || typeof window.gtag !== 'function') return false;
    window.gtag('event', name, { page_key: PAGE_KEY, page_path: window.location.pathname, ...params });
    return true;
  };

  const renderMedia = () => {
    const url = String(meta?.banner_url || '').trim();
    if (!mediaWrap || !mediaImage || !url) return;
    mediaImage.src = url;
    mediaImage.alt = meta?.image_alt || 'Digital Platform Umroh Semi Private Bengkulu';
    const caption = String(meta?.image_caption || '').trim();
    if (mediaCaption) { mediaCaption.textContent = caption; mediaCaption.hidden = !caption; }
    mediaWrap.hidden = false;
  };

  const bindAnalytics = () => {
    let attempts = 0;
    const pageView = () => {
      if (sendGa('umroh_page_view', { page_type: 'portal' })) return;
      if (++attempts < 20) setTimeout(pageView, 500);
    };
    pageView();

    if (meta?.analytics_cta_enabled) {
      document.addEventListener('click', (event) => {
        const link = event.target.closest?.('.portal-shell a[href]');
        if (!link) return;
        let target;
        try { target = new URL(link.href, window.location.href); } catch (_) { return; }
        const internal = target.origin === window.location.origin;
        sendGa(internal ? 'umroh_navigation' : 'umroh_cta_click', {
          target_type: internal ? 'internal' : 'outbound',
          target_path: internal ? target.pathname : '',
          target_host: internal ? '' : target.hostname,
          link_label: String(link.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80)
        });
      });
    }

    if (meta?.analytics_scroll_enabled) {
      const sent = new Set();
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          const doc = document.documentElement;
          const max = Math.max(1, doc.scrollHeight - window.innerHeight);
          const pct = Math.min(100, Math.round((window.scrollY / max) * 100));
          [25,50,75,90].forEach((mark) => {
            if (pct >= mark && !sent.has(mark)) { sent.add(mark); sendGa('umroh_scroll_depth', { percent_scrolled: mark }); }
          });
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  };

  const load = async () => {
    try {
      const response = await fetch(`${API_BASE}/page-meta?page_key=${encodeURIComponent(PAGE_KEY)}`, { headers: { Accept: 'application/json' }, cache: 'no-store' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) return;
      meta = data.page_meta || null;
      renderMedia();
      bindAnalytics();
    } catch (_) {}
  };
  load();
})();
