# S02: Chart interaction event tracking

**Goal:** Add interaction event tracking at 4 key points: shortlist toggle, filter changes, AI narrative generation, and report export — reusing the S01 analytics infrastructure.
**Demo:** After this: Filter applied, shortlist toggle, and AI narrative generation events logged with context

## Tasks
- [x] **T01: Created trackInteraction() client-side helper for fire-and-forget event submission.** — 1. Create `lib/track-interaction.ts` (client-side helper)
2. Export `trackInteraction(eventType: string, metadata?: Record<string, unknown>)` that:
   - Calls `fetch('/api/analytics/event', { method: 'POST', body: JSON.stringify({ event_type: eventType, route: window.location.pathname, metadata }), keepalive: true, headers: { 'Content-Type': 'application/json' } })`
   - Fire-and-forget with `.catch(() => {})` 
   - No 'use client' directive needed — it uses browser APIs but is just a utility function imported by client components
  - Estimate: 5min
  - Files: lib/track-interaction.ts
  - Verify: Build passes.
- [x] **T02: Instrumented 4 interaction points: shortlist toggle, filter change, AI narrative generation, and report generate/export PDF.** — 1. **Shortlist toggle** (`contexts/shortlist-context.tsx`): In the `toggle` callback, after the state update, call `trackInteraction('shortlist_toggle', { companyId: id, action: prev.includes(id) ? 'remove' : 'add' })`
2. **Filter changes** (`contexts/filter-context.tsx`): Add an effect that watches `activeFilterCount` and fires `trackInteraction('filter_change', { activeFilterCount })` when it changes (debounced — skip the initial zero)
3. **AI narrative** (`components/charts/report-generator.tsx`): After the `complete()` call (line ~482), call `trackInteraction('narrative_generate', { companyId: selectedCompany.id })`
4. **Report export** (`components/charts/custom-report-tab.tsx`): At the top of `handleGenerate` and `handleExportPDF`, call `trackInteraction('report_generate', { companyCount: selectedCompanies.length })` and `trackInteraction('report_export_pdf', { companyCount: selectedCompanies.length })`
5. Verify build passes
  - Estimate: 20min
  - Files: contexts/shortlist-context.tsx, contexts/filter-context.tsx, components/charts/report-generator.tsx, components/charts/custom-report-tab.tsx
  - Verify: npx next build passes with zero errors.
