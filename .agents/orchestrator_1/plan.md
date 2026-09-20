# Orchestration Plan: Win Equipments Product Catalogues

## Objective
Design and generate 11 publication-grade product catalogues (10 individual brochures + 1 master E-Catalogue) for Win Equipments, an ISO 9001:2015 certified manufacturer based in Coimbatore, India, using Chrome headless PDF printing.

## Milestones
1. **Phase 0: Survey & Scoping (Exploration)**
   - Dispatch 3 parallel Explorers:
     - Explorer 1 (Asset & Spec Auditor): Inventory existing images, logos, product photos, find missing assets, inspect directory structure.
     - Explorer 2 (Technical & Environment Investigator): Inspect Python/Node environment, Chrome headless capabilities, PDF tooling (`pdfinfo`, `pdftotext`, `pymupdf`, `weasyprint`, etc.), QR code generation.
     - Explorer 3 (Domain & Catalog Requirements Spec Miner): Detailed spec mapping for all 10 product lines + master catalogue, exact page breakdown, table schemas, content synthesis.
   - Aggregate findings and produce `PROJECT.md` with full architecture, feature inventory, code layout, and milestones.

2. **Phase 1: Dual Track Launch**
   - Track A (E2E Testing Track): Setup verification harness, PDF structure inspector, contact hygiene linter, image coverage checker, page count checker. Create `TEST_INFRA.md`.
   - Track B (Core Print Engine & Template System): Modular HTML/CSS print engine, layout templates, typography, header/footer pagination, QR code generator.

3. **Phase 2: Product Brochures Implementation**
   - Batch 1: Air Dryers & Chillers (5 brochures: Refrigerated Air Dryer, Desiccant Air Dryer, Chiller, Specialized Chillers, Ice Flake Machine).
   - Batch 2: Cooling Towers, Air Receiver, Filters, Drain Valve (5 brochures: Cooling Towers, Coil Cooling Tower, Air Receiver, Filters, Automatic Drain Valve).

4. **Phase 3: Master E-Catalogue Implementation**
   - Comprehensive 12-16 page master catalogue consolidating all product lines, corporate profile, engineering advantages, certifications, and contact pages.

5. **Phase 4: Full Acceptance & Adversarial Hardening**
   - E2E Test verification (`TEST_READY.md` execution).
   - Challenger adversarial stress testing (rendering fidelity, text bounds, font sizes, QR scannability, table alignment).
   - Forensic Integrity Audit (strict anti-cheating, contact hygiene, layout verification).
   - Final Delivery to `/Users/devasahithiyan/Desktop/Win equipments/catlogue/`.
