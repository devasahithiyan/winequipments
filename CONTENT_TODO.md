# Content to confirm or supply

The redesign uses only facts that could be verified from the company's original catalogues (2013–2024 PDFs in the first commit), the original E-catalogue, `src/data/company.json`, and decisions confirmed in conversation. Everything below was removed, parked, or needs the owner's confirmation.

## 1. Spec data replaced (important)

The previous site's spec tables and the `catlogue/*.pdf` files regenerated on 20 Sep 2026 did **not** match the company's original catalogues. Examples:

| Item | Previous site | Original catalogue (now used) |
|---|---|---|
| WRD 20 S power | 0.45 kW | 0.13 kW |
| WRD dims (20 S) | 450 × 450 × 550 | 550 × 400 × 600 |
| WRD heat exchanger | "3-in-1 brazed aluminium monoblock" | Co-axial copper tube-in-tube |
| Process chiller range | 1–150 TR | 0.5–20 TR (WCP) |
| FRP cooling tower range | 10–1,500 TR | 10–300 TR (WCT) |
| Coil cooling tower | "evaporative closed circuit" | Finned-coil dry cooler, 150–2000 kVA gensets |

New spec data lives in `src/site/data/products/*.json`, transcribed from the original catalogues. Downloads now serve the original catalogues (`/downloads/*.pdf`). **Please confirm these are current, or send newer datasheets.**

Values to double-check in the original catalogues:
- WRD 400 T dimensions printed as 950 × 1700 × 1200 mm (width looks unusual).
- WRD weight column in the catalogue repeats the connection sizes (print error) — weights are omitted.
- Catalogue moisture example: aftercooler removal printed as "42200 L/day"; the page uses 4220 L/day (5500 − 1280).
- Air receiver cover says 0.5–40 m³ / 6–30 bar g; the model table covers 250–10,000 L at 7/10/12.5 bar g. Both shown.

## 2. Products with no datasheet

These pages now say **engineered to order** and list what the customer should send, with no spec table:
- Medical scan chillers, anodizing chillers, acid cooling chillers, ice flake machines, aftercoolers (catalogue only shows "AC with MS").
- Supply datasheets (model, capacity, power, dimensions) to add model tables.
- Soda chillers and spot chillers have photos (`images/Products/Sodachiller.png`, `spotchilling.png`) but no page.
- Acid cooling chillers currently use the generic chiller photo; supply a real photo.

## 3. Claims removed from the site

- "3,500+ installations" → replaced with **1,200+** (confirmed).
- "15+ years", "99.4% uptime", "Tier-1", "98%", "15–20% energy saving", "N+1 redundancy", "<65 dBA", "Bitzer/Frascold", "Copeland/Danfoss", "helium leak test", "24-month warranty", "same-day dispatch", "6-month OEM guarantee".
- Self-published review schema (AggregateRating 4.7 / 65) and invented prices (₹28,000–₹5,50,000) in Product schema.
- Four anonymous case studies (Tiruppur, Hosur, Coimbatore, Erode) — parked until real projects with permission are supplied.
- DAC (Dubai Accreditation Center) and IAF wording: the original desiccant catalogue shows DAC and ISO logos. Please send the certificate so certifications can be listed exactly as issued.

## 4. Contact details

- Phones used: +91 95972 28969 and +91 95972 28975. Original catalogues also list **+91 95972 28978** — add it?
- Address used: SF No. 4/195 B, Kallangadu, Nadu Arasur, Arasur Post, Coimbatore 641 407 (from the E-catalogue). Older catalogues show #106 B, S.N.R College Road, K.R. Puram — the PDFs still carry the old address.
- Memberships shown on catalogues: TAPMA, IndiaMART TrustSEAL. Add to the About page?

## 5. Assets needed

- Official vector logo (SVG/AI/EPS). The site currently uses a redrawn SVG based on the 94 × 53 px PNG.
- Factory photography: shop floor, fabrication, testing, finished equipment, installations at customer sites (with permission). Existing factory photos had a baked-in green tint; they are shown in black and white.
- Clean product photos for aftercoolers, spares, acid chillers.
- Blog images: the current ones are AI-generated (holograms, non-Indian factories). Replace with real photos or remove.

## 6. Content to write

- Real case studies: customer (with permission), industry, problem, equipment supplied, result.
- Industry pages for laser cutting / CNC, plastics, textile etc. currently list products from catalogue application lists only; add application notes from your engineers.
