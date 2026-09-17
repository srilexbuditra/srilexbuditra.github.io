# Program Ketahanan Pangan — Digital Platform

Folder ini berisi ekosistem digital Program Ketahanan Pangan yang berjalan di bawah `srilexbuditra.work`.

Tujuan arsitektur folder adalah menjaga layanan peserta, administrasi, dokumentasi, dan aset program tetap terstruktur tanpa mengganggu website portfolio utama.

## Route Utama

| Area | Path | Fungsi |
|---|---|---|
| Portal Program | `/program/ketahanan-pangan/` | Pintu masuk layanan peserta. |
| Registrasi | `/program/ketahanan-pangan/registrasi/` | Pendaftaran dan pendataan peserta/usaha tani. |
| Verifikasi | `/program/ketahanan-pangan/verifikasi/` | Pemeriksaan status pendaftaran. |
| Akun Peserta | `/program/ketahanan-pangan/peserta/` | Aktivasi/login dan Dashboard Peserta V2. |
| Verifikasi Anggota + Foto | `/program/ketahanan-pangan/peserta/verifikasi-anggota/` | Rekam foto kamera untuk review manual VERIFIED MEMBER; authenticated/noindex. |
| Kartu Anggota Digital | `/program/ketahanan-pangan/peserta/kartu/` | Kartu anggota + QR hanya setelah member verification disetujui; authenticated/noindex. |
| Sertifikat Publik | `/program/ketahanan-pangan/verifikasi/sertifikat/` | Verifikasi sertifikat peserta melalui route publik. |
| Aktivitas & Event Peserta | `/program/ketahanan-pangan/peserta/aktivitas/` | Agenda resmi, pendaftaran event, status kehadiran, riwayat aktivitas, dan Poin Aktivitas. |
| Detail Event Publik | `/program/ketahanan-pangan/event/<slug>/` | Halaman publik dinamis untuk event yang dipublikasikan, termasuk gambar, detail, dan aksi berbagi. |
| Dokumentasi | `/program/ketahanan-pangan/dokumentasi/` | Dokumentasi publik sistem/program. |
| Admin | `/program/ketahanan-pangan/admin/` | Area administrasi; bukan konten publik untuk indexing. |

Flagship case study berada terpisah di:

`/portfolio/ketahanan-pangan/`

## Struktur Penting

```text
ketahanan-pangan/
├── index.html
├── assets/
│   ├── brand/
│   ├── portal.css
│   └── aset visual program
├── registrasi/
├── verifikasi/
│   └── sertifikat/
├── peserta/
│   ├── kartu/
│   └── aktivitas/
├── peserta-worker/
├── dokumentasi/
├── dokumen/
└── admin/
```

## Journey Peserta

Alur publik dirancang sebagai:

**Portal → Registrasi → Verifikasi → Aktivasi/Login → Dashboard Peserta → Kartu Anggota / Sertifikat / Aktivitas & Event sesuai status**

Tidak semua fitur roadmap harus dianggap sudah live. Status fitur harus mengikuti implementasi yang benar-benar tersedia pada source dan deployment.

## Branding & Peran

Identitas program dan organisasi terkait harus ditampilkan sesuai peran aktual. Srilex Buditra ditempatkan sebagai **Pengembangan Sistem & Dukungan Teknologi** pada bagian yang relevan, bukan sebagai pengganti identitas organisasi program.

## Keamanan & Privasi

- Area admin harus tetap dipisahkan dari halaman publik.
- Jangan menyimpan secret/token pada repository atau JavaScript client-side.
- Jangan mempublikasikan NIK, nomor KK, KTP/KK, password, token, atau data pribadi peserta.
- Statistik publik di masa depan harus menggunakan data agregat dan tidak mengidentifikasi peserta.
- Perubahan frontend harus dilakukan tanpa merusak API, autentikasi, registrasi, verifikasi, dashboard, dan sertifikat yang sudah berfungsi.

## Dokumentasi Modul

- [registrasi/README.md](registrasi/README.md)
- [registrasi/README-V7-UPLOAD.md](registrasi/README-V7-UPLOAD.md)
- [dokumentasi/README-INSTALL.md](dokumentasi/README-INSTALL.md)
- [../../AKTIVITAS-EVENT-PUBLIC-V17.19.13B.md](../../AKTIVITAS-EVENT-PUBLIC-V17.19.13B.md)

## Roadmap

Roadmap tingkat website/program dikelola pada:

`/ROADMAP-SRILEXBUDITRA-2026-2027.md`

Fondasi Trust & Authority, Knowledge Center, Timeline publik, dan Search Console monitoring sudah dibangun. Fase pengalaman anggota pada repository saat ini telah mencakup **Dashboard Peserta V2, Verifikasi Anggota + Foto, Kartu Anggota Digital + QR, Sertifikat QR, Level/Poin, Misi, Referral, Benefit, Aktivitas & Event, Marketplace, serta Notifikasi & Informasi**. Event kini dapat dikelola dari Dashboard Admin, dipublikasikan dengan gambar dan slug publik, ditampilkan pada Dashboard Peserta, serta dibuka melalui halaman detail publik yang dilayani Cloudflare Worker. Implementasi OG/WhatsApp, Schema.org Event, dan GA4 Event Analytics masih menjalani pengujian akhir sebelum baseline Public Event di-LOCK. Arah milestone berikut mengikuti keputusan tim dan roadmap aktif.
