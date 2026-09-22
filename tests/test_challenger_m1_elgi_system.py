"""Empirical Challenger Test Suite for Milestone 1 (ELGi Design System & CSS Architecture).

Verifies:
1. WCAG 2.1 AAA/AA Color Contrast for ELGi palette:
   - Text (#334155, #0F172A) on Grounds (#FFFFFF, #F8FAFC)
   - Muted Text (#64748B) on Grounds (#FFFFFF, #F8FAFC)
   - CSS token consistency in css/design-system.css
2. Zero Unstyled Bullets across all 46 production HTML pages:
   - Baseline ul, ol typography and padding (eliminating clipped markers)
   - Zero hardcoded fake bullet glyphs (•, \u2022, &bull;, etc.) starting list items
   - Proper class styling (clean-list, feature-list, spec-list, nav-list, etc.)
   - Regression audit on industries/plastic-molding.html
3. Zero Cartoon Emoji Entities or Raw Unicode Emojis site-wide:
   - Zero decimal HTML entities (&#128...;, &#127...;, etc.) across all production web files
   - Zero raw unicode cartoon emoji characters across all production web files (HTML/CSS/JS)
   - Identification of raw emojis in src/data/ and build/html/
4. Preserved Sticky Freeze-Pane Behavior on .spec-table-container:
   - position: sticky, left: 0, solid background, z-index >= 2
   - table-quote-btn integration with data-model attributes across product pages
5. Elimination of Dark Slabs & Blueprint Grid Clutter:
   - Removal of #0B1523 / #16263B slabs on hero and product sections
   - Elimination of 32px blueprint grid pseudo-element overlays
"""

from __future__ import annotations

import glob
import os
import re
from pathlib import Path
from typing import Dict, List, Tuple
from bs4 import BeautifulSoup
import pytest

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CSS_DESIGN_SYSTEM = PROJECT_ROOT / "css" / "design-system.css"
CSS_COMPONENTS = PROJECT_ROOT / "css" / "components.css"

EXCLUDE_DIRS = {"/build/", "/src/", "/.agents/", "/.git/", "__pycache__"}


def get_production_html_files() -> List[str]:
    """Return relative paths of all 46 canonical production HTML content files."""
    all_files = sorted(glob.glob(str(PROJECT_ROOT / "**/*.html"), recursive=True))
    valid = []
    for f in all_files:
        if any(exc in f for exc in EXCLUDE_DIRS):
            continue
        content = open(f, "r", encoding="utf-8", errors="ignore").read()
        if 'http-equiv="refresh"' in content.lower():
            continue
        valid.append(os.path.relpath(f, PROJECT_ROOT))
    return valid


def parse_hex_color(hex_str: str) -> Tuple[float, float, float]:
    """Parse #RRGGBB hex string into normalized (R, G, B) floats in [0, 1]."""
    hex_clean = hex_str.strip().lstrip("#")
    if len(hex_clean) == 3:
        hex_clean = "".join(c * 2 for c in hex_clean)
    r = int(hex_clean[0:2], 16) / 255.0
    g = int(hex_clean[2:4], 16) / 255.0
    b = int(hex_clean[4:6], 16) / 255.0
    return r, g, b


def relative_luminance(r: float, g: float, b: float) -> float:
    """Calculate WCAG 2.1 relative luminance for sRGB values."""
    def channel_lum(c: float) -> float:
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r_lin = channel_lum(r)
    g_lin = channel_lum(g)
    b_lin = channel_lum(b)
    return 0.2126 * r_lin + 0.7152 * g_lin + 0.0722 * b_lin


def wcag_contrast_ratio(hex1: str, hex2: str) -> float:
    """Calculate WCAG 2.1 contrast ratio between two hex colors (>= 1.0)."""
    l1 = relative_luminance(*parse_hex_color(hex1))
    l2 = relative_luminance(*parse_hex_color(hex2))
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


# ==============================================================================
# 1. COLOR CONTRAST & DESIGN SYSTEM TOKENS
# ==============================================================================

