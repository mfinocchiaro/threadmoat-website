# S02: PDF renderer improvements — tables, nested lists, code blocks

**Goal:** Extend the jsPDF markdown renderer in custom-report-tab.tsx to handle markdown tables, nested bullet lists, and fenced code blocks
**Demo:** After this: Custom report PDF export renders markdown tables, nested lists, and code blocks correctly

## Tasks
- [x] **T01: Extended renderMarkdownToPDF with markdown table (via jspdf-autotable), nested bullet list, and fenced code block support** — In custom-report-tab.tsx, extend the renderMarkdownToPDF function to handle:

1. **Markdown tables** — detect `|` pipe-delimited rows, parse headers and data rows, render using doc.autoTable() from jspdf-autotable or manual column layout with doc.text() and doc.line(). Must handle variable column widths.

2. **Nested bullet lists** — detect indentation (2 or 4 spaces before `-`), render with increasing left indent. Support 2 levels of nesting.

3. **Fenced code blocks** — detect triple-backtick ``` fences, render contents in courier font with gray background rectangle and reduced font size.

Keep the existing rendering for # H1, ## H2, ---, - bullets, **bold**, and plain text intact.

Install jspdf-autotable if table rendering via manual column layout is too fragile.
  - Estimate: 30min
  - Files: components/charts/custom-report-tab.tsx, package.json
  - Verify: npm run build passes. Manual test: generate a PDF from the report builder containing a company with AI analysis (which may include tables/code). Inspect PDF visually.
