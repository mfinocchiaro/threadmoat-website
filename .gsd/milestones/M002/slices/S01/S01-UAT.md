# S01: Fix Sign-Up & Onboarding Flow — UAT

**Milestone:** M002
**Written:** 2026-03-29T22:18:02.490Z

### Sign-up flow works\n- [ ] Navigate to /auth/sign-up\n- [ ] Fill all required fields, select profile type, accept terms\n- [ ] Click Sign up — redirects to /auth/sign-up-success\n- [ ] No error messages shown\n\n### Verification email sends\n- [ ] Check email inbox for verification link\n- [ ] Click link — redirected to verification success page\n\n### Login works after verification\n- [ ] Click Sign In — redirected to login page\n- [ ] Enter credentials, click Login\n- [ ] Redirected to /dashboard\n\n### Coupon redemption works\n- [ ] Sign up with a valid invite code\n- [ ] After verification, check that subscription was created with correct product_id\n- [ ] If coupon fails during verification, verify login-time fallback creates subscription on first dashboard visit
