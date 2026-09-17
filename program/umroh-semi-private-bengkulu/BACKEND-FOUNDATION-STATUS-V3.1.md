# Backend Foundation Status

Tanggal checkpoint: 2026-09-18

## V3.0 — D1 Schema VERIFIED

Database:

`umroh-semi-private-bengkulu-db`

Migration `001_auth_foundation.sql` berhasil dan 10 tabel `umroh_*` telah diverifikasi.

`PRAGMA foreign_key_check;` tidak mengembalikan pelanggaran.

Migration `002_admin_username.sql` juga telah diterapkan dan unique index username telah diverifikasi.

## V3.1.1 — Auth Worker CORE VERIFIED

Worker:

`umroh-auth-api`

Custom domain:

`https://umroh-api.srilexbuditra.work`

Status:

- D1 binding `DB` aktif.
- `AUTH_PEPPER` disimpan sebagai Secret.
- `GET /health` berhasil.
- Super Admin pertama berhasil dibuat.
- Username Super Admin: `srilexbuditra`.
- Role: `super_admin`.
- Bootstrap telah dimatikan (`ENABLE_BOOTSTRAP=0`).
- `BOOTSTRAP_TOKEN` telah dihapus.
- Login berhasil.
- `/auth/me` berhasil.
- Logout berhasil.
- Session D1 memiliki `revoked_at` setelah logout.
- `/auth/me` setelah logout menghasilkan HTTP `401`.

## PBKDF2 runtime hotfix

Cloudflare Workers WebCrypto pada deployment ini membatasi PBKDF2 hingga 100000 iterasi. V3.1.1 menggunakan 100000 iterasi sebagai hotfix kompatibilitas dengan salt unik dan `AUTH_PEPPER` tetap aktif.

Konfigurasi hashing perlu direview kembali sebelum skala produksi diperbesar.

## V3.1.2 — Admin Frontend Auth Integration

Dashboard Admin sekarang menggunakan:

- Login: `POST /auth/login`
- Session check: `GET /auth/me`
- Logout: `POST /auth/logout`
- `credentials: 'include'`
- role guard untuk `super_admin` dan `admin`

Frontend tidak menyimpan password atau session token di Web Storage.

## Gate berikutnya

Setelah pengujian browser V3.1.2 berhasil:

**Admin Jamaah Onboarding & Activation Code Issuance**
