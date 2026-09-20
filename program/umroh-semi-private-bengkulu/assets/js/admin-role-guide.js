(() => {
  'use strict';
  const root = document.querySelector('[data-admin-role-guide]');
  if (!root) return;
  const guides = {
    super_admin: { label: 'Super Admin', file: 'panduan-super-admin-v3.9.0.pdf', description: 'Panduan lengkap Ringkasan, Jemaah, Manasik, Agenda, Dokumen, Pengumuman, Manajemen Admin, dan Pengaturan.' },
    admin: { label: 'Admin', file: 'panduan-admin-v3.9.0.pdf', description: 'Panduan operasional pengelolaan Jemaah, verifikasi dokumen, Manasik, Agenda, Pengumuman, dan Pengaturan yang diizinkan.' },
    tour_leader: { label: 'Tour Leader', file: 'panduan-tour-leader-v3.9.0.pdf', description: 'Panduan koordinasi perjalanan, Agenda, Pengumuman, Manasik, dan pemantauan Jemaah sesuai kewenangan role.' },
    pendamping: { label: 'Pendamping', file: 'panduan-pendamping-v3.9.0.pdf', description: 'Panduan pemantauan dan pendampingan Jemaah, Agenda, Pengumuman, serta jalur eskalasi sesuai kewenangan role.' }
  };
  const apply = () => {
    const account = window.UMROH_ADMIN_ACCOUNT;
    if (!account?.role) return false;
    const cfg = guides[account.role];
    if (!cfg) { root.hidden = true; return true; }
    const href = `../dokumentasi/${cfg.file}`;
    const label = root.querySelector('[data-role-guide-label]');
    const desc = root.querySelector('[data-role-guide-description]');
    const open = root.querySelector('[data-role-guide-open]');
    const download = root.querySelector('[data-role-guide-download]');
    const frame = root.querySelector('[data-role-guide-frame]');
    if (label) label.textContent = cfg.label;
    if (desc) desc.textContent = cfg.description;
    if (open) open.href = href;
    if (download) { download.href = href; download.setAttribute('download', cfg.file); }
    if (frame) { frame.src = `${href}#view=FitH`; frame.title = `Panduan penggunaan Dashboard ${cfg.label}`; }
    return true;
  };
  if (apply()) return;
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (apply() || tries > 100) clearInterval(timer);
  }, 80);
})();
