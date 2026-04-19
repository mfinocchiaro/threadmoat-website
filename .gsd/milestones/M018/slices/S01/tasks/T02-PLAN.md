---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T02: Company profile page with tabbed sections

Create /dashboard/company/[id]/page.tsx with a hero card (name, badges, valuation), and 4 tabs: Overview (weighted score, lifecycle, funding round, strengths, weaknesses), Financials (valuation metrics, financial notes), Investors (badge list), and AI Narrative (profile-aware justification sections prioritized by user type from localStorage).

## Inputs

- `CompanyData context`
- `localStorage dashboard-profile-type for narrative prioritization`

## Expected Output

- `Hero card with name, size badge, subcategory, country, valuation`
- `4 tabs: Overview, Financials, Investors, AI Narrative`
- `Profile-aware narrative ordering based on user type`
- `Not Found fallback for invalid company IDs`

## Verification

Profile loads for any valid company ID or name. All 4 tabs render with correct data. Not-found state shows for invalid IDs. Loading skeleton displays during data fetch.
