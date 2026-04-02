---
estimated_steps: 41
estimated_files: 1
skills_used: []
---

# T02: Build report composition engine with AI narratives and markdown preview

## Description

Add report content composition to `CustomReportTab`. When the user clicks Generate, the component: (1) composes company profile sections from the Company data (reusing the text generation patterns from `generateReport()` in `report-generator.tsx`), (2) fetches AI narratives per-company sequentially via `/api/ai/narrative` (raw fetch, not useCompletion — need multiple sequential requests), (3) renders everything in a scrollable markdown preview pane, (4) provides copy-to-clipboard for the full composed report. The AI narrative fetch should show per-company progress (loading/complete/error) and cache results in component state so re-generating doesn't re-call the API.

## Failure Modes

| Dependency | On error | On timeout | On malformed response |
|------------|----------|-----------|----------------------|
| `/api/ai/narrative` | Show error badge per company, continue with remaining companies | 60s timeout per request (matches maxDuration), mark as error | Show raw text or "AI analysis unavailable" fallback |

## Negative Tests

- **Error paths**: AI endpoint returns 429 (rate limit) — show "Rate limit reached" per-company, skip remaining AI fetches
- **Boundary conditions**: 0 companies selected (Generate disabled from T01), 1 company (no multi-company edge cases), AI Analysis unchecked (skip all narrative fetches entirely)

## Steps

1. In `custom-report-tab.tsx`, add a `composeReport()` function that builds a markdown string from selected companies and enabled sections:
   - For each company, include enabled sections: Company Profile header (name, location, founded, lifecycle phase, funding), Score Breakdown (7 score dimensions with justifications), AI Analysis placeholder
   - Use the same data formatting patterns as `generateReport()` in report-generator.tsx (reference its structure for consistency)
2. Add AI narrative fetching: when AI Analysis is enabled, iterate selected companies sequentially. For each, POST to `/api/ai/narrative` with `{ companyId: company.id }`, collect the streamed text via a ReadableStream reader. Store results in a `Map<string, { status: 'loading' | 'complete' | 'error', text: string }>` state. Cache completed results — if composeReport is called again with the same company, reuse cached narrative.
3. Show rate limit warning before generation starts: "This will use N of your 10 AI generations per hour" (where N = number of companies with AI Analysis enabled). Require confirmation if N > 5.
4. Build the preview pane: scrollable div rendering the composed markdown. Use the existing `AINarrativeSection` component pattern (split on `##` headings) for rendering AI sections. Show per-company status badges (spinner for loading, checkmark for complete, error icon for failed).
5. Add a Copy button that copies the full composed markdown to clipboard via `navigator.clipboard.writeText()`.
6. Verify `npm run build` passes.

## Must-Haves

- [ ] Report composition produces markdown with company profiles and score breakdowns
- [ ] AI narratives fetched sequentially per-company via raw fetch to `/api/ai/narrative`
- [ ] Per-company fetch status visible in UI (loading/complete/error)
- [ ] Rate limit warning shown before generation when AI Analysis enabled
- [ ] Results cached in component state — no re-fetch on re-generate
- [ ] Copy-to-clipboard button for full report markdown
- [ ] Build passes with zero type errors

## Verification

- `npm run build` exits 0
- `grep -q 'ai/narrative' components/charts/custom-report-tab.tsx`
- `grep -q 'clipboard' components/charts/custom-report-tab.tsx`
- `grep -q 'composeReport\|compose' components/charts/custom-report-tab.tsx`

## Observability Impact

- Signals added: Per-company AI fetch status (loading/complete/error) in component state, console.error for failed narrative fetches with company ID context
- Failure state exposed: Error badge per company in preview, rate-limit-exceeded state halts further fetches

## Inputs

- `components/charts/custom-report-tab.tsx` — T01 output, the tab UI to extend with composition logic
- `components/charts/report-generator.tsx` — reference for `generateReport()` text patterns and `AINarrativeSection` rendering
- `app/api/ai/narrative/route.ts` — the endpoint contract (POST with `{ companyId }`, streams text)
- `lib/company-data.ts` — Company type and `formatCurrency()`

## Expected Output

- `components/charts/custom-report-tab.tsx` — extended with report composition engine, AI fetching, markdown preview, and copy button

## Inputs

- ``components/charts/custom-report-tab.tsx` — T01 output with tab UI shell`
- ``components/charts/report-generator.tsx` — reference for generateReport() patterns and AINarrativeSection`
- ``app/api/ai/narrative/route.ts` — endpoint contract for AI narrative streaming`
- ``lib/company-data.ts` — Company type and formatCurrency()`

## Expected Output

- ``components/charts/custom-report-tab.tsx` — extended with report composition, AI narrative fetching, markdown preview, copy-to-clipboard`

## Verification

npm run build && grep -q 'ai/narrative' components/charts/custom-report-tab.tsx && grep -q 'clipboard' components/charts/custom-report-tab.tsx
