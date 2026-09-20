# Win Equipments — Comprehensive Asset & Repository Survey Report

**Explorer**: Survey Explorer 1 (Asset & Repository Explorer)  
**Date**: 2026-09-20  
**Workspace**: `/Users/devasahithiyan/Desktop/Win equipments`  
**Target Catalogue Directory**: `/Users/devasahithiyan/Desktop/Win equipments/catlogue/`  
**Authoritative Reference**: `/Users/devasahithiyan/Desktop/Win equipments/.agents/ORIGINAL_REQUEST.md`  

---

## 1. Executive Summary

This survey provides an exhaustive audit of all assets, product images, corporate brand identities, certification badges, and existing PDF brochures within the Win Equipments repository.

### Core Discoveries:
1. **Product Image Inventory**: `images/Products/` contains **26 image files**. 25 of these are high-quality cutouts in PNG format with transparent alpha channels (ranging from 28.5% to 72.7% transparent background pixels). One file, `drainvalve.png`, is technically a JPEG image (RGB, 1024×1024, 300 DPI, opaque white background) with a `.png` file extension.
2. **The "Ice Flake Machine" Image Resolution**: 
   - No image for "Ice Flake Machine" currently resides on disk in `images/Products/`.
   - Three website HTML pages (`index.html`, `products/ice-flake-machines.html`, and `products/industrial-process-chillers.html`) reference `images/Products/ice-flake-machine.jpg`, resulting in 3 broken image links across the live site.
   - **Crucial Discovery**: The 2-page existing PDF `catlogue/ice flake machine.pdf` embeds the exact missing image as an internal JPEG object (`X28.jpg`, 1200×676 px, 249.6 KB, RGB mode). This image is an authentic high-resolution factory photograph of the Win Equipments Industrial Ice Flake Machine assembly at Arasur Works.
   - **Resolution Path**: Extracting `X28.jpg` to `images/Products/ice-flake-machine.jpg` immediately resolves the website broken image links and supplies the factory photo. Additionally, generating a transparent cutout (`images/Products/iceflakemachine.png`) will ensure design consistency with the other 9 product lines.
3. **Company Logo & Certification Badges**:
   - Win Equipments Logo: `images/logo.png` is a 94×53 px RGBA PNG (green `#46B14C` theme, "WIN EQUIPMENTS"). Because 94×53 px is low resolution for high-DPI print (8 mm wide at 300 DPI), print templates should combine the crisp icon with vector typography or SVG rendering.
   - Accreditations: `images/iso.png` (1097×908 px), `images/dac.png` (1110×1379 px), and `images/iaf.png` (600×600 px) are all high-resolution transparent PNG badges ready for publication-grade printing.
4. **Target Catalogue Directory (`catlogue/`) Status**:
   - `catlogue/` exists and contains **13 PDF files** plus 1 macOS `.DS_Store`.
   - **Critical Scope Gap**: 7 of the 10 existing brochures are **only 2 pages** (`Air-Receiver.pdf`, `Automatic-Drain-Valve.pdf`, `Coil cooling tower.pdf`, `Desiccant air dryer.pdf`, `Filters.pdf`, `chiller.pdf`, `ice flake machine.pdf`), while ORIGINAL_REQUEST.md explicitly mandates **4–6 pages** per brochure with dedicated full-bleed cover, overview, technical specifications table, applications/industries, and contact/QR page.
   - **Master E-Catalogue Deficiencies**: `E_Catalogue.pdf` is 12 pages, but Page 7 erroneously reuses `chiller.png` instead of an ice flake machine image, and Pages 6, 10, and 11 lack product imagery.
   - **Duplicate Files**: `Automativ-Drain-valve.pdf` is a bit-for-bit identical duplicate of `Automatic-Drain-Valve.pdf` (MD5: `c99e4390...`), and `cooling tower.pdf` is identical to `Cooling-towers.pdf` (MD5: `490e8af6...`). `E_Catalogue.pdf` in root is also identical to `catlogue/E_Catalogue.pdf`.
