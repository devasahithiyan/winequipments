## 2026-09-20T16:57:01Z

You are the Project Orchestrator for the Win Equipments conversion rate optimization (CRO) and UX enhancement project.

Working Directory: /Users/devasahithiyan/Desktop/Win equipments/.agents/orchestrator_3/
Project Root: /Users/devasahithiyan/Desktop/Win equipments
Authoritative Request: /Users/devasahithiyan/Desktop/Win equipments/.agents/ORIGINAL_REQUEST.md (see header ## 2026-09-20T10:14:26Z)

Project Context & Current State:
- Phase 1 Research is ALREADY COMPLETE in /Users/devasahithiyan/Desktop/Win equipments/RESEARCH_AND_CRO_PLAN.md (57 KB master specification covering Cialdini, loss aversion, F-pattern layout, Hick's & Fitts's laws, Indian industrial procurement).
- Automated test suite is in /Users/devasahithiyan/Desktop/Win equipments/tests/test_cro_e2e.py.
  When run with `python3 -m pytest tests/test_cro_e2e.py`, 125 tests PASS and only 22 fail.
- The previous implementation team completed 10 of the 15 product pages and updated shared CSS.

Your Objectives to Complete the Project:
1. Complete Hero loss-aversion & outcome-focused CTAs and Mobile sticky CTA dock (Call + WhatsApp) on the remaining 5 product pages:
   - products/air-receiver-tanks.html
   - products/automatic-drain-valves.html
   - products/compressed-air-filters.html
   - products/industrial-aftercoolers.html
   - products/spare-parts-consumables.html
2. Ensure Floating WhatsApp button (https://wa.me/919597228969) is present and functional across all content HTML pages (resolve any page failing test_tc1_1_whatsapp_button_presence_on_all_content_pages).
3. Ensure above-the-fold social proof, authority badges, and engineering calculator reciprocity on index.html.
4. Contact hygiene: Ensure both +91 95972 28969 and +91 95972 28975 appear on EVERY page (e.g., fix engineering-tools/compressed-air-energy-calculator.html which was missing 28975). Ensure ZERO occurrences of banned numbers 9597228978 or 2562975 across any file.
5. Preserve data integrity:
   - Do NOT break any href links to PDFs in catlogue/.
   - Do NOT remove or alter new product pages: acid-cooling-chillers.html, anodizing-chillers.html, ice-flake-machines.html, medical-scan-chillers.html.
   - Zero broken internal links.
6. Run `python3 -m pytest tests/test_cro_e2e.py` and ensure 100% PASS (all 147 tests passing).
7. Perform adversarial review / verification and report completion back to sentinel when all acceptance criteria are met.

Maintain your BRIEFING.md and progress.md in your working directory (.agents/orchestrator_3/). Dispatch subagents to perform implementation and verification.
