# Srilex Buditra Client & Management Platform R1 — Auth + D1 Core

Status: **STAGING FOUNDATION**

This package extends the existing `feature/client-management-r1` branch without modifying the production `main` branch.

## Target vertical slice

```text
System Admin login
        ↓
Create 1 test client
        ↓
Create 1 test project
        ↓
Client login
        ↓
Client sees only their own project
        ↓
Admin changes progress
        ↓
Client sees the same updated progress
```

## Files added

```text
database/
└── migrations/
    └── 001_client_management_core.sql

workers/
└── client-management-api/
    ├── README.md
    ├── wrangler.toml.example
    └── src/
        └── index.js
```

No existing production page is replaced by this patch.

## Database

Create a **new D1 database** for this platform. Do not reuse the Program Ketahanan Pangan database or another production database.

Recommended name:

```text
srilexbuditra-client-management-r1
```

Apply `database/migrations/001_client_management_core.sql` to the new D1 database in staging first.

## Worker

Recommended staging Worker name:

```text
srilexbuditra-client-management-api-r1
```

The Worker expects:

```text
DB                 → D1 binding
ALLOWED_ORIGINS    → comma-separated allowed portal/admin origins
SESSION_HOURS      → 8
BOOTSTRAP_ENABLED  → false by default
BOOTSTRAP_SECRET   → Worker secret; never commit
```

## Initial admin bootstrap

The bootstrap endpoint exists only to create the very first `system_admin`.

Safe sequence:

1. Deploy the Worker with `BOOTSTRAP_ENABLED=true`.
2. Add a long random `BOOTSTRAP_SECRET` as a Worker secret.
3. Call `POST /api/internal/bootstrap-admin` once from an allowed staging origin.
4. Confirm the admin exists.
5. Immediately change `BOOTSTRAP_ENABLED=false`.
6. Redeploy/confirm the bootstrap endpoint returns unavailable.
7. Never store the bootstrap secret in GitHub.

## Before production

Still required after this core slice:

- UI login pages.
- Client forced password-change screen.
- Proper invitation flow replacing admin-set temporary passwords.
- Login rate limiting / abuse protection.
- MFA or passkey for `system_admin`.
- Password reset flow.
- Session management UI.
- Fine-grained staff permissions.
- Automated tests.
- Staging security review.
- Production domain routing.

## Branch policy

Keep all work in:

```text
feature/client-management-r1
```

Do not create or merge a Pull Request into `main` until the vertical slice has passed staging tests.
