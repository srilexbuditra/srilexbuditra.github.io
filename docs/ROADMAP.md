# Srilex Buditra Roadmap

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
## Current Verified Continuity — REV22 R3.7 (9 Oktober 2026)

**Status:** PRODUCTION VERIFIED / COMPLETED / FINAL / LOCKED.
**Current application baseline:** `main` commit `ec12c92`.
**Verified environments:** Cloudflare Pages deployment dan domain produksi `https://srilexbuditra.work/` (uji Microsoft Edge, dikonfirmasi pengguna).

### Aturan Operasional Wajib

1. **CONTINUE FROM LATEST STABLE BASELINE — NEVER RESTART FROM ZERO.** Mulai dari commit, deploy, dan kondisi runtime terbaru yang sudah diverifikasi; jangan mengulang atau membongkar modul `LOCKED/PASS` tanpa regression nyata atau perubahan scope yang disetujui.
2. Sebelum perubahan: audit read-only pada `main`, bandingkan `HEAD` dengan `origin/main`, cek working tree, baca dokumen master aktif, dan identifikasi jalur produksi serta dampak deployment.
3. Terapkan patch terkecil sesuai scope; lindungi tampilan/branding, fungsi stabil, konfigurasi Cloudflare, D1, Worker, Secret, dan route API di luar scope perubahan.
4. Lakukan source review, uji lokal/staging untuk area terdampak, backup/rollback, controlled commit/push, lalu verifikasi produksi. Jangan menyatakan status `FINAL/LOCKED` sebelum ada bukti.
5. Saat melanjutkan dari chat/perangkat baru: gunakan status **terbaru yang terverifikasi**, bukan checkpoint historis lama. Simpan progres pada file master `.md` yang sudah ada; **jangan membuat `.md` baru** bila dokumen yang relevan sudah tersedia.
6. Perubahan fitur harus menjaga fungsi yang telah disetujui; perubahan dokumentasi saja tidak boleh mengubah runtime.

### REV22 R3.7 — Locked Feature Contracts

- **Privasi & Analitik:** pengguna memilih persetujuan terlebih dahulu; menerima/menolak analitik tidak berarti menerima/menolak Web Push.
- **Web Push:** ajakan opt-in terkontrol untuk pengguna belum aktif; tidak meminta izin browser tanpa tindakan pengguna; subscription, pengiriman native, dan banner notifikasi R3.3 dipertahankan.
- **PWA install:** penawaran tidak menimpa Web Push, dapat mengikuti setelah jeda, tetap dapat dijangkau melalui akses manual di footer jika didukung browser.
- **Smart Visibility R3.4 dan opt-in R3.5:** tetap dipertahankan; koordinasi R3.6 disempurnakan oleh R3.7.
- **Translate:** fitur bawaan browser, tidak dijadikan dependensi atau dikendalikan paksa oleh website.
- **Backend:** REV21, Worker, D1, Secrets, route produksi, dan arsip source REV22 R3.4 tetap di luar scope perubahan R3.7.

**Supersession:** pernyataan historis di bawah yang menyebut `REV22 PLANNED`, `NOT LIVE`, atau `DEPLOYMENT HOLD` berlaku untuk checkpoint lama dan **tidak lagi menjelaskan status REV22 R3.7 saat ini**. Jangan menghapus/mengganti catatan sejarahnya; gunakan bagian ini sebagai otoritas operasional terbaru.
<!-- CONTINUITY-REV22-R37:END -->
<!-- OG-INTERNAL-ROADMAP-V1:START -->
## PROYEK AKTIF - Internal Page Banner + Open Graph Portrait AVIF (Scope di luar /program/)

**Status:** APPROVED SCOPE / DOCUMENTATION BASELINE ONLY - IMPLEMENTATION NOT STARTED.
**Disetujui:** 10 Oktober 2026 (Asia/Jakarta).
**Repository reference before project:** `main` documentation commit `cc1c73e`; application functional baseline `ec12c92` (REV22 R3.7 FINAL / LOCKED). Perubahan proyek selanjutnya harus memakai HEAD terbaru yang benar-benar terverifikasi; kedua hash ini adalah checkpoint awal, bukan instruksi reset.
**Tujuan:** melengkapi banner halaman yang masih kosong, gambar Open Graph masing-masing halaman (AVIF portrait 1024 x 1536), dan metadata HTML/OG/Twitter untuk halaman publik internal yang dituju dari Home, tanpa membuat ulang fitur atau konten yang sudah selesai.

### Batas Scope - WAJIB
- **IN:** halaman publik mandiri yang ditemukan lewat navigation, mega menu, search, CTA, konten, atau footer homepage `https://srilexbuditra.work/`, dan halaman turunan publik terkait. Fokus hanya pada URL yang benar-benar aktif, canonical, relevan, serta masih memiliki gap banner atau metadata.
- **OUT ABSOLUT:** seluruh `/program/` termasuk descendant dan query/redirect menuju area tersebut. Jangan mengubah konten maupun metadata modul program pada pekerjaan ini.
- **OUT NORMAL:** homepage yang sudah LOCKED; area admin/auth/client account/dashboard, formulir berisi data pribadi, API, non-indexable pages, serta URL redirect/duplikat, kecuali ada persetujuan scoped terpisah dan alasan keamanan/SEO yang tervalidasi.
- Inventaris diskusi awal berisi **40 URL kandidat**, bukan 40 pekerjaan wajib dan bukan bukti bahwa 40 URL tidak memiliki Open Graph. Final target adalah hanya URL publik valid yang hasil **satu kali audit awal** mengonfirmasi gap. Jangan mengulang audit yang sudah PASS kecuali konten berubah atau muncul regresi nyata.
- Halaman yang sudah mempunyai metadata, OG image atau banner yang benar harus **dipertahankan**, bukan diganti massal. Halaman yang menggunakan gambar umum hanya diubah bila perbaikan memang diperlukan dan disetujui.

### Inventaris Awal Untuk Disaring Sekali Pada Gate 1
1. **Public hubs (11 kandidat):** `/profil/`, `/keahlian-teknis/`, `/layanan/`, `/proses-kerja/`, `/mengapa-memilih-saya/`, `/kepercayaan-transparansi/`, `/engineering/`, `/aktivitas/`, `/portfolio/`, `/insights/`, `/faq/`.
2. **Insights (11 kandidat):** `/insights/membangun-alur-digital-peserta/`, `/insights/qr-verification-sertifikat-digital/`, `/insights/responsive-first-portal-peserta/`, `/insights/ekosistem-digital-umroh-semi-private-bengkulu/`, `/insights/client-management-platform/`, `/insights/cloudflare-infrastructure/`, `/insights/official-document-verification/`, `/insights/visitor-analytics-privacy/`, `/insights/demo-login-automatic-access/`, `/insights/alur-pengunjung-menjadi-klien/`, `/insights/membangun-srilexbuditra-work-sebagai-digital-platform/`.
3. **Portfolio (14 kandidat):** `/portfolio/ketahanan-pangan/`, `/portfolio/umroh-semi-private-bengkulu/`, `/portfolio/client-management-platform/`, `/portfolio/document-verification/`, `/portfolio/digital-membership-qr/`, `/portfolio/visitor-analytics/`, `/portfolio/website-sekolah/project-detail.html`, `/portfolio/aplikasi-pos/detail.html`, `/portfolio/sistem-administrasi/detail.html`, `/portfolio/website-sekolah/`, `/portfolio/aplikasi-pos/`, `/portfolio/sistem-administrasi/`, `/portfolio/website-sekolah/detail.html`, `/portfolio/website-sekolah/tjkt-smkn1kotabengkulu/`.
4. **Legal/utility (4 kandidat):** `/privacy.html`, `/terms.html`, `/security.html`, `/verify/verify.html`. Terapkan perubahan bila halaman publik memang perlu, tanpa mengubah naskah legal atau logic verifikasi. `/verify/` redirect ditangani sebagai redirect, bukan target banner.
5. **Review terpisah:** `/portal/`, registration, auth, demo, admin, dan route bertanda `noindex`. Jangan mengubah `robots` atau memasukkan data sensitif agar mengejar OG.

### Gate dan Urutan Pengerjaan (sekuensial, tidak diulang)
**Gate 0 - Documentation Baseline (sekarang).** Catat seluruh rencana di lima master Markdown EXISTING. Status `APPROVED SCOPE / IMPLEMENTATION NOT STARTED`. Tidak menyentuh aplikasi, assets, Workers, D1, atau deployment. PASS setelah commit dokumentasi saja dan working tree clean.

**Gate 1 - Complete Existing Inventory & Gap Matrix (tanpa audit ulang).** Gunakan inventaris awal 40 kandidat yang **sudah ditelusuri** dari homepage/sitemap/source. Hanya lengkapi bukti yang belum diperiksa: HTTP/canonical/robots, `<head>`, dan aset/banner. Jangan merayapi ulang URL yang statusnya sudah pasti kecuali ditemukan perubahan atau regresi nyata. Untuk tiap URL rekam tepat satu keputusan: `READY-NEEDS-OG`, `READY-NEEDS-BANNER`, `READY-NEEDS-BOTH`, `ALREADY-PASS`, `EXCLUDED-REDIRECT-DUPLICATE`, `EXCLUDED-PRIVATE`, atau `PENDING-EVIDENCE`. Simpan status ringkas pada bagian proyek aktif di `docs/ROADMAP.md` dan catatan teknis di `docs/PLATFORM.md`, tidak membuat `.md` baru. Jangan menyatakan gap jika belum terbukti.

**Gate 2 - Title, Copy, Asset Mapping & Visual Approval.** Kunci judul sesuai `<title>` aktual (normalisasi hanya suffix brand jika diperlukan), deskripsi ringkas unik, canonical, `og:type`, nama file per halaman dalam bentuk slug judul: huruf kecil, kata dipisah `-`, ekstensi `.avif` (contoh `keahlian-teknis.avif`). Ukuran setiap MASTER turunan halaman **1024 x 1536 px portrait**, tidak diputar atau dipotong. Lokasi aset publik konsisten, misalnya `/images/og/internal/<slug-title>.avif`. Hindari duplikasi nama, benturan dengan file LOCKED, teks yang terlalu dekat batas, dan identitas/logo yang tidak disetujui. Selaraskan gaya dengan visual master homepage yang telah LOCKED sesuai `docs/BRAND.md`; **EDIT MASTER - NOT REDESIGN MASTER**. Setujui mapping sebelum produksi massal.

**Gate 3 - Produce and Validate Image Assets in Batches.** Buat gambar AVIF portrait tiap halaman target yang membutuhkan; uji dimensi `1024 x 1536`, kemampuan decode, ukuran berkas, kesesuaian tema/judul, dan keterbacaan HP/desktop. Simpan master/aset dalam folder yang sesuai; gunakan file nama sesuai title. Hindari perubahan gambar pada halaman yang sudah PASS. Jika crawler sosial tidak menerima AVIF atau memotong portrait, boleh menyediakan turunan JPG/landscape dari desain yang sama **hanya setelah preview test**, sambil tetap menyediakan AVIF portrait yang diminta; jangan menyatakan WhatsApp/Facebook/LinkedIn pasti menampilkan portrait utuh.

**Gate 4 - Scoped In-Page Banner (hanya halaman tanpa banner).** Tambahkan hero/banner ke halaman publik yang benar-benar belum mempunyai, gunakan komponen/CSS scoped, `width/height`, lazy/eager sesuai LCP, `object-fit:contain` untuk menjaga komposisi portrait, alt bermakna, layout mobile/desktop; pertahankan navbar, footer, CTA, analytics consent, Web Push, PWA, Translate, dan seluruh interaksi yang sudah stabil. Banner halaman tidak wajib identik dengan crop OG dan tidak boleh menutupi konten. Jangan menambah banner ke portal privat, formulir atau redirect.

