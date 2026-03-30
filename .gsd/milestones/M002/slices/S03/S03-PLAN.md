# S03: Surface Pipeline Data in Charts

**Goal:** Surface valuationConfidence, reportedValuation, and reportedValuationYear in relevant chart components.
**Demo:** After this: Charts display valuationConfidence badges, reported valuations, and valuation years in tooltips or legends.

## Tasks
- [x] **T01: Added valuationConfidence, reportedValuation, and reportedValuationYear to tooltips in 4 chart components.** — Identify which charts deal with valuations and funding data. Add valuationConfidence, reportedValuation, and reportedValuationYear to their tooltip/detail displays. Target: candlestick (already has financialConfidence), bubble chart, treemap, parallel coordinates, or any chart displaying estimatedMarketValue.
  - Estimate: 30min
  - Files: components/charts/candlestick-chart.tsx, components/charts/bubble-chart.tsx, components/charts/treemap-chart.tsx, components/charts/parallel-chart.tsx
  - Verify: npm run build passes. grep confirms new fields referenced in at least 3 chart files.
