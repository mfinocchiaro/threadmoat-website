---
id: T01
parent: S05
milestone: M008
key_files:
  - next.config.mjs
key_decisions:
  - Used import.meta.url + dirname for absolute path in ESM config
duration: 
verification_result: passed
completed_at: 2026-04-03T19:06:57.447Z
blocker_discovered: false
---

# T01: Fixed turbopack root warning by setting absolute __dirname path in next.config.mjs

**Fixed turbopack root warning by setting absolute __dirname path in next.config.mjs**

## What Happened

The warning was caused by Next.js 16 detecting multiple lockfiles (project + parent ~/package-lock.json) and guessing the wrong workspace root. Added `turbopack.root` set to `__dirname` (computed via `import.meta.url`) in next.config.mjs. First attempt with '.' produced a secondary warning about needing an absolute path.

## Verification

npm run build produces zero ⚠ Warning lines. All 104 routes generated.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 23600ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `next.config.mjs`
