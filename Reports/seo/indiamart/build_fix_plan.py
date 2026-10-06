"""Build INDIAMART_FIX_PLAN.xlsx from the scraped storefront (products.csv,
company.json) and the site catalogue (src/site/data/products/*.json).

Run: /opt/homebrew/bin/python3 Reports/seo/indiamart/build_fix_plan.py
Only real data: catalogue specs and the owner's own IndiaMART prices. Nothing invented.
"""
import csv
import re
import json
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill

HERE = Path(__file__).parent
ROOT = HERE.parents[2]
PRODUCTS = ROOT / "src/site/data/products"

listings = list(csv.DictReader(open(HERE / "products.csv")))
company = json.load(open(HERE / "company.json"))

# ---------------------------------------------------------------- existing listings
PRICE_SUSPECT = {
    "2856515934848": "₹25,000 for a 10 TR closed-circuit tower is far below every other tower price",
    "2856515840355": "₹25,000 for up to 50/100 TR is far below the 50 TR price (₹65,000)",
    "2856515640673": "₹18,000 with no capacity",
    "2856515814348": "₹18,000 with no capacity",
    "20362198891": "₹6,50,000 per Tonne: unit is wrong (should be per Unit, and which TR?)",
    "26739807562": "₹8,000 is 10× below the other plate HX listing (₹80,000)",
    "26739779191": "₹8,000 is 10× below the other plate HX listing (₹80,000)",
    "4233431197": "₹2,50,000 for 20–200 cfm is 10× the 50–1000 cfm unit (₹25,000)",
    "23141769312": "₹19 per fill pack: typo for ₹195?",
    "4821227397": "₹15,00,000 with no capacity",
    "27153409533": "₹65,000 with no capacity",
    "2851853591112": "₹4,50,000 with no capacity; 'Unit Length: 10 m' looks wrong",
    "2098854512": "₹26,000 per filter drier looks too high for a refrigeration filter drier: check",
    "2026921288": "₹3,00,000 for 10 TR, and the specs are copied from FRP model WCT-010",
    "22876671491": "2 TR at ₹55,000 conflicts with 'Plastic Machine Chiller' 2 TR at ₹85,000",
}
WRONG_CATEGORY = {
    "20362198891": "Listed under Air Dryers: move to Industrial Chillers",
    "21246483330": "PVC fills listed under Air Filters: move to Cooling Tower Spares / PVC fills",
    "5663544955": "Complete cooling tower listed under Spares: move to Cooling Towers",
    "2851853555055": "Dry cooler listed under Heat Exchangers: move to Cooling Towers (dry coolers)",
    "23141769212": "Brand shown as 'Dp Engineers': change to Win or delete",
}
OWNER_CONFIRM = {
    "2856515840497": "5000 TR is outside the 10–300 TR catalogue range: confirm or delete",
    "2026921288": "Does Win make wooden cooling towers? If not, delete all wooden listings",
    "2856515897730": "Does Win make wooden cooling towers? If not, delete",
    "2856515897462": "Does Win make wooden cooling towers? If not, delete",
    "2856515898055": "Does Win make wooden cooling towers? If not, delete",
    "26739807562": "Photo is a third-party render: replace with a real Win plate HX photo",
    "26739779191": "Photo is a third-party render: replace with a real Win plate HX photo",
    "12174667812": "Photo is a third-party render: replace with a real Win plate HX photo",
}
CAPACITY_WORDS = ("capacity", "cfm", "tr", "air flow", "kva", "storage", "size", "flow")


def has_capacity(specs, name):
    s = (specs + " " + name).lower()
    return any(w in s for w in CAPACITY_WORDS)


# ---------------------------------------------------------------- catalogue models
def fmt(v, unit):
    v = str(v)
    return f"{v} {unit}" if unit and unit not in ("qty",) else v


