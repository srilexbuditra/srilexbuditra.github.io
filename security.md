# Kebijakan Keamanan — Srilex Buditra

**Website:** https://srilexbuditra.work  
**Proyek:** Srilex Buditra — Full Stack Developer  
**Terakhir ditinjau:** 23 Agustus 2026

## 1. Ruang Lingkup

Dokumen ini berisi standar dasar keamanan dan checklist penguatan keamanan untuk `srilexbuditra.work`.

Cakupannya meliputi halaman publik, aset website, formulir estimasi, integrasi WhatsApp, JavaScript frontend, backend/API, database, deployment, library pihak ketiga, serta layanan eksternal.

> Dokumen ini merupakan **baseline keamanan dan checklist penguatan**, bukan klaim bahwa seluruh kontrol keamanan sudah diterapkan.

## 2. Hasil Peninjauan Publik

Website merupakan portfolio/bisnis developer dengan layanan Website, Web Application, REST API/Backend, Sistem Informasi Custom, Pengembangan Database, dan Deployment/Cloud.

Website juga memiliki formulir estimasi yang meminta:
- Nama lengkap
- Nama perusahaan
- Email
- Nomor WhatsApp
- Jenis proyek
- Fitur tambahan
- Deskripsi proyek

Tersedia pula fungsi pengiriman estimasi melalui WhatsApp dan fitur cetak/simpan PDF.

Konfigurasi server, source code backend, database, environment variables, autentikasi, dan hosting tidak dapat dipastikan hanya dari sisi publik.

## 3. Prioritas Keamanan

### Kritis — wajib diperiksa

- [ ] Jangan pernah mengekspos API key, password database, JWT secret, private key, atau kredensial cloud di JavaScript frontend.
- [ ] Pastikan `.env`, file konfigurasi rahasia, private key, backup, dan kredensial tidak masuk Git.
- [ ] Jika secret pernah masuk Git, segera lakukan rotasi/revoke meskipun file tersebut kemudian dihapus.
- [ ] Validasi dan sanitasi semua input pada server.
- [ ] Gunakan parameterized query atau ORM yang aman untuk mencegah SQL/NoSQL injection.
- [ ] Terapkan rate limiting pada form publik dan endpoint API.
- [ ] Gunakan perlindungan CSRF jika autentikasi menggunakan cookie.
- [ ] Jika tersedia dashboard admin, gunakan password hashing modern, MFA bila memungkinkan, session expiration, secure cookie, dan perlindungan brute-force.

### Tinggi — sangat disarankan

- [ ] Aktifkan HSTS setelah HTTPS dipastikan berjalan dengan benar.
- [ ] Konfigurasikan Content Security Policy (CSP).
- [ ] Gunakan `X-Content-Type-Options: nosniff`.
- [ ] Gunakan `Referrer-Policy: strict-origin-when-cross-origin`.
- [ ] Gunakan `Permissions-Policy` untuk menonaktifkan fitur browser yang tidak diperlukan.
- [ ] Gunakan `frame-ancestors 'none'` atau perlindungan clickjacking yang setara.
- [ ] Cookie harus menggunakan `Secure`, `HttpOnly`, dan `SameSite` yang sesuai.
- [ ] Selalu perbarui Node.js/Python/framework/library yang digunakan.
- [ ] Gunakan dependency/security scanning pada CI.
- [ ] Batasi CORS hanya ke origin yang diperlukan.
- [ ] Jangan tampilkan stack trace, path server, error database, token, atau informasi environment kepada pengunjung.
- [ ] Nonaktifkan directory listing jika tidak diperlukan.

### Sedang — penguatan

- [ ] Batasi ukuran request/form/API.
- [ ] Validasi email dan nomor telepon di server.
- [ ] Batasi panjang deskripsi proyek.
- [ ] Tambahkan CAPTCHA/bot protection jika terjadi spam.
- [ ] Catat aktivitas keamanan tanpa menyimpan password, token, atau data pribadi yang tidak diperlukan.
- [ ] Siapkan backup database dan uji proses restore secara berkala.
- [ ] Tinjau script pihak ketiga dan hapus dependency yang tidak digunakan.
- [ ] Gunakan Subresource Integrity (SRI) untuk resource pihak ketiga jika sesuai.

## 4. Security Header yang Direkomendasikan

