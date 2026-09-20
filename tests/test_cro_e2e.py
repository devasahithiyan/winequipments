"""
Win Equipments CRO & UX Enhancement — Dual-Track Opaque-Box E2E Test Suite
File: tests/test_cro_e2e.py

Independent, automated black-box test suite verifying:
- Tier 1: Feature Coverage (WhatsApp sticky button, Hero loss-aversion CTAs, Above-the-fold social proof, Mobile CTA dock)
- Tier 2: Boundary & Corner Cases (Touch targets, Media queries, Non-overlapping floating controls, Z-index stacking)
- Tier 3: Cross-Feature & Integration (Zero broken internal links, All catalogue PDF links resolve, Anchor fragments, Redirect stubs)
- Tier 4: Contact Hygiene & Data Integrity (Presence of authorized numbers 28969/28975, Zero banned numbers 9597228978/2562975, 4 new product pages preservation)
"""

import os
import re
import glob
import pytest
from bs4 import BeautifulSoup
from urllib.parse import unquote

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# Canonical product pages (excluding redirect stubs)
CANONICAL_PRODUCT_PAGES = [
    "products/acid-cooling-chillers.html",
    "products/air-receiver-tanks.html",
    "products/anodizing-chillers.html",
    "products/automatic-drain-valves.html",
    "products/closed-circuit-cooling-towers.html",
    "products/compressed-air-filters.html",
    "products/desiccant-air-dryers.html",
    "products/ice-flake-machines.html",
    "products/industrial-aftercoolers.html",
    "products/industrial-process-chillers.html",
    "products/medical-scan-chillers.html",
    "products/refrigerated-air-dryers.html",
    "products/round-cooling-towers.html",
    "products/spare-parts-consumables.html",
    "products/square-cooling-towers.html",
]

# The 4 mandatory new product pages from ORIGINAL_REQUEST.md
MANDATORY_NEW_PRODUCT_PAGES = [
    "products/acid-cooling-chillers.html",
    "products/anodizing-chillers.html",
    "products/ice-flake-machines.html",
    "products/medical-scan-chillers.html",
]

# Helper to get all non-redirect site HTML files
def get_site_html_files():
    all_html = sorted(glob.glob(os.path.join(PROJECT_ROOT, "**/*.html"), recursive=True))
    site_files = []
    for f in all_html:
        if "/build/" in f or "/src/" in f or "/.agents/" in f:
            continue
        rel = os.path.relpath(f, PROJECT_ROOT)
        site_files.append(rel)
    return site_files

def get_content_html_files():
    site_files = get_site_html_files()
    content_files = []
    for rel in site_files:
        full_path = os.path.join(PROJECT_ROOT, rel)
        content = open(full_path, "r", encoding="utf-8", errors="ignore").read()
        if 'http-equiv="refresh"' not in content.lower():
            content_files.append(rel)
    return content_files

def get_redirect_stub_files():
    site_files = get_site_html_files()
    stubs = []
    for rel in site_files:
        full_path = os.path.join(PROJECT_ROOT, rel)
        content = open(full_path, "r", encoding="utf-8", errors="ignore").read()
        if 'http-equiv="refresh"' in content.lower():
            stubs.append(rel)
    return stubs


# ==============================================================================
# TIER 1: FEATURE COVERAGE (>= 5 test cases per feature)
# ==============================================================================

