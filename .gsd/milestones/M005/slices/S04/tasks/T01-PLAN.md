---
estimated_steps: 39
estimated_files: 2
skills_used: []
---

# T01: Build Custom Report Tab UI with company selection and section configuration

## Description

Create the `CustomReportTab` component in a new file (`components/charts/custom-report-tab.tsx`) and wire it as a fourth tab in the existing `ReportGenerator` Tabs structure. The tab provides: (1) company selection pre-populated from `useShortlist()` with a typeahead search to add more companies from the full dataset, (2) section toggles (checkboxes) for which report sections to include (Company Profile, Score Breakdown, AI Analysis, Charts), (3) a Generate button that transitions to a preview pane. This task proves the UI flow works end-to-end — content composition and export are T02 and T03.

## Steps

1. Create `components/charts/custom-report-tab.tsx`. Import `useShortlist` from `contexts/shortlist-context.tsx`. Accept `data: Company[]` prop (full filtered dataset, same as other tabs receive).
2. Build the company selection section:
   - Default selected companies from `useShortlist().shortlistedCompanies`
   - Typeahead input to search `data` by name, add to selection
   - Selected company chips with X remove button
   - Clear all / Reset to shortlist buttons
3. Build section configuration with checkboxes:
   - Company Profile (on by default)
   - Score Breakdown (on by default)
   - AI Analysis (off by default — warn about rate limit: "Uses 1 AI generation per company (10/hour limit)")
   - Charts: Bubble Chart, Quadrant Chart, Periodic Table, Treemap (all off by default)
4. Build Generate button — disabled when no companies selected. On click, set `mode` state from 'configure' to 'preview'. The preview pane is a placeholder div with "Report preview will appear here" — T02 fills it in.
5. In `components/charts/report-generator.tsx`: import `CustomReportTab`, add `<TabsTrigger value="custom-report">Custom Report</TabsTrigger>` to TabsList, add `<TabsContent value="custom-report"><CustomReportTab data={data} /></TabsContent>`.
6. Verify `npm run build` passes.

## Must-Haves

- [ ] `CustomReportTab` component exists in its own file
- [ ] Wired as 4th tab in ReportGenerator
- [ ] Company selection pre-populated from shortlist
- [ ] Typeahead search for adding companies from full dataset
- [ ] Section toggles with sensible defaults
- [ ] AI Analysis checkbox shows rate limit warning
- [ ] Generate button disabled when no companies selected
- [ ] Build passes with zero type errors

## Verification

- `npm run build` exits 0
- `test -f components/charts/custom-report-tab.tsx`
- `grep -q 'custom-report' components/charts/report-generator.tsx`
- `grep -q 'CustomReportTab' components/charts/report-generator.tsx`
- `grep -q 'useShortlist' components/charts/custom-report-tab.tsx`

## Inputs

- `components/charts/report-generator.tsx` — existing Tabs structure to add new tab
- `contexts/shortlist-context.tsx` — useShortlist() API for pre-populating companies
- `lib/company-data.ts` — Company type

## Expected Output

- `components/charts/custom-report-tab.tsx` — new component file
- `components/charts/report-generator.tsx` — modified to include 4th tab

## Inputs

- ``components/charts/report-generator.tsx` — existing Tabs structure to add new tab`
- ``contexts/shortlist-context.tsx` — useShortlist() API for pre-populating companies`
- ``lib/company-data.ts` — Company type`

## Expected Output

- ``components/charts/custom-report-tab.tsx` — new Custom Report Tab component`
- ``components/charts/report-generator.tsx` — modified with 4th tab wiring`

## Verification

npm run build && test -f components/charts/custom-report-tab.tsx && grep -q 'custom-report' components/charts/report-generator.tsx && grep -q 'useShortlist' components/charts/custom-report-tab.tsx