**Gate 5 - Scoped SEO/Open Graph/Twitter Metadata.** Lengkapi hanya `<head>` halaman target: `<title>`, meta description, canonical, robots sesuai existing policy, theme-color, OG type/title/description/url/image/secure_url/image:type/width/height/alt, Twitter card/title/description/image/alt, dan schema/itemprop bila relevan. Gunakan URL absolut HTTPS, path aset faktual, `image/avif` hanya jika benar-benar AVIF, `width=1024`, `height=1536`; pertahankan OG yang sudah benar. `twitter:card=summary_large_image` tidak menjamin seluruh portrait terlihat. Jangan duplicate canonical/OG tags, jangan memodifikasi `robots=noindex` demi share preview, jangan membocorkan data.

**Gate 6 - One-Time Scope QA per Batch.** Cek setiap URL yang diubah: HTML/head unik, tidak ada tag OG ganda, canonical benar, gambar AVIF 200 dan decode, dimensions akurat, SEO description/title sesuai halaman, tautan navigasi tidak putus, responsif desktop/mobile, share preview pada platform relevan, aksesibilitas alt, tanpa layout shift atau crop paksa. Pilih representatif yang diperlukan untuk preview platform; catat hasil per URL/batch. Tidak mengulang pengujian modul lain yang telah PASS.

**Gate 7 - Controlled Release per Batch.** Pekerjaan dimulai dari `main` terbaru yang tersinkron dan bersih; backup + file allowlist hanya untuk URL aset/frontends terkait; review diff; commit/push batch kecil sesuai prioritas `public hubs -> Insights -> Portfolio -> eligible legal/utility`. Verifikasi preview/staging lalu domain utama; rollback spesifik batch jika regresi. Jangan membuat/merge archive, menyentuh `/program/`, Worker, D1, VAPID, secrets, API routes, atau REV21/REV22 R3.7. Dokumentasi hasil per batch di file master yang sudah ada saja.

**Gate 8 - Final Coverage and Closeout.** Cocokkan matriks Gate 1 dengan target final: semua `READY-...` selesai/terverifikasi, `ALREADY-PASS` tidak disentuh, `EXCLUDED` tetap di luar scope, `PENDING` tidak dilabeli PASS. Pastikan preview platform sesuai kemampuan masing-masing dan di production halaman publik tampil benar. Perbarui `docs/ROADMAP.md`, `docs/PLATFORM.md`, `CHANGELOG.md` existing dengan bukti commits, URL, coverage, aset, known limitations dan baseline terbaru; tandai `PRODUCTION VERIFIED / COMPLETED / LOCKED` hanya setelah pengguna menyetujui bukti akhir.

### Prinsip Eksekusi / Larangan Rework
- Lanjutkan dari baseline Git paling baru yang telah diverifikasi; jangan reset ke `ec12c92` atau membuat ulang hasil `cc1c73e`.
- **Tidak mengulang pengujian REV21, REV22 R3.7 atau fitur lain yang sudah PASS**, kecuali temuan regresi spesifik menunjukkan dampak nyata. Gunakan regresi *terarah* ke halaman yang dimodifikasi.
- Satu kali audit awal -> mapping terkunci -> produksi gambar per batch -> metadata/banner terarah -> QA terarah -> release -> closeout. Setelah setiap Gate PASS, lanjut ke Gate berikutnya.
- `docs/ROADMAP.md` menjadi status master, `docs/PLATFORM.md` sebagai spesifikasi teknis; `README.md` dan `docs/README.md` menunjuk ke status; `CHANGELOG.md` mencatat milestone. **Dilarang menambah file `.md` baru untuk proyek ini.**
- Setiap perubahan hanya disetujui jika site layout/brand dan keempat fitur visitor UX R3.7 tetap berfungsi serta tidak memengaruhi `/program/`.
<!-- OG-INTERNAL-ROADMAP-V1:END -->


> Master roadmap dan continuity document srilexbuditra.work.
> Roadmap strategis dipisahkan dari checkpoint historis agar status lama tidak dibaca sebagai kondisi source terkini.

## Current Authority

- Branch production utama: `main`.
- Production Release R1 tercatat LOCKED/PASS.
- Modul yang sudah LOCKED/PASS tidak perlu diulang kecuali terdapat regression nyata atau perubahan yang menyentuh modul tersebut.
- Kondisi source/runtime terbaru yang telah diverifikasi lebih tinggi prioritasnya daripada checkpoint historis di bagian continuity.
- Detail Client Management aktif dipelihara di `docs/CLIENT-MANAGEMENT.md`.
- Brand governance aktif dipelihara di `docs/BRAND.md`.
- Platform publik dipelihara di `docs/PLATFORM.md`.
- Engineering dan Analytics dipelihara pada master dokumentasi masing-masing di folder `docs/`.

## Current Product Direction

Roadmap tetap memisahkan pekerjaan yang sudah selesai/LOCKED, pekerjaan aktif, dan rencana berikutnya. Fitur roadmap tidak boleh dipresentasikan sebagai fitur live sebelum implementasi dan verifikasinya selesai.

## Source-of-Truth Rules

Urutan keutamaan ketika terdapat perbedaan informasi:

1. Production yang benar-benar aktif dan telah diverifikasi.
2. Source terbaru pada branch production.
3. Milestone atau dokumentasi yang sudah LOCKED/PASS.
4. Master dokumentasi aktif di folder `docs/`.
5. Checkpoint dan catatan historis di bagian continuity dokumen ini.

---

## Site Content Architecture V2.01

Status: **COMPLETED / LOCKED — 5/5 AREAS COMPLETED & LOCKED**.

Site Content Architecture V2.01 menjadi arah site-level setelah Portfolio Hub dan live case studies tersedia di production. Setiap area V2.01 hanya dinyatakan selesai setelah source review, visual review, controlled commit/push, dan production verification masing-masing PASS.

### Versioning Convention

- `Home V2.01`, `Portfolio V2.01`, `Profil V2.01`, `Insights V2.01`, dan `Aktivitas V2.01` adalah nama versi arsitektur halaman publik.
- Penamaan `V` pada module/project lain tetap scoped ke module tersebut dan tidak otomatis berarti versi website utama.
- Release teknis existing seperti `Client Management R1`, `Demo Login Automatic Access R2`, dan release identifier lain tetap dipertahankan.
- `Cloudflare R2` adalah object storage dan tidak memiliki hubungan dengan versi halaman.
- Historical version dan release tidak boleh diganti massal hanya untuk menyamakan istilah.

### Page Responsibility

**Home V2.01**
- Menjadi discovery layer yang ringkas.
- Prioritaskan live implementations, system highlights, selected project samples, dan CTA.
- Hindari duplikasi katalog antara Featured Projects dan Case Studies.

**Portfolio V2.01**
- Menjadi pusat proof-of-work lengkap.
- Pertahankan Live Implementations.
- Tambahkan System Case Studies berdasarkan bukti source/runtime.
- Pertahankan Project Samples sebagai kategori terpisah.

**Profil V2.01**
- Menjadi authority page.
- Fokus pada identitas profesional, capability, trust principles, dan proof network.
- Tidak menjadi portfolio kedua.

**Insights V2.01**
- Menjadi engineering knowledge layer lintas project.
- Artikel menjelaskan keputusan, prinsip, arsitektur, workflow, verification/trust, backend/cloud, dan responsive UX berdasarkan implementasi yang dapat diverifikasi.

**Aktivitas V2.01**
- Menjadi public development timeline terkurasi.
- Pertahankan milestone historis yang benar.
- Tambahkan milestone baru hanya dari tanggal/status yang dapat dibuktikan.
- Roadmap site-level dipisahkan dari roadmap module/program.

### Implementation Sequence

1. Dokumentasi Site Content Architecture V2.01 menjadi baseline.
2. Jalankan `V2 Evidence & Timeline Audit`.
3. Implementasikan Home V2.01.
4. Implementasikan Portfolio V2.01.
5. Implementasikan Profil V2.01.
6. Implementasikan Insights V2.01.
7. Implementasikan Aktivitas V2.01.
8. Setiap halaman melalui source review, visual review desktop/mobile, commit/push, dan production verification sebelum dinyatakan selesai.

### Current Production Foundation

- Program Ketahanan Pangan: flagship live implementation.
- Umroh Semi Private Bengkulu: live implementation dan public case study.
- Client Management Platform R1: Production Release R1 LOCKED/PASS dan public case study.
- Portfolio Hub: production verified.
- Selected project samples tetap dipisahkan dari live implementations.

### Project Validation & Continuity Snapshot

> Snapshot status ini menjadi referensi aktif untuk menentukan bagian Site Content Architecture V2.01 yang sudah selesai, bagian yang masih berjalan, dan langkah berikutnya. Catatan historis di bawah tetap dipertahankan sebagai continuity record.

#### Current Production Baseline

- Validated site-content baseline sebelum pembaruan dokumentasi ini: `20123286d84fc9f939a3341c54f3320c83113fc9`.
- Branch production: `main`.
- Local `main` dan `origin/main` telah diverifikasi sinkron pada baseline tersebut sebelum snapshot ini ditulis.
- Pembaruan bagian ini bersifat dokumentasi saja dan tidak mengubah runtime halaman publik.

#### Completed / Locked

| Area | Status | Validation / Baseline |
| --- | --- | --- |
| Home V2.01 | **COMPLETED / LOCKED** | `8056b5e88d80aebda34e53ac300776097c78e277` - `feat: implement home v2 content architecture` |
| Portfolio V2.01 | **COMPLETED / LOCKED** | `7e1a5724dab19ebec5ca05f2c24798d6cd61aed3` - `feat: implement portfolio v2 content architecture` |
| Profil V2.01 | **COMPLETED / LOCKED** | `89b6214474b2de2acfbd29f6b575ee48c6b7d91f` - `feat: implement profil v2 content architecture` |
| Insights V2.01 | **COMPLETED / LOCKED** | Final validated content baseline `20123286d84fc9f939a3341c54f3320c83113fc9` |
| Aktivitas V2.01 | **COMPLETED / LOCKED** | Production-verified implementation `4a7a31eb37c72b414666aeaac495e9f441de4886` - `feat: implement aktivitas v2.01 content architecture` |
| Insights Author Consistency Migration V2.01 | **PRODUCTION COMPLETE / LOCKED** | 11/11 artikel menggunakan identitas publik `Srilex Buditra - Senior Full Stack Developer` dan metadata author yang konsisten |
| Insights Article #7 - Cloudflare Infrastructure | **LOCKED** | `89e31f93f4e86fad663e29d5eae4102d49935e9c` - `feat: add cloudflare infrastructure insight` |

#### Current / Active

- Site Content Architecture V2.01 tetap menjadi **COMPLETED / LOCKED baseline**; Site Content Architecture V2.02 kini **PRODUCTION VERIFIED / COMPLETED / LOCKED** tanpa membuka ulang V2.01.
- Kelima area Site Content Architecture V2.01 - Home, Portfolio, Profil, Insights, dan Aktivitas - sudah **COMPLETED / LOCKED** dan tidak perlu dibuka ulang kecuali ada regression nyata atau approved scope change.
- Tidak ada pekerjaan koreksi wajib yang masih terbuka pada Insights V2.01.

#### Master Project Validation Matrix

> Matriks ini merangkum status project-family utama berdasarkan source dokumentasi aktif. Status tidak boleh dinaikkan melebihi bukti source. Dokumen project masing-masing tetap menjadi authority untuk detail teknis.

