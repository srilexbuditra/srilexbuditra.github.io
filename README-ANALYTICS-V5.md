# Srilex Buditra Analytics V5

V5 menambahkan **Filter Periode** ke Analytics V4.

## Tambahan V5
- Preset Hari Ini, 7 Hari, 30 Hari, Semua
- Tanggal mulai/akhir kustom
- Top Pages, Traffic Sources, Visit Trend, dan Recent Visits mengikuti periode
- Export CSV memakai nama periode aktif
- Refresh tetap tersedia
- API Key tetap tidak disimpan di source publik

## Instalasi
1. Pasang `worker.js` V5 ke Cloudflare Worker dan klik **Deploy**.
2. Upload Website Analytics V5 ke GitHub.
3. Buka `/admin/stats.html`, lakukan hard refresh.
4. Masukkan `STATS_API_KEY`, lalu uji tombol filter.

> Data event historis tersedia sejak Analytics V4 mulai aktif. Periode sebelum itu tidak direkonstruksi.
