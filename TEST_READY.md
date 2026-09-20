# Win Equipments Product Catalogues — Test Suite Readiness Report (TEST_READY.md)

**Status**: READY FOR MILESTONE VERIFICATION & CONTINUOUS INTEGRATION  
**Date**: September 20, 2026  
**Architect**: E2E Test Suite Architect (Specialist & QA Track)  
**Target Output Directory**: `/Users/devasahithiyan/Desktop/Win equipments/catlogue/`  
**Test Suite Directory**: `/Users/devasahithiyan/Desktop/Win equipments/tests/`  

---

## 1. Executive Summary

The automated End-to-End (E2E) Test Suite for Win Equipments Product Catalogues has been fully architected, implemented, and validated. The test infrastructure strictly adheres to an **opaque-box testing philosophy**: verifying the physical and visual attributes of the rendered PDF publications in `catlogue/` without coupling to internal template architectures or compilation flags.

The test harness provides two complementary execution modes:
1. **Full Pytest E2E Suite (`tests/test_e2e_catalogues.py`)**: 197 automated test assertions spanning Tiers 1 through 4.
2. **Fast Hygiene & Dimension CLI Scanner (`tests/verify_hygiene.py`)**: Rapid terminal-based developer feedback tool with color-coded auditing and JSON export.

Running the suite against the current pre-rebuild legacy files confirmed that the harness is active, sensitive, and correctly identifies all known gaps (2-page brochures, sub-18pt headings, <40% cover photo areas) while validating baseline compliance (exact A4 dimensions, mandatory contact information, and 100% absence of banned numbers).

---

## 2. Test Execution Commands

### 2.1 Complete Automated Pytest Suite
Run the full 197-test suite with verbose reporting:
```bash
pytest tests/test_e2e_catalogues.py -v
```

Run in quiet summary mode:
```bash
pytest tests/test_e2e_catalogues.py -q
```

### 2.2 Tier-Specific Test Execution
```bash
# Tier 1: Feature Coverage (Existence, Page counts, A4 Dimensions, Hygiene)
pytest tests/test_e2e_catalogues.py -k "TestTier1" -v

# Tier 2: Boundary & Corner Cases (Scrollbars, Font sizes, Cover area, Tables)
pytest tests/test_e2e_catalogues.py -k "TestTier2" -v

# Tier 3: Cross-Feature Combinations (Model codes, Capacity, Power, Ranges, QR)
pytest tests/test_e2e_catalogues.py -k "TestTier3" -v

# Tier 4: Real-World Acceptance (pypdfium2 150 DPI render, Text extraction, Zero banned)
pytest tests/test_e2e_catalogues.py -k "TestTier4" -v
```

### 2.3 Standalone Fast Hygiene & Dimension CLI Scanner
```bash
# Formatted terminal table
python3 tests/verify_hygiene.py

# Verbose per-page details
python3 tests/verify_hygiene.py --verbose

# Machine-readable JSON output (for build scripts or CI/CD pipelines)
python3 tests/verify_hygiene.py --json
```

---

## 3. Test Tier Breakdown & Verification Matrix

| Tier | Test Scope | Test Functions | Pass Criteria |
|:---:|:---|:---|:---|
| **Tier 1** | **Feature Coverage** | `test_tier1_all_11_catalogues_exist`<br>`test_tier1_individual_brochures_page_count`<br>`test_tier1_master_catalogue_page_count`<br>`test_tier1_pdf_a4_dimensions`<br>`test_tier1_footer_company_and_page_number`<br>`test_tier1_contact_hygiene_required_info` | • 11/11 PDFs present in `catlogue/`<br>• Brochures: 4–6 pages<br>• Master: 12–16 pages<br>• Dimensions: 210mm × 297mm ±1mm<br>• Running footer: "Win Equipments" + page number<br>• Mandatory phones: `+91 95972 28969` & `+91 95972 28975`<br>• Mandatory email: `info@winequipments.com`<br>• Mandatory address: Kallangadu, Arasur, 641407 |
| **Tier 2** | **Boundary & Corner Cases** | `test_tier2_no_browser_scrollbars_or_web_artifacts`<br>`test_tier2_no_px_font_sizes_or_web_artefacts`<br>`test_tier2_typography_font_size_hierarchy`<br>`test_tier2_cover_photo_area_coverage`<br>`test_tier2_table_formatting_and_borders` | • Zero browser scrollbars or default chrome (`file:///`, dates)<br>• Print-first styling (no raw CSS/HTML leaks)<br>• Body text >= 9.0pt, headings >= 18.0pt<br>• Cover page hero product photo occupies >= 40% of page area<br>• Tables have borders and alternating row shading |
| **Tier 3** | **Cross-Feature Combinations** | `test_tier3_model_code_presence`<br>`test_tier3_capacity_and_flow_rate_specs`<br>`test_tier3_power_specifications`<br>`test_tier3_operating_ranges`<br>`test_tier3_qr_code_destination_urls` | • Authoritative model codes present (WRD, WHD, WCP, WAN/WMS/WAC, WFI, WCT, WCC, WRV, WMF, WADV)<br>• Capacity metrics present (CFM, m³/hr, TR, LPM, TPD, Liters)<br>• Power ratings in kW or HP present<br>• Pressure (bar/bar g) & temp (°C, PDP) ranges present<br>• Canonical QR code routes to `winequipments.com` |
| **Tier 4** | **Real-World Acceptance** | `test_tier4_pypdfium2_rendering_integrity`<br>`test_tier4_text_extractability`<br>`test_tier4_strict_banned_numbers_zero_tolerance` | • Error-free 150 DPI C-engine rendering in `pypdfium2` on every page<br>• Fully searchable vector text layer on every page (>= 50 chars)<br>• **Strictly 0 occurrences** of banned numbers `9597228978` and `2562975` across text and raw byte streams |

