import os
import re
import pytest

PRODUCTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "products"))
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# 15 canonical product pages (> 5KB, excluding 301 meta-refresh redirect stubs)
CANONICAL_PRODUCT_FILES = [
    os.path.join(PRODUCTS_DIR, f)
    for f in os.listdir(PRODUCTS_DIR)
    if f.endswith(".html") and os.path.getsize(os.path.join(PRODUCTS_DIR, f)) > 5000
]

def test_canonical_products_count():
    """Verify all 15 canonical product pages are identified."""
    assert len(CANONICAL_PRODUCT_FILES) == 15

def test_all_products_have_quote_buttons_in_spec_tables():
    """Verify that every product page has 'Quote This Model' interactive buttons."""
    for filepath in CANONICAL_PRODUCT_FILES:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        assert "table-quote-btn" in content, f"Missing table-quote-btn in {os.path.basename(filepath)}"

def test_all_products_have_client_marquee():
    """Verify that every product page includes the client logo trust marquee."""
    for filepath in CANONICAL_PRODUCT_FILES:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        assert "product-clients-marquee" in content, f"Missing client marquee in {os.path.basename(filepath)}"
        assert "images/clients/2.jpg" in content, f"Missing client logo 2 in {os.path.basename(filepath)}"

def test_all_products_have_cad_drawings_checkbox():
    """Verify that every product RFQ form has the 2D GA & 3D CAD checkbox."""
    for filepath in CANONICAL_PRODUCT_FILES:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        assert 'name="cad_drawings_requested"' in content, f"Missing cad_drawings_requested checkbox in {os.path.basename(filepath)}"

def test_package_builder_exists_and_valid():
    """Verify the new Visual Package Configurator tool exists and has correct contact info."""
    builder_path = os.path.join(ROOT_DIR, "engineering-tools", "air-treatment-package-builder.html")
    assert os.path.exists(builder_path), "air-treatment-package-builder.html does not exist"
    with open(builder_path, "r", encoding="utf-8") as f:
        content = f.read()
    assert "+91 95972 28969" in content
    assert "+91 95972 28975" in content
    assert "9597228978" not in content
    assert "0422-2562975" not in content
    assert 'id="trainPipeline"' in content
    assert 'id="packageEquipmentInput"' in content
    assert 'rfq-form' in content

def test_quick_search_assets_exist():
    """Verify that Quick Search (Ctrl+K) CSS and JS are present and valid."""
    js_path = os.path.join(ROOT_DIR, "js", "quick-search.js")
    css_path = os.path.join(ROOT_DIR, "css", "quick-search.css")
    assert os.path.exists(js_path), "quick-search.js does not exist"
    assert os.path.exists(css_path), "quick-search.css does not exist"
    with open(js_path, "r", encoding="utf-8") as f:
        js_content = f.read()
    assert "initQuickSearch" in js_content
    assert "WRD" in js_content
    assert "WCT" in js_content
    assert "WCP" in js_content

def test_calculators_email_and_modal():
    """Verify that js/calculators.js uses info@winequipments.com and has modal fallback."""
    calc_path = os.path.join(ROOT_DIR, "js", "calculators.js")
    with open(calc_path, "r", encoding="utf-8") as f:
        content = f.read()
    assert "marketing@winequipments.com" not in content
    assert "info@winequipments.com" in content
    assert "we-proposal-modal" in content

def test_send_rfq_handles_cad_drawings():
    """Verify that send_rfq.php checks for CAD drawings and dispatches to both recipients."""
    php_path = os.path.join(ROOT_DIR, "send_rfq.php")
    with open(php_path, "r", encoding="utf-8") as f:
        content = f.read()
    assert "cad_drawings_requested" in content
    assert "info@winequipments.com" in content
    assert "devasahithiyan@gmail.com" in content

def test_main_js_syntax_and_spec_table_quoting():
    """Verify js/main.js has zero syntax errors and spec table quoting is wired."""
    import subprocess
    js_path = os.path.join(ROOT_DIR, "js", "main.js")
    res = subprocess.run(["node", "-c", js_path], capture_output=True, text=True)
    assert res.returncode == 0, f"Syntax error in main.js: {res.stderr}"

    with open(js_path, "r", encoding="utf-8") as f:
        js_content = f.read()
    assert "initSpecTableQuoting()" in js_content
    assert "table-quote-btn-active" in js_content
    assert "rfq-selected-model-banner" in js_content

    css_path = os.path.join(ROOT_DIR, "css", "components.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css_content = f.read()
    assert ".table-quote-btn-active" in css_content
    assert ".rfq-selected-model-banner" in css_content

