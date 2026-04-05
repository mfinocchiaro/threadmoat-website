---
estimated_steps: 5
estimated_files: 13
skills_used: []
---

# T01: Fix pricing and translations

1. Fix Analyst subtitle in all 6 languages: 'Quarterly report' → 'One quarterly report' or equivalent
2. Fix analystF12: 'All four quarterly reports included' → 'One quarterly report included' or equivalent
3. Update report page hero to mention Q1 2026 current, Q2 coming July
4. Fix French home.json thesis title: 'fossé concurrentiel' → 'avantage concurrentiel'
5. Build and verify

## Inputs

- `Site review feedback`

## Expected Output

- `13 translation files modified`

## Verification

grep for 'quarterly report' in all pricing files. Build passes.
