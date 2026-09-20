"""End-to-End Test Suite for Win Equipments Publication-Grade Catalogues.

Authoritative source: ORIGINAL_REQUEST.md, PROJECT.md, and Survey Reports 1-3.
Architecture: 4-Tier progressive testing methodology.
Test Philosophy: Opaque-box verification against physical PDF artifacts.
"""

from __future__ import annotations

import os
import re
import sys
import logging
from pathlib import Path
from typing import Any, Dict, List, Tuple

# Suppress noisy pdfminer font parsing warnings
logging.getLogger("pdfminer").setLevel(logging.ERROR)
logging.getLogger("pypdf").setLevel(logging.ERROR)

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import pdfplumber
import pypdf
import pypdfium2
import pytest

from tests.conftest import (
    ALL_CATALOGUE_FILENAMES,
    CATALOGUES_SPEC,
    COMPANY_STANDARDS,
    FORBIDDEN_NUMBERS,
    FORBIDDEN_PATTERNS,
    INDIVIDUAL_BROCHURE_FILENAMES,
    MASTER_CATALOGUE_FILENAME,
    check_pdf_rendering_pypdfium2,
    extract_pdf_pages_text,
    extract_pdf_text_pypdf,
    get_catalogue_path,
    get_cover_image_metrics,
    get_page_dimensions_mm,
)


# ==============================================================================
# TIER 1: FEATURE COVERAGE
# ==============================================================================

