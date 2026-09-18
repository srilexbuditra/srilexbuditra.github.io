# Secure Documents V3.4.2 — Deploy & Test

## IMPORTANT
Deploy order:
1. D1 Migration 004
2. Create PRIVATE R2 bucket
3. Add Worker R2 binding `DOCUMENTS_BUCKET`
4. Deploy Worker V3.4.2
5. Deploy GitHub frontend
6. Test with simulation file only

## 1. D1 Migration
In database `umroh-semi-private-bengkulu-db`, run the contents of:

`backend/migrations/004_secure_documents_console.sql`

Verify:

```sql
SELECT name
FROM sqlite_schema
WHERE type='table'
  AND name='umroh_document_files';
```

Then:

```sql
PRAGMA foreign_key_check;
```

Target: no violations.

## 2. Create Cloudflare R2 private bucket
Cloudflare → R2 Object Storage → Create bucket.

Recommended bucket name:

`umroh-private-documents`

DO NOT enable public access / custom public domain.

## 3. Bind R2 to Worker
Worker `umroh-auth-api` → Settings → Bindings → Add → R2 bucket.

Variable name:

`DOCUMENTS_BUCKET`

Bucket:

`umroh-private-documents`

Keep existing D1/variables/secrets unchanged.

## 4. Deploy Worker
Deploy:

`backend/worker/worker.js`

Health target:

```json
{"ok":true,"service":"umroh-auth-api","version":"3.4.2"}
```

## 5. Deploy frontend
Commit recommendation:

`Add Umroh Secure Documents V3.4.2`

## 6. Test as Jemaah Simulasi
Open:

`/program/umroh-semi-private-bengkulu/jamaah/dokumen/`

Upload a NON-SENSITIVE simulation PDF/JPG/PNG under 5 MB.

Do not use real passport or identity during first test.

Target:
- file shows as uploaded;
- status = Menunggu Verifikasi;
- file can be downloaded by the same Jemaah account;
- Dashboard document summary reflects backend upload count.

## 7. Test as Super Admin
Login `srilexbuditra`, open:

`/program/umroh-semi-private-bengkulu/admin/dokumen/`

Target:
- simulation document appears;
- download works;
- review to `Terverifikasi`;
- Jemaah page then shows `Terverifikasi`.

## 8. R2 privacy verification
In R2 bucket settings verify:
- public access is disabled;
- no public custom domain;
- object name uses random UUID path, not personal data.

## 9. D1 verification
Example:

```sql
SELECT file_uuid, document_key, version, original_name, mime_type, size_bytes, is_current
FROM umroh_document_files
ORDER BY id DESC
LIMIT 10;
```

Check review state:

```sql
SELECT document_key, jamaah_status, admin_status, admin_note, reviewed_at
FROM umroh_document_status
WHERE account_id = (
  SELECT id FROM umroh_accounts WHERE member_no='SIM-0001'
);
```

## Caution
V3.4.2 performs type/signature validation but does not provide full malware scanning.
For real production document intake, consider adding an antivirus/content-scanning service before allowing broad public enrollment.
