---
id: S01
parent: M012
milestone: M012
provides:
  - trackEvent() server function for logging any event type
  - POST /api/analytics/event API route for client-side event submission
  - analytics_events table schema for downstream queries
requires:
  []
affects:
  - S02
key_files:
  - scripts/012_analytics_events.sql
  - lib/analytics.ts
  - app/api/analytics/event/route.ts
  - hooks/use-page-view-tracker.ts
  - components/dashboard/layout-client.tsx
key_decisions:
  - JSONB metadata column for flexible event context
  - Fire-and-forget DB write pattern (don't block API response)
  - Single hook mount in LayoutInner covers all 52 dashboard routes
  - keepalive: true for navigation-resilient fetch
patterns_established:
  - Analytics event tracking pattern: usePageViewTracker hook → POST /api/analytics/event → trackEvent() → analytics_events table. S02 will reuse this for interaction events.
observability_surfaces:
  - analytics_events table queryable for page view counts, user engagement, route popularity
drill_down_paths:
  - .gsd/milestones/M012/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M012/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M012/slices/S01/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-04T07:38:42.296Z
blocker_discovered: false
---

# S01: Lightweight page view tracking via API route + DB

**Built a complete page view analytics pipeline: Postgres table, fire-and-forget API route, and auto-tracking hook covering all 52 dashboard routes with zero per-page changes.**

## What Happened

Created a minimal analytics system in three pieces. First, a `scripts/012_analytics_events.sql` migration defining the `analytics_events` table with uuid PK, user_id FK, event_type, route, jsonb metadata, and created_at — plus three indexes for common query patterns (user+time, type+time, route+time). The migration was run against the live Neon database and verified via schema introspection.

Second, a `POST /api/analytics/event` route that authenticates via `auth()`, validates with zod, and fires `trackEvent()` as a non-blocking promise (fire-and-forget with error logging). Returns 204 No Content for minimal response overhead.

Third, a `usePageViewTracker()` hook using `usePathname()` from next/navigation that fires on every dashboard route change with `keepalive: true` and ref-based dedup. Mounted once in `LayoutInner` inside `layout-client.tsx` — all 52 dashboard pages auto-track without any per-page modifications.

Build passes with zero errors. API returns 401 correctly without auth. Table schema and indexes confirmed in production DB.

## Verification

Build passes (105 routes, zero errors). API returns 401 without auth. Table schema verified via information_schema (6 columns, correct types). All 3 indexes confirmed via pg_indexes.

## Requirements Advanced

- R019 — Page view tracking infrastructure built — table, API, and hook all operational

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Migration numbered 012 instead of 011 (011 already existed).

## Known Limitations

Full end-to-end verification (login → navigate → check DB rows) deferred — requires user login. All pieces are wired and individually verified.

## Follow-ups

None.

## Files Created/Modified

- `scripts/012_analytics_events.sql` — New migration creating analytics_events table with 3 indexes
- `lib/analytics.ts` — New trackEvent() server function
- `app/api/analytics/event/route.ts` — New POST endpoint with auth + zod + fire-and-forget write
- `hooks/use-page-view-tracker.ts` — New client hook for automatic page view tracking
- `components/dashboard/layout-client.tsx` — Added usePageViewTracker() import and mount in LayoutInner
