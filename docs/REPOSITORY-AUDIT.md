# Srilex Buditra Repository Audit

> Master repository/privacy audit documentation.
> Current checklist dipisahkan dari historical audit snapshots agar catatan lama tidak dibaca sebagai kondisi repository terkini.

## Current Audit Authority

- Repository publik tidak boleh memuat password, token, API secret, private key, credential, atau data pribadi sensitif.
- Data contoh harus menggunakan dummy/anonymized data.
- Metadata PDF, gambar, dan dokumen perlu diperiksa sebelum publikasi.
- Aset pihak ketiga harus memiliki izin atau lisensi yang sesuai.
- Git history perlu diperiksa jika secret pernah ter-commit.
- GitHub Actions tetap menjadi bagian dari quality/repository verification.
- Historical audit tidak boleh diubah agar tampak mencerminkan kondisi repository sekarang.

## Current Public Repository & Privacy Checklist

# Public Repository & Privacy Audit

## Tujuan
Dokumen ini menjadi checklist audit sebelum repository dan aset dipublikasikan.

## Status Audit V11
- Dokumentasi inti: tersedia
- File environment dan private-key umum: dilindungi oleh `.gitignore` dan quality check
- GitHub Actions quality check: tersedia
- PDF publik: menggunakan `dummy.pdf`; tinjau isi dan metadata sebelum mengganti dengan dokumen nyata
- Audio musik komersial: tidak ditemukan pada audit V11
- Kontak publik: email dan nomor WhatsApp memang ditampilkan sebagai informasi kontak website

## Checklist sebelum publikasi
1. Pastikan tidak ada API key, token, password, atau kredensial.
2. Pastikan tidak ada NIK, NISN, nomor rekening, alamat rumah, atau data pribadi sensitif.
3. Gunakan data dummy/anonymized untuk contoh sekolah, siswa, klien, dan dokumen.
4. Periksa metadata PDF, gambar, dan dokumen sebelum upload.
5. Pastikan gambar, musik, font, dan aset pihak ketiga memiliki izin/lisensi yang sesuai.
6. Periksa `git log` jika secret pernah ter-commit; `.gitignore` tidak menghapus riwayat lama.
7. Jalankan workflow GitHub Actions setelah setiap perubahan penting.

## Catatan metadata
Metadata dapat memuat nama pembuat, perangkat lunak, tanggal, atau informasi lain. Untuk file yang berasal dari pihak ketiga atau mengandung informasi sensitif, buat salinan publik yang sudah dibersihkan atau gunakan aset dummy.

## Pelaporan masalah
Ikuti `SECURITY.md` untuk pelaporan kerentanan keamanan.


---

## Historical Technical Audit — V11.6

> Snapshot historis. Path, jumlah file, dan hasil audit di bawah mengikuti kondisi repository pada saat V11.6.

# Audit Menengah V11.6

## Scope
- Menghapus asset Website Sekolah duplikat.
- Menghapus PNG preview V2 berukuran 1,78 MB.
- Memastikan referensi HTML menggunakan asset canonical utama.
- Memeriksa link `href`/`src` internal pada seluruh halaman HTML.

## Hasil
- `portfolio/website-sekolah/v2/assets/school-preview.png`: dihapus (1.866.217 bytes).
- `portfolio/website-sekolah/v2/assets/school-preview.avif`: dihapus sebagai duplikat byte-identik.
- Asset utama dipertahankan: `portfolio/website-sekolah/assets/school-preview.avif`.
- Pemeriksaan referensi internal HTML: tidak ditemukan target file lokal yang hilang.
- Referensi V2 ke preview diarahkan ke asset utama `/portfolio/website-sekolah/assets/school-preview.avif`.

## Catatan
PDF dokumentasi besar tidak dihapus karena bukan asset yang direferensikan sebagai gambar halaman dan tetap berguna sebagai dokumentasi proyek.


---

## Historical Documentation Audit — V11.6

> Snapshot historis. Jangan digunakan sebagai daftar file aktif repository saat ini.

# Documentation Audit — V11.6

Tanggal audit: 3 September 2026

## Ringkasan

