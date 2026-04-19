---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T05: Sitemap Expansion and SEO Verification

Update sitemap.ts to dynamically include: all blog post URLs (per locale), all company directory URLs (per locale), and the new /insights and /companies index pages. Add changeFrequency and priority values. Verify all JSON-LD, OG images, and sitemap entries are correct.

## Inputs

- `lib/blog.ts post listing`
- `lib/company-data.ts company listing`
- `Existing sitemap pattern`

## Expected Output

- `Expanded sitemap with blog and company URLs`
- `Updated robots.txt if needed`
- `All new pages have correct meta tags`

## Verification

Sitemap includes all new URLs with correct alternates. robots.txt allows crawling of new paths. Build succeeds with no errors.
