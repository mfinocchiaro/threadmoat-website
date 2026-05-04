# ThreadMoat Website

## What This Is

A B2B SaaS website for industrial AI and engineering software market intelligence. Public marketing pages in 6 languages convert visitors into paid dashboard subscribers who access 44+ interactive data visualizations covering 500+ startups across the PLM, CAD, CAE, and industrial AI landscape. Live Stripe payments with Analyst ($4,999 one-time) and Strategist (€18,999/yr) tiers.

## Core Value

Converting visitors into paying dashboard subscribers through compelling market intelligence content and frictionless checkout.

## Requirements

### Validated

- ✓ Public marketing pages (home, pricing, about, report) — v1.0
- ✓ Email/password authentication with verification and password reset — existing
- ✓ 44+ dashboard visualization pages — existing
- ✓ i18n for 6 languages (en/fr/es/it/de/pt) with flag emoji language switcher — v1.0
- ✓ CSV-driven startup and investor data pipeline — existing
- ✓ Role-based access control (explorer/analyst/strategist/advisory/admin) — v1.0
- ✓ Live Stripe checkout (Analyst + Strategist) — v1.0
- ✓ SEO (sitemap, OG images, meta tags, robots.txt) — v1.0
- ✓ React Email templates (welcome, receipt, verification, password-reset) — v1.0
- ✓ AI-powered narrative analysis for company reports (Impressions, Conclusions, Beware, Overlooked Opportunities) — v1.1
- ✓ Subscriber onboarding wizard (tier-aware, 3 steps) — v1.0
- ✓ Company shortlist / workspace (click companies across charts, amber highlight, toolbar panel) — v1.1
- ✓ Custom report builder (company selection + section toggles + AI narrative + chart capture → PDF/markdown) — v1.1
- ✓ Market Momentum Heatmap (composite scoring, YlOrRd palette, Y-axis grouping, tooltips) — v1.2
- ✓ Industry Penetration Heatmap customer count mode (known customers per cell via parseKnownCustomers) — v1.2
- ✓ Target Customer Profile Heatmap (dual-axis selectable: 4 X-axis customer dimensions × 4 Y-axis groupings × 4 value modes, geo-region collapsing, shortlist highlighting) — v1.2
- ✓ CSV re-parse caching for /api/ai/narrative (module-level mtime cache) — v1.3
- ✓ PDF markdown renderer: tables, nested lists, code blocks (jspdf-autotable) — v1.3
- ✓ LLM API cost measurement (structured token usage logging per request) — v1.3
- ✓ All 26 charts theme-aware light/dark via CSS custom properties — v1.3
- ✓ Zero build warnings (turbopack root configured) — v1.3

### Active

- [ ] Human quality review of AI narrative output against SME expectations
- [ ] Portuguese translation review (FR pending Michael's review)
- [ ] UAT manual execution of test scripts for M005 features (browser tests deferred)

### Out of Scope

- Asian language variants (Japanese, Chinese) — different infrastructure, payment rails, regulatory
- Mobile app — responsive web sufficient for B2B market
- Real-time data feeds — CSV pipeline sufficient at current scale
- Report generator tool — separate GSD project
- Agent updater tool — separate GSD project
- Dashboard content translation — English-only dashboard acceptable for B2B

## Current Milestone: M027 — Search Indexing & Analytics

**Goal:** Build internal SEO observability — keyword rankings, CTR, impression trends, crawl signals — so the team can validate the AEO/SEO work from M025/M026.

**Target Features:**
- Google Search Console data integration with daily sync
- SEO dashboard with rankings, traffic trends, CTR analysis
- Keyword performance validation and content gap detection

## Context

- **Tech stack:** Next.js 16, NextAuth, Stripe (live), Resend, React Email, D3, Recharts, three.js/react-three-fiber, Tailwind CSS, shadcn/ui, next-intl, Vercel AI SDK v6 (ai + @ai-sdk/anthropic), jsPDF + jspdf-autotable + html-to-image
- **Database:** Neon (Postgres)
- **Data:** 1400+ startups, investors from CSV files, heatmap enrichment sidecar
- **Scale:** 296 TypeScript files, 44K+ lines, 341 commits, 104 routes (87 app routes + 17 static)
- **Current state:** v1.4 — M025 Enhanced AEO/SEO + M026 Performance Optimization complete
- **Hosting:** Vercel
- **Tiers:** Recon (free) → Analyst ($4,999 one-time) → Strategist (€18,999/yr) → Advisory (custom)
- **M005:** Filter onboarding, AI narrative engine (Claude Sonnet 4.5), company shortlist with amber highlights, custom report builder with PDF export
- **M006:** 4 heatmaps (Market Momentum, Industry Penetration, Customer Profile, IP Dependency) — delivered ad-hoc, superseded
- **M007:** All 26 charts theme-aware (light/dark via CSS custom properties), 7 heatmap drilldowns, fresh data sync
- **M008:** PDF renderer (tables/nested lists/code blocks), CSV parse cache, LLM token logging, zero build warnings
- **M025:** Dynamic OG images, JSON-LD schema coverage (CollectionPage, Product, DirectoryItemList, Dataset), 5 new blog posts (total 10)
- **M026:** Image optimization enabled (WebP/AVIF), CSV API caching (sub-50ms), admin users pagination, Geist fonts wired

## Constraints

- **Translations:** ES/IT/DE reviewed by native speakers; FR/PT pending review
- **Data privacy:** CSV data contains startup financial information — access controlled by tier
- **Brand names:** ThreadMoat, Digital Thread, Analyst, Strategist, Advisory, Recon must not be translated

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| next-intl for i18n | App Router native, cookie-based locale detection | ✓ Good |
| localePrefix: as-needed | English at /, no redirect to /en | ✓ Good |
| intlMiddleware outside auth() | Prevents rewrite→redirect on Vercel edge | ✓ Good |
| Forge→Analyst, Red Keep→Strategist | Business partners preferred professional tier names | ✓ Good |
| Analyst as one-time, Strategist as annual | Matches actual product offering — report vs subscription | ✓ Good |
| React Email + Resend | Official companion, JSX templates, Resend already in use | ✓ Good |
| Skip Asian languages | Different infrastructure requirements | — Pending |
| Add Portuguese | Brazil industrial market, 270M speakers | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone:**
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-03 after M008 completion (Production Polish & Performance)*
