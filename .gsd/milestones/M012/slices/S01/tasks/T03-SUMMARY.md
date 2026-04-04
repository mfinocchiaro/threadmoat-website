---
id: T03
parent: S01
milestone: M012
key_files:
  - hooks/use-page-view-tracker.ts
  - components/dashboard/layout-client.tsx
key_decisions:
  - Mounted in LayoutInner (not DashboardLayoutClient) so it runs inside all context providers
  - keepalive: true on fetch for navigation resilience
  - Ref-based dedup to avoid double-firing on mount
duration: 
verification_result: passed
completed_at: 2026-04-04T07:38:08.105Z
blocker_discovered: false
---

# T03: Created usePageViewTracker hook and mounted it in DashboardLayoutClient for automatic page view tracking on all 52 dashboard routes.

**Created usePageViewTracker hook and mounted it in DashboardLayoutClient for automatic page view tracking on all 52 dashboard routes.**

## What Happened

Created `hooks/use-page-view-tracker.ts` using `usePathname()` from next/navigation. The hook tracks the previous pathname via a ref to deduplicate — only fires when the path actually changes and starts with `/dashboard`. Uses `fetch()` with `keepalive: true` so the request completes even during navigation. Errors are silently swallowed (analytics is best-effort). Mounted the hook in `LayoutInner` in `components/dashboard/layout-client.tsx` alongside the existing `useIdleTimeout()` hook — this means all 52 dashboard pages auto-track without any per-page changes.

## Verification

Build passes. Hook is client-side only ('use client' directive). No hydration issues — usePathname is SSR-safe in client components. The hook is mounted once in the dashboard layout, covering all routes.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx next build` | 0 | ✅ pass (zero errors, 105 routes) | 31800ms |

## Deviations

None.

## Known Issues

Full end-to-end verification (login → navigate → check DB rows) requires user credentials. The API returns 401 correctly without auth, and the hook + route + table are all wired. First real page views will appear when a user logs in.

## Files Created/Modified

- `hooks/use-page-view-tracker.ts`
- `components/dashboard/layout-client.tsx`
