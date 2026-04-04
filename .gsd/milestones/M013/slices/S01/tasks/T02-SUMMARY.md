---
id: T02
parent: S01
milestone: M013
key_files:
  - app/dashboard/co-investment/page.tsx
  - components/dashboard/sidebar.tsx
key_decisions:
  - GitCompare icon for co-investment — visually represents comparison/overlap
duration: 
verification_result: passed
completed_at: 2026-04-04T07:59:00.591Z
blocker_discovered: false
---

# T02: Created /dashboard/co-investment page route and wired sidebar entry with GitCompare icon.

**Created /dashboard/co-investment page route and wired sidebar entry with GitCompare icon.**

## What Happened

Created `app/dashboard/co-investment/page.tsx` using the standard VizPageShell + useThesisGatedData pattern. Added sidebar entry to ADMIN_ITEMS with GitCompare icon and added the route to ADMIN_VIZ_HREFS. Build passes with the new route registered. Auth redirect works correctly — navigating to `/dashboard/co-investment` without auth redirects to login with the correct callback URL.

## Verification

Build passes (106 routes). Auth redirect verified in browser. Route `/dashboard/co-investment` registered.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx next build` | 0 | ✅ pass | 19000ms |
| 2 | `browser navigate to /dashboard/co-investment` | 0 | ✅ pass (auth redirect works) | 2000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `app/dashboard/co-investment/page.tsx`
- `components/dashboard/sidebar.tsx`