| Project / Area | Current Status | Validation / Evidence | Next Step |
| --- | --- | --- | --- |
| Mengapa Memilih Saya / Public Trust & Client Decision Layer | **PRODUCTION VERIFIED / COMPLETED / LOCKED** | `/mengapa-memilih-saya/`; Home 4-card discovery + CTA; dedicated 10 reasons + 7-step workflow; implementation `80b3bb1`; source/visual/production verification PASS. | Maintenance only; reopen only for regression nyata atau approved scope change. |
| Site Content Architecture V2.02 | **PRODUCTION VERIFIED / COMPLETED / LOCKED** | Engineering / System Highlights Expansion aktif di production; Home CTA + `/engineering/`; 6 Engineering domains; implementation `bf7ac6a`; source/visual/production verification PASS. V2.01 tetap 5/5 locked. | Maintenance only; buka kembali hanya jika ada regression nyata atau approved scope change. |
| Site Content Architecture V2.01 | **COMPLETED / LOCKED — 5/5 AREAS** | Home V2.01, Portfolio V2.01, Profil V2.01, Insights V2.01, dan Aktivitas V2.01 seluruhnya **COMPLETED / LOCKED**. Aktivitas V2.01 production-verified pada commit `4a7a31e`. | Maintenance only; buka kembali hanya jika ada regression nyata atau approved scope change. |
| Client Management Platform R1 | **PRODUCTION VERIFIED** | `docs/CLIENT-MANAGEMENT.md`: production baseline aktif dan terverifikasi; R1 telah melewati development, staging, release candidate, production promotion, dan repository maintenance. | Maintenance only; buka kembali hanya jika ada regression atau approved scope change. |
| Brand & Trust | **CURRENT / LOCKED** | `docs/BRAND.md`: Brand Identity R1 tetap LOCKED dan Master Brand Identity Policy berstatus CURRENT / LOCKED. | Pertahankan governance visual/brand; perubahan besar memerlukan persetujuan eksplisit dan staging verification. |
| Analytics | **ACTIVE / VERIFIED FOUNDATION** | `docs/ANALYTICS.md`: Analytics V4 aktif dan telah diuji; nilai live mengikuti dashboard/runtime. | Monitoring dan maintenance berkelanjutan; jangan membekukan angka statistik dinamis di dokumentasi. |
| Engineering | **CURRENT GOVERNANCE / MAINTENANCE** | `docs/ENGINEERING.md`: Current Engineering Principles aktif; GitHub Actions dan runtime verification tetap bagian dari proses perubahan. | Terapkan aturan engineering pada perubahan berikutnya; tidak ada standalone release upgrade yang diasumsikan. |
| Program Ketahanan Pangan | **ACTIVE / PUBLIC EVENT FINAL VERIFICATION PENDING** | `program/ketahanan-pangan/README.md`: ekosistem peserta sudah mencakup Dashboard Peserta V2 dan modul terkait; OG/WhatsApp, Schema.org Event, serta GA4 Event Analytics untuk Public Event masih menjalani pengujian akhir. | Selesaikan final verification Public Event sebelum baseline Event dinyatakan LOCK. |
| Umroh Semi Private Bengkulu | **FRONTEND STABLE / DESIGN LOCKED / BACKEND NEXT** | `program/umroh-semi-private-bengkulu/README.md`: Frontend Foundation Stable V2.5.1; Design System V1 dan Visual Asset System V1 LOCKED. | Lanjutkan fase autentikasi/backend sesuai architecture docs tanpa membongkar shell dan identitas visual yang sudah stabil. |
| Official Document Verification | **CURRENT TECHNICAL BASELINE / SECURITY HARDENING** | `verify/README.md`: V30 tetap technical/deployment baseline; V31 adalah security hardening terbaru. | Pertahankan V30 baseline dengan aturan keamanan V31; jangan mengekspos secret dan jangan menurunkan token policy. |
| Aktivitas & Event Public Integration | **ACTIVE / PRE-LOCK** | `AKTIVITAS-EVENT-PUBLIC-V17.19.13B.md`: public route, Gambar R2, Admin -> Published -> Peserta -> Public Page, dan Rich Summary verified; OG/WhatsApp Preview, Schema.org Event, serta GA4 Event Analytics masih testing pending. | Selesaikan tiga production test yang pending sebelum status dinaikkan menjadi Verified / Stable / LOCKED. |

**Status interpretation:**

- `COMPLETED / LOCKED` hanya digunakan untuk scope yang sudah selesai dan tervalidasi.
- `PRODUCTION VERIFIED` berarti baseline production telah melewati validasi sesuai source project.
- `ACTIVE` atau `ACTIVE / VERIFIED FOUNDATION` berarti sistem masih hidup dan dipelihara; bukan berarti seluruh roadmap project selesai.
- `ACTIVE / PRE-LOCK` tidak boleh dipromosikan menjadi `LOCKED` sebelum final verification selesai.
- `CURRENT GOVERNANCE / MAINTENANCE` adalah aturan teknis aktif, bukan milestone produk baru.
- **Aktivitas V2.01** adalah halaman publik site-level dan sekarang **COMPLETED / LOCKED**; discovery, scope audit, Evidence & Timeline Audit, milestone selection, source implementation, Source Review, Visual Review, Controlled Commit/Push, dan Production Verification seluruhnya telah selesai.
- **Aktivitas & Event Public Integration** adalah modul Program Ketahanan Pangan dan sudah `ACTIVE / PRE-LOCK`.
- Kedua istilah Aktivitas tersebut harus tetap dipisahkan.

#### Next Step

- **Site Content Architecture V2.02: PRODUCTION VERIFIED / COMPLETED / LOCKED**; implementation `bf7ac6a`; maintenance only kecuali ada regression nyata atau approved scope change.
- **Aktivitas V2.01: COMPLETED / LOCKED / PRODUCTION VERIFIED**.
- Discovery, Scope Audit, Evidence & Timeline Audit, milestone selection, source implementation, Source Review, Visual Review, Controlled Commit/Push, dan Production Verification Aktivitas V2.01 seluruhnya **PASS**.
- Production baseline Aktivitas V2.01 adalah commit `4a7a31e`; tidak ada source implementation gap yang masih terbuka. Maintenance hanya dilakukan jika ada regression nyata atau approved scope change.
- Roadmap site-level tetap dipisahkan dari roadmap internal Program Ketahanan Pangan dan module/project lain.

#### Validation History

- Home V2.01: source review, visual review, controlled commit/push, dan production verification telah selesai; status **COMPLETED / LOCKED**.
- Portfolio V2.01: source review, visual review, controlled commit/push, dan production verification telah selesai; status **COMPLETED / LOCKED**.
- Profil V2.01: source review, visual review, controlled commit/push, dan production verification telah selesai; status **COMPLETED / LOCKED**.
- Insights V2.01 Base: `a8df5322144b31bb7950135ba5fefcd20d8b8aad` - `feat: implement insights v2 content architecture`.
- Insights Article #7 Cloudflare Infrastructure: production verification selesai dan dikunci pada `89e31f93f4e86fad663e29d5eae4102d49935e9c`.
- Author Consistency Migration V2.01: commit `20123286d84fc9f939a3341c54f3320c83113fc9` - `chore: standardize insights author identity`.
- Production verification Author Consistency: **11/11 artikel HTTP 200**, author standard **11/11 consistent**, canonical terverifikasi, Insights Hub HTTP 200, sitemap HTTP 200 dengan **12 Insights URLs**, dan Insights CSS HTTP 200.
- Insights Completion / Gap Audit V2.01 setelah koreksi link parser: **HIGH 0 / MEDIUM 0 / LOW 6**.
- Keputusan final Insights V2.01: **NO BLOCKER; OPTIONAL LOW-PRIORITY IMPROVEMENTS REMAIN**.
- Insights V2.01 kemudian ditetapkan **COMPLETED / LOCKED**.
- Aktivitas V2.01: Source Review, Visual Review, Controlled Commit/Push, dan Production Verification **PASS**; production commit `4a7a31e`; status **COMPLETED / LOCKED**.

#### Optional Backlog

- Enam sinyal internal-linking pada Insights bersifat **optional improvement**, bukan error dan bukan blocker.
- Artikel yang saat audit belum menerima contextual inbound link dari artikel Insights lain:
  - `cloudflare-infrastructure`
  - `demo-login-automatic-access`
  - `ekosistem-digital-umroh-semi-private-bengkulu`
  - `membangun-alur-digital-peserta`
  - `qr-verification-sertifikat-digital`
  - `responsive-first-portal-peserta`
- Tidak perlu membuka ulang artikel yang sudah stabil hanya untuk mengejar jumlah internal link.
- **Tidak ada asumsi Article #8.** Artikel baru hanya dibuat jika ada kebutuhan editorial/teknis yang nyata dan disepakati.

#### Change-Control Rule

- Status `COMPLETED / LOCKED` tidak boleh diturunkan atau dikerjakan ulang tanpa regression nyata, perubahan scope yang disetujui, atau bukti production baru yang mengharuskan koreksi.
- Sebelum berpindah milestone, update snapshot ini berdasarkan kondisi source/runtime terbaru yang benar-benar telah diverifikasi.

## Site Content Architecture V2.02

Status: **PRODUCTION VERIFIED / COMPLETED / LOCKED**.

Scope: **Engineering / System Highlights Expansion**.

### Closeout Rule

- Site Content Architecture V2.01 tetap **5/5 AREAS COMPLETED / LOCKED**.
- V2.02 telah selesai tanpa menurunkan atau membuka ulang status V2.01.
- Protected module/release namespaces tetap independen dan tidak diubah oleh V2.02.

### Production Experience

- Tiga card System Highlights existing di Home tetap dipertahankan.
- CTA Home `Lihat Semua System Engineering ->` aktif menuju `/engineering/`.
- Public route `/engineering/` aktif sebagai capability + technical proof hub.
- Fungsi Portfolio, Profil, Insights, dan Aktivitas tetap terpisah.

### Engineering Domains

1. Verification & Trust.
2. Digital Identity & Membership.
3. Analytics & Privacy.
4. Client Management & Workflow.
5. Backend, API & Data Architecture.
6. Cloud Deployment & Reliability.

### Governance

- `docs/ENGINEERING.md` tetap authority untuk engineering governance/principles.
- `/engineering/` adalah public-facing capability/proof page.
- Bukti implementasi hanya berasal dari source, Git history, deployment, atau production yang dapat diverifikasi.
- Protected namespace seperti Dashboard Peserta V2, Analytics V4, Client Management Platform R1, V30/V31, Frontend Foundation Stable V2.5.1, dan Cloudflare R2 tetap dipertahankan.

### Implementation Sequence — Completed

1. Documentation Baseline V2.02 — **PASS**.
2. Controlled Discovery / Scope Audit V2.02 — **PASS**.
3. Engineering content/evidence mapping — **PASS / LOCKED**.
4. Controlled Source Change Plan — **PASS / LOCKED**.
5. Implement Home CTA + `/engineering/` — **PASS**.
6. Source Review — **PASS / LOCKED**.
7. Visual Review desktop/mobile — **PASS / LOCKED**.
8. Controlled staging/commit/push — **PASS / LOCKED**.
9. Production Source + Visual Verification — **PASS / LOCKED**.
10. Documentation closeout — Platform Baseline `2026.10.06.0003`.

### Production Baseline

- Implementation commit: `bf7ac6aa2a93cb51e648d149f3cdb8762cef9092`.
- Commit message: `feat: implement system engineering v2.02`.
- Local `main` dan `origin/main` telah diverifikasi sinkron setelah implementation push.
- Home CTA, `/engineering/`, six-domain architecture, technical boundaries, locked color palette, responsive CSS, sitemap, public proof links, desktop visual, dan mobile visual telah diverifikasi di production.

**Implementation:** PRODUCTION VERIFIED / COMPLETED / LOCKED.

**Next:** Maintenance only; reopen only for a real regression or approved scope change.
---
## Mengapa Memilih Saya - Public Trust & Client Decision Layer

Status: **PRODUCTION VERIFIED / COMPLETED / LOCKED**.

Scope ini merupakan perkembangan baru setelah Site Content Architecture V2.02 dan **tidak membuka ulang atau mengganti V2.02**.

### Production Experience

