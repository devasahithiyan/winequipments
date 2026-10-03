#!/usr/bin/env python3
"""Generate the Win Equipments catalogue PDFs from the same data as the website.

    python3 src/site/catalogue/build_catalogues.py        # writes src/site/static/downloads/*.pdf

Layout is print HTML (A4) rendered by headless Chrome. Every figure comes from
src/site/data (transcribed from the original catalogues kept in ./originals).
"""
import subprocess
import sys
from datetime import date
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

site, products, families = site_build.site, site_build.products, site_build.families
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
    dest = CACHE / "img" / f"{src.stem}-{w}{src.suffix if src.suffix.lower() == '.png' else '.jpg'}"
    if not dest.exists() or dest.stat().st_mtime < src.stat().st_mtime:
        dest.parent.mkdir(parents=True, exist_ok=True)
        im = ImageOps.exif_transpose(Image.open(src))
        im.thumbnail((w, w), Image.LANCZOS)
        if dest.suffix == ".png":
            im.save(dest, optimize=True)
        else:
            im.convert("RGB").save(dest, quality=84, optimize=True, progressive=True)
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
                   product_url=site_build.product_url, dew_chart=site_build.dew_chart, today=date.today(),
                   industries=site["industries"], css=Markup((HERE / "templates" / "print.css").read_text()),
                   chart_css=Markup((site_build.SRC / "assets" / "css" / "chart.css").read_text()),
                   font=file_url(site_build.SRC / "assets" / "fonts" / "archivo-latin.woff2"),
                   logo=file_url(ROOT / "images" / "logo.png"),
                   marks=[img(f"images/{m}.png", 220) for m in ("iso", "dac", "iaf")])
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
    print_pdf(html, pdf)
    print(f"{pdf.relative_to(ROOT)}  {pdf.stat().st_size / 1048576:.1f} MB")


def main(only=None):
    OUT.mkdir(parents=True, exist_ok=True)
    for name, slugs, kind in SHEETS:
        if only and name not in only:
            continue
        render("datasheet.html", name, items=[products[s] for s in slugs], kind=kind)
    if not only or "win-equipments-catalogue" in only:
        render("master.html", "win-equipments-catalogue")


if __name__ == "__main__":
    main(sys.argv[1:] or None)
