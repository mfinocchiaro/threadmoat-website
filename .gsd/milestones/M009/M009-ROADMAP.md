# M009: Performance Audit & Bundle Optimization

## Vision
Reduce client-side bundle size and improve initial load time by lazy-loading heavy chart components, dynamically importing jsPDF, configuring bundle analysis tooling, and running a Lighthouse baseline. Target: measurably faster dashboard page loads for all tiers.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Bundle analysis tooling & baseline capture | medium | — | ✅ | Bundle analysis output showing chunk sizes, largest dependencies identified |
| S02 | Dynamic import jsPDF + jspdf-autotable on reports page | low | — | ✅ | Reports page initial load no longer includes jsPDF in the bundle. PDF export still works on button click. |
| S03 | Lazy-load chart components on tab overview pages | medium | — | ✅ | Tab overview pages load faster — charts below the fold are lazy-loaded with skeleton placeholders |
| S04 | Lighthouse baseline capture & performance documentation | low | S02, S03 | ✅ | Lighthouse scores documented for 3 representative pages: homepage, a chart page, and reports page |
