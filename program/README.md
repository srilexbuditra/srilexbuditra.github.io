# Super Tani Indonesia — Favicon Package

Paket favicon untuk seluruh area:
`/program/ketahanan-pangan/`

## Isi
- favicon.ico
- favicon-16x16.png
- favicon-32x32.png
- favicon-48x48.png
- apple-touch-icon.png (180x180)
- icon-192.png
- icon-master.svg
- head/registrasi-head.html
- head/verifikasi-head.html
- head/admin-head.html

## Prinsip
Satu identitas favicon dipakai bersama oleh registrasi, verifikasi, dan admin.
Tidak ada perubahan CSS, JavaScript, atau body layout.

## Canonical
Registrasi dan verifikasi menggunakan URL direktori tanpa `index.html`, dengan catatan server memang melayani URL tersebut.

## Admin
Admin menggunakan `noindex, nofollow, noarchive, nosnippet`. Perlindungan akses seperti Cloudflare Access tetap harus dipertahankan.

## Catatan keamanan
Jangan menaruh NIK, KK, KTP, dokumen pribadi, token, atau kredensial di HTML/JS publik atau repository.
