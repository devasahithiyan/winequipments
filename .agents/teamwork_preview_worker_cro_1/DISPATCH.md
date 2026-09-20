## 2026-09-20T10:24:02Z

You are the Primary Implementation Worker for the Win Equipments CRO and UX enhancement project.
Your working directory is: /Users/devasahithiyan/Desktop/Win equipments/.agents/teamwork_preview_worker_cro_1/
Authoritative Request: Read /Users/devasahithiyan/Desktop/Win equipments/.agents/ORIGINAL_REQUEST.md (specifically the request under ## 2026-09-20T10:14:26Z) before starting work.
Project Root: /Users/devasahithiyan/Desktop/Win equipments

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Key Inputs & Specifications to Read:
1. /Users/devasahithiyan/Desktop/Win equipments/RESEARCH_AND_CRO_PLAN.md (Comprehensive research plan, copy formulas, 10 psychology principles, buyer journey)
2. /Users/devasahithiyan/Desktop/Win equipments/TEST_INFRA.md (E2E test suite specifications and tier definitions)
3. /Users/devasahithiyan/Desktop/Win equipments/.agents/teamwork_preview_spec_miner_cro_survey_1/handoff.md (Detailed site survey, exact file inventory, injection points, and defect report)
4. /Users/devasahithiyan/Desktop/Win equipments/tests/test_cro_e2e.py (Executable E2E test suite)

Your Tasks:
1. Universal WhatsApp Floating Button:
   - Add `.floating-whatsapp-btn` CSS in `css/components.css` (fixed bottom: 24px, right: 24px; z-index: 1000; background: #25D366; color: white; display: flex; align-items: center; gap: 8px; border-radius: 50px; padding: 12px 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); font-weight: 600; text-decoration: none;).
   - In mobile viewports (`<= 768px`), ensure it does not overlap with the mobile conversion dock (e.g. elevate to `bottom: 80px;` or adjust cleanly).
   - Inject the floating button into ALL 45 content HTML pages (href: `https://wa.me/919597228969`, target="_blank", rel="noopener", aria-label="Chat on WhatsApp with Win Equipments", containing FontAwesome icon and label).

2. Mobile Conversion Dock & Fitts's Law:
   - In `css/components.css`, update `.dock-btn` to have `min-height: 48px;` (Fitts's Law / WCAG AAA compliance).
   - Ensure iOS safe area inset `env(safe-area-inset-bottom, 0px)` is properly integrated.
   - Ensure ALL 15 canonical product pages in `products/*.html` have the static `<aside class="mobile-conversion-dock">` with Call (`tel:+919597228969`) and WhatsApp (`https://wa.me/919597228969`) buttons.

3. Product Hero Loss-Aversion CTAs & F-Pattern Specs:
   - In ALL 15 canonical product pages (`products/*.html`), replace generic "Request Factory Quote" hero CTAs with the researched loss-aversion & outcome-focused CTAs from `RESEARCH_AND_CRO_PLAN.md § 3.2`:
     * Refrigerated Dryers: "Stop Paying for Moisture Damage — Get Sizing & Direct Price"
     * Desiccant Dryers: "Eliminate Sub-Zero Freeze-Ups & Corrosion — Get -40°C Sizing"
     * Process Chillers: "Prevent Thermal Downtime & Mold Warping — Get Direct Sizing"
     * Anodizing Chillers: "Stop Acid Bath Burning & Reject Batches — Get Anodizing Sizing"
     * Medical Scan Chillers: "Eliminate Helium Quench & MRI Downtime — Get 24/7 Redundant Specs"
     * Acid Cooling Chillers: "Prevent Titanium/Hastelloy Acid Leaks — Get Chemical Sizing"
     * Ice Flake Machines: "Eliminate Spoilage & Sub-Standard Ice — Get Factory Tonnage Sizing"
     * Cooling Towers (Round & Square): "Stop Scaling & High Legionella Drift — Get Tower Sizing"
     * Closed Circuit Cooling Towers: "Zero Process Contamination — Protect Your Sealed Heat Exchangers"
     * Air Receiver Tanks: "Prevent Pressure Fluctuations & Compressor Short-Cycling"
     * Compressed Air Filters: "Stop Oil Aerosols & Pipe Scale Downstream — Get 0.01μ Sizing"
     * Automatic Drain Valves: "Stop Wasting Compressed Air & Prevent Water Inundation"
     * Aftercoolers: "Knock Out 70% Condensate at Discharge — Protect Air Treatment"
     * Spares & Consumables: "Direct OEM Fitment — Zero Counterfeits & Fast Dispatch"

4. Navigation Dropdown Hick's Law Optimization:
   - In `index.html` (and shared navs), restructure the mega dropdown into 3 clean columns (<= 6 items per column) so all products, including the 4 specialized chiller/ice flake products, are logically discoverable without cognitive overload:
     * Col 1: Compressed Air Treatment (6 items: Refrigerated Air Dryers, Desiccant Air Dryers, Compressed Air Filters, Automatic Drain Valves, Air Receiver Tanks, Aftercoolers)
     * Col 2: Industrial Process Cooling (5 items: Industrial Process Chillers, Anodizing Chillers, Medical Scan Chillers, Acid Cooling Chillers, Ice Flake Machines)
     * Col 3: Cooling Towers & Spares (4 items: Round Cooling Towers, Square Cooling Towers, Closed Circuit Towers, Spares & Consumables)

5. Homepage Above-the-Fold Social Proof & Reciprocity:
   - In `index.html`:
     * Ensure prominent above-the-fold social proof badge / metrics: "500+ Industrial Installations across Tamil Nadu & South India", "3,500+ Regional & Global Installs", "Direct Manufacturer — No Middlemen", "ISO 9001:2015 Certified".
     * Promote Reciprocity: highlight free engineering tools ("Free CFM & Chiller Sizing Calculators — No Registration Required").

6. Contact Hygiene & Integrity Constraints:
   - Ensure `+91 95972 28975` is restored to all 14 pages where it was identified missing by Survey Miner 1.
   - Preserve `+91 95972 28969` everywhere.
   - ZERO occurrences of banned numbers `9597228978` or `2562975`.
   - Zero broken internal links, all `catlogue/*.pdf` links intact.
   - Do NOT remove or alter the 4 specialized pages.

7. Verification:
   - Run `pytest tests/test_cro_e2e.py -v` and ensure ALL 147 test assertions PASS (100% pass rate).
   - Document your changes, test output, and verification commands in `/Users/devasahithiyan/Desktop/Win equipments/.agents/teamwork_preview_worker_cro_1/handoff.md`.
   - Send a brief message back upon completion with your report path.
