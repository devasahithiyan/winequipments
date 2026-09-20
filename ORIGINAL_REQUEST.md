# Original User Request

## 2026-09-20T09:15:47Z

Design and generate 11 publication-grade product catalogues (10 individual brochures + 1 master E-Catalogue) for Win Equipments, an ISO 9001:2015 certified manufacturer of industrial compressed air equipment, process chillers, and cooling towers based in Coimbatore, India. Each catalogue must be a **print-ready PDF** that looks like a professionally designed industrial product brochure — comparable in quality to Atlas Copco, Kaeser, or Grundfos product literature — NOT a web page converted to PDF.

Working directory: /Users/devasahithiyan/Desktop/Win equipments
Output directory: /Users/devasahithiyan/Desktop/Win equipments/catlogue/
Integrity mode: development

## Company Identity

- **Name**: Win Equipments
- **Tagline**: Save Water and Power
- **Address**: SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407, Tamil Nadu, India
- **Phone**: +91 95972 28969 / +91 95972 28975
- **Email**: info@winequipments.com
- **Website**: winequipments.com
- **Certification**: ISO 9001:2015 (IAF & DAC accredited)
- **Brand colours**: Navy `#0E2540`, Sky Blue `#0284C7`, White `#FFFFFF`, Light Grey `#F4F6F9`

## Product Images

Real product photos are available at `/Users/devasahithiyan/Desktop/Win equipments/images/Products/`:
- `Refrigiratedairdryer1.png`, `refrigiratedairdryer2.png`, `refrigiratedairdryer3.png`
- `dessicantdryer.png`
- `chiller.png`, `Sodachiller.png`, `sodachiller2.png`, `electroplatingchiller.png`, `medicalchiller.png`, `spotchilling.png`
- `coolingtower.png`, `coolingtower2.png`, `coolingtower3.png`
- `Squarecoolingtower1.png`
- `coilcooling.png`, `coilcooling2.png`
- `Airreciever.png`, `airreciever2.png`, `airreciever3.png`
- `compressedairfilters.png`, `compressedairfilters2.png`, `compressedairfilters3.png`
- `drainvalve.png`
- `aftercooler.png`, `aftercooler2.png`, `aftercooler3.png`

## Chrome Binary (for PDF generation)

`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` — use headless PDF printing with dedicated **print-first CSS** (`@page` rules, `@media print`, no web layout). Do NOT adapt web pages. Design the HTML templates specifically for print output.

## Requirements

### R1. Individual Product Brochures (10 PDFs)

Produce one professionally designed, 4–6 page A4 PDF brochure for each product:

1. **Refrigerated Air Dryers** → `catlogue/refrigeration air dryer.pdf`
2. **Desiccant Air Dryers** → `catlogue/Desiccant air dryer.pdf`
3. **Industrial Process Chillers** → `catlogue/chiller.pdf`
4. **Specialized Chillers** (Anodizing, Medical/Scan, Acid Cooling, Spot Cooling) → `catlogue/specialized chillers.pdf`
5. **Ice Flake Machines** → `catlogue/ice flake machine.pdf`
6. **Round & Square Cooling Towers** → `catlogue/Cooling-towers.pdf`
7. **Coil / Closed Circuit Cooling Tower** → `catlogue/Coil cooling tower.pdf`
8. **Air Receiver Tanks** → `catlogue/Air-Receiver.pdf`
9. **Compressed Air Filters** → `catlogue/Filters.pdf`
10. **Automatic Drain Valves** → `catlogue/Automatic-Drain-Valve.pdf`

**Each brochure must contain:**
- **Page 1 — Cover**: Full-bleed product photo, product name in large bold type, company logo/name, tagline, ISO 9001:2015 badge
- **Page 2 — Overview**: What the product does, working principle, 3–5 key engineering benefits with icons or bold callouts
- **Page 3 — Specifications**: Full model range table with capacity, power, dimensions, connection sizes, operating ranges
- **Page 4 — Applications & Industries**: Where this product is used (industries, use cases), with a competitor context row or industry benchmark note
- **Page 5/6 — Contact & QR**: Company address, both phone numbers, email, website, QR code pointing to the relevant product page on winequipments.com

### R2. Master E-Catalogue (1 PDF)

Produce a 12–16 page master catalogue → `catlogue/E_Catalogue.pdf` that:
- Starts with a company profile cover (logo, tagline, address, certifications)
- Has a 1–2 page "About Win Equipments" spread
- Includes a 1–2 page summary section for **each product line** (condensed from individual brochures)
- Ends with a full contact + location page

### R3. Design & Print Quality Standards

The PDFs must meet ALL of the following non-negotiable standards:
- A4 page size (210mm × 297mm) with consistent 15mm margins
- Typography: Inter or a professional sans-serif — minimum 9pt body text, 18pt+ headings
- Colour: Navy `#0E2540` for headings and backgrounds, `#0284C7` for accents and table headers
- No web layout artefacts: no scrollbars, no browser chrome, no `px`-based font sizes in print output
- Tables must have proper borders, alternating row shading, and column alignment
- Product images must be embedded (not missing/broken)
- Page numbers, company name, and product name in a consistent footer on every page
- QR codes must be scannable (minimum 2cm × 2cm, high contrast)

### R4. Contact Hygiene

Every PDF must contain:
- ✅ `+91 95972 28969` and `+91 95972 28975`
- ✅ `info@winequipments.com`
- ✅ `SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407`

Must NOT contain:
- ❌ `9597228978`
- ❌ `0422-2562975` or `2562975`

## Acceptance Criteria

