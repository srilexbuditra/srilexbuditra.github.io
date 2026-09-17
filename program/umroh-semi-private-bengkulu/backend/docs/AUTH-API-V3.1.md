# Auth API V3.1 / V3.1.1

## Scope

Lapisan autentikasi pertama untuk Umroh Semi Private Bengkulu.

Custom domain produksi:

`https://umroh-api.srilexbuditra.work`

### Aktif dan terverifikasi

- D1 binding `DB`
- `GET /health`
- `POST /bootstrap/super-admin` — endpoint tetap ada tetapi bootstrap telah dinonaktifkan
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/activate` — handler tersedia; issuance code menyusul

### Frontend Admin V3.1.2

- form Login Admin aktif
- auth guard Dashboard Admin aktif
- logout browser aktif
- request menggunakan `credentials: 'include'`
- role Dashboard Admin: `super_admin` dan `admin`
- password dan session token tidak disimpan di localStorage/sessionStorage

### Belum aktif

- login Jemaah frontend
- pembuatan akun Jemaah dari Admin
- penerbitan kode aktivasi dari Admin
- reset password
- rate limiting produksi
- progress API
- upload dokumen privat

## Password storage

V3.1 awal dirancang menggunakan PBKDF2-HMAC-SHA256 600000 iterasi. Runtime Cloudflare pada deployment ini menolak nilai di atas 100000, sehingga V3.1.1 menggunakan PBKDF2-HMAC-SHA256 **100000 iterasi** sebagai hotfix kompatibilitas.

Salt unik dan `AUTH_PEPPER` Worker Secret tetap digunakan.

Format database:

`pbkdf2-sha256$100000$<salt>$<derived-key>`

Tidak ada password mentah di D1.

> Work factor ini harus direview kembali sebelum skala produksi diperbesar.

## Session

Cookie:

- HttpOnly
- Secure
- SameSite=Lax
- Path=/
- default 7 hari

Database menyimpan SHA-256 dari token random, bukan token mentah.

Logout mengisi `revoked_at`; session yang telah logout telah diuji menghasilkan HTTP `401` pada `/auth/me`.

## Bootstrap

Bootstrap Super Admin sudah selesai.

Status produksi:

- `ENABLE_BOOTSTRAP=0`
- `BOOTSTRAP_TOKEN` sudah dihapus
- `AUTH_PEPPER` tetap dipertahankan

## Super Admin pertama

- username: `srilexbuditra`
- role: `super_admin`
- identitas tampilan frontend: **Srilex Buditra — Full Stack Developer — Super Admin**

## CSP frontend

`connect-src` harus mengizinkan:

`https://umroh-api.srilexbuditra.work`

Tidak perlu menggunakan endpoint `workers.dev` pada frontend produksi.

## Gate berikutnya

Setelah Login Admin browser V3.1.2 lolos uji:

**Admin Jamaah Onboarding & Activation Code Issuance**