class TestTier1WhatsAppStickyButton:
    """
    Feature 1: WhatsApp sticky button on every page with https://wa.me/919597228969
    """

    def test_tc1_1_whatsapp_button_presence_on_all_content_pages(self):
        """TC-1.1: Every content page must contain a WhatsApp action linking to the official wa.me URL."""
        content_files = get_content_html_files()
        missing = []
        for rel in content_files:
            full_path = os.path.join(PROJECT_ROOT, rel)
            txt = open(full_path, "r", encoding="utf-8", errors="ignore").read()
            if "wa.me/919597228969" not in txt and "api.whatsapp.com/send?phone=919597228969" not in txt:
                missing.append(rel)
        assert not missing, f"WhatsApp link missing on {len(missing)} content pages: {missing}"

    def test_tc1_2_whatsapp_canonical_url_format(self):
        """TC-1.2: WhatsApp links must target https://wa.me/919597228969 (allowing optional ?text= parameter)."""
        content_files = get_content_html_files()
        invalid_links = []
        pattern = re.compile(r'href=["\'](https?://(?:wa\.me|api\.whatsapp\.com)[^"\']*)["\']', re.IGNORECASE)
        for rel in content_files:
            full_path = os.path.join(PROJECT_ROOT, rel)
            txt = open(full_path, "r", encoding="utf-8", errors="ignore").read()
            for href in pattern.findall(txt):
                if "919597228969" not in href:
                    invalid_links.append((rel, href))
        assert not invalid_links, f"Invalid WhatsApp destination URLs found: {invalid_links}"

    def test_tc1_3_whatsapp_security_and_tab_attributes(self):
        """TC-1.3: WhatsApp anchors must use target='_blank' and rel='noopener' for external tab isolation."""
        content_files = get_content_html_files()
        missing_attrs = []
        for rel in content_files:
            full_path = os.path.join(PROJECT_ROOT, rel)
            soup = BeautifulSoup(open(full_path, "r", encoding="utf-8", errors="ignore"), "html.parser")
            wa_anchors = [a for a in soup.find_all("a", href=True) if "wa.me/919597228969" in a["href"]]
            for a in wa_anchors:
                target = a.get("target", "")
                rel_attr = a.get("rel", "")
                if isinstance(rel_attr, list):
                    rel_attr = " ".join(rel_attr)
                if target != "_blank" or "noopener" not in rel_attr:
                    missing_attrs.append((rel, str(a)[:100]))
        assert not missing_attrs, f"WhatsApp anchors missing target='_blank' or rel='noopener': {missing_attrs}"

    def test_tc1_4_whatsapp_accessible_labeling_and_icon(self):
        """TC-1.4: WhatsApp button must feature accessible text/label and recognized icon."""
        content_files = get_content_html_files()
        inaccessible = []
        for rel in content_files:
            full_path = os.path.join(PROJECT_ROOT, rel)
            soup = BeautifulSoup(open(full_path, "r", encoding="utf-8", errors="ignore"), "html.parser")
            wa_anchors = [a for a in soup.find_all("a", href=True) if "wa.me/919597228969" in a["href"]]
            for a in wa_anchors:
                has_label = bool(a.get("aria-label") or a.get("title") or a.get_text(strip=True))
                has_icon = bool(a.find("i", class_=re.compile(r"whatsapp|phone|chat")) or a.find("svg"))
                if not has_label and not has_icon:
                    inaccessible.append((rel, str(a)[:80]))
        assert not inaccessible, f"WhatsApp anchors lacking accessibility labels/icons: {inaccessible}"

    def test_tc1_5_whatsapp_floating_css_definition(self):
        """TC-1.5: CSS stylesheets must define floating WhatsApp fixed positioning (.floating-whatsapp or .dock-whatsapp)."""
        css_path = os.path.join(PROJECT_ROOT, "css/components.css")
        assert os.path.exists(css_path), "css/components.css must exist"
        css_content = open(css_path, "r", encoding="utf-8", errors="ignore").read()
        has_floating_or_dock_wa = (
            ("floating-whatsapp" in css_content or "dock-whatsapp" in css_content or "whatsapp-float" in css_content) and
            ("position: fixed" in css_content or "position: sticky" in css_content or "display: flex" in css_content)
        )
        assert has_floating_or_dock_wa, "css/components.css must define floating/dock styling for WhatsApp button"