- Home mempertahankan tepat 4 kartu `Mengapa Memilih Saya`.
- CTA `Lihat Alasan Lengkap ->` aktif menuju `/mengapa-memilih-saya/`.
- Dedicated page menampilkan 10 alasan memilih Srilex Buditra.
- `Cara Saya Bekerja` menampilkan 7-step workflow dari analisis sampai documentation & maintenance.
- Technical proof tetap diarahkan ke `/engineering/` dan `/portfolio/`.
- Contact conversion tetap diarahkan ke `/#kontak` dan `/#estimasi`.

### Responsibility Boundary

- Home = discovery.
- Portfolio = proof-of-work.
- Profil = authority.
- Insights = engineering knowledge.
- Aktivitas = development record.
- Engineering = system capabilities + technical proof.
- Mengapa Memilih Saya = client decision + trust/value layer.

### Production Baseline

- Implementation commit: `80b3bb18caecc3dce72256747cdf3c9dee8aa511`.
- Commit message: `feat: add mengapa memilih saya page`.
- Source Review: **PASS / LOCKED**.
- Desktop/Mobile Visual Review: **PASS / LOCKED**.
- Controlled staging/commit/push: **PASS / LOCKED**.
- Production route, Home integration, scoped CSS, sitemap, Engineering preservation, dan core links: **PASS / LOCKED**.
- Existing-profile CTA issue terverifikasi sebagai PWA / Service Worker cache; tidak diperlukan source patch.
- Platform documentation closeout baseline: `2026.10.06.0004`.

**Next:** Maintenance only; reopen only for a real regression or approved scope change.

---

## Unified Backup & Recovery V1.0 - Implementation Roadmap

**Status:** APPROVED POLICY SCOPE / IMPLEMENTATION NOT STARTED.

Kebijakan ini berlaku lintas proyek Visitor Analytics, Ketahanan Pangan, Umroh Semi Private Bengkulu, Client Management, serta Web Push setelah database-nya tersedia.

### Implementation Gates

1. Inventory D1 dan R2, klasifikasi sensitivitas data, dan audit recovery capability.
2. Tetapkan retensi, jadwal backup, pemilik operasional, serta target pemulihan per aplikasi.
3. Rancang bucket R2 PRIVATE khusus backup terenkripsi tanpa mengubah bucket dokumen/media aplikasi.
4. Rancang repository GitHub PRIVATE khusus salinan ciphertext terenkripsi, terpisah dari repository website publik; periksa batas ukuran dan retensi.
5. Tetapkan manajemen kunci, prosedur rotasi, penyimpanan recovery key di luar Cloudflare/GitHub, dan pembatasan akses.
6. Implementasikan backup terjadwal yang mempertimbangkan potensi gangguan saat ekspor D1 remote.
7. Tetapkan gate backup/titik pemulihan wajib sebelum migrasi, reset, penghapusan massal, dan deployment berisiko.
8. Validasi checksum, cakupan data/schema, status enkripsi, serta notifikasi kegagalan backup.
9. Uji pemulihan secara berkala pada database dan storage terisolasi; jangan menguji restore langsung pada production.
10. Aktifkan otomasi hanya setelah pengujian, review keamanan, dan otorisasi perubahan terpisah.

### Current Audit Evidence

- Empat database D1 Cloudflare telah diinventarisasi dan struktur tabelnya diperiksa menggunakan query SELECT read-only.
- D1 Time Travel info berhasil mengembalikan bookmark pada keempat database; restore belum diuji.
- Lima bucket R2 aplikasi terinventarisasi; bucket khusus backup belum dibuat.
- Schema-only export srilexbuditra-visitors berhasil dibuat secara lokal; belum merupakan backup data lengkap.
- Backup lengkap terenkripsi, salinan GitHub Private, jadwal otomatis, dan uji restore belum diimplementasikan.
- REV21 tetap LOCKED; REV22 Web Push deployment HOLD.

### Completion Criteria

- Backup dapat dibuat, diverifikasi, dienkripsi, dan disalin ke lokasi yang disetujui tanpa mengekspos data pribadi.
- Salinan kedua di GitHub memenuhi kontrol akses, batas ukuran, serta kebijakan enkripsi dan retensi.
- Prosedur pemulihan dapat dijalankan pada lingkungan terisolasi dan hasilnya terdokumentasi.
- Sistem memberikan peringatan ketika backup gagal dan tidak mengklaim backup aktif sebelum bukti tersedia.
- Tidak ada perubahan pada baseline production yang LOCKED tanpa persetujuan baru.

## Strategic Roadmap 2026–2027

> Bagian ini mempertahankan roadmap strategis, fase produk, dan urutan prioritas pengembangan.

# ROADMAP SRILEXBUDITRA.WORK — 2026/2027

Roadmap ini menjaga urutan pengembangan agar srilexbuditra.work berkembang melalui **bukti implementasi, otoritas, pengalaman pengguna, dan produk yang reusable**, bukan hanya penambahan fitur.

## Fase 1 — Flagship & Proof of Work ✅

Status: **selesai sebagai fondasi; pertahankan dan iterasi hanya bila diperlukan.**

- Program Ketahanan Pangan menjadi flagship project di homepage.
- Case study publik tersedia di `/portfolio/ketahanan-pangan/`.
- Visual flagship konsisten dengan identitas website.
- Internal search dan sitemap mengenali ekosistem program.
- Portal, registrasi, verifikasi, akun peserta/dashboard, sertifikat QR, dan dokumentasi diposisikan sebagai satu perjalanan digital.

## Fase 2 — Trust & Authority ✅

Status: **fondasi selesai; monitoring Search Console dan pengembangan konten berlanjut secara berkala.**

Sudah dilakukan:

- Halaman `/profil/` untuk profil publik, capability map, proof of work, dan trust principles.
- Hubungan yang lebih jelas antara Srilex Buditra, flagship implementation, dan layanan profesional.
- Dokumentasi Trust & Authority V8.
- **Knowledge Center / Insights V11.9** dengan hub dan tiga artikel awal berbasis implementasi nyata.
- Struktur author artikel terhubung ke halaman `/profil/`.
- **Development Timeline / Activity V12.0** pada `/aktivitas/` sebagai rekam jejak milestone publik.

Berikutnya:

1. Search Console sebagai alat monitoring query, halaman, dan pertumbuhan brand. ✅
2. Perluas artikel secara bertahap berdasarkan implementasi baru yang benar-benar terjadi.
3. Testimoni/dukungan hanya bila ada izin dan sumber dapat diverifikasi.
4. Persiapan Fase 3 tanpa mengganggu sistem anggota yang sudah live.

## Fase 3 — Pengalaman Anggota 🚧

Status: **fase aktif saat ini.**

Urutan rekomendasi:

**Dashboard V2 ✅ → Kartu Anggota + QR + Verified Member Foto ✅ → Sertifikat QR ✅ → Level/Poin ✅ → Misi ✅ → Referral V13.0 ✅ → Benefit V13.1 ✅ → Aktivitas & Event V13.2 ✅ → Marketplace V13.3 ✅ → Notifikasi & Informasi V13.4 ✅**

Prinsip:

- Fitur baru tidak boleh merusak alur registrasi/verifikasi yang sudah berjalan.
- Status fitur harus jelas antara **live**, **pilot**, dan **roadmap**.
- Data pribadi peserta tidak digunakan sebagai materi promosi.

## Fase 4 — Impact & Ecosystem

- Public Impact Dashboard menggunakan data agregat nyata.
- Statistik publik hanya menampilkan data yang aman dan tidak mengidentifikasi peserta.
- Dokumentasi outcome aktivitas/event menggunakan data nyata setelah event berjalan.
- Pertahankan halaman Event publik, SEO, gambar, dan analytics sebagai bukti implementasi yang dapat diverifikasi.
- Integrasi benefit/partner sesuai kesepakatan organisasi.
- Marketplace atau ekosistem transaksi hanya dikembangkan setelah kebutuhan dan tata kelola jelas.

## Fase 5 — Productization

Mengubah fondasi implementasi menjadi solusi reusable:

**Registration → Verification → Account → Dashboard → Digital ID/QR → Certificate → Activity → Analytics**

Target penggunaan dapat mencakup komunitas, koperasi, organisasi, UMKM, asosiasi, program sosial, atau institusi lain sesuai kebutuhan dan perjanjian.

## Client Management Platform R1 - Production Baseline

Status: **Production Release R1 LOCKED/PASS; production baseline aktif dan terverifikasi.**

Tujuan fase ini adalah membangun perjalanan pelanggan Srilex Buditra yang terhubung dari pengunjung sampai Client Portal tanpa registrasi Client publik secara langsung.

Alur utama:

`Visitor -> Registrasi Lead -> Lead Portal -> Konsultasi -> Kebutuhan Terverifikasi -> Official Estimate -> Persetujuan -> Aktivasi Client -> Client Portal -> Project`

### Status saat ini

Sudah dibuktikan pada source/runtime:

- Lead Self-Service UX R1.
- Official Estimate lifecycle.
- Lead Estimate Decision Focus Mode.
- Lead Approved Waiting State.
- Client Portal Interactive Demo.
- Full Demo Journey desktop dan mobile.
- Full Demo Journey Identity R1.
- Demo Journey Open Graph Preview R1.
- Client Demo Mobile Navigation R1.
- Real Client Mobile Navigation R1.
- Real Registration -> Full Demo Handoff R1.
- Lead Demo + Client Demo CSP Compatibility / Visual Parity: **PRODUCTION VERIFIED / LOCKED** pada Platform Baseline 2026.10.07.0004.

### Full Demo Journey

Demo publik:

`Demo Registrasi -> Demo Login -> Demo Lead Tahap 1-5 -> Aktivasi Client Demo -> Demo Client Dashboard`

Routes:

- `/portal/demo/register/`
- `/portal/demo/login/`
- `/portal/demo/lead/`
- `/portal/demo/`

Prinsip Demo:
- menggunakan data simulasi;
- tidak menulis ke D1;
- tidak menggunakan API produksi;
- tidak membuat Lead atau Client nyata.

### Homepage Integration R1

Status implementasi:

`Why Choose Me -> Coba Pengalaman Client -> Packages & Pricing`

Section homepage menjelaskan empat tahap Demo dan menyediakan satu CTA utama menuju:

`/portal/demo/register/`

Status:

`LOCKED/PASS - source dan staging runtime desktop/mobile sudah diverifikasi.`
- Hero Demo CTA desktop + mobile: **LOCKED/PASS**.
- Mobile Horizontal Overflow Fix R1: **LOCKED/PASS**.
- Hero `SB DIGITAL` desktop + mobile: **LOCKED/PASS**.
- Homepage metadata / Open Graph source / PWA / social asset staging: **PASS**.
- Asset canonical OG baru telah tersedia di production setelah Production Release R1; validasi ulang scraper Meta tetap terpisah.

### Production Release

Final Closeout R1: **LOCKED/PASS**.

Final Closeout checkpoint: `36b508b`.

Latest staging-tested content: `1cafcc7`.

Release-candidate base: `63fbe32`.

Production Release R1: **LOCKED/PASS**; release content `4495cd6` telah diterbitkan ke `main` dan production runtime telah diverifikasi.

## Prinsip Utama

Jangan mengejar klaim "dipercaya semua kalangan" melalui slogan. Bangun kepercayaan melalui:

- implementasi yang dapat dilihat,
- dokumentasi yang konsisten,
- keamanan dan privasi,
- pengalaman pengguna yang stabil,
- hasil yang dapat diverifikasi,
- komunikasi peran yang jelas,
- dan pengembangan bertahap yang tidak merusak sistem aktif.

---

