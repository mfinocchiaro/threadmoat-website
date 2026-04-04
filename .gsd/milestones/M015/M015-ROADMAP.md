# M015: Dashboard Performance Optimization — Red-Tier Pages

## Vision
Improve Lighthouse performance scores for the 3 red-tier dashboard pages identified in M014 (landscape/58, dashboard/64, investor-stats/67) through lazy-loading, deferred rendering, and component virtualization.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Lazy-load heavy charts on all 3 red-tier pages | medium | — | ✅ | All 3 pages load faster — skeleton shows first, then charts render. Lighthouse re-run shows 70+. |
