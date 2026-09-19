# Deploy — V3.9.0 Step 7.4 Manasik Structured Data Image Sync

Tidak ada migration D1, perubahan Worker, upload/hapus R2, atau perubahan visual pada Step 7.4.

## Hasil audit sebelum patch

- Structured Data full pass: **1/11**
- Article image consistency: **1/11**
- Seluruh pemeriksaan selain `Article.image` sudah PASS pada 11 materi.
- Talbiyah sudah benar dan tidak menghasilkan diff.

## File yang berubah

Secara Git, Step 7.4 mengubah:

- 10 `index.html` materi Manasik — hanya properti `image` di JSON-LD `Article`.
- changelog Step 7.4.
- dokumen deploy Step 7.4.

Target GitHub Desktop: **12 changed files**.

## Deploy

1. Timpa folder `program` dari patch ke root repository.
2. Pilih **Replace the files in the destination** untuk file yang sama.
3. Pastikan GitHub Desktop hanya menampilkan 10 halaman materi dan dua file dokumentasi Step 7.4.
4. Commit ke branch `main`.
5. Push origin.
6. Tunggu Public Repository Audit, Repository Quality Check, Link/Anchor/Sitemap Integrity Check, dan Pages deployment hijau.
7. Jalankan ulang audit Step 7.4A di production.

## Commit summary yang disarankan

`V3.9.0 Step 7.4 - Manasik Structured Data Image Sync`

## Target production

- `STEP 7.4A STRUCTURED DATA: 11/11 FULL PASS`
- `ARTICLE IMAGE CONSISTENCY: 11/11 PASS`

## Catatan

Peringatan font CSP dan respons `403` progress Jemaah pada mode lokal/tanpa sesi bukan bagian dari scope Step 7.4. Jangan ubah CSP, autentikasi, atau progress hanya untuk menyelesaikan schema image sync ini.
