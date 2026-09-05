# V7 — Upload KTP & Kartu Keluarga

Frontend registrasi sekarang mendukung lampiran KTP dan KK dengan preview, validasi tipe, batas 5 MB per file, tombol hapus, dan indikator progres upload.

## Format yang diizinkan
- JPEG/JPG
- PNG
- WEBP
- AVIF
- PDF

## Penting sebelum produksi
Form mengirim data menggunakan `multipart/form-data` ke `/api/pupuk-registration`. Worker lama yang hanya menerima JSON **tidak cukup**. Endpoint produksi harus:
1. menerima multipart/form-data;
2. memvalidasi ulang MIME, ukuran, dan isi berkas di server;
3. menyimpan KTP/KK di bucket privat (misalnya Cloudflare R2), bukan GitHub/Public Pages;
4. menyimpan hanya key/reference dokumen di D1;
5. membatasi akses dokumen dengan autentikasi/otorisasi;
6. menetapkan masa retensi dan penghapusan dokumen;
7. tidak menulis NIK/KK atau isi dokumen ke log publik.

Jangan commit hasil upload pengguna ke repository.
