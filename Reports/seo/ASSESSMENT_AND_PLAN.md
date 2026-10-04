# Win Equipments: SEO assessment and plan

Date: 4 Oct 2026. Data: PageSpeed Insights API, Chrome UX Report API, Search Console / GA4 access test, live Google checks (India), site crawl of the 63 built pages.

## 1. Where we stand today

**Verdict: the website is technically excellent, but Google barely knows it exists and we cannot see any data.** The problem is visibility and authority, not the code.

| Area | Finding | Status |
|---|---|---|
| Speed (PageSpeed) | Mobile 97-99, desktop 100 on home, products, blog, about, tools. SEO / accessibility / best practices ~100 | Excellent |
| Slow page | `/contactus.html` mobile: score 71, LCP 5.5 s (this is the lead page) | Fix |
| On-page | 63 pages; no thin pages (blog avg 1,300 words); titles and descriptions present; schema on every page; 0 images without alt | Good |
| Real-user data (CrUX) | "Not found": too little traffic for Google to report | Weak |
| Search Console | Property not set up, no verification tag on the site; our access returns zero sites | Missing |
| Google Analytics | `ga4_id` empty in `site.json`; no GA4 account visible | Missing |
| Google's index | Still shows the OLD site (old titles and claims, e.g. `/installation`, `/case-studies`, `/products/chiller`) | Problem |
| Old URLs | `.html` versions redirect (301) correctly, but the extensionless old URLs Google has indexed return **404** | Fix now |
| Rankings | Not in the top 20 for "air dryer manufacturer in coimbatore". Results are IndiaMART, Justdial and ~8 local manufacturers | Weak |
| Local (Google Business Profile) | Not confirmed set up / verified; reviews link points to a Maps search, not a review box | Missing |

## 2. Why we are not ranking
1. **Google is working from stale data.** The redesign is live but Google has not re-crawled it, and old URLs 404 instead of redirecting.
2. **No Search Console, so no sitemap submission and no indexing requests.** This is the fastest fix available.
3. **Authority gap.** Competitors have directory listings (IndiaMART, Justdial) and years of links. We have little off-site presence.
4. **No local signals** (verified Business Profile, reviews, citations) for "Coimbatore" searches.
5. **No proof content.** Case studies were removed (rightly, they were invented), so there are no real project stories or review counts.

## 3. Plan (ordered by return on effort)

### Phase 0: this week (measure and fix)
1. **Add redirects for the extensionless old URLs** (`/installation`, `/case-studies`, `/products/chiller`, `/products/desiccant_air_dryer`, `/products/air_receiver`, `/certifications`, `/Industries/...`) in `public/.htaccess`. [we do]
2. **Fix `/contactus.html` mobile LCP** (find the heavy element, compress/defer). [we do]
3. **Search Console:** verify `winequipments.com`, submit `sitemap.xml`, request indexing for the home page, 3 family pages, tools and blog. Add `seo-reader@root-anvil-425109-t8.iam.gserviceaccount.com` as a **Full user** so we can pull data automatically. [owner clicks, ~10 min]
4. **GA4:** create the property, send the `G-` ID, mark `quote_submit`, `whatsapp_click`, `call_click` as key events. Add the same service account as Viewer. [owner, ~10 min]
5. **Google Business Profile:** create and verify it (details are in `SEO_CHECKLIST.md`). [owner]

### Phase 1: weeks 2-6 (get indexed and local)
- Re-crawl monitoring via Search Console API: indexed vs submitted pages, errors, new queries.
- Business Profile: all categories, 19 products, real photos, weekly posts.
- Reviews: target 15-20 genuine Google reviews in 60 days using the WhatsApp message in the checklist; reply to every one.
- Citations with identical name/address/phone: IndiaMART (already linked), Justdial, Sulekha, TradeIndia, ExportersIndia, Coimbatore industry bodies (CODISSIA, TECC).

### Phase 2: months 2-4 (rank for money keywords)
- Target pages by intent (use Search Console queries to confirm):
  - air dryer / refrigerated air dryer / desiccant dryer manufacturer **Coimbatore, Tiruppur, Hosur, Erode, Salem** (location pages exist; make each unique with local industries and a real address/service area)
  - industrial chiller / process chiller / cooling tower manufacturer + city
  - product-spec queries ("WRD 20 S", "10 TR chiller dimensions") using the model tables
- Add model tables and datasheets for engineered-to-order products (listed in `CONTENT_TODO.md`).
- **Real case studies** (with customer permission): industry, duty, equipment, result. These are the strongest trust and ranking asset.
- 2 articles a month from `CONTENT_TODO.md` (chillers, cooling towers, compressed-air dew point, energy cost). Interlink to products.
- Keep the engineering tools (sizing calculators): they attract links naturally; promote them to compressor dealers and plant engineers.

### Phase 3: months 4-12 (authority and leads)
- Links: supplier/dealer pages, trade-association and college (PSG, CIT, GCT) mentions, magazine/blog guest articles, YouTube factory/installation videos with links.
- Conversion: track enquiry source in GA4, test the RFQ form and WhatsApp prompt, add a "send your duty, get a sizing in 24 h" offer.
- Paid support (optional, small): Google Ads on 5-10 high-intent searches to learn which queries convert while organic builds.
- Monthly report from the APIs: impressions, clicks, average position, indexed pages, Core Web Vitals, enquiries.

## 4. What the APIs now give us
- **PageSpeed + CrUX** (API key): automated speed audits, Core Web Vitals once traffic exists.
- **Search Console + Indexing** (service account): queries, positions, indexing status. Needs step 0.3.
- **GA4 Data + Admin** (service account): traffic and conversions. Needs step 0.4.
- Credentials are stored in `~/.config/seo-keys/` (outside the repo, owner-only permissions).

## 5. Targets (realistic)
- 30 days: site re-indexed, new pages visible, Search Console and GA4 collecting data, Business Profile live.
- 90 days: top 10 for several "<product> manufacturer <city>" queries; first organic enquiries tracked.
- 6-12 months: steady organic enquiries, 25+ Google reviews, 10+ quality links.

Rankings take time and nothing here is guaranteed; the biggest early gains come from phases 0 and 1.
