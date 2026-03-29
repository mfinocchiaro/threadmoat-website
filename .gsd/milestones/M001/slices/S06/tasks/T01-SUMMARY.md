---
id: T01
parent: S06
milestone: M001
provides: []
requires: []
affects: []
key_files: ["components/charts/swot-chart.tsx"]
key_decisions: ["Added companies[] field to SwotItem interface for optional backing data", "Drill-down items styled with dotted underline to signal clickability without disrupting layout", "Companies sorted by weightedScore descending in drill-down panel", "Toggle behavior: clicking same item closes drill-down, clicking different item switches", "Drill-down auto-clears when selecting a different company"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build passes with zero errors."
completed_at: 2026-03-27T23:10:25.766Z
blocker_discovered: false
---

# T01: Made SWOT chart quantified claims clickable with drill-down showing the exact companies behind each number.

> Made SWOT chart quantified claims clickable with drill-down showing the exact companies behind each number.

## What Happened
---
id: T01
parent: S06
milestone: M001
key_files:
  - components/charts/swot-chart.tsx
key_decisions:
  - Added companies[] field to SwotItem interface for optional backing data
  - Drill-down items styled with dotted underline to signal clickability without disrupting layout
  - Companies sorted by weightedScore descending in drill-down panel
  - Toggle behavior: clicking same item closes drill-down, clicking different item switches
  - Drill-down auto-clears when selecting a different company
duration: ""
verification_result: passed
completed_at: 2026-03-27T23:10:25.766Z
blocker_discovered: false
---

# T01: Made SWOT chart quantified claims clickable with drill-down showing the exact companies behind each number.

**Made SWOT chart quantified claims clickable with drill-down showing the exact companies behind each number.**

## What Happened

Extended the SwotItem interface with an optional companies[] array. In deriveSwot(), attached the actual company arrays to quantified claims: threats (crowded segment → sameSegment, better-funded rivals → betterFunded, higher-scoring competitors → higherScored) and opportunities (above segment average → belowCompany). Updated SwotQuadrant to accept onDrillDown callback and activeDrillLabel, rendering clickable items with dotted underline and active ring state. Added a drill-down panel below the SWOT grid that shows the backing companies with investment list color dot, name, country, funding amount, and weighted score. Toggle/dismiss behavior matches the existing KPICard drill-down pattern from scenario dashboards.

## Verification

npm run build passes with zero errors.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 16200ms |


## Deviations

Scenario dashboard KPIs already had drill-down from original implementation — no changes needed there. Scope narrowed to SWOT chart only.

## Known Issues

None.

## Files Created/Modified

- `components/charts/swot-chart.tsx`


## Deviations
Scenario dashboard KPIs already had drill-down from original implementation — no changes needed there. Scope narrowed to SWOT chart only.

## Known Issues
None.
