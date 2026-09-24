# API smoke-test examples (STAGING ONLY)

Replace `<API_BASE>`, IDs, emails, and passwords with staging values.
Do not paste real production credentials into GitHub.

## Health

```bash
curl "<API_BASE>/api/health"
```

## Login

```bash
curl -i \
  -X POST "<API_BASE>/api/auth/login" \
  -H "Origin: https://portal.srilexbuditra.work" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  --data '{"email":"client@example.test","password":"REPLACE_WITH_STAGING_PASSWORD"}'
```

## Current user

```bash
curl -i \
  "<API_BASE>/api/auth/me" \
  -H "Origin: https://portal.srilexbuditra.work" \
  -b cookies.txt
```

## Client projects

```bash
curl -i \
  "<API_BASE>/api/client/projects" \
  -H "Origin: https://portal.srilexbuditra.work" \
  -b cookies.txt
```

## Logout

```bash
curl -i \
  -X POST "<API_BASE>/api/auth/logout" \
  -H "Origin: https://portal.srilexbuditra.work" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  --data '{}'
```
