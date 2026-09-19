# V3.9.0 Step 7.1 — Portal Global SEO & Metadata Baseline

Status platform production tetap **V3.8.0** selama rollout V3.9.0 belum dikunci.

## Changed

- Portal Umroh menjadi baseline rollout global SEO/Media/Schema/Analytics.
- Menambahkan social image statis untuk Open Graph dan Twitter (`summary_large_image`) memakai banner Portal aktif.
- Menambahkan `og:image:secure_url`, `og:image:type`, `og:image:alt`, `twitter:image`, dan `twitter:image:alt`.
- Menambahkan structured data Organization dan memperkaya WebPage dengan `primaryImageOfPage`, `image`, publisher, dan author.
- Banner Portal sekarang memiliki fallback statis sehingga tetap tampil bila API metadata tidak tersedia.
- Metadata D1 tetap dapat meng-hydrate title, description, canonical, robots, theme color, OG/Twitter, banner, dan JSON-LD saat browser menjalankan JavaScript.
- Event khusus Portal distandarkan ke `umroh_page_view`, `umroh_cta_click`, `umroh_navigation`, `umroh_outbound_click`, dan `umroh_scroll_depth`.

## SEO publishing rule

GitHub Pages tetap menyajikan HTML statis. Perubahan metadata di D1 dapat memperbarui browser saat runtime, tetapi perubahan yang harus dibaca crawler/social bot secara konsisten tetap harus dipublikasikan ke HTML statis melalui deploy GitHub Pages.

## Privacy

Event khusus Portal hanya berjalan bila metadata D1 mengaktifkan Analytics dan `window.gtag` tersedia setelah pengunjung memberikan izin analitik. Tidak ada NIK, nomor paspor, nomor telepon, email, nama jemaah, password, token, atau data dokumen yang dikirim sebagai parameter event.
