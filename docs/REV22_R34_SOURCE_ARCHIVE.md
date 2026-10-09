# REV22 R3.4 — Source Archive Baseline

**Website:** https://srilexbuditra.work/  
**Production frontend baseline:** `main` at `36f4dc3` (REV22 R3.4).  
**Backend source:** R3.1, deployed separately as Worker `srilexbuditra-web-push-api-r1`.  
**Status:** REV21 LOCKED; REV22 R3.4 frontend and functional behavior LOCKED.

## Source inventory

- `.gitignore`: excludes local Wrangler storage, `.dev.vars` and common credentials.
- `functions/api/push/[[path]].js`: **optional Pages Function proxy**, NOT the active production routing design. Requires `env.PUSH_SERVICE` service binding, which is not configured by these files. Adding this file to `main` may change Pages deployment behavior; do NOT publish this proxy to production without a separate review.
- `workers/web-push-api-r1/src/index.js`: Web Push Worker with health, public-key, subscribe, unsubscribe, status and administrator-only send-test endpoints.
- `workers/web-push-api-r1/package.json`, `package-lock.json`: dependencies, pinned `web-push@3.6.7`.
- `workers/web-push-api-r1/migrations/001_push_subscriptions.sql`: D1 subscription table and indexes.
- `workers/web-push-api-r1/wrangler.toml`: **archival template only**, not a ready production deployment config; `database_id = "REPLACE_WITH_D1_DATABASE_ID"`.

## Production architecture — preserve

- Cloudflare Worker route `srilexbuditra.work/api/push/*` points **directly** to `srilexbuditra-web-push-api-r1`.
- REV21 API route `srilexbuditra.work/api/*` remains assigned to the existing Client Management Worker; do not replace it.
- Worker has D1 `DB` binding to `srilexbuditra-web-push-r1`; production VAPID keys and administrator bearer token are Cloudflare secrets, not in Git.
- D1 migration was applied manually through the Cloudflare D1 console; do not assume Wrangler migration tracking was updated, and do not blindly apply it again.
- The live Worker was deployed using a temporary Wrangler configuration with a real D1 ID, outside the Git repository. The archival `wrangler.toml` placeholder is intentional. Keep workers.dev/preview access restricted according to existing production settings.
- R3.4 frontend hides the floating launcher while subscribed, restores it when permission/subscription is inactive, and preserves footer management, Android/Windows native pushes and R3.3 in-page banners.

## Verified project results (user reported)

- Local subscribe API 6/6 PASS; local status/unsubscribe 11/11 PASS; local test D1 empty after cleanup.
- Production Worker health and VAPID readiness PASS; PC Windows and Android vivo Y73s visibly received Web Push.
- Android foreground R3.3 banner appeared and native system push stayed active.
- R3.4 frontend changes committed to `main` as `36f4dc3` and user visually confirmed working.

## Deployment / Git guardrails

1. Keep this archive in `archive/rev22-r34-source-20261009`, not `main`.
2. **Do not merge/cherry-pick** the archive branch into `main` without a separate deployment review. In particular, Pages Functions may be activated by adding `functions/api/push/[[path]].js` to the production branch.
3. Do not commit any `credentials.dpapi.json`, `.dev.vars`, tokens, private VAPID keys or decrypted secret exports.
4. This archive does not deploy a Worker, update D1, or update a Cloudflare route.
5. Before any branch push to GitHub, inspect GitHub Actions and Cloudflare Pages branch settings; preview builds or workflows may trigger on a non-main branch.
6. For later upgrades, keep a separate staged migration plan and rollback with a proven backup.
