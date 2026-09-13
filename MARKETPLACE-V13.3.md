# Marketplace & Ekosistem V13.3.0

Tahap 6 engagement peserta Program Ketahanan Pangan.

## Prinsip tahap awal

Marketplace V13.3.0 adalah **katalog resmi + pencatatan minat**, bukan sistem transaksi.

- Tidak ada checkout.
- Tidak ada pembayaran.
- Tidak ada pengurangan poin.
- Tidak ada janji stok atau bantuan.
- Tidak ada poin karena menyimpan minat.
- Item hanya tampil jika berstatus `published`.
- Syarat Level dan VERIFIED MEMBER diperiksa oleh server.

## Endpoint peserta

- `GET /marketplace`
- `POST /marketplace/interest`

Semua endpoint memerlukan session peserta aktif.

## Tabel D1

Worker membuat tabel otomatis saat endpoint Marketplace pertama kali dipanggil:

- `marketplace_items`
- `participant_marketplace_interests`

Tidak perlu membuat tabel D1 secara manual.

## Status katalog

Katalog kosong setelah deploy adalah kondisi normal. Item baru akan muncul setelah pengelola mempublikasikan katalog yang sudah disepakati tim.

## Modul yang tidak diubah

Kartu Anggota + QR, safe-area 5 mm, sertifikat, verifikasi foto, Level & Poin, Misi, Referral, Benefit, serta Aktivitas & Event tetap dipertahankan.
