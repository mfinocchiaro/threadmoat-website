---
id: S02
parent: M009
milestone: M009
provides:
  - jsPDF/autotable/html-to-image out of initial bundle for all pages
requires:
  []
affects:
  - S04
key_files:
  - components/charts/custom-report-tab.tsx
key_decisions:
  - Dynamic import() in event handler for on-demand loading
patterns_established:
  - Dynamic import + parameter injection pattern for heavy libraries used in rare user actions
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M009/slices/S02/tasks/T01-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-03T21:30:52.001Z
blocker_discovered: false
---

# S02: Dynamic import jsPDF + jspdf-autotable on reports page

**jsPDF, jspdf-autotable, and html-to-image dynamically imported — out of initial bundle for all pages**

## What Happened

Converted three heavy static imports to dynamic imports inside handleExportPDF. Only `import type` remains at module level for TypeScript safety. Refactored renderMarkdownToPDF and captureChartImage to accept the dynamically loaded functions as parameters. The isExportingPDF loading state covers the import delay naturally.

## Verification

npm run build passed. Only type imports remain for jsPDF/autoTable.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `components/charts/custom-report-tab.tsx` — Converted jsPDF/autotable/html-to-image from static to dynamic imports
