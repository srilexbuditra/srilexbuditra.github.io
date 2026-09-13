# AKTIVITAS & EVENT — ADMIN V13.2.1

## Tujuan
Tahap pendamping V13.2.0 untuk mengelola event resmi langsung dari Dashboard Admin tanpa mengubah alur registrasi peserta, verifikasi foto, sertifikat, anti-duplikasi, atau Excel A4 V45.

## Hak akses
- `super_admin`: dapat melihat dan mengelola event serta kehadiran.
- `admin`: dapat melihat dan mengelola event serta kehadiran.
- `pemasaran`: modul pengelolaan event tidak ditampilkan dan endpoint menolak akses.

Otorisasi ditegakkan kembali pada Worker Event Admin, bukan hanya pada UI.

## Endpoint Event Admin
- `GET /events`
- `POST /events`
- `GET /events/{event_id}`
- `POST /events/{event_id}/update`
- `POST /events/{event_id}/status`
- `GET /events/{event_id}/registrations`
- `POST /events/{event_id}/registrations/{registration_id}/attendance`
- `GET /events/health`

## Siklus status event
- `draft` — belum tampil kepada peserta.
- `published` — tampil pada halaman Aktivitas & Event peserta.
- `closed` — event ditutup dan tidak lagi tampil sebagai agenda aktif.
- `cancelled` — event dibatalkan.

Tidak ada penghapusan permanen melalui dashboard agar riwayat tetap dapat diaudit.

## Kehadiran dan poin
Status kehadiran yang dikelola admin:
- `registered`
- `attended`
- `no_show`

Saat status menjadi `attended`, Worker mencatat Poin Aktivitas ke `participant_points_ledger` dengan `source_key = event_attendance:<event_id>`.

Jika status dikoreksi kembali menjadi `registered` atau `no_show`, entri poin event tersebut dihapus sehingga Total Poin tetap konsisten.

## Arsitektur deployment
Worker Event Admin dipasang sebagai route khusus pada hostname Admin API:

`admin-api.srilexbuditra.work/events*`

Route khusus ini berjalan di depan Custom Domain Admin API yang sudah ada. Dengan begitu:
- Worker Admin API utama tidak perlu diganti.
- Fitur registrasi, foto anggota, sertifikat, akun/role, anti-duplikasi, dan ekspor tetap memakai Worker yang sudah stabil.
- Cookie session `kp_admin_session` tetap dikirim karena hostname tidak berubah.
- Hanya request `/events*` yang diarahkan ke Worker Event Admin V13.2.1.

## Binding
Worker Event Admin hanya memerlukan D1 binding yang sama:
- `REGISTRATION_DB`

Tidak memerlukan R2.

## Status
V13.2.1 menambahkan:
- form pembuatan draft event,
- edit event,
- publish / kembali draft / tutup / batalkan,
- ringkasan event,
- daftar peserta per event,
- verifikasi hadir / tidak hadir,
- sinkronisasi Poin Aktivitas,
- audit action jika tabel audit tersedia.
