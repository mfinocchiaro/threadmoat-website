# S01: Lightweight page view tracking via API route + DB

**Goal:** Create a minimal analytics system: a Postgres table for page view events, a fire-and-forget API route to log them, and a client-side hook that fires on dashboard route changes — with zero impact on page load performance.
**Demo:** After this: Every dashboard page navigation logs a page view event with route, user tier, and timestamp to the database

## Tasks
- [x] **T01: Created analytics_events table migration and trackEvent server helper.** — 1. Create `scripts/011_analytics_events.sql` with CREATE TABLE:
   - id: uuid DEFAULT gen_random_uuid() PRIMARY KEY
   - user_id: uuid NOT NULL REFERENCES users(id)
   - event_type: varchar(50) NOT NULL (e.g. 'page_view', 'interaction')
   - route: varchar(255) NOT NULL
   - metadata: jsonb DEFAULT '{}'
   - created_at: timestamptz DEFAULT now()
   - INDEX on (user_id, created_at)
   - INDEX on (event_type, created_at)
2. Create `lib/analytics.ts` with a `trackEvent(userId, eventType, route, metadata?)` server function that inserts into the table using `sql` from `@/lib/db`.
3. Verify the SQL is valid syntax.
  - Estimate: 15min
  - Files: scripts/011_analytics_events.sql, lib/analytics.ts
  - Verify: Check SQL syntax is valid. TypeScript compiles (`npx tsc --noEmit lib/analytics.ts` or build).
- [x] **T02: Created POST /api/analytics/event route with auth + zod validation + fire-and-forget DB write.** — 1. Create `app/api/analytics/event/route.ts`
2. POST handler:
   - Call `auth()` — return 401 if no session
   - Parse body with zod: { event_type: string(max 50), route: string(max 255), metadata?: object }
   - Call `trackEvent(userId, event_type, route, metadata)`
   - Return 204 No Content (no body — minimal response)
3. Keep it fast: no unnecessary queries, no joins, just INSERT.
4. Add basic rate limiting awareness (but don't block — analytics is best-effort).
  - Estimate: 15min
  - Files: app/api/analytics/event/route.ts
  - Verify: Build passes. Manual curl test pattern documented in plan.
- [x] **T03: Created usePageViewTracker hook and mounted it in DashboardLayoutClient for automatic page view tracking on all 52 dashboard routes.** — 1. Create `hooks/use-page-view-tracker.ts`:
   - Use `usePathname()` from next/navigation to detect route changes
   - On pathname change within `/dashboard`, fire a non-blocking `fetch('/api/analytics/event', { method: 'POST', body, keepalive: true })` with `event_type: 'page_view'` and `route: pathname`
   - Use `keepalive: true` so the request completes even on navigation
   - Debounce or deduplicate — don't fire on initial mount + immediate effect (use a ref to track previous pathname)
   - No error handling needed — fire and forget, swallow failures silently
2. Mount `usePageViewTracker()` in `components/dashboard/layout-client.tsx` inside `LayoutInner`
3. Verify build passes and no hydration issues (hook is client-only, layout is 'use client')
  - Estimate: 20min
  - Files: hooks/use-page-view-tracker.ts, components/dashboard/layout-client.tsx
  - Verify: npx next build passes. Navigate 3+ dashboard pages in browser, verify rows appear in analytics_events table (manual check or quick SQL query).
