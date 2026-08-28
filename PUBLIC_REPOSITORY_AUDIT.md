# Public Repository & Privacy Audit

## Tujuan
Dokumen ini menjadi checklist audit sebelum repository dan aset dipublikasikan.

## Status Audit V11
- Dokumentasi inti: tersedia
- File environment dan private-key umum: dilindungi oleh `.gitignore` dan quality check
- GitHub Actions quality check: tersedia
- PDF publik: menggunakan `dummy.pdf`; tinjau isi dan metadata sebelum mengganti dengan dokumen nyata
- Audio musik komersial: tidak ditemukan pada audit V11
- Kontak publik: email dan nomor WhatsApp memang ditampilkan sebagai informasi kontak website

## Checklist sebelum publikasi
1. Pastikan tidak ada API key, token, password, atau kredensial.
2. Pastikan tidak ada NIK, NISN, nomor rekening, alamat rumah, atau data pribadi sensitif.
3. Gunakan data dummy/anonymized untuk contoh sekolah, siswa, klien, dan dokumen.
4. Periksa metadata PDF, gambar, dan dokumen sebelum upload.
5. Pastikan gambar, musik, font, dan aset pihak ketiga memiliki izin/lisensi yang sesuai.
6. Periksa `git log` jika secret pernah ter-commit; `.gitignore` tidak menghapus riwayat lama.
7. Jalankan workflow GitHub Actions setelah setiap perubahan penting.

## Catatan metadata
Metadata dapat memuat nama pembuat, perangkat lunak, tanggal, atau informasi lain. Untuk file yang berasal dari pihak ketiga atau mengandung informasi sensitif, buat salinan publik yang sudah dibersihkan atau gunakan aset dummy.

## Pelaporan masalah
Ikuti `SECURITY.md` untuk pelaporan kerentanan keamanan.
