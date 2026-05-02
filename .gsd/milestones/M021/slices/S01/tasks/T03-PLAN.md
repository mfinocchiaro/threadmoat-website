---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T03: Sign out user on account deletion

After account deletion, clear the session cookie so the deleted user cannot make authenticated calls for the remaining JWT lifetime

## Inputs

- `deleteAccount action`
- `delete-account-button component`

## Expected Output

- `Client-side signout after deletion`
- `Clean redirect to homepage`

## Verification

Delete account → immediately redirected to home, no authenticated API calls possible
