# M024 Execution Context

## Milestone Overview
**M024: Dashboard Filter Architecture: Collapsible Refinement, Reactivity, and Pinning**

Vision: Build a user-friendly filter system where sidebar filters define the hypothesis (initial selection) and collapsible top filters refine the results. Add guided onboarding showing the filter hierarchy, make filters actually affect graph data, and implement startup pinning for reference during exploration.

## Problem Statement
Current dashboard issues (reported by user):
1. Top filters don't collapse → waste screen real estate
2. Filters don't actually affect graph displays → confusing UX
3. No clear hierarchy between sidebar filters (hypothesis) and top filters (refinement)
4. Users need way to pin/bookmark startups for reference while exploring
5. No onboarding showing filter workflow

## Solution Structure (4 Slices)

### S01: Collapsible Top Filter Bar UI
**Risk:** Low
**Dependencies:** None
**Key Tasks:**
- T01: Create CollapsibleFilterBar component (2h)
- T02: Integrate into all 4 dashboards (1.5h)
- T03: Test localStorage persistence (1h)

**Success:** Filter bar collapses to icon button. State persists on reload.

---

### S02: Filter Hierarchy & Graph Reactivity
**Risk:** HIGH (critical path)
**Dependencies:** S01
**Key Tasks:**
- T01: Extend FilterContext with hierarchy (sidebarFilters vs topFilters) (2h)
- T02: Refactor all 4 dashboards to use getComposedFilters() (3h)
- T03: Add filter composition unit tests (1.5h)
- T04: Manual E2E testing across all scenarios (2h)

**Success:** Top filters visibly refine sidebar hypothesis. All 4 dashboards apply combined filters correctly.

**Critical Architecture Decision:**
- Sidebar filters = PRIMARY SELECTION (hypothesis)
- Top filters = REFINEMENT (narrow down results)
- Filter application: topFilters intersect with sidebarFilters results
- No duplicate filtering logic across dashboards

---

### S03: Onboarding Wizard: Filter Hierarchy Guidance
**Risk:** Low
**Dependencies:** S02
**Key Tasks:**
- T01: Create FilterHierarchyWizard component (4-step stepper) (3h)
- T02: Add wizard state to user preferences (1.5h)
- T03: Integrate wizard into dashboard flow (2h)
- T04: UX test with 3 personas (1.5h)

**Success:** New users see wizard on first load. Clear visual distinction between sidebar and top filters. Wizard can be re-shown from settings.

---

### S04: Startup Pinning & Breadcrumb Trail
**Risk:** Medium
**Dependencies:** S01
**Key Tasks:**
- T01: Create PinnedStartupsContext (2h)
- T02: Add PinButton to all startup references (2h)
- T03: Create PinnedBreadcrumb component (1.5h)
- T04: Integrate breadcrumb into dashboard layout (1h)
- T05: Manual pin/unpin testing across dashboards (1.5h)

**Success:** Pin buttons on all startup names. Pinned list persists as breadcrumb bar (max 10). Clicking breadcrumb navigates to profile.

---

## Execution Order
1. **S01 first** → UI foundation (collapsible component)
2. **S02 next** → Makes filters actually work (critical)
3. **S03 then** → Onboarding to explain the system
4. **S04 parallel with S03** → Pin feature (independent from hierarchy)

## Current Codebase Context

### Key Files to Reference
- `components/dashboard/dashboard-client.tsx` — Main dashboard wrapper
- `contexts/filter-context.tsx` — Current filter implementation (will need extension)
- `contexts/thesis-context.tsx` — Hypothesis/thesis logic
- `components/dashboards/startup-dashboard.tsx` — Example dashboard (4 total: startup, vc, oem, isv)
- `components/dashboard/sidebar.tsx` — Left sidebar with filters

### Current Filter State
- Filter context currently has: `filterCompany(company) -> boolean`
- Sidebar creates thesis (e.g., founder-focused view)
- Top filters exist but don't visibly affect graphs
- No clear precedence between sidebar and top filters

### Database & Persistence
- User profiles have `profile_type`, `is_admin`
- Need to extend with `wizardCompletedAt` timestamp for S03
- Pins can be stored in localStorage (free) or DB (paid)

---

## Success Criteria (Milestone-level)
- [x] All 4 slices fully planned (T-shirt estimated)
- [ ] S01: Filter collapses/expands with state persistence
- [ ] S02: Sidebar + top filters combine; all 4 dashboards tested
- [ ] S03: Wizard shows on first load; can be re-shown
- [ ] S04: Pin/unpin works; breadcrumb persists
- [ ] NO regressions in any of 4 dashboard scenarios

---

## Auto-Mode Execution Prompt

**For running M024 in autonomous mode:**

```
Start M024 auto mode from S01. Execute each slice sequentially:
1. Execute S01 (collapsible UI)
2. Execute S02 (filter hierarchy & reactivity) — CRITICAL PATH
3. Execute S03 (wizard) — dependent on S02
4. Execute S04 (pinning) — can run parallel with S03

For each slice:
- Read the slice PLAN.md
- Execute all tasks in order
- Run verification steps
- Commit with descriptive message
- Only proceed to next slice after current slice passes verification

On blocker: Escalate with options and recommendation. Do not skip.
On completion: Record slice completion summary and advance.
After all 4 slices: Run full E2E verification across all 4 dashboards (startup, vc, oem, isv).
```

---

## Notes for Next Session

- M024 milestone is complete with full task breakdown
- All planning artifacts committed to `.gsd/milestones/M024/`
- Ready for execution in auto mode
- S02 is the critical path — filter reactivity must work correctly
- All 4 dashboards (startup, vc, oem, isv) must be tested to prevent regressions
- User emphasized: **filters must actually affect graphs** (was not working before)

---

**Generated:** 2026-05-03
**Status:** Ready for Execution
**Estimated Total:** ~27 hours (S01: 4.5h, S02: 8.5h, S03: 8h, S04: 7.5h)
