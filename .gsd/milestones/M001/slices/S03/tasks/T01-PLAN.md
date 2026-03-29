---
estimated_steps: 1
estimated_files: 5
skills_used: []
---

# T01: Review and correct French translations

Review all 5 French message JSON files (common, home, about, pricing, report) against English source. Fix franglais calques, unnatural phrasing, and register issues for professional B2B audience.

## Inputs

- `messages/en/common.json`
- `messages/en/home.json`
- `messages/en/about.json`
- `messages/en/pricing.json`
- `messages/en/report.json`

## Expected Output

- `messages/fr/about.json`
- `messages/fr/pricing.json`
- `messages/fr/report.json`

## Verification

npm run build
