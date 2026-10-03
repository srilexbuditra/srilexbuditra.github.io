# CLIENT PORTAL — STAGING RC HANDOFF

**Project:** srilexbuditra.work  
**Tanggal checkpoint:** 2026-10-04  
**Branch development:** `feature/client-management-r1`  
**Release Candidate staging:** `9320844806fb04f6b22055f8a8d97e119d8a0d67`  
**Production main saat checkpoint:** `796c7aa9795f0d0f4ea2c20159916f9c0e31e301`

---

## 1. STATUS UTAMA

### STAGING FINAL END-TO-END = LOCKED/PASS

Seluruh alur staging telah diuji langsung dan dinyatakan berhasil.

Alur final yang sudah PASS:

`Demo Registrasi → Demo Lead → Konsultasi → Penawaran → Setujui Penawaran Demo → Demo Client → Dashboard Client → Projects → Documents → Estimates → Invoices → Support → ← Dashboard → Notifikasi → Buka tiket → × → Dashboard`

Visual dan fungsi yang sudah PASS di staging harus dipertahankan.

**Jangan mengubah kembali modul yang sudah PASS kecuali ditemukan bug yang benar-benar dapat direproduksi.**

---

## 2. ATURAN RELEASE YANG DIKUNCI

Workflow release resmi:

`Development / feature → Staging → Full Regression Test → PASS → Production`

Aturan penting:

1. Staging yang sudah PASS menjadi Release Candidate.
2. Production harus menerima paket yang sama dengan Release Candidate staging.
3. Jangan membuat versi atau patch production yang berbeda secara terpisah.
4. Jangan memperbaiki production satu per satu untuk mengejar staging.
5. Setelah promotion, production diuji menggunakan alur end-to-end yang sama.
6. Jika ditemukan bug sesudah promotion, kembali ke workflow:
   `feature → staging → test → production`.
7. Visual yang sudah disetujui harus dipertahankan.
8. Patch harus minimal dan hanya pada bagian yang terbukti bermasalah.

---

## 3. KONDISI PRODUCTION SAAT CHECKPOINT

### PRODUCTION BELUM SAMA DENGAN STAGING

Production saat ini masih berada pada:

`796c7aa9795f0d0f4ea2c20159916f9c0e31e301`

Sedangkan Release Candidate staging berada pada:

`9320844806fb04f6b22055f8a8d97e119d8a0d67`

Pada checkpoint terakhir:

`origin/main...origin/feature/client-management-r1 = 0 7`

Artinya feature/staging memiliki rangkaian commit yang belum masuk ke production.

### PRODUCTION FINAL REGRESSION = BELUM PASS

Production masih belum sama dengan staging dan masih terdapat bug/perbedaan pada perjalanan:

`Demo Registrasi → Demo Lead → Konsultasi → Penawaran → Setujui Penawaran Demo → Demo Client → Dashboard Client → Projects → Documents → Estimates → Invoices → Support → ← Dashboard → Notifikasi → Buka tiket → × → Dashboard`

Jangan menilai production selesai sebelum Release Candidate staging dipromosikan dan seluruh alur tersebut diuji ulang langsung di production.

---

## 4. RELEASE COMMITS DI ATAS PRODUCTION MAIN

Urutan commit setelah production `796c7aa`:

### R2
`9b38b67`  
`fix: make portal view switching csp compatible`

Perubahan utama:
- Documents
- Estimates
- Invoices
- Support
- visibility switching menggunakan class CSP-compatible.

### R3
`4d9a7bb`  
`fix: externalize portal quick action styles for strict csp`

Perubahan utama:
- Profile / Security
- notification panel
- bell / topbar
- quick actions
- dynamic inline CSS dipindahkan ke stylesheet eksternal.

### R4
`b0d3848`  
`fix: return support view to dashboard correctly`

Perubahan:
- tombol `← Dashboard` pada Support diarahkan ke Dashboard yang benar.

### R5
`1f8bff6`  
`fix: unify portal view routing visibility`

