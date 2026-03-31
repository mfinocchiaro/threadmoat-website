# S04 Replan

**Milestone:** M003
**Slice:** S04
**Blocker Task:** T01
**Created:** 2026-03-31T08:07:18.626Z

## Blocker Description

Airtable sync (GitHub Actions hourly cron) is pushing a 3-row stub CSV from the 'Software-only ThreadMoat' Airtable view, overwriting the full 1585-company dataset in production. Charts show 'No data' or minimal data.

## What Changed

Added T02 to fix the Airtable sync safety guard. T01 (UAT execution) completed but discovered the sync blocker.
