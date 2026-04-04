# S01: Investor data audit & portfolio drill-down page

**Goal:** Build a co-investment heatmap showing which investors frequently co-invest, with drill-down to shared companies. Filter to investors with 2+ companies, render top co-investor pairs as an interactive D3 heatmap.
**Demo:** After this: Select an investor → see all companies they've backed with scores, funding, and stage breakdown

## Tasks
- [x] **T01: Built CoInvestmentHeatmap chart component with D3 matrix, summary cards, drill-down dialog, and configurable minimum threshold.** — 1. Create `components/charts/co-investment-heatmap.tsx`
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
  - Estimate: 45min
  - Files: components/charts/co-investment-heatmap.tsx
  - Verify: Component renders without errors in build. Will verify visually in T02.
- [x] **T02: Created /dashboard/co-investment page route and wired sidebar entry with GitCompare icon.** — 1. Create `app/dashboard/co-investment/page.tsx`:
   - Use VizPageShell wrapper
   - Use useThesisGatedData() for company data
   - Render CoInvestmentHeatmap component
   - Add title and description
2. Add sidebar entry in `components/dashboard/sidebar.tsx`:
   - Add to ADMIN_ITEMS or appropriate section
   - Icon: Grid3X3 or similar from lucide-react
   - Label: 'Co-Investment'
3. Add route to ADMIN_VIZ_HREFS
4. Build and verify in browser
  - Estimate: 15min
  - Files: app/dashboard/co-investment/page.tsx, components/dashboard/sidebar.tsx
  - Verify: npx next build passes. Navigate to /dashboard/co-investment in browser and verify heatmap renders with real data.
