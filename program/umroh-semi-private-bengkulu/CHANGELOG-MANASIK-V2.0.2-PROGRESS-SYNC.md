# Manasik V2.0.2 — Progress Sync

Tanggal: 17 September 2026

## Changed
- Dashboard Jemaah membaca progress Manasik dari `localStorage` yang sama dengan Manasik Digital.
- Kartu **Manasik Saya** menampilkan jumlah materi yang selesai secara otomatis.
- **Tahap Berikutnya** otomatis mengarah ke materi Manasik pertama yang belum selesai.
- Jika seluruh 11 materi selesai, kartu menampilkan status **Manasik selesai**.
- Progress keseluruhan 75% tetap diberi keterangan sebagai data simulasi sampai Checklist, Dokumen, dan Agenda terhubung.

## Technical
- Menambahkan `assets/js/jamaah-progress.js`.
- Tidak mengubah API, autentikasi, database, atau Design System V1 yang sudah dikunci.
