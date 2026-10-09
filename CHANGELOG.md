<!-- CONTINUITY-REV22-R37:START -->
## 2026-10-09 — REV22 R3.7 Final & Continuity Governance

- **Release aplikasi:** REV22 R3.7 Unified Visitor Experience, Git `main` commit `ec12c92` — **PRODUCTION VERIFIED / FINAL / LOCKED**.
- **Verifikasi pengguna:** Cloudflare Pages dan `https://srilexbuditra.work/` pada Microsoft Edge; Privasi & Analitik, Web Push opt-in, PWA Install, dan Translate independen berjalan sesuai urutan/tampilan yang disepakati.
- **Kompatibilitas:** Web Push native, banner R3.3, Smart Visibility R3.4, undangan R3.5, PWA REV21, Worker, D1, Secrets, dan route produksi dipertahankan.
- **Keputusan continuity:** semua pengembangan berikutnya **WAJIB melanjutkan dari kondisi produksi terakhir yang stabil dan terverifikasi; jangan mengulang dari awal**. Jangan mengulang modul LOCKED tanpa regression atau approved scope change.
- **Dokumentasi:** revisi hanya file Markdown master yang sudah ada (`README.md`, `CHANGELOG.md`, `docs/README.md`, `docs/ROADMAP.md`, `docs/PLATFORM.md`); tidak membuat `.md` baru.
- **Scope entri ini:** dokumentasi dan governance saja; bukan perubahan aplikasi atau infrastruktur.
<!-- CONTINUITY-REV22-R37:END -->

## Site Publishing Architecture Audit - 2026-10-09

**Status:** DOCUMENTATION UPDATED / NO INFRASTRUCTURE CHANGE.
**Reference commit:** 1f33e12.

### Verified Configuration

- Main website srilexbuditra.work and www use GitHub Pages through Cloudflare DNS/proxy.
- Staging uses Cloudflare Pages project srilexbuditra-github-io with custom domain staging.srilexbuditra.work.
- Cloudflare Pages staging domain is Active and SSL enabled.
- Both publication systems use the GitHub main branch and can publish automatically.
- GitHub Actions Public Repository Audit and Repository Quality Check were verified successful.
- GitHub Pages build/deployment and Cloudflare Pages deployment were verified successful for the reviewed commits.

### Governance Recorded

- Technical topology documented in docs/PLATFORM.md.
- Deployment safety roadmap documented in docs/ROADMAP.md.
- Documentation maintenance rules updated in docs/README.md.
- Main publishing overview updated in README.md.
- REV21 production baseline remains LOCKED.
- REV22 Web Push remains DEPLOYMENT HOLD.
- Unified Backup & Recovery V1.0 remains POLICY APPROVED / IMPLEMENTATION NOT STARTED.

No application code, DNS record, Cloudflare Worker, D1 database, R2 bucket, or production deployment setting was modified by this documentation patch.

---

## Unified Backup & Recovery V1.0 - Policy Baseline

Date: 9 Oktober 2026
Status: APPROVED POLICY SCOPE / IMPLEMENTATION NOT STARTED
Scope: Documentation and governance only; no production changes.

### Approved Policy

- Satu standar backup dan recovery lintas proyek srilexbuditra.work.
- Cloudflare D1 tetap menjadi sumber database utama.
- Cloudflare R2 direncanakan sebagai penyimpanan backup utama pada bucket PRIVATE khusus.
- Repository GitHub PRIVATE terpisah direncanakan sebagai salinan kedua yang hanya menyimpan backup terenkripsi.
- D1 Time Travel dan backup terjadwal menjadi lapisan perlindungan perubahan data sesuai retensi.
- Verifikasi titik pemulihan wajib sebelum migrasi atau operasi database berisiko.
- Enkripsi, pembatasan akses, retensi, checksum, notifikasi kegagalan, dan uji pemulihan diwajibkan dalam implementasi.
- Backup objek R2 aplikasi dikelola terpisah dari backup database D1.
- Kebijakan didokumentasikan hanya dalam README.md, docs/PLATFORM.md, docs/ROADMAP.md, docs/README.md, dan CHANGELOG.md; tidak membuat file Markdown baru.

### Audit Evidence and Limitations

- Empat database D1 dan lima bucket R2 berhasil diinventarisasi.
- Struktur empat database D1 dan bookmark Time Travel berhasil diperiksa.
- Schema-only export database Visitors berhasil dibuat secara lokal dan diverifikasi dengan SHA-256.
- Backup lengkap, bucket backup R2, GitHub Private backup repository, automation, encryption pipeline, dan restore test belum diterapkan.
- Ekspor D1 remote dapat mengganggu ketersediaan layanan sementara; implementasi wajib mempertimbangkan hal ini.
- REV21 production baseline tetap LOCKED dan REV22 deployment tetap HOLD.

---

## Platform Baseline 2026.10.07.0006

Platform Baseline : 2026.10.07.0006
Status            : PRODUCTION VERIFIED / COMPLETED / LOCKED
Date              : 8 Oktober 2026
Runtime Anchor    : `f941709dd3c1ca16629488e4cceb1c10080bde69`
Parent Baseline   : 2026.10.07.0005

### Scope

- REV21 - Premium PWA Install Experience.
- Premium homepage install card.
- Chromium install lifecycle dan iOS/iPadOS guidance.
- Maskable application icon 512x512.
- Post-install hidden state.
- Privacy/TTS overlap correction.

### Verification

- Source Review: PASS.
- Local visual + interaction verification: PASS.
- Production desktop visual verification: PASS.
- Production Android real-device installation: PASS / USER CONFIRMED.
- Home-screen app icon: PASS.
- Post-install hidden state: PASS.
- Global `style.css` unchanged.
- Global `script.js` unchanged.
- Service Worker tidak ditambahkan.
- CSP policy tidak berubah.
- Historical baseline 2026.10.07.0005 retained.
- REV22 - Web Push & Notification Subscription - PLANNED / NOT LIVE.
## Platform Baseline 2026.10.07.0005

Platform Baseline : 2026.10.07.0005
Status            : PRODUCTION VERIFIED / COMPLETED / LOCKED
Date              : 7 Oktober 2026
Runtime Anchor    : `38d1c02139b20bd7ff739684f3d0733817914a8e`
Parent Baseline   : 2026.10.07.0004

### Scope

- REV20 - Mobile Portfolio Alignment untuk Umroh Semi Private Bengkulu dan Client Management Platform pada mobile.
- REV20 - reciprocal navigation UX antara Portal Login dan Portal Register.
- REV20 - penyelarasan copy section Portal & Konsultasi pada Home.
- REV20 - penyelarasan visible professional identity menjadi Senior Full Stack Developer Bengkulu.

### Production verification

- REV20 runtime commit / runtime anchor: `38d1c02139b20bd7ff739684f3d0733817914a8e`.
- Source Review: PASS.
- Local desktop/mobile visual verification: PASS.
- Production desktop/mobile visual verification: PASS / USER CONFIRMED.
- Tepat 9 runtime files berada dalam implementation scope.
- Global `style.css` tetap tidak berubah.
- `portfolio/case-study.css` tetap tidak berubah.
- `portal/register/register.js` tetap tidak berubah.
- Backend, D1, Worker, dan CSP policy tidak dibuka atau diubah.
- PWA / Service Worker belum disentuh pada REV20.
- Local HEAD = origin/main = GitHub main pada runtime anchor; ahead/behind 0 0.
- Platform Baseline 2026.10.07.0004 dipertahankan sebagai historical locked baseline.
- REV21 Premium PWA Install Experience tercatat sebagai PLANNED / NOT LIVE.

## Platform Baseline 2026.10.07.0004

