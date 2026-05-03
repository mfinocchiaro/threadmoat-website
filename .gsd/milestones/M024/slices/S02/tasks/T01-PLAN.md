---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Extend FilterContext with hierarchy model

Update filter-context.tsx to distinguish between: (1) sidebarFilters (hypothesis/primary selection), (2) topFilters (refinement). Add methods: applySidebarFilter(), applyTopFilter(), getComposedFilters(). Document precedence: topFilters narrow sidebarFilters results.

## Inputs

- None specified.

## Expected Output

- `Updated filter-context.tsx with hierarchy structure`

## Verification

Context exports separate sidebar and top filter states. getComposedFilters() returns intersection of both. No breaking changes to existing filter API.
