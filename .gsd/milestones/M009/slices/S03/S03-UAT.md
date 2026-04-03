# S03: Lazy-load chart components on tab overview pages — UAT

**Milestone:** M009
**Written:** 2026-04-03T21:33:28.279Z

## UAT: Lazy-load tab charts\n\n### Test 1: Build passes\n- [ ] `npm run build` exits 0\n\n### Test 2: No static chart imports on tab pages\n- [ ] grep confirms zero static chart imports\n\n### Test 3: Tab pages render correctly\n- [ ] All 5 tab pages show skeleton → chart transition\n- [ ] No missing charts or broken layouts
