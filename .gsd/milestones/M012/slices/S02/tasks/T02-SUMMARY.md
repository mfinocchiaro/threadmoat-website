---
id: T02
parent: S02
milestone: M012
key_files:
  - contexts/shortlist-context.tsx
  - contexts/filter-context.tsx
  - components/charts/report-generator.tsx
  - components/charts/custom-report-tab.tsx
key_decisions:
  - Debounced filter tracking (500ms) to avoid spam on multi-select
  - Separate report_generate and report_export_pdf events
  - Track sections array in report_generate metadata for feature adoption analysis
duration: 
verification_result: passed
completed_at: 2026-04-04T07:42:18.954Z
blocker_discovered: false
---

# T02: Instrumented 4 interaction points: shortlist toggle, filter change, AI narrative generation, and report generate/export PDF.

**Instrumented 4 interaction points: shortlist toggle, filter change, AI narrative generation, and report generate/export PDF.**

## What Happened

Added `trackInteraction()` calls at four key interaction points:

1. **Shortlist toggle** (`contexts/shortlist-context.tsx`): Fires `shortlist_toggle` with `companyId` and `action` (add/remove) inside the `toggle` callback, before the state update returns.

2. **Filter changes** (`contexts/filter-context.tsx`): Added a debounced `useEffect` that watches `activeFilterCount` changes and fires `filter_change` with current and previous count. Uses a 500ms debounce to avoid spamming on rapid multi-select, and skips the initial 0→0 mount.

3. **AI narrative** (`components/charts/report-generator.tsx`): Fires `narrative_generate` with `companyId` right after the `complete()` call in `generateAI()`.

4. **Report export** (`components/charts/custom-report-tab.tsx`): Fires `report_generate` with company count and enabled sections at the top of `handleGenerate()`, and `report_export_pdf` with company count at the top of `handleExportPDF()`.

Build passes with zero errors.

## Verification

Build passes (zero errors, 105 routes). All 4 instrumentation points verified by code review — correct event types, meaningful metadata, fire-and-forget pattern.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx next build` | 0 | ✅ pass | 17800ms |

## Deviations

Added `report_generate` as a separate event from `report_export_pdf` since generate (preview) and export (PDF download) are distinct user intents worth tracking separately.

## Known Issues

None.

## Files Created/Modified

- `contexts/shortlist-context.tsx`
- `contexts/filter-context.tsx`
- `components/charts/report-generator.tsx`
- `components/charts/custom-report-tab.tsx`
