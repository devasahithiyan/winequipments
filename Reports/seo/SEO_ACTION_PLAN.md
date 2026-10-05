# Win Equipments SEO action plan (Semrush + Google Keyword Planner data)

Date: 5 Oct 2026. Built only from measured data in `KEYWORD_RESEARCH_AND_FORECAST.md` (sections 10-12), `semrush_volumes.csv`, and `keyword_planner_volumes.csv`. Anything not measured is labelled. Nothing here is a ranking promise.

## 1. What the data says (one paragraph each)

1. **Starting point is near zero.** Semrush: Authority Score 2, 9 ranking keywords (all page 3 or lower), 0 organic traffic. Search Console and GA4 are only days old.
2. **Backlinks are not the main gap.** seenucompressor.com has 280 referring domains (you have 264) and gets about 1,100 visits a month from just 19 keywords. It ranks at positions 5-6 for local "manufacturers in coimbatore" searches at difficulty 12-13. Pages that match searches matter first.
3. **Demand is real but fragmented.** 216 of 473 candidate searches have 10+ searches a month; the 95 with buying intent total about 11,550 a month. Google Keyword Planner buckets agree with Semrush on every term compared.
4. **The easiest searches are product-detail terms, not city terms.** Drain valve (1,600/mo), compressed air dryer (2,400), moisture separator (880), auto drain valve for air compressor (720) all have difficulty 3-11, and GEM (authority 22) is the only strong competitor ranking.
5. **Heat exchangers are the biggest buying-intent group** (about 5,200 searches a month across 8 searches), and you already have the page.
6. **The directories (IndiaMART, Justdial, TradeIndia) hold 1-4 first-page slots** on local searches, so being listed correctly there is a second route to the same buyer.

## 2. Target groups and ceiling (calculated)

Formula: visits = monthly searches × click-through rate. CTRs from published studies already used in the forecast: position 3 = 3.89% (Advanced Web Ranking) to 10.2% (Ahrefs); position 1 = 20.02% to 39.8%. Searches are Semrush India volumes.

| Group | Searches in group (per month) | If position 3 | If position 1 |
|---|---|---|---|
| Air treatment: compressed air dryer, air dryer for compressor, drain valve, compressed air filter, air receiver tank, refrigerated air dryer, desiccant dryer, moisture separator, auto drain valve (2 variants), compressor dryer, air receiver tank manufacturers, air dryer manufacturers coimbatore | 13,570 | 528 to 1,384 | 2,717 to 5,401 |
| Heat exchangers (buying): 8 searches | 5,180 | 202 to 528 | 1,037 to 2,062 |
| Cooling towers (buying): 10 searches | 2,190 | 85 to 223 | 438 to 872 |
| Chillers (buying): 7 searches | 1,830 | 71 to 187 | 366 to 728 |
| **All four** | **22,770** | **886 to 2,322** | **4,559 to 9,063** |

**Read this carefully:** these are ceilings, not forecasts. (a) They assume ranking at that position for every search in the group, which will not happen. (b) Variants such as "drain valve" and "automatic drain valve" are largely the same people, so the true total is lower than the sum. (c) Some searches ("air dryer for compressor", "compressed air filter") mix buyers with readers or hair-dryer shoppers. Plan on the **low end of the position-3 column** as the realistic first target: roughly **900 visits a month** across the four groups. Enquiries depend on your conversion rate, which GA4 will measure (at 1% of 900 visits = 9 a month; at 3% = 27; arithmetic only).

## 3. Phases

### Phase 0: this week, owner actions (nothing else works without these)
| # | Action | Why (data) |
|---|---|---|
| 0.1 | In cPanel: Update from Remote, then Deploy HEAD Commit | Redirects, schema fixes, GA4 tag and review link are on GitHub but not live. |
| 0.2 | Record the Google Business Profile verification video at the factory | Profile shows "Verification required"; the local map block is the main source of local enquiries. |
| 0.3 | Confirm whether `efficacyllp.in` / "Efficacy Tech Equipments LLP" is your company | Semrush lists it as a 100%-relevant competitor, and your home page ranks for that name. |
| 0.4 | Confirm Win Equipments makes or supplies **moisture separators** and which models | Needed before a moisture separator page; I will not invent a product. |
| 0.5 | Send 2-3 real customer projects (name with permission, industry, equipment, result) and factory/product photos | Real case studies and photos are missing from the site and are the main trust gap. |

### Phase 1: weeks 1-3, pages for the easiest searches (difficulty 3-11)
I build and ship these; every claim from catalogue data only.

