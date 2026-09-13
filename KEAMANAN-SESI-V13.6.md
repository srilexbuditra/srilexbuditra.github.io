# Keamanan & Sesi Akun Peserta — V13.6.0

Tahap ini menambahkan pusat keamanan akun peserta tanpa membuka token sesi atau alamat IP lengkap.

## Fitur
- Daftar sesi/perangkat aktif.
- Penanda perangkat yang sedang digunakan.
- Waktu login, aktivitas terakhir, dan masa berlaku sesi.
- Label perangkat, browser, sistem operasi, dan negara secara umum.
- Keluar dari satu perangkat lain.
- Keluar dari semua perangkat lain sekaligus.
- Riwayat keamanan: login, logout, perubahan password, penguncian login, dan pencabutan sesi.
- Notifikasi server untuk login baru dan perubahan keamanan.
- Maksimal 5 sesi aktif per akun.

## Privasi
Token sesi, cookie autentikasi, password, dan alamat IP lengkap tidak pernah dikirim ke halaman peserta.

## Database
Worker membuat/menyesuaikan skema keamanan secara otomatis. Tidak perlu menjalankan SQL manual.

## Endpoint baru
- `GET /security/sessions`
- `POST /security/sessions/revoke`
- `POST /security/sessions/revoke-others`

## Catatan
Login V13.6 tidak lagi otomatis menghapus semua sesi lain. Peserta dapat mengelola perangkat aktif dari halaman Keamanan & Sesi. Perubahan password tetap mengakhiri sesi perangkat lain.
