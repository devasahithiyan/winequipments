# Win Equipments design system

**Direction:** a calm, credible industrial look built around the equipment itself.
- Neutral paper and white, navy for dark bands, and one action colour: Win Blue, the paint on our machines.
- Real product cut-outs and real factory photos. No stock imagery and no AI imagery.
- Engineering data (charts, tables, ratings) presented as a feature, not hidden.

Tokens live in `src/site/assets/css/tokens.css`. Change a value there, never a hard-coded copy.

## Why it looks this way (principles → rules, Oct 2026)
These rules come from established usability research, not from copying any one company's site.
| Principle | Rule |
| --- | --- |
| Aesthetic-usability effect; Stanford web-credibility research (design look is the top credibility cue; show the real organisation) | One type scale, one palette, one card style; address, phone, ISO and founder always visible (utility bar, footer) |
| Jakob's law | Conventional layout: logo left, nav, quote button right, footer sitemap, bottom action bar on phones |
| Hick's law | Main nav of six items; a four-goal "How can we help?" row; product lists capped before "All products" |
| Von Restorff effect | Filled Win Blue only on the primary action; one primary button per view |
| Serial position effect | Pages open with what we make and the quote action, and close with the enquiry form |
| F-pattern / layer-cake scanning (NN/g) | Left-aligned, descriptive headings with front-loaded words; short ledes; no centred paragraphs |
| Gestalt proximity and common region | Light sections alternate paper and white; related items share a card |
| Chunking / progressive disclosure | Groups of three or four; long lists collapse on phones |
| Fitts's law / thumb zone | 48 px targets; main actions in the bottom bar on phones; full-width buttons on phones |
| 60-30-10 colour balance | Mostly neutral, navy and ink for structure, Win Blue as the small accent |
| Carousel research | Nothing auto-advances; the hero machines change only on tap or swipe |
| WCAG 2.2 AA | Every text pair is at least 4.5:1 (checked: lowest is Win Green on white at 4.64:1) |

