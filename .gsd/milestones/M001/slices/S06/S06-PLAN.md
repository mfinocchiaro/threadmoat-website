# S06: SWOT & Report Drill-Down Links

**Goal:** Make quantified comparative claims in the SWOT chart clickable, showing the exact companies behind each number.
**Demo:** After this: Quantified claims in the SWOT chart ("7 better-funded rivals", "12 higher-scoring competitors", "Crowded segment (45 competitors)") and scenario dashboard KPIs become clickable links showing the exact companies behind each number.

## Tasks
- [x] **T01: Made SWOT chart quantified claims clickable with drill-down showing the exact companies behind each number.** — Add companies[] to SwotItem interface. Attach backing company arrays to quantified claims in deriveSwot(). Make SwotQuadrant items with companies clickable with dotted underline and active state. Add drill-down panel below SWOT grid showing company list with name, investment list, country, funding, and score.
  - Estimate: 10min
  - Files: components/charts/swot-chart.tsx
  - Verify: npm run build
