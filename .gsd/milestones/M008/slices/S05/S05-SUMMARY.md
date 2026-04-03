---
id: S05
parent: M008
milestone: M008
provides:
  - Clean CI/CD build signal
requires:
  []
affects:
  []
key_files:
  - next.config.mjs
key_decisions:
  - import.meta.url + dirname for ESM absolute path
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M008/slices/S05/tasks/T01-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-03T19:07:09.504Z
blocker_discovered: false
---

# S05: Build warnings cleanup

**Zero build warnings — turbopack root set to absolute __dirname in next.config.mjs**

## What Happened

Resolved the turbopack root inference warning by adding `turbopack.root: __dirname` to next.config.mjs using `import.meta.url` for ESM-compatible absolute path resolution. The warning was caused by Next.js 16 detecting a parent ~/package-lock.json and inferring the wrong workspace root.

## Verification

npm run build produces zero ⚠ Warning lines. 104 routes generated.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `next.config.mjs` — Added turbopack.root with absolute __dirname, plus path/url imports
