# CHANGELOG — Jemaah Management V3.4.1

## Added
- Tambah Jemaah dari Admin.
- Edit data Jemaah.
- Tangguhkan / aktifkan kembali akun yang sudah memiliki password.
- Reset Akses Jemaah.
- Kode aktivasi Jemaah sekali tampil.
- Login Jemaah backend.
- Aktivasi akun Jemaah backend.
- Auth Guard untuk Dashboard, Checklist, Agenda, Dokumen, dan Pengumuman Jemaah.
- Identitas Dashboard Jemaah berasal dari `/auth/me`.
- Audit event:
  - `jamaah_created`
  - `jamaah_updated`
  - `jamaah_reset_access`
  - `account_activated` untuk aktivasi Jemaah.

## Changed
- Portal mengarahkan Jemaah ke `/jamaah/login/`, bukan langsung ke Dashboard.
- Data Jemaah V3.4.0 yang sebelumnya read-only sekarang writable untuk role `super_admin` dan `admin`.
- `tour_leader` dan `pendamping` tetap read-only pada data Jemaah.
- Worker API menjadi `3.4.1`.

## Security
- Password Jemaah dibuat sendiri oleh Jemaah.
- Admin tidak menerima atau melihat password.
- Aktivasi Jemaah menggunakan endpoint khusus role Jemaah.
- Login Jemaah menolak role Admin/Staff.
- Reset akses mencabut semua session Jemaah, menghapus password hash, dan mengembalikan akun ke `pending_activation`.
- Akun tanpa password tidak dapat diaktifkan manual.
- Kode aktivasi mentah hanya ditampilkan satu kali; database menyimpan hash.
- Tidak ada delete permanen Jemaah pada fase ini.

## Database
Tidak ada migration D1 baru.
