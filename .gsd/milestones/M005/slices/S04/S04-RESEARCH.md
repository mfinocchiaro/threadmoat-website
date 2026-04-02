# S04 — Custom Report Builder — Research

**Date:** 2026-04-01

## Summary

S04 is the capstone slice composing all prior M005 work — filters, shortlisted companies, AI narratives, and chart visualizations — into a single exportable report document. The existing `components/charts/report-generator.tsx` (1,153 lines) already has three tabs (IC Memos, Intelligence Reports, Scenario Reports) with text-based template generation and AI streaming via `useCompletion`. The Custom Report Builder becomes a fourth tab that unifies: (1) company selection pre-populated from the ShortlistContext, (2) report section toggles (company profiles, AI narrative, chart snapshots), and (3) PDF export via `jsPDF` + `html-to-image`.

The highest risk is chart snapshot capture — all 4 core charts (bubble, quadrant, periodic-table, treemap) are D3-rendered into SVG/HTML elements using `useRef` with responsive sizing from `containerRef.current.clientWidth`. For PDF embedding, charts must be rendered at a fixed size in a hidden container, captured as PNG via `html-to-image`, and embedded into the jsPDF document. The AI narrative integration is lower risk since S02 already established the streaming pattern — the report builder just needs to call `/api/ai/narrative` for each selected company and collect the completed text.

The recommended approach is `jsPDF` (lightweight, no server-side rendering needed, battle-tested PDF composition) plus `html-to-image` (DOM-to-PNG capture for D3 charts). This avoids `@react-pdf/renderer`'s requirement to rebuild chart rendering in its own SVG API, and avoids server-side Puppeteer/Playwright which would add deployment complexity. The trade-off is that chart captures are rasterized at capture resolution rather than vector — acceptable for report use.

## Recommendation

**Add a "Custom Report" tab** to the existing `ReportGenerator` component's `<Tabs>` structure. Build the report builder as a new `CustomReportTab` component with a multi-step workflow:

1. **Select companies** — starts with shortlisted companies from `useShortlist()`, allows manual add/remove via the existing typeahead pattern
2. **Configure sections** — toggle which sections to include: Executive Summary (per company), Score Breakdown, Financials, AI Analysis, Charts (bubble, quadrant, treemap, periodic-table)
3. **Generate & Preview** — compose the report in a scrollable preview pane
4. **Export** — Download as PDF via `jsPDF`, copy as markdown via clipboard

Use `jsPDF` + `html-to-image` for PDF export. Render selected charts in a hidden offscreen container at fixed 800×500 dimensions, capture with `html-to-image`'s `toPng()`, embed as images in jsPDF pages. Text sections (company profiles, AI narratives) composed directly via jsPDF's text API.

For AI narrative per company: call `/api/ai/narrative` sequentially (not parallel — respects rate limit of 10/hour). Cache results in component state so regenerating the report doesn't re-call the API.

## Implementation Landscape

### Key Files

- `components/charts/report-generator.tsx` — **Primary file to modify**. 1,153 lines with `ReportGenerator` (3-tab structure), `IntelligenceReportTab`, `ScenarioReportTab`, `ICReport`, `generateReport()`, `generateScenarioReport()`, and `AINarrativeSection`. The new `CustomReportTab` goes here alongside the existing tabs.
- `contexts/shortlist-context.tsx` — Provides `useShortlist()` with `shortlistedCompanies: Company[]`, `ids: string[]`, `idSet: Set<string>`. The report builder reads shortlisted companies as the default selection.
- `hooks/use-thesis-gated-data.ts` — Returns `filtered: Company[]` (the active dataset after filters). Needed for the company search/add typeahead.
- `app/api/ai/narrative/route.ts` — POST endpoint accepting `{ companyId }`, streaming 4-section markdown. Rate limited to 10/hour/user. The report builder calls this per selected company.
- `app/dashboard/reports/content.tsx` — The page wrapper using `VizPageShell` + `useThesisGatedData`. Already passes `filtered` to `ReportGenerator`.
- `components/charts/bubble-chart.tsx` — D3 SVG chart, `svgRef: SVGSVGElement`, responsive width from container. Used for chart snapshot capture.
- `components/charts/quadrant-chart.tsx` — Same pattern as bubble chart.
- `components/charts/periodic-table.tsx` — D3 HTML-based chart (div cells, not SVG). Uses `containerRef` for sizing.
- `components/charts/treemap-chart.tsx` — D3 SVG chart, same responsive pattern.
- `lib/company-data.ts` — `Company` type, `formatCurrency()`, `loadCompanyData()`. Used throughout report composition.
- `lib/widget-registry.ts` — Chart registry with IDs/labels. Useful for chart selection UI labels.

