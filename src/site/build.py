#!/usr/bin/env python3
"""Static site generator for winequipments.com. Run: python3 src/site/build.py"""
import json
import os
import math
import re
import shutil
import subprocess
from datetime import date
from pathlib import Path
from urllib.parse import quote

from jinja2 import Environment, FileSystemLoader, StrictUndefined
from markupsafe import Markup
from PIL import Image, ImageDraw, ImageFilter, ImageOps
import numpy as np

SRC = Path(__file__).resolve().parent
ROOT = SRC.parent.parent
OUT = ROOT / "public"
CACHE = ROOT / ".build-cache" / "img"
DATA = SRC / "data"

site = json.loads((DATA / "site.json").read_text())
products = {}
for f in sorted((DATA / "products").glob("*.json")):
    p = json.loads(f.read_text())
    products[p["slug"]] = p
families = {f["id"]: f for f in site["families"]}
for fam in families.values():
    fam["products"] = sorted([p for p in products.values() if p["family"] == fam["id"]], key=lambda p: p["order"])
industries = {i["id"]: i for i in site["industries"]}
photos = [dict(ph, path="images/works/" + ph["file"]) for ph in json.loads((DATA / "photos.json").read_text())]
home_photos = sorted((ph for ph in photos if ph.get("home")), key=lambda ph: ph["home"])

# ---------------------------------------------------------------- images
WIDTHS = [320, 480, 640, 960, 1280, 1600]
image_registry = {}


def _encode(src: Path, key: str, w: int, fmt: str, gray: bool) -> Path:
    out = CACHE / f"{key}-{w}.{fmt}"
    if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
        return out
    out.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(src)
    im = ImageOps.exif_transpose(im)
    if gray:
        im = ImageOps.autocontrast(ImageOps.grayscale(im.convert("RGB")), cutoff=0.5).convert("RGB")
    elif im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA")
    if im.width > w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    if fmt == "avif":
        im.save(out, "AVIF", quality=55)
    elif fmt == "webp":
        im.save(out, "WEBP", quality=78, method=6)
    else:
        if im.mode == "RGBA":
            im.save(out, "PNG", optimize=True)
        else:
            im.convert("RGB").save(out, "JPEG", quality=80, optimize=True, progressive=True)
    return out


def picture(path, alt, sizes="100vw", cls="", eager=False, max_w=None, gray=False):
    """Return a <picture> with AVIF/WebP sources and a fallback, all copied into public/img."""
    src = ROOT / path
    im = Image.open(src)
    W, H = im.size
    has_alpha = im.mode in ("RGBA", "LA", "P")
    key = re.sub(r"[^a-z0-9]+", "-", Path(path).stem.lower()).strip("-") + ("-g" if gray else "")
    cap = min(W, max_w or W)
    widths = [w for w in WIDTHS if w < cap] + [cap]
    fallback_fmt = "png" if has_alpha and not gray else "jpg"
    srcsets = {}
    for fmt in ("avif", "webp", fallback_fmt):
        parts = []
        for w in widths:
            f = _encode(src, key, w, fmt, gray)
            dest = OUT / "img" / f.name
            dest.parent.mkdir(parents=True, exist_ok=True)
            if not dest.exists() or dest.stat().st_mtime < f.stat().st_mtime:
                shutil.copy2(f, dest)
            parts.append(f"/img/{f.name} {w}w")
        srcsets[fmt] = ", ".join(parts)
    h = round(H * cap / W)
    loading = 'fetchpriority="high"' if eager else 'loading="lazy" decoding="async"'
    fb = f"/img/{key}-{cap}.{fallback_fmt}"
    html = (
        f'<picture class="{cls}">'
        f'<source type="image/avif" srcset="{srcsets["avif"]}" sizes="{sizes}">'
        f'<source type="image/webp" srcset="{srcsets["webp"]}" sizes="{sizes}">'
        f'<img src="{fb}" srcset="{srcsets[fallback_fmt]}" sizes="{sizes}" width="{cap}" height="{h}" alt="{alt}" {loading}>'
        f"</picture>"
    )
    image_registry[path] = fb
    return Markup(html)


def studio(path):
    """Clean a product cut-out: drop dark halo pixels at the edge, trim, and add a soft floor shadow."""
    src = ROOT / path
    out = ROOT / ".build-cache" / "studio" / (Path(path).stem + "-studio.png")
    rel = str(out.relative_to(ROOT))
    if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
        return rel
    probe = Image.open(src)
    if probe.mode not in ("RGBA", "LA", "P"):
        return path
    out.parent.mkdir(parents=True, exist_ok=True)
    im = probe.convert("RGBA")
    a = np.array(im).astype(np.int32)
    alpha = a[..., 3]
    inner = np.array(Image.fromarray(((alpha > 8) * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(11))) > 0
    band = (alpha > 8) & ~inner
    alpha = np.where(band & (a[..., :3].max(axis=2) < 45), 0, alpha)
    a[..., 3] = alpha
    im = Image.fromarray(a.astype(np.uint8), "RGBA")
    im.putalpha(im.getchannel("A").filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6)))
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox())
    w, h = im.size
    padx, top, sh = int(w * 0.10), int(h * 0.03), int(h * 0.07)
    W, H = w + 2 * padx, h + top + sh
    shadow = Image.new("L", (W, H), 0)
    base = top + h
    ImageDraw.Draw(shadow).ellipse([W / 2 - w * 0.46, base - sh * 0.55, W / 2 + w * 0.46, base + sh * 0.55], fill=70)
    shadow = shadow.filter(ImageFilter.GaussianBlur(max(6, sh * 0.45)))
    canvas = Image.new("RGBA", (W, H), (21, 32, 26, 0))
    canvas.putalpha(shadow)
    canvas.alpha_composite(im, (padx, top))
    canvas.save(out, optimize=True)
    return rel


