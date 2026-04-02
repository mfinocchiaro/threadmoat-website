---
estimated_steps: 54
estimated_files: 3
skills_used: []
---

# T03: Install PDF dependencies, capture chart snapshots, and assemble PDF export

## Description

Install `jspdf` and `html-to-image`, build a hidden offscreen chart rendering container that mounts the 4 chart components at fixed dimensions, capture them as PNG via `toPng()`, and compose the full PDF document with jsPDF. The PDF includes: a cover page with report metadata (title, date, company count), per-company sections with text content (profile, scores, AI narrative), and chart images. Text sections use jsPDF's text API with a lightweight markdown parser for headings/bold/bullets. Chart images are embedded at fixed width.

## Failure Modes

| Dependency | On error | On timeout | On malformed response |
|------------|----------|-----------|----------------------|
| `html-to-image toPng()` | Log warning, skip chart image, continue with text-only section | 10s timeout per chart capture | Show "Chart capture failed" placeholder in PDF |
| `jsPDF` | Surface error to user ("PDF generation failed"), preserve markdown preview as fallback | N/A (synchronous) | N/A |

## Negative Tests

- **Error paths**: Chart container not rendered (charts disabled) — skip chart capture entirely, produce text-only PDF
- **Boundary conditions**: 0 charts selected (no capture needed), single company (minimal PDF), 10+ companies (multi-page PDF with correct page breaks)

## Steps

1. Install dependencies: `npm install jspdf html-to-image` (no `--legacy-peer-deps` needed — neither has React peer deps). Verify both appear in `package.json`.
2. In `custom-report-tab.tsx`, build a hidden chart render container. Use a div with `position: fixed; left: -9999px; visibility: hidden; width: 800px; height: 500px`. Conditionally mount the selected chart components (`BubbleChart`, `QuadrantChart`, `PeriodicTable`, `TreemapChart`) into this container, passing the report's selected companies as `data` and shortlisted IDs. Important: do NOT use `display: none` — charts need real dimensions to render. Use refs to access each chart's container div.
3. Build `captureCharts()` async function: for each enabled chart, call `toPng(chartContainerRef.current, { pixelRatio: 2 })` from `html-to-image`. Store results as `Map<string, string>` (chart ID → data URL). Handle capture errors per-chart (log warning, continue). Add a brief `await new Promise(r => setTimeout(r, 500))` delay between chart mounts to ensure D3 useEffect has run.
4. Build `generatePDF()` function using jsPDF:
   - Create `new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })`
   - Cover page: title ("ThreadMoat Custom Report"), date, company count, section summary
   - Per-company pages: company name header, profile text, score breakdown, AI narrative text (if included). Use `doc.splitTextToSize(text, pageWidth - margins)` for line wrapping. Track Y position and call `doc.addPage()` when approaching page bottom.
   - Chart pages: for each captured chart, `doc.addImage(dataUrl, 'PNG', x, y, width, height)`. One chart per half-page or one per page depending on content.
   - Build a lightweight markdown-to-jsPDF renderer that handles: `## ` headings (larger bold font), `**bold**` (bold font), `- ` bullet items (indented with bullet char), and plain paragraphs. Strip other markdown.
   - Call `doc.save('threadmoat-report.pdf')` to trigger download.
5. Add an "Export PDF" button next to the existing Copy button in the preview pane. Show a loading spinner during chart capture + PDF generation. Disable button during generation.
6. Verify `npm run build` passes and dependencies are in package.json.

## Must-Haves

- [ ] `jspdf` and `html-to-image` installed in package.json
- [ ] Hidden offscreen container renders charts at fixed 800×500 dimensions
- [ ] Chart snapshots captured via `toPng()` with `pixelRatio: 2`
- [ ] PDF generated with cover page, per-company text sections, chart images
- [ ] Basic markdown rendering in PDF (headings, bold, bullets)
- [ ] Page overflow handled with `splitTextToSize` and `addPage()`
- [ ] Export PDF button in preview pane with loading state
- [ ] Chart capture errors handled gracefully (text-only fallback)
- [ ] Build passes with zero type errors

## Verification

- `npm run build` exits 0
- `grep -q 'jspdf' package.json`
- `grep -q 'html-to-image' package.json`
- `grep -q 'jsPDF\|jspdf' components/charts/custom-report-tab.tsx`
- `grep -q 'toPng\|html-to-image' components/charts/custom-report-tab.tsx`
- `grep -q 'addPage\|splitTextToSize' components/charts/custom-report-tab.tsx`

## Observability Impact

- Signals added: Console warnings for failed chart captures with chart ID; PDF generation timing logged to console
- Failure state exposed: Per-chart capture status in component state; "Export PDF" button error state if generation fails

## Inputs

- `components/charts/custom-report-tab.tsx` — T02 output with report composition and markdown preview
- `components/charts/bubble-chart.tsx` — BubbleChart component (props: `data: Company[], shortlistedIds?: Set<string>`)
- `components/charts/quadrant-chart.tsx` — QuadrantChart component (props: `data: Company[], shortlistedIds?: Set<string>`)
- `components/charts/periodic-table.tsx` — PeriodicTable component (props: `data: Company[], shortlistedIds?: Set<string>`)
- `components/charts/treemap-chart.tsx` — TreemapChart component (props: `data: Company[], shortlistedIds?: Set<string>`)
- `package.json` — to add jspdf and html-to-image dependencies

## Expected Output

- `components/charts/custom-report-tab.tsx` — extended with chart capture container, PDF generation, and export button
- `package.json` — updated with jspdf and html-to-image dependencies
- `package-lock.json` — updated lock file

## Inputs

- ``components/charts/custom-report-tab.tsx` — T02 output with report composition and preview`
- ``components/charts/bubble-chart.tsx` — BubbleChart component for chart snapshot`
- ``components/charts/quadrant-chart.tsx` — QuadrantChart component for chart snapshot`
- ``components/charts/periodic-table.tsx` — PeriodicTable component for chart snapshot`
- ``components/charts/treemap-chart.tsx` — TreemapChart component for chart snapshot`
- ``package.json` — to add new dependencies`

## Expected Output

- ``components/charts/custom-report-tab.tsx` — extended with chart capture and PDF export`
- ``package.json` — updated with jspdf and html-to-image`
- ``package-lock.json` — updated lock file`

## Verification

npm run build && grep -q 'jspdf' package.json && grep -q 'html-to-image' package.json && grep -q 'jsPDF\|jspdf' components/charts/custom-report-tab.tsx && grep -q 'toPng\|html-to-image' components/charts/custom-report-tab.tsx