FAMILIES = [
    # slug, title template, priority, IndiaMART category to use
    ("industrial-process-chillers", "{tr} TR Industrial Water Chiller ({model})", "High", "Industrial Chillers"),
    ("refrigerated-air-dryers", "{cfm} CFM Refrigerated Air Dryer ({model})", "High", "Air Dryers"),
    ("round-cooling-towers", "{tr} TR Round FRP Cooling Tower ({model})", "High", "Cooling Towers"),
    ("square-cooling-towers", "{tr} TR Square FRP Cooling Tower ({model})", "High", "Cooling Towers"),
    ("desiccant-air-dryers", "{cfm} CFM Heatless Desiccant Air Dryer ({model})", "Medium", "Air Dryers"),
    ("closed-circuit-cooling-towers", "{tr} TR Dry Cooler / Coil Cooling Tower ({model})", "Medium", "Cooling Towers"),
    ("air-receiver-tanks", "{litres} Litre Air Receiver Tank ({model})", "Medium", "Air Receivers"),
    ("compressed-air-filters", "{cfm} CFM Compressed Air Filter ({model})", "Medium", "Air Filters"),
]
# Prices the owner already publishes on IndiaMART, matched to a model by capacity.
KNOWN_PRICE = {
    "WRD 500 T": ("₹2,00,000", "12174442230 Industrial Refrigerated Air Dryer (WRD 500 T)"),
    "WCP 010": ("₹55,000 – ₹78,000", "25236609612 / 22310940597 (1 TR WCP)"),
    "WCP 030": ("₹1,40,000", "2856515976691 3 Ton Online Water Chiller"),
    "WCP 050": ("₹2,30,000", "2856515976530 5 Ton Online Chiller"),
    "WCP 100": ("₹3,50,000", "2856515976888 10 Ton Online Water Chiller"),
    "WCT 050 RL": ("₹65,000 – ₹68,000", "2856515641062 / 2856515629173 (50 TR)"),
    "WCT 100 RL": ("₹1,05,000 – ₹1,25,000", "2856515640997 / 2856515814530 (100 TR)"),
    "WCT 150 RL": ("₹1,50,000", "2856515629073 150 Tr Frp Cooling Tower"),
    "WCT 100 SL": ("₹1,50,000", "2856515825791 Square Cooling Tower 100 TR"),
    "WRV 050": ("₹30,000", "2027164230 500 Lit Air Receiver Tank"),
}
PRICE_NOTE = {"WCP 020": "Owner: 2 TR is ₹55,000 on one listing and ₹85,000 on another. Which is right?"}

models = []
for slug, tmpl, prio, im_cat in FAMILIES:
    d = json.load(open(PRODUCTS / f"{slug}.json"))
    cols = d["spec"]["columns"]
    common = "; ".join(f"{k['label']}: {k['value']}" for k in d.get("key_specs", []))
    for row in d["spec"]["rows"]:
        title = tmpl.format(**row)
        parts = {}
        for c in cols:
            if row.get(c["key"]) not in (None, "", "NA"):
                parts.setdefault(c["label"], []).append(fmt(row[c["key"]], c.get("unit")))
        specs = " | ".join(f"{k}: {v[0]}" + (f" ({', '.join(v[1:])})" if v[1:] else "") for k, v in parts.items())
        desc = (
            f"{d['lede']} Model {row['model']} from the Win {d['series']}. "
            f"Range: {common}. Manufactured by Win Equipments, Coimbatore; we supply plants across India. "
            f"Datasheet and catalogue: winequipments.com/{slug}/"
        )
        price, src = KNOWN_PRICE.get(row["model"], ("", ""))
        models.append({
            "priority": prio, "family": d["name"], "model": row["model"], "title": title,
            "im_category": im_cat, "specs": specs, "description": desc,
            "price": price or "Owner to fill (leave 'Get Latest Price' if no list price)",
            "price_source": src or PRICE_NOTE.get(row["model"], ""),
            "photo": f"winequipments.com/{d['image']}",
            "cap": float(row.get("tr") or row.get("cfm") or row.get("litres") or 0),
        })

# Repurpose empty listings (no price, no specs) into model listings of the same family.
REPURPOSE_FAMILY = {"cooling-towers": "Cooling Towers", "cooling-tower": "Cooling Towers",
                    "industrial-chillers": "Industrial Chillers", "commercial-water-and-air-chiller": "Industrial Chillers",
                    "air-receivers": "Air Receivers"}
free_models = {}
for m in models:
    free_models.setdefault(m["im_category"], []).append(m)

