# V11.5.2 — Performance Implementation Synchronization Fix

## Tujuan
Menyinkronkan implementasi aktual dengan strategi performa yang sebelumnya didokumentasikan pada V11.5.1.

## Perubahan yang diterapkan
- `script.js`, `search-enhancer.js`, dan `tts.js` pada homepage sekarang menggunakan `defer`.
- Gambar hero/profile memiliki dimensi eksplisit `1008 × 1008`, `fetchpriority="high"`, dan `decoding="async"`.
- Logo header dan footer memiliki dimensi eksplisit `1920 × 1916` serta `decoding="async"`.
- Lazy loading gambar portfolio yang sudah ada tetap dipertahankan.
- Tidak ada fitur, konten, atau desain visual yang sengaja dihapus.

## Catatan kompatibilitas
Perubahan `defer` diterapkan pada skrip eksternal yang berada di homepage. Atribut ini menjaga urutan eksekusi skrip eksternal dan menjalankannya setelah parsing HTML selesai.

## Verifikasi setelah upload
1. Pastikan GitHub Actions selesai tanpa error.
2. Pastikan deployment GitHub Pages berhasil.
3. Uji menu, pencarian, TTS, calculator, dan interaksi utama.
4. Jalankan ulang PageSpeed Insights untuk Mobile dan Desktop.
