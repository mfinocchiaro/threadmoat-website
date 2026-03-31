# S04: Execute All UAT Checklists

**Goal:** Execute all 10 UAT checklists from M001 and M002 in the browser.
**Demo:** After this: All M001 and M002 UAT checklists executed with pass/fail results documented.

## Tasks
- [x] **T01: UAT verification passed for filter toolbar, SWOT, and explore; discovered Airtable sync is pushing a 3-row stub overwriting production data.** — Start dev server, log in as admin, walk through all 10 UAT checklists from M001 (S01-S06) and M002 (S01-S04). Document pass/fail for each item.
  - Estimate: 45min
  - Verify: All UAT items verified with pass/fail evidence.
  - Blocker: BLOCKER: Airtable sync (GitHub Actions hourly cron) is pushing a 3-row stub CSV to production, overwriting the full 1585-company dataset. The 'Software-only ThreadMoat' Airtable view appears to be returning only 3 records. This needs investigation on the Airtable side — the view filter may have been inadvertently changed. The local backup file (data/Startups-Grid view-backup.csv) has the full dataset.
- [x] **T02: Added min_records safety guard to Airtable sync script preventing stub overwrites.** — Investigate why the 'Software-only ThreadMoat' Airtable view returns only 3 records. Add a safety check to the sync script: if the fetched record count is less than a threshold (e.g. 100), skip the write and log a warning. This prevents the stub from overwriting good data.
  - Estimate: 20min
  - Files: scripts/fetch_airtable_csv.py
  - Verify: python scripts/fetch_airtable_csv.py runs without overwriting when record count is below threshold. Commit and push.
