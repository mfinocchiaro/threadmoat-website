# T01: 07-stripe-upgrade-coupon 01

**Slice:** S02 — **Milestone:** M001

## Description

Wire a Stripe upgrade coupon that automatically credits $4,999 when an existing Analyst (report) purchaser upgrades to a Strategist annual subscription.

Purpose: Analyst purchasers who upgrade should not pay twice for value they already received. This incentivizes upgrades and is fair pricing.
Output: Modified checkout flow that detects existing Analyst purchases and applies the coupon automatically.

## Must-Haves

- [ ] "Stripe coupon exists with $4,999 one-time discount for upgrade"
- [ ] "When an Analyst purchaser checks out for Strategist, coupon is auto-applied"
- [ ] "When a non-Analyst user checks out for Strategist, no coupon is applied"
- [ ] "Strategist checkout shows discounted first-year price for existing Analyst purchasers"

## Files

- `app/actions/stripe.ts`
- `lib/stripe-prices.ts`
