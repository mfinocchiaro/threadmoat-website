---
id: S01
milestone: M001
title: Filter Toolbar Redesign
status: complete
oneLiner: Replaced the 565-line per-page VizFilterBar with a compact sticky FilterToolbar at layout level, with filter state persisting across all 45+ dashboard page navigations.
completedAt: "2026-03-25"
tasksCompleted: 3
tasksTotal: 3
---

# S01: Filter Toolbar Redesign — Summary

**Replaced the 565-line per-page VizFilterBar with a compact sticky FilterToolbar at layout level, with filter state persisting across all 45+ dashboard page navigations.**

## What Happened

Three tasks executed sequentially to restructure the dashboard filter architecture:

**T01** lifted FilterProvider from per-page (VizPageShell) to layout level (DashboardLayoutClient) and created a new CompanyDataProvider so company data loads once and is shared via context. Provider hierarchy established: PlanProvider > ScenarioProvider > CompanyDataProvider > FilterProvider > LayoutInner. This solved UX-03 (filter state persistence across navigation).

**T02** built the FilterToolbar component (~250 lines) with active filter chips, category dropdown popovers (using shadcn Popover with pill-toggle buttons), specialized FundingRangeDropdown and OceanStrategyDropdown, and inline search. Wired into sidebar-shell.tsx as a sticky element above the scroll content. Premium B2B dark theme styling with backdrop blur.

**T03** mechanically removed VizFilterBar imports and JSX from all 45 dashboard files (41 chart pages + 4 scenario dashboards), cleaned up Fragment wrappers, and removed unused `companies` destructuring from useThesisGatedData calls. Two JSX structure fixes required in map/page.tsx and customers/page.tsx after fragment removal. Build passes with zero VizFilterBar references remaining.

## Verification

All 3 tasks verified individually: `npm run build` passes, zero TypeScript errors in modified files, commit hashes verified (5b33b13, d5252b0, 6d647d4, 343f65c, 5966770, e74c19b). Zero VizFilterBar references remain in app/dashboard/ or components/dashboards/. FilterProvider exists once at layout level.

## Key Files

- `contexts/company-data-context.tsx` — new provider, loads companies once
- `contexts/filter-context.tsx` — added activeFilterCount, clearAllFilters, removeFilter
- `components/dashboard/filter-toolbar.tsx` — compact sticky toolbar
- `components/dashboard/filter-toolbar-popover.tsx` — category popovers
- `components/dashboard/layout-client.tsx` — FilterProvider at layout level
- `components/dashboard/sidebar-shell.tsx` — toolbar rendered in scroll container
- `components/dashboard/viz-page-shell.tsx` — simplified to ThesisProvider only

## Key Decisions

- CompanyDataProvider wraps FilterProvider (company data available before filters)
- Provider hierarchy: PlanProvider > ScenarioProvider > CompanyDataProvider > FilterProvider > LayoutInner
- Filter options computed via useCompanyData() in useFilterOptions hook
- Active filter chips show type label prefix for clarity
- Toolbar z-index 20 (below sidebar 40 and topbar 30)
- viz-filter-bar.tsx kept as deprecated reference, not deleted

## Deviations

3 auto-fixed bugs: (1) invalid useFilter reference in filter-toolbar.tsx removed, (2) JSX structure in map/page.tsx restructured after fragment removal, (3) customers/page.tsx fragment simplified. All minor — no scope changes.

## Known Limitations

- viz-filter-bar.tsx kept as deprecated reference — can be removed in future cleanup
- explore/page.tsx retains its own FilterProvider (standalone public page)

## Requirements

- **UX-01** advanced: compact sticky toolbar rendered in sidebar-shell.tsx
- **UX-02** advanced: active filters shown as Badge chips with X remove buttons
- **UX-03** validated: FilterProvider at layout level — filter state persists across navigation
- **UX-04** advanced: single FilterToolbar at layout level filters all charts via shared context

## Drill-Down

- [T01 Summary](.gsd/milestones/M001/slices/S01/tasks/T01-SUMMARY.md)
- [T02 Summary](.gsd/milestones/M001/slices/S01/tasks/T02-SUMMARY.md)
- [T03 Summary](.gsd/milestones/M001/slices/S01/tasks/T03-SUMMARY.md)