class TestTier1FeatureCoverage:
    """Tier 1: Basic structural integrity, page counts, A4 dimensions, footer, and contact hygiene."""

    def test_tier1_all_11_catalogues_exist(self, catalogue_filename: str) -> None:
        """Requirement R1, R2: All 11 publication-grade PDFs must exist in catlogue/."""
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), (
            f"Mandatory catalogue file missing from disk: {pdf_path.name}\n"
            f"Expected location: {pdf_path}\n"
            f"Reference: ORIGINAL_REQUEST.md § Requirements R1 & R2"
        )
        assert pdf_path.stat().st_size > 10_000, (
            f"Catalogue file is suspiciously small or corrupted ({pdf_path.stat().st_size} bytes): {pdf_path.name}"
        )

    def test_tier1_individual_brochures_page_count(self, individual_brochure_filename: str) -> None:
        """Requirement R1: Each individual brochure must be 4–6 pages A4 PDF.
        
        Legacy brochures with only 2 pages must strictly FAIL this test.
        """
        pdf_path = get_catalogue_path(individual_brochure_filename)
        assert pdf_path.exists(), f"File {individual_brochure_filename} does not exist"
        
        reader = pypdf.PdfReader(str(pdf_path))
        page_count = len(reader.pages)
        spec = CATALOGUES_SPEC[individual_brochure_filename]
        min_p = spec["min_pages"]
        max_p = spec["max_pages"]

        assert min_p <= page_count <= max_p, (
            f"Page count violation in {individual_brochure_filename}: "
            f"found {page_count} pages, expected {min_p}–{max_p} pages.\n"
            f"(2-page brochures are non-compliant legacy drafts requiring expansion to "
            f"Cover, Overview, Specs, Applications, Contact & QR).\n"
            f"Reference: ORIGINAL_REQUEST.md § R1. Individual Product Brochures (10 PDFs)"
        )

    def test_tier1_master_catalogue_page_count(self, master_catalogue_filename: str) -> None:
        """Requirement R2: Master E-Catalogue must be 12–16 pages."""
        pdf_path = get_catalogue_path(master_catalogue_filename)
        assert pdf_path.exists(), f"File {master_catalogue_filename} does not exist"
        
        reader = pypdf.PdfReader(str(pdf_path))
        page_count = len(reader.pages)
        spec = CATALOGUES_SPEC[master_catalogue_filename]
        min_p = spec["min_pages"]
        max_p = spec["max_pages"]

        assert min_p <= page_count <= max_p, (
            f"Page count violation in Master E-Catalogue ({master_catalogue_filename}): "
            f"found {page_count} pages, expected {min_p}–{max_p} pages.\n"
            f"Reference: ORIGINAL_REQUEST.md § R2. Master E-Catalogue (1 PDF)"
        )

    def test_tier1_pdf_a4_dimensions(self, catalogue_filename: str) -> None:
        """Requirement R3: All pages must strictly conform to ISO A4 dimensions (210mm × 297mm ± 1mm)."""
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), f"File {catalogue_filename} does not exist"
        
        dimensions = get_page_dimensions_mm(pdf_path)
        target_w = COMPANY_STANDARDS["a4_width_mm"]
        target_h = COMPANY_STANDARDS["a4_height_mm"]
        tol = COMPANY_STANDARDS["a4_tolerance_mm"]

        for idx, (w, h) in enumerate(dimensions, start=1):
            assert (target_w - tol) <= w <= (target_w + tol), (
                f"Page {idx} of {catalogue_filename} has invalid width: {w:.2f}mm. "
                f"Expected A4 width: {target_w}mm ± {tol}mm."
            )
            assert (target_h - tol) <= h <= (target_h + tol), (
                f"Page {idx} of {catalogue_filename} has invalid height: {h:.2f}mm. "
                f"Expected A4 height: {target_h}mm ± {tol}mm."
            )

    def test_tier1_footer_company_and_page_number(self, catalogue_filename: str) -> None:
        """Requirement R3: Every inner/applicable page must include company name and page number in footer."""
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), f"File {catalogue_filename} does not exist"
        
        pages_text = extract_pdf_pages_text(pdf_path)
        # Inner pages (page 2 onwards) must have running footer with company name
        company_name_pattern = re.compile(r"Win\s*Equipments", re.IGNORECASE)
        page_num_pattern = re.compile(r"(page\s*\d+|\d+\s*of\s*\d+|\b\d+\b)", re.IGNORECASE)

        for page_idx, text in enumerate(pages_text, start=1):
            if page_idx == 1:
                # Cover page may have brand title rather than running footer
                continue
            assert company_name_pattern.search(text), (
                f"Page {page_idx} of {catalogue_filename} missing company name in footer.\n"
                f"Extracted page text:\n{text[:200]}..."
            )
            assert page_num_pattern.search(text), (
                f"Page {page_idx} of {catalogue_filename} missing page number indication."
            )

    def test_tier1_contact_hygiene_required_info(self, catalogue_filename: str) -> None:
        """Requirement R4: Every PDF must contain both mandatory phone numbers, email, and company address."""
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), f"File {catalogue_filename} does not exist"
        
        full_text = extract_pdf_text_pypdf(pdf_path)

        # Phone 1: +91 95972 28969
        phone1_pattern = COMPANY_STANDARDS["phone_patterns"][0]
        assert phone1_pattern.search(full_text), (
            f"Mandatory phone number '+91 95972 28969' missing in {catalogue_filename}.\n"
            f"Reference: ORIGINAL_REQUEST.md § R4. Contact Hygiene"
        )

        # Phone 2: +91 95972 28975
        phone2_pattern = COMPANY_STANDARDS["phone_patterns"][1]
        assert phone2_pattern.search(full_text), (
            f"Mandatory phone number '+91 95972 28975' missing in {catalogue_filename}.\n"
            f"Reference: ORIGINAL_REQUEST.md § R4. Contact Hygiene"
        )

        # Mandatory email: info@winequipments.com
        assert COMPANY_STANDARDS["email"] in full_text.lower(), (
            f"Mandatory email 'info@winequipments.com' missing in {catalogue_filename}."
        )

        # Mandatory address tokens
        for token in COMPANY_STANDARDS["address_tokens"]:
            assert token.lower() in full_text.lower(), (
                f"Mandatory address token '{token}' missing from contact block in {catalogue_filename}."
            )


# ==============================================================================
# TIER 2: BOUNDARY & CORNER CASES
# ==============================================================================

