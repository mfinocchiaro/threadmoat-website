---
id: S02
parent: M013
milestone: M013
provides:
  - Investor comparison page at /dashboard/investor-compare
requires:
  - slice: S01
    provides: Co-investment analysis pattern from Company.investors[]
affects:
  []
key_files:
  - components/charts/investor-compare-chart.tsx
  - app/dashboard/investor-compare/page.tsx
  - components/dashboard/sidebar.tsx
key_decisions:
  - Color-coded profiles (indigo/amber/emerald)
  - Min 2 companies filter
  - Responsive grid layout
patterns_established:
  - Investor search/select with autocomplete pattern — reusable for any multi-entity comparison view
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M013/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M013/slices/S02/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-04T08:02:40.533Z
blocker_discovered: false
---

# S02: Investor comparison — side-by-side portfolio analysis

**Built investor comparison page at /dashboard/investor-compare with search/select, side-by-side portfolio metrics, sector distribution, and overlap analysis.**

## What Happened

Created a 340-line InvestorCompareChart component with search-based investor selection (up to 3), color-coded profile cards showing portfolio size, funding, avg score, sector badges, and stage distribution bars. The overlap section identifies companies backed by 2+ selected investors with color-coded dot indicators. Page wired at /dashboard/investor-compare with sidebar entry.

## Verification

Build passes (107 routes, zero errors). Route registered.

## Requirements Advanced

- R020 — Investor comparison page delivered with side-by-side portfolios and overlap analysis

## Requirements Validated

- R020 — Both new pages (co-investment heatmap + investor comparison) built, sidebar wired, build passes

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

Visual verification with real data requires user login.

## Follow-ups

None.

## Files Created/Modified

- `components/charts/investor-compare-chart.tsx` — New 340-line component with search/select, portfolio profiles, and overlap analysis
- `app/dashboard/investor-compare/page.tsx` — New page route
- `components/dashboard/sidebar.tsx` — Added investor-compare to ADMIN_ITEMS and ADMIN_VIZ_HREFS
