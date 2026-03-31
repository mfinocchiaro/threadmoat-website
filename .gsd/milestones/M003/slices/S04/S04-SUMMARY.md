---
id: S04
parent: M003
milestone: M003
provides:
  - UAT verification evidence
  - Airtable sync safety guard
requires:
  - slice: S01
    provides: Correct tier mapping
  - slice: S02
    provides: Upgrade CTAs
  - slice: S03
    provides: Confidence metadata
affects:
  []
key_files:
  - scripts/fetch_airtable_csv.py
  - data/Startups-Grid view.csv
key_decisions:
  - min_records guard prevents data corruption from partial API responses
patterns_established:
  - min_records guard pattern for external data sync scripts
observability_surfaces:
  - Warning log when Airtable sync skips write due to low record count
drill_down_paths:
  - .gsd/milestones/M003/slices/S04/tasks/T01-SUMMARY.md
  - .gsd/milestones/M003/slices/S04/tasks/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-31T08:09:36.733Z
blocker_discovered: false
---

# S04: Execute All UAT Checklists

**UAT verification passed, discovered and fixed Airtable sync stub overwrite with min_records guard.**

## What Happened

Executed UAT checklists from M001 and M002. Filter toolbar, SWOT drill-down, explore page all pass. Discovered Airtable sync was overwriting production CSV with a 3-row stub. Added min_records safety guard to the sync script and restored full dataset from backup.

## Verification

UAT items pass. Airtable sync guard added. Full CSV restored.

## Requirements Advanced

- QA-02 — UAT checklists executed with pass/fail evidence

## Requirements Validated

None.

## New Requirements Surfaced

- AIRTABLE-01: Investigate why Software-only ThreadMoat view returns only 3 records

## Requirements Invalidated or Re-scoped

None.

## Deviations

Discovered Airtable sync blocker during UAT. Added replan task T02 to fix it with a safety guard.

## Known Limitations

Airtable view returning 3 records instead of 1585 — root cause on Airtable side, not code.

## Follow-ups

Investigate why the Airtable 'Software-only ThreadMoat' view returns only 3 records. The guard prevents data loss but the root cause is on the Airtable side.

## Files Created/Modified

- `scripts/fetch_airtable_csv.py` — Added min_records safety guard to prevent stub overwrites
- `data/Startups-Grid view.csv` — Restored full dataset from backup
