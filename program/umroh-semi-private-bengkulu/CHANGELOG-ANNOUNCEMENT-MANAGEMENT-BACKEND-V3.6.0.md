# CHANGELOG — Announcement Management Backend V3.6.0

## Added
- Admin Pengumuman: buat, edit, kategori, prioritas, waktu publikasi, publish/unpublish.
- API resmi Jemaah untuk membaca Pengumuman dari D1.
- Status baca Pengumuman per akun di `umroh_announcement_reads`.
- Import idempotent status baca lokal V2.4 untuk empat pengumuman lama.
- Dashboard Jemaah membaca Pengumuman Terbaru dari backend.
- Audit log: `announcement_created`, `announcement_updated`, `announcement_published`, `announcement_unpublished`.

## Changed
- Pengumuman Jemaah tidak lagi menggunakan `announcement-data.js` sebagai sumber utama.
- Empat pengumuman simulasi lama dimigrasikan menjadi draft D1 agar dapat diedit sebelum dipublikasikan.

## Security
- Hanya akun Jemaah terautentikasi yang membaca feed resmi.
- Hanya role `super_admin`, `admin`, dan `tour_leader` yang dapat mengubah/publikasi.
- `pendamping` dapat melihat Admin Pengumuman tetapi bersifat read-only.
