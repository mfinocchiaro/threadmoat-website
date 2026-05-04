# M024: Dashboard Filter Architecture: Collapsible Refinement, Reactivity, and Pinning

**Vision:** Build a user-friendly filter system where sidebar filters define the hypothesis (initial selection) and collapsible top filters refine the results. Add guided onboarding showing the filter hierarchy, make filters actually affect graph data, and implement startup pinning for reference during exploration.

## Success Criteria

- Filter UI collapses/expands and state persists
- Sidebar filters + top filters combine correctly; graphs update reactively
- New users see onboarding wizard on first dashboard load
- Startup pinning works across all dashboard views with persistent breadcrumb trail
- No filter regression in any of 4 dashboard scenarios

## Slices

- [ ] **S01: Collapsible Top Filter Bar UI** `risk:UI state management; must persist collapse state across navigation` `depends:[]`
  > After this: Click filter button to expand/collapse top filters; state persists on page reload

- [ ] **S02: Filter Hierarchy & Graph Reactivity** `risk:High - requires refactoring filter application logic; must test across all 4 dashboards` `depends:[S01]`
  > After this: Create hypothesis in sidebar (e.g., 'Series B+ in AI'). Graphs show matches. Use top filter (e.g., 'US only'). Graphs update to show intersected results.

- [ ] **S03: Onboarding Wizard: Filter Hierarchy Guidance** `risk:Low - additive feature; wizard can be skipped` `depends:[S02]`
  > After this: First-time user sees step-by-step wizard: (1) Set hypothesis in sidebar, (2) See results, (3) Use top filters to narrow, (4) Pin results for comparison

- [ ] **S04: S04** `risk:Medium - UI pattern unfamiliar; needs careful UX design` `depends:[]`
  > After this: Hover over startup name → 'Pin' button appears. Click to add to pinned list. Pinned list appears as persistent breadcrumb bar at top. Click breadcrumb to jump to that startup's profile.

## Boundary Map

Not provided.
