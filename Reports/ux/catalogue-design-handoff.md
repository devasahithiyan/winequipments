# Catalogue and PDF reader design handoff

8 October 2026. Documentation pass following the finish review's **Ship** disposition. This is an ordinary extension of the established Win Equipments identity. The scope is the nine published catalogues and the downloads PDF reader; the root design system is preserved.

## Evidence checked

The product and visual authorities checked were `PRODUCT.md`, `DESIGN.md`, `src/site/assets/css/tokens.css`, the Impeccable document reference at `.agents/skills/impeccable/reference/document.md`, and `Reports/ux/catalogue-redesign-brief.md`. There is no `.impeccable/design.json` in this checkout. No sidecar was created, and `DESIGN.md` was not edited.

Implementation checked:

- `src/site/catalogue/templates/print.css`, `_parts.html`, `datasheet.html` and `master.html` for page geometry, typography, tables, imagery, contents and contact treatment.
- `src/site/assets/css/downloads.css` and `src/site/templates/pages/downloads.html` for the document library and PDF reader composition, controls, responsive layout and semantic markup.
- `src/site/catalogue/DOWNLOADS.md` for the existing regeneration, provenance, reader and validation instructions.

Visual evidence inspected directly from the saved captures; this pass did not open a browser:

- `.build-cache/catalogue-redesign/review/desktop.png`: desktop reader with the chiller model page, section navigation, page thumbnails and fixed controls.
- `.build-cache/catalogue-redesign/review/mobile.png`: 390px reader with a full-width page, compact toolbar and persistent document actions.
- `.build-cache/catalogue-redesign/review/mobile-320.png`: narrow reader with wrapping metadata and controls, contained page width and visible download/close access.
- All 13 contact sheets in `.build-cache/catalogue-redesign/sheets/`: refrigerated air dryers (2), desiccant air dryers (1), compressed air filters (1), automatic drain valves (1), air receiver tanks (1), industrial process chillers (1), FRP cooling towers (2), closed-circuit cooling towers (1) and company/product catalogue (3). Together these show the nine-document, 48-page set, including the 12-page overview of all 23 current product entries.

The captures support the visual observations below. Reader behavior and document-integrity checks remain owned by the finish review and the validation commands in the maintenance guide; a static capture alone does not establish those behaviors.

## Maintained identity

The implementation carries the incumbent light industrial direction into print and reading. White document surfaces sit against quiet pale paper. Green-black headings and table bands establish hierarchy; Win green marks series, selected states, diagrams and links. The print palette matches the established green, green text, ink, body ink, muted text and border values. The reader consumes the website's existing tokens for color, typography, spacing, radii and main panel depth.

Archivo remains the display and body family, with condensed headings and tabular numbers. Genuine product cutouts lead the covers and product rows, and an existing factory photograph supports the company page. Hairline separators, alternating table rows and a restrained dark contact band continue the site's emphasis on equipment and engineering facts. Preview and download controls use secondary treatments, preserving green filled actions for the established enquiry hierarchy.

These are adaptations of the incumbent identity to a technical reference set. They establish no replacement palette, font system, imagery policy or site-wide composition rule.

## Scoped catalogue rules

- Keep the complete set A4 portrait. The current print margin is 12mm top, 14mm sides and 17mm bottom. Preserve the compact brand line, document/series identification, page title and repeating website/telephone/page footer.
- Keep identification and listed range on the cover, with genuine equipment imagery, four key specifications, linked contents and the online-specifications QR/link. Model tables and rating conditions follow before explanatory construction and selection sections.
- Split wide technical tables into information groups and repeat model identifiers. Preserve all source columns, units and notes. Do not solve overflow by reducing the entire publication or switching individual pages to landscape.
- Retain clear dark table headers, distinct units, row headers, tabular numbers and light alternating rows. The print type scale is local: 32pt cover headings, 22pt section headings, 9pt body and 8.5pt standard tables. It does not replace the responsive website scale.
- Keep logical page breaks, grouped blocks and notes attached to their relevant information. Whitespace on a short page is acceptable; adding promotional material to fill it is not a maintenance requirement.
- Preserve the master catalogue's family index and linked product entries. Standard model ranges and equipment engineered to order need their respective source-backed descriptions and enquiry requirements.
- Retain the layout-edition label and the request to confirm the selected model and duty. Layout edition records presentation work, not engineering reapproval. Outstanding technical questions remain in `CONTENT_TODO.md`.

