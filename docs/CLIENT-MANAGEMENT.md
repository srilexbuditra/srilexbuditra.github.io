# Srilex Buditra Client Management Platform

> **Status:** Production baseline aktif dan terverifikasi
> **Platform:** srilexbuditra.work
> **Dokumen ini:** sumber dokumentasi utama Client Management Platform.

## 1. Current Status

Client Management Platform R1 telah melewati development, staging, release candidate, production promotion, dan repository maintenance.

Baseline production saat ini mengikuti `main`.

Release Candidate staging yang menjadi dasar promotion:

`9320844806fb04f6b22055f8a8d97e119d8a0d67`

Current production/repository baseline:

`f5ad87fe593716a5a48c6c341dfa3c3aa547dc87`

Safety tag:

`production-stable-2026-10-04`

Dokumentasi lama R1, Auth/D1 foundation, dan Staging RC Handoff telah dikonsolidasikan ke dokumen ini.

---

## 2. Tujuan Platform

Client Management Platform adalah alur digital srilexbuditra.work untuk mengelola perjalanan calon pelanggan dari awal sampai menjadi Client aktif.

Alur utama:

`Visitor -> Registrasi Lead -> Lead Portal -> Konsultasi -> Kebutuhan Terverifikasi -> Official Estimate -> Persetujuan -> Aktivasi Client -> Client Portal -> Project`

Tidak ada registrasi Client publik secara langsung.

---

## 3. Prinsip UX

- Visual mengikuti identitas srilexbuditra.work.
- Clean, elegant, focused, responsive, dan accessible.
- Bahasa UI utama menggunakan Bahasa Indonesia.
- Satu layar memiliki satu tujuan utama.
- WhatsApp menjadi jalur bantuan sekunder.
- Proses utama tetap berjalan melalui Portal.
- Data Demo tidak boleh menulis ke API, D1, atau sistem produksi.
- Visual dan fungsi yang sudah terverifikasi tidak diubah tanpa bug yang dapat direproduksi.

---

## 4. Production Routes

### Registrasi Lead

`/portal/register/`

Setelah registrasi berhasil:

- kode Lead ditampilkan;
- kode dapat disalin atau disimpan;
- `Masuk Portal` menjadi tindakan utama;
- WhatsApp tersedia sebagai bantuan sekunder;
- Demo Journey tersedia sebagai pilihan eksplorasi.

### Lead Portal

`/portal/lead/`

Tahapan perjalanan:

1. Registrasi diterima
2. Konsultasi berlangsung
3. Kebutuhan terverifikasi
4. Penawaran resmi
5. Aktivasi Client

Status internal:

- `new`
- `contacted`
- `qualified`
- `lost`
- `converted`

### Client Portal

`/portal/`

Modul utama:

- Dashboard
- Projects
- Documents
- Estimates
- Invoices
- Support
- Notification
- Profile / Security

---

## 5. Official Estimate

- Dibuat Admin untuk Lead `qualified`.
- Draft tidak terlihat oleh Lead.
- Estimate `sent` dapat dilihat Lead.
- Lead dapat menyetujui atau menolak.
- Konversi Client membutuhkan Estimate yang sudah disetujui.
- Estimate Lead belum dapat menjadi Invoice sebelum Client aktif.

---

## 6. Demo Journey

Demo publik menggunakan data simulasi dan tidak boleh menulis ke sistem produksi.

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

CTA `Mulai Project Nyata` mengarahkan pengguna ke:

`https://srilexbuditra.work/#harga`

---

## 7. Authentication & D1 Architecture

Client Management menggunakan database D1 tersendiri dan tidak menggunakan database Program Ketahanan Pangan atau database produksi lain.

Baseline database:

`srilexbuditra-client-management-r1`

Migration foundation:

`database/migrations/001_client_management_core.sql`

Worker foundation:

`workers/client-management-api/`

Konfigurasi utama Worker:

- `DB` -> D1 binding
- `ALLOWED_ORIGINS` -> allowed portal/admin origins
- `SESSION_HOURS` -> session duration
- `BOOTSTRAP_ENABLED` -> disabled secara default
- `BOOTSTRAP_SECRET` -> Worker secret dan tidak pernah disimpan di Git

Bootstrap hanya digunakan untuk membuat `system_admin` pertama dan harus dinonaktifkan setelah proses awal selesai.

---

## 8. Security & Privacy

- Password, token, secret, cookie, dan credential tidak disimpan di dokumentasi.
- Demo tidak menggunakan data pribadi pengguna.
- Data Lead/Client produksi menggunakan backend terautentikasi.
- Bootstrap secret tidak boleh disimpan di GitHub.
- Production smoke test tidak melakukan mutasi tanpa kebutuhan dan persetujuan.
- Strict CSP dipertahankan.
- Jangan menggunakan `'unsafe-inline'` sebagai solusi cepat untuk masalah CSP.

---

## 9. Release Workflow

Workflow resmi:

`Development / Feature -> Staging -> Full Regression Test -> PASS -> Production`

Prinsip release:

1. Staging yang PASS menjadi Release Candidate.
2. Production menerima paket yang sama dengan Release Candidate.
3. Jangan membuat versi production terpisah.
4. Jangan memperbaiki production satu per satu untuk mengejar staging.
5. Setelah promotion, production diuji menggunakan perjalanan end-to-end yang sama.
6. Bug baru kembali melalui development/staging/test/production.
7. Patch harus minimal dan terukur.
8. Visual yang sudah disetujui dipertahankan.

---

## 10. R1 Release History

Release Candidate utama:

`9320844806fb04f6b22055f8a8d97e119d8a0d67`

Perbaikan penting sebelum RC meliputi:

- R2 — CSP-compatible portal view switching.
- R3 — externalized quick-action styles untuk strict CSP.
- R4 — Support kembali ke Dashboard dengan benar.
- R5 — unified portal view routing visibility.
- R6 — unavailable Client activity action diperjelas.
- Demo reset experiment dibatalkan dan direvert agar visual Demo kembali ke kondisi yang telah disetujui.

Rangkaian staging final telah diverifikasi untuk:

`Demo Registrasi -> Demo Lead -> Konsultasi -> Penawaran -> Setujui Penawaran Demo -> Demo Client -> Dashboard Client -> Projects -> Documents -> Estimates -> Invoices -> Support -> Dashboard -> Notifikasi -> Buka tiket -> Dashboard`

---

## 11. Production Baseline

Repository resmi menggunakan:

- Branch utama: `main`
- Production baseline: `f5ad87fe593716a5a48c6c341dfa3c3aa547dc87`
- Safety tag: `production-stable-2026-10-04`

Branch release sementara R1 telah dipensiunkan setelah sinkronisasi dan maintenance repository.

`main` menjadi single source of truth untuk baseline produksi.

---

## 12. Maintenance Rules

- Jangan mengulang modul yang sudah PASS kecuali ada regression nyata.
- Jangan mengembangkan langsung berdasarkan dokumen checkpoint lama.
- Gunakan kondisi terbaru yang verified, deployed, atau locked.
- Sebelum perubahan baru, sinkronkan workspace dari `main`.
- Feature branch baru dibuat dari `main` terbaru jika workflow berikutnya memang memerlukannya.
- Dokumentasi checkpoint sementara dikonsolidasikan ke master docs setelah release selesai.

---

## 13. Historical Documentation

Dokumen berikut pernah menjadi baseline selama pengembangan R1:

- `CLIENT-MANAGEMENT-R1.md`
- `CLIENT-MANAGEMENT-R1-AUTH-D1.md`
- `CLIENT-PORTAL-STAGING-RC-HANDOFF.md`

Informasi yang masih relevan telah diserap ke dokumen ini. Versi aslinya tetap tersedia melalui Git history.
