---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T03: Per-chart annotation banner with navigation

Create components/dashboard/chart-annotation.tsx — renders a collapsible banner at top of each chart page showing: chapter title and step counter, scenario-specific annotation text, progress bar, and next-step link. Integrates with VizPageShell so it appears on every visualization page automatically. Auto-marks current path as visited via useJourneyProgress.

## Inputs

- `ScenarioContext (optional)`
- `scenario-narratives.ts getChartAnnotation helper`
- `useJourneyProgress hook`

## Expected Output

- `ChartAnnotation component with collapsible body`
- `VizPageShell renders ChartAnnotation automatically`
- `Auto-visit tracking on page load`

## Verification

Annotation banner appears on chart pages when scenario is active. Shows correct chapter context. Next link navigates to next chart in reading order. Progress bar updates. Banner is collapsible.
