---
id: T03
parent: S03
milestone: M005
provides: []
requires: []
affects: []
key_files: ["components/charts/bubble-chart.tsx", "components/charts/quadrant-chart.tsx", "components/charts/periodic-table.tsx", "components/charts/treemap-chart.tsx", "app/dashboard/bubbles/page.tsx", "app/dashboard/quadrant/page.tsx", "app/dashboard/periodic-table/page.tsx", "app/dashboard/treemap/page.tsx", "app/dashboard/tab/market/page.tsx", "app/dashboard/tab/financial/page.tsx"]
key_decisions: ["Used amber #f59e0b with 2.5px stroke for shortlist highlight across all charts", "Periodic table uses CSS outline (not border) to avoid layout shift, plus ★ corner indicator", "Optional prop pattern: all charts accept Set<string> | undefined, backwards compatible"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build passes with zero type errors. grep confirms shortlistedIds present in all 4 chart files and all 6 page files. All slice-level checks pass: ShortlistProvider wired, shortlistedIds in hook, localStorage key present."
completed_at: 2026-04-01T22:20:16.346Z
blocker_discovered: false
---

# T03: Added optional shortlistedIds prop to bubble, quadrant, periodic table, and treemap charts with amber stroke highlight, threaded from useThesisGatedData through all 6 page files

> Added optional shortlistedIds prop to bubble, quadrant, periodic table, and treemap charts with amber stroke highlight, threaded from useThesisGatedData through all 6 page files

## What Happened
---
id: T03
parent: S03
milestone: M005
key_files:
  - components/charts/bubble-chart.tsx
  - components/charts/quadrant-chart.tsx
  - components/charts/periodic-table.tsx
  - components/charts/treemap-chart.tsx
  - app/dashboard/bubbles/page.tsx
  - app/dashboard/quadrant/page.tsx
  - app/dashboard/periodic-table/page.tsx
  - app/dashboard/treemap/page.tsx
  - app/dashboard/tab/market/page.tsx
  - app/dashboard/tab/financial/page.tsx
key_decisions:
  - Used amber #f59e0b with 2.5px stroke for shortlist highlight across all charts
  - Periodic table uses CSS outline (not border) to avoid layout shift, plus ★ corner indicator
  - Optional prop pattern: all charts accept Set<string> | undefined, backwards compatible
duration: ""
verification_result: passed
completed_at: 2026-04-01T22:20:16.346Z
blocker_discovered: false
---

# T03: Added optional shortlistedIds prop to bubble, quadrant, periodic table, and treemap charts with amber stroke highlight, threaded from useThesisGatedData through all 6 page files

**Added optional shortlistedIds prop to bubble, quadrant, periodic table, and treemap charts with amber stroke highlight, threaded from useThesisGatedData through all 6 page files**

## What Happened

Added shortlistedIds?: Set<string> prop to all 4 key chart components with visual highlight treatment: amber stroke (#f59e0b) on SVG charts (bubble, quadrant, treemap) and CSS outline + glow + ★ indicator on periodic table HTML cells. Updated 6 page files (4 dedicated + 2 tab overviews) to destructure shortlistedIds from useThesisGatedData() and pass through. All props optional — charts render normally without shortlistedIds. Fixed a D3 type issue where .style() doesn't accept null for HTML selections.

## Verification

npm run build passes with zero type errors. grep confirms shortlistedIds present in all 4 chart files and all 6 page files. All slice-level checks pass: ShortlistProvider wired, shortlistedIds in hook, localStorage key present.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 16300ms |
| 2 | `grep -c shortlistedIds components/charts/bubble-chart.tsx` | 0 | ✅ pass | 100ms |
| 3 | `grep -c shortlistedIds components/charts/quadrant-chart.tsx` | 0 | ✅ pass | 100ms |
| 4 | `grep -c shortlistedIds components/charts/periodic-table.tsx` | 0 | ✅ pass | 100ms |
| 5 | `grep -c shortlistedIds components/charts/treemap-chart.tsx` | 0 | ✅ pass | 100ms |
| 6 | `grep -q ShortlistProvider components/dashboard/layout-client.tsx` | 0 | ✅ pass | 100ms |
| 7 | `grep -q shortlistedIds hooks/use-thesis-gated-data.ts` | 0 | ✅ pass | 100ms |
| 8 | `grep -q threadmoat-shortlist contexts/shortlist-context.tsx` | 0 | ✅ pass | 100ms |


## Deviations

D3 .style() typing doesn't accept null for HTML selections — used 'none'/'0' strings instead. No functional impact.

## Known Issues

None.

## Files Created/Modified

- `components/charts/bubble-chart.tsx`
- `components/charts/quadrant-chart.tsx`
- `components/charts/periodic-table.tsx`
- `components/charts/treemap-chart.tsx`
- `app/dashboard/bubbles/page.tsx`
- `app/dashboard/quadrant/page.tsx`
- `app/dashboard/periodic-table/page.tsx`
- `app/dashboard/treemap/page.tsx`
- `app/dashboard/tab/market/page.tsx`
- `app/dashboard/tab/financial/page.tsx`


## Deviations
D3 .style() typing doesn't accept null for HTML selections — used 'none'/'0' strings instead. No functional impact.

## Known Issues
None.
