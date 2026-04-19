---
estimated_steps: 7
estimated_files: 4
skills_used: []
---

# T01: Convert Recon from 30-day trial to permanent free subscription

Change the Explorer/Recon signup flow from a 30-day trial (status 'trialing' with expiry date) to a permanent free subscription (status 'active', no expiry). Update subscription resolution to handle null current_period_end without treating it as expired. Update tiers.ts comments. Add a DB migration to convert existing explorer_trial subscriptions to permanent.

Steps:
1. In lib/explorer-trial.ts: rename createExplorerTrial → createFreeReconSubscription. Set status to 'active', current_period_end to NULL. Update EXPLORER_TRIAL_DAYS constant removal.
2. In lib/subscription.ts: handle null current_period_end gracefully — if product is explorer_trial and period_end is null, treat as permanent active. Remove isExpiredTrial for explorer products.
3. Update all call sites of createExplorerTrial to use new function name.
4. Update tiers.ts header comment: 'Tier 1 (Recon): Permanent free tier' not '30-day trial'.
5. Create migration script to update existing explorer_trial subscriptions: SET status='active', current_period_end=NULL WHERE product_id='explorer_trial'.

## Inputs

- `lib/explorer-trial.ts`
- `lib/subscription.ts`
- `lib/tiers.ts`

## Expected Output

- `lib/explorer-trial.ts`
- `lib/subscription.ts`
- `lib/tiers.ts`

## Verification

npm run build passes. grep -r 'createExplorerTrial' src/ lib/ app/ returns zero matches (all renamed). grep -q 'createFreeReconSubscription' lib/explorer-trial.ts succeeds.
