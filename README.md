<!-- PLATFORM-BASELINE:START -->

## SRILEXBUDITRA.WORK Platform Baseline

Platform Baseline : 2026.10.07.0006
Recorded At       : 2026-10-08 16:09:17 WIB
Timezone          : Asia/Jakarta (UTC+07:00)
Time Format       : 24-hour (HH:mm:ss)

Maintainer        : Srilex Buditra
Role              : Senior Full Stack Developer
Location          : Bengkulu, Indonesia

Changed Area      : REV21 Premium PWA Install Experience
Status            : PRODUCTION VERIFIED / COMPLETED / LOCKED

<!-- PLATFORM-BASELINE:END -->

<p align="center">
  <a href="https://srilexbuditra.work/">
    <img
      src="images/logo.avif"
      alt="Srilex Buditra"
      width="150"
    >
  </a>
</p>

<h1 align="center">Srilex Buditra</h1>

<p align="center">
  <strong>Senior Full Stack Developer</strong><br>
  Website / System Development / Digital Solution<br>
  Bengkulu, Indonesia
</p>

<p align="center">
  <strong><em>Full Stack. Full Solution. Full Impact.</em></strong>
</p>

<p align="center">
  <a href="https://srilexbuditra.work/">srilexbuditra.work</a>
</p>

---

## Tentang Repository

Repository resmi pengembangan dan dokumentasi **srilexbuditra.work**.

Srilex Buditra membangun solusi digital end-to-end melalui website profesional, web application, sistem informasi custom, REST API, database, deployment, dan cloud.

Repository ini juga menjadi tempat implementasi, studi kasus, dokumentasi engineering, serta pengembangan platform dan layanan digital yang ditampilkan melalui website publik.

## Core Capabilities

- **Professional Website & Web Application**
- **Custom Information System**
- **Frontend & Backend Development**
- **REST API & Database Integration**
- **Deployment & Cloud**
- **Client Management Platform**
- **Secure Document Verification**
- **Analytics, SEO & Accessibility**
- **Responsive Web Development**
- **Digital System Development**

## Selected Implementation

### Client Management Platform

Platform perjalanan client yang menghubungkan:

`Visitor → Lead → Konsultasi → Official Estimate → Aktivasi Client → Client Portal`

Termasuk pengalaman demo publik untuk memperlihatkan alur sistem tanpa menggunakan data produksi.

Dokumentasi: **[docs/CLIENT-MANAGEMENT.md](docs/CLIENT-MANAGEMENT.md)**

### 🌾 Program Ketahanan Pangan

**Program Ketahanan Pangan** merupakan salah satu flagship implementation yang menunjukkan integrasi beberapa layanan digital dalam penggunaan nyata.

Implementasinya mencakup portal program, pendaftaran peserta, verifikasi, akun dan dashboard peserta, kartu anggota digital + QR, sertifikat, aktivitas/event, serta dokumentasi publik.

- Portal: `/program/ketahanan-pangan/`
- Case Study: `/portfolio/ketahanan-pangan/`
- Dokumentasi Program: `/program/ketahanan-pangan/dokumentasi/`

Dokumentasi internal: **[program/ketahanan-pangan/README.md](program/ketahanan-pangan/README.md)**

### Profil & Trust Authority

Route `/profil/` menjadi identitas publik Srilex Buditra yang menampilkan capability, proof of work, implementasi pilihan, serta prinsip kepercayaan berbasis hasil kerja nyata.

Brand governance: **[docs/BRAND.md](docs/BRAND.md)**

### Knowledge Center / Insights

Route `/insights/` menjadi pusat artikel teknis dan pembelajaran dari implementasi sistem yang dikembangkan.

Platform documentation: **[docs/PLATFORM.md](docs/PLATFORM.md)**

### Development Timeline

Route `/aktivitas/` menampilkan selected development milestones dan perkembangan platform secara publik tanpa membuka secret atau data pribadi.

### Secure Document Verification

Folder `verify/` menyediakan sistem verifikasi dokumen melalui Document ID dan QR.

Dua pendekatan yang tersedia:

1. **Static registry** melalui `verify/data/documents.json`.
2. **Optional publisher API** melalui Cloudflare Worker + KV.