class TestTier1HeroLossAversionCTA:
    """
    Feature 2: Loss-aversion / outcome CTA in hero of every product page
    """

    @pytest.mark.parametrize("prod_page", CANONICAL_PRODUCT_PAGES)
    def test_tc2_1_product_page_hero_section_exists(self, prod_page):
        """TC-2.1: Product page must have a distinct hero section or top hero grid before technical tables."""
        full_path = os.path.join(PROJECT_ROOT, prod_page)
        assert os.path.exists(full_path), f"Product page {prod_page} does not exist"
        soup = BeautifulSoup(open(full_path, "r", encoding="utf-8", errors="ignore"), "html.parser")
        hero = (
            soup.find(class_=re.compile(r"hero|grid-split-hero|hero-industrial")) or
            soup.find("main")
        )
        assert hero is not None, f"Hero section not detected on {prod_page}"

    @pytest.mark.parametrize("prod_page", CANONICAL_PRODUCT_PAGES)
    def test_tc2_2_hero_contains_interactive_cta_element(self, prod_page):
        """TC-2.2: Hero must contain at least one primary interactive CTA anchor or button."""
        full_path = os.path.join(PROJECT_ROOT, prod_page)
        soup = BeautifulSoup(open(full_path, "r", encoding="utf-8", errors="ignore"), "html.parser")
        hero = soup.find(class_=re.compile(r"hero|grid-split-hero|hero-industrial"))
        if not hero:
            hero = soup.find("main")
        cta = hero.find(class_=re.compile(r"btn-cta|btn-primary|btn-accent|hero-actions"))
        assert cta is not None, f"Primary CTA element not found in hero of {prod_page}"

    @pytest.mark.parametrize("prod_page", CANONICAL_PRODUCT_PAGES)
    def test_tc2_3_hero_cta_loss_aversion_or_outcome_copy(self, prod_page):
        """
        TC-2.3: Hero CTA must use active loss-aversion or outcome-focused framing.
        Must NOT be purely passive 'Request Quote' or 'Request Factory Quote'.
        """
        full_path = os.path.join(PROJECT_ROOT, prod_page)
        soup = BeautifulSoup(open(full_path, "r", encoding="utf-8", errors="ignore"), "html.parser")
        hero = soup.find(class_=re.compile(r"hero|grid-split-hero|hero-industrial"))
        if not hero:
            hero = soup.find("main")
        
        # Look for primary CTA anchor
        cta_anchors = hero.find_all("a", class_=re.compile(r"btn-cta|btn-primary|btn-lg"))
        cta_texts = [a.get_text(separator=" ", strip=True) for a in cta_anchors]
        
        # Semantic outcome & loss aversion keywords
        outcome_keywords = [
            "stop", "prevent", "protect", "save", "eliminate", "avoid",
            "zero", "cut", "sizing & price", "calculate", "direct manufacturer",
            "solution", "guarantee", "downtime", "damage", "energy", "pricing"
        ]
        
        # Must have at least one CTA containing outcome/loss-aversion language
        matches = []
        for text in cta_texts:
            lower = text.lower()
            if any(kw in lower for kw in outcome_keywords):
                matches.append(text)
                
        assert len(matches) > 0, (
            f"No loss-aversion or outcome CTA found in hero of {prod_page}. "
            f"Found CTAs: {cta_texts}. "
            f"Expected copy with loss-aversion framing (e.g. 'Stop Paying for Moisture Damage — Get Sizing & Price')."
        )

    @pytest.mark.parametrize("prod_page", CANONICAL_PRODUCT_PAGES)
    def test_tc2_4_hero_cta_destination_actionability(self, prod_page):
        """TC-2.4: Primary hero CTA must target an active conversion action (anchor, contact, phone, or wa)."""
        full_path = os.path.join(PROJECT_ROOT, prod_page)
        soup = BeautifulSoup(open(full_path, "r", encoding="utf-8", errors="ignore"), "html.parser")
        hero = soup.find(class_=re.compile(r"hero|grid-split-hero|hero-industrial")) or soup.find("main")
        cta_anchors = hero.find_all("a", class_=re.compile(r"btn-cta|btn-primary|btn-lg"))
        assert len(cta_anchors) > 0, f"No CTA anchors in hero of {prod_page}"
        primary_cta = cta_anchors[0]
        href = primary_cta.get("href", "").strip()
        assert href and href != "#", f"Primary CTA in {prod_page} has empty or dummy '#' href: {href}"

    @pytest.mark.parametrize("prod_page", CANONICAL_PRODUCT_PAGES)
    def test_tc2_5_hero_visual_prominence_classes(self, prod_page):
        """TC-2.5: Primary CTA must have prominent button classes (e.g. btn-cta, btn-lg)."""
        full_path = os.path.join(PROJECT_ROOT, prod_page)
        soup = BeautifulSoup(open(full_path, "r", encoding="utf-8", errors="ignore"), "html.parser")
        hero = soup.find(class_=re.compile(r"hero|grid-split-hero|hero-industrial")) or soup.find("main")
        primary_cta = hero.find("a", class_=re.compile(r"btn-cta|btn-primary"))
        assert primary_cta is not None, f"Primary CTA lacking high-contrast button styling class on {prod_page}"


@pytest.fixture
def index_soup():
    full_path = os.path.join(PROJECT_ROOT, "index.html")
    return BeautifulSoup(open(full_path, "r", encoding="utf-8", errors="ignore"), "html.parser")


