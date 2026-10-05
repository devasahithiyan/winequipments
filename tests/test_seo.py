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
    assert "3,500+" not in src and "3500+" not in src and "3,500 installations" not in src
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


ARTICLES = sorted(p for p in (PUBLIC / "blog").glob("*.html") if p.name != "glossary.html")


def graph(src):
    nodes = []
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', src, re.S):
        d = json.loads(block)
        nodes += d.get("@graph", [d])
    return nodes


@pytest.mark.parametrize("page", ARTICLES, ids=rel)
def test_article_answer_and_faq(page):
    src = page.read_text()
    m = re.search(r'<div class="art__answer"><p class="art__answer-h">Short answer</p><p>(.*?)</p>', src, re.S)
    assert m, "short answer box"
    words = len(html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).split())
    assert 25 <= words <= 70, f"short answer {words} words"
    faq = [n for n in graph(src) if n.get("@type") == "FAQPage"]
    assert faq, "FAQPage schema"
    qs = [q["name"] for q in faq[0]["mainEntity"]]
    assert len(qs) >= 3, qs
    visible = [html.unescape(s).strip() for s in re.findall(r"<summary>(.*?)<svg", src, re.S)]
    assert set(qs) <= set(visible), set(qs) - set(visible)


def test_org_schema_service_area():
    org = next(n for n in graph((PUBLIC / "index.html").read_text()) if n.get("@id") == SITE + "/#org")
    cities = {a["name"] for a in org["areaServed"] if a["@type"] == "City"}
    assert {"Coimbatore", "Chennai", "Bengaluru", "Pune", "Delhi", "Ahmedabad"} <= cities


def test_glossary():
    nodes = graph((PUBLIC / "blog" / "glossary.html").read_text())
    terms = next(n for n in nodes if n.get("@type") == "DefinedTermSet")["hasDefinedTerm"]
    assert len(terms) >= 15


def test_llms_files(sitemap_urls):
    idx = (PUBLIC / "llms.txt").read_text()
    missing = [u for u in sitemap_urls if u != "/" and SITE + u not in idx]
    assert not missing, missing
    full = (PUBLIC / "llms-full.txt").read_text()
    assert "SF No. 4/195 B, Kallangadu" in full and "+91 95972 28969" in full


def test_banned_phone_nowhere():
    for p in list(ALL) + [PUBLIC / "llms.txt", PUBLIC / "llms-full.txt"]:
        assert "28978" not in p.read_text(), rel(p)


def test_robots_ai_crawlers():
    txt = (PUBLIC / "robots.txt").read_text()
    for bot in ("GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"):
        assert f"User-agent: {bot}" in txt


def test_location_pages_are_not_city_swapped_templates():
    """Each location page's own text (lede, points, FAQs) must differ from every other page's."""
    L = {l["slug"]: l for l in json.loads((Path(__file__).resolve().parent.parent / "src/site/data/locations.json").read_text())}

    def shingles(l):
        words = " ".join([l["lede"]] + [a + " " + b for a, b in l["points"]] + [f["q"] + " " + f["a"] for f in l["faqs"]]).split()
        return {" ".join(words[i:i + 6]) for i in range(len(words) - 5)}

    S = {k: shingles(v) for k, v in L.items()}
    for k, a in S.items():
        for j, b in S.items():
            if k < j:
                assert len(a & b) / min(len(a), len(b)) < 0.5, f"{k} and {j} share too much text"


def test_every_location_page_listed_in_llms():
    idx = (PUBLIC / "llms.txt").read_text()
    for p in (PUBLIC / "locations").glob("*.html"):
        if p.name != "index.html":
            assert f"/locations/{p.name}" in idx, p.name


DATA = Path(__file__).resolve().parent.parent / "src/site/data"


def test_prices_are_sourced():
    """Every published price names its source and date (owner's IndiaMART listing) and is shown on the page."""
    for f in (DATA / "products").glob("*.json"):
        p = json.loads(f.read_text())
        pr = p.get("price")
        if not pr:
            continue
        assert pr["source"].startswith("https://www.indiamart.com/winequipments/") and pr["as_of"], f.name
        assert pr["low"] > 0 and pr.get("high", pr["low"]) >= pr["low"], f.name
        src = (PUBLIC / "products" / f"{p['slug']}.html").read_text()
        assert "Indicative price" in src and '"lowPrice"' in src, p["slug"]


def test_no_rating_schema_or_reviewer_names():
    """Ratings are shown as text only: no AggregateRating/Review schema, and no reviewer names on any page."""
    names = ["Chodvadiya", "Dasgupta", "Weru", "Alamag", "Sayeed", "Thangavel", "Sadashivan", "Topiwala", "Bista", "Calma"]
    for page in ALL:
        src = page.read_text()
        assert '"AggregateRating"' not in src and '"Review"' not in src, rel(page)
        for n in names:
            assert n not in src, f"{n} on {rel(page)}"
