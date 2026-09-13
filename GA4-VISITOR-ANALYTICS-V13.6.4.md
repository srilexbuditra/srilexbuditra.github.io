# GA4 + Visitor Analytics V13.6.4

## Arsitektur final

Tracking website menggunakan **satu file pusat**:

`/assets/js/visitor-analytics.js`

Semua halaman HTML memanggil file yang sama melalui:

```html
<script src="/assets/js/visitor-analytics.js" defer></script>
```

Tidak ada lagi salinan `visitor-analytics.js` di setiap folder halaman.

## Tujuan

- Struktur repository lebih rapi.
- Perubahan analytics cukup dilakukan pada satu file.
- GA4 event tracking tetap berlaku di seluruh halaman publik.
- Visitor Analytics Cloudflare/D1 tetap berjalan dari satu source code.
- Folder/halaman dikenali otomatis melalui `location.pathname`.
- Query string dan hash tidak dikirim sebagai `page_location` global.
- Tidak mengirim NIK, KK, nomor WhatsApp, email, password, session token, atau nilai form ke GA4 dari tracker global.
- Halaman admin/sensitif yang sudah dikecualikan tetap tidak dikirim ke GA4 maupun Visitor Analytics.

## Event global yang dipertahankan

- page_view / page config GA4
- site_link_click
- internal_navigation
- outbound_click
- file_download
- WhatsApp / email / phone / anchor classification
- registration_start
- status_check_start
- login_start

Event khusus yang sudah dipanggil modul website tetap dapat menggunakan `window.gtag` setelah loader global aktif.

## Versi

Website baseline: **V13.6.4**  
Analytics architecture: **Centralized Site-Wide Visitor Analytics**