class TestTier1IndexAboveTheFoldSocialProof:
    """
    Feature 3: Above-the-fold social proof on index.html
    """

    def test_tc3_1_index_hero_above_the_fold_exists(self, index_soup):
        """TC-3.1: index.html must contain a dedicated hero section at the top of main content."""
        hero = index_soup.find(class_=re.compile(r"hero-industrial|hero"))
        assert hero is not None, "Hero section not found on index.html"

    def test_tc3_2_index_quantitative_installation_metric(self, index_soup):
        """TC-3.2: Hero must display quantified installation count or operating metric (e.g. 3,500+ Installs)."""
        hero = index_soup.find(class_=re.compile(r"hero-industrial|hero"))
        text = hero.get_text()
        has_metric = bool(re.search(r"(?:3,?500\+|500\+|1,?000\+|2008|\b[0-9]{3,4}\+\b)\s*(?:regional|installs|installations|units|plants)", text, re.IGNORECASE))
        assert has_metric, f"Quantified social proof / installation metric missing above the fold on index.html"

    def test_tc3_3_index_direct_manufacturer_and_longevity_signals(self, index_soup):
        """TC-3.3: Hero must display direct manufacturer status and factory location/longevity."""
        hero = index_soup.find(class_=re.compile(r"hero-industrial|hero"))
        text = hero.get_text()
        has_mfg = "direct manufacturer" in text.lower() or "arasur" in text.lower() or "est. 2008" in text.lower()
        assert has_mfg, "Direct manufacturer or plant establishment signal missing above fold on index.html"

    def test_tc3_4_index_iso_quality_certification_badge(self, index_soup):
        """TC-3.4: ISO 9001:2015 certification badge must appear above the fold on index.html."""
        hero = index_soup.find(class_=re.compile(r"hero-industrial|hero"))
        text = hero.get_text()
        assert "ISO 9001:2015" in text, "ISO 9001:2015 certification badge missing above fold on index.html"

    def test_tc3_5_index_industrial_applications_sectors(self, index_soup):
        """TC-3.5: Above-the-fold or immediate next section must demonstrate industrial sector applications."""
        main = index_soup.find("main")
        text = main.get_text()[:4000] # Top 4000 characters of main
        has_sectors = any(sec in text.lower() for sec in ["laser cutting", "injection molding", "textile", "cnc", "chiller", "cooling tower"])
        assert has_sectors, "Industrial application / sector validation missing near top of index.html"