def image_url(path, w=1200):
    """Absolute URL of a resized JPEG/PNG, for Open Graph and schema."""
    src = ROOT / path
    im = Image.open(src)
    has_alpha = im.mode in ("RGBA", "LA", "P")
    key = re.sub(r"[^a-z0-9]+", "-", Path(path).stem.lower()).strip("-")
    w = min(w, im.width)
    f = _encode(src, key, w, "png" if has_alpha else "jpg", False)
    dest = OUT / "img" / f.name
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(f, dest)
    return f"{site['url']}/img/{f.name}"


# ---------------------------------------------------------------- physics for charts
P_HPA = 7 * 1000 + 1013.25  # 7 bar g


def es(t):
    if t >= 0:
        return 6.112 * math.exp(17.62 * t / (243.12 + t))
    return 6.112 * math.exp(22.46 * t / (272.62 + t))


def w_gkg(t, p=P_HPA):
    e = es(t)
    return 622 * e / (p - e)


def fmt_num(v, d=1):
    s = f"{v:.{d}f}"
    return s.replace("-", "−")


def dew_chart(mode="wide"):
    """Saturation curve of compressed air at 7 bar g with the WRD process line 45 °C → +3 °C."""
    if mode == "wide":
        W, H, ml, mr, mt, mb, fs = 640, 400, 52, 24, 24, 48, 13
    else:
        W, H, ml, mr, mt, mb, fs = 360, 300, 34, 70, 22, 44, 12
    t0, t1, y1 = 0, 60, 16
    pw, ph = W - ml - mr, H - mt - mb

    def X(t):
        return ml + (t - t0) / (t1 - t0) * pw

    def Y(v):
        return mt + ph - v / y1 * ph

    out = [f'<svg viewBox="0 0 {W} {H}" class="chart chart--{mode}" role="img" aria-labelledby="dc-t-{mode} dc-d-{mode}" font-size="{fs}">']
    out.append(f'<title id="dc-t-{mode}">Water vapour held by compressed air at 7 bar g</title>')
    a, b = w_gkg(45), w_gkg(3)
    pct = round((a - b) / a * 100)
    out.append(
        f'<desc id="dc-d-{mode}">Saturation curve from 0 to 60 °C. Air leaving the aftercooler saturated at 45 °C holds about {fmt_num(a)} g of water per kg; '
        f'a WRD dryer chills it to a +3 °C pressure dew point, where it holds {fmt_num(b, 2)} g/kg, so about {pct}% of the vapour condenses and drains.</desc>'
    )
    # rulings: true measuring grid under the chart only
    step_t = 5 if mode == "wide" else 10
    for t in range(t0, t1 + 1, step_t):
        major = t % 10 == 0
        out.append(f'<line x1="{X(t):.1f}" y1="{mt}" x2="{X(t):.1f}" y2="{mt+ph}" class="{"rule-major" if major else "rule-minor"}"/>')
        if major:
            out.append(f'<text x="{X(t):.1f}" y="{mt+ph+fs+6}" text-anchor="middle" class="tick">{t}</text>')
    for v in range(0, y1 + 1, 2):
        major = v % 4 == 0
        out.append(f'<line x1="{ml}" y1="{Y(v):.1f}" x2="{ml+pw}" y2="{Y(v):.1f}" class="{"rule-major" if major else "rule-minor"}"/>')
        if major:
            out.append(f'<text x="{ml-8}" y="{Y(v)+4:.1f}" text-anchor="end" class="tick">{v}</text>')
    out.append(f'<text x="{ml+pw}" y="{H-6}" text-anchor="end" class="axis">Temperature, °C</text>')
    out.append(f'<text x="{ml}" y="{mt-8}" class="axis">g water / kg air</text>')
    # inlet rating band 10–60 °C
    out.append(f'<rect x="{X(10):.1f}" y="{mt+ph}" width="{X(60)-X(10):.1f}" height="4" class="band"/>')
    # saturation curve
    pts = " ".join(f"{X(t):.1f},{Y(w_gkg(t)):.1f}" for t in [i * 0.5 for i in range(0, 121)] if w_gkg(t) <= y1 + 0.2)
    out.append(f'<polyline points="{pts}" class="sat"/>')
    lbl_t = 55 if mode == "wide" else 52
    out.append(f'<text x="{X(lbl_t)-6:.1f}" y="{Y(w_gkg(lbl_t))-8:.1f}" text-anchor="end" class="sat-label">Saturation at 7 bar g</text>')
    # process line along the curve 45 → 3
    proc = " ".join(f"{X(t):.1f},{Y(w_gkg(t)):.1f}" for t in [45 - i * 0.5 for i in range(0, 85)])
    out.append(f'<polyline points="{proc}" class="process"/>')
    # condensate bracket
    bx = X(45) + (14 if mode == "wide" else 10)
    out.append(f'<line x1="{bx:.1f}" y1="{Y(a):.1f}" x2="{bx:.1f}" y2="{Y(b):.1f}" class="bracket"/>')
    out.append(f'<line x1="{bx-4:.1f}" y1="{Y(a):.1f}" x2="{bx+4:.1f}" y2="{Y(a):.1f}" class="bracket"/>')
    out.append(f'<line x1="{bx-4:.1f}" y1="{Y(b):.1f}" x2="{bx+4:.1f}" y2="{Y(b):.1f}" class="bracket"/>')
    mid = (Y(a) + Y(b)) / 2
    out.append(f'<text x="{bx+8:.1f}" y="{mid-4:.1f}" class="note-strong">{pct}%</text>')
    out.append(f'<text x="{bx+8:.1f}" y="{mid+fs+2:.1f}" class="note">condensed</text>')
    # state points
    out.append(f'<circle cx="{X(45):.1f}" cy="{Y(a):.1f}" r="5" class="pt pt-a"/>')
    out.append(f'<circle cx="{X(3):.1f}" cy="{Y(b):.1f}" r="5" class="pt pt-b"/>')
    ax_, ay_ = X(45) - 10, Y(a) - 12
    out.append(f'<text x="{ax_:.1f}" y="{ay_:.1f}" text-anchor="end" class="state">45 °C in · {fmt_num(a)} g/kg</text>')
    ly = Y(4.2 if mode == "narrow" else 3.6)
    out.append(f'<line x1="{X(3):.1f}" y1="{Y(b)-6:.1f}" x2="{X(3):.1f}" y2="{ly+6:.1f}" class="bracket"/>')
    out.append(f'<text x="{X(3)-2:.1f}" y="{ly-fs-2:.1f}" class="state">+3 °C dew point</text>')
    out.append(f'<text x="{X(3)-2:.1f}" y="{ly:.1f}" class="note">{fmt_num(b, 2)} g/kg</text>')
    out.append("</svg>")
    return Markup("".join(out))


