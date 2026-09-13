# VERIFIED MEMBER + Foto — V12.3

Status: Implementasi siap diuji.

## Tujuan

Membedakan **registrasi terverifikasi** dari **keanggotaan VERIFIED MEMBER**.

VERIFIED MEMBER hanya aktif jika:

1. status registrasi peserta `verified`;
2. peserta login dan merekam foto setengah badan langsung dari kamera pada halaman Verifikasi Anggota;
3. peserta memberikan persetujuan penggunaan foto untuk identitas anggota;
4. foto disimpan secara private;
5. admin melakukan review manual dan memilih `approved`.

Tidak ada pencocokan wajah biometrik otomatis.

## Alur

`Registrasi verified → Rekam Foto Kamera → Pending Review → Admin Approve → VERIFIED MEMBER → Kartu Anggota + QR`

Jika admin menolak foto:

`Rejected → Catatan Admin → Rekam Ulang → Pending Review`

## Data

Tabel D1: `participant_member_verifications`

Foto tidak disimpan di D1. D1 hanya menyimpan object key private R2 dan metadata status/review.

## Endpoint Peserta

- `GET /member-verification`
- `POST /member-photo`
- `GET /member-photo`

Semua endpoint membutuhkan session peserta aktif. Upload foto hanya diperbolehkan bila status registrasi sudah `verified`.

## Endpoint Admin

- `GET /member-verifications`
- `GET /member-verifications/{registrationId}`
- `GET /member-verifications/{registrationId}/photo`
- `POST /member-verifications/{registrationId}/review`

Endpoint review hanya untuk Super Admin/Admin melalui mekanisme authorization existing.

## Privasi

- Foto disimpan di R2 private `REGISTRATION_DOCUMENTS`.
- Foto tidak dimasukkan ke QR.
- Foto tidak membawa NIK, KK, WhatsApp, email, password, atau token.
- Role Pemasaran tidak diberi akses ke endpoint foto anggota.
- Kartu menampilkan foto hanya setelah status member `approved`.
