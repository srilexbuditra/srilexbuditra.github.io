# Manasik Media Sync Hotfix — V3.9.0 Step 6.2

## Tujuan
Memastikan gambar baru yang diunggah dari **Admin → Manasik → Edit Materi → Media** tidak hanya masuk ke R2, tetapi juga langsung menjadi referensi aktif di `umroh_page_meta`.

## Perubahan
- Endpoint `POST /admin/manasik/:material_key/media` sekarang menyimpan URL/object key baru ke D1 segera setelah upload R2 berhasil.
- Untuk tujuan **Banner + Social Preview**, `banner_url`, `banner_object_key`, `og_image_url`, `twitter_image_url`, dan `image_alt` diperbarui bersama.
- Untuk tujuan **Thumbnail**, `thumbnail_url`, `thumbnail_object_key`, dan `image_alt` diperbarui bersama.
- Jika pembaruan metadata D1 gagal, object R2 yang baru dihapus kembali agar tidak menambah orphan object.
- Frontend menyimpan hasil upload sebagai `stagedMedia` dan meng-overlay URL/object key terbaru saat `Simpan Materi`, sehingga nilai lama tidak dapat menimpa hasil upload baru.
- Preview setelah upload beralih dari blob lokal ke URL R2 aktual, sehingga Admin melihat object yang benar-benar dipakai sistem.
- Tombol `Simpan Materi` dinonaktifkan selama upload berjalan untuk mencegah race condition.

## Tidak ada migrasi D1
Hotfix ini tidak menambah atau mengubah tabel. **Jangan menjalankan migration baru.**

## Urutan deploy
1. Timpa file patch ke root repository.
2. Deploy `backend/worker/worker.js` ke Worker `umroh-auth-api`.
3. Pastikan `/health` tetap menunjukkan versi platform yang aktif (saat rollout ini masih `3.8.0`).
4. Commit/push perubahan GitHub Pages.
5. Setelah Pages selesai deploy, hard refresh Admin Manasik.

## Uji yang disarankan
Gunakan satu materi uji dan gambar yang jelas berbeda. Setelah klik **Upload Gambar**:
- status harus menyatakan metadata D1 sudah diperbarui;
- preview harus menampilkan URL R2 aktual;
- query D1 harus langsung menunjukkan object key baru, bahkan sebelum `Simpan Materi`;
- klik `Simpan Materi`, lalu pastikan object key baru tetap sama;
- halaman publik harus menampilkan gambar baru setelah hard refresh.

Contoh query verifikasi:

```sql
SELECT page_key, banner_url, banner_object_key, og_image_url, twitter_image_url, image_alt, updated_at
FROM umroh_page_meta
WHERE page_key = 'manasik:ihram-miqat';
```

## Catatan object lama
Object lama jangan langsung dihapus. Hapus hanya setelah URL baru sudah terverifikasi di D1 dan halaman publik.