## Scoped library and reader rules

The library uses a document row with a recognizable PDF cover, explicit format/page/size information, a short purpose, visible preview/download actions and a specification link. Detailed contents remain optional disclosure. On wider screens the actions form a separate column; small screens allow them to wrap below the document summary.

The reader uses a persistent header for document identity, download and close; a separate toolbar for contents, page selection and zoom; and a scrollable continuous-page viewport. The footer exposes current-page feedback and original-PDF access. On desktop the contents and thumbnails occupy a sidebar. Below 768px the reader occupies the screen, the page controls wrap into a compact two-row toolbar and contents become an overlay. Controls maintain a minimum 44px height.

Fit width presents an intact portrait page on phones. Dense technical tables will need percentage zoom for close reading; the document library also exposes the corresponding online specifications. Horizontal panning when deliberately zoomed belongs inside the document viewport. Preserve the site's requirement against horizontal page overflow.

Keep the page selector, scrolling, section links and thumbnails synchronized, and preserve the current reading position during zoom and resize. Maintain selectable text, visible focus, keyboard close/focus return, retry feedback and direct access to the original document. The existing link fallback opens the PDF when JavaScript or dialog support is unavailable. These behavior requirements are specified in `DOWNLOADS.md` and covered by the reader validation workflow.

## Maintenance references

`src/site/catalogue/DOWNLOADS.md` is the operational maintenance guide. It already records the regeneration sequence, dependencies, page-count checks, metadata freshness, source-column preservation, responsive/interaction review and the limitations of structural tagging. Follow it after changing a template, content, type size or reader layout.

| Change | Source to maintain |
| --- | --- |
| Engineering model values | `src/site/data/products/*.json`; retain source values and resolve technical questions through `CONTENT_TODO.md` |
| Print layout and shared publication components | `src/site/catalogue/templates/print.css`, `_parts.html`, `datasheet.html`, `master.html` |
| Logical pages, bookmarks and layout edition | `src/site/catalogue/build_catalogues.py` |
| Document purpose, product mappings and contents | `src/site/data/downloads.json` |
| Derived PDF facts and preview/provenance output | `src/site/catalogue/prepare_downloads.py` and `src/site/data/download_metadata.json` |
| Library and reader presentation | `src/site/templates/pages/downloads.html`, `src/site/assets/css/downloads.css` |
| Reader behavior and layout calculations | `src/site/assets/js/downloads.js`, `src/site/assets/js/download-reader-layout.mjs` |
| Regression checks | `tests/test_catalogues.py`, `tests/test_downloads.py`, `tests/test_pdf_reader.mjs` |

Preserve public PDF paths and the archived original brochures. Regenerate PDFs, metadata, previews and the public site together. Shipping thumbnails retain their generated provenance sidecars; the contact sheets and browser captures above are review evidence, not production imagery. After regeneration, inspect every page again rather than treating earlier captures as proof of the new output.

## Drift recorded

The incumbent `DESIGN.md` predates the current canonical Impeccable frontmatter/section format and has no matching sidecar in this checkout. Its prose also differs from current CSS in places: for example, it names a green wash of `#eef6ef` while `tokens.css` uses `#e5f1e3`, and its general heading-size guidance is broader than the current responsive tokens. These are pre-existing documentation differences. This scoped handoff preserves both the root file and the absent sidecar state; implementation values remain observable in the referenced CSS.

The standalone print stylesheet repeats a small palette/font subset because each publication embeds its own CSS. Future palette changes should check that subset against `tokens.css`. Print uses physical units and a denser type scale appropriate to its fixed page box. The reader adds a subtle page shadow and mobile contents-overlay shadow to distinguish paper and navigation; these are local reading treatments, not new system-wide depth tokens.

No identity replacement was identified in the checked catalogue/reader work. The report documents the finished local rules and the existing drift without expanding the task into a design-system rewrite.
