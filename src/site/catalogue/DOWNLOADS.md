# Maintaining the downloads library

`../data/downloads.json` records each document's purpose, product mappings and contents. Model specifications stay in the existing product JSON files.

After an approved PDF is changed:

1. Update the PDF in `../static/downloads/`, preserving its public URL.
2. Check the document's contents/page references, title, coverage note and product mappings in `downloads.json`. Record actual document revisions and engineering approval separately from export dates; a new export is not technical approval.
3. Run `python3 src/site/catalogue/prepare_downloads.py` from the repository root. This preparation step requires Poppler (`pdfinfo`, `pdftoppm`) and Pillow. It writes `download_metadata.json` and WebP cover previews plus every PDF page at a 1,800 px maximum dimension, named by PDF content hash. Full pages load only when a customer opens the quick look or changes pages.
4. Run `python3 src/site/build.py` and `/opt/homebrew/bin/python3 -m pytest -q`.
5. Review the library, the revised PDF and its linked specifications. Commit the PDF, registry/metadata/previews and rebuilt `public/` together.

The ordinary site build needs no PDF tools. It verifies PDF hashes, contents page ranges, product mappings, metadata and cover/full-page preview availability. A changed PDF with stale metadata fails the build with the preparation command rather than publishing old page counts or covers.

The current master catalogue still describes 19 product lines. Its registry coverage note must be revised when that PDF's coverage changes. Existing documents have not received a new engineering approval as part of the page redesign; see `Reports/ux/downloads-review-and-plan.md` for outstanding editorial and technical questions.

The library’s “Preview PDF” links open a native dialog with page selection, arrow-key navigation, fit/zoom, download and original-PDF access. Without JavaScript or dialog support, those links open the original PDF in a new tab. Previews are images; the original PDF remains available for searchable/selectable text, assistive reading and printing.

Library links record download intent, preview intent and specification navigation separately. A download click does not prove the file was saved. Document requests use the existing enquiry endpoint with `request_type=Technical document`, a document type and an optional model; the endpoint includes these fields in its existing lead record and notification.