class TestTier2BoundaryAndCornerCases:
    """Tier 2: Print-first styling, typography hierarchy, cover hero image area >= 40%, table styling."""

    def test_tier2_no_browser_scrollbars_or_web_artifacts(self, catalogue_filename: str) -> None:
        """Requirement R3: No web layout artefacts (no scrollbars, no default browser headers/footers)."""
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), f"File {catalogue_filename} does not exist"
        
        full_text = extract_pdf_text_pypdf(pdf_path)

        # Check for browser default print header/footer artifacts
        forbidden_web_tokens = [
            "file:///",
            "localhost:",
            "about:blank",
            "127.0.0.1",
            "chrome://",
            "scroll to view",
        ]
        for token in forbidden_web_tokens:
            assert token not in full_text.lower(), (
                f"Detected browser print chrome artifact '{token}' in {catalogue_filename}!\n"
                f"Headless Chrome must be invoked with --no-pdf-header-footer."
            )

    def test_tier2_no_px_font_sizes_or_web_artefacts(self, catalogue_filename: str) -> None:
        """Requirement R3: No px-based font sizes or raw web markup leaked into output streams."""
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), f"File {catalogue_filename} does not exist"
        
        full_text = extract_pdf_text_pypdf(pdf_path)
        # Check that raw CSS or HTML tags are not accidentally rendered as visible text
        raw_code_patterns = [
            r"<!DOCTYPE\s+html",
            r"<style\b",
            r"@media\s+print",
            r"font-size:\s*\d+px",
            r"overflow:\s*hidden",
        ]
        for pat in raw_code_patterns:
            assert not re.search(pat, full_text, re.IGNORECASE), (
                f"Leaked raw CSS/HTML markup detected in PDF text layer: {pat} in {catalogue_filename}"
            )

    def test_tier2_typography_font_size_hierarchy(self, catalogue_filename: str) -> None:
        """Requirement R3: Typography hierarchy: body font >= 9pt, heading font >= 18pt."""
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), f"File {catalogue_filename} does not exist"
        
        with pdfplumber.open(str(pdf_path)) as pdf:
            all_font_sizes = []
            for page in pdf.pages:
                for char in page.chars:
                    sz = char.get("size")
                    if sz and isinstance(sz, (int, float)):
                        all_font_sizes.append(sz)
            
            assert all_font_sizes, f"No extractable character font metadata found in {catalogue_filename}"
            
            max_font_size = max(all_font_sizes)
            assert max_font_size >= COMPANY_STANDARDS["min_heading_font_pt"], (
                f"Heading font size requirement not met in {catalogue_filename}: "
                f"max font size found is {max_font_size:.1f}pt, expected at least "
                f"{COMPANY_STANDARDS['min_heading_font_pt']}pt for publication headings."
            )

            # Check that majority of body text characters have size >= 9pt
            # Footers/captions may be ~7-8pt, so we verify that the 75th percentile (main text) is >= 9pt
            all_font_sizes.sort()
            p75 = all_font_sizes[int(len(all_font_sizes) * 0.75)]
            assert p75 >= COMPANY_STANDARDS["min_body_font_pt"], (
                f"Body typography too small in {catalogue_filename}: 75th percentile font size is {p75:.1f}pt, "
                f"expected >= {COMPANY_STANDARDS['min_body_font_pt']}pt. "
                f"Reference: ORIGINAL_REQUEST.md § R3"
            )

    def test_tier2_cover_photo_area_coverage(self, individual_brochure_filename: str) -> None:
        """Acceptance Criteria: Cover page of each brochure has a product photo occupying >= 40% of the page area."""
        pdf_path = get_catalogue_path(individual_brochure_filename)
        assert pdf_path.exists(), f"File {individual_brochure_filename} does not exist"
        
        metrics = get_cover_image_metrics(pdf_path)
        min_pct = COMPANY_STANDARDS["min_cover_image_area_pct"]
        max_img_pct = metrics["max_image_area_pct"]
        total_img_pct = metrics["total_image_area_pct"]

        # If a single hero image or composite hero image covers >= 40%
        effective_pct = max(max_img_pct, total_img_pct)
        assert effective_pct >= min_pct, (
            f"Cover photo area violation in {individual_brochure_filename}: "
            f"Hero image occupies {effective_pct:.1f}% of page area, expected >= {min_pct}%.\n"
            f"Reference: ORIGINAL_REQUEST.md § Acceptance Criteria: "
            f"'Cover page of each brochure has a product photo occupying ≥ 40% of the page area'."
        )

    def test_tier2_table_formatting_and_borders(self, catalogue_filename: str) -> None:
        """Requirement R3: Tables must have proper borders and alternating row shading."""
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), f"File {catalogue_filename} does not exist"
        
        with pdfplumber.open(str(pdf_path)) as pdf:
            total_rects = sum(len(page.rects) for page in pdf.pages)
            total_lines = sum(len(page.lines) for page in pdf.pages)
            
            # Formatted publication brochures with alternating row fills and borders
            # have numerous vector rectangle and line objects
            assert (total_rects + total_lines) >= 5, (
                f"Lack of vector table formatting or row shading in {catalogue_filename}: "
                f"found only {total_rects} rects and {total_lines} lines across {len(pdf.pages)} pages.\n"
                f"Expected publication-grade tables with alternating shading and crisp borders."
            )


