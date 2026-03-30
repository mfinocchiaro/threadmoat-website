---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T03: Verify full onboarding pipeline end-to-end

Test the complete flow: sign-up → verification email → verify-email page → login → dashboard → onboarding wizard. Verify each step works. Check edge cases: duplicate email, invalid invite code, expired token.

## Inputs

- `T02 fixes applied`

## Expected Output

- `Verification evidence of complete flow`

## Verification

Full flow verified in browser. No console errors. Onboarding wizard displays for new users.
