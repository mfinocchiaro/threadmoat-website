---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: Funding trends time-series chart + acquirer fit scoring page

Create /dashboard/funding-trends page with time-series line chart aggregating funding by year from /api/funding data. Create /dashboard/acquirer-fit page that ranks startups by OEM fit score computed from techDifferentiation, competitiveMoat, and industryImpact. Both are admin-tier pages.

## Inputs

- `app/api/funding/route.ts (existing)`
- `app/api/companies/route.ts (existing)`
- `lib/company-data.ts (Company type)`

## Expected Output

- `app/dashboard/funding-trends/page.tsx`
- `app/dashboard/acquirer-fit/page.tsx`

## Verification

Both pages render with real data from existing APIs. Charts show meaningful aggregations.
