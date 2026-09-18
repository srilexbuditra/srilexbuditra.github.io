# Agenda Date/Time Hotfix V3.5.1 — Deploy & Test

## Tidak ada migration D1 baru

Data `manasik-tata-cara` sudah dikoreksi manual menjadi:

`2026-09-20T09:00:00+07:00`

Jangan mengubahnya langsung di D1 lagi selama pengujian.

## Deploy

1. Copy patch ke repository.
2. Commit:

`Fix Umroh Agenda Date Time V3.5.1`

3. Push origin.
4. Deploy `backend/worker/worker.js`.
5. Target `/health`:

```json
{"ok":true,"service":"umroh-auth-api","version":"3.5.1"}
```

## Uji round-trip

Buka Admin → Agenda & Perjalanan → Edit `Manasik — Tata Cara Umroh`.

Target form:
- tanggal: 20 Sep 2026
- mulai: 09:00
- lokasi: data resmi yang telah disimpan
- Dipublikasikan tetap aktif

Tanpa mengubah tanggal/jam, ubah hanya Catatan/Arahan kecil atau tambahkan satu spasi lalu rapikan, kemudian Simpan.

Setelah simpan jalankan:

```sql
SELECT event_key, starts_at, ends_at, updated_at
FROM umroh_agenda_events
WHERE event_key = 'manasik-tata-cara';
```

Target wajib:
`starts_at = 2026-09-20T09:00:00+07:00`

Jika tetap 09:00, hotfix round-trip lolos.

## Setelah lolos

Buka halaman Jemaah Agenda dan verifikasi bahwa agenda resmi dari D1 tampil dengan 09:00 WIB.
