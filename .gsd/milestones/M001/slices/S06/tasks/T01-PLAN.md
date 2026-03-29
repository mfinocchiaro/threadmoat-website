---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Add drill-down links to SWOT chart quantified claims

Add companies[] to SwotItem interface. Attach backing company arrays to quantified claims in deriveSwot(). Make SwotQuadrant items with companies clickable with dotted underline and active state. Add drill-down panel below SWOT grid showing company list with name, investment list, country, funding, and score.

## Inputs

- `components/charts/swot-chart.tsx`
- `components/dashboards/startup-dashboard.tsx`

## Expected Output

- `components/charts/swot-chart.tsx`

## Verification

npm run build
