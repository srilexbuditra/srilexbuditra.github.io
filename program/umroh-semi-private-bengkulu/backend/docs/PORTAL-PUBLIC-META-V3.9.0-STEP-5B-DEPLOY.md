# Portal Public Metadata V3.9.0 Step 5B — Deploy

1. Tidak ada migration D1 baru. Pastikan record `portal:umroh` sudah tersedia di `umroh_page_meta`.
2. Copy patch frontend ke repository dan push GitHub Pages.
3. Deploy `backend/worker/worker.js` ke `umroh-auth-api`.
4. Jangan mengubah binding `DB`, `DOCUMENTS_BUCKET`, `PUBLIC_MEDIA`, `AUTH_PEPPER`, atau environment lainnya.
5. Uji `/health` tetap melaporkan versi platform backend yang sedang dikunci (V3.8.0 sampai rollout V3.9.0 selesai).
6. Buka Admin → Pengaturan → Portal Umroh. Verifikasi tab Media, SEO, Schema, Analytics.
7. Buka Portal publik dan View Source. Verifikasi `index,follow`, canonical, OG, Twitter, WebPage, WebSite, BreadcrumbList.
8. Jika banner Portal diupload, klik Simpan Pengaturan. Banner akan muncul runtime; OG/Twitter image crawler baru berubah setelah HTML statis diperbarui dan dideploy.
