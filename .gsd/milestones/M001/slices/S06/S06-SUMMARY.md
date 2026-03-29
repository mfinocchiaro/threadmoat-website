---
id: S06
parent: M001
milestone: M001
provides:
  - Clickable drill-down on SWOT quantified claims
requires:
  - slice: S01
    provides: Layout-level FilterProvider for persistent filter state
affects:
  []
key_files:
  - components/charts/swot-chart.tsx
key_decisions:
  - Companies array attached to SwotItem for optional drill-down
  - Dotted underline signals clickability without disrupting layout
  - Drill-down panel shows company list sorted by weighted score
  - Toggle behavior matches existing KPICard drill-down pattern
patterns_established:
  - Attaching backing data arrays to derived analytics items for drill-down
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M001/slices/S06/tasks/T01-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-27T23:10:47.473Z
blocker_discovered: false
---

# S06: SWOT & Report Drill-Down Links

**Quantified SWOT claims now clickable drill-down links showing the exact companies behind each number.**

## What Happened

Extended the SWOT chart to make quantified comparative claims clickable drill-down links. The SwotItem interface gained an optional companies[] array, and deriveSwot() now attaches the actual company arrays to four quantified claims: 'Crowded segment (N competitors)', 'N better-funded rivals', 'N higher-scoring competitors', and 'Above segment average'. SwotQuadrant renders these items with a dotted underline and active ring state. Clicking opens a drill-down panel below the SWOT grid listing every backing company with investment list color, name, country, funding, and weighted score — sorted by score descending. The scenario dashboards (startup, vc, oem, isv) already had clickable KPI cards with drill-down lists from v1.0, so no changes were needed there.

## Verification

npm run build passes with zero errors. Code review confirms: 4 quantified SWOT items now have companies[] attached, SwotQuadrant renders clickable items with dotted underline, drill-down panel shows sorted company list with dismiss button.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Scenario dashboard KPIs already had drill-down from v1.0 — no changes needed. Scope narrowed to SWOT chart only.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `components/charts/swot-chart.tsx` — Added companies[] to SwotItem, attached backing arrays in deriveSwot, made quantified items clickable with drill-down panel
