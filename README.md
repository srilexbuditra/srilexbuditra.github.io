<!-- PLATFORM-BASELINE:START -->

## SRILEXBUDITRA.WORK Platform Baseline

Platform Baseline : 2026.10.07.0001
Recorded At       : 2026-10-06 23:37:35 WIB
Timezone          : Asia/Jakarta (UTC+07:00)
Time Format       : 24-hour (HH:mm:ss)

Maintainer        : Srilex Buditra
Role              : Senior Full Stack Developer
Location          : Bengkulu, Indonesia

Changed Area      : Home Section Detail Architecture
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
