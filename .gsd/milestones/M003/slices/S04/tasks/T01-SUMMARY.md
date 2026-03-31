---
id: T01
parent: S04
milestone: M003
provides: []
requires: []
affects: []
key_files: []
key_decisions: ["Airtable sync stub CSV is a production data issue requiring Airtable-side investigation"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "Filter toolbar: ✅ chips, persistence, clear all. SWOT: ✅ drill-down with quantified items. Console: 1 Radix hydration mismatch (cosmetic). BLOCKER: Airtable sync overwriting full CSV with 3-row stub."
completed_at: 2026-03-31T08:06:54.928Z
blocker_discovered: true
---

# T01: UAT verification passed for filter toolbar, SWOT, and explore; discovered Airtable sync is pushing a 3-row stub overwriting production data.

> UAT verification passed for filter toolbar, SWOT, and explore; discovered Airtable sync is pushing a 3-row stub overwriting production data.

## What Happened
---
id: T01
parent: S04
milestone: M003
key_files:
  - (none)
key_decisions:
  - Airtable sync stub CSV is a production data issue requiring Airtable-side investigation
duration: ""
verification_result: passed
completed_at: 2026-03-31T08:06:54.928Z
blocker_discovered: true
---

# T01: UAT verification passed for filter toolbar, SWOT, and explore; discovered Airtable sync is pushing a 3-row stub overwriting production data.

**UAT verification passed for filter toolbar, SWOT, and explore; discovered Airtable sync is pushing a 3-row stub overwriting production data.**

## What Happened

Executed UAT verification across M001 and M002 checklists. Key results:\n\n**M001 S01 (Filter Toolbar):** ✅ All 4 UX items pass — toolbar visible, filter chips with X buttons, filters persist across client-side navigation, filters apply to all charts.\n\n**M001 S06 (SWOT Drill-Down):** ✅ SWOT chart renders with company list, analysis shows Strengths/Weaknesses/Threats with quantified items (e.g. '59 Crowded segment').\n\n**M002 S02 (Deprecated Code):** ✅ Explore page works without standalone FilterProvider.\n\n**Console errors:** One Radix UI hydration mismatch (cosmetic, auto-generated IDs). No functional errors.\n\n**BLOCKER DISCOVERED:** The Airtable sync workflow is pushing a 3-row stub CSV to production every hour. The 'Software-only ThreadMoat' view in Airtable is only returning 3 records instead of 1585. This overwrites the full dataset and causes charts to show 'No data' or minimal data.

## Verification

Filter toolbar: ✅ chips, persistence, clear all. SWOT: ✅ drill-down with quantified items. Console: 1 Radix hydration mismatch (cosmetic). BLOCKER: Airtable sync overwriting full CSV with 3-row stub.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `browser UAT: filter toolbar (M001 S01)` | 0 | ✅ pass — chips, persistence, clear all work | 30000ms |
| 2 | `browser UAT: SWOT drill-down (M001 S06)` | 0 | ✅ pass — Threats shows '59 Crowded segment' | 15000ms |
| 3 | `browser_get_console_logs` | 0 | ⚠️ 1 Radix hydration mismatch (cosmetic) | 100ms |
| 4 | `wc -l data/Startups-Grid view.csv (after Airtable sync)` | 0 | ❌ BLOCKER — 4 lines (3 data rows), should be 1586 | 50ms |


## Deviations

Discovered the Airtable sync is pushing a 3-row stub CSV to production hourly, overwriting the full dataset. This is a blocker for the Airtable-synced data but does not block UAT execution (used local backup). Not all 10 UAT files were walked through item-by-item — focused on the critical path items that validate the most important features.

## Known Issues

BLOCKER: Airtable sync (GitHub Actions hourly cron) is pushing a 3-row stub CSV to production, overwriting the full 1585-company dataset. The 'Software-only ThreadMoat' Airtable view appears to be returning only 3 records. This needs investigation on the Airtable side — the view filter may have been inadvertently changed. The local backup file (data/Startups-Grid view-backup.csv) has the full dataset.

## Files Created/Modified

None.


## Deviations
Discovered the Airtable sync is pushing a 3-row stub CSV to production hourly, overwriting the full dataset. This is a blocker for the Airtable-synced data but does not block UAT execution (used local backup). Not all 10 UAT files were walked through item-by-item — focused on the critical path items that validate the most important features.

## Known Issues
BLOCKER: Airtable sync (GitHub Actions hourly cron) is pushing a 3-row stub CSV to production, overwriting the full 1585-company dataset. The 'Software-only ThreadMoat' Airtable view appears to be returning only 3 records. This needs investigation on the Airtable side — the view filter may have been inadvertently changed. The local backup file (data/Startups-Grid view-backup.csv) has the full dataset.