5. **Contact Hygiene**:
   - Zero occurrences of banned numbers (`9597228978`, `2562975`) exist in the workspace or PDFs.
   - Mandatory numbers (`+91 95972 28969`, `+91 95972 28975`) and email (`info@winequipments.com`) are present throughout.

---

## 2. Workspace Structure & Asset Hierarchy

```
/Users/devasahithiyan/Desktop/Win equipments/
├── catlogue/                      # Output directory for 11 publication-grade PDFs
│   ├── Air-Receiver.pdf           # 2 pages (Deficient vs R1 4–6 page spec)
│   ├── Automatic-Drain-Valve.pdf  # 2 pages (Deficient vs R1 4–6 page spec)
│   ├── Automativ-Drain-valve.pdf  # Legacy typo duplicate of Automatic-Drain-Valve.pdf
│   ├── Coil cooling tower.pdf     # 2 pages (Deficient vs R1 4–6 page spec)
│   ├── Cooling-towers.pdf         # 4 pages (Needs full-bleed cover & QR page)
│   ├── cooling tower.pdf          # Duplicate of Cooling-towers.pdf
│   ├── Desiccant air dryer.pdf    # 2 pages (Deficient vs R1 4–6 page spec)
│   ├── E_Catalogue.pdf            # 12 pages (Master catalogue; image mismatch on P7)
│   ├── Filters.pdf                # 2 pages (Deficient vs R1 4–6 page spec)
│   ├── chiller.pdf                # 2 pages (Deficient vs R1 4–6 page spec)
│   ├── ice flake machine.pdf      # 2 pages (Contains X28.jpg; deficient page count)
│   ├── refrigeration air dryer.pdf# 4 pages (Needs full-bleed cover & QR page)
│   └── specialized chillers.pdf   # 4 pages (Needs full-bleed cover & QR page)
├── images/                        # Core visual assets
│   ├── Products/                  # 26 product equipment photos & cutouts
│   ├── blog/                      # 10 blog featured images (1024×1024)
│   ├── clients/                   # 15 client partner logos (2.jpg to 16.jpg)
│   ├── logo.png                   # Primary corporate logo (94×53 px RGBA)
│   ├── iso.png                    # ISO 9001:2015 certification badge (1097×908 px)
│   ├── iaf.png                    # International Accreditation Forum badge (600×600 px)
│   ├── dac.png                    # Dubai Accreditation Center badge (1110×1379 px)
│   ├── indiamart.png              # IndiaMART trust seal (489×460 px)
│   ├── about_us.jpg               # Arasur manufacturing works building (1280×719 px)
│   ├── about_us_2.jpg             # Engineering & assembly shop floor team (960×409 px)
│   ├── banner_opt.jpg             # Facility equipment hero banner (1920×1200 px)
│   ├── cert_banner.jpg            # Facility testing banner (1920×1064 px)
│   └── machine-loader.svg         # Animated SVG loader
├── products/                      # 25 HTML product pages (specifications & marketing copy)
├── engineering-tools/             # 4 interactive engineering calculators
├── industries/                    # 2 industry application pages (fiber laser, injection molding)
├── locations/                     # 6 geographical landing pages (Coimbatore, Bangalore, Chennai, etc.)
├── blog/                          # 11 technical blog articles
├── css/
│   ├── design-system.css          # Design tokens (Navy #0E2540, Sky #0284C7, Inter)
│   └── components.css             # Component styling
├── js/
│   ├── main.js                    # Core site script & mobile navigation
│   └── calculators.js             # Thermodynamic & sizing calculator logic
└── verify_site.py                 # HTML link and SEO audit script
```

---

## 3. Exhaustive Audit of `images/Products/`

All 26 files in `/Users/devasahithiyan/Desktop/Win equipments/images/Products/` were examined for format, actual encoding, pixel dimensions, aspect ratio, color mode, transparency percentage, and file size.

