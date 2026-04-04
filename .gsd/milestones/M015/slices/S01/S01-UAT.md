# S01: Lazy-load heavy charts on all 3 red-tier pages — UAT

**Milestone:** M015
**Written:** 2026-04-04T08:52:35.881Z

## UAT: S01 — Lazy-load Heavy Charts

### Test 1: Dashboard loads without flash
1. Navigate to `/dashboard` (logged in)
2. **Expected:** KPI cards appear immediately, charts show pulse animation then render

### Test 2: Landscape page loads progressively
1. Navigate to `/dashboard/landscape`
2. **Expected:** Title/description appear first, chart loads with skeleton then renders

### Test 3: Investor stats loads progressively
1. Navigate to `/dashboard/investor-stats`
2. **Expected:** Tab headers appear first, chart content loads after

### Test 4: Lighthouse verification
1. Run `npx next build && npx next start`
2. Run `node scripts/lighthouse-dashboard.mjs`
3. **Expected:** /dashboard ≥70, /landscape ≥70, /investor-stats ≥70

### Failure signals
- Charts not rendering after initial skeleton
- Layout shift when charts load
- Lighthouse score below 70 on production build
