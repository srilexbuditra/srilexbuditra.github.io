# CHANGELOG — Admin Management V3.2

## Added
- D1 migration 003 untuk `display_name`, `job_title`, dan `umroh_admin_audit_log`.
- API Super Admin:
  - `GET /admin/accounts`
  - `POST /admin/accounts`
  - `PATCH /admin/accounts/:uuid`
  - `POST /admin/accounts/:uuid/reset-password`
  - `GET /admin/audit-log`
- Halaman `/admin/manajemen-admin/`.
- Pembuatan akun `admin`, `tour_leader`, dan `pendamping`.
- Kode aktivasi sekali tampil dan berlaku 24 jam.
- Aktivasi/nonaktif akun, perubahan role, reset akses, dan audit log.

## Changed
- Identitas tampil Super Admin:
  - Srilex Buditra
  - Senior Full Stack Developer · Platform Architect
- Role teknis tetap `super_admin`.
- Worker API version menjadi V3.2.
- Menu Manajemen Admin pada Dashboard Admin sekarang membuka modul nyata.

## Security
- Endpoint Manajemen Admin hanya menerima session `super_admin`.
- Super Admin tidak dapat diubah role/status melalui modul ini.
- Reset akses mencabut seluruh session target.
- Password tidak dibuat oleh Super Admin; pemilik akun melakukan aktivasi dan membuat password sendiri.
- Kode aktivasi mentah hanya dikembalikan sekali; database menyimpan hash.
- Semua response API tetap `Cache-Control: no-store`.

## Catatan
Role `tour_leader` dan `pendamping` sudah dapat dikelola pada backend. Penyempurnaan hak akses menu per role dilakukan pada fase RBAC berikutnya.
