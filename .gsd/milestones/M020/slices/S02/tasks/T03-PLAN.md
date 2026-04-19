---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T03: CRM export button + signup notification email

Add CRM export button to admin dashboard that triggers CSV download from existing /api/admin/crm-export. Add sendSignupNotificationEmail() to lib/email.ts and trigger it during user registration in app/actions/auth.ts.

## Inputs

- `app/api/admin/crm-export/route.ts (existing API)`
- `lib/email.ts (existing email functions)`
- `app/actions/auth.ts (registration flow)`

## Expected Output

- `app/dashboard/admin/crm-export-button.tsx`
- `lib/email.ts (modified)`
- `app/actions/auth.ts (modified)`

## Verification

CRM export downloads CSV. New user signup sends notification email to ADMIN_EMAILS.
