(() => {
  const body = document.body;
  const collapse = document.querySelector('[data-sidebar-collapse]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const backdrop = document.querySelector('[data-sidebar-backdrop]');
  const navItems = [...document.querySelectorAll('[data-nav-item]')];
  const tabs = [...document.querySelectorAll('[data-context-tab]')];
  const prefKey = 'umroh-dashboard-sidebar';
  let toastTimer;

  const toast = document.createElement('div');
  toast.className = 'prototype-toast';
  toast.setAttribute('role','status');
  toast.setAttribute('aria-live','polite');
  document.body.appendChild(toast);

  const showPrototypeNotice = (label) => {
    toast.innerHTML = `<strong>${label}</strong>Modul ini sengaja belum diaktifkan pada Prototype dashboard. Modul operasional ini belum diaktifkan; fondasi visual sudah dikunci dan pengembangan fitur dilakukan bertahap.`;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 3200);
  };

  const setActiveNav = (item) => {
    navItems.forEach(x => {
      x.classList.toggle('is-active', x === item);
      if (x === item) x.setAttribute('aria-current','page');
      else x.removeAttribute('aria-current');
    });
  };

  try {
    if (localStorage.getItem(prefKey) === 'compact' && matchMedia('(min-width:901px)').matches) body.classList.add('sidebar-compact');
  } catch (_) {}

  collapse?.addEventListener('click', () => {
    body.classList.toggle('sidebar-compact');
    try { localStorage.setItem(prefKey, body.classList.contains('sidebar-compact') ? 'compact' : 'wide'); } catch (_) {}
  });

  const closeMobile = () => body.classList.remove('sidebar-open');
  mobileMenu?.addEventListener('click', () => body.classList.toggle('sidebar-open'));
  backdrop?.addEventListener('click', closeMobile);
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMobile(); });
  addEventListener('resize', () => { if (innerWidth > 900) closeMobile(); });

  navItems.forEach(item => item.addEventListener('click', (e) => {
    const href = item.getAttribute('href') || '';

    // Link halaman nyata (bukan hash prototype) harus selalu dibiarkan
    // berjalan sebagai navigasi browser biasa. Ini mencegah menu seperti
    // Manasik Saya tertahan oleh handler prototype dashboard.
    if (href && !href.startsWith('#')) {
      if (innerWidth <= 900) closeMobile();
      return;
    }

    const target = href.startsWith('#') && href.length > 1 ? document.querySelector(href) : null;
    const isHome = href === '#ringkasan' || href === '#beranda';

    if (!target || !isHome) {
      e.preventDefault();
      showPrototypeNotice(item.querySelector('.nav-label')?.textContent?.trim() || 'Modul');
    } else {
      setActiveNav(item);
    }
    if (innerWidth <= 900) closeMobile();
  }));

  const initialHash = location.hash;
  if (initialHash) {
    const initialItem = navItems.find(item => item.getAttribute('href') === initialHash);
    const target = document.querySelector(initialHash);
    const isHome = initialHash === '#ringkasan' || initialHash === '#beranda';
    if (initialItem && target && isHome) setActiveNav(initialItem);
    else if (history.replaceState) history.replaceState(null,'',location.pathname + location.search);
  }

  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('is-active'));
    tab.classList.add('is-active');
    if (!tab.dataset.live) showPrototypeNotice(`Filter: ${tab.textContent.trim()}`);
  }));

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || link.hasAttribute('data-nav-item')) return;
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) {
      e.preventDefault();
      showPrototypeNotice(link.textContent.trim() || 'Fitur');
    }
  });
})();
