---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T04: Newsletter Capture Component via Resend

Create a newsletter signup component (email input + submit) with Zod validation and Resend integration. Build /api/newsletter/subscribe endpoint that adds emails to a Resend audience or stores in Neon DB. Place the component on homepage (above footer) and blog index page. Include success/error toast feedback.

## Inputs

- `lib/email.ts Resend setup`
- `Existing toast/sonner patterns`
- `Neon DB connection in lib/db.ts`

## Expected Output

- `Newsletter signup component`
- `API endpoint for subscription`
- `DB table or Resend audience for storing subscribers`
- `Component placed on homepage and blog`

## Verification

Newsletter form renders on homepage and blog. Submitting a valid email calls the API and shows success toast. Invalid email shows validation error. Build succeeds.