Root cause:
- mekanisme visibility lama menggunakan inline `style.display`.
- mekanisme R2 menggunakan `.sb-portal-view-hidden`.
- kedua mekanisme bertabrakan dan menyebabkan area kosong setelah membuka tiket dari notifikasi lalu menutup modal.

Solusi:
- routing Portal disatukan menggunakan class `sb-portal-view-hidden` + atribut `hidden`.
- jalur Admin tidak diubah.

Runtime staging sudah diuji:

`Dashboard → Notifikasi → Buka tiket → × → Support`

hasil: PASS.

### R6
`d512f53`  
`fix: clarify unavailable client activity action`

Perubahan:
- tombol `Semua` pada Aktivitas terbaru Client Portal dibuat nonaktif karena Activity API R1 belum tersedia.
- pengguna tidak lagi mendapat kesan tombol rusak.
- pesan unavailable dipindahkan dari inline style ke CSS eksternal.

### Demo Reset Experiment
`d678078`  
`fix: align demo reset controls`

Perubahan visual tersebut tidak dipertahankan karena hasil sebelumnya dinilai lebih baik.

### Revert Demo Reset
`9320844`  
`Revert "fix: align demo reset controls"`

Hasil:
- file Demo kembali persis ke kondisi sebelum `d678078`.
- visual Demo Lead dan Demo Client staging kembali bagus.
- kondisi ini sudah diuji dan disetujui.

---

## 5. BAGIAN YANG SUDAH DIKUNCI DI STAGING

### Demo Lead
**LOCKED/PASS**

`https://staging.srilexbuditra.work/portal/demo/lead/`

Sudah diuji:
- visual laptop
- perjalanan konsultasi
- Penawaran Resmi
- Item Penawaran
- Setujui Penawaran Demo
- transisi perjalanan Demo Lead

Pertahankan kondisi sekarang.

### Demo Client
**LOCKED/PASS**

`https://staging.srilexbuditra.work/portal/demo/`

Sudah diuji termasuk:
- Dashboard
- Profile Demo
- Detail Project
- Aktivitas terbaru
- tombol Semua
- Keamanan
- notifikasi
- navigasi Demo Client

Pertahankan kondisi sekarang.

### Real Client Portal
**R2–R6 STAGING = LOCKED/PASS**

Sudah diuji:

`Dashboard → Projects → Documents → Estimates → Invoices → Support → ← Dashboard → Notifikasi → Buka tiket → × → Dashboard`

Semua berhasil tanpa area kosong atau regresi navigasi.

---

## 6. RELEASE CANDIDATE YANG HARUS DIPERTAHANKAN

RC yang telah diuji:

`9320844806fb04f6b22055f8a8d97e119d8a0d67`

Jangan membuat perubahan kosmetik baru pada RC sebelum Production Promotion.

Jika tidak ditemukan bug baru, release production harus berasal dari state RC ini.

---

## 7. TAHAPAN SELANJUTNYA YANG BELUM SELESAI

### Tahap A — Production Promotion
Status: **BELUM SELESAI**

Tujuan:

Menyinkronkan Release Candidate staging ke `main` sebagai satu promotion terkontrol.

Prinsip:

`STAGING PASS → PRODUCTION`

Bukan:

`production diperbaiki satu per satu`

Untuk promotion, hindari switch branch pada working directory utama jika berisiko directory locking.

Gunakan worktree terpisah untuk promotion production bila diperlukan.

---

### Tahap B — Production Delivery Verification
Status: **BELUM SELESAI**

Setelah promotion:

1. pastikan deploy production selesai;
2. pastikan asset/version terbaru terkirim;
3. pastikan tidak ada cache lama yang menutupi release;
4. verifikasi strict CSP tetap bekerja;
5. jangan melonggarkan CSP dengan `'unsafe-inline'`.

---

### Tahap C — Final Production End-to-End Regression
Status: **BELUM SELESAI**

Uji ulang di:

`https://srilexbuditra.work/`

Alur wajib:

`Demo Registrasi → Demo Lead → Konsultasi → Penawaran → Setujui Penawaran Demo → Demo Client → Dashboard Client → Projects → Documents → Estimates → Invoices → Support → ← Dashboard → Notifikasi → Buka tiket → × → Dashboard`

