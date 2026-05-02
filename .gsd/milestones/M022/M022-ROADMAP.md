# M022: AEO Optimization — Schema, Answer Cards, Market Pages & Multilingual Hygiene

**Vision:** Make ThreadMoat content discoverable and citable by AI answer engines (ChatGPT, Perplexity, Google SGE) by adding structured JSON-LD schema, ungated public answer snippets per company, 10 new market answer pages, consistent metric language, and clean hreflang/canonical markup across all locales.

## Success Criteria

- JSON-LD Organization schema on every company page and ItemList on directory
- Each company has a public ungated snippet visible to crawlers without login
- 10 market answer pages live with FAQ schema
- Homepage and about page use consistent dated metric language
- All multilingual URLs have correct hreflang tags and self-referencing canonicals

## Slices

- [ ] **S01: JSON-LD schema on company + directory pages** `risk:low` `depends:[]`
  > After this: Google Rich Results Test passes on /companies/[id] showing Organization schema. Directory page shows ItemList schema.

- [ ] **S02: Public answer card per company (ungated snippet)** `risk:medium` `depends:[S01]`
  > After this: curl -A Googlebot https://threadmoat.com/en/companies/[id] returns HTML with company name, category, and funding visible without redirect to login.

- [ ] **S03: Market answer pages (10 new content pages)** `risk:high` `depends:[S01]`
  > After this: 10 pages live under /en/insights/market/[topic]. Each passes Rich Results Test for FAQ schema. Pages are included in sitemap.xml.

- [ ] **S04: Metric normalization across homepage and about page** `risk:low` `depends:[]`
  > After this: Homepage and about page show identical, dated metric counts with no contradictions between pages.

- [ ] **S05: Hreflang and canonical audit on multilingual URLs** `risk:medium` `depends:[S02,S03]`
  > After this: Spot-check 5 pages across 5 locales: each has x-default + 5 locale alternates + self-canonical. sitemap.xml includes all locale variants for company, insights, and market pages.

## Boundary Map

Not provided.
