---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T04: Manual E2E testing across all scenarios

Test each dashboard scenario (startup, VC, OEM, ISV): (1) Set sidebar hypothesis, verify results, (2) Apply top filter, verify results narrow, (3) Change sidebar hypothesis, verify top filter still applies. Test interactions with graphs.

## Inputs

- `components/dashboards/*.tsx`

## Expected Output

- `Manual test results documenting E2E filter behavior`

## Verification

All 4 dashboards show correct combined filter results. No visual regressions. Graphs respond to filter changes.
