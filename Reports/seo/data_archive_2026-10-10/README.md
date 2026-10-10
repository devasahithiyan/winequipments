# Win Equipments SEO data archive (10 Oct 2026)

Read this first. This folder holds the SEO data collected on 10 Oct 2026, so the work can continue after the Semrush plan is cancelled. Everything here is a copy or export. Nothing in this folder changes the website.

## 1. Context in one paragraph
Win Equipments (winequipments.com, Arasur, Coimbatore) makes compressed air treatment equipment, process chillers, FRP cooling towers and heat exchangers. Chillers are the main product. The site is a static build (`src/site/build.py` writes `public/`). The website repo is `/Users/devasahithiyan/Desktop/WIn equipments claude` on branch `test`. Changes go to `test`, and the owner deploys them through cPanel (Update from Remote, then Deploy HEAD Commit).

## 2. Status at 10 Oct 2026
- **Chiller pages went live on 9 Oct.** Google had not recrawled them by 10 Oct. The first real read is about 20 Oct, and again about 3 Nov.
- **Search Console data ends on 6 Oct.** It is the newest the API returns, so 7–10 Oct are missing.
- **Semrush** still has phone rankings for 10 Oct (landscape PDF). Its organic database looks stale for our domain (keyword positions match 5 Oct).
- **Google top spots (phone):** win equipments (#1), automatic drain valve (#1), automatic drain valve for air compressor (#1), moisture separator for air compressor (#1), cooling tower manufacturers in Coimbatore (#14).
- **No chiller keyword is in Semrush's top 100** on 10 Oct.
- **Site audit (10 Oct crawl):** 100 pages crawled, health 94%, structured-data errors 149 down to 7, unminified scripts 72 down to 1, llms.txt fixed.

## 3. Folder map

| Folder | What is in it | Source | Date covered |
|---|---|---|---|
| `search_console/` | Google Search Console exports, URL index status | Search Console API (read-only service account) | 1 Sep to 6 Oct 2026 (latest data available) |
| `ga4/` | GA4 channel, landing page and event exports | GA4 property 557291485 (Win Equipments) | 1 Sep to 10 Oct 2026 |
| `semrush/` | Semrush PDFs and CSVs: site audit, position tracking, competitors, domain rank | Semrush (project 27533134, campaign 5590065) | 2–10 Oct 2026 |
| `keyword_research/` | Keyword volumes, difficulty and SERP notes | Semrush India database, Google autocomplete | 5–10 Oct 2026 |
| `site_audit/` | Five Semrush site audit CSVs (compare, issues, mega export, pages, structured data) | Semrush site audit | 4 Oct and 10 Oct 2026 |
| `plans_and_reports/` | Chiller plans, KPI tracker, progress notes, the re-check script | Written by the SEO work | 6–10 Oct 2026 |

## 4. File guide

### search_console/
- `gsc_daily_totals.csv`: clicks, impressions, CTR and average position per day. Columns: date, clicks, impressions, ctr, position.
- `gsc_query_page_1sep_10oct.csv`: every query and page pair. Google hides rare queries, so totals are lower than the daily totals.
- `gsc_page_totals.csv`: totals per page.
- `gsc_country.csv`: totals per country (India is the main one).
- `gsc_device.csv`: totals for mobile, desktop and tablet. Mobile average position is about 8, desktop about 22.
- `url_inspection_key_pages_2026-10-10.csv`: whether Google has indexed the chiller and product pages, and when it last crawled them. Created by the URL Inspection API.
- Caveat: data stops on 6 Oct. Re-run the pull once Search Console updates.

### ga4/
- `ga4_channel_by_date.csv`: sessions, users, engagement rate and session length per channel per day.
- `ga4_landing_pages_by_channel.csv`: sessions per landing page and channel.
- `ga4_events_by_channel.csv`: event counts per channel. Key events: `quote_submit` (2 Direct, 1 Organic), `call_click` (2 Direct, 2 Organic), `whatsapp_click` (1 Direct, 1 Organic). The enquiry events are not yet marked as key events in GA4, so the key-event count is zero.
- Caveat: "Direct" includes the owner's own testing. "Organic Search" also counts other search engines.

### semrush/
- `Semrush-Position_Tracking__Landscape_(organic)-...10th_Oct_2026.pdf`: phone rankings for 4–10 Oct, with 45 tracked keywords. Visibility 9.13%, 8 keywords in top 100, 4 in top 3.
- `Semrush-Site_Audit__Full_Report-...pdf` and `...Overview-...pdf`: the full 38-page site audit and its summary.
- `semrush_position_tracking_2026-10-05.csv` and `...2026-10-07.csv`: daily tracking snapshots from the Semrush UI (the API cannot read the campaign).
- `semrush_competitors_2026-10-05.csv`: competitor keywords (gemindia.com, goldcoolingtowers.com, worldcoolingtowers.com, seenucompressor.com).
- `semrush_winequipments_2026-10-05.csv`: every keyword we ranked for in the organic database on 5 Oct.
- `semrush_domain_rank_2026-10-10.csv`: domain rank in India. Organic keywords: 10. Organic traffic: 0. The organic database looks stale for our domain.
- `semrush_organic_keywords_2026-10-10.csv`: the 10 organic keywords it still lists for us. Positions match 5 Oct exactly.
- `SEMRUSH_TRIAL_SNAPSHOT_2026-10-05.md`: notes from the trial, including the site audit baseline.
- Caveat: Semrush tracks phone results only. Desktop positions are different and are not tracked.

### keyword_research/
- `niche_keywords_2026-10-09.csv`: 25 chiller and niche terms with volume, difficulty index, intent, our position and owning page. The main priority list.
- `semrush_keyword_batches_2026-10-09_10.csv`: 62 keyword lookups from the Semrush batch and related-search tools, grouped by batch name.
- `semrush_volumes.csv`: 216 terms with monthly volume (from 5 Oct).
- `keyword_planner_volumes.csv`: earlier Google Keyword Planner volumes (the Google Ads account is closed, so these are old).
- `keyword_candidates.txt`: 477 candidate search phrases from Google autocomplete, before volumes.
- `KEYWORD_RESEARCH_AND_FORECAST.md`: earlier research notes and forecast.
- Caveat: difficulty numbers come from two different Semrush scales. Use the "difficulty index" from 9 Oct only. Volumes move by 10–25% between reads.

### site_audit/
- `winequipments.com_compare-audits_20261010.csv`: 4 Oct and 10 Oct crawls side by side. Start here for the change.
- `winequipments.com_issues_20261010.csv`: one row per Semrush check, with failed count, total checked and change since last crawl.
- `winequipments.com_mega_export_20261010.csv`: one row per page and one column per check, with counts.
- `winequipments.com_pages_20261010.csv`: per-page SEO facts (title, description, load time, internal links, issues).
- `winequipments.com_pages_structured_data_20261010.csv`: per-page schema types.
- What is left open: 7 structured-data errors (product pages with no price), 264 "broken" external links (all WhatsApp links answering HTTP 429 to the crawler, so not dead), 304 image links formatted as page links, and 2 pages with low text-to-HTML ratio.

### plans_and_reports/
- `CHILLER_5_PHASE_PLAN_2026-10-09.md`: the five-phase chiller programme and its status.
- `CHILLER_KPI_TRACKER.md`: chiller KPI baselines with check dates (about 20 Oct and 3 Nov).
- `CHILLER_MASTER_PLAN_2026-10-09.md`, `CHILLER_STRATEGY_2026-10-09.md`: the market research and chiller plan.
- `NICHE_DEEP_ANALYSIS_2026-10-09.md`: priority niche analysis.
- `SEO_PROGRESS_2026-10-09.md`: progress notes for 9 Oct.
- `SEO_AUDIT_2026-10-06.md`, `IMPROVEMENT_PLAN_OCT2026.md`, `INDEXING_QUEUE.md`: earlier audit, improvement plan and indexing queue.
- `JUSTDIAL_CATALOGUE_FIX.md`: the Justdial catalogue fix sheet (not yet acted on).
- `chiller_check.py`: repeatable Search Console check. Usage: `python3 chiller_check.py START END LABEL`. It needs the service-account key in `~/.config/seo-keys/`, which is not in this folder.
- `chiller_baseline_2026-10-09.csv` and `chiller_check_2026-10-10.csv`: chiller query and page baselines.

## 5. Key numbers (snapshot, 10 Oct)
- Chiller queries (Search Console, 20 Sep to 9 Oct): 80 impressions, 0 clicks, across 37 queries.
- Chiller product pages: no impressions before 9 Oct.
- Organic sessions (GA4, 1 Sep to 10 Oct): 232 page views and 79 session starts from organic search; quote intent events 3; quote submits 1.
- Search Console: 27 clicks and 974 impressions from 20 Sep to 6 Oct.
- Semrush phone visibility (4–10 Oct): 9.13%.
- Coimbatore cooling tower page: #14 (phone). Internal links point to it from 9 Oct onward.

## 6. Known problems and open decisions (owner)
1. **ISO 9001:2015 claim** appears in the site trust line on every product page. IndiaMART says it expired in January 2020. Do not change it without owner confirmation.
2. **Square FRP tower range**: the catalogue says 10–300 TR. The IndiaMART listing may still say 50–500 TR. Owner must confirm the true range.
3. **Google Business Profile** is unverified. The owner must verify it before any profile edits.
4. **Air-cooled model specs** are missing. Owner must supply the table (TR, kW, refrigerant, compressor, tank, dimensions).
5. **20–50 TR chillers**: owner must decide whether Win builds them.
6. **GA4 key events**: enquiry events must be marked as key events in the GA4 interface (not possible through the connector).
7. **Stray files**: copies with " 3.html" in `public/` are not tracked by git. Owner should delete them.
8. **cPanel deploy**: each push to `test` needs Update from Remote and Deploy HEAD Commit.
9. **Semrush plan**: cancel only after the owner has confirmed the billing date. This archive is meant to replace it.

## 7. How to continue without Semrush
- **Rankings:** Search Console (for queries we appear for) and manual checks of the top 10 chiller terms, using a logged-out desktop browser. Repeat weekly.
- **Keyword volumes:** Google Keyword Planner needs an active Google Ads account (the old one is closed). Google Trends and autocomplete are free alternatives, but they give no volumes.
- **Site audit:** the free option is a manual crawl or the Search Console Page indexing report. Semrush's crawl cannot be reproduced exactly.
- **Competitor visibility:** no free equivalent. Track gemindia.com by hand from Google results.

## 8. Dates to remember
- About 20 Oct 2026: first real read of the chiller pages (rerun `chiller_check.py` and update the KPI tracker).
- About 3 Nov 2026: second read, for the trend.
- Before the Semrush billing date (about 12 Oct, per earlier notes): confirm the cancellation is what the owner wants.

## 9. Rules for any agent working on this
1. **Real facts only.** Use catalogue values in `src/site/data/`, owner-confirmed information, or the IndiaMART prices dated 5 Oct 2026. Never invent prices, specs, ratings, customers, certifications or delivery times.
2. **Do not** add review or rating schema, and do not change the ISO claim.
3. **Do not** edit the Google Business Profile, change billing, or send messages.
4. **Do not** delete files without the owner's approval.
5. **Commit by path.** Never `git add -A`. Use the commit trailer `Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>`.
6. **Build and test before pushing to `test`:** `/opt/homebrew/bin/python3 src/site/build.py` and `/opt/homebrew/bin/python3 -m pytest -q`.
7. Keep credentials outside the repo (`~/.config/seo-keys/`). Never copy keys into this folder.
8. Label every number as measured or calculated, with its source and date.

## 10. Files checked and their sizes
See `MANIFEST.csv` in this folder: every file with its size and SHA-256 checksum.
