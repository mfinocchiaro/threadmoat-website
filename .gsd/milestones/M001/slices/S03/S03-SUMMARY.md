---
id: S03
parent: M001
milestone: M001
provides:
  - Corrected French translations across all public pages
requires:
  []
affects:
  []
key_files:
  - messages/fr/about.json
  - messages/fr/pricing.json
  - messages/fr/report.json
key_decisions:
  - Replaced franglais 'scrapé'/'scraping' consistently across all files with proper French equivalents
  - Used 'sélectionnée' instead of calque 'curée' for 'curated'
  - Upgraded casual 'Pas encore sûr ?' to B2B-appropriate 'Pas encore convaincu ?'
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M001/slices/S03/tasks/T01-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-27T23:02:54.053Z
blocker_discovered: false
---

# S03: French Translation Review — quality pass

**Reviewed and corrected all 5 French translation files, fixing 4 franglais calques and register issues for professional B2B language.**

## What Happened

Reviewed all 5 French translation files (common.json, home.json, about.json, pricing.json, report.json) against English sources. The existing translations were already professional quality. Fixed 4 issues in 3 files: franglais terms ('scrapé', 'curée', 'scraping') replaced with proper French ('collecté automatiquement', 'sélectionnée', 'collecte automatisée'), casual register upgraded ('Pas encore sûr' → 'Pas encore convaincu'), and an unnecessary article removed from a feature list. common.json and home.json required no changes.

## Verification

npm run build passes. All 5 French JSON files reviewed against English sources. 4 corrections applied across 3 files. No franglais calques remain.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `messages/fr/about.json` — Replaced 'scrapé' with 'collecté automatiquement'
- `messages/fr/pricing.json` — Replaced 'scrapé' calque, fixed casual register, removed unnecessary article
- `messages/fr/report.json` — Replaced 'curée' calque with 'sélectionnée', replaced 'scraping' with 'collecte automatisée'
