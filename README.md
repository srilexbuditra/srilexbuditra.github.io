# Srilex Buditra — Professional Full Stack Developer Portfolio

Website portfolio profesional **Srilex Buditra** yang berfungsi sebagai pusat personal branding, layanan pengembangan web, portfolio, studi kasus, estimasi biaya proyek, dan verifikasi dokumen.

**Current documentation baseline:** V11.6  
**Website:** https://srilexbuditra.work

## ✨ Fitur Utama

- Desain responsif untuk desktop, tablet, dan mobile.
- Portfolio dan project showcase dengan studi kasus terpisah.
- Project Cost Estimator dengan keluaran Print/PDF A4.
- Tanda tangan penyedia dan klien pada dokumen estimasi.
- Informasi rekening pembayaran resmi pada dokumen estimasi.
- Secure Document / Document Verification berbasis QR.
- Registry verifikasi statis melalui `verify/data/documents.json`.
- Publisher API opsional menggunakan Cloudflare Worker + KV.
- QR generator lokal melalui `local-qrcode.js` tanpa ketergantungan CDN untuk alur utama dokumen.
- Pencarian internal, search suggestions, history, trending search, dan dukungan keyboard/ARIA.
- Text-to-Speech (TTS).
- SEO on-page, canonical URL, OpenSearch, sitemap, robots directives, dan structured data.
- Halaman legal, privasi, keamanan, aksesibilitas, serta audit repository publik.

## 🧱 Teknologi

Project utama menggunakan arsitektur frontend statis dan layanan pendukung ringan:

- HTML5
- CSS3
- JavaScript
- JSON / XML
- GitHub Pages
- Cloudflare Worker + KV untuk publisher/verifikasi otomatis (opsional)

Tidak ada secret admin atau kredensial database yang boleh disimpan di JavaScript publik.

## 📁 Struktur Project Utama

```text
.
├── index.html
├── 404.html
├── search.html
├── style.css
├── script.js
├── tts.js
├── search.js
├── search-enhancer.js
├── search-index.json
├── local-qrcode.js
├── sitemap.xml
├── robots.txt
├── opensearch.xml
│
├── assets/
├── images/
├── portfolio/
│   ├── aplikasi-pos/
│   ├── sistem-administrasi/
│   └── website-sekolah/
│
├── verify/
│   ├── index.html
│   ├── verify.html
│   ├── invalid.html
│   ├── publisher.html
│   ├── config.js
│   ├── data/documents.json
│   ├── worker/
│   │   ├── worker.js
│   │   └── wrangler.toml
│   ├── README.md
│   └── V30_VERIFICATION_SETUP.md
│
├── README.md
├── DOCUMENTATION.md
├── CHANGELOG.md
├── SECURITY.md
├── PRIVACY.md
├── TERMS.md
├── LICENSE.md
├── NOTICE.md
├── ACCESSIBILITY.md
├── PUBLIC_REPOSITORY_AUDIT.md
├── AUDIT_MENENGAH_V11.6.md
└── CNAME
```

Daftar dokumentasi teknis dan historis yang lebih lengkap tersedia di **[DOCUMENTATION.md](DOCUMENTATION.md)**.

## 🧮 Project Cost Estimator & Print/PDF

Estimator proyek pada website menyediakan alur pengisian kebutuhan proyek dan dokumen estimasi yang dapat dicetak/disimpan sebagai PDF A4. Pengembangan modul ini mencakup layout mobile, privacy consent, tanda tangan klien/penyedia, header branding resmi, informasi pembayaran, serta perbaikan konsistensi hasil print.

Riwayat perubahan implementasi dicatat di **[CHANGELOG.md](CHANGELOG.md)** dan dokumentasi teknis terkait di **[DOCUMENTATION.md](DOCUMENTATION.md)**.

## 🔐 Secure Document & Verification

Folder `verify/` menyediakan sistem pemeriksaan keaslian dokumen melalui ID dokumen/QR.

Dua mode yang tersedia:

1. **Static registry** — data dokumen disimpan pada `verify/data/documents.json` dan dapat digunakan langsung di GitHub Pages.
2. **Automatic publisher API** — menggunakan Cloudflare Worker + KV untuk penerbitan/verifikasi otomatis.

Panduan teknis:

- [verify/README.md](verify/README.md)
- [verify/V30_VERIFICATION_SETUP.md](verify/V30_VERIFICATION_SETUP.md)
- [VERIFY_DATABASE_README.md](VERIFY_DATABASE_README.md)

> Jangan menaruh API secret, admin token, atau kredensial KV/database di repository publik atau JavaScript sisi klien.

## 🔎 Search, SEO & Accessibility

Website menyediakan pencarian internal dengan suggestions, history/trending search, navigasi keyboard, dan atribut ARIA. Discoverability didukung oleh metadata halaman, canonical URL, structured data, sitemap, robots directives, OpenSearch, dan internal search index.

Komitmen dan catatan aksesibilitas tersedia di **[ACCESSIBILITY.md](ACCESSIBILITY.md)**.

## 🚀 Menjalankan Secara Lokal

1. Clone atau download repository.
2. Buka folder project.
3. Jalankan melalui local web server, misalnya Live Server.
4. Buka `index.html` melalui browser.
5. Untuk menguji alur verifikasi statis, buka halaman di folder `verify/` melalui server lokal, bukan hanya `file://`.
6. Cloudflare Worker/KV hanya diperlukan jika mode publisher API otomatis digunakan.

## 📚 Dokumentasi

Gunakan dokumen berikut sebagai titik awal:

- **[DOCUMENTATION.md](DOCUMENTATION.md)** — indeks seluruh dokumentasi aktif dan historis.
- **[CHANGELOG.md](CHANGELOG.md)** — riwayat versi dan perubahan.
- **[SECURITY.md](SECURITY.md)** — kebijakan keamanan dan pelaporan kerentanan.
- **[PRIVACY.md](PRIVACY.md)** — kebijakan privasi.
- **[TERMS.md](TERMS.md)** — ketentuan penggunaan.
- **[LICENSE.md](LICENSE.md)** — ketentuan lisensi.

## 🔐 Keamanan

Informasi pelaporan kerentanan tersedia di **[SECURITY.md](SECURITY.md)**. Jangan mempublikasikan kerentanan keamanan sebelum memberikan waktu yang wajar untuk evaluasi dan perbaikan.

## 📜 Lisensi

Source code, desain, branding, konten, dan aset tertentu dalam repository dilindungi oleh ketentuan lisensi proyek. Repository publik tidak berarti seluruh isi proyek bebas digunakan ulang, disalin, atau didistribusikan tanpa izin.

Baca **[LICENSE.md](LICENSE.md)** dan **[NOTICE.md](NOTICE.md)** untuk detail.

## 👤 Pemilik & Pengembang

**Srilex Buditra**  
Full Stack Developer  
Website: https://srilexbuditra.work

---

© 2026 Srilex Buditra. All Rights Reserved.