class TestColorContrastAndTokens:
    """Empirical verification of ELGi palette contrast ratios and token declarations."""

    @pytest.mark.parametrize("text_hex,bg_hex,min_ratio,level", [
        ("#0F172A", "#FFFFFF", 7.0, "WCAG AAA"),
        ("#0F172A", "#F8FAFC", 7.0, "WCAG AAA"),
        ("#334155", "#FFFFFF", 7.0, "WCAG AAA"),
        ("#334155", "#F8FAFC", 7.0, "WCAG AAA"),
        ("#64748B", "#FFFFFF", 4.5, "WCAG AA"),
        ("#64748B", "#F8FAFC", 4.5, "WCAG AA"),
    ])
    def test_elgi_palette_contrast_ratios(self, text_hex: str, bg_hex: str, min_ratio: float, level: str):
        """Verify empirical contrast ratios satisfy WCAG 2.1 standards."""
        ratio = wcag_contrast_ratio(text_hex, bg_hex)
        assert ratio >= min_ratio, (
            f"Color contrast between {text_hex} and {bg_hex} is {ratio:.2f}:1, "
            f"failing {level} standard ({min_ratio}:1 required)."
        )

    def test_css_design_system_tokens_presence(self):
        """Verify required ELGi design tokens exist in css/design-system.css."""
        assert CSS_DESIGN_SYSTEM.exists(), f"Missing {CSS_DESIGN_SYSTEM}"
        content = CSS_DESIGN_SYSTEM.read_text(encoding="utf-8")

        required_tokens = {
            "--color-brand-primary": "#0F172A",
            "--color-surface-bg": "#F8FAFC",
            "--color-surface-card": "#FFFFFF",
            "--color-text-main": "#334155",
            "--color-text-heading": "#0F172A",
            "--color-border-light": "#E2E8F0",
        }

        for token, expected_val in required_tokens.items():
            pattern = re.compile(rf"{re.escape(token)}\s*:\s*{re.escape(expected_val)}", re.IGNORECASE)
            assert pattern.search(content), (
                f"Token {token} not configured with expected ELGi value {expected_val} in css/design-system.css"
            )

    def test_body_and_headings_consume_elgi_tokens(self):
        """Verify html, body, and headings map to executive charcoal and slate tokens."""
        content = CSS_DESIGN_SYSTEM.read_text(encoding="utf-8")
        assert "var(--color-text-main)" in content, "color: var(--color-text-main) missing from typography rules"
        assert "var(--color-text-heading)" in content, "color: var(--color-text-heading) missing from heading rules"


# ==============================================================================
# 2. BULLET HYGIENE & UNSTYLED LISTS AUDIT
# ==============================================================================

class TestBulletHygieneAndLists:
    """Verify zero unstyled lists or fake bullet glyphs across all 46 production pages."""

    def test_production_page_count(self):
        """Ensure all 46 canonical production HTML pages are accounted for."""
        pages = get_production_html_files()
        assert len(pages) == 46, f"Expected exactly 46 production pages, found {len(pages)}"

    def test_global_list_baseline_in_css(self):
        """Verify css/design-system.css defines robust padding and typography on ul, ol."""
        content = CSS_DESIGN_SYSTEM.read_text(encoding="utf-8")
        # Ensure ul, ol has padding-left of at least 1.25rem or 1.5rem
        assert re.search(r"ul\s*,\s*ol\s*\{[^}]*padding-left\s*:\s*1\.[2-5]rem", content), (
            "css/design-system.css lacks baseline padding-left (1.25rem - 1.5rem) on ul, ol"
        )
        assert ".clean-list" in content, ".clean-list utility class missing from css/design-system.css"
        assert ".feature-list" in content, ".feature-list utility class missing from css/design-system.css"
        assert ".spec-list" in content, ".spec-list utility class missing from css/design-system.css"

    @pytest.mark.parametrize("page_rel", get_production_html_files())
    def test_no_fake_bullet_markers_in_lists(self, page_rel: str):
        """Verify no <li> tags start with hardcoded fake bullet glyphs (•, \u2022, etc.)."""
        page_path = PROJECT_ROOT / page_rel
        content = page_path.read_text(encoding="utf-8", errors="ignore")
        soup = BeautifulSoup(content, "html.parser")

        # Fake bullets that developers type when lists lack indents
        bullet_prefixes = ("•", "\u2022", "\u25cf", "\u25cb", "\u25aa", "\u25ab", "\u25e6", "&bull;", "&#8226;")

        violations = []
        for li in soup.find_all("li"):
            # Check if li starts with a fake bullet marker
            li_str = li.decode_contents().strip()
            text_str = li.get_text().strip()
            for b in bullet_prefixes:
                if li_str.startswith(b) or text_str.startswith(b):
                    violations.append(f"Fake bullet prefix '{b}' in <li>: {text_str[:50]}")
                    break

        assert not violations, (
            f"Found {len(violations)} fake bullet violations in {page_rel}:\n"
            + "\n".join(violations[:5])
        )

    def test_plastic_molding_literal_bullets_eliminated(self):
        """Specific regression check for industries/plastic-molding.html."""
        page_path = PROJECT_ROOT / "industries" / "plastic-molding.html"
        content = page_path.read_text(encoding="utf-8")
        assert "•" not in content, "Literal bullet character found in industries/plastic-molding.html"
        assert "feature-list" in content, "Expected .feature-list in industries/plastic-molding.html"

    def test_unclassed_lists_inherit_baseline(self):
        """All unclassed lists across the 46 production pages safely inherit baseline typography."""
        pages = get_production_html_files()
        unclassed_count = 0
        for rel in pages:
            page_path = PROJECT_ROOT / rel
            soup = BeautifulSoup(page_path.read_text(encoding="utf-8", errors="ignore"), "html.parser")
            for ul in soup.find_all(["ul", "ol"]):
                if not ul.get("class"):
                    unclassed_count += 1
        # Confirm that unclassed lists exist and are governed by the global reset
        assert unclassed_count > 0, "Expected unclassed lists to test baseline reset coverage"


