---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Create CollapsibleFilterBar component

New component wrapping top filter UI. Accepts filter state from context. Renders as icon button when collapsed, full filter UI when expanded. Uses useLocalStorage hook for persist state.

## Inputs

- `components/dashboard/filter-bar.tsx (if exists)`
- `contexts/filter-context.tsx`

## Expected Output

- `components/dashboard/collapsible-filter-bar.tsx`

## Verification

Component renders in both states. localStorage key exists. Collapse/expand transitions smooth.
