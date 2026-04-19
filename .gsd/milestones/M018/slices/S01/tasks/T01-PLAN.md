---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Inline company search with fuzzy type-ahead

Add a search input to FilterToolbar with client-side fuzzy matching across company name, subcategory, and category tags. Results render as a dropdown of Link components that navigate to the company profile page and clear the search on click.

## Inputs

- `Existing FilterToolbar component`
- `CompanyData context with 599 companies`

## Expected Output

- `Search input with lucide Search icon`
- `Dropdown with top 10 fuzzy matches`
- `Link-based navigation to company profile`

## Verification

Search bar visible in filter toolbar. Typing a company name shows matching results. Clicking a result navigates to /dashboard/company/[id].
