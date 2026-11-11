---
name: Win Equipments
description: An engineering catalogue built around real equipment, catalogue data and direct access to the manufacturer.
colors:
  brand: "#1f6aa8"
  brand-press: "#17558a"
  brand-ink: "#165084"
  brand-wash: "#e8f1f9"
  brand-on-dark: "#8cc6f2"
  focus: "#0f3d66"
  save: "#008810"
  save-ink: "#00700d"
  error: "#b42318"
  error-wash: "#fdeceb"
  paper: "#f5f8fa"
  surface: "#ffffff"
  catalogue-stage: "#e8eff5"
  ink: "#122030"
  ink-2: "#2f3e4e"
  muted: "#526273"
  rule: "#d2dbe3"
  rule-strong: "#96a5b4"
  navy: "#0b1b2c"
  navy-2: "#12304d"
typography:
  display:
    fontFamily: 'Archivo, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: "clamp(2.25rem, 1.3rem + 3.4vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.025em"
  headline:
    fontSize: "clamp(1.75rem, 1.2rem + 2vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  title:
    fontSize: "clamp(1.1875rem, 1.1rem + 0.35vw, 1.375rem)"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.01em"
  lede:
    fontSize: "clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)"
    lineHeight: 1.55
  body:
    fontFamily: 'Archivo, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
    fontSize: "clamp(1rem, 0.96rem + 0.18vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontSize: "0.8125rem"
    fontWeight: 650
    letterSpacing: "0.05em"
  button:
    fontSize: "1rem"
    fontWeight: 650
    lineHeight: 1.2
  nav:
    fontSize: "0.9375rem"
    fontWeight: 550
rounded:
  r-1: "4px"
  r-2: "8px"
  r-3: "12px"
  contact-card: "16px"
  pill: "999px"
spacing:
  s-1: "0.25rem"
  s-2: "0.5rem"
  s-3: "0.75rem"
  s-4: "1rem"
  s-5: "1.25rem"
  s-6: "1.5rem"
  s-8: "2rem"
  s-10: "2.5rem"
  s-12: "3rem"
  s-16: "4rem"
  s-20: "5rem"
  gutter: "clamp(1rem, 0.6rem + 1.8vw, 2rem)"
  section: "clamp(2.75rem, 2.1rem + 3vw, 5rem)"
  masthead: "clamp(1.5rem, 1.1rem + 2vw, 3.25rem)"
  container: "76rem"
  measure: "68ch"
  tap: "48px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.r-1}"
    padding: "0 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.brand-press}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.r-1}"
    padding: "0 1.25rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.r-1}"
    padding: "0 0.75rem"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.r-1}"
    padding: "{spacing.s-3}"
  product-tag:
    backgroundColor: "{colors.brand-wash}"
    textColor: "{colors.brand-ink}"
    rounded: "{rounded.pill}"
    padding: "2px 0.5rem"
  navigation:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.nav}"
    height: "72px"
  navigation-current:
    textColor: "{colors.ink}"
  navigation-parent:
    textColor: "{colors.brand-ink}"
  masthead:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.display}"
  equipment-plate:
    backgroundColor: "{colors.catalogue-stage}"
    rounded: "{rounded.r-3}"
  product-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.r-3}"
  contact-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.contact-card}"
    padding: "{spacing.s-5}"
  equipment-routes:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.surface}"
    rounded: "{rounded.r-3}"
  action-bar:
    backgroundColor: "{colors.surface}"
    height: "57px"
---

# Design System for Win Equipments

## Overview

**Creative North Star: "One engineering catalogue, from the equipment name to the enquiry."**

Win Equipments opens with recognizable machinery and clear names. Cool paper, white panels and left-aligned Archivo give operating conditions, model codes and documentation space to be read. The catalogue and the support pages share the same title rhythm, navigation and controls.

Equipment photography and technical data carry the detail. Win Blue identifies actions, the green Win logo identifies the manufacturer, and plain navy bands group related information.

**Key Characteristics:**

- Catalogue names and real equipment lead each product page.
- Light mastheads, cool equipment plates and fine rules connect the route types.
- Shared navigation order and direct contact actions keep the catalogue usable across screen sizes.

## Colors

### Primary

- **Win Blue** (`brand`) fills the main task button. Press blue (`brand-press`) marks hover, blue ink (`brand-ink`) identifies links and active states on light surfaces, and blue wash (`brand-wash`) marks selected or supporting details.
- **Light Win Blue** (`brand-on-dark`) identifies labels, arrows and selected focus treatments against navy.

### Secondary

- **Win Green** (`save`) belongs to the logo, the “Save Water and Power” identity and success feedback. Deep green (`save-ink`) serves success text. The WhatsApp control retains its own green icon treatment where applicable.

### Neutral

- **Cool Paper** (`paper`) grounds the page, **White** (`surface`) separates cards and fields, and the **Equipment Plate** (`catalogue-stage`) gives product cut-outs a consistent cool backdrop.
- **Ink**, **Secondary Ink** and **Muted Ink** (`ink`, `ink-2`, `muted`) step down from titles to supporting copy and metadata.
- **Rule** (`rule`) divides sections and panels. **Strong Rule** (`rule-strong`) defines outlined controls. **Navy** and **Navy Step** (`navy`, `navy-2`) ground information bands and define divisions and hover states within them.
- **Focus Blue** (`focus`) marks keyboard focus on light surfaces. **Error** and **Error Wash** pair with a visible message for invalid fields.

**The Action Color Rule.** Use filled Win Blue for the leading action in each group. Use an outline or a text link for supporting actions.

## Typography

Self-hosted variable Archivo is used across the site. Use condensed display width (82%) for mastheads and section titles, narrower title width (88%) for component headings, and normal width for body copy. Figures use tabular numerals so ranges and ratings align.

