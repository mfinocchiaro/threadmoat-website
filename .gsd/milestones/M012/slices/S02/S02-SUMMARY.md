---
id: S02
parent: M012
milestone: M012
provides:
  - trackInteraction() client helper for any future interaction tracking
  - 5 interaction event types for engagement analysis
requires:
  - slice: S01
    provides: POST /api/analytics/event route and trackEvent() server function
affects:
  []
key_files:
  - lib/track-interaction.ts
  - contexts/shortlist-context.tsx
  - contexts/filter-context.tsx
  - components/charts/report-generator.tsx
  - components/charts/custom-report-tab.tsx
key_decisions:
  - Debounced filter tracking (500ms) to avoid spam on rapid multi-select
  - Separate report_generate and report_export_pdf events for funnel analysis
  - Track enabled sections in report_generate metadata
patterns_established:
  - trackInteraction() one-liner pattern: import and call with event_type + metadata from any client component
observability_surfaces:
  - 5 new event types in analytics_events: shortlist_toggle, filter_change, narrative_generate, report_generate, report_export_pdf
drill_down_paths:
  - .gsd/milestones/M012/slices/S02/tasks/T01-SUMMARY.md
  - .gsd/milestones/M012/slices/S02/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-04T07:42:49.448Z
blocker_discovered: false
---

# S02: Chart interaction event tracking

**Instrumented 4 key interaction points (shortlist, filters, AI narrative, report export) with fire-and-forget analytics events flowing through the S01 pipeline.**

## What Happened

Created a `trackInteraction()` client-side helper in `lib/track-interaction.ts` that wraps the S01 analytics API with a clean one-liner interface. Then instrumented four key interaction points:

1. **Shortlist toggle** in `shortlist-context.tsx` — fires `shortlist_toggle` with company ID and add/remove action.
2. **Filter changes** in `filter-context.tsx` — debounced (500ms) effect tracking `activeFilterCount` transitions, fires `filter_change` with current and previous count.
3. **AI narrative generation** in `report-generator.tsx` — fires `narrative_generate` with company ID when the streaming completion starts.
4. **Report generate/export** in `custom-report-tab.tsx` — fires `report_generate` (preview) and `report_export_pdf` (PDF download) as separate events with company count and section metadata.

All events flow through `POST /api/analytics/event` → `trackEvent()` → `analytics_events` table. Build passes with zero errors.

## Verification

Build passes (zero errors, 105 routes). Code review confirms all 4 interaction points instrumented with correct event types and meaningful metadata.

## Requirements Advanced

- R019 — Interaction tracking added for shortlist, filters, AI narrative, and report export — completes the analytics coverage

## Requirements Validated

- R019 — analytics_events table + API route + page view hook + 5 interaction event types all built and build-verified

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Added `report_generate` as a distinct event from `report_export_pdf` — not in original plan but provides better funnel analysis (preview vs actual export).

## Known Limitations

End-to-end verification of interaction events requires user login and interacting with dashboard features. Events are individually verified at the code level.

## Follow-ups

None.

## Files Created/Modified

- `lib/track-interaction.ts` — New client-side fire-and-forget tracking helper
- `contexts/shortlist-context.tsx` — Added shortlist_toggle tracking in toggle callback
- `contexts/filter-context.tsx` — Added debounced filter_change tracking effect
- `components/charts/report-generator.tsx` — Added narrative_generate tracking after complete() call
- `components/charts/custom-report-tab.tsx` — Added report_generate and report_export_pdf tracking
