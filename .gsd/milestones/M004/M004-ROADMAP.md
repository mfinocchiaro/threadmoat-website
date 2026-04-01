# M004: 

## Vision
Close all verification gaps from M001-M003: execute every UAT item, test the Stripe coupon end-to-end, get French translation sign-off, and confirm the Airtable full DB sync works in production.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Complete UAT Execution | medium | — | ✅ | All 56 UAT items verified with pass/fail evidence. UAT markdown files updated with checked boxes. |
| S02 | Stripe Upgrade Coupon End-to-End Test | medium | — | ✅ | Stripe checkout page shows $4,999 discount for an analyst user upgrading to strategist. |
| S03 | French Translation Sign-Off | low | — | ✅ | Michael confirms French translations are natural B2B language, or corrections applied. |
| S04 | Airtable Full DB Sync Confirmation | low | — | ✅ | GitHub Action log shows successful sync from Full DB View with 600 records. Production site renders all companies. |
