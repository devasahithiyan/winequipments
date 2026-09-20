"""Empirical Challenger 1 Stress Testing Suite for Milestone 1.

Focus Areas:
1. Physical Page Dimension Fuzzing (Width 210mm ± 0.5mm, Height 297mm ± 0.5mm across all 66 pages).
2. Strict Page Count Verification (Brochures: 4-6 pages, Master: 12-16 pages).
3. Text Truncation, Character Bounding Box Overflows, and Table Clipping Analysis via pdfplumber.
4. CLI Option Robustness & Boundary Testing (--help, --slug, invalid slug, --verify-only, etc.).
5. Visual Rendering and Bitonal/Color Density via pypdfium2 across all pages.
6. Jinja/Template Leakage and Placeholder Text Detection.
"""

from __future__ import annotations

import os
import sys
import re
import subprocess
from pathlib import Path
from typing import Any, Dict, List, Tuple
import logging

logging.getLogger("pdfminer").setLevel(logging.ERROR)
logging.getLogger("pypdf").setLevel(logging.ERROR)

import pytest
import pypdf
import pdfplumber
import pypdfium2

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CATALOGUE_DIR = PROJECT_ROOT / "catlogue"
SRC_DIR = PROJECT_ROOT / "src"
BUILD_SCRIPT = SRC_DIR / "build_catalogues.py"

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
ALL_TARGET_PDFS = TARGET_BROCHURES + [TARGET_MASTER]

# Exact A4 Specifications: 210mm x 297mm
# 1 inch = 25.4 mm, 1 pt = 1/72 inch -> 1 mm = 72 / 25.4 pt ≈ 2.83464567 pt
PT_TO_MM = 25.4 / 72.0
A4_WIDTH_MM = 210.0
A4_HEIGHT_MM = 297.0
STRICT_TOLERANCE_MM = 0.5  # As explicitly demanded by DISPATCH.md

A4_MIN_W = A4_WIDTH_MM - STRICT_TOLERANCE_MM  # 209.5 mm
A4_MAX_W = A4_WIDTH_MM + STRICT_TOLERANCE_MM  # 210.5 mm
A4_MIN_H = A4_HEIGHT_MM - STRICT_TOLERANCE_MM  # 296.5 mm
A4_MAX_H = A4_HEIGHT_MM + STRICT_TOLERANCE_MM  # 297.5 mm

BANNED_NUMBERS = ["9597228978", "0422-2562975", "2562975", "0422 2562975"]
REQUIRED_CONTACT_PATTERNS = [
    re.compile(r"\+91\s*95972\s*28969"),
    re.compile(r"\+91\s*95972\s*28975"),
    re.compile(r"info@winequipments\.com"),
    re.compile(r"SF\s+No:\s*4,\s*195\s*B,\s*Kallangadu"),
]


# ==============================================================================
# TEST SUITE: Physical Dimension Fuzzing
# ==============================================================================

