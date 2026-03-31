# S03: Complete Confidence Metadata in All Charts

**Goal:** Add valuationConfidence/reportedValuation to all remaining charts that use estimatedMarketValue.
**Demo:** After this: All charts displaying estimatedMarketValue show valuationConfidence in their tooltips.

## Tasks
- [x] **T01: Added confidence metadata to parallel-coords, slope chart, and CompanyHoverCard (shared across multiple charts).** — Add valuationConfidence and reportedValuation to tooltips in: box-plot-chart, parallel-coords-chart, periodic-table, slope-chart. Skip network-graph and network-graph-3d (node hover, limited space). Skip report-generator (PDF output, different format).
  - Estimate: 25min
  - Files: components/charts/box-plot-chart.tsx, components/charts/parallel-coords-chart.tsx, components/charts/periodic-table.tsx, components/charts/slope-chart.tsx
  - Verify: npm run build passes. grep confirms valuationConfidence in chart files.
