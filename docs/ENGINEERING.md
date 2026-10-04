# Srilex Buditra Engineering

> Dokumentasi utama engineering srilexbuditra.work.
> Mencakup asset architecture, performance, responsive legal UI, dan privacy consent.

## Current Engineering Principles

- Perubahan aset harus terkontrol dan referensinya diverifikasi sebelum penghapusan.
- Optimasi tidak boleh mengubah visual/fungsi yang sudah stabil tanpa kebutuhan.
- Homepage menggunakan strategi loading yang meminimalkan blocking.
- Responsive layout dan accessibility tetap dipertahankan.
- Form estimasi menggunakan explicit privacy consent sebelum aksi WhatsApp/PDF.
- GitHub Actions dan runtime verification tetap menjadi bagian proses perubahan.

## Asset Architecture — Historical V11.4

# V11.4 — Asset Architecture & Performance Cleanup

## Tujuan
Pembersihan dilakukan secara terkontrol: aset hanya dihapus setelah referensi teks dimigrasikan atau aset terbukti merupakan duplikasi byte-identik dengan sumber lokal yang dipertahankan.

## Perubahan utama

1. **Konsolidasi Website Sekolah**
   - Sumber utama yang dipertahankan: `portfolio/website-sekolah/assets/school-preview.avif`.
   - Referensi dari `portfolio-preview.*` dan folder `v2/assets/` dimigrasikan ke sumber utama.
   - Salinan byte-identik yang tidak lagi diperlukan dihapus.

2. **Migrasi PNG besar ke AVIF yang sudah tersedia**
   - Legacy PNG berikut dibersihkan setelah referensi dipastikan telah bermigrasi atau tidak ada referensi aktif: `images/logo.avif`, `assets/design-reference.avif`, `assets/portfolio-website-sekolah.avif`, `assets/portfolio-sistem-administrasi.avif`, `assets/portfolio-aplikasi-pos.avif`, dan `portfolio/aplikasi-pos/assets/images/portfolio-reference.avif`.
   - Tidak ada konversi visual baru; V11.4 memanfaatkan AVIF yang sudah ada dan telah dipakai website.

3. **Ketergantungan pihak ketiga**
   - `picsum.photos` di `portfolio/sistem-administrasi/script.js` diganti dengan aset lokal sehingga galeri tidak lagi bergantung pada layanan gambar eksternal.

4. **SEO cleanup**
   - `search.html` menggunakan `noindex, follow`.
   - Canonical/meta description dilengkapi pada halaman portfolio publik yang relevan.
   - `term.html` menjadi redirect kompatibilitas minimal menuju `terms.html`.

## Prinsip keamanan perubahan

- Tidak mengubah struktur halaman utama secara visual.
- Tidak menghapus aset yang masih direferensikan oleh HTML/CSS/JS setelah migrasi.
- Pemeriksaan integritas lokal wajib dijalankan sebelum publikasi.

## Verifikasi pasca-upload

Pastikan workflow berikut hijau:

- Repository Quality Check
- Public Repository Audit
- Link and Sitemap Integrity Check
- Pages build and deployment


---

## Asset Optimization Audit — Historical V11.3

# Asset Optimization Audit — V11.3

Tanggal audit: 2026-08-31

## Ringkasan

- Aset raster/SVG diperiksa: **38**
- Nama file, path, dan dimensi aset dipertahankan agar referensi website tidak berubah.
- PNG dioptimalkan dengan kompresi lossless.
- JPEG dioptimalkan dengan progressive encoding dan kualitas 88.
- SVG dibersihkan dari komentar dan whitespace berlebih.

- Ukuran sebelum: **18,142,053 bytes**
- Ukuran sesudah: **15,966,948 bytes**
- Penghematan: **2,175,105 bytes (12.0%)**

## 15 aset terbesar setelah optimasi

