# Srilex Buditra — Professional Full Stack Developer Portfolio

Website profesional **Srilex Buditra** yang berfungsi sebagai pusat personal branding, layanan pengembangan web, portfolio, studi kasus, profil publik, estimasi biaya proyek, verifikasi dokumen, serta dokumentasi implementasi sistem digital.

**Documentation baseline:** V12.0 — Development Timeline / Activity  
**Current public direction:** Flagship Project + Trust & Authority + Knowledge Center + Public Development Timeline  
**Website:** https://srilexbuditra.work

## ✨ Fitur Utama

- Desain responsif untuk desktop, laptop, tablet, dan mobile.
- Halaman **Profil & Rekam Jejak** pada `/profil/` untuk identitas publik, capability map, proof of work, dan trust principles.
- **Knowledge Center / Insights** pada `/insights/` untuk artikel teknis berbasis implementasi nyata.
- **Development Timeline & Activity** pada `/aktivitas/` untuk selected public milestones dan status pengembangan yang transparan.
- **Program Ketahanan Pangan** sebagai flagship implementation di homepage dan case study publik pada `/portfolio/ketahanan-pangan/`.
- Portal Program Ketahanan Pangan yang menghubungkan registrasi, verifikasi, akun peserta/dashboard, sertifikat QR, dan dokumentasi.
- Portfolio dan selected project samples dengan studi kasus terpisah.
- Project Cost Estimator dengan keluaran Print/PDF A4.
- Tanda tangan penyedia dan klien pada dokumen estimasi.
- Secure Document / Document Verification berbasis QR.
- Registry verifikasi statis melalui `verify/data/documents.json`.
- Publisher API opsional menggunakan Cloudflare Worker + KV.
- QR generator lokal melalui `local-qrcode.js` untuk alur utama dokumen.
- Pencarian internal, search suggestions, history, trending search, dan dukungan keyboard/ARIA.
- Text-to-Speech (TTS).
- Analytics V4 berbasis Cloudflare Workers + D1 dengan visitor ID anonim dan dashboard admin terproteksi.
- SEO on-page, canonical URL, OpenSearch, sitemap, robots directives, dan structured data.
- Halaman legal, privasi, keamanan, aksesibilitas, serta audit repository publik.

## 🧱 Teknologi

Project utama menggunakan frontend statis dan layanan pendukung berbasis edge/cloud sesuai kebutuhan:

- HTML5
- CSS3
- JavaScript
- JSON / XML
- GitHub Pages
- Cloudflare Workers
- Cloudflare KV untuk publisher/verifikasi tertentu
- Cloudflare D1 untuk Analytics V4 dan layanan yang memang menggunakan D1

