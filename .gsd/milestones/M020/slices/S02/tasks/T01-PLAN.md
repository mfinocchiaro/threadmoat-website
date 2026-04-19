---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T01: Admin users API + dashboard page with user list

Create GET /api/admin/users endpoint that returns all users with their profile, subscription tier, trial status, and last login. Build /dashboard/admin page with sortable/filterable table showing user data. Gate page behind admin auth check.

## Inputs

- `auth.ts (admin check pattern)`
- `lib/tiers.ts (tier definitions)`
- `existing admin route pattern from app/api/admin/coupons/route.ts`

## Expected Output

- `app/api/admin/users/route.ts`
- `app/dashboard/admin/page.tsx`
- `app/dashboard/admin/users-table.tsx`

## Verification

Admin can view /dashboard/admin with paginated user list showing email, tier, status, trial expiry, and signup date
