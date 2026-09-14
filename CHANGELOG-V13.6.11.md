# V13.6.11 — Privacy + SEO/Microdata Hotfix

## Security & Privacy
- Kode lookup publik dipindahkan dari GET query ke POST `/buka`.
- Query lama/keliru pada `/sumber/` dibersihkan otomatis.
- Nomor KTPG tetap POST-only dan tidak ditempatkan pada URL publik.
- Respons issue registrasi menggunakan pesan kegagalan generik untuk mengurangi enumeration.
- `X-Content-Type-Options: nosniff` ditambahkan pada HTML/JSON Worker.

## Analytics
- GA4 V13.6.10 dipertahankan.
- `public_source_issue_success` hanya dikirim setelah Worker benar-benar sukses.
- Penanda sukses memakai `#issued`, lalu otomatis dibersihkan dari address bar.
- KTPG dan KP-PUB tetap tidak dikirim sebagai parameter GA4.

## SEO
- Meta `name`, Open Graph, Twitter/X, canonical, robots/googlebot lengkap pada halaman Worker produksi.
- Gambar OG AVIF digunakan dari `/assets/og/sumber-resmi-registrasi.avif`.

## Schema.org
- JSON-LD dihapus dari Worker.
- Schema.org menggunakan Microdata (`itemscope`, `itemtype`, `itemprop`).
