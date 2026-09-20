#!/usr/bin/env python3
"""
Win Equipments Product Catalogues — Build & Print Engine
Compiles publication-grade, print-ready PDF brochures (5 pages) and
Master E-Catalogue (16 pages) using Jinja2 templates, print-first CSS,
vector SVG QR codes, and Google Chrome Headless.
"""

import os
import sys
import json
import argparse
import subprocess
import io
import re
from pathlib import Path
import jinja2
import qrcode
import qrcode.image.svg
import pypdf

# Default configuration paths
WORKSPACE_DIR = Path("/Users/devasahithiyan/Desktop/Win equipments")
SRC_DIR = WORKSPACE_DIR / "src"
DATA_DIR = SRC_DIR / "data"
TEMPLATES_DIR = SRC_DIR / "templates"
ASSETS_DIR = SRC_DIR / "assets"
CSS_PATH = ASSETS_DIR / "css" / "print.css"
QR_DIR = ASSETS_DIR / "qr"
BUILD_HTML_DIR = WORKSPACE_DIR / "build" / "html"
OUTPUT_PDF_DIR = WORKSPACE_DIR / "catlogue"

CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

BANNED_NUMBERS = ["9597228978", "0422-2562975", "2562975"]
REQUIRED_STRINGS = ["95972 28969", "95972 28975", "info@winequipments.com", "SF No: 4, 195 B, Kallangadu"]


def generate_qr_svg(url: str, output_svg_path: Path = None) -> str:
    """Generate high-contrast vector SVG QR code for product URL."""
    QR_DIR.mkdir(parents=True, exist_ok=True)
    qr = qrcode.QRCode(
        box_size=10,
        border=1,
        image_factory=qrcode.image.svg.SvgPathImage
    )
    qr.add_data(url)
    qr.make(fit=True)
    svg_img = qr.make_image()
    stream = io.BytesIO()
    svg_img.save(stream)
    svg_str = stream.getvalue().decode("utf-8")

    # Add styling for responsive scaling inside parent container
    svg_str = re.sub(
        r'<svg\s+',
        r'<svg style="width: 100%; height: 100%; display: block;" ',
        svg_str,
        count=1
    )

    if output_svg_path:
        with open(output_svg_path, "w", encoding="utf-8") as f:
            f.write(svg_str)

    return svg_str


def load_dataset():
    """Load company info and all product definitions."""
    with open(DATA_DIR / "company.json", "r", encoding="utf-8") as f:
        company = json.load(f)

    with open(DATA_DIR / "products_batch1.json", "r", encoding="utf-8") as f:
        b1 = json.load(f)["products"]

    with open(DATA_DIR / "products_batch2.json", "r", encoding="utf-8") as f:
        b2 = json.load(f)["products"]

    all_products = b1 + b2
    product_map = {p["slug"]: p for p in all_products}
    return company, b1, b2, all_products, product_map


def compile_html(template_name: str, context: dict, output_path: Path):
    """Render Jinja2 template with context and write to output_path."""
    BUILD_HTML_DIR.mkdir(parents=True, exist_ok=True)
    env = jinja2.Environment(
        loader=jinja2.FileSystemLoader(str(TEMPLATES_DIR)),
        autoescape=jinja2.select_autoescape(["html", "xml"])
    )
    template = env.get_template(template_name)
    html_content = template.render(**context)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    return output_path


def render_pdf_with_chrome(html_path: Path, pdf_path: Path):
    """Invoke Google Chrome headless to print pixel-perfect A4 PDF."""
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        CHROME_BIN,
        "--headless=new",
        "--disable-gpu",
        "--allow-file-access-from-files",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=6000",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        str(html_path)
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"Chrome headless error ({proc.returncode}):\n{proc.stderr}")
    if not pdf_path.exists() or pdf_path.stat().st_size == 0:
        raise RuntimeError(f"PDF output {pdf_path} was not generated or is empty.")
    return pdf_path


def audit_pdf(pdf_path: Path, expected_pages: int):
    """Verify PDF dimensions, page count, and contact hygiene."""
    reader = pypdf.PdfReader(str(pdf_path))
    actual_pages = len(reader.pages)
    if actual_pages != expected_pages:
        raise AssertionError(
            f"Page count mismatch in {pdf_path.name}: expected {expected_pages}, got {actual_pages}"
        )

    # Check dimensions of first page
    p0 = reader.pages[0]
    w_mm = float(p0.mediabox.width) * 25.4 / 72.0
    h_mm = float(p0.mediabox.height) * 25.4 / 72.0

    # A4 standard: 210mm x 297mm (+/- 1.5mm tolerance)
    if not (208.5 <= w_mm <= 211.5 and 295.5 <= h_mm <= 298.5):
        raise AssertionError(
            f"Dimension violation in {pdf_path.name}: got {w_mm:.2f}mm x {h_mm:.2f}mm (expected 210mm x 297mm)"
        )

    # Extract all text and verify contact hygiene
    all_text = " ".join([p.extract_text() or "" for p in reader.pages])

    for banned in BANNED_NUMBERS:
        if banned in all_text:
            raise AssertionError(f"CRITICAL HYGIENE VIOLATION: Banned number {banned} found in {pdf_path.name}")

    for req in REQUIRED_STRINGS:
        if req not in all_text:
            raise AssertionError(f"CRITICAL HYGIENE VIOLATION: Required string '{req}' missing from {pdf_path.name}")

    return {
        "pdf": pdf_path.name,
        "pages": actual_pages,
        "width_mm": round(w_mm, 2),
        "height_mm": round(h_mm, 2),
        "size_kb": round(pdf_path.stat().st_size / 1024, 1),
        "hygiene": "PASS"
    }


