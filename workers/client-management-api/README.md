# Client Management API R1

Backend foundation for the Srilex Buditra Client & Management Platform R1.

## Current vertical slice

- D1 core schema: users, clients, projects, sessions, activity logs.
- System admin bootstrap endpoint (disabled by default).
- Login / logout / current session.
- Password change.
- Server-side role checks.
- Client ownership checks.
- Admin creates a client.
- Admin creates/updates a project.
- Client can only read projects linked to their own client record.

## Security defaults

- Session token is stored only in an `HttpOnly; Secure; SameSite=Lax` host-only cookie named `__Host-sb_session`.
- The browser receives the opaque session token; D1 stores only a SHA-256 hash of that token.
- Passwords use PBKDF2-HMAC-SHA256 with 100,000 iterations and a unique 16-byte salt. This matches the current Cloudflare Workers Web Crypto runtime ceiling observed in staging; the password hash format stores the iteration count for future migration.
- State-changing requests require `application/json` and an explicitly allowed `Origin`.
- Private/auth responses use `Cache-Control: no-store`.
- No credentials, API tokens, bootstrap secrets, or real customer data are committed.

## Required bindings

- D1 binding: `DB`
- Variable: `ALLOWED_ORIGINS`
- Variable: `SESSION_HOURS`
- Variable: `BOOTSTRAP_ENABLED`
- Secret: `BOOTSTRAP_SECRET` only during initial admin bootstrap

## Routes

Public:
- `GET /api/health`
- `POST /api/internal/bootstrap-admin` (only when explicitly enabled)

Auth:
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/change-password`

Admin/staff:
- `GET /api/admin/clients`
- `GET /api/admin/projects`
- `POST /api/admin/projects`
- `PATCH /api/admin/projects/:id`

System admin:
- `POST /api/admin/clients`

Client:
- `GET /api/client/projects`
- `GET /api/client/projects/:id`

## Important

This package is a staging foundation. Do not connect it to real customer data or merge it to production until the D1 migration, bootstrap sequence, login flow, authorization, and project ownership tests all pass.
