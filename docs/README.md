# Documentation Index — Srilex Buditra Portfolio

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



Dokumen ini adalah indeks dokumentasi aktif repository `srilexbuditra.github.io`. Gunakan indeks ini untuk membedakan dokumentasi operasional, panduan teknis, audit, dan referensi historis.

**Current documentation baseline:** 8 Oktober 2026 - Platform Baseline 2026.10.07.0006 / REV21 Premium PWA Install Experience
**Last documentation sync:** 8 Oktober 2026
**Current site content architecture:** Site Content Architecture V2.02 tetap **PRODUCTION VERIFIED / COMPLETED / LOCKED**; `/mengapa-memilih-saya/` telah **PRODUCTION VERIFIED / COMPLETED / LOCKED** sebagai Public Trust / Client Decision Layer dengan implementation commit `80b3bb18caecc3dce72256747cdf3c9dee8aa511`.

## 1. Dokumentasi Utama

| Dokumen | Status | Fungsi |
|---|---|---|
| [README.md](../README.md) | Active | Gambaran umum website, fitur, struktur repository, dan titik masuk dokumentasi. |
| [CHANGELOG.md](../CHANGELOG.md) | Active | Riwayat perubahan website dan modul. |
| [docs/CLIENT-MANAGEMENT.md](CLIENT-MANAGEMENT.md) | Final Closeout LOCKED/PASS / Production Release R1 LOCKED/PASS | Status Client Management Platform R1, Lead Portal, Official Estimate, Client Portal, dan Full Demo Journey. |
| [docs/ROADMAP.md](ROADMAP.md) | Active | Master roadmap: arah produk, source-of-truth, roadmap strategis, dan continuity history. |
| [docs/README.md](README.md) | Active | Indeks dokumentasi repository. |
| [docs/REPOSITORY-AUDIT.md](REPOSITORY-AUDIT.md) | Active | Master repository/privacy audit dan historical documentation audit. |
| [docs/BRAND.md](BRAND.md) | Active | Catatan implementasi tahap Trust & Authority. |
| [docs/PLATFORM.md](PLATFORM.md) | Active | Platform publik: Knowledge Center / Insights, Development Timeline / Activity, System Engineering / Technical Proof, dan Public Trust / Client Decision Layer. |
| [DASHBOARD-PESERTA-V2.md](../DASHBOARD-PESERTA-V2.md) | Active | Dokumentasi peningkatan Dashboard Peserta V2 dan batas perubahan frontend/backend. |
| [docs/ANALYTICS.md](ANALYTICS.md) | Active | Dokumentasi Analytics V4 berbasis Cloudflare Workers + D1. |
| [AKTIVITAS-EVENT-PUBLIC-V17.19.13B.md](../AKTIVITAS-EVENT-PUBLIC-V17.19.13B.md) | Active / Pre-lock | Dokumentasi integrasi Aktivitas & Event terbaru: Admin, peserta, halaman publik, gambar, SEO, Rich Summary, dan status uji OG/Schema/GA4. |
| [AKTIVITAS-EVENT-V13.2.md](../AKTIVITAS-EVENT-V13.2.md) | Historical Module Baseline | Baseline awal Event peserta sebelum pengelolaan Admin dan halaman publik. |
| [AKTIVITAS-EVENT-ADMIN-V13.2.1.md](../AKTIVITAS-EVENT-ADMIN-V13.2.1.md) | Historical Admin Baseline | Baseline awal pengelolaan Event Admin dan verifikasi kehadiran. |

## 2. Program Ketahanan Pangan

| Dokumen | Status | Fungsi |
|---|---|---|
| [program/README.md](../program/README.md) | Active | Gambaran umum area `/program/` dan prinsip shared assets/keamanan. |
| [program/ketahanan-pangan/README.md](../program/ketahanan-pangan/README.md) | Active | Peta modul dan route Program Ketahanan Pangan. |
| [program/ketahanan-pangan/registrasi/README.md](../program/ketahanan-pangan/registrasi/README.md) | Module Reference | Dokumentasi lokal modul registrasi. |
| [program/ketahanan-pangan/registrasi/README-V7-UPLOAD.md](../program/ketahanan-pangan/registrasi/README-V7-UPLOAD.md) | Historical/Module Reference | Catatan implementasi upload dokumen pada tahap V7 registrasi. |
| [program/ketahanan-pangan/dokumentasi/README-INSTALL.md](../program/ketahanan-pangan/dokumentasi/README-INSTALL.md) | Module Reference | Panduan instalasi halaman dokumentasi program. |

