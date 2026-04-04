# S02: Dashboard page performance baseline — 5+ pages

**Goal:** Document Lighthouse baseline scores for 10 dashboard pages with analysis and optimization targets.
**Demo:** After this: Lighthouse scores documented for 5+ representative dashboard pages with analysis

## Tasks
- [x] **T01: Documented Lighthouse baseline for 10 dashboard pages with performance analysis, tier classification, and optimization targets.** — 1. Create `.gsd/milestones/M014/DASHBOARD-BASELINE.md`
2. Include:
   - Summary table with all 10 pages and 4 category scores
   - Average scores across all pages
   - Performance tier classification (green 90+, yellow 70-89, red <70)
   - Analysis of low-performing pages (/dashboard, /landscape, /investor-stats)
   - Likely causes (large CSV data load, complex D3 rendering, initial bundle)
   - Optimization targets for future work
3. Note this is a dev server baseline (no CDN, no edge caching)
  - Estimate: 15min
  - Files: .gsd/milestones/M014/DASHBOARD-BASELINE.md
  - Verify: Document written with accurate data from Lighthouse runs.
