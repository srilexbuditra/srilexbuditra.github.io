# Schema.org Microdata Fix Report

Perbaikan dilakukan tanpa mengubah CSS, JavaScript, teks visual, layout, warna, atau struktur tampilan yang dirender.

## Perbaikan utama
- Menghapus `WebSite` scope dari elemen `<html>` agar semua `itemprop` tidak otomatis terbaca sebagai properti WebSite.
- Memisahkan entitas utama menjadi item Microdata yang jelas: `WebSite`, `WebPage`, `Person`, `Service`, `ItemList`, `CreativeWork`, `FAQPage`, `Question`, dan `Answer`.
- Memperbaiki `SearchAction` dengan `target` URL langsung dan `query-input` sesuai pola dokumentasi Schema.org.
- Menghapus `urlTemplate`/`EntryPoint` yang sebelumnya memicu kesalahan konversi nilai pada validator.
- Mengubah properti layanan yang sebelumnya yatim menjadi enam item `Service` yang mandiri.
- Memperbaiki struktur portfolio menjadi `ItemList` > `ListItem` > `CreativeWork`.
- Mempertahankan Microdata `Person` pada profil visual.
- Memastikan tidak ada `itemprop` tanpa ancestor `itemscope`.

## Catatan
Setelah deployment, jalankan ulang pengujian di Schema Markup Validator untuk memastikan hasil server produksi sama dengan file ini.
