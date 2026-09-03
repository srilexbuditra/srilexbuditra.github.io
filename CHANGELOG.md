# CHANGELOG

Semua perubahan penting pada website dan modul terkait **Srilex Buditra — Full Stack Developer** dicatat dalam dokumen ini.

Dokumen ini menggunakan dua riwayat versi agar nomor versi website utama tidak tercampur dengan nomor versi pengembangan modul **Project Estimator & Secure Document**.

---

## A. Versi Website Utama

### V11.6 — Repository Audit, Search Accessibility & Verification Hardening
**3 September 2026**

#### Diubah
- Menyelesaikan audit menengah repository dan merapikan aset duplikat pada proyek Website Sekolah.
- Mengarahkan preview Website Sekolah V2 ke aset canonical utama agar tidak menyimpan salinan yang tidak diperlukan.
- Menyempurnakan komponen pencarian website, termasuk autocomplete, riwayat pencarian, pencarian populer, navigasi keyboard, dan sinkronisasi status ARIA.
- Mempertahankan `search-enhancer.js` sebagai enhancement terpisah tanpa mengubah alur halaman hasil pencarian utama.

#### Diperbaiki
- Menghapus aset preview Website Sekolah V2 yang duplikat/besar dan memastikan referensi internal tetap valid.
- Menyempurnakan state awal dan pembaruan `aria-expanded`, `aria-controls`, `aria-activedescendant`, `role="option"`, serta pengelolaan fokus pada saran pencarian.
- Memperkuat kompatibilitas fitur pencarian pada desktop dan perangkat mobile.

#### Keamanan & Verifikasi
- Menambahkan backend verifikasi opsional berbasis Cloudflare Worker + KV untuk penerbitan dan pembacaan data dokumen terverifikasi.
- Menambahkan dukungan publisher token pada endpoint penerbitan dokumen.
- Mempertahankan fallback database statis `verify/data/documents.json` ketika API publisher tidak dikonfigurasi.

#### Dokumentasi
- Menambahkan `AUDIT_MENENGAH_V11.6.md`.
- Memperbarui dokumentasi database/verifikasi dokumen melalui `VERIFY_DATABASE_README.md`.
- Menambahkan `DOCUMENTATION.md` sebagai indeks dokumentasi repository dan `DOCUMENTATION_AUDIT_V11.6.md` sebagai catatan audit dokumentasi V11.6.
- Memindahkan enam engineering notes historis ke `docs/archive/` setelah referensi internal diverifikasi.
- Memperbarui tautan dokumentasi agar catatan historis tetap dapat diakses tanpa memenuhi root repository.

### V11.5.2 — Performance Implementation Synchronization Fix
**1 September 2026**

#### Diubah
- Menyinkronkan implementasi performa yang sebelumnya direncanakan pada V11.5.1 ke source aktual.
- Menambahkan `defer` pada script homepage:
  - `script.js`
  - `search-enhancer.js`
  - `tts.js`

#### Diperbaiki
- Menambahkan dimensi intrinsik pada gambar hero/profile.
- Menambahkan `fetchpriority="high"` pada kandidat gambar hero/LCP.
- Menambahkan `decoding="async"` pada gambar hero/profile.
- Menambahkan dimensi eksplisit dan `decoding="async"` pada logo yang digunakan di header dan footer.

#### Dokumentasi
- Menambahkan `PERFORMANCE_V11.5.2.md`.
- Menyinkronkan status implementasi V11.5.1 agar tidak menimbulkan klaim yang tidak sesuai dengan source aktual.

---

### V11.5.1 — Critical Loading & Performance Strategy
**1 September 2026**

#### Strategi dan Target
- Menetapkan strategi pemuatan JavaScript non-kritis menggunakan `defer`.
- Menetapkan prioritas pemuatan gambar hero/LCP.
- Menetapkan penggunaan dimensi intrinsik untuk membantu stabilitas layout.
- Mempertahankan lazy loading untuk gambar portfolio di bawah area awal halaman.
- Meninjau strategi pemuatan fitur TTS, pencarian, dan fitur interaktif lainnya.

