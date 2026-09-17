# Manasik Digital V2.0.1 — Hotfix

- Memperbaiki menu **Manasik Saya** pada Dashboard Jemaah yang dapat tertahan oleh handler navigasi prototype.
- Link halaman nyata sekarang selalu dilepas ke navigasi browser normal sebelum logika hash prototype dijalankan.
- Link Manasik di Dashboard Jemaah diubah menjadi path absolut di bawah `/program/umroh-semi-private-bengkulu/manasik/` agar lebih tahan terhadap perubahan URL (`/index.html` maupun trailing slash).
- Tidak mengubah design system, layout, API, database, atau modul Ketahanan Pangan.
