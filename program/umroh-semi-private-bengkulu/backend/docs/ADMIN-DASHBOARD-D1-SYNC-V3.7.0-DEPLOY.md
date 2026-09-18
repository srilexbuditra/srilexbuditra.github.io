# Admin Dashboard Full Backend Sync V3.7.0 — Deploy & Test

## Deploy
1. Copy folder `program` dari patch ke root repository.
2. Pilih **Replace files in destination**.
3. Commit:
   `Sync Umroh Admin Dashboard Backend V3.7.0`
4. Push origin.
5. Deploy `backend/worker/worker.js` ke Worker `umroh-auth-api`.

## Worker target
`{"ok":true,"service":"umroh-auth-api","version":"3.7.0"}`

## Tidak ada migration
V3.7.0 menggunakan tabel D1 yang sudah tersedia.

## Uji Admin Dashboard
Buka:
`/program/umroh-semi-private-bengkulu/admin/`

Lakukan `Ctrl + F5`.

Target:
- Total Jemaah berasal dari D1.
- Agenda Resmi Mendatang berasal dari D1.
- Materi Manasik berasal dari katalog backend resmi.
- Perlu Perhatian tidak lagi berupa angka simulasi.
- Status Persiapan total harus sama dengan jumlah jemaah D1.
- Aktivitas Terbaru berasal dari D1/audit log.
- Tab Hari Ini / 7 Hari / 30 Hari memperbarui rentang agenda dan aktivitas.
- Tidak ada lagi angka dummy `128 / 68 / 42 / 12 / 6` pada Status Persiapan.

## Version sync
Admin, Jemaah, dan `/health` harus menunjukkan:
`Platform V3.7.0`