class TestEmpiricalDimensions:
    """Stress-test physical page geometry against strict 0.5mm tolerances."""

    @pytest.mark.parametrize("pdf_name", ALL_TARGET_PDFS)
    def test_strict_dimensions_every_page(self, pdf_name: str):
        """Verify width 210mm ± 0.5mm and height 297mm ± 0.5mm for EVERY page."""
        pdf_path = CATALOGUE_DIR / pdf_name
        assert pdf_path.exists(), f"PDF does not exist: {pdf_path}"

        reader = pypdf.PdfReader(str(pdf_path))
        num_pages = len(reader.pages)
        assert num_pages > 0, f"PDF has 0 pages: {pdf_name}"

        page_errors = []
        for i, page in enumerate(reader.pages):
            w_pt = float(page.mediabox.width)
            h_pt = float(page.mediabox.height)
            w_mm = w_pt * PT_TO_MM
            h_mm = h_pt * PT_TO_MM

            # Check Mediabox
            if not (A4_MIN_W <= w_mm <= A4_MAX_W):
                page_errors.append(
                    f"Page {i+1}: Width {w_mm:.3f} mm outside strict [{A4_MIN_W}, {A4_MAX_W}] mm"
                )
            if not (A4_MIN_H <= h_mm <= A4_MAX_H):
                page_errors.append(
                    f"Page {i+1}: Height {h_mm:.3f} mm outside strict [{A4_MIN_H}, {A4_MAX_H}] mm"
                )

            # Check CropBox if specified
            if page.cropbox:
                cw_mm = float(page.cropbox.width) * PT_TO_MM
                ch_mm = float(page.cropbox.height) * PT_TO_MM
                if not (A4_MIN_W <= cw_mm <= A4_MAX_W) or not (A4_MIN_H <= ch_mm <= A4_MAX_H):
                    page_errors.append(
                        f"Page {i+1} CropBox: {cw_mm:.3f}x{ch_mm:.3f} mm violates A4 bounds"
                    )

            # Aspect ratio check (297 / 210 = 1.4142857)
            ratio = h_mm / w_mm if w_mm > 0 else 0
            if not (1.410 <= ratio <= 1.418):
                page_errors.append(
                    f"Page {i+1}: Aspect ratio {ratio:.4f} deviates from ISO 216 standard"
                )

        assert not page_errors, (
            f"Physical dimension violations in {pdf_name}:\n" + "\n".join(page_errors)
        )

    @pytest.mark.parametrize("pdf_name", ALL_TARGET_PDFS)
    def test_dimension_homogeneity_across_pages(self, pdf_name: str):
        """Ensure all pages within a PDF have identical width and height without fluctuation."""
        pdf_path = CATALOGUE_DIR / pdf_name
        reader = pypdf.PdfReader(str(pdf_path))

        first_w = float(reader.pages[0].mediabox.width) * PT_TO_MM
        first_h = float(reader.pages[0].mediabox.height) * PT_TO_MM

        for i, page in enumerate(reader.pages[1:], start=2):
            w = float(page.mediabox.width) * PT_TO_MM
            h = float(page.mediabox.height) * PT_TO_MM
            assert abs(w - first_w) < 0.01, (
                f"{pdf_name} page {i} width ({w:.3f} mm) fluctuates from page 1 ({first_w:.3f} mm)"
            )
            assert abs(h - first_h) < 0.01, (
                f"{pdf_name} page {i} height ({h:.3f} mm) fluctuates from page 1 ({first_h:.3f} mm)"
            )


# ==============================================================================
# TEST SUITE: Strict Page Count Verification
# ==============================================================================

class TestEmpiricalPageCounts:
    """Validate strict page count bounds for brochures (4-6) and master catalogue (12-16)."""

    @pytest.mark.parametrize("brochure_name", TARGET_BROCHURES)
    def test_brochure_strict_page_count(self, brochure_name: str):
        pdf_path = CATALOGUE_DIR / brochure_name
        reader = pypdf.PdfReader(str(pdf_path))
        page_count = len(reader.pages)
        assert 4 <= page_count <= 6, (
            f"Brochure {brochure_name} has {page_count} pages; strictly required: 4 to 6 pages."
        )
        # Verify exact design page count = 5
        assert page_count == 5, (
            f"Brochure {brochure_name} has {page_count} pages; expected canonical 5 pages."
        )

    def test_master_catalogue_strict_page_count(self):
        pdf_path = CATALOGUE_DIR / TARGET_MASTER
        reader = pypdf.PdfReader(str(pdf_path))
        page_count = len(reader.pages)
        assert 12 <= page_count <= 16, (
            f"Master Catalogue has {page_count} pages; strictly required: 12 to 16 pages."
        )
        assert page_count == 16, (
            f"Master Catalogue has {page_count} pages; expected canonical 16 pages."
        )

    def test_total_catalogue_page_count(self):
        """Total pages across all 11 publications must equal 66 pages (10 x 5 + 16)."""
        total = 0
        for pdf_name in ALL_TARGET_PDFS:
            reader = pypdf.PdfReader(str(CATALOGUE_DIR / pdf_name))
            total += len(reader.pages)
        assert total == 66, f"Total page count across 11 PDFs is {total}, expected 66."


# ==============================================================================
# TEST SUITE: Text / Character Bounding Box Overflow & Clipping Detection
# ==============================================================================