Platform Baseline : 2026.10.07.0004
Status            : PRODUCTION VERIFIED / COMPLETED / LOCKED
Date              : 7 Oktober 2026
Runtime Anchor    : `475618f96100fbfd0cede52352afc335eff6feec`
Parent Baseline   : 2026.10.07.0003

### Scope

- REVISION 17 — Portal Demo static asset cache-busting untuk route register, login, Lead Demo, dan Client Demo.
- REVISION 17.1 — Lead Demo CSP compatibility; styling dinamis dipindahkan ke stylesheet eksternal tanpa melemahkan CSP.
- REVISION 18 — Client Demo CSP compatibility dan visual parity; styling modal, header CTA, mobile navigation, dan progress dipindahkan ke pola external/scoped CSS yang kompatibel dengan production CSP.

### Production verification

- REVISION 17 commit: `ade066995ad40e725daec9892a247e5ad668a1ce`.
- REVISION 17.1 commit: `36a173d7d265092e2be42f946c807b06150e58ee`.
- REVISION 18 commit / runtime anchor: `475618f96100fbfd0cede52352afc335eff6feec`.
- Lead Demo desktop/mobile production verification: PASS.
- Client Demo localhost desktop/mobile verification: PASS.
- Client Demo production visual confirmation: PASS.
- Client Demo progress 82%, modal, header CTA, dan mobile navigation: PASS.
- Strict production CSP dipertahankan; CSP policy tidak diubah atau dilemahkan.
- Global stylesheet tidak diubah oleh REVISION 18.
- Program Ketahanan Pangan dan namespace di luar scoped Portal Demo tidak dibuka ulang oleh closeout ini.
- Working tree dan `origin/main` terverifikasi sinkron pada runtime anchor REVISION 18.

## Platform Baseline 2026.10.07.0003

Platform Baseline : 2026.10.07.0003
Status            : PRODUCTION VERIFIED / COMPLETED / LOCKED
Date              : 7 Oktober 2026
Runtime Anchor    : `68c89f9a6fb4c6dd2ab389619c3a4026cdb07368`
Parent Baseline   : 2026.10.07.0002

### Scope

- REVISION 9 — Mobile Footer + FAQ Architecture.
- REVISION 10 — FAQ Typography Color Alignment.
- REVISION 11 — failed documentation closeout attempt; rolled back with source unchanged.
- REVISION 12 — documentation closeout implementation; source review required metadata/Markdown refinement before staging.
- REVISION 13 — metadata + Markdown refinement; source review menemukan satu malformed inline-code token.
- REVISION 14 — token correction attempt; validation marker mismatch memicu rollback penuh.
- REVISION 15 — token correction attempt; validator memindai code fence historis yang sah dan memicu rollback penuh.
- REVISION 16 — scoped Markdown token correction dan final documentation closeout untuk Platform Baseline 2026.10.07.0003.

### Production verification

- Home FAQ production berisi 6 pertanyaan utama.
- CTA Home FAQ menuju `/faq/` dan `/#estimasi`.
- Dedicated `/faq/` berisi 16 pertanyaan dalam 8 kategori.
- Canonical `/faq/` dan `FAQPage` structured data terverifikasi.
- Mobile footer phone layout menggunakan directory 2 × 2 dengan brand full width.
- Footer safe-space untuk Audio / Privasi tetap terjaga.
- Tipografi FAQ disejajarkan dengan visual Insights.
- Search dan sitemap mengenali `/faq/`.
- Public stylesheet menggunakan cache token `?v=20261007-r9`.
- Referensi stylesheet R7 pada public pages: 0.
- Production visual confirmation: PASS.
- `program/*` dan `portal/*` tidak disentuh.
- `script.js` dan `search-enhancer.js` tidak disentuh.
- Runtime production anchor tetap `68c89f9a6fb4c6dd2ab389619c3a4026cdb07368`.
- Documentation closeout tidak mengubah runtime public source.

## Platform Baseline 2026.10.07.0002

Platform Baseline : 2026.10.07.0002
Date              : 7 Oktober 2026
Scope             : Premium Navigation + Mega Menu + Smart Explore + Premium Footer + Static Asset Cache Busting
Status            : PRODUCTION VERIFIED / COMPLETED / LOCKED
Production Commit : 807dadae0560c93d79fa107cfa6f8191279d027c
Previous Baseline : 2026.10.07.0001

### Ditambahkan

- Premium navigation dengan main visitor navigation yang tetap ringkas dan root-safe.
- Mega Menu `Jelajahi` sebagai discovery layer untuk Solusi, Kepercayaan, Engineering, dan Portfolio.
- Smart Explore / search discovery dengan shortcut keyboard dan jalur eksplorasi yang lebih langsung.
- Premium Footer dengan CTA project, navigation groups, engineering links, portfolio links, legal links, dan contact access.

### Diperbaiki

- REVISION 6 menambahkan Premium Footer Safe Space agar floating Audio dan Privacy controls tidak menimpa footer pada desktop maupun mobile.
- REVISION 7 menambahkan static asset cache-busting `?v=20261007-r7` untuk global `style.css`, `script.js`, dan `search-enhancer.js`.
- Root cause visual regression dikonfirmasi berasal dari stale browser/HTTP cache pada asset global tanpa version token, bukan Service Worker aktif.
- Stale stylesheet regression telah RESOLVED dan production kembali konsisten tanpa mewajibkan hard reload, cache clear, atau Bypass for network.

### Revision Record

- REVISION 4 — initial premium navigation attempt; ROLLED BACK / SOURCE UNCHANGED.
- REVISION 5 — Premium Navigation + Mega Menu + Smart Explore + Premium Footer; production implementation commit `d95f5b2dd3cc2c40a81a3b7d377186b779c77c58`.
- REVISION 6 — Premium Footer Safe Space refinement; included in production commit `d95f5b2dd3cc2c40a81a3b7d377186b779c77c58`.
- REVISION 7 — Static Asset Cache Busting; production commit `807dadae0560c93d79fa107cfa6f8191279d027c`.
- REVISION 8 — documentation closeout untuk Platform Baseline `2026.10.07.0002`; documentation-only iteration.

### Verification

- Source Review: PASS.
- Desktop visual review: PASS.
- Mobile visual review: PASS.
- Local stale-cache trap: PASS.
- Production HTML R7 references: PASS.
- Versioned production assets: HTTP 200 / PASS.
- Production key routes: PASS.
- Production visual verification: PASS.
- Protected namespaces `program/*` dan `portal/*`: UNTOUCHED.
- Final status: PRODUCTION VERIFIED / COMPLETED / LOCKED.

## Platform Baseline 2026.10.07.0001

Platform Baseline : 2026.10.07.0001
Date              : 7 Oktober 2026
Changed Area      : Home Section Detail Architecture
Status            : PRODUCTION VERIFIED / COMPLETED / LOCKED

### Home Section Detail Architecture - Final Closeout

