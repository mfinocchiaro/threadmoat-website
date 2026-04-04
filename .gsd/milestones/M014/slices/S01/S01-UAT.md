# S01: Playwright-based authenticated Lighthouse pipeline — UAT

**Milestone:** M014
**Written:** 2026-04-04T08:19:33.996Z

## UAT: S01 — Authenticated Lighthouse Pipeline

### Pre-conditions
- Dev server running on localhost:3000
- PERF_TEST_EMAIL and PERF_TEST_PASSWORD in .env.local

### Test 1: Script runs end-to-end
1. Run: `source <(grep -E '^(PERF_TEST_EMAIL|PERF_TEST_PASSWORD)=' .env.local | sed 's/^/export /') && node scripts/lighthouse-dashboard.mjs`
2. **Expected:** Login succeeds, 10 pages scored, summary table printed

### Test 2: Reports saved
1. Check `.gsd/lighthouse/` directory
2. **Expected:** 10 individual JSON reports + 1 summary JSON, all timestamped

### Test 3: Summary has valid scores
1. Read the summary JSON
2. **Expected:** All 10 pages have scores object with performance, accessibility, bestPractices, seo — all 0-100

### Failure signals
- Login failure message
- Pages showing error instead of scores
- Missing JSON reports