def build_brochure(product: dict, company: dict, output_dir: Path = OUTPUT_PDF_DIR):
    """Compile a single 5-page product brochure PDF."""
    slug = product["slug"]
    print(f"\n[BUILD] Building 5-Page Brochure: {product['name']} ({slug})...")

    # 1. Generate QR Code
    qr_svg_path = QR_DIR / f"qr_{slug}.svg"
    qr_svg = generate_qr_svg(product["canonical_url"], qr_svg_path)

    # 2. Read CSS
    with open(CSS_PATH, "r", encoding="utf-8") as f:
        print_css = f.read()

    # 3. Render HTML
    html_path = BUILD_HTML_DIR / f"{slug}.html"
    context = {
        "doc_title": f"Win Equipments — {product['name']} Brochure",
        "company": company,
        "product": product,
        "print_css": print_css,
        "image_root": f"file://{WORKSPACE_DIR}",
        "qr_svg": qr_svg
    }
    compile_html("brochure_template.html", context, html_path)
    print(f"  -> Generated HTML: {html_path}")

    # 4. Render PDF
    pdf_path = output_dir / product["pdf_filename"]
    render_pdf_with_chrome(html_path, pdf_path)
    print(f"  -> Generated PDF: {pdf_path} ({pdf_path.stat().st_size // 1024} KB)")

    # 5. Audit PDF
    audit_res = audit_pdf(pdf_path, expected_pages=5)
    print(f"  -> Audit: PASS (Pages: {audit_res['pages']}, Dimensions: {audit_res['width_mm']}x{audit_res['height_mm']}mm, Hygiene: PASS)")
    return audit_res


def build_master_catalogue(all_products: list, company: dict, output_dir: Path = OUTPUT_PDF_DIR):
    """Compile the 16-page Master E-Catalogue PDF."""
    print(f"\n[BUILD] Building 16-Page Master E-Catalogue...")

    # 1. Generate QR Code for main portal
    qr_svg_path = QR_DIR / "qr_master_portal.svg"
    qr_svg = generate_qr_svg(company["website_url"], qr_svg_path)

    # 2. Read CSS
    with open(CSS_PATH, "r", encoding="utf-8") as f:
        print_css = f.read()

    # 3. Render HTML
    html_path = BUILD_HTML_DIR / "master_e_catalogue.html"
    context = {
        "doc_title": "Win Equipments — Master Product E-Catalogue",
        "company": company,
        "all_products": all_products,
        "print_css": print_css,
        "image_root": f"file://{WORKSPACE_DIR}",
        "qr_svg": qr_svg
    }
    compile_html("master_catalogue_template.html", context, html_path)
    print(f"  -> Generated HTML: {html_path}")

    # 4. Render PDF
    pdf_path = output_dir / "E_Catalogue.pdf"
    render_pdf_with_chrome(html_path, pdf_path)
    print(f"  -> Generated PDF: {pdf_path} ({pdf_path.stat().st_size // 1024} KB)")

    # 5. Audit PDF
    audit_res = audit_pdf(pdf_path, expected_pages=16)
    print(f"  -> Audit: PASS (Pages: {audit_res['pages']}, Dimensions: {audit_res['width_mm']}x{audit_res['height_mm']}mm, Hygiene: PASS)")
    return audit_res


def main():
    parser = argparse.ArgumentParser(description="Win Equipments Catalogue Build Engine")
    parser.add_argument("--slug", type=str, help="Specific product slug to build (e.g. refrigeration-air-dryer)")
    parser.add_argument("--batch1", action="store_true", help="Build Batch 1 products (Dryers & Chillers)")
    parser.add_argument("--batch2", action="store_true", help="Build Batch 2 products (Towers, Tanks, Filters, Drains)")
    parser.add_argument("--master", action="store_true", help="Build 16-page Master E-Catalogue")
    parser.add_argument("--all", action="store_true", help="Build all 10 brochures + Master E-Catalogue")
    parser.add_argument("--verify-only", type=str, help="Audit an existing PDF file")

    args = parser.parse_args()

    company, b1, b2, all_products, product_map = load_dataset()

    if args.verify_only:
        p = Path(args.verify_only)
        pages = 16 if "E_Catalogue" in p.name else 5
        res = audit_pdf(p, expected_pages=pages)
        print(f"Audit result for {p.name}: {res}")
        return

    targets = []
    build_master_flag = False

    if args.slug:
        if args.slug not in product_map:
            print(f"Error: Unknown product slug '{args.slug}'. Available slugs: {list(product_map.keys())}")
            sys.exit(1)
        targets.append(product_map[args.slug])
    elif args.batch1:
        targets.extend(b1)
    elif args.batch2:
        targets.extend(b2)
    elif args.master:
        build_master_flag = True
    elif args.all:
        targets.extend(all_products)
        build_master_flag = True
    else:
        # Default behavior: build prototype (Refrigerated Air Dryers)
        print("No target specified. Building default prototype: Refrigerated Air Dryers (refrigeration-air-dryer)")
        targets.append(product_map["refrigeration-air-dryer"])

    results = []
    for prod in targets:
        res = build_brochure(prod, company)
        results.append(res)

    if build_master_flag:
        res_m = build_master_catalogue(all_products, company)
        results.append(res_m)

    print("\n" + "=" * 70)
    print("BUILD & VERIFICATION SUMMARY REPORT")
    print("=" * 70)
    for r in results:
        print(f"  {r['pdf']:<32} | Pages: {r['pages']:<2} | {r['width_mm']}x{r['height_mm']}mm | {r['size_kb']} KB | Hygiene: {r['hygiene']}")
    print("=" * 70)
    print("All builds completed successfully!")


if __name__ == "__main__":
    main()
