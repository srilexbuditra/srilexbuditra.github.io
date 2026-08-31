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
| `portfolio/website-sekolah/v2/assets/school-preview.avif` | 1822.5 KB | 1588.5 KB | 234.0 KB | png-lossless |
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
  - `portfolio/website-sekolah/v2/assets/school-preview.avif`

## Rekomendasi lanjutan

- Gambar PNG berukuran besar yang berupa foto atau screenshot masih dapat diperkecil lebih jauh melalui migrasi terukur ke WebP/AVIF.
- Migrasi format perlu sekaligus memperbarui referensi HTML/CSS/metadata dan diuji secara visual.
- Optimasi saat ini sengaja menjaga kompatibilitas maksimal dengan struktur website yang ada.
