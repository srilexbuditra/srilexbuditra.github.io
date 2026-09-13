# AKTIVITAS & EVENT V13.2

## Tujuan
Modul Aktivitas & Event menghubungkan agenda resmi peserta dengan pendaftaran, status kehadiran, riwayat aktivitas, dan Poin Aktivitas yang dicatat oleh server.

## Prinsip
- Event hanya tampil jika statusnya `published`.
- Syarat event dapat memakai level minimum dan VERIFIED MEMBER.
- Pendaftaran peserta dicatat di D1.
- Mendaftar event tidak langsung memberikan poin.
- Poin Aktivitas hanya direkonsiliasi setelah status kehadiran berubah menjadi `attended`.
- Endpoint peserta tidak menyediakan fungsi untuk menandai dirinya sendiri sebagai hadir.
- Tidak ada event fiktif yang otomatis dipublikasikan; bila belum ada agenda resmi, halaman menampilkan empty state.

## Endpoint Peserta
- `GET /activity-events`
- `POST /activity-events/register`
- `POST /activity-events/cancel`

## Tabel D1
Worker membuat tabel berikut otomatis:
- `participant_events`
- `participant_event_registrations`

Ledger poin yang sudah ada tetap digunakan:
- `participant_points_ledger`
- `entry_type = 'event'`
- `source_key = event_attendance:<event_id>`

## Struktur poin
Total Poin:
`Poin Dasar + Poin Misi + Poin Referral + Poin Aktivitas`

## Keamanan
Status `attended` tidak dapat dibuat dari endpoint peserta. Kehadiran harus ditetapkan oleh proses pengelola/admin pada tahap administrasi event berikutnya.

## Status V13.2.0
- Halaman peserta aktif.
- Daftar agenda server-side aktif.
- Registrasi/cancel event aktif.
- Riwayat event aktif.
- Riwayat ledger engagement aktif.
- Rekonsiliasi Poin Aktivitas dari kehadiran terverifikasi aktif.
- Pengelolaan/publikasi event dari Dashboard Admin belum ditambahkan pada tahap ini.
