# S04: Scenario-Aware Narrative Thread

**Goal:** Add narrative guidance layer to the 4 focus scenarios: intro narratives on dashboard landing, per-chart annotations explaining what to look for and why, and a suggested chart reading order with next-step links.
**Demo:** User selects 'White Space Filler' scenario. Dashboard landing shows an intro narrative explaining the analytical journey. Each chart page has a scenario-specific annotation explaining what to look for. A 'Next: See funding patterns →' link guides to the logical next chart.

## Must-Haves

- Not provided.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Scenario narrative data model and content** `est:45m`
  Create lib/scenario-narratives.ts with TypeScript interfaces (ChartStep, Chapter, ScenarioNarrative) and a SCENARIO_NARRATIVES record mapping 4 scenarios (startup_founder, vc_investor, oem_enterprise, isv_platform) to structured narrative content. Each scenario has an intro, 4-5 chapters with chapter intros, and chart steps with path/label/annotation. Add helper functions: getScenarioNarrative, getChartAnnotation (returns annotation + chapter context + navigation info), getFlatReadingOrder.
  - Files: `lib/scenario-narratives.ts`
  - Verify: TypeScript types compile. All 4 scenarios have complete narrative data. Helper functions return correct data for known paths.

- [x] **T02: Journey progress hook and dashboard landing narrative** `est:40m`
  Create hooks/use-journey-progress.ts — an SSR-safe localStorage hook that tracks visited chart paths per scenario with hydration gate. Create components/dashboard/scenario-narrative.tsx — renders on dashboard landing with intro text, chapter grid (clickable cards with completion indicators), progress bar, and start/continue/reset controls.
  - Files: `hooks/use-journey-progress.ts`, `components/dashboard/scenario-narrative.tsx`, `components/dashboard/dashboard-client.tsx`
  - Verify: ScenarioNarrative renders on dashboard landing when a scenario is active. Progress persists across page refreshes. Chapter cards link to first unvisited step. Reset clears progress.

- [x] **T03: Per-chart annotation banner with navigation** `est:30m`
  Create components/dashboard/chart-annotation.tsx — renders a collapsible banner at top of each chart page showing: chapter title and step counter, scenario-specific annotation text, progress bar, and next-step link. Integrates with VizPageShell so it appears on every visualization page automatically. Auto-marks current path as visited via useJourneyProgress.
  - Files: `components/dashboard/chart-annotation.tsx`, `components/dashboard/viz-page-shell.tsx`
  - Verify: Annotation banner appears on chart pages when scenario is active. Shows correct chapter context. Next link navigates to next chart in reading order. Progress bar updates. Banner is collapsible.

## Files Likely Touched

- lib/scenario-narratives.ts
- hooks/use-journey-progress.ts
- components/dashboard/scenario-narrative.tsx
- components/dashboard/dashboard-client.tsx
- components/dashboard/chart-annotation.tsx
- components/dashboard/viz-page-shell.tsx
