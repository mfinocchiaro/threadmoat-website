---
estimated_steps: 14
estimated_files: 1
skills_used: []
---

# T01: Build CoInvestmentHeatmap chart component

1. Create `components/charts/co-investment-heatmap.tsx`
2. Accept `data: Company[]` prop
3. Compute co-investment matrix:
   - For each company, get its `investors[]` array
   - For each pair of investors in the same company, increment their co-investment count
   - Filter to investors with 2+ backed companies (exclude noise)
   - Take top 25-30 investors by total co-investment count
4. Render as a D3 SVG heatmap:
   - X and Y axes: investor names (rotated labels)
   - Cell color: co-investment count (sequential blue or purple scale)
   - Tooltip on hover: 'Investor A × Investor B: N shared companies'
5. Add click handler on cells: show a dialog/panel listing shared companies
6. Include a minimum co-investment threshold selector (1, 2, 3+)
7. Follow existing heatmap patterns (Market Momentum, Customer Profile) for styling

## Inputs

- `components/charts/market-momentum-heatmap.tsx (heatmap pattern)`
- `lib/company-data.ts (Company.investors[])`

## Expected Output

- `components/charts/co-investment-heatmap.tsx`

## Verification

Component renders without errors in build. Will verify visually in T02.
