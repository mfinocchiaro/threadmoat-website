# S03: Onboarding Wizard: Filter Hierarchy Guidance

**Goal:** Guide new users through filter workflow on first visit: sidebar (hypothesis) → top filters (refinement)
**Demo:** First-time user sees step-by-step wizard: (1) Set hypothesis in sidebar, (2) See results, (3) Use top filters to narrow, (4) Pin results for comparison

## Must-Haves

- Wizard appears once on first dashboard load. Clear visual indicators for sidebar vs top filters. 'Dismiss' or 'Skip' option available. Wizard can be re-shown from settings.

## Proof Level

- This slice proves: Manual UX testing with new user personas + analytics on wizard completion rates

## Integration Closure

Wizard uses existing components; no new data model. Dismissal state stored in user preferences.

## Verification

- Track: 'wizard.shown', 'wizard.dismissed', 'wizard.completed' with user access tier

## Tasks

- [ ] **T01: Create FilterHierarchyWizard component** `est:3h`
  New modal/stepper wizard with 4 steps: (1) Explain sidebar filters set hypothesis, (2) Show example results, (3) Introduce top filters for refinement, (4) Show pinning feature. Each step highlights relevant UI with visual indicators. Include 'Skip' and 'Got it' buttons.
  - Files: `components/dashboard/filter-hierarchy-wizard.tsx`
  - Verify: Wizard renders with all 4 steps. Navigation between steps works. Skip/complete buttons functional. Visual design matches dashboard theme.

- [ ] **T02: Add wizard state to user preferences** `est:1.5h`
  Extend user profile schema to track 'wizardCompletedAt' timestamp. Add API endpoint to mark wizard as dismissed. Update preferences context to expose wizard state.
  - Files: `lib/schema.ts`, `lib/api-client.ts`, `contexts/preferences-context.tsx`
  - Verify: User profile has wizardCompletedAt field. API call correctly updates field. Preferences context exposes wizard state.

- [ ] **T03: Integrate wizard into dashboard flow** `est:2h`
  Show wizard on first dashboard load if wizardCompletedAt is null. Add setting in profile/settings to re-show wizard. Ensure wizard doesn't block dashboard interaction.
  - Files: `components/dashboard/dashboard-client.tsx`, `app/dashboard/settings/page.tsx`
  - Verify: New users see wizard on first load. Wizard dismisses properly. Re-show option works in settings. Wizard doesn't break existing dashboard.

- [ ] **T04: Manual UX testing with new user personas** `est:1.5h`
  Test with 3 personas: (1) Technical founder, (2) Non-technical VC, (3) Enterprise procurement. Record time to complete wizard, understand hierarchy, apply filters. Gather feedback on clarity.
  - Verify: All 3 personas understand sidebar vs top filter distinction. Average completion time < 3 minutes. Feedback documented.

## Files Likely Touched

- components/dashboard/filter-hierarchy-wizard.tsx
- lib/schema.ts
- lib/api-client.ts
- contexts/preferences-context.tsx
- components/dashboard/dashboard-client.tsx
- app/dashboard/settings/page.tsx
