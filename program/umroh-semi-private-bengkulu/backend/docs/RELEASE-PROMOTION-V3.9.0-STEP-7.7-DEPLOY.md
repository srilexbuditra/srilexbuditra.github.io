# Deploy — V3.9.0 Step 7.7 Production Release Promotion

## Scope

Step ini hanya mempromosikan baseline production dari V3.8.0 ke V3.9.0 setelah Step 7.7A menyatakan release **READY**.

Tidak ada migration D1 dan tidak ada upload/hapus object R2.

## Urutan deploy

1. Timpa folder `program` dari patch ke root repository.
2. Pastikan GitHub Desktop hanya menampilkan file version registry/helper, Worker, label versi user-facing, dan dua dokumen Step 7.7.
3. Commit/push perubahan GitHub Pages ke branch `main`.
4. Tunggu seluruh GitHub Actions dan Pages deployment hijau.
5. Deploy `program/umroh-semi-private-bengkulu/backend/worker/worker.js` ke Worker `umroh-auth-api`.
6. Verifikasi `https://umroh-api.srilexbuditra.work/health` melaporkan `version: "3.9.0"`.
7. Hard refresh Portal/Admin/Jemaah yang diuji.
8. Jalankan audit Step 7.7B Post-Promotion Verification.

## Commit summary yang disarankan

`V3.9.0 - Production Release Promotion`

## Target final

- `platform-version.json` = `3.9.0`
- `assets/js/platform-version.js` = `3.9.0`
- API `/health` = `3.9.0`
- Semua label platform user-facing aktif = `Platform V3.9.0`
- Release channel = `stable`
- Environment = `production`
- Tidak ada perubahan pada D1/R2/visual selain label versi.

## Catatan penting

GitHub Pages dan Worker adalah dua deployment terpisah. Release belum boleh dikunci hanya karena Pages hijau jika `/health` Worker masih melaporkan `3.8.0`.
