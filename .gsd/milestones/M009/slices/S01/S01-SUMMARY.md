---
id: S01
parent: M009
milestone: M009
provides:
  - Bundle baseline: 8.9MB total, 147 chunks, top 6 chunks identified
requires:
  []
affects:
  - S04
key_files:
  - (none)
key_decisions:
  - Direct chunk analysis over @next/bundle-analyzer
patterns_established:
  - Turbopack chunk identification via grep pattern matching on hashed filenames
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M009/slices/S01/tasks/T01-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-03T21:28:27.821Z
blocker_discovered: false
---

# S01: Bundle analysis tooling & baseline capture

**Baseline captured: 8.9MB JS, 147 chunks, three.js duplicated 2x1.3MB, optimization targets identified**

## What Happened

Analyzed Turbopack build output directly since @next/bundle-analyzer is Webpack-only. Identified top chunks: three.js 2x1.3MB (duplicated), Zod 912KB, react-globe.gl 468KB, Recharts+lodash 324KB. Key optimization targets: jsPDF dynamic import (S02) and tab chart lazy-loading (S03). three.js duplication is a bundler-level artifact from existing dynamic imports, not actionable from our code.

## Verification

Chunk sizes verified via du. Contents identified via string pattern matching.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

No external tooling installed — direct analysis sufficient for Turbopack builds.

## Known Limitations

Turbopack chunk names are hashes, making per-route attribution difficult without a dev server trace.

## Follow-ups

None.

## Files Created/Modified

None.
