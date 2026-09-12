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
