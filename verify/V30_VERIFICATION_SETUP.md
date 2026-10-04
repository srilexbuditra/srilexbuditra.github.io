# V30 — Automatic Cross-Device Verification

V30 keeps the existing static `documents.json` verification and adds an optional real publisher API. GitHub Pages itself cannot securely write a database from the public browser.

## Fast/static mode
A record is verified when its exact Document ID exists in `verify/data/documents.json` with `status: "Verified"`.

## Automatic mode
1. Deploy `verify/worker/worker.js` to Cloudflare Workers.
2. Create a KV namespace and bind it as `VERIFY_DB` using the supplied `wrangler.toml`.
3. Set a server-side secret: `wrangler secret put PUBLISHER_TOKEN`.
4. Open the private Publisher Setup address stored securely by the publisher.
5. Enter the Worker HTTPS endpoint and the publisher token, then save.
6. The form will automatically POST each newly generated document record during **Konfirmasi & Buat PDF**.
7. A scanned QR opens `/verify/?id=...`; the verification page checks the API first and falls back to `documents.json`.

**Security update V31:** aturan penyimpanan token pada baseline V30 telah diperbarui. Publisher Token sekarang menggunakan `sessionStorage` dan legacy token pada `localStorage` dihapus. API endpoint tetap boleh berada di `localStorage` karena bukan secret. Lihat `V31_PUBLISHER_SECURITY.md`. Token tidak boleh di-hard-code pada public source. Untuk keamanan lebih tinggi, gunakan autentikasi server-side atau short-lived credential.

### API contract
- `POST /documents` with Authorization: Bearer TOKEN
- `GET /documents/{id}` public
- `GET /health` public

A successful GET returns the record with `status: "Verified"`.
