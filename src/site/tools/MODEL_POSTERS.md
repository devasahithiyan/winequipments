# 3D viewer posters (dryer and cooling tower)

The chiller has its own tool (`CHILLER_POSTERS.md`). The dryer and the round cooling tower share `render_model_posters.py`.

## Dryer

The starting images are deterministic captures of the Three.js model of the photographed heatless desiccant dryer, not product photographs. The originals are `images/Products/dessicantdryer.png` and `images/works/desiccant-dryer-twin-tower.jpg`. The geometry was ported from the earlier ChatGPT workspace (`desiccant-model.js`) and rebuilt on the chiller viewer's renderer, so both use the same loading, lite mode and capture code.

## Regeneration

Regenerate both posters whenever the dryer geometry, materials, lights, initial camera pose or framing change:

1. From the repository root, run `python3 src/site/tools/render_model_posters.py dryer` (or `tower`).
2. Open `http://127.0.0.1:8087/` in a desktop browser and click **Render both posters** (desktop wider than 767px with more than four cores, so the standard render is not downgraded).
3. Wait for **Both posters rendered**. They are saved to `images/dryer-renders/dryer-poster-standard.png` and `dryer-poster-lite.png`.
4. Stop the server with Ctrl+C, run `python3 src/site/build.py`, and commit the posters with the rebuilt `public/`.

The capture is 1200 x 1500 (4:5), transparent, rotation 28 deg, elevation 12 deg, zoom 1, closed, no ambient occlusion. `frameFor()` in `dryer3d.js` matches a 4:5 image shown with `object-fit: contain`, so the poster and the live canvas coincide at any stage size. Keep these values in step with `data-c3-home` in `partials/dryer360.html` and `initialView` in the tool page.

## How the page uses it

`partials/dryer360.html` reuses `chiller360.js` through `data-c3-*` attributes: `data-c3-module="/js/dryer3d.js"`, `data-c3-click` (never load until the visitor taps View in 3D, on every device) and the three camera views. The chiller needs none of them.

## Cooling tower

`python3 src/site/tools/render_model_posters.py tower` writes `images/tower-renders/tower-poster-standard.png` and `tower-poster-lite.png`: 1200 x 1500, rotation 20 deg, elevation 10 deg, zoom 1, closed. Keep these values in step with `data-c3-home` in `partials/tower360.html`. The outside follows `images/Products/coolingtower.png` and `images/works/round-tower-frp-blue.jpg`; the fills, sprinkler, riser and fan inside are illustrations.