- Home Section Detail Architecture telah selesai dan **PRODUCTION VERIFIED / COMPLETED / LOCKED**.
- Implementation commit: `569edbfa899dc11d5770e75acab5a2c3c3d74a4b` - `feat: add home section detail architecture`.
- Empat route detail baru aktif: `/keahlian-teknis/`, `/layanan/`, `/proses-kerja/`, dan `/kepercayaan-transparansi/`.
- Home tetap menjadi discovery layer; halaman detail menyediakan penjelasan yang lebih lengkap tanpa membuat Home terlalu padat.
- `/engineering/` tetap menjadi System Capabilities + Technical Proof dan tidak dibuka ulang oleh scope ini.
- `/mengapa-memilih-saya/` tetap menjadi Public Trust / Client Decision Layer dan tidak dibuka ulang oleh scope ini.
- **REVISION 1** - Initial Home Section Detail Architecture: struktur Home, empat halaman detail, shared stylesheet, sitemap, dan CTA discovery.
- **REVISION 2** - Typography Color Alignment: warna heading, highlight, eyebrow, dan body text diselaraskan dengan visual language halaman Insights.
- **REVISION 3** - CTA Consistency: CTA Keahlian Teknis, Layanan, Proses Kerja, dan Kepercayaan & Transparansi diselaraskan dengan CTA Kemampuan Sistem menggunakan pola `btn outline`.
- Source Review: **PASS / LOCKED**.
- Visual Desktop: **PASS / LOCKED**.
- Visual Mobile: **PASS / LOCKED**.
- Production Verification: **PASS / LOCKED**.
- Revision naming rule: setiap iterasi pengeditan menggunakan `REVISION N`; penamaan `REVISION` tidak menggantikan Platform Baseline.
- Site Content Architecture V2.01 tetap **COMPLETED / LOCKED**.
- Site Content Architecture V2.02 tetap **PRODUCTION VERIFIED / COMPLETED / LOCKED**.
- Mengapa Memilih Saya tetap **PRODUCTION VERIFIED / COMPLETED / LOCKED**.

---

## Platform Baseline 2026.10.06.0004

Platform Baseline : 2026.10.06.0004
Recorded At       : 2026-10-06 23:37:35 WIB
Timezone          : Asia/Jakarta (UTC+07:00)
Time Format       : 24-hour (HH:mm:ss)

Maintainer        : Srilex Buditra
Role              : Senior Full Stack Developer
Location          : Bengkulu, Indonesia

Changed Area      : Public Trust & Client Decision Layer - Mengapa Memilih Saya
Status            : PRODUCTION VERIFIED / COMPLETED / LOCKED

### Mengapa Memilih Saya - Final Closeout

- Menambahkan public route `/mengapa-memilih-saya/` sebagai client decision + trust/value layer.
- Home mempertahankan tepat 4 kartu `Mengapa Memilih Saya` dan CTA `Lihat Alasan Lengkap ->`.
- Dedicated page menampilkan 10 alasan dan 7-step `Cara Saya Bekerja`.
- Home = discovery; Portfolio = proof-of-work; Profil = authority; Insights = engineering knowledge; Aktivitas = development record; Engineering = system capabilities + technical proof; Mengapa Memilih Saya = client decision + trust/value layer.
- Source Review, desktop/mobile Visual Review, Controlled Staging, Controlled Commit/Push, dan Production Verification seluruhnya **PASS / LOCKED**.
- Implementation commit: `80b3bb18caecc3dce72256747cdf3c9dee8aa511` - `feat: add mengapa memilih saya page`.
- Production mengonfirmasi Home integration, route baru, scoped CSS, sitemap, Engineering preservation, dan core public links.
- CTA alignment yang sempat berbeda pada existing Chrome profile terverifikasi berasal dari PWA / Service Worker cache; tidak diperlukan source patch tambahan.
- Site Content Architecture V2.02 tetap **PRODUCTION VERIFIED / COMPLETED / LOCKED** dan tidak dibuka ulang.
- Protected module/release namespaces tetap independen dan tidak diubah.
- Documentation closeout ini tidak mengubah runtime production.

## Platform Baseline 2026.10.06.0003

Platform Baseline : 2026.10.06.0003
Recorded At       : 2026-10-06 15:11:46 WIB
Timezone          : Asia/Jakarta (UTC+07:00)
Time Format       : 24-hour (HH:mm:ss)

Maintainer        : Srilex Buditra
Role              : Senior Full Stack Developer
Location          : Bengkulu, Indonesia

Changed Area      : Site Content Architecture V2.02 Final Closeout
Status            : PRODUCTION VERIFIED / COMPLETED / LOCKED

### Site Content Architecture V2.02 — Final Closeout

- Site Content Architecture V2.02 Engineering / System Highlights Expansion telah selesai dan **PRODUCTION VERIFIED / COMPLETED / LOCKED**.
- Site Content Architecture V2.01 tetap **5/5 AREAS COMPLETED / LOCKED** dan tidak dibuka ulang.
- Tiga System Highlights existing di Home tetap dipertahankan.
- Home memiliki CTA aktif `Lihat Semua System Engineering ->` menuju `/engineering/`.
- Public route `/engineering/` aktif sebagai system capabilities + technical proof hub.
- Enam domain Engineering aktif: Verification & Trust; Digital Identity & Membership; Analytics & Privacy; Client Management & Workflow; Backend, API & Data Architecture; Cloud Deployment & Reliability.
- `docs/ENGINEERING.md` tetap authority untuk engineering governance/principles.
- Source Review, Desktop/Mobile Visual Review, Controlled Staging, Controlled Commit/Push, Production Source Verification, dan Production Desktop/Mobile Visual Verification seluruhnya **PASS / LOCKED**.
- Source implementation commit: `bf7ac6aa2a93cb51e648d149f3cdb8762cef9092` — `feat: implement system engineering v2.02`.
- Repository telah diverifikasi sinkron antara local `main` dan `origin/main`.
- Production verification mengonfirmasi Home CTA, Engineering page, six-domain architecture, technical boundaries, locked color palette, responsive CSS, sitemap, dan public proof links.
- Protected module/release namespaces tetap dipertahankan.
- Setelah closeout, V2.02 masuk maintenance-only dan hanya dibuka kembali jika ada regression nyata atau approved scope change.
- Documentation closeout ini tidak mengubah runtime production.
## Platform Baseline 2026.10.06.0002

Platform Baseline : 2026.10.06.0002
Recorded At       : 2026-10-06 08:37:34 WIB
Timezone          : Asia/Jakarta (UTC+07:00)
Time Format       : 24-hour (HH:mm:ss)

Maintainer        : Srilex Buditra
Role              : Senior Full Stack Developer
Location          : Bengkulu, Indonesia

Changed Area      : Site Content Architecture V2.02
Status            : APPROVED SCOPE / DOCUMENTATION BASELINE

### Site Content Architecture V2.02 - Engineering / System Highlights Expansion

- Site Content Architecture V2.01 tetap **5/5 AREAS COMPLETED / LOCKED** dan tidak dibuka ulang oleh scope ini.
- V2.02 membuka scope baru untuk memperluas representasi system engineering tanpa membuat Home menjadi padat.
- Tiga card System Highlights existing di Home tetap dipertahankan: Verification & Trust, Digital Identity, dan Analytics & Privacy.
- Planned Home CTA: `Lihat Semua System Engineering ->`.
- Planned public route: `/engineering/`.
- Halaman `/engineering/` direncanakan sebagai pusat system capabilities + technical proof, bukan pengganti Portfolio, Insights, Profil, atau Aktivitas.
- Planned domains: Verification & Trust; Digital Identity & Membership; Analytics & Privacy; Client Management & Workflow; Backend, API & Data Architecture; Cloud Deployment & Reliability.
- `docs/ENGINEERING.md` tetap menjadi authority untuk engineering governance; planned `/engineering/` adalah halaman publik capability/proof.
- Implementation status: **NOT STARTED**.
- Next step: **Controlled Discovery / Scope Audit V2.02**.
- Tidak membuat file Markdown baru pada documentation baseline ini.

## Platform Baseline 2026.10.06.0001

Platform Baseline : 2026.10.06.0001
Recorded At       : 2026-10-06 05:02:28 WIB
Timezone          : Asia/Jakarta (UTC+07:00)
Time Format       : 24-hour (HH:mm:ss)

Maintainer        : Srilex Buditra
Role              : Senior Full Stack Developer
Location          : Bengkulu, Indonesia

