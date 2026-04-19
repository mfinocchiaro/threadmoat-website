---
id: M019
title: "Monetization & Free Tier — Server-Side Company Filtering & Upgrade CTAs"
status: complete
completed_at: 2026-04-19T14:03:44.775Z
key_decisions:
  - Keep 30-day trial model for Recon/Explorer tier — do not convert to permanent free
  - Explorer: 50 companies, Analyst: 100, Strategist/Admin: unlimited
  - Use weighted-score ranking for server-side filtering (top companies shown first)
  - Skip S02 entirely — no tier fallback or expiry banner work needed
key_files:
  - lib/tiers.ts
  - app/api/companies/route.ts
  - lib/company-data.ts
  - contexts/company-data-context.tsx
  - components/dashboard/company-limit-banner.tsx
  - components/dashboard/layout-client.tsx
lessons_learned:
  - Always confirm scope with user before planning tasks — T01/T04 were assumptions about the trial model that didn't match user intent
  - Tactical milestones scoped during conversation should still get formal requirement IDs registered upfront
---

# M019: Monetization & Free Tier — Server-Side Company Filtering & Upgrade CTAs

**Server-side company filtering by tier (Explorer: 50, Analyst: 100) with weighted-score ranking and CompanyLimitBanner upgrade CTAs to protect competitive data.**

## What Happened

M019 addressed data protection for the tiered access model. The core problem: the /api/companies endpoint returned the full 500+ company dataset to every authenticated user regardless of tier, making it trivial to scrape.

S01 shipped server-side filtering (commit 9a60395) — Explorer users see top 50 companies, Analyst users see top 100, both ranked by weighted score. Strategist and Admin tiers get the full dataset. A CompanyLimitBanner component shows limited-tier users how many companies they're seeing vs the total available, with tier-appropriate upgrade CTAs.

S02 (Plan Transitions — tier fallback, expiry banners) was skipped after the user confirmed the 30-day trial model should stay as-is. Two originally planned tasks (T01: Convert Recon from trial to permanent, T04: Remove trial expiry UI) were removed during replan as they conflicted with the user's intent to keep the trial model.

The milestone was replanned mid-execution to match user direction — delivering exactly the two features requested (server-side filtering + banner) and nothing more.

## Success Criteria Results



## Definition of Done Results



## Requirement Outcomes



## Deviations

Original plan had 4 tasks across 2 slices. Replanned to 2 tasks in 1 slice after user feedback — T01/T04 removed, S02 skipped.

## Follow-ups

No immediate follow-ups identified. Future consideration: if trial-to-paid conversion is low, revisit whether Explorer tier limits need adjustment.