Contoh baseline:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'
```

**Penting:** CSP harus disesuaikan dengan script, style, gambar, font, API, WhatsApp, analytics, dan integrasi yang benar-benar digunakan website. Jangan menerapkan CSP terlalu ketat tanpa pengujian karena dapat membuat fungsi website rusak.

## 5. HTTPS dan TLS

- [ ] Alihkan HTTP ke HTTPS.
- [ ] Pastikan sertifikat SSL/TLS valid dan diperbarui otomatis.
- [ ] Nonaktifkan TLS versi lama dan cipher yang lemah pada hosting/proxy.
- [ ] Pastikan semua aset menggunakan HTTPS.
- [ ] Aktifkan HSTS setelah HTTPS dipastikan stabil.

## 6. Keamanan Form Estimasi

Form estimasi adalah salah satu titik serangan publik utama.

Pemrosesan server sebaiknya:

1. Memvalidasi semua field wajib.
2. Memberlakukan panjang maksimum.
3. Menormalisasi email dan nomor telepon.
4. Menolak field yang tidak dikenal jika memungkinkan.
5. Melakukan escaping ketika data ditampilkan.
6. Menerapkan rate limiting.
7. Menggunakan perlindungan spam/bot bila diperlukan.
8. Tidak menyimpan data pribadi jika tidak diperlukan.
9. Membatasi akses terhadap data yang tersimpan.
10. Tidak memasukkan input pengguna secara langsung ke HTML, SQL, shell command, atau JavaScript tanpa encoding yang sesuai.

Jika form hanya membuat pesan WhatsApp di sisi client, pastikan input pengguna tidak dapat merusak URL atau menyisipkan JavaScript berbahaya.

## 7. Keamanan Integrasi WhatsApp

Saat membuat URL WhatsApp dari input pengguna:

- [ ] Gunakan URL encoding.
- [ ] Jangan memasukkan input mentah ke atribut HTML atau JavaScript.
- [ ] Jangan mempercayai harga yang dihitung di client sebagai harga final.
- [ ] Jika estimasi diproses di server, hitung harga final di server.

## 8. Keamanan Estimator / Harga

Semua nilai dari frontend harus dianggap **tidak tepercaya**.

Jika estimator nantinya terhubung ke API, database, pembayaran, atau order:

- [ ] Hitung ulang harga di server.
- [ ] Validasi ID paket dan fitur terhadap data yang diizinkan.
- [ ] Jangan menerima total harga dari client sebagai harga final.
- [ ] Gunakan ID quotation daripada menyimpan data pribadi di URL bila memungkinkan.

## 9. Keamanan API

Untuk REST API/backend:

- [ ] Endpoint sensitif harus memiliki autentikasi.
- [ ] Setiap operasi sensitif harus memiliki authorization di server.
- [ ] Terapkan rate limiting.
- [ ] Validasi parameter JSON, query, path, dan body.
- [ ] Batasi ukuran request.
- [ ] Batasi HTTP method yang diperbolehkan.
- [ ] Konfigurasikan CORS secara spesifik.
- [ ] Jangan mengembalikan field database internal.
- [ ] Gunakan pagination dan limit.
- [ ] Terapkan timeout pada request keluar.
- [ ] Lindungi dari SSRF jika server mengambil URL dari input pengguna.
- [ ] Jangan mengembalikan error internal yang sensitif.

## 10. Keamanan Database

Jika menggunakan MongoDB, PostgreSQL, atau database lain:

- [ ] Database jangan dapat diakses publik kecuali memang diperlukan.
- [ ] Gunakan akun database dengan prinsip least privilege.
- [ ] Simpan password database melalui environment/secret management.
- [ ] Gunakan TLS untuk koneksi database jarak jauh jika tersedia.
- [ ] Validasi data sebelum penyimpanan.
- [ ] Gunakan parameterized query/ORM yang aman.
- [ ] Enkripsi backup.
- [ ] Uji restore secara berkala.
- [ ] Hapus user database yang tidak digunakan.

## 11. Keamanan Git / Repository

Gunakan `.gitignore` seperti:

```gitignore
.env
.env.*
!.env.example

*.pem
*.key
*.p12
*.pfx

.vscode/
.idea/

node_modules/

dist/
build/
.next/

*.log