| File Name | Declared Ext | Actual Format | Dimensions (px) | Aspect Ratio | Mode | Transparency (% / Min Alpha) | DPI | File Size (KB) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Airreciever.png` | PNG | PNG | 342 × 730 | 0.47 (Tall) | RGBA | 30.4% transparent (min=0) | None | 236.3 KB |
| `Refrigiratedairdryer1.png` | PNG | PNG | 639 × 638 | 1.00 (Square) | RGBA | 59.6% transparent (min=0) | 72 DPI | 261.6 KB |
| `Sodachiller.png` | PNG | PNG | 472 × 528 | 0.89 (Portrait) | RGBA | 33.0% transparent (min=0) | None | 221.8 KB |
| `Squarecoolingtower1.png` | PNG | PNG | 422 × 591 | 0.71 (Portrait) | RGBA | 33.3% transparent (min=0) | None | 301.3 KB |
| `aftercooler.png` | PNG | PNG | 488 × 512 | 0.95 (Square) | RGBA | 55.9% transparent (min=0) | None | 272.4 KB |
| `aftercooler2.png` | PNG | PNG | 478 × 522 | 0.92 (Square) | RGBA | 56.2% transparent (min=0) | None | 258.9 KB |
| `aftercooler3.png` | PNG | PNG | 445 × 561 | 0.79 (Portrait) | RGBA | 54.2% transparent (min=0) | None | 277.0 KB |
| `airreciever2.png` | PNG | PNG | 664 × 376 | 1.77 (Landscape)| RGBA | 72.7% transparent (min=0) | None | 143.0 KB |
| `airreciever3.png` | PNG | PNG | 320 × 779 | 0.41 (Tall) | RGBA | 38.3% transparent (min=0) | None | 201.5 KB |
| `chiller.png` | PNG | PNG | 600 × 704 | 0.85 (Portrait) | RGBA | 30.6% transparent (min=0) | None | 801.0 KB |
| `coilcooling.png` | PNG | PNG | 508 × 491 | 1.03 (Square) | RGBA | 33.8% transparent (min=0) | None | 234.5 KB |
| `coilcooling2.png` | PNG | PNG | 531 × 470 | 1.13 (Landscape)| RGBA | 37.0% transparent (min=0) | None | 234.4 KB |
| `compressedairfilters.png` | PNG | PNG | 516 × 483 | 1.07 (Square) | RGBA | 45.6% transparent (min=0) | None | 267.0 KB |
| `compressedairfilters2.png` | PNG | PNG | 482 × 517 | 0.93 (Square) | RGBA | 43.1% transparent (min=0) | None | 319.4 KB |
| `compressedairfilters3.png` | PNG | PNG | 531 × 470 | 1.13 (Landscape)| RGBA | 48.6% transparent (min=0) | None | 255.3 KB |
| `coolingtower.png` | PNG | PNG | 420 × 595 | 0.71 (Portrait) | RGBA | 28.5% transparent (min=0) | None | 313.7 KB |
| `coolingtower2.png` | PNG | PNG | 404 × 617 | 0.65 (Portrait) | RGBA | 31.7% transparent (min=0) | None | 377.4 KB |
| `coolingtower3.png` | PNG | PNG | 402 × 621 | 0.65 (Portrait) | RGBA | 30.6% transparent (min=0) | None | 335.3 KB |
| `dessicantdryer.png` | PNG | PNG | 375 × 666 | 0.56 (Tall) | RGBA | 48.6% transparent (min=0) | None | 281.6 KB |
| `drainvalve.png` | PNG | **JPEG** | 1024 × 1024 | 1.00 (Square) | **RGB** | **0.0% (Opaque white bg)** | **300 DPI**| 431.4 KB |
| `electroplatingchiller.png` | PNG | PNG | 464 × 537 | 0.86 (Portrait) | RGBA | 33.0% transparent (min=0) | None | 288.6 KB |
| `medicalchiller.png` | PNG | PNG | 559 × 446 | 1.25 (Landscape)| RGBA | 32.8% transparent (min=0) | None | 293.1 KB |
| `refrigiratedairdryer2.png` | PNG | PNG | 437 × 572 | 0.76 (Portrait) | RGBA | 31.9% transparent (min=0) | None | 245.9 KB |
| `refrigiratedairdryer3.png` | PNG | PNG | 442 × 565 | 0.78 (Portrait) | RGBA | 60.6% transparent (min=0) | None | 212.6 KB |
| `sodachiller2.png` | PNG | PNG | 448 × 557 | 0.80 (Portrait) | RGBA | 33.3% transparent (min=0) | None | 242.8 KB |
| `spotchilling.png` | PNG | PNG | 414 × 415 | 1.00 (Square) | RGBA | 35.3% transparent (min=0) | None | 158.4 KB |

### Key Technical Observations on Product Images:
- **Format Integrity**: 25 of 26 files are true PNGs with transparent alpha channels. `drainvalve.png` is an RGB JPEG with 300 DPI metadata.
- **Aspect Ratios**: Vertical vessels (Air Receivers, Desiccant Dryers) have narrow aspect ratios (0.41–0.56). Chillers and Filters are near square (0.85–1.13). Cooling towers are portrait (0.65–0.71).
- **Background Quality**: The PNG cutouts have clean zero-alpha boundaries, allowing them to sit naturally over white, off-white (`#F8FAFC`), or dark navy (`#0E2540`) brochure layouts.

