# V11.5.1 — Critical Loading & Performance Strategy

## Controlled changes
- Main homepage scripts now use `defer` so HTML parsing is not blocked.
- The hero/profile image receives explicit dimensions, `fetchpriority="high"`, and async decoding.
- Portfolio images below the initial viewport retain lazy loading.
- No visual layout, content, or feature was removed.

## Verification
Before publishing, verify GitHub Actions and test Mobile/Desktop PageSpeed Insights again.
