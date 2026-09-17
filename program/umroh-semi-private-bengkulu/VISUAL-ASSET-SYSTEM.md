# Visual Asset System V1 — Umroh Semi Private Bengkulu

Status: **LOCKED sebagai aturan visual dasar** setelah Dashboard Design System V1.

## Prinsip
- Admin: data + icon; hindari foto dekoratif.
- Jemaah: icon + satu visual kontekstual pada area penting; jangan membuat setiap kartu menjadi poster.
- Manasik: setiap materi memiliki pictogram/icon edukatif; foto/ilustrasi tambahan hanya jika benar-benar membantu pemahaman.
- Dokumen/Checklist: icon lebih penting daripada foto.
- Pembimbing Manasik & Tour Leader: gunakan foto asli hanya jika tersedia dan diizinkan; jangan memakai foto sintetis sebagai pengganti orang nyata.
- Empty/error/success state: gunakan icon/ilustrasi sederhana dan pesan yang jelas.

## Format aset
- Icon: SVG lokal, 24×24 viewBox, gaya outline seragam, satu warna melalui CSS mask.
- Foto/hero: AVIF bila tersedia; JPEG/WebP sebagai fallback jika diperlukan.
- Jangan memakai CDN icon eksternal; aset disimpan pada domain sendiri untuk konsistensi CSP.

## Struktur folder
- `assets/icons/` — icon SVG lokal.
- `assets/images/manasik/` — foto/ilustrasi edukatif materi manasik jika nanti tersedia.
- `assets/images/people/` — foto asli Pembimbing Manasik / Tour Leader bila diberikan dan diizinkan.
- `assets/illustrations/` — empty state, error, success, atau visual non-foto.

## Rasio gambar yang disarankan
- Hero portal/jemaah: 16:9 atau 1.91:1, crop aman pada desktop dan mobile.
- Visual materi manasik: 16:9, minimal 1200×675 bila berupa foto/ilustrasi raster.
- Foto profil pendamping: 1:1, minimal 640×640.
- Poster/pengumuman khusus: mengikuti materi sumber; jangan dijadikan ukuran default kartu aplikasi.

## Penerapan V1
Icon lokal diterapkan pada Portal, Dashboard Admin, Dashboard Jemaah, indeks Manasik Digital, dan 11 halaman materi Manasik.
