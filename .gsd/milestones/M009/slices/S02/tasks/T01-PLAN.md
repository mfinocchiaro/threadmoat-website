---
estimated_steps: 6
estimated_files: 1
skills_used: []
---

# T01: Convert jsPDF + jspdf-autotable + html-to-image to dynamic imports

In custom-report-tab.tsx:
1. Remove the static imports of jsPDF, autoTable, and toPng at the top of the file
2. In the handleExportPDF callback, dynamically import all three at the start: const [{ jsPDF }, { autoTable }, { toPng }] = await Promise.all([import('jspdf'), import('jspdf-autotable'), import('html-to-image')])
3. Pass jsPDF, autoTable, toPng as parameters to renderMarkdownToPDF and captureChartImage (or restructure so they're available in scope)
4. The renderMarkdownToPDF function uses autoTable internally — it needs to receive autoTable as a parameter instead of importing it at module level
5. Loading state is already handled by isExportingPDF state variable — no UI changes needed

## Inputs

- `components/charts/custom-report-tab.tsx`

## Expected Output

- `components/charts/custom-report-tab.tsx with dynamic imports`

## Verification

npm run build passes. The static imports of jspdf/jspdf-autotable/html-to-image are gone from the top of the file.
