# Agenda Read Sync V3.4.5 — Deploy & Test

## Tidak ada migration D1 baru

Tabel `umroh_agenda_events` dan `umroh_agenda_reads` sudah ada sejak Migration 001.

## 1. GitHub
Commit:

`Add Umroh Agenda Read Sync V3.4.5`

## 2. Worker
Deploy:

`backend/worker/worker.js`

Target:

```json
{"ok":true,"service":"umroh-auth-api","version":"3.4.5"}
```

## 3. PENTING — import Agenda lama dari laptop terlebih dahulu
Laptop sebelumnya memiliki status baca Agenda lama (contoh 2/4), sedangkan HP sebelumnya kosong.

Setelah frontend + Worker aktif:
1. login `SIM-0001` di LAPTOP yang memiliki progress Agenda lama;
2. buka `/program/umroh-semi-private-bengkulu/jamaah/agenda/`;
3. tunggu pesan `Status baca Agenda tersinkron ke akun jemaah`;
4. target progress lama otomatis diimport, misalnya `2 / 4`.

Jangan membuka Agenda pada perangkat kosong terlebih dahulu untuk uji import pertama.

## 4. Verifikasi D1
```sql
SELECT
  e.event_key,
  r.read_at
FROM umroh_agenda_reads r
JOIN umroh_agenda_events e ON e.id = r.agenda_id
WHERE r.account_id = (
  SELECT id FROM umroh_accounts WHERE member_no='SIM-0001'
)
ORDER BY e.event_key;
```

Akan ada marker internal:
`__agenda-read-sync-v1__`

Marker tersebut bukan agenda jemaah dan tidak dihitung dalam 4 agenda.

## 5. Uji HP ↔ Laptop
Setelah import laptop:
1. buka Agenda di HP;
2. jumlah dibaca harus sama dengan laptop;
3. tandai satu agenda lain `Sudah dibaca` di HP;
4. refresh Agenda di laptop.

Target: perubahan HP → D1 → Laptop terbaca.

## 6. Catatan
Isi jadwal Agenda masih simulasi V2.2.
V3.4.5 hanya memindahkan status baca ke akun/backend.
Tahap setelah ini adalah final Dashboard Progress backend.
