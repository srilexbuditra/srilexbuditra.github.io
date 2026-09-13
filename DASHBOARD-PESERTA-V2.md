# Dashboard Peserta V2 — Program Ketahanan Pangan

**Baseline:** V12.2 (Dashboard V2 + Kartu Anggota QR)  
**Tanggal:** 13 September 2026  
**Route:** `/program/ketahanan-pangan/peserta/`

## Tujuan

Dashboard Peserta V2 meningkatkan pengalaman peserta setelah login tanpa mengubah fondasi API, autentikasi, database, registrasi, verifikasi publik, atau sertifikat yang sudah berjalan.

## Peningkatan UI/UX

- Ringkasan status keanggotaan berbasis status peserta.
- Indikator progres akun yang menjelaskan posisi peserta dalam proses.
- Navigasi cepat ke Tahapan, Layanan, Data Peserta, dan Dukungan IT.
- Area **Ekosistem Keanggotaan** untuk membedakan layanan aktif dan roadmap.
- Sertifikat Digital aktif hanya untuk peserta berstatus `verified`.
- Kartu Anggota + QR sekarang aktif untuk peserta berstatus `verified` dan membuka route authenticated `/program/ketahanan-pangan/peserta/kartu/`.
- Aktivitas & Poin ditampilkan sebagai **ROADMAP**, bukan fitur live.

## Status yang Dipetakan

Dashboard tetap mengikuti status existing: `submitted`, `pending`, `revision`, `resubmitted`, `verified`, `approved`, dan `rejected`. Pemetaan V2 hanya menambah presentasi UI; sumber data status tetap berasal dari layanan peserta existing.

## Batas Perubahan

V12.2 tetap tidak mengubah:

- endpoint `https://peserta-api.srilexbuditra.work`,
- session/auth cookie,
- Worker peserta,
- database/migration,
- alur registrasi,
- verifikasi publik,
- penerbitan/verifikasi sertifikat,
- area admin.

## File yang Diubah

- `program/ketahanan-pangan/peserta/index.html`
- `program/ketahanan-pangan/peserta/script.js`
- `program/ketahanan-pangan/peserta/kartu/index.html`
- `program/ketahanan-pangan/peserta/kartu/style.css`
- `program/ketahanan-pangan/peserta/kartu/script.js`
- `program/ketahanan-pangan/peserta/kartu/local-qrcode.js`
- dokumentasi root terkait.

## Milestone Lanjutan

Kartu Anggota + QR telah selesai pada V12.2. Sertifikat QR existing tetap aktif. Milestone berikutnya adalah **Level/Poin** sebagai fondasi engagement peserta.


> **V12.3:** Aktivasi Kartu Anggota sekarang memerlukan Verifikasi Anggota + Foto berstatus `approved`. Status registrasi `verified` saja tidak lagi mengaktifkan badge VERIFIED MEMBER.
