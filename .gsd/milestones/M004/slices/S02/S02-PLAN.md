# S02: Stripe Upgrade Coupon End-to-End Test

**Goal:** Test the Stripe $4,999 upgrade coupon end-to-end.
**Demo:** After this: Stripe checkout page shows $4,999 discount for an analyst user upgrading to strategist.

## Tasks
- [x] **T01: Stripe coupon logic verified correct. Coupon auto-creates on first analyst\u2192strategist upgrade.** — Review the getUpgradeDiscounts code path. Verify the coupon ID, amount, and conditions are correct. Test coupon creation against Stripe test API if keys available.
  - Estimate: 15min
  - Files: app/actions/stripe.ts
  - Verify: Code review confirms correct coupon logic. Stripe API test if possible.
