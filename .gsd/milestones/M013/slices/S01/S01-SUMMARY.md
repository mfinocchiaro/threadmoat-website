---
id: S01
parent: M013
milestone: M013
provides:
  - Co-investment heatmap page at /dashboard/co-investment
  - Pattern for extracting investor pairs from company data
requires:
  []
affects:
  - S02
key_files:
  - components/charts/co-investment-heatmap.tsx
  - app/dashboard/co-investment/page.tsx
  - components/dashboard/sidebar.tsx
key_decisions:
  - Top 25 investors by co-investment score keeps heatmap readable
  - Purple color scale differentiates from YlOrRd momentum heatmap
  - Minimum threshold selector for noise control
patterns_established:
  - Co-investment matrix computation from Company.investors[] arrays — reusable for S02 comparison
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M013/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M013/slices/S01/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-04T07:59:21.707Z
blocker_discovered: false
---

# S01: Co-investment heatmap — which investors frequently co-invest

**Built a co-investment heatmap at /dashboard/co-investment showing top 25 co-investing investor pairs with drill-down to shared companies.**

## What Happened

Built a 315-line CoInvestmentHeatmap component that computes a co-investment matrix from Company.investors[] arrays. For each company with 2+ investors, generates all pairs and counts shared companies. Filters to top 25 investors by co-investment score, renders as a D3 SVG heatmap with sequential purple scale. Features summary cards, configurable minimum threshold (1/2/3/5+), hover tooltips, and click-to-drill-down dialog showing shared companies sorted by funding. Page wired at /dashboard/co-investment with VizPageShell and sidebar entry using GitCompare icon.

## Verification

Build passes (106 routes, zero errors). Auth redirect works. Route registered.

## Requirements Advanced

- R020 — Co-investment heatmap page delivered with drill-down

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

Visual verification with real data requires user login. Component follows proven heatmap patterns from M006.

## Follow-ups

None.

## Files Created/Modified

- `components/charts/co-investment-heatmap.tsx` — New 315-line D3 heatmap component for co-investment matrix
- `app/dashboard/co-investment/page.tsx` — New page route with VizPageShell + useThesisGatedData
- `components/dashboard/sidebar.tsx` — Added co-investment to ADMIN_ITEMS and ADMIN_VIZ_HREFS