**Current phase:** Fase 3 — Pengalaman Anggota
**Current milestone:** Dashboard Peserta V2 ✅ + Kartu Anggota Digital + QR ✅ + Sertifikat QR ✅ + Level/Poin ✅ + Misi ✅ + Referral ✅ + Benefit ✅ + Aktivitas & Event ✅ + Public Event Integration V17.19.13B ✅ + Marketplace ✅ + Notifikasi & Informasi ✅
**Current verification:** OG/WhatsApp Preview, Schema.org Event, dan GA4 Event Analytics masih menjalani pengujian akhir sebelum baseline Public Event di-LOCK.
**Next milestone:** Menunggu keputusan tim untuk pengelolaan Event, katalog Marketplace, dan fitur komunikasi lanjutan

### V13.0 Referral
Referral peserta aktif untuk VERIFIED MEMBER dengan poin server-side dan atribusi dari tautan registrasi resmi.


### V13.1 Benefit Peserta
Benefit peserta aktif sebagai status akses/eligibility bertingkat berdasarkan Total Poin, Level, Registrasi Terverifikasi, dan VERIFIED MEMBER. Benefit tidak menjadi janji bantuan, hadiah, dana, atau kuota program tertentu.


### V13.2 Aktivitas & Event
Modul Aktivitas & Event peserta aktif untuk agenda server-side, pendaftaran event, status kehadiran, riwayat aktivitas, dan Poin Aktivitas yang hanya diberikan setelah kehadiran terverifikasi.

### V17.19.13B Public Event Integration
Pengelolaan Event Admin telah terhubung ke gambar utama R2, SEO dasar, slug publik, halaman detail Event publik, URL publik di Dashboard Admin, tampilan kartu peserta, serta Rich Summary dari satu sumber Ringkasan. Implementasi metadata Open Graph, Schema.org Event, dan GA4 Event Analytics sudah dipasang dan masih menunggu pengujian akhir sebelum status Event di-LOCK sebagai baseline stabil.


### V13.3 Marketplace & Ekosistem
Marketplace tahap awal aktif sebagai katalog resmi dan pencatatan minat tanpa checkout atau pembayaran otomatis.

### V13.4 Notifikasi & Informasi
Pusat Notifikasi peserta aktif dengan status dibaca server-side dan sinkronisasi otomatis dari poin, referral, benefit, event, Marketplace, serta status akun.

### V13.5.0 — Profil & Pengaturan Akun Peserta
Status: implementasi fondasi akun peserta.
Profil read-only, preferensi notifikasi, keamanan password, sesi aktif, dan riwayat engagement singkat terhubung ke Participant API.


## V13.6.0 — Keamanan & Sesi
Status: Implementasi fondasi selesai. Fokus pada kontrol sesi perangkat, riwayat keamanan, dan notifikasi login baru.


---

## Historical Operational Continuity

> Bagian berikut mempertahankan isi Master Project Roadmap sebelumnya sebagai continuity record.
> Commit hash, staging Worker ID, checkpoint, dan status bertanggal di bagian ini adalah snapshot historis kecuali kembali diverifikasi terhadap source/runtime terbaru.

# SRILEXBUDITRA.WORK — MASTER PROJECT ROADMAP

> **Status:** Master continuity file
> **Tujuan:** Menjadi acuan utama ketika berpindah obrolan, perangkat, atau sesi kerja agar proyek tidak diulang dari nol.
> **Aturan utama:** Jika ada perbedaan antara percakapan lama dan kondisi source terbaru, gunakan versi yang **paling baru, sudah diuji, di-push, di-deploy, atau dikunci (LOCKED/PASS)**.

## 1. Identitas Proyek

- Domain utama: `https://srilexbuditra.work/`
- Repo lokal Windows: `D:\Data Papa\GitHub\srilexbuditra.github.io`
- Branch development aktif: `feature/client-management-r1`
- Branch production: `main`
- Logo utama: `/images/logo.avif`

## 2. Workflow Pengembangan yang Dikunci

`AUDIT → PATCH MINIMAL (jika perlu) → VERIFY SOURCE → COMMIT → PUSH → STAGING RUNTIME TEST → LOCKED/PASS`

Aturan:
- Jangan mengulang pengujian modul yang sudah `LOCKED/PASS` kecuali ada bug nyata atau perubahan yang menyentuh modul tersebut.
- Jangan mengubah sistem stabil hanya untuk refactor kosmetik.
- Jangan bekerja langsung di `main` untuk development baru.
- `main` adalah versi publik/production yang stabil.
- Development baru dilakukan di branch feature.
- Setelah satu milestone penting selesai dan stabil, produksikan lebih dulu agar dapat dipakai publik, lalu lanjutkan development berikutnya.
- Jangan menyimpan password, API token, secret, cookie, credential, atau data pribadi ke file roadmap ini.

## 3. Checkpoint Source Terakhir

### Latest clean / pushed checkpoint

- Branch: `feature/client-management-r1`
- Functional source baseline sebelum documentation sync: `4c79db1`
- Branch baseline sudah terverifikasi pada origin: `4c79db1`
- Latest functional source commit sebelum documentation sync: `4c79db1 feat: link real registration success to full demo journey`
- Commit source PATCH B2: `d6403d4 fix: preserve explicit lead follow-up semantics`
- Working tree terakhir: **CLEAN**
- Staging Worker candidate Version ID: `0ae655ac-ea45-4b4e-991a-00911ef79eee`
- Immutable preview prefix: `0ae655ac`
- Staging proxy aktif: `functions/api/[[path]].js` → `https://0ae655ac-srilexbuditra-client-management-api-r1-staging.srilexbuditra.workers.dev`
- D1 staging: `srilexbuditra-client-management-staging`
- D1 UUID: `96adf8ed-2793-4db6-93a7-1ab27230b187`
- Admin Leads cache marker: `leads.js?v=lead-followup-semantics-r1`
- `LEAD SELF-SERVICE UX R1 — PATCH B2 FOLLOW-UP SEMANTICS`: **LOCKED / PASS**
- Production Release R1: **LOCKED/PASS**; release content `4495cd6` telah diterbitkan ke `main` dan production runtime verified.

### Current R1 Closeout Checkpoint - 3 Oktober 2026

Status source terbaru:

- Branch: `feature/client-management-r1`
- Functional source baseline sebelum documentation sync: `4c79db1`
- Working tree sebelum update dokumentasi: clean.
- Staging Worker tetap menggunakan candidate yang sudah diverifikasi; tidak ada deployment Worker baru untuk perubahan frontend Demo terbaru.
- Production Release R1: **LOCKED/PASS**; release content `4495cd6` telah diterbitkan ke `main` dan production runtime verified.

Status yang sudah dibuktikan source/runtime pada fase terbaru:

- `LEAD OFFICIAL ESTIMATE R1` backend/source lifecycle: **LOCKED/PASS**
- Lead Estimate Decision Focus Mode: **LOCKED/PASS**
- Lead Approved Waiting State R1: **LOCKED/PASS**
- Lead Portal WhatsApp Help - Tahap 4: **LOCKED/PASS**
- Client Portal Interactive Demo R1: **LOCKED/PASS**
- Demo Registration Success R1: **PASS**
- Demo Login Automatic Access R2: **PASS**
- Demo Lead Stage 5 Activation R1: **LOCKED/PASS**
- Client Demo Real Project CTA R1: **LOCKED/PASS**
- Client Demo Mobile Navigation R1: **LOCKED/PASS**
- Real Client Mobile Navigation R1: **LOCKED/PASS**
- Demo Journey Open Graph Preview R1: **LOCKED/PASS**
- Full Demo Journey Identity R1: **LOCKED/PASS**
- Full Demo Journey Mobile R1: **LOCKED/PASS**
- Full Demo Journey R1: **LOCKED/PASS**
- Real Registration -> Full Demo Handoff R1: **LOCKED/PASS**

Current Demo Journey:

`Demo Registrasi -> Demo Login -> Demo Lead Tahap 1-5 -> Aktivasi Client Demo -> Demo Client Dashboard`

Shared Demo state:

`sb_demo_journey_r1`

Demo tetap:
- tanpa API produksi;
- tanpa D1;
- tanpa pembuatan Lead nyata;
- tanpa pembuatan Client nyata;
- menggunakan data simulasi.

Real Lead fixture Final Closeout tetap:
- Estimate sudah disetujui;
- Lead belum dikonversi menjadi Client;
- belum membuat Invoice;
- status menunggu Aktivasi Client.

Jangan melakukan Aktivasi Client nyata tanpa persetujuan eksplisit.

Homepage Integration R1:

`Why Choose Me -> Coba Pengalaman Client -> Packages & Pricing`

Status Homepage Demo Integration:

`LOCKED/PASS - source dan staging runtime desktop/mobile sudah diverifikasi.`
- Hero Demo CTA desktop + mobile: **LOCKED/PASS**.
- Mobile Horizontal Overflow Fix R1: **LOCKED/PASS**.
- Hero `SB DIGITAL` desktop + mobile: **LOCKED/PASS**.
- Homepage metadata / Open Graph source / PWA / social asset staging: **PASS**.
- Asset canonical OG baru telah tersedia di production setelah Production Release R1; validasi ulang scraper Meta tetap terpisah.

Bukti source terbaru:
- `8603a9a` - homepage brand, social metadata, manifest, dan Demo CTA.
- `35ef6a9` - final mobile top-glow overflow fix.
- `fd7f14a` - Hero badge diselaraskan menjadi `SB DIGITAL`.

### Bukti final PATCH B2

- Candidate Worker binding diverifikasi lengkap sebelum staging dipin.
- Direct candidate `/api/health`: HTTP `200`.
- Staging delivery `/api/health`: HTTP `200`.
- Frontend staging memuat cache marker PATCH B2.
- Runtime Lead: `LEAD-2026-5B6A0C36`.
- CRM `contacted` tanpa proof tampil **Belum Follow-up** dan tombol follow-up aktif.
- Explicit Admin follow-up mengubah UI menjadi **Sudah dihubungi + timestamp** tanpa mengubah CRM dari `contacted`.
- State tetap persisten setelah reload.
- Lead Portal tetap **Konsultasi berlangsung — Tahap 2 dari 5**.
- Final D1 proof:
  - `lead_contacted_count = 1`
  - action `LEAD_CONTACTED`
  - tidak ada duplikasi activity.

### Aturan continuity

- Jangan kembali ke checkpoint WIP `38f6642`.
- `38f6642` sudah superseded oleh `d6403d4` dan `87c9b5d`.
- Jangan mengulang PATCH B2 atau modul `LOCKED/PASS` kecuali ada regression nyata.
- Gunakan `4c79db1` sebagai functional source baseline sebelum documentation sync; untuk HEAD terbaru gunakan riwayat Git.

## 4. Modul yang Sudah LOCKED / PASS

1. CLIENT DASHBOARD PROJECT CTA R1
2. ADMIN NOTIFICATION READ STATE R2 — DATABASE FOUNDATION
3. ADMIN NOTIFICATION READ STATE R2 — BACKEND
4. CLIENT SUPPORT CREATE FLOW
5. ADMIN NOTIFICATION READ/UNREAD VISUAL R2
6. LEAD ASSIGNMENT R1
7. SUPPORT ASSIGNMENT R1
8. CLIENT NOTIFICATIONS R1
9. ADMIN DASHBOARD ACTIONS & LIVE STATS R1
10. CLIENT DASHBOARD ACTIONS & LIVE STATS R1
11. SELF-SERVICE PROCESS SYNC R1 — STAGING RUNTIME
12. LEAD SELF-SERVICE UX R1 — PATCH B2 FOLLOW-UP SEMANTICS

Tambahan yang sudah terbukti pada runtime:
- Client data isolation
- Lead cross-staff isolation
- Support cross-staff isolation
- Client notification recipient isolation
- Admin dashboard live statistics
- Client dashboard live statistics
- Client mobile navigation
- Support create/reply flow
- Assignment/reassignment foundation
- Consultation Wizard save/persistence
- Lead `new → contacted` otomatis setelah konsultasi valid
- Lead Portal langsung sinkron ke `Konsultasi berlangsung`
- Admin Activity/Notification Lead → detail Lead routing
- Explicit Admin follow-up proof menggunakan `LEAD_CONTACTED` / `contacted_at`
- Explicit follow-up tidak menduplikasi activity `LEAD_CONTACTED`

