# Unified Platform Version Registry V3.6.2 — Deploy & Test

## Deploy
1. Copy patch ke repository dan pilih **Replace files in destination**.
2. Commit:
   `Unify Umroh Platform Version V3.6.2`
3. Push origin.
4. Deploy `backend/worker/worker.js` ke Worker `umroh-auth-api`.
5. Buka `/health`.

Target:
`{"ok":true,"service":"umroh-auth-api","version":"3.6.2"}`

## Uji panel
Lakukan `Ctrl + F5` pada:
- Admin Dashboard
- Admin Jemaah
- Admin Agenda & Perjalanan
- Admin Dokumen
- Admin Pengumuman
- Admin Manajemen Admin
- Jemaah Dashboard
- Jemaah Agenda
- Jemaah Dokumen
- Jemaah Pengumuman

Semua label release yang terlihat harus menjadi:
`Platform V3.6.2`

## Single source of truth
File:
`/program/umroh-semi-private-bengkulu/platform-version.json`

Untuk release berikutnya, versi publik panel mengambil nilai dari registry ini.