Repository saat ini memiliki 36 file Markdown setelah penambahan dokumen audit ini dan penyelesaian Archive Migration. Audit memisahkan dokumentasi aktif, referensi teknis, catatan historis, dokumentasi subproject, dan template operasional GitHub. Enam engineering notes historis dipindahkan dari root ke `docs/archive/`; tidak ada histori dokumentasi yang dihapus.

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

## C. Historical engineering notes — diarsipkan

- `docs/archive/PRINT_PDF_FIX_V3.md`
- `docs/archive/MOBILE_LAYOUT_V5.md`
- `docs/archive/MOBILE_LAYOUT_V6.md`
- `docs/archive/CONTRACT_SIGNATURE_V7.md`
- `docs/archive/MOBILE_SIGNATURE_V8.md`
- `docs/archive/SIGNATURE_PRINT_V12.md`

Archive Migration telah dilakukan setelah pemeriksaan referensi repository. File dipindahkan, bukan dihapus.

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

1. Tidak menghapus histori Markdown pada V11.6; dokumen historis yang tidak lagi aktif dipindahkan ke `docs/archive/`.
2. Menetapkan `README.md` sebagai halaman pengantar dan `DOCUMENTATION.md` sebagai indeks dokumentasi.
3. Menetapkan `CHANGELOG.md` sebagai sumber histori versi.
4. Enam engineering notes lama telah dipindahkan ke `docs/archive/` setelah referensi internal diverifikasi.
5. Menjaga dokumentasi verification terpisah karena memiliki konfigurasi dan deployment sendiri.
6. Menjaga README portfolio dekat dengan source subproject masing-masing.

## Status Archive Migration

Tahap 3 **Archive Migration selesai**. Pemeriksaan repository menunjukkan referensi nama file kandidat hanya terdapat pada `DOCUMENTATION.md` dan dokumen audit ini. Keenam file telah dipindahkan ke `docs/archive/`, dan tautan aktif pada `DOCUMENTATION.md` telah diperbarui.

---

**Audit baseline:** V11.6
**Status:** Selesai — Archive Migration diterapkan


---

## Historical Documentation Audit — V11.8

> Snapshot historis. Status dan roadmap yang tercantum di bawah mengikuti kondisi 13 September 2026.

# Documentation Audit — V11.8

Tanggal audit: **13 September 2026**

## Ringkasan

Snapshot repository sebelum Documentation Sync V11.8 memiliki **40 file Markdown**. Setelah penambahan audit ini, repository memiliki **41 file Markdown**.

Audit V11.8 dilakukan untuk menyelaraskan dokumentasi dengan kondisi repository terbaru setelah:

- Program Ketahanan Pangan ditetapkan sebagai flagship implementation,
- case study `/portfolio/ketahanan-pangan/` tersedia,
- halaman `/profil/` untuk Trust & Authority tersedia,
- dan struktur Program Ketahanan Pangan berkembang melampaui halaman registrasi tunggal.

Documentation Sync ini **tidak mengubah source aplikasi** seperti HTML, CSS, JavaScript, API, Worker, autentikasi, dashboard, registrasi, verifikasi, sertifikat, maupun data peserta.

## A. File yang Diperbarui pada V11.8

- `README.md`
- `CHANGELOG.md`
- `DOCUMENTATION.md`
- `ROADMAP-SRILEXBUDITRA-2026-2027.md`
- `program/README.md`
- `program/ketahanan-pangan/README.md`
- `TRUST-AUTHORITY-V8.md`

## B. File Baru

- `DOCUMENTATION_AUDIT_V11.8.md`

## C. Dokumentasi Aktif Utama

- `README.md`
- `CHANGELOG.md`
- `DOCUMENTATION.md`
- `DOCUMENTATION_AUDIT_V11.8.md`
- `ROADMAP-SRILEXBUDITRA-2026-2027.md`
- `TRUST-AUTHORITY-V8.md`
- `ANALYTICS-V4.md`
- `SECURITY.md`
- `PRIVACY.md`
- `TERMS.md`
- `LICENSE.md`
- `NOTICE.md`
- `ACCESSIBILITY.md`
- `program/README.md`
- `program/ketahanan-pangan/README.md`
- `verify/README.md`
- `VERIFY_DATABASE_README.md`

