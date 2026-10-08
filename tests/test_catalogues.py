"""Catalogue pagination, engineering-data coverage and navigation regressions."""
import importlib.util
import json
import re
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src/site'
RECORDS = json.loads((SRC / 'data/downloads.json').read_text())
PRODUCTS = {p.stem: json.loads(p.read_text()) for p in (SRC / 'data/products').glob('*.json')}


def compact(text):
    return re.sub(r'\s+', '', text)


def test_every_catalogue_page_is_uniform_a4_portrait_and_has_text():
    sizes = set()
    for doc in RECORDS:
        reader = PdfReader(SRC / 'static' / doc['path'].lstrip('/'), strict=True)
        assert '/StructTreeRoot' in reader.trailer['/Root'], doc['id']
        assert len(reader.outline) == len(reader.pages), doc['id']
        for page in reader.pages:
            width, height = float(page.mediabox.width), float(page.mediabox.height)
            assert abs(width - 595.28) < 1 and abs(height - 841.89) < 1, doc['id']
            assert len(page.extract_text()) > 150, doc['id']
            sizes.add((round(width, 1), round(height, 1)))
    assert len(sizes) == 1


def test_contents_point_to_actual_section_headings_and_all_models_remain():
    for doc in RECORDS:
        reader = PdfReader(SRC / 'static' / doc['path'].lstrip('/'))
        text = compact(' '.join(page.extract_text() for page in reader.pages))
        for entry in doc['contents']:
            assert compact(entry['label']) in compact(reader.pages[entry['page'] - 1].extract_text()), (doc['id'], entry)
        for slug in doc['products']:
            for row in PRODUCTS[slug]['spec']['rows']:
                assert compact(row['model']) in text, (doc['id'], row['model'])


def test_master_covers_every_current_product():
    reader = PdfReader(SRC / 'static/downloads/win-equipments-catalogue.pdf')
    text = compact(' '.join(page.extract_text() for page in reader.pages))
    for product in PRODUCTS.values():
        assert compact(product['name']) in text, product['slug']


def test_portrait_table_groups_preserve_all_columns_and_values():
    spec = importlib.util.spec_from_file_location('catalogue_builder', SRC / 'catalogue/build_catalogues.py')
    builder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(builder)
    for slug, original in PRODUCTS.items():
        if not original.get('download'):
            continue
        product = builder.products[slug]
        assert product['spec'] == original['spec'], slug
        assert product.get('grades') == original.get('grades'), slug
        groups = builder.column_groups(product)
        keys = [column['key'] for group in groups for column in group['columns'] if column['key'] != 'model']
        expected = [column['key'] for column in original['spec']['columns'] if column['key'] != 'model']
        assert sorted(keys) == sorted(expected), slug
        assert all(group['columns'][0]['key'] == 'model' and len(group['columns']) <= 7 for group in groups)
