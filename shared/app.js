
(() => {
  const menu = document.querySelector('[data-menu]');
  if (menu) menu.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 820 && document.body.classList.contains('nav-open')) {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar && !sidebar.contains(e.target) && !menu?.contains(e.target)) {
        document.body.classList.remove('nav-open');
      }
    }
  });
})();
