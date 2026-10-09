# Customer selection design handoff

8 October 2026. This is an ordinary local extension verified against the inherited Win Equipments system. The authorized scope is calculator validation, product discovery, conditions-first product pages and comparison, and selection-aware enquiries. The finish review's appended verdict marks F1 and F2 **resolved**, with **disposition: ship** limited to that correction list. This document records the implemented local rules; it does not replace the root design system or certify the whole website.

## Authority and evidence

Checked `PRODUCT.md`, `DESIGN.md`, `src/site/assets/css/tokens.css`, `.agents/skills/impeccable/reference/document.md`, the direction contract in `Reports/ux/customer-selection-plan.md`, `customer-selection-validation.md`, and the finish review including its verdict pass. The code-led contract is the composition reference; no visual comp was commissioned for this extension. `PRODUCT.md` and `DESIGN.md` remain unchanged. `.impeccable/design.json` is absent in this checkout and remains absent.

Source inspection covered the selection stylesheet, sizing/search/selection modules and controllers, calculator and product templates, shared specification/enquiry partials, build-time catalogue mappings and the existing finder/correction integration. Generated `public/` output was rebuilt by the implementation workflow; maintain source rather than editing generated pages.

The following saved captures were inspected directly in `.build-cache/customer-selection/review/`:

- `discovery-desktop.png`, `discovery-mobile.png`, `discovery-320.png`: labelled search, family shortcuts, result feedback and visible search focus.
- `conditions-desktop.png`: rating conditions exposed before model selection, with the genuine equipment image and incumbent product hierarchy retained.
- `comparison-desktop.png`, `comparison-320.png`: aligned catalogue rows on desktop; field labels above model values and repeated model identifiers at 320px.
- `calculator-desktop.png`, `tower-invalid-mobile.png`, `review-mobile.png`: corrected preliminary-match, invalid and review result surfaces.
- `enquiry-desktop.png`, `enquiry-mobile.png`, `enquiry-320.png`: editable selection attachment, separate removal/sharing actions, wrapping labels and visible field focus.

These are loaded captures of task sections at 1440px, 390px and 320px, not full-page or every-range coverage. No new browser session, context scan, detector, test run, raster asset or production change formed part of this documentation pass. Runtime and test claims below are attributed to the validation record and reviewer, with source corroboration where applicable.

## Maintained identity

Archivo remains the display and body family. Condensed headings, dark green ink, pale paper, white form surfaces, restrained rules and the existing green action treatment make the added controls read as part of Win Equipments. Search, selects, radio choices and textareas retain familiar native affordances. Model values use tabular numerals. The inherited genuine product imagery, sticky header, subnavigation and enquiry band still provide the surrounding visual structure.

Selection styling consumes the incumbent color, type, spacing and border tokens. Family shortcuts use a bordered secondary treatment and a green selected state. Comparison is an inline disclosure with quiet row separators. The attachment uses the existing pale secondary surface inside the white form panel. None of these introduces a replacement palette, font, imagery policy, motion system or global component library.

Result states extend the existing dark result panel. Match/empty headings and qualification copy inherit its light foreground; review headings use a local pale warning foreground; invalid results use ink on the existing error wash. The reviewer calculates contrast from supplied browser-computed pairs at 13.30:1 for light result text, 12.47:1 for the review heading and 14.66:1 for invalid ink. These resolve the listed contrast defect, without implying a whole-site accessibility audit.

## Scoped implementation rules

**Discovery.** Keep search and the optional task/industry guide ahead of the existing catalogue. Search uses source-backed names, series, models and applications, normalizing common model formatting such as `WCP050`. Family and industry choices combine with search, announce the result count, and expose reset/recovery. Family shortcuts remain ordinary links and the full product list remains readable without JavaScript. Search/controller enhancements must not make the base catalogue dependent on JavaScript.

**Conditions before selection.** Keep the product hero and existing enquiry actions, then expose models and rating conditions before selection explanations, photos and illustrative viewers. For equipment engineered to order, expose the source-backed sizing requirements. The hero link and section navigation should land on the relevant selection/requirements section. Long brochure labels wrap within the product page rather than widening it.

**Catalogue comparison.** Compare two or three distinct models within one product range. Use the source specification columns, units and row values; retain the complete original specification table. Duplicate choices produce recovery text. At widths up to 600px, stack the choices and place each specification label above its model values; repeat model IDs with those values. Keep any deliberate table scrolling within its region. Comparison does not establish engineering suitability.

**Qualified calculator results.** Preserve explicit flow/load modes and the distinction between incomplete input, invalid input, engineering review and a preliminary catalogue candidate. Required numbers must be finite and positive; catalogue corrections come only from listed conditions. HP estimates produce flow estimates without selecting a dryer. WHD uses its own 38 °C inlet/7 bar g rating and preserves the A/M variant. Chiller duties exceeding the heat-load candidate's listed flow require review. Tower model matches remain restricted to a 5 °C range, at least 4 °C approach and L-fill inlet temperatures up to 55 °C. Other valid duties retain a qualified estimate without an invented correction or model. Preserve the current water/TR conversion convention until engineering authorizes a change.

