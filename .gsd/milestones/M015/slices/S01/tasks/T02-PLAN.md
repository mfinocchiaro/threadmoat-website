---
estimated_steps: 6
estimated_files: 1
skills_used: []
---

# T02: Re-run Lighthouse and verify 70+ scores

1. Start dev server
2. Run scripts/lighthouse-dashboard.mjs
3. Compare scores against M014 baseline
4. All 3 target pages must score 70+
5. If any page is still below 70, apply additional optimizations (defer data loading, reduce initial render scope)
6. Document final scores

## Inputs

- `scripts/lighthouse-dashboard.mjs`
- `.gsd/milestones/M014/DASHBOARD-BASELINE.md`

## Expected Output

- `.gsd/lighthouse/summary_*.json with improved scores`

## Verification

Lighthouse scores ≥70 for /dashboard, /dashboard/landscape, /dashboard/investor-stats