### Catatan

- Jangan menaikkan seluruh `Public Lead Registration / Lead Self-Service` menjadi full-flow LOCKED hanya dari PATCH B2.
- Final closeout end-to-end tetap harus selesai sebelum Production Release R1.
- `LEAD OFFICIAL ESTIMATE R1` sudah memiliki backend/source yang berkembang, tetapi lifecycle finalnya belum dianggap selesai.

## 5. Arah Produk yang Disepakati

Portal **tidak menggunakan registrasi Client publik secara langsung**.

Alur publik:
`Visitor → pilih layanan → Public Lead Registration → Lead Portal → proses Lead → Official Estimate → Convert to Client → Client Portal`

Client baru mendapatkan akses Client Portal setelah proses Lead berhasil dan dikonversi.

## 6. Public Lead Registration — Arah yang Dikunci

### Tujuan

Calon pelanggan dapat:
- mengenal jasa Srilex Buditra;
- memilih layanan yang diminati;
- registrasi sebagai Lead;
- masuk ke Lead Portal;
- melihat layanan yang dipilih;
- melihat tahapan proses;
- menunjukkan ketertarikan pada layanan lain;
- mengikuti proses sampai layak menjadi Client.

### Alur

```text
Homepage
   ↓
Services
   ↓
Pilih layanan
   ↓
Mulai Konsultasi
   ↓
Public Lead Registration
   ↓
Lead Account
   ↓
Lead Portal Dashboard
   ↓
new
   ↓
contacted
   ↓
qualified
   ↓
Official Estimate
   ↓
Deal / Approval
   ↓
Convert to Client
   ↓
Client Account / Activation
   ↓
Client Portal
```

### Status internal Lead

- `new`
- `contacted`
- `qualified`
- `lost`
- `converted`

Bahasa untuk Lead:
- `new` → Registrasi diterima
- `contacted` → Konsultasi berlangsung
- `qualified` → Kebutuhan terverifikasi
- `converted` → Akun Client aktif
- `lost` → Proses tidak dilanjutkan

## 7. Homepage Portal Entry — Arah yang Dikunci

### Navbar
Tambahkan tombol `Portal`.

### Panel sesudah Services
Tambahkan panel **PORTAL & KONSULTASI**:
- `Masuk Portal`
- `Mulai Konsultasi`

Jangan gunakan label `Daftar Client`.

### Service context
Setiap layanan Homepage harus dapat membawa konteks menuju registrasi Lead.

Contoh:
```text
Website Company Profile
→ Mulai Konsultasi
→ Public Lead Registration
→ service_interest = Website Company Profile
```

Layanan yang dipilih harus tetap terbawa sampai:
`Homepage → Lead → Estimate → Client → Project`

## 8. Layanan Homepage yang Sudah Ada

- Website Company Profile
- Web Application
- REST API / Backend
- Sistem Informasi Custom
- Database Development
- Deployment & Cloud

## 9. Lead Portal Dashboard — Target Minimum

Lead Portal bukan versi mini Client Portal.

Dashboard Lead minimum:
- identitas Lead;
- layanan yang diminati;
- tahap/status proses;
- progress perjalanan Lead;
- katalog layanan;
- CTA `Saya Tertarik`;
- konteks konsultasi;
- akses menuju Estimate resmi ketika tersedia.

Contoh progress:
```text
✓ Registrasi diterima
● Konsultasi kebutuhan
○ Peninjauan kebutuhan
○ Penawaran resmi
○ Aktivasi Client
```

## 10. Client Portal — Prinsip

Client Portal digunakan setelah Lead dikonversi.

Fungsi yang sudah berkembang:
- Dashboard
- Projects
- Documents
- Estimates
- Invoices
- Support
- Notifications
- Account / Security

## 11. Estimate — Posisi Terakhir

Backend Estimate sudah memiliki fondasi:
- Client hanya melihat Estimate miliknya.
- Detail Estimate tersedia di backend.
- Line items tersedia.
- Approve / Reject tersedia.
- Expired protection tersedia.
- Repeat-decision protection tersedia.
- Activity event tersedia.
- Konversi Estimate → Invoice merupakan proses terpisah.

Urutan penyempurnaan Estimate:
`Estimate Detail R1.1 → Approval UX R1.1 → Estimate ↔ Invoice Link → PDF Estimate`

Pekerjaan ini **ditunda sementara** sampai Public Lead Registration + Production Release R1 selesai.

## 12. Prioritas Development Sekarang

### CURRENT FOCUS
**PRODUCTION RELEASE R1 — LOCKED/PASS**

PATCH B2 Follow-up Semantics sudah **LOCKED / PASS**. Jangan mengulang patch tersebut.

Final Closeout R1 telah selesai dan seluruh jalur minimum yang ditargetkan telah terverifikasi sebelum `PRODUCTION RELEASE R1`.

Urutan lanjut yang dikunci:

1. Mulai dari checkpoint clean `87c9b5d`.
2. Audit source/status sebelum perubahan baru.
3. Lakukan smoke/regression **terarah**, bukan mengulang seluruh modul LOCKED/PASS.
4. Verifikasi jalur utama:
   - Homepage / Services → Public Lead Registration;
   - registrasi sukses → `Masuk Portal`;
   - Lead login → Lead Portal;
   - Consultation Wizard / kebutuhan tersimpan;
   - Lead Portal sinkron ke `Konsultasi berlangsung`;
   - Admin dapat membuka Lead yang benar;
   - explicit Admin follow-up semantics tetap benar;
   - jalur Official Estimate / handoff yang sudah tersedia tidak regression.
5. Verifikasi role/isolation hanya pada jalur yang disentuh closeout.
6. Catat hanya gap yang benar-benar masih terbuka.
7. Patch gap secara minimal bila ditemukan.
8. Jika source berubah:
   `VERIFY SOURCE → COMMIT → PUSH → STAGING RUNTIME TEST`.
9. Jika seluruh Lead flow minimum PASS:
   `LEAD SELF-SERVICE / PUBLIC LEAD FLOW — FINAL CLOSEOUT R1 = LOCKED/PASS`.
10. Setelah closeout terkunci, lanjut `PRODUCTION RELEASE R1`.

### PATCH B2 — status final

**LOCKED / PASS**

Bukti:
- source patch `d6403d4` committed/pushed;
- Worker candidate `0ae655ac-ea45-4b4e-991a-00911ef79eee` binding-verified;
- staging proxy pin `87c9b5d` committed/pushed;
- staging delivery HTTP 200;
- runtime sebelum explicit follow-up:
  CRM `contacted` + `Belum Follow-up` + tombol aktif;
- runtime sesudah follow-up:
  `Sudah dihubungi + timestamp`, CRM tetap `contacted`;
- persistence setelah reload PASS;
- Lead Portal tidak regression;
- D1 proof tepat `1` activity `LEAD_CONTACTED`.

## 13. Production Release Strategy — Dikunci

Setelah Public Lead Registration + Lead Portal minimum PASS:

```text
feature/client-management-r1
        ↓
Staging PASS
        ↓
LOCKED
        ↓
Merge ke main
        ↓
Production Release R1
        ↓
Smoke Test Production
        ↓
Public dapat menggunakan sistem
        ↓
Kembali ke development berikutnya
```

### Production smoke test minimum
- Homepage production terbuka.
- Portal entry bekerja.
- Public Lead Registration bekerja.
- Lead dapat login.
- Lead Dashboard terbuka.
- Lead baru terlihat di Admin.
- Client lama tetap dapat login.
- Tidak ada error fatal pada flow utama.

## 14. Roadmap Setelah Production Release R1

1. Lead Service Interest R1
2. Lead Progress / Stage R1
3. Lead → Client Handoff R1
4. Official Estimate Handoff
5. Client Estimate Detail R1.1
6. Approval UX R1.1
7. Estimate ↔ Invoice Link
8. PDF Estimate
9. Invoice lifecycle refinement
10. Documents lifecycle refinement
11. Activity / Audit Trail refinement
12. Cross-module End-to-End Business Flow
13. Responsive / Security / Regression
14. Production Release R1 selesai; lanjut post-release monitoring / prioritas roadmap berikutnya

## 15. Full Business Journey Target

```text
Visitor
  ↓
Homepage / Services
  ↓
Public Lead Registration
  ↓
Lead Portal
  ↓
Lead Management
  ↓
Qualification
  ↓
Official Estimate
  ↓
Approval
  ↓
Convert to Client
  ↓
Client Portal
  ↓
Project
  ↓
Invoice
  ↓
Documents
  ↓
Support
  ↓
Notifications
  ↓
Activity Log
  ↓
Delivery / Maintenance
```

## 16. Instruksi Saat Pindah ke Chat Baru

Upload file ini lalu tulis:

**“Lanjutkan proyek srilexbuditra.work berdasarkan MASTER PROJECT ROADMAP ini. Jangan ulang modul LOCKED/PASS. Gunakan checkpoint source terbaru dan lanjutkan dari CURRENT FOCUS.”**

Jika ada hasil audit/PowerShell terbaru, upload juga. Jika ada ZIP/source baru, gunakan versi source terbaru sebagai acuan.

## 17. Update Protocol

Setelah milestone selesai, update:
```text
Tanggal:
Branch:
Commit:
Milestone:
Status: PASS / LOCKED / PRODUCTION
Runtime tested:
Production deployed:
Next focus:
Known issue:
```

## 18. Prinsip Source of Truth

Jika ada konflik informasi, prioritas:
1. Production yang benar-benar aktif dan diverifikasi.
2. Source terbaru yang sudah runtime tested.
3. Commit terbaru yang sudah pushed.
4. Milestone yang sudah LOCKED/PASS.
5. File roadmap ini.
6. Percakapan lama yang belum diverifikasi.

Tujuannya: **melanjutkan progres, bukan mengulang dari awal**.

## 20. PATCH B2 Follow-up Semantics — Final Lock 2 Okt 2026

Milestone:
`LEAD SELF-SERVICE UX R1 — PATCH B2 FOLLOW-UP SEMANTICS`

Status: **LOCKED / PASS**

Checkpoint:
- source commit: `d6403d4 fix: preserve explicit lead follow-up semantics`;
- staging pin commit: `87c9b5d chore: pin staging api to lead follow-up semantics preview`;
- Worker Version ID: `0ae655ac-ea45-4b4e-991a-00911ef79eee`;
- preview prefix: `0ae655ac`;
- branch: `feature/client-management-r1`;
- functional source baseline pada checkpoint tersebut: `4c79db1`;
- working tree: clean.

Runtime evidence:
- staging API health PASS;
- deployed Admin cache marker: `leads.js?v=lead-followup-semantics-r1`;
- Lead `LEAD-2026-5B6A0C36` berstatus CRM `contacted`;
- sebelum explicit follow-up tampil `Belum Follow-up`;
- tombol `Tandai Sudah Dihubungi` tersedia;
- setelah satu klik tampil `Sudah dihubungi` + timestamp;
- tombol menjadi nonaktif;
- setelah reload state tetap persisten;
- status CRM tetap `contacted`;
- Lead Portal tetap `Konsultasi berlangsung`, Tahap 2 dari 5;
- final D1 query menunjukkan:
  - `lead_contacted_count = 1`;
  - action `LEAD_CONTACTED`;
  - tanpa duplikasi.

Semantics yang dikunci:
- `contacted` = status CRM / proses konsultasi;
- `contacted` bukan bukti otomatis Admin telah menghubungi Lead;
- proof follow-up berasal dari `LEAD_CONTACTED` / `contacted_at`;
- Lead `new` atau `contacted` tanpa `contacted_at` dapat memakai explicit follow-up;
- explicit follow-up tidak boleh membuat `LEAD_CONTACTED` duplikat.

