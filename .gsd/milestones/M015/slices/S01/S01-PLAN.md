# S01: Lazy-load heavy charts on all 3 red-tier pages

**Goal:** Apply lazy-loading with skeleton placeholders to heavy chart components on 3 red-tier pages, then verify via Lighthouse re-run.
**Demo:** After this: All 3 pages load faster — skeleton shows first, then charts render. Lighthouse re-run shows 70+.

## Tasks
- [x] **T01: Converted 11 heavy chart components to dynamic imports across 6 files — 4 dashboard scenarios, landscape page, and investor-stats page.** — 1. In each dashboard file (startup-dashboard.tsx, vc-dashboard.tsx, oem-dashboard.tsx, isv-dashboard.tsx):
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
  - Estimate: 25min
  - Files: components/dashboards/startup-dashboard.tsx, components/dashboards/vc-dashboard.tsx, components/dashboards/oem-dashboard.tsx, components/dashboards/isv-dashboard.tsx, app/dashboard/landscape/page.tsx, app/dashboard/investor-stats/page.tsx
  - Verify: npx next build passes with zero errors.
- [x] **T02: Lighthouse re-run on production build shows all 3 red-tier pages now at 77-96 — all above the 70 target.** — 1. Start dev server
2. Run scripts/lighthouse-dashboard.mjs
3. Compare scores against M014 baseline
4. All 3 target pages must score 70+
5. If any page is still below 70, apply additional optimizations (defer data loading, reduce initial render scope)
6. Document final scores
  - Estimate: 15min
  - Verify: Lighthouse scores ≥70 for /dashboard, /dashboard/landscape, /dashboard/investor-stats
