# Documentation Index — Srilex Buditra Portfolio

Dokumen ini adalah indeks dokumentasi repository `srilexbuditra.github.io`. Gunakan halaman ini untuk membedakan dokumentasi aktif, panduan teknis, audit, dan catatan historis implementasi.

## 1. Dokumentasi Utama

| Dokumen | Fungsi |
|---|---|
| [README.md](README.md) | Gambaran umum project, fitur, arsitektur, dan titik masuk dokumentasi. |
| [CHANGELOG.md](CHANGELOG.md) | Riwayat versi dan perubahan website/modul. |
| [DOCUMENTATION.md](DOCUMENTATION.md) | Indeks dokumentasi repository ini. |
| [DOCUMENTATION_AUDIT_V11.6.md](DOCUMENTATION_AUDIT_V11.6.md) | Hasil audit dan klasifikasi seluruh file Markdown pada baseline V11.6. |

## 2. Security, Privacy, Legal & Accessibility

| Dokumen | Fungsi |
|---|---|
| [SECURITY.md](SECURITY.md) | Kebijakan keamanan dan pelaporan kerentanan. |
| [PRIVACY.md](PRIVACY.md) | Kebijakan privasi website. |
| [PRIVACY_CONSENT_FORM.md](PRIVACY_CONSENT_FORM.md) | Catatan implementasi persetujuan privasi pada form/estimator. |
| [TERMS.md](TERMS.md) | Ketentuan penggunaan. |
| [LICENSE.md](LICENSE.md) | Ketentuan lisensi project. |
| [NOTICE.md](NOTICE.md) | Pemberitahuan hak, aset, dan komponen terkait. |
| [ACCESSIBILITY.md](ACCESSIBILITY.md) | Komitmen dan catatan aksesibilitas. |
| [LEGAL_MOBILE_FIX.md](LEGAL_MOBILE_FIX.md) | Catatan perbaikan tampilan halaman legal pada mobile. |

## 3. Verification & Secure Document

| Dokumen | Fungsi |
|---|---|
| [verify/README.md](verify/README.md) | Ringkasan modul Document Verification. |
| [verify/V30_VERIFICATION_SETUP.md](verify/V30_VERIFICATION_SETUP.md) | Panduan setup sistem verifikasi/publisher V30. |
| [VERIFY_DATABASE_README.md](VERIFY_DATABASE_README.md) | Catatan registry/database verifikasi dokumen. |

Implementasi terkait berada pada `verify/`, termasuk `data/documents.json`, `publisher.html`, `config.js`, serta `worker/worker.js` dan `worker/wrangler.toml` untuk mode Cloudflare Worker + KV.

## 4. Performance & Asset Architecture

| Dokumen | Status | Fungsi |
|---|---|---|
| [ASSET_ARCHITECTURE_V11.4.md](ASSET_ARCHITECTURE_V11.4.md) | Historical/Reference | Arsitektur aset pada V11.4. |
| [ASSET_OPTIMIZATION_AUDIT.md](ASSET_OPTIMIZATION_AUDIT.md) | Reference | Audit optimasi aset. |
| [PERFORMANCE_V11.5.1.md](PERFORMANCE_V11.5.1.md) | Historical | Catatan optimasi performa V11.5.1. |
| [PERFORMANCE_V11.5.2.md](PERFORMANCE_V11.5.2.md) | Historical | Catatan optimasi performa V11.5.2. |

## 5. Audit Repository

| Dokumen | Fungsi |
|---|---|
| [PUBLIC_REPOSITORY_AUDIT.md](PUBLIC_REPOSITORY_AUDIT.md) | Audit repository yang dipublikasikan. |
| [AUDIT_MENENGAH_V11.6.md](AUDIT_MENENGAH_V11.6.md) | Audit teknis tahap menengah untuk baseline V11.6. |

## 6. Historical Engineering Notes

Dokumen berikut dipertahankan sebagai histori pengembangan. Nama versi pada file menunjukkan tahap implementasi modul, bukan selalu versi website utama.

