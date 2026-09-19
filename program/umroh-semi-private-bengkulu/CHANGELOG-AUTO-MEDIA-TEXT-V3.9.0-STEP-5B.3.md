# V3.9.0 Step 5B.3 — Automatic Alt Text & Caption

## Added
- Alt Text dan Caption otomatis pada Admin Manasik berdasarkan material_key/judul materi.
- Alt Text dan Caption otomatis pada Admin Pengaturan untuk Portal Umroh.
- Nilai otomatis langsung tersedia saat editor dibuka dan sebelum upload media.
- Perubahan judul/SEO title ikut menyegarkan nilai otomatis selama field belum dikustomisasi manual.

## Compatibility
- Nilai custom tetap dipertahankan jika tidak dikenali sebagai nilai otomatis/default.
- Nilai lama yang salah lintas materi (contoh caption Talbiyah pada Ihram & Miqat) otomatis dinormalisasi ketika editor dibuka.
- Tidak mengubah Worker, D1 schema, R2 binding, progress Jemaah, SEO statis, atau Analytics.
