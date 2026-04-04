---
id: T01
parent: S01
milestone: M014
key_files:
  - scripts/lighthouse-dashboard.mjs
  - package.json
key_decisions:
  - Puppeteer + Lighthouse Node API over CLI for cookie injection
  - Desktop form factor with light throttling for dev server testing
  - 10 pages covering different chart types (D3 heatmap, SVG bubbles, tables, 3-column layouts)
duration: 
verification_result: passed
completed_at: 2026-04-04T08:19:11.164Z
blocker_discovered: false
---

# T01: Built authenticated Lighthouse script that logs in via Puppeteer, captures cookies, and runs Lighthouse on 10 dashboard pages — all passing.

**Built authenticated Lighthouse script that logs in via Puppeteer, captures cookies, and runs Lighthouse on 10 dashboard pages — all passing.**

## What Happened

Created `scripts/lighthouse-dashboard.mjs` using Puppeteer + Lighthouse Node API. The script launches headless Chrome, navigates to the login page, fills credentials from env vars (PERF_TEST_EMAIL, PERF_TEST_PASSWORD), waits for dashboard redirect, extracts cookies, then runs Lighthouse against each configured page with cookies injected. Uses desktop form factor with light throttling (no CPU slowdown, 40ms RTT). Saves individual JSON reports and a summary to `.gsd/lighthouse/`. Installed `puppeteer` and `lighthouse` as dev dependencies.

Tested against the live dev server — all 10 pages scored successfully:
- Performance: 58–96 (landscape lowest, market-momentum/co-investment/reports highest)
- Accessibility: 83–92
- Best Practices: 96–100
- SEO: 66–100 (dashboard pages score 66 due to missing meta descriptions on auth-gated pages)

## Verification

Script executed successfully against 10 authenticated dashboard pages. All pages returned valid Lighthouse scores. JSON reports saved to .gsd/lighthouse/.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `node scripts/lighthouse-dashboard.mjs` | 0 | ✅ pass (10/10 pages scored) | 180000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `scripts/lighthouse-dashboard.mjs`
- `package.json`
