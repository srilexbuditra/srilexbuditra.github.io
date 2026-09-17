# Jemaah Management V3.4.1 — Deploy & Test

## Tidak ada migration D1 baru

### 1. GitHub
Commit:

`Add Umroh Jemaah Management V3.4.1`

### 2. Worker
Deploy:
`backend/worker/worker.js`

Target:
```json
{"ok":true,"service":"umroh-auth-api","version":"3.4.1"}
```

Jangan ubah:
- DB
- AUTH_PEPPER
- ALLOWED_ORIGIN
- ENABLE_BOOTSTRAP=0
- SESSION_MAX_AGE_SECONDS

### 3. Uji Tambah Jemaah dengan data simulasi
Login `srilexbuditra` lalu buka:
`/program/umroh-semi-private-bengkulu/admin/jemaah/`

Klik **+ Tambah Jemaah**.

Contoh aman:
- Nomor Jemaah: `SIM-0001`
- Nama: `Jemaah Simulasi`
- Email: kosong
- WhatsApp: kosong
- Grup: `Uji Sistem`
- Batch: `Simulasi`

Target:
- Total Jemaah menjadi 1.
- Menunggu Aktivasi menjadi 1.
- Kode aktivasi muncul sekali.

Jangan kirim/screenshot kode aktivasi.

### 4. Aktivasi Jemaah
Buka:
`/program/umroh-semi-private-bengkulu/jamaah/aktivasi/`

Isi:
- Nomor Jemaah: `SIM-0001`
- kode aktivasi
- password simulasi minimal 10 karakter

Target:
- aktivasi berhasil;
- redirect ke Dashboard Jemaah;
- nama `Jemaah Simulasi` tampil dari D1;
- ada tombol Keluar.

### 5. Uji Login Ulang
Logout Jemaah lalu buka:
`/program/umroh-semi-private-bengkulu/jamaah/login/`

Login menggunakan:
- `SIM-0001`
- password simulasi

Target:
- Dashboard terbuka.

### 6. Verifikasi Admin
Login kembali sebagai `srilexbuditra`.

Target:
- Jemaah Simulasi berstatus Aktif;
- Login Terakhir terisi;
- Total Jemaah Ringkasan = 1.

### 7. Uji role Admin
Login `admin.simulasi`.

Target:
- bisa membuka Data Jemaah;
- tombol Tambah/Edit/Reset tersedia;
- Manajemen Admin tetap tidak tersedia.

### 8. Uji keamanan
Jangan gunakan password atau data pribadi jemaah nyata saat uji pertama.
Kode aktivasi yang terlihat di screenshot harus dianggap terekspos dan di-reset sebelum digunakan.
