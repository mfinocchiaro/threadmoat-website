---
estimated_steps: 2
estimated_files: 6
skills_used: []
---

# T02: Fix theme colors in parallel-coords, radar, sankey, slope, spiral-timeline, splom charts

Same pattern as T01 for the remaining 6 D3 SVG charts.

Files: parallel-coords-chart.tsx (8), radar-chart.tsx (3), sankey-chart.tsx (3), slope-chart.tsx (11), spiral-timeline-chart.tsx (8), splom-chart.tsx (5)

## Inputs

- `T01 pattern established`

## Expected Output

- `6 chart files updated with theme-aware colors`

## Verification

npm run build passes. grep audit clean for all 6 files.
