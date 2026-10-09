# Customer selection finish review

8 October 2026. Independent finish review of roadmap items 3–6 only. Evidence: `customer-selection-plan.md`, `customer-selection-validation.md`, the supplied source templates/controllers/styles, and all eleven required captures in `.build-cache/customer-selection/review/`. No browser session, second detector, implementation edits, or real enquiry submission formed part of this review.

## 1. Direction fidelity

The implementation follows the established Archivo/green/ink/light identity and the code-led local-extension contract. Discovery places a plainly labelled product/model/application search and family shortcuts ahead of the catalogue. Product content places rating conditions and model selection before sizing explanations, photos and supporting material. Comparison stays inline, supports two or three models from the current range, and retains the original specification table. The editable enquiry attachment makes the chosen product, model and duty visible and provides a separately named WhatsApp sharing action.

The intended path—find, check conditions, compare, review attached duty, enquire—is coherent. No replacement identity, decorative concept, new raster asset or unrelated roadmap work is required to finish it. There is no approved comp for this code-led extension; the written direction contract is the fidelity reference. The calculator state contrast failure prevents the qualification promised by that contract from being reliably understood.

## 2. Craft-floor findings

The discovery desktop/mobile/320 captures show readable hierarchy, visible labels, recognisable native controls and wrapping family shortcuts. The conditions desktop capture exposes rating conditions ahead of selection. Comparison at 320px stacks specification labels and repeats model IDs beside values; the supplied lower desktop rows remain aligned. Enquiry captures at desktop, 390px and 320px show a bounded, editable attachment with readable actions and labels. These are valid, loaded captures of the named task sections; they support this scoped review, not a whole-site visual certification.

Focus, selection, caret and scrollbar styling exist in the inherited base stylesheet; the captures visibly demonstrate focus on search, calculator and enquiry inputs. Tables use tabular numerals. New controls use authored SVGs and restrained borders. The existing fixed mobile action bar is visibly cramped at 320px in the comparison capture; the packet identifies this as pre-existing, and it is outside the required fix batch for this extension.

**Material failure: calculator result states do not meet text contrast requirements.** In `calculator-desktop.png`, the result heading disappears into the dark panel and the engineering qualification is nearly invisible. In `tower-invalid-mobile.png`, the recovery paragraph is nearly invisible on the pale error surface. Source colors establish the cause and also expose the same problem in empty and review states: heading ink on ink is **1.00:1**, qualification `#33403a` on `#15201a` is **1.54:1**, review heading `#8a5a00` on `#15201a` is **2.83:1**, and invalid body `#dfe7e2` on `#fdeceb` is **1.10:1**. These are calculated from declared color pairs, not a claim of browser-computed measurement. Body/recovery text needs at least 4.5:1 and large headings at least 3:1.

## 3. Functional and interaction findings

The supplied validation records broad boundary/data-integrity coverage, actual search/reset and guided-route actions, duplicate comparison recovery, calculator-to-product transfer, edited WhatsApp URL generation, product switching, same-product restore and removal. The controllers support these interactions: selection text is included in the existing form POST; WhatsApp sharing reads the editable textarea; known-product/model normalization bounds transferred records; contact fields are excluded from the selection record; and calculator edits invalidate attached tool selections. Native browsing and specifications remain available without JavaScript. These are reported test results and source corroboration, not independently repeated runtime tests.

**Material failure: inline model-finder edits can retain stale enquiry duty.** In `assets/js/selection.js` lines 74–88, a direct model action begins with `current.inputs` and `current.result`, then replaces them only when the current inline duty is positive. A customer can enter a nominal requirement, choose a model for enquiry, return to the finder, clear it or enter a negative value, and choose another model. The new selection then retains the previous nominal requirement. The WRD correction controller clears its calculated finder value when compressor flow becomes invalid, but this does not clear the already attached record. The invalidation listener at line 92 is limited to tool pages, so it does not repair this product-page sequence. This conclusion comes from source; the supplied runtime evidence does not cover this exact attachment sequence.

## 4. Material fixes, evidence and priority

