# CHANGELOG — Admin Dashboard Full Backend Sync V3.7.0

## Changed
- Ringkasan Admin tidak lagi memakai angka simulasi pada:
  - Perlu Perhatian
  - Status Persiapan Jemaah
  - Aktivitas Terbaru
  - badge notifikasi
- Ditambahkan endpoint `GET /admin/dashboard/summary`.
- Semua nilai operasional dihitung dari backend/D1.
- Rentang Hari Ini / 7 Hari / 30 Hari sekarang berfungsi untuk agenda dan aktivitas.
- Tanggal pada header Admin dibuat dinamis.
- Versi platform Admin, Jemaah, dan Worker disinkronkan ke **Platform V3.7.0**.

## Readiness rules
- **Belum Aktif**: akun jemaah bukan `active`.
- **Perlu Pendampingan**: akun aktif memiliki dokumen berstatus `needs_revision` atau `rejected`.
- **Siap Berangkat**: akun aktif, 11 materi Manasik selesai, 12 Checklist diperiksa, 4 dokumen terverifikasi, dan seluruh agenda resmi yang aktif sudah dibaca.
- **Dalam Persiapan**: akun aktif yang belum memenuhi kondisi di atas.

## Perlu Perhatian
Dihitung dari:
- dokumen current yang belum direview Admin;
- jemaah aktif yang belum siap;
- agenda resmi dalam rentang waktu terpilih;
- draft pengumuman.

## Database
Tidak ada migration D1 baru.
Tidak ada perubahan R2.
