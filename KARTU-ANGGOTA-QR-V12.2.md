# Kartu Anggota Digital + QR — V12.2

**Tanggal:** 13 September 2026  
**Route:** `/program/ketahanan-pangan/peserta/kartu/`  
**Akses:** authenticated participant session + status `verified`  
**Indexing:** `noindex,nofollow,noarchive`

## Tujuan

Menyediakan identitas anggota digital untuk peserta Program Ketahanan Pangan yang sudah berstatus terverifikasi, tanpa membuat tabel anggota baru atau mengubah skema database yang sudah berjalan.

Nomor Registrasi existing digunakan sebagai **Nomor Anggota** agar sumber identitas tetap satu dan tidak menambah inkonsistensi data.

## Alur

1. Peserta login melalui `/program/ketahanan-pangan/peserta/`.
2. Dashboard mengambil data peserta dari endpoint existing `/me`.
3. Layanan **Kartu Anggota + QR** hanya aktif bila `status === "verified"`.
4. Halaman kartu kembali memeriksa sesi ke endpoint `/me`.
5. Jika sesi valid dan status terverifikasi, kartu depan/belakang ditampilkan.
6. QR mengarah ke verifikasi publik:
   `/program/ketahanan-pangan/verifikasi/?registration_id=...&source=member_card_qr`
7. Halaman verifikasi publik existing memeriksa Nomor Registrasi melalui API verifikasi yang sudah berjalan.

## Data yang Ditampilkan

- nama peserta,
- Nomor Registrasi / Nomor Anggota,
- status Terverifikasi,
- kabupaten/provinsi bila tersedia,
- tanggal registrasi.

## Data yang Tidak Ditampilkan

- NIK,
- nomor KK,
- nomor WhatsApp,
- email,
- password,
- KTP/KK,
- token/session,
- object key dokumen.

## Fitur

- kartu depan dan belakang responsif,
- QR generator lokal (tanpa layanan QR eksternal),
- buka verifikasi publik,
- salin link verifikasi,
- Cetak / Simpan PDF,
- print layout mengikuti rasio kartu ID 85.6 × 53.98 mm.

## Batas Perubahan

V12.2 tidak mengubah:

- `peserta-worker/worker.js`,
- migration/database,
- session cookie,
- endpoint login/aktivasi `/me`,
- registrasi peserta,
- verifikasi publik,
- penerbitan/validasi sertifikat,
- dashboard admin.

## File Utama

- `program/ketahanan-pangan/peserta/index.html`
- `program/ketahanan-pangan/peserta/script.js`
- `program/ketahanan-pangan/peserta/kartu/index.html`
- `program/ketahanan-pangan/peserta/kartu/style.css`
- `program/ketahanan-pangan/peserta/kartu/script.js`
- `program/ketahanan-pangan/peserta/kartu/local-qrcode.js`

## Next Milestone

**Level/Poin** — dibangun sebagai fondasi engagement setelah kartu anggota dan sertifikat QR dikunci sebagai layanan terverifikasi.
