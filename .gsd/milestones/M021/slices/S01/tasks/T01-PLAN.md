---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T01: Disambiguate unverified login error with resend CTA

When an unverified user tries to log in, return a distinct error code from the credentials provider and show a user-friendly message with a link to resend verification email

## Inputs

- `auth.ts credentials provider`
- `login page error handling`

## Expected Output

- `Distinct error code for unverified accounts`
- `Login page shows resend-verification CTA when appropriate`

## Verification

Attempt login with unverified account — see distinct error message with resend link
