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

- Branch: `feature/client-management-r1`
- HEAD: `de37cef`
- Origin branch: `de37cef`
- Working tree: clean
- Commit terakhir: `de37cef fix: preserve notification layout after read`

> Jika source sudah bergerak setelah file ini dibuat, update bagian ini terlebih dahulu.

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

Tambahan yang sudah terbukti pada runtime sebelumnya:
- Client data isolation
- Lead cross-staff isolation
- Support cross-staff isolation
- Client notification recipient isolation
- Admin dashboard live statistics
- Client dashboard live statistics
- Client mobile navigation
- Support create/reply flow
- Assignment/reassignment foundation

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
**PUBLIC LEAD REGISTRATION R1 + HOMEPAGE PORTAL ENTRY**

Urutan:
1. Audit fondasi Lead Portal dan Public Registration.
2. Tambahkan Homepage Portal Entry.
3. Bangun Public Lead Registration.
4. Pastikan service context terbawa.
5. Bangun/aktifkan Lead Account + Lead Portal minimum.
6. Tampilkan Lead progress.
7. Tampilkan layanan yang diminati.
8. Integrasikan Lead baru ke Admin Lead Management.
9. Test staging hanya bagian baru + integrasi kritis.
10. LOCKED/PASS.

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
14. Production readiness checkpoint berikutnya

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

# CURRENT CHECKPOINT

**CURRENT FOCUS:** `PUBLIC LEAD REGISTRATION R1 + HOMEPAGE PORTAL ENTRY`

**NEXT MAJOR CHECKPOINT:** `PRODUCTION RELEASE R1`

**SETELAH PRODUCTION:** Kembali ke development roadmap mulai dari Lead Service Interest / Lead Progress / Lead → Client Handoff, lalu Estimate lifecycle.

---

**Srilex Buditra — srilexbuditra.work**  
`Build → Test → Lock → Release → Continue`
