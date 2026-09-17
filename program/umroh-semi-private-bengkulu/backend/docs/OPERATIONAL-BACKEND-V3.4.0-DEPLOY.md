# Operational Backend V3.4.0 — Deploy & Test

## Tujuan
Tahap pertama migrasi dari dashboard simulasi ke data operasional nyata.

Pada V3.4.0:
- Data Jemaah = D1 nyata.
- Total Jemaah di Ringkasan = D1 nyata.
- Agenda / Manasik / Perlu Perhatian / grafik / aktivitas = masih simulasi.

## Tidak ada migration D1
Jangan menjalankan ALTER TABLE apa pun untuk patch ini.

## 1. GitHub
Commit:

`Add Umroh Operational Backend V3.4.0`

## 2. Worker
Deploy:
`backend/worker/worker.js`

Target health:
```json
{"ok":true,"service":"umroh-auth-api","version":"3.4.0"}
```

Jangan mengubah:
- DB
- AUTH_PEPPER
- ALLOWED_ORIGIN
- ENABLE_BOOTSTRAP=0
- SESSION_MAX_AGE_SECONDS

## 3. Uji Super Admin
Login `srilexbuditra`.

Buka:
`/program/umroh-semi-private-bengkulu/admin/jemaah/`

Target bila database belum memiliki akun role `jamaah`:
- Total Jemaah: 0
- Aktif: 0
- Menunggu Aktivasi: 0
- Perlu Tindakan: 0
- Tabel: "Belum ada data jemaah nyata di D1..."

Ini adalah hasil yang benar dan tidak boleh diganti dengan data simulasi.

## 4. Uji Ringkasan
Buka Dashboard Admin.

Target:
- kartu Total Jemaah menampilkan `0` bila D1 belum memiliki jemaah;
- label `· D1` terlihat;
- banner menyatakan statistik lain masih simulasi.

## 5. Uji Admin Simulasi
Login role `admin`.

Target:
- menu Jemaah terlihat;
- halaman Jemaah dapat dibuka;
- Manajemen Admin tetap tidak terlihat.

## Catatan
Fase berikutnya V3.4.1 akan menambahkan create/edit jemaah + aktivasi akun jemaah secara lengkap. V3.4.0 sengaja read-only agar kita memverifikasi sumber data dan RBAC terlebih dahulu.
