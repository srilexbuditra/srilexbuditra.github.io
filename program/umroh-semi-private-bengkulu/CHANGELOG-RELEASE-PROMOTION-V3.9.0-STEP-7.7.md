# V3.9.0 Step 7.7 — Production Release Promotion

## Status

V3.9.0 dipromosikan menjadi baseline production setelah rangkaian rollout dan audit Step 7.1–7.6 selesai, termasuk SEO/metadata, media R2, structured data, sitemap, serta diagnosis runtime tanpa kebutuhan patch tambahan.

## Baseline sebelum promosi

- Production baseline: **V3.8.0**
- Target release: **V3.9.0**
- Step 7.7A Release Closure & Version Promotion Audit: **PASS / READY**
- Baseline version consistency: **PASS**
- Version promotion patch required: **YES**

## Perubahan promosi

- `platform-version.json`: `platform_version` dan `api_version` menjadi `3.9.0`; `release_date` menjadi `2026-09-20`.
- `assets/js/platform-version.js`: registry helper menjadi `Platform V3.9.0`.
- `backend/worker/worker.js`: `API_VERSION` menjadi `3.9.0`.
- Seluruh label user-facing `Platform V3.8.0` pada halaman Portal/Admin/Jemaah aktif menjadi `Platform V3.9.0`.
- Catatan rollout pada Admin → Pengaturan diperbarui menjadi status rollout/audit production selesai.

## Tidak berubah

- D1 schema/data dan migration
- Object R2 dan URL media aktif
- Auth/session/RBAC
- Progress Manasik/Checklist/Agenda/Dokumen
- SEO, Open Graph, Twitter metadata, JSON-LD, dan sitemap yang sudah LOCKED
- Layout, design system, branding, logo/favicon, dan struktur navigasi
- Query-string versi pada asset yang tidak berubah; nilai seperti `?v=3.8.0` tetap dapat menunjukkan versi komponen/cache tag, bukan baseline platform production.

## Release rule

Setelah deploy GitHub Pages dan Worker selesai, `/health`, `platform-version.json`, helper version, dan semua label platform aktif harus konsisten pada **3.9.0** sebelum release dinyatakan PASS & LOCKED.
