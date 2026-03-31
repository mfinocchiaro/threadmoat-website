---
id: T02
parent: S04
milestone: M003
provides: []
requires: []
affects: []
key_files: ["scripts/fetch_airtable_csv.py"]
key_decisions: ["Added min_records guard to Airtable sync script — skips write if record count below threshold", "Thresholds: 100 for Startups views, 50 for Investors"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build passes. Script has min_records guard for all 3 views. Full CSV restored (1586 lines)."
completed_at: 2026-03-31T08:09:00.910Z
blocker_discovered: false
---

# T02: Added min_records safety guard to Airtable sync script preventing stub overwrites.

> Added min_records safety guard to Airtable sync script preventing stub overwrites.

## What Happened
---
id: T02
parent: S04
milestone: M003
key_files:
  - scripts/fetch_airtable_csv.py
key_decisions:
  - Added min_records guard to Airtable sync script — skips write if record count below threshold
  - Thresholds: 100 for Startups views, 50 for Investors
duration: ""
verification_result: passed
completed_at: 2026-03-31T08:09:00.911Z
blocker_discovered: false
---

# T02: Added min_records safety guard to Airtable sync script preventing stub overwrites.

**Added min_records safety guard to Airtable sync script preventing stub overwrites.**

## What Happened

Added a minimum record count safety guard to fetch_airtable_csv.py. Each view config now has a min_records threshold. If the Airtable API returns fewer records than the threshold, the script logs a warning and skips the file write, protecting existing data from being overwritten by a stub. Also restored the full 1586-line CSV from backup.

## Verification

npm run build passes. Script has min_records guard for all 3 views. Full CSV restored (1586 lines).

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 18900ms |
| 2 | `grep min_records scripts/fetch_airtable_csv.py` | 0 | ✅ pass — 3 views with min_records guards | 50ms |


## Deviations

None.

## Known Issues

The Airtable 'Software-only ThreadMoat' view still needs investigation on the Airtable side — it's returning only 3 records. The guard prevents data loss but doesn't fix the root cause.

## Files Created/Modified

- `scripts/fetch_airtable_csv.py`


## Deviations
None.

## Known Issues
The Airtable 'Software-only ThreadMoat' view still needs investigation on the Airtable side — it's returning only 3 records. The guard prevents data loss but doesn't fix the root cause.
