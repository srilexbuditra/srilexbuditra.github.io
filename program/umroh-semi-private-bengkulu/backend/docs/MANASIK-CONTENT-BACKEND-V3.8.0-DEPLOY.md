# Manasik Content Backend V3.8.0 — Deploy & Test

## URUTAN WAJIB
1. Jalankan migration `007_manasik_content_backend.sql` pada D1.
2. Verifikasi tabel memiliki 11 baris dan semuanya `is_published = 1`.
3. Copy patch ke repository dan Push.
4. Deploy `backend/worker/worker.js`.
5. Verifikasi `/health` menunjukkan `3.8.0`.
6. Uji Admin → Manasik.
7. Uji Manasik Jemaah.

## Verifikasi D1
```sql
SELECT material_key, sort_order, title, is_published
FROM umroh_manasik_materials
ORDER BY sort_order;
```

Target: 11 baris.

```sql
SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN is_published = 1 THEN 1 ELSE 0 END) AS published
FROM umroh_manasik_materials;
```

Target: `total = 11`, `published = 11`.

```sql
PRAGMA foreign_key_check;
```

Target: tidak ada pelanggaran.

## Test Admin
Buka:
`/program/umroh-semi-private-bengkulu/admin/manasik/`

Target:
- 11 Total Materi.
- 11 Dipublikasikan.
- 0 Draft.
- Semua materi dapat diedit.
- Edit judul/ringkasan/isi/urutan dapat disimpan ke D1.

## Test Jemaah
Buka:
`/program/umroh-semi-private-bengkulu/manasik/`

Target:
- daftar materi berasal dari D1;
- urutan mengikuti `sort_order`;
- hanya materi `is_published = 1` yang tampil;
- halaman detail mengambil konten dari D1;
- progress lama tetap tersimpan.

## Worker
Target `/health`:
`{"ok":true,"service":"umroh-auth-api","version":"3.8.0"}`
