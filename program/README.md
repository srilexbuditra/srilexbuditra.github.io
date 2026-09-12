# Program Area — srilexbuditra.work

Folder `program/` menjadi area untuk aplikasi/program khusus yang berdiri di bawah domain `srilexbuditra.work` tanpa mengubah positioning utama website sebagai portfolio dan pusat layanan Srilex Buditra.

## Program Aktif

Saat ini area utama adalah:

`/program/ketahanan-pangan/`

Dokumentasi modul tersedia di [ketahanan-pangan/README.md](ketahanan-pangan/README.md).

## Struktur & Identitas

Program dapat memiliki:

- portal publik,
- registrasi,
- verifikasi,
- akun/dashboard peserta,
- dokumentasi,
- area administrasi,
- aset brand bersama,
- dan layanan backend/Worker terpisah bila diperlukan.

Aset favicon/icon bersama Program Ketahanan Pangan berada di `ketahanan-pangan/assets/brand/` dan digunakan sesuai kebutuhan halaman terkait.

## Prinsip Integrasi

1. Program tetap berada di bawah domain `srilexbuditra.work` agar hubungan dukungan teknologi dapat ditelusuri.
2. Identitas organisasi/program dan peran Srilex Buditra harus dibedakan dengan jelas.
3. Halaman admin/private tidak dijadikan konten publik untuk indexing.
4. Perubahan pada website utama tidak boleh merusak modul program yang sudah berjalan.
5. Shared asset harus menggunakan path yang konsisten dan target file yang benar-benar ada.

## Keamanan

Jangan menyimpan NIK, nomor KK, KTP/KK, nomor WhatsApp peserta, email peserta, password, bearer token, API key, secret Worker, private key, atau kredensial database pada HTML/JS publik atau repository.

Konfigurasi sensitif harus dikelola melalui secret/environment pada layanan backend yang sesuai.
