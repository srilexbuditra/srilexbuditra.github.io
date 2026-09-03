# Srilex Buditra Website Analytics V4

Sistem analytics visitor untuk **srilexbuditra.work** menggunakan
**Cloudflare Workers + D1 + GitHub Pages**.

## Status

**Analytics V4 aktif dan berhasil diuji.**

Pengujian terakhir menunjukkan:

-   Total Visitors: **11**
-   Total Visits: **20**
-   Visitors Today: **11**
-   Visits Today: **1**
-   Visitors 7 Days: **11**
-   Visits 7 Days: **1**
-   Visitors 30 Days: **11**
-   Visits 30 Days: **1**
-   Returning Visitors: **1**
-   Average Visits / Visitor: **1.82**

> Angka akan berubah otomatis sesuai kunjungan website berikutnya.

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
Analytics Version: V4
Status: Active
Backend: Cloudflare Workers
Database: Cloudflare D1
Frontend: GitHub Pages
Domain: srilexbuditra.work
```

------------------------------------------------------------------------

© 2026 Srilex Buditra --- Website Analytics
