# Downloads: customer review and implementation plan

Reviewed 8 October 2026.

Current status (8 October 2026): the library and request flow are implemented. A subsequent user-requested redesign has regenerated all nine PDFs as uniform A4 portrait documents, expanded the master to all 23 product entries, and replaced image quick look with an actual PDF reader. See `downloads-validation.md` and `catalogue-redesign-brief.md`. The findings and proposed exclusions below describe the earlier audit, not the current implementation; the user subsequently authorized PDF and reader replacement. Engineering currency still needs company confirmation. No deployment performed.

## Recommendation

Make this a useful catalogue and technical-document library. Its primary job is to help a customer find the right product information; downloading is the next step for sharing, printing or procurement.

The intended journey is **choose equipment family → understand the document → read specifications online or save the PDF → request information for a specific model if needed**.

Keep the current light industrial visual identity, Archivo typography, real equipment imagery and existing URLs. This is a restructuring of the downloads experience, not a site-wide redesign.

## What was reviewed

- The live `/downloads.html` page and local generated version, including desktop and 390 px mobile presentation.
- Header/mobile navigation, homepage catalogue link, product-page PDF links, footer, contact-page referral and enquiry confirmation referral.
- All nine PDFs in `public/downloads/`: extracted text and rendered pages, 45 pages in total. The live index lists the same nine filenames and rounded file sizes; live PDF binaries were not independently compared with the local copies.
- Original PDF archive, generated PDF templates, product data, download-list generation, enquiry flow and analytics hooks.
- Existing SEO tests. No tests were run because this review changes no application behavior.

This is a UX, editorial and document-consistency review. It does not certify that every engineering rating is current or correct. Original archived PDFs are image scans without extractable text, so a complete source-to-data engineering audit requires visual comparison of their tables.

## Findings and customer consequences

1. **Choosing a file requires product knowledge.** The list leads with series names and repeats family labels, but provides no family headings, purpose summaries or contents. A new buyer cannot easily distinguish an overview from a selection document.
2. **Opening a file replaces the page.** Every entry is a direct same-tab PDF link, with neither a `download` attribute nor an explicit preview action. Customers leave the navigation and enquiry flow before they know whether the file is relevant.
3. **Useful online information is disconnected.** Product pages already have responsive model explorers, rating conditions and, where available, sizing tools. The download list does not link to them.
4. **The page title overpromises model-specific information.** The eight product documents are multi-model brochures labelled “Product datasheet.” They are not model-specific approved datasheets or GA drawings. The distinction needs to be explicit.
5. **Technical details come late.** Most model tables start on page 3; WRD starts on page 4. Covers dominate the first page, and several interior pages have substantial unused space while specification text remains small. Chiller, drain-valve and tower tables use landscape pages, adding orientation changes on phones.
6. **Coverage is unclear.** The site contains 23 product entries. Nine entries share eight product PDFs, plus one company catalogue. Fourteen entries have no dedicated PDF. Those customers currently receive no explicit explanation or document-request path tied to their product.
7. **The master catalogue has fallen behind.** It lists 19 product lines and omits four current entries: moisture separators, air-cooled chillers, cooling tower fills and fanless cooling towers. “All product lines” is therefore inaccurate for the current file.
8. **Revision control is missing.** Generated PDFs say “Issued October 2026,” based on the build date. That is not evidence of engineering review. There are no explicit document revisions or approval records exposed by the download list.
9. **The enquiry is mismatched to this task.** Its heading mentions drawings/datasheets, but its introductory text and WhatsApp message ask for a quotation. The success page promises sizing and a quote regardless of whether the customer only requested a document.
10. **Project documentation disagrees with implementation.** `CONTENT_TODO.md` says downloads serve originals; all nine current served files differ from the originals and are generated brochures. The README describes the generated pipeline correctly. Resolve this during implementation.

The current page does have useful foundations: descriptive document titles, PDF sizes, an ungated download list, accessible HTML navigation, an enquiry form and working product specification pages. Preserve these strengths.

## Document inventory and recommended treatment

Sizes below are rounded to match the page. Page numbers refer to the current local files.

