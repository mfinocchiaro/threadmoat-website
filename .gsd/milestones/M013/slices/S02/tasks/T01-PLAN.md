---
estimated_steps: 17
estimated_files: 1
skills_used: []
---

# T01: Build InvestorCompareChart component with selection, metrics, and overlap

1. Create `components/charts/investor-compare-chart.tsx`
2. Accept `data: Company[]` prop
3. Investor selection UI:
   - Search input with autocomplete dropdown
   - Show selected investors as removable badges (max 3)
   - Filter investors to those with 2+ backed companies
4. Build investor profiles from Company data:
   - For each selected investor, find all companies where `company.investors.includes(investorName)`
   - Compute: portfolio size, total funding, avg weighted score, top sectors (from investmentList), funding stage distribution
5. Side-by-side display:
   - Metric cards in columns (one per investor)
   - Sector distribution as stacked bars or badges
   - Funding stage breakdown
6. Overlap section:
   - Find companies backed by 2+ of the selected investors
   - Show overlap count and list of shared companies
   - Highlight unique companies per investor

## Inputs

- `components/charts/investor-explorer-chart.tsx (investor extraction pattern)`
- `lib/company-data.ts (Company.investors[])`

## Expected Output

- `components/charts/investor-compare-chart.tsx`

## Verification

Component renders without errors in build.
