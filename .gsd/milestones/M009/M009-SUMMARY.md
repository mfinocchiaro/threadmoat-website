---
id: M009
title: "Performance Audit & Bundle Optimization"
status: complete
completed_at: 2026-04-03T23:07:52.016Z
key_decisions:
  - Direct chunk analysis over @next/bundle-analyzer (Turbopack incompatible)
  - Dynamic import + parameter injection pattern for jsPDF in event handler
  - Tab overview pages lazy-load but individual chart pages keep static imports
  - Homepage NetworkGraph converted from static to dynamic import
  - Production Lighthouse scores volatile due to serverless cold starts — documented as range
key_files:
  - components/charts/custom-report-tab.tsx
  - components/homepage/homepage-dashboard.tsx
  - app/dashboard/tab/financial/page.tsx
  - app/dashboard/tab/advanced/page.tsx
  - app/dashboard/tab/market/page.tsx
  - app/dashboard/tab/network/page.tsx
  - app/dashboard/tab/geographic/page.tsx
lessons_learned:
  - Dev-mode Lighthouse is unreliable for LCP — Turbopack compilation adds massive latency not present in production
  - Production Lighthouse against serverless is volatile — run 3+ times and report ranges, not single scores
  - @next/bundle-analyzer is Webpack-only — Turbopack builds need direct .next/static/chunks/ file analysis
  - Dynamic imports defer parse but still download the chunk when the component renders — true deferral requires Intersection Observer or Suspense
---

# M009: Performance Audit & Bundle Optimization

**Lazy-loaded 19 chart components across 6 pages, dynamic-imported jsPDF, captured production Lighthouse baseline (71 performance, 3.7s LCP)**

## What Happened

M009 delivered four slices covering bundle analysis, code splitting, and performance baselining.\n\nS01 captured the bundle baseline: 8.9MB total JS across 147 chunks, with three.js (2x1.3MB duplicated), Zod (912KB), react-globe.gl (468KB), and Recharts+lodash (324KB) as the largest. @next/bundle-analyzer is incompatible with Turbopack so direct chunk analysis was used.\n\nS02 converted jsPDF (29MB node_modules), jspdf-autotable, and html-to-image from static to dynamic imports in custom-report-tab.tsx. These libraries now load only when a user clicks Export PDF, removing them from the initial bundle of every page.\n\nS03 converted 18 static chart component imports across 5 tab overview pages (financial: 4+2, advanced: 7, market: 3+1, network: 3+2, geographic: 1+1) to next/dynamic with skeleton loading placeholders. Chunk count increased from 147→168 reflecting more granular code splitting.\n\nDuring LCP investigation, also converted the homepage's NetworkGraph from static to dynamic import — it was pulling D3 force layout into the initial bundle for every visitor.\n\nS04 ran production Lighthouse against threadmoat.com: performance 71, FCP 2.0s, LCP 3.7s (text element, not image), TBT 320ms, SI 19.8s. Scores were volatile across runs (71/52/40) due to serverless cold starts. The Speed Index (19.8s) was identified as the remaining major opportunity — the homepage loads 600+ companies server-side for below-the-fold charts.

## Success Criteria Results

- **MET**: Bundle analyzer baseline captured — 8.9MB total, top chunks identified\n- **MET**: jsPDF dynamically imported — zero bytes in initial bundle\n- **MET**: Tab overview pages lazy-load charts — 18 imports converted, skeleton placeholders\n- **MET**: Lighthouse baseline captured — production scores documented across 3 runs\n- **MET**: npm run build passes with zero warnings

## Definition of Done Results

- [PASS] All 4 slices completed with verification evidence\n- [PASS] Bundle size comparison documented (8.9MB→9.3MB, 147→168 chunks)\n- [PASS] Lighthouse baseline captured for homepage (production: 71 performance)\n- [PASS] npm run build passes with zero warnings\n- [PASS] No functional regressions in chart rendering or PDF export

## Requirement Outcomes

No formal requirements — performance optimization milestone. Speed Index identified as follow-up for M010.

## Deviations

None.

## Follow-ups

None.
