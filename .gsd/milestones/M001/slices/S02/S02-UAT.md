# S02: Stripe Upgrade Coupon — UAT

**Milestone:** M001
**Written:** 2026-03-27T22:53:25.201Z

## S02: Stripe Upgrade Coupon — UAT

### Analyst upgrade receives $4,999 credit
- [ ] Log in as a user who has a completed Analyst purchase
- [ ] Initiate checkout for Strategist annual subscription
- [ ] Verify the Stripe checkout page shows a $4,999 discount applied
- [ ] Verify the first-year total is $18,999 - $4,999 = $14,000

### Non-Analyst user sees full price
- [ ] Log in as a user with no Analyst purchase
- [ ] Initiate checkout for Strategist annual subscription
- [ ] Verify no discount is applied — full $18,999 price shown

### Coupon auto-creation
- [ ] In a fresh Stripe environment (test mode), trigger an upgrade checkout
- [ ] Verify the coupon 'threadmoat_analyst_upgrade_4999' appears in Stripe dashboard
- [ ] Verify it is a one-time $4,999 USD discount
