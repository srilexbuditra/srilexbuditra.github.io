# Changelog

Semua perubahan penting pada situs web dan portofolio **Srilex Buditra** dicatat dalam dokumen ini.

Dokumen ini menggunakan kategori perubahan berikut:

- **Ditambahkan** — fitur, file, atau dokumentasi baru.
- **Diubah** — perubahan perilaku, struktur, atau implementasi yang sudah ada.
- **Diperbaiki** — perbaikan bug, konsistensi, atau masalah teknis.
- **Dihapus** — komponen yang sengaja dihapus.

---

## [Belum Dirilis]

### Direncanakan
- Penyempurnaan responsivitas pada berbagai ukuran layar.
- Peningkatan aksesibilitas dan performa berdasarkan hasil audit terbaru.
- Penyempurnaan portofolio dan studi kasus.
- Perbaikan berkelanjutan pada pengalaman pengguna.

---

## [V11.5.2] — 2026-09-01
### Performance Implementation Synchronization Fix

### Diperbaiki
- Menyinkronkan implementasi aktual dengan strategi performa yang sebelumnya didokumentasikan pada V11.5.1.
- Menambahkan atribut `defer` pada script homepage yang relevan untuk mendukung strategi pemuatan non-blocking.
- Menambahkan dimensi intrinsik eksplisit pada gambar hero/profile untuk membantu stabilitas layout.
- Menambahkan `fetchpriority="high"` pada gambar hero/profile sebagai kandidat aset penting pada initial render.
- Menambahkan `decoding="async"` pada gambar hero/profile.
- Menambahkan dimensi eksplisit dan `decoding="async"` pada logo yang digunakan di header dan footer.
- Menyelaraskan dokumentasi agar klaim optimasi sesuai dengan implementasi source aktual.

### Ditambahkan
- `PERFORMANCE_V11.5.2.md` sebagai dokumentasi khusus perbaikan sinkronisasi implementasi performa.

---

## [V11.5.1] — 2026-09-01
### Critical Loading & Performance Strategy

### Diubah
- Menetapkan strategi optimasi critical loading untuk homepage.
- Mendokumentasikan prioritas pemuatan gambar hero/profile dan penggunaan dimensi intrinsik.
- Mendokumentasikan strategi `defer` untuk script homepage yang tidak bersifat kritis.

### Catatan
- Implementasi teknis yang sepenuhnya menyinkronkan strategi ini dengan source aktual diselesaikan pada **V11.5.2**.

---

## [V11.4] — 2026-08-31
### Asset Architecture & Performance Cleanup

### Diubah
- Menata ulang arsitektur aset secara terkontrol untuk mengurangi duplikasi dan beban repository.
- Mengonsolidasikan aset Website Sekolah ke sumber aset utama yang digunakan.
- Membersihkan aset legacy/duplikat yang telah dipastikan tidak lagi diperlukan.
- Mengurangi ketergantungan gambar eksternal dengan menggunakan aset lokal pada area yang relevan.

### Ditambahkan
- `ASSET_ARCHITECTURE_V11.4.md` untuk mendokumentasikan prinsip dan hasil penataan aset.

---

## [2026-08-31]

### Ditambahkan
- Sistem fallback halaman 404 untuk beberapa jalur portfolio bertingkat.
- Dokumentasi berbahasa Indonesia untuk Ketentuan Penggunaan, Kebijakan Privasi, dan Kebijakan Keamanan.
- Struktur catatan perubahan yang lebih teratur.

### Diubah
- Referensi stylesheet halaman 404 menggunakan path absolut agar lebih aman pada URL bertingkat.
- Penyusunan ulang dokumentasi agar lebih jelas dan konsisten.
- Penjelasan mengenai layanan pihak ketiga, hak kekayaan intelektual, privasi, dan pelaporan keamanan diperjelas.

### Diperbaiki
- Penanganan halaman yang tidak ditemukan pada beberapa subfolder portfolio.
- Risiko stylesheet 404 tidak ditemukan ketika halaman diakses dari jalur bertingkat.
- Konsistensi dokumentasi proyek.

---

## [2026-08-26]

### Ditambahkan
- Penyempurnaan tampilan portofolio dengan nuansa premium dan sinematik.
- Struktur presentasi proyek dan studi kasus.
- Elemen interaktif untuk meningkatkan pengalaman visual.

### Diubah
- Tata letak responsif dan presentasi visual.
- Navigasi serta penyajian proyek portfolio.

---

## Catatan

`CHANGELOG.md` diperbarui setiap kali terdapat fitur, perbaikan, perubahan desain, perubahan performa, perubahan keamanan, atau pembaruan dokumentasi yang signifikan.
