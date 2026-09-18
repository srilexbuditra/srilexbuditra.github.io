# Announcement Auth Wait Hotfix V3.6.1 — Deploy & Test

## Penyebab
Frontend V3.6.0 menunggu:

`document.documentElement.classList.contains('auth-ready')`

sedangkan `jamaah-auth-guard.js` menetapkan akun melalui:

`window.UMROH_JAMAAH_ACCOUNT`

dan tidak menambahkan class `auth-ready`.

Akibatnya loader tidak pernah memanggil endpoint `/jamaah/announcements`.

## Deploy
1. Copy patch ke repository dan Replace files.
2. Commit:
   `Fix Umroh Announcement Auth Wait V3.6.1`
3. Push origin.
4. Tidak perlu deploy Worker.
5. Worker `/health` tetap `3.6.0`.

## Test
Lakukan `Ctrl + F5` pada:
- `/program/umroh-semi-private-bengkulu/jamaah/pengumuman/`
- `/program/umroh-semi-private-bengkulu/jamaah/dashboard/`

Target:
- Pengumuman resmi pertama tampil dari D1.
- Loader hilang.
- Status baca mengikuti akun D1 / hasil import legacy.
- Dashboard `Pengumuman Terbaru` menampilkan data resmi yang sama.
