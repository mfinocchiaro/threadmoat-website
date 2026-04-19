---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T02: Journey progress hook and dashboard landing narrative

Create hooks/use-journey-progress.ts — an SSR-safe localStorage hook that tracks visited chart paths per scenario with hydration gate. Create components/dashboard/scenario-narrative.tsx — renders on dashboard landing with intro text, chapter grid (clickable cards with completion indicators), progress bar, and start/continue/reset controls.

## Inputs

- `ScenarioContext for active scenario`
- `scenario-narratives.ts helpers`

## Expected Output

- `useJourneyProgress hook with visited/markVisited/reset/hydrated`
- `ScenarioNarrative component with chapter grid and progress bar`
- `Integration into dashboard-client.tsx`

## Verification

ScenarioNarrative renders on dashboard landing when a scenario is active. Progress persists across page refreshes. Chapter cards link to first unvisited step. Reset clears progress.