Area publik utama Program Ketahanan Pangan:

- `/program/ketahanan-pangan/` — portal program.
- `/program/ketahanan-pangan/registrasi/` — pendaftaran peserta.
- `/program/ketahanan-pangan/verifikasi/` — pemeriksaan status pendaftaran.
- `/program/ketahanan-pangan/peserta/` — login/aktivasi dan dashboard peserta.
- `/program/ketahanan-pangan/verifikasi/sertifikat/` — verifikasi sertifikat publik.
- `/program/ketahanan-pangan/peserta/aktivitas/` — agenda, pendaftaran event, status kehadiran, dan Poin Aktivitas peserta.
- `/program/ketahanan-pangan/event/<slug>/` — detail Event publik dinamis berdasarkan slug.
- `/program/ketahanan-pangan/dokumentasi/` — dokumentasi publik program.
- `/portfolio/ketahanan-pangan/` — flagship case study pada website utama.

Area administrasi tidak diperlakukan sebagai halaman publik untuk indexing dan tidak boleh menjadi tempat penyimpanan secret pada source client-side.

## 3. Trust, Security, Privacy, Legal & Accessibility

| Dokumen | Status | Fungsi |
|---|---|---|
| [docs/BRAND.md](BRAND.md) | Active | Catatan tahap profil publik, proof of work, dan trust principles. |
| [SECURITY.md](../SECURITY.md) | Active | Kebijakan keamanan dan pelaporan kerentanan. |
| [PRIVACY.md](../PRIVACY.md) | Active | Kebijakan privasi website. |
| [TERMS.md](../TERMS.md) | Active | Ketentuan penggunaan. |
| [LICENSE.md](../LICENSE.md) | Active | Ketentuan lisensi project. |
| [NOTICE.md](../NOTICE.md) | Active | Pemberitahuan hak, aset, dan komponen terkait. |
| [ACCESSIBILITY.md](../ACCESSIBILITY.md) | Active | Komitmen dan catatan aksesibilitas. |

## 4. Verification & Secure Document

| Dokumen | Status | Fungsi |
|---|---|---|
| [verify/README.md](../verify/README.md) | Active | Ringkasan modul Document Verification. |
| [verify/V30_VERIFICATION_SETUP.md](../verify/V30_VERIFICATION_SETUP.md) | Technical Reference | Panduan setup sistem verifikasi/publisher V30. |
| [verify/V31_PUBLISHER_SECURITY.md](../verify/V31_PUBLISHER_SECURITY.md) | Security Reference | Catatan hardening publisher/verifikasi. |
Implementasi berada pada `verify/`, termasuk registry statis dan source Worker publisher bila digunakan. Secret tidak boleh disimpan di repository publik.

## 5. Analytics

| Dokumen | Status | Fungsi |
|---|---|---|
| [docs/ANALYTICS.md](ANALYTICS.md) | Active | Arsitektur Analytics V4, visitor tracking anonim, dan dashboard statistik. |

## 6. Performance & Asset Architecture

| Dokumen | Status | Fungsi |
|---|---|---|
| [docs/ENGINEERING.md](ENGINEERING.md) | Active | Master engineering: asset architecture, performance, responsive legal UI, dan privacy consent estimator. |

## 7. Audit Repository

| Dokumen | Status | Fungsi |
|---|---|---|
| [docs/REPOSITORY-AUDIT.md](REPOSITORY-AUDIT.md) | Active | Master repository/privacy audit dan historical documentation audit. |
## 8. Historical Engineering Notes

Historical Documentation Audit V11.6 yang dipertahankan di `docs/REPOSITORY-AUDIT.md` mencatat enam engineering notes pernah dipindahkan ke `docs/archive/`. Namun pada snapshot repository yang diaudit untuk V11.8, folder `docs/archive/` dan keenam file tersebut **tidak tersedia**.

Karena file sumbernya tidak ada pada snapshot terbaru, V11.8 tidak membuat ulang isi historis tersebut dan tidak mempertahankan tautan aktif yang rusak. Audit V11.6 tetap disimpan sebagai catatan historis mengenai kondisi repository pada saat audit itu dibuat.

## 9. Portfolio Subprojects

README lokal untuk selected portfolio subprojects:

- [portfolio/aplikasi-pos/README.md](../portfolio/aplikasi-pos/README.md)
- [portfolio/sistem-administrasi/README.md](../portfolio/sistem-administrasi/README.md)
- [portfolio/website-sekolah/README.md](../portfolio/website-sekolah/README.md)
- [portfolio/website-sekolah/README-V2-MAIN.md](../portfolio/website-sekolah/README-V2-MAIN.md)
- [portfolio/website-sekolah/v2/README.md](../portfolio/website-sekolah/v2/README.md)
- [portfolio/website-sekolah/tjkt-smkn1kotabengkulu/README.md](../portfolio/website-sekolah/tjkt-smkn1kotabengkulu/README.md)

Flagship `portfolio/ketahanan-pangan/` menggunakan halaman case study publik dan tidak memiliki README terpisah pada snapshot V11.8; konteksnya dirangkum oleh README root dan README Program Ketahanan Pangan.

## 10. GitHub Contribution Templates

File berikut adalah template operasional GitHub, bukan dokumentasi produk:

- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`

## 11. Aturan Pemeliharaan Dokumentasi

1. Update `CHANGELOG.md` jika perubahan memengaruhi versi, fitur, keamanan, performa, UI/UX, arsitektur, atau route publik penting.
2. Update `README.md` jika perubahan memengaruhi gambaran umum fitur, teknologi, struktur project, atau titik masuk sistem.
3. Update README lokal saat modul program berubah secara material.
4. Tambahkan dokumen baru ke `docs/README.md` agar indeks tetap sinkron.
5. Jangan mengubah audit versi lama untuk membuatnya seolah-olah menggambarkan kondisi sekarang; buat audit baru.
6. Jangan membuat tautan ke file historis yang tidak terdapat di repository.
7. Jangan menyimpan token, secret, password, private key, data KTP/KK/NIK, atau kredensial layanan pada Markdown/source publik.
8. Dokumentasi tidak boleh mengklaim fitur sebagai live jika fitur tersebut masih roadmap.

### Unified Backup & Recovery V1.0 - Documentation Governance

**Status:** APPROVED POLICY SCOPE / IMPLEMENTATION NOT STARTED.

- Standar backup dan pemulihan berlaku bagi seluruh proyek srilexbuditra.work.
- Ringkasan kebijakan dicantumkan di README.md.
- Arsitektur D1, R2, GitHub PRIVATE, enkripsi, retensi, dan recovery dicantumkan di docs/PLATFORM.md.
- Tahapan implementasi, pengujian, dan persyaratan operasional dicantumkan di docs/ROADMAP.md.
- Riwayat persetujuan kebijakan dicatat di CHANGELOG.md.
- Pembaruan kebijakan menggunakan file Markdown yang sudah tersedia; tidak membuat file .md baru untuk Unified Backup & Recovery V1.0.
- Catatan versi historis dan status LOCKED tidak boleh ditulis ulang.
- Data pribadi, SQL mentah, password, token, private key, serta kredensial pemulihan tidak boleh dicantumkan dalam dokumentasi publik.
- Hasil audit, backup, enkripsi, dan uji recovery harus dipisahkan antara PLANNED, VERIFIED, dan ACTIVE berdasarkan bukti.
- Setiap perubahan kebijakan harus diperiksa menggunakan git diff sebelum staging, commit, push, atau deployment.

Dokumentasi kebijakan tidak berarti backup otomatis telah aktif. Implementasi memerlukan tahap dan persetujuan tersendiri.

## 12. Status Saat Ini
### Home Section Detail Architecture

- Platform Baseline `2026.10.07.0001`: **PRODUCTION VERIFIED / COMPLETED / LOCKED**.
- Implementation commit: `569edbfa899dc11d5770e75acab5a2c3c3d74a4b`.
- Route aktif: `/keahlian-teknis/`, `/layanan/`, `/proses-kerja/`, `/kepercayaan-transparansi/`.
- Home centralized CTA dan `/engineering/` telah diverifikasi di production.
- **REVISION 1** - Initial Architecture.
- **REVISION 2** - Insights Typography Color Alignment.
- **REVISION 3** - CTA Consistency.
- Revision governance: gunakan `REVISION N` untuk iterasi pengeditan; Platform Baseline tetap menggunakan `YYYY.MM.DD.NNNN`.
- V2.01, V2.02, Engineering, dan Mengapa Memilih Saya tetap pada status locked masing-masing.

### Premium Navigation, Smart Explore & Cache Resilience

- Platform Baseline `2026.10.07.0002`: **PRODUCTION VERIFIED / COMPLETED / LOCKED**.
- Premium Navigation + Mega Menu + Smart Explore + Premium Footer aktif pada production commit `d95f5b2dd3cc2c40a81a3b7d377186b779c77c58`.
- Premium Footer Safe Space telah diverifikasi pada desktop/mobile.
- Static Asset Cache Busting `?v=20261007-r7` aktif pada production commit `807dadae0560c93d79fa107cfa6f8191279d027c`.
- Stale stylesheet regression: **RESOLVED**.
- Local stale-cache trap, production HTML references, versioned asset HTTP 200, key routes, dan production visual verification: **PASS / LOCKED**.
- REVISION 4 tetap tercatat sebagai rolled-back attempt / source unchanged; REVISION 5 adalah implementation, REVISION 6 adalah refinement, REVISION 7 adalah cache-busting fix, dan REVISION 8 adalah documentation closeout.
- Protected namespaces `program/*` dan `portal/*` tetap **UNTOUCHED**.
- Home Section Detail Architecture baseline `2026.10.07.0001` tetap merupakan historical locked baseline dan tidak ditulis ulang.

- Client Management Platform R1: **Production Release R1 LOCKED/PASS**; production baseline aktif dan terverifikasi.
- Full Demo Journey R1: **LOCKED/PASS** untuk desktop, mobile, dan identity handoff.
- Demo Journey menggunakan data simulasi tanpa API produksi atau D1.
- Demo Isolation R1: **LOCKED/PASS**; Demo menggunakan state lokal/sessionStorage dan tidak memanggil API/D1 produksi.
- Final Closeout R1: **LOCKED/PASS**; Final Closeout checkpoint `36b508b`, latest staging-tested content `1cafcc7`, release-candidate base `63fbe32`.
- Fixture closeout: Lead tetap `qualified`, Official Estimate `approved` Rp5.300.000, Client belum diaktivasi, dan Invoice belum dibuat.
- Real Registration -> Full Demo Handoff R1: **LOCKED/PASS**.
- Homepage Demo Integration R1: **LOCKED/PASS** untuk desktop, mobile, Hero Demo CTA, dan section `Coba Pengalaman Client`.
- Homepage Hero `SB DIGITAL` desktop/mobile: **LOCKED/PASS**.
- Mobile Horizontal Overflow Fix R1: **LOCKED/PASS**.
- Homepage metadata / Open Graph source / PWA / social asset staging: **PASS**.
- Asset canonical `og:image` sekarang tersedia di production setelah Production Release R1; validasi ulang scraper Meta tetap terpisah.
- Flagship Program Ketahanan Pangan: **implemented / public case study tersedia**.
- Portfolio Hub `/portfolio/`: **production verified**; live implementations dan public case studies aktif pada baseline production terbaru.
- Mengapa Memilih Saya `/mengapa-memilih-saya/`: **PRODUCTION VERIFIED / COMPLETED / LOCKED**; Home 4-card discovery + CTA, dedicated page 10 alasan + 7-step workflow; implementation commit `80b3bb1`.
- Site Content Architecture V2.02: **PRODUCTION VERIFIED / COMPLETED / LOCKED**; Home CTA + `/engineering/` aktif; enam Engineering domains terverifikasi; implementation commit `bf7ac6aa2a93cb51e648d149f3cdb8762cef9092`; maintenance only kecuali ada regression nyata atau approved scope change.
- Site Content Architecture V2.01: **5/5 AREAS COMPLETED / LOCKED**; Home V2.01, Portfolio V2.01, Profil V2.01, Insights V2.01, dan Aktivitas V2.01 seluruhnya **COMPLETED / LOCKED**. Aktivitas V2.01 telah melewati source review, visual review, controlled commit/push, dan production verification dengan commit `4a7a31e`.

- Profil & Rekam Jejak `/profil/`: **implemented**.
- Trust & Authority V8: **implemented sebagai fondasi**.
- Knowledge Center / Insights: **implemented sebagai foundation pada V11.9**.
- Development Timeline / Activity `/aktivitas/`: **implemented pada V12.0**.
- Dashboard Peserta V2: **implemented**.
- Kartu Anggota Digital + QR: **implemented untuk peserta `verified`**.
- Sertifikat QR: **existing / aktif untuk peserta terverifikasi**.
- Level/Poin, Misi, Referral, Benefit: **implemented**.
- Aktivitas & Event: **implemented** untuk Admin, peserta, gambar event, public slug, dan halaman publik; **pre-lock** sampai pengujian akhir OG/WhatsApp, Schema.org Event, dan GA4 Event Analytics selesai.
- Marketplace & Ekosistem: **implemented pada baseline V13.3** sesuai dokumentasi repository.
- Notifikasi & Informasi: **implemented pada baseline V13.4** sesuai dokumentasi repository.
- Arah milestone berikut mengikuti keputusan tim dan roadmap aktif; dokumentasi Event saat ini berfokus pada verifikasi akhir metadata/analytics sebelum LOCK.

---

**Documentation baseline:** 8 Oktober 2026 - Platform Baseline 2026.10.07.0006 / REV21 Premium PWA Install Experience
**Previous audit baseline:** V11.6
**Last documentation update:** 8 Oktober 2026

### Kartu Anggota Digital + QR

- `DASHBOARD-PESERTA-V2.md` — baseline pengalaman dashboard peserta.
- `KARTU-ANGGOTA-QR-V12.2.md` — implementasi kartu anggota authenticated, QR verifikasi publik, print/PDF, keamanan, dan batas data yang ditampilkan.


## VERIFIED MEMBER + Foto
- [VERIFIED-MEMBER-FOTO-V12.3.md](../VERIFIED-MEMBER-FOTO-V12.3.md) — alur kamera, penyimpanan foto private, review admin, dan aktivasi kartu anggota.

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

## Platform Baseline 2026.10.07.0003

Status: **PRODUCTION VERIFIED / COMPLETED / LOCKED**

Runtime production anchor: `68c89f9a6fb4c6dd2ab389619c3a4026cdb07368`

Closeout mencatat:

- REVISION 9 — Mobile Footer + FAQ Architecture.
- REVISION 10 — FAQ Typography Color Alignment.
- REVISION 11 — failed / rolled back / source unchanged.
- REVISION 12 — documentation closeout implementation / source review refinement.
- REVISION 13 — documentation metadata + Markdown refinement / source review.
- REVISION 14 — failed validation attempt / rolled back.
- REVISION 15 — failed validator-scope attempt / rolled back.
- REVISION 16 — scoped Markdown token correction / final documentation closeout.
- Home FAQ: 6 pertanyaan.
- Dedicated `/faq/`: 16 pertanyaan / 8 kategori.
- `FAQPage` schema dan canonical: verified.
- Mobile footer phone 2 × 2: verified / locked.
- Audio / Privasi safe-space: verified.
- FAQ typography aligned with Insights: verified.
- Search `/faq/`: verified.
- Sitemap `/faq/`: verified.
- Public stylesheet R9: verified.
- Production visual confirmation: PASS.
- Protected namespaces dan JavaScript platform tidak disentuh.

Platform Baseline 2026.10.07.0002 tetap merupakan historical locked baseline.

Platform Baseline 2026.10.07.0003 aktif setelah REVISION 16 documentation closeout.

## Verified Site Architecture - Documentation Governance

**Audit date:** 2026-10-09.
**Status:** DOCUMENTATION BASELINE / NO CONFIGURATION CHANGE.

The verified publishing architecture is maintained in the existing documentation:

- README.md: high-level summary of main website and staging paths.
- docs/PLATFORM.md: technical mapping of GitHub Pages, Cloudflare Pages, DNS/proxy, and deployment boundaries.
- docs/ROADMAP.md: release safety controls and future improvements.
- docs/README.md: documentation governance and update rules.
- CHANGELOG.md: historical record of the architecture audit.

### Maintenance Rules

1. Preserve historic baseline entries and decisions marked LOCKED.
2. Verify GitHub Pages, Cloudflare Pages, DNS, and deployment triggers before changing the architecture description.
3. Separate observed configuration from planned safety improvements.
4. Document evidence date, source revision, and any unresolved uncertainty.
5. Do not publish REV22 Web Push changes while deployment is HOLD.
6. Keep D1/R2 backup policy separate from claims of backup automation being active.
7. Do not create new Markdown files for this Site Architecture update; maintain the five existing documentation files.
8. Do not commit or push unrelated local source files when publishing documentation.