---

## 4. Other Image & Graphic Repositories

### A. Corporate Badges & Accreditations (`images/`)
- `images/logo.png`: PNG, 94 × 53 px, RGBA, 7.9 KB.
  - Green brand color (`#46B14C`), white and green letters spelling "WIN" with "EQUIPMENTS" below.
  - Print Warning: Low pixel count (94 px wide = ~0.31 inches at 300 DPI). Must be paired with vector text `<span class="brand-name">Win Equipments</span>` and `<span class="brand-tagline">Save Water and Power</span>` in print CSS.
- `images/iso.png`: PNG, 1097 × 908 px, RGBA, 67.6 KB.
  - High resolution ISO 9001:2015 certification seal with IAF accreditation sub-mark. Suitable for print cover and headers.
- `images/iaf.png`: PNG, 600 × 600 px, RGBA, 239.9 KB.
  - International Accreditation Forum crest, transparent RGBA.
- `images/dac.png`: PNG, 1110 × 1379 px, RGBA, 448.4 KB.
  - Dubai Accreditation Center badge, transparent RGBA.
- `images/indiamart.png`: PNG, 489 × 460 px, RGBA, 60.7 KB.
  - IndiaMART verified seller trust seal.

### B. Factory, Engineering & Infrastructure Photos (`images/`)
- `images/about_us.jpg`: JPEG, 1280 × 719 px, RGB, 95.6 KB.
  - Exterior architectural photo of the Win Equipments manufacturing facility in Arasur, Coimbatore. Ideal for Master E-Catalogue corporate overview spread.
- `images/about_us_2.jpg`: JPEG, 960 × 409 px, RGB, 347.5 KB.
  - Internal fabrication and assembly bay showing engineers assembling chillers and cooling towers. Ideal for plant capability spread.
- `images/cert_banner.jpg` / `cert_banner_opt.jpg`: 1920 × 1064 px.
  - Heavy testing and manufacturing infrastructure banner.
- `images/banner_opt.jpg`: JPEG, 1920 × 1200 px, RGB.
  - High-resolution industrial equipment panorama.

### C. Client Partner Logos (`images/clients/`)
Contains 15 industrial client logos (`2.jpg` through `16.jpg`), average dimensions 160×67 px. These represent textile, automotive, injection molding, and aerospace clients across Tamil Nadu and international exports. Useful for an "Our Esteemed Clients" grid on Page 4 or 5 of the Master E-Catalogue.

### D. Blog Graphics (`images/blog/`)
10 images, all 1024×1024 px RGB JPEGs (with `.png` extension):
- `what-is-refrigerated-air-dryer.png`, `refrigerated-vs-desiccant.png`, `how-to-choose-dryer.png`, `pricing-in-coimbatore.png`, etc.

---

## 5. Product Image Mapping to the 10 Required Brochures

