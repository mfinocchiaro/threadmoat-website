---
id: T01
parent: S01
milestone: M015
key_files:
  - components/dashboards/startup-dashboard.tsx
  - components/dashboards/vc-dashboard.tsx
  - components/dashboards/oem-dashboard.tsx
  - components/dashboards/isv-dashboard.tsx
  - app/dashboard/landscape/page.tsx
  - app/dashboard/investor-stats/page.tsx
key_decisions:
  - Animated pulse placeholders instead of static Skeleton for visual feedback
  - min-h matching chart dimensions to prevent layout shift
duration: 
verification_result: passed
completed_at: 2026-04-04T08:44:46.939Z
blocker_discovered: false
---

# T01: Converted 11 heavy chart components to dynamic imports across 6 files — 4 dashboard scenarios, landscape page, and investor-stats page.

**Converted 11 heavy chart components to dynamic imports across 6 files — 4 dashboard scenarios, landscape page, and investor-stats page.**

## What Happened

Replaced static imports with `next/dynamic` for all heavy D3/SVG chart components:\n\n- **startup-dashboard.tsx**: LandscapeChart, BarChart, PeriodicTable, QuadrantChart, NetworkGraphToggle → all dynamic\n- **vc-dashboard.tsx**: BubbleChart, QuadrantChart, PeriodicTable, NetworkGraphToggle → dynamic (MapChart was already dynamic)\n- **oem-dashboard.tsx**: NetworkGraphToggle, SunburstChart, QuadrantChart, PeriodicTable → all dynamic\n- **isv-dashboard.tsx**: NetworkGraphToggle, PeriodicTable, QuadrantChart, SunburstChart → all dynamic\n- **landscape/page.tsx**: LandscapeChart → dynamic\n- **investor-stats/page.tsx**: InvestorExplorerChart, InvestorStatsChart → dynamic\n\nAll use `ssr: false` and animated skeleton/pulse placeholders matching chart dimensions (min-h-[400-600px]). Build passes with zero errors.

## Verification

Build passes (107 routes, zero errors).

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx next build` | 0 | ✅ pass | 21200ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `components/dashboards/startup-dashboard.tsx`
- `components/dashboards/vc-dashboard.tsx`
- `components/dashboards/oem-dashboard.tsx`
- `components/dashboards/isv-dashboard.tsx`
- `app/dashboard/landscape/page.tsx`
- `app/dashboard/investor-stats/page.tsx`