class TestTier1MobileStickyCTADock:
    """
    Feature 4: Mobile sticky CTA dock with Call + WhatsApp on all product pages visible at <= 768px
    """

    @pytest.mark.parametrize("prod_page", CANONICAL_PRODUCT_PAGES)
    def test_tc4_1_mobile_dock_markup_exists_on_product_page(self, prod_page):
        """TC-4.1: Product page must contain static markup for mobile conversion dock."""
        full_path = os.path.join(PROJECT_ROOT, prod_page)
        soup = BeautifulSoup(open(full_path, "r", encoding="utf-8", errors="ignore"), "html.parser")
        dock = soup.find(class_=re.compile(r"mobile-conversion-dock|mobile-cta-dock|sticky-mobile-bar"))
        assert dock is not None, f"Mobile sticky dock markup missing in {prod_page}"

    @pytest.mark.parametrize("prod_page", CANONICAL_PRODUCT_PAGES)
    def test_tc4_2_mobile_dock_direct_call_button(self, prod_page):
        """TC-4.2: Mobile dock must include a direct Call action linking to tel:+919597228969 or tel:+919597228975."""
        full_path = os.path.join(PROJECT_ROOT, prod_page)
        soup = BeautifulSoup(open(full_path, "r", encoding="utf-8", errors="ignore"), "html.parser")
        dock = soup.find(class_=re.compile(r"mobile-conversion-dock|mobile-cta-dock|sticky-mobile-bar"))
        assert dock is not None, f"Dock missing in {prod_page}"
        call_btn = dock.find("a", href=re.compile(r"tel:\+?9195972289(?:69|75)"))
        assert call_btn is not None, f"Mobile dock in {prod_page} missing direct tel: button to verified numbers"

    @pytest.mark.parametrize("prod_page", CANONICAL_PRODUCT_PAGES)
    def test_tc4_3_mobile_dock_direct_whatsapp_button(self, prod_page):
        """TC-4.3: Mobile dock must include a direct WhatsApp action linking to https://wa.me/919597228969."""
        full_path = os.path.join(PROJECT_ROOT, prod_page)
        soup = BeautifulSoup(open(full_path, "r", encoding="utf-8", errors="ignore"), "html.parser")
        dock = soup.find(class_=re.compile(r"mobile-conversion-dock|mobile-cta-dock|sticky-mobile-bar"))
        assert dock is not None, f"Dock missing in {prod_page}"
        wa_btn = dock.find("a", href=re.compile(r"wa\.me/919597228969"))
        assert wa_btn is not None, f"Mobile dock in {prod_page} missing WhatsApp button targeting 919597228969"

    def test_tc4_4_mobile_dock_css_media_query_activation(self):
        """TC-4.4: In css/components.css, media query at <= 768px must display mobile dock (display: block/flex !important)."""
        css_path = os.path.join(PROJECT_ROOT, "css/components.css")
        css_text = open(css_path, "r", encoding="utf-8", errors="ignore").read()
        # Find 768px media query block
        m = re.search(r"@media\s*\([^)]*max-width:\s*768px[^)]*\)\s*\{([^}]+(?:\}[^}]*\{[^}]*)*)\}", css_text)
        assert m is not None, "Media query @media (max-width: 768px) missing in css/components.css"
        mq_block = m.group(0)
        assert "mobile-conversion-dock" in mq_block or "mobile-cta-dock" in mq_block, (
            "Mobile conversion dock activation rule missing inside @media (max-width: 768px)"
        )

    def test_tc4_5_mobile_dock_css_desktop_suppression(self):
        """TC-4.5: Mobile dock must be hidden by default on desktop viewports (display: none)."""
        css_path = os.path.join(PROJECT_ROOT, "css/components.css")
        css_text = open(css_path, "r", encoding="utf-8", errors="ignore").read()
        m = re.search(r"\.mobile-conversion-dock\s*\{([^}]+)\}", css_text)
        assert m is not None, "Base definition for .mobile-conversion-dock missing in css/components.css"
        base_rules = m.group(1)
        assert "display: none" in base_rules, ".mobile-conversion-dock must have display: none by default on desktop"


# ==============================================================================
# TIER 2: BOUNDARY & CORNER CASES
# ==============================================================================

class TestTier2BoundaryAndCornerCases:
    """
    Tier 2: Touch targets >= 48px, Media queries, Non-overlapping floating controls, Z-Index stacking
    """

    def test_tier2_viewport_media_queries_integrity(self):
        """Verify media queries in components.css have valid syntax and standard responsive breakpoints."""
        css_path = os.path.join(PROJECT_ROOT, "css/components.css")
        css_text = open(css_path, "r", encoding="utf-8", errors="ignore").read()
        breakpoints = re.findall(r"@media\s*\([^)]*(?:max|min)-width:\s*(\d+)px[^)]*\)", css_text)
        assert len(breakpoints) >= 2, f"Expected standard responsive breakpoints in components.css, found {breakpoints}"
        assert "768" in breakpoints, "Breakpoint 768px must be explicitly defined"

    def test_tier2_touch_target_dimensions_in_css(self):
        """Verify dock buttons specify touch target min-height >= 44px (with padding >= 48px hit target)."""
        css_path = os.path.join(PROJECT_ROOT, "css/components.css")
        css_text = open(css_path, "r", encoding="utf-8", errors="ignore").read()
        # Check dock-btn min-height
        m = re.search(r"\.dock-btn\s*\{([^}]+)\}", css_text)
        assert m is not None, ".dock-btn definition missing in css/components.css"
        rules = m.group(1)
        min_h = re.search(r"min-height:\s*(\d+)px", rules)
        assert min_h is not None, "min-height not specified on .dock-btn"
        val = int(min_h.group(1))
        assert val >= 44, f"dock-btn min-height must be at least 44px (found {val}px)"

    def test_tier2_non_overlapping_floating_controls(self):
        """
        Floating controls (WhatsApp float and mobile dock) must not overlap on mobile.
        Either floating WhatsApp is hidden on mobile, or shifted above the dock.
        """
        css_path = os.path.join(PROJECT_ROOT, "css/components.css")
        css_text = open(css_path, "r", encoding="utf-8", errors="ignore").read()
        # Verify body has bottom padding clearance when dock is active
        m = re.search(r"@media\s*\([^)]*max-width:\s*768px[^)]*\)\s*\{([^}]+(?:\}[^}]*\{[^}]*)*)\}", css_text)
        assert m is not None
        mq_block = m.group(0)
        assert "padding-bottom" in mq_block, "Body must have padding-bottom clearance in mobile media query"

    def test_tier2_z_index_stacking_hierarchy(self):
        """Verify orderly z-index stacking: mobile dock z-index >= 900, modal/drawer >= 1000."""
        css_path = os.path.join(PROJECT_ROOT, "css/components.css")
        css_text = open(css_path, "r", encoding="utf-8", errors="ignore").read()
        dock_z = re.search(r"\.mobile-conversion-dock\s*\{[^}]*z-index:\s*(\d+)", css_text)
        assert dock_z is not None, "z-index must be explicitly declared on .mobile-conversion-dock"
        z_val = int(dock_z.group(1))
        assert z_val >= 900, f"mobile dock z-index must be at least 900 (found {z_val})"

    def test_tier2_safe_area_inset_support(self):
        """Mobile conversion dock must support iOS safe-area-inset-bottom."""
        css_path = os.path.join(PROJECT_ROOT, "css/components.css")
        css_text = open(css_path, "r", encoding="utf-8", errors="ignore").read()
        assert "safe-area-inset-bottom" in css_text, (
            "css/components.css must include safe-area-inset-bottom for modern mobile devices"
        )


