# V3.9.0 Step 7.2 — Public Discoverability & Manasik Hub SEO Baseline

Status platform production tetap **V3.8.0** selama rollout V3.9.0 belum dikunci penuh.

## Changed

- Mengubah halaman publik `/manasik/` dari `noindex,nofollow,noarchive` menjadi `index,follow`.
- Menambahkan canonical, Open Graph, Twitter metadata, author, application metadata, dan referrer policy pada Manasik Hub.
- Menggunakan logo Branding Global yang sudah dikunci sebagai fallback social image Manasik Hub; tidak menambah atau mengubah visual halaman.
- Menambahkan structured data `CollectionPage`, `ItemList` 11 materi, `WebSite`, `Organization`, dan `BreadcrumbList`.
- Menambahkan Portal Umroh, Manasik Hub, dan seluruh 11 halaman materi Manasik ke `sitemap.xml` utama.

## Preserved

- Tidak mengubah HTML body/layout Manasik Hub.
- Tidak mengubah CSS, Design System V1, Visual Asset System V1, branding global, progress Jemaah, urutan 11 materi, autentikasi, Worker, D1, R2, maupun Analytics.
- Halaman Admin/Jemaah private tetap mengikuti aturan `noindex,nofollow,noarchive`.
- Platform production tetap V3.8.0.

## SEO note

Step 7.2 hanya membuka discoverability untuk halaman publik yang memang sudah menjadi bagian Manasik Digital. Metadata sosial Manasik Hub memakai logo global sebagai fallback aman sampai media khusus hub diterbitkan pada tahap berikutnya.
