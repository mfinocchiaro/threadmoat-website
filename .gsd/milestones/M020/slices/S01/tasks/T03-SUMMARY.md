---
id: T03
parent: S01
milestone: M020
key_files:
  - app/[locale]/companies/page.tsx
  - app/[locale]/companies/[id]/page.tsx
  - app/[locale]/companies/opengraph-image.tsx
  - app/[locale]/companies/[id]/opengraph-image.tsx
key_decisions:
  - Public-safe fields only: name, location, country, founded, headcount, discipline, sectorFocus, categoryTags, industriesServed
  - Server-side rendering with loadCompaniesFromCSV() directly — no public API endpoint to prevent scraping
  - Static params for English locale only to avoid massive build times
duration: 
verification_result: passed
completed_at: 2026-04-19T15:09:12.362Z
blocker_discovered: false
---

# T03: Built public company directory with paginated grid and teaser pages exposing only public-safe fields

**Built public company directory with paginated grid and teaser pages exposing only public-safe fields**

## What Happened

Created /[locale]/companies index page with 4-column grid, alphabetical sorting, and URL-based pagination (20 per page). Each company card shows logo, name, location, founded year, discipline, and up to 2 category tags. Individual teaser pages at /[locale]/companies/[id] show a company overview with location, country, founded, headcount, discipline, sector focus, categories, and industries served. All sensitive data (scores, funding, investors, strengths/weaknesses) is gated behind a login CTA. OG images generated for both index and individual pages. Static params generated for English locale to seed SSG.

## Verification

TypeScript compilation passes. Build output includes company routes.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit --pretty` | 0 | pass | 8000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `app/[locale]/companies/page.tsx`
- `app/[locale]/companies/[id]/page.tsx`
- `app/[locale]/companies/opengraph-image.tsx`
- `app/[locale]/companies/[id]/opengraph-image.tsx`