> **Catatan:** Sinkronisasi penuh strategi V11.5.1 ke implementasi source aktual diselesaikan pada **V11.5.2**.

---

### V11.4 — Asset Architecture & Performance Cleanup

#### Diubah
- Merapikan arsitektur aset website.
- Meninjau aset besar dan aset yang berpotensi tidak diperlukan.
- Mengoptimalkan struktur aset untuk mendukung pemeliharaan dan performa.

#### Dokumentasi
- Menambahkan dokumentasi arsitektur dan audit aset:
  - `ASSET_ARCHITECTURE_V11.4.md`
  - `ASSET_OPTIMIZATION_AUDIT.md`

---

## B. Riwayat Modul Project Estimator & Secure Document

> Nomor versi pada bagian ini adalah riwayat pengembangan modul. Nomor tersebut **bukan** versi keseluruhan website.

### V31 — Balanced Vertical Signature Cards
**3 September 2026**

#### Diperbaiki
- Menyeimbangkan posisi vertikal isi kartu tanda tangan pada hasil Print/PDF.
- Menjaga nama, tanggal, dan tanda tangan tetap berada pada safe area kartu A4.

---

### V30 — Secure Verification Publisher & Signature Normalization
**3 September 2026**

#### Ditambahkan
- Menambahkan Cloudflare Worker + KV sebagai backend verifikasi dokumen opsional.
- Menambahkan endpoint penerbitan dokumen dengan autentikasi `PUBLISHER_TOKEN`.
- Menambahkan dukungan `SB_VERIFY_API` pada estimator untuk mengirim record dokumen ketika backend dikonfigurasi.

#### Diperbaiki
- Menormalisasi stage tanda tangan pada mode Print/PDF agar ukuran dan posisi kedua pihak lebih konsisten.

---

### V29 — Local Verification QR & Larger Signatures
**3 September 2026**

#### Diubah
- Mengganti ketergantungan QR eksternal dengan QR SVG inline yang dibuat sepenuhnya di browser.
- Memastikan QR verifikasi tetap dapat dirender pada Chrome, browser mobile, in-app browser, dan print engine tanpa host gambar eksternal.
- Memperbesar tanda tangan pada hasil Print/PDF tanpa menambah tinggi kartu A4.

---

### V28 — Professional Verification QR & Signature Alignment

#### Diperbaiki
- Menetapkan QR verifikasi profesional berukuran sekitar 3 cm × 3 cm pada dokumen cetak.
- Menyempurnakan ukuran dan optical centering tanda tangan pada kartu Print/PDF.

---

### V27 — Document Verification QR & Database

#### Ditambahkan
- Menambahkan QR verifikasi pada Project Cost Estimate yang mengarah ke `/verify/?id=DOCUMENT_ID`.
- Menambahkan database statis `verify/data/documents.json` sebagai fallback verifikasi pada deployment statis.
- Menambahkan dokumentasi `VERIFY_DATABASE_README.md`.

---

### V24 — Signature Card Height & Caption Safe Zone

#### Diperbaiki
- Menyetarakan tinggi kartu tanda tangan dan menyediakan safe zone untuk caption agar tidak menyentuh outline kartu.

---

### V23 — Signature Date Safe Alignment

#### Diperbaiki
- Memisahkan baris tanda tangan, nama, dan tanggal agar kedua kartu tetap simetris dan teks tidak bertabrakan dengan batas kartu.

---

### V22 — Print Signature Caption Alignment

#### Diperbaiki
- Memusatkan caption dan identitas pada kedua kartu tanda tangan khusus mode Print/PDF.

---

### V21 — Readable A4 Portrait One-Page

#### Diubah
- Menyesuaikan engine cetak agar tetap satu halaman A4 portrait dengan tipografi yang lebih mudah dibaca.
- Menggunakan pengukuran tinggi report aktual dan skala minimum adaptif untuk perbedaan print engine antar-browser.

---

### V20 — A4 Portrait One-Page Print

