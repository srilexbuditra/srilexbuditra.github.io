# Checklist Progress Sync V3.4.4 — Deploy & Test

## Tidak ada migration D1 baru

## 1. GitHub
Commit:

`Add Umroh Checklist Progress Sync V3.4.4`

## 2. Worker
Deploy:

`backend/worker/worker.js`

Target:

```json
{"ok":true,"service":"umroh-auth-api","version":"3.4.4"}
```

Jangan ubah binding atau secret yang sudah berjalan.

## 3. PENTING — import Checklist lama dari laptop terlebih dahulu
Laptop sebelumnya memiliki progress Checklist lama (contoh 3/12), sedangkan HP kosong.

Setelah frontend + Worker V3.4.4 aktif:
1. login `SIM-0001` di LAPTOP yang memiliki progress Checklist lama;
2. buka `/program/umroh-semi-private-bengkulu/jamaah/checklist/`;
3. tunggu status `Progress akun Anda · D1`;
4. target progress lama otomatis diimport, misalnya `3 / 12`.

Jangan membuka Checklist pada perangkat kosong terlebih dahulu untuk pengujian import pertama.

## 4. Verifikasi D1
```sql
SELECT item_key, status, updated_at
FROM umroh_progress_items
WHERE account_id = (
  SELECT id FROM umroh_accounts WHERE member_no='SIM-0001'
)
  AND module='checklist'
ORDER BY item_key;
```

Mapping:
- `complete` = Siap
- `not_applicable` = Tidak berlaku
- `pending` = belum dipilih / dikosongkan

## 5. Uji HP ↔ Laptop
Setelah import laptop:
1. buka Checklist di HP;
2. progress harus sama dengan laptop;
3. ubah satu item di HP;
4. refresh Checklist di laptop.

Target: perubahan ikut terbaca tanpa input ulang.

## 6. Dashboard
Dashboard Jemaah mengambil Checklist dari D1.
Overall progress masih masa transisi sampai Agenda Sync selesai.
