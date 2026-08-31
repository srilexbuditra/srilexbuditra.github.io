# Mobile Layout V6

Perbaikan responsivitas mobile untuk halaman utama.

## Perubahan
- Mengunci gerakan horizontal halaman pada perangkat sentuh.
- Menambahkan `overscroll-behavior-x: none` dan `touch-action: pan-y pinch-zoom` pada mobile.
- Memastikan `html`, `body`, `main`, section, container, grid, dan card tidak membentuk lebar melebihi viewport.
- Mengubah Services menjadi satu kartu per baris pada layar smartphone agar lebih nyaman dibaca.
- Memperbaiki spacing, radius, shadow, dan active state kartu.
- Menjaga pinch-to-zoom tetap tersedia.
- Mempertahankan struktur SEO, schema, navigasi, TTS, portfolio, estimator, dan konten yang sudah ada.

## Target
- Smartphone portrait: fokus pada satu kolom dan tanpa horizontal page drift.
- Tablet/desktop: layout grid tetap digunakan.
