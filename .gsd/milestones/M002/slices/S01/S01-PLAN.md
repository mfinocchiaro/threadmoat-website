# S01: Fix Sign-Up & Onboarding Flow

**Goal:** Diagnose and fix the error James encountered on sign-up submit. Verify the full registration → email verification → login → onboarding wizard pipeline works.
**Demo:** After this: A new test user completes sign-up, receives verification email, verifies, logs in, and sees the onboarding wizard without errors.

## Tasks
- [x] **T01: Fixed James's missing subscription (coupon never redeemed) and added retry + login-time fallback for coupon redemption.** — Start the dev server. Navigate to /auth/sign-up and submit a test registration. Check browser console and server logs for the error. Inspect the registerUser server action, DB connection, Resend email config, and coupon validation for failure points. Document the root cause.
  - Estimate: 30min
  - Files: app/actions/auth.ts, lib/db.ts, lib/email.ts, lib/rate-limit.ts, lib/coupons.ts, app/auth/sign-up/page.tsx
  - Verify: Error reproduced and root cause identified. Document findings.
- [x] **T02: Hardened verifyEmail with retry logic and added login-time coupon fallback in dashboard layout.** — Apply the fix for the diagnosed root cause. Harden error handling in the sign-up flow: improve error messages, add defensive checks for DB/email/coupon failures. Ensure the registerUser action never throws an unhandled error to the client.
  - Estimate: 45min
  - Files: app/actions/auth.ts, lib/email.ts, lib/coupons.ts, app/auth/sign-up/page.tsx
  - Verify: npm run build passes. Sign-up form submits without error. Server action returns structured success/error responses.
- [x] **T03: Verified sign-up flow works locally, confirmed James's account state, code hardening deployed.** — Test the complete flow: sign-up → verification email → verify-email page → login → dashboard → onboarding wizard. Verify each step works. Check edge cases: duplicate email, invalid invite code, expired token.
  - Estimate: 30min
  - Files: app/auth/sign-up/page.tsx, app/auth/verify-email/page.tsx, app/auth/login/page.tsx, components/dashboard/onboarding-wizard.tsx
  - Verify: Full flow verified in browser. No console errors. Onboarding wizard displays for new users.