Changed Area      : Platform Governance + Site Content Architecture V2.01
Status            : PRODUCTION VERIFIED / SITE CONTENT ARCHITECTURE V2.01 5/5 LOCKED

- Established SRILEXBUDITRA.WORK Platform Baseline governance using YYYY.MM.DD.NNNN.
- Established Asia/Jakarta / WIB as the official project timezone using 24-hour HH:mm:ss time.
- Aligned current Site Content Architecture naming to V2.01 while preserving historical V2 records.
- Preserved module-specific version namespaces independently.
- No new Markdown file was created.

### Site Content Architecture V2.01 — Final Closeout

- Home V2.01, Portfolio V2.01, Profil V2.01, Insights V2.01, dan Aktivitas V2.01 sekarang **COMPLETED / LOCKED**.
- Site Content Architecture V2.01 mencapai **5/5 AREAS COMPLETED / LOCKED**.
- Aktivitas V2.01 diimplementasikan melalui commit `4a7a31eb37c72b414666aeaac495e9f441de4886` — `feat: implement aktivitas v2.01 content architecture`.
- Source Review, Visual Review, Controlled Staging, Controlled Commit/Push, dan Production Verification Aktivitas V2.01 seluruhnya **PASS**.
- Production verification mengonfirmasi milestone baru tampil dan milestone obsolete `Level & Poin / ROADMAP` tidak lagi menjadi bagian dari timeline site-level.
- `aktivitas/activity.css` tetap tidak berubah; implementasi final hanya memerlukan `aktivitas/index.html`.
- Historical V2 records dan namespace versi modul/project tetap dipertahankan.

## Site Content Architecture V2 - Documentation Baseline (4 Oktober 2026)

**Status:** Documentation baseline; implementasi halaman publik V2 belum dimulai.

### Added
- Menetapkan namespace arsitektur halaman publik:
  - `Home V2`
  - `Portfolio V2`
  - `Profil V2`
  - `Insights V2`
  - `Aktivitas V2`
- Menetapkan tanggung jawab setiap halaman agar project yang sama tidak diduplikasi dengan fungsi dan narasi yang sama.
- Menetapkan `docs/ROADMAP.md` sebagai master arah Site Content Architecture V2.
- Menetapkan `docs/PLATFORM.md` sebagai master untuk Insights V2 dan Aktivitas V2.

### Versioning Convention
- Nama halaman publik menggunakan `V1`, `V2`, `V3`, dan seterusnya sesuai evolusi arsitektur halaman.
- Versi modul/project tetap menggunakan namespace versi modul masing-masing.
- Nama release teknis `R1`, `R2`, dan seterusnya yang sudah sah tetap dipertahankan.
- `Cloudflare R2` adalah object storage, bukan versi halaman.
- Historical release/version tidak diubah massal.

### Current Direction
- Home V2: kurangi duplikasi Featured Projects dan Case Studies melalui hierarchy yang lebih jelas.
- Portfolio V2: pertahankan live implementations, tambah system case studies, dan pisahkan project samples.
- Profil V2: tetap menjadi authority page, bukan portfolio kedua.
- Insights V2: perluas engineering notes dari Ketahanan Pangan ke implementasi lintas project.
- Aktivitas V2: lanjutkan timeline menggunakan milestone terverifikasi sampai perkembangan terbaru.
- Tahap berikutnya adalah `V2 Evidence & Timeline Audit` sebelum perubahan public HTML/CSS.

### Scope
- Sinkronisasi ini hanya memperbarui dokumentasi existing.
- Tidak membuat file Markdown baru.
- Tidak mengubah HTML, CSS, JavaScript, Worker, API, database, autentikasi, atau runtime production.

## Client Management R1 - Demo Journey & Lead-to-Client Experience (3 Oktober 2026)

**Status:** Production Release R1 **LOCKED/PASS**

### Added
- Menambahkan Full Demo Journey publik:
  - `/portal/demo/register/`
  - `/portal/demo/login/`
  - `/portal/demo/lead/`
  - `/portal/demo/`
- Menambahkan perjalanan Demo berurutan dari Registrasi Demo sampai Client Dashboard Demo.
- Menambahkan Stage 5 `Aktivasi Client Demo` pada Lead Portal Demo.
- Menambahkan shared journey identity melalui `sb_demo_journey_r1`.
- Menambahkan Open Graph preview khusus untuk empat route Demo.
- Menambahkan CTA `Mulai Project Nyata` pada Client Demo menuju `/#harga`.

### Improved
- Lead Portal menggunakan Decision Focus Mode pada tahap Penawaran Resmi.
- State setelah Estimate disetujui menampilkan `Penawaran Disetujui` dan `Menunggu Aktivasi Client`.
- WhatsApp pada Lead dan Registrasi digunakan sebagai bantuan sekunder dengan konteks proses yang aman.
- Mobile navigation Client Demo ditingkatkan menjadi Beranda, Proyek, Dokumen, dan Dukungan.
- Mobile navigation Client Portal nyata diselaraskan secara visual tanpa mengubah mekanisme JavaScript produksi.
- Identitas Demo dari Registrasi diteruskan sampai Client Dashboard Demo.
- State sukses Registrasi nyata sekarang menyediakan `Coba Alur Demo Lengkap`.

### Verified
- Full Demo Journey desktop: PASS.
- Full Demo Journey mobile: PASS.
- Full Demo Journey Identity R1: LOCKED/PASS.
- Demo Journey Open Graph Preview R1: LOCKED/PASS.
- Client Demo Mobile Navigation R1: LOCKED/PASS.
- Real Client Mobile Navigation R1: LOCKED/PASS.
- Real Registration -> Full Demo Handoff R1: LOCKED/PASS.
- Registrasi nyata dan Demo Registration route terverifikasi HTTP 200 pada staging.
- Demo tetap tanpa API produksi, tanpa D1, dan tanpa mutasi data produksi.
- Demo Isolation R1: **LOCKED/PASS**; footer Demo Client telah diperjelas menjadi `data simulasi lokal`.
- Final Closeout R1: **LOCKED/PASS**.
- Real Lead + Official Estimate closeout: Lead `qualified`, Estimate `approved`, total Rp5.300.000, Client belum diaktivasi, dan Invoice belum dibuat.

### Functional Source Baseline
- Branch: `feature/client-management-r1`
- Functional source baseline sebelum documentation sync: `4c79db1 feat: link real registration success to full demo journey`
- Latest staging-tested content: `1cafcc7 fix: preserve production mobile css deltas`
- Release-candidate base: `63fbe32 chore: reconcile main history for production release r1`
- Production Release R1: **LOCKED/PASS**; release content `4495cd6` telah diterbitkan ke `main` dan diverifikasi di runtime production.

### Homepage Demo Integration R1
- Alur homepage:
  `Why Choose Me -> Coba Pengalaman Client -> Packages & Pricing`
- Homepage Demo Integration R1: **LOCKED/PASS**.
- Hero Demo CTA desktop + mobile: **LOCKED/PASS**.
- Mobile Horizontal Overflow Fix R1: **LOCKED/PASS**.
- Hero `SB DIGITAL` desktop + mobile: **LOCKED/PASS**.
- Homepage metadata, Open Graph source, PWA manifest, dan social asset staging: **PASS**.
- Asset canonical `og:image` telah tersedia di production setelah Production Release R1; validasi ulang preview melalui scraper Meta tetap merupakan pemeriksaan eksternal terpisah.

### Next
- `PRODUCTION RELEASE R1` - **LOCKED/PASS**; released to `main`, production runtime verified.
- Merge/release ke `main` hanya setelah persetujuan eksplisit.

