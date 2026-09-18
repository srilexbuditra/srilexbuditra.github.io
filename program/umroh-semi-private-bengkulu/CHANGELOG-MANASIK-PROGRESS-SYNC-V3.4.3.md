# CHANGELOG — Manasik Progress Sync V3.4.3

## Added
- `GET /jamaah/progress/manasik`
- `PATCH /jamaah/progress/manasik/:itemKey`
- `POST /jamaah/progress/manasik/import`
- Progress Manasik disimpan ke tabel D1 `umroh_progress_items`.
- Sinkronisasi Manasik lintas perangkat.
- Queue lokal untuk perubahan yang belum berhasil tersinkron saat koneksi terganggu.
- One-time import progress lokal lama jika akun D1 belum pernah memiliki progress Manasik.
- Dashboard Jemaah membaca ringkasan Manasik dari D1.

## Changed
- `manasik.js` sekarang memakai D1 sebagai sumber utama saat session Jemaah aktif.
- `localStorage` tetap dipakai sebagai cache/fallback dan untuk mempertahankan UX saat jaringan terganggu.
- Halaman Manasik menampilkan status apakah progress tersinkron akun atau masih mode lokal.
- Worker menjadi `3.4.3`.

## Database
Tidak ada migration D1 baru.

Tabel `umroh_progress_items` sudah tersedia sejak Migration 001 dan memiliki:
- `module = 'manasik'`
- `item_key`
- `status = pending | complete`
- unique `(account_id, module, item_key)`

## Migration Rule
Import local → D1 hanya dilakukan otomatis bila akun belum mempunyai satupun record Manasik di D1.
Setelah D1 terinisialisasi, D1 menjadi sumber utama untuk mencegah browser lama menimpa progress akun.