.DS_Store
Thumbs.db
```

`.env.example` boleh berisi nama variabel tanpa kredensial asli.

## 12. Keamanan Dependency

Untuk project Node.js:

```bash
npm audit
npm outdated
```

Gunakan dependency update otomatis dan security scanning pada CI jika memungkinkan.

Jangan melakukan upgrade dependency production secara sembarangan tanpa testing.

## 13. Keamanan Autentikasi dan Admin

Jika tersedia dashboard/admin:

- [ ] Gunakan Argon2id, bcrypt, atau password hashing modern.
- [ ] Jangan menyimpan password plaintext.
- [ ] Aktifkan MFA bila memungkinkan.
- [ ] Terapkan rate limiting login.
- [ ] Gunakan cookie `Secure`, `HttpOnly`, dan `SameSite`.
- [ ] Regenerasi session ID setelah login.
- [ ] Terapkan session expiration.
- [ ] Sediakan logout yang aman.
- [ ] Gunakan role/permission dengan prinsip least privilege.
- [ ] Catat aktivitas admin yang penting.

## 14. Privasi

Form estimasi dapat mengumpulkan data pribadi.

Disarankan:

- [ ] Kumpulkan hanya data yang diperlukan.
- [ ] Sediakan privacy policy jika data disimpan.
- [ ] Tentukan masa penyimpanan data.
- [ ] Batasi akses terhadap data pelanggan.
- [ ] Jangan masukkan data pribadi ke log secara tidak perlu.
- [ ] Jangan menampilkan data form melalui URL publik atau source frontend.

## 15. Monitoring Keamanan

Pantau setidaknya:

- Error HTTP 4xx/5xx.
- Login gagal berulang.
- Lonjakan pengiriman form.
- Pelanggaran rate limit.
- Error API yang tidak normal.
- Peringatan dependency/security.
- Masa berlaku SSL/TLS.
- Keberhasilan/kegagalan backup.

## 16. Checklist Deployment

Sebelum deployment production:

- [ ] HTTPS sudah diverifikasi.
- [ ] Secret tidak berada di Git.
- [ ] Dependency telah diperiksa.
- [ ] Security header telah diverifikasi.
- [ ] CORS telah diperiksa.
- [ ] Validasi form telah diuji.
- [ ] Rate limiting telah diuji.
- [ ] Error response tidak membocorkan informasi.
- [ ] Environment variables production telah diperiksa.
- [ ] Permission database telah diperiksa.
- [ ] Backup telah diverifikasi.
- [ ] Rencana rollback tersedia.

## 17. Pengujian Keamanan

Untuk website milik sendiri atau yang Anda memiliki izin untuk mengujinya, prioritaskan:

- [ ] Pemeriksaan konfigurasi TLS.
- [ ] Pemeriksaan security header.
- [ ] Dependency scanning.
- [ ] Pengujian authentication/authorization.
- [ ] Pengujian validasi input.
- [ ] Pengujian XSS.
- [ ] Pengujian CSRF jika relevan.
- [ ] Pengujian SQL/NoSQL injection.
- [ ] Pengujian rate limiting.
- [ ] Pengujian upload file jika fitur upload tersedia.
- [ ] Pengujian SSRF jika website mengambil URL dari pengguna.
- [ ] Pengujian access control pada API/admin.

**Hanya lakukan pengujian terhadap sistem dan akun yang Anda miliki atau yang Anda memiliki izin untuk mengujinya.**

## 18. Pelaporan Kerentanan

Jika menemukan kerentanan keamanan pada website ini, laporkan secara privat melalui:

**Email:** srilexbuditra@gmail.com

Sertakan:

- Deskripsi singkat.
- URL/endpoint yang terdampak.
- Langkah reproduksi.
- Perilaku yang diharapkan dan yang terjadi.
- Dampak keamanan.
- Screenshot/log jika diperlukan.
- Saran perbaikan jika tersedia.

Jangan mempublikasikan credential, data pribadi, access token, atau proof-of-concept yang dapat dieksploitasi sebelum masalah ditangani.

## 19. Catatan Peninjauan

Dokumen ini dibuat berdasarkan peninjauan website publik `https://srilexbuditra.work`.

Audit keamanan lengkap membutuhkan akses ke:

- Source code frontend.
- Source code backend/API.
- `package.json` dan lock file atau file dependency Python.
- Konfigurasi hosting.
- Konfigurasi reverse proxy/CDN.
- Nama environment variables.
- Konfigurasi database.
- Kode authentication/authorization.
- Konfigurasi CI/CD.

**Penting:** Tidak adanya suatu kontrol di dokumen ini bukan bukti bahwa website rentan atau kontrol tersebut tidak diterapkan. Kontrol tersebut perlu diverifikasi.

---

**Standar keamanan:** Penguatan keamanan defensif yang selaras dengan OWASP  
**Pemilik:** Srilex Buditra  
**Website:** https://srilexbuditra.work
