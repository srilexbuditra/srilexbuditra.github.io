# CHANGELOG — Agenda Read Sync V3.4.5

## Added
- `GET /jamaah/progress/agenda`
- `PATCH /jamaah/progress/agenda/:eventKey`
- `POST /jamaah/progress/agenda/import`
- Status `Sudah dibaca` Agenda disimpan ke D1 `umroh_agenda_reads`.
- One-time import status baca lokal lama.
- Queue lokal saat koneksi gagal.
- Dashboard membaca jumlah Agenda yang telah dibaca dari backend.
- Marker internal untuk membedakan akun yang sudah diinisialisasi, sehingga status semua-belum-dibaca tidak memicu import lama berulang.

## Existing tables used
- `umroh_agenda_events`
- `umroh_agenda_reads`

Tidak ada migration D1 baru.

## Important
Konten/jadwal Agenda V2.2 masih simulasi.
Worker hanya memastikan empat event simulasi internal tersedia di D1 dengan `is_published=0` agar FK `umroh_agenda_reads` dapat digunakan.
Ini bukan publikasi jadwal resmi.

## Changed
- Worker menjadi `3.4.5`.
- `agenda.js` memakai D1 sebagai sumber status baca saat session aktif.
- `localStorage` tetap cache/fallback.
