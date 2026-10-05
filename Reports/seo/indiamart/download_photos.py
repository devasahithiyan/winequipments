"""Download the original-resolution IndiaMART photos listed in products.csv into photos/ (git-ignored) and build a contact sheet."""
import csv, re, time, html, pathlib, urllib.request
from PIL import Image

HERE = pathlib.Path(__file__).parent
OUT = HERE / "photos"
OUT.mkdir(exist_ok=True)
rows, seen = [], {}
for r in csv.DictReader(open(HERE / "products.csv")):
    if not r["image"]:
        continue
    src = "https://5.imimg.com/data5/" + re.sub(r"-500x500(\.\w+)$", r"\1", r["image"])
    if src in seen:
        seen[src]["names"].append(r["name"])
        continue
    name = f"{r['id']}-{pathlib.Path(src).name}"
    dest = OUT / name
    if not dest.exists():
        req = urllib.request.Request(src, headers={"User-Agent": "Mozilla/5.0"})
        dest.write_bytes(urllib.request.urlopen(req, timeout=60).read())
        time.sleep(0.5)
    with Image.open(dest) as im:
        w, h = im.size
    item = {"file": name, "w": w, "h": h, "kb": dest.stat().st_size // 1024, "names": [r["name"]], "cat": r["im_category"], "src": src}
    seen[src] = item
    rows.append(item)

cards = "".join(
    f'<figure><img src="{html.escape(i["file"])}" loading="lazy"><figcaption><b>{html.escape(" / ".join(i["names"]))}</b><br>'
    f'{i["cat"]} · {i["w"]}×{i["h"]} · {i["kb"]} KB<br><code>{html.escape(i["file"])}</code></figcaption></figure>' for i in rows)
(OUT / "index.html").write_text(
    "<!doctype html><meta charset=utf-8><title>IndiaMART photos</title><style>body{font:13px system-ui;margin:16px}"
    "main{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}figure{margin:0;border:1px solid #ccc;padding:6px}"
    "img{width:100%;height:200px;object-fit:contain;background:#eee}</style><h1>IndiaMART photos (" + str(len(rows)) + ")</h1><main>" + cards + "</main>")
with open(HERE / "photos.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["file", "width", "height", "kb", "im_category", "listings", "source_url"])
    for i in rows:
        w.writerow([i["file"], i["w"], i["h"], i["kb"], i["cat"], " / ".join(i["names"]), i["src"]])
print(len(rows), "photos;", sum(1 for i in rows if min(i["w"], i["h"]) >= 600), "with short side >= 600 px")
