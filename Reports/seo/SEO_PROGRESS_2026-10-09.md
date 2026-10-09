# SEO progress and niche keywords, 9 Oct 2026

Every number is measured, with its source and date. Calculated figures show the formula. Where a source has not caught up to today, the table says so.

## 1. Did SEO improve since the 5 Oct baseline?

Yes on visibility and impressions. Average position in Search Console got worse, because new pages now appear at deeper positions. The Coimbatore cooling-tower term regressed.

| Measure | Before | Now | Source and date |
|---|---|---|---|
| Semrush visibility (tracked keywords) | 2.33% (5 Oct) | 4.73% (8 Oct) | Semrush Position Tracking UI, campaign 5590065 |
| Semrush estimated traffic | 3.31 (5 Oct) | 9.55 (8 Oct) | same |
| Semrush average position | 94.58 (5 Oct) | 87.38 (8 Oct) | same |
| Keywords in Google top 100 | 3 of 45 (5 Oct) | 7 of 45 (8 Oct) | same |
| Keywords in top 3 | 1 (win equipments) | 2 (+ moisture separator for air compressor, #1) | same |
| GSC impressions per day | 30 Sep to 4 Oct: 241 over 3 days with data (about 80/day) | 5 to 6 Oct: 733 over 2 days (about 367/day) | Search Console API, data to 6 Oct |
| GSC clicks per day | 14 over 3 days (about 4.7/day) | 13 over 2 days (about 6.5/day) | same |
| GSC click-through rate | 5.8% | 1.8% | calculated: clicks / impressions |
| GSC impression-weighted average position | 9.5 | 18.0 | calculated from daily rows |
| GA4 organic search sessions | 0 (1 to 4 Oct) | 53 (5 to 8 Oct: 12, 13, 15, 13) | GA4 property 557291485, channel "Organic Search" |
| Queued indexing pages in Google's index | 19 of 28 (7 Oct) | 28 of 28 (9 Oct) | URL Inspection API, all 9 pages "Submitted and indexed" |

Caveats:
- Search Console data ends on 6 Oct, and GA4 data for today (9 Oct) is partial (1 session at check time).
- Semrush data is the 8 Oct update.
- The window is only 4 to 5 days, so these are early signals, not a trend.
- The GA4 "Organic Search" channel also counts other search engines, so it will not match GSC exactly.
- Direct traffic (124 sessions over the period) includes the owner's own testing, so it is not used here.

## 2. What got worse

**"cooling tower manufacturers in coimbatore": #16 (5 Oct) to #34 (8 Oct).**
This was already fixed in commit b10f34f (7 Oct, 22:40 IST): the Coimbatore page was renamed to /locations/cooling-tower-manufacturers-in-coimbatore.html with a 301 redirect, linked from the footer, all six cooling-tower product pages and the category page (4 to 109 internal links). The Search Console split below covers 20 Sep to 7 Oct, so it is pre-fix data:

| Page | Impressions (20 Sep to 7 Oct) | Average position |
|---|---|---|
| /products/square-cooling-towers.html | 4 | 14.5 |
| /locations/coimbatore-cooling-towers.html (now 301 to /locations/cooling-tower-manufacturers-in-coimbatore.html) | 3 | 10.7 |

Status on 9 Oct:
- The 301 and the renamed page are live (checked 9 Oct). The renamed page was crawled 8 Oct 17:59 and is indexed.
- The square cooling tower page has not been recrawled since 1 Oct, so Google has not yet seen its new link to the Coimbatore page.
- The Semrush #34 was taken on 8 Oct, about a day after the fix shipped and before Google recrawled. It is too early to judge whether the fix worked.
- The Semrush Landscape report still shows 5 of 9 pages as cannibalising (17% rate), which predates the fix.
- The title of the square page ("FRP Square Cooling Tower Manufacturer") does not contain "Coimbatore", so the two titles do not compete directly.

Re-check the query in Semrush around 16 Oct. If it is still below #30, look at which URL Google ranks for it and at the square page's crawl date.

## 3. Niche keywords where we can win

Volumes are Semrush India estimates. KD is Semrush keyword difficulty (lower is easier). "Our position" uses the Semrush UI, 8 Oct, or GSC average position (20 Sep to 7 Oct).

### A. Already ranking: push into the top 10

| Keyword | Volume/mo | KD | Our position | Action |
|---|---|---|---|---|
| automatic drain valve for air compressor | 880 | 6 | #15 (not ranked 5 Oct) | Strengthen the automatic-drain-valve guide: exact phrase in heading and first paragraph, a short spec table, internal links from the product page. gemindia ranks #12 for "auto drain valve for air compressor" (720/mo, KD 3). |
| moisture separator (not tracked) | 720 | 7 | GSC average #8.8 on the guide (29 impressions, 0 clicks) | Add a short answer block and a link from the product page. Clicks are zero despite impressions; the title and snippet should be checked. |
| heat exchanger manufacturers in coimbatore | 140 | 5 | #20 | Strengthen the Coimbatore heat exchanger page with the exact phrase and FAQ. |
| air dryer manufacturers in coimbatore | 90 (Semrush UI) / 110 (volumes file) | 5 | #22 | Strengthen the Coimbatore air dryer page. |
| cooling tower manufacturers in coimbatore | 170 | 6 | #34 (was #16) | See section 2. |
| moisture separator for air compressor | 480 | 6 | #1 | Defend: keep the guide linked from the product page. |

**Correction (9 Oct):** the difficulty numbers in this report came from two different Semrush scales. The 5 Oct figures (for example drain valve KD 7, cooling tower fills KD 4) are not comparable with the 9 Oct "difficulty index" (drain valve 20, cooling tower fills 16). Use `niche_keywords_2026-10-09.csv` (9 Oct index) for all comparisons. Volumes also moved between reads (water chiller machine 1,600 to 1,300; moisture separator 720 to 880).

### B. Not ranking yet, low difficulty, real volume

| Keyword | Volume/mo | KD (9 Oct index) | Why it is an opening |
|---|---|---|---|
| water chiller machine | 1,300 | 4 | No dedicated page. The India top 12 are small chiller makers and marketplaces (Amazon, IndiaMART, Justdial), so it is beatable. Our industrial process chillers are the nearest page. |
| cooling tower fills | 1,000 | 16 (moderate) | We have a live fills page (indexed 5 Oct). The India top 15 are PVC fill specialists plus IndiaMART, Justdial and TradeIndia; we are not in the top 15. |
| water chiller machine | 1,600 | 6 | Not ranking. Our chiller pages exist; decide which page should own this term. |
| drain valve | 1,600 | 6 | Not ranking. The automatic drain valve guide is the closest page. |
| milk chiller plant | 590 | 6 | Not ranking. The dairy industry page could link here. |
| ice flake machine | 590 | 6 | Not ranking. Page indexed 7 Oct. |
| cooling tower manufacturers | 880 | 6 | Not ranking. Broad term; needs a national page. |
| refrigerated air dryer | 720 | 5 | Not ranking. Page indexed 7 Oct. |
| cross flow cooling tower | 480 | 6 | Not ranking. The cross-flow vs counter-flow article is indexed but gets only 8 impressions. |
| heat exchanger manufacturers in chennai | 170 | 6 | Not ranking. Chennai heat exchanger page indexed 7 Oct. |
| industrial chiller manufacturers | 260 | 6 | Not ranking. |
| water chiller manufacturers in india | 140 | 6 | Not ranking. |
| air receiver tank manufacturers | 140 | 6 | Not ranking. |

### C. Calculator queries: the strongest niche we already own

| Keyword | Volume/mo | KD | Our position (GSC average, 20 Sep to 7 Oct) |
|---|---|---|---|
| chiller tr calculation formula | 210 | 7 | 6.9 (8 impressions) |
| tr calculation formula | 210 | 7 | 11.6 (11 impressions) |
| tr formula | not measured | not measured | 9.4 (7 impressions) |
| cooling tower approach and range | not measured | not measured | 7.8 (5 impressions) |
| cooling tower capacity | 390 | 7 | Tracked at #39 (Semrush) |

Calculator pages earn links and are cheap to rank for. Two near-page-one queries (6.9 and 11.6) are already showing impressions without a dedicated push.

## 4. What to do next

1. Re-check "cooling tower manufacturers in coimbatore" around 16 Oct (section 2). The fix is already live; no new change is needed yet.
2. Strengthen the four Coimbatore pages and the drain valve guide (section 3A).
3. Add "cooling tower fills", "moisture separator" and "chiller tr calculation formula" to Semrush Position Tracking, so they are measured daily. The tracking campaign is only reachable in the Semrush UI; the API returns "campaign not found".
4. Re-check Search Console on 19 Oct (two weeks after the 5 Oct requests) for impressions and average position.

## 5. Sources and limits
- Search Console API, service account, property https://winequipments.com/, data 20 Sep to 6 Oct.
- URL Inspection API, 9 Oct.
- GA4 property 557291485, 20 Sep to 9 Oct (9 Oct partial).
- Semrush Position Tracking UI, campaign 5590065, data 5 to 8 Oct. The Semrush API returns "campaign not found" for this project, so these values were read from the UI.
- Semrush volumes: Reports/seo/semrush_volumes.csv (5 Oct), Reports/seo/semrush_position_tracking_2026-10-05.csv (5 Oct), Reports/seo/semrush_competitors_2026-10-05.csv (5 Oct).
- Not measured: the Semrush trial status (the UI now shows a "Get started" prompt, so check the plan before relying on it).