---
## V17.19.13B.4 — Aktivitas & Event Public Integration (17 September 2026)

**Status:** Implemented / pre-lock; final OG/Schema/GA4 verification pending.

### Added
- Added URL publik Event berbasis slug pada Dashboard Admin dengan aksi **Salin Link** dan **Lihat Publik**.
- Added halaman detail Event publik pada `/program/ketahanan-pangan/event/<slug>/` melalui Worker publik khusus.
- Added Gambar Utama Event pada R2 `EVENT_IMAGES` untuk kartu peserta, halaman publik, dan social preview.
- Added bidang SEO & Tampilan Publik pada Edit Event: slug, Judul SEO, Meta Description, Alt Text, dan kontrol index setelah dipublikasikan.
- Added Rich Summary pada halaman publik sehingga heading, paragraf, bold, line break, dan daftar sederhana dapat dirender dari satu sumber Ringkasan Admin.

### Changed
- Deskripsi kartu Admin dan Dashboard Peserta dibersihkan dari Markdown mentah dan dipendekkan sesuai konteks tampilan.
- URL publik pada kartu Admin dibuat lebih ringkas agar tidak mendominasi layout.
- Halaman publik memakai asset CSS/JS same-origin agar kompatibel dengan CSP ketat tanpa `unsafe-inline`.

### Fixed
- Fixed tombol **Simpan Perubahan** Event agar update tersimpan konsisten.
- Fixed tombol **Pilih / Ganti Gambar** agar file picker dapat dibuka dari modal Edit Event.
- Fixed tampilan halaman Event publik yang sebelumnya dapat tampil tanpa styling karena konflik CSP.

### Event Flow
- Admin dapat membuat Draft, mengedit, mempublikasikan, mengembalikan ke Draft, menutup, dan membatalkan Event.
- Peserta dapat melihat agenda yang dipublikasikan, mendaftar, membatalkan sesuai aturan, dan melihat status kehadiran.
- Poin Aktivitas hanya masuk setelah status kehadiran menjadi **Hadir Terverifikasi**; pendaftaran Event tidak langsung memberi poin.

### SEO / Metadata / Analytics
- Implementasi Open Graph/social preview, Schema.org Event, dan GA4 Event Analytics telah dipasang pada jalur Public Event.
- Statusnya masih **testing** sampai pengujian final OG/WhatsApp Preview, Schema.org Event, dan event GA4 selesai; belum dinyatakan LOCK/verified pada dokumentasi ini.

### Versions covered
- V17.19.12 — Event Save Changes Fix.
- V17.19.13A — SEO & Gambar Utama Event.
- V17.19.13A.1 — Image Picker Hotfix.
- V17.19.13B — Public Event + OG + Schema.org + GA4 integration.
- V17.19.13B.1 — Public Style/CSP + Clean Description Hotfix.
- V17.19.13B.2 — Admin Public Link + Clean Event Card.
- V17.19.13B.3 — Rich Summary.
- V17.19.13B.4 — Compact Public URL.

# V13.4.1 — Sinkronisasi Level Pusat Notifikasi

## V13.6.0 — Keamanan & Sesi Akun Peserta
- Menambahkan pusat keamanan dan daftar sesi/perangkat aktif.
- Login mendukung maksimal 5 sesi aktif per akun.
- Menambahkan pencabutan sesi perangkat lain dan riwayat keamanan server-side.
- Menambahkan notifikasi login baru tanpa mengekspos session token atau alamat IP lengkap.
- Perubahan password tetap mengakhiri sesi perangkat lain.


- Memperbaiki ringkasan Level pada Pusat Notifikasi agar dihitung dari Total Poin yang sama dengan halaman Level & Poin.
- Tidak mengubah Worker, ledger poin, notifikasi, Kartu Anggota, Misi, Referral, Benefit, Aktivitas/Event, atau Marketplace.

## V13.2.0 — Aktivitas & Event Peserta

- Added halaman `peserta/aktivitas/` untuk agenda, pendaftaran event, status kehadiran, dan riwayat aktivitas.
- Added tabel D1 `participant_events` dan `participant_event_registrations` yang dibuat otomatis oleh Worker.
- Added endpoint `GET /activity-events`, `POST /activity-events/register`, dan `POST /activity-events/cancel`.
- Added Poin Aktivitas/Event ke Total Poin.
- Security: peserta tidak dapat menandai kehadiran sendiri; Poin Aktivitas hanya direkonsiliasi setelah status `attended` ditetapkan oleh proses pengelola.
- Preserved Kartu Anggota + QR, safe-area 5 mm, sertifikat, Misi, Referral, Benefit, dan ledger poin yang sudah stabil.



## V13.1.0 — Benefit Peserta
- Menambahkan halaman Benefit Peserta berbasis status server.
- Menambahkan endpoint peserta `GET /benefits`.
- Benefit dibuka berdasarkan Level, Total Poin, Registrasi Terverifikasi, dan VERIFIED MEMBER.
- Tidak mengubah Kartu Anggota + QR, safe-area 5 mm, Misi, Referral, atau ledger poin.

## V12.3.1 — VERIFIED MEMBER Photo CSP Compatibility
- Memuat foto anggota melalui `fetch()` + Blob URL agar sesuai dengan kebijakan `img-src 'self' data: blob:`.
- Tidak memperlebar CSP untuk domain API eksternal.
- Migration D1 dan source Worker Cloudflare tidak disertakan dalam patch GitHub deployment.

# CHANGELOG

Semua perubahan penting pada website dan modul terkait **Srilex Buditra — Full Stack Developer** dicatat dalam dokumen ini.

Dokumen ini menggunakan dua riwayat versi agar nomor versi website utama tidak tercampur dengan nomor versi pengembangan modul **Project Estimator & Secure Document**.

---


## V12.3 — VERIFIED MEMBER + Foto (13 September 2026)
- Memisahkan status registrasi `verified` dari status VERIFIED MEMBER.
- Menambahkan rekam foto setengah badan langsung dari kamera pada area peserta.
- Menambahkan review manual foto anggota pada Dashboard Admin.
- Kartu Anggota + QR baru aktif setelah member verification berstatus `approved`.
- Menampilkan foto anggota pada kartu setelah approval.
- Foto disimpan private di R2; tidak ada face matching biometrik otomatis.

## A. Versi Website Utama

### V12.2 — Kartu Anggota Digital + QR
**13 September 2026**

#### Ditambahkan
- Menambahkan route authenticated `/program/ketahanan-pangan/peserta/kartu/` untuk Kartu Anggota Digital peserta terverifikasi.
- Menambahkan kartu depan/belakang yang responsif dan print-friendly.
- Menambahkan QR lokal yang mengarah ke verifikasi publik berdasarkan Nomor Registrasi.
- Menambahkan aksi Cetak/Simpan PDF, Salin Link Verifikasi, dan Buka Verifikasi.
- Mengaktifkan layanan **Kartu Anggota + QR** pada Dashboard Peserta V2 hanya untuk status `verified`.

#### Keamanan & Privasi
- Halaman kartu diberi `noindex,nofollow,noarchive` dan memerlukan sesi peserta aktif.
- Kartu tidak menampilkan NIK, nomor KK, WhatsApp, email, password, atau dokumen identitas.
- QR tidak menyimpan data sensitif; QR hanya mengarah ke halaman verifikasi publik dengan Nomor Registrasi.
- Tidak ada perubahan pada Worker/API, database, session cookie, registrasi, verifikasi publik, atau penerbitan sertifikat.

#### Dokumentasi
- Menambahkan `KARTU-ANGGOTA-QR-V12.2.md`.
- Memperbarui `DASHBOARD-PESERTA-V2.md`, README, DOCUMENTATION, roadmap, dan README Program Ketahanan Pangan.

