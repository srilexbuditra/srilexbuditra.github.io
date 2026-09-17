# Program Area — srilexbuditra.work

Folder `program/` menjadi area untuk aplikasi/program khusus yang berdiri di bawah domain `srilexbuditra.work` tanpa mengubah positioning utama website sebagai portfolio dan pusat layanan Srilex Buditra.

## Program Aktif

### 1. Program Ketahanan Pangan

Path:

`/program/ketahanan-pangan/`

Digital Platform untuk layanan peserta, administrasi, verifikasi, dokumentasi, dan pengembangan Program Ketahanan Pangan.

Dokumentasi modul tersedia di [ketahanan-pangan/README.md](ketahanan-pangan/README.md).

---

### 2. Umroh Semi Private Bengkulu

Path:

`/program/umroh-semi-private-bengkulu/`

Digital Platform Jemaah & Manasik Umroh yang dikembangkan sebagai pusat informasi, panduan manasik, persiapan jemaah, agenda perjalanan, dokumentasi, dan layanan pendampingan digital.

Modul yang telah tersedia:

- Portal Digital Platform
- Dashboard Admin
- Dashboard Jemaah
- Manasik Digital
- Progress Manasik
- Checklist Persiapan Jemaah
- Agenda & Perjalanan Jemaah
- Dokumen Saya / Status Dokumen Jemaah
- Pengumuman Jemaah

Catatan:
- Agenda & Perjalanan sudah tersedia sebagai modul V2.2 dan saat ini masih menggunakan data jadwal simulasi sampai sumber data operasional/backend resmi diaktifkan.
- Dokumen Saya sudah tersedia sebagai modul V2.3 untuk pencatatan status kesiapan dokumen secara lokal. Modul ini belum menerima upload dan tidak menyimpan berkas pribadi pada halaman statis.
- Pengumuman Jemaah sudah tersedia sebagai modul V2.4. Status dibaca masih tersimpan lokal dan isi pengumuman saat ini masih berupa data simulasi sampai sumber operasional resmi/backend diaktifkan.

Modul dalam pengembangan:

- Progress persiapan keseluruhan berbasis data modul
- Integrasi akun, autentikasi, backend, dan database

Dokumentasi modul tersedia di [umroh-semi-private-bengkulu/README.md](umroh-semi-private-bengkulu/README.md).

## Struktur & Identitas

Setiap program dapat memiliki:

- portal publik,
- dashboard pengguna,
- area administrasi,
- dokumentasi,
- aset program,
- dan layanan backend/Worker terpisah bila diperlukan.

Identitas organisasi/program harus tetap menjadi identitas utama program.

Srilex Buditra ditempatkan sesuai peran sebagai:

**Pengembangan Sistem & Dukungan Teknologi**

Peran tersebut tidak menggantikan identitas organisasi, pengelola, pembimbing, tour leader, atau pihak operasional program.

## Struktur Aset

Setiap program menggunakan asetnya sendiri agar perubahan pada satu program tidak merusak program lain.

Contoh:

- Program Ketahanan Pangan: `ketahanan-pangan/assets/`
- Umroh Semi Private Bengkulu: `umroh-semi-private-bengkulu/assets/`

Aset global hanya digunakan bila memang bersifat umum dan telah ditetapkan sebagai shared asset.

## Prinsip Integrasi

1. Program tetap berada di bawah domain `srilexbuditra.work` agar hubungan dukungan teknologi dapat ditelusuri.
2. Setiap program berdiri sebagai modul independen di dalam folder `program/`.
3. Identitas organisasi/program dan peran Srilex Buditra harus dibedakan dengan jelas.
4. Halaman admin/private tidak dijadikan konten publik untuk indexing.
5. Perubahan pada website utama tidak boleh merusak modul program yang sudah berjalan.
6. Aset antarprogram tidak dicampur tanpa kebutuhan teknis yang jelas.
7. Shared asset harus menggunakan path yang konsisten dan target file yang benar-benar ada.
8. Modul yang belum aktif tidak boleh ditampilkan seolah-olah sudah menjadi layanan operasional resmi.

## Keamanan

Jangan menyimpan NIK, nomor KK, KTP/KK, nomor WhatsApp peserta/jemaah, email pribadi, password, bearer token, API key, secret Worker, private key, atau kredensial database pada HTML/JS publik atau repository.

Konfigurasi sensitif harus dikelola melalui secret/environment pada layanan backend yang sesuai.
