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

<!-- CONTINUITY-REV22-R37:START -->
## Continuity Pengembangan Terkini — 9 Oktober 2026

- **Aturan wajib:** pengembangan `srilexbuditra.work` selalu dilanjutkan dari kondisi produksi terakhir yang **stabil, teruji, dan terverifikasi**; **jangan mengulang pekerjaan dari awal**.
- **Current verified application baseline:** Git `main` commit `ec12c92` — **REV22 R3.7 Unified Visitor Experience, FINAL / LOCKED**.
- **Protected:** REV21 Premium PWA Install Experience dan fungsi Web Push yang telah terverifikasi; perubahan baru tidak boleh merusak fitur yang sudah LOCKED.
- **Pengalaman pengunjung:** Privasi & Analitik → ajakan Web Push → ajakan instalasi PWA; Translate browser tetap independen. Uji visual selesai pada Cloudflare Pages dan `https://srilexbuditra.work/`.
- **Ketika memulai pekerjaan baru:** verifikasi `main`, source/runtime, status Git dan dokumen aktif; rencanakan perubahan minimal dengan pengujian hanya pada scope terdampak.
- **Dokumentasi:** perbarui Markdown master yang **sudah ada**, khususnya `docs/ROADMAP.md` sebagai sumber continuity. Jangan membuat file `.md` baru tanpa persetujuan khusus.
- Catatan baseline REV21 bertanggal sebelumnya tetap merupakan **riwayat sah**, bukan pengganti checkpoint R3.7 yang lebih baru.
<!-- CONTINUITY-REV22-R37:END -->
<!-- OG-INTERNAL-ROADMAP-V1:START -->
## Pekerjaan Berikutnya - Internal Page OG + Banner (Direncanakan)

- **Status:** APPROVED SCOPE / DOCUMENTATION BASELINE ONLY; implementasi aset dan HTML **BELUM DIMULAI**.
- Target: halaman publik internal yang dituju dari homepage, di luar seluruh `/program/`. Lengkapi banner yang benar-benar belum ada, OG preview AVIF **1024 x 1536 portrait**, nama file mengikuti **judul halaman**, dan metadata lengkap tanpa mengganti aset/fitur yang sudah PASS.
- Urutan terkunci: inventaris dan gap sekali -> mapping judul + aset -> desain/gambar batch -> banner scoped -> metadata scoped -> targeted QA -> controlled release -> final verified closeout.
- **Dokumen utama:** [`docs/ROADMAP.md`](docs/ROADMAP.md); spesifikasi teknis [`docs/PLATFORM.md`](docs/PLATFORM.md). Catat progress hanya pada file `.md` EXISTING.
- **Protected:** REV21, REV22 R3.7 (`ec12c92`), status dokumentasi `cc1c73e`, visual master homepage, program, Worker, D1, API, PWA, Push, Privasi, dan Translate; jangan mengulang pekerjaan yang telah terverifikasi.
<!-- OG-INTERNAL-ROADMAP-V1:END -->

<!-- OG40-GATE8-FINAL-R40:START -->
## OG40 — Status Terbaru (Gate 8)

- **Status:** PRODUCTION VERIFIED / COMPLETED / LOCKED — Gate 8 (2026-10-11); deployment `4930704` verified.
- **Coverage sebelumnya:** R15 local 40/40 PASS dan R16 production 40/40 PASS.
- **Visual:** perbaikan responsif telah dipublikasikan pada commit `8d1b99a`.
- **CSP:** inline CSS Client Management dipindahkan ke stylesheet eksternal melalui commit `4930704`.
- **Sumber status:** [docs/ROADMAP.md](docs/ROADMAP.md); teknis: [docs/PLATFORM.md](docs/PLATFORM.md).
- Bagian perencanaan OG internal sebelumnya dipertahankan sebagai riwayat Gate 0; status terkini mengikuti Gate 8.
<!-- OG40-GATE8-FINAL-R40:END -->

<!-- SITEMAP-V12-R48-GSC:START -->
## Sitemap V12 dan Google Search Identity - Final Production Checkpoint

