# Deploy — V3.9.0 Step 7.1 Portal Global SEO & Metadata Baseline

Tidak ada migration D1 dan tidak ada perubahan Worker pada Step 7.1.

## File yang berubah

- `program/umroh-semi-private-bengkulu/index.html`
- `program/umroh-semi-private-bengkulu/assets/js/portal-meta.js`
- changelog dan dokumen deploy Step 7.1

## Deploy

1. Timpa folder `program` dari patch ke root repository.
2. Commit dan push ke branch `main`.
3. Tunggu seluruh GitHub Actions dan Pages deployment hijau.
4. Buka Portal Umroh dengan hard refresh (`Ctrl + Shift + R`).

## Verifikasi visual

- Logo/favicons tetap memakai Branding Global yang sudah dikunci.
- Banner Portal tetap tampil dan layout tidak berubah.
- Admin/Jemaah links tetap bekerja.

## Verifikasi source HTML

Buka `view-source:https://srilexbuditra.work/program/umroh-semi-private-bengkulu/` dan pastikan ada:

- `robots=index,follow`
- canonical Portal Umroh
- `og:image` dan `twitter:image`
- `twitter:card=summary_large_image`
- WebPage JSON-LD
- WebSite JSON-LD
- Organization JSON-LD
- BreadcrumbList JSON-LD

## Verifikasi runtime D1

Di browser DevTools Network, endpoint berikut harus `200`:

`GET https://umroh-api.srilexbuditra.work/page-meta?page_key=portal%3Aumroh`

Jika D1 berisi banner/SEO terbaru, browser dapat meng-hydrate metadata runtime. HTML statis tetap menjadi fallback crawler-safe.

## Verifikasi GA4

Setelah izin analitik diberikan, uji klik internal dan scroll. Event khusus Portal yang diharapkan:

- `umroh_page_view`
- `umroh_cta_click`
- `umroh_navigation`
- `umroh_outbound_click` (hanya tautan eksternal)
- `umroh_scroll_depth`

Jangan menaikkan versi platform production dari V3.8.0 sampai rollout V3.9.0 selesai diuji secara menyeluruh.
