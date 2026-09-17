# Umroh Semi Private Bengkulu — Digital Platform

Lokasi: `/program/umroh-semi-private-bengkulu/`

## Tujuan

Membangun pusat informasi, manasik digital, persiapan perjalanan, agenda, dokumen, dan pendampingan jemaah dalam satu platform yang terstruktur di bawah `srilexbuditra.work` tanpa mengubah positioning website utama sebagai portfolio Srilex Buditra.

## Identitas & Peran

- Identitas utama: **Umroh Semi Private Bengkulu**.
- Pembimbing Manasik: **Ust. Abdurahman Dody**.
- Tour Leader: **Hj. Prapti Kanthi Rahayu, S.I.Kom**.
- Srilex Buditra ditempatkan sebagai **Pengembangan Sistem & Dukungan Teknologi** pada bagian yang relevan.
- Identitas pengembang teknologi tidak menggantikan identitas organisasi/program.

## Tahap Saat Ini

**Prototype V1.3 — Final Polish Design System dan Dashboard Shell**

- `/admin/` — Adaptive Workspace untuk Admin.
- `/jamaah/dashboard/` — Journey Dashboard untuk Jemaah.
- `assets/css/tokens.css` — design tokens bersama.
- `assets/css/dashboard-shell.css` — shell responsif bersama.
- `DASHBOARD-DESIGN-SYSTEM.md` — aturan visual proyek.

Semua data pada prototype adalah simulasi. Tidak ada autentikasi, API, database, atau data jemaah asli pada tahap ini.

## Prinsip Teknis

1. Aset Umroh berada di folder program Umroh sendiri dan tidak bergantung pada CSS/JS Program Ketahanan Pangan.
2. Admin dan Jemaah berbagi design tokens dan shell, tetapi memiliki pengalaman pengguna berbeda.
3. Halaman private memakai `noindex,nofollow,noarchive`.
4. Loading, empty, error, permission denied, dan expired session harus memiliki tampilan yang konsisten saat backend dikembangkan.
5. Backend, autentikasi, dan API baru dibuat setelah Visual V1 dikunci.


## Manasik Digital V1 — 2026-09-17

Manasik Digital telah ditambahkan sebagai modul publik prototype di `/program/umroh-semi-private-bengkulu/manasik/`.

Materi mengikuti bahan PowerPoint Manasik Umroh Semi Private Bengkulu yang diberikan untuk proyek, terdiri dari 11 materi: Persiapan Sebelum Berangkat, Ihram & Miqat, Talbiyah, Tata Cara Umroh, Thawaf, Sa’i, Tahallul, Larangan Ihram, Adab di Tanah Suci, Ziarah Madinah, dan Tips Selama Perjalanan.

Progress baca pada V1 disimpan lokal di browser/perangkat dan belum terhubung ke akun atau database.


## Visual Asset System V1
Icon dan aturan gambar global berada di `VISUAL-ASSET-SYSTEM.md`. Icon SVG disimpan lokal di `assets/icons/` agar konsisten dengan CSP dan satu gaya visual. Foto asli Pembimbing Manasik/Tour Leader hanya digunakan jika aset diberikan dan diizinkan.

## Checklist Persiapan Jemaah V2.1 — 2026-09-17

Checklist Persiapan Jemaah telah ditambahkan di `/jamaah/checklist/`.

- 12 item bersumber dari materi “Persiapan Sebelum Berangkat”.
- Kelompok: Dokumen, Perlengkapan, dan Kesiapan Ibadah.
- Setiap item dapat ditandai `Siap` atau `Tidak berlaku`.
- Progress disimpan lokal di browser/perangkat dengan key `umroh-checklist-progress-v1`.
- Ringkasan Checklist tersinkron ke Dashboard Jemaah.
- Belum terhubung ke akun, API, atau database.


## Agenda & Perjalanan Jemaah V2.2 — 2026-09-17

Agenda & Perjalanan Jemaah telah ditambahkan di `/jamaah/agenda/`.

- Menampilkan timeline agenda, rencana keberangkatan, dan panduan perjalanan.
- Data V2.2 masih simulasi dan diberi penanda jelas agar tidak dianggap sebagai jadwal resmi.
- Jemaah dapat menandai agenda sebagai `Sudah dibaca`; status disimpan lokal dengan key `umroh-agenda-read-v1`.
- Ringkasan Agenda dan tanggal keberangkatan tersinkron ke Dashboard Jemaah dari `assets/js/agenda-data.js`.
- Belum terhubung ke admin, akun, API, atau database.


## Dokumen Saya V2.3 — 2026-09-17

Dokumen Saya telah ditambahkan di `/jamaah/dokumen/`.

- Memuat 4 status dokumen utama dari materi “Persiapan Sebelum Berangkat”.
- Status lokal: `Sudah disiapkan` atau `Menunggu`.
- Progress status disimpan lokal dengan key `umroh-documents-status-v1` dan tersinkron ke Dashboard Jemaah.
- V2.3 tidak menerima upload berkas dan tidak menyimpan data pribadi ke repository/static hosting.
- Verifikasi dokumen resmi menunggu autentikasi, backend, dan penyimpanan aman.


## Pengumuman Jemaah V2.4

- Path: `/program/umroh-semi-private-bengkulu/jamaah/pengumuman/`
- Menampilkan informasi simulasi per kategori.
- Status dibaca tersimpan lokal di browser/perangkat.
- Dashboard Jemaah menampilkan tiga pengumuman terbaru dan jumlah yang belum dibaca.
- Belum menjadi kanal operasional resmi sampai backend/admin publishing diaktifkan.
