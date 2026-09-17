# Dokumen Saya V2.3 — 2026-09-17

## Added
- Halaman `/jamaah/dokumen/` untuk memeriksa kesiapan dokumen jemaah.
- 4 dokumen utama dari materi “Persiapan Sebelum Berangkat”: paspor/dokumen perjalanan, tiket/itinerary, identitas jemaah, dan dokumen kesehatan.
- Status lokal `Sudah disiapkan` dan `Menunggu` dengan key `umroh-documents-status-v1`.
- Ringkasan status Dokumen pada Dashboard Jemaah.
- Catatan keamanan yang menegaskan V2.3 belum menerima upload atau menyimpan berkas pribadi di halaman statis.

## Changed
- Menu dan kartu `Dokumen Saya` pada Dashboard Jemaah sekarang membuka modul Dokumen nyata.
- Catatan prototype Dashboard diperbarui untuk mencerminkan Manasik, Checklist, Agenda, dan status Dokumen yang sudah aktif secara lokal.

## Security
- Tidak ada upload berkas, nomor dokumen, NIK, data kesehatan, atau data pribadi yang dikirim ke repository/static hosting.
- Verifikasi dokumen resmi tetap menunggu autentikasi, backend, dan penyimpanan aman.