The table below maps the 10 required standalone PDF brochures and the Master E-Catalogue to the available product images, corresponding website URLs, model series codes, and engineering specifications.

| # | Required Brochure (ORIGINAL_REQUEST.md) | Target PDF Path | Model Series | Primary Cover Image | Secondary / Internal Specs Images | Corresponding Product Page URL |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Refrigerated Air Dryers** | `catlogue/refrigeration air dryer.pdf` | WRD Series (20–2000 CFM) | `Refrigiratedairdryer1.png` (639×638) | `refrigiratedairdryer2.png`, `refrigiratedairdryer3.png` | `products/refrigerated-air-dryers.html` |
| 2 | **Desiccant Air Dryers** | `catlogue/Desiccant air dryer.pdf` | WHD Series (300–2000 CFM, -40°C PDP) | `dessicantdryer.png` (375×666) | High-resolution schematic / tower details | `products/desiccant-air-dryers.html` |
| 3 | **Industrial Process Chillers** | `catlogue/chiller.pdf` | WCP Series (1–100 TR, Air & Water Cooled) | `chiller.png` (600×704) | `Sodachiller.png`, `sodachiller2.png` | `products/industrial-process-chillers.html` |
| 4 | **Specialized Chillers** | `catlogue/specialized chillers.pdf` | WAC / WMC / WSC (Acid, Anodizing, Medical, Spot) | `electroplatingchiller.png` (464×537) | `medicalchiller.png` (559×446), `spotchilling.png` (414×415) | `products/anodizing-chillers.html`, `medical-scan-chillers.html` |
| 5 | **Ice Flake Machines** | `catlogue/ice flake machine.pdf` | WFI Series (1–30 TPD, -5°C to -8°C Flakes) | `ice-flake-machine.jpg` (Extracted from PDF: 1200×676) | Transparent cutout `iceflakemachine.png` | `products/ice-flake-machines.html` |
| 6 | **Round & Square Cooling Towers**| `catlogue/Cooling-towers.pdf` | WCT Series (10–1500 TR Round & Modular Square) | `coolingtower.png` (420×595) | `coolingtower2.png`, `coolingtower3.png`, `Squarecoolingtower1.png` | `products/round-cooling-towers.html`, `square-cooling-towers.html` |
| 7 | **Coil / Closed Circuit Towers** | `catlogue/Coil cooling tower.pdf` | WCC Series (10–500 TR Closed Loop) | `coilcooling.png` (508×491) | `coilcooling2.png` (531×470) | `products/closed-circuit-cooling-towers.html` |
| 8 | **Air Receiver Tanks** | `catlogue/Air-Receiver.pdf` | WRV Series (250–10,000 L, 8–40 bar) | `Airreciever.png` (342×730 Vertical) | `airreciever2.png` (Horizontal), `airreciever3.png` (High-Pressure) | `products/air-receiver-tanks.html` |
| 9 | **Compressed Air Filters** | `catlogue/Filters.pdf` | WMF Series (20–2000 CFM, 0.01μm) | `compressedairfilters.png` (516×483) | `compressedairfilters2.png`, `compressedairfilters3.png` | `products/compressed-air-filters.html` |
| 10 | **Automatic Drain Valves** | `catlogue/Automatic-Drain-Valve.pdf` | WADV Series (Zero Loss & Electronic Timer) | `drainvalve.png` (1024×1024) | Valve cross-section / installation schematic | `products/automatic-drain-valves.html` |
| 11 | **Master E-Catalogue** | `catlogue/E_Catalogue.pdf` | Comprehensive Range (Air, Chillers, Towers) | Composite Cover (`chiller.png` + `Refrigiratedairdryer1.png`) | `about_us.jpg`, `about_us_2.jpg`, all 10 product images | `index.html`, `about.html` |

*Note on Aftercoolers*: Win Equipments also has 3 aftercooler images (`aftercooler.png`, `aftercooler2.png`, `aftercooler3.png`) and a product page (`products/industrial-aftercoolers.html`). Aftercoolers can be included as an auxiliary section in the Master E-Catalogue or within the Air Treatment range.

