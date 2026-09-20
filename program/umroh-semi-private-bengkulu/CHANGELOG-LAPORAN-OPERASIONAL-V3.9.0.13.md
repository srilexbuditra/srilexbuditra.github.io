# Laporan Operasional V1 — V3.9.0.13

## Added
- Halaman `/admin/laporan/` untuk role `super_admin` dan `admin`.
- Rekap Jemaah, kesiapan, Manasik, Agenda, Dokumen, dan Pengumuman dari endpoint backend/D1 yang sudah ada.
- Rentang aktivitas Hari Ini / 7 Hari / 30 Hari.
- Export CSV UTF-8.
- Cetak / Simpan PDF melalui dialog print browser.
- Rekap kesiapan Jemaah dan daftar Jemaah tanpa mengekspos password, token, atau isi dokumen privat.

## Changed
- Menu Laporan pada dashboard Admin kini mengarah ke halaman nyata, bukan placeholder Prototype.
- Global Search mengenali kata kunci `laporan`, `report`, `rekap`, dan `export` untuk role yang berwenang.

## Security
- Tidak ada perubahan Worker, D1 schema, R2, autentikasi, atau session.
- Halaman dibatasi frontend dengan `data-required-roles="super_admin admin"`; data tetap dilindungi oleh endpoint backend yang sudah menerapkan role/session gate.
