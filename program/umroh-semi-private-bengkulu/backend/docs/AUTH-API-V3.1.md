# Auth API V3.1

## Scope

V3.1 membangun lapisan autentikasi pertama tanpa mengubah frontend stable V2.5.1.

### Aktif
- D1 binding `DB`
- `GET /health`
- `POST /bootstrap/super-admin`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/activate` (handler tersedia; issuance code menyusul)

### Belum aktif
- form login frontend
- pembuatan akun jemaah dari admin
- penerbitan kode aktivasi dari admin
- reset password
- rate limiting produksi
- progress API
- upload dokumen

## Password storage

Worker menggunakan PBKDF2-HMAC-SHA256 dengan 600.000 iterasi, salt unik, dan pepper dari Worker Secret.

Format database:

`pbkdf2-sha256$600000$<salt>$<derived-key>`

Tidak ada password mentah di D1.

## Session

Cookie:
- HttpOnly
- Secure
- SameSite=Lax
- Path=/
- default 7 hari

Database menyimpan SHA-256 dari token random, bukan token mentah.

## Bootstrap

Bootstrap super admin hanya digunakan sekali.

Sesudah berhasil:
1. `ENABLE_BOOTSTRAP=0`
2. hapus `BOOTSTRAP_TOKEN`
3. endpoint tetap ada tetapi tidak dapat digunakan

## Gate berikutnya

Setelah login super admin, `/auth/me`, dan logout lulus uji:

**V3.2 — Admin Jamaah Onboarding & Activation Code Issuance**
