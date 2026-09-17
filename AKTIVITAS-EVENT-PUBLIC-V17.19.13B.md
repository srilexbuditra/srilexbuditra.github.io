# AKTIVITAS & EVENT — PUBLIC INTEGRATION V17.19.13B

**Dokumentasi sinkron:** 17 September 2026  
**Status implementasi:** aktif / pre-lock  
**Status verifikasi akhir:** OG/WhatsApp Preview, Schema.org Event, dan GA4 Event Analytics masih perlu diuji sebelum baseline Event dinyatakan LOCK.

## Tujuan
Dokumen ini melanjutkan baseline historis `AKTIVITAS-EVENT-V13.2.md` dan `AKTIVITAS-EVENT-ADMIN-V13.2.1.md`. Fokusnya adalah integrasi lengkap antara Dashboard Admin, Dashboard Peserta, gambar Event, URL publik, halaman detail publik, SEO, dan presentasi konten Event.

## Prinsip Utama
- Event dibuat dan dikelola oleh Admin, bukan oleh peserta.
- Event berstatus `draft` tidak menjadi agenda publik aktif.
- Event berstatus `published` dapat ditampilkan kepada peserta dan dibuka melalui URL publik berbasis slug.
- Syarat Event dapat memakai level minimum dan VERIFIED MEMBER.
- Mendaftar Event tidak langsung memberikan poin.
- Poin Aktivitas hanya diberikan setelah kehadiran berstatus **Hadir Terverifikasi** / `attended`.
- Data pribadi peserta tidak dimasukkan ke halaman Event publik, metadata sosial, atau Schema.org Event.

## Route Utama
- Dashboard Admin: `/program/ketahanan-pangan/admin/`
- Aktivitas & Event Peserta: `/program/ketahanan-pangan/peserta/aktivitas/`
- Detail Event Publik: `/program/ketahanan-pangan/event/<slug>/`
- Health Public Event Worker: `/program/ketahanan-pangan/event/health`

## Dashboard Admin
Admin dapat:
- membuat Event sebagai Draft,
- mengedit data Event,
- mengatur jadwal pendaftaran dan pelaksanaan,
- mengatur kuota, minimal level, syarat VERIFIED MEMBER, dan Poin Kehadiran,
- mempublikasikan atau mengembalikan Event ke Draft,
- menutup atau membatalkan Event,
- melihat peserta terdaftar,
- memverifikasi kehadiran,
- menyalin URL publik,
- membuka halaman publik,
- mengelola gambar utama dan metadata SEO Event.

Tidak ada penghapusan permanen melalui alur utama Admin agar riwayat Event tetap dapat diaudit.

## SEO & Tampilan Publik
Bagian Edit Event menyediakan:
- Slug URL,
- Judul SEO,
- Meta Description,
- Gambar Utama Event,
- Alt Text Gambar,
- kontrol index/noindex sesuai status publikasi.

Canonical URL dibuat dari slug publik dan tidak perlu diketik ulang sebagai field terpisah.

### Gambar Utama Event
Patokan visual yang digunakan:
- rasio sekitar `1.91:1`,
- rekomendasi `1200 × 630 px`,
- format AVIF/WebP/JPG/PNG,
- batas upload aplikasi maksimal 2 MB.

Gambar disimpan pada R2 binding `EVENT_IMAGES`, terpisah dari penyimpanan dokumen privat peserta.

## Public Event Worker
Worker publik Event melayani route:

`srilexbuditra.work/program/ketahanan-pangan/event/*`

Binding yang digunakan:
- `REGISTRATION_DB` — D1 Program Ketahanan Pangan.
- `EVENT_IMAGES` — R2 gambar Event.

Public Event Worker dipisahkan dari Worker Event Admin agar halaman publik dan API Admin tidak bercampur.

## Public Event Page
Halaman publik Event menampilkan:
- identitas Program Ketahanan Pangan,
- gambar utama,
- judul Event,
- tanggal dan waktu,
- lokasi/mode pelaksanaan,
- syarat level,
- kuota,
- Poin Kehadiran,
- Ringkasan lengkap,
- aksi Daftar/Cek Status Event,
- aksi Bagikan, Bagikan ke WhatsApp, dan Salin Link.

