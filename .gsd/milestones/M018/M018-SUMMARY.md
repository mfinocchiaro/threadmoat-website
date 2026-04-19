---
id: M018
title: "Company Profiles, Scenario Narratives & Guided Journey"
status: complete
completed_at: 2026-04-11T21:28:48.687Z
key_decisions:
  - Client-side fuzzy matching (string.includes) instead of fuse.js — sufficient for 599 companies, no added dependency
  - Profile-aware AI narrative with 5 user type mappings that reorder justification sections
  - Narrative content hardcoded in TypeScript for instant rendering — no API dependency
  - VizPageShell injection for zero-touch chart annotation coverage
  - SSR-safe localStorage with hydration gate for journey progress
  - S02 and S03 descoped to future monetization milestone
key_files:
  - components/dashboard/filter-toolbar.tsx
  - app/dashboard/company/[id]/page.tsx
  - lib/scenario-narratives.ts
  - components/dashboard/scenario-narrative.tsx
  - components/dashboard/chart-annotation.tsx
  - hooks/use-journey-progress.ts
  - components/dashboard/viz-page-shell.tsx
lessons_learned:
  - VizPageShell is an effective injection point for cross-cutting chart page features — use it for future per-chart additions
  - Profile-aware content ordering (PROFILE_NARRATIVE_MAP pattern) is reusable for other views that should adapt to user type
  - Descoping subscription features from a UX milestone kept the scope clean — monetization logic deserves its own focused milestone
---

# M018: Company Profiles, Scenario Narratives & Guided Journey

**Shipped company search with profiles and a scenario-aware narrative guidance system with per-chart annotations and journey progress tracking.**

## What Happened

M018 delivered two major features to ThreadMoat: (1) Company Search & Profile — an inline search bar in the filter toolbar with fuzzy type-ahead across 599 companies, and a tabbed company profile page showing overview metrics, financials, investors, and profile-aware AI narratives; (2) Scenario-Aware Narrative Thread — a structured guidance system for 4 analytical scenarios with dashboard landing narratives, per-chart annotations injected via VizPageShell, journey progress tracking in localStorage, and next-step navigation. Two planned slices (Free Preview Tier and Plan Transition Polish) were descoped during roadmap reassessment as subscription/monetization features better suited to a dedicated future milestone. Both delivered features are deployed to production on ThreadMoat.com.

## Success Criteria Results

Delivered: company search with fuzzy type-ahead, company profile with 4 tabs, scenario narratives for all 4 focus scenarios, per-chart annotations, guided journey with progress tracking. Descoped: free preview tier gating (S02), subscription transition logic (S03). Build passes with zero errors.

## Definition of Done Results

- [x] Company search bar with fuzzy type-ahead works from any dashboard page\n- [x] Company profile shows curated sections with correct data for all field groups\n- [~] Free Recon users see exactly top 50 companies — DESCOPED\n- [~] Upgrade CTAs shown on gated content — DESCOPED\n- [~] Strategist→Analyst fallback works — DESCOPED\n- [~] Pricing page updated with permanent free tier messaging — DESCOPED\n- [x] Each of the 4 scenarios has intro narrative + per-chart annotations + next-chart guidance\n- [x] Build passes with zero errors

## Requirement Outcomes

R022 (Company search & profile): Advanced. R025 (Scenario-aware narrative thread): Advanced. R023 (Free preview tier): Deferred. R024 (Plan transitions): Deferred.

## Deviations

S02 (Free Preview Tier) and S03 (Plan Transition Polish) were descoped. These subscription/tier-gating features are deferred to a future monetization-focused milestone. M018 delivered its core value: making ThreadMoat a reference tool with guided analytical narratives.

## Follow-ups

R023 (Free preview tier) and R024 (Plan transitions) remain active requirements. They should be addressed in a future milestone focused on monetization: tier gating, subscription fallback logic, pricing page updates, and upgrade CTAs.