### V12.1 — Dashboard Peserta V2
**13 September 2026**

#### Ditingkatkan
- Menyempurnakan dashboard peserta tanpa mengubah API, autentikasi, atau endpoint yang sudah berjalan.
- Menambahkan ringkasan status keanggotaan, progres akun, dan akses layanan digital berbasis status peserta.
- Menambahkan navigasi cepat dashboard dan area Ekosistem Keanggotaan.
- Menampilkan Sertifikat Digital sebagai layanan aktif hanya untuk status terverifikasi.
- Menampilkan Kartu Anggota + QR serta Aktivitas & Poin sebagai `NEXT`/`ROADMAP`, bukan sebagai fitur live.
- Mempertahankan alur status, sinkronisasi, catatan admin, revisi data, sertifikat, dan dukungan IT existing.

#### Dokumentasi
- Menambahkan `DASHBOARD-PESERTA-V2.md`.
- Memperbarui README, DOCUMENTATION, roadmap, dan README Program Ketahanan Pangan.

#### Prinsip Perubahan
- Tidak ada perubahan pada Worker/API, session cookie, database, token, registrasi, verifikasi publik, atau mekanisme penerbitan sertifikat.
- Perubahan bersifat additive pada pengalaman dashboard dan tetap mobile-first.

### V12.0 — Development Timeline / Activity
**13 September 2026**

#### Ditambahkan
- Menambahkan halaman publik `/aktivitas/` sebagai Development Timeline & Activity.
- Menampilkan selected public milestones dari performance, verification, analytics, flagship Program Ketahanan Pangan, Trust & Authority, Documentation Sync, dan Knowledge Center.
- Menambahkan section Development Timeline pada homepage, internal search entry, sitemap route, dan footer link.
- Menandai status milestone secara eksplisit sebagai `COMPLETED`, `LIVE SYSTEM`, atau `ROADMAP`.

#### Dokumentasi
- Menambahkan `PROJECT-TIMELINE-V12.0.md`.
- Memperbarui README, DOCUMENTATION, dan roadmap agar current phase sinkron dengan implementasi.

#### Prinsip Perubahan
- V12.0 tidak mengubah API, Worker, autentikasi, registrasi, dashboard peserta, verifikasi, sertifikat, atau data peserta Program Ketahanan Pangan.
- Timeline publik tidak menampilkan secret atau data pribadi.

### V11.9 — Knowledge Center / Insights Foundation
**13 September 2026**

#### Ditambahkan
- Menambahkan Knowledge Center publik pada `/insights/`.
- Menambahkan tiga artikel awal berbasis pengalaman implementasi: alur digital peserta, QR verification/sertifikat digital, dan responsive-first portal peserta.
- Menambahkan section Insights pada homepage tanpa mengganti visual/fitur existing.
- Menambahkan metadata Article, author linkage ke `/profil/`, internal search entries, dan sitemap route untuk Knowledge Center.

#### Dokumentasi
- Menambahkan `KNOWLEDGE-CENTER-V11.9.md`.
- Memperbarui README, DOCUMENTATION, dan roadmap agar status Knowledge Center sinkron dengan implementasi.

#### Prinsip Perubahan
- V11.9 tidak mengubah API, Worker, autentikasi, registrasi, dashboard, verifikasi, sertifikat, atau data peserta.

### V11.8 — Documentation Sync, Flagship & Trust Authority Baseline
**13 September 2026**

#### Dokumentasi
- Menyinkronkan `README.md`, `DOCUMENTATION.md`, roadmap, dan README area program dengan struktur repository terbaru.
- Menambahkan `DOCUMENTATION_AUDIT_V11.8.md` sebagai baseline audit dokumentasi terbaru tanpa menghapus audit V11.6.
- Menghapus tautan aktif dari indeks dokumentasi ke enam file `docs/archive/` yang tidak terdapat pada snapshot repository terbaru.
- Menetapkan `DOCUMENTATION.md` sebagai indeks aktif dan mempertahankan audit/dokumen versi lama sebagai histori.

#### Flagship & Portfolio
- Mencatat Program Ketahanan Pangan sebagai flagship implementation pada homepage.
- Mencatat case study publik pada `/portfolio/ketahanan-pangan/` dengan visual flagship terpadu.
- Mencatat hubungan portal, registrasi, verifikasi, akun peserta/dashboard, sertifikat QR, dan dokumentasi sebagai satu ekosistem layanan.

#### Trust & Authority
- Mencatat halaman `/profil/` sebagai profil publik dan rekam jejak Srilex Buditra.
- Memperbarui roadmap agar Trust & Authority serta Knowledge Center dikerjakan sebelum ekspansi fitur engagement anggota.

#### Prinsip Perubahan
- Documentation Sync V11.8 tidak mengubah API, Worker, autentikasi, registrasi, dashboard, verifikasi, sertifikat, atau data peserta.
- Dokumentasi diselaraskan dengan file yang benar-benar terdapat pada snapshot repository saat audit dilakukan.

### V11.7 — Analytics V4
**4 September 2026**

#### Ditambahkan
- Menambahkan Analytics V4 berbasis Cloudflare Workers + D1.
- Menambahkan dashboard admin statistik melalui `admin/stats.html`, `admin/stats.css`, dan `admin/stats.js`.
- Menambahkan pencatatan event kunjungan untuk statistik periode, tren, perangkat, browser, negara, halaman, referrer, dan recent visits.
- Menggunakan visitor ID anonim `sb_visitor_id` untuk membedakan visitor baru dan kembali tanpa mengambil identitas akun sosial.
- Menambahkan endpoint `/visitor` untuk pencatatan kunjungan dan `/stats` untuk statistik admin.

#### Keamanan & Privasi
- Melindungi endpoint `/stats` menggunakan `STATS_API_KEY` sebagai Cloudflare Worker Secret.
- Mempertahankan API key di luar JavaScript publik dan repository GitHub.
- Membatasi analytics pada data kunjungan anonim dan metadata teknis yang diperlukan untuk statistik.

#### Dokumentasi
- Menambahkan `ANALYTICS-V4.md` sebagai dokumentasi aktif Analytics V4.
- Memperbarui `README.md` dan `DOCUMENTATION.md` untuk menandai awal pengembangan website V11.7.


### V11.6 — Repository Audit, Search Accessibility & Verification Hardening
**3 September 2026**

#### Diubah
- Menyelesaikan audit menengah repository dan merapikan aset duplikat pada proyek Website Sekolah.
- Mengarahkan preview Website Sekolah V2 ke aset canonical utama agar tidak menyimpan salinan yang tidak diperlukan.
- Menyempurnakan komponen pencarian website, termasuk autocomplete, riwayat pencarian, pencarian populer, navigasi keyboard, dan sinkronisasi status ARIA.
- Mempertahankan `search-enhancer.js` sebagai enhancement terpisah tanpa mengubah alur halaman hasil pencarian utama.

#### Diperbaiki
- Menghapus aset preview Website Sekolah V2 yang duplikat/besar dan memastikan referensi internal tetap valid.
- Menyempurnakan state awal dan pembaruan `aria-expanded`, `aria-controls`, `aria-activedescendant`, `role="option"`, serta pengelolaan fokus pada saran pencarian.
- Memperkuat kompatibilitas fitur pencarian pada desktop dan perangkat mobile.

#### Keamanan & Verifikasi
- Menambahkan backend verifikasi opsional berbasis Cloudflare Worker + KV untuk penerbitan dan pembacaan data dokumen terverifikasi.
- Menambahkan dukungan publisher token pada endpoint penerbitan dokumen.
- Mempertahankan fallback database statis `verify/data/documents.json` ketika API publisher tidak dikonfigurasi.

