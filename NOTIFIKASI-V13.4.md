# Notifikasi & Informasi Peserta — V13.4.0

**Tanggal:** 13 September 2026  
**Route:** `/program/ketahanan-pangan/peserta/notifikasi/`

## Tujuan

V13.4 menambahkan Pusat Notifikasi & Informasi agar peserta dapat melihat pembaruan penting dari satu tempat tanpa mengubah modul yang sudah stabil.

## Sumber Notifikasi

Notifikasi server dapat dibuat dari:

- status Registrasi Terverifikasi;
- status VERIFIED MEMBER;
- penambahan Poin Misi;
- Referral Terverifikasi / Poin Referral;
- Poin Aktivitas/Event;
- perubahan level/benefit yang terbuka;
- agenda/event yang dipublikasikan;
- katalog Marketplace yang dipublikasikan;
- pengumuman program melalui tabel announcement yang disiapkan untuk pengembangan berikutnya.

## Endpoint Peserta

- `GET /notifications`
- `POST /notifications/read`

Semua endpoint memerlukan session peserta aktif.

## Penyimpanan

Worker membuat tabel secara otomatis:

- `participant_notifications`
- `participant_announcements`

Status dibaca tersimpan di server dan tetap berlaku setelah refresh atau login ulang.

## Keamanan

Pusat Notifikasi tidak menampilkan atau meminta password, OTP, PIN, NIK lengkap, nomor KK, dokumen identitas, atau pembayaran.

## Batas Tahap Ini

- Belum ada Push Notification browser/device.
- Belum ada email/WhatsApp otomatis.
- Belum ada halaman Admin untuk membuat announcement.
- Announcement table hanya disiapkan sebagai fondasi; pengelolaan admin dapat dibahas terpisah.

## File Frontend

- `program/ketahanan-pangan/peserta/index.html`
- `program/ketahanan-pangan/peserta/script.js`
- `program/ketahanan-pangan/peserta/style.css`
- `program/ketahanan-pangan/peserta/marketplace/index.html`
- `program/ketahanan-pangan/peserta/marketplace/style.css`
- `program/ketahanan-pangan/peserta/notifikasi/index.html`
- `program/ketahanan-pangan/peserta/notifikasi/script.js`
- `program/ketahanan-pangan/peserta/notifikasi/style.css`

## Prinsip Stabilitas

Kartu Anggota + QR, safe-area 5 mm, Verifikasi Anggota + Foto, Sertifikat, Level/Poin, Misi, Referral, Benefit, Aktivitas/Event, Marketplace, registrasi, Admin, D1, R2, serta alur autentikasi tidak diubah secara fungsional oleh V13.4.
