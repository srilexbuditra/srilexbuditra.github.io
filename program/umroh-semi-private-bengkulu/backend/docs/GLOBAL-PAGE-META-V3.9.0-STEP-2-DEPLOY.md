# Deploy — V3.9.0 Step 2

1. Migration 008 sudah dibuat di D1 (bila tabel sudah ada, `CREATE IF NOT EXISTS` aman).
2. Deploy `backend/worker/worker.js` ke Worker `umroh-auth-api`.
3. Upload file frontend patch ke repository.
4. Verifikasi `/health` tetap melaporkan versi platform baseline saat ini.
5. Buka Admin > Manasik > Talbiyah dan pastikan lima tab muncul.
6. Simpan tanpa mengubah isi, lalu cek `umroh_page_meta.updated_at`.
7. Buka halaman Talbiyah dan View Source untuk memastikan canonical/robots/OG/JSON-LD hadir statis.

Catatan: perubahan SEO dari Admin tersimpan di D1, tetapi crawler GitHub Pages membaca tag HTML terakhir yang dideploy. Sinkronisasi publish otomatis memerlukan tahap deployment/publish terpisah.
