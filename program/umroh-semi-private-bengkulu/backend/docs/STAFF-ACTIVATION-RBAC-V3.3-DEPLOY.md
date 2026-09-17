# Staff Activation + RBAC V3.3 — Deploy & Test

## Tidak ada migration D1 baru
V3.3 memakai tabel yang sudah tersedia dari Migration 003.

## 1. Deploy GitHub
Gunakan commit message:

`Add Umroh Staff Activation RBAC V3.3`

## 2. Deploy Worker
Copy:

`backend/worker/worker.js`

ke Worker:

`umroh-auth-api`

Lalu Deploy.

Uji:

`https://umroh-api.srilexbuditra.work/health`

Target:

```json
{"ok":true,"service":"umroh-auth-api","version":"3.3"}
```

Jangan mengubah:
- `DB`
- `ALLOWED_ORIGIN`
- `AUTH_PEPPER`
- `ENABLE_BOOTSTRAP=0`
- `SESSION_MAX_AGE_SECONDS`

## 3. Uji halaman Aktivasi
Gunakan akun simulasi `admin.simulasi` yang masih `pending_activation`.

Karena kode aktivasi lama pernah terlihat di screenshot, gunakan kode baru hasil **Reset Akses** dan jangan kirim/screenshot kode itu.

Buka:

`/program/umroh-semi-private-bengkulu/admin/aktivasi/`

Isi:
- Username: `admin.simulasi`
- Kode Aktivasi: kode baru hasil Reset Akses
- Password Baru: password simulasi minimal 10 karakter
- Ulangi Password

Target:
1. Pesan aktivasi berhasil.
2. Redirect ke Dashboard Admin.
3. Akun `admin.simulasi` dapat masuk karena role `admin`.
4. Menu **Manajemen Admin** tidak terlihat.
5. Menu operasional Admin tetap terlihat.

## 4. Verifikasi D1
Setelah aktivasi:

```sql
SELECT username, role, account_status, password_changed_at
FROM umroh_accounts
WHERE username='admin.simulasi';
```

Target:
- role `admin`
- account_status `active`
- password_changed_at terisi

Verifikasi kode:

```sql
SELECT id, used_at, failed_attempts, expires_at
FROM umroh_activation_codes
WHERE account_id = (
  SELECT id FROM umroh_accounts WHERE username='admin.simulasi'
)
ORDER BY id DESC
LIMIT 1;
```

Target:
- `used_at` terisi

Verifikasi audit:

```sql
SELECT action, created_at
FROM umroh_admin_audit_log
ORDER BY id DESC
LIMIT 5;
```

Target terdapat:
- `account_activated`

## 5. Uji kembali Super Admin
Logout akun simulasi lalu login `srilexbuditra`.

Target:
- Identitas: Srilex Buditra
- Senior Full Stack Developer · Platform Architect
- Menu Manajemen Admin muncul kembali.
- Admin Simulasi berstatus Aktif.

## Catatan keamanan
Jangan mengirim password atau kode aktivasi ke percakapan/screenshot.
