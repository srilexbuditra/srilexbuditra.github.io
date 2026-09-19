# CHANGELOG — Portal Public Metadata V3.9.0 Step 5B

## Added
- Static SEO Portal: robots, canonical, Open Graph, Twitter metadata.
- JSON-LD Portal: WebPage, WebSite, BreadcrumbList.
- Admin → Pengaturan → SEO & Media Publik.
- API page metadata publik dan Admin untuk `portal:umroh`.
- Upload media Portal ke binding `PUBLIC_MEDIA` / R2 publik Umroh.
- Optional banner runtime Portal dari D1; tidak membuat placeholder jika belum ada media.
- Privacy-safe module analytics events: `umroh_page_view`, `umroh_navigation`, `umroh_cta_click`, `umroh_scroll_depth`.

## Security
- Admin metadata Portal hanya dapat diedit role `super_admin` dan `admin`.
- Upload memvalidasi MIME, signature gambar, ukuran maksimum 5 MB, dan object prefix `portal/umroh/`.
- Area Admin tetap `noindex,nofollow,noarchive`.
- Tidak ada PII yang dikirim sebagai parameter event GA4.

## Important
D1 menyimpan konfigurasi Admin/runtime. Crawler GitHub Pages membaca metadata yang secara fisik berada di HTML terakhir yang dideploy. Upload gambar baru tidak otomatis mengubah `<head>` statis sampai dilakukan static publish/deploy berikutnya.
