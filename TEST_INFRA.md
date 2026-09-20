# Win Equipments Conversion Rate Optimization (CRO) & Web UX
# End-to-End Test Infrastructure Specification (`TEST_INFRA.md`)

**Document Version**: 2.0.0 (CRO & Web Architecture Track)  
**Author**: E2E Verification & Test Suite Architect  
**Target Repository**: `/Users/devasahithiyan/Desktop/Win equipments`  
**Test Suite Path**: `/Users/devasahithiyan/Desktop/Win equipments/tests/test_cro_e2e.py`  
**Authoritative Request**: `ORIGINAL_REQUEST.md` (`## 2026-09-20T10:14:26Z`)  
**Baseline Status**: 111 Passed / 36 Failed (2.0s execution time)

---

## 1. Dual-Track Opaque-Box Testing Architecture

### 1.1 Philosophical Foundation & Decoupling
The Win Equipments CRO project employs a **Dual-Track Opaque-Box (Black-Box)** testing architecture. Under this model:
- **Implementation Track (Workers/Reviewers)**: Translates conversion psychology, industrial buyer behavior, and UX research into direct edits within `index.html`, `products/*.html`, `css/components.css`, `css/design-system.css`, and `js/main.js`.
- **Verification Track (Architect/Test Suite/Auditor)**: Operates strictly outside implementation internals. It evaluates the web artifacts as an external browser, search engine crawler, or industrial procurement officer would observe them.

```
+─────────────────────────────────────────────────────────────────────────────+
|                         AUTHORITATIVE REQUIREMENTS                          |
|   - ORIGINAL_REQUEST.md (## 2026-09-20T10:14:26Z): CRO, Psychology & UX     |
|   - PROJECT.md: Site Architecture, Design System & Asset Contracts          |
+─────────────────────────────────────────────────────────────────────────────+
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
+──────────────────────────────────────+  +───────────────────────────────────+
|         IMPLEMENTATION TRACK         |  |         VERIFICATION TRACK        |
| - Shared CSS (css/components.css)    |  | - Independent Test Harness        |
| - Shared JS (js/main.js)             |  | - tests/test_cro_e2e.py (Pytest)  |
| - Homepage (index.html)              |  | - DOM & AST Inspection (bs4)      |
| - 15 Canonical Product Pages         |  | - Regular Expression Scanners     |
| - 4 Mandatory Specialized Products   |  | - CSS Tokenizer & Boundary Parser |
+──────────────────────────────────────+  +───────────────────────────────────+
            │                                                     │
            └──────────────────────────┬──────────────────────────┘
                                       ▼
+─────────────────────────────────────────────────────────────────────────────+
|                          INDEPENDENT QUALITY GATE                           |
|   - 100% Pass across Tiers 1-4 before production deployment                 |
|   - Zero Broken Links (Internal & PDF)                                      |
|   - Binary Veto on Banned Phone Numbers or Missing Specialized Pages        |
+─────────────────────────────────────────────────────────────────────────────+
```

### 1.2 Core Architectural Principles
1. **Zero Implementation Coupling**: Tests parse raw HTML and CSS ASTs without relying on runtime server states or internal build variables. Tests execute in under 2.5 seconds using Python `pytest`, `beautifulsoup4`, and standard `re`.
2. **Deterministic & Headless Execution**: Zero network dependencies, zero flaky timers, zero external browser driver crashes. Can be run locally, in CI/CD, or by autonomous agents.
3. **Exhaustive Site Graph Traversal**: The test harness audits all 56 site HTML files (45 content pages + 11 redirect stubs), all active stylesheets, and all PDF links in `catlogue/`.
4. **Binary Veto Integrity Gate**: Strict compliance on contact numbers (`+91 95972 28969` / `+91 95972 28975`), zero occurrences of banned numbers (`9597228978`, `2562975`), and zero 404 links.

---

## 2. 4-Tier Verification Framework

The test harness categorizes all verification into four progressive tiers:

