'use strict';

// DPN-GATE3C02D-AURORA-20261016:START
(() => {
  const toggle = document.querySelector('.menu-toggle');
  const dialog = document.getElementById('aurora-menu');
  const backdrop = document.querySelector('.aurora-backdrop');
  const close = dialog?.querySelector('.aurora-close');
  const media = window.matchMedia('(max-width: 860px)');
  if (!toggle || !dialog || !backdrop || !close) return;

  let isOpen = false;
  let lastFocus = null;

  const focusable = () => Array.from(dialog.querySelectorAll('a[href], button:not([disabled])'));
  const setOpen = (open, restoreFocus = true) => {
    if (open && !media.matches) return;
    if (isOpen === open) return;
    isOpen = open;
    if (open) lastFocus = document.activeElement;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    toggle.classList.toggle('is-open', open);
    dialog.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-open', open);
    dialog.setAttribute('aria-hidden', String(!open));
    if (open) dialog.removeAttribute('inert');
    else dialog.setAttribute('inert', '');
    document.body.classList.toggle('aurora-lock', open);
    if (open) close.focus({preventScroll:true});
    else if (restoreFocus && lastFocus?.isConnected) lastFocus.focus({preventScroll:true});
  };

  toggle.addEventListener('click', () => setOpen(!isOpen));
  close.addEventListener('click', () => setOpen(false));
  backdrop.addEventListener('click', () => setOpen(false));
  dialog.addEventListener('click', event => {
    if (event.target.closest('a[href]')) setOpen(false, false);
  });
  document.addEventListener('keydown', event => {
    if (!isOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); return; }
    if (event.key !== 'Tab') return;
    const elements = focusable();
    if (!elements.length) { event.preventDefault(); return; }
    const first = elements[0], last = elements[elements.length-1];
    if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first.focus();}
  });
  media.addEventListener('change', event => { if (!event.matches) setOpen(false); });
})();
// DPN-GATE3C02D-AURORA-20261016:END