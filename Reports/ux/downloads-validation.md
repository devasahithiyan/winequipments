# Downloads page validation — 8 October 2026

Implemented locally: grouped product brochures, a separate company overview, cover thumbnails, contents disclosures, page counts/file sizes, online specification links, direct-save links, labelled new-tab previews and a focused document request.

Verification:

- Site rebuild: 109 pages generated.
- Python suite: 372 passed, including six download-library checks for PDF changes, contents page ranges, product coverage, mappings and generated links.
- JavaScript syntax checks passed. Existing chiller lifecycle tests also passed.
- Desktop (1440 px) and mobile (390 px) visual review; 320 px overflow check. A clipped mobile action label was fixed by allowing it to wrap; its content now fits its button.
- Native contents disclosure operated with Enter. Contextual request navigation selected the appropriate product and moved focus to the form.
- PDF retrieval succeeded; the downloaded WCP file matched the published source byte for byte. The WCP specification link reached the correct product `#specs` section. Generated-library tests checked all specification anchors and save/preview links.
- A loopback-only mock endpoint verified document intent, GA drawing type and model transmission. A simulated 503 failure preserved entered text and restored the request button. Retry showed document-specific success text and the returned reference. Selecting another document's request link preserved the product the customer had manually chosen. No email was sent.
- Mechanical design scan: no new UI findings. Its existing lightbox-image warning concerns a runtime-created image whose source is set when opened; template stylesheet resolution was incomplete because the scanner cannot resolve Jinja URLs.
- Whitespace checks passed. Existing PDF binaries are unchanged.

Limits: the local server does not execute PHP, so actual production mail delivery and server-side PHP execution were not tested. The request uses the existing endpoint and lead logger; its notification subject distinguishes document requests. No deployment or branch push performed. PDF content revisions and engineering confirmation remain a separate phase.

Review screenshots: `.build-cache/downloads-qa/desktop.png` and `.build-cache/downloads-qa/mobile.png`.


## PDF recognition and quick look — 8 October 2026

- Added a document-style cover with a visible PDF badge, format/page/size information beside each title, and direct Preview PDF and Download PDF actions.
- Rendered all 45 existing PDF pages to hash-named WebP assets. The quick look requests only the chosen page, with page selection, previous/next, zoom/fit, original-PDF access and download. PDF binaries are unchanged.
- Reviewed desktop (1440 px), mobile (390 px) and compact mobile (320 px). No document or dialog overflow; enlarged pages scroll within the preview. Confirmed Escape closes the dialog and returns focus to the opener; the DOM order matches the visible action order.
- Temporarily removed a preview asset locally to verify the failure message and recovery by choosing another page; restored the asset and confirmed it loads. Also checked rapid page changes, final-page disabled navigation and switching documents.
- Rebuilt 109 pages; 375 Python tests passed, including missing/stale page-preview validation. Source and generated JavaScript syntax checks and Git whitespace checks passed.
- Original PDF links remain the fallback without JavaScript/dialog support. Preview images do not add searchable text; the original PDF is always available.

## Complete catalogue and PDF reader redesign — 8 October 2026

- Regenerated all nine PDFs: 48 pages, one A4 portrait page box. Eight product brochures use consistent covers, readable split tables with repeated model IDs, section hierarchy, footer, linked contents and bookmarks. The master now covers all 23 current product entries. The set totals 6,691,477 bytes; product files are 0.53–0.78 MB and master 1.63 MB. Byte sizes differ with content, while physical page dimensions match.
- Source specification tables and grades remain unchanged. Regression checks verify all model identifiers, every grouped column, actual contents headings/page references, structural tags and selectable text. Catalogue summaries qualify WRD's listed range, model-dependent WCP materials and WDV operation; the water formula labels its units. This is editorial consistency, not engineering reapproval.
- Actual PDFs replace image-only preview via locally vendored Mozilla PDF.js 6.4.299, loaded on intent. Continuous scrolling, selectable text, contents/page thumbnails, page selection, fit width/fit page and percentage zoom share one reader. Per-opening and zoom cancellation, a 30-second timeout, retries and pixel/offscreen limits protect recovery and memory.
- Desktop 1440px, mobile 390px and compact mobile 320px captures are in `.build-cache/catalogue-redesign/review/`. Confirmed no dialog/toolbar overflow, internal scrolling at percentage zoom, contents navigation, resize/reading-position preservation, final-page selection/disabled Next, and Escape returning focus to the opener. Closing removes canvases. Temporarily removed the locally served receiver PDF: the error offered Retry and original/download access; restoring the PDF and clicking Retry rendered the document successfully. Test asset restored.
- All 48 PDF pages were rasterized for visual review, with 13 contact sheets in `.build-cache/catalogue-redesign/sheets/`. All 57 cover/page thumbnails carry provenance. Thumbnails are 420px; full PDF text/canvases load only in the reader. PDF and preview URLs use content-hash queries to avoid stale cache. Apache `.mjs` MIME type is explicit.
- Final validation: rebuilt 109 pages; 379 Python tests passed, plus the Node page-selection regression tests. All nine source/public PDFs match byte for byte. Source/generated JavaScript syntax and Git whitespace checks passed. Independent Impeccable finish review disposition: **Ship**, after all three reader captures, all 13 contact sheets and eight dense-page rasters; no material visual findings. The review covers supplied visual evidence, not engineering certification.
- Historical checks above apply to earlier versions. No production deployment or PHP mail execution performed.
