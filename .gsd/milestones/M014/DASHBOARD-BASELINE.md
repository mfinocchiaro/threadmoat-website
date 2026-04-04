# Dashboard Performance Baseline

**Date:** 2026-04-04
**Environment:** Dev server (localhost:3000, Next.js 16 + Turbopack)
**Tool:** Lighthouse 12.8.2 via Puppeteer (desktop, no CPU throttle, 40ms RTT)
**Auth:** Automated login via `scripts/lighthouse-dashboard.mjs`

> ⚠️ Dev server scores — production (Vercel) will differ due to CDN, edge caching, and build optimizations.

## Scores

| Page | Perf | A11y | BP | SEO | Tier |
|------|------|------|----|-----|------|
| `/dashboard` | 64 | 84 | 100 | 100 | 🔴 |
| `/dashboard/bubbles` | 90 | 90 | 100 | 66 | 🟢 |
| `/dashboard/heatmap` | 90 | 87 | 100 | 66 | 🟢 |
| `/dashboard/periodic-table` | 90 | 85 | 100 | 66 | 🟢 |
| `/dashboard/investor-stats` | 67 | 92 | 100 | 66 | 🔴 |
| `/dashboard/landscape` | 58 | 90 | 96 | 66 | 🔴 |
| `/dashboard/market-momentum` | 96 | 87 | 100 | 66 | 🟢 |
| `/dashboard/co-investment` | 95 | 90 | 100 | 66 | 🟢 |
| `/dashboard/reports` | 96 | 91 | 100 | 66 | 🟢 |
| `/dashboard/tab/financial` | 94 | 83 | 100 | 66 | 🟢 |

**Tier legend:** 🟢 90+ | 🟡 70–89 | 🔴 <70

## Averages

| Category | Average |
|----------|---------|
| Performance | **84** |
| Accessibility | **88** |
| Best Practices | **100** |
| SEO | **73** |

## Performance Analysis

### 🟢 High Performers (90+)
- **market-momentum (96)**, **reports (96)**, **co-investment (95)**, **tab/financial (94)**: These pages use deferred D3 rendering or lightweight table components. Chart rendering happens after initial paint.
- **bubbles (90)**, **heatmap (90)**, **periodic-table (90)**: Solid D3/SVG charts with reasonable data volumes.

### 🔴 Low Performers (<70)
- **landscape (58)**: The landscape intro page likely loads a large 3D scene (three.js/react-three-fiber) which blocks the main thread during initial render.
- **dashboard (64)**: The main dashboard page loads summary cards that trigger multiple data computations across all 500+ companies simultaneously.
- **investor-stats (67)**: Loads both the InvestorExplorerChart (table with 2000+ investor rows) and InvestorStatsChart (D3 SVG). The investor CSV fetch + parsing is expensive on first load.

### SEO Note
Dashboard pages score 66 for SEO because they lack `<meta name="description">` tags. This is expected — auth-gated pages shouldn't be indexed by search engines. Public marketing pages score 100.

### Best Practices
All pages score 96–100. The landscape page loses 4 points likely due to deprecated API usage in three.js.

### Accessibility
Range: 83–92. The lower-scoring pages (tab/financial at 83, dashboard at 84) likely have contrast or labeling issues in the dense data tables and summary cards.

## Optimization Targets

| Priority | Target | Potential Impact |
|----------|--------|-----------------|
| High | Lazy-load 3D scene on `/dashboard/landscape` | +20–30 perf points |
| High | Defer investor CSV fetch on `/dashboard/investor-stats` | +15–20 perf points |
| Medium | Virtualize summary cards on `/dashboard` | +10–15 perf points |
| Low | Add meta descriptions to dashboard pages | SEO → 100 (not needed for auth-gated) |
| Low | Audit a11y contrast in data tables | A11y +5–10 on affected pages |

## How to Re-run

```bash
# Ensure dev server is running
npx next dev --turbopack

# In another terminal
source <(grep -E '^(PERF_TEST_EMAIL|PERF_TEST_PASSWORD)=' .env.local | sed 's/^/export /') && \
  node scripts/lighthouse-dashboard.mjs
```

Reports saved to `.gsd/lighthouse/` with timestamps for trend comparison.
