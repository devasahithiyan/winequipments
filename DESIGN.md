# Win Equipments design system

**Direction:** a refined, light, industrial look built around the equipment itself.
- Calm off-white paper, near-black green ink, and one brand green used for action.
- Real product cut-outs and real factory photos. No stock imagery and no AI imagery.
- Engineering data (charts, tables, ratings) presented as a feature, not hidden.

Tokens live in `src/site/assets/css/tokens.css`. Change a value there, never a hard-coded copy.

## Principles
1. **Facts are the design.** Every figure on a page comes from the catalogue data (`src/site/data`). If a number isn't real, the layout has no slot for it.
2. **One primary action per view.** Green filled buttons are reserved for quote and recommendation actions. Everything else is secondary (outlined) or a text link.
3. **Mobile first.** Design at 360 px, then widen. There is no horizontal page scroll at any width from 320 to 1440 px; wide tables scroll inside their own box.
4. **Product on a stage.** Cut-outs sit on a soft white radial "stage" with a faint chart-paper grid and a floor shadow (`studio()` in `build.py` cleans the cut-outs).
5. **Motion explains, then gets out of the way.** Reveal on scroll, small hover lifts, and nothing that loops loudly. All ambient motion is off under `prefers-reduced-motion`.

## Colour
| Token | Value | Use |
| --- | --- | --- |
| `--paper` | #f6f7f3 | Page background |
| `--surface` | #ffffff | Cards, panels, tables |
| `--ink` | #15201a | Headings, dark bands, primary text |
| `--ink-2` | #33403a | Body text |
| `--muted` | #56625b | Labels, captions, metadata |
| `--rule` / `--rule-strong` | #d3d9d4 / #9aa59e | Hairlines, borders |
| `--green` | #008810 | Primary buttons, accents, progress |
| `--green-ink` | #00700d | Green text on light backgrounds (AA contrast) |
| `--green-wash` / `#eef6ef` | | Hover tints, icon tiles |
| `--blue` | #1d4e89 | Charts (saturation curve), focus ring |
| `--hot` | #b4432a | Chart hot points only |

Dark bands (the numbers strip, the footer, tool results) use `--ink` with `#c9d3cc` text.

## Type
- **Archivo** (variable, self-hosted in `assets/fonts`), using `font-stretch` for character.
  - **Display and section headings:** 70–74% width, tight 0.97–1.04 line height, −0.02em tracking.
  - **Card and component titles:** 80–90% width.
  - **Body:** 100% width, 1.6 line height, max `--measure` (68ch).
- **Scale:**
  - hero 2.5–5rem;
  - section headings (`.h-head h2`) 2–3.75rem;
  - page headings 1.875–3rem;
  - body 1–1.0625rem;
  - small 0.875rem;
  - label 0.8125rem.
- Numbers use `font-variant-numeric: tabular-nums` in tables and readouts.

## Space, shape, depth
- **Spacing:** 4 px scale `--s-1`…`--s-20`. Vertical rhythm between sections is `--section`, and the side gutter is `--gutter`.
- **Radii:** `--r-2` (8 px) for controls and thumbnails, `--r-3` (12 px) for cards and panels, and pills (999px) for tags and chips.
- **Shadows:** `--shadow-1` for hover and resting cards, `--shadow-2` for floating badges and panels. No heavy drop shadows.
- **Tap targets:** at least 44–48 px.

## Layout
- The container is 76rem, and grids use `minmax(0, 1fr)` so content can never blow out the width.
- **Header:** sticky; it turns solid after scrolling. The Products mega menu has thumbnails, family counts and a sizing-tools panel.
- **Mobile:** the action bar (Quote · WhatsApp · Call) appears once the hero buttons scroll away. The AI chat launcher sits above it.

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
| Ambient | Hero cut-outs and About badges float ±5 px over 7 s |
| Progress | Article reading line (scroll timeline); tool and chat states |
| Easing | `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`), 0.2–0.9 s |

`.motion` is added to `<html>` only when JavaScript runs, motion isn't reduced and the URL has no `?static`. Use `?static=1` for screenshots.

## Imagery
- **Product cut-outs:** `images/Products/*.png`, cleaned by `studio()`.
- **Real photos:** `images/works/`, captioned in `data/photos.json`. Use real photos only, cropped and never staged.
- **Client logos:** greyscale until hover.
- **Never use:** AI-generated images, stock factories, or holograms.

## Accessibility
- Text contrast is AA or better. Use green text only as `--green-ink`.
- Visible focus: a 3 px `--focus` outline.
- One H1 per page; headings stay in order.
- Every image has alt text; decorative images use `alt=""`.
- Interactive widgets (tabs, 360, walk-around, lightbox) support the keyboard and set ARIA states.
