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
    toast.innerHTML = `<strong>${label}</strong>Modul ini sengaja belum diaktifkan pada Prototype V1. Fokus tahap ini adalah mengunci visual, navigasi, dan responsif.`;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), 3200);
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
    navItems.forEach(x => x.classList.remove('is-active'));
    item.classList.add('is-active');
    const href = item.getAttribute('href') || '';
    if (href.startsWith('#') && !document.querySelector(href)) {
      e.preventDefault();
      showPrototypeNotice(item.querySelector('.nav-label')?.textContent?.trim() || 'Modul');
    }
    if (innerWidth <= 900) closeMobile();
  }));

  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('is-active'));
    tab.classList.add('is-active');
    if (!tab.dataset.live) showPrototypeNotice(`Filter: ${tab.textContent.trim()}`);
  }));

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || link.hasAttribute('data-nav-item')) return;
    const href = link.getAttribute('href');
    if (href && href !== '#' && !document.querySelector(href)) {
      e.preventDefault();
      showPrototypeNotice(link.textContent.trim() || 'Fitur');
    }
  });
})();