Next focus:
`LEAD SELF-SERVICE / PUBLIC LEAD FLOW — FINAL CLOSEOUT R1`.

## 21. LEAD UI INDONESIA R1 — Final Lock 2 Okt 2026

Milestone:
`LEAD UI INDONESIA R1`

Status: **LOCKED / PASS**

Bukti source:
- `35cb816 feat: localize admin lead ui to Indonesian`
- `1266126 feat: complete Indonesian lead admin copy`
- `3f3bd5f fix: hide raw lead enum values in admin ui`

Bukti staging runtime:
- Status Lead tampil Bahasa Indonesia:
  `Registrasi diterima`,
  `Konsultasi berlangsung`,
  `Kebutuhan terverifikasi`,
  `Proses tidak dilanjutkan`,
  `Akun Client aktif`.
- Semantik PATCH B2 tetap terjaga:
  CRM `contacted` tidak otomatis berarti Admin sudah menghubungi Lead.
- Modal Lead, Kalkulator / Data Ruang Lingkup, Catatan & Tindak Lanjut, dan Print Preview tervalidasi.
- Raw enum seperti `none` dan `flexible` tidak lagi ditampilkan kepada Admin.
- Nama teknis layanan `Website Company Profile` tetap dipertahankan.
- Tidak ada regression visual yang ditemukan pada staging.
- Jangan mengulang `LEAD UI INDONESIA R1` kecuali ada regression nyata.

## 22. HOME SECTION DETAIL ARCHITECTURE - FINAL LOCK 7 Okt 2026

Status: **PRODUCTION VERIFIED / COMPLETED / LOCKED**

Platform Baseline: `2026.10.07.0001`

Implementation commit: `569edbfa899dc11d5770e75acab5a2c3c3d74a4b`

### Locked Public Architecture

- Home = summary / discovery.
- Keahlian Teknis = technologies / skills yang digunakan.
- Layanan = solusi digital yang dapat dibangun.
- Proses Kerja = lifecycle project.
- Kepercayaan & Transparansi = komitmen dan ekspektasi client.
- Engineering = system capabilities + technical proof.
- Portfolio = proof of real work.
- Mengapa Memilih Saya = client decision + trust/value layer.

### Locked Routes

- `/keahlian-teknis/`
- `/layanan/`
- `/proses-kerja/`
- `/kepercayaan-transparansi/`
- `/engineering/` tetap existing protected route.

### Revision Record

1. **REVISION 1** - Initial Home Section Detail Architecture.
2. **REVISION 2** - Typography Color Alignment mengikuti Insights.
3. **REVISION 3** - CTA Consistency menggunakan standard `btn outline`.

### Revision Governance

- Setiap iterasi pengeditan dicatat sebagai `REVISION 1`, `REVISION 2`, dan seterusnya.
- `REVISION N` digunakan untuk script / edit iteration.
- Platform Baseline tetap menggunakan format `YYYY.MM.DD.NNNN`.
- Revision tidak menggantikan atau menaikkan namespace V2.01 / V2.02.
- Scope baru tidak membuka ulang V2.01, V2.02, Engineering, atau Mengapa Memilih Saya.

### Verification

- Source Review: **PASS / LOCKED**
- Visual Desktop: **PASS / LOCKED**
- Visual Mobile: **PASS / LOCKED**
- Production Verification: **PASS / LOCKED**
- Repository source commit: **SYNCHRONIZED / CLEAN**

## 23. PREMIUM NAVIGATION, SMART EXPLORE & CACHE RESILIENCE - FINAL LOCK 7 Okt 2026

Status: **PRODUCTION VERIFIED / COMPLETED / LOCKED**

Platform Baseline: `2026.10.07.0002`

Production commits:

- Premium Navigation + Mega Menu + Smart Explore + Premium Footer: `d95f5b2dd3cc2c40a81a3b7d377186b779c77c58`
- Static Asset Cache Busting: `807dadae0560c93d79fa107cfa6f8191279d027c`

### Locked Public Experience

- Main navbar tetap ringkas dan visitor-oriented.
- `Jelajahi` menjadi premium mega-discovery layer.
- Smart Explore menjadi direct discovery/search layer.
- Dedicated public pages tetap menjadi depth layer.
- Premium Footer menjadi project CTA + navigation + engineering + portfolio + legal/contact layer.
- Footer Safe Space menjaga Audio dan Privacy floating controls agar tidak menimpa footer.

### Revision Record

- REVISION 4 — premium navigation attempt pertama: **ROLLED BACK / SOURCE UNCHANGED**.
- REVISION 5 — premium navigation, mega menu, Smart Explore, dan premium footer.
- REVISION 6 — premium footer safe-space refinement.
- REVISION 7 — static asset cache-busting `?v=20261007-r7`.
- REVISION 8 — documentation closeout untuk Platform Baseline `2026.10.07.0002`.

### Cache Regression Resolution

Root cause final: browser/HTTP stale cache terhadap global unversioned asset dengan production `Cache-Control: max-age=14400`.

Service Worker hypothesis ditolak setelah Application inspection menunjukkan tidak ada active Service Worker registration dan Cache Storage kosong.

Resolution:

- `style.css?v=20261007-r7`
- `script.js?v=20261007-r7`
- `/search-enhancer.js?v=20261007-r7`

### Final Verification

- Source Review: **PASS / LOCKED**
- Desktop Visual Review: **PASS / LOCKED**
- Mobile Visual Review: **PASS / LOCKED**
- Local Cache-Busting Trap: **PASS / LOCKED**
- Controlled Staging: **PASS**
- Pre-Commit Review: **PASS**
- Controlled Commit/Push: **PASS**
- Production HTML / Asset Verification: **PASS**
- Production Key Routes: **PASS**
- Production Visual Test dengan browser normal: **PASS / LOCKED**
- Stale Stylesheet Regression: **RESOLVED**
- Protected namespaces: **UNTOUCHED**

### Governance Lock

- Jangan mengubah navbar menjadi katalog.
- Gunakan Mega Menu dan Search sebagai exploration engine.
- Jangan membuka kembali scope ini tanpa regression nyata atau approved scope change.
- Home Section Detail Architecture `2026.10.07.0001` tetap historical locked baseline.
- Historical Platform Baseline sebelum FAQ closeout: `2026.10.07.0002`.

# CURRENT CHECKPOINT

**FINAL CLOSEOUT CHECKPOINT:** `36b508b`

**LATEST STAGING-TESTED CONTENT:** `1cafcc7` on `feature/client-management-r1`

**RELEASE-CANDIDATE BASE:** `63fbe32` on `feature/client-management-r1`

**STAGING API WORKER:** `0ae655ac-ea45-4b4e-991a-00911ef79eee` / prefix `0ae655ac`

**WORKING TREE:** CLEAN pada checkpoint verifikasi Final Closeout R1 sebelum documentation sync

**LATEST LOCKED/PASS:** `FINAL CLOSEOUT R1 / DEMO ISOLATION R1 / REAL LEAD + OFFICIAL ESTIMATE`

**PRESERVED LOCKED/PASS:** `LEAD SELF-SERVICE UX R1 — PATCH B2 FOLLOW-UP SEMANTICS`

**CURRENT FOCUS:** `POST-RELEASE MONITORING / NEXT ROADMAP PRIORITY`

**NEXT OPEN GAP:** tidak ada untuk Production Release R1; prioritas roadmap berikutnya akan ditentukan setelah post-release monitoring.

**BACKEND FOUNDATION:** `LEAD OFFICIAL ESTIMATE R1`, Demo Journey, dan Homepage Integration sudah tersedia serta staging verified.

**NEXT CHECKPOINT:** post-release monitoring dan penentuan prioritas roadmap berikutnya.

**NEXT MAJOR CHECKPOINT:** prioritas roadmap berikutnya setelah Production Release R1.

**PRODUCTION:** `PRODUCTION RELEASE R1 = LOCKED/PASS`; release content `4495cd6` telah diterbitkan ke `main` dan production runtime verified.

**RULE:** jangan mengulang modul yang sudah `LOCKED / PASS` kecuali ada regression nyata.

---

## BRAND IDENTITY GOVERNANCE — LOCKED

Seluruh pekerjaan visual, metadata, favicon, PWA, Open Graph, Portal,
Dashboard, Demo, dokumen, portfolio, dan asset generation wajib mengikuti:

`docs/BRAND.md`

Canonical primary brand mark:

`/images/logo.avif`

Primary identity type:

`PHOTO-BASED PERSONAL BRAND`

Aturan utama:

- foto/logo Srilex Buditra tetap menjadi primary identity;
- secondary signature resmi adalah `SB DIGITAL`;
- bentuk visual dan gaya/font `SB` yang sudah disetujui wajib dipertahankan;
- tulisan `DIGITAL` hanya menjadi supporting text;
- badge identitas permanen tidak menggunakan tahun;
- tidak boleh melakukan automatic rebranding;
- visual yang sudah LOCKED harus dipertahankan;
- perubahan primary identity membutuhkan persetujuan eksplisit;
- prinsip pengembangan: `PRESERVE BRAND IDENTITY FIRST`.

Status:

`SRILEXBUDITRA BRAND IDENTITY R1 = LOCKED`

---

### MASTER VISUAL GOVERNANCE — LOCKED

Canonical visual branding homepage/social preview mengikuti:

`docs/BRAND.md`

Status visual:

`SRILEXBUDITRA MASTER VISUAL R1 = LOCKED`

Canonical MASTER asset:

`/images/og/home/homepage-master-portrait-r1.png`

Dimensions:

`1024 × 1536 px`

SHA256:

`3AB96F32E7A77D4F96BAF73E50590292CABA3F1C49F6205D3643BB670F5B3979`


Prinsip wajib:

`EDIT MASTER — NOT REDESIGN MASTER`

Aturan:

- gambar MASTER yang telah disetujui wajib dipertahankan;
- tidak boleh menggambar ulang desain MASTER;
- tidak boleh membuat interpretasi layout baru;
- perubahan hanya boleh berupa patch minimal;
- secondary signature resmi adalah `SB DIGITAL`;
- bentuk visual/font `SB` wajib dipertahankan;
- foto/logo tetap menjadi primary identity;
- seluruh AVIF, JPG, Open Graph, social preview, dan asset turunan harus berasal dari MASTER yang sama;
- resize, crop, compression, dan format conversion tidak boleh mengubah karakter visual MASTER.

## HOMEPAGE SOCIAL VISUAL R1 - LOCKED / PASS

Canonical MASTER:

`/images/og/home/homepage-master-portrait-r1.png`

Canonical social derivatives:

`/images/og/home/homepage-social-portrait-r1.avif`
`/images/og/home/homepage-social-portrait-r1.jpg`

Dimensions:

`1024 x 1536 px`

AVIF SHA256:

`5CF8B2D3DA20A70618B265939589916D61269E2723E9BEF6E3A15110AF3626D2`

JPG SHA256:

`CC1FDA00CE6F12B2C868FAEDFD3D18510FE10AA971DBEA1BE374F6F79D390FA6`

Validation:

- visual MASTER dibandingkan langsung dengan social derivative;
- visual MASTER = PASS;
- visual SOCIAL = PASS;
- tidak menggunakan crop;
- tidak menggunakan padding;
- tidak mengubah aspect ratio;
- tidak melakukan redesign;
- komposisi visual MASTER tetap dipertahankan.

A4 derivative bukan canonical social asset karena perubahan aspect ratio
mengubah keseimbangan visual MASTER.

Prinsip tetap:

`EDIT MASTER - NOT REDESIGN MASTER`

Status:

`HOMEPAGE SOCIAL VISUAL R1 = LOCKED / PASS`


---

## Maintenance Rules