Panduan utama: **[verify/README.md](verify/README.md)**

Security update: **[verify/V31_PUBLISHER_SECURITY.md](verify/V31_PUBLISHER_SECURITY.md)**

## Site Content Architecture V2.01

Arsitektur konten publik srilexbuditra.work menggunakan penamaan versi per halaman agar perkembangan website mudah dilacak tanpa mencampur versi halaman dengan release teknis project.

| Halaman | Peran V2.01 |
|---|---|
| **Home V2.01** | Discovery terkurasi: live implementations, system highlights, selected project samples, dan CTA utama. |
| **Portfolio V2.01** | Pusat proof-of-work: live implementations, system case studies, dan project samples. |
| **Profil V2.01** | Authority page: identitas profesional, capability, trust principles, dan proof network. |
| **Insights V2.01** | Engineering knowledge layer: keputusan, prinsip, dan pembelajaran lintas implementasi. |
| **Aktivitas V2.01** | Public development timeline: milestone terverifikasi, status, dan perkembangan platform. |

Konvensi versioning:

- `Home V2.01`, `Portfolio V2.01`, `Profil V2.01`, `Insights V2.01`, dan `Aktivitas V2.01` adalah versi arsitektur halaman publik.
- Versi modul/project seperti `Dashboard Peserta V2`, `Umroh Platform V3.9.0`, atau versi Secure Document tetap mengikuti namespace modul masing-masing.
- Nama release teknis yang sudah sah seperti `Client Management R1` atau `Demo Login Automatic Access R2` tetap dipertahankan.
- `Cloudflare R2` berarti object storage dan bukan versi halaman.
- Historical version/release tidak boleh diubah dengan find/replace massal.

Status: **Site Content Architecture V2.01 — 5/5 AREAS COMPLETED / LOCKED**. Home V2.01, Portfolio V2.01, Profil V2.01, Insights V2.01, dan Aktivitas V2.01 seluruhnya sudah **COMPLETED / LOCKED**. Aktivitas V2.01 telah melewati Source Review, Visual Review, Controlled Commit/Push, dan Production Verification dengan production commit `4a7a31e`.

## Site Content Architecture V2.02

Status: **PRODUCTION VERIFIED / COMPLETED / LOCKED**.

Scope: **Engineering / System Highlights Expansion**.

- Site Content Architecture V2.01 tetap **5/5 AREAS COMPLETED / LOCKED**.
- Home mempertahankan tiga System Highlights existing.
- Home memiliki CTA aktif `Lihat Semua System Engineering ->` menuju `/engineering/`.
- `/engineering/` aktif sebagai pusat system capabilities + technical proof.
- Enam domain Engineering aktif.
- Home tetap discovery layer; Portfolio tetap proof-of-work; Profil tetap authority; Insights tetap engineering knowledge; Aktivitas tetap development record.
- `docs/ENGINEERING.md` tetap authority untuk governance/prinsip engineering.
- Source Review, Visual Review desktop/mobile, Controlled Staging/Commit/Push, Production Source Verification, dan Production Visual Verification telah **PASS / LOCKED**.
- Implementation commit: `bf7ac6aa2a93cb51e648d149f3cdb8762cef9092` — `feat: implement system engineering v2.02`.
- Status setelah closeout: maintenance only.
## Mengapa Memilih Saya

Status: **PRODUCTION VERIFIED / COMPLETED / LOCKED**.

Public route: `/mengapa-memilih-saya/`.

- Home menampilkan tepat 4 alasan utama dan CTA `Lihat Alasan Lengkap ->`.
- Dedicated page memperluasnya menjadi 10 alasan dan 7-step `Cara Saya Bekerja`.
- Scope ini berfungsi sebagai **client decision + trust/value layer** dan tidak menggantikan Portfolio, Profil, Insights, Aktivitas, atau System Engineering.
- Implementation commit: `80b3bb18caecc3dce72256747cdf3c9dee8aa511` - `feat: add mengapa memilih saya page`.
- Source, desktop/mobile visual, production route, scoped CSS, sitemap, dan core links telah diverifikasi.
- Site Content Architecture V2.02 tetap **PRODUCTION VERIFIED / COMPLETED / LOCKED**.

## Home Section Detail Architecture

