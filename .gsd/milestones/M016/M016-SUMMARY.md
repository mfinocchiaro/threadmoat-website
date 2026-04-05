---
id: M016
title: "Site Review Fixes — Pricing, Translations, Sidebar & UX Polish"
status: complete
completed_at: 2026-04-05T14:01:14.007Z
key_decisions:
  - New Data Views sidebar group at analyst tier
  - 5 charts promoted from strategist to analyst access
  - Candlestick demoted from admin to strategist
  - Collapsible details for chart interpretation
  - Pathname-based filter hiding
key_files:
  - messages/*/pricing.json
  - messages/*/report.json
  - messages/fr/home.json
  - app/[locale]/report/page.tsx
  - components/dashboard/sidebar.tsx
  - lib/tiers.ts
  - components/dashboard/sidebar-shell.tsx
  - app/dashboard/heatmap/page.tsx
  - app/dashboard/parallel/page.tsx
  - app/dashboard/box-plot/page.tsx
  - app/dashboard/distribution/page.tsx
  - app/dashboard/splom/page.tsx
lessons_learned:
  - Systematic site review tool is effective for catching content/UX issues
  - Collapsible details pattern keeps complex explanations available without cluttering the UI
---

# M016: Site Review Fixes — Pricing, Translations, Sidebar & UX Polish

**Addressed 22 site review issues: fixed Analyst pricing (1 report) in 6 languages, added Q1/Q2 report timing, fixed French translation, reorganized sidebar with new Data Views group, added chart interpretation guides, hid filters on settings.**

## What Happened

M016 processed all feedback from the systematic site review. S01 fixed the Analyst tier copy to say 'one quarterly report' across all 6 languages, added Q1 2026 / Q2 July edition timing to the report page in 6 languages, and corrected the French thesis title from 'fossé' to 'avantage'. S02 reorganized the sidebar — created a new analyst-level 'Data Views' group (slope, chord, wordcloud, marimekko, sankey), trimmed Financial to core charts (bar, treemap, patterns), moved timeline/spiral to Market Maps, and moved candlestick from admin-only to strategist-level advanced. Updated all tier access paths in tiers.ts. S03 added collapsible 'How to read this chart' interpretation guides to 5 advanced charts and hid the filter toolbar on the settings page.

## Success Criteria Results

All 7 criteria passed.

## Definition of Done Results

20/22 review issues fixed. 1 was a misunderstanding (translations already exist). 1 deferred (landscape-intro star — shortlist is company-level).

## Requirement Outcomes

No formal requirements affected.

## Deviations

None.

## Follow-ups

None.
