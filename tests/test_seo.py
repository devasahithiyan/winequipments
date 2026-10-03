"""SEO and integrity checks on the generated site in public/. Run: python3 src/site/build.py && pytest tests/test_seo.py"""
import html
import json
import re
from pathlib import Path
from urllib.parse import urlparse, unquote

import pytest

PUBLIC = Path(__file__).resolve().parent.parent / "public"
SITE = "https://winequipments.com"
NOINDEX = {"404.html", "thank-you.html"}


def pages():
    # skip iCloud sync-conflict copies such as "about 2.html"
    return sorted(p for p in PUBLIC.rglob("*.html") if "img" not in p.parts and not re.search(r" \d+\.html$", p.name))


def rel(p):
    return p.relative_to(PUBLIC).as_posix()


def url_of(p):
    r = rel(p)
    return "/" + (r[: -len("index.html")] if r.endswith("index.html") else r)


def meta(src, name):
    m = re.search(rf'<meta name="{name}" content="([^"]*)"', src)
    return html.unescape(m.group(1)) if m else None


@pytest.fixture(scope="module")
def sitemap_urls():
    xml = (PUBLIC / "sitemap.xml").read_text()
    return {u.replace(SITE, "") for u in re.findall(r"<loc>([^<]+)</loc>", xml)}


ALL = pages()
INDEXABLE = [p for p in ALL if rel(p) not in NOINDEX]


@pytest.mark.parametrize("page", INDEXABLE, ids=rel)
def test_title_and_description(page):
    src = page.read_text()
    title = html.unescape(re.search(r"<title>(.*?)</title>", src, re.S).group(1).strip())
    desc = meta(src, "description")
    assert 10 <= len(title) <= 60, f"title {len(title)}: {title}"
    assert desc and 70 <= len(desc) <= 155, f"description {len(desc or '')}: {desc}"


@pytest.mark.parametrize("page", ALL, ids=rel)
def test_structure(page):
    src = page.read_text()
    assert len(re.findall(r"<h1[\s>]", src)) == 1, "exactly one h1"
    canon = re.search(r'<link rel="canonical" href="([^"]+)"', src).group(1)
    assert canon == SITE + url_of(page), canon
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', src, re.S):
        json.loads(block)
    assert "3,500" not in src and "3500+" not in src
    for img in re.findall(r"<img\b[^>]*>", src):
        assert "alt=" in img, img


@pytest.mark.parametrize("page", ALL, ids=rel)
def test_internal_links_resolve(page):
    src = page.read_text()
    for ref in re.findall(r'(?:href|src)="([^"]+)"', src):
        u = urlparse(ref)
        if u.scheme or ref.startswith(("#", "mailto:", "tel:", "data:", "//")) or "{{" in ref:
            continue
        path = unquote(u.path)
        if not path or path.endswith(".php"):
            continue
        target = PUBLIC / path.lstrip("/")
        if path.endswith("/"):
            target = target / "index.html"
        assert target.exists(), f"{rel(page)} -> {ref}"


def test_sitemap_matches_pages(sitemap_urls):
    expected = {url_of(p) for p in INDEXABLE}
    assert expected == sitemap_urls, f"missing {expected - sitemap_urls}, extra {sitemap_urls - expected}"


@pytest.mark.parametrize("name", sorted(NOINDEX))
def test_noindex_pages(name):
    src = (PUBLIC / name).read_text()
    assert 'name="robots" content="noindex' in src


def test_robots():
    txt = (PUBLIC / "robots.txt").read_text()
    assert "Sitemap: https://winequipments.com/sitemap.xml" in txt


def test_every_page_linked_from_somewhere():
    linked = set()
    for p in ALL:
        for ref in re.findall(r'href="(/[^"#?]*)', p.read_text()):
            linked.add(ref)
    orphans = [url_of(p) for p in INDEXABLE if url_of(p) not in linked and url_of(p) != "/"]
    assert not orphans, orphans
