# S01: SEO & Marketing Foundation — UAT

**Milestone:** M020
**Written:** 2026-04-19T15:13:04.052Z

## UAT — S01: SEO & Marketing Foundation

### JSON-LD Structured Data
- [ ] View page source on homepage — verify JSON-LD script tag with Organization + WebSite schema
- [ ] View page source on /pricing — verify JSON-LD with Product + AggregateOffer (4 offers)
- [ ] View page source on /about — verify JSON-LD with Organization schema
- [ ] View page source on /report — verify JSON-LD with Product schema
- [ ] Paste JSON-LD into Google Rich Results Test — no errors

### Blog Engine
- [ ] Navigate to /insights — page renders with blog post listing
- [ ] Click sample post — detail page renders with full MDX content
- [ ] Verify prose typography (headings, paragraphs, lists, horizontal rules)
- [ ] Check OG image renders for /insights (section badge shows "Blog")
- [ ] Check OG image renders for individual post (shows post title)
- [ ] Verify Article JSON-LD on blog post detail page

### Company Directory
- [ ] Navigate to /companies — paginated grid shows company cards (20/page)
- [ ] Verify only public-safe fields shown (name, location, founded, discipline, categories)
- [ ] No scores, funding data, or investor information visible
- [ ] Click a company — teaser page shows overview with login CTA
- [ ] Pagination controls work (next/previous)
- [ ] OG images render for directory index and individual company pages

### Newsletter Capture
- [ ] Newsletter signup form visible on homepage (above footer)
- [ ] Newsletter signup form visible on /insights page
- [ ] Submit valid email — success toast and checkmark confirmation
- [ ] Submit invalid email — validation error
- [ ] Submit same email twice — no error (upsert)
- [ ] Verify rate limiting prevents abuse (5 signups/hour per IP)

### Sitemap
- [ ] Visit /sitemap.xml — includes /insights, /companies, blog post URLs, company page URLs
- [ ] Each entry has i18n alternates for all 6 locales
- [ ] Visit /robots.txt — /insights and /companies paths are allowed