### Build Order

**Task 1 — Report builder UI and company selection** (medium, ~1 session). Create `CustomReportTab` with company selection from shortlist + typeahead add, section toggles (checkboxes for which report sections to include), and a Generate button. Wire into existing `<Tabs>` in `ReportGenerator`. This proves the UI flow end-to-end with a text-only preview.

**Task 2 — Report composition engine and markdown preview** (medium, ~1 session). Build the report composition logic that combines: company profile data (reuse `generateReport()` patterns), AI narratives (fetched per-company via `useCompletion` or direct fetch), and section ordering. Render as a scrollable markdown preview in the report pane. Add copy-to-clipboard for the full composed report.

**Task 3 — Chart snapshot capture and PDF export** (high risk, ~1 session). Install `jspdf` + `html-to-image`. Build hidden chart rendering container that mounts selected charts at fixed dimensions (800×500), captures via `toPng()`, stores as data URLs. Compose final PDF: cover page with report metadata, per-company sections with text + chart images, AI narrative sections. Download via `jsPDF.save()`.

**Why this order**: T1 proves the UI integration is clean and shortlist data flows correctly. T2 proves content composition works (the hard part is AI narrative collection for multiple companies). T3 is highest risk (chart capture + PDF assembly) but isolated — if chart capture has issues, the text-only report still works.

### Verification Approach

- `npm run build` — zero type errors, all routes compile
- `grep -q 'CustomReportTab\|custom-report' components/charts/report-generator.tsx` — tab exists
- `grep -q 'useShortlist' components/charts/report-generator.tsx` — shortlist integration
- `grep -q 'jsPDF\|jspdf' components/charts/report-generator.tsx` — PDF export wired
- `grep -q 'html-to-image\|toP[nN]g' components/charts/report-generator.tsx` — chart capture wired
- `test -f package.json && grep -q 'jspdf' package.json` — dependency installed
- `test -f package.json && grep -q 'html-to-image' package.json` — dependency installed
- Visual verification: navigate to `/dashboard/reports`, switch to Custom Report tab, see company selection pre-populated from shortlist

## Don't Hand-Roll

| Problem | Existing Solution | Why Use It |
|---------|------------------|------------|
| PDF document composition | `jspdf` (4.2.1) | Lightweight client-side PDF generation, no server needed, widely battle-tested. Handles text layout, image embedding, multi-page documents. |
| DOM → PNG capture for charts | `html-to-image` (1.11.13) | Captures SVG and HTML elements as PNG/JPEG. Works with D3's SVG output. No canvas intermediate like html2canvas. Zero dependencies. |
| AI narrative streaming | `@ai-sdk/react` `useCompletion` (already installed) | Existing pattern from S02. Rate-limited endpoint already built. |
| Company data from shortlist | `useShortlist()` from S03 | Already provides `shortlistedCompanies: Company[]` with resolved objects. |
| Chart rendering | Existing chart components (bubble, quadrant, periodic-table, treemap) | Already accept `data: Company[]` and `shortlistedIds?: Set<string>`. Can be mounted in hidden container for capture. |

