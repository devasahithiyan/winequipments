# Chiller viewer posters

The starting images are deterministic captures of the photograph-based Three.js model, not additional product photographs. The original photos remain in `images/chiller-reference/`.

## Regeneration

Regenerate both posters whenever geometry, materials, lights, initial camera pose, fan orientation or framing changes:

1. From the repository root, run `python3 src/site/tools/render_chiller_posters.py`.
2. Open `http://127.0.0.1:8086/` in a desktop browser and click **Render both posters**. Use a desktop wider than 767px with more than four logical CPU cores so the standard render is not automatically downgraded.
3. Wait for **Both posters rendered**. The tool saves `chiller-poster-standard.png` and `chiller-poster-lite.png` directly into `images/chiller-renders/`.
4. Stop the local server with Ctrl+C, then run `python3 src/site/build.py`.
5. Review the poster-to-canvas handoff on desktop and mobile. Commit the source posters and regenerated public assets together.

The capture uses 1200 × 1500 transparent PNGs, 35° rotation, 14° camera elevation, zoom 1, closed panels and fan angle 0. Standard and lite captures use the actual live materials and lighting, with no AO. `frameFor()` matches a 4:5 reference image displayed with `object-fit: contain`, including at wide or narrow stage aspect ratios. Keep these values synchronized with `HOME` in the controller and `initialView` in the renderer. The usual image build generates AVIF, WebP and PNG fallbacks with responsive widths.

The capture tool is source tooling only and is never copied into `public/` by the site build. It binds to loopback and accepts PNG uploads only for the two known poster names.

## Validation

- `node --experimental-vm-modules tests/test_chiller_loading.cjs`: lifecycle regression checks with a simulated clock and renderer, including retries, timeout, late results, context loss and reduced motion.
- `/opt/homebrew/bin/python3 -m pytest -q`: generated-site integrity and SEO checks.
- Browser review: desktop auto-load and scroll baseline, mobile tap-to-load, stable toolbar space, rotation/zoom and all four view modes.
