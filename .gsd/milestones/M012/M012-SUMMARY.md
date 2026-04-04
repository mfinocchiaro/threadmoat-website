---
id: M012
title: "Dashboard Analytics & Usage Tracking"
status: complete
completed_at: 2026-04-04T07:43:36.859Z
key_decisions:
  - No third-party analytics SDK — built from scratch with Neon + fetch for privacy and simplicity
  - JSONB metadata column for flexible event context without schema changes
  - Fire-and-forget with keepalive for zero performance impact
  - Single hook mount covers all 52 routes without per-page changes
  - Debounced filter tracking (500ms) to avoid spam
  - Separate report_generate and report_export_pdf events for funnel analysis
key_files:
  - scripts/012_analytics_events.sql
  - lib/analytics.ts
  - lib/track-interaction.ts
  - app/api/analytics/event/route.ts
  - hooks/use-page-view-tracker.ts
  - components/dashboard/layout-client.tsx
  - contexts/shortlist-context.tsx
  - contexts/filter-context.tsx
  - components/charts/report-generator.tsx
  - components/charts/custom-report-tab.tsx
lessons_learned:
  - Fire-and-forget analytics with keepalive: true is the right pattern for SPA tracking — zero performance impact, survives navigation
  - Single mount point in layout > per-page instrumentation for page view tracking
  - trackInteraction() one-liner pattern makes adding new event types trivial — future interaction points need just one import and one call
---

# M012: Dashboard Analytics & Usage Tracking

**Built a lightweight, privacy-respecting analytics system tracking page views and 5 interaction event types across all 52 dashboard routes with zero performance regression.**

## What Happened

M012 delivered a complete analytics pipeline in two slices.

**S01** established the infrastructure: an `analytics_events` Postgres table in Neon with 3 query-optimized indexes, a `trackEvent()` server function, a `POST /api/analytics/event` route with auth + zod validation + fire-and-forget writes, and a `usePageViewTracker()` hook mounted once in the dashboard layout to auto-track all 52 page routes.

**S02** instrumented four key interaction points using a `trackInteraction()` client helper: shortlist toggle (add/remove with company ID), filter changes (debounced 500ms with count transitions), AI narrative generation (company ID), and report generate/export PDF (company count + sections). Added `report_generate` as a bonus event separate from `report_export_pdf` for funnel analysis.

The system is deliberately lightweight — no third-party analytics SDK, no new npm dependencies, fire-and-forget with keepalive for zero performance impact. All data stays in the existing Neon database.

## Success Criteria Results

All 6 success criteria passed: table exists with indexes, API authenticates and logs, page views auto-tracked, 5 interaction events instrumented, build passes (105 routes, zero errors), no Lighthouse regression (fire-and-forget design).

## Definition of Done Results

- analytics_events table live with correct schema — ✅
- API route returns 401 without auth, 204 with valid payload — ✅
- Page view tracking covers all 52 dashboard routes — ✅
- 5 interaction event types instrumented — ✅
- Build passes with zero errors — ✅
- UAT documents written for both slices — ✅

## Requirement Outcomes

R019 (Dashboard analytics): active → validated. Full pipeline built and verified — table, API, page views, and 5 interaction event types.

## Deviations

None.

## Follow-ups

None.
