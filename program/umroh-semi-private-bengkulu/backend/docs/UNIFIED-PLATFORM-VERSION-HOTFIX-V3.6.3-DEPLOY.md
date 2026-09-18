# Unified Platform Version Hotfix V3.6.3 — Deploy

## Tujuan
Memulihkan Dashboard Admin/Jemaah dan tetap menyatukan versi platform.

## Deploy
1. Copy folder `program` dari patch ke root repository.
2. Pilih **Replace files in destination**.
3. Commit:
   `Fix Unified Umroh Platform Version V3.6.3`
4. Push origin.
5. Deploy `backend/worker/worker.js` ke `umroh-auth-api`.

## Target Worker
`{"ok":true,"service":"umroh-auth-api","version":"3.6.3"}`

## Uji
Lakukan `Ctrl + F5`:
- `/program/umroh-semi-private-bengkulu/admin/`
- `/program/umroh-semi-private-bengkulu/jamaah/dashboard/`

Dashboard harus kembali tampil normal dan label versi utama harus:
`Platform V3.6.3`

Lanjut cek:
- Admin Agenda
- Admin Dokumen
- Admin Pengumuman
- Admin Manajemen Admin
- Jemaah Agenda
- Jemaah Dokumen
- Jemaah Pengumuman

Tidak ada migration D1.
