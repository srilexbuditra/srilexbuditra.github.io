# Dashboard Peserta V2 — Program Ketahanan Pangan

**Baseline:** V12.1  
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
- Kartu Anggota + QR ditampilkan sebagai **NEXT**, bukan fitur live.
- Aktivitas & Poin ditampilkan sebagai **ROADMAP**, bukan fitur live.

## Status yang Dipetakan

Dashboard tetap mengikuti status existing: `submitted`, `pending`, `revision`, `resubmitted`, `verified`, `approved`, dan `rejected`. Pemetaan V2 hanya menambah presentasi UI; sumber data status tetap berasal dari layanan peserta existing.

## Batas Perubahan

V12.1 tidak mengubah:

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
- `program/ketahanan-pangan/peserta/style.css`
- `program/ketahanan-pangan/peserta/script.js`
- dokumentasi root terkait.

## Next Milestone

**Kartu Anggota + QR** — identitas anggota digital yang dapat diverifikasi, dikembangkan setelah Dashboard V2 dikunci dan diuji pada desktop serta mobile.
