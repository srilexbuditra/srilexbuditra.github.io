# Announcement Management Backend V3.6.0 — Deploy

## Urutan wajib
1. Jalankan migration `006_announcement_management.sql` satu kali.
2. Verifikasi kolom `priority`.
3. Verifikasi 4 draft legacy tersedia.
4. Commit/push frontend.
5. Deploy Worker V3.6.0.
6. Cek `/health`.
7. Buka Admin → Pengumuman.

## Verifikasi SQL
```sql
SELECT name FROM pragma_table_info('umroh_announcements') WHERE name = 'priority';
```

```sql
SELECT announcement_key, category, priority, is_published FROM umroh_announcements ORDER BY id;
```

```sql
PRAGMA foreign_key_check;
```

## Target health
```json
{"ok":true,"service":"umroh-auth-api","version":"3.6.0"}
```

## Catatan
Empat data awal tetap draft. Jangan publikasi sebelum isi, tanggal, dan prioritas diperiksa.
