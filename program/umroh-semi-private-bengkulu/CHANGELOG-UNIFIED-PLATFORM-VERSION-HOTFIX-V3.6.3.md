# CHANGELOG — Unified Platform Version Hotfix V3.6.3

## Fixed
- Memulihkan struktur halaman Admin dan Jemaah setelah V3.6.2 menampilkan halaman putih dengan hanya teks versi.
- Menghapus ketergantungan runtime untuk menulis versi ke DOM.
- Semua label versi utama yang terlihat distempel statis menjadi **Platform V3.6.3**.
- Worker `/health` diselaraskan ke `3.6.3`.

## Version policy
- `platform-version.json` adalah referensi release tunggal.
- Halaman produksi memakai label versi statis yang disinkronkan saat release dibuat.
- `platform-version.js` sekarang hanya compatibility helper dan tidak mengubah DOM.
- Versi data seperti `Data simulasi V2.2` dan versi file dokumen tidak diubah.

## Database
Tidak ada migration D1.
Tidak ada perubahan R2.
