# Srilex Buditra Platform

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
## Current Production Visitor Experience — REV22 R3.7

- **Status:** 9 Oktober 2026 — production verified / FINAL / LOCKED; runtime reference commit `ec12c92` pada branch `main`.
- **Alur tampilan:** banner persetujuan Privasi & Analitik (bila belum dipilih) → Web Push opt-in (bila memenuhi syarat) → instalasi PWA (bila tersedia dan sesuai jeda); tidak ada promosi yang menimpa panel aktif.
- **Akses fitur:** Web Push dan PWA tetap dapat dikelola melalui kontrol website yang tersedia; Translate tetap fitur independen milik browser.
- **Source frontend R3.7:** `index.html`, `web-push-r1.js`, `pwa-install-r1.js`, `visitor-prompt-coordinator-r37.js`.
- **Batas perubahan:** jangan mengubah Worker Web Push, D1, VAPID/Secrets, routing REV21, service worker, atau analytics backend saat hanya memperbaiki koordinasi panel.
- **Verifikasi:** URL Cloudflare Pages dan domain utama `https://srilexbuditra.work/` telah diuji pengguna di Microsoft Edge untuk alur antarmuka; pengiriman native Web Push telah diverifikasi pada milestone sebelumnya, bukan diuji ulang pada R3.7.
- **Continuity:** lanjutkan setiap pengembangan dari baseline terverifikasi terbaru. Kebijakan lengkap: `docs/ROADMAP.md`. Pertahankan dokumentasi di file `.md` master yang sudah ada.
<!-- CONTINUITY-REV22-R37:END -->
<!-- OG-INTERNAL-ROADMAP-V1:START -->
## Active Planned Scope - Internal Page Banner & Open Graph AVIF Portrait

**Status:** DOCUMENTATION BASELINE / IMPLEMENTATION NOT STARTED. Rencana berurutan dan source of truth berada pada [`docs/ROADMAP.md`](ROADMAP.md) bagian `PROYEK AKTIF - Internal Page Banner + Open Graph Portrait AVIF`.
- Dari navigasi homepage, tetapkan sekali matriks URL valid dan gap metadata/banner. Daftar 40 URL sebelumnya hanyalah kandidat yang akan disaring; jangan mengubah halaman dengan OG dan banner yang sudah PASS.
- **Ketentuan visual:** AVIF **1024 x 1536 portrait**, nama aset dalam bentuk slug **judul halaman** (bukan `og-preview.avif` generik), style identitas homepage/master visual LOCKED dan `docs/BRAND.md`, tidak crop atau distorsi. In-page banner hanya pada halaman publik yang memang belum memilikinya.
- **Ketentuan head:** title, description, canonical, robots sesuai existing, theme color, OG image/title/description/url/type/dimensions/alt, Twitter/X, serta itemprop bila relevan; URL gambar absolut HTTPS. Verifikasi dukungan preview AVIF per platform; fallback gambar alternatif hanya jika dibutuhkan dan berbasis desain yang sama.
- **Batas:** jangan menyentuh `/program/` beserta turunannya, homepage visual master LOCKED, dashboard/auth/portal privat/noindex, atau kode REV21/REV22 R3.7. Metadata dan aset yang sudah benar dipertahankan.
- **Delivery:** source changes minimal per batch dengan backup/rollback; targeted review + staging/production verification; catat status ke Markdown yang sudah ada; tidak perlu tes ulang fitur LOCKED yang tidak terkait.
<!-- OG-INTERNAL-ROADMAP-V1:END -->

<!-- OG40-GATE8-FINAL-R40:START -->
## OG40 — Gate 8 Technical Closeout

**Stage:** PRODUCTION VERIFIED / COMPLETED / LOCKED — Gate 8.

- Public scope: 40 previously verified HTML pages and 40 unique portrait AVIF assets at 1024 x 1536.
- R15 local and R16 live validation: 40/40 PASS at earlier milestones.
- Responsive page-level changes: published commit `8d1b99a`.
- CSP hardening: original Client Management inline CSS externalized without changing CSS declarations, published commit `4930704`.
- Preserve original canonical, robots/noindex, SEO, OG and Twitter rules as previously scoped.
- Do not claim identical AVIF rendering across WhatsApp, Facebook, LinkedIn and other preview systems.
- Excluded from this closeout: `/program/`, `/portal/`, dashboards/auth, Workers, D1, API and protected infrastructure.
- Gate 8 modifies existing documentation only, not HTML/CSS/JS/AVIF.
- Latest Pages workflow `4930704` completed successfully. The live Client Management CSP regression was checked in Chrome; Gate 8 is documentation-only and LOCKED.
<!-- OG40-GATE8-FINAL-R40:END -->

<!-- SITEMAP-V12-R48-GSC:START -->
## Sitemap V12 - Technical Baseline and Google Identity

**Release:** `4e18095` on `main` (12 Oct 2026), **PRODUCTION VERIFIED / LOCKED**.

### XML and images
- URL kanonik publik resmi: `https://srilexbuditra.work/sitemap.xml`, format `<urlset>` namespace `http://www.sitemaps.org/schemas/sitemap/0.9`, dengan namespace image `http://www.google.com/schemas/sitemap-image/1.1`.
- **60 `<url><loc>`**, **61 `<image:image><image:loc>`**; gambar menggunakan `og:image` halaman yang sudah ada dan valid secara audit lokal. 12 URL gambar memakai CDN subdomain `media-umroh.srilexbuditra.work`, 2 URL gambar pada homepage, dan 7 `lastmod` asli dipertahankan. Tidak ada URL sitemap duplikat pada R47.
- XML memiliki `xml-stylesheet` ke `/sitemap-v12.xsl`. Stylesheet XSLT menghasilkan halaman galeri visual memakai `/sitemap-v12.css` (CSS eksternal, sesuai CSP); XML tetap sumber data mesin pencari, bukan HTML pengganti.
- Visual yang LOCKED: palet navy-gold, kategori publik/portfolio/insights/program, foto portrait tanpa crop (`object-fit: contain`), kartu dua kolom pada HP dan tablet (termasuk 320 px), judul satu baris ellipsis, navigasi responsif; desktop tetap grid lebar.
- `robots.txt` tetap mengiklankan sitemap utama dan sitemap khusus Ketahanan Pangan; isi `robots.txt`, `/program/`, `/portal/` dan backend **tidak dimodifikasi** dalam R47.

### Structured data / Search Console
- Homepage adalah Microdata `WebSite` yang sudah ada pada elemen root `<html>`; properti `<meta itemprop="name" content="Srilex Buditra">` di `<head>` memberi nama situs, terpisah dari judul SEO `Srilex Buditra | Senior Full Stack Developer Bengkulu`.
- `WebPage`, `Person`, profile `sameAs` GitHub/LinkedIn/ORCID, canonical, robots, title, dan homepage visual selain name meta tetap dipertahankan. JSON-LD baru dan `Organization` baru **tidak** ditambahkan.
- GitHub Actions pada `4e18095`: Pages Build/Deployment, Repository Quality, Link/Anchor/Sitemap, Public Repository Audit **4/4 success**. Tampilan publik diuji via screenshot Chrome mobile/tablet/desktop.
- Search Console: sitemap terdaftar **Success**, last read 2026-10-06 (53 discovered); homepage indexed/canonical valid, last crawl 2026-09-27; Live URL Test PASS dan Request Indexing berhasil diterima 2026-10-12. Tidak menyamakan permintaan indeks dengan recrawl atau pembaruan hasil penelusuran yang sudah terjadi.
- Validitas XML, pemuatan galeri, dan keberhasilan deploy tidak menjamin Google menampilkan gambar, site name, atau sitelinks dengan bentuk/tanggal tertentu. Diperlukan pemantauan Search Console setelah recrawl.
<!-- SITEMAP-V12-R48-GSC:END -->




