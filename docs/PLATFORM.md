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
