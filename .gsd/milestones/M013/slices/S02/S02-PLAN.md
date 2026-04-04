# S02: Co-investment heatmap — which investors frequently co-invest

**Goal:** Build an investor comparison page where users select 2-3 investors and see side-by-side portfolio metrics, sector focus, and overlapping companies.
**Demo:** After this: Heatmap showing co-investment frequency between top investors

## Tasks
- [x] **T01: Built InvestorCompareChart with search/select UI, side-by-side portfolio profiles, and overlap analysis.** — 1. Create `components/charts/investor-compare-chart.tsx`
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
  - Estimate: 45min
  - Files: components/charts/investor-compare-chart.tsx
  - Verify: Component renders without errors in build.
- [x] **T02: Created /dashboard/investor-compare page and wired sidebar entry.** — 1. Create `app/dashboard/investor-compare/page.tsx`
2. Add sidebar entry and ADMIN_VIZ_HREFS
3. Build and verify
  - Estimate: 10min
  - Files: app/dashboard/investor-compare/page.tsx, components/dashboard/sidebar.tsx
  - Verify: npx next build passes.