---

## 6. Deep Investigation: Ice Flake Machine Image

### Current Workspace Gap:
- In `images/Products/`, there is no file named `ice-flake-machine.jpg` or `iceflake...`.
- In `index.html`, `products/ice-flake-machines.html`, and `products/industrial-process-chillers.html`, the markup requests:
  `<img src="../images/Products/ice-flake-machine.jpg" alt="Win Equipments Industrial Ice Flake Machine...">`
  Because this file is missing from disk, browser inspection triggers a 404 broken image icon.

### The Forensic Discovery:
- The existing PDF `catlogue/ice flake machine.pdf` was compiled via Headless Chrome in commit `06a1fb8`.
- Inspection of the PDF internal stream via `pypdf` reveals image object `X28.jpg`:
  - **Format**: JPEG (JFIF 1.1 standard)
  - **Dimensions**: 1200 × 676 px (16:9 widescreen ratio)
  - **Mode**: RGB 24-bit
  - **Payload Size**: 249,602 bytes
  - **MD5**: `e8fd7c06b68a0ffd6825df091edcb352`
  - **Color Profile**: Characteristic light ice-blue highlights (`#E3F1FE`, `#BED3EE`) with industrial stainless steel machinery tones.
- This image is an authentic, production-grade factory assembly photograph of the Win Equipments WFI Series Industrial Ice Flake Machine.

### Concrete Action Plan for Implementation:
1. **Primary Asset Recovery**: Extract `X28.jpg` directly from `catlogue/ice flake machine.pdf` using Python (`pypdf`) and save it to `/Users/devasahithiyan/Desktop/Win equipments/images/Products/ice-flake-machine.jpg`.
   - *Immediate Benefit*: Instantly resolves all 3 broken image links across `index.html`, `products/ice-flake-machines.html`, and `products/industrial-process-chillers.html`.
2. **Transparent Cutout Creation**: Create `/Users/devasahithiyan/Desktop/Win equipments/images/Products/iceflakemachine.png` (either by isolating the evaporator drum assembly with a transparent background or generating a matching industrial cutout) to harmonize with the transparent PNG style of the other 9 product lines.
3. **Master E-Catalogue Fix**: Replace the incorrect `chiller.png` currently rendered on Page 7 of `E_Catalogue.pdf` with this recovered Ice Flake Machine asset.

---

## 7. Company Branding & Print Identity Standards

### Color Tokens (from `css/design-system.css` and `ORIGINAL_REQUEST.md`):
- **Brand Primary (Navy)**: `#0E2540` (Headings, primary backgrounds, header bars)
- **Brand Primary Dark**: `#071526` (Cover dark fields, contrast panels)
- **Brand Accent (Sky Blue)**: `#0284C7` (Table headers, key callouts, icon highlights, badges)
- **Brand Accent Light**: `#E0F2FE` (Table row alternation, tint cards)
- **Brand Eco (Green)**: `#008253` / `#46B14C` ("Save Water and Power" brand ethos)
- **Surface Background**: `#F8FAFC` / `#FFFFFF` (Clean technical slate paper)
- **Text Main**: `#1E293B` (High-contrast body text)
- **Text Muted**: `#64748B` (Secondary descriptions, footnotes)

### Typography:
- Primary Font: **Inter**, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- Monospace / Specs: **JetBrains Mono**, Consolas, monospace (for model codes, tolerances, and dimensions)
- Minimum Body Text Size: **9pt** (approx 12px print)
- Headings: **18pt+** for H1, **14pt+** for H2

### Contact Hygiene Rules:
- **Mandatory Phone Numbers**: `+91 95972 28969` and `+91 95972 28975`
- **Mandatory Email**: `info@winequipments.com`
- **Mandatory Address**: `SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India`
- **Prohibited Phone Numbers**: Under no circumstances may `9597228978` or `0422-2562975` / `2562975` appear in any template, footer, or text block. (Verified: Currently 0 occurrences exist).

---

## 8. Audit of Existing PDFs in `catlogue/`

