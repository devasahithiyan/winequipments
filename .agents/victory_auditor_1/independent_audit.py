#!/usr/bin/env python3
"""
Independent Victory Audit Script
Executed by Victory Auditor with zero shared context.
Directly inspects PDF binaries, page structures, text streams, images, and metadata.
"""

import os
import re
import sys
import json
import hashlib
from pathlib import Path
import pypdf
import pdfplumber
import pypdfium2

WORKSPACE_DIR = Path("/Users/devasahithiyan/Desktop/Win equipments")
CATLOGUE_DIR = WORKSPACE_DIR / "catlogue"

TARGET_BROCHURES = [
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
TARGET_MASTER = "E_Catalogue.pdf"
ALL_11_TARGETS = TARGET_BROCHURES + [TARGET_MASTER]

REQUIRED_CONTACT_TOKENS = [
    "+91 95972 28969",
    "+91 95972 28975",
    "info@winequipments.com",
    "SF No: 4, 195 B, Kallangadu",
    "Arasur",
    "641407"
]

FORBIDDEN_NUMBERS = [
    "9597228978",
    "0422-2562975",
    "2562975",
]

SPEC_EXPECTATIONS = {
    "refrigeration air dryer.pdf": {
        "model": "WRD",
        "capacity": ["CFM", "m³/hr", "m3/hr"],
        "power": ["kW", "HP"],
        "range": ["bar", "°C", "+3°C"]
    },
    "Desiccant air dryer.pdf": {
        "model": "WHD",
        "capacity": ["CFM", "m³/hr", "m3/hr"],
        "power": ["kW", "W"],
        "range": ["bar", "°C", "-40°C"]
    },
    "chiller.pdf": {
        "model": "WCP",
        "capacity": ["TR", "kcal/hr", "LPM"],
        "power": ["kW", "HP"],
        "range": ["°C", "bar"]
    },
    "specialized chillers.pdf": {
        "model": ["WAN", "WMS", "WAC"],
        "capacity": ["TR", "LPM"],
        "power": ["kW", "HP"],
        "range": ["°C", "bar"]
    },
    "ice flake machine.pdf": {
        "model": "WFI",
        "capacity": ["TPD", "kg/24hr", "kg/day"],
        "power": ["kW", "HP"],
        "range": ["°C", "bar"]
    },
    "Cooling-towers.pdf": {
        "model": ["WCT-RL", "WCT-SL", "WCT"],
        "capacity": ["TR", "m³/hr", "LPM"],
        "power": ["kW", "HP"],
        "range": ["°C"]
    },
    "Coil cooling tower.pdf": {
        "model": "WCC",
        "capacity": ["TR", "m³/hr", "LPM"],
        "power": ["kW", "HP"],
        "range": ["°C"]
    },
    "Air-Receiver.pdf": {
        "model": "WRV",
        "capacity": ["Liters", "Litre", "m³", "L"],
        "power": ["bar", "Design Pressure"], # Air receiver power relates to pressure design
        "range": ["bar", "°C"]
    },
    "Filters.pdf": {
        "model": "WMF",
        "capacity": ["CFM", "m³/hr"],
        "power": ["micron", "Grade"],
        "range": ["bar", "°C"]
    },
    "Automatic-Drain-Valve.pdf": {
        "model": "WADV",
        "capacity": ["bar", "interval", "discharge"],
        "power": ["V", "VAC", "W", "kW"],
        "range": ["bar", "°C"]
    },
}

def audit_all():
    report = {
        "summary": {},
        "files": {},
        "failures": []
    }

    print("=== STARTING INDEPENDENT VICTORY AUDIT ===")
    
    # 1. Existence and basic stats
    for fname in ALL_11_TARGETS:
        fpath = CATLOGUE_DIR / fname
        if not fpath.exists():
            report["failures"].append(f"Missing file: {fname}")
            print(f"[FAIL] Missing {fname}")
            continue

        file_size = fpath.stat().st_size
        reader = pypdf.PdfReader(str(fpath))
        num_pages = len(reader.pages)
        meta = reader.metadata

        producer = meta.get("/Producer", "UNKNOWN") if meta else "UNKNOWN"
        creator = meta.get("/Creator", "UNKNOWN") if meta else "UNKNOWN"
        creation_date = str(meta.get("/CreationDate", "UNKNOWN")) if meta else "UNKNOWN"

        is_master = (fname == TARGET_MASTER)
        expected_pages = "12-16" if is_master else "4-6"
        valid_pages = (12 <= num_pages <= 16) if is_master else (4 <= num_pages <= 6)

        if not valid_pages:
            report["failures"].append(f"Page count violation in {fname}: got {num_pages}, expected {expected_pages}")

        # Check A4 Mediabox dimensions on every page
        dim_ok = True
        for i, page in enumerate(reader.pages):
            w_mm = float(page.mediabox.width) * 25.4 / 72.0
            h_mm = float(page.mediabox.height) * 25.4 / 72.0
            if not (208.5 <= w_mm <= 211.5 and 295.5 <= h_mm <= 298.5):
                dim_ok = False
                report["failures"].append(f"Dimension violation in {fname} page {i+1}: {w_mm:.2f}x{h_mm:.2f}mm")

        # Check contact hygiene across entire text
        all_text = ""
        page_texts = []
        for i, page in enumerate(reader.pages):
            t = page.extract_text() or ""
            page_texts.append(t)
            all_text += "\n" + t

        banned_found = []
        for b in FORBIDDEN_NUMBERS:
            if b in all_text:
                banned_found.append(b)
                report["failures"].append(f"BANNED NUMBER FOUND in {fname}: {b}")

        req_missing = []
        for r in REQUIRED_CONTACT_TOKENS:
            if r not in all_text:
                req_missing.append(r)
                report["failures"].append(f"REQUIRED CONTACT MISSING in {fname}: {r}")

        # Running footer check: Every page must have "Win Equipments" and page number
        footer_ok = True
        for i, t in enumerate(page_texts):
            # Page number i+1 should be in page text
            has_company = ("Win Equipments" in t or "WIN EQUIPMENTS" in t)
            # Check for page number in text (e.g. "Page 1", "01", "1 of", etc.)
            has_pg = bool(re.search(rf"\b0?{i+1}\b", t) or f"Page {i+1}" in t)
            if not (has_company and has_pg):
                footer_ok = False
                report["failures"].append(f"Footer check failed in {fname} page {i+1}: company={has_company}, page_num={has_pg}")

        # Cover photo area calculation via pdfplumber
        cover_pct = 0.0
        with pdfplumber.open(str(fpath)) as plumb:
            p0 = plumb.pages[0]
            page_area = float(p0.width) * float(p0.height)
            images = p0.images
            if images:
                # Find the maximum image area on cover
                max_img_area = 0.0
                for img in images:
                    img_w = float(img.get("width", 0))
                    img_h = float(img.get("height", 0))
                    area = img_w * img_h
                    if area > max_img_area:
                        max_img_area = area
                cover_pct = (max_img_area / page_area) * 100.0

        if not is_master and cover_pct < 40.0:
            report["failures"].append(f"Cover photo area below 40% in {fname}: {cover_pct:.1f}%")

        # Specifications & Content sections check
        specs_ok = True
        if fname in SPEC_EXPECTATIONS:
            exp = SPEC_EXPECTATIONS[fname]
            # model check
            m_list = exp["model"] if isinstance(exp["model"], list) else [exp["model"]]
            if not any(m in all_text for m in m_list):
                specs_ok = False
                report["failures"].append(f"Model code {m_list} missing in {fname}")
            
            # capacity check
            c_list = exp["capacity"] if isinstance(exp["capacity"], list) else [exp["capacity"]]
            if not any(c in all_text for c in c_list):
                specs_ok = False
                report["failures"].append(f"Capacity terms {c_list} missing in {fname}")

            # power check
            p_list = exp["power"] if isinstance(exp["power"], list) else [exp["power"]]
            if not any(p in all_text for p in p_list):
                specs_ok = False
                report["failures"].append(f"Power terms {p_list} missing in {fname}")

            # range check
            r_list = exp["range"] if isinstance(exp["range"], list) else [exp["range"]]
            if not any(r in all_text for r in r_list):
                specs_ok = False
                report["failures"].append(f"Range terms {r_list} missing in {fname}")

        # QR code check: check if winequipments.com URL is present
        has_url = ("winequipments.com" in all_text)
        if not has_url:
            report["failures"].append(f"winequipments.com URL missing from text in {fname}")

        # Render test via pypdfium2: ensure no rendering crash on any page
        render_ok = True
        try:
            pdf_ium = pypdfium2.PdfDocument(str(fpath))
            for p_idx in range(len(pdf_ium)):
                page = pdf_ium[p_idx]
                bitmap = page.render(scale=1.0)
                pil_img = bitmap.to_pil()
                if pil_img.size[0] <= 0 or pil_img.size[1] <= 0:
                    render_ok = False
        except Exception as e:
            render_ok = False
            report["failures"].append(f"pypdfium2 render error in {fname}: {e}")

        status = "PASS" if (
            valid_pages and dim_ok and not banned_found and not req_missing and
            footer_ok and (is_master or cover_pct >= 40.0) and specs_ok and render_ok
        ) else "FAIL"

        report["files"][fname] = {
            "size_kb": round(file_size / 1024, 1),
            "pages": num_pages,
            "producer": producer,
            "creator": creator,
            "creation_date": creation_date,
            "cover_pct": round(cover_pct, 1),
            "banned_found": banned_found,
            "req_missing": req_missing,
            "footer_ok": footer_ok,
            "specs_ok": specs_ok,
            "render_ok": render_ok,
            "status": status
        }

        print(f"[{status}] {fname:<30} | Pgs: {num_pages:2d} | Cover: {cover_pct:4.1f}% | Size: {file_size//1024:4d} KB | Producer: {producer}")

    # Check asset ice-flake-machine.jpg hash
    img_path = WORKSPACE_DIR / "images" / "Products" / "ice-flake-machine.jpg"
    img_exists = img_path.exists()
    img_md5 = ""
    if img_exists:
        with open(img_path, "rb") as f:
            img_md5 = hashlib.md5(f.read()).hexdigest()
    report["asset_check"] = {
        "ice_flake_machine_exists": img_exists,
        "md5": img_md5,
        "expected_md5": "e8fd7c06b68a0ffd6825df091edcb352",
        "matches": (img_md5 == "e8fd7c06b68a0ffd6825df091edcb352")
    }

    report["verdict"] = "CLEAN / VICTORY CONFIRMED" if len(report["failures"]) == 0 else "VICTORY REJECTED"
    print(f"\nAUDIT VERDICT: {report['verdict']}")
    if report["failures"]:
        print("FAILURES DETECTED:")
        for fail in report["failures"]:
            print(f"  - {fail}")

    with open(WORKSPACE_DIR / ".agents" / "victory_auditor_1" / "independent_audit_results.json", "w") as f:
        json.dump(report, f, indent=2)

    return report

if __name__ == "__main__":
    audit_all()
