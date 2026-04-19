# S03: Conversion Optimization & Funnel Visibility

**Goal:** Conversion optimization: trial countdown in sidebar, admin funnel visualization, and demo request form
**Demo:** Admin sees funnel visualization (visit → signup → onboarding → first chart → upgrade). Trial users see countdown in sidebar. Upgrade CTAs fire one-click Stripe checkout. Demo request form sends email.

## Must-Haves

- Admin sees funnel visualization (visit → signup → onboarding → first chart → upgrade). Trial users see countdown in sidebar. Demo request form sends email to admin.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [ ] **T01: Trial countdown widget in sidebar + demo request form** `est:35min`
  Add trial countdown badge to sidebar bottom area (above settings) showing days remaining for explorer users. Create /[locale]/demo page with a demo request form that sends email to ADMIN_EMAILS via Resend. Thread daysRemaining through sidebar props.
  - Files: `components/dashboard/sidebar.tsx`, `components/dashboard/sidebar-shell.tsx`, `components/dashboard/layout-client.tsx`, `app/[locale]/demo/page.tsx`, `app/api/demo-request/route.ts`, `lib/email.ts`
  - Verify: Trial users see days-remaining badge in sidebar. Demo form submits and triggers admin email.

- [ ] **T02: Admin funnel visualization page** `est:30min`
  Add funnel chart to /dashboard/admin showing conversion stages: visit → signup → onboarding completed → first chart view → upgrade. Query analytics_events and subscriptions tables to compute stage counts. Render as a simple horizontal funnel with conversion rates between stages.
  - Files: `app/dashboard/admin/funnel-chart.tsx`, `app/dashboard/admin/page.tsx`, `app/api/admin/funnel/route.ts`
  - Verify: Admin dashboard shows funnel visualization with real data from analytics_events.

## Files Likely Touched

- components/dashboard/sidebar.tsx
- components/dashboard/sidebar-shell.tsx
- components/dashboard/layout-client.tsx
- app/[locale]/demo/page.tsx
- app/api/demo-request/route.ts
- lib/email.ts
- app/dashboard/admin/funnel-chart.tsx
- app/dashboard/admin/page.tsx
- app/api/admin/funnel/route.ts
