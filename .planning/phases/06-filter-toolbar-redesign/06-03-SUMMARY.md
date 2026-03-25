---
phase: 06-filter-toolbar-redesign
plan: 03
subsystem: ui
tags: [react, refactor, viz-filter-bar, cleanup, dashboard]

requires:
  - phase: 06-01
    provides: Layout-level FilterProvider for persistent filter state
provides:
  - All 45 dashboard files cleaned of VizFilterBar imports and renders
  - viz-filter-bar.tsx kept as deprecated reference (not deleted)
affects: []

tech-stack:
  added: []
  patterns: [shared-filter-toolbar-only]

key-files:
  created: []
  modified:
    - app/dashboard/*/page.tsx (41 chart page files)
    - components/dashboards/startup-dashboard.tsx
    - components/dashboards/vc-dashboard.tsx
    - components/dashboards/oem-dashboard.tsx
    - components/dashboards/isv-dashboard.tsx

key-decisions:
  - "Kept viz-filter-bar.tsx as deprecated reference, not deleted"
  - "Removed unused 'companies' from useThesisGatedData destructuring where VizFilterBar was the only consumer"
  - "Simplified Fragment wrappers to direct chart component renders after removing VizFilterBar sibling"

patterns-established:
  - "Dashboard pages no longer render inline filter UI -- all filtering via shared toolbar in layout"

requirements-completed: [UX-04]

duration: 6min
completed: 2026-03-25
---

# Phase 06 Plan 03: Remove VizFilterBar from All Dashboard Pages Summary

**Removed VizFilterBar import and JSX from all 45 dashboard files (41 chart pages + 4 scenario dashboards), completing migration to shared FilterToolbar**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-25T07:06:35Z
- **Completed:** 2026-03-25T07:12:52Z
- **Tasks:** 2
- **Files modified:** 45

## Accomplishments
- Removed VizFilterBar import line from all 45 dashboard files
- Removed VizFilterBar JSX rendering from all 45 files
- Cleaned up Fragment wrappers that only existed to hold VizFilterBar + chart as siblings
- Removed unused `companies` variable from useThesisGatedData destructuring in 35+ files
- Fixed JSX structure in map/page.tsx and customers/page.tsx where fragment removal required ternary restructuring
- Full build passes with zero VizFilterBar references in app/ or components/dashboards/

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove VizFilterBar from all individual chart pages (41 files)** - `5966770` (refactor)
2. **Task 2: Remove VizFilterBar from scenario dashboards and verify full build** - `e74c19b` (refactor)

## Files Created/Modified
- 41 chart page/content files under `app/dashboard/` - Removed VizFilterBar import, JSX, and unused destructuring
- `components/dashboards/startup-dashboard.tsx` - Removed VizFilterBar import and conditional render
- `components/dashboards/vc-dashboard.tsx` - Removed VizFilterBar import and conditional render
- `components/dashboards/oem-dashboard.tsx` - Removed VizFilterBar import and conditional render
- `components/dashboards/isv-dashboard.tsx` - Removed VizFilterBar import and conditional render

## Decisions Made
- Kept `components/viz-filter-bar.tsx` as deprecated reference (not deleted) -- can be removed in future cleanup
- Removed `companies` from useThesisGatedData destructuring wherever it was only used for VizFilterBar props
- Left explore/page.tsx's own FilterProvider intact (it's a standalone public page with its own data loading)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed JSX structure in map/page.tsx after fragment removal**
- **Found during:** Task 1
- **Issue:** Removing fragment wrapper around VizFilterBar + ternary left invalid JSX (bare expression in ternary false branch)
- **Fix:** Restructured as chained ternary: `isLoading ? ... : view === "2d" ? ... : ...`
- **Files modified:** app/dashboard/map/page.tsx
- **Committed in:** 5966770

**2. [Rule 1 - Bug] Simplified customers/page.tsx fragment after VizFilterBar removal**
- **Found during:** Task 1
- **Issue:** After removing the conditional VizFilterBar line, the remaining Fragment only contained a ternary -- unnecessary wrapper
- **Fix:** Removed Fragment, used chained ternary directly
- **Files modified:** app/dashboard/customers/page.tsx
- **Committed in:** 5966770

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes necessary for valid JSX after mechanical removal. No scope creep.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All VizFilterBar usages removed from dashboard pages
- `components/viz-filter-bar.tsx` can be safely deleted once Plan 06-02's FilterToolbar is confirmed stable
- All filtering now routes through the shared layout-level FilterProvider (Plan 06-01) and FilterToolbar (Plan 06-02)

## Self-Check: PASSED

- Both task commits verified (5966770, e74c19b)
- Zero VizFilterBar references in app/dashboard/ (0 matches)
- Zero VizFilterBar references in components/dashboards/ (0 matches)
- SUMMARY.md exists
- npm run build passes

---
*Phase: 06-filter-toolbar-redesign*
*Completed: 2026-03-25*
