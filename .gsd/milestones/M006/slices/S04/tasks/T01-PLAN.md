---
estimated_steps: 21
estimated_files: 2
skills_used: []
---

# T01: Extend Company type and CSV loader with ecosystem compatibility, graphics kernel, and modeling paradigms

Add three new fields to the Company interface and load them from the main CSV in loadCompaniesFromCSV(). This unblocks the chart component.

## Steps

1. Open `lib/company-data.ts` and add three fields to the `Company` interface after the existing heatmap enrichment fields (after line ~108):
   - `ecosystemCompatibility: string` — free-text describing platform integrations
   - `graphicsKernel: string` — cleaned kernel identifier or empty string
   - `modelingParadigms: string[]` — parsed list of technology standards

2. Open `lib/load-companies-server.ts` and add the three new column mappings in the `return` block of `loadCompaniesFromCSV()`, in the main CSV section (not the enrichment section):
   - `ecosystemCompatibility: cleanField(row['Ecosystem SW/Platform Compatibility'])` — use existing `cleanField()` to strip N/A values
   - `graphicsKernel`: Load `row['Graphics Kernel']`, then apply a cleaning function. Create a helper `cleanGraphicsKernel(raw: string): string` that:
     a. Returns `''` for empty/N/A values
     b. Returns the cleaned value ONLY if it contains one of: 'Proprietary', 'Parasolid', 'OpenCascade', 'OpenUSD', 'Rhino', 'WebGL', 'ACIS', 'CGAL' (case-insensitive check)
     c. Returns `''` for all other values (these are misplaced construction industry data — ~25 rows have values like 'Residential Construction, Homebuilding')
   - `modelingParadigms: parsePythonList(row['Modeling Paradigms & Protocols'])` — use existing `parsePythonList()` helper

3. Verify the CSV column names match exactly: 'Ecosystem SW/Platform Compatibility' (column 16), 'Graphics Kernel' (column 19), 'Modeling Paradigms & Protocols' (column 160).

## Must-Haves

- [ ] `ecosystemCompatibility` field added to Company interface as `string`
- [ ] `graphicsKernel` field added to Company interface as `string`
- [ ] `modelingParadigms` field added to Company interface as `string[]`
- [ ] CSV loader maps all three columns correctly
- [ ] Graphics Kernel cleaning rejects construction industry values, keeps kernel identifiers
- [ ] `npm run build` passes with zero errors

## Inputs

- ``lib/company-data.ts` — existing Company interface to extend`
- ``lib/load-companies-server.ts` — existing CSV loader with cleanField() and parsePythonList() helpers`
- ``data/Startups-Grid Full DB View.csv` — source CSV with columns at positions 16, 19, 160`

## Expected Output

- ``lib/company-data.ts` — Company interface with ecosystemCompatibility, graphicsKernel, modelingParadigms fields`
- ``lib/load-companies-server.ts` — CSV loader mapping three new columns with cleanGraphicsKernel() helper`

## Verification

npm run build
