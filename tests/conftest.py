"""Shared fixtures and standards for Win Equipments Product Catalogues E2E test suite.

Authoritative source: ORIGINAL_REQUEST.md, PROJECT.md, and Survey Reports 1-3.
All tests in this suite follow the Opaque-Box Testing methodology:
verifying generated PDF artifacts independently of internal template or engine code.
"""

from __future__ import annotations

import os
import re
from pathlib import Path
from typing import Any, Dict, List, Tuple
import logging

# Suppress noisy pdfminer font parsing warnings
logging.getLogger("pdfminer").setLevel(logging.ERROR)

import pdfplumber
import pypdf
import pypdfium2
import pytest

# Base project directories
PROJECT_ROOT = Path(__file__).resolve().parent.parent
CATALOGUE_DIR = PROJECT_ROOT / "catlogue"

# Mandatory Corporate Standards
COMPANY_STANDARDS: Dict[str, Any] = {
    "name": "Win Equipments",
    "tagline": "Save Water and Power",
    "address": "SF No: 4, 195 B, Kallangadu, Arasur Post, Coimbatore – 641407",
    "address_tokens": ["SF No: 4", "195 B", "Kallangadu", "Arasur", "641407"],
    "phones": ["+91 95972 28969", "+91 95972 28975"],
    "phone_patterns": [
        re.compile(r"\+91\s*95972\s*28969"),
        re.compile(r"\+91\s*95972\s*28975"),
    ],
    "email": "info@winequipments.com",
    "website": "winequipments.com",
    "certifications": ["ISO 9001:2015", "IAF", "DAC"],
    "brand_colors": {
        "navy": "#0E2540",
        "sky_blue": "#0284C7",
        "white": "#FFFFFF",
        "light_grey": "#F4F6F9",
    },
    "a4_width_mm": 210.0,
    "a4_height_mm": 297.0,
    "a4_tolerance_mm": 1.0,
    "min_body_font_pt": 9.0,
    "min_heading_font_pt": 18.0,
    "min_cover_image_area_pct": 40.0,
}

# Forbidden legacy phone numbers
FORBIDDEN_NUMBERS: List[str] = [
    "9597228978",
    "2562975",
    "0422-2562975",
    "0422 2562975",
]

FORBIDDEN_PATTERNS: List[re.Pattern] = [
    re.compile(r"95972\s*28978"),
    re.compile(r"0422[\s-]*2562975"),
    re.compile(r"(?<!\d)2562975(?!\d)"),
]

