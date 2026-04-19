---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Scenario narrative data model and content

Create lib/scenario-narratives.ts with TypeScript interfaces (ChartStep, Chapter, ScenarioNarrative) and a SCENARIO_NARRATIVES record mapping 4 scenarios (startup_founder, vc_investor, oem_enterprise, isv_platform) to structured narrative content. Each scenario has an intro, 4-5 chapters with chapter intros, and chart steps with path/label/annotation. Add helper functions: getScenarioNarrative, getChartAnnotation (returns annotation + chapter context + navigation info), getFlatReadingOrder.

## Inputs

- `Dashboard chart routes`
- `4 scenario types from ScenarioContext`

## Expected Output

- `SCENARIO_NARRATIVES with 4 complete scenario entries`
- `getScenarioNarrative helper`
- `getChartAnnotation helper with chapter/step/navigation context`
- `getFlatReadingOrder helper`

## Verification

TypeScript types compile. All 4 scenarios have complete narrative data. Helper functions return correct data for known paths.