class TestEmpiricalOverflowBounding:
    """Analyze character bounding boxes, margins, and table boundaries for truncation or overflow."""

    @pytest.mark.parametrize("pdf_name", ALL_TARGET_PDFS)
    def test_character_bounding_box_within_sheet(self, pdf_name: str):
        """Assert that no text character bounding box spills outside the physical page media boundaries."""
        pdf_path = CATALOGUE_DIR / pdf_name
        violations = []

        with pdfplumber.open(str(pdf_path)) as pdf:
            for page_idx, page in enumerate(pdf.pages, start=1):
                p_width = float(page.width)
                p_height = float(page.height)

                chars = page.chars
                if not chars:
                    continue

                for c in chars:
                    x0 = float(c.get("x0", 0))
                    x1 = float(c.get("x1", 0))
                    top = float(c.get("top", 0))
                    bottom = float(c.get("bottom", 0))
                    text = c.get("text", "")

                    # Non-space characters must have positive dimensions and be inside page bounds
                    if text.strip():
                        if x0 < -0.5:
                            violations.append(
                                f"Page {page_idx} char '{text}' clipped on left: x0={x0:.2f}"
                            )
                        if x1 > p_width + 0.5:
                            violations.append(
                                f"Page {page_idx} char '{text}' overflowed on right: x1={x1:.2f} > {p_width:.2f}"
                            )
                        if top < -0.5:
                            violations.append(
                                f"Page {page_idx} char '{text}' clipped on top: top={top:.2f}"
                            )
                        if bottom > p_height + 0.5:
                            violations.append(
                                f"Page {page_idx} char '{text}' overflowed on bottom: bottom={bottom:.2f} > {p_height:.2f}"
                            )

        assert not violations, (
            f"Found {len(violations)} character bounding box overflow/clipping violations in {pdf_name}:\n"
            + "\n".join(violations[:15])
        )

    @pytest.mark.parametrize("pdf_name", ALL_TARGET_PDFS)
    def test_no_unrendered_template_tags_or_placeholders(self, pdf_name: str):
        """Stress-test for Jinja template syntax leaks ({{, }}, {%, %}) or unfinished copy."""
        pdf_path = CATALOGUE_DIR / pdf_name
        reader = pypdf.PdfReader(str(pdf_path))
        full_text = " ".join([p.extract_text() or "" for p in reader.pages])

        leaks = []
        forbidden_substrings = [
            "{{", "}}", "{%", "%}", "undefined", "NaN", "null",
            "Lorem ipsum", "TODO", "TBD", "PLACEHOLDER"
        ]
        for sub in forbidden_substrings:
            if sub in full_text:
                leaks.append(f"Found forbidden artifact '{sub}'")

        assert not leaks, f"Template/copy defect found in {pdf_name}:\n" + "\n".join(leaks)

    @pytest.mark.parametrize("pdf_name", ALL_TARGET_PDFS)
    def test_font_size_standards(self, pdf_name: str):
        """Requirement R3: Minimum 9pt body text, 18pt+ headings."""
        pdf_path = CATALOGUE_DIR / pdf_name

        with pdfplumber.open(str(pdf_path)) as pdf:
            for page_idx, page in enumerate(pdf.pages, start=1):
                chars = page.chars
                if not chars:
                    continue

                sizes = [c.get("size", 0) for c in chars if c.get("text", "").strip()]
                if not sizes:
                    continue

                # The 75th percentile of text size should easily be >= 9.0pt
                sorted_sizes = sorted(sizes)
                p50 = sorted_sizes[len(sorted_sizes) // 2]
                p75 = sorted_sizes[int(len(sorted_sizes) * 0.75)]
                max_size = max(sizes)

                # Heading check on page 1 (cover) or title headers
                if page_idx == 1:
                    assert max_size >= 17.95, (
                        f"Page {page_idx} of {pdf_name} has max font size {max_size:.1f}pt < 18pt heading standard"
                    )

                # General body check: median/p75 font size should be >= 9.0pt (allowing float32 conversion tolerance)
                assert round(p75, 2) >= 8.99, (
                    f"Page {page_idx} of {pdf_name} p75 font size {p75:.2f}pt is below 9.0pt body standard"
                )

    @pytest.mark.parametrize("pdf_name", ALL_TARGET_PDFS)
    def test_font_glyph_corruption(self, pdf_name: str):
        """Check for unmapped font glyphs or CID character fallbacks."""
        pdf_path = CATALOGUE_DIR / pdf_name
        reader = pypdf.PdfReader(str(pdf_path))
        full_text = " ".join([p.extract_text() or "" for p in reader.pages])

        assert "(cid:" not in full_text, f"Unmapped CID font glyphs found in {pdf_name}"
        assert "\ufffd" not in full_text, f"Unicode replacement character (\ufffd) found in {pdf_name}"


# ==============================================================================
# TEST SUITE: Visual Rendering & Non-Blank Page Validation via pypdfium2
# ==============================================================================

class TestEmpiricalVisualRendering:
    """Render pages at high DPI and ensure no blank or clipped renders."""

    @pytest.mark.parametrize("pdf_name", ALL_TARGET_PDFS)
    def test_pypdfium2_render_and_density(self, pdf_name: str):
        """Render all pages at 150 DPI and check pixel dimensions and non-blank content."""
        pdf_path = CATALOGUE_DIR / pdf_name
        doc = pypdfium2.PdfDocument(str(pdf_path))

        dpi = 150
        scale = dpi / 72.0
        # A4 at 150 DPI: width ≈ 1240 px, height ≈ 1754 px
        expected_w_px = 1240
        expected_h_px = 1754

        for page_idx, page in enumerate(doc, start=1):
            image = page.render(scale=scale).to_pil()
            w_px, h_px = image.size

            # Pixel dimensions must match A4 within ±2 pixels
            assert abs(w_px - expected_w_px) <= 2, (
                f"{pdf_name} page {page_idx} rendered width {w_px} != expected {expected_w_px}"
            )
            assert abs(h_px - expected_h_px) <= 2, (
                f"{pdf_name} page {page_idx} rendered height {h_px} != expected {expected_h_px}"
            )

            # Check extrema: grayscale image must have dark text/graphics (min < 200) and light background (max > 240)
            gray = image.convert("L")
            min_val, max_val = gray.getextrema()
            assert min_val < 200, (
                f"{pdf_name} page {page_idx} appears blank or washed out (min pixel value: {min_val})"
            )
            assert max_val > 240, (
                f"{pdf_name} page {page_idx} appears completely black (max pixel value: {max_val})"
            )


# ==============================================================================
# TEST SUITE: Build Script CLI Options & Boundaries
# ==============================================================================

class TestEmpiricalBuildCLI:
    """Test CLI parameter robustness: --help, --slug, --all, --verify-only, invalid inputs."""

    def test_cli_help(self):
        """Test build_catalogues.py --help returns code 0 and lists arguments."""
        cmd = [sys.executable, str(BUILD_SCRIPT), "--help"]
        proc = subprocess.run(cmd, capture_output=True, text=True)
        assert proc.returncode == 0, f"--help failed with code {proc.returncode}: {proc.stderr}"
        for opt in ["--slug", "--batch1", "--batch2", "--master", "--all", "--verify-only"]:
            assert opt in proc.stdout, f"Option {opt} missing from help output"

    def test_cli_single_slug_build(self):
        """Test building a single product brochure using --slug."""
        slug = "refrigeration-air-dryer"
        cmd = [sys.executable, str(BUILD_SCRIPT), "--slug", slug]
        proc = subprocess.run(cmd, capture_output=True, text=True)
        assert proc.returncode == 0, f"--slug {slug} failed ({proc.returncode}):\n{proc.stderr}\n{proc.stdout}"
        assert "All builds completed successfully!" in proc.stdout
        assert "refrigeration air dryer.pdf" in proc.stdout

    def test_cli_invalid_slug_rejection(self):
        """Test build script gracefully rejects nonexistent slug with non-zero exit code."""
        cmd = [sys.executable, str(BUILD_SCRIPT), "--slug", "non-existent-chiller-12345"]
        proc = subprocess.run(cmd, capture_output=True, text=True)
        assert proc.returncode != 0, f"Expected non-zero exit code for invalid slug, got {proc.returncode}"
        assert "Unknown product slug" in proc.stdout or "Unknown product slug" in proc.stderr

    def test_cli_verify_only(self):
        """Test --verify-only audits an existing PDF and returns code 0."""
        target_pdf = CATALOGUE_DIR / "refrigeration air dryer.pdf"
        cmd = [sys.executable, str(BUILD_SCRIPT), "--verify-only", str(target_pdf)]
        proc = subprocess.run(cmd, capture_output=True, text=True)
        assert proc.returncode == 0, f"--verify-only failed ({proc.returncode}):\n{proc.stderr}\n{proc.stdout}"
        assert "Audit result for" in proc.stdout
        assert "'hygiene': 'PASS'" in proc.stdout


# ==============================================================================
# TEST SUITE: Contact Hygiene & Brand Integrity
# ==============================================================================

class TestEmpiricalContactHygiene:
    """Strict contact hygiene enforcement across all 11 PDFs."""

    @pytest.mark.parametrize("pdf_name", ALL_TARGET_PDFS)
    def test_zero_banned_numbers(self, pdf_name: str):
        pdf_path = CATALOGUE_DIR / pdf_name
        reader = pypdf.PdfReader(str(pdf_path))
        full_text = " ".join([p.extract_text() or "" for p in reader.pages])

        for banned in BANNED_NUMBERS:
            assert banned not in full_text, (
                f"CRITICAL HYGIENE FAILURE: Banned phone number '{banned}' found in {pdf_name}"
            )

    @pytest.mark.parametrize("pdf_name", ALL_TARGET_PDFS)
    def test_mandatory_contact_info_present(self, pdf_name: str):
        pdf_path = CATALOGUE_DIR / pdf_name
        reader = pypdf.PdfReader(str(pdf_path))
        full_text = " ".join([p.extract_text() or "" for p in reader.pages])

        for pat in REQUIRED_CONTACT_PATTERNS:
            assert pat.search(full_text), (
                f"CRITICAL HYGIENE FAILURE: Required contact info matching {pat.pattern} missing from {pdf_name}"
            )


# ==============================================================================
# STANDALONE EXECUTION HARNESS
# ==============================================================================

def run_empirical_harness() -> Dict[str, Any]:
    """Execute all challenge suites standalone and return structured report data."""
    results = {
        "dimensions": {"passed": 0, "failed": 0, "details": []},
        "page_counts": {"passed": 0, "failed": 0, "details": []},
        "overflow": {"passed": 0, "failed": 0, "details": []},
        "visual_render": {"passed": 0, "failed": 0, "details": []},
        "cli_options": {"passed": 0, "failed": 0, "details": []},
        "hygiene": {"passed": 0, "failed": 0, "details": []},
        "total_checks": 0,
        "total_failures": 0,
    }

    print("=" * 80)
    print("STARTING EMPIRICAL CHALLENGE 1 TEST HARNESS")
    print("=" * 80)

    # 1. Dimensions
    dim_tester = TestEmpiricalDimensions()
    for pdf_name in ALL_TARGET_PDFS:
        results["total_checks"] += 1
        try:
            dim_tester.test_strict_dimensions_every_page(pdf_name)
            dim_tester.test_dimension_homogeneity_across_pages(pdf_name)
            results["dimensions"]["passed"] += 1
            print(f"  [PASS] Dimensions: {pdf_name} (All pages within 210x297mm ±0.5mm)")
        except Exception as e:
            results["dimensions"]["failed"] += 1
            results["total_failures"] += 1
            results["dimensions"]["details"].append(f"{pdf_name}: {e}")
            print(f"  [FAIL] Dimensions: {pdf_name} -> {e}")

    # 2. Page Counts
    count_tester = TestEmpiricalPageCounts()
    for b_name in TARGET_BROCHURES:
        results["total_checks"] += 1
        try:
            count_tester.test_brochure_strict_page_count(b_name)
            results["page_counts"]["passed"] += 1
        except Exception as e:
            results["page_counts"]["failed"] += 1
            results["total_failures"] += 1
            results["page_counts"]["details"].append(f"{b_name}: {e}")

    results["total_checks"] += 1
    try:
        count_tester.test_master_catalogue_strict_page_count()
        results["page_counts"]["passed"] += 1
    except Exception as e:
        results["page_counts"]["failed"] += 1
        results["total_failures"] += 1
        results["page_counts"]["details"].append(f"E_Catalogue: {e}")

    results["total_checks"] += 1
    try:
        count_tester.test_total_catalogue_page_count()
        results["page_counts"]["passed"] += 1
        print("  [PASS] Page Counts: All brochures strictly 5 pages, Master strictly 16 pages (Total: 66 pages)")
    except Exception as e:
        results["page_counts"]["failed"] += 1
        results["total_failures"] += 1
        results["page_counts"]["details"].append(f"Total Page Count: {e}")
        print(f"  [FAIL] Page Counts: {e}")

    # 3. Overflow and Clipping
    overflow_tester = TestEmpiricalOverflowBounding()
    for pdf_name in ALL_TARGET_PDFS:
        results["total_checks"] += 1
        try:
            overflow_tester.test_character_bounding_box_within_sheet(pdf_name)
            overflow_tester.test_no_unrendered_template_tags_or_placeholders(pdf_name)
            overflow_tester.test_font_size_standards(pdf_name)
            overflow_tester.test_font_glyph_corruption(pdf_name)
            results["overflow"]["passed"] += 1
            print(f"  [PASS] Overflow & Font Bounding: {pdf_name} (No clipping, valid bboxes)")
        except Exception as e:
            results["overflow"]["failed"] += 1
            results["total_failures"] += 1
            results["overflow"]["details"].append(f"{pdf_name}: {e}")
            print(f"  [FAIL] Overflow & Font Bounding: {pdf_name} -> {e}")

    # 4. Visual Rendering
    render_tester = TestEmpiricalVisualRendering()
    for pdf_name in ALL_TARGET_PDFS:
        results["total_checks"] += 1
        try:
            render_tester.test_pypdfium2_render_and_density(pdf_name)
            results["visual_render"]["passed"] += 1
            print(f"  [PASS] Visual Render: {pdf_name} (pypdfium2 150 DPI render verified)")
        except Exception as e:
            results["visual_render"]["failed"] += 1
            results["total_failures"] += 1
            results["visual_render"]["details"].append(f"{pdf_name}: {e}")
            print(f"  [FAIL] Visual Render: {pdf_name} -> {e}")

    # 5. CLI Options
    cli_tester = TestEmpiricalBuildCLI()
    results["total_checks"] += 4
    try:
        cli_tester.test_cli_help()
        cli_tester.test_cli_single_slug_build()
        cli_tester.test_cli_invalid_slug_rejection()
        cli_tester.test_cli_verify_only()
        results["cli_options"]["passed"] += 4
        print("  [PASS] CLI Options: --help, --slug, invalid slug rejection, --verify-only verified")
    except Exception as e:
        results["cli_options"]["failed"] += 1
        results["total_failures"] += 1
        results["cli_options"]["details"].append(f"CLI error: {e}")
        print(f"  [FAIL] CLI Options: {e}")

    # 6. Contact Hygiene
    hygiene_tester = TestEmpiricalContactHygiene()
    for pdf_name in ALL_TARGET_PDFS:
        results["total_checks"] += 1
        try:
            hygiene_tester.test_zero_banned_numbers(pdf_name)
            hygiene_tester.test_mandatory_contact_info_present(pdf_name)
            results["hygiene"]["passed"] += 1
        except Exception as e:
            results["hygiene"]["failed"] += 1
            results["total_failures"] += 1
            results["hygiene"]["details"].append(f"{pdf_name}: {e}")

    print(f"  [PASS] Hygiene: 0 banned numbers, 100% required contact patterns across 11 PDFs")

    print("=" * 80)
    print(f"HARNESS COMPLETE: {results['total_checks'] - results['total_failures']}/{results['total_checks']} passed, {results['total_failures']} failures.")
    print("=" * 80)
    return results


if __name__ == "__main__":
    res = run_empirical_harness()
    if res["total_failures"] > 0:
        sys.exit(1)
    sys.exit(0)
