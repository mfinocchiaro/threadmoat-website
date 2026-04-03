---
id: T01
parent: S04
milestone: M009
key_files:
  - .gsd/lighthouse-home.json
  - .gsd/lighthouse-about.json
key_decisions:
  - Used localhost dev mode for baseline — production Vercel scores will differ
duration: 
verification_result: passed
completed_at: 2026-04-03T21:35:25.878Z
blocker_discovered: false
---

# T01: Documented bundle comparison (8.9MB→9.3MB with more granular splitting) and Lighthouse baseline (home: 75, about: 77)

**Documented bundle comparison (8.9MB→9.3MB with more granular splitting) and Lighthouse baseline (home: 75, about: 77)**

## What Happened

Captured Lighthouse performance scores on public pages (homepage: 75, about: 77). Dashboard pages returned 404 due to auth requirements. Documented before/after bundle comparison: total JS increased 3.4% but chunk count increased from 147→168 reflecting more granular code splitting. The key optimization is per-page initial load reduction, not total bundle size. Documented remaining opportunities (three.js duplication, LCP, production Lighthouse).

## Verification

Lighthouse JSON files written. Research artifact documented.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx lighthouse http://localhost:3000 --only-categories=performance` | 0 | ✅ pass | 17800ms |
| 2 | `npx lighthouse http://localhost:3000/about --only-categories=performance` | 0 | ✅ pass | 12800ms |

## Deviations

Dashboard pages couldn't be Lighthouse'd due to auth. Public pages provide framework baseline.

## Known Issues

None.

## Files Created/Modified

- `.gsd/lighthouse-home.json`
- `.gsd/lighthouse-about.json`
