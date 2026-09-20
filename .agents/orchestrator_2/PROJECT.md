# Project: Win Equipments CRO and UX Enhancement

## Architecture
The project implements evidence-based conversion rate optimization (CRO), B2B buyer psychology, and UX enhancements across the Win Equipments static website (HTML/CSS/JS).

```
+-----------------------------------------------------------------------------------+
|                           RESEARCH & STRATEGY LAYER                               |
| - RESEARCH_AND_CRO_PLAN.md (10 Psychology Principles, 3 B2B Buyer Personas,       |
|   Competitor Benchmarks: Atlas Copco, Kaeser, Bry-Air, Beko)                      |
| - UX Laws: F-Pattern, Hick's Law (<= 6 items/col), Fitts's Law (>= 48px targets)  |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        SHARED STYLES & COMPONENTS LAYER                           |
| - css/components.css: .floating-whatsapp-btn, .mobile-conversion-dock (>= 48px)   |
| - Navigation Mega Dropdown: 3 columns adhering to Hick's Law                      |
| - Floating WhatsApp widget on ALL 45 functional HTML pages                        |
| - Phone hygiene (+91 95972 28969 & +91 95972 28975 on all pages)                  |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                       PRODUCT HERO & CONVERSION LAYER                             |
| - 15 Canonical Product Pages:                                                     |
|   * F-Pattern Hero Layout (Critical Specs Top-Left, Outcome CTA Top-Right)         |
|   * Loss-Aversion / Outcome CTAs (e.g. "Stop Paying for Moisture Damage")          |
|   * Static Mobile Conversion Dock on 100% of product pages (Call + WhatsApp)     |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                     HOMEPAGE TRUST, AUTHORITY & RECIPROCITY                       |
| - Above-the-fold social proof (500+ South India installs, 3500+ total)             |
| - Authority: ISO 9001:2015, Direct Manufacturer - No Middlemen, Est. 2008         |
| - Reciprocity: Free Engineering Tools (CFM/TR Calculators - No Login Required)    |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                       DUAL-TRACK E2E VERIFICATION & AUDIT                         |
| - tests/test_cro_e2e.py (147 assertions across Tiers 1-4)                         |
| - Zero broken internal links, zero broken catlogue/*.pdf links                    |
| - Zero banned numbers (9597228978, 2562975), strict data integrity preservation   |
| - Forensic Integrity Audit Gate (CLEAN verification)                              |
+-----------------------------------------------------------------------------------+
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | CRO Research & Plan | Comprehensive B2B conversion psychology, buyer personas, benchmarks | M0 (Done) | Survey (Agent 2) |
| 2 | E2E Test Suite & Harness | 147-assertion opaque-box test suite in `tests/test_cro_e2e.py` & `TEST_INFRA.md` | M0 (Done) | Survey (Agent 3) |
| 3 | Universal WhatsApp Floating Button | Floating click-to-chat button linking to `https://wa.me/919597228969` on EVERY page | M1 | ORIGINAL_REQUEST R2 |
| 4 | Mobile Sticky CTA Dock CSS & Component | Fixed bottom dock (Call + WhatsApp) visible at `<= 768px`, Fitts's Law touch target >= 48px | M1 | ORIGINAL_REQUEST R2 |
| 5 | Navigation Dropdown Hick's Law Optimization | Restructure product dropdowns into 3 columns (<= 6 items per col) including 4 specialized products | M1 | ORIGINAL_REQUEST R2 |
| 6 | Contact Number Hygiene Fix | Ensure `+91 95972 28975` is added to all 14 pages missing it | M1 | Survey (Agent 1 & 3) |
| 7 | Product Hero Loss-Aversion CTAs | Replace generic CTAs on all 15 product pages with category outcome/loss-aversion CTAs | M2 | ORIGINAL_REQUEST R2 |
| 8 | Product Hero F-Pattern Alignment | Arrange key specs top-left, outcome CTA top-right for optimal visual scanning | M2 | ORIGINAL_REQUEST R2 |
| 9 | Mobile Dock Markup on All Product Pages | Ensure static `<aside class="mobile-conversion-dock">` with Call + WA on all 15 product pages | M2 | ORIGINAL_REQUEST R2 |
| 10 | Homepage Above-the-Fold Social Proof | Installation count ("500+ installations across Tamil Nadu / South India"), sector badges | M3 | ORIGINAL_REQUEST R2 |
| 11 | Homepage Authority Signals | ISO 9001:2015 badge, "Direct Manufacturer - No Middlemen", Arasur factory trust marks | M3 | ORIGINAL_REQUEST R2 |
| 12 | Reciprocity: Engineering Tools Promotion | Prominently feature engineering calculators as free value-adds ("Free CFM Calculator — No Login Required") | M3 | ORIGINAL_REQUEST R2 |
| 13 | 100% E2E Test Pass (Tiers 1-4) | Execute and pass all 147 assertions in `tests/test_cro_e2e.py` | M4 | ORIGINAL_REQUEST AC |
| 14 | Link & Catalogue Integrity Verification | 100% internal links valid, 100% `catlogue/*.pdf` links valid | M4 | ORIGINAL_REQUEST R3 |
| 15 | Forensic Integrity & Anti-Cheating Audit | Independent forensic audit verifying genuine implementation and zero banned numbers | M4 | System Prompt |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Survey, Research & Test Architecture | Research plan (`RESEARCH_AND_CRO_PLAN.md`), site survey, E2E harness (`tests/test_cro_e2e.py`) | none | DONE |
| M1 | Core Shared Components & Styles | WhatsApp float button on all pages, mobile dock CSS (>=48px), navigation Hick's Law, phone hygiene | M0 | IN_PROGRESS |
| M2 | Product Page CRO & Hero Enhancements | 15 product heroes with loss-aversion CTAs, F-pattern specs, and static mobile docks | M1 | PLANNED |
| M3 | Homepage CRO, Authority & Reciprocity | Above-the-fold social proof, direct manufacturer signals, reciprocity calculator callouts | M1 | PLANNED |
| M4 | Final Milestone: E2E Verification & Forensic Audit | 100% E2E test pass (Tiers 1-4), link checking, phone regex audit, Forensic Auditor CLEAN gate | M1, M2, M3 | PLANNED |

