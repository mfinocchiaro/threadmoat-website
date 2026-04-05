# S01: Pricing, report page, and French translation fixes

**Goal:** Fix Analyst pricing copy (1 report not 4), update report page timing, fix French thesis translation.
**Demo:** After this: Analyst pricing says 1 report in all languages, report page mentions Q1/Q2 timing, French thesis corrected

## Tasks
- [x] **T01: Fixed Analyst pricing (1 report) in 6 languages, added Q1/Q2 report timing in 6 languages, fixed French 'fossé' → 'avantage'.** — 1. Fix Analyst subtitle in all 6 languages: 'Quarterly report' → 'One quarterly report' or equivalent
2. Fix analystF12: 'All four quarterly reports included' → 'One quarterly report included' or equivalent
3. Update report page hero to mention Q1 2026 current, Q2 coming July
4. Fix French home.json thesis title: 'fossé concurrentiel' → 'avantage concurrentiel'
5. Build and verify
  - Estimate: 15min
  - Files: messages/en/pricing.json, messages/fr/pricing.json, messages/es/pricing.json, messages/it/pricing.json, messages/de/pricing.json, messages/pt/pricing.json, messages/en/report.json, messages/fr/report.json, messages/es/report.json, messages/it/report.json, messages/de/report.json, messages/pt/report.json, messages/fr/home.json
  - Verify: grep for 'quarterly report' in all pricing files. Build passes.
