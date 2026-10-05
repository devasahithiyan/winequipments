# Win Equipments: full handoff for a new AI session

Written 5 Oct 2026. This committed copy is **redacted** because the repo is public: account emails and Google IDs are replaced by placeholders. The full copy is `HANDOFF_PRIVATE.md` (local, git-ignored); the user will supply the real account details in chat or copy that file over. Read this file first, then `Reports/seo/SEO_ACTION_PLAN.md`.

## 1. Who and what

- **Business:** Win Equipments, Arasur, Coimbatore, Tamil Nadu. Founded 2008. Manufacturer of compressed air treatment equipment (refrigerated and desiccant air dryers, compressed air filters, automatic drain valves, air receiver tanks, aftercoolers, moisture separators), process chillers (0.5-20 TR standard; milk, anodizing, acid, medical scan, soda chillers), FRP round and square cooling towers (10-300 TR), coil cooling towers/dry coolers (40-280 TR, diesel genset duty 150-2000 kVA), shell and tube heat exchangers (engineered to order), ice flake machines, condensing units, spares.
- **Confirmed company facts:** 1,200+ installations (owner confirmed; the old "3,500+" was wrong). Address (use exactly): SF No. 4/195 B, Kallangadu, Nadu Arasur, Arasur Post, Coimbatore 641 407. Phones: **+91 95972 28969 (primary), +91 95972 28975 (secondary). +91 95972 28978 must NEVER be used anywhere** (owner instruction). Open Mon-Sat 8am-8pm, closed Sunday. Memberships on old catalogues: TAPMA, IndiaMART TrustSEAL. Supplied plants in Coimbatore, Tiruppur, Erode, Hosur, Chennai, Bengaluru (from the owner-approved Business Profile description). Owner confirmed the company makes moisture separators.
- **Not the company:** "Efficacy Tech Equipments LLP" (efficacyllp.in, efficacyglobal.com) is NOT owned by Win Equipments, although Semrush shows it ranking for Win's home page. Do not target that name.
- **Site:** https://winequipments.com. Repo: `/Users/devasahithiyan/Desktop/WIn equipments claude`, GitHub `devasahithiyan/winequipments`.
- **The user:** the owner's technical contact. Not a developer; wants plain-English, real numbers, autonomous work. Git user: devasahithiyan.

## 2. Standing rules from the owner (follow these)

1. **Real facts only.** No invented prices, ratings, specs, certifications, installation counts, customers, or reviews. Source = original catalogues, `data/products/*.json`, `site.json`, or owner-confirmed info. See `CONTENT_TODO.md` for what was removed and why. Where no datasheet exists, pages say "engineered to order" and list what the customer should send.
2. **Give real numbers, no assumptions.** Label anything measured (with source) versus calculated (with the formula) versus unknown. Never present an estimate as a fact. The owner explicitly said: "I don't want you to make assumptions, give me real numbers."
3. **Work autonomously** with no permission-prompt chatter, **except** destructive actions and spending. No payments of any kind ("dont make any payments"). Never enter passwords. Accept terms only with explicit permission in chat. Never touch billing (Google Ads has an enabled campaign with broad-match keywords that cannot run because billing is not set up; leave it that way).
4. Commits: end with `Co-Authored-By: Claude ... <noreply@anthropic.com>` per the harness reminder. Do not `git add -A` blindly (it once pushed 172 files from `.claude/skills/`; now ignored). Push only what the user wants; the owner deploys manually.
5. Plain pronouns: use "they" for people unless stated.

## 3. Build, test, deploy

- Static-site generator: `python3 src/site/build.py` writes `public/` (HTML, CSS, JS (minified with rjsmin), images, `sitemap.xml`, `.htaccess` from `src/site/htaccess.tpl` + `data/redirects.json`). Use **`/opt/homebrew/bin/python3`** for pytest (system python lacks pytest/rjsmin; `pip install --break-system-packages rjsmin` was used).
- Tests: `/opt/homebrew/bin/python3 -m pytest -q` (258 pass as of last commit). Rules enforced: title 10-60 chars, description 70-155 chars, exactly one H1, canonical, valid JSON-LD, internal links resolve, sitemap matches pages.
- `public/` is **tracked in git** and must be rebuilt and committed with source changes.
- Deployment: cPanel Git Version Control pulls from GitHub; the owner clicks **Update from Remote**, then **Deploy HEAD Commit**. Live site tracks the **`test`** branch (pushing `test` updated the live site). `main` exists but is not what is deployed. Last verified live 5 Oct 2026: new pages return 200 and sitemap has 83 URLs.
- Where things live (also in `README.md`): company data `src/site/data/site.json`; products `src/site/data/products/*.json` (20 products incl. moisture-separators); location pages `src/site/data/locations.json` (13 entries; optional keys `scope: "country"`, `heading`, `tool`); articles `src/site/content/blog/*.md` (frontmatter: title, seo_title, description, date, updated, products, category, order, photo); redirects `redirects.json` (includes `review` -> Google review box, Place ID ChIJMfKa9733qDsRoQi36twgRwU); templates `src/site/templates/`; PHP enquiry/chat `src/site/php/`; `secrets.php` (Gemini key) only on the server.
- `llms.txt` exists in `src/site/static/`. `site.json` holds `ga4_id: G-ETXTGY37TG`, maps link `https://www.google.com/maps?cid=380308826738854049`, review URL.

