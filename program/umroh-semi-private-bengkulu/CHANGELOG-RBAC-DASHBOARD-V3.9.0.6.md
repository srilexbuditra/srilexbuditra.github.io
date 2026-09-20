# RBAC Dashboard Consistency — V3.9.0.6

## Tujuan
Menyelaraskan menu dan akses halaman Dashboard staf dengan pembatasan role yang sudah diterapkan pada backend Worker.

## Perubahan
- Menu **Dokumen** hanya tampil untuk role teknis `super_admin` dan `admin`.
- Direct access ke halaman **Dokumen** dibatasi ke `super_admin` dan `admin`.
- Direct access ke halaman **Manasik** dibatasi ke `super_admin`, `admin`, dan `tour_leader`.
- Direct access ke halaman **Pengaturan** dibatasi ke `super_admin` dan `admin`.
- `admin-auth-guard.js` mendukung deklarasi multi-role melalui `data-required-roles`.
- Label tampilan **Senior Full Stack Developer · Platform Architect** tetap dipertahankan; identifier teknis `super_admin` tidak diubah.

## Tidak Diubah
Worker/API, D1, R2, session, dokumen private, progress Jemaah, dan identifier role backend tidak diubah.