- Jangan mengubah fitur roadmap menjadi status LIVE tanpa verifikasi.
- Jangan mengulang modul LOCKED/PASS tanpa regression atau perubahan terkait.
- Jangan menggunakan commit hash historis sebagai baseline baru tanpa pemeriksaan Git terbaru.
- Jangan menyimpan password, token, cookie, secret, credential, atau data pribadi di roadmap.
- Update bagian current terlebih dahulu ketika arah produk berubah.
- Checkpoint lama tetap tersedia sebagai rekam jejak dan melalui Git history.

## Platform Baseline 2026.10.07.0003 — Closeout

Runtime production anchor: `68c89f9a6fb4c6dd2ab389619c3a4026cdb07368`

Status milestone:

- REVISION 9 — **COMPLETED / PRODUCTION VERIFIED / LOCKED**
  - Mobile Footer Optimization.
  - Home FAQ Architecture.
  - Dedicated `/faq/`.
  - Search + sitemap discovery.
  - Public stylesheet cache token R9.

- REVISION 10 — **COMPLETED / PRODUCTION VERIFIED / LOCKED**
  - FAQ Typography Color Alignment.
  - Visual language aligned with Insights.

- REVISION 11 — **FAILED / ROLLED BACK**
  - documentation write attempt;
  - git diff --check mendeteksi trailing whitespace;
  - semua 5 file dipulihkan;
  - runtime dan repository history tidak berubah.

- REVISION 12 — **DOCUMENTATION CLOSEOUT IMPLEMENTATION / SOURCE REVIEW**
  - runtime source unchanged;
  - protected namespaces unchanged;
  - JavaScript unchanged;
  - documentation synchronized to production state.

Production validation:

- Home FAQ: 6 questions — PASS.
- Dedicated FAQ: 16 questions / 8 categories — PASS.
- `FAQPage` schema — PASS.
- Canonical `/faq/` — PASS.
- Mobile footer phone 2 × 2 — PASS.
- Audio / Privasi safe-space — PASS.
- Search — PASS.
- Sitemap — PASS.
- R7 public stylesheet references — 0.
- R9 stylesheet — ACTIVE.
- Production visual confirmation — PASS.

- REVISION 13 — **DOCUMENTATION METADATA + MARKDOWN REFINEMENT / SOURCE REVIEW**
  - baseline timestamp metadata aligned;
  - documentation sync date aligned;
  - inline-code Markdown restored;
  - runtime source unchanged.

- REVISION 14 — **FAILED VALIDATION ATTEMPT / ROLLED BACK**
  - token correction sempat berhasil;
  - validation marker mismatch memicu rollback;
  - tidak ada stage, commit, atau push.

- REVISION 15 — **FAILED VALIDATOR-SCOPE ATTEMPT / ROLLED BACK**
  - token correction kembali berhasil;
  - validator salah memeriksa code fence historis yang sah;
  - rollback memulihkan REVISION 13 state;
  - tidak ada stage, commit, atau push.

- REVISION 16 — **SCOPED MARKDOWN TOKEN CORRECTION / FINAL DOCUMENTATION CLOSEOUT**
  - malformed stylesheet inline-code token dikoreksi;
  - backtick validation dibatasi ke section Platform Baseline 2026.10.07.0003;
  - historical Markdown code fence tetap dipertahankan;
  - runtime source tidak berubah;
  - documentation siap menuju final read-only review.

Platform Baseline aktif setelah REVISION 16 documentation closeout: 2026.10.07.0003.

---

## Platform Baseline 2026.10.07.0004 — Closeout

Runtime production anchor: `475618f96100fbfd0cede52352afc335eff6feec`

Parent baseline: `2026.10.07.0003`

Status milestone:

- REVISION 17 — **COMPLETED / DEPLOYED**
  - Portal Demo static asset cache-busting pada register, login, Lead Demo, dan Client Demo.
  - Implementation commit `ade066995ad40e725daec9892a247e5ad668a1ce`.

- REVISION 17.1 — **COMPLETED / PRODUCTION VERIFIED / LOCKED**
  - Lead Demo dynamic styling dipindahkan ke stylesheet eksternal untuk strict CSP compatibility.
  - Desktop dan mobile production verification: PASS.
  - Implementation commit `36a173d7d265092e2be42f946c807b06150e58ee`.

- REVISION 18 — **COMPLETED / PRODUCTION VERIFIED / LOCKED**
  - Client Demo dynamic/inline styling dependency dipindahkan ke scoped external stylesheet.
  - Header CTA, modal, mobile navigation, dan progress 82% tervalidasi.
  - Local desktop/mobile verification: PASS.
  - Production visual confirmation: PASS.
  - Implementation commit `475618f96100fbfd0cede52352afc335eff6feec`.

Safety boundary:

- strict production CSP dipertahankan;
- CSP policy tidak diubah atau dilemahkan;
- global stylesheet tidak diubah oleh REVISION 18;
- perubahan runtime REV17.1/REV18 dibatasi pada Portal Demo yang disetujui;
- documentation closeout REV19 hanya menyinkronkan lima dokumen platform dan tidak mengubah HTML/CSS/JavaScript runtime.

Platform Baseline aktif setelah REV19 documentation closeout: `2026.10.07.0004`.

---

## Platform Baseline 2026.10.07.0005 - REV20 UX & Content Alignment Closeout

Runtime production anchor: `38d1c02139b20bd7ff739684f3d0733817914a8e`

Parent baseline: `2026.10.07.0004`

Status milestone:

- REV20 - **COMPLETED / PRODUCTION VERIFIED / LOCKED**
  - Mobile hero alignment untuk dua portfolio target tervalidasi pada desktop/mobile.
  - Portal Login dan Portal Register memiliki reciprocal secondary navigation.
  - Home Portal & Konsultasi copy telah diselaraskan.
  - Visible professional identity telah diselaraskan menjadi Senior Full Stack Developer Bengkulu.
  - Source Review: PASS.
  - Local desktop/mobile visual verification: PASS.
  - Production desktop/mobile visual verification: PASS / USER CONFIRMED.
  - Runtime implementation commit: `38d1c02139b20bd7ff739684f3d0733817914a8e`.

Safety boundary:

- runtime scope dibatasi tepat pada 9 file REV20 yang disetujui;
- global `style.css` tidak berubah;
- `portfolio/case-study.css` tidak berubah;
- `portal/register/register.js` tidak berubah;
- backend, D1, dan Worker tidak dibuka;
- CSP policy tidak berubah atau dilemahkan;
- PWA dan Service Worker tidak dibuka pada REV20;
- documentation closeout baseline 2026.10.07.0005 hanya menyinkronkan lima dokumen platform dan tidak mengubah HTML/CSS/JavaScript runtime.

Next planned revision:

- **REV21 - Premium PWA Install Experience - PLANNED / NOT LIVE**.
- REV21 harus dimulai dari READ-ONLY audit terhadap manifest, Service Worker, installability, icon assets, cache behavior, dan strict CSP sebelum implementasi apa pun.

Platform Baseline aktif setelah REV20 documentation closeout: `2026.10.07.0005`.

---

## Platform Baseline 2026.10.07.0006 - REV21 Premium PWA Install Experience Closeout

Runtime production anchor: `f941709dd3c1ca16629488e4cceb1c10080bde69`

Parent baseline: `2026.10.07.0005`

Status milestone:

- REV21 - **COMPLETED / PRODUCTION VERIFIED / LOCKED**
  - Premium install card production verified.
  - Chromium install lifecycle verified.
  - Android real-device installation verified.
  - Home-screen app icon verified.
  - Post-install hidden state verified.
  - iOS/iPadOS guidance locally verified.
  - Maskable icon 512x512 added.
  - Privacy/TTS overlap fixed and verified.

Safety boundary:

- runtime scope tetap tepat 5 file;
- global `style.css` unchanged;
- global `script.js` unchanged;
- Service Worker tidak ditambahkan;
- backend/API/D1/Worker tidak dibuka;
- CSP policy tidak berubah;
- documentation closeout hanya mengubah lima Markdown.

Next planned revision:

- **REV22 - Web Push & Notification Subscription - PLANNED / NOT LIVE**.
- REV22 harus dimulai dari READ-ONLY audit sebelum implementasi.

Platform Baseline aktif: `2026.10.07.0006`.

## Site Publishing Safety Roadmap - 2026-10-09

**Status:** DOCUMENTATION BASELINE / SAFETY IMPROVEMENTS NOT IMPLEMENTED.

### Verified Current Publishing Paths

- Main website: GitHub Pages with Cloudflare DNS/proxy, using srilexbuditra.work and www.srilexbuditra.work.
- Staging website: Cloudflare Pages project srilexbuditra-github-io, using staging.srilexbuditra.work.
- GitHub main currently feeds the website publication paths; pushes may trigger automatic publication.
- GitHub Pages and Cloudflare Pages deployments were reviewed as successful for the relevant commits.

### Planned Safety Improvements

1. Document and periodically verify GitHub Pages, Cloudflare Pages, and DNS publishing configuration.
2. Evaluate isolating staging source from production source to reduce accidental publication risk.
3. Require an explicit release gate before publishing application changes from main.
4. Verify the exact staged file list, commit scope, and deployment impact before every push.
5. Preserve a tested rollback strategy for published static assets and separate backend changes.
6. Keep database migrations, Cloudflare Worker releases, secrets, and DNS changes behind independent approvals.
7. Distinguish deployment success from runtime checks, security checks, and database integrity verification.
8. Keep GitHub Actions repository validation and GitHub Pages deployment status independently recorded.
9. Preserve REV21 production LOCKED and REV22 Web Push DEPLOYMENT HOLD until specifically authorized.
10. Implement Unified Backup & Recovery V1.0 only after independent backup, encryption, and recovery testing.

### Release Completion Gate

- Document affected files, source revision, target environment, approvals, and rollback steps.
- Verify staging before authorizing production application changes.
- Do not treat documentation-only updates as permission to deploy unfinished source changes.
- Mark a publishing architecture change VERIFIED only after collecting fresh evidence.

## Rilis Massal Pratinjau OG Internal — 40 Halaman [INTERNAL-OG-V1-BULK-ASSET-RELEASE]

- Acuan kode sebelum penerapan: commit `120ddd2` pada `main`; acuan fungsi aplikasi: `ec12c92` (REV22 R3.7 FINAL / LOCKED).
- Cakupan rilis: 40 gambar AVIF portrait 1024 × 1536 piksel dan perubahan HTML hanya pada 40 halaman internal yang tercantum dalam inventaris.
- Perlindungan wajib: seluruh `/program/`, sistem inti REV21/REV22, Worker, D1, API, notifikasi Web Push, instalasi PWA, terjemahan browser, dan persetujuan privasi tetap dipertahankan.
- Kebijakan gambar: hanya mengganti pratinjau OG yang kosong atau masih memakai logo/gambar halaman utama; gambar OG khusus yang sesuai tetap dipertahankan.
- Pengujian akhir: setiap URL di domain produksi diverifikasi setelah commit dan push berhasil; jangan mengulang pengujian fitur yang sudah dinyatakan lulus.

## Penyesuaian Metadata ke Bahasa Indonesia [INTERNAL-OG-V1-LOCALE-ID-RECOVERY]

- Judul, deskripsi, metadata Open Graph, metadata Twitter, serta teks alternatif gambar pada 40 halaman inventaris telah diseragamkan ke Bahasa Indonesia. Nama produk, singkatan, dan istilah teknis resmi tetap digunakan seperlunya.
- Catatan rilis proyek pada file `CHANGELOG.md` dan `docs/ROADMAP.md` yang sudah ada menggunakan Bahasa Indonesia; catatan historis sebelum proyek ini tidak ditulis ulang.
- Gambar AVIF, URL canonical, aturan robots, konten utama halaman, fitur REV21/REV22, dan seluruh `/program/` tidak diubah oleh tahap penyesuaian bahasa ini.
- Status: hasil akhir diperiksa pada domain produksi per halaman setelah commit dan push berhasil.
