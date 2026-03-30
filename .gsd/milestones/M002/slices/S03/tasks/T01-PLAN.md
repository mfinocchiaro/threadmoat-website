---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T01: Add pipeline fields to chart tooltips

Identify which charts deal with valuations and funding data. Add valuationConfidence, reportedValuation, and reportedValuationYear to their tooltip/detail displays. Target: candlestick (already has financialConfidence), bubble chart, treemap, parallel coordinates, or any chart displaying estimatedMarketValue.

## Inputs

- `lib/company-data.ts (Company interface with new fields)`

## Expected Output

- `Updated chart components with new fields in tooltips/legends`

## Verification

npm run build passes. grep confirms new fields referenced in at least 3 chart files.
