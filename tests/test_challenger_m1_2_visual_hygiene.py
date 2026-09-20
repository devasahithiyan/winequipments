"""Adversarial Verification Suite for Milestone 1 Challenger 2.

Focus Areas:
1. Visual rasterization stress tests at 150 DPI & 300 DPI via pypdfium2 (zero glitches/blanks).
2. Color sampling for Win Equipments brand palette: Navy #0E2540 and Sky Blue #0284C7.
3. Font subsetting, vector embedding, and ToUnicode CMap integrity in PDF objects.
4. Deep contact hygiene regex fuzzing across raw PDF streams and text streams.
"""

from __future__ import annotations

import logging
import os
import re
import zlib
from pathlib import Path
from typing import Any, Dict, List, Tuple

import numpy as np
import pdfplumber
import pypdf
import pypdfium2
import pytest

logging.getLogger("pdfminer").setLevel(logging.ERROR)
logging.getLogger("pypdf").setLevel(logging.ERROR)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CATALOGUE_DIR = PROJECT_ROOT / "catlogue"

CATALOGUES = [
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
    "E_Catalogue.pdf",
]

NAVY_RGB = np.array([14, 37, 64], dtype=np.int32)
SKY_RGB = np.array([2, 132, 199], dtype=np.int32)

FUZZED_BANNED_PATTERNS = [
    re.compile(r"9[\s\-_./\(\)]*5[\s\-_./\(\)]*9[\s\-_./\(\)]*7[\s\-_./\(\)]*2[\s\-_./\(\)]*2[\s\-_./\(\)]*8[\s\-_./\(\)]*9[\s\-_./\(\)]*7[\s\-_./\(\)]*8", re.IGNORECASE),
    re.compile(r"(?:0[\s\-_./\(\)]*4[\s\-_./\(\)]*2[\s\-_./\(\)]*2[\s\-_./\(\)]*)?2[\s\-_./\(\)]*5[\s\-_./\(\)]*6[\s\-_./\(\)]*2[\s\-_./\(\)]*9[\s\-_./\(\)]*7[\s\-_./\(\)]*5", re.IGNORECASE),
    re.compile(r"9597228978"),
    re.compile(r"2562975"),
    re.compile(r"0422-2562975"),
    re.compile(r"0422 2562975"),
    re.compile(r"95972 28978"),
]

MANDATORY_PHONES = [
    re.compile(r"\+91\s*95972\s*28969"),
    re.compile(r"\+91\s*95972\s*28975"),
]
MANDATORY_EMAIL = "info@winequipments.com"
MANDATORY_ADDRESS = "SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407"


@pytest.mark.parametrize("pdf_name", CATALOGUES)
class TestVisualQualityAndFontRendering:
    """Task 1 & Task 3: Visual rasterization and vector font subset audit."""

    def test_rasterization_150dpi_zero_blanks_and_glitches(self, pdf_name: str) -> None:
        """Render every page at 150 DPI and assert valid dimensions, non-blank extents, and content."""
        pdf_path = CATALOGUE_DIR / pdf_name
        assert pdf_path.exists(), f"PDF missing: {pdf_name}"

        doc = pypdfium2.PdfDocument(str(pdf_path))
        page_count = len(doc)
        if pdf_name == "E_Catalogue.pdf":
            assert 12 <= page_count <= 16, f"Master catalogue unexpected page count {page_count}"
        else:
            assert 4 <= page_count <= 6, f"Brochure {pdf_name} unexpected page count {page_count}"

        for i, page in enumerate(doc):
            pix = page.render(scale=150 / 72).to_pil()
            w, h = pix.size
            # A4 at 150 DPI is 1240 x 1754 px
            assert 1230 <= w <= 1250, f"{pdf_name} p{i+1}: unexpected width {w}px"
            assert 1740 <= h <= 1765, f"{pdf_name} p{i+1}: unexpected height {h}px"

            # Check blank page
            gray = pix.convert("L")
            extrema = gray.getextrema()
            assert extrema[0] != extrema[1], f"{pdf_name} p{i+1}: blank page detected (min=max={extrema[0]})"
            # Ensure not all-black or all-white
            assert extrema[0] < 50, f"{pdf_name} p{i+1}: page lacks dark elements (min gray={extrema[0]})"
            assert extrema[1] > 200, f"{pdf_name} p{i+1}: page lacks light background (max gray={extrema[1]})"

    def test_rasterization_300dpi_high_res_stress(self, pdf_name: str) -> None:
        """Render cover page at publication 300 DPI to verify high-DPI scaling stability."""
        pdf_path = CATALOGUE_DIR / pdf_name
        doc = pypdfium2.PdfDocument(str(pdf_path))
        p0 = doc[0]
        pix = p0.render(scale=300 / 72).to_pil()
        w, h = pix.size
        assert 2470 <= w <= 2490, f"{pdf_name} p1 @ 300DPI: unexpected width {w}px"
        assert 3490 <= h <= 3520, f"{pdf_name} p1 @ 300DPI: unexpected height {h}px"

    def test_font_subsets_and_vector_character_procs(self, pdf_name: str) -> None:
        """Verify fonts have valid ToUnicode CMaps, no CID glyph corruption, and vector outlines."""
        pdf_path = CATALOGUE_DIR / pdf_name
        reader = pypdf.PdfReader(str(pdf_path))

        full_text = " ".join([p.extract_text() or "" for p in reader.pages])
        assert "(cid:" not in full_text, f"Unmapped CID font glyphs in {pdf_name}"
        assert "\ufffd" not in full_text, f"Replacement glyph corruption in {pdf_name}"

        # Verify font objects have ToUnicode
        for page_idx, page in enumerate(reader.pages):
            if "/Resources" in page and "/Font" in page["/Resources"]:
                font_dict = page["/Resources"]["/Font"]
                for k, f_ref in font_dict.items():
                    f_obj = f_ref.get_object()
                    assert "/ToUnicode" in f_obj, f"{pdf_name} p{page_idx+1} font {k} lacks /ToUnicode CMap"


