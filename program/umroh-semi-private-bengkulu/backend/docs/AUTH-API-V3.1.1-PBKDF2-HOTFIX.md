# Auth API V3.1.1 — PBKDF2 Runtime Hotfix

## Penyebab

Cloudflare Workers WebCrypto pada deployment ini menolak PBKDF2 di atas 100000 iterasi.
Log runtime menunjukkan:

`Pbkdf2 failed: iteration counts above 100000 are not supported (requested 600000).`

Karena belum ada akun Super Admin yang berhasil dibuat, perubahan work factor ini tidak
memerlukan migrasi password.

## Perubahan V3.1.1

`PASSWORD_ITERATIONS`:

- sebelumnya: `600000`
- sekarang: `100000`

Format hash tetap:

`pbkdf2-sha256$<iterations>$<salt>$<derived-key>`

Salt unik dan `AUTH_PEPPER` tetap digunakan.

## Status keamanan

Nilai 100000 digunakan sebagai hotfix kompatibilitas untuk tahap bootstrap/uji Auth API.
Sebelum sistem dibuka untuk akun jemaah produksi, lakukan review password hashing kembali
dan tambahkan rate limiting pada endpoint login/aktivasi.

Jangan menghapus atau mengganti `AUTH_PEPPER`.

## Setelah deploy

1. Uji `GET /health`.
2. Pastikan D1 belum memiliki `super_admin`.
3. Jalankan bootstrap satu kali.
4. Jika berhasil:
   - set `ENABLE_BOOTSTRAP=0`;
   - hapus `BOOTSTRAP_TOKEN`;
   - uji login → `/auth/me` → logout.
