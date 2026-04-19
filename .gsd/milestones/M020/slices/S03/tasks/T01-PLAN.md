---
estimated_steps: 1
estimated_files: 6
skills_used: []
---

# T01: Trial countdown widget in sidebar + demo request form

Add trial countdown badge to sidebar bottom area (above settings) showing days remaining for explorer users. Create /[locale]/demo page with a demo request form that sends email to ADMIN_EMAILS via Resend. Thread daysRemaining through sidebar props.

## Inputs

- `components/dashboard/sidebar.tsx (existing nav)`
- `lib/email.ts (existing email functions)`

## Expected Output

- `components/dashboard/sidebar.tsx (modified)`
- `app/[locale]/demo/page.tsx`
- `app/api/demo-request/route.ts`
- `lib/email.ts (modified)`

## Verification

Trial users see days-remaining badge in sidebar. Demo form submits and triggers admin email.
