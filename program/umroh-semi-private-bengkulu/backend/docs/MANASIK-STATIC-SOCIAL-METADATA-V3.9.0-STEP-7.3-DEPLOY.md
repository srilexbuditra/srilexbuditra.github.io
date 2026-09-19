# Deploy — V3.9.0 Step 7.3 Manasik Static Social Metadata Publish Sync

Tidak ada migration D1, tidak ada perubahan Worker, dan tidak ada upload/hapus object R2 pada Step 7.3.

## Baseline

- V3.9.0 Step 7.2 — Public Discoverability & Manasik Hub SEO Baseline: PASS & LOCKED.
- V3.9.0 Step 7.3B — Remaining Manasik Media Metadata Completion: PASS & LOCKED.
- Snapshot produksi: 11/11 materi memiliki media metadata lengkap.

## File yang berubah

Secara Git, Step 7.3 mengubah:

- 10 `index.html` materi Manasik yang sebelumnya belum memiliki static social image lengkap.
- changelog Step 7.3.
- dokumen deploy Step 7.3.

`manasik/talbiyah/index.html` sudah memiliki metadata social image yang sesuai dan tidak menghasilkan diff baru.

## Deploy

1. Timpa folder `program` dari patch ke root repository.
2. Pastikan GitHub Desktop hanya menampilkan perubahan metadata `<head>` pada halaman Manasik serta dua file dokumentasi Step 7.3.
3. Commit ke branch `main`.
4. Push origin.
5. Tunggu GitHub Actions dan GitHub Pages deployment hijau.
6. Jangan deploy Worker dan jangan menjalankan migration D1.

## Commit yang disarankan

`V3.9.0 Step 7.3 - Manasik Static Social Metadata Sync`

## Verifikasi visual

Buka Manasik Hub dan beberapa halaman materi. Pastikan tampilan sebelum dan sesudah deploy identik.

Yang tidak boleh berubah:

- header/footer;
- banner di body halaman;
- isi materi;
- tombol Tandai materi selesai;
- progress Jemaah;
- navigasi;
- logo/favicons;
- responsive layout.

## Verifikasi source HTML

Gunakan `view-source:` pada halaman materi dan pastikan metadata statis memuat:

- `og:image`;
- `og:image:secure_url`;
- `og:image:alt`;
- `twitter:card` = `summary_large_image`;
- `twitter:image`;
- `twitter:image:alt`.

`og:image` dan `twitter:image` harus memakai URL R2 aktif untuk slug materi yang sama.

## Verifikasi runtime

Admin/D1 tetap menjadi sumber metadata runtime. Step 7.3 tidak mengubah endpoint, schema, data, atau mekanisme hydrate yang sudah dikunci.

## Catatan cache social preview

Platform social/WhatsApp dapat menyimpan cache preview. Bila metadata source HTML sudah benar tetapi preview lama masih terlihat, tunggu cache diperbarui atau gunakan alat refresh/debug milik platform terkait. Jangan mengganti URL R2 aktif hanya untuk memaksa cache.

Jangan menaikkan versi platform production dari V3.8.0 sampai rollout V3.9.0 selesai diuji dan dikunci.
