# S01: Collapsible Top Filter Bar UI

**Goal:** Replace static top filter bar with collapsible component that saves screen real estate
**Demo:** Click filter button to expand/collapse top filters; state persists on page reload

## Must-Haves

- Top filter bar collapses to icon-only button. Expanded state shows all current filters. State persists in localStorage.

## Proof Level

- This slice proves: Manual UI testing across all dashboard scenarios (startup, VC, OEM, ISV)

## Integration Closure

Collapsible component integrates with existing filter context without breaking current filter functionality

## Verification

- No new observability needed; uses existing filter tracking

## Tasks

- [ ] **T01: Create CollapsibleFilterBar component** `est:2h`
  New component wrapping top filter UI. Accepts filter state from context. Renders as icon button when collapsed, full filter UI when expanded. Uses useLocalStorage hook for persist state.
  - Files: `components/dashboard/collapsible-filter-bar.tsx`
  - Verify: Component renders in both states. localStorage key exists. Collapse/expand transitions smooth.

- [ ] **T02: Integrate CollapsibleFilterBar into dashboard layouts** `est:1.5h`
  Update each dashboard view (startup, VC, OEM, ISV) to use new CollapsibleFilterBar instead of static filter display. Pass filter context props.
  - Files: `components/dashboards/startup-dashboard.tsx`, `components/dashboards/vc-dashboard.tsx`, `components/dashboards/oem-dashboard.tsx`, `components/dashboards/isv-dashboard.tsx`
  - Verify: Each dashboard displays collapsible filter bar. All 4 dashboards render without errors. Filter state still accessible.

- [ ] **T03: Test collapse/expand state persistence** `est:1h`
  Manually test: collapse filters, navigate between pages, reload page. Verify state persists. Test across different browsers/devices.
  - Verify: localStorage shows 'dashboard-filters-collapsed' key. State persists on reload. State clears on logout.

## Files Likely Touched

- components/dashboard/collapsible-filter-bar.tsx
- components/dashboards/startup-dashboard.tsx
- components/dashboards/vc-dashboard.tsx
- components/dashboards/oem-dashboard.tsx
- components/dashboards/isv-dashboard.tsx
