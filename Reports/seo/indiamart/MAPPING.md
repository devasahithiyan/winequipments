# IndiaMART → website mapping (5 Oct 2026)

Source: https://www.indiamart.com/winequipments/ (read 5 Oct 2026). Raw data: `products.csv` (124 listings, 72 with a price), `reviews.csv` (19 ratings), `company.json`, `photos.csv` + `photos/` (101 photos, git-ignored; contact sheet `photos/index.html`).
Rule agreed with the user: IndiaMART content is owner-published, so it is treated as confirmed. Clear conflicts and implausible values are excluded and listed for the owner.

## 1. Prices shown on the site ("indicative, from ₹X")

| Site page | Price used | IndiaMART listing(s) | Notes |
|---|---|---|---|
| automatic-drain-valves | from ₹1,800 | Auto Drain Valves (1", timer, 5–16 bar) ₹1,800; Pneumatic Drain Valve ₹5,000 | |
| refrigerated-air-dryers | ₹25,000 – ₹3,50,000 | Compressed Air Dryer 51–120 cfm ₹25,000; WRD 500 T ₹2,00,000; WRD 1250 ₹3,50,000 | |
| desiccant-air-dryers | ₹15,000 – ₹2,50,000 | Compact (wall) 10–40 cfm ₹15,000; Heatless 20–1000 cfm ₹1,20,000; 121–500 cfm ₹2,50,000 | |
| compressed-air-filters | ₹5,000 – ₹20,000 | High-pressure / micro filters ₹5,000; Compressed Air Filter ₹20,000; elements ₹3,500–₹5,000 | |
| air-receiver-tanks | ₹30,000 – ₹80,000 | 500 L ₹30,000; Horizontal 250–500 L ₹50,000; Vertical ₹80,000 | |
| industrial-aftercoolers | from ₹25,000 | Air-cooled / water-cooled ₹25,000; vertical ₹30,000; 300 CFM air-cooled ₹50,000; industrial ₹1,50,000 | |
| moisture-separators | ₹5,000 – ₹35,000 | MS 20–2000 cfm ₹5,000; with drain valve ₹10,000; SS ₹25,000; cast iron ₹35,000 | |
| industrial-process-chillers | ₹45,000 – ₹3,50,000 | Portable mini ₹45,000; 1 TR WCP ₹55,000–₹78,000; 2 TR ₹85,000; 3 TR ₹1,40,000; 5 TR ₹2,30,000; 10 TR ₹3,50,000 | capacity bands used in the price guide |
| soda-chillers | from ₹1,20,000 | Soda Chiller Unit ₹1,20,000 | |
| round-cooling-towers | ₹65,000 – ₹1,50,000 | 50 TR ₹65,000–₹68,000; 50 TR bottle ₹80,000; 100 TR ₹1,05,000–₹1,25,000; 150 TR ₹1,50,000 | |
| square-cooling-towers | from ₹1,00,000 | FRP square 50–500 TR ₹1,00,000; 100 TR ₹1,50,000 | |
| closed-circuit-cooling-towers (dry coolers) | ₹1,50,000 – ₹4,50,000 | Dry cooler 150–2000 kVA ₹1,50,000–₹4,50,000; 51–100 TR ₹2,50,000 | |
| shell-and-tube-heat-exchangers | from ₹50,000 | Heat Exchangers (shell & tube, MS, 8 bar) ₹50,000 | |
| cooling-tower-fills (new) | ₹155 – ₹195 per fill pack | PVC fills 600×300×150 mm ₹155 (black) / ₹195 (blue) | spares prices listed on the page |

## 2. Prices excluded (ask the owner)

| Listing | IndiaMART price | Why excluded |
|---|---|---|
| FRP Closed Circuit Cooling Tower (10 TR) | ₹25,000 | far below every other tower price |
| Fiberglass Cooling Tower (up to 50/100 TR) | ₹25,000 | same |
| Water cooling tower / Bottle shape cooling tower (no capacity) | ₹18,000 | no capacity given |
| Industrial Water Chillers (WCP 100) | ₹6,50,000 per **tonne** | unit looks wrong |
| Plate Heat Exchanger (2 listings) | ₹8,000 | 10× below the ₹80,000 listing; material listed as aluminium |
| Air Aftercoolers 20–200 cfm | ₹2,50,000 | 10× the 50–1000 cfm unit |
| Cooling Tower Fills | ₹19 | typo for ₹195? |
| Condenser Cooling Tower | ₹15,00,000 | no capacity |
| Air Cooled Chillers / Water Cooled Screw Chillers | ₹65,000 / ₹4,50,000 | no capacity |

## 3. Product lines on IndiaMART, not (or thinly) on the site

| Line | Demand (Semrush IN/mo) | Decision |
|---|---|---|
| Plate heat exchangers | 6,600 | **Hold.** No real WIN photo (IndiaMART images are third-party renders) and specs are thin. Need owner photo + specs. |
| Air-cooled chillers | 2,900 | Add to `industrial-process-chillers` (WCP units are air-cooled per IndiaMART) + real air-cooled chiller photos. |
| Cooling tower fans | 1,900 | Covered on new `cooling-tower-fills` page (spares section) |
| Cooling tower fills / PVC fills | 1,000 | **New page `cooling-tower-fills`** (real specs + photos + prices) |
| Dry coolers | 720 | Already `closed-circuit-cooling-towers` (WCC) — add IndiaMART photos, prices, "dry cooler" wording |
| Screw / scroll chillers | 390 | Hold: no capacity table. Scroll chiller SC-100 = 10 TR, 10 HP; range 10–100 TR |
| Mini / portable chiller | 260 | Mention on process chiller page (₹45,000, single phase) |
| Heatless air dryer | 140 | Already desiccant page (WHD heatless); add compact 10–40 cfm wall-mounted model |
| Wooden cooling towers | 110 | Skip: spec row copies the FRP WCT-010 data |
| Refrigeration spares (TXV, filter drier, pressure switch, gas, hot-gas bypass) | — | Already on spares page; images are stock, not used |
| Project consultancy, cooling tower repair | — | Not added (no detail) |

## 4. Photos to add to the site (real WIN equipment, ≥ 600 px, not already on site)

| photos.csv # | File | Page |
|---|---|---|
| 0, 11 | round FRP towers | round-cooling-towers |
| 7, 8, 12, 13 | square / multi-cell / cross-flow installs | square-cooling-towers |
| 4, 6, 37 | WIN dry coolers | closed-circuit-cooling-towers |
| 24, 29, 26, 74 | WRD 1250, WRD 500 T, WIN dryers | refrigerated-air-dryers |
| 22, 25, 27 | twin-tower desiccant dryers | desiccant-air-dryers |
| 40, 45, 77, 97 | air-cooled chillers, WCP 100 | industrial-process-chillers |
| 39 | soda chiller unit | soda-chillers |
| 50, 71 | WIN shell & tube | shell-and-tube-heat-exchangers |
| 72, 75, 87 | air-cooled / vertical aftercoolers | industrial-aftercoolers |
| 82 | WIN moisture separator | moisture-separators |
| 88, 89 | WIN vertical receivers | air-receiver-tanks |
| 52, 67 | PVC fills | cooling-tower-fills (new) |

Not used: stock/third-party images (plate HX renders, refrigeration spares, filter elements, red filter housings, consultancy clip-art), duplicates of site photos (5, 16, 19, 28, 30, 35), small images (< 600 px), catalogue page scans (23, 49, 90).

## 5. Company facts and conflicts

- GSTIN 33AJWPA2797B1Z7, IEC 3212007729 (exporter), proprietorship, 11–25 employees → site.json / About.
- Rating 4.7/5 from 19 IndiaMART buyers (63% five-star) → shown as text with a link; **no review schema** (Google treats it as self-serving).
- Buyer locations: Pune, Ahmedabad, Hyderabad, Kadapa, Rourkela, Thrissur, Thiruvananthapuram, Visakhapatnam, Arakkonam, Chennai; abroad: Saudi Arabia, Kenya, Philippines, Pakistan.
- Note: two reviews are for products Win does not list (rotary gear pumps, bypass valves); two low ratings (1★, 2★) are for liquid line filter driers in 2019.
- ISO 9001:2015: IndiaMART shows the old certificate (11 Jan 2017 to 10 Jan 2020). **Confirmed current on 5 Oct 2026**, so the site keeps "ISO 9001:2015 certified". Update the dates on IndiaMART; send a copy so the Certifications page can show the number and validity.
- **Founded: IndiaMART 2010, site 2008.** Site keeps 2008 until the owner says otherwise.

## 6. Questions for the owner
1. ~~Current ISO certificate?~~ Confirmed 5 Oct 2026. Please send a copy and update the IndiaMART certificate dates.
2. Founded 2008 or 2010?
3. Correct the excluded prices in section 2.
4. Send real photos and a spec sheet for plate heat exchangers and screw chillers.
5. Four IndiaMART brochure PDFs exist (refrigerated dryer, industrial chiller, cooling tower, automatic drain valve, "Win Aqua Saver"); OK to download and compare with the site's catalogues?

## 7. Storefront fix plan (6 Oct 2026)
`INDIAMART_FIX_PLAN.xlsx` (built by `build_fix_plan.py` from `products.csv` and the site catalogue): summary, listing-by-listing fixes, 89 catalogue model listings (15 reuse empty listings), profile fixes, reply templates. `lead_sync.py` pulls enquiries through the IndiaMART CRM Pull API into `leads/` (git-ignored) once the key is saved to `~/.config/seo-keys/indiamart_crm_key`; not yet run against the live API.