> Dokumentasi platform publik srilexbuditra.work.
> Mencakup Knowledge Center / Insights, Development Timeline / Activity, System Engineering / Technical Proof, serta Public Trust / Client Decision Layer.

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
- `/engineering/` - System Engineering / Technical Proof hub.
- `/mengapa-memilih-saya/` - Public Trust / Client Decision Layer.
## Site Content Architecture V2.01 - Current Direction

**Status:** Site Content Architecture V2.01 **5/5 AREAS COMPLETED / LOCKED**; Home, Portfolio, Profil, Insights, dan Aktivitas V2.01 seluruhnya **COMPLETED / LOCKED**.

Platform publik V2.01 mempertahankan fungsi setiap halaman agar tidak menjadi duplikasi satu sama lain:

- Home V2.01: discovery dan selected proof.
- Portfolio V2.01: complete proof-of-work.
- Profil V2.01: authority dan trust.
- Insights V2.01: engineering knowledge.
- Aktivitas V2.01: verified development timeline.

### Insights V2.01

Insights V2.01 memperluas foundation V11.9 dari tiga artikel awal Ketahanan Pangan menjadi knowledge layer lintas implementasi.

Cakupan editorial Insights V2.01 yang dibangun dari implementasi dan evidence terverifikasi meliputi:

- Client Journey dan Official Estimate.
- Safe Demo vs Production Data.
- Digital Journey Jemaah Umroh.
- Document Verification as a Trust Layer.
- Privacy-Aware Visitor Analytics.
- Responsive UX dan architecture lessons dari implementasi nyata.

Artikel tidak boleh menjadi salinan Case Study. Portfolio menjelaskan apa yang dibangun; Insights menjelaskan mengapa dan bagaimana keputusan engineering dibuat.

### Aktivitas V2.01

Aktivitas V2.01 mempertahankan timeline historis V12.0 dan memperbaruinya dengan milestone yang dapat diverifikasi dari source, Git history, deployment, dan production status. Implementasi final pada commit `4a7a31e` telah melewati Source Review, Visual Review, Controlled Commit/Push, dan Production Verification; statusnya **COMPLETED / LOCKED**.

Aturan:

- Jangan menebak tanggal milestone.
- Jangan menampilkan roadmap sebagai fitur live.
- Timeline website dipisahkan dari roadmap internal Program Ketahanan Pangan atau module lain.
- Milestone Client Management, Umroh, Featured Projects, Portfolio Hub, dan Case Study baru hanya ditambahkan setelah V2 Evidence & Timeline Audit.
- `Level & Poin` tetap dapat menjadi milestone/module Program Ketahanan Pangan, tetapi tidak lagi otomatis menjadi roadmap utama seluruh srilexbuditra.work.

### Cross-Page Rule

Satu project boleh muncul pada Home, Portfolio, Profil, Insights, dan Aktivitas jika fungsi narasinya berbeda:

- Home: discovery.
- Portfolio: proof / case study.
- Profil: capability proof.
- Insights: engineering lesson.
- Aktivitas: dated milestone.

Duplikasi narasi dan card dengan fungsi identik harus dihindari.

## Site Content Architecture V2.02 - Engineering / System Highlights Expansion

**Status:** PRODUCTION VERIFIED / COMPLETED / LOCKED.

V2.02 telah diimplementasikan dan diverifikasi di production. V2.01 tetap **5/5 AREAS COMPLETED / LOCKED**.

### Public Experience

- Home mempertahankan tiga System Highlights existing.
- Home memiliki CTA aktif `Lihat Semua System Engineering ->`.
- Public route `/engineering/` aktif.
- `/engineering/` menghubungkan capability dengan technical proof yang dapat diverifikasi.

### Engineering Domains

1. Verification & Trust.
2. Digital Identity & Membership.
3. Analytics & Privacy.
4. Client Management & Workflow.
5. Backend, API & Data Architecture.
6. Cloud Deployment & Reliability.

### Responsibility

- Home tetap discovery layer.
- Portfolio tetap proof-of-work dan case study.
- Profil tetap authority layer.
- Insights tetap engineering knowledge layer.
- Aktivitas tetap development record.
- `/engineering/` menjadi capability + technical proof hub.
- `docs/ENGINEERING.md` tetap authority untuk governance/prinsip engineering.

### Verification

- Source Review: **PASS / LOCKED**.
- Desktop Visual Review: **PASS / LOCKED**.
- Mobile Visual Review: **PASS / LOCKED**.
- Controlled Staging / Commit / Push: **PASS / LOCKED**.
- Production Source Verification: **PASS / LOCKED**.
- Production Desktop / Mobile Visual Verification: **PASS / LOCKED**.
- Implementation commit: `bf7ac6aa2a93cb51e648d149f3cdb8762cef9092`.

**Implementation:** PRODUCTION VERIFIED / COMPLETED / LOCKED.

**Next:** Maintenance only; reopen only for a real regression or approved scope change.
## Mengapa Memilih Saya - Public Trust & Client Decision Layer

**Status:** PRODUCTION VERIFIED / COMPLETED / LOCKED.

Route `/mengapa-memilih-saya/` menjelaskan alasan client memilih dan bekerja langsung dengan Srilex Buditra tanpa mengambil alih fungsi halaman publik lain.

### Public Experience

- Home menampilkan 4 kartu ringkas sebagai discovery.
- CTA `Lihat Alasan Lengkap ->` menuju halaman dedicated.
- Dedicated page menampilkan 10 alasan memilih Srilex Buditra.
- `Cara Saya Bekerja` menjelaskan 7 langkah dari Analisis Kebutuhan sampai Documentation & Maintenance.

### Responsibility

- Home: discovery / entry layer.
- Portfolio: proof-of-work / case studies.
- Profil: professional authority.
- Insights: engineering knowledge.
- Aktivitas: verified development record.
- Engineering: system capabilities + technical proof.
- Mengapa Memilih Saya: client decision + trust/value layer.

### Verification

- Implementation commit: `80b3bb18caecc3dce72256747cdf3c9dee8aa511`.
- Source Review: **PASS / LOCKED**.
- Desktop Visual Review: **PASS / LOCKED**.
- Mobile Visual Review: **PASS / LOCKED**.
- Production Verification: **PASS / LOCKED**.
- Sitemap dan existing Engineering route tetap terverifikasi.
- Existing-profile cache issue terverifikasi sebagai PWA / Service Worker cache; tidak diperlukan source patch.
- Site Content Architecture V2.02 tetap **UNTOUCHED / LOCKED**.

