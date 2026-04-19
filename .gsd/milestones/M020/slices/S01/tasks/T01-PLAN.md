---
estimated_steps: 1
estimated_files: 5
skills_used: []
---

# T01: JSON-LD Structured Data on Public Pages

Add JSON-LD structured data to all public pages: Organization schema on homepage, Product + OfferCatalog on /pricing, Article schema prep for blog, WebSite with SearchAction on homepage. Create a shared lib/json-ld.ts utility for generating schema objects.

## Inputs

- `Existing page metadata patterns in lib/metadata.ts`
- `Current public page structure`

## Expected Output

- `lib/json-ld.ts with schema generator functions`
- `JSON-LD script tags in all 4 public page layouts`

## Verification

Build succeeds. JSON-LD script tags render in page source with valid schema.org markup.