def dew_ladder(mode="wide"):
    """Pressure dew point delivered by each Win dryer on one temperature scale."""
    narrow = mode == "narrow"
    W, H = (360, 210) if narrow else (560, 150)
    ml, mr = 18, 18
    t0, t1 = -45, 10
    fs = 12 if narrow else 13

    def X(t):
        return ml + (t - t0) / (t1 - t0) * (W - ml - mr)

    out = [f'<svg viewBox="0 0 {W} {H}" class="chart chart--{mode}" role="img" aria-label="Pressure dew point delivered by each dryer: WRD refrigerated +3 °C, WHD with activated alumina −20 °C, WHD with molecular sieve −40 °C" font-size="{fs}">']
    y = 110 if narrow else 70
    out.append(f'<line x1="{ml}" y1="{y}" x2="{W-mr}" y2="{y}" class="axis-line"/>')
    for t in range(-40, 11, 10):
        out.append(f'<line x1="{X(t):.1f}" y1="{y-5}" x2="{X(t):.1f}" y2="{y+5}" class="axis-line"/>')
        out.append(f'<text x="{X(t):.1f}" y="{y+22}" text-anchor="middle" class="tick">{fmt_num(t,0)}</text>')
    pts = [(3, "WRD refrigerated", "+3 °C", "pt-b"), (-20, "WHD alumina", "−20 °C", "pt-c"), (-40, "WHD mol. sieve", "−40 °C", "pt-c")]
    if narrow:
        rows = {3: 30, -20: 62, -40: 30}
        for t, name, val, cls in pts:
            ty = rows[t]
            anchor = "end" if t > 0 else "start"
            dx = 0
            out.append(f'<line x1="{X(t):.1f}" y1="{ty+8}" x2="{X(t):.1f}" y2="{y-7}" class="bracket"/>')
            out.append(f'<text x="{X(t)+dx:.1f}" y="{ty-12}" text-anchor="{anchor}" class="state">{name}</text>')
            out.append(f'<text x="{X(t)+dx:.1f}" y="{ty+3}" text-anchor="{anchor}" class="note-strong">{val}</text>')
            out.append(f'<circle cx="{X(t):.1f}" cy="{y}" r="6" class="pt {cls}"/>')
        out.append(f'<text x="{W-mr}" y="{H-8}" text-anchor="end" class="axis">Pressure dew point, °C, at 7 bar g</text>')
    else:
        for t, name, val, cls in pts:
            out.append(f'<circle cx="{X(t):.1f}" cy="{y}" r="6" class="pt {cls}"/>')
            up = t != -40
            ty = y - 18 if up else y + 48
            anchor = "end" if t > 0 else ("middle" if t == -20 else "start")
            out.append(f'<text x="{X(t):.1f}" y="{ty}" text-anchor="{anchor}" class="state">{name} · {val}</text>')
        out.append(f'<text x="{W-mr}" y="{H-6}" text-anchor="end" class="axis">Pressure dew point, °C, rated at 7 bar g</text>')
    out.append("</svg>")
    return Markup("".join(out))