## Interface Contracts
### Floating WhatsApp Widget
- HTML: `<a href="https://wa.me/919597228969" class="floating-whatsapp-btn" target="_blank" rel="noopener" aria-label="Chat on WhatsApp with Win Equipments"><i class="fab fa-whatsapp"></i><span class="whatsapp-text">WhatsApp RFQ</span></a>`
- CSS: `position: fixed; bottom: 24px; right: 24px; z-index: 1000; background: #25D366; ...`
- Mobile: At `<= 768px`, hidden or elevated to avoid colliding with `.mobile-conversion-dock`.

### Mobile Conversion Dock
- HTML:
  ```html
  <aside class="mobile-conversion-dock" aria-label="Quick contact dock">
    <div class="dock-container">
      <a href="tel:+919597228969" class="dock-btn dock-call" aria-label="Call Factory Direct">
        <i class="fas fa-phone-alt"></i><span>Call Direct</span>
      </a>
      <a href="https://wa.me/919597228969" class="dock-btn dock-whatsapp" target="_blank" rel="noopener" aria-label="WhatsApp Instant RFQ">
        <i class="fab fa-whatsapp"></i><span>WhatsApp RFQ</span>
      </a>
    </div>
  </aside>
  ```
- CSS: At `<= 768px`, `display: block !important; position: fixed; bottom: 0; left: 0; width: 100%; z-index: 999;`.
- Button touch target: `min-height: 48px;`.

### Hero Outcome / Loss-Aversion CTAs
- Primary CTA must use outcome or loss-aversion framing (e.g., "Stop Moisture Damage", "Prevent Thermal Downtime", "Protect Compressed Air Lines").
- Anchored to `#rfq-section` or inquiry modal.

## Code Layout
- CSS: `/Users/devasahithiyan/Desktop/Win equipments/css/components.css`, `css/design-system.css`
- Core Pages: `/Users/devasahithiyan/Desktop/Win equipments/*.html`
- Product Pages: `/Users/devasahithiyan/Desktop/Win equipments/products/*.html`
- Blog Pages: `/Users/devasahithiyan/Desktop/Win equipments/blog/*.html`
- Tools Pages: `/Users/devasahithiyan/Desktop/Win equipments/engineering-tools/*.html`
- Tests: `/Users/devasahithiyan/Desktop/Win equipments/tests/test_cro_e2e.py`
