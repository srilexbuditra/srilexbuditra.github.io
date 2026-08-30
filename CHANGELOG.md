# CHANGELOG

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

## [2026-08-30] — Legal TOC Sticky V2

### Fixed
- Memperbaiki daftar isi (`.legal-sidebar`) agar tetap sticky saat artikel legal di-scroll pada laptop/desktop.
- Menghindari `overflow-x: hidden` pada `html`/`body` yang dapat mengganggu perilaku CSS `position: sticky`.
- Memastikan ancestor `.legal-page`, `.legal-content-section`, `.legal-layout`, dan `.legal-article` tidak menjadi scroll container pada desktop.
- Menambahkan batas tinggi daftar isi agar tetap nyaman jika tinggi viewport desktop pendek.
- Pada tablet/mobile, daftar isi tetap kembali ke layout normal dan tidak dipaksa sticky.

### Affected Pages
- `security.html`
- `privacy.html`
- `terms.html`
- `term.html`

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
