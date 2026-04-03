---
estimated_steps: 15
estimated_files: 2
skills_used: []
---

# T02: Wire customer-profile page route and sidebar navigation, verify build

## Description

Create the Next.js page route for the customer profile heatmap and wire it into the dashboard sidebar navigation. Then verify the entire build passes.

## Steps

1. Create `app/dashboard/customer-profile/page.tsx` by cloning `app/dashboard/industry-penetration/page.tsx`
2. Update the import to `TargetCustomerProfileChart` from `@/components/charts/target-customer-profile-chart`
3. Update the page title to "Target Customer Profile" and description to explain the multi-dimensional customer profiling purpose
4. Add sidebar entry to `ADMIN_ITEMS` array in `components/dashboard/sidebar.tsx`: `{ href: '/dashboard/customer-profile', icon: UserCircle, label: 'Customer Profile' }` — place it after the existing Market Momentum entry
5. Add `'/dashboard/customer-profile'` to the `ADMIN_VIZ_HREFS` Set
6. Run `npx next build` and verify zero type errors across all pages

## Must-Haves

- Page route at `/dashboard/customer-profile` using VizPageShell + useThesisGatedData
- TargetCustomerProfileChart imported and rendered with filtered data and shortlistedIds
- Sidebar shows 'Customer Profile' in admin items
- ADMIN_VIZ_HREFS includes the new route
- `npx next build` passes with zero type errors

## Inputs

- ``components/charts/target-customer-profile-chart.tsx` — chart component created in T01`
- ``app/dashboard/industry-penetration/page.tsx` — page shell template to clone`
- ``components/dashboard/sidebar.tsx` — sidebar with ADMIN_ITEMS and ADMIN_VIZ_HREFS to extend`

## Expected Output

- ``app/dashboard/customer-profile/page.tsx` — page route rendering TargetCustomerProfileChart with VizPageShell`
- ``components/dashboard/sidebar.tsx` — updated with customer-profile entry in ADMIN_ITEMS and ADMIN_VIZ_HREFS`

## Verification

npx next build 2>&1 | tail -5