## Home Section Detail Architecture - Current Platform Layer

**Status:** PRODUCTION VERIFIED / COMPLETED / LOCKED

### Public Experience

Home tetap berfungsi sebagai discovery layer dan kini memiliki centralized CTA menuju halaman detail untuk:

- Keahlian Teknis
- Layanan
- Proses Kerja
- Kepercayaan & Transparansi
- Kemampuan Sistem / Engineering

### Public Routes

- `/keahlian-teknis/`
- `/layanan/`
- `/proses-kerja/`
- `/kepercayaan-transparansi/`
- `/engineering/` - existing protected Engineering route; tetap menjadi System Capabilities + Technical Proof.

### Revision History

- **REVISION 1** - Initial Architecture: Home discovery CTA + empat halaman detail + shared detail stylesheet + sitemap.
- **REVISION 2** - Color Alignment: typography colors diselaraskan dengan Insights visual language.
- **REVISION 3** - CTA Consistency: centralized Home CTA diselaraskan menggunakan pola `btn outline`.

### Governance

- Script / edit iteration menggunakan `REVISION N`.
- Platform release identity tetap menggunakan `YYYY.MM.DD.NNNN`.
- `REVISION N` tidak menggantikan Platform Baseline.
- Site Content Architecture V2.01 tetap **COMPLETED / LOCKED**.
- Site Content Architecture V2.02 tetap **PRODUCTION VERIFIED / COMPLETED / LOCKED**.
- Mengapa Memilih Saya tetap **PRODUCTION VERIFIED / COMPLETED / LOCKED**.
- Engineering dan Mengapa Memilih Saya tidak dimodifikasi oleh scope ini.

### Verification

- Implementation commit: `569edbfa899dc11d5770e75acab5a2c3c3d74a4b`.
- Source Review: **PASS / LOCKED**.
- Visual Desktop: **PASS / LOCKED**.
- Visual Mobile: **PASS / LOCKED**.
- Production Verification: **PASS / LOCKED**.

## Premium Navigation, Smart Explore & Cache Resilience - Current Experience Layer

**Status:** PRODUCTION VERIFIED / COMPLETED / LOCKED

**Platform Baseline:** `2026.10.07.0002`

**Production commits:**

- Premium experience: `d95f5b2dd3cc2c40a81a3b7d377186b779c77c58`
- Static asset cache-busting: `807dadae0560c93d79fa107cfa6f8191279d027c`

### Public Experience

- Navbar publik tetap ringkas dan menggunakan root-safe Home anchors pada jalur yang sesuai.
- Mega Menu `Jelajahi` melengkapi navbar tanpa mengubah navbar menjadi katalog.
- Dedicated pages tetap menjadi depth layer untuk konten yang membutuhkan penjelasan lebih lengkap.
- Smart Explore menjadi direct discovery layer untuk layanan, portfolio, teknologi, dan solusi.
- Premium Footer menyediakan CTA project, public navigation, system/engineering access, portfolio access, legal links, dan contact paths.

### Revision History

- REVISION 4 — initial premium-navigation implementation attempt; **ROLLED BACK / SOURCE UNCHANGED**.
- REVISION 5 — Premium Navigation + Mega Menu + Smart Explore + Premium Footer; production commit `d95f5b2dd3cc2c40a81a3b7d377186b779c77c58`.
- REVISION 6 — footer safe-space refinement untuk floating Audio dan Privacy controls; included in `d95f5b2dd3cc2c40a81a3b7d377186b779c77c58`.
- REVISION 7 — global static asset cache-busting `?v=20261007-r7`; production commit `807dadae0560c93d79fa107cfa6f8191279d027c`.
- REVISION 8 — documentation closeout; tidak mengubah runtime/source public.

### Cache Regression Resolution

Production visual regression sempat memperlihatkan native-looking `Jelajahi` control dan footer yang tidak menerima premium styling.

Investigation menolak Service Worker sebagai root cause karena tidak terdapat active registration maupun Cache Storage yang relevan. Production asset headers memperlihatkan `Cache-Control: max-age=14400`, sementara global CSS/JS masih menggunakan URL tanpa version token.

Resolution dilakukan dengan versioning global public asset URL:

- `style.css?v=20261007-r7`
- `script.js?v=20261007-r7`
- `/search-enhancer.js?v=20261007-r7`

Local stale-cache trap membuktikan browser meminta asset R7 baru dan tidak menggunakan stale unversioned asset.

### Verification

- Source Review: **PASS / LOCKED**.
- Local cache-busting test: **PASS / LOCKED**.
- Production HTML references: **PASS / LOCKED**.
- Versioned production assets HTTP 200: **PASS / LOCKED**.
- Production key routes: **PASS / LOCKED**.
- Production visual verification dengan browser normal: **PASS / LOCKED**.
- Stale stylesheet regression: **RESOLVED**.
- Protected namespaces `program/*` dan `portal/*`: **UNTOUCHED**.

### Governance

- Anchor Navbar = quick Home summaries.
- Mega Menu = full exploration.
- Dedicated pages = depth.
- Search / Smart Explore = direct discovery.
- Navbar tidak menjadi katalog; Search dan Mega Menu menjadi mesin eksplorasi.
- `REVISION N` tetap merupakan edit-iteration governance dan tidak menggantikan Platform Baseline `YYYY.MM.DD.NNNN`.
- Scope yang sudah LOCKED tidak dibuka ulang kecuali ada regression nyata atau approved scope change.

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

## Historical Next (V12.0 snapshot)

Setelah timeline publik stabil, prioritas berikutnya adalah monitoring discoverability/Search Console dan persiapan **Fase 3 — Pengalaman Anggota**, dimulai dari Dashboard V2 dan Kartu Anggota + QR.


---

## Unified Backup & Recovery V1.0 - Technical Architecture

**Status:** APPROVED POLICY SCOPE / IMPLEMENTATION NOT STARTED.

### Storage Architecture

- Cloudflare D1 merupakan sumber data utama; database production tidak dipindahkan ke PC atau laptop.
- D1 Time Travel digunakan sebagai lapisan pemulihan jangka pendek sesuai masa retensi yang tersedia.
- Cloudflare R2 direncanakan sebagai lokasi utama backup terenkripsi pada bucket PRIVATE khusus, terpisah dari bucket dokumen dan media aplikasi.
- Repository GitHub PRIVATE khusus direncanakan menyimpan salinan kedua dalam bentuk ciphertext terenkripsi; repository website publik tidak boleh menerima backup database.
- Kunci enkripsi/dekripsi dan recovery material disimpan terpisah dari file backup, R2, dan GitHub, dengan akses minimum dan prosedur pemulihan yang terdokumentasi.

### Backup Triggers and Consistency

- Source code dikelola dengan Git; backup database tidak disamakan dengan Git commit.
- Perubahan record harian dilindungi oleh Time Travel dalam jendela retensinya dan backup terjadwal, bukan janji full export setiap transaksi.
- Sebelum migrasi skema, penghapusan massal, atau perubahan data berisiko, operator wajib memverifikasi backup/titik pemulihan dan menyiapkan rollback.
- Sesudah perubahan berisiko, operator memverifikasi integritas data, kesesuaian schema, dan kondisi layanan.
- Ekspor D1 remote dapat menimbulkan gangguan sementara; jadwal dan metode backup wajib mempertimbangkan ketersediaan layanan.
- Backup D1 dan backup objek R2 aplikasi diperlakukan sebagai cakupan terpisah; referensi dokumen harus tetap dapat dipulihkan bersama data yang membutuhkannya.

