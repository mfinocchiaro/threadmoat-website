# S01: S01

**Goal:** Convert Recon from 30-day trial to permanent free tier. Free users see top 50 companies by weighted score across search, profiles, and the 3 free charts. Upgrade CTAs and 'Showing X of 500+' indicators on gated content. No trial expiry countdown.
**Demo:** New signup gets permanent Recon access. Dashboard shows 50 companies with 'Showing 50 of 500+' indicator. Upgrade CTA visible on gated content. No trial expiry countdown.

## Must-Haves

- 1. New signup gets permanent Recon access with status 'active' (not 'trialing'), no expiry date
- 2. `/api/companies` returns only top 50 companies by weightedScore for explorer-tier users, full dataset for paid tiers
- 3. API response includes `totalAvailable` count so UI can show "Showing 50 of 500+"
- 4. CompanyLimitBanner visible on free charts and explore page for explorer users
- 5. Trial expiry countdown and expired trial banners fully removed
- 6. PaywallBlock messaging references permanent free plan, not trial
- 7. Company profile pages accessible for top-50 companies on free tier
- 8. `npm run build` passes with zero errors

## Proof Level

- This slice proves: integration — real API responses with tier-aware filtering verified against running dev server

## Integration Closure

Upstream: lib/subscription.ts (tier resolution), lib/tiers.ts (path access), lib/load-companies-server.ts (data source). New wiring: tier-aware filtering in /api/companies, CompanyLimitBanner component, permanent subscription creation. Remaining for M019: S02 handles paid subscription expiry fallback and pricing page messaging.

## Verification

- API response includes `limited: true/false` and `totalAvailable` metadata for free tier. Console log on company limit filtering for debugging.

## Tasks

- [x] **T02: Server-side company filtering by tier — explorer gets top 50, analyst gets top 100, sorted by weightedScore** `est:1.5h`
  Modify the /api/companies route to be tier-aware. For explorer-tier users, sort companies by weightedScore descending and return only the top 50. Return metadata (totalAvailable, limited) so the client knows the full count. Ensure company profile pages at /dashboard/company/[id] are accessible for top-50 companies on free tier.

Steps:
1. In app/api/companies/route.ts: import getUserSubscription and getAccessTier. Fetch user's tier. If explorer, sort by weightedScore desc, slice to 50. Always include totalAvailable in response.
2. Add top-50 company ID set logic: after sorting, extract the top 50 IDs. Return in response metadata so client can validate profile access.
3. In lib/tiers.ts: add /dashboard/company to UTILITY_PATHS or handle dynamic company routes in isPathAllowed so they aren't blanket-blocked.
4. In the company profile page: if user is explorer tier, verify the requested company is in the top 50 by weighted score. Show paywall if not.
  - Files: `app/api/companies/route.ts`, `lib/tiers.ts`, `app/dashboard/company/[id]/page.tsx`
  - Verify: npm run build passes. curl the /api/companies endpoint as a free user returns exactly 50 companies sorted by weightedScore desc, with totalAvailable > 50 and limited: true in response.

- [x] **T03: CompanyLimitBanner showing 'Showing top X of Y+ companies' with tier-appropriate upgrade CTA** `est:1h`
  Create a CompanyLimitBanner component that shows 'Showing 50 of 500+ companies' with an upgrade CTA. Wire it into the dashboard for explorer-tier users. The banner should appear on the 3 free charts (network, landscape-intro, map) and the explore/search page.

Steps:
1. Create components/dashboard/company-limit-banner.tsx: compact info banner with count ('Showing {showing} of {total}+ companies'), muted styling, and 'Upgrade to see all' link to /pricing.
2. Thread the totalAvailable and limited metadata through the company data flow. Update the data fetching hook or context to expose these values.
3. Add CompanyLimitBanner to the explore page and the 3 free chart pages. Only render when user is explorer tier and data is limited.
4. Ensure banner is theme-aware (light/dark mode).
  - Files: `components/dashboard/company-limit-banner.tsx`, `app/dashboard/explore/page.tsx`, `app/dashboard/network/page.tsx`, `app/dashboard/landscape-intro/page.tsx`, `app/dashboard/map/page.tsx`
  - Verify: npm run build passes. grep -q 'CompanyLimitBanner' components/dashboard/company-limit-banner.tsx succeeds. grep -l 'CompanyLimitBanner' app/dashboard/ returns at least 3 page files.

## Files Likely Touched

- app/api/companies/route.ts
- lib/tiers.ts
- app/dashboard/company/[id]/page.tsx
- components/dashboard/company-limit-banner.tsx
- app/dashboard/explore/page.tsx
- app/dashboard/network/page.tsx
- app/dashboard/landscape-intro/page.tsx
- app/dashboard/map/page.tsx
