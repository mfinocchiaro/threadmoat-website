---
id: M006
title: "Heatmap Analytics Suite — Market Momentum, Industry Penetration, Customer Profile & IP Dependency"
status: complete
completed_at: 2026-04-04T07:32:53.675Z
key_decisions:
  - D005: Composite momentum score formula
  - Dual-axis selectable heatmap pattern
  - Admin-only IP Dependency access
  - Geo-region collapsing for geography dimension
key_files:
  - lib/company-data.ts
  - lib/load-companies-server.ts
  - components/charts/market-momentum-heatmap.tsx
  - components/charts/industry-penetration-chart.tsx
  - components/charts/target-customer-profile-chart.tsx
  - components/charts/ip-dependency-chart.tsx
  - components/dashboard/sidebar.tsx
lessons_learned:
  - K005 optional prop pattern proved effective across 4 chart types
  - K008: Register requirement IDs before milestone planning
  - Shared D3 heatmap shell enables rapid new view development
---

# M006: Heatmap Analytics Suite — Market Momentum, Industry Penetration, Customer Profile & IP Dependency

**Delivered four new heatmap analytics views completing the competitive intelligence visualization suite.**

## What Happened

M006 expanded the dashboard with four heatmap views delivered ad-hoc during M005 close-out. S01 built Market Momentum with composite scoring and YlOrRd palette. S02 extended Industry Penetration with customer count mode. S03 built Target Customer Profile with dual-axis selection (4×4×4 config). S04 added admin-only IP Dependency Analysis. All share the Company data model, shortlist highlighting pattern (K005), and sidebar navigation.

## Success Criteria Results

All 6 success criteria passed — 4 heatmaps implemented, dashboard nav integrated, build stable.

## Definition of Done Results

All views render with real CSV data, sidebar nav wired, shortlist highlighting works, build passes, UATs written.

## Requirement Outcomes

No formal requirement IDs registered for M006. K008 documents the lesson for future milestones.

## Deviations

None.

## Follow-ups

None.