- **Display** (700, line height 1.03) introduces the page. The static home hero has its own display size (`clamp(2.25rem, 1.2rem + 3.5vw, 4.5rem)`) and line height (1.02).
- **Headline** (700, line height 1.02) introduces prominent sections. **Title** (700, line height 1.18) identifies cards and subsections.
- **Lede** (line height 1.55) explains the page or equipment in a short paragraph. **Body** (400, line height 1.6) uses the reading measure (68ch) for longer copy.
- **Label** (650, 0.8125rem) serves compact metadata and short labels. Apply uppercase and 0.05em tracking where the component calls for it.

**The Catalogue Name Rule.** Use the catalogue product name as the product H1. Put the series, application and other qualifiers in the supporting copy, series label or readouts.

## Layout

Use the shared container (76rem), fluid gutters (1–2rem) and the 4px spacing base. Section padding follows the catalogue rhythm (2.75–5rem). Share the title block through `.masthead` in `src/site/assets/css/catalogue.css`. It supplies the heading treatment and default vertical padding (1.5–3.25rem), with local adjustments such as the compact Downloads jump links on mobile.

Stack content by reading order on narrow screens and use shrinkable grid tracks where content sits side by side. The home hero places the introduction and equipment plate side by side at 800px, with the three permanent equipment links across the row below. On narrow screens the links follow the introduction, then the plate. Product detail keeps the catalogue heading, lede and link to rating conditions together, followed by the machine and key specifications on mobile. Tables with many columns scroll inside their own container.

The main navigation switches at 1024px. Below it, the bottom bar accounts for the safe area and reserves space below the page content. Use the same destination order on desktop and mobile. The viewport review covered nine route types at 1440px and 390px, plus home, product and Downloads at 320px. Those 21 samples had zero page-level horizontal overflow. WCAG AA remains the product requirement. Conformance requires a separate assessment.

## Elevation & Depth

Cool surfaces, rules and simple borders define the catalogue layers. Keep equipment plates, contact cards and the sticky header flat. Use solid navy for information bands, including the home equipment links and enquiry section. Product cards mark hover with a blue border. Save the small shadow for interactive feedback and the larger shadow for overlays. The fixed action bar has a shallow upward shadow to separate it from the page.

Use the standard ease-out curve for short state changes. Keep the home introduction static. User-operated model and photo viewers can show motion in response to input, and nonessential transitions honor reduced-motion preferences.

**The Surface Rule.** Separate adjacent content with a change in surface or a fine rule. Use elevation when an element sits above the page or responds to interaction.

## Shapes

Use compact corners (4px) on buttons and inputs, medium corners (8px) on small media and outlined service shortcuts, and panel corners (12px) on equipment plates and product cards. The contact channel cards use 16px corners. Use pill geometry for small tags. Give equipment imagery enough room to show the full machine. Product and family plates hold contained cut-outs. Service photographs use an intentional crop.

## Components

### Buttons and fields

The filled primary button uses Win Blue with white text and a darker blue on hover or press. The secondary button uses white, ink and a strong outline. The ghost variant gives low-emphasis controls a transparent surface. Standard buttons and inputs have a 48px minimum height. Inputs use a white surface, a 1px outline, a persistent label and an adjacent error message when validation fails. Use the 3px focus outline, adapting its color on navy so the focus remains visible.

### Navigation and contact

The sticky white header has a fine bottom rule. Products, Industries, Sizing tools, Downloads, Service & repair and About appear in the same order on desktop and in the mobile menu. Desktop has a contextual primary action beside those links. Mobile has a call icon and Menu button in the header, with product search and equipment-family lists in the sheet. A blue underline identifies the current desktop route or parent section. The menu marks the same state in blue type.

The mobile bottom bar contains a flexible primary quote, document or service action and two 48px-wide, 44px-high WhatsApp and call controls with accessible names. It gives way to the enquiry, footer and active fields. The equipment assistant opens from a footer control. Contact uses white cards for the actual channels, including WhatsApp.

### Equipment plates, product cards and tags

Use the authentic machine cut-out on the cool plate and keep the range or series text close to the image. The home figure has a white caption strip with a direct product link and the catalogue range. Product cards combine the plate, product name, range and descriptive link text in one panel. Match tags use blue ink on blue wash. Search and family filters lead the equipment index. Sizing, model comparison, rating conditions and downloadable references remain easy to reach from equipment routes.

### Static hero, equipment links and service

The home hero names air dryers, chillers and cooling towers in the heading, gives Browse equipment the filled action and keeps the real WCP chiller in view. The navy strip presents three permanent links by equipment and job. Each row has a descriptive title, short duty line and arrow. It changes from stacked rows to three columns at 800px.

The service masthead stays light, pairing the request action with the option to send a fault photo. A real service photo and a white checklist sit together in the media column. Downloads, articles and calculators share the title rhythm while retaining the layouts their tasks require.

## Do's and Don'ts

### Do

- **Do** use real Win equipment cut-outs and factory photography.
- **Do** present catalogue values with units and their operating or rating conditions.
- **Do** preserve the shared navigation order, visible focus and direct paths to sizing, documents and enquiry.
- **Do** check the narrow layouts with real product names, tables and enquiry controls.

### Don't

- **Don't** add rotating hero panels, decorative grid effects or background video to the catalogue entrance.
- **Don't** substitute stock or generated factory and equipment imagery for authentic assets.
- **Don't** put the equipment assistant in the fixed action bar.

Implementation sources are `src/site/assets/css/tokens.css` for shared primitives, `src/site/assets/css/catalogue.css` for catalogue overrides, and `src/site/templates/` for the component markup. `Reports/ux/beta-redesign.md` records the Beta verification.
