#!/usr/bin/env python3
"""Generate the Win Equipments catalogue PDFs from the same data as the website.

    python3 src/site/catalogue/build_catalogues.py        # writes src/site/static/downloads/*.pdf

Layout is print HTML (A4) rendered by headless Chrome. Every figure comes from
src/site/data (transcribed from the original catalogues kept in ./originals).
"""
import subprocess
import copy
import json
import math
import sys
from pathlib import Path

import qrcode
import qrcode.image.svg
from jinja2 import Environment, FileSystemLoader
from markupsafe import Markup
from PIL import Image, ImageOps

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import build as site_build  # noqa: E402  (reuses data, studio cut-outs and the dew chart)

ROOT = site_build.ROOT
CACHE = ROOT / ".build-cache" / "catalogue"
OUT = site_build.SRC / "static" / "downloads"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

site = site_build.site
products = copy.deepcopy(site_build.products)
families = copy.deepcopy(site_build.families)
LAYOUT_EDITION = "2026-10"

# Editorial corrections use model-level data without changing any engineering values.
p = products["refrigerated-air-dryers"]
p["key_specs"][0]["value"] = "20 to 2,000 CFM listed"
p = products["industrial-process-chillers"]
p["lede"] = "WCP chillers keep process water at a prescribed set temperature using refrigeration. Each unit includes a tank, circulating pump and air- or water-cooled condenser. Tank material depends on the model and order specification; see the model table."
for stage in p["principle"]["stages"]:
    stage["text"] = stage["text"].replace("closed stainless steel tank", "built-in tank")
for feature in p["features"]:
    if feature["title"] == "Tank":
        feature["points"][0] = "Tank material as listed for the model: SS or SS / MS"
p["selection"]["formula"] = "For water: heat load (kcal/hr) ≈ 60 × water flow (L/min) × (inlet − outlet temperature, °C). This is a water approximation; confirm the cooling duty and rating conditions before selection."
p = products["automatic-drain-valves"]
p["lede"] = "WDV valves discharge condensate from compressed air systems. Choose an electronic timer, micro-controller or no-air-loss design to suit the flow, pressure and connection. The no-air-loss model in this table is WDV F16."
for field in p.get("conditions", []) + p.get("key_specs", []):
    if "interval" in field["label"].lower():
        field["value"] = "Model dependent; see table"
for family in families.values():
    family["products"] = [products[p["slug"]] for p in family["products"]]
records = json.loads((HERE.parent / "data/downloads.json").read_text())
photos = site_build.photos

SHEETS = [
    ("refrigerated-air-dryers", ["refrigerated-air-dryers"], "air"),
    ("desiccant-air-dryers", ["desiccant-air-dryers"], "air"),
    ("compressed-air-filters", ["compressed-air-filters"], "air"),
    ("automatic-drain-valves", ["automatic-drain-valves"], "air"),
    ("air-receiver-tanks", ["air-receiver-tanks"], "air"),
    ("industrial-process-chillers", ["industrial-process-chillers"], "chiller"),
    ("frp-cooling-towers", ["round-cooling-towers", "square-cooling-towers"], "tower"),
    ("closed-circuit-cooling-towers", ["closed-circuit-cooling-towers"], "tower"),
]


def file_url(p):
    return Path(p).resolve().as_uri()


def img(path, w=1400):
    """Downscaled, EXIF-corrected copy for print; returns a file:// URL."""
    src = ROOT / path if not Path(path).is_absolute() else Path(path)
    dest = CACHE / "img" / f"{src.stem}-{w}-print-v2.jpg"
    if not dest.exists() or dest.stat().st_mtime < src.stat().st_mtime:
        dest.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(src) as raw:
            im = ImageOps.exif_transpose(raw).convert("RGBA")
            im.thumbnail((w, w), Image.LANCZOS)
            white = Image.new("RGB", im.size, "white")
            white.paste(im, mask=im.getchannel("A"))
            white.save(dest, quality=84, optimize=True, progressive=True)
    return file_url(dest)


