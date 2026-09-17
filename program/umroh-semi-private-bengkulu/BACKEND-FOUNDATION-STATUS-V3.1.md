# Backend Foundation Status

## V3.0 — D1 Schema VERIFIED

Database:

`umroh-semi-private-bengkulu-db`

Migration `001_auth_foundation.sql` berhasil dan 10 tabel `umroh_*` telah diverifikasi.

`PRAGMA foreign_key_check;` tidak mengembalikan pelanggaran.

## V3.1 — Auth Worker PREPARED

Sebelum deploy Worker:

1. jalankan migration `002_admin_username.sql`;
2. bind D1 sebagai `DB`;
3. set `AUTH_PEPPER` secret;
4. set bootstrap secret sementara;
5. deploy Worker;
6. uji `/health`;
7. bootstrap super admin;
8. matikan bootstrap;
9. uji login → `/auth/me` → logout.

Frontend V2.5.1 tetap tidak diubah sampai Auth API lulus uji.
