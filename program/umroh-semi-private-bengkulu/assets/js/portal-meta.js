(() => {
  'use strict';

  if (window.__UMROH_PORTAL_META_STEP71__) return;
  window.__UMROH_PORTAL_META_STEP71__ = true;

  const API_BASE = 'https://umroh-api.srilexbuditra.work';
  const PAGE_KEY = 'portal:umroh';
  const PAGE_TYPE = 'portal';
  const FALLBACK = Object.freeze({
    title: 'Umroh Semi Private Bengkulu | Digital Platform Jemaah & Manasik',
    description: 'Digital Platform Umroh Semi Private Bengkulu untuk manasik, persiapan jemaah, agenda perjalanan, informasi, dokumen, dan pendampingan dalam satu platform.',
    canonical: 'https://srilexbuditra.work/program/umroh-semi-private-bengkulu/',
    robots: 'index,follow',
    themeColor: '#0b2830',
    locale: 'id_ID',
    publisher: 'Umroh Semi Private Bengkulu',
    author: 'Srilex Buditra',
    image: 'https://media-umroh.srilexbuditra.work/portal/umroh/banner-9b900109-a166-424a-878c-f8ebe37f0e17.avif',
    imageAlt: 'Digital Platform Umroh Semi Private Bengkulu',
    imageCaption: 'Digital Platform Jemaah & Manasik — Umroh Semi Private Bengkulu',
    logo: 'https://srilexbuditra.work/program/umroh-semi-private-bengkulu/branding/logo-umroh-semi-private-bengkulu.avif'
  });

  const mediaWrap = document.querySelector('[data-portal-media]');
  const mediaImage = document.querySelector('[data-portal-media-image]');
  const mediaCaption = document.querySelector('[data-portal-media-caption]');
  let meta = null;
  let analyticsBound = false;

  const clean = (value, fallback = '') => String(value ?? '').trim() || fallback;

  const ensureMeta = (selector, attrs) => {
    let node = document.head.querySelector(selector);
    if (!node) {
      node = document.createElement('meta');
      document.head.appendChild(node);
    }
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };

  const setNamedMeta = (name, content) => {
    if (!content) return;
    ensureMeta(`meta[name="${name}"]`, { name, content });
  };

  const setPropertyMeta = (property, content) => {
    if (!content) return;
    ensureMeta(`meta[property="${property}"]`, { property, content });
  };

  const setCanonical = (href) => {
    if (!href) return;
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = href;
  };

  const safeSchema = (value) => {
    if (!value) return null;
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    } catch (_) {
      return null;
    }
  };

  const updateWebPageSchema = (resolved) => {
    const script = document.getElementById('umroh-portal-webpage-schema');
    if (!script) return;

    const override = safeSchema(meta?.schema_json);
    if (override) {
      script.textContent = JSON.stringify(override);
      return;
    }

    const schemaType = clean(meta?.schema_type, 'WebPage');
    const schema = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      '@id': `${resolved.canonical}#webpage`,
      url: resolved.canonical,
      name: resolved.title,
      description: resolved.description,
      inLanguage: clean(meta?.locale, 'id-ID').replace('_', '-'),
      isPartOf: { '@id': 'https://srilexbuditra.work/#website' },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: resolved.image,
        caption: resolved.imageCaption
      },
      image: resolved.image,
      author: {
        '@type': 'Person',
        name: clean(meta?.author_name, FALLBACK.author),
        url: 'https://srilexbuditra.work/'
      },
      publisher: { '@id': 'https://srilexbuditra.work/program/umroh-semi-private-bengkulu/#organization' }
    };
    script.textContent = JSON.stringify(schema);
  };

  const applyRuntimeMeta = () => {
    if (!meta) return;

    const banner = clean(meta.banner_url, FALLBACK.image);
    const ogImage = clean(meta.og_image_url, banner);
    const twitterImage = clean(meta.twitter_image_url, ogImage);
    const imageAlt = clean(meta.image_alt, FALLBACK.imageAlt);
    const resolved = {
      title: clean(meta.seo_title, FALLBACK.title),
      description: clean(meta.meta_description, FALLBACK.description),
      canonical: clean(meta.canonical_url, FALLBACK.canonical),
      robots: clean(meta.robots, FALLBACK.robots),
      themeColor: clean(meta.theme_color, FALLBACK.themeColor),
      image: ogImage,
      imageAlt,
      imageCaption: clean(meta.image_caption, FALLBACK.imageCaption)
    };

    document.title = resolved.title;
    setNamedMeta('description', resolved.description);
    setNamedMeta('robots', resolved.robots);
    setNamedMeta('theme-color', resolved.themeColor);
    setCanonical(resolved.canonical);

    setPropertyMeta('og:locale', clean(meta.locale, FALLBACK.locale));
    setPropertyMeta('og:type', clean(meta.og_type, 'website'));
    setPropertyMeta('og:title', clean(meta.og_title, resolved.title));
    setPropertyMeta('og:description', clean(meta.og_description, resolved.description));
    setPropertyMeta('og:url', resolved.canonical);
    setPropertyMeta('og:site_name', FALLBACK.publisher);
    setPropertyMeta('og:image', ogImage);
    setPropertyMeta('og:image:secure_url', ogImage);
    setPropertyMeta('og:image:alt', imageAlt);

    setNamedMeta('twitter:card', 'summary_large_image');
    setNamedMeta('twitter:title', clean(meta.twitter_title, clean(meta.og_title, resolved.title)));
    setNamedMeta('twitter:description', clean(meta.twitter_description, clean(meta.og_description, resolved.description)));
    setNamedMeta('twitter:image', twitterImage);
    setNamedMeta('twitter:image:alt', imageAlt);

    updateWebPageSchema({ ...resolved, image: ogImage });
  };

  const renderMedia = () => {
    const url = clean(meta?.banner_url, mediaImage?.getAttribute('src') || FALLBACK.image);
    if (!mediaWrap || !mediaImage || !url) return;
    if (mediaImage.src !== url) mediaImage.src = url;
    mediaImage.alt = clean(meta?.image_alt, FALLBACK.imageAlt);
    const caption = clean(meta?.image_caption, FALLBACK.imageCaption);
    if (mediaCaption) {
      mediaCaption.textContent = caption;
      mediaCaption.hidden = !caption;
    }
    mediaWrap.hidden = false;
  };

  const sendGa = (name, params = {}) => {
    if (!meta?.analytics_enabled || typeof window.gtag !== 'function') return false;
    window.gtag('event', name, {
      page_key: PAGE_KEY,
      page_type: PAGE_TYPE,
      page_path: window.location.pathname,
      ...params
    });
    return true;
  };

  const bindAnalytics = () => {
    if (analyticsBound || !meta?.analytics_enabled) return;
    analyticsBound = true;

    let attempts = 0;
    const pageView = () => {
      if (sendGa('umroh_page_view')) return;
      if (++attempts < 20) setTimeout(pageView, 500);
    };
    pageView();

    if (meta.analytics_cta_enabled) {
      document.addEventListener('click', (event) => {
        const link = event.target.closest?.('.portal-shell a[href]');
        if (!link) return;

        let target;
        try { target = new URL(link.href, window.location.href); }
        catch (_) { return; }

        const internal = target.origin === window.location.origin;
        const label = String(link.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
        const common = {
          target_type: internal ? 'internal' : 'outbound',
          target_path: internal ? target.pathname : '',
          target_host: internal ? '' : target.hostname,
          link_label: label
        };

        sendGa('umroh_cta_click', common);
        sendGa(internal ? 'umroh_navigation' : 'umroh_outbound_click', common);
      }, { passive: true });
    }

    if (meta.analytics_scroll_enabled) {
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
          [25, 50, 75, 90].forEach((mark) => {
            if (pct >= mark && !sent.has(mark)) {
              sent.add(mark);
              sendGa('umroh_scroll_depth', { percent_scrolled: mark });
            }
          });
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  };

  const load = async () => {
    try {
      const response = await fetch(`${API_BASE}/page-meta?page_key=${encodeURIComponent(PAGE_KEY)}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok || !data.page_meta) return;
      meta = data.page_meta;
      applyRuntimeMeta();
      renderMedia();
      bindAnalytics();
    } catch (_) {
      // Static HTML is the crawler-safe and outage-safe fallback.
    }
  };

  load();
})();
