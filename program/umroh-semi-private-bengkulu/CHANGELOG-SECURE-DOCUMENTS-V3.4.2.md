# CHANGELOG — Secure Documents V3.4.2

## Added
- Cloudflare R2 private storage binding: `DOCUMENTS_BUCKET`.
- D1 table `umroh_document_files` for versioned file metadata.
- Jemaah document endpoints:
  - `GET /jamaah/documents`
  - `POST /jamaah/documents/:documentKey/upload`
  - `GET /jamaah/documents/:fileUuid/download`
- Admin document endpoints:
  - `GET /admin/documents`
  - `GET /admin/documents/:fileUuid/download`
  - `PATCH /admin/documents/:fileUuid/review`
- Admin verification page `/admin/dokumen/`.
- Real secure upload UI on `/jamaah/dokumen/`.
- SHA-256 checksum metadata.
- File versioning: replacement creates a new version and retains older object metadata privately.

## Security
- R2 bucket must remain private.
- Object key never contains Jemaah name, NIK, passport number, or original filename.
- Maximum file size: 5 MB.
- Accepted types: PDF, JPEG, PNG.
- MIME + magic-byte signature validation.
- File downloads are streamed through Worker after session/role authorization.
- Download response uses `Content-Disposition: attachment`, `Cache-Control: private, no-store`, `nosniff`, and CSP sandbox.
- Admin sensitive-document access restricted to `super_admin` and `admin`.
- Download/review/upload actions are written to audit log.
- Replacement upload resets admin review state to `not_reviewed`.
- No permanent delete endpoint is exposed in V3.4.2.

## Note
This version does not claim malware scanning. File-type signature validation is present, but full antivirus/content scanning would require an additional scanning service.
