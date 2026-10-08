"""Prevent stale PDF metadata, incomplete coverage and broken document journeys."""
import importlib.util
import json
import shutil
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src/site"
spec = importlib.util.spec_from_file_location("download_library", SRC / "download_library.py")
library = importlib.util.module_from_spec(spec)
spec.loader.exec_module(library)
PRODUCTS = {p.stem: json.loads(p.read_text()) for p in (SRC / "data/products").glob("*.json")}
FAMILIES = {f["id"]: f for f in json.loads((SRC / "data/site.json").read_text())["families"]}


@pytest.fixture
def fixture_src(tmp_path):
    (tmp_path / "data").mkdir()
    for name in ("downloads.json", "download_metadata.json"):
        shutil.copy2(SRC / "data" / name, tmp_path / "data" / name)
    (tmp_path / "static").symlink_to(SRC / "static", target_is_directory=True)
    return tmp_path


def change(src, name, mutate):
    path = src / "data" / name
    data = json.loads(path.read_text())
    mutate(data)
    path.write_text(json.dumps(data))


def test_all_published_pdfs_and_products_have_one_mapping():
    docs, by_product = library.load_downloads(SRC, PRODUCTS, FAMILIES)
    assert len(docs) == len(list((SRC / "static/downloads").glob("*.pdf")))
    assert set(by_product) == {s for s, p in PRODUCTS.items() if p.get("download")}
    assert by_product["round-cooling-towers"] is by_product["square-cooling-towers"]


def test_pdf_change_requires_metadata_refresh(fixture_src):
    change(fixture_src, "download_metadata.json", lambda data: data["refrigerated-air-dryers"].update(sha256="obsolete"))
    with pytest.raises(ValueError, match="metadata is stale"):
        library.load_downloads(fixture_src, PRODUCTS, FAMILIES)


def test_contents_cannot_point_beyond_end_of_pdf(fixture_src):
    change(fixture_src, "downloads.json", lambda data: data[0]["contents"][0].update(page=999))
    with pytest.raises(ValueError, match="outside PDF range"):
        library.load_downloads(fixture_src, PRODUCTS, FAMILIES)


def test_registry_cannot_hide_a_product_with_a_pdf(fixture_src):
    change(fixture_src, "downloads.json", lambda data: data[0].update(products=[]))
    with pytest.raises(ValueError, match="coverage"):
        library.load_downloads(fixture_src, PRODUCTS, FAMILIES)


def test_document_cannot_be_assigned_to_wrong_product(fixture_src):
    change(fixture_src, "downloads.json", lambda data: data[0].update(products=["industrial-process-chillers"]))
    with pytest.raises(ValueError, match="Invalid document mapping"):
        library.load_downloads(fixture_src, PRODUCTS, FAMILIES)


def test_generated_library_specs_and_contents_resolve():
    from html.parser import HTMLParser

    class Page(HTMLParser):
        def __init__(self, text):
            super().__init__()
            self.links, self.ids = [], set()
            self.feed(text)

        def handle_starttag(self, tag, attrs):
            a = dict(attrs)
            if "id" in a:
                self.ids.add(a["id"])
            if tag == "a":
                self.links.append(a)

    page = Page((ROOT / "public/downloads.html").read_text())
    downloads = [a for a in page.links if a.get("data-track") == "catalogue_download"]
    previews = [a for a in page.links if a.get("data-track") == "document_preview"]
    assert len(downloads) == len(previews) == len(json.loads((SRC / "data/downloads.json").read_text()))
    assert all("download" in a and not a.get("target") for a in downloads)
    assert all(a.get("target") == "_blank" and a.get("rel") == "noopener" for a in previews)
    for a in page.links:
        href = a["href"]
        if href.startswith("#"):
            assert href[1:] in page.ids, href
        if a.get("data-track") == "document_specs" and "#" in href:
            path, fragment = href.split("#")
            assert fragment in Page((ROOT / "public" / path.lstrip("/")).read_text()).ids
