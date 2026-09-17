# Backend & Auth Foundation V3.0

Status: **DESIGN LOCK CANDIDATE — belum di-deploy ke D1**

Dokumen ini mendefinisikan fondasi backend untuk Digital Platform
**Umroh Semi Private Bengkulu** setelah Frontend Foundation V2.5.1 stabil.

## Tujuan

Backend V3.0 akan mengubah progress yang saat ini tersimpan lokal di browser
menjadi data yang terkait dengan akun jemaah dan dapat dibuka dari perangkat lain.

Urutan implementasi yang dikunci:

1. Akun & Session
2. Aktivasi pertama
3. Login / Logout
4. Sinkronisasi Manasik
5. Sinkronisasi Checklist
6. Sinkronisasi status Dokumen
7. Sinkronisasi Agenda dibaca
8. Sinkronisasi Pengumuman dibaca
9. Data operasional Admin
10. Upload dokumen privat — **belum dikerjakan pada fase ini**

## Login Jemaah

Jemaah dapat menggunakan salah satu identitas yang tersedia:

- Nomor Jemaah
- Email
- Nomor WhatsApp

Akun awal berada pada status `pending_activation`.

Aktivasi pertama menggunakan kode aktivasi sekali pakai. Setelah kode valid,
jemaah membuat password sendiri.

Password tidak pernah disimpan dalam bentuk teks biasa.

## Login Admin

Admin menggunakan halaman login terpisah pada area `/admin/`.

Role awal:

- `super_admin`
- `admin`
- `tour_leader`
- `pendamping`

Role dapat dipersempit lagi saat Worker dan dashboard operasional mulai diimplementasikan.

## Session

Session menggunakan cookie:

- `HttpOnly`
- `Secure`
- `SameSite=Lax`
- masa berlaku terbatas

Browser hanya menerima cookie session. Token mentah tidak disimpan di localStorage.

Database hanya menyimpan **hash token session**.

## Struktur tabel V3.0

### `umroh_accounts`
Identitas akun, role, login identifier, hash password, dan status akun.

### `umroh_jamaah_profiles`
Profil operasional jemaah yang tidak perlu dicampur dengan data autentikasi.

### `umroh_activation_codes`
Hash kode aktivasi, waktu kedaluwarsa, status penggunaan, dan jumlah percobaan gagal.

### `umroh_sessions`
Hash session token, masa berlaku, revoke, dan last seen.

### `umroh_progress_items`
Progress granular Manasik dan Checklist.

### `umroh_document_status`
Status kesiapan dokumen dari sisi jemaah dan verifikasi dari sisi admin.
**Tidak menyimpan file dokumen.**

### `umroh_agenda_events`
Sumber agenda operasional yang nantinya menggantikan data simulasi frontend.

### `umroh_agenda_reads`
Status agenda yang sudah dibaca per jemaah.

### `umroh_announcements`
Sumber pengumuman operasional.

### `umroh_announcement_reads`
Status pengumuman yang sudah dibaca per jemaah.

## Progress keseluruhan

Formula frontend V2.5.1 tetap digunakan:

- Manasik: 35%
- Checklist: 35%
- Dokumen siap: 20%
- Agenda dibaca: 10%

Pengumuman tidak menjadi bobot progress kesiapan.

Setelah backend aktif, perhitungan mengambil data akun dari API, bukan localStorage.

## Batas keamanan fase V3.0

Fase ini **tidak** melakukan:

- upload paspor;
- upload identitas;
- upload dokumen kesehatan;
- penyimpanan file pribadi di repository;
- penyimpanan token autentikasi di localStorage;
- penyimpanan password mentah;
- penyimpanan kode aktivasi mentah.

Upload dokumen privat baru dirancang setelah autentikasi, session, RBAC, dan storage privat lulus uji.
