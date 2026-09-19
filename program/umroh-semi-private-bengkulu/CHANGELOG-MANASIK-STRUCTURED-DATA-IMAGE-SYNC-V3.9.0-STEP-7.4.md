# V3.9.0 Step 7.4 — Manasik Structured Data Image Sync

## Status

Step 7.4 menyelaraskan properti `image` pada JSON-LD `Article` 10 halaman materi Manasik dengan media R2 produksi yang sudah dikunci pada Step 7.3.

## Baseline yang dipertahankan

- V3.9.0 Step 6.2 — Manasik Media Metadata Sync: LOCKED.
- V3.9.0 Step 7.1 — Portal Global SEO & Metadata Baseline: LOCKED.
- V3.9.0 Step 7.2 — Public Discoverability & Manasik Hub SEO Baseline: LOCKED.
- V3.9.0 Step 7.3 — Manasik Static Social Metadata Publish Sync: PASS & LOCKED.
- Step 7.4A audit production: 1/11 full pass; hanya Talbiyah yang telah memiliki `Article.image`.

## Perubahan

Ditambahkan `image` ke schema `Article` pada 10 materi berikut:

- Persiapan Sebelum Berangkat
- Ihram & Miqat
- Tata Cara Umroh
- Thawaf
- Sa’i
- Tahallul
- Larangan Ihram
- Adab di Tanah Suci
- Ziarah Madinah
- Tips Selama Perjalanan

`Talbiyah` tidak diubah karena `Article.image` sudah sama dengan URL R2 produksi.

## Tidak berubah

- Body HTML / visual / layout
- CSS dan JavaScript
- Worker / API
- D1 schema maupun data
- Object R2 aktif
- Login Admin/Jemaah
- Progress Manasik
- Sitemap
- Metadata Open Graph/Twitter Step 7.3
- `platform-version.json` tetap V3.8.0 selama rollout V3.9.0 bertahap

## Target verifikasi

Audit Step 7.4A setelah deploy harus menghasilkan:

- `STEP 7.4A STRUCTURED DATA: 11/11 FULL PASS`
- `ARTICLE IMAGE CONSISTENCY: 11/11 PASS`
