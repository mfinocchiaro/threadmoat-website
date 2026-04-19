---
estimated_steps: 1
estimated_files: 5
skills_used: []
---

# T03: Public Company Directory with Teaser Pages

Create /[locale]/companies as a public paginated directory showing company name, category, location, and founding year — no sensitive scores or funding data. Each company links to /[locale]/companies/[id] teaser page showing basic info with a CTA to log in for the full profile. Server-side pagination (20 per page). Add OG images. Update company data loader to support public-safe field filtering.

## Inputs

- `lib/company-data.ts loadCompanyData()`
- `Existing company data CSV`
- `Tier system in lib/tiers.ts`

## Expected Output

- `Public company directory with pagination`
- `Individual teaser pages with login gate`
- `OG images for directory pages`
- `Public-safe data filtering`

## Verification

Directory page renders with paginated list. Teaser page shows basic info with login CTA. No sensitive data exposed. Build succeeds.
