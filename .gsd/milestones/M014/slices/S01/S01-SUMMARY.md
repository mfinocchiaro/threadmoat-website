---
id: S01
parent: M014
milestone: M014
provides:
  - scripts/lighthouse-dashboard.mjs — runnable Lighthouse pipeline for authenticated pages
requires:
  []
affects:
  - S02
key_files:
  - scripts/lighthouse-dashboard.mjs
key_decisions:
  - Puppeteer over Playwright for native Lighthouse CDP integration
  - 10 pages covering different chart types
  - Light throttling for dev server
patterns_established:
  - Authenticated Lighthouse pattern: Puppeteer login → cookie capture → Lighthouse with CDP port
observability_surfaces:
  - .gsd/lighthouse/ directory with timestamped JSON reports and summaries
drill_down_paths:
  - .gsd/milestones/M014/slices/S01/tasks/T01-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-04-04T08:19:33.995Z
blocker_discovered: false
---

# S01: Playwright-based authenticated Lighthouse pipeline

**Built an authenticated Lighthouse testing pipeline using Puppeteer + Lighthouse Node API that captures scores for 10 dashboard pages via cookie injection.**

## What Happened

Created a standalone Node.js script at `scripts/lighthouse-dashboard.mjs` that uses Puppeteer to log into the dashboard via the NextAuth credentials flow, captures session cookies, then runs Lighthouse against each configured page with cookies injected via the CDP browser connection. Saves individual JSON reports and a timestamped summary to `.gsd/lighthouse/`. Tested successfully against all 10 configured pages with scores ranging from 58–96 performance, 83–92 accessibility, 96–100 best practices.

## Verification

Script ran against live dev server, all 10 pages scored. JSON reports saved.

## Requirements Advanced

- R021 — Authenticated Lighthouse pipeline built and tested against 10 pages

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Used Puppeteer instead of Playwright — Lighthouse has native Puppeteer integration via CDP port sharing, making it simpler than Playwright.

## Known Limitations

Dev server scores differ from production (no CDN, no edge caching). SEO score is 66 for dashboard pages due to missing meta descriptions (expected for auth-gated content).

## Follow-ups

None.

## Files Created/Modified

- `scripts/lighthouse-dashboard.mjs` — New authenticated Lighthouse testing script
- `package.json` — Added puppeteer and lighthouse as dev dependencies
