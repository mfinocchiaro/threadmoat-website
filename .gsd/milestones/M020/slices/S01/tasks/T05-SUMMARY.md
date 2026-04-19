---
id: T05
parent: S01
milestone: M020
key_files:
  - app/sitemap.ts
key_decisions:
  - Made sitemap async to support dynamic company loading
  - Priority hierarchy: homepage 1.0, insights/companies 0.9, static pages 0.8, blog posts 0.7, company pages 0.5
duration: 
verification_result: passed
completed_at: 2026-04-19T15:12:31.044Z
blocker_discovered: false
---

# T05: Expanded sitemap with dynamic blog post and company directory URLs including i18n alternates

**Expanded sitemap with dynamic blog post and company directory URLs including i18n alternates**

## What Happened

Rewrote sitemap.ts from synchronous to async. Added /insights and /companies to static page list. Dynamically generates entries for all blog posts (from getAllPosts) and all company pages (from loadCompaniesFromCSV). Each entry includes i18n alternates for all 6 locales plus x-default. Verified robots.ts already allows new paths. Full build passes with all new routes visible in output.

## Verification

Full next build succeeds. Sitemap includes all new URLs. All routes visible in build output.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx next build` | 0 | pass | 45000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `app/sitemap.ts`
