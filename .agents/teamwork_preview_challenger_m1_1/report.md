# Empirical Challenge Report: Milestone 1 — Stress Testing, Dimensions & Overflow Bounding

**Agent**: teamwork_preview_challenger_m1_1 (Empirical Challenger 1)  
**Milestone**: M1 (Core Print Engine & Asset Pipeline)  
**Date**: 2026-09-20  
**Test File**: `tests/test_empirical_challenger_m1_1.py`  
**Total Assertions Executed**: 115 tests in `test_empirical_challenger_m1_1.py` (378 total across test suite)  
**Overall Verdict**: **APPROVE**  

---

## Challenge Summary

**Overall risk assessment**: **LOW**

All 11 target PDF publications (10 individual product brochures + 1 Master E-Catalogue) across all 66 physical pages were subjected to empirical stress-testing, dimension fuzzing, character bounding-box boundary scanning, and CLI option stress testing.

1. **Physical Page Geometry**: Across all 66 pages, physical page dimensions were measured via `pypdf`. Every single page measures **209.8887 mm × 297.0107 mm**, with a maximum width deviation of **0.1113 mm** and height deviation of **0.0107 mm** from standard ISO 216 A4 (210.00 mm × 297.00 mm). This easily satisfies the strict ±0.5 mm tolerance.
2. **Page Count Strictness**: All 10 product brochures strictly contain **5 pages** (meeting the 4–6 page requirement). The Master E-Catalogue strictly contains **16 pages** (meeting the 12–16 page requirement). Total document sheet count equals exactly **66 pages**.
3. **Bounding Box Overflows & Text Clipping**: Every character across all 66 pages was extracted and evaluated via `pdfplumber`. Zero character bounding boxes exceed the physical sheet bounds (no `x0 < 0`, `top < 0`, `x1 > width`, or `bottom > height`). Minimum left margin is 15.00 mm, minimum right margin is 14.89 mm. Running headers and footers maintain comfortable clearances (top 3.00 mm, bottom 3.59 mm).
4. **Table Cell Integrity**: All 10 technical specification tables on Page 3 were inspected. All tables fit cleanly on their respective pages with zero table border clipping, proper column distributions, and valid engineering selection footnotes.
5. **Template & Glyph Integrity**: 0 unrendered Jinja tokens (`{{`, `{%`, `}}`, `%}`), 0 placeholder strings (`TODO`, `Lorem ipsum`, `NaN`, `null`), 0 unmapped CID font glyphs (`(cid:`), and 0 unicode replacement characters (`\ufffd`).
6. **CLI Options**: `src/build_catalogues.py` was tested against `--help`, `--slug`, `--verify-only`, and invalid slug inputs. All returned appropriate exit codes and messages.

---

## Challenges

### [Low] Challenge 1: Float32 Precision in PDF Font Metric Serialization
- **Assumption challenged**: That font sizes extracted from PDF text objects will strictly equal Python integer/float `9.0pt`.
- **Attack scenario**: Evaluated character point size distributions on contact pages (Page 5) and catalog spread pages (Page 3) using strict `p75 >= 9.0`.
- **Blast radius**: In Chrome headless PDF generation, CSS `9pt` is serialized via PostScript affine transform matrices as `8.999999625000001 pt`. Strict unrounded float comparisons would fail despite being identical to 9pt within 0.0000004 pt.
- **Mitigation**: Applied `round(p75, 2) >= 8.99` in the empirical test harness. Verified that the CSS source explicitly specifies `10pt` base font, `9.5pt` tables, and `9pt` minimum body text, satisfying Requirement R3.

### [Low] Challenge 2: Duplicate PDF Files in catlogue/
- **Assumption challenged**: That `catlogue/` contains strictly the 11 target PDF files.
- **Attack scenario**: Directory enumeration revealed `Automativ-Drain-valve.pdf` and `cooling tower.pdf` alongside `Automatic-Drain-Valve.pdf` and `Cooling-towers.pdf`.
- **Blast radius**: MD5 checksum analysis proved these two files are exact bit-for-bit duplicates (`9a6f28a5c87d53e34b05f5457429d9e8` and `7e0920e8bed8d32c3f3314f38b3137b7`), likely leftover from preliminary script runs.
- **Mitigation**: Confirmed that `src/data/*.json` and `src/build_catalogues.py` strictly output the canonical names `Automatic-Drain-Valve.pdf` and `Cooling-towers.pdf`. These legacy alias files can be pruned or ignored.

---

## Stress Test Results

| # | Test Scenario | Expected Behavior | Actual Behavior | Result |
|---|---------------|-------------------|-----------------|--------|
| 1 | Page Dimensions (all 66 pages) | 210mm ± 0.5mm, 297mm ± 0.5mm | 209.889mm × 297.011mm across all 66 pages | **PASS** |
| 2 | Aspect Ratio (all 66 pages) | 1.410 – 1.418 | 1.4151 across all 66 pages | **PASS** |
| 3 | Brochure Page Counts (10 PDFs) | 4 to 6 pages | Exactly 5 pages for each brochure | **PASS** |
| 4 | Master Catalogue Page Count | 12 to 16 pages | Exactly 16 pages | **PASS** |
| 5 | Total Page Count across 11 PDFs | 66 pages | Exactly 66 pages | **PASS** |
| 6 | Character BBox Overflow Scan | 0 chars outside [0, w] or [0, h] | 0 characters clipped or overflowed | **PASS** |
| 7 | Margin Verification | Left/Right >= 14.5mm, Top/Bottom >= 3.0mm | Left min 15.00mm, Right min 14.89mm, Top min 3.00mm, Bottom min 3.59mm | **PASS** |
| 8 | Template Leakage & Placeholders | 0 Jinja tags or "TODO" / "Lorem" | 0 occurrences found across all 11 PDFs | **PASS** |
| 9 | Font Glyph Rendering | 0 CID font errors or \ufffd | 0 CID fallbacks or corrupted glyphs | **PASS** |
| 10 | Raster Render (pypdfium2 150 DPI) | 1240 × 1754 px ± 2px, non-blank | 1240 × 1754 px on all 66 pages, verified non-blank | **PASS** |
| 11 | CLI `--help` | Exit code 0, lists options | Exit code 0, includes all options | **PASS** |
| 12 | CLI `--slug` (valid) | Exit code 0, compiles single brochure | Exit code 0, generated & audited brochure | **PASS** |
| 13 | CLI `--slug` (invalid) | Non-zero exit code, error message | Exit code 1, "Unknown product slug" | **PASS** |
| 14 | CLI `--verify-only` | Exit code 0, audits PDF | Exit code 0, PASS output | **PASS** |
| 15 | Contact Hygiene Audit | 0 banned numbers, 100% required | 0 banned numbers, all required present | **PASS** |

**Summary**: 15/15 test scenarios passing. Full test suite: 378/378 passing.

---

## Unchallenged Areas

- **Physical Paper Printing**: Testing was conducted on virtual headless Chrome rendering and PDF rasterization engines (`pypdfium2`). Real-world physical offset or laser printer paper feeds were not tested.
- **QR Code Mobile Hardware Scanner**: QR code SVGs were tested for structural presence, URL format, and dimension thresholds (>= 20mm × 20mm), but not with physical handheld phone camera sensors.
