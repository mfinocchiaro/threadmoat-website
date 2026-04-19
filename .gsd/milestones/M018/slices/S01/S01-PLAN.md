# S01: Company Search & Profile

**Goal:** Add a compact search bar near the filter toolbar with fuzzy type-ahead, and a company profile page with curated expandable sections (hero, financials, scores, investors, customers, tags, AI narrative).
**Demo:** User types a company name in the search bar, sees fuzzy results, clicks one, and views a curated profile with expandable sections showing all ThreadMoat data for that company.

## Must-Haves

- Not provided.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Inline company search with fuzzy type-ahead** `est:30m`
  Add a search input to FilterToolbar with client-side fuzzy matching across company name, subcategory, and category tags. Results render as a dropdown of Link components that navigate to the company profile page and clear the search on click.
  - Files: `components/dashboard/filter-toolbar.tsx`
  - Verify: Search bar visible in filter toolbar. Typing a company name shows matching results. Clicking a result navigates to /dashboard/company/[id].

- [x] **T02: Company profile page with tabbed sections** `est:45m`
  Create /dashboard/company/[id]/page.tsx with a hero card (name, badges, valuation), and 4 tabs: Overview (weighted score, lifecycle, funding round, strengths, weaknesses), Financials (valuation metrics, financial notes), Investors (badge list), and AI Narrative (profile-aware justification sections prioritized by user type from localStorage).
  - Files: `app/dashboard/company/[id]/page.tsx`
  - Verify: Profile loads for any valid company ID or name. All 4 tabs render with correct data. Not-found state shows for invalid IDs. Loading skeleton displays during data fetch.

## Files Likely Touched

- components/dashboard/filter-toolbar.tsx
- app/dashboard/company/[id]/page.tsx
