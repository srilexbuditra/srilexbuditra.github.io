# Security Policy — Srilex Buditra

**Website:** https://srilexbuditra.work  
**Project:** Srilex Buditra — Full Stack Developer  
**Last reviewed:** 23 August 2026

## 1. Scope

This document defines the recommended security baseline for `srilexbuditra.work`, including:

- Public website pages and assets
- Contact / quotation forms
- WhatsApp contact integration
- Frontend JavaScript
- Any backend/API used by the website
- Database and deployment infrastructure
- Third-party libraries and external services

This document is a **security baseline and hardening checklist**, not a claim that every item has already been implemented.

## 2. Current Website Surface Reviewed

A public review of the website shows a developer portfolio/business website offering Website, Web Application, REST API/Backend, Custom Information Systems, Database Development, and Deployment/Cloud services.

The website also exposes a project-estimation form requesting:

- Full name
- Company name
- Email
- WhatsApp number
- Project type
- Additional features
- Project description

The site provides actions to send an estimate through WhatsApp and to print/save a PDF.

Because this review was performed from the publicly accessible website, server-side configuration, source code, database rules, environment variables, authentication logic, and hosting configuration could not be verified.

## 3. Security Priorities

### Critical — verify first

- [ ] Never expose API keys, database passwords, JWT secrets, private keys, or cloud credentials in frontend JavaScript.
- [ ] Keep `.env`, `.env.*`, private certificates, SSH keys, backups, and local configuration out of Git.
- [ ] Add `.env*` and other secrets to `.gitignore`.
- [ ] If a secret has ever been committed, rotate/revoke it even after deleting it from the repository.
- [ ] Validate and sanitize every server-side form input.
- [ ] Use parameterized queries / ORM protections against SQL or NoSQL injection.
- [ ] Add rate limiting to public forms and API endpoints.
- [ ] Protect state-changing endpoints against CSRF when cookie-based authentication is used.
- [ ] Configure secure authentication if an admin/dashboard exists: strong password hashing, MFA where possible, session expiration, secure cookies, and brute-force protection.

### High — recommended

- [ ] Enable HSTS after confirming HTTPS is correctly configured.
- [ ] Configure a restrictive Content Security Policy (CSP).
- [ ] Set `X-Content-Type-Options: nosniff`.
- [ ] Set `Referrer-Policy` to a privacy-preserving value such as `strict-origin-when-cross-origin`.
- [ ] Configure `Permissions-Policy` to disable browser features that the site does not use.
- [ ] Use `frame-ancestors 'none'` or an equivalent clickjacking protection through CSP.
- [ ] Ensure cookies use `Secure`, `HttpOnly`, and an appropriate `SameSite` attribute.
- [ ] Keep Node.js/Python/packages/frameworks and all frontend dependencies patched.
- [ ] Add automated dependency/security scanning to CI.
- [ ] Restrict CORS to known origins; do not use `Access-Control-Allow-Origin: *` for authenticated APIs.
- [ ] Return generic error messages to visitors and avoid exposing stack traces, SQL errors, filesystem paths, or environment details.
- [ ] Disable directory listing and unnecessary server information disclosure.

### Medium — hardening

- [ ] Add request-size limits to forms and API endpoints.
- [ ] Validate email and phone formats server-side.
- [ ] Limit description length to prevent abuse and excessive resource consumption.
- [ ] Add CAPTCHA or bot protection if automated spam becomes a problem.
- [ ] Log security-relevant events without logging passwords, tokens, or unnecessary personal data.
- [ ] Establish backup and restore testing for any database.
- [ ] Review third-party scripts and remove unused dependencies.
- [ ] Use Subresource Integrity (SRI) for suitable third-party static resources when practical.

## 4. Recommended Security Headers

A production deployment should consider at least the following:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'
```

The CSP must be customized to the site's actual scripts, styles, images, fonts, APIs, WhatsApp links, analytics, and other integrations. Do **not** copy a restrictive CSP into production blindly if it breaks legitimate functionality.

If the site needs inline scripts or styles, prefer nonces/hashes over allowing broad `'unsafe-inline'`.

## 5. HTTPS and TLS

- [ ] Redirect HTTP to HTTPS.
- [ ] Ensure the certificate is valid and automatically renewed.
- [ ] Disable obsolete TLS versions and weak cipher suites at the hosting/proxy layer.
- [ ] Ensure all assets are loaded through HTTPS to avoid mixed content.
- [ ] Enable HSTS only after HTTPS is confirmed to work correctly across the intended domain/subdomains.

## 6. Form Security

The quotation form is a key public attack surface.

Server-side processing should:

1. Validate required fields.
2. Enforce maximum lengths.
3. Normalize email and phone values.
4. Reject unexpected fields where practical.
5. Escape output when displaying submitted data.
6. Rate-limit repeated submissions.
7. Add spam/bot protection when necessary.
8. Avoid storing personal data unless there is a clear business need.
9. Protect stored submissions with appropriate access controls.
10. Never place submitted text directly into HTML, SQL, shell commands, or JavaScript without the appropriate contextual encoding.

If the form only generates a WhatsApp message client-side and does not send data to a server, verify that untrusted values cannot break the generated URL or inject executable content.

## 7. WhatsApp Integration

When constructing a WhatsApp URL from user input:

- Encode user-controlled values with URL encoding.
- Do not concatenate raw user input into HTML attributes or JavaScript.
- Do not trust a client-side calculated price as an authoritative commercial value.
- If the quotation is stored or processed server-side, calculate the final price on the server.

## 8. Pricing / Estimator Security

The public estimator displays an estimated price. Treat all client-side values as untrusted.

If the estimator is later connected to an API, database, payment system, or order workflow:

- Recalculate prices server-side.
- Validate package and feature IDs against an allowlist/database.
- Never accept a client-provided total as the final price.
- Log quotation IDs rather than sensitive personal information whenever possible.

## 9. API Security

For any REST API/backend used by the website:

- [ ] Authenticate protected endpoints.
- [ ] Authorize every sensitive operation server-side.
- [ ] Rate-limit authentication and expensive endpoints.
- [ ] Validate JSON/body/query/path parameters.
- [ ] Limit request body size.
- [ ] Restrict HTTP methods.
- [ ] Configure CORS explicitly.
- [ ] Avoid returning internal database fields.
- [ ] Use pagination and limits for list endpoints.
- [ ] Add timeouts to outbound requests.
- [ ] Protect against SSRF if the server fetches user-supplied URLs.
- [ ] Return consistent, non-sensitive error responses.

## 10. Database Security

If MongoDB, PostgreSQL, or another database is used:

- [ ] Database must not be publicly reachable unless strictly required.
- [ ] Use a dedicated least-privilege database account.
- [ ] Use strong credentials stored in environment/secret management.
- [ ] Enable TLS for remote database connections where supported.
- [ ] Validate all data before insertion.
- [ ] Use parameterized queries/ORM-safe APIs.
- [ ] Encrypt backups.
- [ ] Test restoration regularly.
- [ ] Remove unused database users and permissions.

## 11. Git / Repository Security

Recommended `.gitignore` entries:

```gitignore
# Environment / secrets
.env
.env.*
!.env.example