### PDF Quality
- [ ] All 11 PDFs open without errors and render correctly in Preview/Acrobat
- [ ] Each individual brochure is 4–6 pages; master E-Catalogue is 12–16 pages
- [ ] Every page has the company name and page number in the footer
- [ ] No page has missing images (broken image boxes)
- [ ] Cover page of each brochure has a product photo occupying ≥ 40% of the page area

### Content Completeness
- [ ] Every individual brochure has: cover, overview, specs table, applications, contact/QR page
- [ ] Specs tables include at minimum: model code, capacity/flow rate, power (kW), operating pressure/temperature range
- [ ] QR codes resolve to valid URLs on winequipments.com (verified by checking URL format)

### Contact Hygiene
- [ ] `pdftotext` or equivalent text extraction confirms both correct phone numbers present in every PDF
- [ ] Zero occurrences of banned numbers `9597228978` or `2562975` in any PDF

### Design Standard
- [ ] An independent reviewer would describe the PDFs as "professional" and "suitable to hand to clients" — not "a web page printed to PDF"
- [ ] Colour scheme is consistent across all 11 PDFs (navy + sky blue)
- [ ] Font sizes are readable when printed on A4 paper (body ≥ 9pt)

## 2026-09-20T10:14:26Z

Research conversion psychology, B2B industrial buyer behaviour, and UX best practices — then implement evidence-based improvements directly into the Win Equipments website (static HTML/CSS/JS). The site sells industrial compressed air equipment, chillers, and cooling towers to procurement managers, plant engineers, and factory owners in India. Deliverable is a measurably better-converting website, not a report.

Working directory: /Users/devasahithiyan/Desktop/Win equipments
Integrity mode: development

## Context

- **Audience**: B2B industrial buyers — plant engineers (technical depth needed), procurement managers (ROI & price signals needed), factory owners (trust & authority signals needed)
- **Brand**: Win Equipments, ISO 9001:2015 certified, Coimbatore, India
- **Colours**: Navy `#0E2540`, Sky Blue `#0284C7`
- **Key pages**: `index.html`, `products/*.html`, `blog/*.html`, `engineering-tools/*.html`, `contactus.html`
- **Preserve**: Contact numbers `+91 95972 28969` / `+91 95972 28975`, all `catlogue/*.pdf` links

## Requirements

### R1. Research — Psychology & Market Benchmarks
Research and document the most impactful, evidence-based UI/UX improvements for a B2B industrial equipment manufacturer website. Cover:
- Conversion psychology: Cialdini’s principles (social proof, authority, scarcity, reciprocity), loss-aversion framing, anchoring
- B2B buyer journey patterns: awareness → evaluation → shortlisting → RFQ — identify which pages serve each stage and what each stage needs
- Market benchmarks: how comparable industrial B2B websites (Atlas Copco India, Kaeser, Bry-Air, Beko Technologies) handle trust signals, CTAs, and product pages
- UX laws: F/Z-pattern scanning, Hick’s Law (reducing decision fatigue in navigation), Fitts’s Law (tap target sizing on mobile)

Produce a prioritised list of improvements ranked by estimated conversion impact.

### R2. Implement — High-Impact Improvements
Apply the top improvements directly to the HTML/CSS/JS files. Implementations must be grounded in the research from R1. Examples of what may (but need not) be implemented:
- **Social proof**: Live customer/installation count callout (e.g. “500+ installations across Tamil Nadu”), industry client logos or sector badges
- **Authority signals**: ISO badge, years in business, factory photo / plant size callout, “Direct Manufacturer — No Middlemen” framing
- **Loss-aversion CTAs**: Reframe CTAs from “Request Quote” to outcome-focused language (e.g. “Stop Paying for Moisture Damage — Get Sizing & Price”)
- **Urgency / trust**: “Ships in 7 working days from Arasur plant”, in-stock indicator
- **Reciprocity**: Engineering tools promoted as free value-adds (“Free CFM Calculator — No Login Required”)
- **WhatsApp sticky button**: Click-to-chat floating button (WhatsApp `+919597228969`) visible on all pages
- **F-pattern layout**: Product page hero content aligned to F-pattern reading path — most important specs top-left, CTA top-right
- **Cognitive load reduction**: Simplify navigation dropdowns, reduce choices per dropdown column to ≤ 6 items
- **Mobile CTA dock**: Sticky bottom bar on mobile with two buttons — Call and WhatsApp

### R3. Preserve Data Integrity
- Do not alter contact numbers `+91 95972 28969` or `+91 95972 28975`
- Do not break any `href` links to PDFs in `catlogue/`
- Do not remove or alter new product pages: `acid-cooling-chillers.html`, `anodizing-chillers.html`, `ice-flake-machines.html`, `medical-scan-chillers.html`

## Acceptance Criteria

### Research Quality
- [ ] A documented, prioritised improvement list exists with each item citing a specific psychology principle or market benchmark
- [ ] At least 8 distinct psychology/UX principles are applied across the implementation

### Implementation Completeness
- [ ] WhatsApp sticky button is present and functional on every page (href `https://wa.me/919597228969`)
- [ ] Every product page hero section contains at least one loss-aversion or outcome-focused CTA (not just “Request Quote”)
- [ ] At least one social proof element (installation count, client sector badges, or years in business) appears above the fold on `index.html`
- [ ] Mobile sticky CTA dock (Call + WhatsApp) is present on all product pages, visible at ≤ 768px viewport

### Structural Integrity
- [ ] Zero broken internal links across all HTML files after changes
- [ ] All `catlogue/*.pdf` download links remain functional
- [ ] Both phone numbers (`28969`, `28975`) present on every page — zero occurrences of banned numbers `9597228978` or `2562975`
