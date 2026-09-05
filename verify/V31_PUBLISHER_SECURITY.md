# Publisher Security V31

V31 mengurangi risiko penyimpanan Publisher Token pada browser.

## Perubahan
- `SB_VERIFY_PUBLISHER_TOKEN` tidak lagi disimpan di `localStorage`.
- Token disimpan sementara di `sessionStorage`.
- Token V30 yang masih berada di `localStorage` otomatis dihapus.
- API endpoint tetap boleh disimpan di `localStorage` karena bukan rahasia.
- Publisher Setup memiliki tombol **Buka Formulir Utama** untuk melanjutkan pada tab/sesi yang sama.
- QR, Document ID, PDF, endpoint verifikasi publik, dan struktur Worker/KV tidak diubah.

## Cara pakai
1. Buka halaman Publisher Setup melalui alamat administratif yang disimpan secara privat oleh penerbit.
2. Isi API Endpoint dan Publisher Token.
3. Klik **Simpan Konfigurasi**.
4. Klik **Buka Formulir Utama**.
5. Buat dokumen seperti biasa.
6. Setelah selesai, tutup tab/browser atau klik **Hapus** pada Publisher Setup.

## Catatan keamanan
`sessionStorage` mengurangi persistensi token tetapi JavaScript yang berjalan pada origin yang sama masih dapat mengakses token selama sesi aktif. Untuk tingkat keamanan lebih tinggi, gunakan autentikasi server-side/short-lived credential pada versi berikutnya.
