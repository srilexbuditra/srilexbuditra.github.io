# Srilex Buditra Platform

> Dokumentasi platform publik srilexbuditra.work.
> Mencakup Knowledge Center / Insights dan Development Timeline / Activity.

## Current Platform Principles

- Konten publik harus dapat dihubungkan dengan implementasi atau proof-of-work yang nyata.
- Bedakan dengan jelas fitur live, implementasi terdokumentasi, dan roadmap.
- Informasi sensitif, credential, secret, dan data pribadi tidak boleh dipublikasikan.
- Insights berfungsi sebagai knowledge layer, bukan dokumentasi operasional sensitif.
- Development Timeline menampilkan milestone terpilih, bukan seluruh log internal.
- Internal search, sitemap, metadata, dan navigasi harus tetap sinkron dengan route publik.

## Public Routes

- `/insights/` - Knowledge Center / Insights hub.
- `/aktivitas/` - Development Timeline / Activity.

## Knowledge Center — Historical Foundation V11.9

# Knowledge Center V11.9 — Insights & Engineering Notes

**Tanggal:** 13 September 2026
**Status:** Implemented — foundation

## Tujuan

Knowledge Center memperkuat Trust & Authority srilexbuditra.work melalui artikel teknis yang berasal dari implementasi nyata. Konten tidak diposisikan sebagai klaim marketing semata, tetapi sebagai penjelasan keputusan, prinsip, dan pengalaman pengembangan yang dapat dilihat hubungannya dengan flagship project.

## Route Publik

- `/insights/` — hub Knowledge Center.
- `/insights/membangun-alur-digital-peserta/`
- `/insights/qr-verification-sertifikat-digital/`
- `/insights/responsive-first-portal-peserta/`

## Integrasi

- Homepage menampilkan tiga kartu Insight dan CTA menuju Knowledge Center.
- Footer homepage memiliki link ke `/insights/`.
- Internal search index mengenali hub dan tiga artikel awal.
- Sitemap mencantumkan seluruh route Knowledge Center.
- Setiap artikel menggunakan metadata Article dan menghubungkan author ke `/profil/`.

## Prinsip Editorial

1. Bedakan fitur **live**, **implementasi yang terdokumentasi**, dan **roadmap**.
2. Jangan mempublikasikan secret, token, credential, NIK, KK, KTP, nomor WhatsApp, atau data pribadi peserta.
3. Artikel harus mengutamakan pembelajaran teknis dan pengalaman implementasi, bukan klaim yang tidak dapat diverifikasi.
4. Hubungkan artikel ke case study, profil, kebijakan privasi/keamanan, atau halaman publik yang relevan.
5. Jangan menjadikan artikel sebagai dokumentasi operasional yang memuat detail sensitif.

## Scope V11.9

V11.9 hanya menambah Knowledge Center, internal discovery, dan dokumentasi pendukung. Tidak mengubah API, Worker, registrasi, verifikasi, dashboard peserta/admin, sertifikat, atau data peserta.


---

## Development Timeline — Historical Foundation V12.0

# PROJECT TIMELINE / ACTIVITY — V12.0

**Status:** Implemented
**Tanggal:** 13 September 2026
**Public route:** `/aktivitas/`

## Tujuan

Tahap ini menambahkan rekam jejak perkembangan publik agar srilexbuditra.work tidak hanya menunjukkan hasil akhir, tetapi juga memperlihatkan proses pengembangan yang terstruktur, bertahap, dan terdokumentasi.

Timeline publik tidak dimaksudkan sebagai log internal lengkap. Informasi sensitif, secret, credential, dan data pribadi peserta tidak ditampilkan.

## Implementasi

- Menambahkan halaman publik `/aktivitas/`.
- Menambahkan selected public milestones dari performance, verification, analytics, flagship implementation, Trust & Authority, Documentation Sync, dan Knowledge Center.
- Menambahkan status yang eksplisit: `COMPLETED`, `LIVE SYSTEM`, dan `ROADMAP`.
- Menambahkan section ringkas Development Timeline & Activity pada homepage.
- Menambahkan route ke internal search dan sitemap.
- Menambahkan link Development Timeline pada footer homepage.

## Prinsip Editorial

1. Hanya menampilkan milestone yang dapat dijelaskan berdasarkan implementasi/repository.
2. Fitur roadmap tidak boleh ditulis seolah-olah sudah live.
3. Tidak menampilkan NIK, nomor KK, dokumen identitas, token, credential, atau data peserta.
4. Tanggal digunakan untuk milestone yang memang tercatat; fase yang berlangsung bertahap dapat menggunakan label bulan/periode.
5. Timeline harus menjadi proof-of-work, bukan klaim berlebihan.

## Next

Setelah timeline publik stabil, prioritas berikutnya adalah monitoring discoverability/Search Console dan persiapan **Fase 3 — Pengalaman Anggota**, dimulai dari Dashboard V2 dan Kartu Anggota + QR.


---

## Maintenance Rules

- Jangan menulis roadmap seolah-olah sudah live.
- Jangan mempublikasikan data pribadi atau credential.
- Artikel Insights harus menekankan pembelajaran dan implementasi yang dapat diverifikasi.
- Timeline publik harus tetap menjadi proof-of-work terkurasi.
- Status platform aktif mengikuti source/runtime terbaru, bukan bagian Next dari snapshot versi lama.
- Dokumen versi lama tetap tersedia melalui Git history.
