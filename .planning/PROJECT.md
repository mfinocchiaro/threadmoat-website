# ThreadMoat Website

## What This Is

A B2B SaaS website for industrial AI and engineering software market intelligence. Public marketing pages convert visitors into paid dashboard subscribers who access 44+ interactive data visualizations covering 500+ startups across the PLM, CAD, CAE, and industrial AI landscape. Supports 6 languages (English, French, Spanish, Italian, German, Portuguese).

## Core Value

Converting visitors into paying dashboard subscribers through compelling market intelligence content and frictionless checkout.

## Requirements

### Validated

- ✓ Public marketing pages (home, pricing, about, report) — Phase 14
- ✓ Email/password authentication with verification and password reset — existing
- ✓ 44+ dashboard visualization pages (charts, maps, radar, treemap, SWOT, etc.) — existing
- ✓ Stripe sandbox integration with subscription tiers — existing
- ✓ i18n for 5 languages (en, fr, es, it, de) with language switcher — Phase 14
- ✓ CSV-driven startup and investor data pipeline — existing
- ✓ Role-based access control (free tier, paid tiers, friends access) — existing

### Active

- [ ] Production Stripe integration (live keys, real payments)
- [ ] Portuguese (pt) language support with flag emoji in language switcher
- [ ] Flag emoji next to all language names in LanguageSwitcher (🇺🇸🇬🇧, 🇫🇷, 🇪🇸, 🇮🇹, 🇩🇪, 🇧🇷🇵🇹)
- [ ] Production content polish (copy, SEO, meta tags, OG images)
- [ ] Stripe checkout dry run with production keys
- [ ] Subscription lifecycle (upgrade, downgrade, cancel, billing portal)
- [ ] Onboarding flow for new subscribers
- [ ] Email transactional polish (welcome, receipt, trial expiry)

### Out of Scope

- Asian language variants (Japanese, Chinese) — different SEO, payment rails, regulatory complexity; separate project
- Mobile app — web-first, responsive design sufficient
- Real-time data feeds — CSV-based pipeline sufficient for current scale
- Report generator tool — separate GSD project
- Agent updater tool — separate GSD project
- Dashboard content translation — deferred, English-only dashboard is acceptable for B2B

## Context

- **Tech stack:** Next.js 15, NextAuth, Stripe, Resend, D3, Recharts, Tailwind CSS, shadcn/ui, next-intl
- **Database:** Neon (Postgres) via Drizzle ORM
- **Data:** 500+ startups, investors from CSV files, market reports
- **Scale:** 263 TypeScript files, 37K lines, 241 commits
- **Current state:** Stripe in sandbox mode, site not yet live with real payments
- **Hosting:** Vercel (inferred from Next.js)
- **Existing i18n:** 5 languages with LanguageSwitcher globe dropdown, cookie persistence, locale-prefixed URLs

## Constraints

- **Stripe:** Must complete live mode onboarding and test with production keys before launch
- **Translations:** Draft quality from Claude — professional review recommended before launch for customer-facing content
- **Data privacy:** CSV data contains startup financial information — ensure proper access control
- **Brand names:** ThreadMoat, Digital Thread, Recon, Forge, Red Keep must never be translated

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| next-intl for i18n | App Router native, cookie-based locale detection, no redirect for default locale | ✓ Good |
| localePrefix: as-needed | English visitors see / not /en, cleaner URLs | ✓ Good |
| Skip Asian languages | Different infrastructure requirements, low ROI for initial launch | — Pending |
| Add Portuguese | Brazil has growing industrial sector, 270M speakers, minimal effort to add | — Pending |
| Both US+UK flags for English | Neutral representation for international English content | — Pending |
| Stripe for payments | Industry standard, good developer experience, handles subscriptions | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-22 after initialization*
