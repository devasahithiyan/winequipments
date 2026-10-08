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
from pathlib import Path

from PIL import Image

SRC = Path(__file__).resolve().parent.parent


def main():
    records = json.loads((SRC / "data/downloads.json").read_text())
    dest = SRC / "static/downloads/previews"
    dest.mkdir(parents=True, exist_ok=True)
    metadata = {}
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
        with Image.open(cover) as im:
            width, height = im.size
        preview_pages = []
        for page in range(1, pages + 1):
            rendered = dest / f"{doc['id']}.{digest[:12]}.page-{page}.webp"
            if not rendered.exists():
                with tempfile.TemporaryDirectory() as tmp:
                    prefix = Path(tmp) / "page"
                    subprocess.run(["pdftoppm", "-f", str(page), "-l", str(page), "-singlefile", "-scale-to", "1800", "-png", str(pdf), str(prefix)], check=True, capture_output=True)
                    with Image.open(prefix.with_suffix(".png")) as im:
                        im.convert("RGB").save(rendered, "WEBP", quality=88, method=6)
            preview_pages.append("/downloads/previews/" + rendered.name)
        metadata[doc["id"]] = {"sha256": digest, "pages": pages, "preview": "/downloads/previews/" + cover.name, "width": width, "height": height, "preview_pages": preview_pages}
        print(f"{doc['id']}: {pages} pages, cover {cover.stat().st_size // 1024} KB")
    (SRC / "data/download_metadata.json").write_text(json.dumps(metadata, indent=2) + "\n")


if __name__ == "__main__":
    main()
