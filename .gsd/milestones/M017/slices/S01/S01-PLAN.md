# S01: Add Subcategory filter as contextual secondary to Investment List

**Goal:** Replace Subsegment filter with Subcategory, make it contextually filtered by Investment List selection.
**Demo:** After this: Select an Investment List → Subcategory dropdown shows only matching subcategories

## Tasks
- [x] **T01: Added contextual Subcategory filter — shows only subcategories within selected Investment Lists, replaces Subsegment in toolbar.** — 1. In filter-context.tsx:
   - Add subcategories: string[] to FilterState
   - Add filter logic: if filters.subcategories.length > 0, check company.subcategories
   - Add to activeFilterCount
   - Add to clearAllFilters
2. In filter-toolbar.tsx:
   - Replace Subsegment dropdown with Subcategory
   - Compute subcategory options: if investmentLists filter is active, only show subcategories from companies in those lists
   - Update FILTER_LABELS
3. Build and verify
  - Estimate: 20min
  - Files: contexts/filter-context.tsx, components/dashboard/filter-toolbar.tsx
  - Verify: Build passes.
