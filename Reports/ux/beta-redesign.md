# Win Equipments Beta redesign

## Market research and decisions · 11 November 2026

| Source | Observed pattern | Decision for Win |
|---|---|---|
| [Trane process chillers](https://www.trane.com/commercial/north-america/us/en/products-systems/chillers/process-cooling/trane-process-chillers.html) | Applications, capacity, model specifications and brochures sit on the same product path. | Put product identity, rating conditions, model comparison and downloads ahead of educational material. |
| [BAC cooling towers](https://baltimoreaircoil.com/products/cooling-towers/series-3000-cooling-tower) and [performance tables](https://baltimoreaircoil.com/cti-selection-performance-tables) | Equipment is categorized by duty and type; technical resources are grouped by use and flow has a stated rating basis. | Route by buyer task as well as product family; maintain catalogue conditions and the PDF reader. |
| [Atlas Copco dryer datasheet](https://www.atlascopco.com/content/dam/atlas-copco/local-countries/thailand/documents/caci/dryers/fd-dryer-range/FD%20220%20DRYER%20460-3-60.pdf) | One identifiable model, explicit measurement units, test points and rating context. | Preserve searchable model codes and nearby conditions; keep estimates separate from confirmed selection. |
| [Blue Star India process chillers](https://www.bluestarindia.com/international/products/hvac-chillers/process-chillers) | Leads with the product type, use cases and range; process chillers are distinct from building HVAC chillers. | Name process equipment explicitly in the product hierarchy and show what job it performs. |
| [Paharpur HVACR](https://www.paharpur.com/the-hvacr-industry/) | Links application to named equipment and a clearly labelled PDF. | Keep industry paths, equipment pages and downloadable references connected. |
| [McKinsey B2B Pulse](https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/the-surprising-economics-of-b2b-growth-the-new-survival-threshold-and-what-it-takes-to-thrive) | Survey respondents use digital self-service and human channels; continuity matters. | Browsing and sizing work without a gate; enquiry preserves product, model and duty. |
| [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Consistent navigation, reflow, focus visibility and target size are testable requirements. | Use shared navigation, plain links, readable controls, and keep sticky UI from covering focused content. |

This is desk research and a repository/browser audit, not customer interviews or conversion evidence. The incumbent homepage opens on a cinematic rotator and a proof claim before naming the products. Desktop product navigation exposes a long menu while mobile uses a different tree. Downloads, service, contact and catalogue routes open with different hero treatments. The product data and buying tools are already the strongest foundation.

## Direction contract

THESIS: One engineering catalogue, from the equipment name to the enquiry.
OWN-WORLD: Preserve Win blue, green logo, Archivo and actual equipment. Use white and cool paper, navy information bands, square-edged technical plates and quiet rules.
STORY: Browse equipment → verify operating conditions → compare models or estimate duty → contact the manufacturer.
FIRST VIEWPORT: Explicit equipment names, one clear browse action and a real WCP product photo. Three permanent task links replace hero rotation.
FORM: One navigation order; shared title rhythm, panels and controls; purposeful variants for product, documents and reading. Service remains a distinct task, with the same interface.
FINISH: Preserve canonical URLs, catalogue values, viewer and form behavior; check representative routes at desktop and narrow mobile and run the full build and regression suites.

## Implementation plan

1. Put named product families and task links at the homepage entrance. Remove automatic hero media, keep the technical viewers available further down.
2. Share navigation destinations and masthead rules across route types. Put Downloads and service in the main navigation, and consolidate the small-screen enquiry actions.
3. Make the equipment index start with search and filters; give each product a consistent route to models, conditions, sizing and documents. Bring service and contact into the same light masthead system.
4. Preserve all content-backed values, routes and form payloads. Validate representative flows and generated pages, document the system, and push Beta only.

## Verification

- Generated 114 pages; 424 Python tests, 16 customer-selection checks, PDF reader regressions and chiller lifecycle checks passed. The lifecycle harness now matches the existing visibility/idle trigger; the viewer implementation was not changed.
- Nine route types at 1440px and 390px, and home, product and downloads at 320px: no page-level horizontal overflow in those 21 checks.
- Mobile smoke checks: menu destinations, model search, PDF dialog opening and Escape dismissal, chiller calculator result and retained model/duty, two-model comparison table generation. No live enquiry sent.
- Mechanical detector returned no findings; Jinja stylesheet resolution limited automated color checks. This is representative QA, not a whole-site WCAG conformance claim.
- Existing specifications, models, catalogue files, routes, schema, enquiry endpoints and 3D controllers are preserved. The build pruned generated image variants no longer referenced by the old hero/menu; originals are retained.

The independent finish review identified three issues: inconsistent WCP naming and a range-level tank claim, mobile family links below the first view, and an overlong Downloads index at 320px. It scored all three fixes resolved. The final contact check also verified the WhatsApp number remains visible on the shared white panel. The verdict covers the reviewed fixes and captured routes, not a formal accessibility audit.
