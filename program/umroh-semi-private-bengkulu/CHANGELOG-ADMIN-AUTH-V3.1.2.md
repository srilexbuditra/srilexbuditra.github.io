# Changelog — Admin Auth Frontend V3.1.2

Tanggal: 2026-09-18

## Added

- Halaman Login Admin: `/program/umroh-semi-private-bengkulu/admin/login/`
- `admin-login.js` untuk login backend melalui Umroh Auth API.
- `admin-auth-guard.js` untuk melindungi Dashboard Admin.
- Tombol Logout pada topbar Dashboard Admin.
- CSS `admin-auth.css` untuk Login Admin dan status auth dashboard.
- Identitas Super Admin pada dashboard: **Srilex Buditra — Full Stack Developer — Super Admin**.

## Changed

- Dashboard Admin tidak lagi dianggap halaman tanpa autentikasi.
- Konten dashboard disembunyikan saat session sedang diperiksa untuk mencegah flash halaman terlindungi.
- Catatan prototype diperbarui: autentikasi sudah aktif, tetapi data operasional ringkasan masih simulasi.

## Security

- API frontend: `https://umroh-api.srilexbuditra.work`
- Semua request auth menggunakan `credentials: 'include'`.
- Dashboard memeriksa `/auth/me` sebelum ditampilkan.
- Role yang diizinkan masuk Dashboard Admin: `super_admin`, `admin`.
- Password tidak disimpan di localStorage/sessionStorage.
- Session token tidak dapat dibaca JavaScript karena cookie HttpOnly.
- Logout dilakukan melalui `/auth/logout`, lalu browser kembali ke halaman Login.
- Redirect `next` hanya diterima untuk path Admin lokal untuk mencegah open redirect.

## CSP Required

Pastikan `connect-src` Cloudflare mengandung:

`https://umroh-api.srilexbuditra.work`

## Uji setelah deploy

1. Buka `/program/umroh-semi-private-bengkulu/admin/` tanpa login → harus diarahkan ke `/admin/login/`.
2. Login sebagai `srilexbuditra` → harus masuk Dashboard Admin.
3. Topbar harus menampilkan `Srilex Buditra` dan `Full Stack Developer · Super Admin`.
4. Refresh Dashboard → session tetap dikenali.
5. Klik `Keluar` → kembali ke Login.
6. Tekan Back/akses dashboard setelah logout → auth guard harus mengarahkan kembali ke Login.
7. Console browser tidak boleh menampilkan CSP/CORS error.
