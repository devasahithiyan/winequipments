# Customer selection validation

8 October 2026. Local implementation on `test`; no deployment, no actual enquiry submitted. Scope is roadmap items 3–6 only. Direction contract: `Reports/ux/customer-selection-plan.md`.

## Automated evidence

- Rebuilt 109 pages in `public/`; all 404 Python tests passed (379 baseline plus 25 generated-journey/data-integrity checks).
- 16 calculator, selection-record and discovery Node tests passed; cases iterate all WRD/WCP capacity boundaries against source data, and cover blank/zero/negative/non-finite inputs, catalogue factor allowlists, desiccant variants/rating conditions, flow limits, impossible tower approach, review-only cases, malformed selection payloads and model/application search.
- Existing chiller lifecycle checks pass with `node --experimental-vm-modules tests/test_chiller_loading.cjs`; PDF-reader Node regressions pass.
- Module syntax checks passed for all four new/changed browser controllers, source and generated output.
- Impeccable detector ran once across changed templates/CSS: no findings. Jinja stylesheet URL resolution limited its color/custom-property checks; visual review remains required.

## Browser evidence

Temporary local IAB tab; existing preview server at 8089. Desktop 1440×1000; mobile 390×844 and 320×844. Review captures: `.build-cache/customer-selection/review/`.

Verified by actual UI actions: model search `WCP050`; no-results recovery; cooling/healthcare guided route returns Medical Scan Chillers; two/three-model comparison and duplicate-model recovery; 50 LPM/5 °C chiller result → model page with conditions and duty carried → editable enquiry summary; explicit WhatsApp URL updates to edited text without sending it; model-variant WHD 030 M; impossible tower approach blocks recommendation; 3 °C approach yields estimate/review without a model; calculator changes remove attached stale duty; product switching removes incompatible context; same-product session reload restores selection; removal survives reload; inline WRD correction clears stale candidate after blank/negative flow.

At 320px, catalogue comparisons stack field labels across model columns and repeat model IDs for readable association. Product brochure labels wrap. No page-width overflow in the final measured product/discovery layouts (document width no greater than viewport). Existing photo rails/subnav remain independently scrollable.

## Limits and technical decisions

Selections are preliminary catalogue candidates, not engineering approvals. WHD uses its own 38 °C/7 bar g dew-point rating. HP estimates never choose a dryer. Chillers require review when the heat-load candidate’s listed water flow is exceeded. Tower automated matches are deliberately limited to 5 °C range, ≥4 °C approach and L-fill temperatures ≤55 °C; the catalogue’s ambiguous approach grid is retained as reference but not guessed into correction factors. No source model/material/specification records changed. The existing water/TR conversion convention is retained.

Selection payloads accept known product/model IDs and bounded fields only. They contain no contact fields; derived selections expire after 30 minutes in product-scoped session storage. Customer textarea edits are not persisted. Cross-product URL payloads are ignored. Full catalogue browsing and spec tables remain without JavaScript. Existing mailer includes `selection_details` as an extra form field; delivery/storage reliability was outside scope and was not tested with a real submission.

## Finish review

Independent review identified F1 calculator-state contrast and F2 stale inline duty. Both were corrected and scored resolved; disposition ship covers those two fixes. The scoped documentation handoff is complete. This is not whole-site accessibility or real enquiry-delivery certification. See customer-selection-finish-review.md and customer-selection-design-handoff.md.

### Finish correction batch

Applied independent review F1 and F2 together. Browser-computed empty/match heading and body: rgb(223,231,226) on rgb(21,32,26); review heading rgb(243,221,155), qualification rgb(223,231,226) on that dark surface. Invalid heading/body rgb(21,32,26) on rgb(253,236,235). Replaced calculator-desktop.png and tower-invalid-mobile.png with corrected captures; added review-mobile.png. Other captures remain unchanged because those surfaces did not change.

Actual UI sequence verified for WCP inline nominal finder: 5 TR → Quote WCP 050 → clear duty → Quote WCP 100; attached summary and WhatsApp contain model/context qualification only, without the previous duty. Negative duty → Quote WCP 150 likewise contains no old duty. WRD correction: 100 CFM → Quote WRD 100 S includes actual flow plus all four conditions → clear flow → Quote WRD 150 S contains no old flow/conditions; negative flow → Quote WRD 200 S likewise contains no old duty. Untouched calculator → product transfer still preserves 50 LPM, ΔT 5 °C, 15 °C outlet,40 °C ambient,4.96 TR. Product-scoped derived state only; customer edits still not persisted.

The F2 persistence check also verified an explicit calculator URL remains current after choosing a different model: calculator 50 LPM → product → Quote WCP 100 updates URL model to WCP 100; reload restores WCP 100 with all four operating inputs and the 4.96 TR result. `save(record)` synchronizes only an already present selection URL on its matching product page. Reviewer scored F1/F2 resolved with disposition ship at the two-fix scope. Documentation handoff records maintained incumbent identity.