| Document | Pages / size | Customer purpose and contents | Recommended treatment |
|---|---|---|---|
| Company product catalogue | 10 / 5.3 MB | Company and product-range overview, applications and custom-equipment requirements; not a full technical table collection | Retain as a separate “Company & product overview”; update 19-line coverage and add a linked contents list. Review sparse pagination, especially the spares-only page. |
| WRD refrigerated air dryers | 5 / 1.4 MB | Working principle, installation, model table (p4), correction factors (p5) | Retain; bring model selection forward and link online to `#specs` and `#sizing`. Distinguish the cover's 10–2000 CFM range from the published model table beginning at 20 CFM. Do not invent a missing 10 CFM model. |
| WHD heatless desiccant dryers | 4 / 1.3 MB | Installation, 300–2000 CFM model table (p3), desiccant/dew-point choices | Retain; make −20 °C alumina versus −40 °C molecular-sieve choice and its rating conditions easy to find. |
| WMF compressed air filters | 4 / 1.3 MB | Housing models (p3), filter grades and ISO-class information (p4) | Retain; expose both “Models” and “Filter grades” in the contents and link to existing HTML sections. Do not present all grades as interchangeable in performance. |
| WDV automatic drain valves | 4 / 1.8 MB | Timer, micro-controller and no-air-loss options; model/pressure/connection table (p3) | Retain after editorial review. Cover wording says the range works “without wasting compressed air,” while the explicit no-air-loss feature belongs to F16. The rating summary says 1–120 min although table entries include 1–136 and 0.5–45 min. Reconcile summary and model-specific wording against sources. |
| WRV air receivers | 4 / 1.2 MB | Standard vessel sizes and pressure options (p3), construction and custom requirements | Retain; separate standard model coverage from designed-to-requirement envelope. Keep ASME availability distinct from a blanket certification claim. |
| WCP process chillers | 4 / 1.9 MB | 0.5–20 TR model table (p3), rating conditions and selection factors (p4) | Retain after editorial review. Cover describes a stainless-steel tank generally; larger model rows and FAQ allow SS/MS. Clarify the qualifier. Make heat-load formula units explicit and keep nominal capacity tied to rating conditions. |
| WCT round and square FRP towers | 6 / 1.9 MB | Separate round/square model tables (p3/p4), selection factors (p5) | Retain one shared document; explicitly state that it covers both shapes. Link to both product pages. Preserve separate model tables and rating conditions. |
| WCC coil towers / dry coolers | 4 / 1.2 MB | Closed-loop finned-coil equipment, genset duty and model table (p3) | Retain; use “Coil cooling towers / dry coolers” visibly. Explain the distinction from evaporative FRP towers so “closed circuit” does not imply the wrong equipment. |

Additional publication checks: generated covers include DAC and IAF marks, while project notes still request supporting certification evidence. Check their permitted use and meaning before repeating them in revised documents. The current generated PDFs have selectable text; sampled files report structural tags. Preserve and verify these features rather than assuming accessibility from export alone.

## Proposed page structure

1. **Compact introduction:** “Catalogues & technical documents,” followed by one sentence explaining that brochures cover product ranges and model-specific drawings can be requested. A visible “Need help choosing?” link leads to the enquiry section.
2. **Three family jump links:** Compressed air treatment, Process cooling, Cooling towers. These are anchors, not filter tabs. With eight product files, every document can remain visible and searchable by the browser. No search box, complex filters or hidden pagination in the first release.
3. **Grouped product documents:** five air-treatment entries, one process-chiller entry and two tower entries. Desktop uses compact rows with a small cover thumbnail; mobile stacks the same content in a single column.
4. **Company overview:** a distinct, quieter feature for customers who need to share the whole range with procurement. It must not compete with individual technical documents or imply that every product has a datasheet.
5. **Missing drawings and documents:** explain that model-specific datasheets, GA drawings and documents for custom equipment are requested from the team. Product selection should include entries without PDFs.
6. **Contextual enquiry:** request the document, product and model if known. Keep the existing direct call/WhatsApp alternatives.

Each document entry contains:

- Plain product name first, series secondary.
- One factual sentence explaining the purpose.
- Short “Includes” text specific to that document, not generic repeated copy.
- PDF format, actual page count and size; revision/issue information only when genuinely recorded.
- **View specifications** linking directly to the existing product `#specs` section, plus **Download PDF** as a secondary action.
- An optional native `<details>` disclosure for contents and an “Open PDF — new tab” text link. Do not add three equally prominent buttons or a custom PDF viewer. New-tab behavior must be labelled.

Example:

> **Industrial process chillers** · WCP series\
> Compare standard models and check the conditions used for capacity ratings.\
> Includes: model table · rating conditions · selection factors\
> PDF · 4 pages · 1.9 MB\
> View specifications | Download PDF\
> Contents and preview ▾

The shared FRP file offers clearly named links to round and square specifications. The master overview links to the online product range instead of pretending to offer one specification table.