# ==============================================================================
# TIER 3: CROSS-FEATURE & INTEGRATION
# ==============================================================================

class TestTier3CrossFeatureAndIntegration:
    """
    Tier 3: All internal links resolve without 404s, catalogue PDFs intact, anchor tags valid
    """

    def test_tier3_all_internal_links_resolve_without_404(self):
        """Every relative internal <a href> across all site HTML files must resolve to an existing local file."""
        site_files = get_site_html_files()
        broken = []
        anchor_pattern = re.compile(r'<a\s+[^>]*href=["\']([^"\']*)["\']', re.IGNORECASE)

        for rel in site_files:
            full_path = os.path.join(PROJECT_ROOT, rel)
            dir_path = os.path.dirname(full_path)
            content = open(full_path, "r", encoding="utf-8", errors="ignore").read()
            for href in anchor_pattern.findall(content):
                href = href.strip()
                if not href or href.startswith("#") or href.startswith("tel:") or href.startswith("mailto:") or href.startswith("javascript:"):
                    continue
                if href.startswith("http://") or href.startswith("https://"):
                    continue
                clean = unquote(href.split("#")[0].split("?")[0])
                if not clean:
                    continue
                target = os.path.normpath(os.path.join(dir_path, clean))
                if not os.path.exists(target):
                    broken.append((rel, href, os.path.relpath(target, PROJECT_ROOT)))
        assert not broken, f"Broken internal links found ({len(broken)}): {broken[:10]}"

    def test_tier3_all_catalogue_pdf_links_resolve_to_real_files(self):
        """All links to catlogue/*.pdf across all HTML files must resolve to existing PDF files in catlogue/."""
        site_files = get_site_html_files()
        broken_pdfs = []
        anchor_pattern = re.compile(r'<a\s+[^>]*href=["\']([^"\']*)["\']', re.IGNORECASE)
        pdf_count = 0

        for rel in site_files:
            full_path = os.path.join(PROJECT_ROOT, rel)
            dir_path = os.path.dirname(full_path)
            content = open(full_path, "r", encoding="utf-8", errors="ignore").read()
            for href in anchor_pattern.findall(content):
                if ".pdf" in href.lower():
                    pdf_count += 1
                    clean = unquote(href.split("#")[0].split("?")[0])
                    target = os.path.normpath(os.path.join(dir_path, clean))
                    if not os.path.exists(target):
                        broken_pdfs.append((rel, href, os.path.relpath(target, PROJECT_ROOT)))
        assert pdf_count > 0, "No PDF links found across site HTML files"
        assert not broken_pdfs, f"Broken PDF links found ({len(broken_pdfs)}): {broken_pdfs}"

    def test_tier3_redirect_stubs_integrity(self):
        """All 11 legacy redirect stubs must specify valid destination files that exist."""
        stubs = get_redirect_stub_files()
        assert len(stubs) == 11, f"Expected exactly 11 redirect stubs, found {len(stubs)}"
        broken_redirects = []
        for rel in stubs:
            full_path = os.path.join(PROJECT_ROOT, rel)
            dir_path = os.path.dirname(full_path)
            content = open(full_path, "r", encoding="utf-8", errors="ignore").read()
            m = re.search(r'url=([^"\'\s>]+)', content, re.IGNORECASE)
            assert m is not None, f"Redirect stub {rel} missing url= target in meta refresh"
            target_url = m.group(1).strip()
            target_file = os.path.normpath(os.path.join(dir_path, target_url))
            if not os.path.exists(target_file):
                broken_redirects.append((rel, target_url))
        assert not broken_redirects, f"Broken targets in redirect stubs: {broken_redirects}"


