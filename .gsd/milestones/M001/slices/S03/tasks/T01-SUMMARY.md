---
id: T01
parent: S03
milestone: M001
provides: []
requires: []
affects: []
key_files: ["messages/fr/about.json", "messages/fr/pricing.json", "messages/fr/report.json"]
key_decisions: ["Replaced 'scrapé' with 'collecté automatiquement' / 'collecte automatisée' across all files", "Replaced 'curée' (franglais calque of 'curated') with 'sélectionnée'", "Changed 'Pas encore sûr ?' to 'Pas encore convaincu ?' for B2B register", "Removed unnecessary article in feature list ('Les quatre' → 'Quatre')"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build passes with zero errors after all French translation edits."
completed_at: 2026-03-27T23:02:28.255Z
blocker_discovered: false
---

# T01: Fixed 4 franglais calques and register issues across 3 French translation files.

> Fixed 4 franglais calques and register issues across 3 French translation files.

## What Happened
---
id: T01
parent: S03
milestone: M001
key_files:
  - messages/fr/about.json
  - messages/fr/pricing.json
  - messages/fr/report.json
key_decisions:
  - Replaced 'scrapé' with 'collecté automatiquement' / 'collecte automatisée' across all files
  - Replaced 'curée' (franglais calque of 'curated') with 'sélectionnée'
  - Changed 'Pas encore sûr ?' to 'Pas encore convaincu ?' for B2B register
  - Removed unnecessary article in feature list ('Les quatre' → 'Quatre')
duration: ""
verification_result: passed
completed_at: 2026-03-27T23:02:28.255Z
blocker_discovered: false
---

# T01: Fixed 4 franglais calques and register issues across 3 French translation files.

**Fixed 4 franglais calques and register issues across 3 French translation files.**

## What Happened

Reviewed all 5 French translation files against their English source. The translations were already high quality overall — professional B2B register, correct grammar and gender agreement, good adaptation of concepts rather than literal translation (e.g., 'AI-hallucinated' → 'généré par IA'). Found and fixed 4 issues across 3 files: (1) 'scrapé' is franglais — replaced with 'collecté automatiquement' in about.json and 'collecte automatisée' in pricing.json, (2) 'curée' in report.json is a calque from 'curated' — replaced with 'sélectionnée', (3) 'Pas encore sûr ?' is too casual for B2B — changed to 'Pas encore convaincu ?', (4) Removed unnecessary definite article 'Les' before 'quatre rapports' in a feature list. common.json and home.json needed no changes.

## Verification

npm run build passes with zero errors after all French translation edits.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 16600ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `messages/fr/about.json`
- `messages/fr/pricing.json`
- `messages/fr/report.json`


## Deviations
None.

## Known Issues
None.
