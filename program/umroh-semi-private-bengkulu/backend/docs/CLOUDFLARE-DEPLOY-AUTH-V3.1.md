# Worker Auth API V3.1 — Cloudflare Dashboard Setup

Status: **belum dihubungkan ke frontend**.

## 1. Migration 002 wajib terlebih dahulu

Jalankan isi:

`backend/migrations/002_admin_username_console.sql`

pada D1 Console database:

`umroh-semi-private-bengkulu-db`

Verifikasi:

```sql
PRAGMA table_info(umroh_accounts);
```

Pastikan kolom `username` muncul.

Lalu:

```sql
SELECT name
FROM sqlite_schema
WHERE type = 'index'
  AND name = 'idx_umroh_accounts_username_unique';
```

Harus mengembalikan satu index.

## 2. Buat Worker

Nama yang disarankan:

`umroh-auth-api`

Salin isi `backend/worker/worker.js` ke Worker.

## 3. Binding D1

Worker → Settings → Bindings → Add binding → D1 Database

- Variable name: `DB`
- Database: `umroh-semi-private-bengkulu-db`

Cloudflare menyediakan D1 pada Worker melalui environment binding. Worker mengaksesnya sebagai `env.DB`.

## 4. Variables

Tambahkan variable biasa:

- `ALLOWED_ORIGIN` = `https://srilexbuditra.work`
- `SESSION_MAX_AGE_SECONDS` = `604800`
- `ENABLE_BOOTSTRAP` = `1` sementara untuk membuat super admin pertama

## 5. Secrets

Tambahkan sebagai **Secret**, bukan variable biasa:

### `AUTH_PEPPER`

Nilai acak panjang minimal 32 karakter. Jangan simpan di repository.

### `BOOTSTRAP_TOKEN`

Nilai acak panjang minimal 32 karakter. Hanya digunakan untuk endpoint bootstrap super admin.

Setelah super admin pertama berhasil dibuat:

- ubah `ENABLE_BOOTSTRAP` menjadi `0`;
- hapus `BOOTSTRAP_TOKEN`.

Jangan menghapus `AUTH_PEPPER`. Mengganti `AUTH_PEPPER` akan membuat password/activation code lama tidak dapat diverifikasi.

## 6. Endpoint V3.1

### Health

`GET /health`

### One-time bootstrap super admin

`POST /bootstrap/super-admin`

Header:

`X-Bootstrap-Token: <secret>`

JSON:

```json
{
  "username": "adminumroh",
  "email": "admin@example.test",
  "password": "gunakan-password-kuat"
}
```

Endpoint otomatis menolak bootstrap jika super admin sudah ada.

### Login

`POST /auth/login`

```json
{
  "identifier": "adminumroh",
  "password": "..."
}
```

### Session

`GET /auth/me`

Menggunakan cookie HttpOnly.

### Logout

`POST /auth/logout`

### Aktivasi jemaah

`POST /auth/activate`

Endpoint sudah disiapkan, tetapi penerbitan akun/kode aktivasi jemaah akan dibuat pada fase berikutnya agar kode mentah tidak pernah dimasukkan manual ke database.

## 7. Custom Domain sebelum frontend login

Sebelum menghubungkan login dari `srilexbuditra.work`, gunakan custom domain satu site, misalnya:

`umroh-api.srilexbuditra.work`

Ini menjaga cookie session berada dalam site yang sama dengan frontend.

workers.dev boleh dipakai untuk uji `GET /health`, tetapi integrasi cookie browser sebaiknya menunggu custom domain.

## 8. Catatan keamanan

V3.1 menggunakan:

- cookie `HttpOnly; Secure; SameSite=Lax`;
- token session random 256-bit;
- hanya hash token yang disimpan di D1;
- password PBKDF2-HMAC-SHA256 600.000 iterasi;
- salt unik per password;
- pepper rahasia dari Worker Secret;
- response auth `Cache-Control: no-store`;
- bootstrap hanya sekali dan dikunci secret.

Masih diperlukan sebelum produksi:

- rate limiting login/aktivasi;
- audit log auth;
- admin onboarding jemaah;
- reset password;
- RBAC endpoint operasional;
- sinkronisasi progress akun.
