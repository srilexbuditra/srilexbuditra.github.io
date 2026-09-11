# Program Ketahanan Pangan — Halaman Dokumentasi Khusus

## Folder upload
Upload folder **dokumentasi** ke:

`/program/ketahanan-pangan/dokumentasi/`

Sehingga URL final menjadi:

`https://srilexbuditra.work/program/ketahanan-pangan/dokumentasi/`

## Struktur
- `index.html` — halaman utama dokumentasi
- `assets/style.css` — styling responsive
- `assets/app.js` — menu mobile + tahun footer
- `assets/logo-program-ketahanan-pangan.png` — logo yang Anda kirim
- `assets/og-ketahanan-pangan.jpg` — Open Graph 1280×640
- `assets/favicon.png` — favicon halaman

## Setelah upload
1. Buka URL dokumentasi di browser dan pastikan tampil normal.
2. Buka langsung file OG: `https://srilexbuditra.work/program/ketahanan-pangan/dokumentasi/assets/og-ketahanan-pangan.jpg`
3. Bagikan **URL halaman dokumentasi**, bukan URL GitHub Wiki, agar platform sosial membaca metadata Open Graph dari domain Anda.
4. Jika WhatsApp masih menampilkan cache lama, coba bagikan URL sekali dengan query baru, contoh `?v=2`, kemudian gunakan URL normal setelah cache diperbarui.

## Metadata sudah terpasang
- canonical
- og:title
- og:description
- og:url
- og:image + width/height/type/alt
- twitter:card summary_large_image
- twitter:title/description/image
- theme-color
- JSON-LD WebPage

## Sitemap
Tambahkan URL ini ke `sitemap.xml`:

```xml
<url>
  <loc>https://srilexbuditra.work/program/ketahanan-pangan/dokumentasi/</loc>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```
