---
id: S01
parent: M019
milestone: M019
provides:
  - (none)
requires:
  []
affects:
  []
key_files:
  - ["lib/tiers.ts", "app/api/companies/route.ts", "lib/company-data.ts", "contexts/company-data-context.tsx", "components/dashboard/company-limit-banner.tsx", "components/dashboard/layout-client.tsx"]
key_decisions:
  - ["Trial model stays — T01/T04 removed per user direction", "Filtering scoped to explorer (50) and analyst (100) tiers only", "Server-side filtering to prevent scraping"]
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-04-19T13:59:09.191Z
blocker_discovered: false
---

# S01: Server-Side Company Filtering & Limit Banner

**Server-side company filtering by tier (explorer: 50, analyst: 100) with CompanyLimitBanner upgrade CTA**

## What Happened

Implemented server-side company filtering in /api/companies that resolves the user's tier and limits the response to the top N companies by weightedScore (explorer: 50, analyst: 100, strategist/admin: unlimited). This prevents lower-tier users from accessing the full dataset, protecting the competitive edge. Added a CompanyLimitBanner component in the dashboard shell that shows "Showing top X of Y+ companies" with a tier-appropriate upgrade CTA. Scope was narrowed from the original plan: T01 (convert trial to permanent) and T04 (remove trial UI) were removed per user direction — the 30-day trial model is intentional and stays.

## Verification

npm run build passes. API returns filtered results with totalAvailable metadata. CompanyLimitBanner renders for limited tiers.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

Original S01 plan included 4 tasks (trial conversion, filtering, banner, trial UI removal). Replanned to 2 tasks after user feedback — only T02 and T03 were wanted.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `lib/tiers.ts` — Added TIER_COMPANY_LIMITS constant
- `app/api/companies/route.ts` — Tier-aware filtering with weightedScore sort
- `lib/company-data.ts` — Returns { companies, totalAvailable }
- `contexts/company-data-context.tsx` — Added totalAvailable to context
- `hooks/use-thesis-gated-data.ts` — Updated for new return type
- `components/dashboard/dashboard-client.tsx` — Updated for new return type
- `app/dashboard/explore/page.tsx` — Updated for new return type
- `components/dashboard/company-limit-banner.tsx` — New component
- `components/dashboard/layout-client.tsx` — Renders CompanyLimitBanner