rows = []
for x in listings:
    issues, actions = [], []
    no_price, no_specs = not x["price_inr"], not x["specs"].strip()
    if x["id"] in WRONG_CATEGORY:
        issues.append("Wrong category"); actions.append(WRONG_CATEGORY[x["id"]])
    if x["id"] in PRICE_SUSPECT:
        issues.append("Price looks wrong"); actions.append("Fix price: " + PRICE_SUSPECT[x["id"]])
    if x["id"] in OWNER_CONFIRM:
        issues.append("Owner to confirm"); actions.append(OWNER_CONFIRM[x["id"]])
    new_title = ""
    pool = free_models.get(REPURPOSE_FAMILY.get(x["im_category"], ""), [])
    cap = re.search(r"(\d+(?:\.\d+)?)\s*(?:tr|ton)\b", x["name"].lower())
    match = [m for m in pool if cap and m["cap"] == float(cap.group(1))
             and ("square" in m["title"].lower()) == ("square" in x["name"].lower())
             and ("dry" in m["title"].lower()) == ("dry" in x["name"].lower() or "closed" in x["name"].lower())]
    if no_specs and match and x["id"] not in OWNER_CONFIRM:
        m = match[0]
        pool.remove(m)
        m["reuse"] = f"{x['id']} ({x['name']})"
        new_title = m["title"]
        issues.append("No specs")
        actions.append(f"Rename and add the specs of model {m['model']} (sheet 3); keep the price")
    elif no_price and no_specs:
        issues.append("Empty listing (no price, no specs)")
        typed = any(w in x["name"].lower() for w in ("natural", "cross flow", "service", "wooden"))
        generic = [m for m in pool if not cap and not typed]
        if "service" in x["name"].lower():
            actions.append("Describe the service (scope, area served) and add a real job photo")
        elif typed and x["id"] not in OWNER_CONFIRM:
            actions.append("Distinct type: add its real capacity range, specs and a photo, or delete if not offered")
        elif generic and x["id"] not in OWNER_CONFIRM:
            m = generic[0]
            pool.remove(m)
            m["reuse"] = f"{x['id']} ({x['name']})"
            new_title = m["title"]
            actions.append(f"Rewrite as model listing {m['model']} (sheet 3): title, specs, description, photo")
        elif x["id"] not in OWNER_CONFIRM:
            actions.append("Add capacity, specs and a real photo, or delete")
    if no_price and not no_specs:
        issues.append("No price"); actions.append("Add a price if there is a real list price")
    service = "service" in x["name"].lower()
    if not no_specs and not service and not has_capacity(x["specs"], x["name"]):
        issues.append("No capacity in specs"); actions.append("Add capacity (CFM / TR / litres) to specs and title")
    if not no_specs and not service and "brand: win" not in x["specs"].lower():
        issues.append("Brand not set"); actions.append("Set Brand = Win")
    rows.append({**x, "issues": "; ".join(issues) or "OK", "actions": "\n".join(actions) or "Keep",
                 "new_title": new_title, "n": len(issues)})
rows.sort(key=lambda r: -r["n"])

# ---------------------------------------------------------------- workbook
wb = Workbook()
H = Font(bold=True, color="FFFFFF")
FILL = PatternFill("solid", fgColor="1F4E79")
WRAP = Alignment(wrap_text=True, vertical="top")


def sheet(ws, header, data, widths):
    ws.append(header)
    for c in ws[1]:
        c.font, c.fill, c.alignment = H, FILL, WRAP
    for r in data:
        ws.append(r)
    for i, w in enumerate(widths):
        ws.column_dimensions[chr(65 + i)].width = w
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.alignment = WRAP
    ws.freeze_panes = "A2"


n = len(listings)
count = lambda f: sum(1 for x in listings if f(x))
summary = [
    ("Listings on storefront (scraped 5 Oct 2026)", n),
    ("Without a price", count(lambda x: not x["price_inr"])),
    ("Without any specs", count(lambda x: not x["specs"].strip())),
    ("Empty (no price and no specs)", count(lambda x: not x["price_inr"] and not x["specs"].strip())),
    ("Cooling tower listings (two categories)", count(lambda x: x["im_category"] in ("cooling-towers", "cooling-tower"))),
    ("Prices that look wrong", len(PRICE_SUSPECT)),
    ("In the wrong category / wrong brand", len(WRONG_CATEGORY)),
    ("Catalogue models to list one by one (sheet 3)", len(models)),
    ("Buyer rating (IndiaMART)", f"{company['rating']['value']}/5 from {company['rating']['count']} buyers"),
    ("Buyer satisfaction: response", company["rating"]["user_satisfaction"]["response"] + " (quality 100%, delivery 100%)"),
]
ws = wb.active
ws.title = "1 Summary"
sheet(ws, ["Measured from the storefront", "Value"], summary, [52, 50])
ws.append([])
ws.append(["Order of work", ""])
ws.cell(ws.max_row, 1).font = Font(bold=True)
for step in [
    "1. Profile fixes (sheet 4): ISO certificate dates, founding year, website link. 15 minutes.",
    "2. Fix wrong prices and wrong categories (sheet 2, rows marked 'Price looks wrong' / 'Wrong category').",
    "3. Rewrite the empty listings into model listings (sheet 2 'Rewrite as model listing' → sheet 3 'Reuses listing').",
    "4. Add the remaining High-priority model listings from sheet 3, then Medium.",
    "5. Reply to every enquiry within 15 minutes using sheet 5. Response satisfaction is only 75%.",
    "6. Create the CRM API key (sheet 4, last row) so lead_sync.py can log every lead.",
]:
    ws.append([step, ""])

