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
