# CHANGELOG

## [2026-08-30] — Legal TOC Desktop Sticky Fix

### Fixed
- Memperbaiki `DAFTAR ISI` pada `security.html`, `privacy.html`, `terms.html`, dan `term.html` agar tetap menempel pada viewport saat artikel di-scroll pada laptop/desktop.
- Mengganti `body` horizontal overflow dari `hidden` menjadi `clip` agar tidak membuat scrolling mechanism yang mengganggu `position: sticky`.
- Memastikan ancestor legal (`.legal-page`, `.legal-content-section`, `.legal-layout`, `.legal-sidebar`) tidak menjadi scroll container pada desktop.
- Mempertahankan perilaku mobile/tablet: daftar isi tetap normal dan tidak dipaksa sticky.


Semua perubahan penting pada website **Srilex Buditra** dicatat di file ini.

## [2026-08-30] — Mobile Responsive Layout V6

### Fixed
- Memperbaiki masalah **horizontal overflow** pada perangkat mobile.
- Mencegah halaman bergeser ke kanan/kiri ketika pengguna melakukan swipe satu jari.
- Membatasi elemen halaman agar tidak melewati lebar viewport.
- Memperbaiki perilaku grid/kartu layanan pada layar smartphone.
- Menyesuaikan spacing dan ukuran elemen agar lebih nyaman disentuh menggunakan jari.
- Mengurangi kemungkinan elemen seperti card, form, navigasi, dan konten lebar menyebabkan `body` melebar.
- Memastikan scroll utama tetap fokus pada arah vertikal.

### Improved
- Tampilan kartu layanan dibuat lebih nyaman dan rapi pada mobile.
- Radius, jarak, dan efek visual kartu disempurnakan agar terlihat lebih modern/premium.
- Area interaksi mobile dibuat lebih aman untuk penggunaan touchscreen.
- Responsivitas diperkuat untuk smartphone dengan viewport sempit.
- Pinch-to-zoom tetap diperbolehkan agar aksesibilitas pengguna tidak terganggu.

### Touch & Navigation
- Menggunakan perilaku touch yang memprioritaskan **vertical scrolling**.
- Horizontal page movement tidak lagi menjadi jalur navigasi utama pada mobile.
- Navigasi dan komponen floating/TTS dipertahankan agar tidak mengganggu konten.

### Compatibility
- Desktop: layout tetap dipertahankan.
- Tablet: layout responsif tetap didukung.
- Mobile: layout difokuskan pada satu kolom dan lebar viewport.
- Tidak menghapus fitur utama website, SEO, Schema, portfolio, estimator, navigasi, maupun TTS.

## [2026-08-29] — Legal & Visual Refinement

- Penyempurnaan halaman legal dan struktur visual website.
- Penyesuaian tampilan agar lebih konsisten dengan identitas visual website.

---

## Format Versi

- **Fixed** — perbaikan bug atau masalah tampilan/fungsi.
- **Improved** — peningkatan pengalaman pengguna atau performa visual.
- **Added** — fitur baru.
- **Changed** — perubahan perilaku atau struktur yang sudah ada.
- **Removed** — fitur yang dihapus.