Status: **PRODUCTION VERIFIED / COMPLETED / LOCKED**

Home Section Detail Architecture memperluas Home sebagai discovery layer tanpa membuka ulang Site Content Architecture V2.01, V2.02, atau Mengapa Memilih Saya.

Route detail:

- `/keahlian-teknis/` - teknologi dan kompetensi yang digunakan.
- `/layanan/` - layanan dan solusi digital yang dapat dibangun.
- `/proses-kerja/` - lifecycle project 7 tahap.
- `/kepercayaan-transparansi/` - komitmen, transparansi, keamanan, dokumentasi, dan keberlanjutan.
- `/engineering/` tetap menjadi Kemampuan Sistem + Technical Proof.

Revision history:

- **REVISION 1** - Initial Home Section Detail Architecture.
- **REVISION 2** - Typography Color Alignment mengikuti visual language Insights.
- **REVISION 3** - CTA Consistency menggunakan pola `btn outline`.

Implementation commit: `569edbfa899dc11d5770e75acab5a2c3c3d74a4b`.

Source, visual desktop, visual mobile, dan production verification seluruhnya **PASS / LOCKED**.

> Revision governance: setiap iterasi pengeditan menggunakan `REVISION N`. Revision number adalah nomor iterasi pekerjaan dan tidak menggantikan Platform Baseline `YYYY.MM.DD.NNNN`.

## Premium Navigation, Smart Explore & Cache Resilience

Status: **PRODUCTION VERIFIED / COMPLETED / LOCKED**

Platform Baseline: `2026.10.07.0002`

Production implementation:

- Premium experience commit: `d95f5b2dd3cc2c40a81a3b7d377186b779c77c58`
- Static asset cache-busting commit: `807dadae0560c93d79fa107cfa6f8191279d027c`

### Public Experience

- Navbar publik mempertahankan jalur ringkas: Beranda, Tentang, Layanan, Portfolio, Insights, Jelajahi, Harga, Portal, dan Hubungi Saya.
- Mega Menu `Jelajahi` menjadi discovery layer untuk Solusi, Kepercayaan, Engineering, dan Portfolio.
- Smart Explore mempertahankan pencarian publik sekaligus shortcut `Ctrl/Cmd + K`.
- Premium Footer menyediakan CTA project, navigation groups, engineering access, portfolio access, legal links, contact links, serta signature `Full Stack. Full Solution. Full Impact.`

### Revision Record

- REVISION 4: initial premium navigation attempt — **ROLLED BACK / SOURCE UNCHANGED**.
- REVISION 5: Premium Navigation + Mega Menu + Smart Explore + Premium Footer.
- REVISION 6: Premium Footer Safe Space refinement.
- REVISION 7: Static Asset Cache Busting `?v=20261007-r7`.
- REVISION 8: documentation closeout untuk baseline ini.

### Cache Resilience

Global public asset references menggunakan version token `?v=20261007-r7` untuk mencegah browser menggunakan stale stylesheet atau JavaScript dari URL asset lama.

Production verification membuktikan Home HTML menggunakan URL versioned, asset production merespons HTTP 200, key routes tetap aktif, dan visual production normal dalam kondisi browser biasa.

Protected namespaces dan seluruh scope yang sudah LOCKED tetap dipertahankan.

## Teknologi

Platform menggunakan teknologi sesuai kebutuhan masing-masing layanan:

- HTML5
- CSS3
- JavaScript
- JSON / XML
- Git & GitHub
- GitHub Pages
- Cloudflare Workers
- Cloudflare D1
- Cloudflare KV
- REST API
- Responsive Web Design
- SEO & Structured Data

> Secret, token API, kredensial database, private key, dan data pribadi tidak boleh disimpan di source code publik.

## Repository Areas

```text
.
├── portfolio/      # Portfolio & case studies
├── program/        # Implementasi program / platform
├── insights/       # Knowledge Center
├── aktivitas/      # Development Timeline
├── verify/         # Document Verification
├── workers/        # Cloudflare Worker services
├── admin/          # Administrative interfaces
├── docs/           # Master documentation
├── images/         # Brand & visual assets
├── README.md
├── CHANGELOG.md
├── SECURITY.md
├── PRIVACY.md
├── TERMS.md
├── LICENSE.md
└── CNAME
```

