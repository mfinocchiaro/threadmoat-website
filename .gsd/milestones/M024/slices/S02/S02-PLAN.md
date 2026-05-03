# S02: Filter Hierarchy & Graph Reactivity

**Goal:** Establish clear precedence: sidebar filters create hypothesis → top filters refine → graphs react to combined filters
**Demo:** Create hypothesis in sidebar (e.g., 'Series B+ in AI'). Graphs show matches. Use top filter (e.g., 'US only'). Graphs update to show intersected results.

## Must-Haves

- Top filters visibly refine sidebar hypothesis results. All 4 dashboards (startup, VC, OEM, ISV) apply combined filters correctly. No duplicate filtering logic.

## Proof Level

- This slice proves: Automated tests for filter composition + manual E2E across all dashboard scenarios

## Integration Closure

Filter context extended with hierarchy concept. Existing filter application points updated to respect hierarchy.

## Verification

- Add event tracking: 'filter.refined_by_top_filter' with sidebar hypothesis + top filter values

## Tasks

- [ ] **T01: Extend FilterContext with hierarchy model** `est:2h`
  Update filter-context.tsx to distinguish between: (1) sidebarFilters (hypothesis/primary selection), (2) topFilters (refinement). Add methods: applySidebarFilter(), applyTopFilter(), getComposedFilters(). Document precedence: topFilters narrow sidebarFilters results.
  - Files: `contexts/filter-context.tsx`
  - Verify: Context exports separate sidebar and top filter states. getComposedFilters() returns intersection of both. No breaking changes to existing filter API.

- [ ] **T02: Refactor filter application in dashboards** `est:3h`
  Update all 4 dashboards (startup, VC, OEM, ISV) to use getComposedFilters() instead of direct filterCompany(). Ensure graphs receive combined filter results. Keep sidebar and top filters visually distinct.
  - Files: `components/dashboards/startup-dashboard.tsx`, `components/dashboards/vc-dashboard.tsx`, `components/dashboards/oem-dashboard.tsx`, `components/dashboards/isv-dashboard.tsx`
  - Verify: Each dashboard applies combined filters. Graphs update when either sidebar or top filter changes. No filter logic duplicated across dashboards.

- [ ] **T03: Add filter composition tests** `est:1.5h`
  Write unit tests for getComposedFilters() with multiple scenarios: sidebar filter only, top filter only, both filters combined, empty filters. Test intersection logic.
  - Files: `contexts/__tests__/filter-context.test.ts`
  - Verify: All filter composition scenarios have passing tests. Coverage > 80% for filter logic.

- [ ] **T04: Manual E2E testing across all scenarios** `est:2h`
  Test each dashboard scenario (startup, VC, OEM, ISV): (1) Set sidebar hypothesis, verify results, (2) Apply top filter, verify results narrow, (3) Change sidebar hypothesis, verify top filter still applies. Test interactions with graphs.
  - Verify: All 4 dashboards show correct combined filter results. No visual regressions. Graphs respond to filter changes.

## Files Likely Touched

- contexts/filter-context.tsx
- components/dashboards/startup-dashboard.tsx
- components/dashboards/vc-dashboard.tsx
- components/dashboards/oem-dashboard.tsx
- components/dashboards/isv-dashboard.tsx
- contexts/__tests__/filter-context.test.ts
