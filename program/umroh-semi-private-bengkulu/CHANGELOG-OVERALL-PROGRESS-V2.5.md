# Overall Preparation Progress V2.5

## Added
- Progress Persiapan Umroh pada Dashboard Jemaah sekarang dihitung otomatis dari aktivitas lokal.
- Rincian progress menampilkan Manasik, Checklist, Dokumen, dan Agenda.
- Script baru `assets/js/jamaah-overall-progress.js`.

## Formula
- Manasik: 35%
- Checklist: 35%
- Dokumen siap: 20%
- Agenda dibaca: 10%

Catatan: status Dokumen `Menunggu` tidak menambah progress kesiapan karena dokumen belum dianggap siap.
Pengumuman tidak masuk ke formula karena bersifat informasi, bukan syarat kesiapan.

## Storage
V2.5 masih membaca data dari `localStorage` browser/perangkat yang sama. Belum ada sinkronisasi akun, backend, atau database.
