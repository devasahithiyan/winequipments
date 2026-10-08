# Maintaining the catalogues and downloads reader

The nine published PDFs are one A4 portrait reference set: eight product brochures and a 12-page company overview covering all 23 current product entries. The set has 48 pages. Public PDF URLs remain stable; original customer brochures remain archived in `originals/`.

## Regeneration

From the repository root:

```sh
python3 src/site/catalogue/build_catalogues.py
python3 src/site/catalogue/prepare_downloads.py
python3 src/site/build.py
/opt/homebrew/bin/python3 -m pytest -q
node tests/test_pdf_reader.mjs
```

The catalogue builder uses Chrome headless printing, Jinja, Pillow, qrcode and pypdf. The preview preparation step requires Poppler (`pdfinfo`, `pdftoppm`) and Pillow. The normal site build does not require Chrome or Poppler.

`data/products/*.json` remains the engineering-data source. Print templates split wide tables into portrait groups and repeat the model identifier; every original column is retained. Layout changes belong in `templates/print.css`, `_parts.html`, `datasheet.html` and `master.html`. `build_catalogues.py` defines logical pages and validates the expected page count before publishing, adds PDF bookmarks and updates the contents registry. Review all pages after changing content or typography; overflow is a build failure, not a reason to shrink the entire document.

The explicit `LAYOUT_EDITION` records design edition, not engineering approval. The generator qualifies catalogue summaries against the existing model table: WRD lists 20–2,000 CFM, WCP tank materials vary by model, and WDV no-air-loss/interval behavior varies by valve type. The water heat-load formula labels its units and approximation. These editorial clarifications do not alter model ratings or establish technical approval. Outstanding engineering questions remain in `CONTENT_TODO.md`.

After regeneration, `prepare_downloads.py` derives hashes, sizes and page counts, writes 420px WebP cover/page thumbnails and their provenance sidecars, and prunes superseded generated thumbnails. `downloads.json` owns purpose, mappings and contents; `download_metadata.json` owns derived facts. A changed PDF with stale metadata fails the ordinary site build before it clears `public/`. Commit source PDFs, templates, registry, metadata, thumbnails and rebuilt `public/` together.

## Reader

The preview lazily loads the locally vendored Mozilla PDF.js 6.4.299 library and worker only after a customer opens a document. It renders PDF canvases with selectable text, continuous pages, synchronized page controls, section links, thumbnails and fit/percentage zoom. Zoom and resizing retain the reading position. Desktop keeps a contents sidebar; mobile uses collapsible contents. Canvas resolution and offscreen retention are bounded.

Each opening and zoom has an invalidation token. Closing, a load failure or the 30-second timeout cancels rendering and disposes the loading task; retry starts a fresh attempt. Original-PDF access and direct downloading stay available. Without JavaScript or dialog support, Preview PDF opens the original document. Hash query strings prevent a browser from showing a prior PDF after regeneration. Apache serves `.mjs` as JavaScript under the existing nosniff policy. Vendored source/version/license are recorded in `assets/js/vendor/pdfjs/README.md`.

Review desktop, 390px and 320px layouts, dense tables, fit/percentage zoom, scrolling to the final page, contents jumps, resizing, Escape/focus return, failed retrieval/retry and repeated opening/closing. Automated tests cover document integrity, metadata freshness, source model columns, section references and page-selection calculations. Structural tags and selectable text are checked; this is not a PDF/UA certification.

Library links record download intent, preview intent and specification navigation separately. A download click does not prove the file was saved. Document requests use the existing enquiry endpoint with `request_type=Technical document`, a document type and an optional model; the endpoint includes these fields in its existing lead record and notification.