### Security and Recovery

- Tidak ada SQL mentah, data pribadi, password, token, atau private key pada GitHub publik.
- Backup GitHub hanya berupa arsip terenkripsi yang memenuhi batas ukuran, retensi, dan kontrol akses repository PRIVATE.
- Backup diberi timestamp, identitas sumber, versi skema, checksum, dan status verifikasi.
- Restore hanya dilakukan setelah identitas database target diverifikasi dan ada otorisasi; restore production otomatis dilarang.
- Uji pemulihan terjadwal dilakukan pada database terisolasi agar tidak menimpa database aktif.
- Kegagalan backup harus tercatat dan menghasilkan pemberitahuan kepada pengelola sebelum operasi berisiko dilanjutkan.

**Implementation gate:** belum ada bucket backup, GitHub backup repository, encryption pipeline, jadwal otomatis, atau restore procedure yang dinyatakan aktif sampai selesai implementasi dan verifikasi.

## Maintenance Rules

- Jangan menulis roadmap seolah-olah sudah live.
- Jangan mempublikasikan data pribadi atau credential.
- Artikel Insights harus menekankan pembelajaran dan implementasi yang dapat diverifikasi.
- Timeline publik harus tetap menjadi proof-of-work terkurasi.
- Status platform aktif mengikuti source/runtime terbaru, bukan bagian Next dari snapshot versi lama.
- Dokumen versi lama tetap tersedia melalui Git history.

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

**Status:** PRODUCTION VERIFIED / COMPLETED / LOCKED

**Runtime production anchor:** `68c89f9a6fb4c6dd2ab389619c3a4026cdb07368`

**Parent baseline:** 2026.10.07.0002

### Revision governance

- REVISION 9 — Mobile Footer + FAQ Architecture.
- REVISION 10 — FAQ Typography Color Alignment.
- REVISION 11 — failed documentation attempt; fully rolled back.
- REVISION 12 — Documentation Closeout Implementation / Source Review.
- REVISION 13 — Documentation Metadata + Markdown Refinement / Source Review.
- REVISION 14 — Failed Validation Attempt / Rolled Back.
- REVISION 15 — Failed Validator-Scope Attempt / Rolled Back.
- REVISION 16 — Scoped Markdown Token Correction / Final Documentation Closeout.
- REVISION N tetap merupakan edit-iteration governance dan tidak menggantikan Platform Baseline `YYYY.MM.DD.NNNN`.

### FAQ architecture

- Home FAQ: 6 pertanyaan.
- Dedicated `/faq/`: 16 pertanyaan dalam 8 kategori.
- Canonical `/faq/`: verified.
- `FAQPage` structured data: verified.
- CTA Home FAQ menuju `/faq/` dan `/#estimasi`.
- Search dan sitemap telah mengikutsertakan FAQ.

### Mobile footer

Phone layout dikunci menjadi:

- baris 1: JELAJAHI + CARA KERJA;
- baris 2: SISTEM & ENGINEERING + PROJECT;
- brand full width;
- safe-space Audio / Privasi tetap tersedia.

### Visual alignment

FAQ mengikuti bahasa visual Insights:

- white untuk primary text;
- orange untuk brand / hero emphasis;
- green / teal untuk kicker dan category label;
- blue-gray untuk supporting text.

### Cache resilience

Public HTML menggunakan:

`style.css?v=20261007-r9`

Production verification:

- R7 public reference: 0;
- R9 active;
- REVISION 9 CSS active;
- REVISION 10 CSS active.

### Safety boundary

Tidak ada perubahan pada:

- `program/*`;
- `portal/*`;
- `script.js`;
- `search-enhancer.js`.

REVISION 16 menutup dokumentasi. Runtime production tetap ditambatkan pada commit `68c89f9a6fb4c6dd2ab389619c3a4026cdb07368`.

## Verified Site Publishing Architecture - 2026-10-09

**Status:** AUDITED CONFIGURATION / DOCUMENTATION ONLY.

### Main Website - GitHub Pages

- Repository: srilexbuditra/srilexbuditra.github.io.
- Publishing branch: main.
- Public domains: srilexbuditra.work and www.srilexbuditra.work.
- Cloudflare DNS root A/AAAA records target GitHub Pages addresses; www CNAME targets srilexbuditra.github.io.
- Cloudflare DNS proxy is enabled for the website records.
- GitHub Pages build and deployment completed successfully for the reviewed commits.

### Staging Website - Cloudflare Pages

- Cloudflare Pages project: srilexbuditra-github-io.
- Custom domain: staging.srilexbuditra.work (Active, SSL enabled).
- Additional project domain: srilexbuditra-github-io.pages.dev.
- Git integration: srilexbuditra/srilexbuditra.github.io.
- Production branch of the Pages project: main.
- Automatic deployments: enabled.
- Deployment of commit 1f33e12 completed successfully.
- The Production label inside Cloudflare Pages refers to its own environment and does not mean the main srilexbuditra.work website is served by that Pages project.

### Deployment Safety Boundary

- Both publishing paths currently depend on GitHub main; push to main can trigger automatic publishing on both platforms.
- GitHub Actions quality and repository audit workflows are validation processes; GitHub Pages has a separate pages-build-deployment process.
- REV21 remains PRODUCTION LOCKED; changes require explicit review and authorization.
- REV22 Web Push remains DEPLOYMENT HOLD; local uncommitted source must not be accidentally staged, committed, or published.
- Cloudflare D1 databases and R2 application objects are separate from Git repository content; publishing documentation does not create or restore backups.
- Unified Backup & Recovery V1.0 remains APPROVED POLICY SCOPE / IMPLEMENTATION NOT STARTED.
- DNS, Pages project settings, Workers, secrets, production database migrations, and production restores require separate authorization.

### Evidence Boundary

The configuration above is based on GitHub Actions, Cloudflare Pages Deployments and Custom domains, and Cloudflare DNS screenshots reviewed on 2026-10-09. It does not certify complete runtime health, application data integrity, or every Cloudflare routing rule.

## Guardrail Teknis â€” Standardisasi Identitas (12 Oktober 2026)

<!-- SRILEXBUDITRA-SENIOR-TITLE-2026-10-12-BEGIN -->
**Source baseline verified:** `8207ffee435a83e4ff0614f394bd32ec4df75a76` pada `main` / `origin/main` sebelum pembaruan dokumen master ini.