## 4. Accounts, access and tools

| Thing | Detail |
|---|---|
| Owner Google account used for SEO | [owner SEO Google account, given in chat] (Chrome `authuser=4`). Business Profile owner login: [Business Profile owner login]; the owner SEO account was added as Owner. |
| Other mailbox | [secondary mailbox] (Chrome `u/0`): Semrush emails go here. |
| Credentials (outside repo) | `~/.config/seo-keys/`: `google-api-key.env` (PageSpeed, CrUX, Custom Search), `service-account.json` (`the `seo-reader` service account`), `oauth-client.json`. GCP project `[GCP project]`. Never commit these. A new Claude account on this Mac can read them; on another machine they must be re-created. |
| Search Console | Property `https://winequipments.com/` (DNS-verified). Service account is Restricted (read-only). Sitemap submitted. |
| GA4 | Account "Win Equipments" [GA4 account id], property [GA4 property id], measurement ID G-ETXTGY37TG. Service account is Viewer. Events `quote_submit`, `whatsapp_click`, `call_click` still need to be marked as key events once they fire. |
| Semrush | **Pro is now enabled** on the owner's account. Two ways: (a) the Semrush MCP (tools `mcp__<id>__keyword_research`, `organic_research`, `competitors_research`, `domain_overview`, `backlinks_research`, `site_audit`, `position_tracking`, `projects`, then `get_report_schema` + `execute_report`). Use database `in`. API units are consumed: the keyword-gap report cost 3,200 units, competitor list 560, rankings 90; watch usage. Report `phrase_these` takes up to 100 keywords separated by semicolons. (b) the browser UI (Bulk Analysis takes 100 keywords; pasting via a ClipboardEvent in JS works, typing long lists is slow). |
| Google Ads | Account [Ads account id] (the owner SEO account), Keyword Planner opens ([Keyword Planner ocid]). No billing, so volumes are buckets only. The agent left 6 saved plans there. Enabled broad-match campaign exists; do not add billing without reviewing/pausing it. |
| Ahrefs | Free authority checker only (DR and capped backlinks). |
| Chrome automation | Claude in Chrome tools are flaky and memory-hungry; use small batches, `pws=0` for non-personalised SERP checks, `javascript_tool` for page data. The extension sometimes disconnects; reload tabs. |

## 5. Measured data (all India, 4-5 Oct 2026)

