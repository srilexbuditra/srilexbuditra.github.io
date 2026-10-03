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

`SRILEXBUDITRA-BRAND-IDENTITY-LOCK.md`

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

`SRILEXBUDITRA-BRAND-IDENTITY-LOCK.md`

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