```
+─────────────────────────────────────────────────────────────────────────────+
|                 TIER 4: CONTACT HYGIENE & DATA INTEGRITY                     |
|   - Both authorized phone numbers (+91 95972 28969 / 28975) on all pages    |
|   - Zero occurrences of banned numbers (9597228978, 2562975) anywhere       |
|   - Preservation of 4 new specialized product pages (>20KB, valid specs)    |
|   - Corporate NAP (Name, Address, Email) and ISO accreditation consistency  |
+─────────────────────────────────────────────────────────────────────────────+
                                       ▲
+─────────────────────────────────────────────────────────────────────────────+
|                 TIER 3: CROSS-FEATURE & INTEGRATION                         |
|   - 100% of internal HTML hyperlinks resolve to real files (zero 404s)      |
|   - All catalogue/*.pdf links resolve to verified disk PDFs                 |
|   - Legacy redirect stubs (11 files) resolve to existing canonical targets  |
|   - Static assets (images, fonts, stylesheets, scripts) exist and link      |
+─────────────────────────────────────────────────────────────────────────────+
                                       ▲
+─────────────────────────────────────────────────────────────────────────────+
|                 TIER 2: BOUNDARY & CORNER CASES                             |
|   - Standard media query breakpoints (<= 768px, <= 480px) in CSS            |
|   - Touch targets >= 44px min-height (>= 48px hit area with padding)        |
|   - Floating controls non-overlapping (body padding-bottom clearance)       |
|   - Stacking order hierarchy (z-index: Base < Header < Dock < Float < Modal)|
|   - iOS safe-area-inset-bottom support (env(safe-area-inset-bottom))        |
+─────────────────────────────────────────────────────────────────────────────+
                                       ▲
+─────────────────────────────────────────────────────────────────────────────+
|                 TIER 1: FEATURE COVERAGE (>= 5 TCs Per Feature)             |
|   Feature 1: Universal WhatsApp Sticky Button (https://wa.me/919597228969)  |
|   Feature 2: Hero Loss-Aversion & Outcome CTAs across all 15 product pages  |
|   Feature 3: Above-the-fold Social Proof & Trust Metrics on index.html      |
|   Feature 4: Mobile Sticky CTA Dock (Call + WhatsApp) on all product pages  |
+─────────────────────────────────────────────────────────────────────────────+
```

---

## 3. Tier-by-Tier Assertion Specifications

### 3.1 Tier 1: Feature Coverage (>= 5 Test Cases Per Feature)

#### Feature 1: Universal WhatsApp Sticky Button
- **TC-1.1: Universal Page Existence (`test_tc1_1_whatsapp_button_presence_on_all_content_pages`)**
  - **Scope**: All 45 non-redirect content HTML pages across `root/`, `products/`, `blog/`, `engineering-tools/`, `industries/`, and `locations/`.
  - **Assertion**: Every content page must contain at least one anchor element targeting WhatsApp with telephone number `919597228969`.
- **TC-1.2: Canonical URL Targeting (`test_tc1_2_whatsapp_canonical_url_format`)**
  - **Scope**: Every WhatsApp link on any page.
  - **Assertion**: URL must match `https://wa.me/919597228969` (or `https://api.whatsapp.com/send?phone=919597228969`), optionally appending encoded query parameters (`?text=...`).
- **TC-1.3: Security & Tab Isolation (`test_tc1_3_whatsapp_security_and_tab_attributes`)**
  - **Scope**: All WhatsApp anchor tags.
  - **Assertion**: Must declare `target="_blank"` and `rel` attribute containing `noopener` (or `noopener noreferrer`) to protect against reverse tabnabbing and window.opener hijacking.
- **TC-1.4: Accessible Labeling & Visual Cue (`test_tc1_4_whatsapp_accessible_labeling_and_icon`)**
  - **Scope**: All WhatsApp button elements.
  - **Assertion**: Anchor must contain non-empty descriptive text, `aria-label`, or `title` (e.g., "WhatsApp", "Chat with Us", "Technical Support") and contain an icon (`fa-whatsapp` or inline SVG).
- **TC-1.5: Fixed / Sticky CSS Positioning Hook (`test_tc1_5_whatsapp_floating_css_definition`)**
  - **Scope**: `css/components.css`.
  - **Assertion**: CSS must define `.floating-whatsapp`, `.whatsapp-float`, or `.dock-whatsapp` with `position: fixed` or `position: sticky`.

#### Feature 2: Hero Loss-Aversion & Outcome CTAs
- **TC-2.1: Universal Product Hero Detection (`test_tc2_1_product_page_hero_section_exists`)**
  - **Scope**: All 15 canonical product pages.
  - **Assertion**: Page contains a primary hero container (`.hero`, `.hero-industrial`, `.grid-split-hero`, or top `<main>`) situated above technical specifications and freeze-pane tables.
