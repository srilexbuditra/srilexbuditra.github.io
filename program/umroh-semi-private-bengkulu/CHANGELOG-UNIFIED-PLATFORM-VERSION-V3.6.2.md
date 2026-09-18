# CHANGELOG — Unified Platform Version Registry V3.6.2

## Changed
- Semua versi yang terlihat pada panel Admin dan Jemaah disatukan menjadi **Platform V3.6.2**.
- Ditambahkan `platform-version.json` sebagai single source of truth versi platform.
- Ditambahkan `assets/js/platform-version.js` untuk membaca registry dan memperbarui label versi otomatis.
- Cache key asset JS/CSS pada halaman Umroh diselaraskan ke release `3.6.2`.
- Worker `/health` diselaraskan ke versi platform `3.6.2`.

## Preserved
- Versi data/format seperti `Data simulasi V2.2` tidak diubah.
- Versi file dokumen (`v1`, `v2`, dan seterusnya) tidak diubah.
- Tidak ada migration D1.
- Tidak ada perubahan struktur tabel atau R2.

## Rule ke depan
Versi yang ditampilkan kepada Admin/Jemaah harus berasal dari `platform-version.json`.
Versi modul internal tidak ditampilkan sebagai versi utama pada panel akun.
