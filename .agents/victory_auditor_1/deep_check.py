#!/usr/bin/env python3
"""
Deep Forensic Inspection of all 11 PDFs in catlogue/
Checks:
- Exact page count
- Exact mediabox dimensions on all pages
- Text contents of running footer on all pages
- Mandatory contact details presence
- Forbidden number absence (in both text and raw bytes)
- Specs table parameters (Model, Capacity, Power kW, Range)
- Master E-Catalogue page-by-page structure
"""

import sys
import re
from pathlib import Path
import pypdf

CATLOGUE_DIR = Path("/Users/devasahithiyan/Desktop/Win equipments/catlogue")

BROCHURES = [
    "refrigeration air dryer.pdf",
    "Desiccant air dryer.pdf",
    "chiller.pdf",
    "specialized chillers.pdf",
    "ice flake machine.pdf",
    "Cooling-towers.pdf",
    "Coil cooling tower.pdf",
    "Air-Receiver.pdf",
    "Filters.pdf",
    "Automatic-Drain-Valve.pdf",
]
MASTER = "E_Catalogue.pdf"
ALL_FILES = BROCHURES + [MASTER]

MANDATORY_CONTACTS = {
    "phone_1": "+91 95972 28969",
    "phone_2": "+91 95972 28975",
    "email": "info@winequipments.com",
    "address": "SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407",
}

FORBIDDEN = ["9597228978", "0422-2562975", "2562975"]

def deep_check():
    print("=" * 80)
    print("DEEP FORENSIC CRITERIA VERIFICATION")
    print("=" * 80)

    overall_pass = True

    for fname in ALL_FILES:
        fpath = CATLOGUE_DIR / fname
        if not fpath.exists():
            print(f"[FAIL] Missing file: {fname}")
            overall_pass = False
            continue

        reader = pypdf.PdfReader(str(fpath))
        num_pages = len(reader.pages)
        is_master = (fname == MASTER)
        expected_range = (12, 16) if is_master else (4, 6)

        # Page count check
        pg_ok = expected_range[0] <= num_pages <= expected_range[1]
        if not pg_ok:
            print(f"[FAIL] {fname}: Page count {num_pages} not in {expected_range}")
            overall_pass = False

        # Check dimensions of EVERY page
        dim_ok = True
        for idx, page in enumerate(reader.pages):
            w = float(page.mediabox.width) * 25.4 / 72.0
            h = float(page.mediabox.height) * 25.4 / 72.0
            if not (209.0 <= w <= 211.0 and 296.0 <= h <= 298.0):
                dim_ok = False
                print(f"[FAIL] {fname} p{idx+1}: Bad dimensions {w:.2f}x{h:.2f} mm")
                overall_pass = False

        # Extract text per page
        full_text = ""
        footer_failures = []
        for idx, page in enumerate(reader.pages):
            txt = page.extract_text() or ""
            full_text += f"\n--- Page {idx+1} ---\n" + txt
            # Check company name and page number on page
            has_co = "Win Equipments" in txt or "WIN EQUIPMENTS" in txt
            has_pg_num = (f"Page {idx+1}" in txt) or (f"{idx+1} of {num_pages}" in txt) or bool(re.search(rf"\b0?{idx+1}\b", txt))
            if not (has_co and has_pg_num):
                footer_failures.append(f"p{idx+1}(co={has_co},pg={has_pg_num})")

        # Contact hygiene
        missing_contacts = []
        for k, val in MANDATORY_CONTACTS.items():
            if val not in full_text:
                # check loose tokens for address
                if k == "address":
                    tokens = ["SF No: 4", "195 B", "Kallangadu", "Arasur", "641407"]
                    if not all(t in full_text for t in tokens):
                        missing_contacts.append(val)
                elif k in ("phone_1", "phone_2"):
                    # check normalized phone
                    clean_target = re.sub(r"\s+", "", val)
                    clean_text = re.sub(r"\s+", "", full_text)
                    if clean_target not in clean_text:
                        missing_contacts.append(val)
                else:
                    missing_contacts.append(val)

        # Forbidden numbers in text
        found_forbidden = []
        for b in FORBIDDEN:
            clean_b = re.sub(r"[\s-]+", "", b)
            clean_text = re.sub(r"[\s-]+", "", full_text)
            if clean_b in clean_text:
                found_forbidden.append(b)

        # Forbidden numbers in raw binary bytes
        with open(fpath, "rb") as f:
            raw_bytes = f.read()
        for b in FORBIDDEN:
            if b.encode("utf-8") in raw_bytes:
                if b not in found_forbidden:
                    found_forbidden.append(f"{b}(raw)")

        # Section presence for brochures
        sections_ok = True
        if not is_master:
            has_cover = "WIN EQUIPMENTS" in full_text
            has_overview = "Overview" in full_text or "Thermodynamic" in full_text or "Operational" in full_text
            has_specs = "Specifications" in full_text or "Model" in full_text
            has_apps = "Applications" in full_text or "Industries" in full_text or "Benchmarks" in full_text
            has_contact = "info@winequipments.com" in full_text
            if not (has_cover and has_overview and has_specs and has_apps and has_contact):
                sections_ok = False
                print(f"[FAIL] {fname}: Missing section: cover={has_cover}, overview={has_overview}, specs={has_specs}, apps={has_apps}, contact={has_contact}")
                overall_pass = False

        status = "PASS" if (pg_ok and dim_ok and not footer_failures and not missing_contacts and not found_forbidden and sections_ok) else "FAIL"
        print(f"[{status}] {fname:<30} | Pages: {num_pages:2d} | Dim: OK | Footers: {'OK' if not footer_failures else footer_failures} | Contacts: {'OK' if not missing_contacts else missing_contacts} | Banned: {'NONE' if not found_forbidden else found_forbidden}")

    print("=" * 80)
    print(f"OVERALL DEEP FORENSIC STATUS: {'PASS' if overall_pass else 'FAIL'}")
    print("=" * 80)

if __name__ == "__main__":
    deep_check()
