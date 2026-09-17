# CHANGELOG — Operational Backend V3.4.0

## Added
- Endpoint read-only `GET /admin/jamaah`.
- Endpoint read-only `GET /admin/jamaah/stats`.
- Halaman Admin Jemaah:
  `/program/umroh-semi-private-bengkulu/admin/jemaah/`
- Search dan filter status data jemaah.
- Statistik jemaah nyata dari D1.
- Total Jemaah pada Ringkasan Admin sekarang dibaca dari D1.

## Changed
- Menu **Jemaah** sekarang membuka modul data nyata.
- Banner Ringkasan menjelaskan dengan tegas bagian mana yang sudah live dan mana yang masih simulasi.
- Worker API menjadi `3.4.0`.

## Security
- Endpoint jemaah membutuhkan session staf aktif.
- Role yang dapat membaca:
  `super_admin`, `admin`, `tour_leader`, `pendamping`.
- V3.4.0 bersifat **read-only**; belum ada endpoint create/update/delete jemaah.
- Tidak ada data simulasi yang di-seed ke D1.

## Database
Tidak ada migration baru. V3.4.0 menggunakan:
- `umroh_accounts`
- `umroh_jamaah_profiles`
