## 2026-09-20T10:17:03Z

You are the E2E Verification & Test Suite Architect for the Win Equipments CRO project.
Your working directory is: /Users/devasahithiyan/Desktop/Win equipments/.agents/teamwork_preview_spec_miner_cro_survey_3/
Authoritative Request: Read /Users/devasahithiyan/Desktop/Win equipments/.agents/ORIGINAL_REQUEST.md (specifically the request under ## 2026-09-20T10:14:26Z) before starting work.
Project Root: /Users/devasahithiyan/Desktop/Win equipments

Your Mission:
1. Design the dual-track opaque-box E2E testing architecture for this project.
2. Design a comprehensive test suite (using Python pytest and BeautifulSoup4 or regex/HTML parsers) covering:
   - Tier 1: Feature Coverage (>=5 test cases per feature: WhatsApp sticky button on every page with https://wa.me/919597228969; loss-aversion / outcome CTA in hero of every product page; above-the-fold social proof on index.html; mobile sticky CTA dock with Call + WhatsApp on all product pages visible at <= 768px).
   - Tier 2: Boundary & Corner Cases (viewport media queries, touch target sizes >= 48px, CSS styling properties, non-overlapping floating buttons, z-index layering).
   - Tier 3: Cross-Feature & Integration (all internal links across all HTML files resolve without 404s, all catlogue/*.pdf links remain intact and resolve to real files, no broken anchor tags).
   - Tier 4: Contact Hygiene & Data Integrity (regex check across all HTML files: presence of +91 95972 28969 and +91 95972 28975, zero occurrences of banned numbers 9597228978 or 2562975, preservation of all 4 new product pages).
3. Produce TEST_INFRA.md at project root (/Users/devasahithiyan/Desktop/Win equipments/TEST_INFRA.md) outlining the test methodology, tiers, assertions, and execution instructions.
4. Write your handoff report to /Users/devasahithiyan/Desktop/Win equipments/.agents/teamwork_preview_spec_miner_cro_survey_3/handoff.md.
5. When finished, send a brief completion message back using send_message with the path to your handoff report.
