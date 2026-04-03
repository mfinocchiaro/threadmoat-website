# S02: Theme-aware colors for remaining charts (batch 2: 13 charts incl. 3D) — UAT

**Milestone:** M007
**Written:** 2026-04-03T18:35:59.484Z

## UAT: Theme-aware colors for remaining charts (batch 2)\n\n### Test 1: Build passes\n- [ ] `npm run build` exits 0 with all 101 routes\n\n### Test 2: No structural hardcoded dark-theme colors remain\n- [ ] Grep audit across all 13 files shows zero remaining structural hex colors\n- [ ] Only data-semantic palette entries and intentional contrast text (#fff on colored backgrounds) remain\n\n### Test 3: Theme toggle works\n- [ ] Charts render legibly on light theme\n- [ ] Charts render legibly on dark theme\n- [ ] Toggling theme updates 3D chart colors reactively