| File | Sebelum | Sesudah | Hemat | Strategi |
|---|---:|---:|---:|---|
| `images/logo.avif` | 2174.7 KB | 2133.0 KB | 41.8 KB | png-lossless |
| `assets/design-reference.avif` | 1804.0 KB | 1594.9 KB | 209.2 KB | png-lossless |
| `portfolio/website-sekolah/assets/school-preview.avif` | 1822.5 KB | 1588.5 KB | 234.0 KB | png-lossless |
| `portfolio/website-sekolah/assets/school-preview.avif` | 1822.5 KB | 1588.5 KB | 234.0 KB | png-lossless |
| `portfolio/website-sekolah/assets/school-preview.avif` | 1822.5 KB | 1588.5 KB | 234.0 KB | png-lossless |
| `assets/portfolio-website-sekolah.avif` | 1651.4 KB | 1415.3 KB | 236.2 KB | png-lossless |
| `portfolio/aplikasi-pos/assets/images/portfolio-reference.avif` | 1593.4 KB | 1356.2 KB | 237.2 KB | png-lossless |
| `assets/portfolio-sistem-administrasi.avif` | 1292.2 KB | 1014.8 KB | 277.4 KB | png-lossless |
| `assets/portfolio-aplikasi-pos.avif` | 1288.2 KB | 991.8 KB | 296.4 KB | png-lossless |
| `portfolio/sistem-administrasi/assets/images/portfolio-preview.avif` | 344.8 KB | 291.7 KB | 53.1 KB | png-lossless |
| `images/collection/desain-template-web-3.jpeg` | 244.6 KB | 244.6 KB | 0.0 KB | unchanged |
| `images/privacy.avif` | 245.9 KB | 244.3 KB | 1.7 KB | png-lossless |
| `images/collection/desain-template-web-4.jpeg` | 236.6 KB | 236.6 KB | 0.0 KB | unchanged |
| `images/android-chrome-512x512.avif` | 262.7 KB | 227.5 KB | 35.2 KB | png-lossless |
| `images/collection/desain-template-web-2.jpeg` | 226.0 KB | 226.0 KB | 0.0 KB | unchanged |

## Duplikasi byte-identik yang terdeteksi

Aset berikut memiliki isi byte-identik dan menjadi kandidat perapian repository pada tahap terpisah:

-
  - `portfolio/website-sekolah/assets/school-preview.avif`
  - `portfolio/website-sekolah/assets/school-preview.avif`
  - `portfolio/website-sekolah/assets/school-preview.avif`

## Rekomendasi lanjutan

- Gambar PNG berukuran besar yang berupa foto atau screenshot masih dapat diperkecil lebih jauh melalui migrasi terukur ke WebP/AVIF.
- Migrasi format perlu sekaligus memperbarui referensi HTML/CSS/metadata dan diuji secara visual.
- Optimasi saat ini sengaja menjaga kompatibilitas maksimal dengan struktur website yang ada.


---

## Performance Strategy — Historical V11.5.1

# V11.5.1 — Critical Loading & Performance Strategy

## Target strategy
V11.5.1 defined the following controlled performance strategy:

- Target: main homepage scripts use `defer` to avoid blocking HTML parsing.
- Target: the hero/profile image receives explicit dimensions, `fetchpriority="high"`, and async decoding.
- Portfolio images below the initial viewport retain lazy loading.
- No visual layout, content, or feature is intended to be removed.

## Verification
Before publishing, verify GitHub Actions and test Mobile/Desktop PageSpeed Insights again.

## Implementation status
This document records the performance targets and strategy defined for V11.5.1. Full synchronization with the actual source implementation was completed and documented in `PERFORMANCE_V11.5.2.md`.


---

## Performance Implementation — Historical V11.5.2

# V11.5.2 — Performance Implementation Synchronization Fix

## Tujuan
Menyinkronkan implementasi aktual dengan strategi performa yang sebelumnya didokumentasikan pada V11.5.1.

## Perubahan yang diterapkan
- `script.js`, `search-enhancer.js`, dan `tts.js` pada homepage sekarang menggunakan `defer`.
- Gambar hero/profile memiliki dimensi eksplisit `1008 × 1008`, `fetchpriority="high"`, dan `decoding="async"`.
- Logo header dan footer memiliki dimensi eksplisit `1920 × 1916` serta `decoding="async"`.
- Lazy loading gambar portfolio yang sudah ada tetap dipertahankan.
- Tidak ada fitur, konten, atau desain visual yang sengaja dihapus.

## Catatan kompatibilitas
Perubahan `defer` diterapkan pada skrip eksternal yang berada di homepage. Atribut ini menjaga urutan eksekusi skrip eksternal dan menjalankannya setelah parsing HTML selesai.

