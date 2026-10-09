"""Generated selection journey integrity, with catalogue values as authority."""
import json
import re
from pathlib import Path
import pytest
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'src/site/data/products'
PUBLIC=ROOT/'public'

def scripts(src):
    return [json.loads(body) for body in re.findall(r'<script\b[^>]*type="application/json"[^>]*>(.*?)</script>', src, re.S)]

def test_search_index_covers_every_product_and_source_model():
    src=(PUBLIC/'products/index.html').read_text()
    records=scripts(src)[0]
    assert len(records)==len(list(DATA.glob('*.json')))
    for record in records:
        source=json.loads((DATA/(record['slug']+'.json')).read_text())
        for row in (source.get('spec') or {}).get('rows',[]):
            assert row['model'] in record['search']
    assert 'data-discovery-empty hidden' in src
    assert 'id="product-results"' in src

@pytest.mark.parametrize('path', sorted(DATA.glob('*.json')), ids=lambda p:p.stem)
def test_product_priority_and_comparison_do_not_change_spec_values(path):
    source=json.loads(path.read_text())
    src=(PUBLIC/'products'/path.name.replace('.json','.html')).read_text()
    records=scripts(src)
    assert 'name="selection_details"' in src
    if source.get('spec'):
        assert src.index('aria-labelledby="specs"') < src.index('aria-labelledby="faq"')
        for media in ['aria-labelledby="photos"','id="chiller-360"','data-c3-stage']:
            if media in src: assert src.index('aria-labelledby="specs"')<src.index(media)
        comparison=next(record for record in records if 'columns' in record)
        assert comparison == source['spec']
        assert 'data-model-compare hidden' in src
    elif source.get('needs'):
        assert src.index('aria-labelledby="sizing-needs"')<src.index('aria-labelledby="applications"') if 'aria-labelledby="applications"' in src else True
    product_map=records[-1]
    assert source['slug'] in product_map
    assert all(row['model'] in product_map[source['slug']]['models'] for row in (source.get('spec') or {}).get('rows',[]))

def test_tools_have_labeled_modes_and_context_data():
    for page in (PUBLIC/'engineering-tools').glob('*.html'):
        src=page.read_text()
        if 'data-tool=' not in src: continue
        records=scripts(src)
        assert len(records)==2
        assert 'name="selection_details"' in src
        if 'data-tool="dryer"' in src: assert 'name="flowMode"' in src and 'name="desInlet"' in src
        if 'data-tool="chiller"' in src: assert '<label for="t-kw">' in src and 'name="loadMode"' in src
