#!/usr/bin/env python3
"""Standalone Fast Hygiene & Dimension CLI Scanner for Win Equipments Catalogues.

Usage:
    python3 tests/verify_hygiene.py
    python3 tests/verify_hygiene.py --verbose
    python3 tests/verify_hygiene.py --json
    python3 tests/verify_hygiene.py --cat-dir /path/to/catlogue

Exits with code 0 if all 11 catalogues pass all checks, 1 otherwise.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple
import logging

# Suppress noisy pdfminer font parsing warnings
logging.getLogger("pdfminer").setLevel(logging.ERROR)

try:
    import pdfplumber
    import pypdf
    import pypdfium2
except ImportError as exc:
    print(f"Error: Missing required testing dependencies ({exc}).")
    print("Please install pypdf, pdfplumber, and pypdfium2.")
    sys.exit(2)

# ANSI Terminal Colors
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

# Catalogues Metadata
CATALOGUES_METADATA = {
    "refrigeration air dryer.pdf": {"min_p": 4, "max_p": 6, "is_brochure": True},
    "Desiccant air dryer.pdf": {"min_p": 4, "max_p": 6, "is_brochure": True},
    "chiller.pdf": {"min_p": 4, "max_p": 6, "is_brochure": True},
    "specialized chillers.pdf": {"min_p": 4, "max_p": 6, "is_brochure": True},
    "ice flake machine.pdf": {"min_p": 4, "max_p": 6, "is_brochure": True},
    "Cooling-towers.pdf": {"min_p": 4, "max_p": 6, "is_brochure": True},
    "Coil cooling tower.pdf": {"min_p": 4, "max_p": 6, "is_brochure": True},
    "Air-Receiver.pdf": {"min_p": 4, "max_p": 6, "is_brochure": True},
    "Filters.pdf": {"min_p": 4, "max_p": 6, "is_brochure": True},
    "Automatic-Drain-Valve.pdf": {"min_p": 4, "max_p": 6, "is_brochure": True},
    "E_Catalogue.pdf": {"min_p": 12, "max_p": 16, "is_brochure": False},
}

MANDATORY_PHONES = [
    re.compile(r"\+91\s*95972\s*28969"),
    re.compile(r"\+91\s*95972\s*28975"),
]
MANDATORY_EMAIL = "info@winequipments.com"
MANDATORY_ADDR_TOKENS = ["SF No: 4", "195 B", "Kallangadu", "Arasur", "641407"]

FORBIDDEN_PATTERNS = [
    re.compile(r"95972\s*28978"),
    re.compile(r"0422[\s-]*2562975"),
    re.compile(r"(?<!\d)2562975(?!\d)"),
]


def audit_catalogue(pdf_path: Path, verbose: bool = False) -> Dict[str, Any]:
    """Perform fast, comprehensive hygiene and dimensional audit on a single PDF."""
    record: Dict[str, Any] = {
        "filename": pdf_path.name,
        "exists": pdf_path.exists(),
        "passed": False,
        "errors": [],
        "warnings": [],
        "page_count": 0,
        "dimensions": [],
        "cover_img_area_pct": 0.0,
        "contact_hygiene": {},
    }

    if not pdf_path.exists():
        record["errors"].append("File missing from disk")
        return record

    meta = CATALOGUES_METADATA.get(pdf_path.name, {"min_p": 4, "max_p": 6, "is_brochure": True})

    # 1. Page Count & Dimensions via pypdf
    try:
        reader = pypdf.PdfReader(str(pdf_path))
        record["page_count"] = len(reader.pages)
        min_p = meta["min_p"]
        max_p = meta["max_p"]

        if not (min_p <= record["page_count"] <= max_p):
            record["errors"].append(
                f"Page count violation: {record['page_count']} pages (expected {min_p}–{max_p})"
            )

        for i, page in enumerate(reader.pages, start=1):
            w_mm = float(page.mediabox.width) * 25.4 / 72.0
            h_mm = float(page.mediabox.height) * 25.4 / 72.0
            record["dimensions"].append((round(w_mm, 2), round(h_mm, 2)))
            if not (209.0 <= w_mm <= 211.0 and 296.0 <= h_mm <= 298.0):
                record["errors"].append(
                    f"Page {i} dimension out of spec: {w_mm:.1f}x{h_mm:.1f}mm (expected 210x297mm ±1mm)"
                )

        full_text = "\n".join([p.extract_text() or "" for p in reader.pages])
    except Exception as exc:
        record["errors"].append(f"pypdf read error: {exc}")
        full_text = ""

    # 2. Contact Hygiene Check
    p1_ok = bool(MANDATORY_PHONES[0].search(full_text))
    p2_ok = bool(MANDATORY_PHONES[1].search(full_text))
    email_ok = MANDATORY_EMAIL in full_text.lower()
    addr_ok = all(token.lower() in full_text.lower() for token in MANDATORY_ADDR_TOKENS)

    banned_found = []
    for pat in FORBIDDEN_PATTERNS:
        matches = pat.findall(full_text)
        if matches:
            banned_found.extend(matches)

    record["contact_hygiene"] = {
        "phone_1": p1_ok,
        "phone_2": p2_ok,
        "email": email_ok,
        "address": addr_ok,
        "banned_count": len(banned_found),
    }

    if not p1_ok:
        record["errors"].append("Missing Phone 1 (+91 95972 28969)")
    if not p2_ok:
        record["errors"].append("Missing Phone 2 (+91 95972 28975)")
    if not email_ok:
        record["errors"].append(f"Missing Email ({MANDATORY_EMAIL})")
    if not addr_ok:
        record["errors"].append("Incomplete company address")
    if banned_found:
        record["errors"].append(f"CRITICAL: Banned phone numbers detected: {banned_found}")

    # 3. Cover Photo Area via pdfplumber
    if meta["is_brochure"]:
        try:
            with pdfplumber.open(str(pdf_path)) as pdf:
                if pdf.pages:
                    p0 = pdf.pages[0]
                    p_area = float(p0.width) * float(p0.height)
                    if p_area > 0 and p0.images:
                        areas = [float(img["width"]) * float(img["height"]) for img in p0.images]
                        max_pct = (max(areas) / p_area) * 100.0
                        total_pct = (sum(areas) / p_area) * 100.0
                        effective_pct = max(max_pct, total_pct)
                        record["cover_img_area_pct"] = round(effective_pct, 1)
                        if effective_pct < 40.0:
                            record["errors"].append(
                                f"Cover photo area too small: {effective_pct:.1f}% (expected >= 40.0%)"
                            )
                    else:
                        record["errors"].append("No images detected on cover page (Page 1)")
        except Exception as exc:
            record["warnings"].append(f"pdfplumber cover inspection notice: {exc}")

    # 4. Fast Render Check via pypdfium2
    try:
        doc = pypdfium2.PdfDocument(str(pdf_path))
        for page in doc:
            img = page.render(scale=1.0).to_pil()
            if img.size[0] < 200 or img.size[1] < 200:
                record["errors"].append("Rendered page suspiciously small")
                break
    except Exception as exc:
        record["errors"].append(f"pypdfium2 rasterization failure: {exc}")

    record["passed"] = len(record["errors"]) == 0
    return record


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Verify hygiene, dimensions, and compliance of Win Equipments Catalogues."
    )
    parser.add_argument(
        "--cat-dir",
        type=Path,
        default=Path(__file__).resolve().parent.parent / "catlogue",
        help="Path to catalogue directory",
    )
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose per-page diagnostic output")
    parser.add_argument("--json", action="store_true", help="Output machine-readable JSON report")

    args = parser.parse_args()
    cat_dir = args.cat_dir

    if not cat_dir.exists():
        print(f"{RED}Error: Catalogue directory not found: {cat_dir}{RESET}")
        return 1

    results = []
    total_files = len(CATALOGUES_METADATA)
    passed_files = 0

    print(f"\n{BOLD}{CYAN}=== Win Equipments Catalogues Hygiene & Compliance Audit ==={RESET}")
    print(f"Scanning target directory: {cat_dir}\n")

    for filename in sorted(CATALOGUES_METADATA.keys()):
        pdf_path = cat_dir / filename
        res = audit_catalogue(pdf_path, verbose=args.verbose)
        results.append(res)
        if res["passed"]:
            passed_files += 1

    if args.json:
        print(json.dumps(results, indent=2))
        return 0 if passed_files == total_files else 1

    # Formatted terminal display
    header = f"{'Catalogue File':<35} | {'Pages':<8} | {'Cover %':<9} | {'Hygiene':<9} | {'Status':<10}"
    print(header)
    print("-" * len(header))

    for r in results:
        fname = r["filename"]
        pages_str = str(r["page_count"])
        cover_str = f"{r['cover_img_area_pct']}%" if r["cover_img_area_pct"] > 0 else "N/A"
        
        hyg = r["contact_hygiene"]
        hyg_ok = hyg.get("phone_1", False) and hyg.get("phone_2", False) and hyg.get("banned_count", 0) == 0
        hyg_str = f"{GREEN}OK{RESET}" if hyg_ok else f"{RED}FAIL{RESET}"

        status_str = f"{GREEN}{BOLD}PASS{RESET}" if r["passed"] else f"{RED}{BOLD}FAIL{RESET}"
        print(f"{fname:<35} | {pages_str:<8} | {cover_str:<9} | {hyg_str:<18} | {status_str}")

        if args.verbose or not r["passed"]:
            for err in r["errors"]:
                print(f"  {RED}↳ ERROR: {err}{RESET}")
            for warn in r["warnings"]:
                print(f"  {YELLOW}↳ WARN:  {warn}{RESET}")

    print("\n" + "=" * 60)
    summary_color = GREEN if passed_files == total_files else RED
    print(
        f"{BOLD}Summary: {summary_color}{passed_files}/{total_files} Catalogues Fully Compliant{RESET} "
        f"({(passed_files / total_files) * 100:.1f}%)"
    )
    print("=" * 60 + "\n")

    return 0 if passed_files == total_files else 1


if __name__ == "__main__":
    sys.exit(main())
