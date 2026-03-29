---
id: T01
parent: S02
milestone: M001
provides: []
requires: []
affects: []
key_files: ["app/actions/stripe.ts"]
key_decisions: ["Used Stripe coupon with fixed ID for idempotent create-or-retrieve pattern", "Coupon is duration:once ($4,999 off first invoice only)", "Discount only applied to strategist_annual product for users with completed analyst_annual purchase", "Coupon auto-created in Stripe on first use — no manual dashboard setup required"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build passes with zero errors. Logic verified by code review: getUpgradeDiscounts returns empty array for non-strategist products, returns empty array when no analyst purchase exists, returns coupon discount when analyst purchase found."
completed_at: 2026-03-27T22:53:06.944Z
blocker_discovered: false
---

# T01: Added automatic $4,999 upgrade credit for existing Analyst purchasers upgrading to Strategist subscription.

> Added automatic $4,999 upgrade credit for existing Analyst purchasers upgrading to Strategist subscription.

## What Happened
---
id: T01
parent: S02
milestone: M001
key_files:
  - app/actions/stripe.ts
key_decisions:
  - Used Stripe coupon with fixed ID for idempotent create-or-retrieve pattern
  - Coupon is duration:once ($4,999 off first invoice only)
  - Discount only applied to strategist_annual product for users with completed analyst_annual purchase
  - Coupon auto-created in Stripe on first use — no manual dashboard setup required
duration: ""
verification_result: passed
completed_at: 2026-03-27T22:53:06.946Z
blocker_discovered: false
---

# T01: Added automatic $4,999 upgrade credit for existing Analyst purchasers upgrading to Strategist subscription.

**Added automatic $4,999 upgrade credit for existing Analyst purchasers upgrading to Strategist subscription.**

## What Happened

Added upgrade coupon logic to createCheckoutSession in app/actions/stripe.ts. When a user checks out for a Strategist annual subscription, the new getUpgradeDiscounts() helper queries the purchases table for a completed analyst_annual purchase. If found, it ensures a $4,999 one-time Stripe coupon exists (idempotent retrieve-or-create with fixed ID 'threadmoat_analyst_upgrade_4999') and returns it as a discount for the checkout session. Non-Analyst users or non-Strategist products get no discount (empty array). Build passes clean.

## Verification

npm run build passes with zero errors. Logic verified by code review: getUpgradeDiscounts returns empty array for non-strategist products, returns empty array when no analyst purchase exists, returns coupon discount when analyst purchase found.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 16900ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `app/actions/stripe.ts`


## Deviations
None.

## Known Issues
None.