# ==============================================================================
# TIER 3: CROSS-FEATURE COMBINATIONS
# ==============================================================================

class TestTier3CrossFeatureCombinations:
    """Tier 3: Model codes, engineering capacities, electrical ratings, temperature ranges, QR routing."""

    def test_tier3_model_code_presence(self, catalogue_filename: str) -> None:
        """Survey Report 3 & R1: Document must declare authoritative model series codes."""
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), f"File {catalogue_filename} does not exist"
        
        full_text = extract_pdf_text_pypdf(pdf_path)
        spec = CATALOGUES_SPEC[catalogue_filename]
        model_series = spec["model_series"]

        found = [code for code in model_series if code in full_text]
        assert len(found) > 0, (
            f"Model series code missing in {catalogue_filename}: "
            f"expected at least one of {model_series}, none found in text."
        )

    def test_tier3_capacity_and_flow_rate_specs(self, catalogue_filename: str) -> None:
        """R1 & Survey 3: Specs table must include capacity/flow rate units (CFM, m³/hr, TR, LPM, TPD, Liters)."""
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), f"File {catalogue_filename} does not exist"
        
        full_text = extract_pdf_text_pypdf(pdf_path)
        capacity_units = ["CFM", "m³/hr", "m3/hr", "TR", "LPM", "TPD", "Liters", "Litres", "Ton"]
        
        matched_units = [u for u in capacity_units if re.search(r"\b" + re.escape(u) + r"\b", full_text, re.IGNORECASE)]
        assert len(matched_units) >= 1, (
            f"Capacity / flow rate specifications missing in {catalogue_filename}: "
            f"expected capacity unit from {capacity_units}, found none."
        )

    def test_tier3_power_specifications(self, catalogue_filename: str) -> None:
        """R1 & Survey 3: Technical specifications must specify power ratings in kW or HP."""
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), f"File {catalogue_filename} does not exist"
        
        full_text = extract_pdf_text_pypdf(pdf_path)
        # Power metrics (kW, HP, Watts)
        power_pattern = re.compile(r"\b(\d+(\.\d+)?\s*(kW|HP|W)|Power)\b", re.IGNORECASE)
        assert power_pattern.search(full_text), (
            f"Power rating specifications (kW/HP) missing in technical tables of {catalogue_filename}."
        )

    def test_tier3_operating_ranges(self, catalogue_filename: str) -> None:
        """R1 & Survey 3: Technical specifications must state operating pressure and/or temperature ranges."""
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), f"File {catalogue_filename} does not exist"
        
        full_text = extract_pdf_text_pypdf(pdf_path)
        # Pressure (bar, psi) or temperature (°C)
        pressure_or_temp = re.compile(r"(bar|\bpsi\b|°C|deg\s*C|pressure|temperature)", re.IGNORECASE)
        assert pressure_or_temp.search(full_text), (
            f"Operating pressure or temperature specifications missing in {catalogue_filename}."
        )

    def test_tier3_qr_code_destination_urls(self, catalogue_filename: str) -> None:
        """Requirement R1: Back cover QR code and link must target canonical winequipments.com URL."""
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), f"File {catalogue_filename} does not exist"
        
        full_text = extract_pdf_text_pypdf(pdf_path)
        spec = CATALOGUES_SPEC[catalogue_filename]
        url_pattern = spec["url_pattern"]

        assert url_pattern.search(full_text) or "winequipments.com" in full_text, (
            f"Canonical URL or QR code routing missing in {catalogue_filename}.\n"
            f"Expected destination pattern: {url_pattern.pattern}"
        )