Untuk struktur dan dokumentasi yang lebih lengkap: **[docs/README.md](docs/README.md)**

## Dokumentasi

Dokumentasi CORE dipisahkan berdasarkan domain agar README utama tetap ringkas dan mudah dipahami.

| Dokumentasi | Fungsi |
|---|---|
| **[docs/README.md](docs/README.md)** | Indeks dokumentasi |
| **[docs/BRAND.md](docs/BRAND.md)** | Brand identity & governance |
| **[docs/CLIENT-MANAGEMENT.md](docs/CLIENT-MANAGEMENT.md)** | Client Management Platform |
| **[docs/ROADMAP.md](docs/ROADMAP.md)** | Master roadmap & continuity |
| **[docs/ENGINEERING.md](docs/ENGINEERING.md)** | Engineering & technical practices |
| **[docs/ANALYTICS.md](docs/ANALYTICS.md)** | Analytics architecture |
| **[docs/PLATFORM.md](docs/PLATFORM.md)** | Platform development |
| **[docs/REPOSITORY-AUDIT.md](docs/REPOSITORY-AUDIT.md)** | Repository & documentation audit |
| **[CHANGELOG.md](CHANGELOG.md)** | Riwayat perubahan |

## Menjalankan Secara Lokal

1. Clone atau download repository.
2. Buka project melalui local web server, misalnya Live Server.
3. Jalankan `index.html` melalui browser.
4. Gunakan HTTP server untuk menguji route dan asset path secara akurat.
5. Worker, KV, dan D1 hanya diperlukan untuk fitur yang memang menggunakan layanan tersebut.
6. Jangan memasukkan secret produksi ke repository publik.

## Unified Backup & Recovery V1.0

**Status:** APPROVED POLICY SCOPE / IMPLEMENTATION NOT STARTED.

Kebijakan ini berlaku untuk seluruh proyek srilexbuditra.work tanpa mengubah baseline production yang telah LOCKED.

- Cloudflare D1 tetap menjadi database utama aplikasi.
- Cloudflare R2 direncanakan sebagai penyimpanan utama backup terenkripsi pada bucket khusus yang privat.
- Repository GitHub PRIVATE khusus, terpisah dari repository publik website, direncanakan sebagai lokasi salinan kedua dalam bentuk arsip terenkripsi yang memenuhi batas ukuran dan kebijakan retensi GitHub.
- Kunci dekripsi dan material pemulihan wajib disimpan secara aman dan terpisah dari R2, GitHub, serta source repository.
- Perubahan data harian dilindungi melalui D1 Time Travel sesuai retensi layanan dan backup terjadwal; backup penuh setiap perubahan record tidak diasumsikan tersedia.
- Sebelum migrasi, penghapusan massal, atau perubahan berisiko, wajib ada backup atau titik pemulihan yang telah diverifikasi dan rencana rollback.
- Backup harus memiliki metadata waktu, cakupan, integritas, enkripsi, retensi, serta hasil verifikasi; pemulihan diuji secara berkala pada lingkungan terisolasi.
- Backup database D1 tidak otomatis mencakup dokumen atau media dalam bucket R2 aplikasi; perlindungan objek R2 harus dirancang terpisah.
- SQL mentah, data pribadi, token, password, dan secret tidak boleh dimasukkan ke repository GitHub publik maupun ke backup GitHub tanpa enkripsi.
- Restore production memerlukan otorisasi dan pemeriksaan target; tidak ada restore otomatis yang diizinkan.
- Otomasi R2, GitHub, backup, dan restore belum diterapkan atau diverifikasi. Tidak boleh diklaim aktif sebelum pengujian selesai.

Rincian arsitektur, roadmap implementasi, dan governance mengikuti docs/PLATFORM.md, docs/ROADMAP.md, serta docs/README.md.

## Security, Privacy & Legal

Keamanan, privasi, aksesibilitas, dan penggunaan source mengikuti dokumen resmi repository:

- **[SECURITY.md](SECURITY.md)**
- **[PRIVACY.md](PRIVACY.md)**
- **[TERMS.md](TERMS.md)**
- **[LICENSE.md](LICENSE.md)**
- **[NOTICE.md](NOTICE.md)**
- **[ACCESSIBILITY.md](ACCESSIBILITY.md)**

