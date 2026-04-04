---
estimated_steps: 5
estimated_files: 4
skills_used: []
---

# T02: Instrument shortlist toggle, filter changes, AI narrative, and report export

1. **Shortlist toggle** (`contexts/shortlist-context.tsx`): In the `toggle` callback, after the state update, call `trackInteraction('shortlist_toggle', { companyId: id, action: prev.includes(id) ? 'remove' : 'add' })`
2. **Filter changes** (`contexts/filter-context.tsx`): Add an effect that watches `activeFilterCount` and fires `trackInteraction('filter_change', { activeFilterCount })` when it changes (debounced — skip the initial zero)
3. **AI narrative** (`components/charts/report-generator.tsx`): After the `complete()` call (line ~482), call `trackInteraction('narrative_generate', { companyId: selectedCompany.id })`
4. **Report export** (`components/charts/custom-report-tab.tsx`): At the top of `handleGenerate` and `handleExportPDF`, call `trackInteraction('report_generate', { companyCount: selectedCompanies.length })` and `trackInteraction('report_export_pdf', { companyCount: selectedCompanies.length })`
5. Verify build passes

## Inputs

- `lib/track-interaction.ts`
- `contexts/shortlist-context.tsx`
- `contexts/filter-context.tsx`
- `components/charts/report-generator.tsx`
- `components/charts/custom-report-tab.tsx`

## Expected Output

- `contexts/shortlist-context.tsx (modified)`
- `contexts/filter-context.tsx (modified)`
- `components/charts/report-generator.tsx (modified)`
- `components/charts/custom-report-tab.tsx (modified)`

## Verification

npx next build passes with zero errors.