- **TC-2.2: Interactive Primary CTA Element (`test_tc2_2_hero_contains_interactive_cta_element`)**
  - **Scope**: All 15 product hero sections.
  - **Assertion**: Contains at least one primary call-to-action anchor or button styled with `.btn-cta`, `.btn-primary`, or `.hero-actions`.
- **TC-2.3: Loss-Aversion & Outcome Copy (`test_tc2_3_hero_cta_loss_aversion_or_outcome_copy`)**
  - **Scope**: Primary hero CTA text across all 15 product pages.
  - **Assertion**: Must **NOT** be passive/generic text such as `"Request Quote"` or `"Request Factory Quote"`. Must match outcome-focused or loss-aversion terminology:
    - *Loss Aversion*: `Stop`, `Prevent`, `Protect`, `Eliminate`, `Avoid`, `Zero`, `Cut`, `Downtime`, `Damage`.
    - *Outcome Framing*: `Sizing & Price`, `Calculate Savings`, `Direct Manufacturer Pricing`, `Guarantee`.
- **TC-2.4: Conversion Destination Actionability (`test_tc2_4_hero_cta_destination_actionability`)**
  - **Scope**: Primary hero CTA `href` attribute.
  - **Assertion**: `href` must target a functional conversion endpoint (e.g., `#rfq-section`, `#quick-rfq`, `contactus.html#rfq`, `tel:...`, or `wa.me/...`). Must **NOT** be empty or unlinked placeholder `#`.
- **TC-2.5: Contrast & Visual Hierarchy (`test_tc2_5_hero_visual_prominence_classes`)**
  - **Scope**: Primary CTA markup.
  - **Assertion**: Primary CTA must carry high-contrast visual styling classes (`btn-cta`, `btn-primary`, `btn-lg`) distinguishing it from secondary options (such as "Technical Specs (PDF)").

#### Feature 3: Above-the-Fold Social Proof on `index.html`
- **TC-3.1: Hero Container Above Fold (`test_tc3_1_index_hero_above_the_fold_exists`)**
  - **Scope**: `index.html`.
  - **Assertion**: `.hero-industrial` or equivalent hero block is the first major section inside `<main>`.
- **TC-3.2: Quantified Installation & Track Record (`test_tc3_2_index_quantitative_installation_metric`)**
  - **Scope**: Text content within hero block.
  - **Assertion**: Contains verified quantitative proof metrics (e.g., `"3,500+ Regional & Global Installs"`, `"500+ installations"`, or `"100% Factory Run-Tested"`).
- **TC-3.3: Direct Manufacturer & Longevity Proof (`test_tc3_3_index_direct_manufacturer_and_longevity_signals`)**
  - **Scope**: Hero badges and subtitle.
  - **Assertion**: Verifies direct manufacturer signals (`"Direct Manufacturer"`, `"Arasur Works"`, `"Est. 2008"`).
- **TC-3.4: Third-Party Quality Accreditation (`test_tc3_4_index_iso_quality_certification_badge`)**
  - **Scope**: Hero badge row.
  - **Assertion**: Prominently displays `"ISO 9001:2015 Certified"`.
- **TC-3.5: Industrial Sector Breadth (`test_tc3_5_index_industrial_applications_sectors`)**
  - **Scope**: Above-the-fold or immediate interactive matcher.
  - **Assertion**: References key industrial applications (CNC Machining, Textiles, Laser Cutting, Plastic Molding).

#### Feature 4: Mobile Sticky CTA Dock on all Product Pages
- **TC-4.1: Static Dock Markup (`test_tc4_1_mobile_dock_markup_exists_on_product_page`)**
  - **Scope**: All 15 canonical product pages.
  - **Assertion**: Page contains `<aside class="mobile-conversion-dock">` or `.mobile-cta-dock` in static HTML markup to ensure immediate rendering without JS lag.
- **TC-4.2: Direct Telephony Action (`test_tc4_2_mobile_dock_direct_call_button`)**
  - **Scope**: Mobile dock actions.
  - **Assertion**: Contains direct telephone call link targeting `tel:+919597228969` or `tel:+919597228975`.
- **TC-4.3: Direct WhatsApp Action (`test_tc4_3_mobile_dock_direct_whatsapp_button`)**
  - **Scope**: Mobile dock actions.
  - **Assertion**: Contains direct WhatsApp link targeting `https://wa.me/919597228969`.
