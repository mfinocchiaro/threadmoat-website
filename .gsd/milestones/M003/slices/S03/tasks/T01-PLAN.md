---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T01: Add confidence metadata to remaining charts

Add valuationConfidence and reportedValuation to tooltips in: box-plot-chart, parallel-coords-chart, periodic-table, slope-chart. Skip network-graph and network-graph-3d (node hover, limited space). Skip report-generator (PDF output, different format).

## Inputs

- None specified.

## Expected Output

- `Updated chart components`

## Verification

npm run build passes. grep confirms valuationConfidence in chart files.