ws = wb.create_sheet("2 Fix existing listings")
sheet(ws, ["IndiaMART id", "Category now", "Listing name", "Price ₹", "Unit", "Specs now", "Issues", "What to do", "New title (if rewritten)"],
      [[r["id"], r["im_category"], r["name"], r["price_inr"], r["unit"], r["specs"], r["issues"], r["actions"], r["new_title"]] for r in rows],
      [16, 20, 30, 10, 8, 45, 28, 50, 38])

ws = wb.create_sheet("3 New model listings")
sheet(ws, ["Priority", "Reuses listing", "Product title", "IndiaMART category", "Specs (catalogue)", "Description", "Price", "Price source / note", "Photo"],
      [[m["priority"], m.get("reuse", "New listing"), m["title"], m["im_category"], m["specs"], m["description"], m["price"], m["price_source"], m["photo"]] for m in models],
      [9, 30, 42, 18, 55, 70, 22, 38, 40])

profile = [
    ("ISO certificate", "Shows 11 Jan 2017 – 10 Jan 2020 (expired)", "Upload the current ISO 9001:2015 certificate. An expired certificate puts buyers off."),
    ("Year of establishment", "IndiaMART 2010, website 2008", "Owner: confirm one year and use it in both places."),
    ("Website", "Check it is filled", "Add https://winequipments.com to the profile and the 'About us' text."),
    ("Response rate", "Buyers rate response 75% (quality 100%, delivery 100%)", "Install the Lead Manager app on the person handling leads; turn on notifications; reply to every enquiry, including ones you decline."),
    ("Ratings", "4.7/5 from 19 buyers; last rating Nov 2025", "After each delivery, ask the buyer to rate you on IndiaMART."),
    ("Third-party photos", "Plate HX renders, refrigeration spares, filter elements use stock images", "Replace with real photos of Win equipment, or remove the photo."),
    ("Brochures", "5 listings have a brochure", "Attach the matching catalogue PDF (winequipments.com/downloads/) to every main product."),
    ("Duplicate cooling-tower categories", "'cooling-towers' and 'cooling-tower' both exist", "Merge into one Cooling Towers category on the storefront."),
    ("CRM API key", "Not created", "In the seller panel, find the CRM integration / 'Pull API' key (under Lead Manager settings; if it is not there, ask your IndiaMART account manager for the CRM Pull API key). Save it to ~/.config/seo-keys/indiamart_crm_key (never send it in chat or commit it)."),
]
ws = wb.create_sheet("4 Profile fixes")
sheet(ws, ["Item", "Now", "Fix"], profile, [28, 50, 80])

replies = [
    ("Refrigerated / desiccant air dryer", "Thank you for your enquiry. To size the dryer, please send: compressor CFM or HP, working pressure (bar), inlet air temperature, required dew point (+3 °C refrigerated or −20/−40 °C desiccant) and site location. Catalogue: winequipments.com/refrigerated-air-dryers/ . Call/WhatsApp +91 95972 28969."),
    ("Process / industrial chiller", "Thank you for your enquiry. Please send: the machine or process to cool, heat load or TR if known, required water temperature, water flow (LPM), single or three phase power and site location. Our WCP chillers cover 0.5 to 20 TR; larger duties are engineered to order. Call/WhatsApp +91 95972 28969."),
    ("Cooling tower", "Thank you for your enquiry. Please send: capacity in TR or water flow (m³/hr), inlet and outlet water temperature, application (machine, DG set, compressor) and site location. FRP towers cover 10 to 300 TR. Catalogue: winequipments.com/round-cooling-towers/ . Call/WhatsApp +91 95972 28969."),
    ("Dry cooler / coil tower", "Thank you for your enquiry. Please send: genset kVA or heat load, inlet water temperature, water flow and site location. WCC coil towers cover 40 to 280 TR (150 to 2000 kVA gensets). Call/WhatsApp +91 95972 28969."),
    ("Filters, drains, receivers, separators", "Thank you for your enquiry. Please send: compressor CFM, working pressure, pipe size and quantity. Call/WhatsApp +91 95972 28969."),
    ("Spares (fills, nozzles, fans, PP rings)", "Thank you for your enquiry. Please send: tower make and capacity, part size (or a photo of the old part) and quantity. Call/WhatsApp +91 95972 28969."),
    ("Not our product", "Thank you for contacting Win Equipments. We do not supply this item. We manufacture air dryers, filters, chillers, cooling towers and heat exchangers. Please contact us if you need any of these."),
]
ws = wb.create_sheet("5 Reply templates")
sheet(ws, ["Enquiry type", "First reply (WhatsApp / IndiaMART message)"], replies, [32, 120])

out = HERE / "INDIAMART_FIX_PLAN.xlsx"
wb.save(out)
print(out)
for k, v in summary:
    print(f"  {k}: {v}")
print("  model listings reusing empty ones:", sum(1 for m in models if m.get("reuse")))
