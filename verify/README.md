# Srilex Buditra Document Verification

> Master documentation untuk sistem verifikasi dokumen Srilex Buditra.
> Setup V30 tetap menjadi baseline teknis; hardening keamanan terbaru mengikuti V31.

## Current Architecture

- QR target: `/verify/?id=DOCUMENT_ID`.
- QR hanya membawa URL verifikasi dan Document ID; tidak menyimpan data pribadi.
- Static registry: `verify/data/documents.json`.
- Optional automatic publisher API: `verify/worker/`.
- Verification page dapat memeriksa API dan menggunakan static registry sebagai fallback.
- GitHub Pages tidak dapat menulis database JSON secara aman langsung dari browser publik.

## Static Registry

Dokumen yang diterbitkan dalam mode statis harus memiliki record pada `data/documents.json`.

Record terverifikasi menggunakan Document ID yang sesuai dan status `Verified`.

Data demo seperti `SB-EST-DEMO-001` tidak boleh diperlakukan sebagai record produksi.

## Automatic Publisher API

Panduan deployment Worker/KV dan API contract tersedia pada:

- `V30_VERIFICATION_SETUP.md`

Endpoint utama:

- `POST /documents` — publisher/authenticated action.
- `GET /documents/{id}` — public verification.
- `GET /health` — public health check.

## Publisher Security — Current V31

Security hardening terbaru tersedia pada:

- `V31_PUBLISHER_SECURITY.md`

Current token policy:

- Publisher Token tidak disimpan di `localStorage`.
- Token disimpan sementara di `sessionStorage`.
- Legacy V30 token pada `localStorage` dihapus.
- API endpoint boleh tetap disimpan di `localStorage` karena bukan secret.
- Token tidak boleh di-hard-code ke public JavaScript atau repository.
- Untuk keamanan lebih tinggi, gunakan server-side authentication atau short-lived credentials.

## Documentation Authority

- `README.md` ini adalah entry point aktif sistem Verify.
- `V30_VERIFICATION_SETUP.md` adalah setup/deployment baseline.
- `V31_PUBLISHER_SECURITY.md` adalah security hardening terbaru dan mengungguli aturan penyimpanan token V30.
- Jangan membuka admin/database secret pada source publik.