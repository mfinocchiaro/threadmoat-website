---
id: S02
parent: M016
milestone: M016
provides:
  - (none)
requires:
  []
affects:
  - S03
key_files:
  - components/dashboard/sidebar.tsx
  - lib/tiers.ts
key_decisions:
  - New Data Views group at analyst level
  - 5 charts promoted from strategist to analyst
  - Candlestick demoted from admin to strategist
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M016/slices/S02/tasks/T01-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-05T13:56:38.030Z
blocker_discovered: false
---

# S02: Sidebar chart reorganization

**Reorganized sidebar into logical groups: new Data Views category (analyst-level), trimmed Financial, moved candlestick to advanced, updated all tier access paths.**

## What Happened

Created a new Data Views sidebar group for general-purpose charts (slope, chord, wordcloud, marimekko, sankey) accessible at analyst tier. Trimmed Financial to bar-chart, treemap, patterns. Moved timeline and spiral to Market Maps. Moved candlestick from admin-only to strategist-level advanced. Updated all tier path sets in tiers.ts accordingly.

## Verification

Build passes. Tier paths verified.

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

- `components/dashboard/sidebar.tsx` — Reorganized tab groups, new Data Views, trimmed Financial
- `lib/tiers.ts` — Moved chart paths between tier sets
