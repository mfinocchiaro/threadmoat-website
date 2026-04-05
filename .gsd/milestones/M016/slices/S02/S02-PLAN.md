# S02: Sidebar chart reorganization

**Goal:** Reorganize sidebar chart groups based on review feedback: create a new analyst-level 'Data Views' category for general-purpose charts, move candlestick to advanced, trim financial tab.
**Demo:** After this: Slope/chord/wordcloud in analyst-level category, candlestick in advanced, financial tab trimmed

## Tasks
- [x] **T01: Reorganized sidebar: new Data Views group (analyst-level), trimmed Financial, moved candlestick to advanced, updated tier paths.** — 1. In sidebar.tsx:
   - Trim Financial to: bar-chart, patterns
   - Move timeline, spiral to Market Maps
   - Move marimekko, sankey to a new 'Data Views' group (analyst level)
   - Move slope, chord, wordcloud to 'Data Views'
   - Move candlestick from ADMIN_ITEMS to Advanced group
   - Remove candlestick from ADMIN_VIZ_HREFS
2. In tiers.ts:
   - Add slope, chord, wordcloud to ANALYST_PATHS (they were STRATEGIST_ONLY)
   - Move candlestick from ADMIN_PATHS to STRATEGIST_ONLY_PATHS
   - Add marimekko, sankey to ANALYST_PATHS if appropriate
3. Build and verify
  - Estimate: 20min
  - Files: components/dashboard/sidebar.tsx, lib/tiers.ts
  - Verify: Build passes. Grep tier paths for moved charts.