def cutout(path, w=1400):
    return img(site_build.studio(path), w)


def qr(url):
    q = qrcode.make(url, image_factory=qrcode.image.svg.SvgPathImage, box_size=10, border=0)
    return Markup(q.to_string(encoding="unicode"))


def fmt(v):
    return "—" if v in (None, "") else v


env = Environment(loader=FileSystemLoader(str(HERE / "templates")), autoescape=True)
env.globals.update(site=site, products=products, families=families, photos=photos, img=img, cutout=cutout, qr=qr,
                   product_count=len(products), product_count_word=site_build.NUM_WORDS.get(len(products), str(len(products))),
                   product_url=site_build.product_url, dew_chart=site_build.dew_chart, layout_edition=LAYOUT_EDITION,
                   industries=site["industries"], css=Markup((HERE / "templates" / "print.css").read_text()),
                   chart_css=Markup((site_build.SRC / "assets" / "css" / "chart.css").read_text()),
                   font=file_url(site_build.SRC / "assets" / "fonts" / "archivo-latin.woff2"),
                   logo=file_url(ROOT / "images" / "logo.png"),
                   active={"refrigerated-air-dryers": ["dryer"], "desiccant-air-dryers": ["dryer"], "compressed-air-filters": ["prefilter", "finefilter"], "automatic-drain-valves": ["drain"], "air-receiver-tanks": ["receiver"]})
env.filters["fmt"] = fmt


def print_pdf(html_path, pdf_path):
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files",
                    "--run-all-compositor-stages-before-draw", "--virtual-time-budget=8000",
                    f"--print-to-pdf={pdf_path}", file_url(html_path)], check=True, capture_output=True)


def render(template, name, **ctx):
    CACHE.mkdir(parents=True, exist_ok=True)
    html = CACHE / f"{name}.html"
    html.write_text(env.get_template(template).render(**ctx))
    pdf = OUT / f"{name}.pdf"
    rendered_pdf = CACHE / f"{name}.pdf"
    print_pdf(html, rendered_pdf)
    from pypdf import PdfReader, PdfWriter
    reader = PdfReader(rendered_pdf)
    expected = 1 + len(ctx["pages"])
    if len(reader.pages) != expected:
        raise ValueError(f"{name}: expected {expected} pages, got {len(reader.pages)}; inspect pagination before publishing")
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    writer.add_outline_item("Cover", 0)
    for n, page in enumerate(ctx["pages"], 1):
        writer.add_outline_item(page["title"], n)
    writer.add_metadata({"/Title": ctx["doc"]["title"], "/Author": "Win Equipments", "/Subject": f"Product catalogue | Layout edition {LAYOUT_EDITION}", "/Lang": "en-IN"})
    # Write atomically after page-count validation; originals remain archived.
    temp_pdf = pdf.with_suffix(".tmp.pdf")
    with temp_pdf.open("wb") as stream:
        writer.write(stream)
    temp_pdf.replace(pdf)
    print(f"{pdf.relative_to(ROOT)}  {pdf.stat().st_size / 1048576:.1f} MB")


def column_groups(p):
    cols = p["spec"]["columns"]
    keys = [c["key"] for c in cols]
    performance = {
        "refrigerated-air-dryers": ["model", "cfm", "m3hr", "kw", "supply"],
        "desiccant-air-dryers": ["model", "cfm", "m3hr", "variant", "supply"],
        "air-receiver-tanks": ["model", "litres", "pressures", "dia", "height"],
        "industrial-process-chillers": ["model", "tr", "m3hr", "kw", "supply", "fans", "condenser"],
        "automatic-drain-valves": ["model", "type", "capacity", "pressure", "interval", "discharge"],
        "round-cooling-towers": ["model", "tr", "m3hr", "hp", "rpm", "fan"],
        "square-cooling-towers": ["model", "tr", "m3hr", "hp", "rpm", "fan"],
        "closed-circuit-cooling-towers": ["model", "tr", "hp", "rpm", "motors", "fan"],
    }.get(p["slug"], keys)
    groups = [{"title": "Capacity & operating data", "columns": [c for c in cols if c["key"] in performance]}]
    remainder = [c for c in cols if c["key"] not in performance]
    if remainder:
        groups.append({"title": "Construction, dimensions & connections", "columns": [cols[0]] + remainder})
    return groups


