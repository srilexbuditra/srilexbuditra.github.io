# V3.9.0 Step 7.3 — Manasik Static Social Metadata Publish Sync

Status platform production tetap **V3.8.0** selama rollout V3.9.0 belum dikunci penuh.

## Changed

- Menyinkronkan social image statis pada seluruh 11 halaman materi Manasik dengan metadata media produksi aktif di D1/R2.
- Menambahkan fallback statis `og:image`, `og:image:secure_url`, `og:image:alt`, `twitter:image`, dan `twitter:image:alt` pada halaman yang sebelumnya belum memilikinya.
- Mengubah `twitter:card` menjadi `summary_large_image` pada halaman yang sebelumnya masih menggunakan `summary`.
- URL social image statis menggunakan URL R2 publik aktif masing-masing materi di `media-umroh.srilexbuditra.work`.
- Halaman Talbiyah sudah sinkron sebelum Step 7.3 dan dipertahankan tanpa perubahan tambahan.

## Source of truth

Snapshot produksi Step 7.3A/7.3B memverifikasi **11 dari 11** materi memiliki `banner_url`, `banner_object_key`, `og_image_url`, `twitter_image_url`, dan `image_alt` aktif.

## Preserved

- Tidak mengubah HTML body, layout, CSS, Design System, Visual Asset System, branding global, progress Jemaah, atau urutan 11 materi.
- Tidak mengubah Worker, D1 schema/data, R2 object aktif, autentikasi, Admin, Jemaah, sitemap, maupun Analytics.
- Metadata runtime dari D1 tetap berjalan seperti sebelumnya; HTML statis hanya menjadi fallback untuk crawler/social bot yang tidak menjalankan JavaScript.
- Platform production tetap V3.8.0.

## Publishing rule

Perubahan media/metadata berikutnya yang dilakukan melalui Admin dan D1 dapat langsung mengubah pengalaman browser saat runtime. Bila perubahan tersebut juga harus dibaca secara konsisten oleh crawler/social bot, metadata statis HTML perlu dipublikasikan kembali melalui deploy GitHub Pages.
