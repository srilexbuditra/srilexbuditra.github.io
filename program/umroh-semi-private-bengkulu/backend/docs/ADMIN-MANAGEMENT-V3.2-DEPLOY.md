# Admin Management V3.2 — Deploy & Test

## Urutan deploy

### 1. GitHub
Deploy patch ke repository dan gunakan commit message:

`Add Umroh Admin Management V3.2`

### 2. D1 migration 003
Buka database `umroh-semi-private-bengkulu-db` → Console.

Jalankan isi:

`backend/migrations/003_admin_management_console.sql`

Verifikasi:

```sql
PRAGMA table_info(umroh_accounts);
```

Pastikan kolom:
- `display_name`
- `job_title`

Verifikasi audit table:

```sql
SELECT name
FROM sqlite_schema
WHERE type='table'
  AND name='umroh_admin_audit_log';
```

Verifikasi identitas:

```sql
SELECT username, display_name, job_title, role
FROM umroh_accounts
WHERE username='srilexbuditra';
```

Target:
- `display_name`: Srilex Buditra
- `job_title`: Senior Full Stack Developer · Platform Architect
- `role`: super_admin

### 3. Worker
Copy `backend/worker/worker.js` ke Worker `umroh-auth-api` dan Deploy.

Uji:

`https://umroh-api.srilexbuditra.work/health`

Target version: `3.2`.

### 4. Browser
Login sebagai `srilexbuditra`, lalu buka:

`/program/umroh-semi-private-bengkulu/admin/manajemen-admin/`

Target awal:
- 1 akun Super Admin tampil;
- identitas profesional benar;
- tombol Tambah Akun aktif;
- Super Admin tidak memiliki tombol ubah role/status/reset.

### 5. Uji akun simulasi
Buat satu akun simulasi role `admin`.

Jangan gunakan data pribadi nyata pada pengujian pertama.

Pastikan:
- akun dibuat `pending_activation`;
- kode aktivasi ditampilkan satu kali;
- audit log mencatat `account_created`.

Belum perlu mengaktifkan akun simulasi sampai halaman aktivasi staf dibuat pada fase berikutnya.