## Constraints

- **Rate limit on AI narrative**: 10 requests/hour/user. A report with 5+ companies will consume half the budget. The builder should warn users about this and show remaining budget if possible. Consider making AI narrative sections opt-in per company.
- **Chart capture requires DOM rendering**: Charts must be mounted and rendered (even offscreen) before capture. This means React must mount the chart component, D3 must run its `useEffect`, and the SVG/HTML must be in the DOM. Use `visibility: hidden; position: absolute` (not `display: none` which prevents rendering).
- **`report-generator.tsx` is already 1,153 lines**: The new tab adds significant complexity. Consider extracting `CustomReportTab` into its own file (`components/charts/custom-report-tab.tsx`) and importing it into the main component.
- **jsPDF text layout is basic**: No markdown rendering in jsPDF. AI narrative markdown (`## Headings`, `**bold**`, bullet lists) must be parsed and converted to jsPDF text calls with manual font size/weight changes, or simplified to plain text.
- **React 19 peer deps**: The project uses React 19.2.0. May need `--legacy-peer-deps` for new packages (same as S02 experience). Both `jspdf` and `html-to-image` have no React peer deps so this shouldn't be an issue.

## Common Pitfalls

- **`html-to-image` fails on invisible elements** — If the chart container uses `display: none`, the capture returns blank. Must use `visibility: hidden; position: fixed; left: -9999px` to keep the element in the render tree while offscreen. Additionally, the chart's `useEffect` needs the container to have non-zero dimensions for D3's `clientWidth` measurement.
- **AI narrative rate exhaustion during multi-company reports** — If a user generates a report for 8 companies with AI analysis, they burn 8 of their 10 hourly requests. The UI should show a count warning ("This will use 5 of your 10 AI generations per hour") and make AI per-company opt-in.
- **jsPDF page overflow** — Company sections with long AI narratives can overflow a single page. Must use `jsPDF.splitTextToSize()` to break long text into lines that fit the page width and track Y position, adding new pages with `addPage()` when content exceeds page height.
- **D3 chart responsive sizing in hidden container** — Charts use `containerRef.current.clientWidth` which will be 0 if the container has `width: 0`. The hidden container must have explicit dimensions (e.g., `width: 800px; height: 500px`) for charts to render correctly.
- **`useCompletion` for multiple companies sequentially** — The `useCompletion` hook manages a single completion stream. For multi-company AI reports, either use multiple hook instances (one per company slot) or use raw `fetch` calls to `/api/ai/narrative` and collect response text. Raw fetch is simpler for batch collection.

## Open Risks

- **Chart capture quality**: `html-to-image` captures at screen resolution. PDF readers may show blurry charts if captured at 1x. Consider capturing at 2x scale (`{ pixelRatio: 2 }`) and downscaling in the PDF, but this doubles memory usage for captures.
- **jsPDF markdown rendering**: AI narratives contain markdown (headings, bold, bullets). jsPDF has no native markdown support. Options: (a) strip markdown to plain text, (b) use a simple custom parser for headings/bold/bullets, (c) use a library like `jspdf-autotable` for structured sections. Recommend (b) — a lightweight parser that handles `## `, `**bold**`, and `- ` list items covers 95% of the narrative output format.
- **Large PDF file size**: Each chart captured as PNG at 2x could be 200-400KB. A report with 4 charts × 5 companies = 20 images = 4-8MB PDF. May need to compress images or offer a "text-only" export option.

## Sources

- `@react-pdf/renderer` docs — confirmed React 19 support and SVG primitives, but requires rebuilding chart rendering (not feasible for D3 charts). Ruled out for this slice. (source: Context7 docs)
- `jspdf` — version 4.2.1, no peer dependencies, client-side PDF generation. (source: npm registry)
- `html-to-image` — version 1.11.13, zero dependencies, DOM-to-image capture. (source: npm registry)
