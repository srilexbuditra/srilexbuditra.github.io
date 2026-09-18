# V3.9.0 Step 3.1 — Public Media Upload

## Tujuan
Menambahkan upload gambar langsung dari Admin Manasik ke bucket R2 publik `umroh-public-media` melalui Worker `umroh-auth-api`.

## Binding wajib
- `DB` → D1 `umroh-semi-private-bengkulu-db`
- `PUBLIC_MEDIA` → R2 `umroh-public-media`
- Binding dokumen private yang sudah ada tetap dipertahankan.

## Custom domain media
`https://media-umroh.srilexbuditra.work`

## Endpoint baru
`POST /admin/manasik/:material_key/media`

Autentikasi: cookie session staff. Role yang diizinkan: `super_admin`, `admin`, `tour_leader`.

Multipart fields:
- `file`
- `purpose`: `banner` atau `thumbnail`
- `alt_text`

## Validasi
- AVIF / WebP / JPEG / PNG
- maksimum 5 MB
- magic/signature file diperiksa
- Alt Text wajib
- object key dibuat server secara acak
- object disimpan dengan cache `public, max-age=31536000, immutable`

## Perilaku Admin
- Upload `banner` mengisi Banner URL, Open Graph Image URL, dan Twitter Image URL.
- Upload `thumbnail` mengisi Thumbnail URL.
- Setelah upload, pengguna tetap menekan **Simpan Materi** agar URL/object key disimpan ke `umroh_page_meta`.

## Keamanan
- Tidak menerima SVG.
- Nama file lokal tidak dipakai sebagai object key.
- Upload hanya melalui endpoint staff terautentikasi.
- Bucket dokumen private tidak dipakai untuk media publik.
