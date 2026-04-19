---
estimated_steps: 1
estimated_files: 6
skills_used: []
---

# T02: MDX Blog Engine at /[locale]/insights

Install next-mdx-remote. Create blog infrastructure: content/insights/ directory for .mdx posts, lib/blog.ts for post loading/parsing with frontmatter (title, description, date, author, locale, slug). Build /[locale]/insights list page and /[locale]/insights/[slug] detail page with i18n support, OG images, and JSON-LD Article schema. Include one sample post about PLM startup landscape.

## Inputs

- `Existing OG image pattern in app/[locale]/opengraph-image.tsx`
- `i18n routing config`
- `lib/og-image.tsx utility`

## Expected Output

- `Blog content directory with sample post`
- `Blog list and detail pages with i18n`
- `OG images for blog pages`
- `JSON-LD Article markup on blog posts`

## Verification

Blog index page renders at /insights. Sample post renders at /insights/[slug]. OG image generates. Build succeeds.