## Rich Summary
Kolom Ringkasan pada Admin tetap menjadi satu sumber konten. Pada halaman publik, Markdown sederhana dirender menjadi tampilan baca yang lebih rapi:
- `##` / `###` → heading,
- `**teks**` → bold,
- baris kosong → pemisah paragraf,
- bullet sederhana → daftar.

Kartu Admin dan kartu Dashboard Peserta tidak menampilkan seluruh naskah; keduanya memakai ringkasan pendek agar layout tetap ringkas.

## Dashboard Peserta
Peserta dapat melihat:
- Agenda Tersedia,
- Event Terdaftar,
- status kehadiran,
- Poin Aktivitas,
- gambar Event,
- ringkasan singkat,
- tombol Lihat Detail menuju halaman publik.

Hak pendaftaran tetap mengikuti syarat Event seperti level minimum dan VERIFIED MEMBER.

## Kehadiran & Poin Aktivitas
Status kehadiran utama:
- `registered`,
- `attended`,
- `no_show`.

Saat status menjadi `attended`, Worker merekonsiliasi Poin Aktivitas ke ledger dengan sumber Event. Jika kehadiran dikoreksi dari `attended`, poin Event harus ikut dikoreksi agar Total Poin konsisten.

## Keamanan & Privasi
- Peserta tidak dapat menandai dirinya sendiri sebagai hadir melalui endpoint peserta.
- Worker/Admin tetap menjadi sumber otorisasi untuk perubahan status kehadiran.
- Gambar Event publik dipisahkan dari bucket dokumen identitas peserta.
- Halaman publik tidak menampilkan NIK, nomor KK, KTP/KK, WhatsApp, email, password, token, atau data pribadi peserta.
- Asset Public Event menggunakan same-origin CSS/JS agar kompatibel dengan CSP ketat tanpa `unsafe-inline`.

## SEO, Schema.org, dan Analytics
Implementasi Public Event sudah menyiapkan lapisan untuk:
- Open Graph / social preview,
- canonical URL,
- data Event untuk Schema.org,
- GA4 Event Analytics untuk interaksi Event.

Status dokumentasi saat ini:
- **Public route:** verified working.
- **Gambar R2:** verified working.
- **Admin → Published → Peserta → Public Page:** verified working.
- **Rich Summary:** verified working.
- **OG/WhatsApp Preview:** testing pending.
- **Schema.org Event:** testing pending.
- **GA4 Event Analytics:** testing pending.

Jangan mengubah status tiga item terakhir menjadi `verified` atau `LOCKED` sebelum pengujian produksinya selesai.

## Riwayat Tahap Implementasi
- `V17.19.12` — Event Save Changes Fix.
- `V17.19.13A` — SEO & Gambar Utama Event.
- `V17.19.13A.1` — Image Picker Hotfix.
- `V17.19.13B` — Public Event + OG + Schema.org + GA4 integration.
- `V17.19.13B.1` — Public Style/CSP + Clean Description Hotfix.
- `V17.19.13B.2` — Admin Public Link + Clean Event Card.
- `V17.19.13B.3` — Rich Summary.
- `V17.19.13B.4` — Compact Public URL.

## Baseline Sebelumnya
Dokumen berikut tetap dipertahankan sebagai histori dan tidak ditulis ulang seolah-olah sudah memiliki fitur terbaru:
- `AKTIVITAS-EVENT-V13.2.md` — baseline awal peserta.
- `AKTIVITAS-EVENT-ADMIN-V13.2.1.md` — baseline awal Admin Event.

## Langkah Berikutnya
1. Uji OG/WhatsApp Preview pada URL Event produksi.
2. Uji Schema.org Event pada halaman Event produksi.
3. Uji GA4 Event Analytics untuk view/share/registration flow yang relevan.
4. Jika seluruh pengujian lulus, ubah status dokumentasi menjadi **Verified / Stable / LOCKED** dan catat hasil final pada `CHANGELOG.md`.
