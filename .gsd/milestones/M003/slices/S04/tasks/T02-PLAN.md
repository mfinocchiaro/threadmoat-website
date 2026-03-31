---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T02: Fix Airtable sync stub overwrite

Investigate why the 'Software-only ThreadMoat' Airtable view returns only 3 records. Add a safety check to the sync script: if the fetched record count is less than a threshold (e.g. 100), skip the write and log a warning. This prevents the stub from overwriting good data.

## Inputs

- `Airtable API access`

## Expected Output

- `Updated fetch_airtable_csv.py with row-count guard`

## Verification

python scripts/fetch_airtable_csv.py runs without overwriting when record count is below threshold. Commit and push.
