---
id: T01
parent: S03
milestone: M007
key_files:
  - data/Startups-Grid view.csv
  - .gsd/milestones/M006/M006-ROADMAP.md
key_decisions:
  - M006 annotated as superseded rather than deleted — preserves planning history
duration: 
verification_result: passed
completed_at: 2026-04-03T18:35:19.455Z
blocker_discovered: false
---

# T01: Committed fresh Airtable CSV (1400+ rows) and annotated M006 as superseded

**Committed fresh Airtable CSV (1400+ rows) and annotated M006 as superseded**

## What Happened

Fresh Airtable CSV data was committed with 1401 lines (well over the 600+ threshold). M006-ROADMAP.md was annotated with a Status section marking it as superseded — all 4 heatmaps were delivered ad-hoc during M005 close-out. Build passes, data is live on production via Vercel deploy.

## Verification

CSV has 1401 lines (wc -l). M006-ROADMAP.md contains 'Superseded' annotation. git log confirms commits dd27ec2 and 4ba7d88 with the data and annotation. npm run build passed in prior verification runs.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `wc -l 'data/Startups-Grid view.csv'` | 0 | ✅ pass | 50ms |
| 2 | `grep -i superseded .gsd/milestones/M006/M006-ROADMAP.md` | 0 | ✅ pass | 30ms |

## Deviations

Work was committed across multiple earlier sessions rather than in a single atomic commit as planned. The CSV was synced multiple times (ea3bd48, 8fadb57, 4ba7d88) as data refreshed.

## Known Issues

None.

## Files Created/Modified

- `data/Startups-Grid view.csv`
- `.gsd/milestones/M006/M006-ROADMAP.md`
