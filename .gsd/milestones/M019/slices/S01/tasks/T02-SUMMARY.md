---
id: T02
parent: S01
milestone: M019
key_files:
  - lib/tiers.ts
  - app/api/companies/route.ts
  - lib/company-data.ts
  - contexts/company-data-context.tsx
  - hooks/use-thesis-gated-data.ts
  - components/dashboard/dashboard-client.tsx
  - app/dashboard/explore/page.tsx
key_decisions:
  - Explorer tier limited to 50 companies, Analyst to 100 — both sorted by weightedScore desc
  - Filtering is entirely server-side to prevent scraping of full dataset
duration: 
verification_result: passed
completed_at: 2026-04-19T13:58:30.075Z
blocker_discovered: false
---

# T02: Server-side company filtering by tier — explorer gets top 50, analyst gets top 100, sorted by weightedScore

**Server-side company filtering by tier — explorer gets top 50, analyst gets top 100, sorted by weightedScore**

## What Happened

Modified /api/companies to resolve user tier via profile + subscription lookup. Added TIER_COMPANY_LIMITS to lib/tiers.ts (explorer: 50, analyst: 100, strategist/admin: unlimited). The API sorts by weightedScore descending and slices to the tier limit. Response includes totalAvailable metadata so the client knows the full dataset size. Updated lib/company-data.ts to return { companies, totalAvailable } instead of Company[], and threaded that change through contexts/company-data-context.tsx, hooks/use-thesis-gated-data.ts, components/dashboard/dashboard-client.tsx, and app/dashboard/explore/page.tsx.

## Verification

npm run build passes. API returns filtered results for limited tiers with totalAvailable metadata.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | pass | 15000ms |

## Deviations

Scope narrowed: filtering applies to explorer and analyst tiers only (not all non-paid), per user direction. Analyst tier (100 companies) was added beyond original plan which only covered explorer.

## Known Issues

None.

## Files Created/Modified

- `lib/tiers.ts`
- `app/api/companies/route.ts`
- `lib/company-data.ts`
- `contexts/company-data-context.tsx`
- `hooks/use-thesis-gated-data.ts`
- `components/dashboard/dashboard-client.tsx`
- `app/dashboard/explore/page.tsx`
