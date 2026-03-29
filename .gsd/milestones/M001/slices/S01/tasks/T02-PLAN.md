# T02: 06-filter-toolbar-redesign 02

**Slice:** S01 — **Milestone:** M001

## Description

Build the new compact sticky FilterToolbar component and wire it into the dashboard layout.

Purpose: Replace the 565-line inline VizFilterBar with a premium, compact toolbar that shows active filters as chips and provides filter category access via popovers. This is the core UI deliverable -- it must look and feel premium B2B ("pop like a mofo"). The toolbar renders once in sidebar-shell.tsx above the content area, sticky at the top of the scroll container.

Output: FilterToolbar component, FilterDropdown popover component, sidebar-shell.tsx updated to render toolbar.

## Must-Haves

- [ ] "A compact sticky toolbar is visible at top of dashboard content area"
- [ ] "Active filters appear as removable pills/chips with X buttons"
- [ ] "Toolbar collapses to a thin bar when no filters are active"
- [ ] "Each filter category can be browsed via a dropdown/popover"
- [ ] "Toolbar never blocks content -- it sticks and scrolls with the content area"

## Files

- `components/dashboard/filter-toolbar.tsx`
- `components/dashboard/filter-toolbar-popover.tsx`
- `components/dashboard/sidebar-shell.tsx`