Production hanya boleh dinyatakan PASS jika alur tersebut sama dengan staging Release Candidate.

---

### Tahap D — Production Lock
Status: **BELUM SELESAI**

Jika seluruh pengujian production berhasil:

- R2 = PRODUCTION LOCKED/PASS
- R3 = PRODUCTION LOCKED/PASS
- R4 = PRODUCTION LOCKED/PASS
- R5 = PRODUCTION LOCKED/PASS
- R6 = PRODUCTION LOCKED/PASS
- Demo Lead = PRODUCTION LOCKED/PASS
- Demo Client = PRODUCTION LOCKED/PASS
- Final Client Journey = PRODUCTION LOCKED/PASS

Setelah itu visual/fungsi tidak diubah lagi kecuali ada reproducible bug.

---

### Tahap E — Final Documentation Sync
Status: **BELUM SELESAI**

Setelah Production LOCKED/PASS:

- update dokumentasi release yang relevan;
- update `CHANGELOG`;
- catat commit production final;
- catat hasil final regression;
- catat staging RC yang dipromosikan;
- pastikan roadmap/status docs tidak lagi menyebut production sebagai pending.

---

### Tahap F — Branch / Release Housekeeping
Status: **BELUM SELESAI**

Setelah production terverifikasi:

1. fetch origin;
2. verifikasi `main`;
3. verifikasi relationship `main` dan feature;
4. tetapkan baseline development berikutnya;
5. jangan memulai R berikutnya sebelum baseline release jelas.

---

## 8. FILE YANG TIDAK BOLEH IKUT RELEASE TANPA PERSETUJUAN

Pada working tree terdapat file untracked:

`images/og/home/Masuk barang media promosi hiant banner super tani indonesia.pdf`

File tersebut bukan bagian dari Client Portal RC.

Jangan otomatis:
- add,
- commit,
- delete,
- rename,
- atau memasukkannya ke Production Promotion.

---

## 9. ATURAN UNTUK OBROLAN BARU

Jika proyek dilanjutkan di obrolan baru:

1. Baca file ini sebagai handoff utama Client Portal Release Candidate.
2. Jangan mulai ulang audit modul yang sudah LOCKED/PASS.
3. Jangan mengubah Demo Lead, Demo Client, atau Client Portal staging yang sudah PASS kecuali ada bug nyata.
4. Jangan membuat patch khusus production untuk mengejar staging.
5. Prioritas berikutnya adalah **Production Promotion dari RC staging yang sama**.
6. Setelah promotion, lakukan **Production Final End-to-End Regression**.
7. Baru setelah production PASS, lakukan final documentation sync dan housekeeping.
8. Gunakan commit/state terbaru, verified, deployed, atau locked jika ada konflik dengan catatan lama.

---

## 10. NEXT ACTION SAAT MEMULAI OBROLAN BARU

Mulai dari:

**PRODUCTION PROMOTION PRE-FLIGHT**

Bukan dari development ulang.

Tujuan:

`RC staging 9320844 → main/production`

Kemudian:

`production deploy → production full regression → LOCKED/PASS → docs/changelog sync → housekeeping`

---

## 11. STATUS RINGKAS

**Staging RC:** LOCKED/PASS  
**Staging full journey:** LOCKED/PASS  
**Demo Lead staging:** LOCKED/PASS  
**Demo Client staging:** LOCKED/PASS  
**Client Portal R2–R6 staging:** LOCKED/PASS  

**Production:** BELUM SAMA DENGAN STAGING  
**Production full journey:** BELUM PASS  
**Production Promotion:** PENDING  
**Production Final Regression:** PENDING  
**Final Documentation Sync:** PENDING  
**Release Housekeeping:** PENDING

---

## RELEASE PRINCIPLE

> **Staging yang sudah PASS harus dipromosikan ke production sebagai paket yang sama.**
>
> **Jangan membuat versi production terpisah atau memperbaiki production satu per satu.**
