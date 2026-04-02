---
estimated_steps: 3
estimated_files: 9
skills_used: []
---

# T01: Fix theme colors in 9 remaining D3/SVG charts

Fix 9 remaining D3/SVG charts that don't need special 3D handling.

Files: chord-chart.tsx (2), customer-network.tsx (5), investor-network.tsx (6), investor-stats-chart.tsx (9), network-graph.tsx (7), periodic-table.tsx (1), timeline-chart.tsx (2), treemap-chart.tsx (4), wordcloud-chart.tsx (3)

Same getPropertyValue pattern. For files with only 1-2 hardcoded colors, the fix is minimal.

## Inputs

- `S01 pattern established`

## Expected Output

- `9 chart files updated`

## Verification

npm run build passes. grep audit clean for all 9 files.
