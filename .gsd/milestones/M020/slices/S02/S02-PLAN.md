# S02: Admin Dashboard & Operational Tooling

**Goal:** Admin dashboard at /dashboard/admin with user management, coupon UI, CRM export, and signup notification emails
**Demo:** Admin user navigates to /dashboard/admin, sees user list with tier/trial/last-login, manages coupons via UI, triggers CRM export, and receives signup notification email.

## Must-Haves

- Admin user navigates to /dashboard/admin, sees user list with tier/trial/last-login, manages coupons via UI, triggers CRM export download, and receives signup notification email when new users register.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [ ] **T01: Admin users API + dashboard page with user list** `est:45min`
  Create GET /api/admin/users endpoint that returns all users with their profile, subscription tier, trial status, and last login. Build /dashboard/admin page with sortable/filterable table showing user data. Gate page behind admin auth check.
  - Files: `app/api/admin/users/route.ts`, `app/dashboard/admin/page.tsx`, `app/dashboard/admin/users-table.tsx`
  - Verify: Admin can view /dashboard/admin with paginated user list showing email, tier, status, trial expiry, and signup date

- [ ] **T02: Coupon management UI** `est:30min`
  Build coupon management section in admin dashboard with table of existing coupons and create-coupon form. Uses existing GET/POST /api/admin/coupons endpoints.
  - Files: `app/dashboard/admin/coupons-section.tsx`
  - Verify: Admin can view all coupons and create new coupons from the admin dashboard

- [ ] **T03: CRM export button + signup notification email** `est:25min`
  Add CRM export button to admin dashboard that triggers CSV download from existing /api/admin/crm-export. Add sendSignupNotificationEmail() to lib/email.ts and trigger it during user registration in app/actions/auth.ts.
  - Files: `app/dashboard/admin/crm-export-button.tsx`, `lib/email.ts`, `app/actions/auth.ts`
  - Verify: CRM export downloads CSV. New user signup sends notification email to ADMIN_EMAILS.

## Files Likely Touched

- app/api/admin/users/route.ts
- app/dashboard/admin/page.tsx
- app/dashboard/admin/users-table.tsx
- app/dashboard/admin/coupons-section.tsx
- app/dashboard/admin/crm-export-button.tsx
- lib/email.ts
- app/actions/auth.ts