- **TC-4.4: Responsive Media Query Activation (`test_tc4_4_mobile_dock_css_media_query_activation`)**
  - **Scope**: `css/components.css`.
  - **Assertion**: Within `@media (max-width: 768px)`, `.mobile-conversion-dock` has `display: block !important` or `display: flex !important` and `position: fixed; bottom: 0; width: 100%`.
- **TC-4.5: Desktop Viewport Suppression (`test_tc4_5_mobile_dock_css_desktop_suppression`)**
  - **Scope**: `css/components.css`.
  - **Assertion**: Default styling for `.mobile-conversion-dock` specifies `display: none` for desktop screens (> 768px).

---

### 3.2 Tier 2: Boundary & Corner Cases

- **TC-B.1: Responsive Breakpoint Integrity (`test_tier2_viewport_media_queries_integrity`)**
  - Validates `@media (max-width: 768px)` and mobile breakpoints in `css/components.css` without syntax errors.
- **TC-B.2: Touch Target Ergonomics (`test_tier2_touch_target_dimensions_in_css`)**
  - Confirms `.dock-btn` declares `min-height: >= 44px` (with padding providing >= 48px effective hit area per WCAG 2.5.5 and Fitts's Law).
- **TC-B.3: Non-Overlapping Floating Controls (`test_tier2_non_overlapping_floating_controls`)**
  - Asserts that when the bottom dock is active on mobile (`<= 768px`), `body` has bottom clearance padding (`padding-bottom: calc(75px + env(safe-area-inset-bottom, 0px))`), preventing floating buttons or fixed docks from obscuring content.
- **TC-B.4: Stacking Hierarchy (`test_tier2_z_index_stacking_hierarchy`)**
  - Asserts `.mobile-conversion-dock` specifies `z-index: >= 900` to sit above page content and below modal dialogs / navigation overlays (`z-index: 10000+`).
- **TC-B.5: iOS Safe Area Inset Support (`test_tier2_safe_area_inset_support`)**
  - Asserts `env(safe-area-inset-bottom)` is integrated into mobile padding to avoid iPhone Home Indicator clipping.

---

### 3.3 Tier 3: Cross-Feature & Integration

- **TC-I.1: Zero Broken Internal Links (`test_tier3_all_internal_links_resolve_without_404`)**
  - Traverses all 56 site HTML files and validates 100% of relative `<a href="...">` links against existing files on disk. (Currently 0 broken links).
- **TC-I.2: All Catalogue PDF Links Intact (`test_tier3_all_catalogue_pdf_links_resolve_to_real_files`)**
  - Validates 76 internal links referencing `catlogue/*.pdf` resolve to real files on disk across all 12 publication PDFs.
- **TC-I.3: Legacy Redirect Stubs Integrity (`test_tier3_redirect_stubs_integrity`)**
  - Validates all 11 legacy redirect stub files specify real destination HTML files that exist on disk.

---

### 3.4 Tier 4: Contact Hygiene & Data Integrity

- **TC-H.1: Both Authorized Phone Numbers Presence (`test_tier4_presence_of_both_authorized_phone_numbers`)**
  - Checks all 45 content HTML files for the presence of both `+91 95972 28969` (or `28969`) and `+91 95972 28975` (or `28975`).
- **TC-H.2: Zero Occurrences of Banned Numbers (`test_tier4_zero_occurrences_of_banned_phone_numbers`)**
  - Recursively scans all `.html`, `.css`, and `.js` files. Enforces ZERO occurrences of `9597228978` or `2562975`.
- **TC-H.3: Preservation of 4 Mandatory New Product Pages (`test_tier4_preservation_of_four_new_product_pages`)**
  - Verifies that:
    1. `products/acid-cooling-chillers.html`
    2. `products/anodizing-chillers.html`
    3. `products/ice-flake-machines.html`
    4. `products/medical-scan-chillers.html`
    Exist, are NOT redirect stubs, have file size > 20,000 bytes, and contain valid contact numbers.
- **TC-H.4: Corporate NAP Consistency (`test_tier4_corporate_nap_consistency`)**
  - Confirms company legal identity on `index.html`: "Win Equipments", Arasur Works address, and `info@winequipments.com`.

---

## 4. Test Suite Execution Instructions

### 4.1 Running the Full Test Suite
To execute the complete E2E test suite:
```bash
pytest tests/test_cro_e2e.py -v
```

### 4.2 Running Specific Tiers
To execute by tier or feature:
```bash
# Run Tier 1 Feature Coverage only
pytest tests/test_cro_e2e.py -k "TestTier1" -v

# Run WhatsApp sticky button tests
pytest tests/test_cro_e2e.py -k "TestTier1WhatsAppStickyButton" -v

# Run Hero loss-aversion CTA tests
pytest tests/test_cro_e2e.py -k "TestTier1HeroLossAversionCTA" -v

# Run Mobile sticky dock tests
pytest tests/test_cro_e2e.py -k "TestTier1MobileStickyCTADock" -v

# Run Tier 2 Boundary & Corner cases
pytest tests/test_cro_e2e.py -k "TestTier2" -v

# Run Tier 3 Link & PDF Integration
pytest tests/test_cro_e2e.py -k "TestTier3" -v

# Run Tier 4 Contact Hygiene & Banned Number Audit
pytest tests/test_cro_e2e.py -k "TestTier4" -v
```

---

## 5. Pre-Implementation Empirical Baseline

Running `pytest tests/test_cro_e2e.py -v` prior to Phase 2 changes established the following baseline:
- **Total Tests Executed**: 147 tests
- **Tests Passing**: 111 passed (75.5%)
- **Tests Failing**: 36 failed (24.5%)
- **Execution Duration**: 1.98 seconds

### 5.1 Analysis of the 36 Failures & Actionable Remediation

| Failure Group | Count | Cause | Target Files | Remediation for Workers |
|---|---|---|---|---|
| **WhatsApp Button Coverage** | 2 | Only 13/45 content pages contain WhatsApp anchor; some existing anchors lack `target="_blank"` / `rel="noopener"` | All 32 missing content pages (blog, tools, locations, industries) | Add floating WhatsApp button or include in footer/navigation template |
| **Hero Loss-Aversion CTAs** | 15 | All 15 canonical product pages currently use generic `"Request Factory Quote"` | All 15 canonical product pages in `products/*.html` | Update hero CTA button copy to outcome-focused loss-aversion text (e.g., `"Stop Paying for Moisture Damage — Get Sizing & Price"`) |
| **Mobile Sticky CTA Dock** | 18 | 6 product pages lack static `<aside class="mobile-conversion-dock">` markup | `air-receiver-tanks.html`, `automatic-drain-valves.html`, `compressed-air-filters.html`, `desiccant-air-dryers.html`, `industrial-aftercoolers.html`, `spare-parts-consumables.html` | Add static mobile dock markup with Call (`+919597228969`) and WhatsApp (`wa.me/919597228969`) before `</body>` |
| **Contact Hygiene** | 1 | `engineering-tools/compressed-air-energy-calculator.html` has `28969` but is missing second phone `28975` | `engineering-tools/compressed-air-energy-calculator.html` | Add `+91 95972 28975` into the top utility bar / footer contact block |

### 5.2 Areas Already 100% Compliant
1. **Tier 1 Social Proof on `index.html`**: 5/5 PASSED. Hero displays "3,500+ Regional & Global Installs", "Est. 2008", "ISO 9001:2015 Certified", and industrial sectors.
2. **Tier 2 Boundary & Ergonomics**: 5/5 PASSED. Media queries at `768px`, dock button touch targets >= 44px, safe area insets, and z-index >= 900.
3. **Tier 3 Link & PDF Graph**: 3/3 PASSED. 0 broken internal links, 76/76 PDF links valid, 11/11 redirect stubs intact.
4. **Tier 4 Banned Numbers & New Pages**: 3/4 PASSED. 0 banned numbers anywhere in web files; all 4 mandatory specialized product pages (`acid-cooling-chillers.html`, `anodizing-chillers.html`, `ice-flake-machines.html`, `medical-scan-chillers.html`) intact with >20KB content.

---

## 6. Release Gate Protocol

Before any changes are committed or considered complete:
1. `pytest tests/test_cro_e2e.py` must achieve **147 / 147 tests passing (100%)**.
2. Python execution must complete in `< 5.0 seconds` with zero warnings.
3. Git diff must confirm zero changes to existing `catlogue/*.pdf` links.
4. Independent verification agent (Auditor / Challenger) must rerun the test suite directly from shell.
