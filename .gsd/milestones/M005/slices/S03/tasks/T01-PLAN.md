---
estimated_steps: 30
estimated_files: 3
skills_used: []
---

# T01: Create ShortlistContext, useShortlist hook, and wire provider into layout

## Description

Build the `ShortlistContext` and `useShortlist` hook that manages a persistent company shortlist with localStorage. Wire the `ShortlistProvider` into the dashboard provider hierarchy between `CompanyDataProvider` and `FilterProvider` in `layout-client.tsx`. The hook exposes `add(id)`, `remove(id)`, `toggle(id)`, `has(id)`, `clear()`, `count`, and `shortlistedCompanies` (resolved `Company[]`). Also extend `useThesisGatedData` to return a `shortlistedIds: Set<string>` so downstream charts can access it without importing the shortlist context directly.

## Steps

1. Create `contexts/shortlist-context.tsx` with:
   - `ShortlistProvider` component that uses `useCompanyData()` to resolve IDs
   - K001 SSR-safe localStorage pattern: state defaults to empty array, `useEffect` hydrates from localStorage key `threadmoat-shortlist`, `hydrated` boolean gates resolved company output
   - `useShortlist()` hook returning `{ add, remove, toggle, has, clear, count, ids, shortlistedCompanies, hydrated }`
   - `ids` is the raw `string[]` of company IDs; `shortlistedCompanies` resolves against current company data, silently dropping stale IDs
   - Memoize the `Set<string>` of IDs so reference-equality checks work for chart re-render optimization

2. Update `components/dashboard/layout-client.tsx`:
   - Import `ShortlistProvider` from `@/contexts/shortlist-context`
   - Insert `<ShortlistProvider>` between `<CompanyDataProvider>` and `<FilterProvider>` in the JSX tree
   - Provider hierarchy becomes: `PlanProvider > ScenarioProvider > CompanyDataProvider > ShortlistProvider > FilterProvider > LayoutInner`

3. Update `hooks/use-thesis-gated-data.ts`:
   - Import `useShortlist` from `@/contexts/shortlist-context`
   - Add `const { ids: shortlistIds } = useShortlist()` 
   - Compute `shortlistedIds: Set<string>` via `useMemo(() => new Set(shortlistIds), [shortlistIds])`
   - Return `shortlistedIds` from the hook so chart pages can pass it to chart components

## Must-Haves

- [ ] ShortlistContext created with add/remove/toggle/has/clear/count/ids/shortlistedCompanies/hydrated
- [ ] K001 SSR-safe localStorage pattern (default empty, hydrate in useEffect, hydrated flag)
- [ ] ShortlistProvider wired between CompanyDataProvider and FilterProvider in layout-client.tsx
- [ ] useThesisGatedData returns shortlistedIds Set<string>
- [ ] Stale IDs silently dropped when resolving shortlistedCompanies
- [ ] npm run build passes

## Verification

- `npm run build` passes with zero type errors
- `grep -q 'ShortlistProvider' components/dashboard/layout-client.tsx` confirms wiring
- `grep -q 'shortlistedIds' hooks/use-thesis-gated-data.ts` confirms hook extension
- `grep -q 'threadmoat-shortlist' contexts/shortlist-context.tsx` confirms localStorage key

## Inputs

- ``contexts/company-data-context.tsx` — useCompanyData() hook for resolving IDs to Company objects`
- ``contexts/filter-context.tsx` — reference implementation of context pattern to replicate`
- ``components/dashboard/layout-client.tsx` — provider hierarchy to modify`
- ``hooks/use-thesis-gated-data.ts` — data pipeline hook to extend`
- ``components/dashboard/filter-onboarding-guide.tsx` — K001 SSR-safe localStorage reference implementation`

## Expected Output

- ``contexts/shortlist-context.tsx` — new ShortlistContext, ShortlistProvider, useShortlist hook`
- ``components/dashboard/layout-client.tsx` — modified to include ShortlistProvider in hierarchy`
- ``hooks/use-thesis-gated-data.ts` — modified to return shortlistedIds Set<string>`

## Verification

npm run build && grep -q 'ShortlistProvider' components/dashboard/layout-client.tsx && grep -q 'shortlistedIds' hooks/use-thesis-gated-data.ts
