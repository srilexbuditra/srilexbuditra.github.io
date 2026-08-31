# Audit Menengah V11.6

## Scope
- Menghapus asset Website Sekolah duplikat.
- Menghapus PNG preview V2 berukuran 1,78 MB.
- Memastikan referensi HTML menggunakan asset canonical utama.
- Memeriksa link `href`/`src` internal pada seluruh halaman HTML.

## Hasil
- `portfolio/website-sekolah/v2/assets/school-preview.png`: dihapus (1.866.217 bytes).
- `portfolio/website-sekolah/v2/assets/school-preview.avif`: dihapus sebagai duplikat byte-identik.
- Asset utama dipertahankan: `portfolio/website-sekolah/assets/school-preview.avif`.
- Pemeriksaan referensi internal HTML: tidak ditemukan target file lokal yang hilang.
- Referensi V2 ke preview diarahkan ke asset utama `/portfolio/website-sekolah/assets/school-preview.avif`.

## Catatan
PDF dokumentasi besar tidak dihapus karena bukan asset yang direferensikan sebagai gambar halaman dan tetap berguna sebagai dokumentasi proyek.