- **Perubahan disengaja:** 37 HTML (72 referensi), `search-index.json` (3 referensi), satu baris `AUTH-API-V3.1.md`, dua PDF pembagian peran (halaman 2), dan dua field identitas di `opensearch.xml`. Identitas aktif: **Senior Full Stack Developer**.
- **Area dilindungi:** CSS, JavaScript, backend Worker, D1, API, pengaturan autentikasi, role/RBAC, URL pencarian OpenSearch, dan tampilan/fitur website tidak diubah sebagai bagian dari rangkaian commit standardisasi ini.
- **Verifikasi:** audit byte/diff pada HTML/JSON/Markdown/XML; XML valid; dua PDF A4 masing-masing 3 halaman dengan SHA-256 produksi cocok (`970cf2d534eb311e3ec2113c973cf1b7ddf97e6882dc619015cc34a6f300643b`); URL OpenSearch HTTP 200 dan query template terjaga. Sampel HTML/indeks produksi lulus, tetapi bukan pengujian interaktif semua halaman.
- **Pengecualian terukur:** tiga referensi lama di changelog historis tetap dicatat sebagai sejarah. Audit 184 aset biner/opaque, Wiki terpisah, dan dokumen keluaran runtime tidak lengkap, sehingga tidak boleh diklaim sepenuhnya bersih.
- **Prinsip ke depan:** cek `git status`, periksa diff byte yang diizinkan, backup sebelum edit, jangan ubah kode lain demi perubahan teks, serta verifikasi produksi pasca-deploy. Gunakan commit hash untuk penelusuran, bukan mengasumsikan halaman live otomatis berubah setelah push.
<!-- SRILEXBUDITRA-SENIOR-TITLE-2026-10-12-END -->

<!-- DPN-DOC-BASELINE-V1-20261014:docs/PLATFORM.md:START -->

## Arsitektur Rencana — SRILEXBUDITRA DIGITAL PARTNER NETWORK V1.0

**Status:** rancangan, BELUM diimplementasikan. Penjelasan berikut bukan bukti domain/subdomain, Worker, D1, endpoint, atau fitur Network telah aktif. Batas mutlak: jangan menyentuh Client Portal `/portal/` dan sistem produksi existing.

### 1. Batas aplikasi, deployment, dan autentikasi

- Usulan host aplikasi: `network.srilexbuditra.work`, mandiri dari `srilexbuditra.work/portal/`; finalisasi DNS/routing setelah audit konfigurasi.
- Deployment, domain/cookie/sesi, Worker, D1, penyimpanan privat, secrets, serta CSS/JS Network harus terisolasi. Service Worker/PWA dan cache aplikasi lama jangan diambil alih.
- Lingkungan: server lokal + data simulasi → GitHub branch pengembangan → staging Network terpisah → production setelah approval. Push branch pengembangan bukan otomatis rilis production.
- Integrasi ke website utama/Client Portal existing hanya melalui antarmuka resmi yang disepakati, berizin, memiliki kontrak API dan diuji; tidak mengakses/migrasi D1 existing langsung.
- Gunakan izin berbasis peran dan kepemilikan sumber daya pada backend: Administrator Sistem, Admin Kemitraan, Admin Keuangan, Tim Developer, Mitra, Pelanggan. Pemisahan maker/checker untuk operasi keuangan berisiko.

### 2. Routing dan pengalaman pengguna (usulan, bukan URL aktif)

- `/` beranda Network; `/mitra/` informasi dan registrasi; `/mitra/{slug}/` website publik personal; `/akun-mitra/` dashboard privat; `/pelanggan/` katalog/beranda; `/akun-pelanggan/` dashboard privat; `/admin/` admin Network. Rute final memerlukan pemeriksaan konflik dan slug terlarang.
- Website publik mitra menampilkan profil/identitas kemitraan, paket resmi UMKM, portofolio berizin, formulir pemesanan, konsultasi WhatsApp mitra, informasi layanan dan QR publik.
- Teks promosi otomatis dan tombol 'Bagikan Link Mitra' (termasuk tautan referral unik, QR unduh, dan statistik jaringan) HANYA untuk mitra yang login di dashboard privat; bukan di website publik yang dilihat calon pelanggan.
- Pelanggan membagikan halaman bisnis/karya yang sudah dipublikasikan atas persetujuannya melalui alat berbagi terpisah; jangan membuat invoice, data akun, materi proyek, atau token menjadi halaman publik.
- Metadata SSR/HTML awal per halaman publik: title, description, canonical, `og:type/title/description/url/image`, gambar OG dan dimensi/alt, Twitter card, locale Indonesia, aturan index/noindex. Ilustrasi OG 1200x630 (format kompatibel); visual halaman dapat memakai AVIF. QR berkontras jelas, berisi URL publik nonrahasia, diuji pindai.

### 3. Sistem desain responsif

- Tema Premium Digital Blue: `#0B1220` navy, `#1D4ED8` biru utama, `#0F766E` toska, `#F8FAFC` latar terang; panel privat lebih menekankan kejelasan data daripada ornamen.
- CSS modular `core/tokens/typography/layout`, `components`, dan `pages` menurut fungsi, bukan satu CSS per perangkat. Namespace komponen Network (misal `.dpn-`) dan hindari selector global yang memengaruhi aplikasi lain.
- Mobile-first: `clamp()`, Grid/Flex, media/container queries, ukuran font dan spacing horizontal/vertikal terpusat. Uji 320/360/390/430/768/1024/1366/1440/1920 px, orientasi portrait/landscape, zoom dan aksesibilitas.
- Mockup dashboard Admin, Mitra, Pelanggan telah dibuat di percakapan sebagai referensi desain; belum menjadi hasil QA atau implementasi.

### 4. Katalog layanan, harga, dan penjadwalan

- Admin Network dapat membuat/memperbarui nama paket UMKM, harga, fitur, deskripsi, biaya opsional, domain/hosting, promo, jumlah revisi, status publikasi, estimasi mulai dan durasi. Harga situs utama tetap terpisah.
- Mitra menampilkan katalog resmi dari pusat dan tidak bebas mengganti harga. Snapshot penawaran, harga, diskon, pajak, tenggat dan syarat dibuat per pesanan agar transaksi lama tidak terpengaruh perubahan katalog.
- Estimasi publik adalah kisaran bersyarat; jadwal terkonfirmasi setelah pembayaran sesuai ketentuan, materi lengkap, persetujuan dan kapasitas developer tersedia. Catat waktu mulai aktual, milestones, revisi jadwal berikut alasan serta pemberitahuan.
- Opsi domain: tidak membutuhkan, sudah memiliki (pemeriksaan hak pengelolaan), membeli baru (hanya pada opsi ini lakukan pencarian registrar API); ketersediaan/harga diperiksa ulang sebelum pembelian.

### 5. Alur pesanan, pembayaran, proyek dan sengketa

- Alur: website mitra → prospek/referral tercatat → konsultasi ke WhatsApp mitra atau formulir resmi → Admin membuat penawaran → pelanggan setuju kontrak/policy versi tertentu → DP terverifikasi → materi lengkap → penjadwalan/proyek → tinjau/revisi → pelunasan → serah terima → dukungan/perpanjangan.
- Pembayaran masuk hanya ke rekening/kanal resmi penyedia jasa. Integrasi payment gateway dengan tanda tangan webhook, verifikasi server-side, idempotensi, dan rekonsiliasi; jangan percaya tombol 'Sudah Bayar' sebagai bukti dana diterima.
- Dashboard pelanggan: total biaya/DP/sisa, jatuh tempo, invoice, jadwal, prosentase berbasis pekerjaan nyata, perubahan pekerjaan, revisi, persetujuan, domain/hosting, bantuan serta status refund.
- Kebijakan pembatalan/refund/revisi/sengketa V1.0 telah disusun sebagai DRAF untuk tinjauan hukum sebelum berlaku; persetujuan pelanggan dan versi kontrak disimpan per pesanan. Tidak boleh menetapkan 'DP hangus untuk semua kasus'.

