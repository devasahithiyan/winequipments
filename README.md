# winequipments.com

Static site for Win Equipments, Coimbatore. A Python/Jinja2 build in `src/site/build.py` generates everything into `public/`. cPanel deploys `public/` (see `.cpanel.yml`).

## Build and test
```
python3 src/site/build.py          # writes public/ (pages, CSS, JS, images, sitemap, .htaccess)
python3 -m pytest tests/test_seo.py # titles, descriptions, H1, canonicals, schema, links, sitemap
python3 -m http.server 8080 -d public
```
Requires Python 3.11+, Jinja2, Pillow and numpy. Image variants are cached in `.build-cache/`.

## Where things live
| What | Where |
| --- | --- |
| Company facts, families, industries, process steps | `src/site/data/site.json` |
| Product specs (from the original catalogues) | `src/site/data/products/*.json` |
| Real photos and captions | `images/works/`, `src/site/data/photos.json` |
| Articles | `src/site/content/blog/*.md` |
| Location pages | `src/site/data/locations.json` |
| Redirects for old URLs | `src/site/data/redirects.json` → `public/.htaccess` (from `src/site/htaccess.tpl`) |
| Templates | `src/site/templates/` |
| CSS / JS | `src/site/assets/css`, `src/site/assets/js` |
| PHP (enquiry form, chat) | `src/site/php/` |
| Catalogue PDFs (generated) | `python3 src/site/catalogue/build_catalogues.py` → `src/site/static/downloads/`; originals kept in `src/site/catalogue/originals/` |
| Download library | `src/site/data/downloads.json`; after changing PDFs, run `python3 src/site/catalogue/prepare_downloads.py` to refresh hashes, page counts and thumbnails (requires Poppler and Pillow). All nine PDFs use A4 portrait; the preview renders actual PDFs with a locally vendored, lazy-loaded PDF.js reader. See `src/site/catalogue/DOWNLOADS.md` for regeneration and checks. The normal site build checks PDF hashes and needs no Poppler. |

## Rules
- Only real facts: catalogue data, company data and owner-confirmed information. No invented prices, ratings or claims. See `CONTENT_TODO.md`.
- `secrets.php` (Gemini key) lives only on the server and is never committed.
- Owner actions for SEO: `SEO_CHECKLIST.md`.
