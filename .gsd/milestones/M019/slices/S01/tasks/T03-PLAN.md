---
estimated_steps: 6
estimated_files: 5
skills_used: []
---

# T03: CompanyLimitBanner showing 'Showing top X of Y+ companies' with tier-appropriate upgrade CTA

Create a CompanyLimitBanner component that shows 'Showing 50 of 500+ companies' with an upgrade CTA. Wire it into the dashboard for explorer-tier users. The banner should appear on the 3 free charts (network, landscape-intro, map) and the explore/search page.

Steps:
1. Create components/dashboard/company-limit-banner.tsx: compact info banner with count ('Showing {showing} of {total}+ companies'), muted styling, and 'Upgrade to see all' link to /pricing.
2. Thread the totalAvailable and limited metadata through the company data flow. Update the data fetching hook or context to expose these values.
3. Add CompanyLimitBanner to the explore page and the 3 free chart pages. Only render when user is explorer tier and data is limited.
4. Ensure banner is theme-aware (light/dark mode).

## Inputs

- `app/api/companies/route.ts`
- `contexts/plan-context.tsx`
- `components/dashboard/layout-client.tsx`

## Expected Output

- `components/dashboard/company-limit-banner.tsx`
- `app/dashboard/explore/page.tsx`
- `app/dashboard/network/page.tsx`
- `app/dashboard/landscape-intro/page.tsx`
- `app/dashboard/map/page.tsx`

## Verification

npm run build passes. grep -q 'CompanyLimitBanner' components/dashboard/company-limit-banner.tsx succeeds. grep -l 'CompanyLimitBanner' app/dashboard/ returns at least 3 page files.