# ==============================================================================
# TIER 4: REAL-WORLD ACCEPTANCE WORKLOADS
# ==============================================================================

class TestTier4RealWorldAcceptance:
    """Tier 4: High-DPI pypdfium2 rasterization, text extractability, zero banned numbers."""

    def test_tier4_pypdfium2_rendering_integrity(self, catalogue_filename: str) -> None:
        """Acceptance Criteria: All 11 PDFs open and render correctly without rasterization errors."""
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), f"File {catalogue_filename} does not exist"
        
        try:
            render_results = check_pdf_rendering_pypdfium2(pdf_path, dpi=150)
        except Exception as exc:
            pytest.fail(f"pypdfium2 failed to render {catalogue_filename}: {exc}")

        assert len(render_results) > 0, f"No pages rendered for {catalogue_filename}"
        for res in render_results:
            p_num = res["page_num"]
            assert res["width_px"] > 500, f"Page {p_num} rendered width too small: {res['width_px']}px"
            assert res["height_px"] > 500, f"Page {p_num} rendered height too small: {res['height_px']}px"
            assert not res["is_blank"], (
                f"Page {p_num} of {catalogue_filename} rendered as completely blank!"
            )

    def test_tier4_text_extractability(self, catalogue_filename: str) -> None:
        """Acceptance Criteria: Text extractability across all pages (no unmapped glyphs/empty layers)."""
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), f"File {catalogue_filename} does not exist"
        
        pages_text = extract_pdf_pages_text(pdf_path)
        assert len(pages_text) > 0, f"No pages extracted from {catalogue_filename}"

        for idx, text in enumerate(pages_text, start=1):
            assert len(text.strip()) >= 50, (
                f"Page {idx} of {catalogue_filename} has fewer than 50 extractable characters.\n"
                f"All publication pages must contain searchable, extractable vector text."
            )

    def test_tier4_strict_banned_numbers_zero_tolerance(self, catalogue_filename: str) -> None:
        """Requirement R4: Zero tolerance for banned phone numbers (9597228978, 2562975).
        
        Must return exactly 0 occurrences across all text streams and raw binary streams.
        """
        pdf_path = get_catalogue_path(catalogue_filename)
        assert pdf_path.exists(), f"File {catalogue_filename} does not exist"
        
        full_text = extract_pdf_text_pypdf(pdf_path)

        for pat in FORBIDDEN_PATTERNS:
            matches = pat.findall(full_text)
            assert len(matches) == 0, (
                f"CRITICAL HYGIENE BREACH: Banned contact number detected in {catalogue_filename}!\n"
                f"Matched pattern: {pat.pattern}\n"
                f"Matches found: {matches}\n"
                f"Reference: ORIGINAL_REQUEST.md § R4. Contact Hygiene: "
                f"'Zero occurrences of banned numbers 9597228978 or 2562975 in any PDF'."
            )

        # Also search raw binary bytes for unencoded raw occurrences
        raw_bytes = pdf_path.read_bytes()
        for banned in ["9597228978", "2562975"]:
            assert banned.encode("utf-8") not in raw_bytes, (
                f"CRITICAL HYGIENE BREACH: Banned number {banned} found in raw PDF byte stream of {catalogue_filename}!"
            )
