# Knowledge

Lessons learned, recurring patterns, and rules that future agents should follow.

---

## K001 — SSR-safe localStorage in Next.js client components

**Context:** M005/S01 FilterOnboardingGuide component
**Pattern:** Default state to the "hidden/dismissed" value, then hydrate from localStorage in a `useEffect`. This avoids hydration mismatches since `localStorage` is not available during SSR. Use a separate `hydrated` boolean to gate rendering so the component doesn't flash.

```tsx
const [dismissed, setDismissed] = React.useState(true) // default hidden
const [hydrated, setHydrated] = React.useState(false)
React.useEffect(() => {
  const stored = localStorage.getItem(KEY)
  if (stored !== "true") setDismissed(false)
  setHydrated(true)
}, [])
if (dismissed || !hydrated) return null
```

**Why it matters:** Several dashboard components may need localStorage persistence (preferences, dismissed states, shortlist). This pattern prevents the common "content flash" or React hydration error.

---

## K002 — @ai-sdk/react useCompletion: isLoading not status

**Context:** M005/S02 AI narrative integration
**Pattern:** The installed `@ai-sdk/react@3.0.x` `useCompletion` hook returns `isLoading: boolean`, not `status: string`. The `status` enum (`submitted | streaming | ready | error`) exists only in `useChat`, not `useCompletion`. Context7 docs may reference a newer version's API — always verify against the installed `node_modules/@ai-sdk/react/dist/index.d.ts` types.

**Also:** When the server uses `toTextStreamResponse()`, the client must set `streamProtocol: 'text'` in the `useCompletion` options. The default `'data'` protocol expects a different stream format and will fail silently.

**Why it matters:** Type errors caught at build time, but the streamProtocol mismatch causes silent runtime failures (empty completion, no error).
