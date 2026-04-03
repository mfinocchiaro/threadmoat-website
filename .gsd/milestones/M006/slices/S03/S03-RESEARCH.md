# S03 — Target Customer Profile Heatmap — Research

**Date:** 2026-04-01

## Summary

The Target Customer Profile heatmap profiles each startup's typical target customer across four dimensions: **company size** (Small/Medium/Large via `startupSizeCategory`), **industry** (via `industriesServed`), **geography** (via `country`), and **supply chain role** (via `buyerPersona`). All required data already exists in the `Company` interface — no new data enrichment or CSV changes needed.

The implementation follows the exact D3 heatmap pattern established by S01 (market-momentum-heatmap.tsx) and S02 (industry-penetration-chart.tsx): a `"use client"` component using D3 band scales, `interpolateYlOrRd` or similar color scale, shortlist highlighting, CSS custom property theming, and tooltips via `fixed`-positioned divs. The page shell (`VizPageShell` + `useThesisGatedData`) and sidebar registration (ADMIN_ITEMS) are identical to S01/S02.

The novel aspect of this heatmap is the **multi-dimensional profile**: the X axis shows one customer dimension (e.g., buyer persona or customer size) and the Y axis shows another (e.g., industry served or workflow segment), with a configurable value mode for cell intensity (startup count, avg weighted score, avg funding, or customer count). Both axes should be selectable via dropdowns. This is a modest extension of the industry-penetration chart pattern, which already has selectable Y axis and value mode.

## Recommendation

Build a single `TargetCustomerProfileChart` component following the industry-penetration-chart pattern closely. Use two axis selectors (X and Y) plus a value mode selector. The X axis dimensions are the "customer profile" dimensions: `buyerPersona`, `startupSizeCategory`, `country` (geo-region), and `deploymentModel`. The Y axis dimensions reuse the standard groupings: `industriesServed`, `investmentTheses`, `workflowSegment`, `manufacturingType`. Value modes mirror S02: count, avg score, avg funding, customer count.

For country, collapse the 43 unique values into ~8 geographic regions (North America, DACH, UK/Ireland, France, Nordics, Southern Europe, Israel, Rest of World) to keep the heatmap readable. Parse the flag emoji + country name format.

## Implementation Landscape

### Key Files

- `components/charts/industry-penetration-chart.tsx` — **primary template to clone from**. Has dual dropdown selectors (Y axis + value mode), `CellData` interface, D3 heatmap rendering with band scales, shortlist highlighting, tooltip, legend, and insight bar. ~280 lines.
- `components/charts/market-momentum-heatmap.tsx` — secondary reference for composite scoring and `compositeScore()` function pattern.
- `app/dashboard/industry-penetration/page.tsx` — page shell template to clone. 30 lines, uses `VizPageShell` + `useThesisGatedData`.
- `components/dashboard/sidebar.tsx` — `ADMIN_ITEMS` array and `ADMIN_ROUTES` set need the new `/dashboard/customer-profile` entry.
- `lib/company-data.ts` — Company interface (read-only, no changes needed). Key fields: `buyerPersona`, `startupSizeCategory`, `country`, `deploymentModel`, `industriesServed`, `investmentTheses`, `workflowSegment`, `manufacturingType`.
- `lib/customer-logos.ts` — `parseKnownCustomers()` used for customer count value mode.
- `hooks/use-thesis-gated-data.ts` — provides `filtered`, `shortlistedIds`, `isLoading` (no changes needed).

### Data Field Inventory

