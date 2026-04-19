---
estimated_steps: 6
estimated_files: 3
skills_used: []
---

# T02: Server-side company filtering by tier — explorer gets top 50, analyst gets top 100, sorted by weightedScore

Modify the /api/companies route to be tier-aware. For explorer-tier users, sort companies by weightedScore descending and return only the top 50. Return metadata (totalAvailable, limited) so the client knows the full count. Ensure company profile pages at /dashboard/company/[id] are accessible for top-50 companies on free tier.

Steps:
1. In app/api/companies/route.ts: import getUserSubscription and getAccessTier. Fetch user's tier. If explorer, sort by weightedScore desc, slice to 50. Always include totalAvailable in response.
2. Add top-50 company ID set logic: after sorting, extract the top 50 IDs. Return in response metadata so client can validate profile access.
3. In lib/tiers.ts: add /dashboard/company to UTILITY_PATHS or handle dynamic company routes in isPathAllowed so they aren't blanket-blocked.
4. In the company profile page: if user is explorer tier, verify the requested company is in the top 50 by weighted score. Show paywall if not.

## Inputs

- `app/api/companies/route.ts`
- `lib/tiers.ts`
- `lib/load-companies-server.ts`
- `lib/subscription.ts`
- `app/dashboard/company/[id]/page.tsx`

## Expected Output

- `app/api/companies/route.ts`
- `lib/tiers.ts`
- `app/dashboard/company/[id]/page.tsx`

## Verification

npm run build passes. curl the /api/companies endpoint as a free user returns exactly 50 companies sorted by weightedScore desc, with totalAvailable > 50 and limited: true in response.
