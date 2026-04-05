---
id: S01
parent: M017
milestone: M017
provides:
  - Subcategory filter available in toolbar for all charts
requires:
  []
affects:
  []
key_files:
  - contexts/filter-context.tsx
  - components/dashboard/filter-toolbar.tsx
  - contexts/thesis-context.tsx
key_decisions:
  - Contextual subcategory options
  - Positioned after Investment List
patterns_established:
  - Contextual filter options pattern — options in one dropdown change based on selections in another
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M017/slices/S01/tasks/T01-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-05T17:06:54.876Z
blocker_discovered: false
---

# S01: Add Subcategory filter as contextual secondary to Investment List

**Added contextual Subcategory filter that narrows options based on selected Investment Lists — replaces old Subsegment in toolbar.**

## What Happened

Added subcategories[] to FilterState with matching filter logic. Created useSubcategoryOptions() hook with contextual filtering — when Investment Lists are active, only subcategories from companies in those lists appear. Positioned Subcategory dropdown right after Investment List for natural drill-down. Removed old Subsegment from toolbar UI.

## Verification

Build passes.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Also fixed thesis-context.tsx filter reset.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `contexts/filter-context.tsx` — Added subcategories[] to FilterState, filter logic, activeFilterCount, clearAll
- `components/dashboard/filter-toolbar.tsx` — Added contextual useSubcategoryOptions hook, replaced Subsegment with Subcategory dropdown
- `contexts/thesis-context.tsx` — Added subcategories to filter reset