### 5A. Naskah operasional kebijakan pelanggan V1.0 — DRAF BELUM BERLAKU

**Pasal 1 — Ketentuan umum:** hubungan pelanggan dengan pihak penyedia jasa yang diidentifikasi dalam penawaran; mitra hanya berwenang membantu promosi/konsultasi sesuai perjanjian; spesifikasi, jadwal, revisi dan harga mengikuti penawaran yang disetujui; semua keputusan tercatat.

**Pasal 2 — Pemesanan dan pembayaran:** pelanggan memeriksa paket/kontrak sebelum setuju; DP, termin, pajak, biaya tambahan dan tanggal jatuh tempo tampil jelas; pembayaran hanya melalui kanal resmi; proyek dijadwalkan setelah pembayaran/persyaratan awal terverifikasi; biaya baru memerlukan persetujuan.

**Pasal 3 — Pembatalan oleh pelanggan:** sebelum pembayaran/pekerjaan tidak dibebankan biaya pengerjaan. Setelah DP tetapi sebelum pekerjaan, jasa yang belum dikerjakan pada prinsipnya dikembalikan; biaya pihak ketiga yang benar-benar dikeluarkan atas instruksi dan persetujuan pelanggan dapat diperhitungkan secara transparan sejauh dibolehkan hukum. Setelah pekerjaan mulai, perhitungan penyelesaian mempertimbangkan bagian kerja yang terbukti selesai, hasil yang diserahkan serta biaya sah yang telah disepakati. Tidak ada klausula bahwa seluruh DP otomatis hangus.

**Pasal 4 — Pembatalan oleh penyedia:** bila penyedia tidak sanggup memenuhi pekerjaan, pelanggan diberi alasan tertulis dan pilihan solusi wajar: perbaikan jadwal dengan persetujuan, penggantian layanan yang disepakati, atau pengembalian untuk kewajiban yang tidak dipenuhi. Hak ganti rugi/perbaikan pelanggan tetap mengikuti hukum.

**Pasal 5 — Pengembalian dana:** pengajuan melalui tiket bernomor; Admin memeriksa kontrak, pembayaran, progres dan biaya sah; pelanggan menerima rincian hasil dan alasan; refund diutamakan ke metode asal, atau rekening pelanggan yang diverifikasi; tidak ada potongan sepihak; target internal transfer lima hari kerja setelah disetujui dan detail valid sepanjang tidak melanggar tenggat hukum yang lebih ketat; status dan jalur keberatan tersedia.

**Pasal 6 — Domain/hosting/pihak ketiga:** biaya terpisah jika tidak termasuk paket; pembelian hanya dengan persetujuan; cek ketersediaan bukan jaminan domain sukses terdaftar; ketentuan registrar dan biaya riil diperhitungkan sejauh sah; pemilik domain serta tanggung jawab perpanjangan jelas dalam kontrak.

**Pasal 7 — Revisi:** jumlah putaran revisi termasuk paket tertulis sebelum transaksi; revisi dalam lingkup meliputi penyesuaian materi/tampilan yang diperjanjikan; penambahan fitur besar menjadi permintaan perubahan berbayar dengan persetujuan; bug atau ketidaksesuaian spesifikasi yang menjadi tanggung jawab penyedia tidak menghabiskan kuota revisi berbayar.

**Pasal 8 — Perubahan proyek:** permintaan fitur, halaman atau integrasi baru dievaluasi Admin; harus ada harga dan dampak jadwal tertulis yang disetujui sebelum dilaksanakan; riwayat kontrak awal tidak dihapus.

**Pasal 9 — Jadwal dan keterlambatan:** estimasi katalog bersyarat; tanggal pasti sesudah persyaratan terpenuhi; perubahan jadwal mencatat alasan, dampak dan komunikasi; keterlambatan akibat materi pelanggan dicatat; keterlambatan penyedia ditangani menurut kontrak dan hukum; penundaan tidak otomatis menghapus hak pembayaran/refund pelanggan.

**Pasal 10 — Peninjauan/serah-terima:** pelanggan memeriksa hasil, menyampaikan ketidaksesuaian atau setuju serah-terima; pengalihan akses/aset/lisensi/hasil kerja sesuai kontrak; garansi/dukungan didefinisikan; habisnya kuota revisi tidak menghapus kewajiban memperbaiki cacat yang menjadi tanggung jawab penyedia.

**Pasal 11 — Keluhan dan sengketa:** pusat bantuan menerbitkan nomor tiket dan petugas; target tanggapan awal dua hari kerja; musyawarah didahulukan tanpa membatasi hak hukum; jika tidak sepakat, pelanggan dapat memakai jalur sengketa yang berwenang, termasuk BPSK jika berwenang atau pengadilan yang berwenang.

**Pasal 12 — Persetujuan dan revisi kebijakan:** versi lengkap dan ringkasan ditampilkan sebelum persetujuan penawaran/pembayaran; sistem merekam versi/tanggal/identitas akun sesuai kebijakan privasi; perubahan versi tidak mengubah kontrak yang telah berlaku secara sepihak; peraturan yang berlaku mengungguli klausula bertentangan.

**Syarat pemberlakuan:** identitas penyedia dan kanal keluhan resmi, persentase DP/termin, biaya pihak ketiga, revisi, retensi dokumen, serta pemeriksaan hukum dan persetujuan manajemen harus lengkap. Draf ini bukan pengganti nasihat hukum.

### 6. Rekening, identitas, bonus dan komisi

- Admin Keuangan: mengelola rekening resmi penerimaan/payout/refund dengan dua persetujuan pada perubahan sensitif; Mitra: rekening pencairan komisi terverifikasi; Pelanggan: rekening refund hanya jika transfer diperlukan, utamakan metode pembayaran asal.
- Pendaftaran bertahap: identitas/kontak → akun/sponsor → website personal → identitas berfoto dan pengambilan foto yang sah/proporsional → rekening/keperluan pajak → persetujuan. Semua kolom yang ditampilkan dan relevan wajib valid sebelum pengajuan; boleh simpan draf. Tidak meminta KK. Dokumen tidak boleh berada pada GitHub atau aset publik.
- Data rekening dan identitas disamarkan, dienkripsi, memiliki pembatasan hak akses, log akses, retensi/penghapusan dan pemeriksaan perubahan. Rekening baru tidak langsung dipakai sebelum verifikasi.
- Ledger komisi mencatat transaksi dasar, pending/available/held/paid/reversed, koreksi refund, pencairan dan bukti; permohonan payout tahan dana tersedia dan cegah payout berulang; transfer gagal mengembalikan status dana secara aman.
- Genealogy sponsor Level 1, 2, 3, dst., peringkat dan dashboard jaringan disiapkan. Pengguna menginginkan bonus berjenjang sebagai fitur inti tujuan akhir, tetapi aktivasi bonus nyata harus melewati validasi model bisnis, hukum dan perizinan; simulasi tidak boleh mengalirkan saldo dapat dicairkan. Tidak membayar bonus hanya untuk perekrutan.

