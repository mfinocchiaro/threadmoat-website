# S02: Defer CSV data loading — hero-first rendering

**Goal:** Split the homepage into a static hero section that renders immediately and a data-dependent dashboard section that loads company data via client-side fetch or Suspense boundary
**Demo:** After this: Homepage hero section renders before loadCompaniesFromCSV completes. Company data streams in for the dashboard section.

## Tasks
