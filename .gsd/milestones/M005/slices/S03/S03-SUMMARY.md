---
id: S03
parent: M005
milestone: M005
provides:
  - ShortlistContext with full API (add/remove/toggle/has/clear/count/ids/idSet/shortlistedCompanies/hydrated)
  - shortlistedIds: Set<string> on useThesisGatedData() return value
  - Amber highlight visual treatment on 4 chart types (bubble, quadrant, periodic-table, treemap)
  - ShortlistPanel popover accessible from filter toolbar
requires:
  []
affects:
  - S04
key_files:
  - contexts/shortlist-context.tsx
  - components/dashboard/shortlist-panel.tsx
  - components/ui/company-hover-card.tsx
  - components/dashboard/filter-toolbar.tsx
  - hooks/use-thesis-gated-data.ts
  - components/charts/bubble-chart.tsx
  - components/charts/quadrant-chart.tsx
  - components/charts/periodic-table.tsx
  - components/charts/treemap-chart.tsx
key_decisions:
  - Radix Popover for shortlist panel — consistent with existing filter dropdowns (D002)
  - Amber #f59e0b with 2.5px stroke for shortlist highlight across all charts; CSS outline on periodic table HTML cells to avoid layout shift (D003)
  - Optional shortlistedIds prop pattern — charts backwards compatible without the prop
  - Exposed idSet (stable memoized Set<string>) on ShortlistContext for chart re-render optimization
patterns_established:
  - Optional Set<string> prop pattern for cross-cutting chart features (K005)
  - K001 SSR-safe localStorage reused for shortlist persistence (same pattern as onboarding guide)
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M005/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M005/slices/S03/tasks/T02-SUMMARY.md
  - .gsd/milestones/M005/slices/S03/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-01T22:23:08.499Z
blocker_discovered: false
---

# S03: Company Shortlist / Workspace

**Users can click companies across any chart to add them to a persistent shortlist with amber highlights across all chart types and a toolbar panel for review/removal.**

## What Happened

Built a complete company shortlist feature in three tasks spanning the full stack from state management to visual rendering.

**T01 — ShortlistContext & state layer.** Created `contexts/shortlist-context.tsx` with the full shortlist API (add/remove/toggle/has/clear/count/ids/idSet/shortlistedCompanies/hydrated) using the K001 SSR-safe localStorage pattern (key: `threadmoat-shortlist`). Wired `ShortlistProvider` into the dashboard provider hierarchy between `CompanyDataProvider` and `FilterProvider` in `layout-client.tsx`. Extended `useThesisGatedData` to return `shortlistedIds: Set<string>` so chart pages access shortlist state without importing the context directly. Added a stable memoized `idSet` (Set<string>) for reference-equality checks in chart re-render optimization.

**T02 — Interaction layer.** Added a Star toggle button to `CompanyHoverCard` — filled amber when shortlisted, outline when not, gated behind hydration to avoid flash. Built `ShortlistPanel` as a Radix Popover with trigger button in the filter toolbar showing a badge count, scrollable company list with per-row remove buttons, Clear All footer action, and empty-state guidance text. Integrated into `filter-toolbar.tsx` between FundingRangeDropdown and search input.

**T03 — Chart highlight layer.** Added optional `shortlistedIds?: Set<string>` prop to 4 chart components (bubble, quadrant, periodic table, treemap) with visual highlight: amber stroke (#f59e0b, 2.5px) on SVG charts, CSS outline + glow + ★ corner indicator on periodic table HTML cells. Updated 6 page files (4 dedicated chart pages + 2 tab overview pages) to destructure and pass `shortlistedIds` from `useThesisGatedData()`. All props optional for backwards compatibility.

No blockers discovered. Build passes clean throughout.

## Verification

All slice-level verification checks pass:

1. `npm run build` — exits 0, zero type errors, all routes compile
2. `grep -q 'ShortlistProvider' components/dashboard/layout-client.tsx` — confirms provider wiring
3. `grep -q 'shortlistedIds' hooks/use-thesis-gated-data.ts` — confirms hook extension
4. `grep -q 'threadmoat-shortlist' contexts/shortlist-context.tsx` — confirms localStorage key
5. `grep -q 'useShortlist' components/ui/company-hover-card.tsx` — confirms hover card toggle
6. `test -f components/dashboard/shortlist-panel.tsx` — confirms panel file exists
7. `grep -q 'shortlist' components/dashboard/filter-toolbar.tsx` — confirms toolbar integration
8. `grep -c 'shortlistedIds'` returns non-zero counts for all 4 chart files (bubble: 6, quadrant: 8, periodic-table: 4, treemap: 5)
9. `grep -rn 'shortlistedIds' app/` — returns matches in all 6 page files confirming prop threading

## Requirements Advanced

- I18N-06 — Not directly related to this slice — I18N-06 was already validated in a prior slice

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

T01: Added `idSet` (stable memoized Set&lt;string&gt;) to context API beyond original plan — provides reference-equality for chart re-render optimization. T03: D3 `.style()` typing doesn't accept null for HTML selections — used 'none'/'0' strings instead of null. No functional impact.

## Known Limitations

None.

## Follow-ups

S04 (Custom Report Builder) is the primary downstream consumer — needs to read shortlistedCompanies from ShortlistContext to populate company selection in the report builder.

## Files Created/Modified

- `contexts/shortlist-context.tsx` — New file — ShortlistContext with full shortlist API, localStorage persistence, SSR-safe hydration
- `components/dashboard/layout-client.tsx` — Added ShortlistProvider between CompanyDataProvider and FilterProvider
- `hooks/use-thesis-gated-data.ts` — Extended to return shortlistedIds: Set<string> from ShortlistContext
- `components/ui/company-hover-card.tsx` — Added Star toggle button for shortlist add/remove
- `components/dashboard/shortlist-panel.tsx` — New file — Radix Popover panel with company list, remove buttons, clear all
- `components/dashboard/filter-toolbar.tsx` — Added ShortlistPanel trigger with badge count
- `components/charts/bubble-chart.tsx` — Added optional shortlistedIds prop with amber stroke highlight
- `components/charts/quadrant-chart.tsx` — Added optional shortlistedIds prop with amber stroke highlight
- `components/charts/periodic-table.tsx` — Added optional shortlistedIds prop with CSS outline + star indicator
- `components/charts/treemap-chart.tsx` — Added optional shortlistedIds prop with amber stroke highlight
- `app/dashboard/bubbles/page.tsx` — Passes shortlistedIds from useThesisGatedData to BubbleChart
- `app/dashboard/quadrant/page.tsx` — Passes shortlistedIds from useThesisGatedData to QuadrantChart
- `app/dashboard/periodic-table/page.tsx` — Passes shortlistedIds from useThesisGatedData to PeriodicTable
- `app/dashboard/treemap/page.tsx` — Passes shortlistedIds from useThesisGatedData to TreemapChart
- `app/dashboard/tab/market/page.tsx` — Passes shortlistedIds to QuadrantChart, BubbleChart, PeriodicTable
- `app/dashboard/tab/financial/page.tsx` — Passes shortlistedIds to TreemapChart