#### Dokumentasi
- Menambahkan `AUDIT_MENENGAH_V11.6.md`.
- Memperbarui dokumentasi database/verifikasi dokumen melalui `VERIFY_DATABASE_README.md`.
- Menambahkan `DOCUMENTATION.md` sebagai indeks dokumentasi repository dan `DOCUMENTATION_AUDIT_V11.6.md` sebagai catatan audit dokumentasi V11.6.
- Memindahkan enam engineering notes historis ke `docs/archive/` setelah referensi internal diverifikasi.
- Memperbarui tautan dokumentasi agar catatan historis tetap dapat diakses tanpa memenuhi root repository.

### V11.5.2 — Performance Implementation Synchronization Fix
**1 September 2026**

#### Diubah
- Menyinkronkan implementasi performa yang sebelumnya direncanakan pada V11.5.1 ke source aktual.
- Menambahkan `defer` pada script homepage:
  - `script.js`
  - `search-enhancer.js`
  - `tts.js`

#### Diperbaiki
- Menambahkan dimensi intrinsik pada gambar hero/profile.
- Menambahkan `fetchpriority="high"` pada kandidat gambar hero/LCP.
- Menambahkan `decoding="async"` pada gambar hero/profile.
- Menambahkan dimensi eksplisit dan `decoding="async"` pada logo yang digunakan di header dan footer.

#### Dokumentasi
- Menambahkan `PERFORMANCE_V11.5.2.md`.
- Menyinkronkan status implementasi V11.5.1 agar tidak menimbulkan klaim yang tidak sesuai dengan source aktual.

---

### V11.5.1 — Critical Loading & Performance Strategy
**1 September 2026**

#### Strategi dan Target
- Menetapkan strategi pemuatan JavaScript non-kritis menggunakan `defer`.
- Menetapkan prioritas pemuatan gambar hero/LCP.
- Menetapkan penggunaan dimensi intrinsik untuk membantu stabilitas layout.
- Mempertahankan lazy loading untuk gambar portfolio di bawah area awal halaman.
- Meninjau strategi pemuatan fitur TTS, pencarian, dan fitur interaktif lainnya.

> **Catatan:** Sinkronisasi penuh strategi V11.5.1 ke implementasi source aktual diselesaikan pada **V11.5.2**.

---

### V11.4 — Asset Architecture & Performance Cleanup

#### Diubah
- Merapikan arsitektur aset website.
- Meninjau aset besar dan aset yang berpotensi tidak diperlukan.
- Mengoptimalkan struktur aset untuk mendukung pemeliharaan dan performa.

#### Dokumentasi
- Menambahkan dokumentasi arsitektur dan audit aset:
  - `ASSET_ARCHITECTURE_V11.4.md`
  - `ASSET_OPTIMIZATION_AUDIT.md`

---

## B. Riwayat Modul Project Estimator & Secure Document

> Nomor versi pada bagian ini adalah riwayat pengembangan modul. Nomor tersebut **bukan** versi keseluruhan website.

### V31 — Balanced Vertical Signature Cards
**3 September 2026**

#### Diperbaiki
- Menyeimbangkan posisi vertikal isi kartu tanda tangan pada hasil Print/PDF.
- Menjaga nama, tanggal, dan tanda tangan tetap berada pada safe area kartu A4.

---

### V30 — Secure Verification Publisher & Signature Normalization
**3 September 2026**

#### Ditambahkan
- Menambahkan Cloudflare Worker + KV sebagai backend verifikasi dokumen opsional.
- Menambahkan endpoint penerbitan dokumen dengan autentikasi `PUBLISHER_TOKEN`.
- Menambahkan dukungan `SB_VERIFY_API` pada estimator untuk mengirim record dokumen ketika backend dikonfigurasi.

#### Diperbaiki
- Menormalisasi stage tanda tangan pada mode Print/PDF agar ukuran dan posisi kedua pihak lebih konsisten.

---

### V29 — Local Verification QR & Larger Signatures
**3 September 2026**

#### Diubah
- Mengganti ketergantungan QR eksternal dengan QR SVG inline yang dibuat sepenuhnya di browser.
- Memastikan QR verifikasi tetap dapat dirender pada Chrome, browser mobile, in-app browser, dan print engine tanpa host gambar eksternal.
- Memperbesar tanda tangan pada hasil Print/PDF tanpa menambah tinggi kartu A4.

---

### V28 — Professional Verification QR & Signature Alignment

#### Diperbaiki
- Menetapkan QR verifikasi profesional berukuran sekitar 3 cm × 3 cm pada dokumen cetak.
- Menyempurnakan ukuran dan optical centering tanda tangan pada kartu Print/PDF.

---

### V27 — Document Verification QR & Database

#### Ditambahkan
- Menambahkan QR verifikasi pada Project Cost Estimate yang mengarah ke `/verify/?id=DOCUMENT_ID`.
- Menambahkan database statis `verify/data/documents.json` sebagai fallback verifikasi pada deployment statis.
- Menambahkan dokumentasi `VERIFY_DATABASE_README.md`.

---

### V24 — Signature Card Height & Caption Safe Zone

#### Diperbaiki
- Menyetarakan tinggi kartu tanda tangan dan menyediakan safe zone untuk caption agar tidak menyentuh outline kartu.

---

### V23 — Signature Date Safe Alignment

#### Diperbaiki
- Memisahkan baris tanda tangan, nama, dan tanggal agar kedua kartu tetap simetris dan teks tidak bertabrakan dengan batas kartu.

---

### V22 — Print Signature Caption Alignment

#### Diperbaiki
- Memusatkan caption dan identitas pada kedua kartu tanda tangan khusus mode Print/PDF.

---

### V21 — Readable A4 Portrait One-Page

#### Diubah
- Menyesuaikan engine cetak agar tetap satu halaman A4 portrait dengan tipografi yang lebih mudah dibaca.
- Menggunakan pengukuran tinggi report aktual dan skala minimum adaptif untuk perbedaan print engine antar-browser.

---

### V20 — A4 Portrait One-Page Print

#### Diubah
- Mengubah canvas Print/PDF menjadi A4 portrait satu halaman dengan margin cetak terkontrol.
- Menjaga tampilan layar dan Secure Document tetap tidak berubah.

---

### V19 — A4 One-Page Print Engine

#### Diubah
- Mengembangkan strategi cetak/PDF satu halaman lintas browser menggunakan ukuran fisik A4 dan penyesuaian skala.
- Menyempurnakan tata letak khusus mode cetak tanpa mengubah tampilan utama website.

---

### V18 — A4 Single-Page Print Canvas

#### Diubah
- Menambahkan canvas cetak A4 satu halaman sebagai tahap awal optimasi estimator untuk Print/Save PDF.

---

### V17 — Official Payment Accounts

#### Ditambahkan
- Menambahkan bagian rekening pembayaran resmi pada Project Cost Estimate.
- Menambahkan kartu bank dan catatan pembayaran khusus dokumen estimator.

---

### V16 — Official Logo in PDF Header

#### Diubah
- Mengganti brand mark pada header PDF dengan logo resmi Srilex Buditra tanpa mengubah layout dokumen lainnya.

---

### V14 — Responsive Print & Signature Geometry Fix

#### Diperbaiki
- Menyempurnakan responsivitas layout cetak.
- Memperbaiki geometri dan posisi tanda tangan pada hasil cetak/PDF.

---

### V11 — Inline SVG Signature Print Reliability

#### Diperbaiki
- Meningkatkan keandalan rendering tanda tangan menggunakan pendekatan SVG inline pada mode cetak/PDF.