| Page | Targets (searches/mo) | Status |
|---|---|---|
| Automatic drain valves (strengthen) | drain valve 1,600; auto drain valve for air compressor 720; air compressor automatic drain valve 720; automatic drain valve 170 | Page exists; rewrite title, H1, FAQ, add model table, internal links. |
| Compressed air dryer hub | compressed air dryer 2,400; air dryer for compressor 2,400; compressor dryer 390; desiccant dryer 590; refrigerated air dryer 720 | New hub comparing refrigerated vs desiccant, links to both product pages. |
| Moisture separator | moisture separator 880; moisture separator for air compressor 480 | New page, only after 0.4. |
| Air receiver tanks (strengthen) | air receiver tank 1,000; air receiver tank manufacturers 140; air receiver tank supplier 140 | Page exists; add capacity table and calculator link (Semrush shows the old `air_receiver` URL at #33). |
| Compressed air filters (strengthen) | compressed air filter 1,900 | Page exists. |

### Phase 2: weeks 3-6, buying-intent pages for cooling towers, chillers, heat exchangers
| Page | Targets (searches/mo) |
|---|---|
| Shell-and-tube heat exchanger (expand) + manufacturer landing | heat exchanger manufacturers in india 1,600; heat exchanger manufacturer 1,300; heat exchanger companies in india 1,000 (KD 18); shell and tube manufacturer in india 390 |
| Cooling tower manufacturers (India + Coimbatore) | cooling tower manufacturers 720; in india 390; in coimbatore 210; manufacturer near me 140 |
| Cross-flow vs counter-flow cooling tower (article) | cross flow cooling tower 480 (KD 4) |
| Types of cooling tower (guide, links to product pages) | types of cooling tower 2,900; cooling tower types 3,600 (informational, builds authority) |
| Water chiller / industrial chiller manufacturers | water chiller manufacturers 480; industrial chiller manufacturers 210; milk chiller plant 590 |
| Existing calculators | Already rank #30-45 for cooling tower capacity (390), TR formula (210), approach formula (140); improve with explanations and links to product pages. |

### Phase 3: weeks 6-10, city and region pages
GEM wins traffic with one page per city. Build pages only for cities with measured demand and only where Win can genuinely supply: Coimbatore (cooling tower 210, heat exchanger 170, air dryer 110), Chennai (heat exchanger 170, cooling tower 90), Bangalore (industrial chiller 140, water chiller 170), Pune (heat exchanger manufacturer 480, cooling tower 110), Ahmedabad (cooling tower 110, water chiller 90), Delhi (cooling tower 140). Each page needs real local content (nearby industries, delivery and service details), not a template with the city swapped.

### Phase 4: ongoing
| Action | Source of the target |
|---|---|
| Google Business Profile: complete services, products, photos, weekly posts, reply to the 39 reviews, add Salem, Hosur, Chennai, Bengaluru service areas (after verification) | Local map block |
| Fix address everywhere (Facebook, Tradeindia, Aajjo, IndiaMART, Justdial) to SF No. 4/195 B, Kallangadu, Arasur, Coimbatore 641 407 | Directory slots are 1-4 of page 1 |
| Complete every IndiaMART/Justdial product listing with photos and link to the matching page | Same |
| Product-page schema errors (~120 from Semrush audit) | Awaiting your "do it" |
| Backlinks: TAPMA membership page, supplier/industry directories, customer sites that mention you | Authority Score 2 vs 11-22 for competitors |
| GA4: mark `quote_submit`, `whatsapp_click`, `call_click` as key events once they fire | Needed to learn conversion rate |

## 4. How we will know it is working

| Checkpoint | Measure | Source |
|---|---|---|
| Week 2 | New pages indexed | Search Console |
| Week 4-6 | First impressions and average position for the target searches | Search Console (replaces Semrush estimates) |
| Week 8-12 | Target terms on page 1-2; clicks | Search Console, Semrush Position Tracking (I can set up) |
| Monthly | Visits, enquiries, conversion rate | GA4 |
| Monthly | Re-run `semrush_volumes.csv` keywords for position changes | Semrush MCP |

Rankings take time and are not guaranteed. I will not quote a ranking date. Timelines above are build schedules, not ranking dates.

## 5. What I will not do
- Invent specifications, installations, certifications or reviews.
- Target air compressor keywords (Seenu's traffic) since Win does not make compressors.
- Build thin city pages.
- Spend money (Ads billing stays off; the existing Ads campaign stays untouched).

## 6. Data files
`semrush_volumes.csv` (216 searches with volume), `keyword_planner_volumes.csv` (Google buckets, 286 keywords), `keyword_candidates.txt` (473 starting list), section 11 of `KEYWORD_RESEARCH_AND_FORECAST.md` (competitor gap).
