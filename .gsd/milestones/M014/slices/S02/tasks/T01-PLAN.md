---
estimated_steps: 9
estimated_files: 1
skills_used: []
---

# T01: Write dashboard performance baseline document

1. Create `.gsd/milestones/M014/DASHBOARD-BASELINE.md`
2. Include:
   - Summary table with all 10 pages and 4 category scores
   - Average scores across all pages
   - Performance tier classification (green 90+, yellow 70-89, red <70)
   - Analysis of low-performing pages (/dashboard, /landscape, /investor-stats)
   - Likely causes (large CSV data load, complex D3 rendering, initial bundle)
   - Optimization targets for future work
3. Note this is a dev server baseline (no CDN, no edge caching)

## Inputs

- `.gsd/lighthouse/summary_2026-04-04T08-15-58.json`

## Expected Output

- `.gsd/milestones/M014/DASHBOARD-BASELINE.md`

## Verification

Document written with accurate data from Lighthouse runs.
