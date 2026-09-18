# CHANGELOG — Announcement Auth Wait Hotfix V3.6.1

## Fixed
- Halaman Pengumuman Jemaah tidak lagi berhenti pada `Menyiapkan/Memuat pengumuman resmi`.
- Dashboard `Pengumuman Terbaru` tidak lagi menunggu class `auth-ready` yang tidak dibuat oleh `jamaah-auth-guard.js`.
- Inisialisasi sekarang menunggu `window.UMROH_JAMAAH_ACCOUNT` yang memang dibuat oleh auth guard setelah `/auth/me` berhasil.
- Ditambahkan fallback terbatas dan refresh pada `pageshow` / `online`.

## Backend
- Tidak ada perubahan Worker.
- Worker produksi tetap V3.6.0.
- Tidak ada migration D1 baru.
