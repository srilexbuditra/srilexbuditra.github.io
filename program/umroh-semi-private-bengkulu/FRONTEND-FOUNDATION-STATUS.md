# Frontend Foundation Status — V3.1.2

Tanggal checkpoint: 2026-09-18

## Status

**STABLE / AUTH-INTEGRATED untuk Dashboard Admin**

## Modul yang telah lolos uji

- Portal Digital Platform
- Dashboard Admin + Auth Guard
- Login Admin backend session
- Logout Admin + session revocation
- Dashboard Jemaah
- Manasik Digital + progress
- Checklist Persiapan + progress
- Agenda & Perjalanan + status dibaca
- Dokumen Saya + status kesiapan
- Pengumuman + status dibaca
- Overall Preparation Progress V2.5.1

## Fondasi yang dikunci

- Dashboard Design System V1
- Visual Asset System V1
- Sidebar / topbar / card / badge / modal / responsive shell
- Identitas utama Umroh Semi Private Bengkulu
- Posisi Srilex Buditra sebagai **Pengembangan Sistem & Dukungan Teknologi**
- Admin Auth API melalui `https://umroh-api.srilexbuditra.work`
- Session browser menggunakan cookie HttpOnly; frontend tidak menyimpan password atau session token di localStorage/sessionStorage

## Status autentikasi Admin

- Super Admin aktif: `srilexbuditra`
- Role backend: `super_admin`
- Login → `/auth/me` → logout telah diverifikasi
- Session setelah logout menghasilkan `401`
- Bootstrap telah dinonaktifkan dan `BOOTSTRAP_TOKEN` telah dihapus
- Dashboard Admin sekarang melakukan auth guard sebelum konten ditampilkan

## Penyimpanan sementara

Progress Jemaah dan beberapa status modul frontend masih menggunakan local storage browser/perangkat. Data operasional ringkasan Admin juga masih simulasi sampai modul data Admin dihubungkan ke backend.

## Batasan yang tetap berlaku

- Login Jemaah belum diaktifkan pada frontend.
- Progress Manasik/Checklist Jemaah belum disinkronkan ke D1.
- Agenda operasional Admin masih data simulasi.
- Dokumen belum dapat diupload dan tidak menyimpan berkas pribadi.
- Pengumuman belum menjadi kanal publikasi operasional resmi dari backend.
- Rate limiting produksi untuk endpoint autentikasi masih perlu ditambahkan sebelum skala penggunaan diperbesar.

## Tahap berikutnya

1. Uji Login Admin langsung dari browser setelah deploy V3.1.2.
2. Pastikan CSP `connect-src` mengizinkan `https://umroh-api.srilexbuditra.work`.
3. Lanjut Admin Jamaah Onboarding & Activation Code Issuance.
4. Aktifkan autentikasi Jemaah dan migrasi progress lokal secara bertahap.
