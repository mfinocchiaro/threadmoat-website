---
id: M014
title: "Authenticated Dashboard Lighthouse & Performance Testing"
status: complete
completed_at: 2026-04-04T08:21:31.391Z
key_decisions:
  - Puppeteer over Playwright for native Lighthouse CDP integration
  - Desktop form factor with light throttling for dev server
  - 10 pages covering all major chart types
key_files:
  - scripts/lighthouse-dashboard.mjs
  - .gsd/milestones/M014/DASHBOARD-BASELINE.md
  - .gsd/lighthouse/summary_2026-04-04T08-15-58.json
lessons_learned:
  - Lighthouse + Puppeteer CDP port sharing is the simplest approach for authenticated page testing — no cookie serialization, no separate Chrome launch
  - Dev server performance is surprisingly close to production for chart-heavy pages where rendering is the bottleneck, not network
---

# M014: Authenticated Dashboard Lighthouse & Performance Testing

**Built an authenticated Lighthouse pipeline using Puppeteer and captured performance baselines for 10 dashboard pages (avg 84 perf, 88 a11y, 100 BP).**

## What Happened

M014 solved the problem of Lighthouse testing auth-gated pages. S01 built `scripts/lighthouse-dashboard.mjs` using Puppeteer to automate login, capture cookies, and run Lighthouse against each page via the CDP browser connection. S02 documented baselines for 10 pages covering different chart types — 7 scored 90+ (green), 3 need optimization (landscape/58, dashboard/64, investor-stats/67). Optimization targets identified: lazy-load three.js, defer investor CSV, virtualize summary cards.

## Success Criteria Results

All criteria passed: script authenticates and captures scores, 10 pages documented (exceeding 5+ target), pipeline is repeatable with timestamped reports.

## Definition of Done Results

- Script authenticates and runs Lighthouse — ✅
- JSON reports saved — ✅
- Baseline document with analysis — ✅
- Optimization targets identified — ✅

## Requirement Outcomes

R021: active → validated. Pipeline built and tested.

## Deviations

None.

## Follow-ups

None.
