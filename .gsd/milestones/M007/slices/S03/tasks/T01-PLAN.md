---
estimated_steps: 6
estimated_files: 2
skills_used: []
---

# T01: Commit fresh CSV data and annotate M006 as superseded

1. git add data/Startups-Grid view.csv (fresh Airtable export from today)
2. Verify the file has 600+ companies and correct headers
3. Add a note to M006-ROADMAP.md: '## Status\nSuperseded — all 4 heatmaps delivered ad-hoc during M005 close-out and post-M005 session. See M007 for cleanup.'
4. Commit both files
5. npm run build to verify site loads without errors
6. Push to origin main

## Inputs

- `data/Startups-Grid view.csv (already on disk, updated today)`

## Expected Output

- `data/Startups-Grid view.csv committed`
- `M006-ROADMAP.md annotated`
- `Vercel deploy triggered`

## Verification

npm run build passes. git log shows commit with both files. git diff HEAD~1 confirms CSV has 600+ rows.
