# V13.6.8 — Public Registration Source

Tujuan: menyediakan Kode Referensi Publik yang aman untuk dibagikan dan diindeks mesin pencari tanpa mempublikasikan Nomor Registrasi KTPG.

## Arsitektur
- Nomor Registrasi KTPG tetap digunakan untuk cek status dan aktivasi akun.
- Kode Referensi Publik `KP-PUB-XXXXXXXXXXXX` dibuat oleh Worker sumber publik dan disimpan di D1.
- Halaman publik unik: `/program/ketahanan-pangan/sumber/KP-PUB-XXXXXXXXXXXX/`.
- Halaman publik tidak menampilkan NIK, KK, WhatsApp, email, nama peserta, dokumen, token, atau nomor KTPG.
- Sitemap dinamis: `/program/ketahanan-pangan/sumber/sitemap.xml`.

## Penting
Google tidak menjamin halaman langsung muncul di hasil pencarian atau Ringkasan AI. Setelah deploy, submit sitemap dinamis di Google Search Console dan gunakan Request Indexing untuk halaman sumber yang penting.
