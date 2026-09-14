# V13.6.13.1 — Copy Selector Hotfix

- Memperbaiki tombol Salin KP-PUB yang sebelumnya dapat tidak melakukan copy.
- Penyebab: selector pertama mengambil `<meta itemprop="identifier">` di `<head>`.
- Selector sekarang memprioritaskan kode KP-PUB yang terlihat di halaman.
- Fallback meta membaca atribut `content`.
- GA4 `public_source_copy` tetap dipertahankan dan nilai KP-PUB tidak dikirim sebagai parameter.