| Dimension | Field | Unique Values | Notes |
|-----------|-------|---------------|-------|
| Buyer Persona | `buyerPersona` | 9 (from heatmap_enrichment.csv) | "Manufacturing / OT" (314), "Design Engineering" (137), etc. |
| Company Size | `startupSizeCategory` | 3 | Small (287), Medium (195), Large (118) |
| Geography | `country` | 43 → ~8 regions | Needs region mapping. Countries include flag emojis. |
| Deployment Model | `deploymentModel` | 58 raw → parse to individual values | Array field. Individual values: Cloud, On-Prem, Web, Plugin, API-only, Edge. |
| Industry | `industriesServed` | ~20+ | Array field. Standard Y axis. |
| Workflow Segment | `workflowSegment` | 77 raw but top 12 cover majority | String field. |
| Manufacturing Type | `manufacturingType` | 10 raw, parseable | Python list string format (needs `replace(/[\[\]']/g, "")` split). |
| Investment Thesis | `investmentTheses` | Array field | Standard Y axis. |

### Build Order

1. **Chart component** (`components/charts/target-customer-profile-chart.tsx`) — Clone from `industry-penetration-chart.tsx`. Add X axis selector dropdown alongside Y axis selector. Add geographic region mapping helper. This is the bulk of the work.
2. **Page route** (`app/dashboard/customer-profile/page.tsx`) — Clone from `app/dashboard/industry-penetration/page.tsx`. Swap component import and update title/description.
3. **Sidebar registration** — Add entry to `ADMIN_ITEMS` and `ADMIN_ROUTES` in `components/dashboard/sidebar.tsx`.

### Geographic Region Mapping

```typescript
function getGeoRegion(country: string): string {
  const c = country.replace(/[^\w\s]/g, '').trim().toLowerCase() // strip emojis
  if (c.includes('united states') || c.includes('usa') || c.includes('canada')) return 'North America'
  if (c.includes('germany') || c.includes('austria') || c.includes('switzerland')) return 'DACH'
  if (c.includes('united kingdom') || c.includes('ireland')) return 'UK & Ireland'
  if (c.includes('france') || c.includes('belgium') || c.includes('netherlands') || c.includes('luxembourg')) return 'Western Europe'
  if (c.includes('norway') || c.includes('sweden') || c.includes('finland') || c.includes('denmark') || c.includes('iceland')) return 'Nordics'
  if (c.includes('israel')) return 'Israel'
  if (c.includes('india') || c.includes('china') || c.includes('japan') || c.includes('korea') || c.includes('singapore') || c.includes('australia')) return 'Asia-Pacific'
  return 'Other'
}
```

### Deployment Model Parsing

`deploymentModel` is already an array in the Company interface (parsed in `load-companies-server.ts`). Use it directly — no extra parsing needed.

### Verification Approach

1. `npx next build` — TypeScript compilation passes
2. Dev server → navigate to `/dashboard/customer-profile` — heatmap renders with data
3. Toggle X axis dropdown (buyer persona → size → geography → deployment model) — cells regroup correctly
4. Toggle Y axis dropdown — rows change
5. Toggle value mode (count, avg score, avg funding, customer count) — cell colors change
6. Hover cells — tooltip shows breakdown
7. Shortlisted companies show amber border highlight
8. Verify sidebar shows "Customer Profile" entry under admin items

## Constraints

- Country field contains flag emojis (e.g., "United States 🇺🇸") — must strip before matching. Some countries have inconsistent spacing (e.g., "Switzerland🇨🇭" vs "Switzerland 🇨🇭"). Use regex to strip non-ASCII.
- `deploymentModel` values can be multi-select — a single company may appear in multiple X-axis columns when deployment model is the X axis (same pattern as `industriesServed` on Y axis).
- `buyerPersona` comes from heatmap_enrichment.csv — 740 of ~600 companies have enrichment data. Companies without enrichment get "Unknown" persona.

## Common Pitfalls

- **D3 `.style()` null rejection on HTML selections** (K004) — Use empty string `''` instead of `null` for conditional styles.
- **Country normalization** — "USA 🇺🇸" and "United States 🇺🇸" are separate values. The region mapping must catch both.
- **Cell text readability** — When cells are small (many unique X values for deployment model), cell text should be suppressed. The existing `w > 20 && h > 16` guard handles this.
