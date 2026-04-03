---
id: S03
parent: M006
milestone: M006
provides:
  - TargetCustomerProfileChart component with dual-axis selection
  - /dashboard/customer-profile page route with sidebar navigation
requires:
  []
affects:
  []
key_files:
  - components/charts/target-customer-profile-chart.tsx
  - app/dashboard/customer-profile/page.tsx
  - components/dashboard/sidebar.tsx
key_decisions:
  - Unique gradient ID (target-customer-legend-grad) to avoid SVG collision with industry penetration chart
  - industriesServed added as Y-axis option since X-axis now handles customer profile dimensions
patterns_established:
  - Dual-axis selectable heatmap pattern — both X and Y axes are user-configurable via dropdown selectors, extending the single-fixed-axis pattern from IndustryPenetrationChart
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M006/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M006/slices/S03/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-03T06:50:04.519Z
blocker_discovered: false
---

# S03: Target Customer Profile Heatmap

**Dual-axis selectable heatmap profiling target customers across buyer persona, company size, geography, and deployment model — with configurable Y-axis groupings, four value modes, geo-region collapsing, and shortlist highlighting**

## What Happened

Cloned the IndustryPenetrationChart D3 heatmap pattern and restructured it into a fully dual-axis-selectable heatmap. T01 built the core `TargetCustomerProfileChart` component with four X-axis customer profile dimensions (Buyer Persona, Company Size, Geography, Deployment Model), four Y-axis groupings (Industries Served, Investment Thesis, Workflow Segment, Manufacturing Type), and four value modes (count, avg score, avg funding, customer count). The Geography dimension collapses 43 country values into 8 geographic regions via a `getGeoRegion()` helper that strips emoji flags and normalizes country names. Shortlist highlighting uses the optional prop pattern (K005) with amber borders, and cell text rendering is guarded by `w > 20 && h > 16` to suppress labels in small cells. The SVG legend gradient uses a unique ID (`target-customer-legend-grad`) to avoid collision with the industry penetration chart.

T02 wired the page route at `/dashboard/customer-profile` using the established VizPageShell + useThesisGatedData pattern, added the Customer Profile entry (UserCircle icon) to the sidebar ADMIN_ITEMS after Market Momentum, and registered the route in ADMIN_VIZ_HREFS. Full `npx next build` passes with zero errors and the route appears in the build output.

## Verification

All slice-level verification checks passed:
1. Chart file exists at components/charts/target-customer-profile-chart.tsx
2. grep confirmed buyerPersona, getGeoRegion, shortlistedIds all present in chart
3. Page route exists at app/dashboard/customer-profile/page.tsx
4. Sidebar has customer-profile entry in both ADMIN_ITEMS and ADMIN_VIZ_HREFS
5. `npx next build` passes with zero errors — /dashboard/customer-profile appears in route listing
6. Hotspot insight bar, tooltip, color legend, and cell text guard all present in chart code

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `components/charts/target-customer-profile-chart.tsx` — New D3 heatmap component with 4 X-axis customer dimensions, 4 Y-axis groupings, 4 value modes, geo-region collapsing, shortlist highlighting, hotspot bar, tooltip, and color legend
- `app/dashboard/customer-profile/page.tsx` — New page route using VizPageShell + useThesisGatedData pattern with TargetCustomerProfileChart
- `components/dashboard/sidebar.tsx` — Added Customer Profile entry to ADMIN_ITEMS and /dashboard/customer-profile to ADMIN_VIZ_HREFS
