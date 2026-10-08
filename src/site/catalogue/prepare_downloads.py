#!/usr/bin/env python3
"""Refresh page counts and cover and full-page previews after changing catalogue PDFs.

Requires Poppler (pdfinfo, pdftoppm) and Pillow on the preparation machine.
The ordinary site build uses the committed metadata and does not need Poppler.
"""
import hashlib
import json
import re
import subprocess
import tempfile
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image

SRC = Path(__file__).resolve().parent.parent


def main():
    records = json.loads((SRC / "data/downloads.json").read_text())
    dest = SRC / "static/downloads/previews"
    dest.mkdir(parents=True, exist_ok=True)
    metadata = {}
    expected_assets = set()
    for doc in records:
        pdf = SRC / "static" / doc["path"].lstrip("/")
        digest = hashlib.sha256(pdf.read_bytes()).hexdigest()
        info = subprocess.check_output(["pdfinfo", str(pdf)], text=True)
        pages = int(re.search(r"^Pages:\s+(\d+)", info, re.M).group(1))
        cover = dest / f"{doc['id']}.{digest[:12]}.webp"
        if not cover.exists():
            with tempfile.TemporaryDirectory() as tmp:
                prefix = Path(tmp) / "cover"
                subprocess.run(["pdftoppm", "-f", "1", "-l", "1", "-singlefile", "-scale-to", "420", "-png", str(pdf), str(prefix)], check=True, capture_output=True)
                with Image.open(prefix.with_suffix(".png")) as im:
                    im.convert("RGB").save(cover, "WEBP", quality=82, method=6)
        expected_assets.add(cover.name)
        with Image.open(cover) as im:
            width, height = im.size
        preview_pages = []
        for page in range(1, pages + 1):
            rendered = dest / f"{doc['id']}.{digest[:12]}.page-{page}.webp"
            if not rendered.exists():
                with tempfile.TemporaryDirectory() as tmp:
                    prefix = Path(tmp) / "page"
                    subprocess.run(["pdftoppm", "-f", str(page), "-l", str(page), "-singlefile", "-scale-to", "420", "-png", str(pdf), str(prefix)], check=True, capture_output=True)
                    with Image.open(prefix.with_suffix(".png")) as im:
                        im.convert("RGB").save(rendered, "WEBP", quality=88, method=6)
            expected_assets.add(rendered.name)
            preview_pages.append("/downloads/previews/" + rendered.name)
        metadata[doc["id"]] = {"sha256": digest, "pages": pages, "preview": "/downloads/previews/" + cover.name, "width": width, "height": height, "preview_pages": preview_pages}
        for asset in [cover] + [dest / Path(url).name for url in preview_pages]:
            sidecar = asset.with_suffix(asset.suffix + ".json")
            if not sidecar.exists():
                page_label = "cover" if asset == cover else "page " + asset.stem.rsplit("-", 1)[1]
                sidecar.write_text(json.dumps({"prompt": f"Origin: {page_label} rendered by Poppler from {doc['path']} (SHA-256 {digest}). Win Equipments product data and existing company imagery; no AI-generated artwork.", "createdAt": datetime.now(timezone.utc).isoformat()}, indent=2) + "\n")
        print(f"{doc['id']}: {pages} pages, cover {cover.stat().st_size // 1024} KB")
    # Only this generator's hash-named outputs are pruned; PDF originals are untouched.
    for old in dest.glob("*.webp"):
        if old.name not in expected_assets and re.fullmatch(r"[a-z0-9-]+\.[a-f0-9]{12}(?:\.page-\d+)?\.webp", old.name):
            old.unlink()
            old.with_suffix(old.suffix + ".json").unlink(missing_ok=True)
    (SRC / "data/download_metadata.json").write_text(json.dumps(metadata, indent=2) + "\n")


if __name__ == "__main__":
    main()
