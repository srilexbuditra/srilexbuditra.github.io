# CHANGELOG — Departure Event Selection Hotfix V3.5.2

## Fixed
- Bagian **Informasi Keberangkatan** tidak lagi salah memilih `Briefing Keberangkatan`.
- Kartu **Rencana Keberangkatan** pada Dashboard Jemaah sekarang memilih event keberangkatan yang benar.
- Prioritas pemilihan event:
  1. `event_key = keberangkatan`
  2. kategori tepat `Keberangkatan`
  3. jika tidak ada, tampil sebagai belum dipublikasikan/belum dikonfirmasi.

## Important
Pencarian tidak lagi menggunakan kecocokan judul yang sekadar mengandung kata `keberangkatan`, karena judul `Briefing Keberangkatan` dapat menghasilkan event yang salah.

## Backend / D1
- Tidak ada migration baru.
- Tidak ada perubahan Worker.
- Worker produksi tetap V3.5.1.