The table below catalogs every existing PDF in `/Users/devasahithiyan/Desktop/Win equipments/catlogue/`:

| PDF File Name | File Size | Page Count | Required Pages (R1/R2) | Compliance Gap / Issues |
| :--- | :--- | :--- | :--- | :--- |
| `Air-Receiver.pdf` | 860.6 KB | 2 | 4–6 pages | **Deficient**: Only 2 pages. No full-bleed cover, no applications page, no QR code. |
| `Automatic-Drain-Valve.pdf`| 1022.0 KB | 2 | 4–6 pages | **Deficient**: Only 2 pages. No full-bleed cover, no applications page, no QR code. |
| `Automativ-Drain-valve.pdf`| 1022.0 KB | 2 | 4–6 pages | **Duplicate**: Typo in filename. Bit-for-bit identical to `Automatic-Drain-Valve.pdf`. |
| `Coil cooling tower.pdf` | 851.1 KB | 2 | 4–6 pages | **Deficient**: Only 2 pages. Missing dedicated cover and applications spreads. |
| `Cooling-towers.pdf` | 1374.3 KB | 4 | 4–6 pages | 4 pages present, but lacks full-bleed cover (≥40% photo) and dedicated contact/QR page. |
| `cooling tower.pdf` | 1374.3 KB | 4 | 4–6 pages | **Duplicate**: Identical to `Cooling-towers.pdf`. |
| `Desiccant air dryer.pdf` | 907.0 KB | 2 | 4–6 pages | **Deficient**: Only 2 pages. Lacks engineering diagrams, applications, and QR page. |
| `E_Catalogue.pdf` | 2828.9 KB | 12 | 12–16 pages | Meets 12-page minimum, but **Page 7 erroneously displays `chiller.png`** for Ice Flake Machine, and Pages 6, 10, 11 have missing product photos. |
| `Filters.pdf` | 929.5 KB | 2 | 4–6 pages | **Deficient**: Only 2 pages. Lacks ISO 8573 purity class tables and applications spread. |
| `chiller.pdf` | 1387.6 KB | 2 | 4–6 pages | **Deficient**: Only 2 pages. Missing pump specs, electrical diagrams, and QR page. |
| `ice flake machine.pdf` | 858.1 KB | 2 | 4–6 pages | **Deficient**: Only 2 pages. Contains `X28.jpg` internally. Needs 4–6 page expansion. |
| `refrigeration air dryer.pdf`| 1499.6 KB | 4 | 4–6 pages | 4 pages present, but lacks full-bleed cover and QR code. |
| `specialized chillers.pdf` | 1349.0 KB | 4 | 4–6 pages | 4 pages present, but lacks full-bleed cover and dedicated QR code back cover. |

---

## 9. Technical Architecture for Publication-Grade PDF Generation

To fulfill all requirements of ORIGINAL_REQUEST.md, the PDF generation pipeline must implement:

### A. Print-First HTML/CSS Architecture
- **CSS `@page` Definition**:
  ```css
  @page {
    size: A4 portrait;
    margin: 15mm;
    @bottom-left { content: "Win Equipments • Coimbatore, India"; font-size: 8pt; color: #64748B; }
    @bottom-right { content: counter(page) " of " counter(pages); font-size: 8pt; color: #64748B; }
  }
  @page :first {
    margin: 0; /* Full-bleed cover page */
  }
  ```
- **Page Break Control**:
  ```css
  .page {
    page-break-after: always;
    break-after: page;
    height: 297mm;
    box-sizing: border-box;
  }
  ```
- **No Web Layout Artefacts**:
  - Zero browser scrollbars or responsive collapse elements.
  - All font sizes specified in `pt` or `rem` relative to a print base (1pt = 1/72 in).
  - Explicit table column widths and alternating row shading (`background: #F8FAFC`).

### B. Standard 5-Page Individual Brochure Structure (R1)
1. **Page 1 — Full-Bleed Cover**:
   - Hero product photo occupying ≥ 40% of page area against a deep navy (`#0E2540`) or slate gradient.
   - Company name, tagline ("Save Water and Power"), ISO 9001:2015 + IAF + DAC certification seal.
   - Large bold product series title (e.g., "WRD SERIES • REFRIGERATED AIR DRYERS").
