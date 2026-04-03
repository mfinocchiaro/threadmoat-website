---
id: T01
parent: S02
milestone: M009
key_files:
  - components/charts/custom-report-tab.tsx
key_decisions:
  - Used import type for compile-time safety + dynamic import() for runtime loading
  - autoTable and toPng passed as parameters to helper functions rather than module-level variables
duration: 
verification_result: passed
completed_at: 2026-04-03T21:30:37.338Z
blocker_discovered: false
---

# T01: Converted jsPDF, jspdf-autotable, and html-to-image from static to dynamic imports — loaded only on Export PDF click

**Converted jsPDF, jspdf-autotable, and html-to-image from static to dynamic imports — loaded only on Export PDF click**

## What Happened

Replaced static imports of jsPDF (29MB), jspdf-autotable, and html-to-image with `import type` for compile-time types and `await Promise.all([import(...)])` inside handleExportPDF for runtime loading. Refactored renderMarkdownToPDF to accept autoTableFn as a parameter, and captureChartImage to accept toPngFn. The existing isExportingPDF loading state naturally covers the dynamic import delay — no UI changes needed. The three libraries now load only when a user clicks Export PDF, not on initial page load.

## Verification

npm run build passed (exit 0, 25.9s, 104 routes). Only `import type` remains for jsPDF/autoTable — zero runtime bytes in initial bundle. No static imports of jspdf, jspdf-autotable, or html-to-image.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 25900ms |
| 2 | `grep '^import.*from.*jspdf' components/charts/custom-report-tab.tsx (only type imports)` | 0 | ✅ pass | 30ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `components/charts/custom-report-tab.tsx`
