---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T02: Refactor filter application in dashboards

Update all 4 dashboards (startup, VC, OEM, ISV) to use getComposedFilters() instead of direct filterCompany(). Ensure graphs receive combined filter results. Keep sidebar and top filters visually distinct.

## Inputs

- `contexts/filter-context.tsx`

## Expected Output

- `Updated dashboard files with refactored filter application`

## Verification

Each dashboard applies combined filters. Graphs update when either sidebar or top filter changes. No filter logic duplicated across dashboards.