| Dokumen | Area |
|---|---|
| [MOBILE_LAYOUT_V5.md](docs/archive/MOBILE_LAYOUT_V5.md) | Layout mobile estimator. |
| [MOBILE_LAYOUT_V6.md](docs/archive/MOBILE_LAYOUT_V6.md) | Penyempurnaan layout mobile. |
| [CONTRACT_SIGNATURE_V7.md](docs/archive/CONTRACT_SIGNATURE_V7.md) | Implementasi tanda tangan kontrak/estimasi. |
| [MOBILE_SIGNATURE_V8.md](docs/archive/MOBILE_SIGNATURE_V8.md) | Perbaikan tanda tangan pada mobile. |
| [SIGNATURE_PRINT_V12.md](docs/archive/SIGNATURE_PRINT_V12.md) | Perbaikan tanda tangan pada hasil print. |
| [PRINT_PDF_FIX_V3.md](docs/archive/PRINT_PDF_FIX_V3.md) | Perbaikan Print/PDF. |

Dokumen historis tidak boleh dianggap sebagai sumber konfigurasi terbaru jika bertentangan dengan source code atau dokumentasi versi yang lebih baru.

## 7. Portfolio Subprojects

Beberapa project portfolio memiliki README sendiri karena merupakan studi kasus/subproject terpisah:

- [portfolio/aplikasi-pos/README.md](portfolio/aplikasi-pos/README.md)
- [portfolio/sistem-administrasi/README.md](portfolio/sistem-administrasi/README.md)
- [portfolio/website-sekolah/README.md](portfolio/website-sekolah/README.md)
- [portfolio/website-sekolah/README-V2-MAIN.md](portfolio/website-sekolah/README-V2-MAIN.md)
- [portfolio/website-sekolah/v2/README.md](portfolio/website-sekolah/v2/README.md)
- [portfolio/website-sekolah/tjkt-smkn1kotabengkulu/README.md](portfolio/website-sekolah/tjkt-smkn1kotabengkulu/README.md)

## 8. GitHub Contribution Templates

File berikut merupakan template operasional GitHub dan bukan dokumentasi produk:

- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`

## 9. Aturan Pemeliharaan Dokumentasi

Saat ada perubahan berikutnya:

1. Update `CHANGELOG.md` jika perubahan memengaruhi versi, fitur, keamanan, performa, UI/UX, atau arsitektur.
2. Update `README.md` jika perubahan memengaruhi gambaran umum fitur, teknologi, struktur project, atau cara menjalankan project.
3. Update dokumen teknis khusus hanya jika modul terkait berubah.
4. Tambahkan dokumen baru ke `DOCUMENTATION.md` agar indeks tetap lengkap.
5. Jangan menghapus engineering notes lama hanya karena sudah ada versi baru; pindahkan ke arsip hanya setelah dipastikan tidak lagi menjadi referensi aktif.
6. Jangan menyimpan token, API secret, password, private key, atau kredensial layanan pada file Markdown maupun source publik.

## 10. Status Audit & Rencana Berikutnya

Audit dokumentasi V11.6 telah selesai dan dirangkum pada [DOCUMENTATION_AUDIT_V11.6.md](DOCUMENTATION_AUDIT_V11.6.md). Enam engineering notes lama telah dipindahkan ke `docs/archive/` setelah verifikasi referensi internal.

**Archive Migration selesai.** Seluruh enam engineering notes historis telah dipindahkan tanpa menghapus histori. Tautan pada indeks ini sudah diperbarui ke lokasi baru. Untuk perubahan dokumentasi berikutnya, pertahankan dokumen aktif di lokasi fungsionalnya dan gunakan `docs/archive/` hanya untuk catatan implementasi historis yang tidak lagi menjadi sumber konfigurasi aktif.

---

**Documentation baseline:** V11.6  
**Last documentation organization:** 3 September 2026
