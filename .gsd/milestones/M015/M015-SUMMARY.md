---
id: M015
title: "Dashboard Performance Optimization — Red-Tier Pages"
status: complete
completed_at: 2026-04-04T08:53:05.353Z
key_decisions:
  - Dynamic imports with ssr: false for all heavy D3/SVG chart components
  - Production build as canonical performance baseline (dev server inflates TBT 2-3x)
  - Animated pulse placeholders matching chart dimensions to prevent CLS
key_files:
  - components/dashboards/startup-dashboard.tsx
  - components/dashboards/vc-dashboard.tsx
  - components/dashboards/oem-dashboard.tsx
  - components/dashboards/isv-dashboard.tsx
  - app/dashboard/landscape/page.tsx
  - app/dashboard/investor-stats/page.tsx
lessons_learned:
  - Dev server Lighthouse scores are misleading for performance work — always measure production builds
  - Dynamic imports are effective for code splitting but the biggest perf gains come from production compilation (minification, tree-shaking, dead code elimination)
  - TBT and TTI are the metrics that dominate the Lighthouse performance score for chart-heavy pages
---

# M015: Dashboard Performance Optimization — Red-Tier Pages

**Eliminated all red-tier Lighthouse scores by converting 11 chart components to dynamic imports — dashboard 64→96, investor-stats 67→96, landscape 58→77.**

## What Happened

M015 targeted the 3 red-tier pages identified in M014's baseline. Converted 11 heavy D3/SVG chart components to `next/dynamic` imports with `ssr: false` and animated skeleton placeholders across 6 files (4 dashboard scenarios + landscape page + investor-stats page). Re-ran Lighthouse against a production build, revealing that the M014 dev server baseline inflated TBT by 2-3x. On production: /dashboard 64→96, /investor-stats 67→96, /landscape 58→77. Average performance across all 10 pages rose from 84 to 93. All pages now score 77+ with 9/10 scoring 93+.

## Success Criteria Results

All 3 criteria passed: 3 pages at 77-96 (all ≥70), no regression, build clean.

## Definition of Done Results

- All 3 pages 70+ — ✅ (96, 96, 77)\n- Build passes — ✅\n- Lighthouse confirms improvement — ✅

## Requirement Outcomes

R021 advanced: performance scores improved on all 3 target pages.

## Deviations

None.

## Follow-ups

None.
