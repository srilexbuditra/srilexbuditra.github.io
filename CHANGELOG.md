# V3 — Print/PDF Layout Fix
- Memperbaiki clipping dan elemen fixed/sticky yang menutupi halaman saat Cetak / Simpan PDF.
- Menambahkan reset overflow/height/position khusus print.

## V2 — Privacy Consent Responsive

- Normalized checkbox appearance across Firefox, Chromium, Safari, and mobile browsers.
- Added 44px touch target and keyboard focus treatment.
- Prevented consent text/button overflow on narrow screens.
- Added defensive consent checks to WhatsApp and PDF handlers.

## 2026-09-01 — Privacy Consent Gate
- Menambahkan checkbox persetujuan Kebijakan Privasi pada panel hasil formulir estimasi.
- Mengunci tombol **Kirim ke WhatsApp** dan **Cetak / Simpan PDF** sampai checkbox dicentang.
- Menambahkan kontrol JavaScript untuk mengaktifkan/nonaktifkan kedua tombol secara real-time.
- Menambahkan styling responsif dan status disabled yang jelas.
- Menambahkan dokumentasi `PRIVACY_CONSENT_FORM.md`.

# V11.5.2 — Performance Implementation Synchronization Fix

## [2026-09-01]

### Diperbaiki
- Menyinkronkan atribut `defer` pada script homepage dengan strategi V11.5.1.
- Menambahkan dimensi eksplisit dan prioritas loading pada gambar hero/profile.
- Menambahkan dimensi eksplisit pada logo yang digunakan di header dan footer.
- Menambahkan dokumentasi `PERFORMANCE_V11.5.2.md` untuk membedakan target V11.5.1 dan implementasi aktual.

## V11.5.1 — Critical Loading & Performance Strategy
- Added deferred loading for homepage scripts.
- Prioritized hero/profile image and explicit intrinsic dimensions.
- Added performance implementation notes.

# Catatan Perubahan

Semua perubahan penting pada situs web dan portofolio **Srilex Buditra** dicatat dalam dokumen ini.

## [Belum Dirilis]

### Direncanakan
- Penyempurnaan responsivitas pada berbagai ukuran layar.
- Peningkatan aksesibilitas dan performa.
- Penyempurnaan portofolio dan studi kasus.
- Perbaikan berkelanjutan pada pengalaman pengguna.

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

## [2026-08-26]

### Ditambahkan
- Penyempurnaan tampilan portofolio dengan nuansa premium dan sinematik.
- Struktur presentasi proyek dan studi kasus.
- Elemen interaktif untuk meningkatkan pengalaman visual.

### Diubah
- Tata letak responsif dan presentasi visual.
- Navigasi serta penyajian proyek portfolio.

## Catatan

Catatan perubahan akan diperbarui setiap kali terdapat fitur, perbaikan, perubahan desain, atau pembaruan dokumentasi yang signifikan.


## V5 — Premium Agreement & Print Isolation
- Print/PDF mode now isolates only the estimate document, preventing page overlays, sticky UI, or hidden sections from covering content.
- Added a professional project-agreement summary with privacy consent, scope acknowledgement, and two signature pads (provider + client).
- Action buttons require privacy consent, agreement acknowledgement, and both signatures.
- Added responsive pointer-based signature input for desktop and touch devices.
- PDF includes signature images, signer name, dates, reference number, and agreement disclaimer.
- The signature feature is an electronic acknowledgement in the form; it does not by itself guarantee legal enforceability of a contract.

## V7 — Mobile Contract Signature Refinement
- Pihak Pertama memakai tanda tangan digital yang sudah disiapkan; tidak ada input tanda tangan Pihak Pertama di modal.
- Signature pad Pihak Kedua diperbaiki untuk perangkat touch/mobile dengan pointer capture, DPR-aware sizing, dan ResizeObserver.
- Modal persetujuan dioptimalkan untuk mobile dengan `100dvh`, tanpa horizontal overflow, spacing lebih ringkas, dan tombol yang lebih mudah disentuh.


## V11 — Inline SVG Signature Print Reliability
- Added inline SVG rendering for Pihak Kedua signature in the print document.
- Canvas signature is snapshotted immediately before print and embedded into SVG.
- Kept PNG image fallback while using SVG as the primary print representation.
- Print CSS forces the signature SVG to remain visible and prevents late image rendering from hiding it.
