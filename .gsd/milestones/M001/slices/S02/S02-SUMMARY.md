---
id: S02
parent: M001
milestone: M001
provides:
  - Automatic $4,999 upgrade credit for Analyst-to-Strategist upgrades
requires:
  []
affects:
  []
key_files:
  - app/actions/stripe.ts
key_decisions:
  - Used Stripe coupon with fixed ID for idempotent create-or-retrieve pattern
  - Coupon is duration:once ($4,999 off first invoice only)
  - Discount only applied to strategist_annual product for users with completed analyst_annual purchase
  - Coupon auto-created in Stripe on first use — no manual dashboard setup required
patterns_established:
  - Idempotent Stripe coupon creation with fixed ID (retrieve-or-create pattern)
observability_surfaces:
  - Console log '[Checkout] Analyst purchase found — applying $4,999 upgrade credit' when coupon applied
  - Console log '[Checkout] Created upgrade coupon' on first coupon creation
drill_down_paths:
  - .gsd/milestones/M001/slices/S02/tasks/T01-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-27T22:53:25.201Z
blocker_discovered: false
---

# S02: Stripe Upgrade Coupon

**Existing Analyst purchasers automatically receive a $4,999 credit when upgrading to Strategist annual subscription.**

## What Happened

Single task slice. Added upgrade coupon logic to createCheckoutSession in app/actions/stripe.ts. When a user checks out for a Strategist annual subscription, the new getUpgradeDiscounts() helper queries the purchases table for a completed analyst_annual purchase by that user. If found, it ensures a $4,999 one-time Stripe coupon exists (idempotent retrieve-or-create with fixed coupon ID) and passes it as a discount to the Stripe checkout session. Non-Analyst users or non-Strategist products get no discount. The coupon auto-creates itself in Stripe on first use — no manual dashboard configuration needed.

## Verification

npm run build passes with zero errors. Code review confirms: getUpgradeDiscounts returns empty array for non-strategist products, empty array when no analyst purchase exists, coupon discount when analyst purchase found. Coupon uses idempotent retrieve-or-create pattern with fixed ID.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `app/actions/stripe.ts` — Added getUpgradeDiscounts() helper and coupon auto-application for Analyst-to-Strategist upgrades