def product_pages(items):
    pages = []
    for p in items:
        groups = column_groups(p)
        split = len(p["spec"]["rows"]) > 14 and len(groups) > 1
        batches = [[g] for g in groups] if split else [groups]
        for n, batch in enumerate(batches):
            title = "Models & rating conditions" if len(items) == 1 else p["name"] + " models"
            if n:
                title = "Dimensions & connections"
            pages.append({"id": p["slug"] + f"-models-{n}", "title": title, "kind": "models", "product": p, "groups": batch, "notes": n == len(batches) - 1})
    if items[0]["slug"] == "refrigerated-air-dryers":
        pages.append({"id": "working", "title": "Working principle & installation", "kind": "working"})
        pages.append({"id": "construction", "title": "Construction & selection questions", "kind": "details"})
    else:
        pages.append({"id": "construction", "title": "How it works & construction", "kind": "principle"})
    pages.append({"id": "selection", "title": "Selection & applications" if len(items) == 1 else "Selection factors", "kind": "selection"})
    if len(items) > 1:
        pages.append({"id": "applications", "title": "Applications & selection questions", "kind": "questions"})
    return pages


def master_pages():
    pages = [{"id": "company", "title": "Company & product index", "kind": "company"}]
    product_pages = {}
    for fam in families.values():
        count = math.ceil(len(fam["products"]) / 3)
        size, extra = divmod(len(fam["products"]), count)
        start = 0
        for n in range(count):
            group = fam["products"][start:start + size + (n < extra)]
            start += len(group)
            page = {"id": fam["id"] + f"-{n}", "title": fam["name"] + (f" · {n + 1}" if count > 1 else ""), "kind": "range", "family": fam, "items": group}
            pages.append(page)
            for product in group:
                product_pages[product["slug"]] = {"id": page["id"], "number": len(pages) + 1}
    pages.append({"id": "industries", "title": "Applications & project enquiries", "kind": "industries"})
    return pages, product_pages


def main(only=None):
    OUT.mkdir(parents=True, exist_ok=True)
    for index, (name, slugs, kind) in enumerate(SHEETS, 1):
        if only and name not in only:
            continue
        doc = next(d for d in records if d["id"] == name)
        doc["code"] = "WIN-" + products[slugs[0]]["series"].split()[0] + "-CAT"
        items = [products[s] for s in slugs]
        pages = product_pages(items)
        doc["contents"] = [{"label": page["title"], "page": n + 2} for n, page in enumerate(pages)]
        render("datasheet.html", name, items=items, kind=kind, doc=doc, pages=pages, url=site["url"] + site_build.product_url(slugs[0]))
    if not only or "win-equipments-catalogue" in only:
        doc = next(d for d in records if d["id"] == "win-equipments-catalogue")
        doc["code"] = "WIN-RANGE-CAT"
        doc["coverage_note"] = f"This edition covers all {len(products)} current product lines."
        pages, product_index = master_pages()
        doc["contents"] = [{"label": page["title"], "page": n + 2} for n, page in enumerate(pages)]
        render("master.html", "win-equipments-catalogue", doc=doc, pages=pages, product_pages=product_index, url=site["url"] + "/products/")
    (HERE.parent / "data/downloads.json").write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n")



if __name__ == "__main__":
    main(sys.argv[1:] or None)
