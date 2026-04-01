---
id: T02
parent: S03
milestone: M005
provides: []
requires: []
affects: []
key_files: ["components/ui/company-hover-card.tsx", "components/dashboard/shortlist-panel.tsx", "components/dashboard/filter-toolbar.tsx"]
key_decisions: ["Used Radix Popover for shortlist panel — lightweight, anchored to toolbar trigger, consistent with existing filter dropdowns"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build passes clean with zero type errors. All grep checks confirm: useShortlist in hover card, ShortlistPanel in toolbar, shortlist-panel.tsx exists. Slice-level checks also pass: ShortlistProvider in layout, shortlistedIds in hook, localStorage key present."
completed_at: 2026-04-01T22:15:36.162Z
blocker_discovered: false
---

# T02: Added shortlist star toggle to CompanyHoverCard and built ShortlistPanel popover in filter toolbar with badge count, company list, remove buttons, and clear-all action

> Added shortlist star toggle to CompanyHoverCard and built ShortlistPanel popover in filter toolbar with badge count, company list, remove buttons, and clear-all action

## What Happened
---
id: T02
parent: S03
milestone: M005
key_files:
  - components/ui/company-hover-card.tsx
  - components/dashboard/shortlist-panel.tsx
  - components/dashboard/filter-toolbar.tsx
key_decisions:
  - Used Radix Popover for shortlist panel — lightweight, anchored to toolbar trigger, consistent with existing filter dropdowns
duration: ""
verification_result: passed
completed_at: 2026-04-01T22:15:36.162Z
blocker_discovered: false
---

# T02: Added shortlist star toggle to CompanyHoverCard and built ShortlistPanel popover in filter toolbar with badge count, company list, remove buttons, and clear-all action

**Added shortlist star toggle to CompanyHoverCard and built ShortlistPanel popover in filter toolbar with badge count, company list, remove buttons, and clear-all action**

## What Happened

Updated CompanyHoverCard with a Star toggle button (filled amber when shortlisted, outline when not) gated behind hydration, using e.stopPropagation() to prevent hover card dismissal. Created ShortlistPanel as a Radix Popover with trigger button showing badge count, scrollable company list with per-row remove buttons, Clear All footer, and empty-state guidance. Integrated ShortlistPanel into filter-toolbar.tsx between FundingRangeDropdown and the search input.

## Verification

npm run build passes clean with zero type errors. All grep checks confirm: useShortlist in hover card, ShortlistPanel in toolbar, shortlist-panel.tsx exists. Slice-level checks also pass: ShortlistProvider in layout, shortlistedIds in hook, localStorage key present.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 15500ms |
| 2 | `grep -q 'useShortlist' components/ui/company-hover-card.tsx` | 0 | ✅ pass | 50ms |
| 3 | `grep -q 'ShortlistPanel\|shortlist-panel' components/dashboard/filter-toolbar.tsx` | 0 | ✅ pass | 50ms |
| 4 | `test -f components/dashboard/shortlist-panel.tsx` | 0 | ✅ pass | 50ms |
| 5 | `grep -q 'shortlist' components/dashboard/filter-toolbar.tsx` | 0 | ✅ pass | 50ms |
| 6 | `grep -q 'ShortlistProvider' components/dashboard/layout-client.tsx` | 0 | ✅ pass | 50ms |
| 7 | `grep -q 'shortlistedIds' hooks/use-thesis-gated-data.ts` | 0 | ✅ pass | 50ms |
| 8 | `grep -q 'threadmoat-shortlist' contexts/shortlist-context.tsx` | 0 | ✅ pass | 50ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `components/ui/company-hover-card.tsx`
- `components/dashboard/shortlist-panel.tsx`
- `components/dashboard/filter-toolbar.tsx`


## Deviations
None.

## Known Issues
None.
