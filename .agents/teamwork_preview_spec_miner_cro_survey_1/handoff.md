# Codebase & Site Architecture Survey Report (CRO Baseline)

**Agent**: Codebase & Site Architecture Spec Miner (`teamwork_preview_spec_miner_cro_survey_1`)  
**Date**: 2026-09-20T15:53:00+05:30  
**Status**: COMPLETE  
**Authoritative Request**: `.agents/ORIGINAL_REQUEST.md` (## 2026-09-20T10:14:26Z)  
**Project Root**: `/Users/devasahithiyan/Desktop/Win equipments`  

---

## 1. Observation

### 1.1 Complete Inventory of HTML Files

A systematic search across the workspace identified **70 HTML files** in total:
- **56 Web Pages** (45 active, functional customer-facing pages + 11 legacy client-side redirect stubs).
- **14 Internal Build/Template Files** (11 in `build/html/` used for PDF brochure compilation + 3 in `src/templates/`).

#### Categorized Inventory of the 56 Web Pages:

| Category | File Path | File Size | Role / Description |
|---|---|---|---|
| **Homepage** | `index.html` | 87.1 KB | Core landing page, equipment finder, product matrix, social proof, client logos |
| **Trust & Authority** | `about.html` | 24.6 KB | Company history (est. 2008), Coimbatore Arasur factory profile, team, values |
| **Trust & Authority** | `certifications.html` | 22.5 KB | ISO 9001:2015 accreditation, quality control policy, inspection standards |
| **Social Proof** | `case-studies.html` | 48.6 KB | Real installation case studies, energy savings data, industrial client ROI |
| **Service & Support** | `installation.html` | 24.3 KB | Pre-installation guidelines, commissioning checklist, electrical/piping guides |
| **Conversion / Contact** | `contactus.html` | 22.2 KB | Factory address, interactive RFQ form, Google Maps Arasur Works, direct contacts |
| **Resource Index** | `blog.html` | 26.4 KB | Technical resource hub, engineering article directory, search filter |
| **Utility / Error** | `404.html` | 12.7 KB | Custom 404 error recovery page with navigation back to primary product lines |
| **Product (Active)** | `products/refrigerated-air-dryers.html` | 43.8 KB | Flagship non-cycling refrigerated air dryers (20–2,000 CFM, +3°C PDP) |
| **Product (Active)** | `products/desiccant-air-dryers.html` | 24.8 KB | Twin-tower heatless desiccant air dryers (-40°C to -70°C PDP) |
| **Product (Active)** | `products/industrial-process-chillers.html` | 44.6 KB | Packaged air-cooled and water-cooled process chillers (1 to 100 TR) |
| **Product (Active)** | `products/acid-cooling-chillers.html` | 41.7 KB | Specialized chemical/acid chillers (Titanium Gr. 2, Hastelloy, PTFE, 2–150 TR) |
| **Product (Active)** | `products/anodizing-chillers.html` | 41.0 KB | Hard anodizing & electroplating bath cooling chillers (2–100 TR) |
| **Product (Active)** | `products/medical-scan-chillers.html` | 40.4 KB | Dual-circuit hospital MRI, CT scanner & LINAC chillers (3–30 TR) |
| **Product (Active)** | `products/ice-flake-machines.html` | 36.7 KB | Industrial stainless steel drum flake ice generators (1 to 30 TPD) |
| **Product (Active)** | `products/round-cooling-towers.html` | 29.4 KB | Bottle-type aerodynamic FRP counterflow cooling towers (10–1,500 TR) |
| **Product (Active)** | `products/square-cooling-towers.html` | 29.4 KB | Modular square crossflow induced draft cooling towers (10–500 TR) |
| **Product (Active)** | `products/closed-circuit-cooling-towers.html` | 25.4 KB | Closed loop evaporative coil towers for contamination-free cooling |
| **Product (Active)** | `products/air-receiver-tanks.html` | 26.2 KB | Vertical & horizontal compressed air storage vessels (IS 2825 / ASME) |
| **Product (Active)** | `products/compressed-air-filters.html` | 23.2 KB | Coalescing sub-micron oil and particulate filters (ISO 8573-1) |
| **Product (Active)** | `products/automatic-drain-valves.html` | 21.9 KB | Zero air loss capacitive sensor & electronic timer drain valves |
| **Product (Active)** | `products/industrial-aftercoolers.html` | 22.8 KB | Air-cooled and water-cooled compressor discharge aftercoolers |
| **Product (Active)** | `products/spare-parts-consumables.html` | 42.7 KB | OEM aftermarket spares, activated alumina, filter elements, PVC fills |
| **Product (Redirect)** | `products/aftercooler.html` | 698 B | Meta-refresh & JS redirect stub -> `industrial-aftercoolers.html` |
| **Product (Redirect)** | `products/air_receiver.html` | 663 B | Meta-refresh & JS redirect stub -> `air-receiver-tanks.html` |
| **Product (Redirect)** | `products/automatic_drain_valve.html` | 691 B | Meta-refresh & JS redirect stub -> `automatic-drain-valves.html` |
| **Product (Redirect)** | `products/chiller.html` | 726 B | Meta-refresh & JS redirect stub -> `industrial-process-chillers.html` |
| **Product (Redirect)** | `products/coil_cooling.html` | 740 B | Meta-refresh & JS redirect stub -> `closed-circuit-cooling-towers.html` |
| **Product (Redirect)** | `products/compressed_air_filter.html` | 691 B | Meta-refresh & JS redirect stub -> `compressed-air-filters.html` |
| **Product (Redirect)** | `products/cooling_towers.html` | 698 B | Meta-refresh & JS redirect stub -> `round-cooling-towers.html` |
| **Product (Redirect)** | `products/desiccant_air_dryer.html` | 677 B | Meta-refresh & JS redirect stub -> `desiccant-air-dryers.html` |
| **Product (Redirect)** | `products/refrigerated_air_dryers.html` | 698 B | Meta-refresh & JS redirect stub -> `refrigerated-air-dryers.html` |
| **Product (Redirect)** | `products/rounded_cooling_towers.html` | 684 B | Meta-refresh & JS redirect stub -> `square-cooling-towers.html` |
| **Blog Article** | `blog/applications-textile-food.html` | 13.9 KB | Guide: Air treatment in food processing and textile spinning mills |
| **Blog Article** | `blog/how-to-choose-dryer.html` | 14.8 KB | Engineering selection matrix: Refrigerated vs. Desiccant dryers |
| **Blog Article** | `blog/installing-servicing-tamil-nadu.html` | 14.2 KB | Installation and preventive maintenance across South Indian climates |
| **Blog Article** | `blog/iso-8573-1-compressed-air-purity-classes.html` | 18.0 KB | Deep dive: ISO 8573-1 air purity standards and class definitions |
| **Blog Article** | `blog/key-benefits-refrigerated-air-dryers.html` | 14.9 KB | Engineering benefits of non-cycling refrigerated air dryers |
| **Blog Article** | `blog/maintenance-tips-hot-climates.html` | 15.1 KB | High-ambient condenser cleaning and chiller maintenance procedures |
| **Blog Article** | `blog/pricing-in-coimbatore.html` | 15.6 KB | Price breakdown, capital cost vs. operating cost in Coimbatore |
| **Blog Article** | `blog/refrigerated-vs-desiccant.html` | 16.3 KB | Technical comparison between +3°C and -40°C pressure dew points |
| **Blog Article** | `blog/save-energy-reduce-costs.html` | 14.6 KB | Energy efficiency, VFD fans, and power-saving strategies |
| **Blog Article** | `blog/troubleshooting-common-problems.html` | 15.4 KB | Field troubleshooting guide: High discharge pressure, water carryover |
| **Blog Article** | `blog/what-is-refrigerated-air-dryer.html` | 18.0 KB | Comprehensive explanation of refrigerated dryer working principles |
| **Engineering Tool** | `engineering-tools/air-dryer-sizing.html` | 14.8 KB | Interactive CFM Sizing Calculator with ambient & pressure derating |
| **Engineering Tool** | `engineering-tools/chiller-tonnage-calculator.html` | 14.0 KB | Interactive Chiller TR Calculator (LPM, ΔT, specific heat load) |
| **Engineering Tool** | `engineering-tools/compressed-air-energy-calculator.html` | 14.6 KB | Interactive Drain Air Loss & Energy Savings Calculator (kWh / INR) |
| **Engineering Tool** | `engineering-tools/cooling-tower-calculator.html` | 14.3 KB | Interactive Cooling Tower Sizing Tool (Approach, Range, Drift Loss) |
| **Industry Solutions** | `industries/laser-cutting.html` | 13.9 KB | Vertical landing page: High-precision fiber laser cutting systems |
| **Industry Solutions** | `industries/plastic-molding.html` | 12.3 KB | Vertical landing page: Injection molding mold chilling & hydraulics |
| **Regional SEO Hub** | `locations/bangalore-compressed-air-dryers.html` | 15.1 KB | Regional industrial corridor page: Bangalore / Peenya / Bommasandra |
| **Regional SEO Hub** | `locations/chennai-industrial-chillers.html` | 15.2 KB | Regional industrial corridor page: Chennai / Sriperumbudur / Oragadam |
| **Regional SEO Hub** | `locations/erode-cooling-towers.html` | 12.5 KB | Regional industrial corridor page: Erode textile & chemical processing |
| **Regional SEO Hub** | `locations/hosur-cnc-air-dryers.html` | 11.5 KB | Regional industrial corridor page: Hosur auto component CNC machining |
| **Regional SEO Hub** | `locations/tirupur-textile-air-dryers.html` | 12.3 KB | Regional industrial corridor page: Tirupur knitwear & garment processing |
| **Regional (Redirect)** | `locations/hosur-industrial-chillers.html` | 638 B | Meta-refresh & JS redirect stub -> `hosur-cnc-air-dryers.html` |

---

### 1.2 Verification of Target Specialized Product Pages

The four specialized product pages highlighted in the mission were verified as present, fully formed, and active:
1. **`products/acid-cooling-chillers.html`**
   - **Path**: `/Users/devasahithiyan/Desktop/Win equipments/products/acid-cooling-chillers.html`
   - **Status**: Full 713-line HTML document (41,740 bytes).
   - **Title**: *Industrial Acid Cooling Chiller Manufacturer Coimbatore (2 to 150 TR) | Win Equipments*
   - **H1**: `Industrial Acid Cooling Chillers (2 to 150 TR)`
   - **Brochure Link**: `../catlogue/specialized chillers.pdf`
   - **Key Features**: Pure Titanium Gr. 2 / Hastelloy C-276 / PTFE coils; sealless magnetic drive PVDF pumps; sulfuric acid pickling & battery formation bath compatibility.
2. **`products/anodizing-chillers.html`**
   - **Path**: `/Users/devasahithiyan/Desktop/Win equipments/products/anodizing-chillers.html`
   - **Status**: Full 694-line HTML document (41,037 bytes).
   - **Title**: *Industrial Anodizing Chiller Manufacturer Coimbatore (2 to 100 TR) | Win Equipments*
   - **H1**: `Industrial Anodizing Chillers (2 to 100+ TR)`
   - **Brochure Link**: `../catlogue/specialized chillers.pdf`
   - **Key Features**: Hard anodizing cooling (-5°C to +10°C); electroplating tank heat rejection; corrosion-resistant titanium heat exchangers; non-ferrous piping.
3. **`products/ice-flake-machines.html`**
   - **Path**: `/Users/devasahithiyan/Desktop/Win equipments/products/ice-flake-machines.html`
   - **Status**: Full 633-line HTML document (36,663 bytes).
   - **Title**: *Industrial Ice Flake Machine Manufacturer Coimbatore (1 to 30 TPD) | Win Equipments*
   - **H1**: `Industrial Ice Flake Machines (1 to 30 Tons/Day)`
   - **Brochure Link**: `../catlogue/ice flake machine.pdf`
   - **Key Features**: Vertical stationary drum with rotating helical spiral blade; food-grade SS304/SS316; sub-cooled dry flake ice (-5°C to -8°C, 1.5–2.2mm thickness) for seafood, poultry, chemical dyes, and concrete batching.
4. **`products/medical-scan-chillers.html`**
   - **Path**: `/Users/devasahithiyan/Desktop/Win equipments/products/medical-scan-chillers.html`
   - **Status**: Full 681-line HTML document (40,435 bytes).
   - **Title**: *Medical Scan Chiller Manufacturer Coimbatore (3 to 30 TR) | Win Equipments*
   - **H1**: `Medical Scan Chillers (MRI, CT & LINAC Cooling)`
   - **Brochure Link**: `../catlogue/specialized chillers.pdf`
   - **Key Features**: Mission-critical ±0.5°C temperature stability; dual-circuit redundant compressors and pumps; RS485 Modbus / BACnet BMS telemetry; hospital MRI (Siemens, GE, Philips) helium compressor cooling.

---

### 1.3 Inspection of CSS and JavaScript Architecture

#### CSS Linking:
All 56 web pages uniformly link to a shared design system located in `css/`:
- **Design Tokens**: `css/design-system.css` (or `../css/design-system.css` in subfolders). Contains brand color tokens (`#0E2540` navy, `#0284C7` sky blue, `#E65100` CTA orange, `#10B981` success green), typography scale, spacing, border radiuses, and elevation shadows.
- **Component Styles**: `css/components.css` (or `../css/components.css` in subfolders). Contains top utility bar, zero-CLS navigation bar, mega dropdowns, hero layouts, freeze-pane responsive spec tables (`.spec-table`), proof metrics bar, mobile conversion dock (`.mobile-conversion-dock`), and modal dialogs.
- **External Typography & Icons**:
  - Google Fonts: `Inter` (weights 400-900) & `JetBrains Mono` (weights 500, 700).
  - FontAwesome 6.4.0: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`.
- **Legacy Files Audit**: Old standalone stylesheets (`installation.css`, `product.css`, `styles.css`) exist in the project root but have **0 references** across all HTML files. They are completely superseded by `css/design-system.css` and `css/components.css`.

#### JavaScript Linking:
- **`js/main.js`**: Linked with `defer` on **all 45 non-stub pages** right before `</body>`. Manages:
  - Zero-CLS desktop and mobile navigation menus (`initMobileNav()`, `injectMobileDrawer()`).
  - Dynamic mobile conversion dock fallback (`initMobileConversionDock()`).
  - Interactive equipment matcher widget (`initEquipmentFinder()`).
  - Category filters and smooth scrolling (`initProductCategoryFilter()`).
  - Form validation and RFQ lead processing (`initLeadForms()`).
  - WhatsApp click tracking (`initWhatsAppTracking()`).
- **`js/calculators.js`**: Linked on `index.html` and the 4 interactive engineering tool pages (`engineering-tools/*.html`). Houses thermodynamic formulas (CFM derating, chiller TR from LPM/ΔT, cooling tower approach/range, and compressed air orifice leak calculations).
- **Legacy Files Audit**: Old script files (`navbar.js`, `product.js`, `installation.js`, `script.js`) exist in root but have **0 references** in any active HTML page.

---

### 1.4 Navigation and Header Structure Audit

#### Desktop Mega Dropdown Structure (in `index.html`, `about.html`, `blog.html`, etc.):
- `<nav aria-label="Primary Navigation">` includes a mega dropdown for "Products" split into two columns:
  - **Column 1 — Compressed Air Treatment**: 6 items
    1. Refrigerated Air Dryers
    2. Desiccant Air Dryers
    3. Compressed Air Filters
    4. Automatic Drain Valves
    5. Air Receiver Tanks
    6. Air & Water Aftercoolers
  - **Column 2 — Process Cooling & Towers**: 5 items
    1. Industrial Process Chillers
    2. Round Bottle Cooling Towers
    3. Square Crossflow Towers
    4. Closed Circuit Cooling Towers
    5. Spares & Consumables Hub
- **Other Dropdowns**:
  - **Industries Dropdown**: 6 items (Fiber Laser Cutting, Plastic Molding, Textile Mills, CNC Machining, Chennai Automotive, Bangalore Tech Hub).
  - **Engineering Tools Dropdown**: 4 items (Air Dryer CFM, Cooling Tower TR, Chiller Heat Load, Drain Energy Loss).
- **CRITICAL ARCHITECTURAL FINDING**: The 4 newly added specialized products (`acid-cooling-chillers.html`, `anodizing-chillers.html`, `medical-scan-chillers.html`, `ice-flake-machines.html`) are **NOT present** in the desktop mega dropdown. They are only accessible via cross-links on `index.html`, `industrial-process-chillers.html`, the footer, or the mobile navigation drawer.
- **Hick's Law Analysis**: Column 1 has 6 items; Column 2 has 5 items. Adding all 4 specialized products into Column 2 would increase it to 9 items, violating Hick's Law (recommended ≤ 6 choices per column). A dedicated 3rd column ("Specialized Chillers & Ice") or sub-categorization is needed.

#### Product Pages Navigation Pattern:
14 of the 15 product pages use a streamlined, flat contextual navigation bar without the full mega dropdown:
- Home (`../index.html`)
- Products Anchor (`../index.html#products`)
- Contextual Calculator Link (e.g. CFM Calculator on dryer pages, Tower Calculator on cooling tower pages, Chiller Calculator on chiller pages)
- About Us (`../about.html`)
- Certifications / Contact
- Prominent header button: `<a href="#rfq-section" class="btn btn-cta btn-sm">Request Price</a>`
*(Only `products/spare-parts-consumables.html` currently renders the full desktop mega dropdown).*

#### Mobile Navigation Drawer (`js/main.js`):
- Injected dynamically into the DOM by `injectMobileDrawer()`.
- Explicitly lists all 15 product lines, including all 4 specialized pages under "Process Cooling & Towers" (9 sub-items total), plus 4 engineering tools and top-level pages.

---

### 1.5 Product Page Hero Structure & CTA Positioning

#### Hero Section Architecture (`.grid-split-hero`):
All 15 product pages follow a 2-column split hero layout:
- **Left Column (Copy & Conversion Triggers)**:
  1. **Trust Badge Row (`.hero-badge-row`)**: Pre-rendered badges (e.g., `ISO 9001:2015 Certified`, `3,500+ Plant Installations`, `100% Factory Run-Tested`, and specific technical certifications like `+3°C PDP` or `Titanium Gr. 2`).
  2. **Product H1 Heading**: Clear, descriptive heading indicating product type and capacity range.
  3. **Value Proposition Paragraph**: Highlights industrial applications, moisture/heat damage prevention, and durability under Indian tropical ambient temperatures (45°C).
  4. **Action Buttons (`.hero-actions`)**:
     - Primary Button: `<a href="#rfq-section" class="btn btn-cta btn-lg">Request Factory Quote <i class="fas fa-arrow-right"></i></a>`
     - Secondary Button: `<a href="../catlogue/[product].pdf" download class="btn btn-outline btn-lg" target="_blank" rel="noopener"><i class="fas fa-file-pdf"></i> Technical Specs</a>`
     - Tertiary Button (on 5 pages only: `acid-cooling-chillers.html`, `anodizing-chillers.html`, `ice-flake-machines.html`, `medical-scan-chillers.html`, `spare-parts-consumables.html`): `<a href="https://wa.me/919597228969..." class="btn btn-outline btn-lg" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp Engineer</a>`
  5. **At-a-Glance 2x2 Specs Grid**: Directly below the CTA buttons (features 4 core parameters: dew point/flow, maximum inlet temperature, compressor make, refrigerant/metallurgy).
- **Right Column (Visual Product Showcase)**:
  - Clean white product card (`.card`) displaying the real product photo with explicit `width`, `height`, and `loading` attributes, flanked by 2–3 `.spec-pill` metadata badges.

#### Conversion / Psychology Observations:
1. **Lack of Loss-Aversion Framing**: Across all 15 product pages, the primary CTA button text is identical: *"Request Factory Quote"*. None currently implement outcome-focused or loss-aversion framing (e.g., *"Stop Paying for Moisture Damage — Get Sizing & Price"*, *"Prevent Thermal Shutdowns — Calculate Chiller Sizing"*).
2. **F-Pattern Layout**: Currently, the 2x2 spec grid sits *below* the CTA buttons in the left column. Aligning key specifications to the top-left reading path before/adjacent to the primary CTA would strengthen the F-pattern scanning journey for plant engineers.

---

### 1.6 WhatsApp Integration & Mobile CTA Dock Analysis

#### Existing Mobile Conversion Dock (`.mobile-conversion-dock`):
- **Implementation**:
  - Hard-coded in HTML across **10 pages**: `index.html` and 9 product pages (`round-cooling-towers.html`, `medical-scan-chillers.html`, `ice-flake-machines.html`, `industrial-process-chillers.html`, `acid-cooling-chillers.html`, `anodizing-chillers.html`, `closed-circuit-cooling-towers.html`, `refrigerated-air-dryers.html`, `square-cooling-towers.html`).
  - Missing in HTML on **6 product pages**: `air-receiver-tanks.html`, `automatic-drain-valves.html`, `compressed-air-filters.html`, `desiccant-air-dryers.html`, `industrial-aftercoolers.html`, `spare-parts-consumables.html` (these rely on `js/main.js` runtime DOM injection).
- **Styling (`css/components.css:970, 1393`)**:
  - `display: none;` on desktop (`> 768px`).
  - `display: block !important;` on mobile (`<= 768px`).
  - Fixed to viewport bottom (`position: fixed; bottom: 0; left: 0; width: 100%; z-index: 999;`).
  - Contains 3 grid buttons: "Call Plant" (`tel:+919597228969`), "WhatsApp" (`https://wa.me/919597228969...`), and "Get RFQ" (`#quick-rfq` or `contactus.html#rfq`).

#### Existing WhatsApp Floating Element:
- **Finding**: There is **NO floating WhatsApp button** for desktop/tablet viewports in the current CSS or HTML!
- **CSS Check**: Grep for `whatsapp` in `css/` yields only `.dock-whatsapp` inside the mobile dock.
- **Injection Site Analysis**:
  - A persistent floating WhatsApp button (`.whatsapp-float-btn`) should be injected:
    - Fixed at `bottom: 24px; right: 24px; z-index: 998;` on desktop (`min-width: 769px`).
    - Styled with official WhatsApp green (`#25D366`), white icon, subtle shadow, and hover pulse.
    - On mobile (`<= 768px`), it should either be hidden (`display: none;`) to prevent collision with the `.mobile-conversion-dock` (which already features a dedicated WhatsApp button), or repositioned to `bottom: calc(75px + 16px);`.

---

### 1.7 Catalogue PDF Links Audit

All catalogue PDF files are located in `/Users/devasahithiyan/Desktop/Win equipments/catlogue/`. Every referenced PDF file exists on disk and was verified.

#### Complete Mapping of HTML Pages to Catalogue PDFs:

| HTML Page(s) | Referenced PDF Link | File on Disk | Disk Size |
|---|---|---|---|
| `products/refrigerated-air-dryers.html` | `../catlogue/refrigeration air dryer.pdf` | `refrigeration air dryer.pdf` | 3.8 MB |
| `products/desiccant-air-dryers.html` | `../catlogue/Desiccant air dryer.pdf` | `Desiccant air dryer.pdf` | 3.3 MB |
| `products/industrial-process-chillers.html` | `../catlogue/chiller.pdf` | `chiller.pdf` | 4.7 MB |
| `products/acid-cooling-chillers.html` | `../catlogue/specialized chillers.pdf` | `specialized chillers.pdf` | 3.8 MB |
| `products/anodizing-chillers.html` | `../catlogue/specialized chillers.pdf` | `specialized chillers.pdf` | 3.8 MB |
| `products/medical-scan-chillers.html` | `../catlogue/specialized chillers.pdf` | `specialized chillers.pdf` | 3.8 MB |
| `products/ice-flake-machines.html` | `../catlogue/ice flake machine.pdf` | `ice flake machine.pdf` | 5.6 MB |
| `products/round-cooling-towers.html` | `../catlogue/cooling tower.pdf` | `cooling tower.pdf` | 4.5 MB |
| `products/square-cooling-towers.html` | `../catlogue/Cooling-towers.pdf` | `Cooling-towers.pdf` | 4.5 MB |
| `products/closed-circuit-cooling-towers.html` | `../catlogue/Coil cooling tower.pdf` | `Coil cooling tower.pdf` | 3.4 MB |
| `products/air-receiver-tanks.html` | `../catlogue/Air-Receiver.pdf` | `Air-Receiver.pdf` | 3.6 MB |
| `products/compressed-air-filters.html` | `../catlogue/Filters.pdf` | `Filters.pdf` | 4.0 MB |
| `products/automatic-drain-valves.html` | `../catlogue/Automatic-Drain-Valve.pdf` | `Automatic-Drain-Valve.pdf` | 4.0 MB |
| `products/industrial-aftercoolers.html` | `../catlogue/E_Catalogue.pdf` | `E_Catalogue.pdf` | 7.7 MB |
| `products/spare-parts-consumables.html` | `../catlogue/E_Catalogue.pdf` | `E_Catalogue.pdf` | 7.7 MB |
| `index.html`, `about.html`, `contactus.html`, `case-studies.html`, `certifications.html`, `blog.html`, `installation.html`, all 11 `blog/*.html` | `catlogue/E_Catalogue.pdf` (or `../catlogue/E_Catalogue.pdf`) | `E_Catalogue.pdf` | 7.7 MB |
| `engineering-tools/chiller-tonnage-calculator.html` | `../catlogue/chiller.pdf` | `chiller.pdf` | 4.7 MB |
| `engineering-tools/cooling-tower-calculator.html` | `../catlogue/cooling tower.pdf` | `cooling tower.pdf` | 4.5 MB |
| `locations/bangalore-compressed-air-dryers.html` | `../catlogue/refrigeration air dryer.pdf` | `refrigeration air dryer.pdf` | 3.8 MB |
| `locations/chennai-industrial-chillers.html` | `../catlogue/E_Catalogue.pdf` | `E_Catalogue.pdf` | 7.7 MB |
| `locations/erode-cooling-towers.html` | `../catlogue/Cooling-towers.pdf` | `Cooling-towers.pdf` | 4.5 MB |
| `locations/hosur-cnc-air-dryers.html` | `../catlogue/refrigeration air dryer.pdf` | `refrigeration air dryer.pdf` | 3.8 MB |
| `locations/tirupur-textile-air-dryers.html` | `../catlogue/refrigeration air dryer.pdf` | `refrigeration air dryer.pdf` | 3.8 MB |

---

### 1.8 Phone Number & Contact Hygiene Audit

An automated regex scan across all 56 HTML files yielded the following findings:

1. **Banned Phone Numbers**:
   - `9597228978` (defunct mobile): **0 occurrences** across all HTML files.
   - `0422-2562975` or `2562975` (defunct Coimbatore landline): **0 occurrences** across all HTML files.
2. **Primary Factory Mobile (`+91 95972 28969`)**:
   - Present and hyperlinked (`tel:+919597228969`) across **all 45 non-stub HTML pages** (100% coverage).
3. **Secondary Factory Mobile (`+91 95972 28975`)**:
   - Present on **31 non-stub HTML pages**.
   - **MISSING on 14 non-stub HTML pages**:
     1. `blog/applications-textile-food.html`
     2. `blog/how-to-choose-dryer.html`
     3. `blog/installing-servicing-tamil-nadu.html`
     4. `blog/iso-8573-1-compressed-air-purity-classes.html`
     5. `blog/key-benefits-refrigerated-air-dryers.html`
     6. `blog/maintenance-tips-hot-climates.html`
     7. `blog/pricing-in-coimbatore.html`
     8. `blog/refrigerated-vs-desiccant.html`
     9. `blog/save-energy-reduce-costs.html`
     10. `blog/troubleshooting-common-problems.html`
     11. `blog/what-is-refrigerated-air-dryer.html`
     12. `engineering-tools/compressed-air-energy-calculator.html`
     13. `locations/bangalore-compressed-air-dryers.html`
     14. `locations/chennai-industrial-chillers.html`
   *(In these 14 pages, only `+91 95972 28969` appears in the top bar / footer, violating the dual-phone requirement).*

---

## 2. Logic Chain

1. **Site Architecture Stability**: All 45 functional pages share common design tokens and components (`css/design-system.css`, `css/components.css`, `js/main.js`). There are zero broken internal links across the entire site.
2. **Specialized Product Discoverability Gap**: While `acid-cooling-chillers.html`, `anodizing-chillers.html`, `medical-scan-chillers.html`, and `ice-flake-machines.html` are high-quality, comprehensive product pages, they are omitted from the desktop navigation mega dropdown. A visitor navigating via desktop header menus cannot discover these four products.
3. **Navigation Cognitive Load (Hick's Law)**: Directly appending the 4 specialized pages to Column 2 ("Process Cooling & Towers") would expand that column from 5 to 9 items, violating the ≤ 6 item UX benchmark. Adding a 3rd column ("Specialized Process Cooling") or restructuring the dropdown into 3 columns of 4–6 items each maintains optimal cognitive load.
4. **CTA Optimization Opportunity**: In B2B capital equipment sales, generic "Request Quote" buttons trigger friction and price anxiety. Reframing the primary hero CTA on all 15 product pages into loss-aversion and outcome-focused triggers (e.g. stopping moisture damage, preventing coil corrosion, guaranteeing MRI uptime) directly addresses buyer hesitation.
5. **Mobile vs. Desktop WhatsApp Floating CTAs**: The mobile dock is highly effective below 768px, but desktop users (procurement managers evaluating specs on 1080p+ screens) have no sticky floating contact mechanism. Adding a desktop floating WhatsApp button at `bottom: 24px; right: 24px;` that seamlessly hides or adapts on mobile will capture high-intent inbound inquiries.
6. **Data Integrity & Contact Hygiene Compliance**: To satisfy the non-negotiable acceptance criteria, the 14 pages currently omitting `+91 95972 28975` in their top bar and footer must be updated to include both numbers: `<a href="tel:+919597228969">+91 95972 28969</a> / <a href="tel:+919597228975">+91 95972 28975</a>`.

---

## 3. Caveats

1. **Redirect Stubs**: The 11 redirect stubs (`products/chiller.html`, `locations/hosur-industrial-chillers.html`, etc.) are minimal HTML files (< 800 bytes) with immediate meta-refresh and JS redirects. They do not contain headers, footers, or CSS links, which is by design for SEO canonical preservation.
2. **Build Templates**: The files in `build/html/` and `src/templates/` are internal compilation templates for the Chrome headless PDF generation pipeline and should not be modified as part of web CRO work.
3. **Third-Party CDN**: FontAwesome 6.4.0 is loaded from Cloudflare CDN. The site relies on CDN availability for icons.

---

## 4. Conclusion

The Win Equipments website features a robust, modern CSS/JS infrastructure with pre-rendered SEO schemas and responsive tables. To maximize conversion rate (CRO) and fulfill the project criteria, the implementation team should focus on:
1. **Injecting a Desktop Sticky WhatsApp Floating Button** across all pages (while preserving the mobile dock).
2. **Reframing Product Hero CTAs** from generic "Request Factory Quote" to loss-aversion, outcome-driven copy across all 15 product pages.
3. **Updating Desktop Mega Dropdowns** to feature the 4 specialized chiller & ice machine products while respecting Hick's Law (≤ 6 items per column).
4. **Ensuring Hardcoded Mobile Docks** are present across all 15 product pages.
5. **Adding Missing Phone Number `+91 95972 28975`** to the 14 identified blog, calculator, and location pages.

---

## 5. Verification Method

To independently verify the observations in this report, run the following commands from the project root (`/Users/devasahithiyan/Desktop/Win equipments`):

```bash
# 1. Verify file counts and presence of target specialized product pages
ls -la products/acid-cooling-chillers.html products/anodizing-chillers.html products/ice-flake-machines.html products/medical-scan-chillers.html

# 2. Verify absence of banned numbers (must return 0 matches)
grep -rnE "(95972\s*28978|(0422[\s-]*)?2562975)" . --include="*.html"

# 3. Verify the 14 pages missing +91 95972 28975
python3 -c '
import glob, re
for f in sorted(glob.glob("*.html") + glob.glob("*/*.html")):
    c = open(f).read()
    if "http-equiv=\"refresh\"" not in c and not re.search(r"95972\s*28975", c):
        print("Missing 28975:", f)
'

# 4. Verify all catalogue PDF links are valid files on disk
python3 -c '
import glob, os, re
for f in sorted(glob.glob("*.html") + glob.glob("*/*.html")):
    for link in re.findall(r"href=[\"\x27]([^\"]*?\.pdf)[\"\x27]", open(f).read()):
        target = os.path.normpath(os.path.join(os.path.dirname(f), link))
        assert os.path.exists(target), f"Broken PDF link: {link} in {f}"
print("All catalogue PDF links verified functional!")
'

# 5. Verify zero broken internal links across all HTML files
python3 -c '
import glob, os, re
for f in sorted(glob.glob("*.html") + glob.glob("*/*.html")):
    for href in re.findall(r"href=[\"\x27]([^\"]+)[\"\x27]", open(f).read()):
        if href.startswith(("#", "tel:", "mailto:", "http", "javascript:", "/")): continue
        target = os.path.normpath(os.path.join(os.path.dirname(f), href.split("#")[0].split("?")[0]))
        assert os.path.exists(target), f"Broken link: {href} in {f}"
print("Zero broken internal links across all 56 pages!")
'
```

---

## Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Site Infrastructure | Unified Design System | Centralized CSS tokens for brand colors (`#0E2540`, `#0284C7`, `#E65100`), typography, spacing | Linked in `<head>` | Applied styling | Fallback system fonts | `css/design-system.css` |
| 2 | Site Infrastructure | Core Component Library | Shared styles for top bar, zero-CLS nav, spec tables, calculators, footer | Linked in `<head>` | Rendered widgets | Degrades gracefully | `css/components.css` |
| 3 | Navigation | Zero-CLS Mega Dropdown | 2-column mega dropdown for Products (Air Treatment: 6 items; Process Cooling: 5 items) | User hover/focus | Flyout dropdown | Standard link fallback | `index.html:200` |
| 4 | Navigation | Contextual Flat Nav | Streamlined header nav on 14 product pages with direct tool & contact links | User clicks | Targeted navigation | None | `products/*.html` |
| 5 | Mobile Conversion | Mobile Conversion Dock | Sticky bottom dock with Call, WhatsApp, and RFQ actions | Mobile viewport (≤768px) | Fixed bottom bar | Hidden on >768px | `css/components.css:970` |
| 6 | Mobile Navigation | Mobile Nav Drawer | Off-canvas sliding navigation menu with all 15 product lines & engineering tools | Mobile hamburger toggle | Slide-in drawer | ARIA-hidden fallback | `js/main.js:105` |
| 7 | Lead Generation | Loss-Aversion Hero CTAs | High-intent outcome-oriented buttons to replace generic "Request Quote" | Buyer interaction | Scrolls to RFQ form | Native anchor scroll | `ORIGINAL_REQUEST.md` |
| 8 | Conversion | Sticky WhatsApp Float | Desktop/tablet floating WhatsApp button for instant direct engineering contact | User click on WhatsApp icon | Opens WhatsApp chat (`wa.me/919597228969`) | Opens new tab | `ORIGINAL_REQUEST.md` |
| 9 | Authority / Proof | Above-the-Fold Proof Bar | Displays 15+ years heritage, 3,500+ installations, ISO 9001:2015, TrustSEAL rating | Page render | Metric cards | Pre-rendered static HTML | `index.html:430` |
| 10 | Engineering Tools | Interactive Calculators | Thermodynamic sizing tools for CFM, Chiller TR, Cooling Towers, and Energy Losses | User input values | Calculated sizing / kW | Thermodynamic range validation | `js/calculators.js` |
| 11 | Data Integrity | Dual Phone Display | Header and footer display of both plant lines (`+91 95972 28969` / `+91 95972 28975`) | Click to call | Triggers phone dialer | None | `ORIGINAL_REQUEST.md` |
| 12 | Data Integrity | Banned Number Ban | Complete exclusion of defunct numbers `9597228978` and `2562975` | Text scanning | Clean contact text | Validation error if present | Codebase regex scan |
| 13 | Data Integrity | Catalogue PDF Downloads | Direct download buttons linking to high-resolution brochures in `catlogue/` | User click on PDF link | PDF download / view | Verified 100% on disk | `catlogue/*.pdf` |
| 14 | SEO / Architecture | 301 / Meta-Refresh Stubs | 11 legacy URL redirect stubs preserving search engine equity and old bookmarks | Inbound URL request | Instant redirect to new URL | Fallback manual link | `products/*.html` |

---

## Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Mobile Conversion Dock | Desktop viewport (> 768px) | Dock is hidden via `display: none;`. Desktop users currently have no sticky floating contact CTA. |
| 2 | Mobile Conversion Dock | Product pages without hardcoded dock HTML | Dynamically injected at runtime via `js/main.js` (`initMobileConversionDock()`). If JS is slow/disabled, dock is delayed. |
| 3 | Navigation Mega Dropdown | User seeking specialized chillers or ice machines | Not found in desktop dropdown menu. Only discoverable via homepage grid, industrial chiller page, or mobile menu. |
| 4 | Phone Number Uniformity | Visitor inspecting blog posts or energy calculator | Only `+91 95972 28969` is displayed; `+91 95972 28975` is omitted on 14 pages. |
| 5 | Screen Orientation Change | Device rotated between portrait (<= 768px) and landscape (> 768px) | Media queries toggle mobile dock display and adjust body bottom padding (`calc(75px + env(safe-area-inset-bottom))`). |
| 6 | Direct Answer Snippets | Google AI Overview / Featured Snippet crawling | Structured paragraph with bold keyword anchors directly answering engineering definitions. |
| 7 | Freeze-Pane Spec Tables | Mobile viewport horizontal scrolling | Sticky first column remains fixed while remaining spec columns scroll horizontally. |
