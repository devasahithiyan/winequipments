# Website improvement roadmap

8 October 2026. Planning audit only; no production implementation or deployment. Local branch baseline: 3932730 (`test`). Prior verified baseline: 109 generated pages, 379 Python tests plus Node reader regressions. No new test run was needed for this documentation-only audit.

## Scope and method

Reviewed source and local browser journeys for homepage, process-chiller product page, product index, chiller calculator and tower calculator. Inspected shared enquiry, specification explorer, navigation/photo controls, chatbot, PHP RFQ handling, build/cache rules, tests and deployment configuration. Desktop visual inspection at normal browser width (~1266px), mobile at 390×844. Previously completed downloads review covers 1440/390/320px. This is a representative audit, not every-page WCAG certification, production mail test or field-performance measurement.

Impeccable audit detector ran once against home/product/products/tool/enquiry templates: zero findings. It could not resolve Jinja stylesheet URLs, so color/custom-property detection was incomplete. Manual source/runtime findings below remain despite that clean scan. No overlay injection or extra server was used. The existing localhost preview was reused.

## Audit assessment

The implementation expresses a coherent product-specific identity: real equipment imagery, self-hosted Archivo, shared tokens, responsive model tables/cards, contextual quote actions and source-backed data. Integrity needs correction where repeated facts and journey state diverge.

| Dimension | Provisional score | Evidence and limits |
| --- | --- | --- |
| Accessibility | 2/4 | Semantic landmarks, labels and focus styles exist. Calculator kW input is unnamed; photo arrows are deliberately hidden from keyboard/assistive navigation. Full AT audit outstanding. |
| Performance | 3/4 | Responsive images and intent-loaded viewers exist; global CSS is ~21KB gzip and site JS ~8KB gzip. This is source-level assessment, not field-vitals certification. |
| Responsive design | 3/4 | Sampled 390px journeys have no page overflow and expose bottom actions. Remaining work is broad 320px, text-resize and keyboard regression coverage. |
| Theming | 3/4 | Coherent token-based light theme; no dark theme requirement. Print palette and root documentation repeat/drift from live tokens. |
| Implementation integrity | 2/4 | Good source-data architecture, but catalogue-only overrides, hard-coded chatbot ranges and incomplete calculator-to-enquiry state create contradictions. |
| Total | 13/20 | Representative code/UX assessment: significant targeted work, not a recommendation to replace the stack. |

## Verified findings

### F1 — P1: Product truth differs across surfaces

Locations: `src/site/catalogue/build_catalogues.py:36`, `src/site/data/products/refrigerated-air-dryers.json:9`, `industrial-process-chillers.json:11`, `src/site/php/api_chat.php:117`, `src/site/templates/pages/home.html:158`, `PRODUCT.md`.

The new PDFs qualify WRD's listed models as 20–2,000 CFM; website cards/metadata and the chatbot still say 10–2,000. WCP page copy says every tank is stainless steel, while its table lists SS / MS for WCP 100–200. The homepage says every product has a full model table, but engineered-to-order entries do not. PRODUCT.md retains older 1–150 TR/10–1,500 TR claims and old source paths.

Impact: a customer can see different answers in the website, brochure and chat. Future changes can reintroduce obsolete data.

Recommendation: move validated editorial corrections into shared product records/helpers without changing source ratings; generate website/PDF/chat summaries from the same records. Distinguish listed standard range from any separately confirmed custom capability. Add consistency regressions and a technical-review status/source register. Resolve founding-year/certification/source-print questions with the owner rather than guessing. Refresh stale product context as an explicit scoped maintenance task.

### F2 — P1: Enquiry success is not tied to durable receipt

Locations: `src/site/php/send_rfq.php:129`, `:174`, `:249`, `:257`; `src/site/assets/js/site.js:248`.

The handler silently continues if CSV opening/writing fails; it logs mail failure but still returns success. Invalid/oversized/failed uploads can be ignored while the overall request succeeds. The browser has no request timeout and accepts a 2xx response without requiring `success === true` or a receipt identifier.

Impact: a customer may be told the request was registered when no durable lead was saved; a drawing may be absent without warning; a stalled request can leave Sending disabled indefinitely. These failure paths were verified by source inspection, not triggered against production.

Recommendation: persist first with checked write/locking and unique receipt; enqueue/retry notifications separately. Return success only for confirmed persistence. Validate each attachment and report actionable errors without losing entered text. Add timeout/retry plus idempotency to prevent duplicate leads after ambiguous network failures. Test in a local PHP harness with mail stubbed and storage failures injected. PHP explicitly notes accepted mail is not proof of delivery: https://www.php.net/manual/en/function.mail.php .

