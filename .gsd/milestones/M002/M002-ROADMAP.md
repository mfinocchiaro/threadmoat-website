# M002: 

## Vision
Fix the broken sign-up flow, remove deprecated code, surface unused pipeline data in charts, and visually verify every dashboard chart renders correctly with filtered data.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Fix Sign-Up & Onboarding Flow | high | — | ✅ | A new test user completes sign-up, receives verification email, verifies, logs in, and sees the onboarding wizard without errors. |
| S02 | Deprecated Code Cleanup | low | — | ✅ | viz-filter-bar.tsx deleted, explore page works, build passes with zero deprecated filter references. |
| S03 | Surface Pipeline Data in Charts | medium | S02 | ✅ | Charts display valuationConfidence badges, reported valuations, and valuation years in tooltips or legends. |
| S04 | Full Dashboard Chart Verification | low | S01, S02, S03 | ✅ | Screenshot evidence of every chart page rendering correctly with data, responding to filters. |
