# Manasik Progress Sync V3.4.3 — Deploy & Test

## Tidak ada migration D1 baru

Tabel `umroh_progress_items` sudah ada sejak Migration 001.

## 1. GitHub
Commit:

`Add Umroh Manasik Progress Sync V3.4.3`

## 2. Worker
Deploy:

`backend/worker/worker.js`

Target:

```json
{"ok":true,"service":"umroh-auth-api","version":"3.4.3"}
```

Jangan ubah:
- DB
- DOCUMENTS_BUCKET
- AUTH_PEPPER
- ALLOWED_ORIGIN
- ENABLE_BOOTSTRAP=0
- SESSION_MAX_AGE_SECONDS

## 3. PENTING — migrasikan progress laptop lama lebih dahulu
Akun simulasi saat ini memiliki progress lama di laptop (contoh 1/11), sedangkan D1 Manasik masih kosong.

Setelah frontend + Worker V3.4.3 aktif:
1. login `SIM-0001` di LAPTOP yang memiliki progress lama;
2. buka `/program/umroh-semi-private-bengkulu/manasik/`;
3. tunggu status `Progress akun Anda · D1`;
4. target progress lama otomatis diimport, misalnya `1 / 11`.

Jangan buka/ubah Manasik dari perangkat kosong terlebih dahulu saat pengujian migrasi pertama.

## 4. Verifikasi D1
Jalankan:

```sql
SELECT module, item_key, status, updated_at
FROM umroh_progress_items
WHERE account_id = (
  SELECT id FROM umroh_accounts WHERE member_no='SIM-0001'
)
  AND module='manasik'
ORDER BY item_key;
```

Target: progress lokal lama muncul sebagai `complete`.

## 5. Uji HP ↔ Laptop
Setelah import laptop:
1. buka akun `SIM-0001` di HP;
2. buka Manasik Digital;
3. progress harus sama dengan laptop;
4. tandai satu materi lain selesai di HP;
5. refresh Manasik di laptop.

Target: laptop ikut berubah tanpa memindahkan data manual.

## 6. Dashboard
Dashboard Jemaah harus membaca Manasik dari D1 dan menampilkan ringkasan `x dari 11 selesai · D1`.

## Catatan transisi
Overall progress total belum final karena Checklist dan Agenda masih lokal.
Dokumen sudah backend/R2, tetapi agregasi keseluruhan akan dirapikan setelah Checklist + Agenda sync selesai.
