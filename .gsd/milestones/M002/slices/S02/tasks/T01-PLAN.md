---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: Delete deprecated code and clean up explore page

Delete components/viz-filter-bar.tsx. Verify no imports reference it. Check explore/page.tsx — if it uses its own FilterProvider, assess whether it can use the layout-level one or needs to keep its standalone provider (explore is a public-facing page within the dashboard route). Clean up any orphaned references. Build and verify.

## Inputs

- None specified.

## Expected Output

- `viz-filter-bar.tsx deleted`
- `explore/page.tsx cleaned up`
- `Build passes`

## Verification

npm run build passes. grep -r VizFilterBar returns 0 results. grep -r viz-filter-bar returns 0 results.
