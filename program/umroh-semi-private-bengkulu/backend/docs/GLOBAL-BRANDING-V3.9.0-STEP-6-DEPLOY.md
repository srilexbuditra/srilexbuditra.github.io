# Deploy Global Branding — V3.9.0 Step 6

## 1. D1
Migration `009_global_branding.sql` mendokumentasikan tabel yang sudah dibuat di D1. Bila baris `brand_key='umroh'` sudah ada dan sesuai, tidak perlu menghapus atau membuat ulang tabel.

## 2. Worker
Deploy `backend/worker/worker.js` ke Worker `umroh-auth-api`. Jangan ubah `AUTH_PEPPER`, `ENABLE_BOOTSTRAP=0`, binding `DB`, `DOCUMENTS_BUCKET`, atau `PUBLIC_MEDIA`.

Endpoint baru:
- `GET /branding/settings`
- `GET /admin/branding`
- `PATCH /admin/branding`
- `POST /admin/branding/media`

## 3. Route same-origin branding
Di Cloudflare Worker `umroh-auth-api`, tambahkan **route path** berikut pada zone `srilexbuditra.work`:

`srilexbuditra.work/program/umroh-semi-private-bengkulu/branding/*`

Jangan meroute seluruh `srilexbuditra.work/*` ke Worker ini.

Route ini hanya melayani branding. Bila object R2 belum tersedia, Worker mengambil fallback dari:

`/program/umroh-semi-private-bengkulu/assets/branding/`

## 4. GitHub Pages
Upload file patch ke repository dan deploy GitHub Pages seperti biasa. Aset branding publik juga disertakan secara statis sehingga URL tetap berfungsi sebelum route Worker aktif.

## 5. Uji
1. Buka `/program/umroh-semi-private-bengkulu/branding/logo-umroh-semi-private-bengkulu.avif`.
2. Buka `/program/umroh-semi-private-bengkulu/branding/site.webmanifest`.
3. Login Super Admin → Pengaturan → Branding.
4. Pastikan logo preview tampil.
5. Pilih file AVIF logo dan klik **Terapkan Logo & Favicon**.
6. Pastikan 7 upload selesai dan URL tidak berubah.
7. Hard refresh Portal, Admin, Jamaah, dan Manasik; logo/favicons harus memakai branding baru.