- **Status:** PRODUCTION VERIFIED / COMPLETED / LOCKED untuk Sitemap V12 dan publikasi identitas `WebSite.name`; tindak lanjut recrawl Google masih menunggu.
- **Baseline Git:** `4e18095` (`feat: publish sitemap v12 image gallery and website identity`), branch `main`; keempat GitHub Actions untuk commit ini telah sukses.
- **Sitemap resmi:** [`/sitemap.xml`](https://srilexbuditra.work/sitemap.xml) mencakup **60 URL dan 61 referensi gambar**, termasuk **12 gambar dari `media-umroh.srilexbuditra.work`**; 7 nilai `lastmod` lama dipertahankan.
- **Visual sitemap:** `/sitemap-v12.xsl` + `/sitemap-v12.css`, tema navy-gold, gambar tidak dipotong; kartu **dua kolom pada HP dan tablet** dengan judul satu baris.
- **Identitas Google:** `WebSite.name = Srilex Buditra` memakai Microdata yang sudah ada. Judul SEO homepage tetap `Srilex Buditra | Senior Full Stack Developer Bengkulu`; `Person` tidak diubah.
- **Google Search Console (12 Okt 2026):** sitemap terdaftar dengan status Success (pembacaan terakhir 6 Okt: 53 discovered pages); homepage sudah indexed, Live URL Test PASS, dan Request Indexing diterima. Belum ada bukti Google telah membaca ulang nama situs terbaru.
- **Dokumen master:** [`docs/ROADMAP.md`](docs/ROADMAP.md) untuk status/lanjutan dan [`docs/PLATFORM.md`](docs/PLATFORM.md) untuk spesifikasi. OG40 tetap terkunci pada checkpoint `b8fe124` dan tidak diulang.
<!-- SITEMAP-V12-R48-GSC:END -->


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

## Checkpoint Identitas Profesional â€” 12 Oktober 2026

<!-- SRILEXBUDITRA-SENIOR-TITLE-2026-10-12-BEGIN -->
**Status: PRODUCTION VERIFIED / LOCKED (cakupan terverifikasi).** Identitas profesional aktif situs adalah **Senior Full Stack Developer**, menggantikan label lama **Full Stack Developer** pada lokasi yang disepakati. Baseline source sebelum pencatatan dokumentasi ini: commit `8207ffee435a83e4ff0614f394bd32ec4df75a76` (`main` = `origin/main`, working tree CLEAN ketika Gate 15 selesai).

Cakupan perubahan yang sudah dipublikasikan: 37 HTML (72 penggantian); `search-index.json` (3); satu dokumentasi frontend Umroh `AUTH-API-V3.1.md` (1); dua PDF Pembagian Peran Ketahanan Pangan (masing-masing 1); dan `opensearch.xml` (2 metadata). Validasi produksi mencakup sampel halaman HTML dan indeks pencarian, dua URL PDF (SHA-256 cocok dengan commit), serta `opensearch.xml` (HTTP 200, Description/Tags baru, URL search tetap).

Perubahan dilakukan tanpa menyunting CSS, JavaScript, Worker, D1, maupun logika autentikasi pada rangkaian commit ini. Riwayat Markdown lama sengaja dipertahankan; GitHub Wiki terpisah, aset biner yang tidak diaudit isinya, dan keluaran PDF runtime **belum** termasuk jaminan audit menyeluruh. Rincian teknis dan commit terdapat pada [CHANGELOG.md](CHANGELOG.md), [docs/PLATFORM.md](docs/PLATFORM.md), dan [docs/ROADMAP.md](docs/ROADMAP.md).
<!-- SRILEXBUDITRA-SENIOR-TITLE-2026-10-12-END -->

<!-- DPN-DOC-BASELINE-V1-20261014:README.md:START -->

## SRILEXBUDITRA DIGITAL PARTNER NETWORK — Master Baseline V1.0 (14 Oktober 2026)

**Status:** KONSEP DISETUJUI / DOKUMENTASI AWAL; implementasi belum dimulai; aplikasi `network.srilexbuditra.work` masih usulan. Catatan ini tidak menyatakan fitur Network telah aktif.

**Tujuan:** platform terpisah bagi Admin Network, mitra, dan pelanggan untuk pemasaran jasa website, terutama paket khusus UMKM, dengan website personal mitra, prospek, proyek, pembayaran, dan dukungan.

**Batas keselamatan:** website utama, `/portal/` Client Portal existing, fitur produksi terkunci (termasuk OG40 dan REV21/REV22), Worker/D1, serta konfigurasi deployment existing tidak boleh berubah akibat pencatatan atau implementasi Network. Tidak mengulang pengujian modul existing yang sudah terverifikasi kecuali perubahan baru terbukti berdampak padanya.

**Arsitektur pilihan:** aplikasi Network mandiri (subdomain masih rencana), login, Worker, D1, penyimpanan privat, aset CSS dan rilis terisolasi; pengembangan server lokal, commit/push branch bertahap, staging tersendiri, persetujuan sebelum rilis produksi.

**Aturan permanen:** seluruh teks UI dan dokumentasi berbahasa Indonesia; tema Premium Digital Blue; CSS modular per fungsi/komponen dengan tipografi dan jarak adaptif HP/tablet/laptop/desktop; hanya memperbarui file `.md` existing pada lokasi semula, tanpa membuat atau memindahkan file `.md` baru.

**Keputusan produk ringkas:** website publik personal mitra; dashboard mitra privat (promosi/referral, jaringan, WhatsApp pribadi yang dapat diedit dan diverifikasi, prospek, rekening, komisi dan pencairan); beranda dan dashboard pelanggan tersendiri; dashboard Admin Network; katalog UMKM terpisah dari katalog utama dan dapat diatur Admin (nama, harga, fitur, masa promo, estimasi mulai/durasi, termin uang muka); metadata/OG/QR setiap halaman publik; formulir serta pembayaran bertahap; status proyek, revisi, refund dan sengketa.

**Dokumen identitas:** tidak menggunakan KK. Identitas berfoto resmi yang diterima (contoh KTP/SIM) sesuai kebijakan, rekam foto wajah secara aman bila diperlukan, verifikasi rekening; NPWP digunakan untuk keperluan perpajakan jika relevan. Data sensitif tidak dipublikasikan.

**Bonus jaringan berjenjang:** merupakan kebutuhan produk yang pengguna minta tetap aktif pada tujuan akhir. Struktur Level 1, 2, 3, dan seterusnya serta simulasi mesin bonus dicakup. Pembayaran bonus nyata belum boleh diaktifkan sebelum kelayakan model usaha, ketentuan hukum, dan perizinan ditelaah secara profesional. Tidak ada imbalan hanya karena merekrut anggota.

**Catatan pekerjaan:** desain mockup Dashboard Admin, Mitra, dan Pelanggan telah dibuat sebagai referensi percakapan, belum diterapkan atau diverifikasi lintas perangkat pada aplikasi. Catatan hukum dan kebijakan layanan V1.0 masih draf untuk peninjauan sebelum dipublikasikan.

**Titik lanjut:** lihat `docs/ROADMAP.md` untuk Gate 0–6, `docs/PLATFORM.md` untuk batas arsitektur, `CHANGELOG.md` untuk riwayat. Baseline Git yang dibaca pada 14 Oktober 2026: branch `main`, HEAD `e977fc4`, working tree CLEAN. Periksa ulang status Git sebelum perubahan apa pun. Tahap berikut: review serta commit pembaruan dokumentasi existing, kemudian finalisasi desain/arsitektur; bukan langsung deploy.

<!-- DPN-DOC-BASELINE-V1-20261014:README.md:END -->

<!-- DPN-GATE1-NETWORK-PATH-20261015:START -->
### DPN Gate 1 - Keputusan URL terbaru (15 Oktober 2026)

Keputusan terbaru menggantikan usulan subdomain dalam baseline Gate 0:
- URL aplikasi yang direncanakan: `https://srilexbuditra.work/network/`.
- Subdomain `network.srilexbuditra.work` tidak lagi menjadi target implementasi.
- Network merupakan modul baru dengan Worker, D1, autentikasi, dan pengelolaan data tersendiri.
- Client Portal `/portal/`, `/program/`, serta REV21/REV22 tetap dilindungi dan tidak diubah.
- Status: dokumentasi arsitektur; halaman `/network/` belum dibuat, dan tampilan 404 saat ini sesuai kondisi proyek.
- Semua pengembangan tetap melalui branch `main`, dengan verifikasi sebelum rilis.

Bagian ini merupakan keputusan terbaru yang mengesampingkan alamat usulan pada catatan Gate 0, tanpa menghapus riwayatnya.
<!-- DPN-GATE1-NETWORK-PATH-20261015:END -->