def tower_chart(mode="wide"):
    """Where each tower type can bring hot water: FRP to wet bulb + 4 °C, coil to ambient + 4 °C."""
    narrow = mode == "narrow"
    W, H = (360, 250) if narrow else (560, 210)
    ml, mr = 14, 14
    t0, t1 = 20, 100
    fs = 12 if narrow else 13

    def X(t):
        return ml + (t - t0) / (t1 - t0) * (W - ml - mr)

    out = [f'<svg viewBox="0 0 {W} {H}" class="chart chart--{mode}" role="img" aria-label="FRP cooling towers take inlet water of 40 to 100 °C down to wet bulb plus 4 °C. Coil cooling towers take 75 to 90 °C water down to ambient plus 4 °C." font-size="{fs}">']
    out.append('<defs><marker id="arr-' + mode + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M10,0 L0,5 L10,10 z" class="arrow"/></marker></defs>')
    rows = [("FRP towers", 40, 100, "to wet bulb + 4 °C"), ("Coil towers", 75, 90, "to ambient + 4 °C")]
    gap = 100 if narrow else 78
    for i, (name, a, b, to) in enumerate(rows):
        y = 56 + i * gap
        out.append(f'<text x="{ml}" y="{y-26}" class="state">{name}</text>')
        out.append(f'<text x="{W-mr}" y="{y-26}" text-anchor="end" class="note">inlet {a}–{b} °C</text>')
        out.append(f'<rect x="{X(a):.1f}" y="{y-6}" width="{X(b)-X(a):.1f}" height="12" class="band-hot"/>')
        out.append(f'<line x1="{X(a):.1f}" y1="{y}" x2="{X(30):.1f}" y2="{y}" class="process" marker-end="url(#arr-{mode})"/>')
        out.append(f'<text x="{ml}" y="{y+26}" class="note-strong">{to}</text>')
    for t in range(20, 101, 20):
        out.append(f'<text x="{X(t):.1f}" y="{H-6}" text-anchor="middle" class="tick">{t} °C</text>')
    out.append("</svg>")
    return Markup("".join(out))


# ---------------------------------------------------------------- helpers
def whatsapp(text):
    return f"https://wa.me/{site['whatsapp']}?text={quote(text)}"


def model_id(model):
    return re.sub(r"[^a-z0-9]+", "-", model.lower()).strip("-")


def product_url(slug):
    return f"/products/{slug}.html"


def family_of(p):
    return families[p["family"]]


def cell(row, key):
    v = row.get(key, "")
    if isinstance(v, float):
        v = f"{v:g}"
    return v


def jsonld(obj):
    return Markup('<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + "</script>")


env = Environment(loader=FileSystemLoader(SRC / "templates"), undefined=StrictUndefined, autoescape=True, trim_blocks=True, lstrip_blocks=True)
env.globals.update(
    site=site, products=products, families=families, industries=industries, photos=photos, home_photos=home_photos,
    picture=picture, image_url=image_url, studio=studio, whatsapp=whatsapp, model_id=model_id,
    product_url=product_url, family_of=family_of, cell=cell, jsonld=jsonld,
    dew_chart=dew_chart, dew_ladder=dew_ladder, tower_chart=tower_chart,
    year=date.today().year, today=date.today().isoformat(),
    w_gkg=w_gkg, fmt_num=fmt_num,
)

pages_written = []
page_sources = {}



# ---------------------------------------------------------------- sizing tools (catalogue data only)
tools = [
    {"id": "dryer", "url": "/engineering-tools/air-dryer-sizing.html", "product": "refrigerated-air-dryers",
     "name": "Air dryer sizing calculator", "card": "Compressor CFM and site conditions to a WRD or WHD model.",
     "title": "Air Dryer Sizing Calculator (CFM) | Win Equipments",
     "description": "Size a refrigerated air dryer from compressor CFM, inlet and ambient temperature, pressure and dew point, using WRD catalogue correction factors.",
     "h1": "Air dryer sizing calculator",
     "lede": "Enter your compressor's capacity and site conditions. The calculator applies the correction factors from our WRD catalogue and picks the dryer that covers the duty.",
     "method": ["Dryer nominal capacity = compressor actual capacity ÷ (C1 × C2 × C3 × C4), where C1 to C4 are the catalogue factors for inlet temperature, ambient temperature, inlet pressure and dew point.",
                "WRD dryers are rated at 45 °C inlet, 35 °C ambient, 7 bar g and a +3 °C pressure dew point, where every factor is 1.0. Flow capacities are per ISO 7183 (free air at 20 °C, 1 bar).",
                "For −20 °C or −40 °C dew points the calculator selects a WHD heatless desiccant dryer by flow: activated alumina (A) for −20 °C, molecular sieve (M) for −40 °C, both at 38 °C and 7 bar g."],
     "faqs": [{"q": "How do I size a refrigerated air dryer?", "a": "Take the compressor's actual free air delivery in CFM and divide it by the product of the four correction factors for inlet temperature, ambient temperature, pressure and dew point. Choose the WRD model whose rated CFM is equal to or above the result."},
              {"q": "Why does a hot plant need a bigger dryer?", "a": "At 40 °C ambient the factor is 0.91 and at 45 °C it is 0.87, so the dryer must be rated higher than the compressor flow to deliver the same dew point."},
              {"q": "When do I need a desiccant dryer instead?", "a": "When the process needs a pressure dew point below freezing, such as −20 °C or −40 °C. Refrigerated dryers deliver +3 °C."}]},
    {"id": "chiller", "url": "/engineering-tools/chiller-tonnage-calculator.html", "product": "industrial-process-chillers",
     "name": "Chiller tonnage calculator", "card": "Water flow and temperature rise to TR and a WCP model.",
     "title": "Chiller Tonnage Calculator (TR) | Win Equipments",
     "description": "Work out the chiller capacity in TR from water flow and temperature rise, corrected for outlet and ambient temperature, and find the matching WCP model.",
     "h1": "Chiller tonnage calculator",
     "lede": "Enter the process water flow and how much it heats up. The calculator works out the heat load, applies the WCP catalogue factors for outlet and ambient temperature, and picks a model.",
     "method": ["Heat load (TR) = water flow (LPM) × ΔT (°C) ÷ 50.4, because 1 TR = 3,024 kcal/hr and water carries 1 kcal per kg per °C. A known load in kW converts at 1 TR = 3.517 kW.",
                "WCP chillers are rated at 15 °C water outlet and 40 °C ambient. Required nominal capacity = heat load ÷ (outlet factor × ambient factor), using the factors from our catalogue.",
                "Each WCP model also has a rated water flow; the calculator flags when your flow is above it."],
     "faqs": [{"q": "How do I calculate chiller tonnage?", "a": "Multiply the water flow in litres per minute by the temperature rise in °C and divide by 50.4. For example 100 LPM with a 5 °C rise is about 9.9 TR."},
              {"q": "Why does a lower outlet temperature need a bigger chiller?", "a": "A chiller delivers less capacity at colder water. At 10 °C outlet the catalogue factor is 0.75 and at 5 °C it is 0.6, so the nominal capacity must be higher."},
              {"q": "What if I need more than 20 TR?", "a": "WCP standard models go up to 20 TR. Send us your duty and our engineers will propose a larger or multiple-unit solution."}]},
    {"id": "tower", "url": "/engineering-tools/cooling-tower-calculator.html", "product": "round-cooling-towers",
     "name": "Cooling tower calculator", "card": "Flow and temperatures to heat load, a WCT model and water loss.",
     "title": "Cooling Tower Calculator: TR & Evaporation | Win",
     "description": "Calculate cooling tower heat load in TR, check the approach to wet bulb, choose the fill type and estimate evaporation loss, then find a WCT tower.",
     "h1": "Cooling tower calculator",
     "lede": "Enter the water flow, hot and cold water temperatures and your site wet bulb. The calculator gives the heat load, checks it against our WCT ratings and estimates the water lost to evaporation.",
     "method": ["Heat load (TR) = flow (m³/hr) × range (°C) × 1,000 ÷ 3,024, where range is hot minus cold water temperature.",
                "WCT towers are rated for cold water at wet bulb + 4 °C, with 0.6 m³/hr of water per TR (a 5 °C range). The calculator picks the smallest tower whose rated TR and water flow both cover your duty.",
                "Fill type follows the hot water temperature: L fills up to 55 °C, H fills from 55 to 85 °C, polypropylene rings (P) above that. Evaporation loss = 0.00085 × 1.8 × flow (m³/hr) × range (°C)."],
     "faqs": [{"q": "How cold can a cooling tower make the water?", "a": "WCT towers are rated to deliver water at the wet bulb temperature plus 4 °C. A colder target needs a special selection, so ask our engineers."},
              {"q": "How much make-up water does a cooling tower need?", "a": "Evaporation alone is about 0.00085 × 1.8 × flow × range. For 30 m³/hr and a 5 °C range that is about 0.23 m³/hr, before drift and blow-down."},
              {"q": "Round or square tower?", "a": "Both WCT ranges cover 10 to 300 TR with the same ratings. Square towers suit tight or rectangular spaces and multi-cell layouts; round towers are the bottle type."}]},
]
tools_by_id = {t["id"]: t for t in tools}


def tool_data(tid):
    if tid == "dryer":
        wrd = products["refrigerated-air-dryers"]["spec"]["rows"]
        whd = products["desiccant-air-dryers"]["spec"]["rows"]
        return {"wrd": [{"model": r["model"], "cfm": r["cfm"]} for r in wrd], "whd": [{"model": r["model"], "cfm": r["cfm"]} for r in whd],
                "wrd_url": product_url("refrigerated-air-dryers"), "whd_url": product_url("desiccant-air-dryers")}
    if tid == "chiller":
        return {"wcp": [{"model": r["model"], "tr": r["tr"], "lpm": r["lpm"]} for r in products["industrial-process-chillers"]["spec"]["rows"]],
                "url": product_url("industrial-process-chillers")}
    return {s: [{"model": r["model"], "tr": r["tr"], "m3hr": r["m3hr"]} for r in products[f"{s}-cooling-towers"]["spec"]["rows"]] for s in ("round", "square")} | {
        "round_url": product_url("round-cooling-towers"), "square_url": product_url("square-cooling-towers")}


# ---------------------------------------------------------------- blog (tiny markdown)
def _inline(t):
    t = html_escape(t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", r'<a href="\2">\1</a>', t)
    return t


def html_escape(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def md(text):
    out, para, lst, table = [], [], None, []

    def flush():
        nonlocal para, lst, table
        if para:
            out.append("<p>" + _inline(" ".join(para)) + "</p>"); para = []
        if lst:
            tag, items = lst
            out.append(f"<{tag}>" + "".join(f"<li>{_inline(i)}</li>" for i in items) + f"</{tag}>"); lst = None
        if table:
            rows = [[c.strip() for c in r.strip().strip("|").split("|")] for r in table if not re.match(r"^\|?\s*:?-{3}", r.strip())]
            head, body = rows[0], rows[1:]
            out.append('<div class="scroll-x"><table class="a-table"><thead><tr>' + "".join(f'<th scope="col">{_inline(c)}</th>' for c in head) + "</tr></thead><tbody>"
                       + "".join("<tr>" + "".join((f'<th scope="row">{_inline(c)}</th>' if i == 0 else f"<td>{_inline(c)}</td>") for i, c in enumerate(r)) + "</tr>" for r in body) + "</tbody></table></div>")
            table = []

    for line in text.split("\n"):
        st = line.strip()
        if not st:
            flush(); continue
        if st.startswith("|"):
            if para or lst: flush()
            table.append(st); continue
        if table: flush()
        m = re.match(r"^(#{2,3})\s+(.*)", st)
        if m:
            flush(); lvl = len(m.group(1)); slug = model_id(m.group(2))
            out.append(f'<h{lvl} id="{slug}">{_inline(m.group(2))}</h{lvl}>'); continue
        if st.startswith("@chart"):
            flush(); kind = st.split()[1]
            if kind == "dew":
                out.append(f'<figure class="chart-plate a-figure">{dew_chart("narrow")}{dew_chart("wide")}<figcaption>Water vapour held by compressed air at 7 bar g. Calculated values.</figcaption></figure>')
            continue
        if st.startswith("@photo"):
            flush(); f, _, cap = st[6:].strip().partition("|")
            out.append(f'<figure class="a-figure a-photo">{picture("images/works/" + f.strip(), cap.strip(), sizes="(min-width: 900px) 760px, 100vw", max_w=1200)}<figcaption>{html_escape(cap.strip())}</figcaption></figure>')
            continue
        if st.startswith("> "):
            flush(); out.append(f'<aside class="a-note"><p>{_inline(st[2:])}</p></aside>'); continue
        m = re.match(r"^(-|\d+\.)\s+(.*)", st)
        if m:
            if para: flush()
            tag = "ol" if m.group(1)[0].isdigit() else "ul"
            if lst and lst[0] != tag: flush()
            if not lst: lst = (tag, [])
            lst[1].append(m.group(2)); continue
        if lst: flush()
        para.append(st)
    flush()
    return Markup("\n".join(out))


def load_articles():
    arts = []
    for f in sorted((SRC / "content" / "blog").glob("*.md")):
        raw = f.read_text()
        _, fm, body = raw.split("---", 2)
        meta = {}
        for line in fm.strip().split("\n"):
            k, _, v = line.partition(":")
            v = v.strip()
            meta[k.strip()] = v[1:-1] if len(v) > 1 and v[0] == v[-1] == '"' else v
        meta["slug"] = f.stem
        meta["url"] = f"/blog/{f.stem}.html"
        meta["products"] = [x.strip() for x in meta.get("products", "").split(",") if x.strip()]
        meta["body"] = body
        meta["words"] = len(re.sub(r"[@#>|*\-]", " ", body).split())
        arts.append(meta)
    return sorted(arts, key=lambda a: (a.get("order", "99").zfill(3), a["slug"]))


def build_htaccess():
    rules = []
    for src, dst in json.loads((DATA / "redirects.json").read_text()):
        pat = "^" + re.escape(src).replace("\\ ", " ") + "$"
        flags = "R=301,L,NE" if "#" in dst else "R=301,L"
        rules.append(f'    RewriteRule "{pat}" {dst} [{flags}]')
    tpl = (SRC / "htaccess.tpl").read_text()
    (OUT / ".htaccess").write_text(tpl.replace("{{REDIRECTS}}", "\n".join(rules)))

def render(template, url, **ctx):
    path = OUT / url.lstrip("/") / "index.html" if url.endswith("/") else OUT / url.lstrip("/")
    path.parent.mkdir(parents=True, exist_ok=True)
    html = env.get_template(template).render(url=url, **ctx)
    path.write_text(html)
    pages_written.append(url)
    srcs = [SRC / "templates" / template]
    if "p" in ctx: srcs.append(DATA / "products" / f"{ctx['p']['slug']}.json")
    if "a" in ctx: srcs.append(SRC / "content" / "blog" / f"{ctx['a']['slug']}.md")
    if "loc" in ctx: srcs.append(DATA / "locations.json")
    if "ind" in ctx or "fam" in ctx: srcs.append(DATA / "site.json")
    page_sources[url] = srcs


def org_schema():
    a = site["address"]
    return {
        "@type": ["Organization", "LocalBusiness"],
        "@id": site["url"] + "/#org",
        "name": site["name"],
        "url": site["url"] + "/",
        "logo": site["url"] + "/logo.png",
        "foundingDate": str(site["founded"]),
        "email": site["email"],
        "telephone": site["phones"][0]["tel"],
        "address": {"@type": "PostalAddress", "streetAddress": a["street"] + ", " + a["locality"], "addressLocality": a["city"], "addressRegion": a["region"], "postalCode": a["postal"], "addressCountry": a["country"]},
        "image": image_url("images/about_us_2.jpg"),
        "slogan": site["tagline"],
        "founder": {"@type": "Person", "honorificPrefix": "Mr.", "name": site["founder"].removeprefix("Mr. ")},
        "hasMap": site["maps"],
        "areaServed": {"@type": "Country", "name": "India"},
        "contactPoint": [{"@type": "ContactPoint", "contactType": "sales", "telephone": ph["tel"], "email": site["email"], "areaServed": "IN", "availableLanguage": ["en", "ta"]} for ph in site["phones"]],
        "hasCredential": {"@type": "EducationalOccupationalCredential", "credentialCategory": "certification", "name": site["certification"]},
        "knowsAbout": ["Refrigerated air dryers", "Desiccant air dryers", "Compressed air filtration", "Process chillers", "FRP cooling towers", "Coil cooling towers"],
    }


def product_ld(p):
    """ProductGroup with one variant per catalogue model; no offers or ratings (none are published)."""
    url = site["url"] + product_url(p["slug"])
    imgs = [image_url(p["image"])] + [image_url(ph["path"]) for ph in photos if ph.get("product") == p["slug"]][:4]
    base = {"name": p["h1"], "description": p["description"], "image": imgs, "url": url,
            "brand": {"@type": "Brand", "name": site["name"]}, "manufacturer": {"@id": site["url"] + "/#org"},
            "category": families[p["family"]]["name"]}
    props = [{"@type": "PropertyValue", "name": k["label"], "value": k["value"]} for k in p.get("key_specs") or []]
    if props:
        base["additionalProperty"] = props
    spec = p.get("spec")
    if not spec or p["series"] in ("Engineered to order", "Spares"):
        return dict({"@type": "Product", "@id": url + "#product"}, **base)
    cols = [c for c in spec["columns"] if c["key"] != "model"]
    variants = []
    for r in spec["rows"]:
        vp = []
        for c in cols:
            v = r.get(c["key"])
            if v in (None, "", "—"):
                continue
            name = c["label"] + (f" ({c['unit']})" if c.get("unit") else "")
            vp.append({"@type": "PropertyValue", "name": name, "value": v})
        variants.append({"@type": "Product", "name": f"{r['model']} {p['name']}", "mpn": r["model"], "model": r["model"],
                         "url": f"{url}#{model_id(r['model'])}", "additionalProperty": vp})
    return dict({"@type": "ProductGroup", "@id": url + "#product", "productGroupID": p["series"], "model": p["series"], "hasVariant": variants}, **base)


env.globals["org_schema"] = org_schema
env.globals["product_ld"] = product_ld


def faq_ld(items):
    return {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": f["q"], "acceptedAnswer": {"@type": "Answer", "text": f["a"]}} for f in items]}


def crumbs_ld(items):
    return {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": site["url"] + h} for i, (n, h) in enumerate(items)]}


articles = load_articles()
locations = json.loads((DATA / "locations.json").read_text())
industries_by_slug = {i["slug"]: i for i in site["industries"]}
env.globals.update(faq_ld=faq_ld, crumbs_ld=crumbs_ld, tools=tools, tool_data=tool_data, articles=articles, md=md, locations=locations, industries_by_slug=industries_by_slug)
env.filters["pname"] = lambda slug: products[slug]["name"]
NUM_WORDS = {15: "Fifteen", 16: "Sixteen", 17: "Seventeen", 18: "Eighteen", 19: "Nineteen", 20: "Twenty", 21: "Twenty-one", 22: "Twenty-two"}
env.globals["product_count"] = len(products)
env.globals["product_count_word"] = NUM_WORDS.get(len(products), str(len(products)))
env.tests["contains"] = lambda seq, item: item in seq
env.filters["datefmt"] = lambda d: __import__("datetime").date.fromisoformat(d).strftime("%-d %B %Y")
env.globals["pdf_size"] = lambda href: f"{(SRC / 'static' / href.lstrip('/')).stat().st_size / 1048576:.1f} MB"
env.globals["fam_urls"] = lambda fam: [{"@type": "Product", "name": p["h1"], "url": site["url"] + product_url(p["slug"])} for p in fam["products"]]
env.globals["industry_count"] = lambda i: sum(1 for p in products.values() if i in p.get("industries", []))


def copy_static():
    for d in ("css", "js", "fonts"):
        src = SRC / "assets" / d
        if src.exists():
            shutil.copytree(src, OUT / d, dirs_exist_ok=True)
    for f in (SRC / "static").glob("*"):
        if f.is_file():
            shutil.copy2(f, OUT / f.name)
    for sub in ("downloads", "uploads"):
        if (SRC / "static" / sub).exists():
            shutil.copytree(SRC / "static" / sub, OUT / sub, dirs_exist_ok=True)
    for php in (SRC / "php").glob("*.php"):
        shutil.copy2(php, OUT / php.name)


def build_chat_knowledge():
    """Product facts for the chat assistant, generated from the same data as the pages."""
    lines = [f"Company: {site['name']}, manufacturer in Arasur, Coimbatore, Tamil Nadu, India, established {site['founded']}. "
             f"{site['certification']} certified. {site['installations']} installations. Phones: {', '.join(p['display'] for p in site['phones'])}. "
             f"WhatsApp: https://wa.me/{site['whatsapp']}. Email: {site['email']}. Address: {', '.join(site['address_lines'])}.", ""]
    for fam in families.values():
        lines.append(f"## {fam['name']}")
        for p in fam["products"]:
            url = site["url"] + product_url(p["slug"])
            lines.append(f"### {p['name']} ({p['series']}) — range {p['range']} — {url}")
            lines.append(p["lede"])
            for k in p.get("key_specs", []):
                lines.append(f"- {k['label']}: {k['value']}")
            for c in p.get("conditions", []):
                lines.append(f"- {c['label']}: {c['value']}")
            if p.get("spec"):
                cols = p["spec"]["columns"]
                lines.append("Models: " + " | ".join(", ".join(f"{c['label']}{(' (' + c['unit'] + ')') if c.get('unit') else ''}: {cell(r, c['key'])}" for c in cols) for r in p["spec"]["rows"]))
                for n in p["spec"]["notes"]:
                    lines.append(f"Note: {n}")
            if p.get("needs"):
                lines.append("Engineered to order. To quote we need: " + "; ".join(p["needs"]))
            if p.get("selection", {}).get("formula"):
                lines.append("Sizing: " + p["selection"]["formula"])
            lines.append("")
    text = "\n".join(lines).replace("EOT", "E0T")
    (OUT / "chat_knowledge.php").write_text("<?php\nreturn <<<'EOT'\n" + text + "\nEOT;\n")


def build_css():
    order = ["tokens.css", "base.css", "layout.css", "components.css", "chart.css", "pages.css", "home.css", "chiller360.css", "chat.css"]
    css = "\n".join((SRC / "assets" / "css" / f).read_text() for f in order if (SRC / "assets" / "css" / f).exists())
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"\s+", " ", css)
    css = re.sub(r"\s*([{};,>])\s*", r"\1", css).replace(";}", "}")
    (OUT / "css").mkdir(parents=True, exist_ok=True)
    (OUT / "css" / "site.css").write_text(css)
    return len(css)


def main():
    if OUT.exists():
        for child in OUT.iterdir():
            if child.name == "img":
                continue
            shutil.rmtree(child) if child.is_dir() else child.unlink()
    OUT.mkdir(exist_ok=True)
    copy_static()
    for f in (OUT / "css").glob("*.css"):
        f.unlink()
    size = build_css()
    env.globals["css_bytes"] = size
    import hashlib
    env.globals["js_ver"] = hashlib.md5(b"".join((SRC / "assets" / "js" / f).read_bytes() for f in sorted(os.listdir(SRC / "assets" / "js")))).hexdigest()[:8]

    build_chat_knowledge()
    render("pages/home.html", "/")
    for fam in families.values():
        render("pages/family.html", f"/products/{fam['slug']}.html", fam=fam)
    render("pages/products.html", "/products/")
    for p in products.values():
        render("pages/product.html", product_url(p["slug"]), p=p, fam=families[p["family"]])
    render("pages/industries.html", "/industries/")
    for ind in industries.values():
        render("pages/industry.html", f"/industries/{ind['slug']}.html", ind=ind)
    render("pages/downloads.html", "/downloads.html")
    render("pages/contact.html", "/contactus.html")
    render("pages/about.html", "/about.html")
    render("pages/tools.html", "/engineering-tools/")
    render("pages/blog.html", "/blog.html")
    render("pages/locations.html", "/locations/")
    for loc in locations:
        render("pages/location.html", f"/locations/{loc['slug']}.html", loc=loc)
    for a in articles:
        render("pages/article.html", a["url"], a=a)
    for t in tools:
        render("pages/tool.html", t["url"], tool=t)
    render("pages/certifications.html", "/certifications.html")
    render("pages/thanks.html", "/thank-you.html")
    render("pages/404.html", "/404.html")

    build_htaccess()

    # html sitemap (lists every page by section, titles read back from the output)
    def page_title(u):
        f = OUT / (u.lstrip("/") + ("index.html" if u.endswith("/") else ""))
        m = re.search(r"<h1[^>]*>(.*?)</h1>", f.read_text(), re.S)
        return re.sub(r"<[^>]+>", "", m.group(1)).strip() if m else u
    groups = {}
    for u in [u for u in pages_written if u not in ("/404.html", "/thank-you.html")]:
        sec = u.strip("/").split("/")[0] if u.count("/") > 1 else "main"
        groups.setdefault(sec, []).append((u, page_title(u)))
    render("pages/sitemap.html", "/sitemap.html", groups=groups)

    # xml sitemap with images and lastmod from git history of each page's sources
    def lastmod(u):
        files = [str(f) for f in page_sources.get(u, []) if f.exists()]
        dirty = subprocess.run(["git", "status", "--porcelain", "--", *files], cwd=ROOT, capture_output=True, text=True).stdout.strip()
        if dirty or not files:
            return date.today().isoformat()
        d = subprocess.run(["git", "log", "-1", "--format=%cs", "--", *files], cwd=ROOT, capture_output=True, text=True).stdout.strip()
        return d or date.today().isoformat()
    urls = [u for u in pages_written if u not in ("/404.html", "/thank-you.html")]
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">']
    for u in urls:
        f = OUT / (u.lstrip("/") + ("index.html" if u.endswith("/") else ""))
        main = re.search(r'<main id="main">(.*?)</main>', f.read_text(), re.S)
        imgs = []
        for m in re.finditer(r'<img src="(/img/[^"]+)"[^>]*alt="([^"]+)"', main.group(1) if main else ""):
            if m.group(1) not in imgs:
                imgs.append(m.group(1))
        img_xml = "".join(f"<image:image><image:loc>{site['url']}{i}</image:loc></image:image>" for i in imgs[:20])
        sm.append(f"<url><loc>{site['url']}{u}</loc><lastmod>{lastmod(u)}</lastmod>{img_xml}</url>")
    sm.append("</urlset>")
    (OUT / "sitemap.xml").write_text("\n".join(sm))
    print(f"built {len(pages_written)} pages, css {size} bytes")


if __name__ == "__main__":
    main()
