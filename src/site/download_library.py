"""Validated download records shared by the library and product pages."""
import hashlib
import json
import re


def load_downloads(src, products, families):
    records = json.loads((src / "data/downloads.json").read_text())
    metadata = json.loads((src / "data/download_metadata.json").read_text())
    seen_ids, seen_paths, by_product = set(), set(), {}
    for doc in records:
        doc_id, path = doc["id"], doc["path"]
        if not re.fullmatch(r"[a-z0-9-]+", doc_id) or doc_id in seen_ids:
            raise ValueError(f"Duplicate or invalid document ID: {doc_id}")
        if not re.fullmatch(r"/downloads/[a-z0-9-]+\.pdf", path) or path in seen_paths:
            raise ValueError(f"Duplicate or invalid PDF path: {path}")
        seen_ids.add(doc_id)
        seen_paths.add(path)
        pdf = src / "static" / path.lstrip("/")
        meta = metadata.get(doc_id, {})
        if meta.get("sha256") != hashlib.sha256(pdf.read_bytes()).hexdigest():
            raise ValueError(f"PDF metadata is stale for {doc_id}; run python3 src/site/catalogue/prepare_downloads.py")
        if not isinstance(meta.get("pages"), int) or meta["pages"] < 1:
            raise ValueError(f"Invalid page count for {doc_id}")
        preview = meta.get("preview", "")
        if not re.fullmatch(r"/downloads/previews/[a-z0-9-]+\.[a-f0-9]{12}\.webp", preview) or not (src / "static" / preview.lstrip("/")).is_file():
            raise ValueError(f"Missing or invalid cover preview for {doc_id}")
        if any(not isinstance(item["page"], int) or not 1 <= item["page"] <= meta["pages"] for item in doc["contents"]):
            raise ValueError(f"Contents page outside PDF range for {doc_id}")
        if doc["family"] is not None and doc["family"] not in families:
            raise ValueError(f"Unknown family for {doc_id}")
        doc.update(meta, size=f"{pdf.stat().st_size / 1048576:.1f} MB")
        doc["related_products"] = []
        for slug in doc["products"]:
            p = products[slug]
            if slug in by_product or p.get("download") != path or p["family"] != doc["family"]:
                raise ValueError(f"Invalid document mapping for {slug}")
            by_product[slug] = doc
            doc["related_products"].append(p)
    expected = {slug for slug, p in products.items() if p.get("download")}
    if set(by_product) != expected or set(metadata) != seen_ids:
        raise ValueError("Download registry does not match product coverage or metadata")
    actual = {"/downloads/" + p.name for p in (src / "static/downloads").glob("*.pdf")}
    if actual != seen_paths:
        raise ValueError("Every published PDF must have exactly one download record")
    return records, by_product
