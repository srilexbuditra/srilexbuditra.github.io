# V11.5.1 — Critical Loading & Performance Strategy

## Target strategy
V11.5.1 defined the following controlled performance strategy:

- Target: main homepage scripts use `defer` to avoid blocking HTML parsing.
- Target: the hero/profile image receives explicit dimensions, `fetchpriority="high"`, and async decoding.
- Portfolio images below the initial viewport retain lazy loading.
- No visual layout, content, or feature is intended to be removed.

## Verification
Before publishing, verify GitHub Actions and test Mobile/Desktop PageSpeed Insights again.

## Implementation status
This document records the performance targets and strategy defined for V11.5.1. Full synchronization with the actual source implementation was completed and documented in `PERFORMANCE_V11.5.2.md`.
