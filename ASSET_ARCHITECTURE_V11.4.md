# V11.4 — Asset Architecture & Performance Cleanup

## Tujuan
Pembersihan dilakukan secara terkontrol: aset hanya dihapus setelah referensi teks dimigrasikan atau aset terbukti merupakan duplikasi byte-identik dengan sumber lokal yang dipertahankan.

## Perubahan utama

1. **Konsolidasi Website Sekolah**
   - Sumber utama yang dipertahankan: `portfolio/website-sekolah/assets/school-preview.avif`.
   - Referensi dari `portfolio-preview.*` dan folder `v2/assets/` dimigrasikan ke sumber utama.
   - Salinan byte-identik yang tidak lagi diperlukan dihapus.

2. **Migrasi PNG besar ke AVIF yang sudah tersedia**
   - Legacy PNG berikut dibersihkan setelah referensi dipastikan telah bermigrasi atau tidak ada referensi aktif: `images/logo.png`, `assets/design-reference.png`, `assets/portfolio-website-sekolah.png`, `assets/portfolio-sistem-administrasi.png`, `assets/portfolio-aplikasi-pos.png`, dan `portfolio/aplikasi-pos/assets/images/portfolio-reference.png`.
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
