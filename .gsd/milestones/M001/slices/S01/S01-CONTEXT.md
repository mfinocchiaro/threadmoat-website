# ThreadMoat Dashboard & Pipeline — Feedback Backlog

## Issues to Fix (from user feedback Mar 29)

### 1. ✅ DONE — Rescores: Justification column added to Rescores tab
- Justification text now shows in a 6th column next to each score delta
- Commit route `/rescores/write-all` writes scores + justifications to Airtable together
- Full rescore (740 companies) running as bg job `bg_826d05c5`, ~111/740 at last check

### 2. ✅ DONE — Cleared Funding and Valuations 
- Funding: 395 → 12 pending (removed committed/rejected/matched)
- Valuations: cleared (all 11 had write_failed status)

### 3. 🔴 TODO — Fix ✓/✗ button visual bugs on Funding tab
- ✗ doesn't always visually cross out the row
- ✓ doesn't clearly indicate "queued for modification"
- Root cause: the JavaScript `fundingAction()` function uses `row.style.opacity` which can be inconsistent
- Fix: add a CSS class toggle instead of inline style manipulation, add a visual "queued" badge

### 4. 🔴 TODO — Last Scan companies → auto-qualify → Intake Queue
- Currently: Last Scan shows raw VC portfolio scrape results with no qualification
- Needed: companies that match a ThreadMoat Investment List should auto-queue for intake
- Investment Lists in Airtable: Design Intelligence, Extreme Analysis, Adaptive Manufacturing, Cognitive Thread, Factory Futures, Augmented Operations, Streamlined Supply Chain, Bleeding Edge BIM, SW+HW=Innovation, Engineering Education
- Use Ollama/local LLM for classification (free) before queuing

### 5. ✅ DONE — Cleared Investors & VCs tab (user manages manually)

### 6. 🔴 TODO — Merge Discoveries + Last Scan tabs (redundant)
- User says they look the same
- Consolidate into one "Scan Results" tab with filters for source VC

### 7. 🔴 TODO — Hardware/robotics mapping fix
- Companies making hardware (robots, drones, etc.) → **SW+HW=Innovation** Investment List
- NOT Augmented Operations (that's for software-only MOM/CMMS/AR/VR/SLM)
- Example: Built Robotics should be SW+HW=Innovation, not Augmented Operations
- Fix needed in: discovery_agent.py thesis classification, intake_agent.py, and the enrich_overnight.py thesis pass

### 8. 🔴 TODO — Ignore unnamed entries from VC portfolio scans
- Generic entries like "Company 1" for Bee Partners should be filtered out
- Filter: skip any company name matching patterns like "Company \d+", "Portfolio Company", "Stealth", "Unnamed", "TBD"
- Until company name AND URL are known, don't queue for intake

### 9. 🔴 TODO — Two-way scanning architecture
**Current state:**
- `run_vc_pipeline.py --discover-only` scans 91 configured VC portfolios → finds startups
- This is ONE direction: Investor → Startup discovery
- 91 VCs configured in `config/vc_sites.json`

**Missing second direction:**
- Startup → Investor discovery: for each startup in Airtable, find investors we missed
- This would: check each startup's Crunchbase/Tracxn/press for investor names not in our Investors table
- The `verify_funding.py` pipeline already scrapes funding data — it could extract investor names as a side effect
- The `agents/vc_agent.py` has `scrape_vc_portfolio()` and `extract_portfolio_companies()` for the VC→startup direction
- Need a new agent/script for startup→investor backfill

## File Locations
- Flask server: `review_server.py` (port 5050)
- VC pipeline: `run_vc_pipeline.py` + `agents/vc_agent.py` + `agents/discovery_agent.py`
- Discovery classification: `agents/discovery_agent.py` — `classify_startup()` function
- VC configs: `config/vc_sites.json` (91 VCs)
- Investment List → thesis mapping: needs to be formalized in config

## Rescore Background Job
- PID 64779, job `bg_826d05c5`
- Command: `run_pipeline.py --rescore-all --dry-run`
- Output: `discovery_output/2026-03-29_rescores.json` (accumulating)
- Log: `discovery_output/rescore_full_v3.log`
- Uses: Ollama qwen2.5 (draft) → Claude Sonnet 4.5 (refinement)
- ~50s per company, ~12hr total for 740
- CSV parse failures: ~40% — the 50-column CSV format is fragile