# Private keys / certificates
*.pem
*.key
*.p12
*.pfx

# Local configuration
.vscode/
.idea/

# Dependencies
node_modules/

# Build output
dist/
build/
.next/

# Logs
*.log

# OS files
.DS_Store
Thumbs.db
```

A `.env.example` may contain variable names and safe placeholders, but never real credentials.

## 12. Dependency Security

For Node.js projects:

```bash
npm audit
npm outdated
```

For production CI, consider automated dependency updates and security scanning.

For Python projects, use a lock/requirements strategy and scan dependencies with an appropriate security scanner.

Do not blindly upgrade production dependencies without testing the application.

## 13. Authentication and Admin Security

If an administrative interface exists:

- Use Argon2id, bcrypt, or another modern password hashing algorithm.
- Never store plaintext passwords.
- Enable MFA where possible.
- Apply login rate limiting.
- Use secure, HttpOnly, SameSite cookies for sessions.
- Regenerate session identifiers after authentication.
- Expire inactive sessions.
- Provide secure logout.
- Implement least-privilege roles.
- Record important administrative actions.

## 14. Privacy

The quotation form collects potentially personal information.

Recommended practices:

- Collect only information necessary for the requested service.
- Publish a privacy policy if personal data is collected/stored.
- Define how long submissions are retained.
- Restrict access to submitted customer information.
- Avoid putting personal information into application logs.
- Secure any database containing customer data.
- Do not expose submitted form data through public URLs or client-side source.

## 15. Security Monitoring

Recommended production monitoring:

- HTTP 4xx/5xx rates
- Repeated failed authentication
- Abnormal form submission volume
- Rate-limit violations
- Unexpected API errors
- Dependency/security alerts
- Certificate expiration
- Backup success/failure

Set alerts for unusual activity instead of relying only on manual inspection.

## 16. Deployment Checklist

Before every production deployment:

- [ ] HTTPS verified
- [ ] Secrets verified outside Git
- [ ] Dependencies updated/scanned
- [ ] Security headers verified
- [ ] CORS reviewed
- [ ] Form validation tested
- [ ] Rate limiting tested
- [ ] Error responses checked for information leakage
- [ ] Production environment variables reviewed
- [ ] Database permissions reviewed
- [ ] Backups verified
- [ ] Rollback plan available

## 17. Security Testing

For authorized testing of your own website, prioritize:

- TLS configuration review
- Security-header review
- Dependency scanning
- Authentication/authorization testing
- Input-validation testing
- XSS testing
- CSRF testing where applicable
- SQL/NoSQL injection testing
- Rate-limit testing
- File-upload testing if uploads are added
- SSRF testing if URL fetching is added
- Access-control testing for admin/API endpoints

Only test systems and accounts for which you have authorization.

## 18. Reporting a Vulnerability

If you discover a security vulnerability in this website, report it privately to:

**Email:** srilexbuditra@gmail.com

Please include:

- A short description
- Affected URL/endpoint
- Steps to reproduce
- Expected vs. actual behavior
- Security impact
- Screenshots or logs where useful
- A suggested fix, if available

Do not publicly disclose credentials, personal data, access tokens, or an exploitable proof-of-concept before the issue has been addressed.

## 19. Review Notes

This security document was prepared from a public-facing review of `https://srilexbuditra.work`.

The public page currently presents a portfolio/business site with service descriptions, portfolio examples, package pricing, an estimate form, WhatsApp contact functionality, and a PDF print/save action.

A complete security audit requires access to the source repository and deployment configuration, including:

- Frontend source
- Backend/API source
- `package.json` / lock files or Python dependency files
- Hosting configuration
- Reverse proxy/CDN configuration
- Environment-variable names
- Database configuration
- Authentication/authorization code
- CI/CD configuration

**Important:** The absence of an item from this document does not prove that the website is vulnerable or that a security control is missing. It means the control should be verified.

---

**Security baseline:** OWASP-aligned defensive hardening  
**Owner:** Srilex Buditra  
**Website:** https://srilexbuditra.work