---

### V7 — Mobile Contract Signature Refinement

#### Diperbaiki
- Menyempurnakan pengalaman tanda tangan kontrak pada perangkat mobile.
- Menyesuaikan interaksi dan tampilan area tanda tangan agar lebih responsif.

---

### V5 — Premium Agreement & Print Isolation

#### Ditambahkan
- Pengembangan acknowledgement/persetujuan pada dokumen estimator.
- Isolasi elemen tertentu untuk mode cetak/PDF agar hasil dokumen lebih terfokus.

---

### V3 — Print/PDF Layout Fix

#### Diperbaiki
- Memperbaiki tata letak mode Print/PDF.
- Menyempurnakan elemen dokumen agar lebih stabil saat dicetak atau disimpan sebagai PDF.

---

### V2 — Privacy Consent Responsive

#### Diperbaiki
- Menyempurnakan tampilan dan perilaku Privacy Consent agar responsif pada desktop dan mobile.

---

### Privacy Consent Gate
**1 September 2026**

#### Ditambahkan
- Checkbox persetujuan privasi sebagai kontrol sebelum tindakan tertentu dilanjutkan.
- Kontrol JavaScript untuk memantau status persetujuan secara real-time.
- Penguncian tindakan terkait WhatsApp dan Print/PDF sampai persetujuan yang diperlukan diberikan.
- Styling responsif untuk komponen persetujuan privasi.
- Dokumentasi `PRIVACY_CONSENT_FORM.md`.

---

## Prinsip Penomoran Versi

- **Versi Website Utama** menggunakan riwayat versi keseluruhan proyek, misalnya `V11.4`, `V11.5.1`, dan `V11.5.2`.
- **Versi Modul Project Estimator & Secure Document** mempertahankan riwayat pengembangan internal modul, misalnya `V2`, `V3`, `V5`, `V7`, `V11`, `V14`, `V16`–`V24`, dan `V27`–`V31`.
- Kedua sistem versi dipisahkan agar tidak menimbulkan kesan bahwa `V31` adalah versi keseluruhan website yang lebih baru daripada `V11.6`.

---

## Catatan

- Urutan entri pada setiap bagian disusun dari perubahan terbaru ke perubahan sebelumnya.
- Dokumentasi teknis yang lebih rinci tersedia pada file dokumentasi terkait di repository.
- Perubahan desain atau implementasi besar sebaiknya dicatat pada bagian versi yang sesuai agar riwayat repository tetap mudah diaudit.

## V13.0.0 — Referral Peserta

- Added halaman `peserta/referral/` khusus VERIFIED MEMBER.
- Added kode dan tautan referral yang dibuat oleh server.
- Added atribusi referral dari `registrations.source` tanpa mengubah Registration Worker.
- Added +50 Poin Referral untuk setiap referral yang berstatus `verified`.
- Added anti-self-referral berdasarkan NIK/WhatsApp yang sama.
- Added statistik agregat referral tanpa mengekspos identitas peserta yang diundang.
- Changed Total Poin menjadi Poin Dasar + Poin Misi + Poin Referral.
- Preserved Kartu Anggota + QR, safe-area 5 mm, foto anggota, sertifikat, dan modul admin.

## V13.3.0 — Marketplace & Ekosistem Peserta

- Added halaman `peserta/marketplace/` sebagai katalog resmi dan pencatatan minat.
- Added endpoint Marketplace server-side tanpa checkout/pembayaran otomatis.
- Added syarat Level dan VERIFIED MEMBER untuk akses item katalog.
- Preserved seluruh modul engagement dan identitas digital yang sudah stabil.

## V13.4.0 — Notifikasi & Informasi Peserta

- Added halaman `peserta/notifikasi/` sebagai pusat pemberitahuan peserta.
- Added endpoint `GET /notifications` dan `POST /notifications/read`.
- Added penyimpanan status dibaca di D1 melalui `participant_notifications`.
- Added fondasi `participant_announcements` untuk informasi program pada tahap berikutnya.
- Added notifikasi otomatis untuk registrasi terverifikasi, VERIFIED MEMBER, ledger poin, benefit, event, dan katalog Marketplace.
- Added badge jumlah notifikasi belum dibaca pada Dashboard Peserta.
- Preserved Kartu Anggota + QR, safe-area 5 mm, Sertifikat, Misi, Referral, Benefit, Aktivitas/Event, Marketplace, dan fungsi Admin existing.

## V13.5.0 — Profil & Pengaturan Akun Peserta
- Menambahkan halaman `/program/ketahanan-pangan/peserta/profil/`.
- Menambahkan preferensi notifikasi server-side.
- Menambahkan perubahan password peserta dengan verifikasi password saat ini dan revokasi sesi perangkat lain.
- Menambahkan ringkasan akun, data pertanian read-only, sesi aktif, dan riwayat engagement singkat.
- Data registrasi inti tetap tidak dapat diedit dari halaman profil.

## V13.6.4 — Centralized GA4 & Visitor Analytics
- `visitor-analytics.js` dipusatkan ke `/assets/js/visitor-analytics.js`.
- Seluruh halaman HTML menggunakan satu tracker global.
- Salinan tracker di folder-folder halaman dihapus.
- Event GA4, privacy filter, Visitor Analytics, dan fungsi website V13.6.2 dipertahankan.

---

## V13.6.14.x — Mobile Consent & Floating Controls

> Consolidated historical changelog untuk perbaikan viewport, consent mobile, pinch guard, dan floating controls.

### V13.6.14.5 — Visual Viewport Consent Lock

- Mobile consent menggunakan `window.visualViewport` untuk menghitung posisi aktual.
- Mengatasi card yang masih bergeser akibat perbedaan layout viewport dan visual viewport.
- Posisi disinkronkan ulang pada resize, perubahan orientasi, dan perubahan visual viewport.
- CSS `100dvw` tetap digunakan sebagai fallback.
- Desktop, TTS, context-aware text, dan Consent Mode tidak diubah.

### V13.6.14.8 — Free Scroll Fixed Consent

- Menghapus body-fixed hard scroll lock V13.6.14.7.
- Mengembalikan scroll halaman mobile secara normal.
- Mempertahankan penguncian posisi consent ke visual viewport.
- Mempertahankan ResizeObserver untuk kestabilan posisi card.
- Mempertahankan TTS auto-hide selama consent terbuka.
- Tidak mengubah layout/visual halaman website di belakang.

### V13.6.14.9 — Consent Pinch Guard

- Memblokir pinch zoom / multi-touch hanya selama panel consent terbuka di mobile.
- Scroll satu jari tetap normal.
- Tidak mengubah meta viewport global.
- Setelah panel consent ditutup, pinch zoom browser dikembalikan normal.
- Desktop, TTS, visual layout, dan Consent Mode tidak diubah.

### V13.6.14.11 — Global Mobile Pinch Guard

- Pinch zoom dua jari diblokir pada seluruh halaman mobile.
- Scroll satu jari tetap dipertahankan.
- Tombol Privacy launcher dikunci ke visual viewport kanan bawah.
- Tidak memakai `user-scalable=no`.
- TTS, Consent Mode, GA4, desktop, dan visual layout yang sudah stabil dipertahankan.

### V13.6.14.12 — Floating Controls Viewport Lock

- Mengunci TTS ke kiri bawah visual viewport.
- Mengunci Privacy launcher ke kanan bawah visual viewport.
- Menambahkan sinkronisasi pada window scroll, visualViewport scroll/resize,
  orientation change, dan resize.
- Menambahkan ResizeObserver agar perubahan ukuran control tidak menggeser posisi.
- Tidak mengubah CSS, Consent Mode, GA4, atau fungsi TTS.
