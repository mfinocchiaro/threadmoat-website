# S02: Dynamic import jsPDF + jspdf-autotable on reports page

**Goal:** Convert jsPDF and jspdf-autotable from static imports to dynamic imports in custom-report-tab.tsx, loaded only when user clicks Export PDF
**Demo:** After this: Reports page initial load no longer includes jsPDF in the bundle. PDF export still works on button click.

## Tasks
- [x] **T01: Converted jsPDF, jspdf-autotable, and html-to-image from static to dynamic imports — loaded only on Export PDF click** — In custom-report-tab.tsx:
1. Remove the static imports of jsPDF, autoTable, and toPng at the top of the file
2. In the handleExportPDF callback, dynamically import all three at the start: const [{ jsPDF }, { autoTable }, { toPng }] = await Promise.all([import('jspdf'), import('jspdf-autotable'), import('html-to-image')])
3. Pass jsPDF, autoTable, toPng as parameters to renderMarkdownToPDF and captureChartImage (or restructure so they're available in scope)
4. The renderMarkdownToPDF function uses autoTable internally — it needs to receive autoTable as a parameter instead of importing it at module level
5. Loading state is already handled by isExportingPDF state variable — no UI changes needed
  - Estimate: 15min
  - Files: components/charts/custom-report-tab.tsx
  - Verify: npm run build passes. The static imports of jspdf/jspdf-autotable/html-to-image are gone from the top of the file.