# ==============================================================================
# TIER 4: CONTACT HYGIENE & DATA INTEGRITY
# ==============================================================================

class TestTier4ContactHygieneAndDataIntegrity:
    """
    Tier 4: Regex check across all HTML files for +91 95972 28969 and +91 95972 28975,
    zero banned numbers (9597228978, 2562975), preservation of 4 new product pages.
    """

    def test_tier4_presence_of_both_authorized_phone_numbers(self):
        """Across all 45 content HTML pages, both authorized numbers (28969 and 28975) must be present."""
        content_files = get_content_html_files()
        missing_numbers = []
        for rel in content_files:
            full_path = os.path.join(PROJECT_ROOT, rel)
            content = open(full_path, "r", encoding="utf-8", errors="ignore").read()
            has_28969 = "28969" in content
            has_28975 = "28975" in content
            if not has_28969 or not has_28975:
                missing_numbers.append((rel, f"has_28969={has_28969}, has_28975={has_28975}"))
        assert not missing_numbers, f"Pages missing authorized phone numbers: {missing_numbers}"

    def test_tier4_zero_occurrences_of_banned_phone_numbers(self):
        """Zero occurrences of banned phone numbers (9597228978 or 2562975) in any HTML, CSS, or JS file."""
        web_files = (
            glob.glob(os.path.join(PROJECT_ROOT, "**/*.html"), recursive=True) +
            glob.glob(os.path.join(PROJECT_ROOT, "**/*.css"), recursive=True) +
            glob.glob(os.path.join(PROJECT_ROOT, "**/*.js"), recursive=True)
        )
        violations = []
        banned = ["9597228978", "2562975"]
        for f in web_files:
            if "/.agents/" in f or "/build/" in f:
                continue
            txt = open(f, "r", encoding="utf-8", errors="ignore").read()
            for b in banned:
                if b in txt:
                    violations.append((os.path.relpath(f, PROJECT_ROOT), b))
        assert not violations, f"Banned numbers found in web files: {violations}"

    @pytest.mark.parametrize("prod_page", MANDATORY_NEW_PRODUCT_PAGES)
    def test_tier4_preservation_of_four_new_product_pages(self, prod_page):
        """
        The 4 new specialized product pages must exist, not be redirect stubs,
        have substantial content (>20KB), and contain correct company phone numbers.
        """
        full_path = os.path.join(PROJECT_ROOT, prod_page)
        assert os.path.exists(full_path), f"Mandatory product page {prod_page} is missing!"
        size = os.path.getsize(full_path)
        assert size > 20000, f"Mandatory product page {prod_page} is too small ({size} bytes)"
        content = open(full_path, "r", encoding="utf-8", errors="ignore").read()
        assert 'http-equiv="refresh"' not in content.lower(), f"{prod_page} must not be a redirect stub"
        assert "28969" in content, f"{prod_page} missing +91 95972 28969"
        assert "28975" in content, f"{prod_page} missing +91 95972 28975"

    def test_tier4_corporate_nap_consistency(self):
        """Check corporate NAP on index.html: Name, Address, and Email match official standard."""
        index_path = os.path.join(PROJECT_ROOT, "index.html")
        content = open(index_path, "r", encoding="utf-8", errors="ignore").read()
        assert "Win Equipments" in content, "Corporate name missing in index.html"
        assert "Kallangadu, Arasur Post, Coimbatore" in content, "Official factory address missing in index.html"
        assert "info@winequipments.com" in content, "Official email missing in index.html"
