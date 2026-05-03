---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T03: Integrate wizard into dashboard flow

Show wizard on first dashboard load if wizardCompletedAt is null. Add setting in profile/settings to re-show wizard. Ensure wizard doesn't block dashboard interaction.

## Inputs

- `components/dashboard/filter-hierarchy-wizard.tsx`
- `contexts/preferences-context.tsx`

## Expected Output

- `Updated dashboard and settings files`

## Verification

New users see wizard on first load. Wizard dismisses properly. Re-show option works in settings. Wizard doesn't break existing dashboard.