## Verifikasi setelah upload
1. Pastikan GitHub Actions selesai tanpa error.
2. Pastikan deployment GitHub Pages berhasil.
3. Uji menu, pencarian, TTS, calculator, dan interaksi utama.
4. Jalankan ulang PageSpeed Insights untuk Mobile dan Desktop.


---

## Legal Mobile Responsive Fix

# Legal pages — mobile layout fix

Updated `legal.css` for `privacy.html`, `terms.html`, and `security.html`.

## What changed
- Fixed invalid CSS media-query blocks that prevented responsive rules from being parsed.
- Removed the desktop two-column overflow on mobile.
- Stacked the table of contents above the article at tablet/mobile widths.
- Made the mobile table of contents scrollable and touch-friendly.
- Improved typography, spacing, cards, borders, focus states, and visual hierarchy.
- Added safe wrapping rules to prevent long content from creating horizontal overflow.
- Preserved the existing content, navigation, footer, accessibility controls, and URLs.


---

## Privacy Consent — Estimate Form

# Keamanan & Persetujuan Privasi — Formulir Estimasi

## Tujuan
Menambahkan gerbang persetujuan privasi pada formulir estimasi agar aksi **Kirim ke WhatsApp** dan **Cetak / Simpan PDF** tidak dapat digunakan sebelum pengunjung memberikan persetujuan.

## Implementasi

### 1. Checkbox HTML
Checkbox ditempatkan di panel hasil estimasi, tepat sebelum tombol aksi:

- ID: `privacyConsentCheckbox`
- Label menjelaskan bahwa pengguna telah membaca dan menyetujui Kebijakan Privasi.
- Tautan diarahkan ke `/privacy.html`.
- Checkbox tidak dicentang secara default.

### 2. Status tombol
Kedua tombol berikut menggunakan atribut `disabled` sejak awal:

- `#waBtn`
- `#pdfBtn`

Atribut `aria-disabled="true"` juga digunakan agar status terkunci dapat dipahami oleh teknologi bantu.

### 3. Kontrol JavaScript
Fungsi `updatePrivacyConsentState()` memeriksa status checkbox:

- Belum dicentang → kedua tombol tetap `disabled`.
- Dicentang → kedua tombol diaktifkan.
- Checkbox diubah → status tombol diperbarui secara langsung.

### 4. Keamanan alur
Event klik untuk WhatsApp dan PDF tetap terpasang pada tombol yang sama. Karena tombol benar-benar menggunakan `disabled`, browser mencegah interaksi klik sebelum persetujuan diberikan.

## File yang diubah

- `index.html`
- `script.js`
- `style.css`
- `PRIVACY_CONSENT_FORM.md`

## Pengujian yang disarankan

1. Buka halaman utama.
2. Gulir ke bagian **Estimate / Hitung Estimasi**.
3. Pastikan checkbox belum dicentang saat pertama kali tampil.
4. Pastikan **Kirim ke WhatsApp** dan **Cetak / Simpan PDF** dalam keadaan terkunci.
5. Centang checkbox.
6. Pastikan kedua tombol langsung aktif.
7. Hapus centang kembali.
8. Pastikan kedua tombol langsung terkunci kembali.
9. Uji pada desktop dan mobile untuk memastikan layout checkbox tidak keluar batas.


## V2 Responsive Cross-Browser
- Checkbox uses a consistent custom control instead of browser-dependent native rendering.
- Touch target is 44px on mobile.
- The consent text wraps safely without horizontal overflow.
- WhatsApp/PDF actions use a one-column layout on small screens.
- JavaScript re-checks consent inside each action handler as a defensive fallback.


---

## Maintenance Rules

- Nama versi lama di bagian historical dipertahankan sebagai rekam jejak.
- Jangan menghapus aset hanya berdasarkan ukuran; cek referensi HTML/CSS/JS terlebih dahulu.
- Perubahan performance harus diverifikasi pada desktop dan mobile.
- Jangan menurunkan accessibility demi optimasi visual.
- Privacy consent harus tetap menjadi gate untuk aksi estimator yang relevan.
- Dokumen sumber lama tetap tersedia melalui Git history.