**Visible, explicit selection context.** Calculator enquiries and model choices create a bounded record for a known product/model. The model-details link explicitly transfers the duty to the corresponding product. The visible attachment exposes product, model, inputs, result and qualification for review, editing or removal before sending. Keep contact details out of this record. Product-scoped session storage restores derived records for up to 30 minutes; customer textarea edits are not persisted. Ignore transferred records for a different product, clear incompatible context on a form product switch, and remove both stored context and an explicit selection query when the customer removes it.

**Edits invalidate prior duty.** Calculator changes and edits to an inline nominal duty, WRD compressor flow or correction factor clear the attached derived selection, including blank/zero/negative edits. A subsequent catalogue choice must not silently inherit the old duty. An untouched empty finder preserves an explicitly transferred calculator duty. When an existing explicit transfer URL is present, saving a changed model also updates that URL so reload cannot restore the originally transferred model. Keep this behavior synchronized with the session record.

**Enquiry and sharing.** The existing form POST includes the enabled `selection_details` textarea. The named WhatsApp action keeps its message URL synchronized with the customer's current textarea text and opens WhatsApp through an explicit click. Keep removal and sharing distinct and labelled. Existing direct contact routes and the form endpoint remain in place; no contact information belongs in the persisted selection context.

## Maintenance references

| Change | Source to maintain |
| --- | --- |
| Product ratings, conditions, model columns and correction tables | `src/site/data/products/*.json`; technical uncertainties remain in `CONTENT_TODO.md` |
| Build-time tool data, known-model/variant mappings, URLs and CSS bundle integration | `src/site/build.py`: `tool_data()`, `selection_products()`, `product_url()` and `site.css` bundle |
| Discovery markup, search records and catalogue cards | `src/site/templates/pages/products.html`, `partials/macros.html` |
| Search matching and discovery state | `src/site/assets/js/product-search.mjs`, `product-discovery.js` |
| Product sequence, conditions and comparison controls | `src/site/templates/pages/product.html`, `partials/spec_explorer.html` |
| Comparison rendering | `src/site/assets/js/product-selection.js` |
| Calculator inputs, pure rules and result rendering | `src/site/templates/pages/tool.html`, `src/site/assets/js/sizing-core.mjs`, `tools.js` |
| Selection normalization, transfer and attachment lifecycle | `src/site/assets/js/selection-core.mjs`, `selection.js`; `templates/base.html` loads the shared product map/controller |
| Finder, WRD correction and existing enquiry integration | `src/site/assets/js/site.js` |
| Attachment markup and existing form POST | `src/site/templates/partials/enquiry.html` |
| Scoped responsive/result styles | `src/site/assets/css/selection.css`; inherited foundations remain in `tokens.css`, `base.css`, `components.css`, `pages.css` |
| Focused regression checks | `tests/test_customer_selection.py`, `tests/test_customer_selection.mjs` |

Build with `python3 src/site/build.py`, then use the repository Python suite and `node --test tests/test_customer_selection.mjs`. Retain the existing PDF-reader and chiller lifecycle checks (`tests/test_pdf_reader.mjs`, `node --experimental-vm-modules tests/test_chiller_loading.cjs`) when changes affect shared product/viewer loading. `README.md` describes the static-site build; `Reports/ux/customer-selection-validation.md` records this delivery's tested sequences and limits.

The recorded implementation checks pass: 109 generated pages, 404 Python tests, 16 new Node cases, module syntax checks and the existing PDF/viewer regressions. Browser evidence includes search/reset/guided routes, two/three-model and duplicate comparison, calculator transfer, editable WhatsApp URL generation without sending, same-product reload, product switching/removal, unsupported tower duty, and WCP/WRD stale-duty correction sequences. The detector ran once and reported no findings, with stylesheet URL resolution limiting its color/custom-property checks; the visual review supplies the necessary complementary evidence.

The final persistence check in the validation record also confirms calculator → product → choose WCP 100 → reload restores WCP 100, retaining 50 LPM, ΔT 5 °C, 15 °C outlet, 40 °C ambient and 4.96 TR. The explicit selection query and form remain synchronized. This is reported runtime evidence; the documenter inspected its controller rule without repeating the browser sequence.

## Drift and limits retained

The inherited `DESIGN.md` predates the current canonical Impeccable frontmatter/section format. It names a green wash of `#eef6ef` while `tokens.css` uses `#e5f1e3`, and its general type guidance differs from the current responsive token scale. `PRODUCT.md` also references older data locations; the active build reads `src/site/data/`. These pre-existing documentation differences are recorded without repairing or replacing the authorities.

The selection stylesheet retains a local 12px attachment radius, a 6px fallback for shortcut corners and the pale review-heading color; these are scoped implementation details rather than new global tokens. The existing fixed mobile action bar is cramped in the 320px comparison capture. Existing subnavigation/photo rails scroll independently. Neither inherited treatment was redesigned in this scope.

All recommendations remain preliminary and require engineering confirmation. No source model, material or specification values were changed. No real enquiry was submitted, and mailer delivery/storage reliability, PDF regeneration, unshown product ranges and whole-site accessibility remain outside this handoff. The ordinary extension is verified against the inherited identity within the inspected surfaces and supplied validation evidence.
