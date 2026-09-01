# V12 — Vector Signature Print Fix

Perbaikan utama:
- Signature Pihak Kedua direkam sebagai stroke points ter-normalisasi.
- Print/PDF menggunakan SVG `<path>` berbasis stroke, bukan data-URL image/canvas.
- SVG vector dirender langsung di DOM sehingga tidak bergantung pada image decode saat Print Preview.
- Tetap responsif pada desktop dan mobile.
- Tanda tangan Pihak Pertama tetap digital/terdaftar.
