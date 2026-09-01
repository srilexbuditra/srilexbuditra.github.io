# V27 — Database Verifikasi Dokumen

QR pada Project Cost Estimate mengarah ke `/verify/?id=DOCUMENT_ID`. Halaman verifikasi membaca `verify/data/documents.json`.

## Penting untuk GitHub Pages

Website statis tidak dapat menulis database JSON dari browser pengunjung. Setiap dokumen yang benar-benar diterbitkan perlu ditambahkan ke `verify/data/documents.json` melalui proses penerbitan/administrasi Anda.

Contoh record tersedia sebagai `SB-EST-DEMO-001` dan harus diganti/dihapus sebelum produksi.

QR tidak menyimpan data pribadi; QR hanya membawa URL verifikasi + Document ID.