Repository publik tidak berarti seluruh source code, desain, branding, konten, atau aset bebas digunakan ulang tanpa mengikuti ketentuan yang berlaku.

## 👤 Pemilik & Pengembang

**Srilex Buditra**<br>
Senior Full Stack Developer<br>
Website / System Development / Digital Solution<br>
Bengkulu, Indonesia

🌐 **Website:** [srilexbuditra.work](https://srilexbuditra.work/)

**Full Stack. Full Solution. Full Impact.**

---

© 2026 Srilex Buditra. All Rights Reserved.

## Platform Baseline 2026.10.07.0006 - REV21 Premium PWA Install Experience

Status: **PRODUCTION VERIFIED / COMPLETED / LOCKED**

Runtime production anchor:

`f941709dd3c1ca16629488e4cceb1c10080bde69`

Parent baseline: `2026.10.07.0005`

Closeout ini mencatat:

- **REV21 - Premium PWA Install Experience** - custom install card premium aktif pada homepage.
- Chromium install lifecycle menggunakan `beforeinstallprompt` dan `appinstalled`.
- Android real-device production installation: **PASS / USER CONFIRMED**.
- Home-screen app icon: **PASS**.
- Post-install hidden state: **PASS**.
- iOS/iPadOS Add to Home Screen guidance: **LOCAL VERIFIED**.
- Maskable PNG 512x512 ditambahkan.
- Source Review: **PASS**.
- Local visual + interaction verification: **PASS**.
- Production desktop visual verification: **PASS**.
- Privacy/TTS overlap correction: **PASS**.
- Runtime scope tepat 5 file.
- Global `style.css` tidak diubah.
- Global `script.js` tidak diubah.
- Service Worker tidak ditambahkan.
- Backend, API, D1, dan Worker tidak dibuka atau diubah.
- CSP policy tidak diubah atau dilemahkan.
- Documentation closeout tidak mengubah runtime source.

Platform Baseline `2026.10.07.0005` tetap dipertahankan sebagai historical locked baseline.

Next planned revision: **REV22 - Web Push & Notification Subscription - PLANNED / NOT LIVE**.

## Platform Baseline 2026.10.07.0005 - REV20 UX & Content Alignment

Status: **PRODUCTION VERIFIED / COMPLETED / LOCKED**

Runtime production anchor:

`38d1c02139b20bd7ff739684f3d0733817914a8e`

Parent baseline: `2026.10.07.0004`

Closeout ini mencatat:

- **REV20 - Mobile Portfolio Alignment** - hero visual pada `/portfolio/umroh-semi-private-bengkulu/` dan `/portfolio/client-management-platform/` disejajarkan pada mobile melalui scoped styling tanpa mengubah desktop layout.
- **REV20 - Portal Login/Register Navigation UX** - `/portal/` dan `/portal/register/` memiliki secondary reciprocal navigation agar pengguna dapat berpindah antara login dan registrasi/konsultasi tanpa mengubah authentication/backend flow.
- **REV20 - Home Portal & Konsultasi Copy** - copy dua kartu diperjelas untuk membedakan pengguna yang sudah memiliki akun Portal dengan calon pengguna yang memulai konsultasi.
- **REV20 - Professional Identity Alignment** - visible homepage identity diselaraskan menjadi `Srilex Buditra - Senior Full Stack Developer Bengkulu`.
- Source Review: **PASS**.
- Local desktop/mobile visual verification: **PASS**.
- Production desktop/mobile visual verification: **PASS / USER CONFIRMED**.
- Runtime implementation dibatasi tepat pada 9 file yang disetujui.
- Global `style.css` tidak diubah.
- `portfolio/case-study.css` tidak diubah.
- `portal/register/register.js` tidak diubah.
- Backend, D1, dan Worker tidak dibuka atau diubah.
- CSP policy tidak diubah atau dilemahkan.
- PWA dan Service Worker belum dibuka pada REV20.
- Local HEAD, `origin/main`, dan GitHub `main` terverifikasi pada runtime anchor REV20 dengan ahead/behind `0 0`.

Platform Baseline `2026.10.07.0004` tetap disimpan sebagai historical locked baseline.

Next planned revision: **REV21 - Premium PWA Install Experience - PLANNED / NOT LIVE**.

## Platform Baseline 2026.10.07.0004 — Portal Demo CSP Compatibility & Visual Parity

Status: **PRODUCTION VERIFIED / COMPLETED / LOCKED**

Runtime production anchor:

`475618f96100fbfd0cede52352afc335eff6feec`

Parent baseline: `2026.10.07.0003`

Closeout ini mencatat:

- **REVISION 17** — cache-busting asset Portal Demo pada route register, login, Lead Demo, dan Client Demo; implementation commit `ade066995ad40e725daec9892a247e5ad668a1ce`.
- **REVISION 17.1** — Lead Demo CSP compatibility; dynamic stylesheet dipindahkan ke stylesheet eksternal; production desktop/mobile **PASS**; commit `36a173d7d265092e2be42f946c807b06150e58ee`.
- **REVISION 18** — Client Demo CSP compatibility + visual parity; modal, header CTA, mobile navigation, dan progress 82% tervalidasi pada localhost dan production; commit `475618f96100fbfd0cede52352afc335eff6feec`.
- Strict production CSP tetap dipertahankan dan tidak dilemahkan.
- Global stylesheet tidak diubah oleh REVISION 18.
- Perubahan dibatasi pada Portal Demo yang disetujui; area program dan source lain di luar scope tetap dipertahankan.

Platform Baseline `2026.10.07.0003` tetap disimpan sebagai historical locked baseline.

## Platform Baseline 2026.10.07.0003 — FAQ Architecture + Mobile Footer

Status: **PRODUCTION VERIFIED / COMPLETED / LOCKED**

Runtime production anchor:

`68c89f9a6fb4c6dd2ab389619c3a4026cdb07368`

Baseline ini menutup:

- **REVISION 9** — Mobile Footer + FAQ Architecture.
- **REVISION 10** — FAQ Typography Color Alignment.
- **REVISION 11** — failed closeout attempt / rolled back / source unchanged.
- **REVISION 12** — documentation closeout implementation / source review refinement.
- **REVISION 13** — documentation metadata + Markdown refinement / source review.
- **REVISION 14** — failed validation attempt / rolled back.
- **REVISION 15** — failed validator-scope attempt / rolled back.
- **REVISION 16** — scoped Markdown token correction / final documentation closeout.
- Home FAQ sebanyak 6 pertanyaan bernilai tinggi.
- Dedicated `/faq/` dengan 16 pertanyaan dalam 8 kategori.
- Canonical dan `FAQPage` structured data pada dedicated FAQ.
- Mobile footer phone layout 2 kolom × 2 baris untuk empat grup navigasi.
- Brand footer tetap full width.
- Footer safe-space untuk Audio / Privasi dipertahankan.
- Tipografi FAQ mengikuti visual Insights.
- Search dan sitemap mengenali `/faq/`.
- Public stylesheet menggunakan `?v=20261007-r9`.
- Protected namespaces `program/*` dan `portal/*` tidak disentuh.
- `script.js` dan `search-enhancer.js` tidak berubah.

Platform Baseline 2026.10.07.0003 menggantikan 2026.10.07.0002 sebagai baseline aktif setelah REVISION 16 documentation closeout.

## Site Publishing Architecture - Verified 2026-10-09

**Main website:** https://srilexbuditra.work/ is published through GitHub Pages with Cloudflare DNS/proxy.

**Staging website:** https://staging.srilexbuditra.work/ uses Cloudflare Pages project srilexbuditra-github-io.

- Source repository: srilexbuditra/srilexbuditra.github.io.
- Publishing source branch: main.
- GitHub Pages and Cloudflare Pages can both publish automatically following changes to main.
- Cloudflare Pages project Production environment is separate from the main public website served via GitHub Pages.
- REV21 production baseline remains LOCKED.
- REV22 Web Push remains DEPLOYMENT HOLD.
- Unified Backup & Recovery V1.0 remains a documented policy; backup automation is not yet active.

Technical architecture, DNS evidence, security boundaries, and deployment governance are maintained in docs/PLATFORM.md and docs/ROADMAP.md.
