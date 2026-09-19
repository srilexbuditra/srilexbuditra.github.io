# Global Branding — V3.9.0 Step 6.1

Step 6.1 menyelesaikan tampilan **Branding** pada `Admin → Pengaturan` tanpa mengubah Worker API, struktur D1, object key R2, atau versi platform aktif.

## Perubahan
- Menambahkan preview lengkap untuk Logo Utama, favicon ICO, favicon 32×32, favicon 16×16, Apple Touch Icon, Android 192×192, dan Android 512×512.
- Saat Super Admin memilih logo AVIF baru, seluruh favicon/ikon turunan dipreview **sebelum upload**.
- Setelah upload selesai, preview kembali membaca URL permanen branding yang tersimpan di D1/R2.
- Menampilkan waktu terakhir branding diperbarui dan tautan langsung ke `site.webmanifest`.
- Memperbaiki jarak judul topbar `Pengaturan · Branding · SEO · Media · Schema · Analytics`.

## Tidak berubah
- Platform tetap **V3.8.0** sampai rollout V3.9.0 selesai diuji.
- Worker tidak perlu dideploy ulang untuk Step 6.1.
- Tidak ada migration D1 baru.
- Object key tetap:
  - `branding/logo-umroh-semi-private-bengkulu.avif`
  - `branding/favicon.ico`
  - `branding/favicon-32x32.png`
  - `branding/favicon-16x16.png`
  - `branding/apple-touch-icon.png`
  - `branding/android-chrome-192x192.png`
  - `branding/android-chrome-512x512.png`

## File yang diupload ke GitHub
1. `program/umroh-semi-private-bengkulu/admin/pengaturan/index.html`
2. `program/umroh-semi-private-bengkulu/assets/js/admin-page-meta.js`
3. `program/umroh-semi-private-bengkulu/assets/css/admin-page-meta.css`
4. `program/umroh-semi-private-bengkulu/backend/docs/GLOBAL-BRANDING-V3.9.0-STEP-6.1-DEPLOY.md`

## Uji setelah GitHub Pages selesai deploy
1. Login Super Admin → **Pengaturan → Branding**.
2. Pastikan 7 preview branding tampil dari URL permanen saat halaman dibuka.
3. Pilih logo AVIF baru tanpa menekan upload. Pastikan preview Logo/Favicon/Apple/Android langsung berubah sebagai pratinjau lokal.
4. Klik **Terapkan Logo & Favicon**. Pastikan status upload selesai dan URL tetap sama.
5. Hard refresh halaman lalu pastikan preview kembali membaca aset production.
6. Buka **Webmanifest ↗** dan pastikan JSON manifest tetap valid.