---

## 4. Baseline Pass/Fail Metrics on Current (Pre-Rebuild) Files

The test suite was executed against the existing PDFs in `catlogue/` to calibrate sensitivity and verify that the harness rejects non-compliant legacy artifacts:

```
============================= Baseline Test Results =============================
Platform: macOS (Apple Silicon arm64) | Python: 3.14.2 | Pytest: 9.1.1
Total Test Executions: 197
Passed: 169 (85.8%)
Failed: 28 (14.2%)
Execution Time: ~51.38s
=================================================================================
```

### Detailed Breakdown of the 28 Baseline Failures:

1. **Tier 1 Page Count Deficiencies (7 Failures)**:
   - `Desiccant air dryer.pdf` (2 pages — expected 4–6)
   - `chiller.pdf` (2 pages — expected 4–6)
   - `ice flake machine.pdf` (2 pages — expected 4–6)
   - `Coil cooling tower.pdf` (2 pages — expected 4–6)
   - `Air-Receiver.pdf` (2 pages — expected 4–6)
   - `Filters.pdf` (2 pages — expected 4–6)
   - `Automatic-Drain-Valve.pdf` (2 pages — expected 4–6)
   *(Note: `refrigeration air dryer.pdf`, `specialized chillers.pdf`, `Cooling-towers.pdf` have 4 pages; `E_Catalogue.pdf` has 12 pages and passed).*

2. **Tier 2 Typography Hierarchy Deficiencies (11 Failures)**:
   - All 11 legacy files failed the publication typography hierarchy:
     * Legacy headings measured at ~15.99pt (required: >= 18.0pt).
     * Legacy body copy 75th percentile measured at ~7.2pt (required: >= 9.0pt).

3. **Tier 2 Cover Photo Area Deficiencies (10 Failures)**:
   - All 10 individual brochures failed the cover photo area requirement:
     * Legacy cover photos measured between **1.3% and 5.3%** of page area (small thumbnail headers).
     * Requirement mandates a hero product photo occupying **>= 40.0%** of the cover page area.

### Baseline Passes (169 / 197):
- **100% Dimensional Compliance**: All 11 PDFs adhere to exact A4 dimensions (209.9mm × 297.0mm).
- **100% Contact Hygiene Compliance**: Both mandatory phone numbers (`+91 95972 28969` / `+91 95972 28975`), email (`info@winequipments.com`), and Arasur address are present in all files.
- **100% Zero Banned Numbers**: Absolute absence of `9597228978` and `2562975` confirmed in all files.
- **100% pypdfium2 Rasterization**: All pages across all 11 PDFs render smoothly at 150 DPI without exceptions.
- **100% Text Extractability**: All pages have active vector text streams.
- **100% Model Codes & Sizing Metrics**: Engineering terms, model series, and operating ranges are present.

---

## 5. Implementation Roadmap & Quality Gate for M5

Downstream implementation agents must resolve the 28 identified defects across Milestones M1–M4:

| Milestone | Target Catalogues | Key Deficiencies to Remedy | Expected Post-Milestone Result |
|:---|:---|:---|:---|
| **M1** | Core Print Engine | Set up print CSS with 18pt+ headings, 9pt+ body, 40%+ cover hero container, vector QR | Print engine verified |
| **M2** | Batch 1 (Dryers & Chillers) | Expand Desiccant Dryer, Chiller, Ice Flake Machine to 4–6 pages; enlarge cover heroes | 12 defects cleared |
| **M3** | Batch 2 (Towers, Tanks, Filters, Valves) | Expand Coil Tower, Air Receiver, Filters, Drain Valve to 4–6 pages; enlarge cover heroes | 14 defects cleared |
| **M4** | Master E-Catalogue | Fix Page 7 ice flake machine image mismatch, ensure 18pt+ headings & 9pt+ body | 2 defects cleared |
| **M5** | Final Audit & Hardening | Run `pytest tests/test_e2e_catalogues.py -v` and `python3 tests/verify_hygiene.py` | **197 / 197 PASS (100%)** |

**Final Quality Gate**: A pull request or milestone handoff to M5 will only be certified as publication-ready when `pytest tests/test_e2e_catalogues.py` executes with **0 failures and 0 errors**.
