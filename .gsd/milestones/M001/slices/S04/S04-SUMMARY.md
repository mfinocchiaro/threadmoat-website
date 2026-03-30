---
id: S04
parent: M001
milestone: M001
provides:
  - Best Available Valuation as estimatedMarketValue source
requires:
  []
affects:
  - S05
key_files:
  - lib/load-companies-server.ts
  - app/api/funding/route.ts
key_decisions:
  - Best Available Valuation is the authoritative valuation source for all dashboard charts
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M001/slices/S04/tasks/T01-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-29T16:49:00.221Z
blocker_discovered: false
---

# S04: CSV Data Refresh — swap corrected dataset

**Dashboard charts now use Best Available Valuation (pipeline-verified) instead of Estimated Market Value (old heuristic).**

## What Happened

Swapped the valuation data source from the old heuristic-based 'Estimated Market Value' column to 'Best Available Valuation' which contains pipeline-verified data. Applied to both the main company loader and the funding API route. 567 companies get updated valuations.

## Verification

npm run build passes. Column mapping verified in code.

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

- `lib/load-companies-server.ts` — estimatedMarketValue now reads Best Available Valuation
- `app/api/funding/route.ts` — estimatedMarketValue now reads Best Available Valuation