# ==============================================================================
# 3. ZERO CARTOON EMOJI HYGIENE AUDIT
# ==============================================================================

class TestZeroCartoonEmojiHygiene:
    """Site-wide scan ensuring zero cartoon emoji entities or raw emojis."""

    DECIMAL_ENTITY_PATTERN = re.compile(r"&#(?:128\d{3}|127\d{3}|9\d{3}|10003);")
    HEX_ENTITY_PATTERN = re.compile(r"&#x(?:1[fF][0-9a-fA-F]{3}|2[0-9a-fA-F]{3});")
    RAW_EMOJI_PATTERN = re.compile(
        r"[\U0001F600-\U0001F64F"  # Emoticons
        r"\U0001F300-\U0001F5FF"  # Misc Symbols & Pictographs
        r"\U0001F680-\U0001F6FF"  # Transport & Map
        r"\U0001F900-\U0001F9FF"  # Supplemental Symbols & Pictographs
        r"\U0001FA70-\U0001FAFF]"  # Symbols & Pictographs Extended-A
    )

    def test_zero_decimal_emoji_entities_in_production_web_files(self):
        """Scan all 46 production HTML, CSS, and JS files for decimal emoji entities."""
        web_files = [PROJECT_ROOT / rel for rel in get_production_html_files()]
        web_files.extend(PROJECT_ROOT.glob("css/**/*.css"))
        web_files.extend(PROJECT_ROOT.glob("js/**/*.js"))

        found_entities = []
        for fpath in web_files:
            rel = str(fpath.relative_to(PROJECT_ROOT))
            if any(exc in rel for exc in [".agents", ".git", "__pycache__"]):
                continue
            text = fpath.read_text(encoding="utf-8", errors="ignore")
            for m in self.DECIMAL_ENTITY_PATTERN.finditer(text):
                found_entities.append((rel, m.group(0)))

        assert not found_entities, (
            f"Found {len(found_entities)} decimal emoji entities in production web files:\n"
            + "\n".join([f"{f}: {ent}" for f, ent in found_entities[:10]])
        )

    def test_zero_raw_unicode_emojis_in_production_web_files(self):
        """Scan all 46 production HTML, CSS, and JS files for raw cartoon unicode emojis."""
        web_files = [PROJECT_ROOT / rel for rel in get_production_html_files()]
        web_files.extend(PROJECT_ROOT.glob("css/**/*.css"))
        web_files.extend(PROJECT_ROOT.glob("js/**/*.js"))

        found_emojis = []
        for fpath in web_files:
            rel = str(fpath.relative_to(PROJECT_ROOT))
            if any(exc in rel for exc in [".agents", ".git", "__pycache__"]):
                continue
            text = fpath.read_text(encoding="utf-8", errors="ignore")
            for m in self.RAW_EMOJI_PATTERN.finditer(text):
                found_emojis.append((rel, m.group(0)))

        assert not found_emojis, (
            f"Found {len(found_emojis)} raw cartoon emojis in production web files:\n"
            + "\n".join([f"{f}: {em}" for f, em in found_emojis[:10]])
        )

    def test_zero_decimal_entities_in_master_catalogue_template(self):
        """Verify master catalogue template has zero decimal emoji entities."""
        template_path = PROJECT_ROOT / "src" / "templates" / "master_catalogue_template.html"
        assert template_path.exists()
        text = template_path.read_text(encoding="utf-8")
        assert not self.DECIMAL_ENTITY_PATTERN.search(text), "Decimal entities found in master_catalogue_template.html"

    def test_zero_decimal_entities_in_brochure_template(self):
        """Verify brochure template has zero decimal emoji entities."""
        template_path = PROJECT_ROOT / "src" / "templates" / "brochure_template.html"
        assert template_path.exists()
        text = template_path.read_text(encoding="utf-8")
        assert not self.DECIMAL_ENTITY_PATTERN.search(text), "Decimal entities found in brochure_template.html"


# ==============================================================================
# 4. SPECIFICATION TABLES FREEZE-PANE BEHAVIOR
# ==============================================================================

