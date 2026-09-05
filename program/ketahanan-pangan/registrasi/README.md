# Registrasi Ketahanan Pangan — V5

Versi ini memisahkan CSS dan JavaScript dari `index.html` menjadi `style.css` dan `script.js`.
Hal ini membuat tampilan lebih kompatibel dengan kebijakan keamanan/CSP pada hosting dan Cloudflare yang dapat memblokir inline style/script.

Upload seluruh isi folder `program/ketahanan-pangan/registrasi/` termasuk folder `assets/`.
Setelah upload, lakukan hard refresh (Ctrl+F5) atau purge cache Cloudflare bila versi lama masih muncul.

## Pembaruan V6
- Menambahkan field wajib Nomor Kartu Keluarga (KK), 16 digit.
- Menambahkan visual pertanian AVIF ringan pada hero dan section cerita program.
- Mempertahankan Super Tani Indonesia sebagai pelopor dan AY Group Agro Indonesia sebagai support system marketing nasional & internasional.
- Cache-busting CSS/JS diperbarui ke v6.
