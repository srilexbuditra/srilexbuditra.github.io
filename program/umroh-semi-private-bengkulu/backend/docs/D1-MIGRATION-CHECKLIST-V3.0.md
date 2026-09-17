# D1 Migration Checklist — V3.0

Gunakan checklist ini sebelum dan sesudah menjalankan migration.

## Sebelum deploy

- [ ] Buat D1 database khusus Umroh atau pastikan binding database yang dipilih memang untuk platform Umroh.
- [ ] Jangan gunakan database Ketahanan Pangan sebagai tabel campuran tanpa keputusan arsitektur eksplisit.
- [ ] Backup / export database jika database sudah memiliki data.
- [ ] Pastikan nama migration: `001_auth_foundation.sql`.
- [ ] Pastikan Worker secret belum disimpan di repository.
- [ ] Pastikan tidak ada password/token/kode aktivasi nyata di SQL.

## Saat deploy

Jalankan migration melalui Cloudflare D1 tooling/dashboard yang Anda gunakan.

Setelah migration, verifikasi tabel:

- [ ] `umroh_accounts`
- [ ] `umroh_jamaah_profiles`
- [ ] `umroh_activation_codes`
- [ ] `umroh_sessions`
- [ ] `umroh_progress_items`
- [ ] `umroh_document_status`
- [ ] `umroh_agenda_events`
- [ ] `umroh_agenda_reads`
- [ ] `umroh_announcements`
- [ ] `umroh_announcement_reads`

## Uji minimal

- [ ] Insert 1 akun jemaah simulasi.
- [ ] Insert 1 akun admin simulasi.
- [ ] Foreign key profile → account bekerja.
- [ ] Unique member number bekerja.
- [ ] Unique progress item mencegah duplikasi account/module/item.
- [ ] Session token hash unique.
- [ ] Agenda read tidak bisa ganda untuk account + agenda yang sama.
- [ ] Announcement read tidak bisa ganda untuk account + announcement yang sama.

## Setelah berhasil

Jangan langsung memindahkan login frontend.

Tahap berikutnya adalah membuat Worker API V3.1:

- `POST /auth/activate`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

Setelah endpoint auth lulus uji, baru sinkronisasi progress dipindahkan dari localStorage ke API.
