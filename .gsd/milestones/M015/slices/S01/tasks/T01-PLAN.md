---
estimated_steps: 11
estimated_files: 6
skills_used: []
---

# T01: Lazy-load heavy charts in dashboard scenario files

1. In each dashboard file (startup-dashboard.tsx, vc-dashboard.tsx, oem-dashboard.tsx, isv-dashboard.tsx):
   - Convert BubbleChart, QuadrantChart, PeriodicTable, NetworkGraphToggle to `dynamic(() => import(...), { ssr: false, loading: () => <Skeleton /> })`
   - MapChart is already dynamic — verify and skip
   - Keep KPI cards and lightweight components as static imports
2. In landscape-intro page:
   - The PieChart/ResponsiveContainer from recharts should already be light enough — check if the landscape-intro or landscape page is the slow one
3. In landscape page:
   - Convert LandscapeChart to dynamic import with skeleton
4. In investor-stats page:
   - Convert InvestorExplorerChart and InvestorStatsChart to dynamic imports with skeleton
5. Build and verify

## Inputs

- `M014 baseline scores`
- `Existing dynamic import pattern from MapChart`

## Expected Output

- `6 files modified with dynamic imports`

## Verification

npx next build passes with zero errors.
