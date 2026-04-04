---
estimated_steps: 8
estimated_files: 2
skills_used: []
---

# T03: Create usePageViewTracker hook and mount in dashboard layout

1. Create `hooks/use-page-view-tracker.ts`:
   - Use `usePathname()` from next/navigation to detect route changes
   - On pathname change within `/dashboard`, fire a non-blocking `fetch('/api/analytics/event', { method: 'POST', body, keepalive: true })` with `event_type: 'page_view'` and `route: pathname`
   - Use `keepalive: true` so the request completes even on navigation
   - Debounce or deduplicate — don't fire on initial mount + immediate effect (use a ref to track previous pathname)
   - No error handling needed — fire and forget, swallow failures silently
2. Mount `usePageViewTracker()` in `components/dashboard/layout-client.tsx` inside `LayoutInner`
3. Verify build passes and no hydration issues (hook is client-only, layout is 'use client')

## Inputs

- `hooks/use-idle-timeout.ts (existing hook pattern)`
- `components/dashboard/layout-client.tsx (mount point)`

## Expected Output

- `hooks/use-page-view-tracker.ts`
- `components/dashboard/layout-client.tsx (modified)`

## Verification

npx next build passes. Navigate 3+ dashboard pages in browser, verify rows appear in analytics_events table (manual check or quick SQL query).
