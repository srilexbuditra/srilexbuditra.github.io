# Authentication & Backend Architecture — Draft V1

Status: **Rancangan awal, belum diimplementasikan**

## Tujuan

Menghubungkan Dashboard Jemaah dan Admin ke akun nyata sehingga progress Manasik, Checklist, Agenda, Dokumen, dan Pengumuman tidak lagi hanya tersimpan pada satu browser/perangkat.

## Prinsip

1. Frontend V2.5.1 dipertahankan; backend harus mengikuti UX yang sudah stabil.
2. Data sensitif tidak disimpan pada HTML/JS publik atau repository.
3. Session menggunakan cookie aman `HttpOnly`, `Secure`, dan `SameSite` yang sesuai.
4. Password tidak pernah disimpan dalam bentuk plaintext.
5. Role Admin dan Jemaah dipisahkan dengan pemeriksaan izin di backend, bukan hanya menyembunyikan menu di frontend.
6. Upload dokumen pribadi baru diaktifkan setelah storage privat, autentikasi, otorisasi, logging, dan aturan retensi tersedia.

## Arsitektur yang disarankan

```text
Browser Jemaah / Admin
        |
        v
Static Frontend — srilexbuditra.work
        | HTTPS
        v
Umroh API (Cloudflare Worker)
        |
        +--> D1: akun, profil, progress, agenda, pengumuman, status dokumen
        |
        +--> Private object storage (fase upload dokumen; belum V1)
```

## Tahap implementasi yang disarankan

### Fase A — Akun & Session

- Login Jemaah
- Login Admin
- Logout
- Endpoint `GET /me`
- Session expiry
- Role/permission guard

### Fase B — Sinkronisasi Progress

Pindahkan data lokal secara bertahap ke akun:

- Manasik progress
- Checklist status
- Agenda read status
- Dokumen readiness status
- Pengumuman read status

Saat login pertama setelah backend aktif, frontend dapat menawarkan migrasi progress lokal ke akun tanpa menghapus data lokal sebelum server mengonfirmasi penyimpanan berhasil.

### Fase C — Data Operasional Admin

- Publikasi agenda resmi
- Publikasi pengumuman resmi
- Status dokumen dari pengelola
- Ringkasan kesiapan jemaah

### Fase D — Upload Dokumen Privat

Hanya setelah keamanan storage dan akses privat siap. Tidak boleh mengandalkan URL publik permanen.

## Tabel minimal yang direncanakan

- `users`
- `sessions`
- `jamaah_profiles`
- `manasik_progress`
- `checklist_progress`
- `agenda_items`
- `agenda_reads`
- `document_status`
- `announcements`
- `announcement_reads`
- `audit_log`

## Aturan migrasi dari localStorage

Local storage tetap menjadi fallback selama masa transisi. Setelah user login dan server mengonfirmasi data, dashboard membaca sumber server sebagai sumber utama. Konflik tidak boleh ditimpa diam-diam; gunakan aturan merge yang jelas berdasarkan status terakhir yang valid.

## Keputusan yang perlu dikunci sebelum coding

- Metode login jemaah: username/password, nomor registrasi + password, atau metode lain.
- Cara pembuatan akun jemaah.
- Role admin yang dibutuhkan.
- Masa berlaku session.
- Apakah progress dapat diedit Admin atau hanya dibaca.
- Kebijakan retensi dan akses dokumen jika upload privat diaktifkan.
