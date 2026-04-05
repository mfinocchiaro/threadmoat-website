---
id: T01
parent: S02
milestone: M016
key_files:
  - components/dashboard/sidebar.tsx
  - lib/tiers.ts
key_decisions:
  - New 'Data Views' group for general-purpose analyst charts
  - slope/chord/wordcloud/marimekko/sankey promoted from strategist to analyst tier
  - candlestick demoted from admin-only to strategist-level advanced
duration: 
verification_result: passed
completed_at: 2026-04-05T13:56:18.142Z
blocker_discovered: false
---

# T01: Reorganized sidebar: new Data Views group (analyst-level), trimmed Financial, moved candlestick to advanced, updated tier paths.

**Reorganized sidebar: new Data Views group (analyst-level), trimmed Financial, moved candlestick to advanced, updated tier paths.**

## What Happened

Reorganized sidebar chart groups:\n- Financial trimmed to bar-chart, treemap, patterns\n- Timeline and spiral moved to Market Maps\n- New 'Data Views' group created with slope, chord, wordcloud, marimekko, sankey\n- Candlestick moved from Admin to Advanced group\n- Updated tiers.ts: slope/chord/wordcloud/marimekko/sankey moved from STRATEGIST_ONLY to ANALYST_PATHS, candlestick moved from ADMIN_PATHS to STRATEGIST_ONLY_PATHS\n- Removed candlestick from ADMIN_ITEMS and ADMIN_VIZ_HREFS

## Verification

Build passes. Tier paths verified via grep.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx next build` | 0 | ✅ pass | 23200ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `components/dashboard/sidebar.tsx`
- `lib/tiers.ts`
