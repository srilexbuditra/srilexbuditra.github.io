# CHANGELOG — Manasik Content Backend V3.8.0

## Added
- Tabel D1 `umroh_manasik_materials`.
- Seed 11 materi Manasik yang sudah digunakan platform.
- Admin → Manasik untuk mengelola:
  - judul;
  - ringkasan;
  - urutan;
  - isi materi berbasis blok aman;
  - status publikasi.
- API publik Manasik:
  - `GET /manasik/materials`
  - `GET /manasik/materials/:material_key`
- API Admin Manasik:
  - `GET /admin/manasik`
  - `PATCH /admin/manasik/:id`
- Audit log untuk update/publish/unpublish materi.

## Changed
- Daftar Manasik Jemaah membaca materi dipublikasikan dari D1.
- Halaman detail materi membaca konten, urutan, prev/next, judul dan ringkasan dari D1.
- Progress Manasik hanya menghitung materi yang sedang dipublikasikan.
- Status Persiapan Admin memakai jumlah materi Manasik yang dipublikasikan.
- Navigasi Admin Manasik sekarang membuka halaman pengelolaan resmi.
- Platform Admin/Jemaah/Worker disinkronkan ke **Platform V3.8.0**.

## Preserved
- `umroh_progress_items` tetap digunakan; progress akun lama tidak dihapus.
- 11 `material_key` lama dipertahankan, sehingga progress Jemaah yang sudah ada tetap cocok.
- Halaman statis lama tetap menjadi fallback bila API sementara tidak tersedia.
