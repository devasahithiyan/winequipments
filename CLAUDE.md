# Win Equipments (winequipments.com): instructions for Claude

Static site for Win Equipments, Arasur, Coimbatore (manufacturer of compressed air treatment equipment, process chillers, cooling towers, heat exchangers). Founded 2008, 1,200+ installations. Full context for the SEO programme is in `Reports/seo/HANDOFF.md` (redacted copy; the user supplies real account details in chat) and `Reports/seo/SEO_ACTION_PLAN.md`.

## Rules
- **Real facts only.** No invented prices, specs, ratings, certifications, customers or counts. Use catalogue data (`src/site/data/products/*.json`), `src/site/data/site.json`, or owner-confirmed info. See `CONTENT_TODO.md`. Where no datasheet exists, say "engineered to order".
- Phones: +91 95972 28969 (primary), +91 95972 28975 (secondary). **Never use 95972 28978.** Address: SF No. 4/195 B, Kallangadu, Nadu Arasur, Arasur Post, Coimbatore 641 407.
- Give real, labelled numbers (measured vs calculated). No assumptions presented as facts.
- Work autonomously, but no payments, no billing changes (Google Ads has a campaign that must stay unable to run), no passwords, accept terms only with explicit permission.
- The owner confirmed on 5 Oct 2026 that Win supplies everywhere in India, so location pages for any Indian city are fine. Still do not invent customers, installations, local offices or delivery times for a city; say "we supply plants in X" and "send your site for delivery arrangements". "Efficacy Tech Equipments LLP" is not this company.
- Do not edit the Google Business Profile until it is re-verified (it shows "Verification required").

## Build and test
```
python3 src/site/build.py                 # regenerates public/ (tracked in git)
/opt/homebrew/bin/python3 -m pytest -q    # title 10-60 chars, description 70-155, one H1, schema, links, sitemap
```
Use `/opt/homebrew/bin/python3` for tests. Commit source and rebuilt `public/` together, add files by path (not `git add -A`). Deploy: push branch `test`; the owner then clicks Update from Remote, then Deploy HEAD Commit in cPanel.

## Where things are
Company data `src/site/data/site.json`; products `src/site/data/products/*.json`; location pages `src/site/data/locations.json`; articles `src/site/content/blog/*.md`; redirects `src/site/data/redirects.json`; templates `src/site/templates/`; SEO reports and keyword data `Reports/seo/`. Credentials live outside the repo in `~/.config/seo-keys/` (never commit).

## SEO status in one line
New pages (moisture separators, 6 guides, 8 landing pages) are live as of 5 Oct 2026. Next: Search Console indexing requests, Semrush Position Tracking, the owner's Business Profile verification video, real case studies/photos, then measure with Search Console and GA4 after 2-4 weeks. Keyword demand comes from Semrush (`semrush_volumes.csv`) and Google Keyword Planner buckets.
