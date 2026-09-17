# CHANGELOG — V3.3.1 Minor Polish

## Fixed
- Aktivasi staf sekarang juga mengisi `last_login_at` karena aktivasi berhasil langsung membuat session dan masuk ke Dashboard.
- Teks audit `account_activated` dibuat lebih natural.
- Untuk aktivasi mandiri, tampilan menjadi contoh:
  `Admin Simulasi mengaktifkan akun`
  bukan `Admin Simulasi account_activated · Admin Simulasi`.
- Asset JavaScript Manajemen Admin diberi version query `v=3.3.1` untuk mengurangi risiko browser memakai file cache lama.

## Security
Tidak ada perubahan policy password, cookie, role, D1 binding, secret, atau session security.

## Version
Worker API: `3.3.1`
