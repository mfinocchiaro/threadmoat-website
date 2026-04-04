---
id: T01
parent: S01
milestone: M013
key_files:
  - components/charts/co-investment-heatmap.tsx
key_decisions:
  - Top 25 investors by co-investment score to keep heatmap readable
  - Purple color scale (interpolatePurples) to differentiate from YlOrRd momentum heatmap
  - Unique gradient ID co-invest-legend-grad to avoid SVG collision
duration: 
verification_result: passed
completed_at: 2026-04-04T07:58:50.962Z
blocker_discovered: false
---

# T01: Built CoInvestmentHeatmap chart component with D3 matrix, summary cards, drill-down dialog, and configurable minimum threshold.

**Built CoInvestmentHeatmap chart component with D3 matrix, summary cards, drill-down dialog, and configurable minimum threshold.**

## What Happened

Created `components/charts/co-investment-heatmap.tsx` (315 lines). The component computes a co-investment matrix from `Company.investors[]` arrays — for each company with 2+ investors, generates all investor pairs and counts shared companies. Filters to top 25 investors by co-investment involvement, renders as a D3 SVG heatmap with sequential purple color scale. Features: summary cards (total pairs, shared deals, strongest pair), minimum threshold selector (1/2/3/5+), hover tooltips, click-to-drill-down dialog showing shared companies sorted by funding. Follows existing heatmap patterns (Market Momentum) for styling and tooltip behavior.

## Verification

Build passes with zero errors.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx next build` | 0 | ✅ pass | 19000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `components/charts/co-investment-heatmap.tsx`
