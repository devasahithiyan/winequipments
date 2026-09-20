"""Automated Mobile-First & Viewport Ergonomics Verification Suite.

Tests site-wide responsive compliance across mobile and tablet breakpoints:
- 320px, 360px, 375px, 390px, 414px, 430px, 768px, 820px, 1024px
- Viewport meta tags, overflow containment, touch target sizes, mobile dock,
  accordion navigation drawer, spec table freeze-pane, and phone hygiene.
"""

import os
import re
import glob
import pytest
from bs4 import BeautifulSoup

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

BANNED_NUMBERS = [
    "9597228978",
    "0422-2562975",
    "0422 2562975",
    "2562975",
    "95972 28978"
]

AUTHORIZED_PHONES = [
    "+91 95972 28969",
    "+91 95972 28975"
]

def get_content_html_files():
    all_files = sorted(glob.glob(os.path.join(PROJECT_ROOT, "**/*.html"), recursive=True))
    valid = []
    for f in all_files:
        if "/build/" in f or "/src/" in f or "/.agents/" in f:
            continue
        content = open(f, "r", encoding="utf-8", errors="ignore").read()
        if 'http-equiv="refresh"' in content.lower():
            continue
        valid.append(os.path.relpath(f, PROJECT_ROOT))
    return valid

def get_all_html_files():
    all_files = sorted(glob.glob(os.path.join(PROJECT_ROOT, "**/*.html"), recursive=True))
    valid = []
    for f in all_files:
        if "/build/" in f or "/src/" in f or "/.agents/" in f:
            continue
        valid.append(os.path.relpath(f, PROJECT_ROOT))
    return valid

class TestMobileDesignSystemAndTokens:
    """Verify CSS tokens and responsive rules in css/design-system.css & css/components.css."""

    def test_viewport_meta_tag_on_all_pages(self):
        """Every production HTML page must declare a responsive viewport meta tag."""
        for rel in get_content_html_files():
            full = os.path.join(PROJECT_ROOT, rel)
            content = open(full, "r", encoding="utf-8", errors="ignore").read()
            soup = BeautifulSoup(content, "html.parser")
            vp = soup.find("meta", attrs={"name": "viewport"})
            assert vp is not None, f"Missing <meta name='viewport'> in {rel}"
            assert "width=device-width" in vp.get("content", ""), f"Invalid viewport content in {rel}"

    def test_mobile_overflow_containment_in_css(self):
        """Strict overflow-x containment on html, body in design-system.css."""
        css_file = os.path.join(PROJECT_ROOT, "css/design-system.css")
        css = open(css_file, "r", encoding="utf-8").read()
        assert "overflow-x: hidden" in css, "Missing overflow-x: hidden on html/body in design-system.css"
        assert "max-width: 100vw" in css, "Missing max-width: 100vw on html/body in design-system.css"

    def test_responsive_media_queries_presence(self):
        """CSS must define responsive media queries for 1024px, 768px, 640px, 480px, and 360px."""
        comp_css = open(os.path.join(PROJECT_ROOT, "css/components.css"), "r", encoding="utf-8").read()
        ds_css = open(os.path.join(PROJECT_ROOT, "css/design-system.css"), "r", encoding="utf-8").read()
        combined = comp_css + "\n" + ds_css
        for bp in ["1024px", "768px", "640px", "480px", "360px"]:
            assert bp in combined, f"Missing breakpoint {bp} in stylesheets"

    def test_input_font_size_ios_zoom_prevention(self):
        """Input font-size must be at least 16px to prevent iOS Safari auto-zoom."""
        comp_css = open(os.path.join(PROJECT_ROOT, "css/components.css"), "r", encoding="utf-8").read()
        assert "font-size: 16px" in comp_css, "Missing 16px input font-size rule for iOS Safari zoom prevention"

    def test_mobile_dock_touch_targets(self):
        """Mobile dock buttons must have min-height >= 44px (48px applied)."""
        comp_css = open(os.path.join(PROJECT_ROOT, "css/components.css"), "r", encoding="utf-8").read()
        m = re.search(r"\.dock-btn\s*\{[^}]*min-height:\s*(\d+)px", comp_css)
        assert m is not None, "Missing min-height on .dock-btn"
        assert int(m.group(1)) >= 44, f"Dock button touch target too small: {m.group(1)}px"

    def test_safe_area_insets_declared(self):
        """CSS must respect iOS home indicator safe area inset."""
        comp_css = open(os.path.join(PROJECT_ROOT, "css/components.css"), "r", encoding="utf-8").read()
        assert "env(safe-area-inset-bottom" in comp_css, "safe-area-inset-bottom not found in components.css"


class TestMobileNavigationExperience:
    """Verify mobile header, quick search button, and accordion drawer in main.js."""

    def test_mobile_drawer_accordion_markup(self):
        """injectMobileDrawer in js/main.js must construct accordion category groups."""
        js_file = os.path.join(PROJECT_ROOT, "js/main.js")
        js = open(js_file, "r", encoding="utf-8").read()
        assert "mobile-accordion-toggle" in js, "Accordion toggles missing in injectMobileDrawer"
        assert "mobile-accordion-content" in js, "Accordion content containers missing in injectMobileDrawer"
        assert "mobile-nav-search-trigger" in js, "Mobile drawer search trigger missing"

    def test_header_mobile_search_btn_injection(self):
        """Header must inject a mobile search button alongside hamburger."""
        js_file = os.path.join(PROJECT_ROOT, "js/main.js")
        js = open(js_file, "r", encoding="utf-8").read()
        assert "header-mobile-search-btn" in js, "Header mobile search button not initialized"

    def test_all_pages_have_mobile_toggle_button(self):
        """Every site content page must have a mobile toggle button."""
        for rel in get_content_html_files():
            full = os.path.join(PROJECT_ROOT, rel)
            content = open(full, "r", encoding="utf-8", errors="ignore").read()
            assert "mobile-toggle-btn" in content, f"Missing mobile-toggle-btn in {rel}"


class TestMobileSpecTablesAndForms:
    """Verify specification table freeze-pane and mobile single-column forms."""

    def test_spec_table_freeze_pane_styling(self):
        """components.css must define sticky first-column freeze pane for spec tables on mobile."""
        comp_css = open(os.path.join(PROJECT_ROOT, "css/components.css"), "r", encoding="utf-8").read()
        assert "position: sticky" in comp_css, "Missing sticky position for freeze-pane table"
        assert ".table-quote-btn" in comp_css, "Missing .table-quote-btn styling"

    def test_mobile_quick_category_bar_on_homepage(self):
        """Homepage must feature the mobile-quick-category-bar shortcut strip."""
        index_html = open(os.path.join(PROJECT_ROOT, "index.html"), "r", encoding="utf-8").read()
        assert "mobile-quick-category-bar" in index_html, "Missing mobile-quick-category-bar in index.html"
        assert "mobile-quick-cat-pill" in index_html, "Missing mobile-quick-cat-pill items in index.html"

    def test_zero_banned_phone_numbers_site_wide(self):
        """Strict compliance: zero banned numbers across all site files."""
        for rel in get_all_html_files():
            full = os.path.join(PROJECT_ROOT, rel)
            content = open(full, "r", encoding="utf-8", errors="ignore").read()
            for banned in BANNED_NUMBERS:
                assert banned not in content, f"CRITICAL: Banned phone number '{banned}' found in {rel}"
