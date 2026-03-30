---
id: T01
parent: S03
milestone: M002
provides: []
requires: []
affects: []
key_files: ["components/charts/candlestick-chart.tsx", "components/charts/bubble-chart.tsx", "components/charts/treemap-chart.tsx", "components/charts/financial-heatmap-chart.tsx"]
key_decisions: ["Added valuationConfidence as a 'qual' column in financial heatmap with levels Reported/Inferred/Estimated", "Used conditional rendering for reportedValuation and reportedValuationYear (only shown when non-empty)"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build passes. grep confirms valuationConfidence in 4 charts, reportedValuation in 4 charts, reportedValuationYear in 2 charts."
completed_at: 2026-03-29T22:22:31.829Z
blocker_discovered: false
---

# T01: Added valuationConfidence, reportedValuation, and reportedValuationYear to tooltips in 4 chart components.

> Added valuationConfidence, reportedValuation, and reportedValuationYear to tooltips in 4 chart components.

## What Happened
---
id: T01
parent: S03
milestone: M002
key_files:
  - components/charts/candlestick-chart.tsx
  - components/charts/bubble-chart.tsx
  - components/charts/treemap-chart.tsx
  - components/charts/financial-heatmap-chart.tsx
key_decisions:
  - Added valuationConfidence as a 'qual' column in financial heatmap with levels Reported/Inferred/Estimated
  - Used conditional rendering for reportedValuation and reportedValuationYear (only shown when non-empty)
duration: ""
verification_result: passed
completed_at: 2026-03-29T22:22:31.830Z
blocker_discovered: false
---

# T01: Added valuationConfidence, reportedValuation, and reportedValuationYear to tooltips in 4 chart components.

**Added valuationConfidence, reportedValuation, and reportedValuationYear to tooltips in 4 chart components.**

## What Happened

Added the 3 unused pipeline fields to 4 chart components. Candlestick chart: added valuationConfidence, reportedValuation, reportedValuationYear to the existing tooltip grid alongside financialConfidence. Bubble chart: appended valuation confidence and reported valuation to the SVG title text. Treemap: added confidence and reported valuation rows to the HTML tooltip. Financial heatmap: added valuationConfidence as a new configurable column in the Confidence group.

## Verification

npm run build passes. grep confirms valuationConfidence in 4 charts, reportedValuation in 4 charts, reportedValuationYear in 2 charts.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 21000ms |
| 2 | `grep -rln valuationConfidence components/charts/` | 0 | ✅ pass — 4 charts reference the field | 50ms |


## Deviations

Added fields to 4 charts instead of the planned 3. Financial heatmap chart got valuationConfidence as a new column in its configurable column system.

## Known Issues

None.

## Files Created/Modified

- `components/charts/candlestick-chart.tsx`
- `components/charts/bubble-chart.tsx`
- `components/charts/treemap-chart.tsx`
- `components/charts/financial-heatmap-chart.tsx`


## Deviations
Added fields to 4 charts instead of the planned 3. Financial heatmap chart got valuationConfidence as a new column in its configurable column system.

## Known Issues
None.