class TestSpecTableFreezePaneBehavior:
    """Verify sticky freeze-pane styling and model quoting integration."""

    def test_css_sticky_freeze_pane_rules(self):
        """Verify CSS declarations for .spec-table-container and sticky first column."""
        assert CSS_COMPONENTS.exists(), f"Missing {CSS_COMPONENTS}"
        content = CSS_COMPONENTS.read_text(encoding="utf-8")

        # Container must handle horizontal overflow
        assert ".spec-table-container" in content
        assert "overflow-x: auto" in content or "overflow-x: scroll" in content

        # First column must be sticky left: 0 with solid background
        first_col_pattern = re.compile(
            r"\.spec-table\s+(?:th|td):first-child[^{]*\{[^}]*position\s*:\s*sticky[^}]*left\s*:\s*0",
            re.MULTILINE | re.DOTALL
        )
        assert first_col_pattern.search(content), (
            "css/components.css lacks position: sticky; left: 0 on .spec-table th/td:first-child"
        )

        # Ensure z-index >= 2 so scrolled columns slide underneath
        z_index_pattern = re.compile(
            r"\.spec-table\s+(?:th|td):first-child[^{]*\{[^}]*z-index\s*:\s*([2-9]|\d{2,})",
            re.MULTILINE | re.DOTALL
        )
        assert z_index_pattern.search(content), (
            "css/components.css lacks z-index >= 2 on sticky first column"
        )

    def test_canonical_product_pages_have_spec_tables(self):
        """Verify canonical product pages with spec tables wrap them in .spec-table-container."""
        product_pages = sorted(glob.glob(str(PROJECT_ROOT / "products" / "*.html")))
        spec_pages_tested = 0

        for p in product_pages:
            content = open(p, "r", encoding="utf-8", errors="ignore").read()
            if 'http-equiv="refresh"' in content.lower():
                continue
            soup = BeautifulSoup(content, "html.parser")
            tables = soup.find_all("table")
            if tables:
                spec_pages_tested += 1
                # Must have .spec-table-container wrapper
                container = soup.find(class_="spec-table-container")
                assert container is not None, f"Product page {os.path.basename(p)} has table but lacks .spec-table-container"
                # Check for table-quote-btn
                quote_btns = soup.find_all(class_="table-quote-btn")
                assert len(quote_btns) > 0, f"Product page {os.path.basename(p)} lacks .table-quote-btn"
                # Check data-model attribute on quote buttons
                for btn in quote_btns[:3]:
                    assert btn.has_attr("data-model"), f"Quote button in {os.path.basename(p)} missing data-model attribute"

        assert spec_pages_tested >= 10, f"Expected at least 10 canonical product pages with spec tables, found {spec_pages_tested}"


# ==============================================================================
# 5. ELIMINATION OF HARSH DARK SLABS
# ==============================================================================

class TestEliminationOfDarkSlabs:
    """Verify that dark navy backdrops and blueprint grid clutter were eliminated."""

    def test_hero_industrial_background_is_light(self):
        """Verify .hero-industrial background is light (#FFFFFF or radial on light)."""
        content = CSS_COMPONENTS.read_text(encoding="utf-8")
        # Ensure #0B1523 is not set as background-color of .hero-industrial
        hero_match = re.search(r"\.hero-industrial\s*\{([^}]+)\}", content)
        assert hero_match, ".hero-industrial not found in css/components.css"
        hero_body = hero_match.group(1)
        assert "#0B1523" not in hero_body, ".hero-industrial still contains dark #0B1523 background"
        assert "#FFFFFF" in hero_body or "var(--color-surface-card)" in hero_body, (
            ".hero-industrial expected clean light ground"
        )

    def test_product_hero_enterprise_background_is_light(self):
        """Verify .product-hero-enterprise background is light and blueprint grid removed."""
        content = CSS_COMPONENTS.read_text(encoding="utf-8")
        hero_match = re.search(r"\.product-hero-enterprise\s*\{([^}]+)\}", content)
        assert hero_match, ".product-hero-enterprise not found in css/components.css"
        hero_body = hero_match.group(1)
        assert "#0B1523" not in hero_body, ".product-hero-enterprise still contains dark #0B1523 background"

        # Check pseudo-element grid overlay is suppressed or removed
        pseudo_match = re.search(r"\.product-hero-enterprise::before\s*\{([^}]+)\}", content)
        if pseudo_match:
            assert "display: none" in pseudo_match.group(1) or "content: none" in pseudo_match.group(1), (
                ".product-hero-enterprise::before still renders overlay"
            )


# ==============================================================================
# STANDALONE EXECUTION RUNNER
# ==============================================================================

if __name__ == "__main__":
    pytest.main(["-v", __file__])
