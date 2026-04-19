# S04: New Analysis Views

**Goal:** Four new analysis views: funding trends, acquirer fit scoring, market concentration (HHI), and deal flow pipeline
**Demo:** Funding trend chart renders time-series from existing API. Acquirer fit scoring ranks startups for OEM users. Market concentration shows HHI by category. Deal flow pipeline persists user evaluation state.

## Must-Haves

- Funding trend chart renders time-series from existing API. Acquirer fit scoring ranks startups for OEM users. Market concentration shows HHI by category. Deal flow pipeline persists user evaluation state.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [ ] **T01: Funding trends time-series chart + acquirer fit scoring page** `est:40min`
  Create /dashboard/funding-trends page with time-series line chart aggregating funding by year from /api/funding data. Create /dashboard/acquirer-fit page that ranks startups by OEM fit score computed from techDifferentiation, competitiveMoat, and industryImpact. Both are admin-tier pages.
  - Files: `app/dashboard/funding-trends/page.tsx`, `app/dashboard/acquirer-fit/page.tsx`
  - Verify: Both pages render with real data from existing APIs. Charts show meaningful aggregations.

- [ ] **T02: Market concentration HHI + deal flow pipeline** `est:45min`
  Create /dashboard/market-concentration page showing Herfindahl-Hirschman Index by category (revenue concentration). Create /dashboard/deal-flow page with kanban-style pipeline (Screening, Evaluating, Shortlisted, Passed) using localStorage for persistence, backed by a context provider. Add all 4 new pages to sidebar admin section.
  - Files: `app/dashboard/market-concentration/page.tsx`, `app/dashboard/deal-flow/page.tsx`, `contexts/deal-flow-context.tsx`, `components/dashboard/sidebar.tsx`
  - Verify: HHI chart renders per-category concentration. Deal flow pipeline persists evaluation state across page reloads.

## Files Likely Touched

- app/dashboard/funding-trends/page.tsx
- app/dashboard/acquirer-fit/page.tsx
- app/dashboard/market-concentration/page.tsx
- app/dashboard/deal-flow/page.tsx
- contexts/deal-flow-context.tsx
- components/dashboard/sidebar.tsx
