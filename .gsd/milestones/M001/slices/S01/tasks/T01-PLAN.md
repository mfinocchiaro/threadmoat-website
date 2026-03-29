# T01: 06-filter-toolbar-redesign 01

**Slice:** S01 — **Milestone:** M001

## Description

Lift FilterProvider and company data loading from per-page to layout level so filter state persists across dashboard navigation.

Purpose: This is the architectural foundation for the filter toolbar redesign. Currently, VizPageShell creates a new FilterProvider on every chart page, resetting filter state on navigation. By lifting FilterProvider to layout-client.tsx and creating a shared CompanyDataProvider, all downstream work (toolbar UI, page cleanup) can consume shared filter state and company data.

Output: FilterProvider at layout level, CompanyDataProvider for shared data, VizPageShell simplified to ThesisProvider-only.

## Must-Haves

- [ ] "FilterProvider exists once at layout level, not per-page"
- [ ] "Company data loads once and is shared via context"
- [ ] "Filter state persists when navigating between dashboard chart pages"

## Files

- `contexts/filter-context.tsx`
- `contexts/company-data-context.tsx`
- `components/dashboard/layout-client.tsx`
- `components/dashboard/viz-page-shell.tsx`
- `components/dashboard/dashboard-client.tsx`
