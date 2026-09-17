# CHANGELOG — Staff Activation + RBAC V3.3

## Added
- Halaman `/admin/aktivasi/` untuk aktivasi akun pengelola.
- Aktivasi menggunakan username + kode aktivasi + password baru.
- Role-Based Access Control (RBAC) untuk menu Dashboard Admin.
- Role yang dapat masuk Dashboard Admin:
  - `super_admin`
  - `admin`
  - `tour_leader`
  - `pendamping`
- Audit `account_activated` untuk aktivasi akun staf.

## Changed
- Worker Auth API version menjadi `3.3`.
- Akun `pending_activation` tidak lagi memiliki tombol **Aktifkan** manual.
- Akun baru hanya menjadi `active` setelah pemilik akun berhasil menjalankan aktivasi.
- Login Admin menampilkan tautan ke halaman Aktivasi Akun.

## RBAC UI
- Super Admin: seluruh menu.
- Admin: seluruh menu operasional + Pengaturan, tanpa Manajemen Admin.
- Tour Leader: Ringkasan, Jemaah, Manasik, Agenda & Perjalanan, Dokumen, Pengumuman.
- Pendamping: Ringkasan, Jemaah, Agenda & Perjalanan, Pengumuman.
- Laporan: Super Admin + Admin.
- Manajemen Admin: Super Admin saja.

## Security
- Password dibuat sendiri oleh pemilik akun.
- Password minimal 10 karakter sesuai policy Auth API saat ini.
- Kode aktivasi hanya dapat digunakan sekali.
- Maksimal 5 kegagalan pada satu kode sebelum dikunci.
- Aktivasi berhasil langsung menghasilkan session cookie HttpOnly/Secure/SameSite=Lax.
- Halaman Manajemen Admin memiliki `data-required-role="super_admin"` selain proteksi API backend.

## Catatan
RBAC V3.3 mengatur akses UI pada modul operasional yang masih berupa prototype/static. Saat endpoint operasional nyata dibuat, izin role wajib diterapkan kembali di backend; UI RBAC bukan pengganti otorisasi server-side.
