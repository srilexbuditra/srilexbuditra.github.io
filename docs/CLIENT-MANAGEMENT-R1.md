# Srilex Buditra Client Management Platform - R1

> Status: ACTIVE DEVELOPMENT / STAGING VERIFIED
> Branch: `feature/client-management-r1`
> Production: HOLD sampai Final Closeout R1 selesai.

## 1. Tujuan Platform

Client Management Platform adalah alur digital srilexbuditra.work untuk mengelola perjalanan calon pelanggan dari awal sampai menjadi Client aktif.

Alur utama:

`Visitor -> Registrasi Lead -> Lead Portal -> Konsultasi -> Kebutuhan Terverifikasi -> Official Estimate -> Persetujuan -> Aktivasi Client -> Client Portal -> Project`

Tidak ada registrasi Client publik secara langsung.

## 2. Prinsip UX

- Visual tetap mengikuti identitas srilexbuditra.work.
- Clean, elegant, focused, responsive, accessible.
- Bahasa UI utama menggunakan Bahasa Indonesia.
- Satu layar memiliki satu tujuan utama.
- WhatsApp hanya jalur bantuan sekunder.
- Proses utama tetap berjalan melalui Portal.
- Data Demo tidak boleh menulis ke API, D1, atau sistem produksi.

## 3. Jalur Produksi

### Registrasi Lead
Route:

`/portal/register/`

Setelah registrasi berhasil:
- kode Lead ditampilkan;
- kode dapat disalin atau disimpan;
- tombol `Masuk Portal` menjadi tindakan utama;
- WhatsApp tersedia sebagai bantuan sekunder;
- `Coba Alur Demo Lengkap` tersedia sebagai pilihan eksplorasi.

### Lead Portal
Route:

`/portal/lead/`

Tahapan UX:

1. Registrasi diterima
2. Konsultasi berlangsung
3. Kebutuhan terverifikasi
4. Penawaran resmi
5. Aktivasi Client

Status internal tetap menggunakan:
- `new`
- `contacted`
- `qualified`
- `lost`
- `converted`

### Official Estimate

Official Estimate:
- dibuat Admin untuk Lead `qualified`;
- Draft tidak terlihat oleh Lead;
- Estimate `sent` dapat dilihat Lead;
- Lead dapat menyetujui atau menolak;
- konversi Client membutuhkan Estimate yang sudah disetujui;
- Estimate Lead belum dapat menjadi Invoice sebelum Client aktif.

### Client Portal
Route:

`/portal/`

Client Portal menyediakan:
- Dashboard;
- Projects;
- Documents;
- Estimates;
- Invoices;
- Support;
- Notification;
- Profile / Security.

## 4. Demo Journey R1

Demo publik berjalan tanpa API/D1 dan menggunakan data simulasi.

Urutan:

`Demo Registrasi -> Demo Login -> Demo Lead Portal -> Aktivasi Client Demo -> Demo Client Dashboard`

Routes:

- `/portal/demo/register/`
- `/portal/demo/login/`
- `/portal/demo/lead/`
- `/portal/demo/`

Shared journey state:

`sb_demo_journey_r1`

Demo tidak boleh:
- memanggil endpoint produksi;
- membuat Lead nyata;
- membuat Client nyata;
- menulis ke D1;
- menyimpan credential pribadi.

## 5. Status LOCKED / PASS

Status yang sudah dibuktikan source/runtime:

- Lead UI Indonesia R1
- Lead Self-Service UX R1
- PATCH B2 Follow-up Semantics
- Official Estimate backend/source lifecycle
- Lead Estimate Decision Focus Mode
- Lead Approved Waiting State R1
- Lead Portal WhatsApp Help - Tahap 4
- Client Portal Interactive Demo R1
- Demo Registration Success R1
- Demo Login Automatic Access R2
- Demo Lead Stage 5 Activation R1
- Client Demo Real Project CTA R1
- Client Demo Mobile Navigation R1
- Real Client Mobile Navigation R1
- Full Demo Journey Identity R1
- Full Demo Journey Mobile R1
- Full Demo Journey R1
- Demo Journey Open Graph Preview R1
- Real Registration -> Full Demo Handoff R1

## 6. Demo -> Project Nyata

Client Demo memiliki CTA:

`Mulai Project Nyata`

Tujuan:

`https://srilexbuditra.work/#harga`

Demo tetap berada di tab asal sehingga state simulasi tidak hilang.

## 7. Homepage Integration R1

Rencana berikutnya adalah menambahkan section homepage:

`Coba Pengalaman Client`

Posisi yang disepakati:

`Why Choose Me -> Coba Pengalaman Client -> Packages & Pricing`

Konsep:
- 4 tahap berangkaian;
- satu CTA utama `Mulai Demo dari Awal`;
- desktop horizontal;
- mobile vertical timeline;
- badge `MODE DEMO`;
- informasi bahwa data merupakan simulasi.

Status:

`PLANNED - belum dianggap LOCKED/PASS sebelum source + staging runtime selesai.`

## 8. Keamanan & Privasi

- Tidak menyimpan password, token, secret, cookie, atau credential pada dokumentasi.
- Demo tidak menggunakan data pribadi pengguna.
- Data Lead/Client produksi tetap menggunakan backend terautentikasi.
- Tidak melakukan mutasi produksi untuk smoke test tanpa kebutuhan dan persetujuan eksplisit.

## 9. Workflow Pengembangan

`AUDIT -> PATCH MINIMAL -> VERIFY SOURCE -> COMMIT -> PUSH -> STAGING RUNTIME TEST -> LOCKED/PASS`

Jangan mengulang modul yang sudah `LOCKED/PASS` kecuali perubahan baru menyentuh modul tersebut atau ditemukan regression.

## 10. Current Checkpoint

Branch:

`feature/client-management-r1`

Latest verified functional source checkpoint sebelum documentation sync:

`4c79db1 feat: link real registration success to full demo journey`

Production tetap:

`HOLD`

sampai:
- Homepage Demo Integration selesai;
- dokumentasi final tersinkron;
- Final Closeout R1 selesai;
- release production disetujui.