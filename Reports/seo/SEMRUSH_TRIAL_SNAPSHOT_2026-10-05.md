# Semrush trial snapshot (5 Oct 2026)

Saved during the 7-day trial so the data survives it. Source: Semrush connector, database `in` (India, desktop). Volumes and traffic are Semrush estimates.

Files in this folder:
- `semrush_competitors_2026-10-05.csv`: relevant keywords for gemindia.com, worldcoolingtowers.com, goldcoolingtowers.com, seenucompressor.com. Brand-name, IT-services and unrelated keywords (e.g. "gem washing machine customer care number") were removed; positions are as reported.
- `semrush_winequipments_2026-10-05.csv`: every keyword Semrush currently has winequipments.com ranking for in the top 100.

## Baseline for winequipments.com
- Position Tracking (campaign for 45 keywords, day 1): visibility 2.33%, average position 94.58, estimated traffic 3.31.
- Organic research: only 9 keywords in the top 100, all at positions 20 to 45. Best: "efficacy tech equipments llp" (20, not our brand), "cooling tower approach formula" (30), "aftercooler" (30), "cooling tower range" (31), "air receiver" (33). Page 1 for none.
- The data predates the new pages (moisture separators, guides, location pages) being indexed.

## Competitor findings
- **gemindia.com** is the real competitor for products: #3 "compressed air dryer" (2,400/mo, KD 11), #3 "drain valve" (1,600, KD 11), #1 "moisture separator for air compressor" (480, KD 7), #8 "moisture separator" (880, KD 7), #3 "desiccant dryer" (590, KD 19), #2 "cooling tower manufacturer in coimbatore" (210, KD 5). It uses one page per city and product pages with titles matching searches.
- **goldcoolingtowers.com**: #5 "cooling tower manufacturer in coimbatore", #9 "cooling tower price" (320, KD 3), #19 "frp cooling tower" (720, KD 4). Targets spare parts too (fills 1,000/mo, KD 4).
- **worldcoolingtowers.com**: little real traffic; most of its keywords are unrelated spam. Not a useful benchmark.
- **seenucompressor.com**: compressors only; ignore except "refrigerated air dryer" (#55).

## Opportunities seen in the data (not yet actioned)
- Cooling tower fills / nozzles / spare parts (fills 1,000/mo KD 4; fins 480 KD 4; nozzle 260 KD 3): easy, but only worth a page if Win supplies them. Owner to confirm.
- "cooling tower price" (320, KD 3): needs a price-factors guide without invented prices.
- Dry/adiabatic cooling tower manufacturers in India (260 and 140/mo, KD 11-12): only if Win makes them.

## Site audit (crawl of 2 Oct 2026, 78 pages)
Health score 93 (+12 vs the previous crawl). 149 errors, 191 warnings, 139 notices.
- Errors: 149 structured-data items (hasVariant Product variants lacking offers/reviews; deliberately left, fixing means inventing prices).
- Warnings: 189 broken external links (wa.me links, false positives); 72 unminified JS/CSS files (the current build minifies JS; the crawl saw the older live site); 1 low text-to-HTML ratio.
- Notices: 137 resources formatted as page links; 1 llms.txt not found (fixed in commit 8e5d834, awaiting deploy); 1 page with one internal link.
- Zero 4xx/5xx errors, broken internal links, duplicate titles/descriptions, missing H1/meta, canonical or redirect-chain problems.

## Not obtained
- The tracking campaign's per-keyword positions: the position API returned "campaign not found" for project id 27533134. Export from the Semrush UI (Position Tracking > Overview > Export).
- Adding competitors to the campaign: needs the Semrush UI; the plan appears to limit the campaign to one target.
- API units: several calls reported negative balances, so the trial allowance may be spent.