> Secret admin, token API, kredensial database, private key, dan data pribadi peserta tidak boleh disimpan di JavaScript publik atau repository.

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
├── profil/
│   ├── index.html
│   └── profile.css
│
├── insights/
│   ├── index.html
│   ├── insights.css
│   └── [artikel]/index.html
│
├── aktivitas/
│   ├── index.html
│   └── activity.css
│
├── portfolio/
│   ├── ketahanan-pangan/
│   │   ├── index.html
│   │   ├── case-study.css
│   │   └── assets/
│   ├── aplikasi-pos/
│   ├── sistem-administrasi/
│   └── website-sekolah/
│
├── program/
│   ├── README.md
│   └── ketahanan-pangan/
│       ├── index.html                 # Portal program
│       ├── registrasi/                # Pendaftaran peserta
│       ├── verifikasi/                # Cek status + sertifikat publik
│       ├── peserta/                   # Login/aktivasi/dashboard peserta
│       ├── dokumentasi/               # Dokumentasi publik program
│       ├── admin/                     # Area administrasi
│       ├── peserta-worker/            # Source/deployment helper layanan peserta
│       ├── dokumen/                   # Dokumen publik terkait program
│       └── assets/
│
├── admin/
│   ├── stats.html
│   ├── stats.css
│   └── stats.js
│
├── verify/
│   ├── index.html
│   ├── verify.html
│   ├── invalid.html
│   ├── config.js
│   ├── data/documents.json
│   ├── worker/
│   ├── README.md
│   ├── V30_VERIFICATION_SETUP.md
│   └── V31_PUBLISHER_SECURITY.md
│
├── README.md
├── DOCUMENTATION.md
├── DOCUMENTATION_AUDIT_V11.8.md
├── CHANGELOG.md
├── ROADMAP-SRILEXBUDITRA-2026-2027.md
├── TRUST-AUTHORITY-V8.md
├── KNOWLEDGE-CENTER-V11.9.md
├── PROJECT-TIMELINE-V12.0.md
├── ANALYTICS-V4.md
├── SECURITY.md
├── PRIVACY.md
├── TERMS.md
├── LICENSE.md
├── NOTICE.md
├── ACCESSIBILITY.md
└── CNAME
```

Daftar dokumentasi aktif dan historis tersedia di **[DOCUMENTATION.md](DOCUMENTATION.md)**.

## 🌾 Flagship — Program Ketahanan Pangan

Program Ketahanan Pangan menjadi flagship implementation karena menunjukkan penggunaan sistem nyata yang melibatkan beberapa modul digital yang saling terhubung.

Titik masuk utama:

- Portal program: `/program/ketahanan-pangan/`
- Registrasi: `/program/ketahanan-pangan/registrasi/`
- Verifikasi: `/program/ketahanan-pangan/verifikasi/`
- Akun peserta: `/program/ketahanan-pangan/peserta/`
- Sertifikat publik: `/program/ketahanan-pangan/verifikasi/sertifikat/`
- Dokumentasi: `/program/ketahanan-pangan/dokumentasi/`
- Case study: `/portfolio/ketahanan-pangan/`

Dokumentasi internal folder program tersedia di **[program/ketahanan-pangan/README.md](program/ketahanan-pangan/README.md)**.

## 👤 Trust & Authority

Halaman `/profil/` memperkuat identitas publik Srilex Buditra melalui profil, kemampuan teknis, proof of work, flagship implementation, dan prinsip kepercayaan. Tahap ini tidak dimaksudkan untuk membuat klaim berlebihan; reputasi dibangun melalui implementasi yang dapat dilihat, dokumentasi, keamanan, dan konsistensi pengalaman pengguna.

Dokumentasi tahap: **[TRUST-AUTHORITY-V8.md](TRUST-AUTHORITY-V8.md)**.

## 🧠 Knowledge Center / Insights

Route `/insights/` menjadi pusat artikel teknis Srilex Buditra yang membahas keputusan dan pelajaran dari implementasi nyata. Artikel awal mencakup perjalanan digital peserta, QR verification/sertifikat digital, dan responsive-first pada portal peserta.

Dokumentasi tahap: **[KNOWLEDGE-CENTER-V11.9.md](KNOWLEDGE-CENTER-V11.9.md)**.

## 🧭 Development Timeline / Activity

Route `/aktivitas/` merangkum selected public milestones perkembangan srilexbuditra.work dengan status yang jelas antara completed, live system, dan roadmap. Halaman ini menjadi proof-of-work tambahan tanpa membuka secret atau data pribadi.

Dokumentasi tahap: **[PROJECT-TIMELINE-V12.0.md](PROJECT-TIMELINE-V12.0.md)**.

## 🧮 Project Cost Estimator & Print/PDF

Estimator proyek menyediakan alur pengisian kebutuhan project dan dokumen estimasi yang dapat dicetak/disimpan sebagai PDF A4. Pengembangan modul mencakup layout mobile, privacy consent, tanda tangan klien/penyedia, header branding, informasi pembayaran, serta konsistensi hasil print.

Riwayat perubahan dicatat di **[CHANGELOG.md](CHANGELOG.md)**.

## 🔐 Secure Document & Verification

Folder `verify/` menyediakan sistem pemeriksaan keaslian dokumen melalui ID dokumen/QR.

Dua mode yang tersedia:

1. **Static registry** — data dokumen disimpan pada `verify/data/documents.json`.
2. **Automatic publisher API** — menggunakan Cloudflare Worker + KV untuk penerbitan/verifikasi otomatis sesuai konfigurasi deployment.

Panduan teknis:

- [verify/README.md](verify/README.md)
- [verify/V30_VERIFICATION_SETUP.md](verify/V30_VERIFICATION_SETUP.md)
- [verify/V31_PUBLISHER_SECURITY.md](verify/V31_PUBLISHER_SECURITY.md)
- [VERIFY_DATABASE_README.md](VERIFY_DATABASE_README.md)

## 🔎 Search, SEO & Accessibility

Website menyediakan pencarian internal dengan suggestions, history/trending search, navigasi keyboard, dan atribut ARIA. Discoverability didukung metadata halaman, canonical URL, structured data, sitemap, robots directives, OpenSearch, serta internal search index.

Komitmen aksesibilitas tersedia di **[ACCESSIBILITY.md](ACCESSIBILITY.md)**.

## 📊 Analytics V4

Analytics V4 menggunakan Cloudflare Workers + D1 dan visitor ID anonim pada browser untuk membedakan kunjungan baru dan kembali tanpa mengambil identitas akun sosial secara tersembunyi. Dashboard statistik tersedia pada `admin/stats.html`; kredensial akses harus tetap berada di secret server/Worker, bukan source publik.

Dokumentasi teknis: **[ANALYTICS-V4.md](ANALYTICS-V4.md)**.

## 🚀 Menjalankan Secara Lokal

1. Clone atau download repository.
2. Jalankan folder project melalui local web server, misalnya Live Server.
3. Buka `index.html` melalui browser.
4. Untuk menguji route direktori dan asset path, gunakan HTTP server lokal, bukan hanya `file://`.
5. Worker/KV/D1 hanya diperlukan untuk fitur yang memang bergantung pada layanan tersebut.
6. Jangan memasukkan secret produksi ke repository lokal yang akan dipublikasikan.

