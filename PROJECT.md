# Project: Win Equipments Publication-Grade Product Catalogues

## Architecture
The project delivers 11 publication-grade, print-ready industrial product brochures and a master E-Catalogue for Win Equipments (ISO 9001:2015 certified manufacturer, Coimbatore, India), rendered using headless Google Chrome 153.

```
+-----------------------------------------------------------------------------------+
|                                  DATA & ASSETS                                    |
| - High-res product cutouts (images/Products/*.png, ice-flake-machine.jpg)          |
| - Corporate badges (images/iso.png, iaf.png, dac.png, logo.png)                   |
| - Comprehensive technical specifications (mined from products/*.html & catalogues)|
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        BUILD & PRINT ENGINE (build_catalogues.py)                 |
| - Jinja2 HTML Templates (templates/brochure_base.html, templates/master_base.html)|
| - Print-First CSS (assets/css/print.css: @page A4, zero margins, .sheet layout)   |
| - Vector QR Code Generator (qrcode.image.svg.SvgPathImage -> inline SVG)          |
| - Chrome Headless Invocation:                                                     |
|   --headless=new --disable-gpu --allow-file-access-from-files                      |
|   --run-all-compositor-stages-before-draw --virtual-time-budget=6000              |
|   --no-pdf-header-footer --print-to-pdf=...                                       |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                           GENERATED OUTPUTS (catlogue/)                           |
| 10 Individual Brochures (4-6 pages each) + 1 Master E-Catalogue (12-16 pages)     |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                     DUAL-TRACK E2E VERIFICATION (test_catalogues.py)              |
| - Page count verification (4-6 pages brochures, 12-16 pages master)               |
| - Dimension verification (Exact A4: 210mm x 297mm +/- 1mm)                        |
| - Contact hygiene verification (+91 95972 28969 / 28975, info@, zero banned)     |
| - Cover hero image area check (>= 40% cover area)                                 |
| - Visual rendering & vector font verification (Inter subsets, zero pixelation)    |
+-----------------------------------------------------------------------------------+
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Asset Recovery & Ingestion | Extract `ice-flake-machine.jpg` from legacy PDF, verify 26 product images, corporate logo & ISO badges | M1 | Survey |
| 2 | Print-First CSS & Template Engine | Jinja2 templates, `@page` A4 rules, 15mm margins, Navy `#0E2540` / Sky Blue `#0284C7` theme, zero web scrollbars | M1 | Survey |
| 3 | Dynamic Vector QR Code Generation | Inline SVG QR codes for all 10 product landing pages on `winequipments.com` | M1 | Survey |
| 4 | Chrome Headless Rendering Pipeline | Automated rendering CLI script with compositor flags and virtual time budget | M1 | Survey |
| 5 | Refrigerated Air Dryers Brochure | 4–6 page brochure: WRD 20 S to 2000 T, PDP +3°C, R134a/R407C, 20-2000 CFM -> `catlogue/refrigeration air dryer.pdf` | M2 | Survey |
| 6 | Desiccant Air Dryers Brochure | 4–6 page brochure: WHD-030 to WHD-200, PDP -40°C/-70°C, heatless desiccant -> `catlogue/Desiccant air dryer.pdf` | M2 | Survey |
| 7 | Industrial Process Chillers Brochure | 4–6 page brochure: WCP 005 to WCP 500, 1–50 TR, scroll compressors -> `catlogue/chiller.pdf` | M2 | Survey |
| 8 | Specialized Chillers Brochure | 4–6 page brochure: Anodizing (WAN), Medical Scan (WMS), Acid Cooling (WAC), Spot Cooling -> `catlogue/specialized chillers.pdf` | M2 | Survey |
| 9 | Ice Flake Machines Brochure | 4–6 page brochure: WFI 010 to WFI 300, 0.5–20 TPD, stainless steel evaporator -> `catlogue/ice flake machine.pdf` | M2 | Survey |
| 10 | Round & Square Cooling Towers Brochure | 4–6 page brochure: WCT-RL round & WCT-SL square towers, 10–500 TR -> `catlogue/Cooling-towers.pdf` | M3 | Survey |
| 11 | Coil / Closed Circuit Cooling Tower Brochure | 4–6 page brochure: WCC 40 to 150 TR, closed circuit copper/SS coil -> `catlogue/Coil cooling tower.pdf` | M3 | Survey |
| 12 | Air Receiver Tanks Brochure | 4–6 page brochure: WRV 025 to 100, 250L to 10,000L, 7/10/16 bar, IS 2825 / ASME -> `catlogue/Air-Receiver.pdf` | M3 | Survey |
| 13 | Compressed Air Filters Brochure | 4–6 page brochure: WMF 004 to 100, Grades P, X, Y, A (0.01 to 5 micron) -> `catlogue/Filters.pdf` | M3 | Survey |
| 14 | Automatic Drain Valves Brochure | 4–6 page brochure: Electronic timer (WADV-T16), Zero air loss (WADV-Z16), High pressure (WADV-HP40) -> `catlogue/Automatic-Drain-Valve.pdf` | M3 | Survey |
| 15 | Master E-Catalogue Publication | 12–16 page master catalogue covering company profile, engineering edge, all 10 product lines, certifications -> `catlogue/E_Catalogue.pdf` | M4 | Survey |
| 16 | Strict Contact Hygiene Enforcement | Mandatory company address, +91 95972 28969, +91 95972 28975, info@; zero occurrences of banned numbers 9597228978, 2562975 | All / M5 | Survey |
| 17 | E2E Testing Infrastructure & Suite | Automated test harness validating 100% of PDFs across Tiers 1-4, `TEST_INFRA.md`, `TEST_READY.md` | E2E Track | Survey |
| 18 | Adversarial Quality Hardening & Forensic Audit | Tier 5 adversarial stress testing, render validation, table overflow checks, forensic integrity audit | M5 | Survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Independent test suite & harness covering Tiers 1-4, `TEST_INFRA.md`, `TEST_READY.md` | none | DONE |
| M1 | Core Print Engine & Asset Pipeline | Asset recovery (`ice-flake-machine.jpg`), Jinja2 engine, print CSS, QR generator, build script | none | DONE |
| M2 | Brochures Batch 1 (Dryers & Chillers) | 5 brochures: Refrigerated Dryer, Desiccant Dryer, Process Chiller, Specialized Chillers, Ice Flake Machine | M1 | DONE |
| M3 | Brochures Batch 2 (Towers, Tanks, Filters, Valves) | 5 brochures: Cooling Towers, Coil Cooling Tower, Air Receiver, Filters, Drain Valve | M1 | DONE |
| M4 | Master E-Catalogue | 12–16 page Master E-Catalogue with corporate profile and consolidated product spreads | M1, M2, M3 | DONE |
| M5 | Final Milestone: 100% E2E Pass & Hardening | Phase 1: 100% E2E test pass (Tiers 1-4); Phase 2: Adversarial hardening & Forensic Audit | E2E, M2, M3, M4 | DONE |

