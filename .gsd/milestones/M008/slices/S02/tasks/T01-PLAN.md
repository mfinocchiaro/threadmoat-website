---
estimated_steps: 6
estimated_files: 2
skills_used: []
---

# T01: Extend renderMarkdownToPDF with table, nested list, and code block support

In custom-report-tab.tsx, extend the renderMarkdownToPDF function to handle:

1. **Markdown tables** — detect `|` pipe-delimited rows, parse headers and data rows, render using doc.autoTable() from jspdf-autotable or manual column layout with doc.text() and doc.line(). Must handle variable column widths.

2. **Nested bullet lists** — detect indentation (2 or 4 spaces before `-`), render with increasing left indent. Support 2 levels of nesting.

3. **Fenced code blocks** — detect triple-backtick ``` fences, render contents in courier font with gray background rectangle and reduced font size.

Keep the existing rendering for # H1, ## H2, ---, - bullets, **bold**, and plain text intact.

Install jspdf-autotable if table rendering via manual column layout is too fragile.

## Inputs

- `components/charts/custom-report-tab.tsx (existing renderMarkdownToPDF at ~line 260)`

## Expected Output

- `components/charts/custom-report-tab.tsx with extended renderMarkdownToPDF`

## Verification

npm run build passes. Manual test: generate a PDF from the report builder containing a company with AI analysis (which may include tables/code). Inspect PDF visually.