#### Diubah
- Mengubah canvas Print/PDF menjadi A4 portrait satu halaman dengan margin cetak terkontrol.
- Menjaga tampilan layar dan Secure Document tetap tidak berubah.

---

### V19 — A4 One-Page Print Engine

#### Diubah
- Mengembangkan strategi cetak/PDF satu halaman lintas browser menggunakan ukuran fisik A4 dan penyesuaian skala.
- Menyempurnakan tata letak khusus mode cetak tanpa mengubah tampilan utama website.

---

### V18 — A4 Single-Page Print Canvas

#### Diubah
- Menambahkan canvas cetak A4 satu halaman sebagai tahap awal optimasi estimator untuk Print/Save PDF.

---

### V17 — Official Payment Accounts

#### Ditambahkan
- Menambahkan bagian rekening pembayaran resmi pada Project Cost Estimate.
- Menambahkan kartu bank dan catatan pembayaran khusus dokumen estimator.

---

### V16 — Official Logo in PDF Header

#### Diubah
- Mengganti brand mark pada header PDF dengan logo resmi Srilex Buditra tanpa mengubah layout dokumen lainnya.

---

### V14 — Responsive Print & Signature Geometry Fix

#### Diperbaiki
- Menyempurnakan responsivitas layout cetak.
- Memperbaiki geometri dan posisi tanda tangan pada hasil cetak/PDF.

---

### V11 — Inline SVG Signature Print Reliability

#### Diperbaiki
- Meningkatkan keandalan rendering tanda tangan menggunakan pendekatan SVG inline pada mode cetak/PDF.

---

### V7 — Mobile Contract Signature Refinement

#### Diperbaiki
- Menyempurnakan pengalaman tanda tangan kontrak pada perangkat mobile.
- Menyesuaikan interaksi dan tampilan area tanda tangan agar lebih responsif.

---

### V5 — Premium Agreement & Print Isolation

#### Ditambahkan
- Pengembangan acknowledgement/persetujuan pada dokumen estimator.
- Isolasi elemen tertentu untuk mode cetak/PDF agar hasil dokumen lebih terfokus.

---

### V3 — Print/PDF Layout Fix

#### Diperbaiki
- Memperbaiki tata letak mode Print/PDF.
- Menyempurnakan elemen dokumen agar lebih stabil saat dicetak atau disimpan sebagai PDF.

---

### V2 — Privacy Consent Responsive

#### Diperbaiki
- Menyempurnakan tampilan dan perilaku Privacy Consent agar responsif pada desktop dan mobile.

---

### Privacy Consent Gate
**1 September 2026**

#### Ditambahkan
- Checkbox persetujuan privasi sebagai kontrol sebelum tindakan tertentu dilanjutkan.
- Kontrol JavaScript untuk memantau status persetujuan secara real-time.
- Penguncian tindakan terkait WhatsApp dan Print/PDF sampai persetujuan yang diperlukan diberikan.
- Styling responsif untuk komponen persetujuan privasi.
- Dokumentasi `PRIVACY_CONSENT_FORM.md`.

---

## Prinsip Penomoran Versi

- **Versi Website Utama** menggunakan riwayat versi keseluruhan proyek, misalnya `V11.4`, `V11.5.1`, dan `V11.5.2`.
- **Versi Modul Project Estimator & Secure Document** mempertahankan riwayat pengembangan internal modul, misalnya `V2`, `V3`, `V5`, `V7`, `V11`, `V14`, `V16`–`V24`, dan `V27`–`V31`.
- Kedua sistem versi dipisahkan agar tidak menimbulkan kesan bahwa `V31` adalah versi keseluruhan website yang lebih baru daripada `V11.6`.

---

## Catatan

- Urutan entri pada setiap bagian disusun dari perubahan terbaru ke perubahan sebelumnya.
- Dokumentasi teknis yang lebih rinci tersedia pada file dokumentasi terkait di repository.
- Perubahan desain atau implementasi besar sebaiknya dicatat pada bagian versi yang sesuai agar riwayat repository tetap mudah diaudit.
