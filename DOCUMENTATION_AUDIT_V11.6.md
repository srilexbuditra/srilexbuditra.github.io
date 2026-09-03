# Documentation Audit — V11.6

Tanggal audit: 3 September 2026

## Ringkasan

Repository memiliki 35 file Markdown. Audit ini memisahkan dokumentasi aktif, referensi teknis, catatan historis, dokumentasi subproject, dan template operasional GitHub. Tidak ada file yang dihapus pada tahap ini agar histori pengembangan dan tautan internal tetap aman.

## A. Dokumentasi aktif — pertahankan

- `README.md`
- `CHANGELOG.md`
- `DOCUMENTATION.md`
- `SECURITY.md`
- `PRIVACY.md`
- `TERMS.md`
- `LICENSE.md`
- `NOTICE.md`
- `ACCESSIBILITY.md`
- `PRIVACY_CONSENT_FORM.md`
- `PUBLIC_REPOSITORY_AUDIT.md`
- `AUDIT_MENENGAH_V11.6.md`
- `verify/README.md`
- `verify/V30_VERIFICATION_SETUP.md`
- `VERIFY_DATABASE_README.md`

Dokumen di kelompok ini masih berfungsi sebagai pintu masuk, kebijakan, baseline audit, atau referensi sistem yang sedang digunakan.

## B. Referensi teknis versi sebelumnya — pertahankan sebagai referensi

- `ASSET_ARCHITECTURE_V11.4.md`
- `ASSET_OPTIMIZATION_AUDIT.md`
- `PERFORMANCE_V11.5.1.md`
- `PERFORMANCE_V11.5.2.md`
- `LEGAL_MOBILE_FIX.md`

Dokumen ini tidak menjadi sumber versi terbaru, tetapi masih berguna untuk menjelaskan keputusan teknis dan evolusi implementasi.

## C. Historical engineering notes — kandidat arsip

- `PRINT_PDF_FIX_V3.md`
- `MOBILE_LAYOUT_V5.md`
- `MOBILE_LAYOUT_V6.md`
- `CONTRACT_SIGNATURE_V7.md`
- `MOBILE_SIGNATURE_V8.md`
- `SIGNATURE_PRINT_V12.md`

Rekomendasi tahap berikutnya: pindahkan kelompok ini ke `docs/archive/` setelah seluruh referensi/link diverifikasi. Jangan menghapusnya.

## D. Portfolio subprojects — pertahankan di lokasi masing-masing

- `portfolio/aplikasi-pos/README.md`
- `portfolio/sistem-administrasi/README.md`
- `portfolio/website-sekolah/README.md`
- `portfolio/website-sekolah/README-V2-MAIN.md`
- `portfolio/website-sekolah/v2/README.md`
- `portfolio/website-sekolah/tjkt-smkn1kotabengkulu/README.md`

README tersebut merupakan dokumentasi lokal untuk masing-masing demo/subproject dan tidak perlu dipindahkan ke root.

## E. GitHub operational templates — pertahankan

- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`

File ini bukan dokumentasi produk; lokasinya sudah sesuai dengan konvensi GitHub.

## Keputusan audit

1. Tidak menghapus Markdown apa pun pada V11.6.
2. Menetapkan `README.md` sebagai halaman pengantar dan `DOCUMENTATION.md` sebagai indeks dokumentasi.
3. Menetapkan `CHANGELOG.md` sebagai sumber histori versi.
4. Menandai enam engineering notes lama sebagai kandidat `docs/archive/`.
5. Menjaga dokumentasi verification terpisah karena memiliki konfigurasi dan deployment sendiri.
6. Menjaga README portfolio dekat dengan source subproject masing-masing.

## Tahap berikutnya

Tahap 3 adalah **Archive Migration**. Sebelum pemindahan dilakukan, periksa semua referensi menuju enam kandidat arsip. Setelah aman, pindahkan file tersebut ke `docs/archive/`, perbarui link pada `DOCUMENTATION.md`, lalu catat perubahan organisasi dokumentasi pada `CHANGELOG.md`.

---

**Audit baseline:** V11.6  
**Status:** Selesai — siap untuk tahap Archive Migration
