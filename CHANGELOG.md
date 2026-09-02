# CHANGELOG

Semua perubahan penting pada website dan modul terkait **Srilex Buditra — Full Stack Developer** dicatat dalam dokumen ini.

Dokumen ini menggunakan dua riwayat versi agar nomor versi website utama tidak tercampur dengan nomor versi pengembangan modul **Project Estimator & Secure Document**.

---

## A. Versi Website Utama

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

### V19 — A4 One-Page Print Engine

#### Diubah
- Mengembangkan strategi cetak/PDF agar dokumen estimator lebih terkontrol dalam format A4 satu halaman.
- Menyempurnakan tata letak khusus mode cetak tanpa mengubah tampilan utama website.

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
- **Versi Modul Project Estimator & Secure Document** mempertahankan riwayat pengembangan internal modul, misalnya `V2`, `V3`, `V5`, `V7`, `V11`, `V14`, dan `V19`.
- Kedua sistem versi dipisahkan agar tidak menimbulkan kesan bahwa `V19` adalah versi keseluruhan website yang lebih baru daripada `V11.5.2`.

---

## Catatan

- Urutan entri pada setiap bagian disusun dari perubahan terbaru ke perubahan sebelumnya.
- Dokumentasi teknis yang lebih rinci tersedia pada file dokumentasi terkait di repository.
- Perubahan desain atau implementasi besar sebaiknya dicatat pada bagian versi yang sesuai agar riwayat repository tetap mudah diaudit.
