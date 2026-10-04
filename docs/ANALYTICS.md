# Srilex Buditra Analytics

> Dokumentasi utama Analytics srilexbuditra.work.
> Menggabungkan Visitor Analytics V4, enhancement V5, dan arsitektur GA4/Visitor Analytics terpusat.

## Current Architecture

- Central tracker: `/assets/js/visitor-analytics.js`
- Backend: Cloudflare Workers
- Database: Cloudflare D1
- Dashboard: `/admin/stats.html`
- Statistik dilindungi dengan `STATS_API_KEY`.
- Data pribadi dan credential tidak boleh dikirim ke analytics.

## Analytics V4 — Active Foundation

# Srilex Buditra Website Analytics V4

Sistem analytics visitor untuk **srilexbuditra.work** menggunakan
**Cloudflare Workers + D1 + GitHub Pages**.

## Status

**Analytics V4 aktif dan telah diuji.**

Nilai statistik tidak disimpan sebagai angka tetap dalam dokumentasi karena akan berubah mengikuti kunjungan website. Status dan nilai terbaru harus dilihat langsung melalui dashboard admin Analytics V4.

## Fitur Analytics V4

Dashboard admin menyediakan:

-   Total Visitors
-   Total Visits
-   Visitors Today
-   Visits Today
-   Visitors 7 Days
-   Visits 7 Days
-   Visitors 30 Days
-   Visits 30 Days
-   Returning Visitors
-   Average Visits per Visitor
-   Visit Trend 7 hari
-   Visit Trend 30 hari
-   Device Statistics
-   Browser Statistics
-   Country Statistics
-   Visitor Type
-   Top Pages
-   Traffic Sources / Referrer
-   Recent Visits
-   Refresh statistik
-   Export CSV

## Arsitektur

Alur sistem:

``` text
Visitor
   ↓
srilexbuditra.work
   ↓
script.js
   ↓
Cloudflare Worker
   ↓
D1 Database
   ↓
/stats API
   ↓
admin/stats.html
```

## Cloudflare Worker

Service:

``` text
srilexbuditra-visitors-api
```

Endpoint utama:

``` text
/
```

Pencatatan visitor:

``` text
/visitor
```

Statistik admin:

``` text
/stats
```

Endpoint `/stats` dilindungi dengan secret:

``` text
STATS_API_KEY
```

API key **tidak boleh ditulis langsung ke JavaScript publik atau
repository GitHub**.

## Database D1

Analytics menggunakan tabel visitor yang sudah ada serta tabel event:

``` text
visit_events
```

Worker Analytics V4 membuat tabel dan index `visit_events` secara
otomatis jika belum tersedia.

Event baru menyimpan data analytics seperti:

-   visitor ID anonim
-   waktu kunjungan
-   halaman
-   referrer
-   negara
-   jenis perangkat
-   browser

## Visitor ID

Visitor dikenali menggunakan ID anonim dengan pola:

``` text
v_<UUID>
```

ID disimpan di `localStorage` browser dengan key:

``` text
sb_visitor_id
```

Tujuannya untuk membedakan visitor baru dan visitor yang kembali tanpa
memerlukan identitas pribadi.

## Event Tracking V4

Mulai Analytics V4, setiap kunjungan baru dicatat sebagai event.

Karena versi sebelum V4 belum menyimpan setiap kunjungan sebagai event
individual:

-   **Total Visits** tetap mempertahankan histori lama.
-   **Visit Trend**, **Visits Today**, **Visits 7 Days**, **Visits 30
    Days**, dan **Recent Visits** mulai akurat sejak Analytics V4
    diaktifkan.
-   Data historis lama tidak direkayasa atau dibuat ulang.

## Dashboard Admin

Dashboard tersedia pada:

``` text
https://srilexbuditra.work/admin/stats.html
```

Untuk membuka statistik:

1.  Buka dashboard admin.
2.  Masukkan `STATS_API_KEY`.
3.  Klik **Buka Statistik**.
4.  Gunakan **Refresh** untuk memperbarui data.
5.  Gunakan **Export CSV** jika ingin menyimpan laporan.

## Keamanan

Prinsip keamanan yang digunakan:

-   `/stats` membutuhkan header `Authorization`.
-   `STATS_API_KEY` disimpan sebagai Cloudflare Worker Secret.
-   API key tidak disimpan di source code publik.
-   CORS dibatasi untuk domain website.
-   Dashboard diberi `noindex, nofollow`.
-   Statistik visitor bersifat analytics anonim.

Contoh header akses:

``` text
Authorization: Bearer <STATS_API_KEY>
```

Jangan memasukkan nilai asli API key ke dokumentasi atau repository
publik.

## Privasi

Analytics V4 tidak dirancang untuk mengetahui identitas pribadi visitor
secara diam-diam.

Data yang digunakan adalah data analytics seperti:

-   negara secara kasar
-   perangkat
-   browser
-   halaman
-   referrer
-   waktu kunjungan
-   ID visitor anonim

Akun Google, Facebook, TikTok, LinkedIn, atau identitas sosial lainnya
tidak dapat dan tidak boleh diambil secara tersembunyi. Integrasi profil
sosial harus menggunakan login/OAuth dengan persetujuan pengguna.

## File Penting

``` text
/admin/stats.html
/admin/stats.css
/admin/stats.js
/script.js
```

Cloudflare:

``` text
worker.js
```

## Domain

Website utama:

``` text
https://srilexbuditra.work/
```

Dashboard:

``` text
https://srilexbuditra.work/admin/stats.html
```

## Versi

``` text
Website Development: V11.7
Analytics Version: V4
Status: Active
Backend: Cloudflare Workers
Database: Cloudflare D1
Frontend: GitHub Pages
Domain: srilexbuditra.work
```

------------------------------------------------------------------------

© 2026 Srilex Buditra --- Website Analytics


---

## Analytics V5 — Period Filtering Development

# Srilex Buditra Analytics V5

V5 menambahkan **Filter Periode** ke Analytics V4.

## Tambahan V5
- Preset Hari Ini, 7 Hari, 30 Hari, Semua
- Tanggal mulai/akhir kustom
- Top Pages, Traffic Sources, Visit Trend, dan Recent Visits mengikuti periode
- Export CSV memakai nama periode aktif
- Refresh tetap tersedia
- API Key tetap tidak disimpan di source publik

## Instalasi
1. Pasang `worker.js` V5 ke Cloudflare Worker dan klik **Deploy**.
2. Upload Website Analytics V5 ke GitHub.
3. Buka `/admin/stats.html`, lakukan hard refresh.
4. Masukkan `STATS_API_KEY`, lalu uji tombol filter.

> Data event historis tersedia sejak Analytics V4 mulai aktif. Periode sebelum itu tidak direkonstruksi.


---

## GA4 + Visitor Analytics — Centralized Architecture

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


---

## Maintenance

- Gunakan satu centralized analytics source.
- Jangan menyimpan secret di repository.
- Jangan mengirim data pribadi atau nilai form sensitif ke GA4.
- Status fitur mengikuti source dan runtime yang benar-benar aktif.
- Dokumen versi lama tetap tersedia melalui Git history.