### F3 — P2: Customer attachments need a deliberate access policy

Locations: `src/site/php/send_rfq.php:148–165`, `src/site/htaccess.tpl`, `.cpanel.yml`.

Uploads use randomized public URLs and script-denial rules. The lead CSV is denied by the root htaccess. Existing safeguards should be retained, but a random URL alone does not enforce authorized access to customer drawings. RFQ origins use substring matching; unlike chat, there is no per-IP RFQ rate limit.

Recommendation: decide whether attachments must be private, then use storage outside the public root with authenticated/expiring staff access when required. Add file retention, exact origin allowlist, request-size limits and measured abuse protection. Do not add CAPTCHA to every legitimate enquiry by default. This is a hardening recommendation; no disclosure or exploit was demonstrated.

### F4 — P1: Calculator warnings do not prevent misleading recommendations

Location: `src/site/assets/js/tools.js:73–92`.

Reproduced locally: 30m³/hr, hot 37°C, required cold 32°C, wet bulb 35°C produces -3°C approach but still displays Matching model WCT 050 RL and Quote this model. A warning is shown, yet the positive recommendation remains. The current pick checks heat load and flow; site conditions are not fully applied as a selection engine.

Recommendation: enforce invalid/impossible input rules before choosing a model. Distinguish calculated heat load, preliminary catalogue match and engineer-confirmed selection. Use documented catalogue correction tables only within their approved domain; outside it retain useful heat-load results but replace model recommendation with engineering review. Add boundary/units/reference-condition tests. Wet-bulb basis: US DOE https://betterbuildingssolutioncenter.energy.gov/sites/default/files/resources_BP/Tipsheet%203%20-%20Increase%20Cycles%20of%20Concentration.pdf .

### F5 — P2: Calculator results lose context in enquiries

Locations: `src/site/assets/js/tools.js:13–21`, `src/site/assets/js/site.js:83–97`, `src/site/templates/pages/tool.html`.

Reproduced chiller case: 50LPM, ΔT5°C selects WCP 050. Quote this model sets model WCP 050 and requirement Quotation for WCP 050; Product remains Not sure / need advice. Flow, ΔT, outlet/ambient temperatures and calculation assumptions do not accompany it.

Recommendation: define a small shared selection record: product, model, inputs with units, calculated result, assumptions and source. Use it for calculator → product/model → enquiry → optional user-clicked WhatsApp. Show a short editable summary before sending. Preserve nonpersonal sizing state in URL/session; do not silently retain contact details on shared devices.

### F6 — P1: A few controls need explicit accessible names and behavior

Locations: `src/site/templates/pages/tool.html:46`, `src/site/templates/partials/photo_rail.html:6–8`, `src/site/assets/css/base.css:63`.

Known heat-load input has no associated label; the browser exposes it as an unnamed spinbutton. Photo arrows use tabindex -1 inside aria-hidden navigation and have no names; photo links remain individually keyboard-accessible, so this is not a total photo-access block. Reduced motion uses a global 0.01ms override that warrants checking component states rather than assuming accessibility from a blanket kill switch.

Recommendation: label all inputs/buttons, make arrow navigation intentionally usable or genuinely decorative without interactive controls, and test focus/order/status changes and reduced-motion alternatives. Verify error association, 200% text sizing and all task paths at 320/390/desktop. W3C guidance: https://www.w3.org/WAI/tutorials/forms/notifications/ .

### F7 — P2: Product index requires scanning all 23 entries

Location: `src/site/templates/pages/products.html`.

The index renders 23 cards in three sequential families with no index-level search/filter. Mobile menu already has search; reuse it rather than building a separate incompatible search system.

Recommendation: put family jump links and product/model/application search at the index. Add an optional three-question selection path for visitors who know their plant problem but not the equipment name. Unknown answers should lead to engineer help. Keep browse-all available. Design a real zero-results state.

### F8 — P2: Product-page information order delays technical decisions

Location: `src/site/templates/pages/product.html:57–106`.

The process-chiller page places its 3D section and 14-photo rail before specifications. Section links offer a workaround, but the natural scroll prioritizes exploration over model selection.

Recommendation: retain the illustrative viewer and genuine photos while ordering the primary journey as summary → operating conditions/model finder → selected model → supporting principle/photos/3D → enquiry. Consider comparing two or three models within the same range, with shared units and explicit differences. Mobile should use an accessible comparison view, not a squeezed desktop table. Dedicate separate entry points to service/spares versus new equipment.

### F9 — P2: Automated coverage is stronger for page integrity than customer workflows

