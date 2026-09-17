# Dashboard Design System — Umroh Semi Private Bengkulu

Status: **V1.3 Final Polish — kandidat Visual V1 Locked setelah uji pengguna**

## 1. Model Dashboard

### Admin — Adaptive Workspace

Tujuan: membantu admin mengetahui apa yang harus ditindaklanjuti, bukan hanya menampilkan statistik.

- Sidebar: compact/wide pada desktop, drawer pada tablet/mobile.
- Topbar: pencarian, notifikasi, identitas/role.
- Workspace: statistik utama, "Perlu Perhatian", status kesiapan, agenda, aktivitas.
- Subfitur menggunakan contextual tabs agar sidebar tidak menjadi terlalu panjang.

### Jemaah — Journey Dashboard

Tujuan: menjawab tiga pertanyaan utama jemaah:

1. Saya sekarang ada di tahap apa?
2. Apa yang harus saya lakukan berikutnya?
3. Informasi perjalanan terdekat apa yang harus saya ketahui?

- Progress persiapan menjadi elemen utama.
- "Tahap Berikutnya" harus terlihat tanpa mencari menu.
- Akses cepat: Manasik, Checklist, Agenda, Dokumen.
- Mobile menggunakan bottom navigation untuk fitur utama.

## 2. Breakpoints

- Desktop: `> 900px` — sidebar tersedia, dapat diringkas.
- Tablet/Mobile: `<= 900px` — sidebar menjadi drawer.
- Mobile Jemaah: `<= 760px` — bottom navigation aktif.

## 3. Shared Components

- Sidebar
- Topbar
- Card
- Stats
- Badge/Status
- Search
- Context Tabs
- Alert/Notice
- Loading state
- Empty state
- Error state
- Permission state
- Session-expired state

## 4. State yang Wajib Disediakan

Setiap modul wajib memiliki desain untuk:

1. Loading
2. Data tersedia
3. Data kosong
4. Error
5. Tidak memiliki izin
6. Session berakhir

## 5. Branding

Identitas platform utama: **Umroh Semi Private Bengkulu**.

Srilex Buditra tidak ditampilkan sebagai pengganti identitas program. Kredit yang digunakan:

**Pengembangan Sistem & Dukungan Teknologi — Srilex Buditra**

## 6. Warna

Karakter: tenang, premium, profesional, tidak berlebihan.

- Deep teal/navy: struktur dan navigasi.
- Warm gold: aksen utama.
- Cream/white: surface.
- Green: sukses.
- Amber: perhatian.
- Red: masalah/risiko.
- Blue: informasi.

Nilai warna tersentralisasi di `assets/css/tokens.css` agar perubahan brand tidak memerlukan pencarian manual di seluruh CSS.

## 7. Aturan Sebelum Backend

Urutan wajib:

`Design System → Admin Prototype → Jemaah Prototype → Responsive Test → Visual V1 Locked → Auth/Session → Database/API → Feature Integration`

Jangan memasukkan data jemaah asli, credential, token, API key, atau secret ke prototype/front-end publik.