## Principles
1. **Facts are the design.** Every figure on a page comes from the catalogue data (`src/site/data`). If a number isn't real, the layout has no slot for it.
2. **One primary action per view.** Filled Win Blue buttons are reserved for quote and recommendation actions. Everything else is secondary (outlined) or a text link.
3. **Mobile first.** Design at 360 px, then widen. There is no horizontal page scroll at any width from 320 to 1440 px; wide tables scroll inside their own box.
4. **Product on a stage.** Cut-outs sit on a soft white radial "stage" with a faint chart-paper grid and a floor shadow (`studio()` in `build.py` cleans the cut-outs).
5. **Motion explains, then gets out of the way.** Reveal on scroll, small hover lifts, and nothing that loops loudly. All ambient motion is off under `prefers-reduced-motion`. Most motion is plain CSS (`motion.css`) and `site.js`. The homepage adds scroll-linked hero depth and spring entrances with [Motion](https://motion.dev) (`assets/js/home-motion.js`). Motion itself is vendored at `assets/js/vendor/motion.min.js` and loaded only after the page is idle, so it never delays first paint. Use it only where CSS can't do the job.

## Colour
| Token | Value | Use |
| --- | --- | --- |
| `--paper` / `--surface` | #f5f8fa / #ffffff | Page background / cards and alternate light bands |
| `--ink` / `--ink-2` | #122030 / #2f3e4e | Headings / body text |
| `--muted` | #526273 | Captions, metadata |
| `--rule` / `--rule-strong` | #d2dbe3 / #96a5b4 | Hairlines, borders |
| `--brand` (Win Blue) | #1f6aa8 | The only action colour: filled buttons, links, active states |
| `--brand-ink` / `--brand-wash` | #165084 / #e8f1f9 | Blue text on light / icon tiles, hover tints |
| `--navy` / `--navy-2` | #0b1b2c / #12304d | Dark bands (`--band-dark`), utility bar, hero shade |
| `--brand-on-dark` | #8cc6f2 | Labels and accents on navy |
| `--save` (Win Green) | #008810 | Logo and the "Save Water and Power" slogan only |
| `--star` | #e8a317 | The rating star only |
| `--hot` | #b4432a | Chart hot points only |

`--flow` is kept for old references and now resolves to solid Win Blue; the blue-to-green gradient is retired. Dark bands are limited to the hero, one feature band and the enquiry form.

## Type
- **Archivo** (variable, self-hosted in `assets/fonts`), using two widths only:
  - `--wdth-display` (82%) for hero, page and section headings, line height about 1.02;
  - `--wdth-head` (88%) for card and component titles;
  - body at 100% width, 1.6 line height, max `--measure` (68ch).
- **Scale (tokens, not per-section clamps):** `--fs-display` hero and page H1; `--fs-section` every section H2; `--fs-h3` card titles; body 1–1.0625rem; small 0.875rem; label 0.8125rem.
- **Section label:** `.sh-eyebrow` (13 px uppercase, Win Blue, 28 px solid rule); add `.sh-eyebrow--dark` on navy.
- Numbers use `font-variant-numeric: tabular-nums` in tables and readouts.

## Space, shape, depth
- **Spacing:** 4 px scale `--s-1`…`--s-20`. Vertical rhythm between sections is `--section`, and the side gutter is `--gutter`.
- **Radii:** `--r-2` (8 px) for controls and thumbnails, `--r-3` (12 px) for cards and panels, and pills (999px) for tags and chips.
- **Shadows:** `--shadow-1` for hover and resting cards, `--shadow-2` for floating badges and panels. No heavy drop shadows.
- **Tap targets:** at least 44–48 px.

## Layout
- The container is 76rem, and grids use `minmax(0, 1fr)` so content can never blow out the width.
- **Utility bar (desktop):** navy strip above the header with ISO, founding year, location, phone, WhatsApp, email, Downloads and Certifications. It scrolls away; the header stays.
- **Header:** sticky; it turns solid after scrolling. Six nav items plus Request a quote. The Products mega menu has thumbnails, family counts and a sizing-tools panel.
- **Mobile:** the action bar (Quote · WhatsApp · Call · AI) is the only floating layer below 1024 px; the separate AI pill and back-to-top button are hidden there.

## Components (where to find them)
| Component | Template / CSS |
| --- | --- |
| Buttons (`.btn--primary`, `--secondary`, `--lg`) | `components.css` |
| Section heading (`.h-head`, `.section-head`) | `sections.css`, `pages.css` |
| Product card (`.pcard`) | `macros.html` → `pages.css` |
| Readout (key specs) | `macros.html` |
| Spec explorer (mobile list + desktop table + finder) | `partials/spec_explorer.html` |
| Photo rail + lightbox | `partials/photo_rail.html`, `components.css`, `site.js` |
| 360° chiller (CSS 3D) | `partials/chiller360.html`, `chiller360.css`, `chiller360.js` |
| Photo walk-around | `partials/photo_spin.html`, `spin.js` |
| Dew-point and tower charts (SVG, computed) | `dew_chart()` etc. in `build.py`, `chart.css` |
| FAQ (details/summary) | `macros.html` |
| Enquiry form | `partials/enquiry.html` |
| AI chat | `assets/js/chat.js`, `chat.css`, `php/api_chat.php` |
| Calculators | `pages/tool.html`, `assets/js/tools.js` |

## CSS bundles
- `site.css`, on every page:
  - tokens, base, layout, components, chart, pages, sections, chat and motion.
- `home.css`: homepage only.
- `viewer.css`: pages with the 3D chiller or the photo walk-around.

Files are cache-busted by a content hash (`css_ver`, `js_ver`).

## Motion
| Pattern | Rule |
| --- | --- |
| Reveal | `[data-reveal]` fades and rises 28 px once in view; `--d` staggers by 90 ms |
| Intro | `[data-intro]` on hero elements; `[data-split]` raises headline words in sequence |
| Hover | Buttons lift 1 px, cards 3 px, thumbnails scale 1.03–1.06, arrows slide 3–4 px |
| Menus | Mega menu slides down 8 px; columns stagger by 50 ms |
| Ambient | Slow photo crossfade behind the hero until the works film plays; nothing else loops. The hero machines never auto-advance |
| Progress | Article reading line (scroll timeline); tool and chat states |
| Easing | `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`), 0.2–0.9 s |

`.motion` is added to `<html>` only when JavaScript runs, motion isn't reduced and the URL has no `?static`. Use `?static=1` for screenshots.

## Imagery
- **Product cut-outs:** `images/Products/*.png`, cleaned by `studio()`.
- **Real photos:** `images/works/`, captioned in `data/photos.json`. Use real photos only, cropped and never staged.
- **Client logos:** greyscale until hover.
- **Never use:** AI-generated images, stock factories, or holograms.

## Accessibility
- Text contrast is AA or better for every token pair used for text. Small green text uses `--save-ink`.
- Visible focus: a 3 px `--focus` outline.
- One H1 per page; headings stay in order.
- Every image has alt text; decorative images use `alt=""`.
- Interactive widgets (tabs, 360, walk-around, lightbox) support the keyboard and set ARIA states.