Locations: `tests/`, `README.md`, absent `.github/workflows/`, hard-coded Chrome path in `src/site/catalogue/build_catalogues.py`.

Existing tests are valuable: metadata/schema/links/catalogues and viewer helper checks. There is no committed CI workflow or dependency lock/requirements manifest. The PDF generator assumes macOS Chrome; PHP delivery/storage/upload behavior and browser journey regressions are not covered by the existing static tests.

Recommendation: pin development dependencies and provide one documented check command. Configure browser binary portably. CI should build, run Python/Node checks, syntax-check PHP and exercise a small browser flow suite: find model, preserve sizing context, enquiry error/retry, keyboard navigation, viewer ready/error, PDF open/close. Use stubbed mail/isolated temporary storage. Retain canonical/link/SEO checks and source/public synchronization.

### F10 — P2: Build and cache boundaries are broader than necessary

Locations: `src/site/build.py` (~906 lines), `src/site/assets/js/site.js` (~623), `build_css():799–805`, JS hash at `:834`, `src/site/htaccess.tpl:35`.

Every CSS bundle shares one digest; changing downloads CSS invalidates the global CSS URL. The JS digest combines root scripts, causing unrelated pages to receive new JS URLs. The cache FilesMatch excludes .mjs despite the new PDF modules.

Recommendation: extract build/data/image/schema functions and shared client controllers incrementally, preserving vanilla/static architecture. Version assets by individual dependency graph and define .mjs caching consistently. Keep heavy viewer/PDF code loaded on intent. Audit minified generated output as part of runtime tests; avoid a framework migration or large rewrite.

### F11 — P2: Proof and imagery have unresolved quality/ownership gaps

Locations: `CONTENT_TODO.md`, `DESIGN.md`, `PRODUCT.md`, existing assets.

The original logo is 94×53px; clean product photographs and permission-backed case studies are still requested in project notes. Some maintenance notes themselves are stale (e.g. soda-chiller page absence despite a current page).

Recommendation: inventory current assets and claims, obtain a vector logo and consistent product photography, then publish a small number of actual installation stories with consent and verified outcomes. Document current certificate scope accurately. Resolve stale notes explicitly; never fill the gap with invented testimonials, savings, delivery times or specifications.

### F12 — P2: Measure completed journeys and real performance

Locations: `src/site/assets/js/site.js` tracking, `src/site/assets/js/tools.js`, GA4 enabled in site data.

Click intent, finder usage and quote submissions already have events. Calculators lack a deliberate result-to-enquiry funnel, and local asset measurements do not tell us real 4G/device experience. No field measurements were collected in this audit.

Recommendation: define a lean funnel: product found → valid sizing result → selected model → form started → durable receipt; categorize validation/server failures without sending personal details. Separate WhatsApp/download intent from actual completed outcomes. Measure mobile/desktop LCP/INP/CLS at p75; recommended good targets are 2.5s, 200ms and 0.1 respectively, based on https://web.dev/articles/vitals . Set payload budgets after baseline measurement.

## Delivery order and acceptance

1. **Truth and enquiry reliability (F1/F2/F4, plus F6 input names).** Shared facts, safe calculator domains, durable receipt, explicit upload/timeout recovery. Acceptance: no conflicting WRD/WCP summaries; invalid duty cannot show a positive model match; failed persistence cannot return registered; valid saved leads survive mail failure.
2. **Selection to quote (F5/F7/F8).** Shared selection record, product finder, better product-page hierarchy, comparable same-range models, service/spares routing. Acceptance: a customer can find a relevant product and send the exact sizing context without retyping it.
3. **Regression and access hardening (F3/F6/F9).** CI, controlled PHP harness, critical browser flows, accessibility pass, agreed attachment policy. Acceptance: critical workflows fail CI on regression; keyboard/320px/error paths work; production notification delivery is checked separately under owner-authorized testing.
4. **Performance, measurement and proof (F10/F11/F12).** Asset-specific versions, small modular refactors, field baseline, conversion events, real logo/photos/project evidence. Acceptance: results are measured against an explicit baseline; unverified assets/claims are not published.

Maintain existing public URLs, static/Python/Jinja/vanilla stack, genuine imagery and the new catalogues. Treat selected-model comparison and guided discovery as new UX work with a focused brief before implementation. Final visual work ends with an Impeccable polish pass; repeat an audit after fixes rather than judging success from appearance alone.

No P0 blocking condition was established in the sampled local journeys. Verified list: four P1 findings (F1/F2/F4/F6), eight P2 findings/recommendations (F3/F5/F7/F8/F9/F10/F11/F12). Root-context/documentation differences are reported, not repaired by this audit.