## D. Audit Lama Dipertahankan

Dokumen berikut tidak diubah karena berfungsi sebagai snapshot historis:

- `DOCUMENTATION_AUDIT_V11.6.md`
- `AUDIT_MENENGAH_V11.6.md`
- `ASSET_ARCHITECTURE_V11.4.md`
- `PERFORMANCE_V11.5.1.md`
- `PERFORMANCE_V11.5.2.md`

Audit versi lama tidak boleh diedit agar tampak menggambarkan kondisi repository terbaru.

## E. Temuan `docs/archive/`

`DOCUMENTATION_AUDIT_V11.6.md` menyatakan enam engineering notes pernah dipindahkan ke `docs/archive/`:

- `MOBILE_LAYOUT_V5.md`
- `MOBILE_LAYOUT_V6.md`
- `CONTRACT_SIGNATURE_V7.md`
- `MOBILE_SIGNATURE_V8.md`
- `SIGNATURE_PRINT_V12.md`
- `PRINT_PDF_FIX_V3.md`

Namun pada snapshot repository terbaru yang digunakan untuk audit V11.8, folder `docs/archive/` dan keenam file tersebut **tidak ditemukan**.

Keputusan V11.8:

1. Jangan mengubah audit V11.6; biarkan sebagai catatan kondisi saat itu.
2. Hapus tautan aktif yang rusak dari `DOCUMENTATION.md`.
3. Jangan membuat ulang isi file historis tanpa sumber aslinya.
4. Bila file asli ditemukan kembali, file dapat dipulihkan ke lokasi arsip dan indeks dapat diperbarui pada versi dokumentasi berikutnya.

## F. Struktur Baru yang Harus Tercermin dalam Dokumentasi

### Profil & Trust Authority

- `/profil/index.html`
- `/profil/profile.css`

### Flagship Case Study

- `/portfolio/ketahanan-pangan/index.html`
- `/portfolio/ketahanan-pangan/case-study.css`
- `/portfolio/ketahanan-pangan/assets/`

### Program Ketahanan Pangan

- `/program/ketahanan-pangan/index.html`
- `/program/ketahanan-pangan/registrasi/`
- `/program/ketahanan-pangan/verifikasi/`
- `/program/ketahanan-pangan/verifikasi/sertifikat/`
- `/program/ketahanan-pangan/peserta/`
- `/program/ketahanan-pangan/dokumentasi/`
- `/program/ketahanan-pangan/admin/`
- `/program/ketahanan-pangan/peserta-worker/`

## G. Roadmap yang Disinkronkan

Urutan roadmap aktif setelah sinkronisasi:

1. Flagship & Proof of Work — foundation complete.
2. Trust & Authority — current phase.
3. Knowledge Center / Insights — next milestone.
4. Pengalaman Anggota — Dashboard V2, Kartu Anggota QR, Level/Poin, Misi, Referral, Benefit, Event.
5. Public Impact & Ecosystem.
6. Productization / reusable platform.

## H. Keamanan Dokumentasi

Dokumentasi publik tidak boleh berisi:

- API secret,
- bearer/admin token,
- password,
- private key,
- kredensial database,
- NIK/nomor KK/KTP/KK peserta,
- atau data pribadi lain yang tidak diperlukan untuk dokumentasi publik.

## Keputusan Audit

Documentation Sync V11.8 ditetapkan sebagai baseline dokumentasi aktif untuk pengembangan berikutnya. V11.6 tetap disimpan sebagai historical audit, sementara dokumentasi baru mengikuti struktur repository yang benar-benar ada pada snapshot terbaru.

---

**Audit baseline:** V11.8
**Status:** Documentation Sync complete
**Next documentation milestone:** Knowledge Center / Insights


---

## Maintenance Rules

- Current audit checklist berada pada bagian awal dokumen ini.
- Snapshot V11.6/V11.8 dipertahankan apa adanya sebagai historical record.
- Jangan membuat ulang file historis yang hilang tanpa sumber aslinya.
- Perubahan lokasi master audit harus disinkronkan dengan GitHub Actions.
- SECURITY.md tetap menjadi jalur pelaporan masalah keamanan.
- Histori lengkap tetap tersedia melalui Git history.
