---
id: T02
parent: S02
milestone: M007
provides: []
requires: []
affects: []
key_files: ["components/charts/customer-network-3d.tsx", "components/charts/investor-network-3d.tsx", "components/charts/network-graph-3d.tsx", "components/charts/globe-chart.tsx"]
key_decisions: ["Used useTheme().resolvedTheme as useMemo dependency to reactively re-resolve CSS vars on theme toggle", "Globe legend/detail panels converted to Tailwind semantic classes rather than JS-resolved vars", "Network graph 3D container changed from bg-black/95 to bg-background"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build passed (exit 0, 22.7s, all 101 routes). Grep audit confirmed zero remaining structural hardcoded dark-theme colors across all 4 files."
completed_at: 2026-04-03T06:05:28.804Z
blocker_discovered: false
---

# T02: Converted hardcoded dark-theme colors in 4 three.js/WebGL charts to CSS custom property resolution via getComputedStyle + useTheme for reactive theme switching

> Converted hardcoded dark-theme colors in 4 three.js/WebGL charts to CSS custom property resolution via getComputedStyle + useTheme for reactive theme switching

## What Happened
---
id: T02
parent: S02
milestone: M007
key_files:
  - components/charts/customer-network-3d.tsx
  - components/charts/investor-network-3d.tsx
  - components/charts/network-graph-3d.tsx
  - components/charts/globe-chart.tsx
key_decisions:
  - Used useTheme().resolvedTheme as useMemo dependency to reactively re-resolve CSS vars on theme toggle
  - Globe legend/detail panels converted to Tailwind semantic classes rather than JS-resolved vars
  - Network graph 3D container changed from bg-black/95 to bg-background
duration: ""
verification_result: passed
completed_at: 2026-04-03T06:05:28.805Z
blocker_discovered: false
---

# T02: Converted hardcoded dark-theme colors in 4 three.js/WebGL charts to CSS custom property resolution via getComputedStyle + useTheme for reactive theme switching

**Converted hardcoded dark-theme colors in 4 three.js/WebGL charts to CSS custom property resolution via getComputedStyle + useTheme for reactive theme switching**

## What Happened

Updated customer-network-3d, investor-network-3d, network-graph-3d, and globe-chart to resolve CSS custom properties (--card, --card-foreground, --muted-foreground, --border) via getComputedStyle keyed on useTheme().resolvedTheme. Tooltip HTML strings, link colors, node colors for logo-bearing items, and globe legend/detail panel overlays all now use theme-aware values. Globe panels converted to Tailwind semantic classes. Network graph container changed from bg-black/95 to bg-background. Data-semantic colors (HUB_COLORS, investorTypeColor, investment palettes) preserved unchanged.

## Verification

npm run build passed (exit 0, 22.7s, all 101 routes). Grep audit confirmed zero remaining structural hardcoded dark-theme colors across all 4 files.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 22700ms |
| 2 | `grep audit (structural hardcoded dark-theme colors across 4 3D files)` | 0 | ✅ pass | 300ms |


## Deviations

Globe chart legend/detail panels used Tailwind semantic classes instead of JS-resolved CSS vars since they are React JSX elements where Tailwind applies directly.

## Known Issues

None.

## Files Created/Modified

- `components/charts/customer-network-3d.tsx`
- `components/charts/investor-network-3d.tsx`
- `components/charts/network-graph-3d.tsx`
- `components/charts/globe-chart.tsx`


## Deviations
Globe chart legend/detail panels used Tailwind semantic classes instead of JS-resolved CSS vars since they are React JSX elements where Tailwind applies directly.

## Known Issues
None.
