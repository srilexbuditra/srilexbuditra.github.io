# Prototype Dashboard V1.2

Perubahan V1.2 berfokus pada penguncian visual sebelum backend:

- Portal utama dipindahkan ke CSS eksternal agar kompatibel dengan CSP `default-src 'self'` dan tampil konsisten dengan dashboard.
- Portal utama dirapikan menjadi landing prototype resmi dengan pintu Admin/Jemaah, arah pengembangan, identitas peran, dan kredit teknologi.
- Navigasi Admin tidak lagi meninggalkan hash untuk modul yang belum aktif; modul prototype menampilkan pemberitahuan tanpa mengubah workspace Ringkasan.
- Target `#agenda` yang sebelumnya bentrok dengan preview Agenda di Ringkasan dihapus.
- Topbar Admin diringkas sedikit pada desktop.
- Hero Journey Dashboard Jemaah dipadatkan pada desktop/laptop agar progress dan tindakan berikutnya lebih cepat terlihat.
- Inline style pada halaman Jemaah dan legend Admin dihapus untuk konsistensi CSP.
- Semua data tetap simulasi; autentikasi, API, dan database belum diaktifkan.
