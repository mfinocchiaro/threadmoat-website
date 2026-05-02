# S01: Auth Flow Hardening

**Goal:** Fix session invalidation gaps, login error disambiguation, and account deletion cleanup
**Demo:** Password reset invalidates sessions. Account deletion signs out immediately. Unverified login shows resend-verification prompt instead of generic error.

## Must-Haves

- Not provided.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [ ] **T01: Disambiguate unverified login error with resend CTA** `est:30min`
  When an unverified user tries to log in, return a distinct error code from the credentials provider and show a user-friendly message with a link to resend verification email
  - Files: `auth.ts`, `app/auth/login/page.tsx`, `app/auth/error/page.tsx`
  - Verify: Attempt login with unverified account — see distinct error message with resend link

- [ ] **T02: Invalidate sessions on password reset** `est:45min`
  After successful password reset, update a session version counter or token generation timestamp so existing JWTs are rejected on next validation
  - Files: `auth.ts`, `app/actions/auth.ts`, `lib/db.ts`
  - Verify: Reset password → existing session returns 401 on next API call

- [ ] **T03: Sign out user on account deletion** `est:20min`
  After account deletion, clear the session cookie so the deleted user cannot make authenticated calls for the remaining JWT lifetime
  - Files: `app/dashboard/settings/delete-account-button.tsx`, `app/actions/auth.ts`
  - Verify: Delete account → immediately redirected to home, no authenticated API calls possible

## Files Likely Touched

- auth.ts
- app/auth/login/page.tsx
- app/auth/error/page.tsx
- app/actions/auth.ts
- lib/db.ts
- app/dashboard/settings/delete-account-button.tsx