# Catalogues Inventory & Specification Matrix
CATALOGUES_SPEC: Dict[str, Dict[str, Any]] = {
    "refrigeration air dryer.pdf": {
        "title": "Refrigerated Compressed Air Dryers",
        "type": "brochure",
        "min_pages": 4,
        "max_pages": 6,
        "model_series": ["WRD"],
        "expected_terms": ["WRD", "CFM", "kW", "bar", "+3°C", "dew point"],
        "url_pattern": re.compile(r"winequipments\.com/products/refrigerated-air-dryer"),
        "cover_image_asset": "Refrigiratedairdryer1.png",
    },
    "Desiccant air dryer.pdf": {
        "title": "Heatless Desiccant Air Dryers",
        "type": "brochure",
        "min_pages": 4,
        "max_pages": 6,
        "model_series": ["WHD"],
        "expected_terms": ["WHD", "CFM", "bar", "-40°C", "desiccant", "alumina"],
        "url_pattern": re.compile(r"winequipments\.com/products/desiccant-air-dryer"),
        "cover_image_asset": "dessicantdryer.png",
    },
    "chiller.pdf": {
        "title": "Industrial Process Water Chillers",
        "type": "brochure",
        "min_pages": 4,
        "max_pages": 6,
        "model_series": ["WCP"],
        "expected_terms": ["WCP", "TR", "kW", "LPM", "chiller", "buffer"],
        "url_pattern": re.compile(r"winequipments\.com/products/industrial-process-chiller"),
        "cover_image_asset": "chiller.png",
    },
    "specialized chillers.pdf": {
        "title": "Specialized Application Process Chillers",
        "type": "brochure",
        "min_pages": 4,
        "max_pages": 6,
        "model_series": ["WAN", "WMS", "WAC"],
        "expected_terms": ["TR", "kW", "Titanium", "Medical", "Anodizing"],
        "url_pattern": re.compile(r"winequipments\.com/products/(anodizing|medical-scan|chiller)"),
        "cover_image_asset": "electroplatingchiller.png",
    },
    "ice flake machine.pdf": {
        "title": "Industrial Ice Flake Machines",
        "type": "brochure",
        "min_pages": 4,
        "max_pages": 6,
        "model_series": ["WFI"],
        "expected_terms": ["WFI", "TPD", "kW", "ice", "drum"],
        "url_pattern": re.compile(r"winequipments\.com/products/ice-flake-machine"),
        "cover_image_asset": "ice-flake-machine.jpg",
    },
    "Cooling-towers.pdf": {
        "title": "Round & Square Cooling Towers",
        "type": "brochure",
        "min_pages": 4,
        "max_pages": 6,
        "model_series": ["WCT"],
        "expected_terms": ["WCT", "TR", "m³/hr", "cooling tower"],
        "url_pattern": re.compile(r"winequipments\.com/products/(round|square|cooling-tower)"),
        "cover_image_asset": "coolingtower.png",
    },
    "Coil cooling tower.pdf": {
        "title": "Closed Circuit / Coil Cooling Towers",
        "type": "brochure",
        "min_pages": 4,
        "max_pages": 6,
        "model_series": ["WCC"],
        "expected_terms": ["WCC", "TR", "coil", "closed circuit"],
        "url_pattern": re.compile(r"winequipments\.com/products/closed-circuit-cooling-tower"),
        "cover_image_asset": "coilcooling.png",
    },
    "Air-Receiver.pdf": {
        "title": "Air Receiver Tanks / Pressure Vessels",
        "type": "brochure",
        "min_pages": 4,
        "max_pages": 6,
        "model_series": ["WRV"],
        "expected_terms": ["receiver", "bar", "Liters", "IS 2825", "ASME"],
        "url_pattern": re.compile(r"winequipments\.com/products/air-receiver-tank"),
        "cover_image_asset": "Airreciever.png",
    },
    "Filters.pdf": {
        "title": "Compressed Air Filters",
        "type": "brochure",
        "min_pages": 4,
        "max_pages": 6,
        "model_series": ["WMF"],
        "expected_terms": ["WMF", "CFM", "micron", "ISO 8573", "filter"],
        "url_pattern": re.compile(r"winequipments\.com/products/compressed-air-filter"),
        "cover_image_asset": "compressedairfilters.png",
    },
    "Automatic-Drain-Valve.pdf": {
        "title": "Automatic Condensate Drain Valves",
        "type": "brochure",
        "min_pages": 4,
        "max_pages": 6,
        "model_series": ["WADV"],
        "expected_terms": ["drain", "bar", "timer", "loss", "valve"],
        "url_pattern": re.compile(r"winequipments\.com/products/automatic-drain-valve"),
        "cover_image_asset": "drainvalve.png",
    },
    "E_Catalogue.pdf": {
        "title": "Master Product E-Catalogue",
        "type": "master",
        "min_pages": 12,
        "max_pages": 16,
        "model_series": ["WRD", "WHD", "WCP", "WCT", "WRV", "WMF", "WADV"],
        "expected_terms": ["Win Equipments", "Arasur", "ISO 9001:2015", "Save Water and Power", "WRD", "WCP"],
        "url_pattern": re.compile(r"winequipments\.com"),
        "cover_image_asset": "banner_opt.jpg",
    },
}

# The 10 individual brochure filenames
INDIVIDUAL_BROCHURE_FILENAMES = [
    f for f, s in CATALOGUES_SPEC.items() if s["type"] == "brochure"
]

# The Master catalogue filename
MASTER_CATALOGUE_FILENAME = "E_Catalogue.pdf"

# All 11 filenames
ALL_CATALOGUE_FILENAMES = list(CATALOGUES_SPEC.keys())


# ==============================================================================
# Helper Functions
# ==============================================================================

def get_catalogue_path(filename: str) -> Path:
    """Return absolute path to a catalogue file."""
    return CATALOGUE_DIR / filename


def extract_pdf_text_pypdf(pdf_path: Path) -> str:
    """Extract combined text across all pages using pypdf."""
    reader = pypdf.PdfReader(str(pdf_path))
    texts = []
    for page in reader.pages:
        t = page.extract_text()
        if t:
            texts.append(t)
    return "\n".join(texts)