## Implementation sequence

### 1. Establish document records and review status

Add `src/site/data/downloads.json`, with stable document ID, family, title, series, product slugs, PDF path, purpose, contents and document kind. Store actual revision and technical-review dates separately from generation time. Do not display “approved,” “latest” or “reviewed” without evidence.

Derive file size, page count and cover thumbnail from the final PDFs during a documented preparation/build step; cache by content hash. Keep model specifications in existing product JSON. Validate duplicate paths, missing files and product mappings. Correct the stale project note about originals.

### 2. Build the grouped library

Replace the loop in `templates/pages/downloads.html` that infers files from the first matching product. Add scoped downloads styles using existing tokens. Implement semantic headings, lists and native disclosures. Ensure useful reading and downloading with JavaScript disabled.

Use `download` for the save action, with the browser's normal fallback if saving is unsupported. A labelled preview link remains available. Cover thumbnails are small, responsive and lazy-loaded; PDF files are never fetched automatically just to display the list.

### 3. Connect the customer journey

Update homepage and navigation wording where needed while preserving `/downloads.html` and existing PDF URLs/redirects. Give product-page PDF links consistent names, sizes and behavior from the same document records. Add links to specifications and relevant existing sizing tools, without duplicating their tables on the downloads page.

Add a document-request intent to the downloads enquiry, prefilling product and model when known, and preserving customer-entered text. Use the existing RFQ delivery path, but identify the purpose in submitted requirements and provide appropriate success copy. Do not send an actual test enquiry to the company without authorization. Handle server errors without losing entered details.

### 4. Revise the document templates

Pilot WRD and WCP first, then apply the approved structure to the remaining documents. Lead with compact identification, rating conditions and model information; follow with selection factors, construction and installation details. Retain useful factual material while consolidating repeated marketing/contact sections and excessive whitespace.

Use readable tables, repeated headers, clear units, working hyperlinks, contents/bookmarks where supported and a recorded revision. Include a concise source/revision log. Regenerate the master overview from current product data and verify all included links. Originals remain archived for provenance; do not restore scanned, potentially outdated brochures as the public default.

Resolve the editorial contradictions identified above from evidence. Any unresolved engineering value or certification remains flagged for the responsible company reviewer rather than being silently corrected or labelled approved.

### 5. Validate and measure

- Rebuild `public/` and run the existing SEO suite; add focused integrity checks for document mappings, metadata, product coverage and PDF links.
- Perform one desktop/mobile visual round at 320/390 px and desktop, followed by one confirmation round if fixes are needed. Test long titles, mixed portrait/landscape documents, native disclosures, slow connections, keyboard focus and JS-disabled behavior.
- Check that every document has a clear purpose before opening it; each online-specification link reaches the right section, and every product without a PDF has a valid request route.
- Inspect every regenerated PDF for clipping, pagination, model rows, units, searchable text, reading order and links. Compare technical values with the approved product data and record remaining source-review exceptions.
- Test direct saving and labelled preview behavior on desktop and mobile. A preview failure must not block HTML specifications or the download link.
- Extend the existing analytics hook with document ID and action. Keep the established `catalogue_download` event compatible, distinguish preview from save intent, and measure specification visits and document requests. A click records intent, not a proven completed download. Never include customer names, phone numbers or requirement text in analytics.

Acceptance: a customer can choose a document, understand its contents and reach relevant specifications without opening a PDF; can save a document without a form gate; and can request missing information without restarting a generic quotation enquiry.

## Boundaries

No deployment, pricing changes, fabricated manuals/drawings, new technical ratings, download login gate, heavy PDF-viewer library or unrelated 3D-viewer work is included. Technical approval and factual currency cannot be inferred from a refreshed layout or a recent export date.

## Implementation references

- `src/site/templates/pages/downloads.html`
- `src/site/templates/pages/product.html`
- `src/site/templates/partials/enquiry.html`
- `src/site/templates/pages/thanks.html`
- `src/site/assets/css/components.css` (existing downloads rules)
- `src/site/assets/js/site.js` (analytics and enquiry prefilling)
- `src/site/build.py`
- `src/site/catalogue/build_catalogues.py` and `templates/`
- `src/site/data/products/*.json`
- `CONTENT_TODO.md`

The recommendation to expose useful HTML information before a PDF is also supported by [Nielsen Norman Group's research on PDF reading](https://www.nngroup.com/articles/avoid-pdf-for-on-screen-reading/). Link labels must make their purpose understandable in context, following [W3C's link-purpose guidance](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html).
