---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: Add funding metadata fields to Company type and loader

Add valuationConfidence, financialConfidence, reportedValuation, reportedValuationYear to Company interface and wire from CSV columns in load-companies-server.ts.

## Inputs

- None specified.

## Expected Output

- `lib/company-data.ts`
- `lib/load-companies-server.ts`

## Verification

npm run build