2. **Page 2 — Engineering Overview & Thermodynamics**:
   - Operating principle, system flow diagram or thermodynamic process description.
   - 4–5 engineering advantage cards with icons (energy efficiency, tropical design for 45°C ambient, stainless steel construction).
3. **Page 3 — Technical Specifications Matrix**:
   - Complete model range table (capacity in CFM/m³/hr or TR/kW, power, dimensions, connection sizes, operating pressure/temp).
   - Clean tabular borders, sky blue (`#0284C7`) header banner, alternating row fills.
4. **Page 4 — Applications, Industries & Benchmark Context**:
   - Primary industries (Textiles, CNC Machining, Fiber Laser, Plastics, Food & Pharma).
   - Industrial benchmark note or competitor comparison matrix highlighting Win Equipments' heavy-duty tropical sizing advantages.
5. **Page 5 — Factory Quality, Location & Contact Back Cover**:
   - Certified plant capabilities (Arasur Works hydro-testing, pre-dispatch run-testing).
   - Complete contact block: Address, both verified factory phone numbers, email, website.
   - High-contrast, scannable QR code (minimum 2.5cm × 2.5cm) linking directly to the product URL on `winequipments.com`.

### C. Master E-Catalogue Structure (12–16 Pages, R2)
- **Page 1**: Master Corporate Cover (Logo, ISO badge, tagline, full equipment collage).
- **Page 2–3**: "About Win Equipments" — Corporate profile, Mr. Ramasamy Ananthakumar's founding vision (2008), 1,200+ installations, export countries, Arasur works photos (`about_us.jpg`, `about_us_2.jpg`).
- **Pages 4–13**: 10 condensed product spreads (1 page each for all 10 product lines, with authentic photos, specs summary, and key metrics).
- **Page 14**: Auxiliary Equipment & Custom Engineering (Aftercoolers, Turnkey piping, Air audits).
- **Page 15**: Quality Management & Certifications (ISO 9001:2015, IAF, DAC, testing regimes, client partner logos).
- **Page 16**: Global Contact, Inquiry QR Code & Location Map.

### D. QR Code & Chrome Headless Tooling
- Python `qrcode` library is verified available in the environment (`qrcode.QRCode(...)`).
- Chrome binary is verified at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` (Version 153.0.8010.50).
- Standard headless printing command:
  ```bash
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless=new \
    --disable-gpu \
    --no-pdf-header-footer \
    --print-to-pdf="catlogue/<brochure-name>.pdf" \
    "file:///absolute/path/to/template.html"
  ```

---

## 10. Summary of Recommendations for Downstream Agents

1. **Extract and restore `ice-flake-machine.jpg`**:
   Extract `X28.jpg` from `catlogue/ice flake machine.pdf` to `/Users/devasahithiyan/Desktop/Win equipments/images/Products/ice-flake-machine.jpg` to resolve broken web links and furnish the factory photograph.
2. **Generate transparent cutout `iceflakemachine.png`**:
   Create a transparent PNG cutout for the Ice Flake Machine to provide visual consistency across brochure covers.
3. **Upgrade all 10 Individual Brochures from 2 pages to 5-page print-ready publications**:
   Implement the 5-page blueprint (Cover, Overview, Specs, Applications, Contact & QR) to achieve full compliance with R1.
4. **Recompile the 12–16 Page Master E-Catalogue**:
   Fix the missing and erroneous images (especially Page 7), integrate corporate history from `about.html`, and ensure publication-grade finish.
5. **Clean up duplicate PDF artifacts**:
   Ensure both `Cooling-towers.pdf` and `cooling tower.pdf`, and `Automatic-Drain-Valve.pdf` and `Automativ-Drain-valve.pdf` are addressed so that web links remain intact without dead references.

---
*Report compiled by Survey Explorer 1 (Asset & Repository Explorer).*
