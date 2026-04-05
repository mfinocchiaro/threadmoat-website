---
estimated_steps: 12
estimated_files: 2
skills_used: []
---

# T01: Reorganize sidebar groups and update tier paths

1. In sidebar.tsx:
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

## Inputs

- `Site review feedback`
- `Current sidebar structure`

## Expected Output

- `sidebar.tsx modified`
- `tiers.ts modified`

## Verification

Build passes. Grep tier paths for moved charts.
