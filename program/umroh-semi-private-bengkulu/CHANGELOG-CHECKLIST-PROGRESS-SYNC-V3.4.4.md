# CHANGELOG — Checklist Progress Sync V3.4.4

## Added
- `GET /jamaah/progress/checklist`
- `PATCH /jamaah/progress/checklist/:itemKey`
- `POST /jamaah/progress/checklist/import`
- Checklist disimpan ke D1 `umroh_progress_items`.
- `Siap` disimpan sebagai `complete`.
- `Tidak berlaku` disimpan sebagai `not_applicable`.
- Item yang dikosongkan disimpan sebagai `pending`.
- One-time import Checklist lokal lama ke akun D1.
- Queue lokal untuk perubahan ketika koneksi gagal.
- Dashboard mengambil ringkasan Checklist dari D1.

## Changed
- `checklist.js` memakai D1 sebagai sumber utama saat session Jemaah aktif.
- `localStorage` tetap menjadi cache/fallback.
- Worker menjadi `3.4.4`.
- Copy Dashboard menjelaskan bahwa Agenda adalah modul progress berikutnya yang belum sinkron.

## Database
Tidak ada migration baru.
Tabel `umroh_progress_items` sejak Migration 001 sudah mendukung:
- `module = 'checklist'`
- status `pending`
- status `complete`
- status `not_applicable`