def extract_pdf_pages_text(pdf_path: Path) -> List[str]:
    """Extract text page by page using pypdf."""
    reader = pypdf.PdfReader(str(pdf_path))
    return [page.extract_text() or "" for page in reader.pages]


def get_page_dimensions_mm(pdf_path: Path) -> List[Tuple[float, float]]:
    """Return a list of (width_mm, height_mm) for each page in the PDF."""
    reader = pypdf.PdfReader(str(pdf_path))
    dimensions = []
    for page in reader.pages:
        # Mediabox is in points (1 pt = 1/72 inch, 25.4 mm / inch)
        w_mm = float(page.mediabox.width) * 25.4 / 72.0
        h_mm = float(page.mediabox.height) * 25.4 / 72.0
        dimensions.append((w_mm, h_mm))
    return dimensions


def get_cover_image_metrics(pdf_path: Path) -> Dict[str, Any]:
    """Calculate image area coverage percentage on Page 1 using pdfplumber."""
    with pdfplumber.open(str(pdf_path)) as pdf:
        if not pdf.pages:
            return {"image_count": 0, "max_image_area_pct": 0.0, "total_image_area_pct": 0.0}
        p0 = pdf.pages[0]
        page_area = float(p0.width) * float(p0.height)
        images = p0.images
        if not images or page_area <= 0:
            return {"image_count": 0, "max_image_area_pct": 0.0, "total_image_area_pct": 0.0}
        
        areas = [float(img.get("width", 0)) * float(img.get("height", 0)) for img in images]
        max_area = max(areas) if areas else 0.0
        total_area = sum(areas)
        
        return {
            "image_count": len(images),
            "max_image_area_pct": (max_area / page_area) * 100.0,
            "total_image_area_pct": (total_area / page_area) * 100.0,
            "page_width": float(p0.width),
            "page_height": float(p0.height),
        }


def check_pdf_rendering_pypdfium2(pdf_path: Path, dpi: int = 150) -> List[Dict[str, Any]]:
    """Render all pages via pypdfium2 at specified DPI and return status metrics."""
    doc = pypdfium2.PdfDocument(str(pdf_path))
    scale = dpi / 72.0
    results = []
    for i, page in enumerate(doc):
        image = page.render(scale=scale).to_pil()
        # Verify image properties
        w, h = image.size
        # Simple blank page check: inspect min/max extents
        extrema = image.convert("L").getextrema()
        is_blank = extrema[0] == extrema[1]
        results.append({
            "page_num": i + 1,
            "width_px": w,
            "height_px": h,
            "mode": image.mode,
            "is_blank": is_blank,
            "extrema": extrema,
        })
    return results


# ==============================================================================
# Pytest Fixtures
# ==============================================================================

@pytest.fixture(scope="session")
def catalogue_dir() -> Path:
    """Fixture providing the catalogue directory path."""
    return CATALOGUE_DIR


@pytest.fixture(scope="session")
def company_standards() -> Dict[str, Any]:
    """Fixture providing company standards."""
    return COMPANY_STANDARDS


@pytest.fixture(scope="session")
def forbidden_numbers() -> List[str]:
    """Fixture providing forbidden legacy phone numbers."""
    return FORBIDDEN_NUMBERS


@pytest.fixture(scope="session")
def forbidden_patterns() -> List[re.Pattern]:
    """Fixture providing forbidden regex patterns."""
    return FORBIDDEN_PATTERNS


@pytest.fixture(scope="session")
def catalogues_spec() -> Dict[str, Dict[str, Any]]:
    """Fixture providing specification matrix for all 11 catalogues."""
    return CATALOGUES_SPEC


@pytest.fixture(params=ALL_CATALOGUE_FILENAMES)
def catalogue_filename(request: pytest.FixtureRequest) -> str:
    """Parametrized fixture providing each of the 11 catalogue filenames."""
    return request.param


@pytest.fixture(params=INDIVIDUAL_BROCHURE_FILENAMES)
def individual_brochure_filename(request: pytest.FixtureRequest) -> str:
    """Parametrized fixture providing each of the 10 individual brochure filenames."""
    return request.param


@pytest.fixture
def master_catalogue_filename() -> str:
    """Fixture providing the master catalogue filename."""
    return MASTER_CATALOGUE_FILENAME
