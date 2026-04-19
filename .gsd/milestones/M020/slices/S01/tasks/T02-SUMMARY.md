---
id: T02
parent: S01
milestone: M020
key_files:
  - lib/blog.ts
  - content/insights/plm-startup-landscape-2026.mdx
  - app/[locale]/insights/page.tsx
  - app/[locale]/insights/[slug]/page.tsx
  - app/[locale]/insights/opengraph-image.tsx
  - app/[locale]/insights/[slug]/opengraph-image.tsx
  - app/globals.css
key_decisions:
  - Used next-mdx-remote/rsc for RSC-compatible MDX rendering
  - Blog posts stored as .mdx files in content/insights/ with gray-matter frontmatter
  - Used @plugin directive for Tailwind v4 typography instead of @import
duration: 
verification_result: passed
completed_at: 2026-04-19T15:06:56.412Z
blocker_discovered: false
---

# T02: Built MDX blog engine at /[locale]/insights with sample post, OG images, and Article JSON-LD

**Built MDX blog engine at /[locale]/insights with sample post, OG images, and Article JSON-LD**

## What Happened

Installed next-mdx-remote, gray-matter, and @tailwindcss/typography. Created lib/blog.ts with functions for loading, listing, and retrieving posts from content/insights/ directory. Built insights index page with post cards showing title, description, date, author, and tags. Built detail page with MDXRemote RSC rendering, prose typography, and Article JSON-LD. Added OG images for both index and detail pages using existing generateOgImage utility. Created a substantial sample post about the PLM startup landscape. Used @plugin directive for Tailwind v4 typography integration.

## Verification

Full next build succeeds. Blog index and detail pages appear in build output. TypeScript passes with zero errors.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx next build` | 0 | pass | 45000ms |
| 2 | `npx next build 2>&1 | grep -i insight` | 0 | pass — 4 insight routes in output | 45000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `lib/blog.ts`
- `content/insights/plm-startup-landscape-2026.mdx`
- `app/[locale]/insights/page.tsx`
- `app/[locale]/insights/[slug]/page.tsx`
- `app/[locale]/insights/opengraph-image.tsx`
- `app/[locale]/insights/[slug]/opengraph-image.tsx`
- `app/globals.css`
