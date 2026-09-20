# DISPATCH: E2E Testing Track — Test Suite Architect

- Working Directory: /Users/devasahithiyan/Desktop/Win equipments/.agents/teamwork_preview_test_writer_e2e_1
- Parent Orchestrator: orchestrator_1 (Conv ID: 16dc7e17-0ff5-4734-9712-f172f0916653)
- Task: Build independent, opaque-box E2E test suite across Tiers 1–4 for all 11 product catalogues; create TEST_INFRA.md; publish TEST_READY.md.
- Authoritative Request: /Users/devasahithiyan/Desktop/Win equipments/.agents/ORIGINAL_REQUEST.md
- Scope Document: /Users/devasahithiyan/Desktop/Win equipments/PROJECT.md
- Survey Reports:
  - /Users/devasahithiyan/Desktop/Win equipments/.agents/teamwork_preview_explorer_survey_1/report.md
  - /Users/devasahithiyan/Desktop/Win equipments/.agents/teamwork_preview_explorer_survey_2/report.md
  - /Users/devasahithiyan/Desktop/Win equipments/.agents/teamwork_preview_spec_miner_survey_3/report.md

Ownership:
- Exclusively owns:
  - `TEST_INFRA.md` at project root
  - `tests/` directory (`tests/conftest.py`, `tests/test_e2e_catalogues.py`, `tests/verify_hygiene.py`)
  - `TEST_READY.md` at project root
- MUST NOT write to `src/` or `catlogue/`.

Output:
- `TEST_INFRA.md` and `TEST_READY.md` at project root.
- `report.md` and `handoff.md` in working directory.

## 2026-09-20T09:29:50Z
You are the E2E Test Suite Architect for the Win Equipments Product Catalogues project.
Working directory: /Users/devasahithiyan/Desktop/Win equipments/.agents/teamwork_preview_test_writer_e2e_1/
Read your DISPATCH.md at /Users/devasahithiyan/Desktop/Win equipments/.agents/teamwork_preview_test_writer_e2e_1/DISPATCH.md, the authoritative request at /Users/devasahithiyan/Desktop/Win equipments/.agents/ORIGINAL_REQUEST.md, and /Users/devasahithiyan/Desktop/Win equipments/PROJECT.md.

Also read the survey reports:
- /Users/devasahithiyan/Desktop/Win equipments/.agents/teamwork_preview_explorer_survey_1/report.md
- /Users/devasahithiyan/Desktop/Win equipments/.agents/teamwork_preview_explorer_survey_2/report.md
- /Users/devasahithiyan/Desktop/Win equipments/.agents/teamwork_preview_spec_miner_survey_3/report.md

Ownership & Constraints:
- You exclusively own `TEST_INFRA.md` at project root, the `tests/` directory (`tests/conftest.py`, `tests/test_e2e_catalogues.py`, `tests/verify_hygiene.py`), and `TEST_READY.md`.
- You MUST NOT write to `src/` or `catlogue/`.

Tasks:
1. Create `/Users/devasahithiyan/Desktop/Win equipments/TEST_INFRA.md` detailing:
   - Opaque-box test philosophy derived from ORIGINAL_REQUEST.md.
   - 4-tier testing methodology:
     * Tier 1: Feature Coverage (PDF existence, page counts: 4-6 for individual brochures, 12-16 for master catalogue, A4 dimensions 210mm x 297mm +/- 1mm, footer company name & page number, contact hygiene).
     * Tier 2: Boundary & Corner Cases (no browser scrollbars, no px font sizes, body font >= 9pt, heading font >= 18pt, cover photo area >= 40% of cover page, alternating row shading, table borders).
     * Tier 3: Cross-Feature Combinations (model code verification, capacity/flow rate, power kW, pressure/temp ranges, QR code resolution to winequipments.com).
     * Tier 4: Real-World Acceptance Workloads (valid PDF rendering in pypdfium2 without rasterization errors, text extractability, 100% absence of banned numbers 9597228978 and 2562975).
   - Coverage thresholds and test inventory table.
2. Implement the automated test suite in `tests/`:
   - `tests/conftest.py`: Shared fixtures (catalog paths, company standards, required phones `+91 95972 28969` & `+91 95972 28975`, forbidden numbers `9597228978`, `2562975`, required address, email).
   - `tests/test_e2e_catalogues.py`: Pytest suite implementing Tiers 1-4.
   - `tests/verify_hygiene.py`: Standalone CLI script for fast verification.
3. Run the test suite on the current files to verify the test harness works and log baseline pass/fail metrics.
4. When test suite is completely implemented, publish `/Users/devasahithiyan/Desktop/Win equipments/TEST_READY.md` at project root summarizing the runner command, coverage matrix, and test tier breakdown.
5. Provide a full `handoff.md` and send a completion message to the parent orchestrator (conv ID: 16dc7e17-0ff5-4734-9712-f172f0916653).

