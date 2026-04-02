# S03: Data sync and M006 cleanup

**Goal:** Commit latest Airtable CSV export and annotate M006 as superseded
**Demo:** After this: Production site has fresh Airtable data. M006 annotated as superseded.

## Tasks
- [ ] **T01: Commit fresh CSV data and annotate M006 as superseded** — 1. git add data/Startups-Grid view.csv (fresh Airtable export from today)
2. Verify the file has 600+ companies and correct headers
3. Add a note to M006-ROADMAP.md: '## Status\nSuperseded — all 4 heatmaps delivered ad-hoc during M005 close-out and post-M005 session. See M007 for cleanup.'
4. Commit both files
5. npm run build to verify site loads without errors
6. Push to origin main
  - Estimate: 10min
  - Files: data/Startups-Grid view.csv, .gsd/milestones/M006/M006-ROADMAP.md
  - Verify: npm run build passes. git log shows commit with both files. git diff HEAD~1 confirms CSV has 600+ rows.
