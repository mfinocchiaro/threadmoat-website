# S02: Dashboard page performance baseline — 5+ pages — UAT

**Milestone:** M014
**Written:** 2026-04-04T08:20:56.848Z

## UAT: S02 — Dashboard Performance Baseline

### Test 1: Baseline document exists and is complete
1. Open `.gsd/milestones/M014/DASHBOARD-BASELINE.md`
2. **Expected:** Table with 10 pages, 4 score columns, tier indicators
3. **Expected:** Average scores section
4. **Expected:** Analysis of low performers
5. **Expected:** Optimization targets table

### Test 2: Data matches Lighthouse reports
1. Compare BASELINE.md scores with `.gsd/lighthouse/summary_*.json`
2. **Expected:** All scores match within ±2 (run variance)
