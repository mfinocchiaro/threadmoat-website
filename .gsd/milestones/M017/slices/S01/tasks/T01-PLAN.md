---
estimated_steps: 10
estimated_files: 2
skills_used: []
---

# T01: Add subcategories filter to context, update toolbar with contextual options

1. In filter-context.tsx:
   - Add subcategories: string[] to FilterState
   - Add filter logic: if filters.subcategories.length > 0, check company.subcategories
   - Add to activeFilterCount
   - Add to clearAllFilters
2. In filter-toolbar.tsx:
   - Replace Subsegment dropdown with Subcategory
   - Compute subcategory options: if investmentLists filter is active, only show subcategories from companies in those lists
   - Update FILTER_LABELS
3. Build and verify

## Inputs

- `Current filter-context.tsx`
- `Current filter-toolbar.tsx`

## Expected Output

- `2 files modified`

## Verification

Build passes.