## 📚 Dokumentasi

Gunakan dokumen berikut sebagai titik awal:

- **[DOCUMENTATION.md](DOCUMENTATION.md)** — indeks dokumentasi aktif dan referensi.
- **[DOCUMENTATION_AUDIT_V11.8.md](DOCUMENTATION_AUDIT_V11.8.md)** — audit dokumentasi terbaru.
- **[CHANGELOG.md](CHANGELOG.md)** — histori perubahan.
- **[ROADMAP-SRILEXBUDITRA-2026-2027.md](ROADMAP-SRILEXBUDITRA-2026-2027.md)** — prioritas pengembangan.
- **[SECURITY.md](SECURITY.md)** — kebijakan keamanan.
- **[PRIVACY.md](PRIVACY.md)** — kebijakan privasi.
- **[TERMS.md](TERMS.md)** — ketentuan penggunaan.
- **[LICENSE.md](LICENSE.md)** — ketentuan lisensi.

## 🔐 Keamanan

Informasi pelaporan kerentanan tersedia di **[SECURITY.md](SECURITY.md)**. Jangan mempublikasikan kerentanan keamanan sebelum memberikan waktu yang wajar untuk evaluasi dan perbaikan.

## 📜 Lisensi

Source code, desain, branding, konten, dan aset tertentu dilindungi oleh ketentuan lisensi proyek. Repository publik tidak berarti seluruh isi bebas digunakan ulang, disalin, atau didistribusikan tanpa izin.

Baca **[LICENSE.md](LICENSE.md)** dan **[NOTICE.md](NOTICE.md)**.

## 👤 Pemilik & Pengembang

**Srilex Buditra**  
Full Stack Developer  
Website: https://srilexbuditra.work

---

© 2026 Srilex Buditra. All Rights Reserved.