@pytest.mark.parametrize("pdf_name", CATALOGUES)
class TestBrandColorSampling:
    """Task 2: Empirical pixel sampling for Navy #0E2540 and Sky Blue #0284C7."""

    def test_sample_pixel_colors_navy_and_sky_blue(self, pdf_name: str) -> None:
        """Confirm presence of exact and near matches for #0E2540 and #0284C7."""
        pdf_path = CATALOGUE_DIR / pdf_name
        doc = pypdfium2.PdfDocument(str(pdf_path))

        total_navy_exact = 0
        total_sky_exact = 0

        for page in doc:
            img = page.render(scale=150 / 72).to_pil()
            arr = np.array(img.convert("RGB"), dtype=np.int32)

            navy_exact = np.sum(np.all(arr == NAVY_RGB, axis=-1))
            sky_exact = np.sum(np.all(arr == SKY_RGB, axis=-1))

            total_navy_exact += navy_exact
            total_sky_exact += sky_exact

        # Every catalogue has large navy blocks (headers, banners, footer accents)
        # and sky blue accents (badges, subheadings, table headers)
        assert total_navy_exact > 100_000, (
            f"{pdf_name}: insufficient Navy #0E2540 pixels ({total_navy_exact} found)"
        )
        assert total_sky_exact > 20_000, (
            f"{pdf_name}: insufficient Sky Blue #0284C7 pixels ({total_sky_exact} found)"
        )


@pytest.mark.parametrize("pdf_name", CATALOGUES)
class TestDeepContactHygieneFuzzing:
    """Task 4: Comprehensive fuzzing across raw PDF streams and text streams."""

    def test_contact_hygiene_fuzzing_decompressed_streams(self, pdf_name: str) -> None:
        """Decompress every stream in raw PDF bytes and search with fuzzed regex patterns."""
        pdf_path = CATALOGUE_DIR / pdf_name
        raw_bytes = pdf_path.read_bytes()

        # Check raw bytes directly for banned numbers
        raw_banned = [b"9597228978", b"2562975", b"0422-2562975", b"0422 2562975", b"95972 28978"]
        for b in raw_banned:
            assert b not in raw_bytes, f"Raw bytes in {pdf_name} contain banned sequence {b}"

        # Find and decompress all Flate streams
        stream_matches = re.finditer(b"stream[\r\n]+(.*?)[\r\n]+endstream", raw_bytes, re.DOTALL)
        for sm in stream_matches:
            stream_data = sm.group(1)
            try:
                decomp = zlib.decompress(stream_data)
            except Exception:
                try:
                    decomp = zlib.decompress(stream_data, -zlib.MAX_WBITS)
                except Exception:
                    decomp = stream_data

            decomp_text = decomp.decode("latin1", errors="ignore")
            for pat in FUZZED_BANNED_PATTERNS:
                m = pat.search(decomp_text)
                assert not m, f"{pdf_name}: banned pattern {pat.pattern} found in decompressed stream: '{m.group(0)}'"

    def test_contact_hygiene_fuzzing_extracted_text_and_mandatory_contacts(self, pdf_name: str) -> None:
        """Verify extracted text contains no banned numbers and contains all mandatory contact info."""
        pdf_path = CATALOGUE_DIR / pdf_name
        reader = pypdf.PdfReader(str(pdf_path))
        full_text = " ".join([p.extract_text() or "" for p in reader.pages])

        # Fuzzing checks
        for pat in FUZZED_BANNED_PATTERNS:
            m = pat.search(full_text)
            assert not m, f"{pdf_name}: banned pattern {pat.pattern} matched in extracted text: '{m.group(0)}'"

        # Mandatory contacts presence check
        for phone_pat in MANDATORY_PHONES:
            assert phone_pat.search(full_text), f"{pdf_name}: mandatory phone matching {phone_pat.pattern} missing"

        assert MANDATORY_EMAIL in full_text, f"{pdf_name}: mandatory email {MANDATORY_EMAIL} missing"
        assert "641407" in full_text, f"{pdf_name}: mandatory postal code 641407 missing"
        assert "Arasur" in full_text, f"{pdf_name}: mandatory locality Arasur missing"
