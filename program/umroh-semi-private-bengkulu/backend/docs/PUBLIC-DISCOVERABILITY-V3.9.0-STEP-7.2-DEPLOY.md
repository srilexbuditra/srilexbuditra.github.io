# Deploy — V3.9.0 Step 7.2 Public Discoverability & Manasik Hub SEO Baseline

Tidak ada migration D1, tidak ada perubahan Worker, dan tidak ada perubahan R2 pada Step 7.2.

## File yang berubah

- `sitemap.xml`
- `program/umroh-semi-private-bengkulu/manasik/index.html`
- changelog dan dokumen deploy Step 7.2

## Deploy

1. Timpa `sitemap.xml` pada root repository.
2. Timpa folder `program` dari patch ke root repository.
3. Commit dan push ke branch `main`.
4. Tunggu GitHub Actions dan Pages deployment hijau.
5. Hard refresh halaman Manasik Hub (`Ctrl + Shift + R`).

## Verifikasi visual

- Tampilan Manasik Hub harus tetap sama seperti sebelum Step 7.2.
- 11 kartu materi, progress, navigasi, logo/favicons, dan responsive layout tidak boleh berubah.

## Verifikasi source HTML

Buka `view-source:https://srilexbuditra.work/program/umroh-semi-private-bengkulu/manasik/` dan pastikan ada:

- `robots=index,follow`
- canonical Manasik Hub
- Open Graph + Twitter metadata
- social image fallback ke logo Branding Global
- `CollectionPage` JSON-LD
- `ItemList` berisi 11 materi
- `WebSite`, `Organization`, dan `BreadcrumbList` JSON-LD

## Verifikasi sitemap

Buka `https://srilexbuditra.work/sitemap.xml` dan pastikan terdapat 13 URL publik Umroh:

- 1 Portal Umroh
- 1 Manasik Hub
- 11 halaman materi Manasik

Area `/admin/` dan `/jamaah/` tidak dimasukkan ke sitemap.

Jangan menaikkan versi platform production dari V3.8.0 sampai rollout V3.9.0 selesai diuji dan dikunci.
