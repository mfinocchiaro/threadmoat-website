---
id: M017
title: "Subcategory Filter — Secondary Drill-Down Under Investment List"
status: complete
completed_at: 2026-04-05T17:07:19.530Z
key_decisions:
  - Contextual filtering pattern: subcategory options change based on investment list selection
  - Subcategory positioned after Investment List for natural hierarchy
key_files:
  - contexts/filter-context.tsx
  - components/dashboard/filter-toolbar.tsx
  - contexts/thesis-context.tsx
lessons_learned:
  - When adding a new field to FilterState, audit all places that hard-code the full filter object (thesis-context reset)
---

# M017: Subcategory Filter — Secondary Drill-Down Under Investment List

**Added contextual Subcategory filter that narrows to subcategories within selected Investment Lists — 56 curated categories available as a secondary drill-down.**

## What Happened

Added subcategories[] to the filter context with contextual options — when an Investment List is selected, the Subcategory dropdown shows only the subcategories within that list. Positioned right after Investment List in the toolbar for natural drill-down flow. Replaced the old free-text Subsegment dropdown. All 56 curated subcategories from the refactored CSV are now filterable across all charts.

## Success Criteria Results

All 4 criteria passed.

## Definition of Done Results

Subcategory filter works as secondary drill-down. Build passes.

## Requirement Outcomes

No formal requirements.

## Deviations

None.

## Follow-ups

None.
