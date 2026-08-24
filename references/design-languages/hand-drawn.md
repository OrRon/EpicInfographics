# Hand-Drawn — the marker sketchbook

## Mood & when to use

A smart explainer sketched on good paper with markers: wobbly ink lines,
crayon-textured fills that escape their outlines, handwritten asides,
tape and doodle arrows. Friendly, human, disarming — for how-tos, food,
plants, habits, kids/education, personal finance. Don't use it when
authority or precision is the point.

**Composition note:** hand-drawn hates grids. Default to **Big Object**
or **Specimen sheet** with organic scatter — items sit slightly rotated
(±1.5°) at uneven spacing, tied together by drawn arrows and washi strips.

## Palette

| Role | Hex | Notes |
|---|---|---|
| `--bg` | `#FDFBF4` | notebook paper |
| `--surface` | `#F4EFDF` | washi tape, sticky notes |
| `--surface-2` | `#E9E2CC` | unfilled cells, tracks |
| `--ink` | `#2E2A25` | warm marker black |
| `--ink-muted` | `#7A7365` | pencil gray |
| `--chart-1` | `#E4573D` | crayon red |
| `--chart-2` | `#3E7CC1` | crayon blue |
| `--chart-3` | `#57A15A` | crayon green |
| `--chart-4` | `#9268B8` | crayon purple |
| `--de-emphasis` | `#C9C2AE` | context marks |

Slots fully validated (CVD-safe, ≥3:1). Fills render as **crayon texture**:
the slot color at ~85% opacity with the rough-edge filter, deliberately
offset 2–3px from its outline (color outside the lines = the charm).

## Typography

```html
<link href="https://fonts.googleapis.com/css2?family=Shantell+Sans:ital,wght@0,500;0,700;0,800;1,500&family=Caveat:wght@600;700&display=swap" rel="stylesheet">
```

- Display & body: **Shantell Sans** (500 body, 700/800 display) — casual
  but genuinely legible.
- Asides/annotations: **Caveat** 600/700 (real handwriting feel) — for
  margin notes, arrow labels, "seriously!" interjections. Never for data
  values.
- Scale (1080px canvas): title 60–76px Shantell 800 · section 24px 700 ·
  body 17px 500 · asides 22–26px Caveat · caption 13px. Hero number
  110–160px Shantell 800.
- Underlines are drawn: a 6px wobbly SVG stroke under key words, in a
  crayon color.

## Geometry & spacing

- No straight lines: **every** structural line, box, and divider is an SVG
  path with the wobble filter
  (`feTurbulence baseFrequency="0.035" numOctaves="3"` +
  `feDisplacementMap scale="4"`) — define the filter once, reuse via
  `filter="url(#wobble)"`.
- Boxes: 2.5–3px ink outlines, imperfect corners (slight overshoot at
  joins reads hand-inked); NO css border-radius aesthetics — the wobble is
  the radius.
- Scatter: items rotate between −1.5° and 1.5° (vary per item, never
  uniform); spacing uneven by design but optically balanced.
- Depth: none — paper is flat. Emphasis via circling, underlining, arrows.

## Chart styling

- Bars: wobble-outlined rects with offset crayon fills; ≤ 28px; values
  written at the end in Shantell 700.
- Lines: 3px wobbled path; points are hand-drawn ✗ or ● marks (drawn, 10px).
- Donut → drawn as a "cookie chart": wobbly circle with bite-segments; or
  prefer icon armies of doodled objects (drawn, never emoji).
- Axes: single wobbled baseline; no gridlines ever; annotations point with
  curved doodle arrows.

## Signature devices

1. **The wobble filter** on all linework (define once in a hidden SVG).
2. **Washi tape**: `--surface` strips (rotated 3–6°, 55% opacity, torn
   ends via clip-path polygon) "holding" elements to the page.
3. **Doodle arrows**: curved 3px paths with hand-drawn heads, connecting
   an aside (in Caveat) to the thing it comments on.
4. **Circled emphasis**: one key number circled in a crayon-color wobbly
   ellipse drawn slightly too big.
5. **Margin scribbles**: tiny drawn stars/sparks/underlines in crayon
   colors — max 4 per canvas.

## Do / Don't

- **Do** write asides in first person ("this one surprised us").
- **Do** let fills miss their outlines by a few px, consistently.
- **Do** vary rotation per item — uniform tilt reads mechanical.
- **Don't** mix straight CSS borders with wobbled lines (all or nothing).
- **Don't** use shadows, gradients, or any glossy device.
- **Don't** let Caveat carry data values or labels (Shantell only).
- **Don't** use more than 2 crayon colors per zone — kids' menu otherwise.

## CSS tokens

```css
:root {
  --bg:#FDFBF4; --surface:#F4EFDF; --surface-2:#E9E2CC;
  --ink:#2E2A25; --ink-muted:#7A7365;
  --chart-1:#E4573D; --chart-2:#3E7CC1; --chart-3:#57A15A; --chart-4:#9268B8;
  --de-emphasis:#C9C2AE;
  --font-display:'Shantell Sans',cursive; --font-body:'Shantell Sans',cursive;
  --font-aside:'Caveat',cursive;
  --space-1:8px; --space-2:16px; --space-3:24px; --space-4:40px; --space-5:64px;
}
body { font-family:var(--font-body); font-weight:500; color:var(--ink); background:var(--bg); }
h1,.display { font-weight:800; line-height:1; }
.aside { font-family:var(--font-aside); font-weight:600; font-size:24px; color:var(--ink); }
/* define once in the HTML:
<svg width="0" height="0"><filter id="wobble">
  <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="4"/>
</filter></svg>  */
```
