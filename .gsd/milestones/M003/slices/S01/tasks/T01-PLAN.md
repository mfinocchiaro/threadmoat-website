---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Fix tier mapping and clean Red Keep coupons

Add forge_annual to the strategist case in getAccessTier(). Remove red_keep_annual coupons from DB. Remove red_keep_annual from any code references. Update the tier comment header to document all product_ids.

## Inputs

- None specified.

## Expected Output

- `Updated lib/tiers.ts`
- `Red Keep coupons removed from DB`

## Verification

npm run build passes. getAccessTier('forge_annual', false) === 'strategist'. DB has 0 red_keep_annual coupons.
