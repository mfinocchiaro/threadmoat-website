---
id: S04
parent: M018
milestone: M018
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["lib/scenario-narratives.ts", "components/dashboard/scenario-narrative.tsx", "components/dashboard/chart-annotation.tsx", "hooks/use-journey-progress.ts", "components/dashboard/viz-page-shell.tsx", "components/dashboard/dashboard-client.tsx"]
key_decisions:
  - ["Narrative content is hardcoded in TypeScript rather than fetched from API \u2014 ensures instant rendering with no loading states", "VizPageShell injection gives zero-touch coverage of all chart pages", "SSR-safe localStorage pattern (K001) prevents hydration mismatches", "useScenarioOptional for graceful degradation on pages without scenario context"]
patterns_established:
  - ["VizPageShell as injection point for cross-cutting chart page features", "Per-scenario localStorage progress tracking with hydration gate"]
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-11T21:27:59.144Z
blocker_discovered: false
---

# S04: Scenario-Aware Narrative Thread

**Shipped scenario-aware narrative guidance with dashboard intro narratives, per-chart annotations, journey progress tracking, and guided next-step navigation across all 4 scenarios.**

## What Happened

Built a complete narrative guidance layer for the 4 focus scenarios (startup_founder, vc_investor, oem_enterprise, isv_platform). The system has three parts: (1) a structured data model in lib/scenario-narratives.ts with 572 lines of scenario-specific content — each scenario has an intro, 4-5 chapters, and chart steps with unique annotations explaining what to look for in each visualization; (2) a dashboard landing component (ScenarioNarrative) that shows the analytical journey overview with a chapter grid, progress bar, and start/continue links; (3) a per-chart annotation banner (ChartAnnotation) auto-injected via VizPageShell that shows chapter context, step counter, scenario-specific insight text, and next-step navigation. Journey progress persists in localStorage per scenario using an SSR-safe hydration pattern.

## Verification

Build passes with zero errors. All 4 scenarios render distinct narratives on dashboard landing. Chart pages show correct scenario-specific annotations. Next-step links navigate through the reading order. Progress persists across refreshes. Reset clears progress. No annotations shown when no scenario is active. Deployed to production on ThreadMoat.com.

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

None.