| ID | Priority | Required fix | Evidence and acceptance |
| --- | --- | --- | --- |
| F1 | P1 | Define foreground colors for every result surface/state. Give match/empty headings and qualification text a legible light foreground on the dark panel; use a light warning foreground for review, or otherwise reach the threshold; give invalid-state text an appropriate dark/error foreground on the pale surface. Keep the state wording and qualification visible. | `assets/css/selection.css:45–48`, `assets/css/pages.css:338–352`, inherited heading color in `base.css`, `calculator-desktop.png`, `tower-invalid-mobile.png`; declared ratios above. Verify match, empty, review and invalid headings/body copy against their actual surfaces and recapture the existing calculator/error views. |
| F2 | P2 | Invalidate an attached inline finder/correction duty after the customer edits its sizing source, including blank, zero and negative inputs. Choosing another catalogue model after invalidation must not silently reuse the prior duty. Distinguish an edited source from an untouched empty finder so an explicitly transferred calculator duty is preserved until changed or removed. | `assets/js/selection.js:74–92` and `assets/js/site.js:125–143,204–211`. Verify both direct nominal finder and WRD correction: valid duty → choose model → clear/invalid edit → choose another model → attachment and WhatsApp text contain no stale duty. Also verify an untouched calculator-to-product transfer still keeps its duty. |

No redesign or additional feature is requested. Apply these two fixes as one batch, rebuild once, and return the same required viewport files with targeted state/sequence verification. Do not run a second detector.

## 5. Disposition

**disposition: fix**

The direction and captured responsive composition hold. F1 and F2 must be resolved before shipping this scope. Return the rebuilt captures and verification evidence to this reviewer for a verdict pass scoring these two fixes as resolved, partial or unresolved. This review does not certify real enquiry delivery, the existing action bar, unshown product ranges, or whole-site accessibility.

### Verdict pass — correction batch 1

8 October 2026. This continuation scores F1 and F2 only. Reviewed the updated `src/site/assets/css/selection.css` and `src/site/assets/js/selection.js`, the finish correction evidence in `customer-selection-validation.md`, and opened the replaced `calculator-desktop.png`, replaced `tower-invalid-mobile.png`, and added `review-mobile.png`. The other reviewed surfaces are unchanged. No browser actions or second detector were run by this reviewer.

| Fix | Score | Evidence |
| --- | --- | --- |
| F1 | **Resolved** | Result headings and qualifications now inherit the light result foreground; review headings use `#f3dd9b`; invalid states explicitly use ink. The recaptures show the formerly missing match heading, legible review heading, and readable invalid recovery paragraph. Supplied browser-computed foreground/background pairs corroborate the source for empty/match body and heading, review qualification, and invalid body/heading. Those measured pairs calculate to **13.30:1** for light text on the dark panel, **12.47:1** for the review heading, and **14.66:1** for invalid-state ink on pale error. All exceed the applicable floor. |
| F2 | **Resolved** | New input/change listeners clear active product-page context when nominal duty, compressor flow or correction factors change. They leave an untouched transferred duty intact. Reported actual WCP and WRD sequences cover valid selection → blank/negative edit → another model, with both attachment and WhatsApp text free of the earlier duty/conditions. The reported calculator-to-product sequence retains 50 LPM, ΔT 5 °C, 15 °C outlet, 40 °C ambient and 4.96 TR when the untouched finder is followed by a different model choice. These runtime results are supplied evidence corroborated by the updated controller, not independently repeated here. |

**disposition: ship**

Both listed material fixes are resolved. This verdict closes the F1/F2 correction list and permits the scoped documentation handoff. It does not broaden the original review or certify real enquiry delivery or whole-site accessibility. The reported post-correction test suite remains passing: 404 Python tests, 16 new Node tests, and existing PDF/viewer regressions.

### F2 persistence amendment verdict

8 October 2026. **F2 remains resolved; disposition: ship.** Reviewed only the `save(record)` amendment in `src/site/assets/js/selection.js` and the supplied reload verification. Saving now synchronizes an already present explicit selection URL only on its matching product page, so URL restoration cannot replace a later model choice with the original transferred model. Reported browser sequence calculator 50 LPM → product → Quote WCP 100 updates both form and URL to WCP 100; reload restores that model with 50 LPM, ΔT 5 °C, 15 °C outlet, 40 °C ambient and 4.96 TR. This evidence corroborates the source change; runtime actions were not independently repeated by this reviewer. The reported rebuilt-output checks pass. No visual change, additional visual review or detector run was involved, and the earlier verdict's scope remains unchanged.