### 7. Perlindungan proyek existing dan cara rilis

- Dilarang memodifikasi halaman Client Portal `/portal/`, Worker/D1 lama, OG40/REV21/REV22 locked, deploy lama, dan konfigurasi GitHub main website tanpa Gate/perubahan yang disetujui.
- Sebelum script PowerShell: pemeriksaan branch, HEAD, worktree clean, daftar file target, backup di luar repo, mode preview lalu mode apply setelah persetujuan; `git diff --check`, audit file dan commit/push spesifik. Tidak boleh membuat `.md` baru.
- Catat hasil tiap Gate pada `README.md`, `CHANGELOG.md`, `docs/README.md`, `docs/ROADMAP.md`, `docs/PLATFORM.md` existing, meliputi status, commit, bukti QA, risiko, dan langkah berikutnya. Penyelesaian modul existing tidak boleh dibatalkan statusnya oleh pekerjaan Network.

<!-- DPN-DOC-BASELINE-V1-20261014:docs/PLATFORM.md:END -->

<!-- DPN-GATE1-NETWORK-PATH-20261015:START -->
### DPN Gate 1 - Arsitektur same-origin /network/ (15 Oktober 2026)

Keputusan URL terbaru: `https://srilexbuditra.work/network/`.
Keputusan ini menggantikan usulan `network.srilexbuditra.work` pada baseline Gate 0.

Temuan audit read-only pada commit `6c90acb`:
- `CNAME` berisi `srilexbuditra.work`.
- Direktori dan tracked file `/network/` belum tersedia.
- Terdapat root `404.html` serta root `sw.js`.
- Root `sw.js` tidak memuat handler `fetch`, penggunaan `caches`, ataupun logika navigasi pada audit teks yang dilakukan.
- Registrasi Service Worker untuk Web Push ditemukan pada `web-push-r1.js`.
- Tidak ditemukan file routing khusus Network pada pola audit; hasil ini tidak membuktikan ketiadaan aturan eksternal Cloudflare.
- Seluruh audit berjalan read-only dan tidak mengubah website produksi.

Aturan rancangan:
- UI, CSS, JavaScript, dan rute Network diberi namespace dan struktur modul tersendiri.
- Backend Network menggunakan Worker/API dan D1 yang dipisahkan secara logis dari portal dan program existing.
- Hak akses harus ditegakkan pada server, bukan hanya dengan menyembunyikan tombol UI.
- Cookie, session, CSRF, CORS, CSP, ownership data, dan pemisahan akun tiap peran wajib diperiksa.
- Jangan mengubah root Service Worker REV22 atau registrasi Web Push untuk implementasi awal Network.
- Jangan membuat Service Worker Network baru sebelum cakupan dan interaksinya dengan root SW disetujui.
- Jaga agar routing, API, serta caching Network tidak mengambil alih `/portal/`, `/program/`, maupun halaman utama.
- Periksa aturan Cloudflare dan GitHub Pages sebelum implementasi atau deployment yang memengaruhi produksi.
- Data identitas, rekening, komisi, dan pembayaran harus dilindungi dengan otorisasi, audit log, dan kontrol privasi.

Status: ARSITEKTUR DIRANCANG / BELUM DIIMPLEMENTASIKAN.
<!-- DPN-GATE1-NETWORK-PATH-20261015:END -->

<!-- DPN-GATE1D-BUSINESS-RBAC-20261015:START -->
### DPN Gate 1D - RBAC, keamanan transaksi, dan batas sistem

**Status:** spesifikasi rancangan, belum ada endpoint, tabel database, atau akun Network yang diimplementasikan.

#### Batas aplikasi
- Lokasi publik dan dashboard Network: `/network/` beserta rute turunannya.
- Client Portal `/portal/`, `/program/`, website utama, dan REV21/REV22 tidak boleh berubah fungsi maupun tampilannya.
- Seluruh UI, CSS, dan JS baru diberi namespace Network agar tidak mengubah komponen existing.
- Worker/API, skema atau database D1, aset privat, dan autentikasi Network dipisahkan secara logis.
- Path pada origin yang sama tidak memberikan isolasi keamanan setingkat subdomain; otorisasi harus dipastikan di sisi server.
- Jangan memodifikasi root `sw.js`, push subscription REV22, atau registrasi `web-push-r1.js`.
- Sebelum implementasi, audit cookie/session, CSRF, CORS, CSP, cache, API routing, dan konfigurasi Cloudflare.

#### Matriks RBAC
- Super Admin: kelola konfigurasi dan otorisasi; transaksi sensitif tetap diaudit dan membutuhkan pemeriksaan independen sesuai kebijakan.
- Admin Operasional: order, pelanggan, progres, proyek, kapasitas, dan revisi; tidak mengesahkan pembayaran atau payout.
- Admin Keuangan: verifikasi pembayaran, refund, ledger, dan pencairan; tidak boleh menyetujui transaksi yang dibuat atau diajukan sendiri.
- Admin Verifikasi: validasi identitas dan rekening Mitra; tidak melakukan payout.
- Mitra: hanya data akun, website, jaringan privat yang berhak dilihat, penjualan teratribusi, saldo, dan rekening miliknya.
- Pelanggan: hanya profil, pesanan, proyek, invoice, pembayaran, dan revisi miliknya.
- Setiap API memerlukan autentikasi, pemeriksaan peran, ownership, status objek, dan audit untuk tindakan sensitif.
- Penolakan akses tidak boleh membocorkan detail akun, identitas, keuangan, atau keberadaan resource privat.

#### Paket dan pesanan
- Katalog dapat memiliki versi, status draft/published, harga, fitur, termin, domain, SLA, dan revisi yang dikonfigurasi Admin.
- Saat order dibuat, simpan snapshot versi paket dan ketentuan yang disepakati.
- Atribusi referral dan sponsor disimpan secara terlacak; perubahan atau sengketa harus dicatat, bukan diam-diam ditimpa.
- Domain baru menggunakan pemeriksaan registrar ketika opsi beli domain baru dipilih.
- Domain existing wajib melewati verifikasi penguasaan sebelum digunakan.

#### Transaksi dan pembayaran
- Uang pelanggan diterima melalui rekening/kanal resmi pengelola; bukan rekening pribadi Mitra.
- Pengelolaan rekening operasional memakai prinsip maker-checker dan catatan perubahan.
- Rekening payout Mitra harus diverifikasi serta ditampilkan tersamarkan di UI.
- Refund menggunakan metode pembayaran asal bila memungkinkan; rekening pengembalian pelanggan hanya diminta bila diperlukan.
- Ledger mendukung pencatatan append-only, referensi transaksi unik, rekonsiliasi, koreksi terkontrol, dan audit.
- Pencegahan pembayaran/withdraw ganda menggunakan idempotency dan transaksi atomik.
- Perubahan status invoice, refund, payout, serta penolakan tercatat dengan aktor dan waktu.
- Jangan menyimpan kredensial, token, atau data bank rahasia dalam Markdown maupun repository publik.

