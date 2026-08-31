# POS Portfolio — Complete Website

## Struktur
- `index.html` — halaman utama
- `css/style.css` — seluruh styling dan responsive layout
- `js/app.js` — interaksi, menu mobile, scroll spy, reveal animation, modal, dan data rendering
- `data/project.json` — data konten fitur, proses, dan teknologi
- `assets/images/` — mockup layar aplikasi + referensi visual
- `assets/icons/` — logo dan ikon fitur

## Menjalankan
Cara paling sederhana:
1. Extract ZIP.
2. Buka `index.html` di browser.

Untuk pengembangan yang menggunakan `fetch()` terhadap `data/project.json`, disarankan memakai local server:
- VS Code + Live Server
- Python: `python -m http.server 8000`
- Node: `npx serve .`

Lalu buka `http://localhost:8000`.

## Kustomisasi
- Ganti nama/brand di `index.html`.
- Ganti email `hello@example.com`.
- Edit konten fitur dan teknologi di `data/project.json`.
- Warna utama dapat diubah melalui variabel `--orange` di `css/style.css`.
- Gambar berada di `assets/images/`.

Catatan: aset visual aplikasi di dalam paket ini adalah mockup/konsep untuk kebutuhan portfolio, bukan klaim sebagai UI resmi milik Pos Indonesia.