## Interface Contracts
### Asset Pipeline ↔ Template Engine
- Missing asset extracted: `/Users/devasahithiyan/Desktop/Win equipments/images/Products/ice-flake-machine.jpg`
- All product images referenced via absolute or relative paths with fallback checks.
- QR codes generated as inline SVG strings or SVGs in `assets/qr/`.

### Template Engine ↔ Chrome Headless Runner
- HTML files generated in `build/html/<slug>.html`.
- Each page is enclosed in `.sheet` with `page-break-after: always; height: 297mm; max-height: 297mm; overflow: hidden;`.
- Chrome command:
  ```bash
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless=new --disable-gpu --allow-file-access-from-files \
    --run-all-compositor-stages-before-draw --virtual-time-budget=6000 \
    --no-pdf-header-footer --print-to-pdf="catlogue/<pdf_name>" \
    "build/html/<slug>.html"
  ```

### Build Pipeline ↔ E2E Test Suite
- Output directory: `/Users/devasahithiyan/Desktop/Win equipments/catlogue/`
- Test runner: `pytest tests/test_catalogues.py` or `python3 scripts/verify_catalogues.py`
- Success criteria: Exit code 0, 11 PDFs verified, 100% assertions passing.

## Code Layout
```
/Users/devasahithiyan/Desktop/Win equipments/
├── catlogue/                                # Final publication-grade PDFs
│   ├── refrigeration air dryer.pdf
│   ├── Desiccant air dryer.pdf
│   ├── chiller.pdf
│   ├── specialized chillers.pdf
│   ├── ice flake machine.pdf
│   ├── Cooling-towers.pdf
│   ├── Coil cooling tower.pdf
│   ├── Air-Receiver.pdf
│   ├── Filters.pdf
│   ├── Automatic-Drain-Valve.pdf
│   └── E_Catalogue.pdf
├── src/
│   ├── data/                               # Structured technical data for all 10 products + company
│   │   ├── company.json
│   │   ├── products_batch1.json
│   │   └── products_batch2.json
│   ├── templates/                          # Jinja2 HTML templates
│   │   ├── base_page.html
│   │   ├── brochure_template.html
│   │   └── master_catalogue_template.html
│   ├── assets/
│   │   ├── css/
│   │   │   └── print.css                   # Print-first CSS (@page, A4, typography, colors)
│   │   └── qr/                             # Generated vector SVG QR codes
│   └── build_catalogues.py                 # Core build script compiling HTML & invoking Chrome
├── tests/                                  # Dual-Track E2E Test Suite
│   ├── conftest.py
│   ├── test_e2e_catalogues.py              # Automated Pytest suite (Tiers 1-4)
│   └── verify_hygiene.py                   # Strict contact hygiene & dimension scanner
├── images/
│   ├── Products/                           # 26 product images + ice-flake-machine.jpg
│   └── ...                                 # Logos, ISO, IAF, DAC badges
└── PROJECT.md                              # This document
```