#### Komisi, jaringan, dan verifikasi
- Hubungan sponsor dan genealogy bersifat privat, dengan akses terbatas berdasarkan peran dan hak.
- Komisi sponsor, bonus level/generasi, dan bonus prestasi dikonfigurasi dengan versi aturan yang tercatat.
- Dasar komisi adalah penjualan jasa terverifikasi, bukan perekrutan semata.
- Perhitungan memiliki pending/hold/available/paid/reversal dan mekanisme koreksi refund.
- Aktivasi payout nyata untuk bonus jaringan memerlukan persetujuan legal, pajak, antifraud, dan audit perhitungan.
- Verifikasi identitas meminta data seperlunya, persetujuan pemrosesan, pembatasan akses, enkripsi, dan kebijakan retensi.
- KTP/SIM sesuai syarat verifikasi, foto wajah dengan persetujuan; tidak meminta KK.
- NPWP hanya bila diperlukan untuk kewajiban administrasi perpajakan.
- Dokumen identitas dan rekening tidak boleh terekspos melalui URL publik atau log aplikasi.

#### Ketentuan visual dan rilis
- Visual website existing yang telah disetujui harus tetap sama; seluruh redesign hanya pada `/network/`.
- Tidak menambah CSS global yang dapat memengaruhi halaman lama.
- Lakukan review dan QA regresi terbatas pada permukaan yang berpotensi terdampak.
- Push `main` dapat memicu deployment; persetujuan publikasi tetap diperlukan.
- Gate 1D hanya menambah dokumentasi pada lima Markdown existing, bukan aktivasi fitur atau migrasi D1.
<!-- DPN-GATE1D-BUSINESS-RBAC-20261015:END -->

<!-- DPN-GATE2-VISUAL-20261015:START -->
### DPN Gate 2 - Kontrak desain UI dan kebutuhan teknis

**Status:** spesifikasi antarmuka, belum ada file aplikasi Network atau API yang diimplementasikan.

#### Isolasi visual dan sistem
- Semua halaman baru berada dalam cakupan `/network/`; fungsi dan tampilan existing wajib tetap sama.
- Gunakan namespace CSS/JS khusus Network; hindari selector global yang dapat mengubah halaman lama.
- Tidak mengubah root Service Worker, konfigurasi REV21/REV22, `/portal/`, atau `/program/` melalui desain ini.
- Arsitektur same-origin harus diaudit; path `/network/` bukan batas keamanan otomatis.
- Routing dinamis slug Mitra memerlukan pembuktian dukungan hosting sebelum implementasi.

#### Tema dan grid
- Navy `#0B1220`; blue `#1D4ED8`; teal `#0F766E`; light `#F8FAFC`.
- Desain mobile-first, dengan tipografi, jarak, radius, ukuran sentuh, dan gambar adaptif.
- Ringkasan KPI dashboard HP dan tablet memakai grid tiga kolom.
- Katalog paket semua viewport memakai grid tiga kolom.
- Pada lebar HP kecil, teks dan harga tidak boleh terpotong; detail panjang dibuka terpisah.
- Formulir, tabel, jadwal, dan invoice tidak dipaksa ke kartu tiga kolom.
- Uji viewport 320/360/390/768/1366/1440/1920 px pada browser nyata.

#### Navigasi dashboard
- Sidebar aktif dengan tombol X dan tombol buka kembali.
- HP menggunakan drawer; desktop dapat menggunakan sidebar yang dapat ditutup.
- Menu sidebar dan footer berbagi status rute aktif.
- Footer menyediakan lima pintasan sesuai role; akses tersembunyi bukan pengganti pemeriksaan RBAC backend.
- Footer pada HP memperhitungkan safe-area dan ruang bawah agar konten tidak tertutup.
- Drawer mendukung penutupan melalui X, area luar, Escape, serta pengelolaan fokus dan aksesibilitas.

#### Panel profil dan foto wajib
- Header dashboard menampilkan foto profil aktual, nama tampilan, dan peran.
- Menu Akun Profil memungkinkan perubahan foto dan informasi sesuai wewenang.
- Foto profil diwajibkan pada aktivasi atau penyelesaian onboarding seluruh akun Network.
- Akses dashboard penuh dibatasi sampai foto profil yang valid tersedia.
- Penggantian foto harus berhasil sebelum referensi foto lama dilepas; akun tidak boleh kehilangan foto aktif.
- Validasi tipe konten, ukuran, dimensi, penyimpanan, dan akses file wajib dibuat pada implementasi.
- Foto wajah verifikasi identitas disimpan dan dikendalikan terpisah dari foto profil.
- Publikasi foto profil hanya dilakukan sesuai tujuan halaman dan kebijakan privasi yang disetujui.

#### Autentikasi Network
- Semua Admin, Mitra, dan Pelanggan login menggunakan email dan password.
- Keputusan panjang password: minimal 6, maksimal 35 karakter.
- Input password tersembunyi secara default dengan tombol mata untuk lihat/sembunyikan.
- Tombol tersebut juga berlaku pada formulir pendaftaran, ubah password, dan konfirmasi password bila relevan.
- Validasi batas panjang diterapkan di frontend dan ditegakkan kembali di backend.
- Password tidak disimpan sebagai teks biasa; gunakan password hashing modern yang sesuai.
- Wajib ada pembatasan percobaan login, proteksi sesi, audit autentikasi, dan mekanisme reset aman.
- Verifikasi email, pengaturan cookie, CSRF, session expiry, dan pengamanan tindakan sensitif dirinci di Gate 3.
- Karena minimum enam karakter memiliki risiko keamanan, kontrol tambahan dan opsi MFA Admin perlu dikaji pada Gate 3.
- Login Network tidak mengubah mekanisme login sistem existing.

#### Website pribadi Mitra
- Slug Mitra harus unik, tervalidasi, dan tidak bertabrakan dengan rute sistem.
- Dua CTA utama dibuat satu baris dan lebar seimbang di seluruh viewport.
- Tombol WhatsApp memakai nomor Mitra terverifikasi yang dikonfigurasi dari dashboard.
- Tombol Lihat Paket & Pesan membawa atribusi referral yang sah.
- Katalog menampilkan harga resmi dari konfigurasi Admin.
- Panel referral privat, komisi, saldo, dan data jaringan tidak disisipkan ke halaman publik.
- OG/SEO dan QR halaman Mitra menggunakan identitas halaman yang diizinkan untuk publikasi.

#### Data, peran, dan rilis
- Admin, Mitra, dan Pelanggan hanya melihat/mengubah data menurut RBAC dan ownership di sisi server.
- Data rekening, identitas, dan dokumen privat tidak boleh disimpan dalam aset publik.
- Pengelolaan pembayaran, komisi, refund, dan payout mengikuti spesifikasi keamanan Gate 1D.
- Kontrak API, skema D1, dan route deployment belum boleh diasumsikan selesai pada Gate 2.
- Desain yang disetujui adalah dasar implementasi, bukan bukti fitur telah bekerja.
- Seluruh penerapan wajib disertai uji keamanan serta non-regresi sistem existing.
<!-- DPN-GATE2-VISUAL-20261015:END -->
