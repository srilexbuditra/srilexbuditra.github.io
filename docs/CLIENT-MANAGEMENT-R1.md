# Srilex Buditra Client & Management Platform — R1

Prototype UI non-production yang mengikuti baseline terbaru srilexbuditra.work.

## Prinsip yang dikunci
- Logo: https://srilexbuditra.work/images/logo.avif
- Clean, elegant, focused, responsive, accessible, fast.
- Client Portal lebih sederhana daripada Management Console.
- Satu layar memiliki satu tujuan utama.
- Sidebar desktop, drawer tablet/mobile, bottom navigation mobile.
- Tidak mengubah `/admin/stats.html` yang saat ini dipakai Visitor Analytics.
- Tidak berisi kredensial, token, data pelanggan asli, atau koneksi database production.

## Isi
- `portal/index.html` — Client Portal Dashboard Home
- `admin/index.html` — Management Console Dashboard Home
- `shared/styles.css` — design tokens + components
- `shared/app.js` — responsive navigation ringan

## Deployment target (setelah backend siap)
- `portal.srilexbuditra.work`
- `admin.srilexbuditra.work`
- API terpisah / Worker yang melakukan authentication, authorization, ownership checks, dan audit logging.

## Catatan
Prototype menggunakan data simulasi. Jangan deploy sebagai production login sebelum Auth/API/D1/R2 selesai dan diuji di staging.