- **Semrush for winequipments.com:** Authority Score 2, organic traffic 0, 9 organic keywords (all page 3+), 264 referring domains, 436 backlinks. Ahrefs DR 0 (~1K backlinks, 38% dofollow).
- **Competitors (Semrush):** gemindia.com AS 22, 1.3K visits, 278 keywords, 473 ref domains (ranks #3 for "compressed air dryer" 2,400/mo and "drain valve" 1,600/mo; builds one page per city). seenucompressor.com AS 11, 1.1K visits from 19 keywords, 280 ref domains (traffic from "air compressor manufacturers in coimbatore" 720/mo, positions 5-6; Win does not make compressors, so do not target them). worldcoolingtowers.com AS 13, 126 visits, 457 ref domains. Directories (IndiaMART, Justdial, TradeIndia) hold 1-4 of first-page slots on local searches.
- **Speed:** PageSpeed mobile 97-99, desktop 100 (contact page 96).
- **Google Business Profile:** 4.6 stars, 39 reviews, **"Verification required"** since 4 Oct (see section 7).
- **SERP baseline:** "win equipments" #1. Others (personalisation off): air dryer manufacturers in bangalore page 1 (7th); cooling tower manufacturers in coimbatore ~#12; air dryer manufacturers in coimbatore ~#17-18; air receiver tank manufacturers in coimbatore ~#18-19; the rest not in top 20.
- **Volumes:** `Reports/seo/semrush_volumes.csv` (216 searches with exact Semrush volume; the other ~257 of 473 candidates are under 10/mo). `keyword_planner_volumes.csv` (Google buckets for 286; agrees with Semrush). Key numbers: cooling tower 18,100 (informational); heat exchanger 12,100; shell and tube heat exchanger 8,100; heat exchanger manufacturers in india 1,600; heat exchanger manufacturer 1,300; heat exchanger companies in india 1,000; compressed air dryer 2,400 (KD 11); air dryer for compressor 2,400; drain valve 1,600 (KD 11); moisture separator 880 (KD 7); auto drain valve for air compressor 720 (KD 3); cooling tower manufacturers 720; water chiller manufacturers 480; cross flow cooling tower 480 (KD 4); cooling tower manufacturers in india 390; cooling tower manufacturers in coimbatore 210; air dryer manufacturers in coimbatore 110 (KD 4). 95 buying-intent searches total about 11,550/mo.
- **Forecast method:** visits = searches x CTR. CTR studies: Ahrefs Feb 2026 (pos 1 39.8%, 2 18.7%, 3 10.2%) and Advanced Web Ranking Jul 2026 (pos 1 20.02%, 3 3.89%, 10 0.58%). Four target groups total 22,770 searches/mo; position 3 = 886-2,322 visits, position 1 = 4,559-9,063. These are ceilings (variants overlap; some searches are readers). Realistic first target about 900 visits/mo. Conversion rate is unknown until GA4 has data.

## 6. What has been done

**Site (all pushed to `test` and live):** full redesign earlier; extensionless and old-URL 301 redirects; schema fixes (Product offers removed, location pages use ListItem, tool pages WebPage); JS minified; `llms.txt`; GA4 tag; review shortcut `/review` fixed; **5 Oct implementation:** new product `moisture-separators` (engineered to order); titles/descriptions/FAQs tuned on 9 products (drain valves, receivers, refrigerated and desiccant dryers, shell and tube, round/square towers, chillers); 6 new guides (cross-flow vs counter-flow tower, types of cooling tower, automatic drain valve guide, compressed air dryer guide, moisture separator guide, shell-and-tube heat exchanger guide); 8 new landing pages (coimbatore-cooling-towers, coimbatore-heat-exchangers, coimbatore-air-dryers, chennai-heat-exchangers, bangalore-industrial-chillers, india-heat-exchanger-manufacturer, india-cooling-tower-manufacturer, india-water-chiller-manufacturer); earlier 3 comparison articles and page transitions by others.

**Business Profile edits applied 4 Oct:** description (617 chars), primary category Industrial equipment supplier plus Manufacturer and Air compressor supplier, website https, phones, service areas (India, Coimbatore, Tiruppur, Erode), hours Mon-Sat 08:00-20:00.

**Reports (in `Reports/seo/`):** ASSESSMENT_AND_PLAN.md, GOOGLE_BUSINESS_PROFILE.md, KEYWORD_RESEARCH_AND_FORECAST.md (sections 1-12), SEO_ACTION_PLAN.md, data CSVs.

## 7. Open items and decisions

**Owner must do:**
1. **Record the Business Profile verification video** at the factory (location, equipment, proof of management), submit via Business Profile Manager > Get verified. The profile flipped from Verified to "Verification required" after the 4 Oct edits (which edit triggered it is unknown). **Make no further profile edits until verified**, then do the rest.
2. Send 2-3 real customer case studies (with permission) and factory/product photos (studio brief in `CONTENT_TODO.md`). Send current datasheets and the certificate for DAC/ISO wording.
3. Decide on the ~120 Semrush product-schema errors ("do it" or "leave it").
4. Confirm whether Win supplies Pune, Ahmedabad, Delhi (Semrush demand: heat exchanger manufacturer in pune 480; cooling tower manufacturer in delhi 140, pune 110, ahmedabad 110). City pages are held back until confirmed.
5. Decide the postal code fix on the profile (641048 is wrong; 641407 correct) after verification.

**AI can do next (no owner needed):** request indexing in Search Console for the new URLs (about 10/day limit); set up Semrush Position Tracking for the target keywords; re-run Semrush Site Audit; update Facebook/Tradeindia/Aajjo/IndiaMART/Justdial addresses where access exists; Bing Webmaster import; after 2-4 weeks pull Search Console and GA4 via the service account and compare with the baseline above; add city pages when confirmed; build backlinks (TAPMA, directories); mark GA4 key events when events appear.

**After verification (profile):** add service areas Salem, Hosur, Chennai, Bengaluru; products (11 lines in GOOGLE_BUSINESS_PROFILE.md); Q&A; WhatsApp messaging; 20+ photos; weekly posts; reply to all 39 reviews; remove duplicate profile "WinEquipments Cooling tower" in the owner SEO account's manager.

## 8. Lessons learned (avoid repeating)

- Personalised SERPs gave a false #1; always use `pws=0`.
- Editing a verified Business Profile can trigger re-verification; batch edits carefully and avoid address changes.
- Google's "suggested updates" in the profile editor are not saved data (a phone list I first saw was suggestions).
- Typing long text into Keyword Planner or Chrome freezes tabs; chunk it or inject via JS.
- Semrush UI bulk limit is 100 keywords; the MCP `execute_report` can fail with filter/export_columns parameters (the keyword gap worked without them).
- `git add -A` includes untracked skill files; add paths explicitly.
- Do not claim supply to cities the owner has not confirmed.
- Keep titles <= 60 and descriptions <= 155 characters or tests fail.

## 9. Suggested first steps for the new session
1. Read this file, `CLAUDE.md`, `Reports/seo/SEO_ACTION_PLAN.md`, `CONTENT_TODO.md`, `SEO_CHECKLIST.md`.
2. `git pull`/check `git status` on branch `test`; run build and tests to confirm 258 pass.
3. Confirm the Semrush MCP and Chrome are connected; ask the user to reconnect if not.
4. Ask the user for the status of the verification video and case studies, then continue with section 7.
